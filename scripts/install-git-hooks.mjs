#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const gitDir = path.join(root, '.git');
const src = path.join(root, 'scripts/git-hooks/pre-push');
const dest = path.join(gitDir, 'hooks/pre-push');

if (!fs.existsSync(gitDir)) {
  process.exit(0);
}

fs.mkdirSync(path.dirname(dest), { recursive: true });
fs.copyFileSync(src, dest);
fs.chmodSync(dest, 0o755);
