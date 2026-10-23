#!/usr/bin/env node
// 60.1 (audit) : un parcours fixe par écho rare, rejoué et vérifié dans le texte réellement affiché.
// Rare = jamais affiché dans les 200 premières parties de l’outil (tools/gen-echos-rares-601.cjs). Les échos rares sans route
// trouvée sont listés tels quels (résultat négatif conservé) ; ils restent couverts par la preuve statique d’echos-atteints.
'use strict';
const fs = require('node:fs'), path = require('node:path'), assert = require('node:assert/strict');
const { engine, clone } = require('./lib.cjs'); const { api } = engine();
const FX = JSON.parse(fs.readFileSync(path.join(__dirname, 'fixtures/echos-rares-60.8.0.json'), 'utf8'));
const ko = [];
// 60.3 : les fins historiques ont retrouvé leur écran ; un écho de la famille s’affiche sur la fin distincte.
const famille = id => ((api.DB[id] || api.NGPLUS_DB[id] || {}).family) || id;
for (const [cle, r] of Object.entries(FX.routes)) {
  let s = { gameMode: r.mode }, d;
  for (const [id, k] of r.parcours) { d = api.serverGetPendingScene(clone(s)); s = d.renderedState; if (s.currentSceneId !== id) { ko.push(cle + ' (désynchronisé à ' + id + ')'); s = null; break; } s = api.serverProcessChoice(clone(s), k).updatedState; }
  if (!s) continue; d = api.serverGetPendingScene(clone(s));
  if (famille(d.renderedState.currentSceneId) !== r.scene || !String(d.narrative).includes(r.texte)) ko.push(cle);
}
assert.deepEqual(ko, [], 'échos rares non rejoués : ' + ko.join(' | '));
console.log(JSON.stringify({ rares: FX.rares, rejoues: Object.keys(FX.routes).length, sansRoute: FX.sansRoute.length }));
