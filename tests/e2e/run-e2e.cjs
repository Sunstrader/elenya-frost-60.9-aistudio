#!/usr/bin/env node
// 60.1 (audit T02) : lance les tests navigateur un par un. Usage : npm run test:e2e
// CAPTURES=<dossier> (défaut : ../captures-e2e, hors du dépôt et du ZIP) ; CHROME_PATH=<chemin de Chrome>.
// Un journal par script est écrit dans <dossier>/<script>.log ; le bilan dans <dossier>/bilan.json. Sortie 1 si un script échoue.
'use strict';
const { spawnSync } = require('node:child_process'), fs = require('node:fs'), path = require('node:path');
const ROOT = path.resolve(__dirname, '../..'), CAP = path.resolve(process.env.CAPTURES || path.join(ROOT, '../captures-e2e'));
fs.mkdirSync(CAP, { recursive: true });
const S1 = '[[360,640],[390,844],[412,915],[844,390],[768,1024]]', S2 = '[[1024,768],[1280,720],[1920,1080],[2560,1080],[3840,2160]]';
const LOTS = [
  ['e2e', ['e2e.cjs', ROOT, path.join(CAP, 'e2e')]],
  ['saves', ['e2e-saves.cjs', ROOT]],
  ['recit-57', ['e2e-57.cjs', ROOT, path.join(CAP, 'recit')]],
  ['fenetres-1', ['e2e-fenetres.cjs', ROOT, path.join(CAP, 'fenetres')], { SIZES: S1 }],
  ['fenetres-2', ['e2e-fenetres.cjs', ROOT, path.join(CAP, 'fenetres')], { SIZES: S2 }],
  ['visuel-60', ['visuel-60.cjs', ROOT, path.join(CAP, 'visuel')]],
  ['visuel-601', ['visuel-601.cjs', ROOT, path.join(CAP, 'visuel-601')]],
  ['visuel-602', ['visuel-602.cjs', ROOT, path.join(CAP, 'visuel-602')]],
].filter(([n]) => !process.env.SEUL || process.env.SEUL.split(',').includes(n));
const bilan = {}; let ko = 0;
for (const [nom, [script, ...args], env] of LOTS) {
  if (!fs.existsSync(path.join(__dirname, script))) { bilan[nom] = 'absent'; continue; }
  const t = Date.now(); process.stdout.write(nom + ' … ');
  const r = spawnSync(process.execPath, [path.join(__dirname, script), ...args], { cwd: ROOT, env: Object.assign({}, process.env, env || {}), timeout: 900000, encoding: 'utf8' });
  fs.writeFileSync(path.join(CAP, nom + '.log'), (r.stdout || '') + (r.stderr || '') + '\nEXIT ' + r.status + '\n');
  const ok = r.status === 0; if (!ok) ko++;
  bilan[nom] = { ok, code: r.status, s: Math.round((Date.now() - t) / 1000) }; console.log(ok ? 'OK' : 'ÉCHEC (code ' + r.status + ')', bilan[nom].s + ' s');
}
fs.writeFileSync(path.join(CAP, 'bilan.json'), JSON.stringify(bilan, null, 1));
console.log('Captures et journaux : ' + CAP); process.exit(ko ? 1 : 0);
