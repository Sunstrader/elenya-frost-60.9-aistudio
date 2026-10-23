// Audit 55 : répétitions, choix décoratifs, scènes inaccessibles, présence des personnages.
const root=require('path').resolve(__dirname,'../../elenya-refonte-52.4');
const {api}=require(root+'/qa/engine.cjs').loadEngine(root+'/project');
api.serverGetPendingScene({gameMode:'classic'});api.serverGetPendingScene({gameMode:'ngplus'});
const out={};const dbs={classic:api.DB,ngplus:api.NGPLUS_DB};
// textes bruts : source des fonctions + text
const src=s=>[s.text||'',s.getDynamicNarrative?String(s.getDynamicNarrative):'',...(s.choices||[]).map(c=>(c.text||'')+' '+(c.response||''))].join(' ');
const words=['porte','portes','cage','cages','terme','insigne','insignes','givre','froid','glace','silence','souffle','fissure','lame','ombre','braise','murmure','frisson','chaîne','chaînes'];
const cnt={},perScene={};
for(const [m,db] of Object.entries(dbs))for(const [id,s] of Object.entries(db)){const t=src(s).toLowerCase();for(const w of words){const n=(t.match(new RegExp('\\b'+w+'\\b','g'))||[]).length;if(n){cnt[w]=(cnt[w]||0)+n;if(n>=3)(perScene[w]=perScene[w]||[]).push(id+':'+n);}}}
out.repetitions=cnt;out.scenesDenses=perScene;
// choix décoratifs : aucun effet, même destination qu'un autre choix de la scène, pas de condition
const deco=[];
for(const [m,db] of Object.entries(dbs))for(const [id,s] of Object.entries(db)){const ch=s.choices||[];if(ch.length<2)continue;
 for(const c of ch){const eff=(c.effects||[]).filter(e=>e.type!=='UNLOCK_ACHIEVEMENT');if(!eff.length&&!c.condition&&ch.some(o=>o!==c&&o.next===c.next))deco.push(m+':'+id+':'+c.key);}}
out.choixDecoratifs=deco;
// flags posés jamais lus
const set=new Set(),read=new Set();
const allSrc=require('fs').readdirSync(root+'/project').filter(f=>/\.(js|html)$/.test(f)).map(f=>require('fs').readFileSync(root+'/project/'+f,'utf8')).join('\n');
for(const db of Object.values(dbs))for(const s of Object.values(db))for(const c of s.choices||[])for(const e of c.effects||[])if(e.type==='SET_FLAG')set.add(e.target);
const neverRead=[...set].filter(f=>{const re=new RegExp("['\"]"+f.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')+"['\"]",'g');return (allSrc.match(re)||[]).length<=1;});
out.flagsJamaisLus={total:set.size,jamaisLus:neverRead.length,liste:neverRead};
// accessibilité : graphe statique depuis le début
const reach=new Set(['ACTE1_01_REVEIL']);const q=['ACTE1_01_REVEIL'];
const trig=allSrc.match(/interceptToScene:\s*['"]([A-Z0-9_ËÉ]+)['"]/g)||[];trig.forEach(t=>{const id=t.match(/['"]([^'"]+)['"]/)[1];if(!reach.has(id)){reach.add(id);q.push(id);}});
while(q.length){const id=q.shift();const s=api.DB[id];if(!s)continue;for(const c of s.choices||[]){const n=c.next;if(n&&n!=='RETURN'&&!reach.has(n)){reach.add(n);q.push(n);}}}
out.scenesClassiquesNonAtteintesStatique=Object.keys(api.DB).filter(id=>!reach.has(id));
// personnages : mentions dans les textes
const persos=['Kaelen','Alistair','Fen','Kalthar','Séraphine','Veyra','Mira','Lyra','Oraya','Silas','Corona','Essinay','Valerius','Thorne','Brannoc','Isolde'];
const pc={};for(const db of Object.values(dbs))for(const [id,s] of Object.entries(db)){const t=src(s);for(const p of persos)if(t.includes(p))pc[p]=(pc[p]||0)+1;}
out.scenesParPersonnage=pc;
console.log(JSON.stringify(out,null,1));
