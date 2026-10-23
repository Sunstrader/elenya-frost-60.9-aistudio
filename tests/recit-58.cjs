#!/usr/bin/env node
// 58.0 — branches réelles, arcs/romances approfondis, NG+ recadré (positifs + négatifs).
'use strict';
const path = require('node:path'), assert = require('node:assert/strict');
const { clone } = require('./lib.cjs');
const root = path.resolve(__dirname, '../elenya-refonte-52.4');
const { api } = require(root + '/qa/engine.cjs').loadEngine(root + '/project');
const G0 = { lien_O: 5, lien_E: 5, affinite_ombre: 5, affinite_eclaireur: 5, instabilite: 0, possession: 0, volonte: 5 };
const go = (id, flags, gauges, mode) => api.serverGetPendingScene(clone({ gameMode: mode || 'classic', currentSceneId: id, flags: flags || [], gauges: Object.assign({}, G0, gauges || {}) }));
// Lecture directe de la scène (sans déclencheurs de redirection) avec un état simulé.
const mock = (flags, gauges) => { const g = Object.assign({}, G0, gauges || {}); return { flags: flags || [], gauges: g, hasFlag: f => (flags || []).includes(f), getGauge: k => g[k] || 0, hasGlobalFlag: () => false, hasItem: () => false, getLastClassicEnding: () => null, timers: {}, ngPlus: {} }; };
const scene = (id, flags, gauges) => { const S = api.DB[id] || api.NGPLUS_DB[id]; assert(S, 'scène ' + id); const gs = mock(flags, gauges);
  const n = typeof S.getDynamicNarrative === 'function' ? S.getDynamicNarrative(gs) : (S.text || S.narrative || '');
  const ch = (S.choices || []).filter(c => { try { return !c.condition || c.condition(gs); } catch (_) { return false; } });
  return { narrative: n, choices: ch, direct: true }; };
const keys = d => (d.choices || []).map(c => c.key);
const txt = d => String(d.narrative || '');
const out = {};
api.serverGetPendingScene(clone({ gameMode: 'classic', currentSceneId: 'ACTE1_08_SECRET', flags: [], gauges: {} })); // applique les couches 54-57

