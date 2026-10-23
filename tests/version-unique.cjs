#!/usr/bin/env node
// 59 : une seule version. package.json fait foi ; le moteur, le repli UI, README et AGENTS doivent la reprendre,
// et aucune ancienne version ne doit être affichée par défaut.
'use strict';
const fs = require('fs'), path = require('path'), assert = require('assert/strict');
const R = path.resolve(__dirname, '..'), P = path.join(R, 'elenya-refonte-52.4/project');
const v = JSON.parse(fs.readFileSync(path.join(R, 'package.json'))).version;
const lire = f => fs.readFileSync(path.join(P, f), 'utf8');
assert(lire('22_State.js').includes(`const BUILD_VERSION = '${v}'`), 'BUILD_VERSION');
assert(lire('Scripts_Game.html').includes(`var ELENYA_VERSION_REPLI='${v}'`), 'repli UI');
for (const f of ['Scripts_Game.html', 'Scripts_Refonte.html']) assert(!/engineVersion \|\| '5\d\.\d\.\d'/.test(lire(f)), f + ' : repli figé');
for (const f of ['README.md', 'AGENTS.md']) { const t = fs.readFileSync(path.join(R, f), 'utf8'); assert(t.includes(v), f + ' cite ' + v); assert(!/52\.5\.4/.test(t), f + ' : 52.5.4'); }
// Libellés UI en français, une seule graphie.
for (const f of ['Game_Interface.html']) { const t = lire(f); assert(!/New Game\+|NEW GAME\+|AUTO-SAVE|Retour au menu principal/.test(t), f + ' : libellé anglais/variante'); }
const sg = lire('Scripts_Game.html').replace(/const I18N[\s\S]*?\n\};/, '');
assert(!/textContent\s*=\s*[^;]*'NEW GAME\+/.test(sg) && !/'Retourner au menu'|<span>Retourner au menu/.test(sg), 'Scripts_Game : libellés');
console.log(JSON.stringify({ version: v, ok: true }));
