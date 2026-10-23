// 58 : quels échos (57/58) se déclenchent réellement en jeu ? Parties aléatoires (préférence pour les choix 57/58) + parcours connus.
const path=require('path'),fs=require('fs');const root=path.resolve(__dirname,'../../elenya-refonte-52.4');
const {api,ctx}=require(root+'/qa/engine.cjs').loadEngine(root+'/project');const vm=require('vm');const C=x=>JSON.parse(JSON.stringify(x));
api.serverGetPendingScene({gameMode:'classic'});
const L=[].concat(vm.runInContext('RECIT57_ECHOS',ctx),vm.runInContext('RECIT57B_ECHOS',ctx),vm.runInContext('typeof RECIT58_ECHOS!=="undefined"?RECIT58_ECHOS:[]',ctx),vm.runInContext('typeof RECIT59_ECHOS!=="undefined"?RECIT59_ECHOS:[]',ctx));
const par={};L.forEach((e,i)=>{(par[e[0]]=par[e[0]]||[]).push(i)});const hit=new Set();
const mock=s=>({hasFlag:f=>(s.flags||[]).includes(f),getGauge:k=>Number((s.gauges||{})[k]||0),hasGlobalFlag:()=>false,hasItem:()=>false,flags:s.flags,gauges:s.gauges});
const apres={};const flagsDe=i=>(String(L[i][1]).match(/(?<!!gs\.)hasFlag\('([^']+)'\)/g)||[]).map(x=>x.slice(9,-2));
const suivi=(s,vusF)=>{(s.flags||[]).forEach(f=>{if(!vusF.has(f))vusF.add(f);(apres[f]=apres[f]||{})[s.currentSceneId]=(apres[f][s.currentSceneId]||0)+1;});};
const look=s=>{(par[s.currentSceneId]||[]).forEach(i=>{try{if(L[i][1](mock(s)))hit.add(i)}catch(_){}})};
const N=+process.argv[2]||600;
for(const mode of ['classic','ngplus'])for(let g=0;g<(mode==='classic'?N:N/3);g++){let seed=(1000+g)*7919>>>0;for(let k=0;k<8;k++)seed=(Math.imul(seed,1664525)+1013904223)>>>0;const r=()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296};
 let s={gameMode:mode};const vusF=new Set();for(let k=0;k<450;k++){const d=api.serverGetPendingScene(C(s));s=d.renderedState;look(s);suivi(s,vusF);const ch=d.choices||[];if(!ch.length)break;
 const pref=ch.filter(c=>/^V5[78]_|_57$|57_|58/.test(c.key));const c=(pref.length&&r()<0.7)?pref[Math.floor(r()*pref.length)]:ch[Math.floor(r()*ch.length)];const x=api.serverProcessChoice(C(s),c.key);if(!x||x.error)break;s=x.updatedState;}}
