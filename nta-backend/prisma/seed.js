/**
 * Seed script — populates the database with all 100 NTA Physics questions.
 * Run: node prisma/seed.js
 */

require('dotenv').config();
const prisma = require('../src/prisma');

// ─── Question data (mirrored from frontend questions.js) ─────────────────────

const detailedQuestions = [
  {
    id: 1,
    subject: 'Physics',
    topic: 'Laws of Motion',
    question: 'A block of mass 5 kg is placed on a frictionless inclined plane of angle 30°. What is the acceleration of the block along the incline? (g = 10 m/s²)',
    options: ['5 m/s²', '4.33 m/s²', '10 m/s²', '2.5 m/s²'],
    answer: 1,
    diagramType: 'inclined-plane',
  },
  {
    id: 2,
    subject: 'Physics',
    topic: 'Projectile Motion',
    question: 'A ball is thrown horizontally from a height of 20 m with a velocity of 10 m/s. What is the horizontal range of the projectile? (g = 10 m/s²)',
    options: ['10 m', '20 m', '30 m', '40 m'],
    answer: 2,
    diagramType: 'projectile',
  },
  {
    id: 3,
    subject: 'Physics',
    topic: 'Circular Motion',
    question: 'A stone of mass 0.5 kg is tied to a string and rotated in a horizontal circle of radius 1 m at a speed of 4 m/s. What is the tension in the string?',
    options: ['4 N', '8 N', '16 N', '2 N'],
    answer: 2,
    diagramType: 'circular-motion',
  },
  {
    id: 4,
    subject: 'Physics',
    topic: 'Work, Energy & Power',
    question: 'A spring with spring constant k = 200 N/m is compressed by 0.1 m. What is the potential energy stored in the spring?',
    options: ['2 J', '1 J', '0.5 J', '20 J'],
    answer: 2,
    diagramType: 'spring',
  },
  {
    id: 5,
    subject: 'Physics',
    topic: 'Waves & Sound',
    question: 'In the diagram below, which point represents a NODE in a standing wave pattern?',
    options: ['Point A (crest)', 'Point B (zero displacement)', 'Point C (trough)', 'Point D (amplitude)'],
    answer: 2,
    diagramType: 'standing-wave',
  },
  {
    id: 6,
    subject: 'Physics',
    topic: 'Optics',
    question: 'A ray of light strikes a plane mirror at an angle of incidence of 35°. What is the angle of reflection?',
    options: ['70°', '35°', '55°', '45°'],
    answer: 2,
    diagramType: 'reflection',
  },
  {
    id: 7,
    subject: 'Physics',
    topic: 'Electricity',
    question: 'In the circuit shown, two resistors R₁ = 4Ω and R₂ = 6Ω are connected in parallel across a 12V battery. What is the total current from the battery?',
    options: ['2 A', '3 A', '5 A', '1 A'],
    answer: 3,
    diagramType: 'circuit',
  },
  {
    id: 8,
    subject: 'Physics',
    topic: 'Magnetism',
    question: "A current-carrying conductor is placed in a magnetic field as shown. Using Fleming's Left Hand Rule, in which direction is the force on the conductor?",
    options: ['Upward (↑)', 'Downward (↓)', 'Into the page (⊗)', 'Out of the page (⊙)'],
    answer: 1,
    diagramType: 'magnetic-force',
  },
  {
    id: 9,
    subject: 'Physics',
    topic: 'Thermodynamics',
    question: 'In the P-V diagram shown, which process represents an ISOTHERMAL expansion?',
    options: ['Curve A (steep hyperbola)', 'Line B (vertical)', 'Line C (horizontal)', 'Curve D (parabola)'],
    answer: 1,
    diagramType: 'pv-diagram',
  },
  {
    id: 10,
    subject: 'Physics',
    topic: 'Modern Physics',
    question: "In the photoelectric effect diagram, which quantity does 'W' (the y-intercept when extended) represent?",
    options: ['Maximum kinetic energy', 'Work function (threshold energy)', "Planck's constant", 'Stopping potential'],
    answer: 2,
    diagramType: 'photoelectric',
  },
  {
    id: 11,
    subject: 'Physics',
    topic: 'Gravitation',
    question: 'Two objects of masses M and m are separated by distance r. If the distance is doubled, the gravitational force becomes:',
    options: ['Doubled', 'Halved', 'One-fourth', 'Four times'],
    answer: 3,
    diagramType: 'gravitation',
  },
  {
    id: 12,
    subject: 'Physics',
    topic: 'Fluid Mechanics',
    question: "In Bernoulli's principle, as shown in the diagram, which section has the highest velocity?",
    options: ['Section A (wide pipe)', 'Section B (narrow constriction)', 'Both are equal', 'Cannot be determined'],
    answer: 2,
    diagramType: 'bernoulli',
  },
  {
    id: 13,
    subject: 'Physics',
    topic: 'Simple Harmonic Motion',
    question: 'At which position in the SHM diagram does the particle have maximum kinetic energy?',
    options: ['At the extreme positions (A or -A)', 'At the mean position (O)', 'At any random position', 'At quarter amplitude'],
    answer: 2,
    diagramType: 'shm',
  },
  {
    id: 14,
    subject: 'Physics',
    topic: 'Nuclear Physics',
    question: 'In the nuclear fission diagram, U-235 + n → ? The total number of neutrons released per fission that sustain the chain reaction is:',
    options: ['1', '2', '3', '4'],
    answer: 3,
    diagramType: 'nuclear-fission',
  },
  {
    id: 15,
    subject: 'Physics',
    topic: 'Electrostatics',
    question: 'Looking at the electric field lines diagram, at which point is the electric field strength the STRONGEST?',
    options: ['Point P (sparse field lines)', 'Point Q (dense field lines)', 'Both P and Q are equal', 'Field is zero everywhere'],
    answer: 2,
    diagramType: 'electric-field',
  },
];

