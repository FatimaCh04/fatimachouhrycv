/**
 * Run: node scripts/decode-profile-photo.js
 * Option A: Put full profile JSON (with base64 photo) in data/profile.json, then run.
 * Option B: Put ONLY the base64 string in data/profile-photo-base64.txt (no data:image... prefix), then run.
 * Decodes photo and saves as assets/images/profile.jpg and CV/assets/images/profile.jpg,
 * updates both profile.json to use photo: "assets/images/profile.jpg".
 */
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const profilePath = path.join(root, 'data', 'profile.json');
const cvProfilePath = path.join(root, 'CV', 'data', 'profile.json');
const base64Path = path.join(root, 'data', 'profile-photo-base64.txt');
const imgPath = path.join(root, 'assets', 'images', 'profile.jpg');
const cvImgPath = path.join(root, 'CV', 'assets', 'images', 'profile.jpg');

let profile;
let base64 = null;

try {
  profile = JSON.parse(fs.readFileSync(profilePath, 'utf8'));
} catch (e) {
  console.error('Could not read data/profile.json:', e.message);
  process.exit(1);
}

let photo = profile.photo;
if (photo && typeof photo === 'string' && photo.startsWith('data:image')) {
  base64 = photo.replace(/^data:image\/\w+;base64,/, '');
}
if (!base64 && fs.existsSync(base64Path)) {
  base64 = fs.readFileSync(base64Path, 'utf8').trim();
}
if (!base64) {
  console.log('No base64 photo found. Either set profile.photo to a data:image... URL in data/profile.json, or put the base64 string in data/profile-photo-base64.txt');
  process.exit(0);
}

const buf = Buffer.from(base64, 'base64');

const out = { name: profile.name, title: profile.title, tagline: profile.tagline, photo: 'assets/images/profile.jpg', resumeUrl: profile.resumeUrl || '' };
const outStr = JSON.stringify(out, null, 2) + '\n';

[imgPath, cvImgPath].forEach((p) => {
  fs.mkdirSync(path.dirname(p), { recursive: true });
  fs.writeFileSync(p, buf);
  console.log('Wrote', path.relative(root, p));
});

fs.writeFileSync(profilePath, outStr);
fs.writeFileSync(cvProfilePath, outStr);
console.log('Updated data/profile.json and CV/data/profile.json to use assets/images/profile.jpg');
console.log('Done.');
process.exit(0);
