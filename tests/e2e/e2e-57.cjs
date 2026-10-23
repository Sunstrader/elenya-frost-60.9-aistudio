// E2E 57 : une sauvegarde réelle (parcours instabilité) reprise dans le navigateur ; le choix « tempête » et sa scène s’affichent.
const puppeteer=require('puppeteer-core'),{spawn}=require('child_process'),fs=require('fs'),path=require('path');
const [root,out]=process.argv.slice(2);fs.mkdirSync(out,{recursive:true});const sleep=ms=>new Promise(r=>setTimeout(r,ms));
// 60.1 : l’état de départ est recalculé depuis le parcours « instabilité » (fixture 60), plus de fichier /tmp.
const E=(()=>{const eng=path.join(root,'elenya-refonte-52.4');const {api}=require(path.join(eng,'qa/engine.cjs')).loadEngine(path.join(eng,'project'));const C=x=>JSON.parse(JSON.stringify(x));
 let s={gameMode:'classic'};for(const [id,k] of JSON.parse(fs.readFileSync(path.join(root,'tests/fixtures/parcours-60.8.0.json'),'utf8')).instabilite.parcours){s=api.serverGetPendingScene(C(s)).renderedState;if(id==='ACTE4_05_ARRIVEE_PORTES_1')return {instabilite:{state:s}};s=api.serverProcessChoice(C(s),k).updatedState}throw new Error('Portes non atteintes');})();
(async()=>{const srv=spawn('node',['server.js'],{cwd:root,stdio:'ignore'});await sleep(2500);
const b=await puppeteer.launch({executablePath:process.env.CHROME_PATH||'/usr/bin/google-chrome',headless:'new',args:['--no-sandbox']});const rep=[];
try{for(const [w,h] of [[360,640],[1280,720],[3840,2160]]){const p=await b.newPage();const m=w<900;await p.setViewport({width:w,height:h,isMobile:m,hasTouch:m});
 const errs=[];p.on('pageerror',e=>errs.push(String(e.message).slice(0,150)));p.on('console',x=>{if(x.type()==='error')errs.push(x.text().slice(0,150))});p.on('dialog',d=>d.accept());
 await p.goto('http://127.0.0.1:3000/',{waitUntil:'load'});await p.evaluate(s=>{localStorage.clear();localStorage.setItem('elenya_state',JSON.stringify(s))},E.instabilite.state);await p.reload({waitUntil:'load'});await sleep(2500);
 await p.evaluate(()=>document.getElementById('btn-continue-classic').click());
 await p.waitForFunction(()=>/tempête peut les fendre/.test((document.getElementById('narrative')||{}).textContent||''),{timeout:30000}).catch(()=>{});await sleep(1500);
 const r={taille:w+'x'+h};r.echoInstabilite=await p.evaluate(()=>/tempête peut les fendre/.test(document.getElementById('narrative').textContent));
 r.choixTempete=await p.evaluate(()=>[...document.querySelectorAll('#choices button')].some(x=>/fendre les vantaux/.test(x.textContent)));
 await p.screenshot({path:path.join(out,w+'x'+h+'-portes.png')});
 await p.evaluate(()=>[...document.querySelectorAll('#choices button')].find(x=>/fendre les vantaux/.test(x.textContent)).click());
 await p.waitForFunction(()=>/obsidienne éclate/.test((document.getElementById('narrative')||{}).textContent||''),{timeout:30000}).catch(()=>{});await sleep(1500);
 await sleep(6000); r.sceneTempete=await p.evaluate(()=>/obsidienne éclate/.test(document.getElementById('narrative').textContent));
 await p.screenshot({path:path.join(out,w+'x'+h+'-tempete.png')});r.erreurs=errs;rep.push(r);await p.close();}}
finally{await b.close();srv.kill();}console.log(JSON.stringify(rep));process.exit(rep.every(r=>r.echoInstabilite&&r.choixTempete&&r.sceneTempete&&!r.erreurs.length)?0:1)})();
