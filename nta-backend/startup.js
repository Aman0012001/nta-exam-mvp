/**
 * startup.js — Production startup script for Railway
 *
 * Runs entirely in-process (no child process spawning for DB/seed steps).
 * This avoids env-var inheritance issues with Railway's injected secrets.
 *
 * Order of operations:
 *   1. Normalize DATABASE_URL (postgres:// → postgresql://)
 *   2. Push Prisma schema to DB (idempotent)
 *   3. Upsert default admin + seed questions if missing
 *   4. Start Express server
 */

'use strict';

require('dotenv').config();

// ── Step 1: Normalize DATABASE_URL ─────────────────────────────────────────
// Railway provides postgres:// but Prisma requires postgresql://
if (process.env.DATABASE_URL && process.env.DATABASE_URL.startsWith('postgres://')) {
  process.env.DATABASE_URL = process.env.DATABASE_URL.replace(
    'postgres://',
    'postgresql://'
  );
  console.log('🔧 Normalized DATABASE_URL: postgres:// → postgresql://');
}

if (!process.env.DATABASE_URL) {
  console.error('❌ FATAL: DATABASE_URL environment variable is not set.');
  console.error('   Please add it in Railway → Your Service → Variables tab.');
  process.exit(1);
}

const { execSync } = require('child_process');
const bcrypt = require('bcryptjs');
const prisma = require('./src/prisma');

// ── Step 2: Push DB schema ──────────────────────────────────────────────────
function pushSchema() {
  console.log('\n▶ Pushing Prisma schema to database...');
  try {
    execSync('npx prisma db push --accept-data-loss --skip-generate', {
      stdio: 'inherit',
      env: process.env, // explicitly pass current env (includes normalized DATABASE_URL)
    });
    console.log('✅ Schema push complete.\n');
    return true;
  } catch (err) {
    console.error('❌ Schema push failed:', err.message);
    return false;
  }
}

// ── Step 3: Seed default admin + questions ──────────────────────────────────
async function seedDatabase() {
  console.log('▶ Ensuring admin credentials and questions...');

  const ADMIN_USERNAME = 'admin';
  const ADMIN_PASSWORD = 'Admin@123';

  // Always hash fresh — never use stale in-memory values
  const hashed = await bcrypt.hash(ADMIN_PASSWORD, 12);

  // upsert: create if not exists, always overwrite password with correct hash
  await prisma.admin.upsert({
    where:  { username: ADMIN_USERNAME },
    update: { password: hashed },
    create: { username: ADMIN_USERNAME, password: hashed },
  });

  console.log(`✅ Admin ready — username: "${ADMIN_USERNAME}" / password: "${ADMIN_PASSWORD}"`);

  // ── Questions ─────────────────────────────────────────────────────────────
  const questionCount = await prisma.question.count();
  if (questionCount === 0) {
    console.log('▶ Seeding questions...');
    await seedQuestions();
    const finalCount = await prisma.question.count();
    console.log(`✅ Seeded ${finalCount} questions.`);
  } else {
    console.log(`✅ Found ${questionCount} questions in DB — skipping question seed.`);
  }
}

