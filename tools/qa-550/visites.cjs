const {rng,clone}=require(require('path').resolve(__dirname,'../../tests/lib.cjs'));const root=require('path').resolve(__dirname,'../../elenya-refonte-52.4');
const {api}=require(root+'/qa/engine.cjs').loadEngine(root+'/project');
const N=+process.argv[2]||800,seen={},edges={};
for(let i=0;i<N;i++){const r=rng(7000+i);let s={gameMode:'classic'};for(let k=0;k<400;k++){const d=api.serverGetPendingScene(clone(s));s=d.renderedState;seen[s.currentSceneId]=(seen[s.currentSceneId]||0)+1;if(d.isEnd||!d.choices.length)break;const c=d.choices[Math.floor(r()*d.choices.length)];edges[s.currentSceneId+':'+c.key]=1;s=api.serverProcessChoice(clone(s),c.key).updatedState;}}
const never=Object.keys(api.DB).filter(id=>!seen[id]);if(process.argv[3])console.log(JSON.stringify(Object.entries(seen).filter(([k])=>new RegExp(process.argv[3]).test(k)).sort((a,b)=>b[1]-a[1])));
