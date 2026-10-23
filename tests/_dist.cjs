const L=require('./lib.cjs');const {api}=L.engine();const n=+process.argv[2]||300;const h={};const seen={};
for(let i=1;i<=n;i++){const r=L.playRandom(api,i*7919,'classic',{sampleEvery:1});const vis=new Set((r.samples||[]).map(s=>s.currentSceneId));vis.forEach(k=>seen[k]=(seen[k]||0)+1);const k=r.fin||('ERR:'+r.erreur+'@'+r.scene);h[k]=(h[k]||0)+1;}
console.log(JSON.stringify(Object.entries(h).sort((a,b)=>b[1]-a[1])));
const W=['HALTE603_AUBERGE','JOUTE_O_1','JOUTE_E_1','ACTE2_07_TRANSE_FEN','ACTE2_09B_BIVOUAC_GLACE','ACTE2_09B_JOUTE_PSY','FRAGMENT_KALTHAR_LARME','V28_ORAYA_PROPOSE_GUIDE','ACTE3_SOLO_ORAYA','FRAGMENT_4_ENRICHI','ACTE2_07_TRUCE_FORCEE','DETTE_CHOIX','VEYRA_DERNIER_PACTE','CORONA_APPEL','ACTE1_08_SECRET'];
console.log(W.map(w=>w+':'+(seen[w]||0)).join(' '));
console.log('unseen',Object.keys(api.DB).filter(k=>!seen[k]&&!api.DB[k].isEnd).length);
