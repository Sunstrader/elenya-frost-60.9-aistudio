#!/usr/bin/env node
// 60.1 (audit, phase 2) : chaque catégorie de mort passe par une dernière seconde à deux choix (survivre / céder),
// la survie ramène au jeu, céder mène au bon GAME_OVER ; chronologie (Fen, Kalthar, Oraya, Veyra) sans durée contradictoire.
'use strict';
const fs = require('node:fs'), path = require('node:path'), assert = require('node:assert/strict');
const { engine, clone } = require('./lib.cjs'); const { api } = engine();
const go = s => api.serverGetPendingScene(clone({ gameMode: 'classic', flags: [], gauges: {}, timers: {}, ...s }));
const out = { categories: {} };
// État d'entrée réel de chaque catégorie (déclencheur du moteur, pas de scène injectée directement).
const CAS = {
  VENIN: { entree: { currentSceneId: 'ACTE3_09_ENTREE_SANCTUAIRE', flags: ['urgence_declenchee', 'venin_alerte_vue'], timers: { venin: 0 } }, agonie: 'AGONIE_VENIN' },
  SURCHARGE: { entree: { currentSceneId: 'ACTE3_08_MISE_AU_POINT', flags: ['_surcharge_sursis_vu', '_surcharge_sursis2_vu'], gauges: { instabilite: 58 } }, agonie: 'AGONIE_SURCHARGE' },
  POSSESSION: { entree: { currentSceneId: 'ACTE4_08_CORRIDOR_OBSIDIENNE', flags: ['_possession_warning_vu'], gauges: { possession: 25 } }, agonie: 'AGONIE_POSSESSION' },
  SIRENE: { entree: { currentSceneId: 'ACTE3_04_ENVOUTEMENT', flags: ['avec_ombre'], gauges: { volonte: 5 } }, choix: 'ABANDON', agonie: 'SIRENE_DERNIER_SOUFFLE' },
  SCELLEE: { entree: { currentSceneId: 'ACTE4_06_MASQUE_TOMBE_2', flags: ['avec_ombre'] }, choix: 'SUBMIT', agonie: 'SCEAU_DERNIER_SOUFFLE' },
};
const DB = api.DB;
for (const [cat, c] of Object.entries(CAS)) {
  const A = DB[c.agonie]; assert(A, cat + ' : scène d’agonie absente');
  const morts = A.choices.filter(x => x.next === 'GAME_OVER_' + cat), survies = A.choices.filter(x => x.next !== 'GAME_OVER_' + cat && !/^GAME_OVER_/.test(String(x.next)));
  assert(morts.length >= 1 && survies.length >= 1, cat + ' : il faut un choix de mort ET un choix de survie');
  let atteinte = 'scène définie';
  if (c.entree) {
    let d = go(c.entree);
    if (c.choix) { const x = api.serverProcessChoice(clone(d.renderedState), c.choix); d = api.serverGetPendingScene(clone(x.updatedState)); }
    assert.equal(d.renderedState.currentSceneId, c.agonie, cat + ' : le déclencheur doit ouvrir l’agonie');
    const st = d.renderedState;
    const y = api.serverProcessChoice(clone(st), morts[0].key); const fin = api.serverGetPendingScene(clone(y.updatedState));
    assert.equal(fin.renderedState.currentSceneId, 'GAME_OVER_' + cat, cat + ' : céder');
    // Survie : au moins un choix de survie offert à l'écran ramène hors GAME_OVER.
    const offerts = (d.choices || []).map(x => x.key);
    const ok = survies.filter(x => offerts.includes(x.key)).some(x => { const z = api.serverProcessChoice(clone(st), x.key); if (!z || z.error) return false; return !/^GAME_OVER_|^AGONIE_|DERNIER_SOUFFLE/.test(api.serverGetPendingScene(clone(z.updatedState)).renderedState.currentSceneId); });
    assert(ok, cat + ' : aucun choix de survie ne ramène au jeu');
    atteinte = 'déclencheur → ' + c.agonie + ' → survie OK / céder → GAME_OVER_' + cat;
  }
  out.categories[cat] = atteinte;
}
// Toutes les catégories GAME_OVER du jeu sont couvertes.
const toutes = Object.keys(DB).filter(k => /^GAME_OVER_/.test(k)).map(k => k.slice(10)).sort();
assert.deepEqual(toutes, Object.keys(CAS).sort(), 'catégorie de mort non couverte');
// Chronologie : une seule durée pour l'histoire de Kalthar / Oraya / Veyra / Fen.
const src = fs.readdirSync(path.join(__dirname, '../elenya-refonte-52.4/project')).filter(f => /^DATABASE_.*\.js$|^23_Refonte\.js$|^24_NGPlus_Ultra\.js$/.test(f))
  .map(f => fs.readFileSync(path.join(__dirname, '../elenya-refonte-52.4/project', f), 'utf8')).join('\n');
const durees = [...src.matchAll(/(deux|trois|quatre|cinq|six|sept|huit|neuf|dix|cent|mille|[0-9]+)[\s\u00a0\u202f-]+(siècles?|cents ans|millénaires?)/gi)].map(m => m[0].toLowerCase().replace(/[\s\u00a0\u202f-]+/g, ' '));
const distinctes = [...new Set(durees)];
out.chronologie = distinctes;
assert(distinctes.every(x => /^trois (siècles|cents ans)$/.test(x)), 'durées contradictoires : ' + distinctes.join(', '));
const conf = DB.ORAYA_CONFRONTATION; assert(conf, 'ORAYA_CONFRONTATION absente');
console.log(JSON.stringify(out));
