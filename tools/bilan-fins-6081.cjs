// 60.8.1 : rejoue les 36 routes et écrit le bilan (identifiant exact atteint, preuve). node tools/bilan-fins-6081.cjs
const fs=require('fs'),path=require('path');const {engine,clone}=require('../tests/lib.cjs');const {api}=engine();
const R=require('../tests/fixtures/routes-fins-60.8.0.json');const L=['# 60.8.1 — Bilan des 36 fins (rejoué le '+new Date().toISOString().slice(0,16)+' UTC, commit '+require('child_process').execSync('git rev-parse --short HEAD').toString().trim()+')','','Chaque ligne vient d’un rejeu réel du moteur sur la route enregistrée. Fin attendue = identifiant de scène atteint (aucune famille).','','| Fin | Atteinte | Étapes | Titre | Drapeaux de fin / variante | Début du texte |','|---|---|---|---|---|---|'];
let ok=0;const h=new Map();
for(const [fin,r] of Object.entries(R)){let s={gameMode:r.mode||'classic'},sync=true;for(const [eid,k] of r.parcours){const d=api.serverGetPendingScene(clone(s));if(d.renderedState.currentSceneId!==eid)sync=false;s=api.serverProcessChoice(clone(d.renderedState),k).updatedState;}
 const d=api.serverGetPendingScene(clone(s));const id=d.renderedState.currentSceneId;const fl=(d.renderedState.flags||[]).filter(f=>/^(ngplus_final_|variante_|ending_|fin_)/.test(f));
 const t=String(d.narrative||'').replace(/\s+/g,' ').trim();const dup=h.get(t);h.set(t,fin);const good=sync&&id===fin&&d.isEnd!==false&&!dup;if(good)ok++;
 L.push(`| ${fin} | ${good?'OUI':'NON'} ${id} | ${r.parcours.length} | ${(d.title||'').replace(/\|/g,'/')} | ${fl.join(', ').slice(0,90)} | ${t.slice(0,70).replace(/\|/g,'/')}… |`);}
L.push('',`Total : ${ok}/${Object.keys(R).length} fins atteintes par identifiant exact, textes tous distincts : ${h.size===Object.keys(R).length}.`);
fs.writeFileSync(path.join(__dirname,'../docs/60.8.1/FINS.md'),L.join('\n')+'\n');console.log(ok,Object.keys(R).length,h.size);
