#!/usr/bin/env node
// 59 : une régression par point critique ou majeur des audits V58 (continuité, bible, romance, playtest, QA narratif, audit final).
'use strict';
const fs = require('fs'), path = require('path'), assert = require('assert/strict');
const R = path.resolve(__dirname, '..'), root = path.join(R, 'elenya-refonte-52.4');
const { api, ctx } = require(root + '/qa/engine.cjs').loadEngine(root + '/project');
const vm = require('vm'); const C = x => JSON.parse(JSON.stringify(x));
api.serverGetPendingScene({ gameMode: 'classic' });
const go = s => api.serverGetPendingScene(C(Object.assign({ gameMode: 'classic' }, s)));
const keys = d => (d.choices || []).map(c => c.key);
const txt = d => String(d.narrative || '');
const out = {};
const ok = (k, v) => { out[k] = v || 'OK'; };
// ——— Critiques QA narratif ———
{ // 1. domination → aucune fin romance d’un seul partenaire
  const base = { currentSceneId: 'ACTE4_09_TRONE_EBENE', gauges: { lien_O: 8, lien_E: 8, affinite_ombre: 5, affinite_eclaireur: 5 } };
  const dO = go(Object.assign({}, base, { flags: ['avec_ombre', 'consort_kaelen', 'nuit_kaelen', 'go_poly_domination'] }));
  assert.equal(dO.renderedState.currentSceneId, 'ACTE4_09_TRONE_EBENE');
  assert(!keys(dO).includes('FIN_OMBRE'), 'domination → FIN_OMBRE');
  const dE = go(Object.assign({}, base, { flags: ['avec_eclaireur', 'consort_alistair', 'nuit_alistair', 'domination_finale'] }));
  assert(!keys(dE).includes('FIN_ECLAIREUR'), 'domination → FIN_ECLAIREUR');
  const tO = go(Object.assign({}, base, { flags: ['avec_ombre', 'consort_kaelen', 'nuit_kaelen'] }));
  assert(keys(tO).includes('FIN_OMBRE'), 'contrôle positif FIN_OMBRE');
  assert(!/instabilite/.test(String(vm.runInContext('COND.domination', ctx))), 'COND.domination sans instabilité');
  assert.equal(vm.runInContext('COND.domination({hasFlag:()=>false,getGauge:k=>k==="instabilite"?40:0,flags:[],gauges:{instabilite:40}})', ctx), false, 'instabilité seule ≠ domination');
  ok('dominationExclutRomance');
}
{ // 2. rupture Séraphine → ni FIN_SERAPHINE_COEUR ni LAME
  const s = { currentSceneId: 'ACTE4_09_ISSUES_SECONDAIRES', flags: ['seraphine_amour', 'seraphine_rompue_57'], gauges: { possession: 12 } };
  const d = go(s); assert(!keys(d).includes('SERAPHINE_COEUR') && !keys(d).includes('SERAPHINE_LAME'), 'rupture Séraphine');
  const d2 = go({ currentSceneId: 'ACTE4_09_ISSUES_SECONDAIRES', flags: ['seraphine_amour'] }); assert(keys(d2).includes('SERAPHINE_COEUR'), 'contrôle positif');
  ok('ruptureSeraphine');
}
{ // 3. Oraya pas révélée avant FRAGMENT_4_STELE
  const DBs = vm.runInContext('DB', ctx);
  const t3 = String(DBs.ORAYA_INDICE_3.getDynamicNarrative ? DBs.ORAYA_INDICE_3.getDynamicNarrative({ hasFlag: () => false, getGauge: () => 0, flags: [], gauges: {} }) : DBs.ORAYA_INDICE_3.text);
  assert(!/mise sur la stèle/.test(t3), 'INDICE_3');
  const t2 = String(DBs.ORAYA_INDICE_2.getDynamicNarrative ? DBs.ORAYA_INDICE_2.getDynamicNarrative({ hasFlag: () => false, getGauge: () => 0, flags: [], gauges: {} }) : DBs.ORAYA_INDICE_2.text);
  assert(!/trois cents ans|Quand on vous y a mise/.test(t2), 'INDICE_2');
  ok('orayaSansRevelation');
}
// ——— P0 playtest ———
{
  const DBs = vm.runInContext('DB', ctx);
  const unique = Object.keys(DBs).find(id => /^ACTE3_(09|1)/.test(id) && (DBs[id].choices || []).length === 1);
  const multi = 'ACTE3_10_ACCUEIL_CULTE_1';
  // a) mort invisible : à 60 sans aucun avertissement, on reçoit l’avertissement, pas la mort
  let d = go({ currentSceneId: multi, flags: [], gauges: { instabilite: 60 } });
  assert.equal(d.renderedState.currentSceneId, 'AVERTISSEMENT_SURCHARGE', 'premier avertissement avant la mort');
  // b) second avertissement
  d = go({ currentSceneId: multi, flags: ['_surcharge_sursis_vu', 'surcharge_ignoree'], gauges: { instabilite: 60 } });
  assert.equal(d.renderedState.currentSceneId, 'AVERTISSEMENT_SURCHARGE_2', 'second avertissement');
  assert(/dernier avertissement/.test(txt(d)) && keys(d).includes('IGNORER'));
  assert(/prochain excès te tuera/.test(d.choices.find(c => c.key === 'IGNORER').text), 'IGNORER annonce la mort');
  // c) mort seulement après les deux, jamais sur une scène à choix unique
  if (unique) { d = go({ currentSceneId: unique, flags: ['_surcharge_sursis_vu', '_surcharge_sursis2_vu'], gauges: { instabilite: 60 } }); assert.notEqual(d.renderedState.currentSceneId, 'GAME_OVER_SURCHARGE', 'pas de mort sur ' + unique); }
  d = go({ currentSceneId: multi, flags: ['_surcharge_sursis_vu', '_surcharge_sursis2_vu'], gauges: { instabilite: 60 } });
  assert.equal(d.renderedState.currentSceneId, 'AGONIE_SURCHARGE', 'V60 : après deux avertissements, l’agonie (choix explicite RENDRE/CÉDER) remplace la mort directe');
  // d) le soin ne tue pas
  const cau = DBs.VENIN_DERNIER_SURSIS.choices.find(c => c.key === 'CAUTERISER');
  assert(!(cau.effects || []).some(e => e.target === 'instabilite' && e.value > 0), 'CAUTERISER sans givre');
  // e) coûts annoncés et jauge visible
  assert(/givre montera/.test(DBs.ACTE2_14_VALVE_INTERMEDIAIRE.choices.find(c => c.key === 'ABSORBER_FILON').text));
  const sg = fs.readFileSync(path.join(root, 'project/Scripts_Game.html'), 'utf8');
  assert(sg.includes("id='givre-jauge'") || sg.includes("g.id='givre-jauge'"), 'jauge du givre');
  assert(sg.includes('btn-reprendre-chute') && sg.includes("efSafeSet('elenya_avant_chute'"), 'reprise avant la chute');
  // f) venin : pas de mort sur une transition
  if (unique) { d = go({ currentSceneId: unique, flags: ['urgence_declenchee', 'venin_alerte_vue'], timers: { venin: 0 } }); assert.notEqual(d.renderedState.currentSceneId, 'GAME_OVER_VENIN', 'venin sur transition'); }
  ok('surchargeEtVenin', 'transition testée : ' + unique);
}
// ——— Romance critiques ———
{
  const DBs = vm.runInContext('DB', ctx);
  const mk = f => ({ hasFlag: x => f.includes(x), getGauge: () => 5, flags: f, gauges: { lien_O: 5, lien_E: 5 } });
  const poly = DBs.FIN_POLY.getDynamicNarrative(mk(['avec_ombre', 'avec_eclaireur', 'trio_accord', 'double_jeu', 'romance_reelle_O', 'romance_reelle_E']));
  assert(!/enchaînés/.test(poly) && /C’est un accord/.test(poly), 'FIN_POLY trio consenti malgré double_jeu');
  const S = ['ACTE3_04_ENVOUTEMENT', 'ACTE3_06_REVEIL_TORDU', 'ACTE3_07_BRISER_LA_GLACE', 'ACTE3_08_MISE_AU_POINT'];
  for (const f of ['reve_O', 'reve_E', 'reve_poly', 'reve_solo']) for (const id of S) {
    const d = go({ currentSceneId: id, flags: [f, 'avec_ombre'] }); const t = txt(d) + ' ' + (d.choices || []).map(c => c.text).join(' ');
    assert(!/asservir|que ce soit toi qui le tiennes|cloué au sol|délicieuse|sacrilège infâme|bétail|inhumanité|glacés plus sûrement/.test(t), id + '/' + f + ' : vocabulaire d’asservissement');
  }
  const r6 = go({ currentSceneId: 'ACTE3_06_REVEIL_TORDU', flags: ['reve_O'] });
  assert(['A', 'A_ASSUMER', 'A_LIBERER'].every(k => keys(r6).includes(k)), 'trois choix après le réveil');
  const fO = txt(go({ currentSceneId: 'ACTE3_05_FIEVRE', flags: ['reve_O'] })), fE = txt(go({ currentSceneId: 'ACTE3_05_FIEVRE', flags: ['reve_E'] }));
  const fin = t => t.trim().split('\n\n').pop(); assert.notEqual(fin(fO), fin(fE), 'fièvres : chutes distinctes');
  const a4 = fs.readFileSync(path.join(root, 'project/DATABASE_Acte4.js'), 'utf8'); assert(!/courtisane/.test(a4), 'insulte genrée');
  ok('romanceSirene');
}
// ——— Audit final (majeurs) ———
{
  assert(!fs.existsSync(path.join(R, 'project')), 'copie morte à la racine');
  const op = txt(go({ currentSceneId: 'ACTE1_01_REVEIL', flags: [] })); assert(/n’a pas tout à fait ta forme/.test(op));
  const det = txt(go({ currentSceneId: 'ACTE1_01_REVEIL_DETAILS', flags: ['reveil_autel_inspecte'] })); assert(!/la forme de ton corps/.test(det), 'ouverture contredite');
  const tr = txt(go({ currentSceneId: 'ACTE4_09_TRONE_EBENE', flags: ['reveil_autel_inspecte'] })); assert(/sept pointes/.test(tr), 'inspection relue au Trône');
  // fins : passage et clôture propres
  const EP = vm.runInContext('EPILOGUE59', ctx); const textes = new Set();
  const DBs0 = vm.runInContext('DB', ctx); const avecEp = Object.keys(EP).filter(id => (DBs0[id].choices || []).some(x => x.key === 'EPILOGUE'));
  assert(avecEp.length >= 6, 'fins avec épilogue');
  for (const id of avecEp) {
    const c = DBs0[id].choices.find(x => x.key === 'EPILOGUE'); textes.add(c.text);
    const st = api.serverProcessChoice({ gameMode: 'classic', currentSceneId: id, flags: [] }, 'EPILOGUE').updatedState;
    assert(txt(go(st)).startsWith(EP[id][1]), id + ' : clôture');
  }
  assert.equal(textes.size, avecEp.length, 'passages distincts');
  const tous = ['grain_partage_57', 'oraya_pardonnee', 'seraphine_nom_garde_58', 'epilogue_village_58', 'romance_reelle_O', 'avec_ombre', 'kaelen_reste'];
  const ep = txt(go({ currentSceneId: 'ACTE5_01_LENDEMAIN', flags: tous }));
  const L = [].concat(...['RECIT57_ECHOS', 'RECIT57B_ECHOS', 'RECIT58_ECHOS', 'RECIT59_ECHOS'].map(n => vm.runInContext(n, ctx))).filter(e => e[0] === 'ACTE5_01_LENDEMAIN').map(e => e[2]);
  assert(ep.split('\n\n').filter(p => L.includes(p)).length <= 3, 'épilogue : 3 échos au plus');
  ok('auditFinal');
}
// ——— Continuité (majeurs) ———
{
  const DBs = vm.runInContext('DB', ctx);
  const sc = DBs.ACTE4_09_TRONE_EBENE.choices;
  for (const [k, f] of [['V28_FIN_RECONVERSION_O', 'kaelen_reste'], ['V28_FIN_RECONVERSION_E', 'alistair_reste']]) {
    const c = sc.find(x => x.key === k); assert(c && c.effects.some(e => e.target === f), k + ' pose ' + f);
  }
  const cE = sc.find(x => x.key === 'V28_FIN_RECONVERSION_E');
  assert.equal(cE.condition({ hasFlag: f => ['voie_solo', 'alistair_emprisonne'].includes(f), getGauge: () => 12 }), false, 'Alistair emprisonné ne tient pas le seuil');
  ok('continuite');
}
{ // qa #14 — héritage relationnel NG+
  const d = go({ gameMode: 'ngplus', currentScene: 'NGP_01_SEUIL', globalFlags: ['ng_plus_unlocked', 'last_classic_lien:trio_accord'] });
  assert.match(txt(d), /laissé choisir entre eux/, 'NG+ hérite du trio');
  const d2 = go({ gameMode: 'ngplus', currentScene: 'NGP_01_SEUIL', globalFlags: ['ng_plus_unlocked'] });
  assert.doesNotMatch(txt(d2), /laissé choisir entre eux/);
  ok('ngplusHeritage');
}
{ // continuité #15 — ERREUR_SCENE ramène à la dernière scène connue
  const r = api.serverProcessChoice({ gameMode: 'classic', currentSceneId: 'ERREUR_SCENE', choiceHistory: [{ scene: 'ACTE2_08_MATIN_AUBERGE', choice: 'A', next: 'X' }] }, 'NEXT');
  assert.equal(r.nextSceneData.sceneId, 'ACTE2_08_MATIN_AUBERGE');
  ok('erreurScene');
}
{ // qa #13 + playtest #11
  const d = go({ currentSceneId: 'FIN_HIVER', currentScene: 'FIN_HIVER', flags: ['variante_FIN_DOMINATION', 'domination_finale'] });
  // 60.3.1 (bible V60.3 N5) : le titre interne « **Domination** » doublait le titre de l’écran ; la domination est nommée par son écran propre.
  assert.match(txt(d), /^Les Satellites — de la lignée/m); assert.doesNotMatch(txt(d), /\*Les Satellites\*/);
  assert.ok(go({ currentSceneId: 'ACTE3_09_ENTREE_SANCTUAIRE', currentScene: 'ACTE3_09_ENTREE_SANCTUAIRE' }).image, 'image sanctuaire');
  ok('dominationNommeeEtImage');
}
{ // bible #12 — la clé du Codex « Primaëlys » est exactement un identifiant de la DB (NFC)
  const html = fs.readFileSync(path.join(root, 'project', 'Scripts_Refonte.html'), 'utf8');
  const m = html.match(/\['Primaëlys','([^']+)'/); assert(m, 'entrée codex');
  const DBs = vm.runInContext('DB', ctx); assert.ok(DBs[m[1]] || DBs[m[1].normalize('NFC')], 'clé codex inconnue');
  assert.equal(m[1], m[1].normalize('NFC'));
  for (const k of ['Oraya', 'Le Trône d’Ébène']) { const mm = html.match(new RegExp("\\['" + k + "','([^']+)'")); assert(mm && DBs[mm[1]], k); }
  ok('codex');
}
console.log(JSON.stringify(out));
