/**
 * Run from repo root: node scripts/decode-project-images.js
 * Reads CV/data/projects.json. For each project whose "image" is a data:image/...;base64,...
 * saves the image to CV/assets/images/projects/{id}.{ext} and updates the JSON to use
 * "assets/images/projects/{id}.{ext}". This fixes project images not showing on live (resume/portfolio).
 */
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const cvRoot = path.join(root, 'CV');
const projectsPath = path.join(cvRoot, 'data', 'projects.json');
const projectsDir = path.join(cvRoot, 'assets', 'images', 'projects');

let projects;
try {
  const raw = fs.readFileSync(projectsPath, 'utf8');
  projects = JSON.parse(raw);
} catch (e) {
  console.error('Could not read CV/data/projects.json:', e.message);
  process.exit(1);
}

if (!Array.isArray(projects)) {
  console.error('projects.json must be an array');
  process.exit(1);
}

function mimeToExt(mime) {
  if (!mime) return '.jpg';
  const m = mime.toLowerCase();
  if (m.includes('png')) return '.png';
  if (m.includes('gif')) return '.gif';
  if (m.includes('webp')) return '.webp';
  return '.jpg';
}

let updated = 0;
projects.forEach(function (p) {
  const img = p.image;
  if (!img || typeof img !== 'string' || !img.startsWith('data:image')) return;
  const match = img.match(/^data:(image\/\w+);base64,(.+)$/);
  if (!match) return;
  const ext = mimeToExt(match[1]);
  const base64 = match[2];
  const id = (p.id || 'proj-' + Math.random().toString(36).slice(2)).replace(/[^a-zA-Z0-9_-]/g, '_');
  const filename = id + ext;
  const outPath = path.join(projectsDir, filename);
  try {
    const buf = Buffer.from(base64, 'base64');
    fs.mkdirSync(projectsDir, { recursive: true });
    fs.writeFileSync(outPath, buf);
    p.image = 'assets/images/projects/' + filename;
    updated++;
    console.log('Wrote assets/images/projects/' + filename);
  } catch (e) {
    console.error('Failed for project', p.id || p.title, e.message);
  }
});

if (updated > 0) {
  fs.writeFileSync(projectsPath, JSON.stringify(projects, null, 2) + '\n', 'utf8');
  console.log('Updated CV/data/projects.json: ' + updated + ' project image(s) converted to files.');
} else {
  console.log('No data:image base64 project images found. Nothing to do.');
}
process.exit(0);
