const express = require('express');
const router = express.Router();
const prisma = require('../prisma');

// POST /api/candidates — register a new candidate / start session
router.post('/', async (req, res) => {
  try {
    const { name, rollNumber, examSet } = req.body;

    if (!name || !rollNumber) {
      return res.status(400).json({
        error: 'name and rollNumber are required',
      });
    }

    const candidate = await prisma.candidate.create({
      data: {
        name: name.trim(),
        rollNumber: rollNumber.trim().toUpperCase(),
        examSet: (examSet || 'SET-A').trim().toUpperCase(),
      },
    });

    res.status(201).json(candidate);
  } catch (err) {
    console.error('POST /api/candidates error:', err);
    res.status(500).json({ error: 'Failed to register candidate' });
  }
});

// GET /api/candidates/:id — fetch a candidate
router.get('/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return res.status(400).json({ error: 'Invalid candidate id' });
    }

    const candidate = await prisma.candidate.findUnique({
      where: { id },
      include: {
        attempts: {
          orderBy: { startedAt: 'desc' },
          take: 5,
        },
      },
    });

    if (!candidate) {
      return res.status(404).json({ error: 'Candidate not found' });
    }

    res.json(candidate);
  } catch (err) {
    console.error('GET /api/candidates/:id error:', err);
    res.status(500).json({ error: 'Failed to fetch candidate' });
  }
});

module.exports = router;
