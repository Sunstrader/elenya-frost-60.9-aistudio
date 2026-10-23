// 60.3.2 : régénère seulement les routes figées que les gardes « domination → aucune romance » rendent
// injouables. Chaque route remplacée est listée avec la raison constatée (drapeau de domination au point
// de rupture). Outil, pas un test. Sorties : tests/fixtures/*-60.3.2.json + tests/fixtures/regen-6032.json.
const fs=require('fs'),path=require('path');const {engine,rng,clone}=require('../tests/lib.cjs');const {api}=engine();
const FX=p=>path.join(__dirname,'../tests/fixtures',p);const DOM=['crevasse_domination','domination_acte3_O','domination_acte3_E','domination_path_chosen','go_poly_domination','domination_finale'];
const famille=id=>((api.DB[id]||api.NGPLUS_DB[id]||{}).family)||id;
function rejoue(rec){let s={gameMode:rec.mode||'classic'},d;for(const [id,k] of rec.parcours){d=api.serverGetPendingScene(clone(s));s=d.renderedState;
  if(s.currentSceneId!==id||!d.choices.some(c=>c.key===k))return {ok:false,a:id,k,raison:DOM.filter(x=>s.flags.includes(x)).concat((s.gauges.possession||0)>=12?['possession>=12']:[])};
  s=api.serverProcessChoice(clone(s),k).updatedState;}d=api.serverGetPendingScene(clone(s));return {ok:true,s:d.renderedState,d};}
function cherche(test,pref,n,mode){for(let seed=1;seed<=n;seed++){const r=rng(seed*7+3);let s={gameMode:mode||'classic'};const route=[];
  for(let i=0;i<450;i++){const d=api.serverGetPendingScene(clone(s));s=d.renderedState;if(test(s,d))return {parcours:route.slice(),graine:seed*7+3};if(d.isEnd)break;
   const keys=d.choices.map(c=>c.key);const k=(pref||[]).find(p=>keys.includes(p))||keys[Math.floor(r()*keys.length)];route.push([s.currentSceneId,k]);s=api.serverProcessChoice(clone(s),k).updatedState;}}return null;}
const journal={routesFins:{},echos:{},parcours:{}};
// 1. Routes de fins.
const RF=JSON.parse(fs.readFileSync(FX('routes-fins-60.1.0.json')));
for(const [fin,rec] of Object.entries(RF)){const r=rejoue(rec);if(r.ok)continue;
  const fam=f=>f===fin||(api.DB[f]||{}).family===fin;const sansDom=s=>!DOM.some(x=>s.flags.includes(x));
  const pref=fin==='FIN_POLY'?['FIN_POLY','PROPOSER','TRIO6032','ATTENDRE','HALTE603']:[];
  const t=/^GAME_OVER_/.test(fin)?(s,d)=>d.isEnd&&s.currentSceneId===fin:(s,d)=>d.isEnd&&(fam(s.currentSceneId)||(s.flags||[]).includes('variante_'+fin))&&sansDom(s);
  const n=cherche(t,pref,6000,rec.mode);journal.routesFins[fin]={rupture:r.a+'/'+r.k,raison:r.raison,remplacee:!!n,graine:n&&n.graine};if(n)RF[fin]=Object.assign({},rec,n);}
fs.writeFileSync(FX('routes-fins-60.3.2.json'),JSON.stringify(RF));
// 2. Échos rares.
const ER=JSON.parse(fs.readFileSync(FX('echos-rares-60.1.0.json')));
for(const [cle,rec] of Object.entries(ER.routes)){const r=rejoue(rec);if(r.ok&&famille(r.s.currentSceneId)===rec.scene&&String(r.d.narrative).includes(rec.texte))continue;
  const n=cherche((s,d)=>famille(s.currentSceneId)===rec.scene&&String(d.narrative||'').includes(rec.texte),[],4000,rec.mode);
  journal.echos[cle]={rupture:r.a?r.a+'/'+r.k:'texte absent',raison:r.raison||[],remplacee:!!n};
  if(n)ER.routes[cle]=Object.assign({},rec,{parcours:n.parcours});else{delete ER.routes[cle];ER.sansRoute.push(cle);}}
fs.writeFileSync(FX('echos-rares-60.3.2.json'),JSON.stringify(ER));
// 3. Les 9 parcours.
const PA=JSON.parse(fs.readFileSync(FX('parcours-60.1.0.json')));
for(const [nom,rec] of Object.entries(PA)){const r=rejoue(rec);if(r.ok&&(r.s.currentSceneId===rec.fin||famille(r.s.currentSceneId)===rec.fin))continue;
  if(nom==='ngplus')continue; // rejoue() suppose le mode classique
  const n=cherche((s,d)=>d.isEnd&&s.currentSceneId===rec.fin&&!DOM.some(x=>s.flags.includes(x)),[],8000,nom==='ngplus'?'ngplus':'classic');
  journal.parcours[nom]={rupture:r.a+'/'+r.k,raison:r.raison,remplacee:!!n,graine:n&&n.graine};if(n)PA[nom]=Object.assign({},rec,{parcours:n.parcours,graine:n.graine});}
fs.writeFileSync(FX('parcours-60.3.2.json'),JSON.stringify(PA));
fs.writeFileSync(FX('regen-6032.json'),JSON.stringify(journal,null,1));console.log(JSON.stringify(journal));
