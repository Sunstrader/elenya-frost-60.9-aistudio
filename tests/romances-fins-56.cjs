#!/usr/bin/env node
// 56.0 — PRIORITÉ ABSOLUE : trio consenti ≠ domination ; rupture non rouverte par jauges.
'use strict';
const path = require('node:path'), assert = require('node:assert/strict');
const { clone } = require('./lib.cjs');
const root = path.resolve(__dirname, '../elenya-refonte-52.4');
const { api } = require(root + '/qa/engine.cjs').loadEngine(root + '/project');
const go = s => api.serverGetPendingScene(clone(s));
const keys = d => (d.choices || []).map(c => c.key);
const out = {};

const trone = (flags, gauges) => go({
  gameMode: 'classic', currentSceneId: 'ACTE4_09_TRONE_EBENE',
  flags: flags || [], gauges: Object.assign({ lien_O: 5, lien_E: 5, affinite_ombre: 5, affinite_eclaireur: 5, instabilite: 0, possession: 0 }, gauges || {})
});

// --- POSITIF : trio consenti ---
{
  const d = trone(['avec_ombre','avec_eclaireur','trio_accord','interet_romantique_O','interet_romantique_E'], { lien_O: 5, lien_E: 5 });
  assert(keys(d).includes('FIN_POLY'), 'positif : FIN_POLY accessible avec trio_accord');
  assert(!keys(d).includes('FIN_DOMINATION'), 'positif : domination absente sans drapeaux de domination');
  out.polyPositif = 'OK';
}
// --- NÉGATIF : poly_eligible + jauges élevées SANS trio_accord ---
{
  const d = trone(['avec_ombre','avec_eclaireur','poly_eligible','interet_romantique_O','interet_romantique_E'], { lien_O: 12, lien_E: 12, presence_O: 12, presence_E: 12, affinite_ombre: 15, affinite_eclaireur: 15 });
  assert(!keys(d).includes('FIN_POLY'), 'négatif : jauges seules ne donnent pas FIN_POLY');
  out.polyNegatifJauges = 'OK';
}
// --- NÉGATIF : domination ne donne PAS FIN_POLY ---
{
  const d = trone(['avec_ombre','avec_eclaireur','go_poly_domination','domination_finale','poly_eligible'], { lien_O: 8, lien_E: 8 });
  assert(!keys(d).includes('FIN_POLY'), 'négatif : domination ≠ FIN_POLY');
  assert(keys(d).includes('FIN_DOMINATION'), 'positif : domination → FIN_DOMINATION');
  const r = api.serverProcessChoice(clone(d.renderedState), 'FIN_DOMINATION');
  const fin = go(r.updatedState);
  assert.equal(fin.renderedState.currentSceneId, 'FIN_DOMINATION', '60.3 : FIN_DOMINATION a retrouvé son propre écran');
  assert.equal(api.DB.FIN_DOMINATION.family, 'FIN_HIVER', '60.3 : FIN_DOMINATION reste de la lignée FIN_HIVER');
  assert(fin.renderedState.flags.includes('variante_FIN_DOMINATION'), 'variante domination posée');
  const narr = String(fin.narrative || '');
  assert(!/accord|ensemble — parce/i.test(narr) || /satellites|ordonné|agenouiller/i.test(narr), 'texte domination distinct');
  out.dominationDistincte = 'OK';
}
// --- NÉGATIF : trio_accord + domination → pas de FIN_POLY (domination gagne) ---
{
  const d = trone(['avec_ombre','avec_eclaireur','trio_accord','domination_finale']);
  assert(!keys(d).includes('FIN_POLY'), 'négatif : domination ferme le trio consenti');
  assert(keys(d).includes('FIN_DOMINATION'));
  out.dominationFermeTrio = 'OK';
}
// --- NÉGATIF : rupture O ferme FIN_OMBRE et FIN_POLY même avec jauges max ---
{
  const d = trone(['avec_ombre','avec_eclaireur','consort_kaelen','nuit_kaelen','joute_gagne_O','trio_accord','romance_O_rompue','interet_romantique_O','interet_romantique_E'],
    { lien_O: 99, lien_E: 99, affinite_ombre: 99, presence_O: 99 });
  assert(!keys(d).includes('FIN_OMBRE'), 'négatif : rupture O → pas FIN_OMBRE');
  assert(!keys(d).includes('FIN_POLY'), 'négatif : rupture O → pas FIN_POLY');
  out.ruptureO = 'OK';
}
// --- NÉGATIF : rupture E ferme FIN_ECLAIREUR et FIN_POLY ---
{
  const d = trone(['avec_ombre','avec_eclaireur','consort_alistair','nuit_alistair','joute_gagne_E','trio_accord','romance_E_rompue'],
    { lien_E: 99, affinite_eclaireur: 99, presence_E: 99 });
  assert(!keys(d).includes('FIN_ECLAIREUR'));
  assert(!keys(d).includes('FIN_POLY'));
  out.ruptureE = 'OK';
}
// --- NÉGATIF : reconversion solo → romance malgré rupture ---
{
  const d = trone(['voie_solo','romance_O_rompue'], { presence_O: 12, lien_O: 8, affinite_ombre: 12 });
  assert(!keys(d).includes('V28_FIN_RECONVERSION_O'), 'négatif : reconversion O bloquée après rupture');
  out.reconversionBloquee = 'OK';
}
// --- NÉGATIF : intimité après rupture (jauges hautes) ---
{
  const d = go({ gameMode:'classic', currentSceneId:'ACTE4_02_CHOIX_CHAMBRE',
    flags:['avec_ombre','avec_eclaireur','interet_romantique_O','interet_romantique_E','romance_reelle_O','romance_reelle_E','romance_O_rompue','romance_E_rompue','felure_O_vue','felure_E_vue'],
    gauges:{ lien_O:12, lien_E:12, distance_O:0, distance_E:0, instabilite:0, possession:0 }});
  assert.equal(d.renderedState.currentSceneId, 'ACTE4_02_CHOIX_CHAMBRE');
  assert(!keys(d).includes('O') && !keys(d).includes('E'), 'négatif : plus d’intimité après double rupture');
  out.intimiteBloquee = 'OK';
}
// --- POSITIF : FIN_OMBRE après romance saine ---
{
  const d = trone(['avec_ombre','consort_kaelen','nuit_kaelen','joute_gagne_O'], { lien_O: 8, affinite_ombre: 10, affinite_eclaireur: 2 });
  assert(keys(d).includes('FIN_OMBRE'), 'positif : FIN_OMBRE accessible');
  out.ombrePositif = 'OK';
}
// --- POSITIF : FIN_ECLAIREUR ---
{
  const d = trone(['avec_eclaireur','consort_alistair','nuit_alistair','joute_gagne_E'], { lien_E: 8, affinite_eclaireur: 10, affinite_ombre: 2 });
  assert(keys(d).includes('FIN_ECLAIREUR'));
  out.eclaireurPositif = 'OK';
}
// --- Save/load : rupture survit ---
{
  const st = { gameMode:'classic', currentSceneId:'ACTE4_09_TRONE_EBENE',
    flags:['avec_ombre','consort_kaelen','nuit_kaelen','joute_gagne_O','romance_O_rompue'],
    gauges:{ lien_O: 20, affinite_ombre: 20, affinite_eclaireur: 0 } };
  // Simule une sauvegarde JSON (round-trip)
  const loaded = JSON.parse(JSON.stringify(st));
  const d = go(loaded);
  assert(!keys(d).includes('FIN_OMBRE'), 'save/load : rupture toujours active');
  out.saveLoadRupture = 'OK';
}
// --- Texte FIN_POLY consensuel (pas de satellites) ---
{
  const d = trone(['avec_ombre','avec_eclaireur','trio_accord','interet_romantique_O','interet_romantique_E','romance_reelle_O','romance_reelle_E']);
  const r = api.serverProcessChoice(clone(d.renderedState), 'FIN_POLY');
  const fin = go(r.updatedState);
  assert.equal(fin.renderedState.currentSceneId, 'FIN_POLY');
  const narr = String(fin.narrative || '');
  assert(!/satellites d’un astre|Tu as ordonné/i.test(narr), 'FIN_POLY sans texte de domination');
  out.textePolyConsenti = 'OK';
}

console.log(JSON.stringify(out));
