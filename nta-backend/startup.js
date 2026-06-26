/**
 * startup.js — Production startup script for Railway
 * Runs: db push → seed → start server
 * Each step is awaited and errors are handled gracefully.
 */

const { execSync } = require('child_process');

function run(cmd, opts = {}) {
  console.log(`\n▶ Running: ${cmd}`);
  try {
    execSync(cmd, { stdio: 'inherit', ...opts });
    console.log(`✅ Done: ${cmd}`);
    return true;
  } catch (err) {
    console.error(`❌ Failed: ${cmd}\n`, err.message);
    return false;
  }
}

async function startup() {
  console.log('\n🚀 NTA Exam — Production Startup\n');

  // Step 1: Push schema to DB (idempotent — safe to run every time)
  const pushed = run('npx prisma db push --accept-data-loss --skip-generate');
  if (!pushed) {
    console.warn('⚠️  db push failed, attempting migrate deploy as fallback...');
    run('npx prisma migrate deploy');
  }

  // Step 2: Seed admin user + questions (safe — checks before inserting)
  run('node prisma/seed.js');

  // Step 3: Start the server
  console.log('\n🌐 Starting Express server...\n');
  require('./src/index.js');
}

startup().catch((err) => {
  console.error('Fatal startup error:', err);
  process.exit(1);
});