for(const f of ['routes-fins-59.0.0.json','parcours-59.0.0.json']){const R=JSON.parse(fs.readFileSync(path.join(root,'../tests/fixtures',f)));for(const k in R){const rt=R[k].parcours||R[k];let s={gameMode:k==='ngplus'?'ngplus':'classic'};for(const [id,key] of rt){const d=api.serverGetPendingScene(C(s));s=d.renderedState;look(s);const x=api.serverProcessChoice(C(s),key);if(!x||x.error)break;s=x.updatedState;}look(api.serverGetPendingScene(C(s)).renderedState);}}
const parTexte={};L.forEach((e,i)=>{(parTexte[e[2]]=parTexte[e[2]]||[]).push(i)});
const nonAtt=Object.values(parTexte).filter(g=>!g.some(i=>hit.has(i))).map(g=>g[0]);
const sugg={};nonAtt.forEach(i=>{flagsDe(i).forEach(f=>{const a=apres[f]||{};sugg[f]=Object.entries(a).filter(([id])=>!/^(FIN_|GAME_OVER|ARC5|NGP5|FRAGMENT)/.test(id)).sort((x,y)=>y[1]-x[1]).slice(0,4)})});
// Passe statique : un écho non vu en aléatoire est « rare » si (1) sa scène cible est accessible dans le graphe après une scène qui pose son drapeau et (2) le texte s’affiche bien quand on y est avec ce drapeau. Sinon « inaccessible » (à corriger).
const DB=Object.assign({},vm.runInContext('typeof NGPLUS_DB!=="undefined"?NGPLUS_DB:{}',ctx),api.DB);const G={};const add=(a,b)=>{if(b&&b!=='RETURN')(G[a]=G[a]||new Set()).add(b)};
for(const [id,sc] of Object.entries(DB))for(const c of (sc.choices||[])){add(id,c.next);(c.effects||[]).forEach(e=>{if(e.type==='PUSH_RETURN')add(c.next,e.value||e.target)})}
{const T=fs.readFileSync(path.join(root,'project/10_Triggers.js'),'utf8');T.split(/\n\s*\{\s*\n/).forEach(b=>{const y=(b.match(/interceptToScene:\s*'([^']+)'/)||[])[1];if(!y)return;(b.match(/currentSceneId\s*===\s*'([^']+)'/g)||[]).forEach(m=>{const x=m.match(/'([^']+)'/)[1];add(x,y);add(y,x)})})}
// 60.2 : une scène d'interception globale (déclencheur sans scène précise, ex. agonies) revient par RETURN là où l'on était : son drapeau est posé « partout ».
const GLOBAUX=new Set();{const T=fs.readFileSync(path.join(root,'project/10_Triggers.js'),'utf8');T.split(/\n\s*\{\s*\n/).forEach(b=>{const y=(b.match(/interceptToScene:\s*'([^']+)'/)||[])[1];if(y&&!/currentSceneId\s*===/.test(b))GLOBAUX.add(y)})}
const accessible=(from,to)=>{if(from.includes('*'))return true;const v=new Set(),q=[...from];while(q.length){const x=q.shift();if(x===to)return true;if(v.has(x))continue;v.add(x);(G[x]||[]).forEach(y=>q.push(y))}return false};
const poseurs=f=>{const r=[];for(const [id,sc] of Object.entries(DB))for(const c of (sc.choices||[]))if((c.effects||[]).some(e=>e.target===f)){r.push(c.next==='RETURN'?(GLOBAUX.has(id)?'*':id):c.next);(c.effects||[]).forEach(e=>{if(e.type==='PUSH_RETURN')r.push(e.value||e.target)})}return r};
const rendu=i=>{const [id,,txt]=L[i];const fs_=flagsDe(i);const mode=/^NG(P|_FIN)/.test(id)?'ngplus':'classic';
 for(const comp of [[],['avec_ombre'],['avec_eclaireur']])for(const g of [undefined,{possession:14},{instabilite:26},{possession:14,lien_O:6}]){try{const st={gameMode:mode,currentSceneId:id,flags:fs_.concat(comp)};if(g)st.gauges=g;let cur=st;for(let k=0;k<4;k++){const d=api.serverGetPendingScene(C(cur));if(d.renderedState.currentSceneId===id||(DB[id]&&DB[id].aliasOf===d.renderedState.currentSceneId)){if(String(d.narrative||'').includes(String(txt).slice(0,40)))return true;break}const ch=d.choices||[];if(ch.length!==1)break;const x=api.serverProcessChoice(C(d.renderedState),ch[0].key);if(!x||x.error)break;cur=x.updatedState}}catch(_){}}return false};
const okI=i=>{const fs_=flagsDe(i);return fs_.length===0?rendu(i):fs_.every(f=>accessible(poseurs(f),L[i][0])||(DB[L[i][0]]&&DB[L[i][0]].aliasOf&&accessible(poseurs(f),DB[L[i][0]].aliasOf)))&&rendu(i)};
const statut={};nonAtt.forEach(i=>{const fs_=flagsDe(i);const ok=parTexte[L[i][2]].some(okI);statut[L[i][0]+' :: '+(fs_.join(',')||String(L[i][1]).slice(0,40))]=ok?'rare':'inaccessible'});
const inacc=Object.entries(statut).filter(([,v])=>v==='inaccessible').map(([k])=>k);
const non_vus_aleatoire=nonAtt.map(i=>L[i][0]+' :: '+String(L[i][1]).replace(/\s+/g,' ').slice(0,110));
fs.writeFileSync(path.join(root,'../docs/59-echos-atteints.json'),JSON.stringify({total:L.length,textes:Object.keys(parTexte).length,atteints:hit.size,non_vus_aleatoire,sugg,statut,inaccessibles:inacc},null,1));
console.log(JSON.stringify({textes:Object.keys(parTexte).length,nonAtteints:non_vus_aleatoire.length,inaccessibles:inacc.length}));if(inacc.length)console.log(inacc.join('\n'));process.exit(inacc.length?1:0);
