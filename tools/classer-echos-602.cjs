// 60.2 : examen individuel des 83 échos rares sans route. Classe chaque écho :
//  inaccessible   — un drapeau exigé n'est posé nulle part dans la source (ou scène hôte absente) ;
//  contradictoire — la condition exige un drapeau et son contraire déclaré dans la même condition ;
//  rare           — tous les drapeaux exigés sont posables ; la combinaison n'a pas été trouvée dans le budget (parcours non trouvé).
// Aucun parcours artificiel : rien n'est injecté, on lit la condition et la source.
const fs=require('fs'),path=require('path'),vm=require('vm');const root=path.resolve(__dirname,'../elenya-refonte-52.4');
const {api,ctx}=require(root+'/qa/engine.cjs').loadEngine(root+'/project');api.serverGetPendingScene({gameMode:'classic'});
const F=require('../tests/fixtures/echos-rares-60.1.0.json');
const L=[].concat(...['RECIT57_ECHOS','RECIT57B_ECHOS','RECIT58_ECHOS','RECIT59_ECHOS'].map(n=>vm.runInContext('typeof '+n+'!=="undefined"?'+n+':[]',ctx))).filter(e=>typeof e[2]==='string');
const cle=e=>e[0]+' :: '+e[2].slice(0,60);const parCle=Object.fromEntries(L.map(e=>[cle(e),e]));
const src=fs.readdirSync(root+'/project').filter(f=>/\.js$/.test(f)&&!/^9\d_/.test(f)).map(f=>fs.readFileSync(root+'/project/'+f,'utf8')).join('\n');
const pose=f=>{const all=(src.match(new RegExp("['\"]"+f.replace(/[$]/g,'\\$')+"['\"]",'g'))||[]).length;const lus=(src.match(new RegExp("(hasFlag|includes|hasAnyFlag|hasAllFlags|_ctxHasFlag\\([^,]*,)\\s*\\(?\\s*['\"]"+f+"['\"]",'g'))||[]).length;return all-lus};
const lignes=[];const bilan={};
for(const k of F.sansRoute){const e=parCle[k];let classe,detail;
 if(!e){classe='inaccessible';detail='écho introuvable dans la source actuelle'}
 else if(!api.DB[e[0]]&&!api.NGPLUS_DB[e[0]]){classe='inaccessible';detail='scène hôte absente'}
 else{const s=String(e[1]);const exiges=[...s.matchAll(/(!?)\s*(?:gs\.)?hasFlag\(\s*['"]([^'"]+)['"]\s*\)/g)].filter(m=>!m[1]).map(m=>m[2]);
  const nies=[...s.matchAll(/!\s*(?:gs\.)?hasFlag\(\s*['"]([^'"]+)['"]\s*\)/g)].map(m=>m[1]);
  const jamais=exiges.filter(f=>pose(f)<=0);const contra=exiges.filter(f=>nies.includes(f));
  const ou=/\|\|/.test(s);
  if(contra.length&&!ou){classe='contradictoire';detail='exige et nie '+contra.join(',')}
  else if(jamais.length&&!ou){classe='inaccessible';detail='jamais posé : '+jamais.join(', ')}
  else{classe='rare';detail=(exiges.length?'exige '+[...new Set(exiges)].join(' + '):'condition sur jauges')+(jamais.length?' (alternative ; jamais posé : '+jamais.join(',')+')':'')}}
 bilan[classe]=(bilan[classe]||0)+1;lignes.push({echo:k,classe,detail})}
