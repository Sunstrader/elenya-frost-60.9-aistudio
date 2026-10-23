#!/usr/bin/env node
// 60.2 (point 4) : les 5 morts depuis des parcours réalistes (routes complètes depuis une partie neuve, aucun état injecté),
// puis les deux conséquences à l'agonie : céder → le bon GAME_OVER ; survivre → la partie continue avec un coût visible.
'use strict';
const assert = require('node:assert/strict');
const { engine, clone } = require('./lib.cjs'); const { api } = engine();
const R = require('./fixtures/routes-fins-60.8.0.json');
const AGONIE = /^AGONIE_|_DERNIER_SOUFFLE$/;
const out = {};
for (const cat of ['VENIN', 'SURCHARGE', 'POSSESSION', 'SIRENE', 'SCELLEE']) {
  const rec = R['GAME_OVER_' + cat]; assert(rec, cat + ' : pas de route');
  let s = { gameMode: 'classic' }, d;
  for (const [id, k] of rec.parcours) { d = api.serverGetPendingScene(clone(s)); s = d.renderedState; assert.equal(s.currentSceneId, id); if (AGONIE.test(id) && k === 'CEDER') break; s = api.serverProcessChoice(clone(s), k).updatedState; }
  assert(AGONIE.test(s.currentSceneId), cat + ' : la route ne passe pas par une agonie');
  const agonie = clone(s), choix = d.choices.map(c => c.key);
  const ceder = api.serverGetPendingScene(clone(api.serverProcessChoice(clone(agonie), 'CEDER').updatedState));
  assert.equal(ceder.renderedState.currentSceneId, 'GAME_OVER_' + cat, cat + ' : céder');
  const survies = {};
  for (const k of choix.filter(k => k !== 'CEDER')) {
    let t = api.serverProcessChoice(clone(agonie), k).updatedState; const g0 = agonie.gauges || {}, g1 = t.gauges || {};
    const cout = Object.keys({ ...g0, ...g1 }).filter(x => (g0[x] || 0) !== (g1[x] || 0)).map(x => x + (((g1[x] || 0) - (g0[x] || 0)) > 0 ? '+' : '') + ((g1[x] || 0) - (g0[x] || 0)));
    const drapeaux = (t.flags || []).filter(f => !(agonie.flags || []).includes(f));
    let n = 0, fin = null; const vues = [], textes = {};
    for (; n < 400; n++) { const e = api.serverGetPendingScene(clone(t)); t = e.renderedState; vues.push(t.currentSceneId); textes[t.currentSceneId] = String(e.narrative || ''); if (e.isEnd) { fin = t.currentSceneId; break; }
      const c = (e.choices || []).find(c => !/^(CEDER|ABANDON|SUBMIT)$/.test(c.key)) || (e.choices || [])[0]; if (!c) break; t = api.serverProcessChoice(clone(t), c.key).updatedState; }
    assert(!AGONIE.test(vues[0]) && !/^GAME_OVER_/.test(vues[0]), cat + '/' + k + ' : la survie ne ramène pas au jeu');
    assert(cout.length || drapeaux.length, cat + '/' + k + ' : survie sans aucune conséquence');
    if (k === 'OUVRIR' && textes.ACTE4_09_TRONE_EBENE !== undefined) assert(/Ta main s’est déjà ouverte/.test(textes.ACTE4_09_TRONE_EBENE), 'POSSESSION : la survie n’est pas relue au Trône');
    survies[k] = { trone: textes.ACTE4_09_TRONE_EBENE === undefined ? 'non visité' : 'visité', retour: vues[0], scenesEnsuite: n, issue: fin || 'non terminée', cout, drapeaux };
  }
  assert(Object.keys(survies).length >= 1, cat + ' : aucun choix de survie');
  out[cat] = { agonie: agonie.currentSceneId, choixRoute: rec.parcours.length, survies };
}
console.log(JSON.stringify(out));
