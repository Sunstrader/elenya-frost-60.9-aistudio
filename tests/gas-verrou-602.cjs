#!/usr/bin/env node
// 60.2 (point critique) : simulation Apps Script. Charge TOUS les .js du projet comme GAS (un seul espace global),
// liste les fonctions publiques (appelables par google.script.run = globales sans « _ » final), et vérifie le verrou.
// Limite honnête : simulation Node ; le déploiement Apps Script réel n'est PAS validé ici.
'use strict';
const fs = require('node:fs'), path = require('node:path'), vm = require('node:vm'), assert = require('node:assert/strict');
const P = path.join(__dirname, '../elenya-refonte-52.4/project');
function gas({ actif = '', proprio = 'owner@ex.org', props = {} } = {}) {
  const store = new Map(Object.entries(props)), ps = { getProperty: k => store.has(k) ? store.get(k) : null, setProperty: (k, v) => store.set(k, v), deleteProperty: k => store.delete(k), getProperties: () => Object.fromEntries(store) };
  const ctx = vm.createContext({ console: { log() {}, warn() {}, error() {} }, Date, Math, JSON,
    PropertiesService: { getScriptProperties: () => ps, getUserProperties: () => ps, getDocumentProperties: () => ps },
    Session: { getActiveUser: () => ({ getEmail: () => actif }), getEffectiveUser: () => ({ getEmail: () => proprio }) },
    Logger: { log() {} }, Utilities: { getUuid: () => 'u' },
    SpreadsheetApp: new Proxy({}, { get: () => () => { throw new Error('SpreadsheetApp interdit dans le test'); } }),
    ScriptApp: { getService: () => ({ getUrl: () => '' }) } });
  const ORDRE = ['05_DevGuard.js','20_Core_Helpers.js','21_Assets.js','22_State.js','10_Triggers.js','DATABASE_Acte1.js','DATABASE_Acte2.js','DATABASE_Acte3.js','DATABASE_Acte4.js','DATABASE_Acte5.js','DATABASE_Relations.js','DATABASE_Fragments.js','DATABASE_Secondary.js','DATABASE_Endings.js','DATABASE_Misc.js','DATABASE_Index.js'];
  const tous = fs.readdirSync(P).filter(f => f.endsWith('.js')).sort(); const liste = ORDRE.filter(f => tous.includes(f)).concat(tous.filter(f => !ORDRE.includes(f)));
  for (const f of liste) vm.runInContext(fs.readFileSync(path.join(P, f), 'utf8'), ctx, { filename: f });
  vm.runInContext('if(typeof applyRefonte_==="function")applyRefonte_();', ctx);
  return ctx;
}
const g = gas();
const publiques = Object.keys(g).filter(k => typeof g[k] === 'function' && !k.endsWith('_')).filter(k => !['console'].includes(k)).sort();
const DIAG = /^(serverRun|serverGetQA|serverValidateDatabase$|imageReviewer)/;
const fuites = publiques.filter(k => DIAG.test(k));
assert.deepEqual(fuites, [], 'diagnostics encore publics : ' + fuites.join(', '));
assert.equal(g.EF_DIAGNOSTICS_602_.length, 36);
for (const n of g.EF_DIAGNOSTICS_602_) assert.equal(typeof g[n + '_'], 'function', 'version privée absente : ' + n);
const appel = (o, n, a) => gas(o).serverDevDiagnostic(n, a);
const OK = { actif: 'owner@ex.org', props: { ELENYA_DEV_DIAG: '1' } };
const cas = {
  anonymeSansDrapeau: appel({}, 'serverValidateDatabase'),
  anonymeAvecDrapeau: appel({ props: { ELENYA_DEV_DIAG: '1' } }, 'serverValidateDatabase'),
  proprioSansDrapeau: appel({ actif: 'owner@ex.org' }, 'serverValidateDatabase'),
  inconnuAvecDrapeau: appel({ actif: 'x@ex.org', props: { ELENYA_DEV_DIAG: '1' } }, 'serverValidateDatabase'),
  listeAvecDrapeau: appel({ actif: 'dev@ex.org', props: { ELENYA_DEV_DIAG: '1', ELENYA_DEV_EMAILS: 'dev@ex.org' } }, 'serverValidateDatabase'),
  proprioAvecDrapeau: appel(OK, 'serverValidateDatabase'),
  nomHorsListe: appel(OK, 'serverGetPendingScene'),
};
for (const k of ['anonymeSansDrapeau', 'anonymeAvecDrapeau', 'proprioSansDrapeau', 'inconnuAvecDrapeau']) assert.equal(cas[k].error, 'DIAGNOSTIC_RESERVE_DEV', k);
assert.equal(cas.nomHorsListe.error, 'DIAGNOSTIC_INCONNU');
for (const k of ['listeAvecDrapeau', 'proprioAvecDrapeau']) assert(cas[k] && !cas[k].error && cas[k].scenes > 0, k + ' : diagnostic utilisable en dev');
// Administration du Reviewer (jetons d'agents) : propriétaire seulement.
const ADMIN = ['reviewerSetup', 'reviewerGetOwnerInfo', 'reviewerCreateGrokBrowserWriteAccess', 'reviewerCreateGrokApiAccess', 'reviewerRevokeGrokApiAccess', 'reviewerRevokeAgentApiAccess', 'reviewerListAgentApiAccess'];
const a = gas({ actif: '' }), b = gas({ actif: 'x@ex.org' });
for (const n of ADMIN) { assert.equal(a[n]().error, 'RESERVE_PROPRIETAIRE', n + ' anonyme'); assert.equal(b[n]().error, 'RESERVE_PROPRIETAIRE', n + ' tiers'); }
// Le jeu reste jouable sans aucun droit.
const d = g.serverGetPendingScene({ gameMode: 'classic' }); assert(d && d.renderedState && d.renderedState.currentSceneId, 'jeu jouable');
const out = { publiques, nbPubliques: publiques.length, diagnosticsPrives: g.EF_DIAGNOSTICS_602_.length, refus: Object.fromEntries(Object.entries(cas).map(([k, v]) => [k, v.error || 'autorisé'])), adminProprietaireSeul: ADMIN.length, limite: 'simulation Node, déploiement réel non validé' };
fs.writeFileSync(path.join(__dirname, '../docs/60.2-fonctions-publiques.json'), JSON.stringify(out, null, 1));
console.log(JSON.stringify(out));
