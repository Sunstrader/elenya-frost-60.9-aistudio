#!/usr/bin/env node
// 60.3 (mission ADN) : fins distinctes, haltes d'exploration, systèmes réels (réputation, inventaire,
// volonté, journal de quêtes), indices du trio. Parcours réels depuis une partie neuve, choix guidés.
'use strict';
const assert = require('node:assert/strict');
const { engine, clone, rng } = require('./lib.cjs'); const { api } = engine();
const out = {};
// Joueur guidé : prend la première clé préférée disponible, sinon un choix pseudo-aléatoire.
function joue(seed, pref, opts = {}) {
  const r = rng(seed); let s = { gameMode: 'classic' }; const vus = []; let texte = '';
  for (let i = 0; i < 500; i++) {
    const d = api.serverGetPendingScene(clone(s)); s = d.renderedState; vus.push(s.currentSceneId); texte += '\n' + (d.narrative || '');
    if (opts.stop && opts.stop(s, d)) return { s, d, vus, texte };
    if (d.isEnd) return { s, d, vus, texte, fin: s.currentSceneId };
    const keys = d.choices.map(c => c.key);
    const k = pref.find(p => keys.includes(p)) || keys[Math.floor(r() * keys.length)];
    const res = api.serverProcessChoice(clone(s), k); assert(res && !res.error, 'choix refusé ' + s.currentSceneId + '/' + k); s = res.updatedState;
  }
  throw new Error('partie trop longue');
}
// 1. Fins distinctes : 36 écrans, aucun alias, 16 anciennes variantes rattachées à une lignée.
{
  api.serverGetPendingScene({ gameMode: 'classic' });
  const fins = [...Object.values(api.DB), ...Object.values(api.NGPLUS_DB)].filter(x => x.isEnd);
  assert.equal(fins.filter(x => x.aliasOf).length, 0, 'plus aucun alias de fin');
  const lignees = fins.filter(x => x.family);
  assert(lignees.length >= 16, 'variantes rattachées : ' + lignees.length);
  lignees.forEach(x => assert(x.title && x.title !== api.DB[x.family]?.title, 'titre propre : ' + x.sceneNumber));
  out.fins = { ecrans: fins.length, lignees: lignees.length };
}
// 2. Halte de l'auberge depuis une partie neuve : rumeurs → carte → abri de la Marche Blanche.
{
  let ok = null;
  for (let seed = 1; seed < 400 && !ok; seed++) {
    const p = joue(seed * 31, ['HALTE603', 'RUMEURS', 'REMONTER', 'ABRI603'], { stop: s => s.currentSceneId === 'ACTE2_10_RAVIN' });
    if (p.vus.includes('HALTE603_AUBERGE') && p.vus.includes('ACTE2_09B_BIVOUAC_GLACE')) ok = { seed, p };
  }
  assert(ok, 'aucune partie ne passe par la salle commune puis l’abri');
  const s = ok.p.s;
  assert((s.inventory || []).includes('carte_marche_blanche'), 'la carte est dans l’inventaire');
  assert(s.flags.includes('_abri603_visite'), 'abri visité');
  out.halteAuberge = 'graine ' + ok.seed + ' : ' + ok.p.vus.indexOf('HALTE603_AUBERGE') + '→' + ok.p.vus.indexOf('ACTE2_09B_BIVOUAC_GLACE');
  // Journal de quêtes : la quête de l'abri est accomplie, et le rendu la transmet au client.
  const d = api.serverGetPendingScene(clone(s));
  const q = (d.quetes603 || []).find(x => x.id === 'abri'); assert(q && q.etat === 'accomplie', 'quête abri accomplie');
  assert((d.objets603 || []).some(o => o.id === 'carte_marche_blanche' && /Carte/.test(o.nom)), 'objet nommé pour l’interface');
  // Sauvegarde → stockage JSON → reprise : inventaire, drapeaux et quêtes conservés.
  const relu = api.serverGetPendingScene(JSON.parse(JSON.stringify(d.renderedState)));
  assert.deepEqual(relu.renderedState.inventory, d.renderedState.inventory, 'inventaire repris');
  assert.deepEqual(relu.quetes603, d.quetes603, 'quêtes reprises');
  out.sauvegarde = 'OK';
}
// 3. Réputation lue : même scène, rendu différent selon la réputation du village.
{
  let base = null;
  for (let seed = 1; seed < 400 && !base; seed++) {
    const p = joue(seed * 17, ['HALTE603'], { stop: s => s.currentSceneId === 'HALTE603_AUBERGE' });
    if (p.s.currentSceneId === 'HALTE603_AUBERGE') base = p.s;
  }
  assert(base, 'salle commune jamais atteinte');
  const rend = v => { const s = clone(base); s.reputation = Object.assign({}, s.reputation, { village: v }); return api.serverGetPendingScene(s); };
  const haut = rend(3), bas = rend(-3);
  assert(/On a su, pour le grain/.test(haut.narrative), 'village favorable lu');
  assert(/recule d’un pas/.test(bas.narrative), 'village hostile lu');
  assert(haut.choices.some(c => c.key === 'VILLAGE') && !bas.choices.some(c => c.key === 'VILLAGE'), 'choix réservé à la bonne réputation');
  out.reputation = 'OK';
}
// 4. Volonté : les survies partagées coûtent 2 de volonté.
{
  const c1 = api.DB.SIRENE_DERNIER_SOUFFLE?.choices.find(c => c.key === 'MAIN_TENDUE');
  const c2 = api.DB.SCEAU_DERNIER_SOUFFLE?.choices.find(c => c.key === 'TENUE');
  [c1, c2].forEach(c => assert(c && c.effects.some(e => e.target === 'volonte' && e.value === -2), 'coût de volonté'));
  out.volonte = 'OK';
}
// 5. Trio : poly_eligible est relu (indice), sans jamais poser trio_accord.
{
  // 60.3.1 : l'indice passe par indiceTrio6031_ (poly_eligible + gardes de consentement).
  const src = String(api.DB.HALTE603_AUBERGE.getDynamicNarrative) + require('fs').readFileSync(require('path').resolve(__dirname,'../elenya-refonte-52.4/project/23_Refonte.js'),'utf8');
  assert(/indiceTrio6031_/.test(String(api.DB.HALTE603_AUBERGE.getDynamicNarrative)) && /poly_eligible/.test(src) && !/trio_accord'\s*\}/.test(JSON.stringify(api.DB.HALTE603_AUBERGE.choices)), 'indice sans consentement implicite');
  out.trio = 'indice lu, consentement intact';
}
console.log(JSON.stringify(out));