// ── Seed question data ──────────────────────────────────────────────────────
async function seedQuestions() {
  const detailedQuestions = [
    { id: 1, subject: 'Physics', topic: 'Laws of Motion', question: 'A block of mass 5 kg is placed on a frictionless inclined plane of angle 30°. What is the acceleration of the block along the incline? (g = 10 m/s²)', options: ['5 m/s²', '4.33 m/s²', '10 m/s²', '2.5 m/s²'], answer: 1, diagramType: 'inclined-plane' },
    { id: 2, subject: 'Physics', topic: 'Projectile Motion', question: 'A ball is thrown horizontally from a height of 20 m with a velocity of 10 m/s. What is the horizontal range? (g = 10 m/s²)', options: ['10 m', '20 m', '30 m', '40 m'], answer: 2, diagramType: 'projectile' },
    { id: 3, subject: 'Physics', topic: 'Circular Motion', question: 'A stone of mass 0.5 kg is tied to a string and rotated in a horizontal circle of radius 1 m at 4 m/s. What is the tension?', options: ['4 N', '8 N', '16 N', '2 N'], answer: 2, diagramType: 'circular-motion' },
    { id: 4, subject: 'Physics', topic: 'Work, Energy & Power', question: 'A spring with k = 200 N/m is compressed by 0.1 m. What is the potential energy stored?', options: ['2 J', '1 J', '0.5 J', '20 J'], answer: 2, diagramType: 'spring' },
    { id: 5, subject: 'Physics', topic: 'Waves & Sound', question: 'In the diagram below, which point represents a NODE in a standing wave?', options: ['Point A (crest)', 'Point B (zero displacement)', 'Point C (trough)', 'Point D (amplitude)'], answer: 2, diagramType: 'standing-wave' },
    { id: 6, subject: 'Physics', topic: 'Optics', question: 'A ray of light strikes a plane mirror at an angle of incidence of 35°. What is the angle of reflection?', options: ['70°', '35°', '55°', '45°'], answer: 2, diagramType: 'reflection' },
    { id: 7, subject: 'Physics', topic: 'Electricity', question: 'Two resistors R₁ = 4Ω and R₂ = 6Ω are in parallel across a 12V battery. What is the total current?', options: ['2 A', '3 A', '5 A', '1 A'], answer: 3, diagramType: 'circuit' },
    { id: 8, subject: 'Physics', topic: 'Magnetism', question: "A current-carrying conductor is placed in a magnetic field. Using Fleming's Left Hand Rule, what is the direction of force?", options: ['Upward (↑)', 'Downward (↓)', 'Into the page (⊗)', 'Out of the page (⊙)'], answer: 1, diagramType: 'magnetic-force' },
    { id: 9, subject: 'Physics', topic: 'Thermodynamics', question: 'In the P-V diagram, which process represents an ISOTHERMAL expansion?', options: ['Curve A (steep hyperbola)', 'Line B (vertical)', 'Line C (horizontal)', 'Curve D (parabola)'], answer: 1, diagramType: 'pv-diagram' },
    { id: 10, subject: 'Physics', topic: 'Modern Physics', question: "In the photoelectric effect diagram, what does 'W' (y-intercept when extended) represent?", options: ['Maximum kinetic energy', 'Work function (threshold energy)', "Planck's constant", 'Stopping potential'], answer: 2, diagramType: 'photoelectric' },
    { id: 11, subject: 'Physics', topic: 'Gravitation', question: 'Two objects M and m are separated by distance r. If distance is doubled, gravitational force becomes:', options: ['Doubled', 'Halved', 'One-fourth', 'Four times'], answer: 3, diagramType: 'gravitation' },
    { id: 12, subject: 'Physics', topic: 'Fluid Mechanics', question: "In Bernoulli's principle, which section has the highest velocity?", options: ['Section A (wide pipe)', 'Section B (narrow constriction)', 'Both are equal', 'Cannot be determined'], answer: 2, diagramType: 'bernoulli' },
    { id: 13, subject: 'Physics', topic: 'Simple Harmonic Motion', question: 'At which position does the SHM particle have maximum kinetic energy?', options: ['At the extreme positions (A or -A)', 'At the mean position (O)', 'At any random position', 'At quarter amplitude'], answer: 2, diagramType: 'shm' },
    { id: 14, subject: 'Physics', topic: 'Nuclear Physics', question: 'In U-235 fission, how many neutrons are released per fission to sustain the chain reaction?', options: ['1', '2', '3', '4'], answer: 3, diagramType: 'nuclear-fission' },
    { id: 15, subject: 'Physics', topic: 'Electrostatics', question: 'At which point is the electric field strength the STRONGEST?', options: ['Point P (sparse field lines)', 'Point Q (dense field lines)', 'Both P and Q are equal', 'Field is zero everywhere'], answer: 2, diagramType: 'electric-field' },
  ];

  const topics = ['Mechanics', 'Thermodynamics', 'Optics', 'Electromagnetism', 'Waves', 'Modern Physics', 'Nuclear Physics', 'Fluid Dynamics', 'Rotational Motion', 'Gravitation'];
  const autoQuestions = Array.from({ length: 85 }, (_, i) => {
    const id = i + 16;
    const topic = topics[i % topics.length];
    return {
      id, subject: 'Physics', topic,
      question: `Physics Mock Q${id} (${topic}): A system undergoes a process described by physical law in unit ${id}. What is the resulting physical quantity if the input parameter is doubled?`,
      options: ['It remains unchanged', 'It doubles (×2)', 'It quadruples (×4)', 'It becomes half (÷2)'],
      answer: 2, diagramType: null,
    };
  });

  const allQuestions = [...detailedQuestions, ...autoQuestions];

  for (const q of allQuestions) {
    await prisma.question.create({
      data: {
        id: q.id,
        subject: q.subject,
        topic: q.topic,
        questionText: q.question,
        diagramType: q.diagramType ?? null,
        diagramSvg: null,
        correctOption: q.answer,
        options: {
          create: q.options.map((text, idx) => ({
            optionNumber: idx + 1,
            optionText: text,
          })),
        },
      },
    });
  }
}

// ── Main ────────────────────────────────────────────────────────────────────
async function main() {
  console.log('\n🚀 NTA Exam — Production Startup\n');
  console.log(`   DATABASE_URL set: ${!!process.env.DATABASE_URL}`);
  console.log(`   NODE_ENV: ${process.env.NODE_ENV || 'not set'}\n`);

  // Step 2: Schema push
  pushSchema();

  // Step 3: Seed (runs in-process — no child process, no env issues)
  try {
    await seedDatabase();
  } catch (err) {
    console.error('❌ Seed failed:', err.message);
    console.error(err);
    // Don't exit — server can still start even if seed failed
  } finally {
    await prisma.$disconnect();
  }

  // Step 4: Start server
  console.log('\n🌐 Starting Express server...\n');
  require('./src/index.js');
}

main().catch((err) => {
  console.error('Fatal startup error:', err);
  process.exit(1);
});
