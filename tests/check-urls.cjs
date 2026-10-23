// Vérifie (HEAD puis GET partiel) chaque URL de tests/assets-urls.txt. Affiche les URLs en échec.
const fs=require('fs'),path=require('path');
const urls=fs.readFileSync(path.join(__dirname,'assets-urls.txt'),'utf8').trim().split('\n').filter(u=>!u.includes('${'));
(async()=>{const bad=[];let i=0;
 async function one(u){try{let r=await fetch(u,{method:'HEAD'});if(r.status>=400)r=await fetch(u,{headers:{Range:'bytes=0-0'}});if(r.status>=400)bad.push(r.status+' '+u)}catch(e){bad.push('ERR '+u)}}
 const pool=Array.from({length:8},async()=>{while(i<urls.length)await one(urls[i++])});await Promise.all(pool);
 process.stdout.write(bad.join('\n'));})();
