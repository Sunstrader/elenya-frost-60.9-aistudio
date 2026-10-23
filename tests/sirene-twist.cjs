#!/usr/bin/env node
// 58.0 : la séquence de la sirène peut être réécrite. Seule contrainte dure : le retournement.
// On se réveille à côté de « l’autre », et le lecteur ne doit pas le voir venir.
// Garanties : 1) le réveil inversé est atteignable par le jeu réel ; 2) rien ne l’annonce explicitement avant ;
// 3) clés de choix, destinations et drapeaux identiques à la 55.0.1 (les sauvegardes prises dans la séquence restent valides).
'use strict';
const path = require('node:path'), assert = require('node:assert/strict');
const clone = x => JSON.parse(JSON.stringify(x));
const root = path.resolve(__dirname, '../elenya-refonte-52.4');
const { api } = require(root + '/qa/engine.cjs').loadEngine(root + '/project');
const go = s => api.serverGetPendingScene(clone(s));
const pick = (s, k) => { const d = go(s); assert((d.choices || []).some(c => c.key === k), d.renderedState.currentSceneId + ' : choix ' + k + ' absent'); const r = api.serverProcessChoice(clone(d.renderedState), k); assert(r && !r.error); return r.updatedState; };
const reach = (s, id) => { for (let i = 0; i < 12 && go(s).renderedState.currentSceneId !== id; i++) { const d = go(s); s = api.serverProcessChoice(clone(d.renderedState), d.choices[0].key).updatedState; } assert.equal(go(s).renderedState.currentSceneId, id, 'atteint ' + id); return go(s).renderedState; };
const narr = s => String(go(s).narrative || '');
// 3) Structure figée depuis la 55.0.1 (clés → destination ; drapeaux posés)
const STRUCT = {
  ACTE3_03_LA_SIRENE: { A: 'ACTE3_03B_RESISTANCE', B: 'ACTE3_03B_RESISTANCE' },
  ACTE3_03B_RESISTANCE: { A: 'ACTE3_04_ENVOUTEMENT' },
  ACTE3_04_ENVOUTEMENT: { O: 'ACTE3_05_FIEVRE', E: 'ACTE3_05_FIEVRE', POLY: 'ACTE3_05_FIEVRE', S: 'ACTE3_05_FIEVRE', ABANDON: 'GAME_OVER_SIRENE' },
  ACTE3_05_FIEVRE: { A: 'ACTE3_06_REVEIL_TORDU' },
  ACTE3_06_REVEIL_TORDU: { A: 'ACTE3_07_BRISER_LA_GLACE', B: 'ACTE3_07_BRISER_LA_GLACE' },
  ACTE3_07_BRISER_LA_GLACE: { A: 'ACTE3_08_MISE_AU_POINT' },
};
const FLAGS = { 'ACTE3_04_ENVOUTEMENT/O': 'reve_O', 'ACTE3_04_ENVOUTEMENT/E': 'reve_E', 'ACTE3_04_ENVOUTEMENT/POLY': 'reve_poly', 'ACTE3_04_ENVOUTEMENT/S': 'reve_solo', 'ACTE3_05_FIEVRE/A': 'sommeil_lourd', 'ACTE3_06_REVEIL_TORDU/A': 'liens_brises', 'ACTE3_07_BRISER_LA_GLACE/A': 'depart_malaise' };
for (const [id, m] of Object.entries(STRUCT)) {
  const S = api.DB[id]; assert(S, id);
  for (const [k, nx] of Object.entries(m)) {
    const c = S.choices.find(x => x.key === k); assert(c, id + '/' + k + ' (clé de sauvegarde)'); assert.equal(c.next, nx, id + '/' + k);
    const f = FLAGS[id + '/' + k]; if (f) assert((c.effects || []).some(e => e.type === 'SET_FLAG' && e.target === f), id + '/' + k + ' pose ' + f);
  }
}
// Sauvegardes prises dans la séquence : chaque scène se recharge avec ses choix.
for (const id of Object.keys(STRUCT)) for (const f of [['reve_O'], ['reve_E'], ['reve_solo'], []]) {
  const d = go({ gameMode: 'classic', currentSceneId: id, flags: f.concat(['avec_ombre', 'avec_eclaireur']), gauges: { lien_O: 5, lien_E: 5 } });
  assert(d && (d.choices || []).length, 'reprise ' + id + ' ' + f);
}
// 1) + 2) Retournement, joué réellement depuis ACTE3_03
const out = {};
for (const [cle, voulu, reveil] of [['O', 'Kaelen', 'Alistair'], ['E', 'Alistair', 'Kaelen']]) {
  let s = { gameMode: 'classic', currentSceneId: 'ACTE3_03_LA_SIRENE', flags: ['avec_ombre', 'avec_eclaireur'], gauges: { lien_O: 5, lien_E: 5 } };
  s = pick(reach(s, 'ACTE3_03_LA_SIRENE'), 'A'); s = pick(reach(s, 'ACTE3_03B_RESISTANCE'), 'A'); s = reach(s, 'ACTE3_04_ENVOUTEMENT');
  const d4 = go(s); const choix = d4.choices.find(c => c.key === cle);
  assert(choix.text.includes(voulu) && !choix.text.includes(reveil), 'le choix ne trahit pas le retournement');
  s = reach(pick(s, cle), 'ACTE3_05_FIEVRE');
  const f = narr(s);
  assert(f.includes(voulu) && !f.includes(reveil), 'la fièvre ne nomme que celui qu’on croit (' + voulu + ')');
  assert(!/se trompe|pas lui|erreur|l’autre/.test(f), 'aucun aveu anticipé dans la fièvre');
  s = reach(pick(s, 'A'), 'ACTE3_06_REVEIL_TORDU');
  const w = narr(s);
  assert(new RegExp('Ce n’est pas ' + voulu).test(w), 'le réveil dément ' + voulu);
  assert(w.indexOf(reveil) > w.indexOf('Ce n’est pas ' + voulu), 'c’est ' + reveil + ' au réveil');
  out[cle] = 'rêve ' + voulu + ' → réveil ' + reveil;
}
console.log(JSON.stringify(out));
