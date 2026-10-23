const fs=require('fs'),path=require('path');
const root=path.resolve(__dirname,'../../elenya-refonte-52.4');
const {api}=require(root+'/qa/engine.cjs').loadEngine(root+'/project');
const clone=x=>JSON.parse(JSON.stringify(x));
const base=JSON.parse(fs.readFileSync('tests/fixtures/routes-fins-55.0.0.json','utf8'));
function from(prefix,cible,{max=200,width=70}={}){
  let front=[{s:prefix.s,path:prefix.path.slice()}];
  const seen=new Set();
  for(let step=0;step<max;step++){
    const next=[];
    for(const n of front){
      const d=api.serverGetPendingScene(clone(n.s)); if(!d) continue;
      const id=d.renderedState.currentSceneId;
      for(const c of d.choices||[]){
        if(c.key===cible||c.next===cible){
          const r=api.serverProcessChoice(clone(d.renderedState),c.key);
          if(r&&!r.error){
            const fin=api.serverGetPendingScene(clone(r.updatedState)).renderedState;
            const main=(api.DB[cible]&&api.DB[cible].aliasOf)||cible;
            if(fin.currentSceneId===main||fin.currentSceneId===cible)
              return n.path.concat([[id,c.key]]);
          }
        }
      }
      if(d.isEnd) continue;
      const prefer=id==='TRIO_NUIT_DOME'?{PROPOSER:100}:id==='ACTE4_02_CHOIX_CHAMBRE'?{S:2,O:1,E:1,DOMINER:-50}:{PROPOSER:20,OE_MAIN:5,O:1,E:1};
      for(const c of d.choices||[]){
        const r=api.serverProcessChoice(clone(d.renderedState),c.key); if(!r||r.error) continue;
        const st=r.updatedState;const f=st.flags||[];
        if(cible==='FIN_POLY'&&(f.includes('romance_en_pause_O')||f.includes('romance_en_pause_E')||f.includes('amis_O')||f.includes('amis_E')||f.includes('go_poly_domination'))) continue;
        if(cible==='FIN_DOMINATION'&&(f.includes('romance_O_rompue')||f.includes('romance_E_rompue'))) {/* ok */}
        const key=st.currentSceneId+'|'+f.filter(x=>!/^_/.test(x)).slice(0,30).sort().join(',');
        if(seen.has(key)) continue; seen.add(key);
        let sc=(prefer[c.key]||0);
        if(cible==='FIN_POLY'){ if(f.includes('lisiere_trio_ouvert')) sc+=10; if(f.includes('trio_accord')) sc+=40; sc+=Math.min(st.gauges.lien_O||0,6)+Math.min(st.gauges.lien_E||0,6); }
        else { sc+=(st.gauges.possession||0)+(st.gauges.instabilite||0); if(f.includes('domination_finale')) sc+=40; if(c.key==='DOMINER') sc+=50; }
        next.push({s:st,path:n.path.concat([[id,c.key]]),sc});
      }
    }
    next.sort((a,b)=>b.sc-a.sc); front=next.slice(0,width);
    if(!front.length) break;
    if(step%30===0) console.log(cible,step,front[0].sc,front[0].s.currentSceneId,(front[0].s.flags||[]).filter(f=>/trio|domin|poly|pause/.test(f)).join(','));
  }
  return null;
}
// Prefix FIN_POLY: replay until before LIEN_E_2, then A
const route=base.FIN_POLY; let s={gameMode:'classic'}; const pathP=[];
for(let i=0;i<route.length;i++){
  const d=api.serverGetPendingScene(clone(s));s=d.renderedState;
  let [sc,k]=route[i];
  if(sc==='LIEN_E_2_CONFIDENCE'){ // cut here
    console.log('cut at',i,sc,'options',d.choices.map(c=>c.key));
    // try each of A,B
    for(const alt of ['A','B']){
      const s2=api.serverProcessChoice(clone(s),alt).updatedState;
      const p=from({s:s2,path:pathP.concat([[sc,alt]])},'FIN_POLY');
      if(p){ console.log('POLY via',alt,p.length); fs.writeFileSync('/tmp/poly.json',JSON.stringify(p)); break; }
      else console.log('POLY via',alt,'échoué');
    }
    break;
  }
  if(s.currentSceneId!==sc){console.log('prefix écart',sc,s.currentSceneId);break;}
  pathP.push([sc,k]); s=api.serverProcessChoice(clone(s),k).updatedState;
}
// FIN_DOMINATION from scratch with preference for possession
console.log('=== DOM');
const pD=from({s:{gameMode:'classic'},path:[]},'FIN_DOMINATION',{max:280,width:100});
if(pD){console.log('DOM',pD.length); fs.writeFileSync('/tmp/dom.json',JSON.stringify(pD));}
else console.log('DOM échoué');
