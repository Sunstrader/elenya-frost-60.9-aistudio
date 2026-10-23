const fs=require('fs');const path=require('path');
const root=path.resolve(__dirname,'../../elenya-refonte-52.4');
const {api}=require(root+'/qa/engine.cjs').loadEngine(root+'/project');
const clone=x=>JSON.parse(JSON.stringify(x));
const routes=JSON.parse(fs.readFileSync('tests/fixtures/routes-fins-55.0.0.json','utf8'));
const out={};
const INS={VENIN_DERNIER_SURSIS:'AVANCER',ROMANCE_FELURE_O:'REPARER',ROMANCE_FELURE_E:'REPARER',TRIO_NUIT_DOME:'PROPOSER',ACTE4_04_POLY_DOMINATION:'A'};
for(const [cible,route] of Object.entries(routes)){
  let s={gameMode:'classic'};const nr=[];let i=0;let ok=true;
  while(i<route.length){
    const d=api.serverGetPendingScene(clone(s));s=d.renderedState;
    let [sc,k]=route[i];
    // Si une scène d'interception 55/56 apparaît, on la traverse.
    if(INS[s.currentSceneId]&&sc!==s.currentSceneId){sc=s.currentSceneId;k=INS[sc];}
    else if(s.currentSceneId!==sc){console.log('ecart',cible,'attendu',sc,'got',s.currentSceneId,'i',i);ok=false;break;}
    // FIN_POLY : forcer l'accord trio si on arrive au trône sans.
    if(cible==='FIN_POLY'&&sc==='ACTE4_09_TRONE_EBENE'&&k==='FIN_POLY'){
      // Si FIN_POLY n'est plus disponible, on a raté trio_accord — tenter d'injecter via flags après rejeu (échec volontaire signalé).
    }
    nr.push([sc,k]);
    const r=api.serverProcessChoice(clone(s),k); if(!r||r.error){console.log('refus',cible,sc,k,r&&r.error);ok=false;break;}
    s=r.updatedState; i++;
  }
  if(!ok){out[cible]=null;continue;}
  const fin=api.serverGetPendingScene(clone(s)).renderedState.currentSceneId;
  console.log(cible,'->',fin,(fin===(api.DB[cible]&&api.DB[cible].aliasOf)||cible?'OK':''));
  out[cible]=nr;
}
// Chercher un parcours vers FIN_DOMINATION et FIN_POLY avec beam search léger
function beam(cible,seedFlags,maxSteps=180,width=40){
  let front=[{s:{gameMode:'classic',flags:seedFlags||[],gauges:{}},path:[]}];
  const seen=new Set();
  for(let step=0;step<maxSteps;step++){
    const next=[];
    for(const n of front){
      const d=api.serverGetPendingScene(clone(n.s)); if(!d) continue;
      const id=d.renderedState.currentSceneId;
      if(id===cible||(api.DB[cible]&&api.DB[cible].aliasOf===id&&d.renderedState.flags.includes('variante_'+cible))) return n.path.concat([[id,'__END__']]);
      if(d.isEnd) continue;
      for(const c of d.choices||[]){
        const r=api.serverProcessChoice(clone(d.renderedState),c.key); if(!r||r.error) continue;
        const key=r.updatedState.currentSceneId+'|'+(r.updatedState.flags||[]).slice().sort().join(',')+'|'+JSON.stringify(r.updatedState.gauges||{});
        if(seen.has(key)) continue; seen.add(key);
        next.push({s:r.updatedState,path:n.path.concat([[id,c.key]])});
      }
    }
    next.sort((a,b)=>b.path.length-a.path.length);
    front=next.slice(0,width);
    if(!front.length) break;
  }
  return null;
}
for(const cible of ['FIN_POLY','FIN_DOMINATION']){
  if(out[cible]&&out[cible].length) continue;
  console.log('recherche',cible);
  const p=beam(cible, cible==='FIN_DOMINATION'?[]:[]);
  if(p){out[cible]=p.filter(x=>x[1]!=='__END__');console.log('trouvé',cible,out[cible].length);}
  else console.log('introuvable',cible);
}
fs.writeFileSync('tests/fixtures/routes-fins-56.0.0.json',JSON.stringify(out));
console.log('écrit',Object.keys(out).filter(k=>out[k]).length,'/',Object.keys(out).length);
