#!/usr/bin/env node
// 60.1 (audit, phase 2) : une route déterministe rejouée par fin (36), puis des routes négatives au Trône
// (solo, rupture, domination, compagnon absent, refus du trio) et les états de personnages (Oraya, Alistair, Séraphine).
'use strict';
const fs = require('node:fs'), path = require('node:path'), assert = require('node:assert/strict');
const { engine, clone } = require('./lib.cjs'); const { api } = engine();
const R = JSON.parse(fs.readFileSync(path.join(__dirname, 'fixtures/routes-fins-60.8.0.json'), 'utf8'));
const fins = [...Object.keys(api.DB).filter(k => api.DB[k].isEnd).map(k => [k, 'classic']), ...Object.keys(api.NGPLUS_DB).filter(k => api.NGPLUS_DB[k].isEnd).map(k => [k, 'ngplus'])];
const out = { fins: fins.length, rejouees: 0, sansRoute: [] };
const TRONE = 'ACTE4_09_TRONE_EBENE';
let etatTrone = null;
function rejoue(rec, arret) {
  let s = { gameMode: rec.mode || 'classic' };
  for (const [id, key] of rec.parcours) {
    const d = api.serverGetPendingScene(clone(s)); s = d.renderedState;
    assert.equal(s.currentSceneId, id, 'route désynchronisée à ' + id);
    if (arret && id === arret) return s;
    const r = api.serverProcessChoice(clone(s), key); assert(r && !r.error, 'choix refusé ' + id + '/' + key); s = r.updatedState;
  }
  return api.serverGetPendingScene(clone(s)).renderedState;
}
for (const [fin, mode] of fins) {
  const rec = R[fin]; if (!rec) { out.sansRoute.push(fin); continue; }
  const s = rejoue(rec);
  // 60.8.1 (P0) : identifiant exact. Plus de validation par famille ni par drapeau de variante seul :
  // en 60.8.0, NG_FIN_LIBERATION était « validée » parce que NG_FIN_VIDE appartient à sa famille.
  assert.equal(s.currentSceneId, fin, fin + ' : route rejouée vers ' + s.currentSceneId);
  const v = (s.flags || []).filter(x => x.startsWith('variante_')).map(x => x.slice(9));
  assert(v.length === 0 || (v.length === 1 && v[0] === fin), fin + ' : drapeau de variante étranger ' + v.join(','));
  out.rejouees++;
  if (!etatTrone && mode === 'classic' && rec.parcours.some(p => p[0] === TRONE)) etatTrone = rejoue(rec, TRONE);
}
assert.deepEqual(out.sansRoute, [], 'fins sans route : ' + out.sansRoute.join(', '));
// Routes négatives : à partir d'un état réel au Trône, on change seulement les drapeaux du cas.
assert(etatTrone, 'aucun état réel au Trône');
const base = clone(etatTrone);
const nettoie = f => f.filter(x => !/^(avec_ombre|avec_eclaireur|consort_|trio_accord|go_poly_domination|domination_finale|romance_[OE]_rompue|kaelen_(mort|perdu)|alistair_(mort|perdu|emprisonne)|voie_solo)/.test(x));
const choixAuTrone = (flags) => { const s = clone(base); s.flags = nettoie(s.flags || []).concat(flags); s.currentSceneId = TRONE; const d = api.serverGetPendingScene(s); assert.equal(d.renderedState.currentSceneId, TRONE, 'négatif intercepté : ' + flags.join(',')); return (d.choices || []).map(c => c.key); };
const NEG = {
  solo: { flags: ['voie_solo', 'fin_solo'], interdits: ['FIN_OMBRE', 'FIN_ECLAIREUR', 'FIN_POLY', 'FIN_DOMINATION'] },
  ruptureO: { flags: ['avec_ombre', 'consort_kaelen', 'romance_O_rompue'], interdits: ['FIN_OMBRE', 'FIN_POLY'] },
  ruptureE: { flags: ['avec_eclaireur', 'consort_alistair', 'romance_E_rompue'], interdits: ['FIN_ECLAIREUR', 'FIN_POLY'] },
  domination: { flags: ['avec_ombre', 'avec_eclaireur', 'consort_kaelen', 'consort_alistair', 'trio_accord', 'go_poly_domination'], interdits: ['FIN_POLY', 'FIN_OMBRE', 'FIN_ECLAIREUR'] },
  kaelenAbsent: { flags: ['avec_ombre', 'consort_kaelen', 'kaelen_perdu'], interdits: ['FIN_OMBRE', 'FIN_POLY'] },
  alistairAbsent: { flags: ['avec_eclaireur', 'consort_alistair', 'alistair_emprisonne'], interdits: ['FIN_ECLAIREUR', 'FIN_POLY'] },
  trioRefuse: { flags: ['avec_ombre', 'avec_eclaireur', 'consort_kaelen', 'consort_alistair'], interdits: ['FIN_POLY'] },
};
out.negatives = {};
for (const [nom, c] of Object.entries(NEG)) { const k = choixAuTrone(c.flags); const fautifs = c.interdits.filter(x => k.includes(x));
  assert.deepEqual(fautifs, [], nom + ' : fin interdite offerte'); out.negatives[nom] = 'OK (' + k.length + ' choix)'; }
// Contrôle positif : le trio consenti ouvre bien FIN_POLY (sinon les négatifs ne prouvent rien).
assert(choixAuTrone(['avec_ombre', 'avec_eclaireur', 'consort_kaelen', 'consort_alistair', 'trio_accord']).includes('FIN_POLY'), 'contrôle positif FIN_POLY');
// Oraya : le pardon est un choix explicite parmi d'autres.
const oc = api.DB.ORAYA_CONFRONTATION.choices; const pard = oc.filter(c => JSON.stringify(c.effects || []).includes('oraya_pardonnee'));
assert(pard.length === 1 && oc.length >= 2, 'pardon d’Oraya non explicite'); out.oraya = 'pardon = 1 choix sur ' + oc.length;
// Alistair : refuser l'intimité n'est pas une rupture.
{ const S = api.DB.ACTE4_03_SPICY_ALISTAIR; const B = S.choices.find(c => c.key === 'B'); const e = JSON.stringify(B.effects || []);
  assert(e.includes('alistair_refuse') && !/romance_E_rompue/.test(e), 'refus d’Alistair = rupture'); out.alistair = 'refus sans rupture'; }
// Séraphine : trois états (rupture, séparation, pause), trois textes distincts au Trône, malgré le plafond d’échos.
{ const t = f => { const s = clone(base); s.flags = (s.flags || []).filter(x => !/^seraphine_(rompue_57|separee_59|pause_57|conflit_repare_57)$/.test(x)).concat(f); s.currentSceneId = TRONE; const d = api.serverGetPendingScene(s); assert.equal(d.renderedState.currentSceneId, TRONE, 'Séraphine intercepté'); return d.narrative || ''; };
  const T = [t(['seraphine_rompue_57']), t(['seraphine_separee_59']), t(['seraphine_pause_57'])];
  if (process.env.DBG) T.forEach(x => console.error(x.slice(-900), '\n=====')); assert(/rompu sans scène/.test(T[0]) && /ne marchez plus ensemble/.test(T[1]) && /dans la manche/.test(T[2]), 'Séraphine : texte propre à l’état absent');
  out.seraphine = new Set(T).size + ' textes distincts';
  assert.equal(new Set(T).size, 3, 'Séraphine : états confondus au Trône'); }
console.log(JSON.stringify(out));
