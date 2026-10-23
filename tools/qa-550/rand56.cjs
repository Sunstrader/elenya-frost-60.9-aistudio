// Recherche aléatoire guidée de parcours vers une fin (aucun état injecté).
const fs=require('fs'),path=require('path');
const root=path.resolve(__dirname,'../../elenya-refonte-52.4');
const {api}=require(root+'/qa/engine.cjs').loadEngine(root+'/project');
const clone=x=>JSON.parse(JSON.stringify(x));
const cible=process.argv[2], N=+process.argv[3]||3000;
function rng(seed){let s=seed>>>0;return()=>{s=(Math.imul(s,1664525)+1013904223)>>>0;return s/4294967296;};}
function poids(c,st){
  const k=c.key||'', t=(c.text||'')+' '+(c.intent||'');
  if(cible==='FIN_POLY'){
    if(k==='PROPOSER') return 50; if(k==='DOMINER') return 0;
    if(k==='FIN_POLY') return 1000;
    if(/^OE_|DEUX|_DEUX/.test(k)) return 8;
    if(/amis|AMIS|_FERME|^D$/.test(k)) return 0.2;
    if(/romance|confiance/.test(t)) return 3;
    return 1;
  } else {
    if(k==='DOMINER') return 200; if(k==='FIN_DOMINATION') return 1000;
    if(/pouvoir|domination|POUVOIR|DOMIN|FORCER|PRENDRE/.test(k+t)) return 6;
    return 1;
  }
}
const found=[];
for(let i=0;i<N&&found.length<1;i++){
  const r=rng(9000+i); let s={gameMode:'classic'}; const p=[];
  for(let step=0;step<400;step++){
    const d=api.serverGetPendingScene(clone(s)); if(!d) break; s=d.renderedState;
    const id=s.currentSceneId;
    const main=(api.DB[cible]&&api.DB[cible].aliasOf)||cible;
    if(d.isEnd){ if(id===main && (main===cible || s.flags.includes('variante_'+cible))) found.push(p.slice()); break; }
    const ch=d.choices||[]; if(!ch.length) break;
    const w=ch.map(c=>poids(c,s)); const tot=w.reduce((a,b)=>a+b,0); let x=r()*tot, j=0; while(j<ch.length-1&&(x-=w[j])>0) j++;
    const c=ch[j]; p.push([id,c.key]);
    const res=api.serverProcessChoice(clone(s),c.key); if(!res||res.error) break; s=res.updatedState;
  }
  if(i%500===0) console.error(cible,'essai',i);
}
if(found.length){ console.log(JSON.stringify(found[0])); } else { console.error('aucun parcours'); process.exit(2); }
