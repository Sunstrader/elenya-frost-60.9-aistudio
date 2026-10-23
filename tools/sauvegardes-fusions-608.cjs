// 60.8.0 : fabrique de vraies sauvegardes 60.3.2 arrêtées sur les 5 scènes fusionnées (moteur 60.3.2 réel,
// parties figées 60.3.2). Usage : node tools/sauvegardes-fusions-608.cjs <racine> [routes] [sortie] (60.3.2 par défaut ; 60.7.0 : routes-fins-60.1.0.json sauvegardes-fusions-60.7.0.json). Outil, pas un test.
'use strict';
const fs = require('fs'), path = require('path'); const { engine, clone } = require('../tests/lib.cjs');
const { api } = engine(path.join(process.argv[2], 'elenya-refonte-52.4/project'));
const FUS = ['LIEN_MARCHE_2B', 'ACTE2_02B_PANTHERE_LIBEREE', 'ACTE2_02B_PANTHERE_ABSORBEE', 'ACTE3_11_PRISON_ECHANGE', 'ACTE4_07B_CHOC_FRAGMENT'];
const R = JSON.parse(fs.readFileSync(path.join(process.argv[2], 'tests/fixtures/' + (process.argv[3] || 'routes-fins-60.3.2.json')))); const out = {};
for (const [fin, rec] of Object.entries(R)) { let s = { gameMode: rec.mode || 'classic' };
  for (const [id, k] of rec.parcours) { const d = api.serverGetPendingScene(clone(s)); s = d.renderedState; if (s.currentSceneId !== id) break;
    if (FUS.includes(id)) { out[id] = out[id] || []; if (out[id].length < 3) out[id].push({ source: fin, state: clone(s) }); }
    s = api.serverProcessChoice(clone(s), k).updatedState; } }
fs.writeFileSync(path.join(__dirname, '../tests/fixtures/' + (process.argv[4] || 'sauvegardes-fusions-60.3.2.json')), JSON.stringify(out));
console.log(Object.fromEntries(Object.entries(out).map(([k, v]) => [k, v.length])));
