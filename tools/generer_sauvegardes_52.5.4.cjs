// Génère des sauvegardes synthétiques avec le moteur ORIGINAL 52.5.4 (dossier original/ non modifié).
// Usage : node tools/generer_sauvegardes_52.5.4.cjs <chemin_vers_original/elenya-refonte-52.4/project>
'use strict';
const fs = require('node:fs'), path = require('node:path');
const { loadEngine } = require(path.resolve(process.argv[2], '../qa/engine.cjs'));
const { playRandom, clone } = require('../tests/lib.cjs');
const { api } = loadEngine(path.resolve(process.argv[2]));
const saves = [];
for (let i = 0; i < 12; i++) { const r = playRandom(api, 500 + i, 'classic', { sampleEvery: 12 }); r.samples.forEach(s => saves.push(s)); if (r.state) saves.push(r.state); }
for (let i = 0; i < 6; i++) { const r = playRandom(api, 800 + i, 'ngplus', { sampleEvery: 10 }); r.samples.forEach(s => saves.push(s)); if (r.state) saves.push(r.state); }
const out = saves.map(s => { const d = api.serverGetPendingScene(clone(s)); return { state: s, attendu: { scene: d.renderedState.currentSceneId, choix: (d.choices || []).map(c => c.key), fin: !!d.isEnd } }; });
fs.writeFileSync(path.resolve(__dirname, '../tests/fixtures/sauvegardes-52.5.4.json'), JSON.stringify({ source: 'moteur 52.5.4 original', nombre: out.length, sauvegardes: out }));
const ch = new Set(out.map(o => o.state.chapter || (o.attendu.scene.match(/ACTE(\d)/) || [])[1]));
console.log(JSON.stringify({ sauvegardes: out.length, modes: [...new Set(out.map(o => o.state.gameMode))], actes: [...ch].sort() }));
