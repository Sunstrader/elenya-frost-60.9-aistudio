// 60.2 (point 6) : extrait, depuis des routes réelles, le texte affiché des scènes sensibles pour relecture en contexte.
const fs=require('fs'),path=require('path');const {engine,clone}=require('../tests/lib.cjs');const {api}=engine();
const R=require('../tests/fixtures/routes-fins-60.1.0.json');
const CIBLES=['ORAYA_CONFRONTATION','ACTE4_03_SPICY_ALISTAIR','AGONIE_POSSESSION','SCEAU_DERNIER_SOUFFLE','SIRENE_DERNIER_SOUFFLE','ACTE4_09_TRONE_EBENE'];
const vus={};let md='# Relecture en contexte (60.2, tools/relecture-602.cjs)\n\nTextes réellement affichés au passage d’une route complète (aucun état injecté).\n';
for(const [fin,rec] of Object.entries(R)){let s={gameMode:rec.mode||'classic'};
 for(const [id,k] of rec.parcours){const d=api.serverGetPendingScene(clone(s));s=d.renderedState;
  if(CIBLES.includes(id)&&!vus[id]){vus[id]=fin;md+=`\n## ${id} (route vers ${fin}, choix joué : ${k})\n\n${String(d.narrative||'').trim()}\n\nChoix : ${(d.choices||[]).map(c=>'**'+c.key+'** '+c.text).join(' · ')}\n`}
  s=api.serverProcessChoice(clone(s),k).updatedState}}
fs.writeFileSync(path.join(__dirname,'../docs/60.2/RELECTURE.md'),md);console.log(JSON.stringify({extraits:Object.keys(vus),absents:CIBLES.filter(c=>!vus[c])}));
