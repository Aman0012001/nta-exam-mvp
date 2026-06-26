const express = require('express');
const { PrismaClient } = require('@prisma/client');

const router = express.Router();
const prisma = new PrismaClient();

// POST /api/attempts — create a new exam attempt for a candidate
router.post('/', async (req, res) => {
  try {
    const { candidateId } = req.body;

    if (!candidateId) {
      return res.status(400).json({ error: 'candidateId is required' });
    }

    const candidateExists = await prisma.candidate.findUnique({
      where: { id: parseInt(candidateId, 10) },
    });

    if (!candidateExists) {
      return res.status(404).json({ error: 'Candidate not found' });
    }

    const attempt = await prisma.examAttempt.create({
      data: {
        candidateId: parseInt(candidateId, 10),
        status: 'in-progress',
      },
    });

    res.status(201).json(attempt);
  } catch (err) {
    console.error('POST /api/attempts error:', err);
    res.status(500).json({ error: 'Failed to create exam attempt' });
  }
});

// PUT /api/attempts/:id/submit — submit attempt with all responses
router.put('/:id/submit', async (req, res) => {
  try {
    const attemptId = parseInt(req.params.id, 10);
    if (isNaN(attemptId)) {
      return res.status(400).json({ error: 'Invalid attempt id' });
    }

    const { timeTakenSecs, responses } = req.body;
    // responses: Array of { questionId, selectedOption, status }

    if (!responses || !Array.isArray(responses)) {
      return res.status(400).json({ error: 'responses array is required' });
    }

    const attempt = await prisma.examAttempt.findUnique({
      where: { id: attemptId },
    });

    if (!attempt) {
      return res.status(404).json({ error: 'Attempt not found' });
    }

    if (attempt.status === 'submitted') {
      return res.status(409).json({ error: 'Attempt already submitted' });
    }

    // Compute summary stats
    const totalAnswered = responses.filter(
      (r) => r.status === 'answered' || r.status === 'answered-marked'
    ).length;
    const totalMarkedReview = responses.filter(
      (r) => r.status === 'marked'
    ).length;
    const totalNotAnswered = responses.filter(
      (r) => r.status === 'not-answered' || r.status === 'not-visited'
    ).length;

    // Upsert all responses + update the attempt in a transaction
    await prisma.$transaction(async (tx) => {
      // Upsert each response
      for (const r of responses) {
        await tx.response.upsert({
          where: {
            attemptId_questionId: {
              attemptId,
              questionId: parseInt(r.questionId, 10),
            },
          },
          update: {
            selectedOption: r.selectedOption ?? null,
            status: r.status,
          },
          create: {
            attemptId,
            questionId: parseInt(r.questionId, 10),
            selectedOption: r.selectedOption ?? null,
            status: r.status,
          },
        });
      }

      // Mark attempt as submitted
      await tx.examAttempt.update({
        where: { id: attemptId },
        data: {
          status: 'submitted',
          submittedAt: new Date(),
          timeTakenSecs: timeTakenSecs ?? null,
          totalAnswered,
          totalMarkedReview,
          totalNotAnswered,
        },
      });
    });

    const updatedAttempt = await prisma.examAttempt.findUnique({
      where: { id: attemptId },
      include: {
        candidate: true,
        responses: {
          include: { question: { select: { id: true, topic: true } } },
          orderBy: { questionId: 'asc' },
        },
      },
    });

    res.json(updatedAttempt);
  } catch (err) {
    console.error('PUT /api/attempts/:id/submit error:', err);
    res.status(500).json({ error: 'Failed to submit attempt' });
  }
});

// GET /api/attempts/:id — get attempt details with responses
router.get('/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return res.status(400).json({ error: 'Invalid attempt id' });
    }

    const attempt = await prisma.examAttempt.findUnique({
      where: { id },
      include: {
        candidate: true,
        responses: {
          include: {
            question: {
              select: {
                id: true,
                subject: true,
                topic: true,
                questionText: true,
                correctOption: true,
              },
            },
          },
          orderBy: { questionId: 'asc' },
        },
      },
    });

    if (!attempt) {
      return res.status(404).json({ error: 'Attempt not found' });
    }

    // Calculate score (4 marks for correct, -1 for wrong, 0 for unattempted)
    let score = 0;
    for (const r of attempt.responses) {
      if (r.status === 'answered' || r.status === 'answered-marked') {
        if (r.selectedOption === r.question.correctOption) {
          score += 4;
        } else if (r.selectedOption !== null) {
          score -= 1;
        }
      }
    }

    res.json({ ...attempt, calculatedScore: score });
  } catch (err) {
    console.error('GET /api/attempts/:id error:', err);
    res.status(500).json({ error: 'Failed to fetch attempt' });
  }
});

module.exports = router;
