const fs=require('fs'),path=require('path');
const root=path.resolve(__dirname,'../../elenya-refonte-52.4/project');
const files=fs.readdirSync(root).filter(f=>/\.js$/.test(f));
const set=new Map(), read=new Map();
const setRe=/SET_FLAG['",\s]+target:\s*['"]([a-z0-9_]+)['"]/g;
const hasRe=/hasFlag\(\s*['"]([a-z0-9_]+)['"]\s*\)|_ctxHasFlag\([^,]+,\s*['"]([a-z0-9_]+)['"]\)|flags\.includes\(\s*['"]([a-z0-9_]+)['"]\s*\)/g;
for(const f of files){const s=fs.readFileSync(path.join(root,f),'utf8'); let m;
  while((m=setRe.exec(s))){ (set.get(m[1])||set.set(m[1],[]).get(m[1])).push(f); }
  while((m=hasRe.exec(s))){ const k=m[1]||m[2]||m[3]; (read.get(k)||read.set(k,[]).get(k)).push(f); }
}
const unread=[...set.keys()].filter(k=>!read.has(k)&&!k.startsWith('_')&&!k.startsWith('ach_'));
const A=[],B=[],C=[];
for(const k of unread.sort()){
  if(/venin|oraya|silas|veyra|seraphine|lyra|mira|fen_|kalthar|reliques|verite|frag|pomme|joute|consort|nuit_|voie_|ton_|corona|dette|sauvetage|combat|refus|pardon|libere|scellement|trone|gel/.test(k)) A.push(k);
  else if(/lien_|romance|interet|focus|lisiere|amis_|intim|bivouac|regard|main_|feu_|soir_|confiance|jalous/.test(k)) B.push(k);
  else C.push(k);
}
console.log(JSON.stringify({poses:set.size,relus:read.size,jamaisRelus:unread.length,A:A.length,B:B.length,C:C.length,exA:A.slice(0,40),exB:B.slice(0,20)},null,1));
fs.writeFileSync('docs/56/FLAGS_MAP_56.json',JSON.stringify({A,B,C,unread},null,1));
