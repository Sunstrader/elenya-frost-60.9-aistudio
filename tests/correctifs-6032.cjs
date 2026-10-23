#!/usr/bin/env node
// 60.3.2 : preuves par simulation (moteur réel, parties réelles guidées, états dérivés de ces parties).
'use strict';
const assert = require('node:assert/strict');
const { engine, clone, rng } = require('./lib.cjs'); const { api } = engine();
const out = {};
const DOM = ['crevasse_domination', 'domination_acte3_O', 'domination_acte3_E', 'domination_path_chosen', 'go_poly_domination', 'domination_finale'];
const avec = (s, flags, gauges) => { s = clone(s); s.flags = [...new Set([...(s.flags || []), ...(flags || [])])]; s.gauges = Object.assign({}, s.gauges, gauges || {}); return s; };
const choisir = (s, k) => { const r = api.serverProcessChoice(clone(s), k); assert(r && !r.error, 'choix ' + k + ' refusé : ' + (r && r.error)); return api.serverGetPendingScene(r.updatedState); };
// Partie guidée « trio consenti » : la question de la chaise libre, le oui au dôme, puis FIN_POLY.
const PREF = ['FIN_POLY', 'PROPOSER', 'TRIO6032', 'ATTENDRE', 'HALTE603'];
function joue(seed, pref, quand) {
  const r = rng(seed); let s = { gameMode: 'classic' }; const vus = []; const cap = {}; let avant = null;
  for (let i = 0; i < 500; i++) {
    const d = api.serverGetPendingScene(clone(s)); s = d.renderedState; vus.push(s.currentSceneId);
    if (quand) quand(s, d, avant, cap);
    if (d.isEnd) return { s, d, vus, cap };
    const keys = d.choices.map(c => c.key); const k = pref.find(p => keys.includes(p)) || keys[Math.floor(r() * keys.length)];
    avant = { etat: clone(s), cle: k };
    s = api.serverProcessChoice(clone(s), k).updatedState;
  }
  return { s, vus, cap };
}
// 60.8.0 : d'abord la route figée FIN_POLY (fixtures/routes-fins-60.8.0.json), rejouée avec les mêmes captures ;
// la recherche guidée reste en secours. Depuis la 60.3.3, la même question posée au bivouac a sa propre scène
// (TRIO6033_BIVOUAC, décor du bivouac, mêmes réponses selon l'état de chacun) : elle compte comme la question de la chaise libre. Les assertions ci-dessous sont inchangées.
function rejouer(parcours, quand) {
  let s = { gameMode: 'classic' }; const vus = []; const cap = {}; let avant = null;
  for (const [, k] of parcours) {
    const d = api.serverGetPendingScene(clone(s)); s = d.renderedState; vus.push(s.currentSceneId);
    if (quand) quand(s, d, avant, cap); avant = { etat: clone(s), cle: k };
    s = api.serverProcessChoice(clone(s), k).updatedState;
  }
  const d = api.serverGetPendingScene(clone(s)); s = d.renderedState; vus.push(s.currentSceneId); if (quand) quand(s, d, avant, cap);
  return { s, d, vus, cap };
}
const CAPT = (s, d, avant, cap) => {
  if (s.currentSceneId === 'TRIO_NUIT_DOME' && !cap.dome) cap.dome = { avant: clone(avant), d };
  if (s.currentSceneId === 'ARC58_KAELEN_TROIS_NOMS' && !cap.tenir) cap.tenir = s;
  if (s.currentSceneId === 'ACTE4_09_TRONE_EBENE' && !cap.trone) cap.trone = s;
};
let poly = null;
{ const rec = require('./fixtures/routes-fins-60.8.0.json').FIN_POLY;
  if (rec) { const p = rejouer(rec.parcours, CAPT); if (p.s.currentSceneId === 'FIN_POLY' && (p.vus.includes('TRIO6032_QUESTION') || p.vus.includes('TRIO6033_BIVOUAC')) && p.cap.dome) poly = Object.assign(p, { seed: 'fixture' }); } }
