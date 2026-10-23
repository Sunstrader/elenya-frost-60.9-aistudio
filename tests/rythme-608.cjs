#!/usr/bin/env node
// 60.8.0 : rythme. (1) les scènes fusionnées gardent leur texte : il apparaît en tête de l'écran suivant ;
// (2) la part d'écrans à choix unique baisse (44,4 % mesuré en 60.7.0) ; (3) les choix 60.8 sont proposés et changent l'état.
'use strict';
const assert = require('assert/strict');
const { engine, clone, rng } = require('./lib.cjs'); const { api } = engine();
const FUS = ['LIEN_MARCHE_2B', 'ACTE2_02B_PANTHERE_LIBEREE', 'ACTE2_02B_PANTHERE_ABSORBEE', 'ACTE3_11_PRISON_ECHANGE', 'ACTE4_07B_CHOC_FRAGMENT'];
const vus = {}, nouveaux = {}; let ecrans = 0, uniques = 0, erreurs = [];
for (let seed = 1; seed <= 150; seed++) { const r = rng(seed * 7 + 3); let s = { gameMode: 'classic' };
  for (let i = 0; i < 400; i++) { const d = api.serverGetPendingScene(clone(s)); s = d.renderedState; if (d.isEnd) break;
    ecrans++; if (d.choices.length === 1) uniques++;
    for (const c of d.choices) if (/^R608_/.test(c.key)) nouveaux[c.key] = (nouveaux[c.key] || 0) + 1;
    const c = d.choices[Math.floor(r() * d.choices.length)];
    const res = api.serverProcessChoice(clone(s), c.key); assert(res && !res.error, 'choix refusé ' + c.key);
    const ch = (api.DB[s.currentSceneId].choices || []).find(x => x.key === c.key);
    if (ch && ch._fusion608) { vus[ch._fusion608] = (vus[ch._fusion608] || 0) + 1;
      const txt = (res.nextSceneData && res.nextSceneData.choiceResponse) || '';
      if (txt.length < 30) erreurs.push(ch._fusion608 + ' depuis ' + s.currentSceneId + ' : texte fusionné vide'); }
    if (FUS.includes(res.updatedState.currentSceneId)) erreurs.push('scène fusionnée encore atteinte : ' + res.updatedState.currentSceneId);
    s = res.updatedState; } }
