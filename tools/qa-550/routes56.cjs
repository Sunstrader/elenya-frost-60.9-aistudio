// Cherche des parcours jouables vers FIN_POLY (trio_accord) et FIN_DOMINATION.
const fs=require('fs'),path=require('path');
const root=path.resolve(__dirname,'../../elenya-refonte-52.4');
const {api}=require(root+'/qa/engine.cjs').loadEngine(root+'/project');
const clone=x=>JSON.parse(JSON.stringify(x));
function score(s,cible){
  const f=s.flags||[],g=s.gauges||{}; let sc=0;
  if(cible==='FIN_POLY'){
    if(f.includes('lisiere_trio_ouvert')) sc+=20;
    if(f.includes('trio_accord')) sc+=50;
    if(f.includes('romance_en_pause_O')||f.includes('romance_en_pause_E')) sc-=40;
    if(f.includes('romance_O_rompue')||f.includes('romance_E_rompue')) sc-=100;
    if(f.includes('go_poly_domination')||f.includes('domination_finale')) sc-=50;
    sc+=Math.min(g.lien_O||0,8)+Math.min(g.lien_E||0,8);
    if(s.currentSceneId==='TRIO_NUIT_DOME') sc+=30;
    if(s.currentSceneId==='ACTE4_09_TRONE_EBENE'&&f.includes('trio_accord')) sc+=40;
  } else {
    sc+=(g.possession||0)+(g.instabilite||0);
    if(f.includes('go_poly_domination')) sc+=30;
    if(f.includes('domination_finale')) sc+=50;
    if(s.currentSceneId==='ACTE4_04_POLY_DOMINATION') sc+=40;
  }
  return sc;
}
function search(cible,{maxSteps=220,width=60}={}){
  let front=[{s:{gameMode:'classic'},path:[]}];
  const seen=new Set();
  for(let step=0;step<maxSteps;step++){
    const next=[];
    for(const n of front){
      const d=api.serverGetPendingScene(clone(n.s)); if(!d) continue;
      const id=d.renderedState.currentSceneId;
      const main=(api.DB[cible]&&api.DB[cible].aliasOf)||cible;
      if(id===main){
        // Pour FIN_DOMINATION aliasé vers FIN_HIVER, vérifier la variante
        if(cible!==main && !(d.renderedState.flags||[]).includes('variante_'+cible)) {/* continue */}
        else return {path:n.path,fin:id,flags:d.renderedState.flags};
      }
      // Choix direct vers la cible depuis le trône
      for(const c of d.choices||[]){
        if(c.next===cible || c.next===main && c.key===cible){
          const r=api.serverProcessChoice(clone(d.renderedState),c.key);
          if(r&&!r.error){
            const fin=api.serverGetPendingScene(clone(r.updatedState)).renderedState;
            if(fin.currentSceneId===main || fin.currentSceneId===cible) return {path:n.path.concat([[id,c.key]]),fin:fin.currentSceneId,flags:fin.flags};
          }
        }
      }
      if(d.isEnd) continue;
      // Préférer certains choix
      const prefs=cible==='FIN_POLY'
        ? {PROPOSER:5,O:1,E:1,DEUX:3,O_FEU_ROMANCE:2,E_FEU_ROMANCE:2,O_KISS:2,E_TOUCH:2}
        : {DOMINER:8,A:3,HOLD:2,POUVOIR:2,ACCEPTER:1};
      for(const c of d.choices||[]){
        const r=api.serverProcessChoice(clone(d.renderedState),c.key); if(!r||r.error) continue;
        const st=r.updatedState;
        const key=st.currentSceneId+'|'+(st.flags||[]).filter(x=>!x.startsWith('_')).slice(0,40).sort().join(',');
        if(seen.has(key)) continue; seen.add(key);
        next.push({s:st,path:n.path.concat([[id,c.key]]),sc:score(st,cible)+(prefs[c.key]||0)});
      }
    }
    next.sort((a,b)=>b.sc-a.sc);
    front=next.slice(0,width);
    if(step%40===0) console.log(cible,'step',step,'front',front.length,'best',front[0]&&front[0].sc,'scene',front[0]&&front[0].s.currentSceneId);
    if(!front.length) break;
  }
  return null;
}
const base=JSON.parse(fs.readFileSync('tests/fixtures/routes-fins-55.0.0.json','utf8'));
const out={};
// Rejouer les routes 55 qui passent encore
const INS={VENIN_DERNIER_SURSIS:'AVANCER',ROMANCE_FELURE_O:'REPARER',ROMANCE_FELURE_E:'REPARER',TRIO_NUIT_DOME:'PROPOSER',ACTE4_04_POLY_DOMINATION:'A'};
for(const [cible,route] of Object.entries(base)){
  if(cible==='FIN_POLY') continue;
  let s={gameMode:'classic'};const nr=[];let ok=true;
  for(let i=0;i<route.length;i++){
    const d=api.serverGetPendingScene(clone(s));s=d.renderedState;
    let [sc,k]=route[i];
    if(INS[s.currentSceneId]&&sc!==s.currentSceneId){sc=s.currentSceneId;k=INS[sc];}
    else if(s.currentSceneId!==sc){ok=false;break;}
    nr.push([sc,k]);
    const r=api.serverProcessChoice(clone(s),k); if(!r||r.error){ok=false;break;}
    s=r.updatedState;
  }
  if(ok){const fin=api.serverGetPendingScene(clone(s)).renderedState.currentSceneId; out[cible]=nr; console.log('ok',cible,'->',fin);}
  else console.log('drop',cible);
}
for(const cible of ['FIN_POLY','FIN_DOMINATION']){
  console.log('=== search',cible);
  const r=search(cible,{maxSteps:cible==='FIN_DOMINATION'?260:240,width:80});
  if(r){out[cible]=r.path; console.log('TROUVÉ',cible,r.path.length,'fin',r.fin);}
  else console.log('ÉCHEC',cible);
}
fs.writeFileSync('tests/fixtures/routes-fins-56.0.0.json',JSON.stringify(out));
console.log('total',Object.keys(out).length);
