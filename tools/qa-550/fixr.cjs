const fs=require('fs');const root=require('path').resolve(__dirname,'../../elenya-refonte-52.4');const {api}=require(root+'/qa/engine.cjs').loadEngine(root+'/project');
const clone=x=>JSON.parse(JSON.stringify(x));
const routes=JSON.parse(fs.readFileSync('tests/fixtures/routes-fins-54.0.0.json','utf8'));const out={};
for(const [cible,route] of Object.entries(routes)){let s={gameMode:'classic'};const nr=[];let i=0;
 while(i<route.length){const d=api.serverGetPendingScene(clone(s));s=d.renderedState;
  let [sc,k]=route[i]; const INS={VENIN_DERNIER_SURSIS:'AVANCER',ROMANCE_FELURE_O:'REPARER',ROMANCE_FELURE_E:'REPARER'};if(INS[s.currentSceneId]&&sc!==s.currentSceneId){sc=s.currentSceneId;k=INS[sc];}else i++;
  if(s.currentSceneId!==sc){console.log('ecart',cible,s.currentSceneId,sc);break;}
  nr.push([sc,k]);s=api.serverProcessChoice(clone(s),k).updatedState;}
 const fin=api.serverGetPendingScene(clone(s)).renderedState.currentSceneId;console.log(cible,'->',fin);out[cible]=nr;}
fs.writeFileSync('tests/fixtures/routes-fins-55.0.0.json',JSON.stringify(out));
