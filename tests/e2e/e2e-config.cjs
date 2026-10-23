// E2E : EF_CONFIG tout à false => comportement 53.0.0 (menu paysage non borné, fond titre 1920 px).
const puppeteer=require('puppeteer-core'),{spawn}=require('child_process');const sleep=ms=>new Promise(r=>setTimeout(r,ms));
(async()=>{const srv=spawn('node',['server.js'],{cwd:process.argv[2],stdio:'ignore'});await sleep(2500);
const b=await puppeteer.launch({executablePath:process.env.CHROME_PATH||'/usr/bin/google-chrome',headless:'new',args:['--no-sandbox']});const out={};
for(const off of [false,true]){
 const p=await b.newPage();await p.setViewport({width:390,height:844,isMobile:true});const imgs=[];p.on('request',r=>{if(/1hJUSnRl/.test(r.url()))imgs.push(r.url().slice(-6))});const errs=[];p.on('pageerror',e=>errs.push(e.message));
 if(off)await p.evaluateOnNewDocument(()=>{let c;Object.defineProperty(window,'EF_CONFIG',{configurable:true,set(v){for(const k in v)v[k]=false;c=v},get(){return c}})});
 await p.goto('http://127.0.0.1:3000/',{waitUntil:'load'});await sleep(2500);
 const cls=await p.evaluate(()=>document.documentElement.className);
 await p.setViewport({width:844,height:390,isMobile:true,hasTouch:true});await sleep(500);
 const mh=await p.evaluate(()=>{const m=document.getElementById('game-quick-menu');m.classList.add('show');const r=getComputedStyle(m);return r.maxHeight});
 out[off?'toutAFalse':'parDefaut']={classes:cls,fondTitre:imgs,menuMaxHeightPaysage:mh,erreurs:errs};await p.close();}
await b.close();srv.kill();console.log(JSON.stringify(out,null,1))})();
