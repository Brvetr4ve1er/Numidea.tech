#!/usr/bin/env node
/**
 * HTML validation — `npm run validate`. Runs html-validate over every entry
 * page in scripts/site.mjs (so a newly published page is covered without
 * touching this file) plus the legal preview when one exists, on the rules
 * of .htmlvalidate.json: html-validate's recommended set, nothing relaxed.
 *
 * Then over the WorkspaceHQ embeds (EXTRA_PAGES). They are the templates of
 * a design-tool export, rendered by its runtime (embed/support.js): the
 * markup on disk is not what the browser shows, and the strict rules read
 * its template slots as errors. html-validate configures per folder, never
 * per file, and a config inside workspacehq/embed/ would be published, so
 * the embeds get scripts/validate-embed.json, handed to the CLI with -c
 * (its rules win over .htmlvalidate.json's). It relaxes only what the
 * export is:
 *   attr-case                 onClick, onChange, autoFocus… are the
 *                             runtime's property names, bound as
 *                             onClick="{{ goHome }}" (check 16 waives the
 *                             same bindings as handlers): camel case is
 *                             allowed beside lower case
 *   attribute-boolean-style, attribute-allowed-values
 *                             disabled="{{ cantWrite }}", autofocus="{{ true }}":
 *                             slots the runtime fills with a boolean
 *   empty-heading             an <h1> holding <x-import text="{{ pg.name }}">
 *                             is filled at render
 *   element-name              <helmet> is the export's head element
 *   no-inline-style           the export writes every style as an attribute
 *   no-implicit-button-type, no-implicit-input-type
 *                             no embed has a <form>, so the implicit submit
 *                             type can submit nothing; the runtime attaches
 *                             the listeners
 * unique-landmark (unnamed <aside>s) and text-content (icon buttons named by
 * title= alone) are the export's own accessibility gaps, not template slots:
 * they stay visible as warnings, which do not fail the gate, until the
 * export is patched.
 */
import { spawnSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { ROOT, PAGES, EXTRA_PAGES } from './site.mjs';

const bin = join(ROOT, 'node_modules/html-validate/bin/html-validate.mjs');
const run = (files, ...opts) => spawnSync(process.execPath, [bin, ...opts, ...files], { cwd: ROOT, stdio: 'inherit' }).status ?? 1;
const pages = [...PAGES, ...(existsSync(join(ROOT, 'legal-preview/index.html')) ? ['legal-preview/index.html'] : [])];
const site = run(pages);
if (site === 0) console.log(`✓ html-validate clean on ${pages.length} pages`);
const embeds = run(EXTRA_PAGES, '-c', 'scripts/validate-embed.json');
if (embeds === 0) console.log(`✓ html-validate clean on ${EXTRA_PAGES.length} embed templates (scripts/validate-embed.json; any warning above is the export's own)`);
process.exit(site || embeds);
