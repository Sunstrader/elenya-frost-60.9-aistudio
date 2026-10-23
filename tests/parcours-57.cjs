#!/usr/bin/env node
// 57.0 — les 9 parcours exigés (brief 56 §9), rejoués de bout en bout sans état injecté.
// 59.0 : parcours regénérés (fixtures/parcours-60.0.0.json) après les gardes domination, venin et reconversions (docs/59).
// 60.0 : parcours regénérés (fixtures/parcours-60.0.0.json) : le fragment de Kalthar jeune s’intercale désormais (bible V59 N5).
// 60.1 : parcours regénérés (fixtures/parcours-60.8.0.json) : le conflit de Kaelen se joue à la HALTE_DOME, nouveaux choix TENUE / MAIN_TENDUE.
'use strict';
const path = require('node:path'), fs = require('node:fs'), assert = require('node:assert/strict');
const { clone } = require('./lib.cjs');
const root = path.resolve(__dirname, '../elenya-refonte-52.4');
const { api } = require(root + '/qa/engine.cjs').loadEngine(root + '/project');
const P = JSON.parse(fs.readFileSync(path.join(__dirname, 'fixtures/parcours-60.8.0.json'), 'utf8'));
const F = (s, f) => (s.flags || []).includes(f), G = (s, g) => Number((s.gauges || {})[g] || 0);
const ATTENDU = {
  solo: s => s.currentSceneId === 'FIN_SOLO',
  kaelen: s => s.currentSceneId === 'FIN_OMBRE',
  alistair: s => s.currentSceneId === 'FIN_ECLAIREUR',
  rupture: s => F(s, 'romance_O_rompue') || F(s, 'romance_E_rompue'),
  pause: s => ['O', 'E'].some(x => F(s, 'romance_deferred_' + x + '_payoff') || F(s, 'romance_deferred_' + x + '_closed')),
  instabilite: (s, v) => v.has('ACTE4_09_TRONE_EBENE') && G(s, 'instabilite') >= 25,
  possession: (s, v) => v.has('ACTE4_09_TRONE_EBENE') && G(s, 'possession') >= 12,
  domination: s => s.currentSceneId === 'FIN_DOMINATION' && F(s, 'variante_FIN_DOMINATION'), // 60.3 : écran propre
  ngplus: (s, v) => /^NG_FIN_/.test(s.currentSceneId) && v.has('NGP_15_DERNIER_CHOIX'),
};
// Textes propres à chaque système (instabilité ≠ possession), vérifiés dans le texte réellement affiché.
const TEXTES = {
  instabilite: /penses par éclats|givre craque sous tes pas|tempête peut les fendre|ne trouve rien à gouverner|givre déborde encore/,
  possession: /comptes tes compagnons|baissent la tête avant|Il a seulement besoin que tu veuilles garder|regagner leur franchise/,
};
const out = {};
for (const [nom, rec] of Object.entries(P)) {
  let s = { gameMode: nom === 'ngplus' ? 'ngplus' : 'classic' }; const vus = new Set(); let texte = '', fin = false;
  for (const [id, key] of rec.parcours) {
    const d = api.serverGetPendingScene(clone(s)); s = d.renderedState; vus.add(s.currentSceneId); texte += '\n' + (d.narrative || '');
    assert.equal(s.currentSceneId, id, nom + ' : désynchronisé');
    const r = api.serverProcessChoice(clone(s), key); assert(r && !r.error, nom + ' : choix refusé ' + id + '/' + key); s = r.updatedState;
  }
  const d = api.serverGetPendingScene(clone(s)); s = d.renderedState; vus.add(s.currentSceneId); texte += '\n' + (d.narrative || ''); fin = d.isEnd;
  assert(fin, nom + ' : partie terminée');
  assert.equal(s.currentSceneId, rec.fin, nom + ' : fin (' + s.currentSceneId + ')'); // 60.8.1 : identifiant exact, plus de famille
  assert(ATTENDU[nom](s, vus), nom + ' : condition du parcours');
  if (TEXTES[nom]) assert(TEXTES[nom].test(texte), nom + ' : texte propre au système affiché');
  if (nom === 'instabilite') assert(!TEXTES.possession.test(texte) || G(s, 'possession') >= 12, 'instabilité : pas de texte de possession sans possession');
  if (nom === 'possession') assert(!TEXTES.instabilite.test(texte) || G(s, 'instabilite') >= 25, 'possession : pas de texte d’instabilité sans instabilité');
  out[nom] = s.currentSceneId + ' (' + rec.parcours.length + ' choix)';
}
assert.equal(Object.keys(out).length, 9);
console.log(JSON.stringify(out));
