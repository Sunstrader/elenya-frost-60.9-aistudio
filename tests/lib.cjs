// Outils communs aux tests 53.0.0 : moteur GAS réel exécuté dans Node (services Google simulés).
'use strict';
const path = require('node:path');
const { loadEngine } = require('../elenya-refonte-52.4/qa/engine.cjs');
const clone = x => JSON.parse(JSON.stringify(x));
function rng(seed) { let s = seed >>> 0; return () => { s = (Math.imul(s, 1664525) + 1013904223) >>> 0; return s / 4294967296; }; }
function engine(root) { return loadEngine(root || path.resolve(__dirname, '../elenya-refonte-52.4/project')); }
// Joue une partie aléatoire. Renvoie {fin, etapes, erreur, etats:[...échantillons]}
function playRandom(api, seed, mode, opts = {}) {
  const r = rng(seed); let state = mode === 'ngplus' ? (opts.start || { gameMode: 'ngplus' }) : { gameMode: 'classic' };
  const samples = [], max = opts.maxSteps || 400;
  for (let step = 0; step < max; step++) {
    const data = api.serverGetPendingScene(clone(state));
    if (!data) return { erreur: 'scène nulle', scene: state.currentSceneId, etapes: step, samples };
    state = data.renderedState;
    if (opts.sampleEvery && step % opts.sampleEvery === 0) samples.push(clone(state));
    if (data.isEnd) return { fin: state.currentSceneId, etapes: step, samples, state };
    if (!data.choices || !data.choices.length) return { erreur: 'aucun choix (impasse)', scene: state.currentSceneId, etapes: step, samples };
    const c = data.choices[Math.floor(r() * data.choices.length)];
    const res = api.serverProcessChoice(clone(state), c.key);
    if (!res || res.error) return { erreur: 'choix refusé : ' + (res && res.error), scene: state.currentSceneId, etapes: step, samples };
    state = res.updatedState;
  }
  return { erreur: 'trop d’étapes (boucle ?)', scene: state.currentSceneId, etapes: max, samples };
}
module.exports = { clone, rng, engine, playRandom };
