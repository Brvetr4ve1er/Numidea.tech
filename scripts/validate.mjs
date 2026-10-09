#!/usr/bin/env node
/**
 * HTML validation — `npm run validate`. Runs html-validate over every entry
 * page in scripts/site.mjs (so a newly published page is covered without
 * touching this file) plus the legal preview when one exists.
 */
import { spawnSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { ROOT, PAGES } from './site.mjs';

const files = [...PAGES, ...(existsSync(join(ROOT, 'legal-preview/index.html')) ? ['legal-preview/index.html'] : [])];
const bin = join(ROOT, 'node_modules/html-validate/bin/html-validate.mjs');
const r = spawnSync(process.execPath, [bin, ...files], { cwd: ROOT, stdio: 'inherit' });
if (r.status === 0) console.log('✓ html-validate clean on ' + files.length + ' pages');
process.exit(r.status ?? 1);
