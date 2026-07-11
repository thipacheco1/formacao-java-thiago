import { readFileSync } from 'fs';

const data = JSON.parse(readFileSync('package-lock.json', 'utf8'));
for (const [name, pkg] of Object.entries(data.packages)) {
  if (pkg.version !== undefined && typeof pkg.version !== 'string') {
    console.log(`Package ${name} has non-string version:`, pkg.version);
  }
  if (pkg.version === '') {
    console.log(`Package ${name} has empty version`);
  }
}
console.log("Scan complete.");
