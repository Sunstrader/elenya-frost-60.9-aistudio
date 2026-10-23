#!/usr/bin/env node
// 60.8.1 : constats narration / bible confirmés dans le code et corrigés (un test par constat).
'use strict';
const assert = require('node:assert/strict');
const { engine, clone } = require('./lib.cjs'); const { api } = engine();
const out = {};
const rend = (id, flags, gauges, extra) => { const s = Object.assign({ gameMode: 'classic', currentSceneId: id, flags: flags.slice(), gauges: Object.assign({ lien_O: 5, lien_E: 5 }, gauges || {}) }, extra || {});
  const d = api.serverGetPendingScene(s); assert.equal(d.renderedState.currentSceneId, id, id + ' intercepté'); return String(d.narrative || ''); };
// P1-4 : « Sept. L’âge que j’avais. » ne révèle plus l’âge du contrat à l’auberge.
{ const t = rend('ACTE2_08_MATIN_AUBERGE', ['avec_ombre']); assert(!/L’âge que j’avais/.test(t), 'spoiler Sept'); assert(/s’arrête à sept/.test(t), 'le geste reste'); out.sept = 'sans révélation'; }
// P1-5 : FIN_SACRIFICE ne fait pas veiller un Kaelen perdu.
{ const a = rend('FIN_SACRIFICE', ['kaelen_perdu']), b = rend('FIN_SACRIFICE', ['avec_ombre']);
  assert(!/Kaelen reste au pied du Trône/.test(a), 'Kaelen perdu au pied du Trône'); assert(/Kaelen reste au pied du Trône/.test(b), 'Kaelen présent : texte gardé'); out.sacrifice = 'OK'; }
// P1-7 : les deux décisions R608 jamais relues ont maintenant une conséquence affichée.
{ const ech = (id, f, re, ex) => { assert(re.test(rend(id, [f].concat(ex || []))), id + ' : écho ' + f); assert(!re.test(rend(id, ex || [])), id + ' : écho sans drapeau'); };
  ech('ACTE4_06_MASQUE_TOMBE_1', 'r608_chaines_questionnees', /« Quelles chaînes \? » lui avais-tu demandé/, ['_aveu_parallele_vu']);
  ech('ACTE3_05_FIEVRE', 'r608_morsure_comptee', /Onze battements, douze/);
  out.r608 = 'chaînes et morsure relues'; }
// Bible #1 : en voie solo (sans avec_ombre), Kaelen ne passe pas devant ta chambre.
{ const re = /seule à m’avoir demandé mon nom/; assert(!re.test(rend('ACTE2_06_NUIT_AUBERGE', ['r608_nom_kaelen_demande', 'voie_solo'])), 'écho Kaelen en solo');
  assert(re.test(rend('ACTE2_06_NUIT_AUBERGE', ['r608_nom_kaelen_demande', 'avec_ombre'])), 'écho Kaelen avec lui'); out.soloKaelen = 'OK'; }
// Playtest 608 #6 : FIN_EQUILIBRE ne nie plus le consort choisi au Seuil.
{ const a = rend('FIN_EQUILIBRE', ['variante_FIN_EQUILIBRE', 'consort_kaelen', 'avec_ombre', 'avec_eclaireur']), b = rend('FIN_EQUILIBRE', ['variante_FIN_EQUILIBRE', 'avec_ombre', 'avec_eclaireur']);
  assert(!/Tu n’as choisi ni l’un ni l’autre/.test(a) && /veines de Kaelen/.test(a), 'EQUILIBRE avec consort'); assert(/Tu n’as choisi ni l’un ni l’autre/.test(b), 'EQUILIBRE sans consort'); out.equilibre = 'OK'; }
// Bible 608 #3-#5 : contrat des Confrères cohérent, écho de Kalthar fidèle à R608_VERITE, réponse d’un compagnon réellement présent.
{ const a = rend('ACTE4_06_OMBRE_AVEU', ['r608_confreres_entendus', 'avec_ombre', '_aveu_parallele_vu']); if (/Confrères paient double/.test(a)) assert(!/oublie un visage/.test(a) && /livre vivant/.test(a), 'contrat des Confrères');
  const S = require('node:fs').readFileSync(require('node:path').join(__dirname, '../elenya-refonte-52.4/project/23_Refonte.js'), 'utf8');
  assert(!/oublie un visage/.test(S), 'plus de « oublie un visage »'); assert(!/que tu ne savais pas qui tu étais\. Il ne te répond pas/.test(S), 'écho Kalthar fidèle');
  const V = (api.DB.FRAGMENT_ANCESTRE_KALTHAR_REVEIL.choices || []).find(c => c.key === 'R608_VERITE'); assert(V && typeof V.response === 'function', 'R608_VERITE');
  const rep = f => V.response({ hasFlag: x => f.includes(x), flags: f, getGauge: () => 0 });
  assert(!/Kaelen/.test(rep(['avec_ombre', 'kaelen_mort'])), 'Kaelen mort répond'); assert(/Kaelen/.test(rep(['avec_ombre'])), 'Kaelen présent répond');
  out.bible = 'contrat, Kalthar, présence'; }
console.log(JSON.stringify(out));
