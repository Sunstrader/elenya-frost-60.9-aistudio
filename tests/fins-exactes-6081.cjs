#!/usr/bin/env node
// 60.8.1 (P0) : les 36 fins rejouées depuis leur route figée, validées SANS famille :
//  1) identifiant exact de la scène finale ; 2) drapeaux attendus (variante propre, choix final NG+) ;
//  3) titre affiché = titre de la scène ; 4) texte affiché contenant la phrase propre à la fin, et aucune phrase
//     propre à une autre fin ; 5) 36 textes distincts, 36 routes distinctes.
// Non-régression : la route de libération ne doit jamais aboutir à NG_FIN_VIDE (défaut de 60.8.0).
'use strict';
const fs = require('node:fs'), path = require('node:path'), assert = require('node:assert/strict');
const { engine, clone } = require('./lib.cjs'); const { api } = engine();
const R = JSON.parse(fs.readFileSync(path.join(__dirname, 'fixtures/routes-fins-60.8.0.json'), 'utf8'));
const SIGNATURE = {
 "ACTE5_02_DEPART": "Sans couronne. Sans mythe. Sans dette.",
 "ACTE5_02_RETOUR": "Tu reviens sur tes pas.",
 "ACTE5_02_VEILLE": "Tu restes.",
 "FIN_CORONA": "Tu refuses le Trône. Tu refuses aussi la fuite. ",
 "FIN_DETTE_ANNULEE": "Tu ne t’assieds pas immédiatement. Devant le Trô",
 "FIN_EQUILIBRE": "Tu ne les as pas rejetés non plus. Tu as simplement cessé d’être le centre de leur guerre",
 "FIN_MIRA": "Tu quittes le Trône avant que quelqu’un ait le t",
 "FIN_MORTELLE": "Tu déclenches une surcharge cataclysmique. Le Tr",
 "FIN_RECONCILIATION": "Tu refuses la domination comme la soumission. Tu",
 "FIN_REDEMPTION": "C’est une rédemption.",
 "FIN_SERAPHINE": "Séraphine reste debout quand tous les autres s’a",
 "FIN_SERAPHINE_COEUR": "Tu ne t’assieds pas sur le Trône. Tu poses la La",
 "FIN_SERAPHINE_LAME": "Devant le Trône, la Lame Blanche se tait d’un co",
 "FIN_TEMOIN": "Tu règnes. Le continent plie sous le givre, mais",
 "FIN_VERITE": "Tu t’assieds sur le Trône d’Ébène. Et pour la pr",
 "FIN_VEYRA": "Tu as pris la main de Veyra. Le pacte s’est refe",
 "GAME_OVER_POSSESSION": "Tu serres. Le monde entier tient dans ton poing,",
 "GAME_OVER_VENIN": "Tu t’assois dans la neige. Aucune voix ne te dem",
 "FIN_POLY": "Tu refuses de choisir, parce qu’ils ont refusé, ",
 "FIN_DOMINATION": "L’hiver que tu as voulu, avec eux à genoux.",
 "FIN_ECLAIREUR": "L’Ordre du Soleil ouvre ses portes sans les refe",
 "FIN_OMBRE": "Tu prends place au cœur de la salle du trône. Ka",
 "FIN_SOLO": "Tu quittes le Trône sans te retourner. Derrière ",
 "GAME_OVER_SIRENE": "Le dernier nœud glisse. C’est très doux. C’est t",
 "FIN_SACRIFICE": "Tu inverses le flux du Trône. Tu absorbes l’inté",
 "FIN_BRISEE": "Tu restes immobile, et le monde aussi. Rien ne t",
 "GAME_OVER_SCELLEE": "Le Sceau se pose. Il est froid, d’un froid qui n",
 "FIN_CHAOS": "La jauge mentale cède. Il n’y a pas de cri, pas ",
 "GAME_OVER_SURCHARGE": "Tu fermes les yeux. Le froid ne te fait plus mal",
 "FIN_HIVER": "Tu frappes l’obsidienne. Une onde de choc ravage",
 "NG_FIN_LIBERATION": "Le Gel se retire du monde comme une marée. La co",
 "NG_FIN_VIDE": "Elenya ne choisit ni le pouvoir, ni l’amour, ni ",
 "NG_FIN_AMOUR": "Le monde n’a pas besoin d’un couple parfait. Il ",
 "NG_FIN_FRONTIERE": "Tu deviens la frontière. Pas une reine. Pas une ",
 "NG_FIN_DEUX_MAINS": "Tu regardes le Trône une dernière fois. Puis tu ",
 "NG_FIN_CYCLE": "Tu refuses de lâcher Kalthar. Le Brasier trouve "
};
// Drapeaux propres aux fins NG+ (posés par le choix de NGP_15_DERNIER_CHOIX).
const NG_FINAL = { NG_FIN_LIBERATION: 'ngplus_final_libre', NG_FIN_VIDE: 'ngplus_final_void', NG_FIN_AMOUR: 'ngplus_final_amour',
  NG_FIN_FRONTIERE: 'ngplus_final_frontiere', NG_FIN_DEUX_MAINS: 'ngplus_final_trone', NG_FIN_CYCLE: 'ngplus_final_cycle' };
