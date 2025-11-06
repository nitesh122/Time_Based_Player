#!/usr/bin/env node

/**
 * Pre-deployment verification script for Time-Based Music Player
 * Run this script before deploying to Vercel to check if everything is ready
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 Vercel Deployment Verification\n');

const checks = [
  {
    name: 'Root package.json exists',
    check: () => fs.existsSync('package.json'),
    fix: 'Create root package.json file'
  },
  {
    name: 'vercel.json configuration exists',
    check: () => fs.existsSync('vercel.json'),
    fix: 'Create vercel.json configuration file'
  },
  {
    name: 'Frontend package.json exists',
    check: () => fs.existsSync('frontend/package.json'),
    fix: 'Ensure frontend/package.json exists'
  },
  {
    name: 'Backend package.json exists',
    check: () => fs.existsSync('backend/package.json'),
    fix: 'Ensure backend/package.json exists'
  },
  {
    name: 'Frontend has build script',
    check: () => {
      try {
        const pkg = JSON.parse(fs.readFileSync('frontend/package.json', 'utf8'));
        return pkg.scripts && pkg.scripts.build;
      } catch (e) {
        return false;
      }
    },
    fix: 'Add build script to frontend/package.json'
  },
  {
    name: 'Backend entry point exists',
    check: () => fs.existsSync('backend/src/index.js'),
    fix: 'Ensure backend/src/index.js exists'
  },
  {
    name: 'Environment example exists',
    check: () => fs.existsSync('.env.example'),
    fix: 'Create .env.example with required variables'
  },
  {
    name: 'Deployment guide exists',
    check: () => fs.existsSync('DEPLOYMENT.md'),
    fix: 'Create DEPLOYMENT.md with deployment instructions'
  }
];

let allPassed = true;

checks.forEach((check, index) => {
  const passed = check.check();
  const status = passed ? '✅' : '❌';
  console.log(`${index + 1}. ${status} ${check.name}`);
  
  if (!passed) {
    console.log(`   Fix: ${check.fix}`);
    allPassed = false;
  }
});

console.log('\n' + '='.repeat(50));

if (allPassed) {
  console.log('🎉 All checks passed! Your project is ready for Vercel deployment.');
  console.log('\nNext steps:');
  console.log('1. Push your code to GitHub');
  console.log('2. Connect your GitHub repo to Vercel');
  console.log('3. Configure environment variables in Vercel dashboard');
  console.log('4. Deploy!');
} else {
  console.log('⚠️  Some checks failed. Please fix the issues above before deploying.');
}

console.log('\nFor detailed deployment instructions, see DEPLOYMENT.md');
