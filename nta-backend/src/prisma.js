const { PrismaClient } = require('@prisma/client');

// Normalize DATABASE_URL: Railway provides postgres:// but Prisma requires postgresql://
if (process.env.DATABASE_URL && process.env.DATABASE_URL.startsWith('postgres://')) {
  process.env.DATABASE_URL = process.env.DATABASE_URL.replace('postgres://', 'postgresql://');
}

const prisma = new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'info', 'warn', 'error'] : ['warn', 'error'],
});

module.exports = prisma;
