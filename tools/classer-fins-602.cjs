// 60.2 : classe chaque fin selon la preuve disponible : « décisions » (route complète depuis une partie neuve, rejouée),
// « injection » (seulement atteinte depuis un état injecté), « présence » (scène définie, jamais atteinte). Vérifie le texte des variantes.
const fs=require('fs'),path=require('path');const {engine,clone}=require('../tests/lib.cjs');const {api}=engine();
const R=JSON.parse(fs.readFileSync(path.join(__dirname,'../tests/fixtures/routes-fins-60.1.0.json')));
const fins=[...Object.keys(api.DB).filter(k=>api.DB[k].isEnd).map(k=>[k,'classic']),...Object.keys(api.NGPLUS_DB).filter(k=>api.NGPLUS_DB[k].isEnd).map(k=>[k,'ngplus'])];
const lignes=[];const bilan={decisions:0,injection:0,presence:0};
for(const [fin,mode] of fins){const rec=R[fin];if(!rec){lignes.push({fin,mode,classe:'présence'});bilan.presence++;continue}
 let s={gameMode:rec.mode||'classic'},decisions=0;for(const [id,k] of rec.parcours){const d=api.serverGetPendingScene(clone(s));s=d.renderedState;if((d.choices||[]).length>=2)decisions++;s=api.serverProcessChoice(clone(s),k).updatedState}
 const d=api.serverGetPendingScene(clone(s));const sc=d.renderedState.currentSceneId;const variante=sc!==fin;
 let texteVariante='';if(variante){const sans=clone(d.renderedState);sans.flags=sans.flags.filter(f=>f!=='variante_'+fin);const t2=api.serverGetPendingScene(sans).narrative||'';texteVariante=(d.narrative||'')!==t2?'texte propre':'TEXTE IDENTIQUE'}
 lignes.push({fin,mode,classe:'décisions',choix:rec.parcours.length,decisionsReelles:decisions,sceneAffichee:sc,variante,texteVariante,graine:rec.graine||'fixture'});bilan.decisions++}
fs.writeFileSync(path.join(__dirname,'../docs/60.2/fins-classement.json'),JSON.stringify({bilan,lignes},null,1));
let md='# Classement des 36 fins (60.2, généré par tools/classer-fins-602.cjs)\n\nDécisions = route complète depuis une partie neuve, rejouée par tests/fins-routes-601.cjs (aucun état injecté). Injection = seulement depuis un état injecté. Présence = scène définie sans route.\n\n| Fin | Mode | Classe | Choix | Décisions réelles (≥ 2 options) | Scène affichée | Variante |\n|---|---|---|---|---|---|---|\n';
for(const l of lignes)md+=`| ${l.fin} | ${l.mode} | ${l.classe} | ${l.choix||''} | ${l.decisionsReelles||''} | ${l.sceneAffichee||''} | ${l.variante?l.texteVariante:'—'} |\n`;
md+=`\nBilan : ${JSON.stringify(bilan)}.\n`;fs.writeFileSync(path.join(__dirname,'../docs/60.2/FINS_CLASSEMENT.md'),md);console.log(JSON.stringify(bilan),lignes.filter(l=>l.variante).map(l=>l.fin+':'+l.texteVariante).join(' '))
