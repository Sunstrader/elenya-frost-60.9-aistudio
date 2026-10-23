#!/usr/bin/env node
// 60.2 (point 4) : cycle complet sauvegarde → stockage (propriétés utilisateur, fragments) → fermeture → nouveau moteur → chargement → reprise,
// sur les 90 sauvegardes 60.1 et les 115 sauvegardes 52.5.4 ; NG+ après chacun des 5 types de game over.
'use strict';
const fs = require('node:fs'), path = require('node:path'), assert = require('node:assert/strict');
const root = path.resolve(__dirname, '../elenya-refonte-52.4');
const { loadEngine } = require(root + '/qa/engine.cjs');
const C = x => JSON.parse(JSON.stringify(x));
const out = {};
function cycle(sv) {
  const props = new Map();
  const a = loadEngine(root + '/project', props).ctx;           // session 1
  const avant = a.serverGetPendingScene(C(sv)); const st = avant.renderedState;
  const r = a.serverSaveGame(C(st)); assert(r && r.ok, 'sauvegarde refusée : ' + JSON.stringify(r).slice(0, 200));
  const b = loadEngine(root + '/project', props).ctx;           // fermeture : nouveau moteur, même stockage
  const l = b.serverLoadGame(st.gameMode); assert(l.ok, 'chargement : ' + l.error);
  const s2 = l.state;
  for (const k of ['currentSceneId', 'gauges', 'flags', 'timers', 'returnStack', 'globalFlags']) assert.deepEqual(C(s2[k]), C(st[k]), 'champ perdu : ' + k);
  const apres = b.serverGetPendingScene(C(s2));
  assert.equal(apres.renderedState.currentSceneId, st.currentSceneId, 'reprise sur une autre scène');
  assert.deepEqual(C((apres.choices || []).map(c => c.key)), C((avant.choices || []).map(c => c.key)), 'choix différents après rechargement');
  assert.equal(apres.narrative, avant.narrative, 'texte différent après rechargement (conséquences différées, relations)');
  const c0 = (apres.choices || [])[0]; if (c0) { const x = b.serverProcessChoice(C(apres.renderedState), c0.key); assert(x && !x.error, 'reprise : premier choix refusé'); }
}
let n = 0;
const F60 = JSON.parse(fs.readFileSync(path.join(__dirname, 'fixtures/sauvegardes-60.1.0.json'), 'utf8')).sauvegardes;
for (const sv of F60) { try { cycle(sv.state); n++; } catch (e) { throw new Error(sv.nom + ' : ' + e.message); } }
out.sauvegardes60 = n + '/' + F60.length;
const F52 = JSON.parse(fs.readFileSync(path.join(__dirname, 'fixtures/sauvegardes-52.5.4.json'), 'utf8')).sauvegardes; n = 0;
for (const [i, sv] of F52.entries()) { try { cycle(sv.state); n++; } catch (e) { throw new Error('52.5.4 #' + i + ' : ' + e.message); } }
out.sauvegardes5254 = n + '/' + F52.length;
// NG+ après chaque type de game over, depuis le déclencheur réel puis CEDER.
const { api } = loadEngine(root + '/project');
const go = s => api.serverGetPendingScene(C({ gameMode: 'classic', flags: [], gauges: {}, timers: {}, ...s }));
const CAS = {
  VENIN: [{ currentSceneId: 'ACTE3_09_ENTREE_SANCTUAIRE', flags: ['urgence_declenchee', 'venin_alerte_vue', 'avec_ombre'], timers: { venin: 0 } }],
  SURCHARGE: [{ currentSceneId: 'ACTE3_08_MISE_AU_POINT', flags: ['_surcharge_sursis_vu', '_surcharge_sursis2_vu', 'avec_ombre'], gauges: { instabilite: 58 } }],
  POSSESSION: [{ currentSceneId: 'ACTE4_08_CORRIDOR_OBSIDIENNE', flags: ['_possession_warning_vu', 'avec_ombre'], gauges: { possession: 25 } }],
  SIRENE: [{ currentSceneId: 'ACTE3_04_ENVOUTEMENT', flags: ['avec_ombre'], gauges: { volonte: 5 } }, 'ABANDON'],
  SCELLEE: [{ currentSceneId: 'ACTE4_06_MASQUE_TOMBE_2', flags: ['avec_ombre'] }, 'SUBMIT'],
};
const lignes = {};
for (const [cat, [e, k]] of Object.entries(CAS)) {
  let d = go(e); if (k) d = api.serverGetPendingScene(C(api.serverProcessChoice(C(d.renderedState), k).updatedState));
  let s = api.serverProcessChoice(C(d.renderedState), 'CEDER').updatedState; s = api.serverGetPendingScene(C(s)).renderedState;
  assert.equal(s.currentSceneId, 'GAME_OVER_' + cat);
  assert(s.globalFlags.includes('last_classic_chute:GAME_OVER_' + cat), cat + ' : chute non mémorisée');
  const ng = api.serverGetPendingScene({ gameMode: 'ngplus', currentSceneId: 'NGP_01_SEUIL', flags: ['ngplus_started'], globalFlags: s.globalFlags });
  const m = String(ng.narrative).match(/La dernière fois[^\n]*/); assert(m, cat + ' : NG+ n’hérite pas de la chute'); lignes[cat] = m[0];
}
assert.equal(new Set(Object.values(lignes)).size, 5, 'héritages NG+ confondus');
out.ngplusApresGameOver = Object.keys(lignes).join(',');
console.log(JSON.stringify(out));
