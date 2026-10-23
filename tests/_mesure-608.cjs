// 60.8.0 : mesure du rythme — écrans à choix unique rencontrés sur N parties aléatoires.
'use strict';
const { engine, clone, rng } = require('./lib.cjs'); const { api } = engine();
const N = +process.argv[2] || 400; const stats = {}; let ecrans = 0, uniques = 0;
for (let seed = 1; seed <= N; seed++) { const r = rng(seed); let s = { gameMode: 'classic' };
  for (let i = 0; i < 400; i++) { const d = api.serverGetPendingScene(clone(s)); s = d.renderedState; if (d.isEnd) break;
    ecrans++; const id = s.currentSceneId; const st = stats[id] = stats[id] || { vu: 0, unique: 0, choix: '' };
    st.vu++; if (d.choices.length === 1) { uniques++; st.unique++; st.choix = d.choices[0].text; st.cle = d.choices[0].key; st.next = d.choices[0].next; st.texte = String(d.text || d.narrative || '').slice(0, 140).replace(/\n/g, ' '); }
    const c = d.choices[Math.floor(r() * d.choices.length)]; s = api.serverProcessChoice(clone(s), c.key).updatedState; } }
const top = Object.entries(stats).filter(([, v]) => v.unique).sort((a, b) => b[1].unique - a[1].unique);
console.log(JSON.stringify({ parties: N, ecrans, uniques, part: +(100 * uniques / ecrans).toFixed(1), scenesUniques: top.length }));
if (process.argv[3]) require('fs').writeFileSync(process.argv[3], JSON.stringify(top.map(([id, v]) => ({ id, ...v })), null, 1));
