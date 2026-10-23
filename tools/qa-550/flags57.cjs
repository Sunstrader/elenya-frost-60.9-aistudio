// Carte des drapeaux : posés vs relus. Usage : node flags57.cjs [--ctx] → classe A/B/C ; exit 1 si A/B non relus.
const fs=require('fs'),path=require('path');
const root=path.resolve(__dirname,'../../elenya-refonte-52.4/project');
const files=fs.readdirSync(root).filter(f=>/\.(js)$/.test(f));
const set=new Map(),read=new Set();
const setRe=/SET_FLAG['",\s]+target:\s*['"]([a-zA-Z0-9_]+)['"]/g;
const readRe=/(?:hasFlag|_ctxHasFlag\([^,()]+,|flags\.includes|hasAnyFlag\([^,()]+,|hasAllFlags\([^,()]+,)\(?\s*['"]([a-zA-Z0-9_]+)['"]/g;
const listRe=/LU57\(\s*\[([^\]]*)\]/g; // listes déclarées lues par un mécanisme générique
for(const f of files){const s=fs.readFileSync(path.join(root,f),'utf8');let m;
  while((m=setRe.exec(s))){if(!set.has(m[1]))set.set(m[1],[]);set.get(m[1]).push(f);}
  while((m=readRe.exec(s)))read.add(m[1]);
  while((m=listRe.exec(s)))for(const x of m[1].match(/['"]([a-zA-Z0-9_]+)['"]/g)||[])read.add(x.slice(1,-1));
  // lectures en chaîne : hasAnyFlag(s,'a','b') / tableaux de .some(f=>...)
  const any=/(?:hasAnyFlag|hasAllFlags)\([^)]*\)/g;while((m=any.exec(s)))for(const x of m[0].match(/['"]([a-zA-Z0-9_]+)['"]/g)||[])read.add(x.slice(1,-1));
  const arr=/\[((?:\s*['"][a-zA-Z0-9_]+['"]\s*,?)+)\]\s*\.(?:some|every|filter|forEach|includes)/g;while((m=arr.exec(s)))for(const x of m[1].match(/['"]([a-zA-Z0-9_]+)['"]/g)||[])read.add(x.slice(1,-1));
}
const C_RE=/^(_|ach_|v28_|v5|go_|_done|seen_|vu_|visite)|_vu$|_vue$|_fini$|_active$|_debut$|_recent$/;
const A_RE=/venin|oraya|silas|veyra|seraphine|lyra|mira|fen_|kalthar|relique|verite|frag|pomme|joute|consort|nuit_|voie_|ton_|corona|dette|sauvetage|combat|refus|pardon|libere|scell|trone|gel|ngplus|kaelen|alistair|elenya|ordre|village|couronne|pacte|serment|sang|mort|trahi|aveu|choix_|vote|alliance|rebel|peuple|nomade|marchand/;
const B_RE=/lien_|romance|interet|focus|lisiere|amis_|intim|bivouac|regard|main_|feu_|soir_|confiance|jalous|tendresse|baiser|kiss|touch|calin|rire|colere|silence/;
const unread=[...set.keys()].filter(k=>!read.has(k));
// 59 : plus de « C par défaut ». Un drapeau non relu est soit technique (C_RE), soit documenté comme trace de journal (TRACE59), sinon il échoue (N).
const TRACE59=new Set(JSON.parse(fs.readFileSync(path.resolve(__dirname,'traces-journal-59.json'),'utf8')));
const A=[],B=[],C=[],N=[];
for(const k of unread.sort()){ if(C_RE.test(k)) C.push(k); else if(B_RE.test(k)) B.push(k); else if(A_RE.test(k)) A.push(k); else if(TRACE59.has(k)) C.push(k); else N.push(k); }
const res={poses:set.size,relus:[...set.keys()].filter(k=>read.has(k)).length,nonRelus:unread.length,A:A.length,B:B.length,C:C.length,N:N.length};
if(process.argv.includes('--list')) console.log(JSON.stringify({A,B,C,N},null,1)); else console.log(JSON.stringify(res));
fs.writeFileSync(path.resolve(__dirname,'../../docs/57-flags.json'),JSON.stringify({res,A,B,C,N},null,1));
if(A.length+B.length+N.length) process.exitCode=1;
