// QA 53.2.0 : préchargement, accessibilité (aria-live, clavier), « Précédemment », interface EN, interrupteurs.
// Usage : node e2e-532.cjs <racine_projet>
const puppeteer=require('puppeteer-core'),{spawn}=require('child_process');
const root=process.argv[2];const sleep=ms=>new Promise(r=>setTimeout(r,ms));const R={};
async function start(browser,{w=1280,h=720,init,ctx}={}){const page=await (ctx||await browser.createBrowserContext()).newPage();await page.setViewport({width:w,height:h});
  const errors=[],imgs=[];page.on('pageerror',e=>errors.push(String(e.message).slice(0,200)));page.on('console',m=>{if(m.type()==='error')errors.push(m.text().slice(0,200))});
  page.on('request',q=>{if(q.resourceType()==='image'||/\.(webp|png|jpe?g)/.test(q.url()))imgs.push(q.url())});page.on('dialog',d=>d.accept());
  if(init)await page.evaluateOnNewDocument(init);
  await page.goto('http://127.0.0.1:3000/',{waitUntil:'load'});await sleep(2500);return {page,errors,imgs};}
async function newGame(page){await page.evaluate(()=>{[...document.querySelectorAll('.accueil-btn')].find(b=>/Nouvelle Partie/.test(b.textContent)).click()});await sleep(800);
  await page.evaluate(()=>document.querySelector('[data-display-mode="windowed"]').click());
  await page.waitForFunction(()=>(document.getElementById('narrative')||{}).textContent?.trim().length>20,{timeout:30000});
  await page.waitForFunction(()=>!document.body.classList.contains('video-playing'),{timeout:90000}).catch(()=>{});await sleep(6000);}
(async()=>{const srv=spawn('node',['server.js'],{cwd:root,stdio:'ignore'});await sleep(2500);
 const browser=await puppeteer.launch({executablePath:process.env.CHROME_PATH||'/usr/bin/google-chrome',headless:'new',args:['--no-sandbox','--autoplay-policy=no-user-gesture-required']});
 try{
  // 1. Partie normale : aria-live, groupe de choix, clavier, préchargement
  {const {page,errors,imgs}=await start(browser);const before=imgs.length;await newGame(page);
   const a=await page.evaluate(()=>{const live=document.getElementById('ef-live');const ch=document.getElementById('choices');const btns=[...ch.querySelectorAll('button')];
     if(btns[0])btns[0].focus();return{live:live&&live.getAttribute('aria-live'),liveTexte:live?live.textContent.slice(0,80):null,role:ch.getAttribute('role'),label:ch.getAttribute('aria-label'),nbChoix:btns.length,
       preload:(window.__efLastHints||null)}});
   await page.keyboard.press('ArrowDown');await sleep(200);
   a.focusApresFlecheBas=await page.evaluate(()=>{const b=[...document.querySelectorAll('#choices button')];return b.indexOf(document.activeElement)});
   await sleep(5000);
   a.imagesDemandees=imgs.length;a.imagesApresLancement=imgs.slice(before);a.lastPlay=await page.evaluate(()=>localStorage.getItem('ef_last_play'));a.erreurs=errors;R.partie=a;
   R.etat=await page.evaluate(()=>localStorage.getItem('elenya_state')?'présent':'absent');await page.close();}
  // 2. Précédemment : sauvegarde existante + dernière session il y a 2 jours
  {const ctx=await browser.createBrowserContext();const {page,errors}=await start(browser,{ctx});
   await newGame(page);await page.evaluate(()=>localStorage.setItem('ef_last_play',String(Date.now()-48*3600e3)));
   await page.reload({waitUntil:'load'});await sleep(3000);
   const btn=await page.evaluate(()=>{const b=[...document.querySelectorAll('.accueil-btn')].find(b=>/Reprendre|Continuer/.test(b.textContent)&&b.offsetParent&&b.offsetParent);if(b){b.click();return b.textContent.trim()}return null});
   await sleep(800);await page.evaluate(()=>{const d=document.querySelector('[data-display-mode="windowed"]');if(d&&d.offsetParent)d.click()});
   let p=null;for(let i=0;i<20&&!p;i++){await sleep(500);p=await page.evaluate(()=>{const e=document.getElementById('ef-previously');return e?{texte:e.textContent,role:e.getAttribute('role')}:null})}
   R.precedemment={bouton:btn,banniere:p,erreurs:errors};await page.close();}
  // 3. Interface en anglais
  {const {page,errors}=await start(browser,{init:()=>localStorage.setItem('ef_ui_lang','en')});
   R.anglais={boutons:await page.evaluate(()=>[...document.querySelectorAll('.accueil-btn')].map(b=>b.textContent.trim().replace(/\s+/g,' '))),lang:await page.evaluate(()=>document.documentElement.lang),erreurs:errors};await page.close();}
  // 4. Interrupteurs désactivés
  {const {page,errors,imgs}=await start(browser,{init:()=>{window.__efOff=1;Object.defineProperty(window,'EF_CONFIG',{configurable:true,set(v){Object.assign(v,{prechargementSuivant:false,accessibiliteAnnonces:false,accessibiliteClavier:false,precedemment:false});Object.defineProperty(window,'EF_CONFIG',{value:v,writable:true,configurable:true})},get(){return undefined}})}});
   const n0=imgs.length;await newGame(page);await sleep(5000);
   R.desactive={cfg:await page.evaluate(()=>JSON.stringify(window.EF_CONFIG)),live:await page.evaluate(()=>{const l=document.getElementById('ef-live');return l?l.textContent.length:null}),imagesApresLancement:imgs.slice(n0),erreurs:errors};await page.close();}
 }finally{await browser.close();srv.kill()}
 console.log(JSON.stringify(R,null,1));})();
