#!/usr/bin/env node
// 60 — régressions des ré-audits V59 (revue-59/rapports). Un bloc par P0 / majeur.
'use strict';
const fs = require('fs'), path = require('path'), assert = require('assert/strict'), vm = require('vm');
const R = path.resolve(__dirname, '..'), root = path.join(R, 'elenya-refonte-52.4');
const { api, ctx } = require(root + '/qa/engine.cjs').loadEngine(root + '/project');
const C = x => JSON.parse(JSON.stringify(x));
const go = s => api.serverGetPendingScene(C(Object.assign({ gameMode: 'classic' }, s)));
const txt = d => String(d.narrative || '');
const out = {}; const ok = (k, v) => { out[k] = v || 'OK'; };
function rng(seed) { let s = (seed * 7919) >>> 0; return () => { s = (Math.imul(s, 1664525) + 1013904223) >>> 0; return s / 4294967296; }; }
const N = Number(process.env.PARTIES60 || 120);

{ // playtest P0 1-3 : jamais de mort sur un clic « Suivant » ; la reprise (dernier vrai choix) offre toujours un choix qui survit.
  let morts = 0, sauvables = 0, surSuivant = 0; const parType = {};
  for (let g = 0; g < N; g++) {
    const r = rng(5000 + g); let s = { gameMode: 'classic' }, snap = null, dernier = null;
    for (let k = 0; k < 450; k++) {
      const d = api.serverGetPendingScene(C(s)); s = d.renderedState;
      if (d.isEnd) {
        const id = s.currentSceneId;
        if (/^GAME_OVER_/.test(id)) {
          morts++; parType[id] = (parType[id] || 0) + 1;
          if (dernier && dernier.n < 2 && /VENIN|SURCHARGE/.test(id)) surSuivant++;
          if (snap) { const ds = api.serverGetPendingScene(C(snap)); const st = ds.renderedState;
            const survit = (ds.choices || []).some(c => { const x = api.serverProcessChoice(C(st), c.key); if (!x || x.error) return false; const n = api.serverGetPendingScene(C(x.updatedState)); return !/^GAME_OVER_/.test(n.renderedState.currentSceneId); });
            if (survit) sauvables++; else assert.fail('reprise sans issue : ' + id + ' depuis ' + st.currentSceneId); }
        }
        break;
      }
      const ch = d.choices || []; if (!ch.length) break;
      if (ch.length >= 2) snap = C(s);
      const c = ch[Math.floor(r() * ch.length)]; dernier = { scene: s.currentSceneId, n: ch.length };
      const x = api.serverProcessChoice(C(s), c.key); if (!x || x.error) break; s = x.updatedState;
    }
  }
  assert.equal(surSuivant, 0, 'mort par venin ou surcharge après un clic sur une scène à choix unique');
  ok('repriseEtSuivant', { parties: N, morts, sauvables, parType });
}
{ // playtest P0 3 : ENTREE_SANCTUAIRE ne tue plus ; le venin à 0 ouvre une agonie à deux choix.
  const d = go({ currentSceneId: 'ACTE3_09_ENTREE_SANCTUAIRE', flags: ['urgence_declenchee', 'venin_alerte_vue'], timers: { venin: 0 } });
  assert.equal(d.renderedState.currentSceneId, 'AGONIE_VENIN');
  const keys = d.choices.map(c => c.key); assert.equal(JSON.stringify(keys.sort()), '["CEDER","GELER"]');
  const x = api.serverProcessChoice(C(d.renderedState), 'GELER'); const n = api.serverGetPendingScene(C(x.updatedState));
  assert.equal(n.renderedState.currentSceneId, 'ACTE3_09_ENTREE_SANCTUAIRE', 'GELER ramène à la scène');
  const d2 = go({ currentSceneId: 'ACTE3_08_MISE_AU_POINT', flags: ['_surcharge_sursis_vu', '_surcharge_sursis2_vu'], gauges: { instabilite: 58 } });
  assert.equal(d2.renderedState.currentSceneId, 'AGONIE_SURCHARGE');
  const y = api.serverProcessChoice(C(d2.renderedState), 'RENDRE'); assert.ok(y.updatedState.gauges.instabilite <= 34);
  ok('agonies');
}
{ // playtest P1 4 : le coût en givre est fourni AVANT le clic.
  const d = go({ currentSceneId: 'ACTE2_14_VALVE_INTERMEDIAIRE' });
  const c = (d.choices || []).find(c => c.key === 'ABSORBER_FILON'); assert(c && c.givre > 0, 'givre affiché sur le bouton');
  const html = fs.readFileSync(path.join(root, 'project/Scripts_Game.html'), 'utf8');
  assert.match(html, /givre-cout/); assert.match(html, /querySelectorAll\('#choices button'\)\.length >= 2/);
  ok('coutAvantClic');
}
const DB = vm.runInContext('DB', ctx);
{ // bible V59 1, 4, 15, N1-N3
  const t = id => String(DB[id].getDynamicNarrative ? DB[id].getDynamicNarrative({ hasFlag: () => false, getGauge: () => 0, hasGlobalFlag: () => false, flags: [], gauges: {} }) : DB[id].text || '');
  const src = fs.readFileSync(path.join(root, 'project/DATABASE_Secondary.js'), 'utf8');
  for (const id of ['ORAYA_INDICE_1', 'ORAYA_INDICE_2', 'ORAYA_INDICE_3']) {
    const i = src.indexOf("'" + id + "'"), j = src.indexOf("\n'", i + 5); const bloc = src.slice(i, j);
    assert.doesNotMatch(bloc, /bleu|siècles|De la reconnaissance|premier fragment|salle de miroirs/, id + ' révèle encore');
  }
  const frag = fs.readFileSync(path.join(root, 'project/DATABASE_Fragments.js'), 'utf8');
  assert.doesNotMatch(frag, /Fen[^.\n]{0,60}yeux[^.\n]{0,40}ambre/, 'Fen aux yeux d’ambre');
  const html = fs.readFileSync(path.join(root, 'project/Scripts_Refonte.html'), 'utf8');
  const bloc = html.slice(html.indexOf("['Primaëlys'"), html.indexOf('];', html.indexOf("['Primaëlys'")));
  const entrees = [...bloc.matchAll(/\['([^']+)','([^']+)','/g)]; assert(entrees.length >= 5);
  for (const [, nom, id] of entrees) assert.ok(DB[id] || api.NGPLUS_DB[id] || vm.runInContext('typeof NGPLUS_DB!=="undefined"&&NGPLUS_DB', ctx)[id], 'Codex ' + nom + ' : id inconnu ' + id);
  ok('bible', entrees.length + ' entrées Codex');
}
{ // continuité V59 N1 : un choix vers une scène absente n’est pas proposé (pas de boucle ERREUR_SCENE)
  DB.ACTE2_08_MATIN_AUBERGE.choices.push({ key: 'TEST_FANTOME', text: 'x', next: 'SCENE_QUI_NEXISTE_PAS' });
  const d = go({ currentSceneId: 'ACTE2_08_MATIN_AUBERGE' });
  assert(!(d.choices || []).some(c => c.key === 'TEST_FANTOME')); DB.ACTE2_08_MATIN_AUBERGE.choices.pop();
  ok('pasDeBoucleErreur');
}
{ // continuité V59 N2-N3
  const x = api.serverProcessChoice({ gameMode: 'classic', currentSceneId: 'TRIO_NUIT_DOME', flags: ['avec_ombre', 'avec_eclaireur'], gauges: { lien_O: 5, lien_E: 5 } }, (go({ currentSceneId: 'TRIO_NUIT_DOME', flags: ['avec_ombre', 'avec_eclaireur'], gauges: { lien_O: 5, lien_E: 5 } }).choices.find(c => /ACCEPT|OUI|ACCORD/.test(c.key)) || {}).key);
  if (x && x.updatedState && x.updatedState.flags.includes('trio_accord')) assert(x.updatedState.flags.includes('poly_active'), 'poly_active avec trio_accord');
  const src = fs.readFileSync(path.join(root, 'project/22_State.js'), 'utf8');
  const W = vm.runInContext('FLAG_WRITE_ALIASES', ctx); assert.ok(JSON.stringify(W.trio_accord).includes('poly_active')); assert.ok(!W.amis_O && !W.amis_E, 'alias amis à double sens');
  ok('polyEtAlias');
}
{ // romance V59 N1 + qa V59 #1-2 : un clic au réveil ne rouvre pas le trio ; la réparation et la crevasse comptent
  const base = { currentSceneId: 'ACTE4_01_HALTE_DOME', gauges: { lien_O: 5, lien_E: 5 } };
  // 60.8.1 : le dôme exige aussi que chacun puisse dire oui (intérêt déclaré, lien ≥ 5) ; on le donne aux cas positifs.
  const I = ['focus_romantique_O', 'focus_romantique_E'];
  const f = ['avec_ombre', 'avec_eclaireur', 'lisiere_trio_ouvert', 'double_jeu', 'reve_poly', 'apres_sirene_libere_59'].concat(I);
  assert.notEqual(go(Object.assign({}, base, { flags: f })).renderedState.currentSceneId, 'TRIO_NUIT_DOME', 'un clic au réveil rouvre le trio');
  assert.equal(go(Object.assign({}, base, { flags: f.concat(['poly_repare_60']) })).renderedState.currentSceneId, 'TRIO_NUIT_DOME');
  const cr = go(Object.assign({}, base, { flags: ['avec_ombre', 'avec_eclaireur', 'lisiere_trio_ouvert', 'crevasse_domination'].concat(I) }));
  assert.notEqual(cr.renderedState.currentSceneId, 'TRIO_NUIT_DOME'); assert.match(txt(cr), /la question s’est refermée/);
  assert.equal(go(Object.assign({}, base, { currentSceneId: 'ACTE4_05_ARRIVEE_PORTES_1', flags: ['avec_ombre', 'avec_eclaireur', 'lisiere_trio_ouvert'].concat(I) })).renderedState.currentSceneId, 'TRIO_NUIT_DOME', 'troisième fenêtre');
  ok('trio');
}
{ // romance V59 N2-N4, N7 ; qa V59 #3-4, #8
  const r7 = f => txt(go({ currentSceneId: 'ACTE3_07_BRISER_LA_GLACE', flags: ['avec_ombre', 'avec_eclaireur'].concat(f) }));
  assert.doesNotMatch(r7(['reve_poly']), /Personne n’a choisi cette nuit/); assert.doesNotMatch(r7(['reve_O', 'apres_sirene_assume_59']), /Personne n’a choisi cette nuit/);
  assert.match(r7(['reve_O']), /Personne n’a choisi cette nuit/);
  assert.doesNotMatch(txt(go({ currentSceneId: 'ACTE3_08_MISE_AU_POINT', flags: ['avec_ombre', 'avec_eclaireur', 'reve_E'] })), /orgueil de Kaelen saigne/);
  const sep = vm.runInContext('typeof RECIT57_CHOIX !== "undefined" ? 1 : 0', ctx);
  const ref = fs.readFileSync(path.join(root, 'project/23_Refonte.js'), 'utf8').split('\n').find(l => l.includes("{ key:'SEPARER'"));
  assert.match(ref, /seraphine_separee_59/); assert.doesNotMatch(ref, /seraphine_rompue_57/);
  const ombre = DB.ACTE4_09_TRONE_EBENE.choices.find(c => c.key === 'FIN_OMBRE');
  if (ombre && ombre.condition) assert.equal(!!ombre.condition({ hasFlag: f => ['avec_ombre', 'romance_reelle_O', 'domination_acte3_O'].includes(f), getGauge: () => 12, hasGlobalFlag: () => false }), false, 'domination acte 3 → FIN_OMBRE');
  const fj = go({ currentSceneId: 'ACTE3_13_ARTEFACT', flags: ['_fragment_3_vu'], gauges: { memoire_kalthar: 4 } });
  assert.equal(fj.renderedState.currentSceneId, 'FRAGMENT_ANCESTRE_KALTHAR_JEUNE');
  ok('romanceEtQa');
}
{ // playtest V59 P1 7 : sirène et sceau laissent un dernier souffle ; une sauvegarde sur l’écran de fin reste sur l’écran de fin
  const b = { currentSceneId: 'ACTE3_04_ENVOUTEMENT', flags: ['avec_ombre', 'avec_eclaireur'], gauges: { volonte: 5 } };
  const p0 = go(b); const r = api.serverProcessChoice(C(p0.renderedState), 'ABANDON'); assert(r && !r.error);
  const d = go(r.updatedState); assert.equal(d.renderedState.currentSceneId, 'SIRENE_DERNIER_SOUFFLE');
  const l = api.serverProcessChoice(C(d.renderedState), 'LUTTER'); assert.equal(go(l.updatedState).renderedState.currentSceneId !== 'GAME_OVER_SIRENE', true);
  const c = api.serverProcessChoice(C(d.renderedState), 'CEDER'); assert.equal(go(c.updatedState).renderedState.currentSceneId, 'GAME_OVER_SIRENE', 'céder mène à la fin');
  assert.equal(go({ currentSceneId: 'GAME_OVER_SIRENE', flags: [] }).renderedState.currentSceneId, 'GAME_OVER_SIRENE', 'sauvegarde sur l’écran de fin');
  assert.ok(DB.SCEAU_DERNIER_SOUFFLE && ['RELEVER', 'CEDER'].every(k => DB.SCEAU_DERNIER_SOUFFLE.choices.some(x => x.key === k)));
  ok('derniersSouffles');
}
console.log(JSON.stringify(out));
