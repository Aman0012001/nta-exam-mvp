'use strict';

const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const auth = require('../middleware/auth');
const prisma = require('../prisma');

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-key-change-me';

// ── POST /api/admin/login ───────────────────────────────────────────────────
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required' });
    }

    // Normalize username: trim whitespace and lowercase
    const normalizedUsername = username.trim().toLowerCase();

    const admin = await prisma.admin.findUnique({
      where: { username: normalizedUsername },
    });

    if (!admin) {
      console.warn(`[auth] Login failed — user not found: "${normalizedUsername}"`);
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      console.warn(`[auth] Login failed — wrong password for: "${normalizedUsername}"`);
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    const token = jwt.sign(
      { id: admin.id, username: admin.username },
      JWT_SECRET,
      { expiresIn: '8h' }
    );

    console.log(`[auth] ✅ Admin "${admin.username}" authenticated successfully`);
    return res.json({ token, username: admin.username });
  } catch (err) {
    console.error('[auth] Login error:', err);
    return res.status(500).json({ error: 'Internal server error during login' });
  }
});

// ── GET /api/admin/summary ──────────────────────────────────────────────────
router.get('/summary', auth, async (req, res) => {
  try {
    const totalQuestions = await prisma.question.count();
    const totalCandidates = await prisma.candidate.count();

    const attempts = await prisma.examAttempt.findMany({
      select: { status: true },
    });

    const completedAttempts = attempts.filter((a) => a.status === 'submitted').length;
    const activeAttempts = attempts.filter((a) => a.status === 'in-progress').length;

    return res.json({ totalQuestions, totalCandidates, completedAttempts, activeAttempts });
  } catch (err) {
    console.error('Summary error:', err);
    return res.status(500).json({ error: 'Failed to fetch summary metrics' });
  }
});

// ── POST /api/admin/upload-questions ───────────────────────────────────────
router.post('/upload-questions', auth, async (req, res) => {
  try {
    const { questions } = req.body;

    if (!Array.isArray(questions)) {
      return res.status(400).json({ error: 'Payload must contain a "questions" array' });
    }
    if (questions.length === 0) {
      return res.status(400).json({ error: 'Questions array cannot be empty' });
    }

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
        return res.status(400).json({ error: `Question at index ${idx} is missing valid question text` });
      }
      if (!Array.isArray(options) || options.length < 2) {
        return res.status(400).json({ error: `Question at index ${idx} must have at least 2 options` });
      }
      if (
        correctOption === undefined ||
        typeof correctOption !== 'number' ||
        correctOption < 1 ||
        correctOption > options.length
      ) {
        return res.status(400).json({
          error: `Question at index ${idx} has invalid answer index ${correctOption} (must be 1-based, 1–${options.length})`,
        });
      }

      normalizedQuestions.push({ id: q.id || null, questionText, options, correctOption, subject, topic, diagramType, diagramSvg });
    }

    await prisma.$transaction(async (tx) => {
      await tx.response.deleteMany();
      await tx.examAttempt.deleteMany();
      await tx.candidate.deleteMany();
      await tx.option.deleteMany();
      await tx.question.deleteMany();

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

    return res.json({
      success: true,
      message: `Successfully uploaded ${normalizedQuestions.length} questions.`,
    });
  } catch (err) {
    console.error('Upload questions error:', err);
    return res.status(500).json({ error: 'Failed to upload questions', details: err.message });
  }
});

// ── GET /api/admin/results ──────────────────────────────────────────────────
router.get('/results', auth, async (req, res) => {
  try {
    const candidates = await prisma.candidate.findMany({
      include: {
        attempts: {
          include: {
            responses: {
              include: {
                question: {
                  include: { options: { orderBy: { optionNumber: 'asc' } } },
                },
              },
            },
          },
          orderBy: { startedAt: 'desc' },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    const totalQuestions = await prisma.question.count();

    const results = candidates.map((c) => {
      if (c.attempts.length === 0) {
        return { id: c.id, name: c.name, rollNumber: c.rollNumber, examSet: c.examSet, createdAt: c.createdAt, attempts: [] };
      }

      const attemptsMapped = c.attempts.map((a) => {
        let correct = 0, incorrect = 0, unanswered = 0, score = 0;

        for (const r of a.responses) {
          if (r.status === 'answered' || r.status === 'answered-marked') {
            if (r.selectedOption === r.question.correctOption) {
              correct++;
              score += 4;
            } else if (r.selectedOption != null) {
              incorrect++;
              score -= 1;
            } else {
              unanswered++;
            }
          } else {
            unanswered++;
          }
        }

        const responseQuestionIds = new Set(a.responses.map((r) => r.questionId));
        unanswered += Math.max(0, totalQuestions - responseQuestionIds.size);

        const maxScore = totalQuestions * 4;
        const accuracy =
          correct + incorrect > 0 ? Math.round((correct / (correct + incorrect)) * 100) : 0;

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
          responses: a.responses.map((r) => ({
            id: r.id,
            questionId: r.questionId,
            selectedOption: r.selectedOption,
            status: r.status,
            correctOption: r.question.correctOption,
            topic: r.question.topic,
            subject: r.question.subject,
            questionText: r.question.questionText,
            options: r.question.options.map((o) => o.optionText),
          })),
        };
      });

      return { id: c.id, name: c.name, rollNumber: c.rollNumber, examSet: c.examSet, createdAt: c.createdAt, attempts: attemptsMapped };
    });

    return res.json(results);
  } catch (err) {
    console.error('Fetch student results error:', err);
    return res.status(500).json({ error: 'Failed to fetch student results' });
  }
});

// ── DELETE /api/admin/attempts/:id ─────────────────────────────────────────
router.delete('/attempts/:id', auth, async (req, res) => {
  try {
    const attemptId = parseInt(req.params.id, 10);
    if (isNaN(attemptId)) {
      return res.status(400).json({ error: 'Invalid attempt id' });
    }

    const attempt = await prisma.examAttempt.findUnique({ where: { id: attemptId } });
    if (!attempt) {
      return res.status(404).json({ error: 'Attempt not found' });
    }

    const candidateId = attempt.candidateId;

    await prisma.$transaction(async (tx) => {
      await tx.examAttempt.delete({ where: { id: attemptId } });

      const remaining = await tx.examAttempt.count({ where: { candidateId } });
      if (remaining === 0) {
        await tx.candidate.delete({ where: { id: candidateId } });
      }
    });

    return res.json({ success: true, message: 'Attempt deleted successfully.' });
  } catch (err) {
    console.error('Delete attempt error:', err);
    return res.status(500).json({ error: 'Failed to delete exam attempt' });
  }
});

module.exports = router;
