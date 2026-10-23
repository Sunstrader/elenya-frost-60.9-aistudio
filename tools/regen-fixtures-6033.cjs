// 60.3.3 : régénère seulement les routes figées que les nouvelles gardes rendent injouables
// (romanceAvailable fermé par une domination, question à trois qui exige l'intérêt pour les deux et dont
// la réponse dépend de l'état, Séraphine fermée sous emprise). Chaque route remplacée est listée avec la
// scène/le choix de rupture et l'état constaté. Outil, pas un test.
// Entrées : fixtures *-60.3.2*.json ; sorties : *-60.3.3*.json + regen-6033.json.
const fs=require('fs'),path=require('path');const {engine,rng,clone}=require('../tests/lib.cjs');const {api}=engine();
const FX=p=>path.join(__dirname,'../tests/fixtures',p);const DOM=['crevasse_domination','domination_acte3_O','domination_acte3_E','domination_path_chosen','go_poly_domination','domination_finale'];
const famille=id=>((api.DB[id]||api.NGPLUS_DB[id]||{}).family)||id;
const etat=s=>DOM.filter(x=>s.flags.includes(x)).concat(['possession='+(s.gauges.possession||0),'lien_O='+(s.gauges.lien_O||0),'lien_E='+(s.gauges.lien_E||0)]);
function rejoue(parcours,mode){let s={gameMode:mode||'classic'},d;for(const [id,k] of parcours){d=api.serverGetPendingScene(clone(s));s=d.renderedState;
  if(s.currentSceneId!==id||!d.choices.some(c=>c.key===k))return {ok:false,rupture:id+'/'+k+(s.currentSceneId!==id?' (au lieu de '+s.currentSceneId+')':''),etat:etat(s)};
  s=api.serverProcessChoice(clone(s),k).updatedState;}d=api.serverGetPendingScene(clone(s));return {ok:true,s:d.renderedState,d};}
function cherche(test,pref,n,mode){for(let seed=1;seed<=n;seed++){const r=rng(seed*7+3);let s={gameMode:mode||'classic'};const route=[];
  for(let i=0;i<450;i++){const d=api.serverGetPendingScene(clone(s));s=d.renderedState;if(test(s,d))return {parcours:route.slice(),graine:seed*7+3};if(d.isEnd)break;
   const keys=d.choices.map(c=>c.key);const k=(pref||[]).find(p=>keys.includes(p))||keys[Math.floor(r()*keys.length)];route.push([s.currentSceneId,k]);s=api.serverProcessChoice(clone(s),k).updatedState;}}return null;}
const PREF_POLY=['FIN_POLY','PROPOSER','TRIO6032','ATTENDRE','HALTE603'];
const sansDom=s=>!DOM.some(x=>s.flags.includes(x));
const testFin=fin=>{const fam=f=>f===fin||(api.DB[f]||{}).family===fin||(api.DB[fin]&&api.DB[fin].aliasOf===f);
  return /^GAME_OVER_/.test(fin)?(s,d)=>d.isEnd&&s.currentSceneId===fin:(s,d)=>d.isEnd&&(fam(s.currentSceneId)||(s.flags||[]).includes('variante_'+fin))&&sansDom(s);};
const journal={routesFins:{},routesFinsB:{},echos:{},parcours:{}};
// 1. Routes de fins (fins-routes-601, morts-602, echos-erreurs-602, visuel-602).
const RF=JSON.parse(fs.readFileSync(FX('routes-fins-60.3.2.json')));
for(const [fin,rec] of Object.entries(RF)){const r=rejoue(rec.parcours,rec.mode);if(r.ok)continue;
  const n=cherche(testFin(fin),fin==='FIN_POLY'?PREF_POLY:[],6000,rec.mode);journal.routesFins[fin]={rupture:r.rupture,etat:r.etat,remplacee:!!n,graine:n&&n.graine};if(n)RF[fin]=Object.assign({},rec,n);}
fs.writeFileSync(FX('routes-fins-60.3.3.json'),JSON.stringify(RF));
// 2. Routes de fins-toutes (format [[scène, choix], …], fin exacte ou variante).
const RB=JSON.parse(fs.readFileSync(FX('routes-fins-60.3.2b.json')));
for(const [cible,route] of Object.entries(RB)){const r=rejoue(route);const main=(api.DB[cible]&&api.DB[cible].aliasOf)||cible;
  if(r.ok&&r.s.currentSceneId===main&&(main===cible||r.s.flags.includes('variante_'+cible)))continue;
  const t=(s,d)=>d.isEnd&&s.currentSceneId===main&&(main===cible||s.flags.includes('variante_'+cible));
  const n=cherche(t,cible==='FIN_POLY'?PREF_POLY:[],8000,'classic');journal.routesFinsB[cible]={rupture:r.rupture||'fin différente',etat:r.etat||[],remplacee:!!n,graine:n&&n.graine};if(n)RB[cible]=n.parcours;}
fs.writeFileSync(FX('routes-fins-60.3.3b.json'),JSON.stringify(RB));
// 3. Échos rares.
const ER=JSON.parse(fs.readFileSync(FX('echos-rares-60.3.2.json')));
for(const [cle,rec] of Object.entries(ER.routes)){const r=rejoue(rec.parcours,rec.mode);if(r.ok&&famille(r.s.currentSceneId)===rec.scene&&String(r.d.narrative).includes(rec.texte))continue;
  const n=cherche((s,d)=>famille(s.currentSceneId)===rec.scene&&String(d.narrative||'').includes(rec.texte),[],4000,rec.mode);
  journal.echos[cle]={rupture:r.rupture||'texte absent',etat:r.etat||[],remplacee:!!n};
  if(n)ER.routes[cle]=Object.assign({},rec,{parcours:n.parcours});else{delete ER.routes[cle];ER.sansRoute.push(cle);}}
fs.writeFileSync(FX('echos-rares-60.3.3.json'),JSON.stringify(ER));
// 4. Les 9 parcours (ngplus inchangé : rejoue() suppose le mode classique).
const PA=JSON.parse(fs.readFileSync(FX('parcours-60.3.2.json')));
for(const [nom,rec] of Object.entries(PA)){if(nom==='ngplus')continue;const r=rejoue(rec.parcours);if(r.ok&&(r.s.currentSceneId===rec.fin||famille(r.s.currentSceneId)===rec.fin))continue;
  const n=cherche((s,d)=>d.isEnd&&s.currentSceneId===rec.fin&&sansDom(s),[],8000,'classic');
  journal.parcours[nom]={rupture:r.rupture||'fin différente',etat:r.etat||[],remplacee:!!n,graine:n&&n.graine};if(n)PA[nom]=Object.assign({},rec,{parcours:n.parcours,graine:n.graine});}
fs.writeFileSync(FX('parcours-60.3.3.json'),JSON.stringify(PA));
fs.writeFileSync(FX('regen-6033.json'),JSON.stringify(journal,null,1));console.log(JSON.stringify(journal,null,1));
