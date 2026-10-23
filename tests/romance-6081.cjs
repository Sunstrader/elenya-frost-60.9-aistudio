#!/usr/bin/env node
// 60.8.1 (romance R1-R3, R6 ; QA narratif #1-2) : le dôme ne s'ouvre plus sur un refus imposé ni avec Alistair au cachot ;
// la question à trois peut être refermée par Kaelen ou Alistair eux-mêmes ; texte du Sceau cohérent avec le cachot.
// Base : état réel à ACTE4_01_DEPART_VILLAGE sur la route figée FIN_POLY ; on fait varier un seul paramètre à la fois.
'use strict';
const assert = require('node:assert/strict');
const { engine, clone } = require('./lib.cjs'); const { api } = engine();
const route = require('./fixtures/routes-fins-60.8.0.json').FIN_POLY.parcours;
let s = { gameMode: 'classic' }, avant = null;
for (const [id, key] of route) {
  const d = api.serverGetPendingScene(clone(s)); s = d.renderedState; assert.equal(s.currentSceneId, id, 'route FIN_POLY désynchronisée à ' + id);
  if (id === 'ACTE4_01_DEPART_VILLAGE') { avant = clone(s); break; }
  s = api.serverProcessChoice(clone(s), key).updatedState;
}
assert(avant, 'état DEPART_VILLAGE');
const dome = (modif) => { const st = clone(avant); modif(st); const r = api.serverProcessChoice(clone(st), 'A'); assert(r && !r.error, 'départ refusé');
  const d = api.serverGetPendingScene(clone(r.updatedState)); return { id: d.renderedState.currentSceneId, keys: (d.choices || []).map(c => c.key) }; };
const out = {};
const temoin = dome(() => {}); assert.equal(temoin.id, 'TRIO_NUIT_DOME', 'témoin : le dôme doit s’ouvrir'); assert(temoin.keys.includes('PROPOSER'), 'témoin : PROPOSER offert');
out.temoin = temoin.keys.join(',');
const CAS = {
  alistairAuCachot: st => st.flags.push('alistair_emprisonne'),
  lienE4: st => { st.gauges.lien_E = 4; },
  sansInteretE: st => { st.flags = st.flags.filter(f => !/^(interet_romantique_E|focus_romantique_E|lisiere_romance_E_ouverte)$/.test(f)); },
  alistairRefuse: st => st.flags.push('alistair_refuse'),
  kaelenFroid: st => st.flags.push('joute_froide_O'),
};
for (const [nom, m] of Object.entries(CAS)) { const r = dome(m);
  assert.notEqual(r.id, 'TRIO_NUIT_DOME', nom + ' : le dôme s’ouvre sur un refus imposé (' + r.keys + ')'); out[nom] = 'pas de dôme (' + r.id + ')'; }
// Un refus imposé ne consume plus la question : avec lien_E=4 puis 5 à la fenêtre suivante, le dôme peut encore s'ouvrir.
{ const st = clone(avant); st.gauges.lien_E = 4; let r = api.serverProcessChoice(clone(st), 'A').updatedState; assert(!r.flags.includes('_trio_nuit_vue'), 'question consumée sans dôme'); out.questionIntacte = true; }
// R6 : refermer la question n'appartient pas qu'à Elenya.
{ const R = api.DB.TRIO6033_REFERMER; const base = clone(avant); base.flags = base.flags.filter(f => f !== '_trio_nuit_vue');
  const offre = flags => { const st = clone(base); st.flags.push(...flags); st.currentSceneId = 'TRIO6033_REFERMER'; st.returnStack = ['ACTE3_09B_BIVOUAC_TEMPETE'];
    return (api.serverGetPendingScene(st).choices || []).map(c => c.key); };
  const k0 = offre([]); assert(k0.includes('REFERMER') && k0.includes('LAISSER') && !k0.some(k => /_REFERME$/.test(k)), 'tous deux d’accord : ' + k0);
  const kO = offre(['kaelen_refuse']); assert(kO.includes('LAISSER_O_REFERME') && !kO.includes('LAISSER'), 'Kaelen referme : ' + kO);
  const kE = offre(['alistair_refuse']); assert(kE.includes('LAISSER_E_REFERME') && !kE.includes('LAISSER'), 'Alistair referme : ' + kE);
  for (const k of ['LAISSER_O_REFERME', 'LAISSER_E_REFERME']) { const c = R.choices.find(x => x.key === k); const e = JSON.stringify(c.effects);
    assert(e.includes('trio_question_refermee_6033') && e.includes('REMOVE_FLAG') && !/ADD_GAUGE/.test(e), k + ' : refermer sans punition'); }
  out.refermer = 'Elenya, Kaelen et Alistair'; }
// R1 : le Sceau ne dit plus « Tu l’as libéré » alors que le moteur garde Alistair au cachot.
{ const st = clone(avant); st.flags.push('alistair_emprisonne', '_aveu_parallele_vu'); st.currentSceneId = 'ACTE4_06_MASQUE_TOMBE_1';
  const d = api.serverGetPendingScene(st); assert.equal(d.renderedState.currentSceneId, 'ACTE4_06_MASQUE_TOMBE_1', 'Sceau intercepté');
  const t = String(d.narrative || ''); assert(/Sceau Solaire/.test(t), 'texte du Sceau rendu');
  assert(!/Tu l’as libéré/.test(t) && /rouvert la grille/.test(t), 'Sceau : « libéré » contredit le cachot'); out.sceau = 'cohérent'; }
console.log(JSON.stringify(out));
