// 60.1 : deux mesures distinctes de « scènes à choix unique » (audit : 37,6 % contre 45 %).
// 1) statique : scènes classiques de la base (hors fins) dont la liste de choix déclarée n’a qu’un élément ;
// 2) en jeu : part des affichages, sur N parties au hasard (graines 5000+), où un seul choix est visible (conditions évaluées, choix injectés compris).
const {engine,rng,clone}=require('../tests/lib.cjs');const {api}=engine();
const sc=Object.entries(api.DB).filter(([,s])=>!s.isEnd);const un=sc.filter(([,s])=>(s.choices||[]).length===1).length;
const N=+process.argv[2]||300;let aff=0,aff1=0;const vus=new Set(),vus1=new Set();
for(let g=0;g<N;g++){const r=rng(5000+g);let s={gameMode:'classic'};for(let k=0;k<450;k++){const d=api.serverGetPendingScene(clone(s));s=d.renderedState;if(d.isEnd)break;aff++;vus.add(s.currentSceneId);if(d.choices.length===1){aff1++;vus1.add(s.currentSceneId)}
 s=api.serverProcessChoice(clone(s),d.choices[Math.floor(r()*d.choices.length)].key).updatedState}}
console.log(JSON.stringify({statique:{scenes:sc.length,unChoix:un,part:+(100*un/sc.length).toFixed(1)},enJeu:{parties:N,affichages:aff,unChoix:aff1,part:+(100*aff1/aff).toFixed(1),scenesVues:vus.size,scenesVuesAvecUnSeulChoixAuMoinsUneFois:vus1.size}}));
