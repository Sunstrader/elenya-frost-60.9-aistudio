#!/usr/bin/env node
// 60.2 : _echosEmpiles601_ garde l'anti-plantage mais mémorise l'erreur ; journal seulement en dev ;
// compteur et profondeur corrects en appels imbriqués, y compris quand une couche lève une exception.
'use strict';
const assert = require('node:assert/strict'); const vm = require('node:vm');
const root = require('node:path').resolve(__dirname, '../elenya-refonte-52.4');
const { ctx, api } = require(root + '/qa/engine.cjs').loadEngine(root + '/project');
const run = c => vm.runInContext(c, ctx);
const avert = []; ctx.console = { ...console, warn: m => avert.push(m) };
// 1. Erreur dans un écho : le texte sort, l'erreur est notée, pas de journal en production.
run(`var f602 = _echosEmpiles601_('ACTE4_09_TRONE_EBENE', gs => 'BASE', [['_', gs => true, 'A'], ['_', gs => { throw new Error('boum'); }, 'X'], ['_', gs => true, 'B']]);`);
assert.equal(run(`f602({})`), 'BASE\n\nA\n\nB');
assert.deepEqual(JSON.parse(run(`JSON.stringify(efEchoErreurs602_())`)), [{ scene: 'ACTE4_09_TRONE_EBENE', echo: 1, message: 'boum' }]);
assert.equal(avert.length, 0, 'aucun journal en production');
run(`f602({})`); assert.equal(run(`efEchoErreurs602_().length`), 1, 'pas d’inondation : une fois par écho');
// 2. En dev, journal.
run(`EF_ECHO_DIAG = true; var g602 = _echosEmpiles601_('X', gs => '', [['_', gs => { throw new Error('dev'); }, 'Y']]); g602({}); EF_ECHO_DIAG = false;`);
assert.equal(avert.length, 1); assert(/X#0 : dev/.test(avert[0]));
// 3. Imbrication : plafond partagé entre couches (4 au Trône), profondeur revenue à 0.
run(`var in602 = _echosEmpiles601_('ACTE4_09_TRONE_EBENE', gs => 'B', [['_',g=>true,'1'],['_',g=>true,'2'],['_',g=>true,'3']]);
     var out602 = _echosEmpiles601_('ACTE4_09_TRONE_EBENE', in602, [['_',g=>true,'4'],['_',g=>true,'5']]);`);
assert.equal(run(`out602({})`), 'B\n\n1\n\n2\n\n3\n\n4'); assert.equal(run(`_echoProf601_`), 0);
assert.equal(run(`out602({})`), 'B\n\n1\n\n2\n\n3\n\n4', 'compteur remis à zéro à chaque affichage');
// 4. Une base qui lève : l'exception remonte (comportement antérieur), la profondeur revient à 0, l'appel suivant est sain.
run(`var casse602 = _echosEmpiles601_('ACTE4_09_TRONE_EBENE', gs => { throw new Error('base'); }, [['_',g=>true,'z']]);`);
assert.throws(() => run(`casse602({})`)); assert.equal(run(`_echoProf601_`), 0); assert.equal(run(`out602({})`).split('\n\n').length, 5);
// 5. Sur le vrai jeu : 300 affichages du Trône depuis un état de route, aucune erreur d'écho.
const R = require('./fixtures/routes-fins-60.8.0.json'); let n = 0;
for (const rec of Object.values(R)) { let s = { gameMode: rec.mode || 'classic' };
  for (const [id, k] of rec.parcours) { const d = api.serverGetPendingScene(JSON.parse(JSON.stringify(s))); s = d.renderedState; n++; s = api.serverProcessChoice(JSON.parse(JSON.stringify(s)), k).updatedState; } }
const reelles = JSON.parse(run(`JSON.stringify(efEchoErreurs602_())`)).filter(e => !/^(ACTE4_09_TRONE_EBENE|X)$/.test(e.scene) || e.message !== 'boum' && e.message !== 'dev');
assert.deepEqual(reelles, [], 'erreurs d’écho dans le vrai jeu : ' + JSON.stringify(reelles));
console.log(JSON.stringify({ antiPlantage: true, journalDevSeulement: true, imbrication: 'OK', affichagesReels: n, erreursReelles: 0 }));
