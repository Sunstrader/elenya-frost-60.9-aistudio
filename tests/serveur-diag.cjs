#!/usr/bin/env node
// 60.1 (audit T04) : en mode production (PORT fourni, sans ELENYA_DIAG), les méthodes de diagnostic sont refusées (403) ;
// les méthodes du jeu répondent. En local, le diagnostic reste ouvert.
'use strict';
const { spawn } = require('node:child_process'), path = require('node:path'), assert = require('node:assert/strict');
const ROOT = path.resolve(__dirname, '..');
const appel = (port, fn) => fetch('http://127.0.0.1:' + port + '/api/gas/' + fn, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ args: [] }) }).then(r => r.status);
async function lancer(env, port) {
  const p = spawn(process.execPath, ['server.js'], { cwd: ROOT, env: Object.assign({}, process.env, env), stdio: 'ignore' });
  for (let i = 0; i < 50; i++) { try { await fetch('http://127.0.0.1:' + port + '/healthz'); return p; } catch { await new Promise(r => setTimeout(r, 100)); } }
  p.kill(); throw new Error('serveur non démarré');
}
(async () => {
  const out = {};
  let p = await lancer({ PORT: '3911', HOST: '127.0.0.1', NODE_ENV: 'production', ELENYA_DIAG: '' }, 3911);
  try { out.prodDiag = await appel(3911, 'serverValidateDatabase'); out.prodJeu = await appel(3911, 'serverGetBuildInfo'); } finally { p.kill(); }
  assert.equal(out.prodDiag, 403, 'diagnostic exposé en production'); assert.notEqual(out.prodJeu, 403);
  p = await lancer({ PORT: '', HOST: '127.0.0.1', NODE_ENV: '' }, 3000);
  try { out.localDiag = await appel(3000, 'serverValidateDatabase'); } finally { p.kill(); }
  assert.notEqual(out.localDiag, 403);
  console.log(JSON.stringify(out));
})().catch(e => { console.error(e.message); process.exit(1); });
