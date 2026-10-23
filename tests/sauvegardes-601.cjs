#!/usr/bin/env node
// 60.1 (audit T05) : sauvegardes au format 60 (90 états figés : 9 parcours, NG+, agonies, Trône, écrans de fin),
// garde du format (clés et schemaVersion figées : un changement exige un test de migration et une copie de secours),
// et héritage NG+ après un game over.
'use strict';
const fs = require('node:fs'), path = require('node:path'), assert = require('node:assert/strict');
const { engine, clone } = require('./lib.cjs'); const { api } = engine();
const FX = JSON.parse(fs.readFileSync(path.join(__dirname, 'fixtures/sauvegardes-60.1.0.json'), 'utf8'));
const out = {};
// 1. Chaque sauvegarde 60 se recharge sur la même scène, avec les mêmes choix.
let ko = [];
for (const sv of FX.sauvegardes) { const d = api.serverGetPendingScene(clone(sv.state));
  const cles = (d.choices || []).map(c => c.key);
  // Compatibilité : même scène, et chaque choix d’origine reste offert. Un choix AJOUTÉ (60.1 : TENUE, MAIN_TENDUE) est listé, pas masqué.
  // 60.3.2 : un choix de romance ou de trio peut disparaître d'une sauvegarde UNIQUEMENT si elle porte une domination
  // (doctrine « domination → aucune romance », docs/60.3.2/RAPPORT.md). Chaque retrait est listé dans le résultat.
  const retires = sv.attendu.choix.filter(k => !cles.includes(k));
  const dom = ['crevasse_domination','domination_acte3_O','domination_acte3_E','domination_path_chosen','go_poly_domination','domination_finale'].some(f => (sv.state.flags || []).includes(f)) || ((sv.state.gauges || {}).possession || 0) >= 12;
  const ROMANCE6032 = ['FIN_OMBRE','FIN_ECLAIREUR','FIN_POLY','V28_FIN_RECONVERSION_O','V28_FIN_RECONVERSION_E','POLY_REPARER','PROPOSER','TENIR','GARDER','TRIO6032'];
  const admis = dom && retires.length && retires.every(k => ROMANCE6032.includes(k));
  if (admis) (out.retraitsDomination6032 ||= []).push(sv.nom + ':' + retires.join('+'));
  if (d.renderedState.currentSceneId !== sv.attendu.scene || (retires.length && !admis)) ko.push(sv.nom);
  const ajouts = cles.filter(k => !sv.attendu.choix.includes(k)); if (ajouts.length) (out.choixAjoutes ||= []).push(sv.nom + ':' + ajouts.join('+')); }
assert.deepEqual(ko, [], 'sauvegardes 60 rechargées autrement : ' + ko.join(' | '));
out.sauvegardes60 = FX.sauvegardes.length + ' (dont NG+ ' + FX.sauvegardes.filter(s => s.state.gameMode === 'ngplus').length + ')';
// 2. Garde du format.
const neuf = api.serverGetPendingScene({ gameMode: 'classic' }).renderedState;
const cles = Object.keys(neuf).sort();
const migration = fs.existsSync(path.join(__dirname, 'migration-sauvegardes.cjs'));
assert(JSON.stringify(cles) === JSON.stringify(FX.format) || migration, 'format de sauvegarde modifié sans test de migration : ' + cles.filter(k => !FX.format.includes(k)).concat(FX.format.filter(k => !cles.includes(k))).join(','));
assert.equal(neuf.schemaVersion, FX.sauvegardes[0].state.schemaVersion, 'schemaVersion modifié sans migration');
out.format = 'inchangé (' + cles.length + ' clés, schemaVersion ' + neuf.schemaVersion + ')';
// 3. NG+ après un game over : la chute et les liens sont hérités.
let s = api.serverGetPendingScene({ gameMode: 'classic', currentSceneId: 'ACTE3_04_ENVOUTEMENT', flags: ['avec_ombre', 'romance_O_rompue'], gauges: { volonte: 5 } }).renderedState;
s = api.serverProcessChoice(clone(s), 'ABANDON').updatedState; s = api.serverGetPendingScene(clone(s)).renderedState;
assert.equal(s.currentSceneId, 'SIRENE_DERNIER_SOUFFLE');
s = api.serverProcessChoice(clone(s), 'CEDER').updatedState;
assert(s.globalFlags.includes('last_classic_chute:GAME_OVER_SIRENE'), 'chute non mémorisée');
assert(s.globalFlags.includes('last_classic_lien:romance_O_rompue'), 'liens non hérités après game over');
const ng = api.serverGetPendingScene({ gameMode: 'ngplus', currentSceneId: 'NGP_01_SEUIL', flags: ['ngplus_started'], globalFlags: s.globalFlags });
assert.match(String(ng.narrative), /fermé les yeux sur une mélodie/); assert.match(String(ng.narrative), /main d’assassin/);
// une fin atteinte ensuite efface la chute
const fin = api.serverGetPendingScene({ gameMode: 'classic', currentSceneId: 'ACTE4_09_TRONE_EBENE', flags: [], globalFlags: s.globalFlags, gauges: {} });
const k = (fin.choices || []).find(c => c.key === "FIN_BRISEE");
assert(k, "FIN_BRISEE absente du Trône"); { const r = api.serverProcessChoice(clone(fin.renderedState), k.key).updatedState; assert(!r.globalFlags.some(f => f.startsWith('last_classic_chute:')), 'chute gardée après une fin'); out.finEfface = k.key; }
out.ngplusApresGameOver = 'OK';
console.log(JSON.stringify(out));
