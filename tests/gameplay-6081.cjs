#!/usr/bin/env node
// 60.8.1 (playtest 608 #2) : après un premier RELEVER, reprendre SUBMIT ne mène plus à un écran d'agonie à choix unique.
'use strict';
const assert = require('node:assert/strict');
const { engine } = require('./lib.cjs'); const { api } = engine();
const go = (id, flags) => api.serverGetPendingScene({ gameMode: 'classic', currentSceneId: id, flags, gauges: {} });
const keys = d => (d.choices || []).map(c => c.key);
const out = {};
{ const a = go('ACTE4_06_MASQUE_TOMBE_2', []); assert(keys(a).includes('SUBMIT') && !keys(a).includes('SUBMIT_FINAL'), 'premier passage : SUBMIT ordinaire');
  const b = go('ACTE4_06_MASQUE_TOMBE_2', ['sceau_dernier_souffle_60']); assert(!keys(b).includes('SUBMIT') && keys(b).includes('SUBMIT_FINAL'), 'second passage seul : abandon explicite');
  const fin = b.choices.find(c => c.key === 'SUBMIT_FINAL'); assert(/sans retour/.test(fin.text), 'libellé explicite');
  const r = api.serverProcessChoice(b.renderedState, 'SUBMIT_FINAL'); assert.equal(api.serverGetPendingScene(r.updatedState).renderedState.currentSceneId, 'GAME_OVER_SCELLEE');
  const c = go('ACTE4_06_MASQUE_TOMBE_2', ['sceau_dernier_souffle_60', 'avec_ombre']); assert(keys(c).includes('SUBMIT'), 'second passage avec Kaelen : agonie gardée');
  const s = go('SCEAU_DERNIER_SOUFFLE', ['sceau_dernier_souffle_60', 'avec_ombre']); assert(keys(s).length >= 2, 'agonie avec aide : au moins deux choix (' + keys(s) + ')');
  out.sceau = 'pas de mort sur choix unique'; }
{ // Profil d'un écran de fin : jamais « En devenir », morts comprises (GAME_OVER_SIRENE l'affichait en 60.8.1 avant correction).
  const H = require('fs').readFileSync(require('path').join(__dirname, '../elenya-refonte-52.4/project/Scripts_Game.html'), 'utf8');
  const m = H.match(/function derivePlayerProfile[\s\S]*?\n}\n/)[0]; const vm = require('vm');
  const f = vm.runInNewContext('(' + m.replace(/^function derivePlayerProfile/, 'function') + ')');
  for (const id of ['GAME_OVER_SIRENE', 'FIN_SOLO', 'NG_FIN_VIDE', 'ACTE5_02_VEILLE']) assert.notEqual(f({ currentSceneId: id, gauges: {}, narrative: {} }).title, 'En devenir', id);
  assert.equal(f({ currentSceneId: 'ACTE1_01', gauges: {}, narrative: {} }).title, 'En devenir');
  assert(/const fini=\/\^\(FIN_\|NG_FIN_\|ACTE5_02_\|GAME_OVER_\)\//.test(H), 'deriveProfile couvre GAME_OVER_');
  out.profilFin = 'OK'; }
console.log(JSON.stringify(out));
