#!/usr/bin/env node
// 60.1 (audit, visuel) : plus de reliquat de l’ancienne narration vocale dans les identifiants, fonctions et CSS du jeu.
'use strict';
const fs = require('node:fs'), path = require('node:path'), assert = require('node:assert/strict');
const P = path.resolve(__dirname, '../elenya-refonte-52.4/project');
const motif = /narration-start|NarrationAndStart|NarrationStart|narration-step|narrationStart/;
const trouves = [];
for (const f of fs.readdirSync(P).filter(f => /\.(html|js)$/.test(f))) fs.readFileSync(path.join(P, f), 'utf8').split('\n').forEach((l, i) => { if (motif.test(l)) trouves.push(f + ':' + (i + 1)); });
const index = fs.readFileSync(path.resolve(__dirname, '../index.html'), 'utf8'); if (motif.test(index)) trouves.push('index.html');
assert.deepEqual(trouves, [], 'reliquats : ' + trouves.join(', '));
console.log(JSON.stringify({ reliquats: 0 }));
