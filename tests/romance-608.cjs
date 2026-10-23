#!/usr/bin/env node
// 60.8.0 : romances Kaelen, Alistair, Fen. Refus sans punition, aucun trio sans le oui de chacun,
// aucun baiser sous emprise, moments R608 fermés après domination. Moteur réel, états tirés d'une partie figée.
'use strict';
const assert = require('node:assert/strict');
const { engine, clone } = require('./lib.cjs'); const { api } = engine();
api.serverGetPendingScene({ gameMode: 'classic' }); // applique les couches de refonte
const avec = (s, flags, gauges, sans) => { s = clone(s); s.flags = [...new Set([...(s.flags || []), ...(flags || [])])].filter(f => !(sans || []).includes(f)); s.gauges = Object.assign({}, s.gauges, gauges || {}); return s; };
const offre = st => api.serverGetPendingScene(clone(st)).choices.map(c => c.key);
const out = {};
// 1. Aucun choix de refus ne baisse un lien (scan de toute la base).
const REFUS = /refuse|refusee|refermee|trio_attente|trio_refuse/;
let nRefus = 0;
for (const [id, s] of Object.entries(api.DB)) for (const c of s.choices || []) {
  const e = Array.isArray(c.effects) ? c.effects : [];
  if (!e.some(x => x.type === 'SET_FLAG' && REFUS.test(String(x.target)))) continue; nRefus++;
  const neg = e.filter(x => x.type === 'ADD_GAUGE' && /^(lien_|affinite_|lien_seraphine)/.test(String(x.target)) && Number(x.value) < 0);
  assert(!neg.length, id + '/' + c.key + ' : refus puni ' + JSON.stringify(neg));
}
assert(nRefus >= 8, 'refus recensés : ' + nRefus); out.refusSansPunition = nRefus;
// 2. La question à trois : la réponse dépend de chacun ; le non de l'un ferme l'ouverture.
const Q = api.DB.TRIO6032_QUESTION; const ouvre = c => (c.effects || []).some(x => x.target === 'lisiere_trio_ouvert');
const route = require('./fixtures/routes-fins-60.8.0.json').FIN_POLY.parcours;
let s = { gameMode: 'classic' }, dome = null, auberge = null, halte = null;
for (const [, k] of route) { const d = api.serverGetPendingScene(clone(s)); s = d.renderedState;
  if (s.currentSceneId === 'TRIO_NUIT_DOME' && !dome) dome = clone(s); if (s.currentSceneId === 'HALTE603_AUBERGE' && !auberge) auberge = clone(s); if (s.currentSceneId === 'ACTE4_01_HALTE_DOME' && !halte) halte = clone(s);
  s = api.serverProcessChoice(clone(s), k).updatedState; }
