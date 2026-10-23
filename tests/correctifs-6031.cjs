#!/usr/bin/env node
// 60.3.1 : preuve par simulation de chaque correctif (moteur réel, états construits à partir de parties réelles).
'use strict';
const assert = require('node:assert/strict');
const { engine, clone, rng } = require('./lib.cjs'); const { api } = engine();
const out = {};
function joue(seed, pref, stop) {
  const r = rng(seed); let s = { gameMode: 'classic' };
  for (let i = 0; i < 500; i++) {
    const d = api.serverGetPendingScene(clone(s)); s = d.renderedState;
    if (stop(s, d)) return { s, d };
    if (d.isEnd) return null;
    const keys = d.choices.map(c => c.key);
    const k = pref.find(p => keys.includes(p)) || keys[Math.floor(r() * keys.length)];
    s = api.serverProcessChoice(clone(s), k).updatedState;
  }
  return null;
}
const trouve = (pref, stop, n = 400) => { for (let i = 1; i < n; i++) { const p = joue(i * 37, pref, stop); if (p) return Object.assign(p, { seed: i * 37 }); } return null; };
const choisir = (s, k) => { const r = api.serverProcessChoice(clone(s), k); assert(r && !r.error, 'choix ' + k + ' refusé'); return api.serverGetPendingScene(r.updatedState); };
const avec = (s, flags, gauges, rep) => { s = clone(s); s.flags = [...new Set([...(s.flags || []), ...(flags || [])])]; s.gauges = Object.assign({}, s.gauges, gauges || {}); if (rep) s.reputation = Object.assign({}, s.reputation, rep); return s; };
// 1. Stèle : aucune révélation d'Oraya à l'acte 3.
{
  const p = trouve(['STELE603'], s => s.currentSceneId === 'ACTE3_09B_BIVOUAC_TEMPETE');
  assert(p, 'bivouac de la tempête jamais atteint');
  assert(p.d.choices.some(c => c.key === 'STELE603'), 'halte stèle proposée');
  const d = choisir(p.s, 'STELE603');
  assert.equal(d.renderedState.currentSceneId, 'STELE603_INDICE', 'la halte mène à l’indice, plus à FRAGMENT_4_ENRICHI');
  assert(!/Oraya|Trône/.test(d.narrative), 'ni Oraya ni Trône dans l’indice');
  const d2 = choisir(d.renderedState, 'NEXT'); const f = d2.renderedState.flags;
  assert.equal(d2.renderedState.currentSceneId, 'ACTE3_09B_BIVOUAC_TEMPETE', 'retour au bivouac');
  ['_frag4_enrichi_vu', 'frag4_nom_prononce', 'verite_complete'].forEach(x => assert(!f.includes(x), x + ' non posé à l’acte 3'));
  assert(!d2.choices.some(c => c.key === 'STELE603'), 'halte non rejouable');
  assert.equal((d2.quetes603 || []).find(q => q.id === 'stele').etat, 'en cours');
  // Au seuil du Trône : FRAGMENT_4_STELE (la vraie révélation) passe en premier.
  const s4 = avec(d2.renderedState, [], { memoire_kalthar: 14 }); s4.currentSceneId = 'ACTE4_07_ADIEU_KALTHAR';
  const d4 = api.serverGetPendingScene(s4);
  assert.equal(d4.renderedState.currentSceneId, 'FRAGMENT_4_STELE', 'révélation à l’acte 4');
  // Garde statique : plus aucun choix ne mène à FRAGMENT_4_ENRICHI.
  const vers = Object.entries(api.DB).filter(([, S]) => (S.choices || []).some(c => c.next === 'FRAGMENT_4_ENRICHI')).map(([k]) => k);
  assert.deepEqual(vers, [], 'choix vers FRAGMENT_4_ENRICHI : ' + vers);
  out.stele = 'graine ' + p.seed + ' : STELE603 → STELE603_INDICE → bivouac ; FRAGMENT_4_STELE à l’acte 4';
}
// 2. Quête des dettes : visible, démarrable, terminable.
{
  const p = trouve([], s => s.flags.includes('dette_O_confrontee') || s.flags.includes('dette_E_confrontee'), 800);
  assert(p, 'aucune dette confrontée au hasard');
  const q = (p.d.quetes603 || []).find(x => x.id === 'dette'); assert(q && q.etat === 'en cours' && q.indice, 'quête dette visible');
  const fin = api.serverGetPendingScene(avec(p.s, ['dette_O_confrontee', 'dette_E_confrontee', 'dette_systeme_compris', 'dette_position_finale', 'dette_rendue_aux_deux']));
  assert.equal(fin.quetes603.find(x => x.id === 'dette').etat, 'accomplie', 'dette_rendue_aux_deux termine la quête');
  // Vrai choix RENDRE de DETTE_CHOIX.
  const dc = avec(p.s, ['dette_O_confrontee', 'dette_E_confrontee', 'dette_systeme_compris']); dc.currentSceneId = 'DETTE_CHOIX'; dc.returnStack = ['ACTE4_09_ISSUES_SECONDAIRES'];
  const d0 = api.serverGetPendingScene(dc); const d1 = choisir(d0.renderedState, 'RENDRE');
  assert.equal(d1.quetes603.find(x => x.id === 'dette').etat, 'accomplie', 'choix RENDRE → accomplie');
  out.dette = 'graine ' + p.seed + ' : visible (« ' + q.indice + ' »), RENDRE → accomplie';
}
// 3. Halte de l'auberge : le pain est atteignable avec une réputation village à 0.
{
  const p = trouve(['HALTE603'], s => s.currentSceneId === 'HALTE603_AUBERGE');
  assert(p, 'salle commune jamais atteinte');
  assert.equal(p.s.reputation?.village || 0, 0, 'réputation village nulle');
  assert(p.d.choices.some(c => c.key === 'VILLAGE'), 'option VILLAGE offerte à 0');
  const d = choisir(p.s, 'VILLAGE'); assert(d.renderedState.inventory.includes('pain_village_603'), 'pain obtenu');
  const hostile = api.serverGetPendingScene(avec(p.s, [], {}, { village: -1 }));
  assert(!hostile.choices.some(c => c.key === 'VILLAGE'), 'fermée si hostile');
  // 7. Quête de Fen : quitter la halte sans Fen → « manquée », plus « en cours » à vie.
  const dq = choisir(p.s, 'REMONTER'); const qf = dq.quetes603.find(x => x.id === 'fen');
  assert(qf && qf.etat === 'manquée', 'quête Fen manquée');
  const df = choisir(p.s, 'FEN'); assert.equal(df.quetes603.find(x => x.id === 'fen').etat, 'accomplie');
  out.auberge = 'graine ' + p.seed + ' : village=0 → VILLAGE → pain ; REMONTER sans Fen → manquée ; FEN → accomplie';
}
// 4. Reconversion et indices du trio : jamais après domination ou refus.
{
  const p = trouve([], s => s.currentSceneId === 'ACTE4_09_TRONE_EBENE', 800); assert(p, 'Trône jamais atteint');
  const base = avec(p.s, ['voie_solo'], { presence_O: 9, lien_O: 5, presence_E: 9, lien_E: 5, possession: 0 }); // 60.3.2 : témoin sans emprise
  base.flags = base.flags.filter(f => !['avec_ombre', 'avec_eclaireur', 'romance_O_rompue', 'romance_E_rompue', 'go_poly_domination', 'domination_finale', 'crevasse_domination', 'kaelen_mort', 'alistair_mort', 'kaelen_perdu', 'alistair_perdu', 'kaelen_perdu_definitif', 'alistair_perdu_definitif', 'kaelen_refuse', 'alistair_refuse', 'amis_O', 'amis_E', 'amis_O_ferme', 'amis_E_ferme', 'romance_en_pause_O', 'romance_en_pause_E', 'domination_acte3_O', 'domination_acte3_E', 'domination_path_chosen'].includes(f));
  const C = api.DB.ACTE4_09_TRONE_EBENE.choices; const cO = C.find(c => c.key === 'V28_FIN_RECONVERSION_O'), cE = C.find(c => c.key === 'V28_FIN_RECONVERSION_E');
  const gs = st => api.makeGs ? api.makeGs(st) : null;
  const ok = (c, st) => { const g = api.gsFor ? api.gsFor(st) : { hasFlag: f => st.flags.includes(f), getGauge: k => st.gauges[k] || 0 }; return !!c.condition(g); };
  assert(ok(cO, base) && ok(cE, base), 'témoin : reconversion possible sans domination');
  ['crevasse_domination', 'domination_acte3_O', 'kaelen_refuse', 'amis_O'].forEach(f => assert(!ok(cO, avec(base, [f])), 'RECONVERSION_O bloquée par ' + f));
  ['crevasse_domination', 'domination_acte3_E', 'alistair_refuse', 'amis_E'].forEach(f => assert(!ok(cE, avec(base, [f])), 'RECONVERSION_E bloquée par ' + f));
  out.reconversion = 'bloquée par crevasse/domination acte 3/refus/amitié ; possible sinon';
}
{
  // Indices du trio : halte de l'auberge, rendu réel.
  const p = trouve(['HALTE603'], s => s.currentSceneId === 'HALTE603_AUBERGE');
  const ouv = ['poly_eligible', 'avec_ombre', 'avec_eclaireur', 'interet_romantique_O', 'interet_romantique_E'];
  const st = avec(p.s, ouv, { presence_O: 9, presence_E: 9, lien_O: 7, lien_E: 7, volonte: 10, possession: 0 });
  const r = x => api.serverGetPendingScene(x).narrative;
  const IND = /chaise libre entre eux/;
  const t0 = r(st); const present = IND.test(t0); assert(present, 'témoin : indice visible quand tout est consenti');
  ['kaelen_refuse', 'alistair_refuse', 'crevasse_domination', 'domination_acte3_O', 'amis_E', 'romance_en_pause_O'].forEach(f => assert(!IND.test(r(avec(st, [f]))), 'indice trio masqué par ' + f));
  assert(!IND.test(r(avec(st, ['double_jeu']))), 'masqué après nuit non réparée');
  const sansInteret = clone(st); sansInteret.flags = sansInteret.flags.filter(f => !/interet_romantique/.test(f));
  assert(!IND.test(r(sansInteret)), 'masqué sans romance ouverte');
  // Dôme : la réparation seule n'ouvre plus la question à trois.
  const tr = api.TRIGGERS ? api.TRIGGERS.find(t => t.id === 'trio_nuit_dome') : null;
  const srcT = require('fs').readFileSync(require('path').resolve(__dirname, '../elenya-refonte-52.4/project/10_Triggers.js'), 'utf8');
  assert(!/lisiere_trio_ouvert'\) \|\| s\.flags\.includes\('poly_repare_60'\)/.test(srcT), 'réparation ≠ ouverture');
  out.trio = 'indice ' + (present ? 'visible si consenti' : '(témoin non affiché : présence)') + ', masqué par refus/domination/pause/amitié/nuit non réparée';
}
// 5-6. Fins : pas de paragraphe doublé ; CHAOS et DOMINATION cohérentes.
{
  const p = trouve([], s => s.currentSceneId === 'ACTE4_09_TRONE_EBENE', 800);
  const rep = { village: 3, ordre: -3, culte: 3 };
  const fin = (id, flags) => { const s = avec(p.s, flags, {}, rep); s.currentSceneId = id; return api.serverGetPendingScene(s).narrative || ''; };
  const ECHO = 'on garde une place près du feu';
  ['FIN_TEMOIN', 'FIN_EQUILIBRE', 'FIN_RECONCILIATION', 'FIN_REDEMPTION', 'FIN_VERITE'].forEach(id => {
    const t = fin(id, id === 'FIN_VERITE' ? [] : ['variante_' + id]); const n = t.split(ECHO).length - 1;
    assert.equal(n, 1, id + ' : écho de réputation x' + n);
  });
  const ch = fin('FIN_CHAOS', ['variante_FIN_CHAOS']);
  assert(/Personne ne saura/.test(ch) && !ch.includes(ECHO) && !/chante ton nom/.test(ch) && !/Rien ne tient jusqu’au bout/.test(ch), 'FIN_CHAOS sans écho contradictoire');
  const dom = fin('FIN_DOMINATION', ['variante_FIN_DOMINATION', 'go_poly_domination']);
  assert(!/autre visage que le tien/.test(dom) && !/\*\*Domination\*\*/.test(dom) && !dom.includes(ECHO), 'FIN_DOMINATION cohérente');
  const solo = clone(p.s); solo.flags = solo.flags.filter(f => !/avec_|presence/.test(f)); solo.gauges = Object.assign({}, solo.gauges, { presence_O: 0, presence_E: 0 });
  out.fins = 'écho x1 dans les 5 fins Vérité ; CHAOS et DOMINATION sans contradiction';
}
// 8. qaModeEnabled : garde typeof dans le client.
{
  const fs = require('fs'), path = require('path');
  ['../elenya-refonte-52.4/project/Scripts_Game.html', '../index.html'].forEach(f => {
    const t = fs.readFileSync(path.resolve(__dirname, f), 'utf8');
    assert(!/[^.\w]if \(qaModeEnabled\(\)\)/.test(t), f + ' : appel non gardé');
    // Exécute autoSave isolé sans qaModeEnabled défini.
  });
  const t = fs.readFileSync(path.resolve(__dirname, '../elenya-refonte-52.4/project/Scripts_Game.html'), 'utf8');
  const garde = t.slice(t.indexOf('function autoSave()')).split('\n')[1];
  assert(/typeof qaModeEnabled === 'function'/.test(garde), 'garde typeof');
  assert.doesNotThrow(() => new Function('let r = 0; ' + garde.replace('return;', 'r = 1;').replace(/\/\/.*$/, '') + ' return r;')(), 'garde sans qaModeEnabled');
  out.qaMode = 'autoSave s’exécute sans ReferenceError';
}
console.log(JSON.stringify(out));
