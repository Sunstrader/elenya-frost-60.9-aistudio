'use strict';
// V59 (audit-final #6) — seuils anti-tics par fichier d’acte. Les plafonds sont les comptes
// après la passe 59 : le test échoue si un tic progresse. Ce n’est pas une relecture humaine.
const fs = require('fs'), path = require('path');
const P = path.resolve(__dirname, '..', 'elenya-refonte-52.4', 'project');
const TICS = ['Personne ne', 'Pas encore', 'le reste', 'quelque chose', 'silence'];
const PLAFONDS = JSON.parse(fs.readFileSync(path.join(__dirname, 'baseline', 'tics-59.json'), 'utf8'));
const out = {}, err = [];
for (const f of Object.keys(PLAFONDS)) {
  const s = fs.readFileSync(path.join(P, f), 'utf8').toLowerCase(); out[f] = {};
  for (const t of TICS) { const n = s.split(t.toLowerCase()).length - 1; out[f][t] = n; if (n > PLAFONDS[f][t]) err.push(`${f} « ${t} » ${n} > ${PLAFONDS[f][t]}`); }
}
if (process.argv.includes('--generer')) { fs.writeFileSync(path.join(__dirname, 'baseline', 'tics-59.json'), JSON.stringify(out, null, 1)); }
if (err.length) { console.error(err.join('\n')); process.exit(1); }
console.log(JSON.stringify({ fichiers: Object.keys(out).length, ok: true }));
