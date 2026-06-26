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
// In production, frontend is served from the same origin, so we allow all.
const allowedOrigins = process.env.NODE_ENV === 'production'
  ? true  // same-origin: allow all
  : ['http://localhost:5173', 'http://127.0.0.1:5173'];
app.use(cors({ origin: allowedOrigins, credentials: true }));
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

// ── Serve Frontend (always — dist is built at deploy time) ──
const path = require('path');
const distPath = path.join(__dirname, '../../nta-exam/dist');
const fs = require('fs');
if (fs.existsSync(distPath)) {
  app.use(express.static(distPath));
  // Catch-all: serve index.html for any non-API route (React Router)
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api/')) return next();
    res.sendFile(path.join(distPath, 'index.html'));
  });
  console.log('📦 Serving frontend from:', distPath);
} else {
  console.log('ℹ️  No dist folder found, running in API-only mode');
}

// ── 404 handler ────────────────────────────────────────────
app.use((req, res) => {
  if (req.path.startsWith('/api/')) {
    res.status(404).json({ error: 'Route not found' });
  } else {
    res.status(404).send('Not Found');
  }
});

// ── Global error handler ───────────────────────────────────
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined,
  });
});

// (Static serving logic moved up)
// ── Start server ───────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`\n✅ NTA Backend running at http://localhost:${PORT}`);
  console.log(`   Health: http://localhost:${PORT}/api/health`);
  console.log(`   Questions: http://localhost:${PORT}/api/questions\n`);
});
