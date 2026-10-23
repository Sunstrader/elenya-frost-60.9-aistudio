// 55.0 : vérifie les nouveautés du récit sur le moteur réel.
// 1) La Fêlure : apparaît, ses trois issues ont un effet, la rupture ferme la fin du compagnon.
// 2) Les échos différés s’affichent quand la mémoire est posée, et seulement alors.
// 3) « La Lame à Nu » est accessible ; les scènes retirées redirigent les anciennes sauvegardes.
// 4) En jeu réel (parties au hasard), la Fêlure est atteinte sans état injecté.
const path = require('node:path'), assert = require('node:assert/strict');
const { playRandom, clone } = require('./lib.cjs');
const root = path.resolve(__dirname, '../elenya-refonte-52.4');
const { api } = require(root + '/qa/engine.cjs').loadEngine(root + '/project');
const go = s => api.serverGetPendingScene(clone(s));
const pick = (d, k) => api.serverProcessChoice(clone(d.renderedState), k);
const out = {};
// 1. Fêlure Kaelen
const abimee = { gameMode: 'classic', currentSceneId: 'ACTE4_02_CHOIX_CHAMBRE', flags: ['interet_romantique_O', 'avec_ombre'], gauges: { lien_O: 2 } };
let d = go(abimee); assert.equal(d.renderedState.currentSceneId, 'ROMANCE_FELURE_O');
assert.equal(d.choices.map(c => c.key).join(','), 'REPARER,SUSPENDRE,FINIR');
const fin = go(pick(d, 'FINIR').updatedState); assert.equal(fin.renderedState.currentSceneId, 'ACTE4_02_CHOIX_CHAMBRE', 'retour au dôme');
assert(!fin.choices.some(c => c.key === 'O'), 'rupture : plus de nuit avec Kaelen');
const rep = pick(d, 'REPARER').updatedState; assert.equal(rep.gauges.lien_O, 5); assert(rep.flags.includes('felure_O_reparee'));
const sus = pick(d, 'SUSPENDRE').updatedState; assert(sus.flags.includes('romance_en_pause_O'));
// pas de Fêlure si la relation va bien, ni sans romance engagée
assert.equal(go({ ...abimee, gauges: { lien_O: 8, distance_O: 0 } }).renderedState.currentSceneId, 'ACTE4_02_CHOIX_CHAMBRE');
assert.equal(go({ ...abimee, flags: ['avec_ombre'] }).renderedState.currentSceneId, 'ACTE4_02_CHOIX_CHAMBRE');
// Fêlure Alistair
assert.equal(go({ gameMode: 'classic', currentSceneId: 'ACTE4_02_CHOIX_CHAMBRE', flags: ['interet_romantique_E', 'avec_eclaireur'], gauges: { lien_E: 1 } }).renderedState.currentSceneId, 'ROMANCE_FELURE_E');
// rupture : la fin du compagnon disparaît au Trône, l’alliance reste
const trone = { gameMode: 'classic', currentSceneId: 'ACTE4_09_TRONE_EBENE', flags: ['avec_ombre', 'consort_kaelen', 'nuit_kaelen'], gauges: { lien_O: 8, affinite_ombre: 10 } };
const avant = go(trone).choices.map(c => c.key), apres = go({ ...trone, flags: [...trone.flags, 'romance_O_rompue'] });
const ombre = api.DB.ACTE4_09_TRONE_EBENE.choices.filter(c => c.next === 'FIN_OMBRE').map(c => c.key);
assert(avant.some(k => ombre.includes(k)), 'fin Ombre disponible avant rupture');
assert(!apres.choices.some(c => ombre.includes(c.key)), 'fin Ombre fermée après rupture');
assert(String(apres.narrative).includes('trois pas'), 'écho de la rupture au Trône');
out.felure = 'OK';
// 2. Échos différés : présents avec la mémoire, absents sans
const echo = (scene, flags, extrait, gauges = {}) => {
  const avec = String(go({ gameMode: 'classic', currentSceneId: scene, flags, gauges }).narrative), sans = String(go({ gameMode: 'classic', currentSceneId: scene, flags: flags.filter(f => /^(avec_|_)/.test(f)), gauges: {} }).narrative);
  assert(avec.includes(extrait), scene + ' : écho absent'); assert(!sans.includes(extrait), scene + ' : écho sans la mémoire');
};
echo('ACTE3_09_VILLAGE_CACHE', ['venin_ignore'], 'mépris de toi-même');
echo('ACTE4_01_DEPART_VILLAGE', ['venin_cauterise'], 'écaille blanche');
echo('ACTE4_05_ARRIVEE_PORTES_1', ['silas_ami'], '— S.');
echo('ACTE4_05_ARRIVEE_PORTES_1', ['silas_bouton_pille'], 'forêt rousse');
echo('ACTE4_07_ADIEU_KALTHAR', ['avec_vu', 'fen_a_bu_givre', '_fragment_4_vu'].slice(1), 'Tu m’as nourri');
echo('ACTE4_09_TRONE_EBENE', ['veyra_rejetee'], 'refusée à l’autel');
echo('ACTE4_06_OMBRE_AVEU', ['avec_ombre', 'elenya_soin_kaelen_tempete'], 'soignée pendant la tempête');
out.echos = 'OK (7 vérifiés)';
// 3. La Lame à Nu, scènes retirées
const aveu = go({ gameMode: 'classic', currentSceneId: 'ACTE4_06_OMBRE_AVEU', flags: ['avec_ombre'] });
assert(aveu.choices.some(c => c.key === 'PREUVE'));
assert.equal(go(pick(aveu, 'PREUVE').updatedState).renderedState.currentSceneId, 'ACTE4_06B_TEST_KAELEN');
for (const old of ['ACTE4_04_POLY_ALISTAIR', 'ACTE4_04_POLY_KAELEN']) assert.equal(go({ gameMode: 'classic', currentSceneId: old }).renderedState.currentSceneId, 'ACTE4_05_ARRIVEE_PORTES_1');
out.lameANu = 'OK';
// 4. En jeu réel
let felures = 0, lame = 0, err = 0;
for (let i = 0; i < require('./lot.cjs').n(400, 100); i++) {
  const r = playRandom(api, 81000 + i, 'classic', { sampleEvery: 1 });
  if (r.erreur) { err++; continue; }
  const vus = new Set(r.samples.map(s => s.currentSceneId));
  if (vus.has('ROMANCE_FELURE_O') || vus.has('ROMANCE_FELURE_E')) felures++;
  if (vus.has('ACTE4_06B_TEST_KAELEN')) lame++;
}
assert.equal(err, 0); assert(felures > 0, 'Fêlure jamais atteinte en jeu réel'); assert(lame > 0, 'La Lame à Nu jamais atteinte en jeu réel');
out.jeuReel = { parties: require('./lot.cjs').n(400, 100), felure: felures, lameANu: lame };
console.log(JSON.stringify(out));
