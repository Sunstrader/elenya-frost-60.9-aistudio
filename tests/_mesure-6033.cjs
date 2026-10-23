// 60.3.3 : mesure hors npm test. node tests/_mesure-6033.cjs [n] [graine0] [hasard|chercheur]
// chercheur : 85 % du temps, prend une option trio/romance/POLY si elle existe et n'ordonne jamais (intent domination évité).
const L=require('./lib.cjs');const {api}=L.engine();const n=+process.argv[2]||400;const g0=+process.argv[3]||5000;const mode=process.argv[4]||'hasard';
const m={mode,parties:0,romanceApresDom:0,choixRomanceApresDom:0,trioAccordApresDom:0,questionVue:0,questionOui:0,questionNon:0,refermee:0,trioAccord:0,domeVu:0,finPoly:0,accordPerdu:{},enchainesAvecAccord:0,amitieAccordTient:0,erreurs:0,ecrans:0,uniques:0};
const DOMF=['crevasse_domination','domination_acte3_O','domination_acte3_E','domination_path_chosen','go_poly_domination','domination_finale'];
const PREF=/TRIO|PROPOSER|POLY|ATTENDRE|TENIR|GARDER|ROMANCE|LAISSER/;
for(let i=1;i<=n;i++){const r=L.rng(g0+i);let s={gameMode:'classic'};let last=null;const vus=new Set();let domVue=false;
 for(let k=0;k<500;k++){const d=api.serverGetPendingScene(L.clone(s));if(!d){m.erreurs++;break;}s=d.renderedState;last=d;vus.add(s.currentSceneId);
  const f=s.flags||[];if(DOMF.some(x=>f.includes(x))||(s.gauges.possession||0)>=12)domVue=true;
  if(d.isEnd)break;m.ecrans++;if(d.choices.length===1)m.uniques++;
  let cs=d.choices;
  if(mode==='chercheur'){const nd=cs.filter(c=>c.intent!=='domination'&&!/DOMIN|GENOUX|ORDONNER/.test(c.key));if(nd.length)cs=nd;const p=cs.filter(c=>PREF.test(c.key)||c.intent==='romance');if(p.length&&r()<0.85)cs=p;}
  const c=cs[Math.floor(r()*cs.length)];
  if(domVue&&c.intent==='romance'&&/Kaelen|Alistair/.test(String(c.target||'')))m.choixRomanceApresDom++;
  const res=api.serverProcessChoice(L.clone(s),c.key);if(!res||res.error){m.erreurs++;break;}s=res.updatedState;}
 m.parties++;const f=s.flags||[];const fin=s.currentSceneId;
 if(domVue&&['FIN_OMBRE','FIN_ECLAIREUR','FIN_POLY'].includes(fin))m.romanceApresDom++;
 if(domVue&&f.includes('trio_accord'))m.trioAccordApresDom++;
 if(vus.has('TRIO6032_QUESTION')||vus.has('TRIO6033_BIVOUAC'))m.questionVue++; if(f.includes('trio_question_6032'))m.questionOui++; if(f.includes('trio_question_refusee_6033'))m.questionNon++; if(f.includes('trio_question_refermee_6033'))m.refermee++;
 if(f.includes('trio_accord')){m.trioAccord++;if(fin!=='FIN_POLY'){const g=s.gauges||{};const why=[];
   if(!vus.has('ACTE4_09_TRONE_EBENE'))why.push('pas de Trône ('+(/^FIN_|GAME|MORT/.test(fin)?fin:'autre')+')');
   else{if(f.some(x=>/^(kaelen|alistair)_(mort|perdu)/.test(x)))why.push('compagnon perdu');if((g.lien_O||0)<3||(g.lien_E||0)<3)why.push('lien<3');if(f.some(x=>/^amis_|romance_en_pause|rompue/.test(x)))why.push('pause/amitié/rupture');if(!why.length)why.push('autre fin choisie: '+fin);}
   for(const w of why)m.accordPerdu[w]=(m.accordPerdu[w]||0)+1;}}
 if(vus.has('TRIO_NUIT_DOME'))m.domeVu++; if(fin==='FIN_POLY')m.finPoly++;
 const t=(last&&last.narrative)||'';if(fin==='FIN_POLY'&&f.includes('trio_accord')&&/enchaînés/.test(t))m.enchainesAvecAccord++;
 if(fin==='FIN_POLY'&&f.some(x=>/^amis_/.test(x))&&/L’accord du dôme tient/.test(t))m.amitieAccordTient++;}
m.pctUniques=(100*m.uniques/m.ecrans).toFixed(1)+' %';console.log(JSON.stringify(m));