// Generate questions 16-100
const topics = [
  'Mechanics', 'Thermodynamics', 'Optics', 'Electromagnetism',
  'Waves', 'Modern Physics', 'Nuclear Physics', 'Fluid Dynamics',
  'Rotational Motion', 'Gravitation',
];

const autoQuestions = Array.from({ length: 85 }, (_, i) => {
  const id = i + 16;
  const topic = topics[i % topics.length];
  return {
    id,
    subject: 'Physics',
    topic,
    question: `Physics Mock Q${id} (${topic}): A system undergoes a process described by physical law in unit ${id}. What is the resulting physical quantity if the input parameter is doubled?`,
    options: [
      'It remains unchanged',
      'It doubles (×2)',
      'It quadruples (×4)',
      'It becomes half (÷2)',
    ],
    answer: 2,
    diagramType: null,
  };
});

const allQuestions = [...detailedQuestions, ...autoQuestions];

// ─── Main seed function ──────────────────────────────────────────────────────

async function main() {
  console.log('🌱 Starting database seed...\n');

  // Clear existing data (in correct FK order)
  console.log('🗑️  Clearing existing data...');
  await prisma.response.deleteMany();
  await prisma.examAttempt.deleteMany();
  await prisma.candidate.deleteMany();
  await prisma.option.deleteMany();
  await prisma.question.deleteMany();
  await prisma.admin.deleteMany();
  console.log('   Done.\n');

  // Seed default admin user
  console.log('👤 Seeding default admin user...');
  const bcrypt = require('bcryptjs');
  const hashedPassword = await bcrypt.hash('password123', 10);
  await prisma.admin.create({
    data: {
      username: 'admin',
      password: hashedPassword,
    },
  });
  console.log('   Done.\n');

  // Insert questions + options
  console.log(`📚 Seeding ${allQuestions.length} questions...`);
  let count = 0;
  for (const q of allQuestions) {
    await prisma.question.create({
      data: {
        id: q.id,
        subject: q.subject,
        topic: q.topic,
        questionText: q.question,
        diagramType: q.diagramType ?? null,
        diagramSvg: null, // SVGs are rendered on the frontend
        correctOption: q.answer,
        options: {
          create: q.options.map((text, idx) => ({
            optionNumber: idx + 1,
            optionText: text,
          })),
        },
      },
    });
    count++;
    if (count % 10 === 0) {
      console.log(`   Inserted ${count}/${allQuestions.length}...`);
    }
  }

  console.log(`\n✅ Seeded ${count} questions successfully!`);
  console.log('\n💡 You can now start the server with: npm run dev');
}

main()
  .catch((err) => {
    console.error('❌ Seed failed:', err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
