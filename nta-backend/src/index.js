require('dotenv').config();
const express = require('express');
const cors = require('cors');

const questionsRouter = require('./routes/questions');
const candidatesRouter = require('./routes/candidates');
const attemptsRouter = require('./routes/attempts');
const adminRouter = require('./routes/admin');

const app = express();
const PORT = process.env.PORT || 3001;

// ── Middleware ─────────────────────────────────────────────
app.use(cors({
  origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
  credentials: true,
}));
app.use(express.json({ limit: '10mb' }));

// ── Routes ─────────────────────────────────────────────────
app.use('/api/questions', questionsRouter);
app.use('/api/candidates', candidatesRouter);
app.use('/api/attempts', attemptsRouter);
app.use('/api/admin', adminRouter);

// ── Health check ───────────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'NTA Exam Backend',
  });
});

// ── 404 handler ────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// ── Global error handler ───────────────────────────────────
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined,
  });
});

// ── Serve Frontend (Production) ────────────────────────────
const path = require('path');
if (process.env.NODE_ENV === 'production') {
  // Serve the static files from the Vite build
  const distPath = path.join(__dirname, '../../nta-exam/dist');
  app.use(express.static(distPath));
  
  // Catch-all route to serve index.html for client-side routing
  app.get('*', (req, res) => {
    res.sendFile(path.join(distPath, 'index.html'));
  });
}

// ── Start server ───────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`\n✅ NTA Backend running at http://localhost:${PORT}`);
  console.log(`   Health: http://localhost:${PORT}/api/health`);
  console.log(`   Questions: http://localhost:${PORT}/api/questions\n`);
});
