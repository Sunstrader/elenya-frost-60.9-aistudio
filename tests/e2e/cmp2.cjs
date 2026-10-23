const fs=require('fs'),{PNG}=require('pngjs'),pm=require('pixelmatch');const [a,b]=process.argv.slice(2);
for(const f of fs.readdirSync(a).filter(f=>/-(3-recit|4-menu)\.png$/.test(f))){const A=PNG.sync.read(fs.readFileSync(a+'/'+f)),B=PNG.sync.read(fs.readFileSync(b+'/'+f));
if(A.width!==B.width||A.height!==B.height){console.log(f,'taille différente');continue}
const d=pm(A.data,B.data,null,A.width,A.height,{threshold:0.1});console.log(f,(100*d/(A.width*A.height)).toFixed(2)+'% pixels différents')}