assert(dome, 'partie figée FIN_POLY : dôme traversé');
const base = avec(dome, ['interet_romantique_O', 'interet_romantique_E'], { lien_O: 8, lien_E: 8 }, ['kaelen_refuse', 'alistair_refuse', 'joute_froide_O', 'joute_froide_E']);
const qOffre = st => { const t = clone(st); t.currentSceneId = 'TRIO6032_QUESTION'; return offre(t); };
assert(qOffre(base).includes('ATTENDRE'), 'deux oui → la question peut exister');
for (const [f, attendu] of [['kaelen_refuse', 'ATTENDRE_NON_O'], ['alistair_refuse', 'ATTENDRE_NON_E']]) {
  const k = qOffre(avec(base, [f])); assert(!k.includes('ATTENDRE') && k.includes(attendu), f + ' → ' + attendu + ' (reçu ' + k + ')');
}
assert(qOffre(avec(base, [], { lien_O: 2, lien_E: 2 })).includes('ATTENDRE_NON'), 'liens faibles → double non');
Q.choices.filter(c => c.key !== 'ATTENDRE').forEach(c => assert(!ouvre(c), c.key + ' ne doit pas ouvrir le trio'));
assert(Q.choices.some(c => c.key === 'RETIRER' && !c.condition), 'Elenya peut toujours retirer sa question');
// 3. Le dôme : pas de PROPOSER si la question n'est pas ouverte, ou après domination ; refermer reste possible.
const dOui = avec(dome, ['interet_romantique_O', 'interet_romantique_E'], { lien_O: 8, lien_E: 8 }, ['kaelen_refuse', 'alistair_refuse', 'joute_froide_O', 'joute_froide_E']);
assert(offre(dOui).includes('PROPOSER'), 'deux oui possibles au dôme');
for (const f of ['kaelen_refuse', 'alistair_refuse', 'joute_froide_O', 'joute_froide_E']) { const k = offre(avec(dOui, [f])); assert(!k.includes('PROPOSER') && k.includes('PROPOSER_REFUS'), 'dôme : ' + f + ' → non'); }
assert(!offre(avec(dOui, [], {}, ['interet_romantique_E', 'lisiere_romance_E_ouverte', 'focus_romantique_E'])).includes('PROPOSER'), 'dôme : sans intérêt d’Alistair → non');
for (const x of ['domination_acte3_O', 'domination_acte3_E', 'domination_path_chosen']) assert(!offre(avec(dome, [x])).includes('PROPOSER'), 'PROPOSER après ' + x);
assert(offre(dome).includes('ATTENDRE'), 'attendre toujours offert au dôme');
const ref = avec(base, ['trio_question_6032', 'lisiere_trio_ouvert'], {}, ['_trio_nuit_vue', 'trio_question_refermee_6033']);
if (auberge) { const a = avec(auberge, ['trio_question_6032', 'lisiere_trio_ouvert'], {}, ['_trio_nuit_vue', 'trio_question_refermee_6033']); assert(offre(a).includes('TRIO6033_REFERMER'), 'refermer offert à l’auberge'); }
const sr = clone(ref); sr.currentSceneId = 'TRIO6033_REFERMER'; sr.returnStack = ['HALTE603_AUBERGE'];
const apres = api.serverProcessChoice(sr, 'REFERMER').updatedState;
assert(!apres.flags.includes('lisiere_trio_ouvert') && apres.flags.includes('trio_question_refermee_6033'), 'refermer retire l’ouverture');
['lien_O', 'lien_E'].forEach(g => assert((apres.gauges[g] || 0) >= (sr.gauges[g] || 0), 'refermer sans perte de ' + g));
// 4. Séraphine : baiser fermé sous emprise, ouvert hors emprise.
const ser = avec(dome, [], { lien_seraphine: 6 }); ser.currentSceneId = 'SERAPHINE_COEUR_3_LAME';
assert(offre(avec(ser, [], { possession: 11 })).includes('BAISER'), 'baiser possible hors emprise');
assert(!offre(avec(ser, [], { possession: 12 })).includes('BAISER'), 'baiser fermé sous emprise');
// 5. Moments R608 : fermés après domination ; Kaelen refusé → pas d'ouverture romantique dans la confidence d'Alistair.
assert(halte, 'partie figée : halte du dôme traversée'); const hd = halte;
const kHd = offre(hd); assert(kHd.includes('R608_PRIERE'), 'R608_PRIERE offerte avec Alistair présent');
assert(!offre(avec(hd, ['domination_acte3_E', 'domination_path_chosen'])).includes('R608_PRIERE'), 'R608_PRIERE fermée après domination');
out.prierOfferte = kHd.includes('R608_PRIERE');
// 6. Refus respectés relus au bivouac, sans reproche.
const bv = avec(dome, ['kaelen_refuse', 'avec_ombre']); bv.currentSceneId = 'ACTE3_09B_BIVOUAC_TEMPETE';
const txt = api.serverGetPendingScene(bv).narrative || '';
assert(!/reproch|rancune|tu me dois/i.test(txt), 'bivouac : aucun reproche après refus');
out.ok = true; console.log(JSON.stringify(out));
