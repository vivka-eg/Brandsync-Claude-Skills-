#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const os = require('os');

const skill = process.argv[2];
const skillsDir = path.join(__dirname, '..', 'skills');

if (!skill) {
  const available = fs.readdirSync(skillsDir)
    .filter(f => f.endsWith('.md'))
    .map(f => f.replace('.md', ''));
  console.error('Usage: npx brandsync-skills <skill-name>\n');
  console.error('Available skills:');
  available.forEach(s => console.error(`  ${s}`));
  process.exit(1);
}

const skillPath = path.join(skillsDir, `${skill}.md`);

if (!fs.existsSync(skillPath)) {
  const available = fs.readdirSync(skillsDir)
    .filter(f => f.endsWith('.md'))
    .map(f => f.replace('.md', ''));
  console.error(`Skill "${skill}" not found.\n`);
  console.error('Available skills:');
  available.forEach(s => console.error(`  ${s}`));
  process.exit(1);
}

const destPath = path.join(os.homedir(), '.claude', 'skills', `${skill}.md`);
fs.mkdirSync(path.dirname(destPath), { recursive: true });
fs.copyFileSync(skillPath, destPath);

console.log(`✓ Installed skill "${skill}" to ${destPath}`);
