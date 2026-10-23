#!/usr/bin/env node
// 57.0 — arcs, romances, instabilité ≠ possession, NG+ conditionné par le savoir (positifs + négatifs).
'use strict';
const path = require('node:path'), assert = require('node:assert/strict');
const { clone } = require('./lib.cjs');
const root = path.resolve(__dirname, '../elenya-refonte-52.4');
const { api } = require(root + '/qa/engine.cjs').loadEngine(root + '/project');
const G0 = { lien_O: 5, lien_E: 5, affinite_ombre: 5, affinite_eclaireur: 5, instabilite: 0, possession: 0, volonte: 5 };
const go = (id, flags, gauges, mode) => api.serverGetPendingScene(clone({ gameMode: mode || 'classic', currentSceneId: id, flags: flags || [], gauges: Object.assign({}, G0, gauges || {}) }));
// Lecture directe de la scène (sans déclencheurs de redirection) avec un état simulé.
const mock = (flags, gauges) => { const g = Object.assign({}, G0, gauges || {}); return { flags: flags || [], gauges: g, hasFlag: f => (flags || []).includes(f), getGauge: k => g[k] || 0, hasGlobalFlag: () => false, hasItem: () => false, getLastClassicEnding: () => null, timers: {}, ngPlus: {} }; };
const scene = (id, flags, gauges) => { const S = api.DB[id] || api.NGPLUS_DB[id]; assert(S, 'scène ' + id); const gs = mock(flags, gauges);
  const n = typeof S.getDynamicNarrative === 'function' ? S.getDynamicNarrative(gs) : (S.text || S.narrative || '');
  const ch = (S.choices || []).filter(c => { try { return !c.condition || c.condition(gs); } catch (_) { return false; } });
  return { narrative: n, choices: ch, direct: true }; };
