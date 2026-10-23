// 60.1 : fige des sauvegardes au format 60 (parcours 60, NG+, agonies, écrans de fin). Outil ; le test est tests/sauvegardes-601.cjs.
const fs=require('fs'),path=require('path');const {engine,clone}=require('../tests/lib.cjs');const {api}=engine();
const P=JSON.parse(fs.readFileSync(path.join(__dirname,'../tests/fixtures/parcours-60.0.0.json')));const out=[];
const snap=(nom,s)=>{const d=api.serverGetPendingScene(clone(s));out.push({nom,state:clone(s),attendu:{scene:d.renderedState.currentSceneId,choix:(d.choices||[]).map(c=>c.key),fin:!!d.isEnd}})};
for(const [nom,rec] of Object.entries(P)){let s={gameMode:nom==='ngplus'?'ngplus':'classic'};rec.parcours.forEach(([id,k],i)=>{const d=api.serverGetPendingScene(clone(s));s=d.renderedState;
 if(i%15===7||/^(AGONIE_|SIRENE_DERNIER|SCEAU_DERNIER|FRAGMENT_ANCESTRE_KALTHAR_JEUNE|TRIO_|ACTE4_09)/.test(id))snap(nom+'#'+i+' '+id,s);s=api.serverProcessChoice(clone(s),k).updatedState});
 snap(nom+' fin',api.serverGetPendingScene(clone(s)).renderedState);}
fs.writeFileSync(path.join(__dirname,'../tests/fixtures/sauvegardes-60.1.0.json'),JSON.stringify({format:Object.keys(out[0].state).sort(),sauvegardes:out}));
console.log(out.length,'sauvegardes',Object.keys(out[0].state).sort().join(','));