for (let seed = 13; seed < 13 * 800 && !poly; seed += 13) {
  const p = joue(seed, PREF, (s, d, avant, cap) => {
    if (s.currentSceneId === 'TRIO_NUIT_DOME' && !cap.dome) cap.dome = { avant: clone(avant), d };
    if (s.currentSceneId === 'ARC58_KAELEN_TROIS_NOMS' && !cap.tenir) cap.tenir = s;
    if (s.currentSceneId === 'ACTE4_09_TRONE_EBENE' && !cap.trone) cap.trone = s;
  });
  if (p.s.currentSceneId === 'FIN_POLY' && p.vus.includes('TRIO6032_QUESTION') && p.cap.dome) poly = Object.assign(p, { seed });
}
assert(poly, 'aucune partie guidée ne mène à FIN_POLY par la question de la chaise libre');
// 2. FIN_POLY atteignable par un vrai choix consenti, oui explicites, sans « enchaînés ».
{
  const f = poly.s.flags;
  assert(f.includes('trio_question_6032') && f.includes('lisiere_trio_ouvert') && f.includes('trio_accord'), 'question → ouverture → accord');
  const prop = api.DB.TRIO_NUIT_DOME.choices.find(c => c.key === 'PROPOSER');
  assert((prop.response.match(/« Oui/g) || []).length >= 3, 'trois « Oui » explicites au dôme (Kaelen, Alistair, Kaelen à Alistair)');
  assert(!/une fin à trois vous attend/.test(prop.journal), 'journal sans « récompense »');
  const q = api.DB.TRIO6032_QUESTION.choices.find(c => c.key === 'ATTENDRE');
  assert((q.response.match(/« Oui|Oui\. »|« Moi aussi\. Oui/g) || []).length >= 2, 'oui explicites à l’auberge');
  assert(!/enchaînés/.test(poly.d.narrative), 'FIN_POLY consenti sans « enchaînés »');
  const pause = avec(poly.s, ['romance_en_pause_O', 'double_jeu', 'poly_repare_60']); pause.currentSceneId = 'FIN_POLY';
  const tp = api.serverGetPendingScene(pause).narrative;
  assert(!/enchaînés/.test(tp) && /L’accord du dôme tient/.test(tp), 'trio consenti + pause : pas de branche possession');
  out.poly = 'graine ' + poly.seed + ' : chaise libre (oui ×2) → dôme (oui ×3) → FIN_POLY, sans « enchaînés » (pause comprise)';
}
// 1. Aucune romance ni trio après une domination ou une emprise.
{
  // Rejoue le dernier choix avant le dôme, depuis le même état augmenté d'une domination.
  const { etat, cle } = poly.cap.dome.avant;
  const apres = st => { const r = api.serverProcessChoice(clone(st), cle); return api.serverGetPendingScene(r.updatedState).renderedState.currentSceneId; };
  assert.equal(apres(etat), 'TRIO_NUIT_DOME', 'témoin : dôme déclenché');
  for (const x of DOM) assert.notEqual(apres(avec(etat, [x])), 'TRIO_NUIT_DOME', 'dôme fermé par ' + x);
  assert.notEqual(apres(avec(etat, [], { possession: 12 })), 'TRIO_NUIT_DOME', 'dôme fermé par l’emprise');
  // PROPOSER → PROPOSER_REFUS au dôme après « À genoux ».
  const dome = poly.cap.dome.d.renderedState;
  assert(api.serverGetPendingScene(clone(dome)).choices.some(c => c.key === 'PROPOSER'), 'témoin PROPOSER');
  const dd = api.serverGetPendingScene(avec(dome, ['domination_acte3_O', 'domination_path_chosen'])).choices.map(c => c.key);
  assert(!dd.includes('PROPOSER') && dd.includes('PROPOSER_REFUS'), 'PROPOSER fermé après À genoux');
  // FIN_POLY, FIN_OMBRE, FIN_ECLAIREUR, reconversions : conditions réelles évaluées sur l’état du Trône.
  const trone = poly.cap.trone; assert(trone, 'Trône capturé');
  const offre = st => api.serverGetPendingScene(clone(st)).choices.map(c => c.key);
  assert(offre(trone).includes('FIN_POLY'), 'témoin : FIN_POLY offerte');
  const ROM = ['FIN_POLY', 'FIN_OMBRE', 'FIN_ECLAIREUR', 'V28_FIN_RECONVERSION_O', 'V28_FIN_RECONVERSION_E'];
  for (const x of ['domination_acte3_O', 'domination_acte3_E', 'domination_path_chosen', 'crevasse_domination']) {
    const k = offre(avec(trone, [x])); ROM.forEach(r => assert(!k.includes(r), r + ' offerte après ' + x));
  }
  // Témoin « l’autre partenaire » : consort Kaelen après « À genoux, Alistair ».
  const ombre = avec(trone, ['consort_kaelen', 'avec_ombre', 'joute_gagne_O'], { lien_O: 8, affinite_ombre: 20, possession: 0 });
  assert(offre(ombre).includes('FIN_OMBRE'), 'témoin FIN_OMBRE');
  assert(!offre(avec(ombre, ['domination_acte3_E', 'domination_path_chosen'])).includes('FIN_OMBRE'), 'FIN_OMBRE fermée après domination d’Alistair');
  // Tendresses 57/58 : TENIR et GARDER.
  const scene = (id, st) => { const s = clone(st); s.currentSceneId = id; return s; };
  const base58 = avec(trone, ['kaelen_conflit_resolu_57', 'alistair_promesse_choix_57'], { possession: 0 });
  const k1 = api.serverGetPendingScene(scene('ARC58_KAELEN_TROIS_NOMS', base58)).choices.map(c => c.key);
  const k2 = api.serverGetPendingScene(scene('ARC58_ALISTAIR_PRIERE', base58)).choices.map(c => c.key);
  assert(k1.includes('TENIR') && k2.includes('GARDER'), 'témoin tendresses');
  const d58 = avec(base58, ['domination_acte3_O', 'domination_path_chosen']);
  assert(!api.serverGetPendingScene(scene('ARC58_KAELEN_TROIS_NOMS', d58)).choices.some(c => c.key === 'TENIR'), 'TENIR fermé');
  assert(!api.serverGetPendingScene(scene('ARC58_ALISTAIR_PRIERE', d58)).choices.some(c => c.key === 'GARDER'), 'GARDER fermé (domination de l’autre)');
  // La question de la chaise libre n'apparaît pas après une domination.
  const fn = api.DB.HALTE603_AUBERGE.choices.find(c => c.key === 'TRIO6032').condition;
  const gsDe = st => ({ hasFlag: f => st.flags.includes(f), getGauge: g => st.gauges[g] || 0 });
  const st0 = avec(trone, [], { lien_O: 6, lien_E: 6, possession: 0 }); st0.flags = st0.flags.filter(f => !['lisiere_trio_ouvert', '_trio6032_question_vue', 'trio_refuse', '_trio_nuit_vue', 'trio_accord', 'kaelen_refuse', 'alistair_refuse'].includes(f)); // 60.8.0 : la partie figée décline une nuit seule à l'acte 4, après la question ; on retire ces drapeaux postérieurs pour reconstituer l'état d'avant
  assert(fn(gsDe(st0)), 'témoin question');
  DOM.forEach(x => assert(!fn(gsDe(avec(st0, [x]))), 'question fermée par ' + x));
  out.domination = 'dôme, PROPOSER, FIN_POLY/OMBRE/ECLAIREUR, reconversions, TENIR/GARDER, chaise libre : fermés par chaque domination (et l’emprise pour le dôme) ; témoins ouverts';
}
// 3. Dettes : réglables au seuil du Trône, « manquée » sinon.
{
  const p = joue(13 * 7, [], (s, d, a, cap) => { if (s.currentSceneId === 'ACTE4_08_SEUIL_ETERNITE' && !cap.seuil) cap.seuil = s; });
  let seuil = p.cap.seuil;
  for (let sd = 2; !seuil && sd < 400; sd++) seuil = joue(sd * 29, [], (s, d, a, cap) => { if (s.currentSceneId === 'ACTE4_08_SEUIL_ETERNITE' && !cap.seuil) cap.seuil = s; }).cap.seuil;
  assert(seuil, 'seuil jamais atteint');
  const net = clone(seuil); net.flags = net.flags.filter(f => !/^dette_/.test(f)); delete net.returnStack;
  const etat = d => (d.quetes603 || []).find(q => q.id === 'dette');
  // Une seule confrontation : rendre le contrat à Kaelen.
  const un = avec(net, ['dette_O_confrontee']); const d1 = api.serverGetPendingScene(un);
  assert(d1.choices.some(c => c.key === 'DETTE6032_RENDRE_O'), 'choix RENDRE_O au seuil');
  assert.equal(etat(choisir(d1.renderedState, 'DETTE6032_RENDRE_O')).etat, 'accomplie', 'une dette rendue → accomplie');
  // Franchir le seuil sans décider : manquée.
  const cle = d1.choices.find(c => c.key === 'S') ? 'S' : d1.choices.filter(c => !/^DETTE6032/.test(c.key))[0].key;
  assert.equal(etat(choisir(d1.renderedState, cle)).etat, 'manquée', 'seuil franchi sans décision → manquée');
  // Deux confrontations : révélation puis choix, depuis le seuil.
  const deux = api.serverGetPendingScene(avec(net, ['dette_O_confrontee', 'dette_E_confrontee']));
  const rv = choisir(deux.renderedState, 'DETTE6032_REVELATION'); assert.equal(rv.renderedState.currentSceneId, 'DETTE_REVELATION');
  const back = choisir(rv.renderedState, 'PERSONNEL'); assert.equal(back.renderedState.currentSceneId, 'ACTE4_08_SEUIL_ETERNITE', 'retour au seuil');
  const ch = choisir(back.renderedState, 'DETTE6032_CHOIX'); const fin = choisir(ch.renderedState, 'RENDRE');
  assert.equal(etat(fin).etat, 'accomplie', 'révélation → choix → accomplie');
  out.dette = 'seuil : une dette rendue → accomplie ; franchi sans décider → manquée ; deux dettes : révélation → choix → accomplie';
}
// 4. Lignée « Trône de Vérité » et « cesser de mentir » retirées des fins sans vérité.
{
  const base = clone(poly.cap.trone);
  const rend = (id, fl) => { const s = avec(base, fl); s.currentSceneId = id; return api.serverGetPendingScene(s).narrative || ''; };
  for (const id of ['FIN_TEMOIN', 'FIN_EQUILIBRE', 'FIN_RECONCILIATION', 'FIN_DETTE_ANNULEE']) {
    const t = rend(id, ['variante_' + id]);
    assert(/lignée « Les Trônes partagés »/.test(t) && !/Trône de Vérité|cesser de mentir/.test(t), id);
  }
  assert(/lignée « Le Trône de Vérité »/.test(rend('FIN_REDEMPTION', ['variante_FIN_REDEMPTION'])), 'FIN_REDEMPTION inchangée');
  out.lignees = '4 fins → « Les Trônes partagés », sans « cesser de mentir » ; REDEMPTION inchangée';
}
console.log(JSON.stringify(out));
