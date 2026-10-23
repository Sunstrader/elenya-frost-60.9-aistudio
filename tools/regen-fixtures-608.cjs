// 60.8.0 : régénère les routes figées (fixtures) après les fusions de rythme et les gardes romance.
// 1) retire les étapes posées sur les 5 scènes fusionnées (le choix amont porte leur texte et leur suite) ;
// 2) pour une route encore injouable, garde le préfixe jouable et cherche une suite (graines déterministes)
//    qui atteint la même cible ; la rupture et l'état constaté sont journalisés (regen-608.json). Outil, pas un test.
'use strict';
const fs=require('fs'),path=require('path');const {engine,rng,clone}=require('../tests/lib.cjs');const {api}=engine();
const FUS=['LIEN_MARCHE_2B','ACTE2_02B_PANTHERE_LIBEREE','ACTE2_02B_PANTHERE_ABSORBEE','ACTE3_11_PRISON_ECHANGE','ACTE4_07B_CHOC_FRAGMENT'];
const FX=p=>path.join(__dirname,'../tests/fixtures',p);
// SRC=60.8.0 : répare les fixtures 60.8.0 elles-mêmes (après un rééquilibrage de jauges) au lieu de repartir des 60.3.2.
const SRC=process.env.SRC||'60.3.2';const SRCF=n=>n.replace('60.3.2',SRC);const strip=p=>p.filter(([id])=>!FUS.includes(id));
const DOM=['crevasse_domination','domination_acte3_O','domination_acte3_E','domination_path_chosen','go_poly_domination','domination_finale'];
const famille=id=>((api.DB[id]||api.NGPLUS_DB[id]||{}).family)||id;
function rejoue(par,mode){let s={gameMode:mode||'classic'},d;for(let i=0;i<par.length;i++){const [id,k]=par[i];d=api.serverGetPendingScene(clone(s));s=d.renderedState;
  if(s.currentSceneId!==id||!d.choices.some(c=>c.key===k))return {ok:false,i,rupture:id+'/'+k+(s.currentSceneId!==id?' (au lieu de '+s.currentSceneId+')':''),etat:DOM.filter(x=>s.flags.includes(x))};
  s=api.serverProcessChoice(clone(s),k).updatedState;}d=api.serverGetPendingScene(clone(s));return {ok:true,s:d.renderedState,d};}
function suite(prefixe,test,pref,n,mode){for(let cut=prefixe.length;cut>=0;cut=cut>40?cut-40:(cut>0?0:-1)){const base=prefixe.slice(0,cut);let s0={gameMode:mode||'classic'};for(const [,k] of base)s0=api.serverProcessChoice(clone(api.serverGetPendingScene(clone(s0)).renderedState),k).updatedState;
  const nn=cut===0?n:Math.min(n,120);for(let seed=1;seed<=nn;seed++){const r=rng(seed*7+3);let s=clone(s0);
   const route=base.slice();for(let i=0;i<450;i++){const d=api.serverGetPendingScene(clone(s));s=d.renderedState;if(test(s,d))return {parcours:route,graine:seed*7+3,prefixe:cut};if(d.isEnd)break;
    const keys=d.choices.map(c=>c.key);const k=(pref||[]).find(p=>keys.includes(p))||keys[Math.floor(r()*keys.length)];route.push([s.currentSceneId,k]);s=api.serverProcessChoice(clone(s),k).updatedState;}}
  if(cut===0)break;}return null;}
const PREF_POLY=['FIN_POLY','PROPOSER','TRIO6032','ATTENDRE','HALTE603','R608_PRIERE'];
const sansDom=s=>!DOM.some(x=>s.flags.includes(x));
const testFin=(fin,dom)=>/^GAME_OVER_/.test(fin)?(s,d)=>d.isEnd&&s.currentSceneId===fin:(s,d)=>d.isEnd&&s.currentSceneId===fin&&(dom||sansDom(s)) /* 60.8.1 : identifiant exact (la famille confondait LIBERATION et VIDE) */;
const J={routesFins:{},routesFinsB:{},echos:{},parcours:{}};
function traite(cat,cle,par,mode,test,pref,n,ecrire){process.stderr.write(cat+' '+cle+'\n');const p=strip(par);const r=rejoue(p,mode);if(r.ok&&test(r.s,r.d)){ecrire(p);return;}
  const x=suite(r.ok?p:p.slice(0,r.i),test,pref,n,mode);J[cat][cle]={rupture:r.rupture||'cible différente',etat:r.etat||[],remplacee:!!x,graine:x&&x.graine,prefixeGarde:x&&x.prefixe};if(x)ecrire(x.parcours);else ecrire(null);}
const RF=JSON.parse(fs.readFileSync(FX(SRCF('routes-fins-60.3.2.json'))));
for(const [fin,rec] of Object.entries(RF))traite('routesFins',fin,rec.parcours,rec.mode,testFin(fin,fin==='FIN_DOMINATION'),fin==='FIN_POLY'?PREF_POLY:fin==='FIN_SERAPHINE_LAME'?['SERAPHINE_LAME','BAISER','AIMER']:[],fin==='FIN_POLY'?4000:1500,p=>{if(p)rec.parcours=p;});
fs.writeFileSync(FX('routes-fins-60.8.0.json'),JSON.stringify(RF));
const RB=JSON.parse(fs.readFileSync(FX(SRCF('routes-fins-60.3.2b.json'))));
for(const [c,route] of Object.entries(RB)){const main=(api.DB[c]&&api.DB[c].aliasOf)||c;const t=(s,d)=>d.isEnd&&s.currentSceneId===main&&(main===c||s.flags.includes('variante_'+c));
  traite('routesFinsB',c,route,'classic',t,c==='FIN_POLY'?PREF_POLY:c==='FIN_SERAPHINE_LAME'?['SERAPHINE_LAME','BAISER','AIMER']:[],c==='FIN_POLY'?4000:1500,p=>{if(p)RB[c]=p;});}
fs.writeFileSync(FX('routes-fins-60.8.0b.json'),JSON.stringify(RB));
const ER=JSON.parse(fs.readFileSync(FX(SRCF('echos-rares-60.3.2.json'))));
for(const [cle,rec] of Object.entries(ER.routes)){const t=(s,d)=>famille(s.currentSceneId)===rec.scene&&String(d.narrative||'').includes(rec.texte);
  traite('echos',cle,rec.parcours,rec.mode,t,[],1500,p=>{if(p)rec.parcours=p;else{delete ER.routes[cle];ER.sansRoute.push(cle);}});}
fs.writeFileSync(FX('echos-rares-60.8.0.json'),JSON.stringify(ER));
const PA=JSON.parse(fs.readFileSync(FX(SRCF('parcours-60.3.2.json'))));
for(const [nom,rec] of Object.entries(PA)){if(nom==='ngplus')continue;const t=(s,d)=>d.isEnd&&(s.currentSceneId===rec.fin||famille(s.currentSceneId)===rec.fin)&&(nom==='domination'||sansDom(s));
  traite('parcours',nom,rec.parcours,'classic',t,[],1500,p=>{if(p)rec.parcours=p;});}
fs.writeFileSync(FX('parcours-60.8.0.json'),JSON.stringify(PA));
fs.writeFileSync(FX(SRC==='60.8.0'?'regen-608-reparation.json':'regen-608.json'),JSON.stringify(J,null,1));console.log(JSON.stringify(J,null,1));
