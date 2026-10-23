// 60.1 : trouve, par graines, une route rejouable vers chaque fin qui n’en avait pas (outil, pas un test).
const fs=require('fs'),path=require('path');const {engine,rng,clone}=require('../tests/lib.cjs');const {api}=engine();
const base=JSON.parse(fs.readFileSync(path.join(__dirname,'../tests/fixtures/routes-fins-60.1.0b.json')));
const ends=[...Object.keys(api.DB).filter(k=>api.DB[k].isEnd).map(k=>[k,'classic']),...Object.keys(api.NGPLUS_DB).filter(k=>api.NGPLUS_DB[k].isEnd).map(k=>[k,'ngplus'])];
const out={};for(const [k,v] of Object.entries(base))out[k]={mode:'classic',parcours:v};
const manque=new Set(ends.filter(([e])=>!out[e]).map(([e])=>e));const trouve={};
for(const mode of ['classic','ngplus'])for(let seed=1;seed<6000&&manque.size;seed++){const r=rng(seed*7+3);let s={gameMode:mode};const route=[];
 for(let i=0;i<400;i++){const d=api.serverGetPendingScene(clone(s));s=d.renderedState;if(d.isEnd){const f=s.currentSceneId;const v=(s.flags||[]).filter(x=>x.startsWith('variante_')).map(x=>x.slice(9));
  for(const e of [f,...v])if(manque.has(e)){manque.delete(e);out[e]={mode,parcours:route.slice(),graine:seed*7+3}}break}
  const c=d.choices[Math.floor(r()*d.choices.length)];route.push([s.currentSceneId,c.key]);s=api.serverProcessChoice(clone(s),c.key).updatedState}}
fs.writeFileSync(path.join(__dirname,'../tests/fixtures/routes-fins-60.1.0.json'),JSON.stringify(out));
console.log(JSON.stringify({total:ends.length,routes:Object.keys(out).length,introuvables:[...manque]}));