const play = (id, flags, gauges, key, mode) => { const d = go(id, flags, gauges, mode); assert(keys(d).includes(key), id + ' : ' + key + ' proposé'); const r = api.serverProcessChoice(clone(d.renderedState), key); assert(r && !r.error, key); return r.updatedState; };
// B1 : promesse d’Alistair → autre scène, autre suite (pas de MASQUE_TOMBE_2)
{
  assert(keys(scene('ACTE4_06_MASQUE_TOMBE_1', ['alistair_promesse_choix_57'])).includes('V58_ARC58_ALISTAIR_SERRURE'));
  assert(!keys(scene('ACTE4_06_MASQUE_TOMBE_1', [])).includes('V58_ARC58_ALISTAIR_SERRURE'));
  assert(keys(scene('ACTE4_06_MASQUE_TOMBE_1', ['alistair_erreur_coupe_57'])).includes('V58_ARC58_ALISTAIR_ABSENT'));
  const S = api.DB.ARC58_ALISTAIR_SERRURE; assert(S.choices.every(c => c.next === 'ACTE4_06_OMBRE_AVEU'), 'branche : saute la confrontation');
  assert(/sans médaillon/.test(txt(scene('ACTE4_06_OMBRE_AVEU', ['allie_alistair_58']))));
  out.alistairBranche = 'OK';
}
// B3 Silas allié, B4 Veyra témoin (conditionné par ce qu’on a demandé à l’acte 2), B5 instabilité/possession au Trône
{
  assert(keys(scene('ACTE4_06_MASQUE_TOMBE_1', ['portes_silas_57'])).includes('V58_ARC58_POTERNE_SILAS'));
  assert(keys(scene('ACTE4_09_TRONE_EBENE', [], { instabilite: 30 })).includes('V58_ARC58_TEMPETE_RENDUE'));
  assert(!keys(scene('ACTE4_09_TRONE_EBENE', [], { instabilite: 30, possession: 15 })).includes('V58_ARC58_TEMPETE_RENDUE'));
  assert(keys(scene('ACTE4_09_TRONE_EBENE', [], { possession: 15 })).includes('V58_ARC58_EMPRISE_LACHEE'));
  const v = api.DB.ARC58_VEYRA_TEMOIN; const gsQ = mock(['veyra_question_57']), gs0 = mock([]);
  assert(v.choices[0].condition(gsQ) && !v.choices[0].condition(gs0), 'Veyra témoin seulement si on a écouté tôt');
  out.branchesTrone = 'OK';
}
// B2 : épilogue du village différent selon le grain
{
  const t = f => txt(scene('ARC58_EPILOGUE_VILLAGE', [f]));
  const a = t('grain_partage_57'), b = t('grain_refugies_57'), c = t('grain_deserteurs_57'), d = t('grain_ordonne_57');
  assert(new Set([a, b, c, d]).size === 4, 'quatre épilogues distincts');
  out.epilogueVillage = 'OK';
}
// Romances : scènes riches, gated par la disponibilité
{
  const K = api.DB.ARC58_KAELEN_TROIS_NOMS.choices.find(c => c.key === 'TENIR');
  assert(K.condition(mock(['avec_ombre','interet_romantique_O'], { lien_O: 8 })) !== undefined);
  assert(K.condition(mock(['romance_O_rompue'], { lien_O: 15 })) === false, 'rupture : pas de tendresse avec Kaelen');
  const A = api.DB.ARC58_ALISTAIR_PRIERE.choices.find(c => c.key === 'GARDER');
  assert(A.condition(mock(['romance_E_rompue'], { lien_E: 15 })) === false, 'rupture : pas de tendresse avec Alistair');
  assert(keys(scene('ACTE4_01_HALTE_DOME', ['seraphine_conflit_repare_57'])).includes('V58_ARC58_SERAPHINE_LISTE'));
  assert(keys(scene('ACTE4_01_DEPART_VILLAGE', ['solo_choix_definitif_acte3'])).includes('V58_ARC58_SOLO_CRETE'));
  assert(/maison/.test(txt(scene('ACTE5_01_LENDEMAIN', ['solo_voeu_maison_58']))));
  out.romances = 'OK';
}
// NG+ : recadrages
{
  assert(keys(scene('NGP_13_BRASIER', ['ngplus_savoir_ravin_57'])).includes('V58_NGP58_RAVIN_REVU'));
  assert(!keys(scene('NGP_13_BRASIER', [])).includes('V58_NGP58_RAVIN_REVU'));
  assert(keys(scene('NGP_15_DERNIER_CHOIX', ['ngplus_architecte_demande'])).includes('V58_NGP58_PREMIERE_ELENYA'));
  assert(keys(scene('NGP_09_DEUX_ECHOS', ['ngplus_contrat_kaelen'])).includes('V58_NGP58_KAELEN_SANS_CONTRAT'));
  const st = play('NGP_13_BRASIER', ['ngplus_savoir_ravin_57'], {}, 'V58_NGP58_RAVIN_REVU', 'ngplus');
  assert.equal(st.currentSceneId, 'NGP58_RAVIN_REVU');
  out.ngplus = 'OK';
}
{ // Veyra témoin : atteignable après le dernier pacte (corrigé en 58 : l’entrée était sur le Trône, avant le drapeau)
  const C2 = x => JSON.parse(JSON.stringify(x));
  let s = { gameMode:'classic', currentSceneId:'VEYRA_DERNIER_PACTE', flags:['veyra_graine_57','veyra_mensonge_avoue','veyra_question_57','veyra_verite_decouverte'], returnStack:['ACTE4_09_ISSUES_SECONDAIRES'] };
  let d = api.serverGetPendingScene(C2(s)); s = api.serverProcessChoice(C2(d.renderedState), 'EGALE_57').updatedState;
  d = api.serverGetPendingScene(C2(s)); assert(d.choices.some(c => c.key === 'V58_ARC58_VEYRA_TEMOIN'), 'entrée Veyra témoin');
  s = api.serverProcessChoice(C2(d.renderedState), 'V58_ARC58_VEYRA_TEMOIN').updatedState; d = api.serverGetPendingScene(C2(s));
  s = api.serverProcessChoice(C2(d.renderedState), 'ACCEPTE').updatedState; d = api.serverGetPendingScene(C2(s));
  assert(String(d.narrative).includes('Veyra se tient près'), 'écho témoin'); out.veyra_temoin = 'OK';
}
console.log(JSON.stringify(out));
