const express = require('express');
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const auth = require('../middleware/auth');

const router = express.Router();
const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-key-change-me';

// POST /api/admin/login — Login admin and return JWT
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required' });
    }

    const admin = await prisma.admin.findUnique({
      where: { username: username.trim() },
    });

    if (!admin) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    const token = jwt.sign(
      { id: admin.id, username: admin.username },
      JWT_SECRET,
      { expiresIn: '2h' }
    );

    res.json({ token, username: admin.username });
  } catch (err) {
    console.error('Admin login error:', err);
    res.status(500).json({ error: 'Internal server error during login' });
  }
});

// GET /api/admin/summary — Get statistics for the dashboard
router.get('/summary', auth, async (req, res) => {
  try {
    const totalQuestions = await prisma.question.count();
    const totalCandidates = await prisma.candidate.count();
    
    const attempts = await prisma.examAttempt.findMany({
      select: {
        status: true,
      },
    });

    const completedAttempts = attempts.filter((a) => a.status === 'submitted').length;
    const activeAttempts = attempts.filter((a) => a.status === 'in-progress').length;

    res.json({
      totalQuestions,
      totalCandidates,
      completedAttempts,
      activeAttempts,
    });
  } catch (err) {
    console.error('Summary error:', err);
    res.status(500).json({ error: 'Failed to fetch summary metrics' });
  }
});

// POST /api/admin/upload-questions — Protected route to clear & upload questions
router.post('/upload-questions', auth, async (req, res) => {
  try {
    const { questions } = req.body;

    if (!Array.isArray(questions)) {
      return res.status(400).json({ error: 'Payload must contain a "questions" array' });
    }

    if (questions.length === 0) {
      return res.status(400).json({ error: 'Questions array cannot be empty' });
    }

    // Normalize and validate questions
    const normalizedQuestions = [];
    for (let idx = 0; idx < questions.length; idx++) {
      const q = questions[idx];
      const questionText = q.question || q.questionText;
      const correctOption = q.answer !== undefined ? q.answer : q.correctOption;
      const options = q.options || [];
      const subject = q.subject || 'Physics';
      const topic = q.topic || 'General';
      const diagramType = q.diagramType || null;
      const diagramSvg = q.diagramSvg || null;

      if (!questionText || typeof questionText !== 'string') {
        return res.status(400).json({ error: `Question at index ${idx} is missing a valid question text` });
      }
      if (!Array.isArray(options) || options.length < 2) {
        return res.status(400).json({ error: `Question at index ${idx} must have at least 2 options` });
      }
      if (correctOption === undefined || typeof correctOption !== 'number' || correctOption < 1 || correctOption > options.length) {
        return res.status(400).json({ error: `Question at index ${idx} has an invalid answer index ${correctOption} (must be 1-based index between 1 and ${options.length})` });
      }

      normalizedQuestions.push({
        id: q.id || null,
        questionText,
        options,
        correctOption,
        subject,
        topic,
        diagramType,
        diagramSvg,
      });
    }

    // Run the deletion and creation in a Prisma transaction
    await prisma.$transaction(async (tx) => {
      // 1) Delete all response data
      await tx.response.deleteMany();
      // 2) Delete all exam attempts
      await tx.examAttempt.deleteMany();
      // 3) Delete all candidates
      await tx.candidate.deleteMany();
      // 4) Delete all options
      await tx.option.deleteMany();
      // 5) Delete all questions
      await tx.question.deleteMany();

      // 6) Create new questions and options
      for (const q of normalizedQuestions) {
        await tx.question.create({
          data: {
            id: q.id || undefined,
            subject: q.subject,
            topic: q.topic,
            questionText: q.questionText,
            diagramType: q.diagramType,
            diagramSvg: q.diagramSvg,
            correctOption: q.correctOption,
            options: {
              create: q.options.map((text, idx) => ({
                optionNumber: idx + 1,
                optionText: text,
              })),
            },
          },
        });
      }
    });

    res.json({
      success: true,
      message: `Successfully uploaded ${normalizedQuestions.length} questions. All previous candidate records and attempts have been cleared.`,
    });
  } catch (err) {
    console.error('Upload questions error:', err);
    res.status(500).json({ error: 'Failed to upload questions', details: err.message });
  }
});

