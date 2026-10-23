#!/usr/bin/env node
// 60.8.0 (revue sauvegardes B1, M1) : « Nouveau NG+ » purge l'ancien run NG+ (manifeste + fragments) ;
// une sauvegarde pointant vers une scène inconnue passe par ERREUR_SCENE et en ressort (pas de boucle).
'use strict';
const path = require('node:path'), assert = require('node:assert/strict');
const root = path.resolve(__dirname, '../elenya-refonte-52.4');
const { loadEngine } = require(root + '/qa/engine.cjs');
const C = x => JSON.parse(JSON.stringify(x)); const out = {};
// B1 : ancien run NG+ fragmenté, puis nouveau NG+, puis rechargement dans un nouveau moteur.
{
  const props = new Map(); const a = loadEngine(root + '/project', props).ctx;
  a.serverGetMainMenu = () => ({ ngPlusUnlocked: true, globalFlags: [], achievements: [] }); // déverrouillage simulé (le reste est réel)
  const debut = a.serverStartNewGamePlus(); assert(debut.ok, 'NG+ refusé : ' + debut.error);
  const vieux = C(debut.state); vieux.currentSceneId = 'NGP_13_BRASIER'; vieux.flags.push('ancien_run_608');
  vieux.narrative = Object.assign({}, vieux.narrative, { remplissage: 'x'.repeat(6000) }); // force plusieurs fragments
  const w = a.serverSaveGame(vieux); assert(w.ok, 'sauvegarde NG+ : ' + w.error);
  const cles = () => [...props.keys()].filter(k => /elenya_state_ngplus/.test(k));
  assert(cles().some(k => /_chunk_/.test(k)), 'témoin : ancien run fragmenté');
  const neuf = a.serverStartNewGamePlus(); assert(neuf.ok, 'nouveau NG+ : ' + neuf.error);
  const b = loadEngine(root + '/project', props).ctx; const l = b.serverLoadGame('ngplus');
  assert(l.ok, 'chargement : ' + l.error);
  assert.equal(l.state.currentSceneId, 'NGP_01_SEUIL', 'le nouveau NG+ doit repartir du seuil');
  assert(!l.state.flags.includes('ancien_run_608'), 'drapeaux de l’ancien run encore présents');
  const m = JSON.parse(props.get('elenya_state_ngplus_manifest') || 'null'); const vivants = new Set((m && m.chunks) || []);
  const orphelins = cles().filter(k => /_chunk_/.test(k) && !vivants.has(k)); assert.deepEqual(orphelins, [], 'fragments orphelins');
  // La sauvegarde classique n'est pas touchée par un nouveau NG+.
  const cl = a.serverGetPendingScene({ gameMode: 'classic' }).renderedState; assert(a.serverSaveGame(cl).ok);
  a.serverStartNewGamePlus(); assert.equal(loadEngine(root + '/project', props).ctx.serverLoadGame('classic').state.currentSceneId, cl.currentSceneId, 'sauvegarde classique intacte');
  out.ngplus = 'ancien run purgé, aucun fragment orphelin, classique intact';
}
// M1 : scène inconnue → ERREUR_SCENE réelle → sortie vers la dernière scène connue.
{
  const a = loadEngine(root + '/project', new Map()).ctx;
  const st = a.serverGetPendingScene({ gameMode: 'classic' }).renderedState; const connue = st.currentSceneId;
  const k0 = a.serverGetPendingScene(C(st)).choices[0].key; let s = a.serverProcessChoice(C(st), k0).updatedState;
  s.currentSceneId = 'SCENE_SUPPRIMEE_XYZ';
  const d = a.serverGetPendingScene(C(s)); assert.equal(d.renderedState.currentSceneId, 'ERREUR_SCENE', 'scène inconnue → ERREUR_SCENE');
  assert(d.choices.length, 'ERREUR_SCENE propose une sortie');
  const r = a.serverProcessChoice(C(d.renderedState), d.choices[0].key); assert(r && !r.error, 'sortie refusée');
  const d2 = a.serverGetPendingScene(C(r.updatedState)); assert.notEqual(d2.renderedState.currentSceneId, 'SCENE_SUPPRIMEE_XYZ', 'boucle sur la scène inconnue');
  assert.notEqual(d2.renderedState.currentSceneId, 'ERREUR_SCENE', 'boucle sur ERREUR_SCENE');
  out.sceneInconnue = 'ERREUR_SCENE → ' + d2.renderedState.currentSceneId + ' (dernière connue : ' + connue + ')';
}
console.log(JSON.stringify(out));
