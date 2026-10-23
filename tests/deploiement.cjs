#!/usr/bin/env node
// 60.1 (audit T06) : DEPLOIEMENT.md cite chaque fichier de la source ; chaque include() de V12_Jeu existe.
'use strict';
const fs = require('node:fs'), path = require('node:path'), assert = require('node:assert/strict');
const ROOT = path.resolve(__dirname, '..'), P = path.join(ROOT, 'elenya-refonte-52.4/project');
const doc = fs.readFileSync(path.join(ROOT, 'docs/60.2/DEPLOIEMENT.md'), 'utf8');
const fichiers = fs.readdirSync(P).filter(f => fs.statSync(path.join(P, f)).isFile());
const absents = fichiers.filter(f => !doc.includes('`' + f + '`'));
assert.deepEqual(absents, [], 'absents de DEPLOIEMENT.md : ' + absents.join(', '));
const inc = [...fs.readFileSync(path.join(P, 'V12_Jeu.html'), 'utf8').matchAll(/include\('([^']+)'\)/g)].map(m => m[1]);
for (const n of inc) assert(fs.existsSync(path.join(P, n + '.html')), 'include manquant : ' + n);
assert(doc.includes('Cinematic_UI_Landscape'));
console.log(JSON.stringify({ fichiers: fichiers.length, includes: inc.length }));