// GET /api/admin/results — Fetch all student results & metrics
router.get('/results', auth, async (req, res) => {
  try {
    const candidates = await prisma.candidate.findMany({
      include: {
        attempts: {
          include: {
            responses: {
              include: {
                question: {
                  include: {
                    options: { orderBy: { optionNumber: 'asc' } }
                  }
                }
              }
            }
          },
          orderBy: { startedAt: 'desc' }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    const totalQuestions = await prisma.question.count();

    const results = candidates.map(c => {
      if (c.attempts.length === 0) {
        return {
          id: c.id,
          name: c.name,
          rollNumber: c.rollNumber,
          examSet: c.examSet,
          createdAt: c.createdAt,
          attempts: []
        };
      }

      const attemptsMapped = c.attempts.map(a => {
        let correct = 0;
        let incorrect = 0;
        let unanswered = 0;
        let score = 0;

        for (const r of a.responses) {
          if (r.status === 'answered' || r.status === 'answered-marked') {
            if (r.selectedOption === r.question.correctOption) {
              correct++;
              score += 4;
            } else if (r.selectedOption !== null && r.selectedOption !== undefined) {
              incorrect++;
              score -= 1;
            } else {
              unanswered++;
            }
          } else {
            unanswered++;
          }
        }

        // Account for questions not present in responses at all as unanswered
        const responseQuestionIds = new Set(a.responses.map(r => r.questionId));
        const missingQuestionsCount = Math.max(0, totalQuestions - responseQuestionIds.size);
        unanswered += missingQuestionsCount;

        const maxScore = totalQuestions * 4;
        const accuracy = (correct + incorrect) > 0 
          ? Math.round((correct / (correct + incorrect)) * 100) 
          : 0;

        return {
          id: a.id,
          startedAt: a.startedAt,
          submittedAt: a.submittedAt,
          timeTakenSecs: a.timeTakenSecs,
          status: a.status,
          totalAnswered: a.totalAnswered,
          totalMarkedReview: a.totalMarkedReview,
          totalNotAnswered: unanswered,
          correct,
          incorrect,
          score,
          maxScore,
          accuracy,
          responses: a.responses.map(r => ({
            id: r.id,
            questionId: r.questionId,
            selectedOption: r.selectedOption,
            status: r.status,
            correctOption: r.question.correctOption,
            topic: r.question.topic,
            subject: r.question.subject,
            questionText: r.question.questionText,
            options: r.question.options.map(o => o.optionText)
          }))
        };
      });

      return {
        id: c.id,
        name: c.name,
        rollNumber: c.rollNumber,
        examSet: c.examSet,
        createdAt: c.createdAt,
        attempts: attemptsMapped
      };
    });

    res.json(results);
  } catch (err) {
    console.error('Fetch student results error:', err);
    res.status(500).json({ error: 'Failed to fetch student results report' });
  }
});

// DELETE /api/admin/attempts/:id — Delete an exam attempt and candidate record if no other attempts exist
router.delete('/attempts/:id', auth, async (req, res) => {
  try {
    const attemptId = parseInt(req.params.id, 10);
    if (isNaN(attemptId)) {
      return res.status(400).json({ error: 'Invalid attempt id' });
    }

    const attempt = await prisma.examAttempt.findUnique({
      where: { id: attemptId }
    });

    if (!attempt) {
      return res.status(404).json({ error: 'Attempt not found' });
    }

    const candidateId = attempt.candidateId;

    await prisma.$transaction(async (tx) => {
      // Delete attempt (responses are deleted via cascade FK onDelete)
      await tx.examAttempt.delete({
        where: { id: attemptId }
      });

      // Count remaining attempts for the candidate
      const count = await tx.examAttempt.count({
        where: { candidateId }
      });

      // If no attempts left, delete the candidate too
      if (count === 0) {
        await tx.candidate.delete({
          where: { id: candidateId }
        });
      }
    });

    res.json({ success: true, message: 'Attempt and candidate records deleted successfully.' });
  } catch (err) {
    console.error('Delete attempt error:', err);
    res.status(500).json({ error: 'Failed to delete exam attempt' });
  }
});

module.exports = router;
