// 60.3.2 : mesure au hasard (hors npm test). node tests/_mesure-6032.cjs [n] [graine0]
const L=require('./lib.cjs');const {api}=L.engine();const n=+process.argv[2]||400;const g0=+process.argv[3]||5000;
const m={parties:0,romanceApresDom:0,romanceApresDomAutre:0,polyApresDom:0,trioAccordApresDom:0,tendresseApresDom:0,trioAccord:0,domeVu:0,finPoly:0,questionTrio:0,questionOui:0,detteDebut:0,detteAccomplie:0,detteManquee:0,detteEnCours:0,enchainesAvecAccord:0,ligneeVeriteSansVerite:0,erreurs:0,ecrans:0,uniques:0};
const DOMF=['crevasse_domination','domination_acte3_O','domination_acte3_E','domination_path_chosen','go_poly_domination','domination_finale'];
for(let i=1;i<=n;i++){const r=L.rng(g0+i);let s={gameMode:'classic'};let last=null;const vus=new Set();let domVue=false,domAutre=false;
 for(let k=0;k<500;k++){const d=api.serverGetPendingScene(L.clone(s));if(!d){m.erreurs++;break;}s=d.renderedState;last=d;vus.add(s.currentSceneId);
  const f=s.flags||[];if(DOMF.some(x=>f.includes(x))||(s.gauges.possession||0)>=12)domVue=true;
  if(d.isEnd)break;m.ecrans++;if(d.choices.length===1)m.uniques++;
  const c=d.choices[Math.floor(r()*d.choices.length)];
  if(domVue&&['TENIR','GARDER','PROPOSER'].includes(c.key)&&['ARC58_KAELEN_TROIS_NOMS','ARC58_ALISTAIR_PRIERE','TRIO_NUIT_DOME'].includes(s.currentSceneId))m.tendresseApresDom++;
  const res=api.serverProcessChoice(L.clone(s),c.key);if(!res||res.error){m.erreurs++;break;}s=res.updatedState;}
 m.parties++;const f=s.flags||[];const fin=s.currentSceneId;const q=(last&&last.quetes603)||[];
 if(domVue&&['FIN_OMBRE','FIN_ECLAIREUR','FIN_POLY'].includes(fin))m.romanceApresDom++;
 if(domVue&&fin==='FIN_POLY')m.polyApresDom++; if(domVue&&f.includes('trio_accord'))m.trioAccordApresDom++;
 if((fin==='FIN_OMBRE'&&f.includes('domination_acte3_E'))||(fin==='FIN_ECLAIREUR'&&f.includes('domination_acte3_O')))m.romanceApresDomAutre++;
 if(f.includes('trio_accord'))m.trioAccord++; if(vus.has('TRIO_NUIT_DOME'))m.domeVu++; if(fin==='FIN_POLY')m.finPoly++;
 if(vus.has('TRIO6032_QUESTION'))m.questionTrio++; if(f.includes('trio_question_6032'))m.questionOui++;
 const qd=q.find(x=>x.id==='dette');if(qd){m.detteDebut++;m[qd.etat==='accomplie'?'detteAccomplie':qd.etat==='manquée'?'detteManquee':'detteEnCours']++;}
 const t=(last&&last.narrative)||'';if(fin==='FIN_POLY'&&f.includes('trio_accord')&&/enchaînés/.test(t))m.enchainesAvecAccord++;
 if(['FIN_TEMOIN','FIN_EQUILIBRE','FIN_RECONCILIATION','FIN_DETTE_ANNULEE'].includes(fin)&&/lignée « Le Trône de Vérité »|cesser de mentir/.test(t))m.ligneeVeriteSansVerite++;}
m.pctUniques=(100*m.uniques/m.ecrans).toFixed(1)+' %';console.log(JSON.stringify(m));
