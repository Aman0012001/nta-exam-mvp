const express = require('express');
const router = express.Router();
const prisma = require('../prisma');

// GET /api/questions — fetch all questions with their options
router.get('/', async (req, res) => {
  try {
    const questions = await prisma.question.findMany({
      include: {
        options: {
          orderBy: { optionNumber: 'asc' },
        },
      },
      orderBy: { id: 'asc' },
    });

    // Shape the data to match the frontend's expected format
    const shaped = questions.map((q) => ({
      id: q.id,
      subject: q.subject,
      topic: q.topic,
      question: q.questionText,
      options: q.options.map((o) => o.optionText),
      answer: q.correctOption,
      diagram: q.diagramSvg
        ? { type: q.diagramType, svg: q.diagramSvg }
        : null,
    }));

    res.json(shaped);
  } catch (err) {
    console.error('GET /api/questions error:', err);
    res.status(500).json({ error: 'Failed to fetch questions' });
  }
});

// GET /api/questions/:id — fetch a single question
router.get('/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return res.status(400).json({ error: 'Invalid question id' });
    }

    const q = await prisma.question.findUnique({
      where: { id },
      include: {
        options: { orderBy: { optionNumber: 'asc' } },
      },
    });

    if (!q) {
      return res.status(404).json({ error: 'Question not found' });
    }

    res.json({
      id: q.id,
      subject: q.subject,
      topic: q.topic,
      question: q.questionText,
      options: q.options.map((o) => o.optionText),
      answer: q.correctOption,
      diagram: q.diagramSvg
        ? { type: q.diagramType, svg: q.diagramSvg }
        : null,
    });
  } catch (err) {
    console.error('GET /api/questions/:id error:', err);
    res.status(500).json({ error: 'Failed to fetch question' });
  }
});

module.exports = router;
