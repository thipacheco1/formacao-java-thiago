import { readFileSync, readdirSync, statSync } from 'fs';
import { join } from 'path';

const semverRegex = /^\d+\.\d+\.\d+(-[a-zA-Z0-9.]+)?(\+[a-zA-Z0-9.]+)?$/;

function scan(dir) {
  let files = [];
  try {
    files = readdirSync(dir);
  } catch (e) {
    return;
  }
  for (const file of files) {
    if (file === 'node_modules') {
      const nmDir = join(dir, file);
      scanNodeModules(nmDir);
    } else {
      const fullPath = join(dir, file);
      let isDir = false;
      try {
        isDir = statSync(fullPath).isDirectory();
      } catch (e) {}
      if (isDir) {
        scan(fullPath);
      }
    }
  }
}

function scanNodeModules(dir) {
  let files = [];
  try {
    files = readdirSync(dir);
  } catch (e) {
    return;
  }
  for (const file of files) {
    const fullPath = join(dir, file);
    let isDir = false;
    try {
      isDir = statSync(fullPath).isDirectory();
    } catch (e) {}
    if (isDir) {
      if (file.startsWith('@')) {
        // Scope folder
        let subFiles = [];
        try {
          subFiles = readdirSync(fullPath);
        } catch (e) {}
        for (const subFile of subFiles) {
          checkPackage(join(fullPath, subFile));
        }
      } else {
        checkPackage(fullPath);
      }
    }
  }
}

function checkPackage(pkgDir) {
  const pjPath = join(pkgDir, 'package.json');
  let content = '';
  try {
    content = readFileSync(pjPath, 'utf8');
  } catch (e) {
    // If no package.json, check subdirectories (could be nested node_modules)
    scanNodeModules(join(pkgDir, 'node_modules'));
    return;
  }
  try {
    const pj = JSON.parse(content);
    if (pj.version) {
      if (!semverRegex.test(pj.version)) {
        console.log(`[INVALID SEMVER] ${pjPath}: version is "${pj.version}"`);
      }
    } else {
      // Some private packages might not have version, but npm can complain
      console.log(`[NO VERSION] ${pjPath}`);
    }
  } catch (e) {
    console.log(`[JSON ERROR] ${pjPath}:`, e.message);
  }
  scanNodeModules(join(pkgDir, 'node_modules'));
}

console.log("Starting scan of plataforma-curso/node_modules...");
scanNodeModules('plataforma-curso/node_modules');
console.log("Scan finished.");
