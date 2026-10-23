// 60.1 : une route rejouable par écho rare (non vu dans les 200 premières parties de echos-atteints). Outil ; test : tests/echos-rares-601.cjs.
const path=require('path'),fs=require('fs');const root=path.resolve(__dirname,'../elenya-refonte-52.4');
const {api,ctx}=require(root+'/qa/engine.cjs').loadEngine(root+'/project');const vm=require('vm');const C=x=>JSON.parse(JSON.stringify(x));
api.serverGetPendingScene({gameMode:'classic'});
const L=[].concat(vm.runInContext('RECIT57_ECHOS',ctx),vm.runInContext('RECIT57B_ECHOS',ctx),vm.runInContext('typeof RECIT58_ECHOS!=="undefined"?RECIT58_ECHOS:[]',ctx),vm.runInContext('typeof RECIT59_ECHOS!=="undefined"?RECIT59_ECHOS:[]',ctx)).filter(e=>typeof e[2]==='string');
const cle=e=>e[0]+' :: '+e[2].slice(0,60);
const par={};L.forEach((e,i)=>{(par[e[0]]=par[e[0]]||[]).push(i)});
const N=+process.argv[2]||4000,PREMIERS=200;const vuTot=new Set(),routes={};
for(const mode of ['classic','ngplus'])for(let g=0;g<(mode==='classic'?N:N/3);g++){let seed=(1000+g)*7919>>>0;for(let k=0;k<8;k++)seed=(Math.imul(seed,1664525)+1013904223)>>>0;const r=()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296};
 let s={gameMode:mode};const route=[];for(let k=0;k<450;k++){const d=api.serverGetPendingScene(C(s));s=d.renderedState;const txt=String(d.narrative||'');
  for(const i of par[s.currentSceneId]||[]){const e=L[i];if(txt.includes(e[2])){const c=cle(e);if(g<PREMIERS&&mode==='classic')vuTot.add(c);else if(!vuTot.has(c)&&!routes[c])routes[c]={mode,parcours:route.slice(),scene:s.currentSceneId,texte:e[2]};}}
  const ch=d.choices||[];if(!ch.length||d.isEnd)break;const pref=ch.filter(c=>/^V5[78]_|_57$|57_|58/.test(c.key));const c=(pref.length&&r()<0.7)?pref[Math.floor(r()*pref.length)]:ch[Math.floor(r()*ch.length)];
  route.push([s.currentSceneId,c.key]);const x=api.serverProcessChoice(C(s),c.key);if(!x||x.error)break;s=x.updatedState;}}
const rares=L.map(cle).filter((c,i,a)=>a.indexOf(c)===i&&!vuTot.has(c));
const sans=rares.filter(c=>!routes[c]);
fs.writeFileSync(path.join(__dirname,'../tests/fixtures/echos-rares-60.1.0.json'),JSON.stringify({echos:L.length,rares:rares.length,routes,sansRoute:sans}));
console.log(JSON.stringify({echos:L.length,rares:rares.length,avecRoute:Object.keys(routes).filter(c=>rares.includes(c)).length,sansRoute:sans.length}));
