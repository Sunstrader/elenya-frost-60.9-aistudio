const path=require('path');const root=path.resolve(__dirname,'../..');
const {api,ctx}=require(root+'/elenya-refonte-52.4/qa/engine.cjs').loadEngine(root+'/elenya-refonte-52.4/project');
try{api.serverGetPendingScene&&api.serverGetPendingScene();}catch(e){}
const vm=require('vm');const L=vm.runInContext('RECIT57_ECHOS',ctx);const DB=vm.runInContext('DB',ctx);const N=vm.runInContext('NGPLUS_DB',ctx);
const manq=[...new Set(L.map(e=>e[0]).filter(id=>!DB[id]&&!N[id]))];
console.log(JSON.stringify({echos:L.length,manquantes:manq}));process.exit(manq.length?1:0);