const fins = [...Object.keys(api.DB).filter(k => api.DB[k].isEnd), ...Object.keys(api.NGPLUS_DB).filter(k => api.NGPLUS_DB[k].isEnd)];
assert.equal(fins.length, 36, 'nombre de fins déclarées');
assert.deepEqual(fins.slice().sort(), Object.keys(SIGNATURE).sort(), 'table des signatures = fins déclarées');
function joue(rec) {
  let s = { gameMode: rec.mode || 'classic' };
  for (const [id, key] of rec.parcours) {
    const d = api.serverGetPendingScene(clone(s)); s = d.renderedState;
    assert.equal(s.currentSceneId, id, 'route désynchronisée à ' + id);
    const r = api.serverProcessChoice(clone(s), key); assert(r && !r.error, 'choix refusé ' + id + '/' + key); s = r.updatedState;
  }
  return api.serverGetPendingScene(clone(s));
}
const out = {}, textes = new Map(), routes = new Map();
for (const fin of fins) {
  const rec = R[fin]; assert(rec, fin + ' : pas de route');
  const cle = JSON.stringify(rec.parcours); assert(!routes.has(cle), fin + ' : même route que ' + routes.get(cle)); routes.set(cle, fin);
  const d = joue(rec), s = d.renderedState, sc = api.DB[fin] || api.NGPLUS_DB[fin], fl = s.flags || [];
  assert.equal(s.currentSceneId, fin, fin + ' : fin atteinte ' + s.currentSceneId);
  assert(d.isEnd, fin + ' : écran non final');
  assert.equal(d.title, sc.title, fin + ' : titre affiché');
  const v = fl.filter(x => x.startsWith('variante_')).map(x => x.slice(9));
  if (sc.family) assert.equal(JSON.stringify(v), JSON.stringify([fin]), fin + ' : variante propre attendue');
  else assert.equal(JSON.stringify(v), '[]', fin + ' : aucune variante attendue');
  if (NG_FINAL[fin]) for (const [f, x] of Object.entries(NG_FINAL)) assert.equal(fl.includes(x), f === fin, fin + ' : drapeau ' + x);
  const t = String(d.narrative || ''); assert(t.length > 80, fin + ' : texte vide');
  assert(t.includes(SIGNATURE[fin]), fin + ' : texte propre absent');
  for (const [f, sg] of Object.entries(SIGNATURE)) if (f !== fin) assert(!t.includes(sg), fin + ' : affiche le texte de ' + f);
  assert(!textes.has(t), fin + ' : même texte que ' + textes.get(t)); textes.set(t, fin);
  // 60.8.1 (narration P1-1, playtest #3) : aucun paragraphe affiché deux fois, aucun Markdown brut dans un titre de lignée.
  const ps = t.split('\n').map(x => x.trim()).filter(Boolean); const dbl = ps.filter((x, i) => ps.indexOf(x) !== i);
  assert.equal(dbl.length, 0, fin + ' : paragraphe doublé « ' + (dbl[0] || '').slice(0, 60) + ' »');
  assert(!/^\*[^*]+\* — de la lignée/m.test(t), fin + ' : titre de lignée en Markdown brut');
  if (/^NG_FIN_(AMOUR|DEUX_MAINS|FRONTIERE|VIDE|CYCLE)$/.test(fin)) assert(!/lampe s’allume à la fenêtre du Conclave/.test(t), fin + ' : lampe de LIBERATION');
  out[fin] = rec.parcours.length + ' choix';
}
// Non-régression P0 : FINAL à NGP_15_DERNIER_CHOIX mène à la libération, jamais au vide.
{ const L = R.NG_FIN_LIBERATION.parcours, V = R.NG_FIN_VIDE.parcours;
  assert.notEqual(JSON.stringify(L), JSON.stringify(V), 'routes LIBERATION et VIDE identiques');
  const i = L.map(p => p[0]).lastIndexOf('NGP_15_DERNIER_CHOIX'); assert(i >= 0, 'LIBERATION ne passe pas par le dernier choix');
  assert(['FINAL', 'NOMMER_ARCHITECTE'].includes(L[i][1]), 'LIBERATION : choix final ' + L[i][1]);
  const d = joue(R.NG_FIN_LIBERATION);
  assert.notEqual(d.renderedState.currentSceneId, 'NG_FIN_VIDE', 'la route de libération aboutit à la fin vide');
  assert(!String(d.narrative).includes(SIGNATURE.NG_FIN_VIDE), 'la libération affiche le texte du vide');
  const F = api.NGPLUS_DB.NGP_15_DERNIER_CHOIX.choices.find(c => c.key === 'FINAL');
  assert(F && /^(NG_FIN_LIBERATION|NGP_U15_LIBRE)$/.test(F.next), 'FINAL câblé vers ' + (F && F.next));
  assert.equal(api.NGPLUS_DB.NGP_U15_LIBRE.choices.every(c => c.next === 'NG_FIN_LIBERATION'), true, 'NGP_U15_LIBRE mène à la libération'); }
console.log(JSON.stringify({ fins: Object.keys(out).length, textesDistincts: textes.size, routesDistinctes: routes.size }));
