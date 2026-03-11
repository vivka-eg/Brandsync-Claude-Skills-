#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const os = require('os');

const skill = process.argv[2];
const skillsDir = path.join(__dirname, '..', 'skills');

function listSkills(dir, base) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const skills = [];
  for (const entry of entries) {
    const rel = base ? `${base}/${entry.name}` : entry.name;
    if (entry.isDirectory()) {
      skills.push(...listSkills(path.join(dir, entry.name), rel));
    } else if (entry.name.endsWith('.md')) {
      skills.push(rel.replace('.md', ''));
    }
  }
  return skills;
}

if (!skill) {
  console.error('Usage: npx brandsync-skills <skill-name>\n');
  console.error('Available skills:');
  listSkills(skillsDir).forEach(s => console.error(`  ${s}`));
  process.exit(1);
}

const skillPath = path.join(skillsDir, `${skill}.md`);

if (!fs.existsSync(skillPath)) {
  console.error(`Skill "${skill}" not found.\n`);
  console.error('Available skills:');
  listSkills(skillsDir).forEach(s => console.error(`  ${s}`));
  process.exit(1);
}

const destPath = path.join(os.homedir(), '.claude', 'skills', `${skill}.md`);
fs.mkdirSync(path.dirname(destPath), { recursive: true });
fs.copyFileSync(skillPath, destPath);

console.log(`✓ Installed skill "${skill}" to ${destPath}`);