assert.deepEqual(erreurs, []);
for (const id of FUS) { assert(api.DB[id], id + ' doit rester dans DB (sauvegardes)'); assert(vus[id] > 0, id + ' : fusion jamais traversée'); }
const part = 100 * uniques / ecrans; assert(part < 38, 'part de choix uniques trop haute : ' + part.toFixed(1) + ' %');
assert(Object.keys(nouveaux).length >= 10, 'choix 60.8 proposés : ' + Object.keys(nouveaux).join(','));
// Une ancienne sauvegarde posée sur une scène fusionnée se recharge et avance.
for (const id of FUS) { let s = { gameMode: 'classic', currentSceneId: id }; const d = api.serverGetPendingScene(clone(s)); assert(d && d.choices.length, id + ' : sauvegarde non rechargeable'); }
console.log(JSON.stringify({ partChoixUniques: +part.toFixed(1), fusionsTraversees: vus, choix608: Object.keys(nouveaux).length }));
// Sauvegardes réelles 60.3.2 (moteur 60.3.2, tools/sauvegardes-fusions-608.cjs) arrêtées sur chaque scène fusionnée :
// rechargées sur la même scène, chaque choix accepté, et la partie va jusqu'à une fin sans erreur ni impasse.
{
  const { rng } = require('./lib.cjs');
  // 60.7.0 incluse : c'est la version que les joueurs ont réellement entre les mains.
  const SV = {}; const trouvees = {};
  for (const v of ['60.3.2', '60.7.0']) { const X = require('./fixtures/sauvegardes-fusions-' + v + '.json');
    for (const id of FUS) for (const [n, sv] of (X[id] || []).entries()) { (SV[id] = SV[id] || []).push(sv); trouvees[id + '#' + v + '#' + n] = sv.state; } }
  FUS.forEach(id => assert((SV[id] || []).length, id + ' : aucune sauvegarde réelle'));
  for (const [cle, st] of Object.entries(trouvees)) { const id = cle.split('#')[0];
    const d0 = api.serverGetPendingScene(clone(st)); assert(d0.renderedState.currentSceneId === id && d0.choices.length, id + ' : rechargement');
    for (const c of d0.choices) { const r0 = rng(id.length * 31 + c.key.length); let s = api.serverProcessChoice(clone(d0.renderedState), c.key);
      assert(s && !s.error && s.updatedState, id + '/' + c.key + ' refusé'); s = s.updatedState; let fin = false;
      for (let i = 0; i < 450 && !fin; i++) { const d = api.serverGetPendingScene(clone(s)); assert(d && d.renderedState, id + '/' + c.key + ' : écran vide'); s = d.renderedState;
        if (d.isEnd) { fin = true; break; } assert(d.choices.length, id + '/' + c.key + ' : impasse sur ' + s.currentSceneId);
        const k = d.choices[Math.floor(r0() * d.choices.length)].key; s = api.serverProcessChoice(clone(s), k).updatedState; }
      assert(fin, id + '/' + c.key + ' : aucune fin atteinte'); }
  }
  console.error('sauvegardes réelles sur scènes fusionnées : ' + new Set(Object.keys(trouvees).map(k => k.split('#')[0])).size + '/' + FUS.length + ' scènes, ' + Object.keys(trouvees).length + ' sauvegardes');
}
// Revue choix.md : chaque décision R608 est relue plus loin. État réel (parties figées 60.8.0) sur l'écran cible,
// avec puis sans le drapeau : la phrase apparaît seulement avec.
{
  const W = { r608_confreres_entendus: ['ACTE4_06_OMBRE_AVEU', 'paient double'], r608_fen_protege: ['FEN_ADIEU', 'face à l’automate'],
    r608_kalthar_avoue: ['ACTE4_07_ADIEU_KALTHAR', 'devant le fragment'], r608_querelle_ecoutee: ['ACTE3_08_MISE_AU_POINT', 'Depuis la frontière'],
    r608_rive_regardee: ['ACTE2_17_RETROUVAILLES_SORTIE', 'rive nord, tu avais'], r608_contrechant: ['ACTE3_04_ENVOUTEMENT', 'chanter faux'],
    r608_nom_kaelen_demande: ['ACTE2_06_NUIT_AUBERGE', 'avant de me demander mon prix'], reflet608_couronne: ['ACTE5_01_LENDEMAIN', 'reflet couronné du corridor'],
    reflet608_mains_vides: ['ACTE5_01_LENDEMAIN', 'mains nues'], r608_azaya: ['ACTE2_06_NUIT_AUBERGE', 'Azaya'], r608_steles_lues: ['ACTE3_10_ACCUEIL_CULTE_1', 'commençait par K'] };
  const R6 = require('./fixtures/routes-fins-60.8.0.json'); const etats = {};
  for (const rec of Object.values(R6)) { let s = { gameMode: rec.mode || 'classic' };
    for (const [, k] of rec.parcours) { const d = api.serverGetPendingScene(clone(s)); s = d.renderedState; (etats[s.currentSceneId] = etats[s.currentSceneId] || []).push(clone(s)); s = api.serverProcessChoice(clone(s), k).updatedState; } }
  const relus = [];
  for (const [f, [id, m]] of Object.entries(W)) {
    const cands = (etats[id] || []).filter(st => !st.flags.includes(f)); assert(cands.length, f + ' : aucun état réel sur ' + id);
    const ok = cands.some(st => { const sans = api.serverGetPendingScene(clone(st)).narrative || ''; const a = clone(st); a.flags.push(f); if (f === 'reflet608_mains_vides') a.flags = a.flags.filter(x => x !== 'reflet608_couronne');
      const avecT = api.serverGetPendingScene(a).narrative || ''; return avecT.includes(m) && !sans.includes(m); });
    assert(ok, f + ' : jamais relu sur ' + id); relus.push(f); }
  console.error('drapeaux R608 relus : ' + relus.length + '/' + Object.keys(W).length);
}
// Revue routes.md : (5) aucun choix, même ajouté après applyRythme608_, ne pointe vers une scène fusionnée ;
// (§5) on ne se relève du Sceau qu'une fois ; (§6.3) indice de FIN_SERAPHINE_LAME.
{
  for (const [id, sc] of Object.entries(api.DB)) for (const c of sc.choices || []) assert(!FUS.includes(c.next) || FUS.includes(id), id + '/' + c.key + ' → scène fusionnée ' + c.next);
  const R6 = require('./fixtures/routes-fins-60.8.0.json'); let base = null;
  for (const rec of Object.values(R6)) { let s = { gameMode: 'classic' }; for (const [, k] of rec.parcours) { const d = api.serverGetPendingScene(clone(s)); s = d.renderedState; if (s.currentSceneId === 'ACTE4_06_MASQUE_TOMBE_2') { base = clone(s); break; } s = api.serverProcessChoice(clone(s), k).updatedState; } if (base) break; }
  assert(base, 'état réel au Masque');
  const sc = clone(base); sc.currentSceneId = 'SCEAU_DERNIER_SOUFFLE'; sc.flags = sc.flags.filter(f => f !== 'sceau_dernier_souffle_60');
  assert(api.serverGetPendingScene(clone(sc)).choices.some(c => c.key === 'RELEVER'), 'premier passage : se relever possible');
  const sc2 = clone(sc); sc2.flags.push('sceau_dernier_souffle_60'); const k2 = api.serverGetPendingScene(sc2).choices.map(c => c.key);
  assert(!k2.includes('RELEVER') && k2.includes('CEDER'), 'second passage : plus de RELEVER (' + k2 + ')');
  const se = clone(base); se.currentSceneId = 'SERAPHINE_DERNIER_SERMENT'; se.gauges = Object.assign({}, se.gauges, { possession: 9, lien_seraphine: 6 });
  assert(/Avec la lame/.test(api.serverGetPendingScene(clone(se)).narrative || ''), 'indice LAME à possession 9');
  se.gauges.possession = 2; assert(!/Avec la lame/.test(api.serverGetPendingScene(clone(se)).narrative || ''), 'pas d’indice LAME sans emprise');
  console.error('routes.md : aucun lien vers une scène fusionnée, Sceau borné, indice LAME');
}