fs.writeFileSync(path.join(__dirname,'../docs/60.2/echos-rares-classement.json'),JSON.stringify({bilan,lignes},null,1));
var md='# Examen des 83 échos rares sans route (60.2, tools/classer-echos-602.cjs)\n\nAucun parcours artificiel : la condition de chaque écho est lue et chaque drapeau exigé est cherché dans la source (hors QA). Rien n’a été corrigé automatiquement : une correction demande d’établir le comportement attendu.\n\nBilan : '+JSON.stringify(bilan)+'\n\n| Écho (scène :: début) | Classe | Détail |\n|---|---|---|\n'+lignes.map(l=>`| ${l.echo.replace(/\|/g,'/')} | ${l.classe} | ${l.detail} |`).join('\n')+'\n';
fs.writeFileSync(path.join(__dirname,'../docs/60.2/ECHOS_RARES.md'),md);console.log(JSON.stringify(bilan));console.log(lignes.filter(l=>l.classe!=='rare').map(l=>l.echo.slice(0,50)+' | '+l.detail).join('\n'))
// Étape 2 : jeu aléatoire (graines 9000+, 400 parties) — le drapeau est-il posé ? l'hôte visité ? les deux dans la même partie, drapeau avant l'hôte ?
{const C=x=>JSON.parse(JSON.stringify(x));const st={};for(const l of lignes)st[l.echo]={drapeau:0,hote:0,ensemble:0,affiche:0};
 for(let g=0;g<400;g++){let seed=(9000+g)*7919>>>0;const r=()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296};let s={gameMode:'classic'};const vus={};const hotes={};
  for(let k=0;k<450;k++){const d=api.serverGetPendingScene(C(s));s=d.renderedState;const fl=new Set(s.flags||[]);
   for(const l of lignes){const e=parCle[l.echo];if(!e)continue;const ex=(String(e[1]).match(/hasFlag\(\s*['"]([^'"]+)/)||[])[1];
    if(ex&&fl.has(ex))vus[l.echo]=1;if(s.currentSceneId===e[0]){hotes[l.echo]=1;if(ex&&fl.has(ex))st[l.echo].ensemble++;if(String(d.narrative||'').includes(e[2]))st[l.echo].affiche++}}
   const epi=(d.choices||[]).find(c=>c.key==='EPILOGUE');if(d.isEnd&&epi&&!s._epi602){s=api.serverProcessChoice(C(s),'EPILOGUE').updatedState;s._epi602=1;continue}if(d.isEnd||!(d.choices||[]).length)break;s=api.serverProcessChoice(C(s),d.choices[Math.floor(r()*d.choices.length)].key).updatedState}
  for(const k in vus)st[k].drapeau++;for(const k in hotes)st[k].hote++}
 const b2={};for(const l of lignes){const x=st[l.echo];l.jeu=x;l.sousClasse=!x.drapeau?'drapeau jamais posé en 400 parties':!x.hote?'hôte jamais visité':!x.ensemble?'drapeau et hôte jamais ensemble':x.affiche?'affiché (rare)':'conditions réunies mais texte absent';b2[l.sousClasse]=(b2[l.sousClasse]||0)+1}
 fs.writeFileSync(path.join(__dirname,'../docs/60.2/echos-rares-classement.json'),JSON.stringify({bilan,sousBilan:b2,lignes},null,1));
 md=md.replace('| Écho (scène :: début) | Classe | Détail |\n|---|---|---|\n'+lignes.map(l=>`| ${l.echo.replace(/\|/g,'/')} | ${l.classe} | ${l.detail} |`).join('\n'),'Jeu aléatoire (400 parties) : '+JSON.stringify(b2)+'\n\n| Écho (scène :: début) | Classe | Détail | En jeu (parties drapeau / hôte / ensemble / affiché) | Constat |\n|---|---|---|---|---|\n'+lignes.map(l=>`| ${l.echo.replace(/\|/g,'/')} | ${l.classe} | ${l.detail} | ${l.jeu.drapeau} / ${l.jeu.hote} / ${l.jeu.ensemble} / ${l.jeu.affiche} | ${l.sousClasse} |`).join('\n'));
 fs.writeFileSync(path.join(__dirname,'../docs/60.2/ECHOS_RARES.md'),md);console.log(JSON.stringify(b2))}
