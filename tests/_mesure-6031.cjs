// 60.3.1 : mesure au hasard (hors npm test). node tests/_mesure-6031.cjs [n]
const L=require('./lib.cjs');const {api}=L.engine();const n=+process.argv[2]||400;
const m={parties:0,fuiteOraya:0,stele603:0,detteDebut:0,detteFin:0,detteEnCoursFin:0,pain:0,halte:0,reconvApresDom:0,fenEnCours:0,fenManquee:0,ecrans:0,uniques:0,haltes:{},fins:{},erreurs:0,romanceApresDom:0};
const HALTES=['HALTE603_AUBERGE','ACTE2_09B_BIVOUAC_GLACE','V28_ORAYA_PROPOSE_GUIDE','STELE603_INDICE','FRAGMENT_4_ENRICHI'];
for(let i=1;i<=n;i++){const r=L.rng(5000+i);let s={gameMode:'classic'};let last=null,fuite=false;const vus=new Set();
 for(let k=0;k<500;k++){const d=api.serverGetPendingScene(L.clone(s));if(!d){m.erreurs++;break;}s=d.renderedState;last=d;const id=s.currentSceneId;vus.add(id);
  if((id==='FRAGMENT_4_ENRICHI')&&!s.flags.includes('_fragment_4_vu'))fuite=true;
  if(d.isEnd)break; m.ecrans++; if(d.choices.length===1)m.uniques++;
  const c=d.choices[Math.floor(r()*d.choices.length)];const res=api.serverProcessChoice(L.clone(s),c.key);if(!res||res.error){m.erreurs++;break;}s=res.updatedState;}
 m.parties++;const f=s.flags||[];const q=(last&&last.quetes603)||[];
 if(fuite)m.fuiteOraya++; if(vus.has('STELE603_INDICE')||f.includes('_stele603_indice'))m.stele603++;
 const qd=q.find(x=>x.id==='dette'); if(qd)m.detteDebut++; if(qd&&qd.etat==='accomplie')m.detteFin++; if(qd&&qd.etat==='en cours')m.detteEnCoursFin++;
 const qf=q.find(x=>x.id==='fen'); if(qf&&qf.etat==='en cours')m.fenEnCours++; if(qf&&qf.etat==='manquée')m.fenManquee++;
 if((s.inventory||[]).includes('pain_village_603'))m.pain++; if(vus.has('HALTE603_AUBERGE'))m.halte++;
 const dom=x=>f.includes('crevasse_domination')||f.includes('domination_acte3_'+x)||f.includes('go_poly_domination')||f.includes('domination_finale');
 if((f.includes('v28_conversion_finale_O')&&dom('O'))||(f.includes('v28_conversion_finale_E')&&dom('E')))m.reconvApresDom++;
 const fin=s.currentSceneId; if(((fin==='FIN_OMBRE')&&dom('O'))||((fin==='FIN_ECLAIREUR')&&dom('E')))m.romanceApresDom++;
 HALTES.forEach(h=>{if(vus.has(h))m.haltes[h]=(m.haltes[h]||0)+1;}); m.fins[fin]=(m.fins[fin]||0)+1;}
m.pctUniques=(100*m.uniques/m.ecrans).toFixed(1)+' %';delete m.fins;console.log(JSON.stringify(m,null,1));