const keys = d => (d.choices || []).map(c => c.key);
const txt = d => String(d.narrative || '');
const out = {};
api.serverGetPendingScene(clone({ gameMode: 'classic', currentSceneId: 'ACTE1_08_SECRET', flags: [], gauges: {} })); // applique les couches 54-57
// Instabilité ≠ possession : choix distincts, textes distincts
{
  const I = scene('ACTE4_05_ARRIVEE_PORTES_1', [], { instabilite: 26 });
  const P = scene('ACTE4_05_ARRIVEE_PORTES_1', [], { possession: 15 });
  const N = scene('ACTE4_05_ARRIVEE_PORTES_1', [], {});
  assert(keys(I).includes('I57_TEMPETE') && !keys(I).includes('P57_ORDRE'), 'instabilité → tempête seule');
  assert(keys(P).includes('P57_ORDRE') && !keys(P).includes('I57_TEMPETE'), 'possession → ordre seul');
  assert(!keys(N).includes('I57_TEMPETE') && !keys(N).includes('P57_ORDRE'), 'neutre : aucun');
  assert(/tempête peut les fendre/.test(txt(I)) && !/baissent la tête avant/.test(txt(I)), 'texte instabilité');
  assert(/baissent la tête avant/.test(txt(P)) && !/tempête peut les fendre/.test(txt(P)), 'texte possession');
  const I2 = go('ACTE4_05_ARRIVEE_PORTES_1', [], { instabilite: 26 });
  assert(keys(I2).includes('I57_TEMPETE'), 'moteur réel : tempête proposée');
  const r = api.serverProcessChoice(clone(I2.renderedState), 'I57_TEMPETE');
  assert.equal(r.updatedState.currentSceneId, 'ARC57_I57_TEMPETE', 'scène propre à la tempête');
  const t1 = api.serverGetPendingScene(clone(r.updatedState));
  assert(/obsidienne éclate/.test(String(t1.narrative || '')), 'texte de la tempête affiché');
  const r2 = api.serverProcessChoice(clone(t1.renderedState), 'SUITE');
  assert.equal(r2.updatedState.currentSceneId, 'ACTE4_06_MASQUE_TOMBE_1');
  const s = scene(r2.updatedState.currentSceneId, r2.updatedState.flags, r2.updatedState.gauges);
  assert(/sang d’Alistair/.test(txt(s)), 'conséquence négative de la tempête');
  const T = scene('ACTE4_09_TRONE_EBENE', [], { instabilite: 0, possession: 0 });
  assert(keys(T).includes('I57_GIVRE'), 'calme + libre → maîtrise du Trône (positif)');
  assert(!keys(scene('ACTE4_09_TRONE_EBENE', [], { possession: 15 })).includes('I57_GIVRE'), 'possession ferme la maîtrise');
  out.instabilitePossession = 'OK';
}
// Silas : conséquence différée
{
  const v = scene('ACTE2_04_VILLAGE_HOSTILE', ['silas_a_parle_1']);
  assert(keys(v).includes('SILAS_LAISSEZ_PASSER'));
  assert(!keys(scene('ACTE2_04_VILLAGE_HOSTILE', [])).includes('SILAS_LAISSEZ_PASSER'));
  assert(keys(scene('ACTE4_05_ARRIVEE_PORTES_1', ['silas_laissez_passer_57'])).includes('S57_SILAS'), 'jeton utilisable acte 4');
  out.silas = 'OK';
}
// Veyra semée tôt, débloque un choix final
{
  assert(/couronne barrée et un V/.test(txt(scene('LIEN_MARCHE_1', []))), 'Veyra semée acte 1');
  assert(keys(scene('ACTE2_08_MATIN_AUBERGE', [])).includes('V57_ARC57_VEYRA_COLPORTEUSE'), 'Veyra acte 2');
  assert(keys(scene('VEYRA_DERNIER_PACTE', ['veyra_graine_57','veyra_mensonge_avoue','veyra_verite_decouverte'])).includes('EGALE_57'));
  assert(!keys(scene('VEYRA_DERNIER_PACTE', ['veyra_mensonge_avoue','veyra_verite_decouverte'])).includes('EGALE_57'));
  out.veyra = 'OK';
}
// Alistair : erreur coûteuse + promesse tenue plus tard
{
  assert(keys(scene('ACTE3_08_MISE_AU_POINT', ['alistair_a_promis_cage'])).includes('V57_ARC57_ALISTAIR_ERREUR'));
  assert(/te laisse la serrure/.test(txt(scene('ACTE4_06_MASQUE_TOMBE_1', ['alistair_promesse_choix_57']))));
  assert(!/te laisse la serrure/.test(txt(scene('ACTE4_06_MASQUE_TOMBE_1', []))));
  out.alistair = 'OK';
}
// Séraphine : rupture ferme la romance
{
  const romS = id => (api.DB[id] && api.DB[id].choices || []).filter(c => c.target === 'Séraphine' && ['romance','tendresse'].includes(c.intent));
  const ids = Object.keys(api.DB).filter(id => romS(id).length);
  assert(ids.length > 0, 'des choix romantiques Séraphine existent');
  const gsR = { hasFlag: f => f === 'seraphine_rompue_57', getGauge: () => 10, hasGlobalFlag: () => false, hasItem: () => false };
  ids.forEach(id => romS(id).forEach(c => assert.equal(c.condition(gsR), false, 'rupture Séraphine : ' + id + '/' + c.key)));
  assert(/rompu sans scène/.test(txt(scene('ACTE4_09_TRONE_EBENE', ['seraphine_rompue_57']))));
  out.seraphine = 'OK ' + ids.length + ' scènes';
}
// Politique : dilemme du grain → conséquence en épilogue
{
  const c = scene('ACTE3_10_ACCUEIL_CULTE_1', []);
  assert(keys(c).includes('V57_ARC57_CONSEIL_FACTIONS'));
  assert(/grain partagé/.test(txt(scene('ACTE5_01_LENDEMAIN', ['grain_partage_57']))));
  assert(/des ordres/.test(txt(scene('ACTE5_01_LENDEMAIN', ['grain_ordonne_57']))));
  out.politique = 'OK';
}
// NG+ : choix conditionnés par le savoir
{
  assert(keys(scene('NGP_12_FEN', ['ngplus_fen_confession'])).includes('SAVOIR_FRESQUE'));
  assert(!keys(scene('NGP_12_FEN', [])).includes('SAVOIR_FRESQUE'));
  assert(keys(scene('NGP_10_ORAYA', ['ngplus_memoire_acceptee'])).includes('TEMOIGNER_57'));
  assert(keys(scene('NGP_15_DERNIER_CHOIX', ['ngplus_architecte_demande','ngplus_nom_cycle'])).includes('NOMMER_ARCHITECTE'));
  assert(!keys(scene('NGP_15_DERNIER_CHOIX', ['ngplus_nom_cycle'])).includes('NOMMER_ARCHITECTE'));
  assert(/furet peint/.test(txt(scene('NGP_04_FRESQUE_REPRISE', []))), 'recadrage NG+ de Fen');
  out.ngplus = 'OK';
}
console.log(JSON.stringify(out));
