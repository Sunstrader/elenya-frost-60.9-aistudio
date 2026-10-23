#!/usr/bin/env node
// 60.1 (audit T06) : une seule source du jeu. Échoue si un autre dossier (hors archives/ et node_modules/) contient
// une copie de DATABASE_*.js ou de Scripts_Game.html, ou si docs/ et elenya-refonte-52.4/docs portent les mêmes fichiers de version.
'use strict';
const fs = require('node:fs'), path = require('node:path'), assert = require('node:assert/strict');
const ROOT = path.resolve(__dirname, '..'), CANON = path.join(ROOT, 'elenya-refonte-52.4/project');
const copies = [];
(function walk(d) { for (const e of fs.readdirSync(d, { withFileTypes: true })) { const p = path.join(d, e.name);
  if (e.isDirectory()) { if (!['node_modules', 'archives', '.git'].includes(e.name) && p !== CANON) walk(p); }
  else if (/^(DATABASE_.*\.js|Scripts_Game\.html|V12_Jeu\.html)$/.test(e.name)) copies.push(path.relative(ROOT, p)); } })(ROOT);
assert.deepEqual(copies, [], 'copies de la source hors du dossier canonique : ' + copies.join(', '));
const dup = fs.existsSync(path.join(ROOT, 'elenya-refonte-52.4/docs/60')) || fs.existsSync(path.join(ROOT, 'elenya-refonte-52.4/docs/60.1'));
assert(!dup, 'documentation 60 dupliquée');
const attr = fs.readFileSync(path.join(ROOT, '.gitattributes'), 'utf8'); assert(/^archives\/? export-ignore/m.test(attr), 'archives non exclu du ZIP');
console.log(JSON.stringify({ canonique: path.relative(ROOT, CANON), copies: 0 }));
