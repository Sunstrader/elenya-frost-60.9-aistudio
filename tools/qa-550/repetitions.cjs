// Compte des mots surveillés dans les fichiers de texte du jeu (source brute). Usage : node repetitions.cjs [dossier_project]
const fs=require('fs'),path=require('path');
const dir=process.argv[2]||path.resolve(__dirname,'../../elenya-refonte-52.4/project');
const files=fs.readdirSync(dir).filter(f=>/^(DATABASE_.*|23_Refonte|24_NGPlus_Ultra)\.js$/.test(f));
const txt=files.map(f=>fs.readFileSync(path.join(dir,f),'utf8')).join('\n').toLowerCase();
const words=['insigne','insignes','porte','portes','cage','cages','terme','médaillon','emblème'];
const out={};for(const w of words)out[w]=(txt.match(new RegExp('(?<![\\w_])'+w+'(?![\\w_])','g'))||[]).length;
// formules figurées
out['« une porte » figurée']=(txt.match(/une porte (laissée|qu’|qui|vient)|fermer la porte|fermé la porte|la porte reste ouverte|devenir une porte/g)||[]).length;
out['« n’est (pas|plus) une cage »']=(txt.match(/n’est (pas|plus) une cage/g)||[]).length;
console.log(JSON.stringify(out));
