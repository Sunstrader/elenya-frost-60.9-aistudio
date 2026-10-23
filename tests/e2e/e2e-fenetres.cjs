// QA 53.3.0 : fenêtres Refonte (Paramètres, Parcours, Codex, Musiques) sur 10 tailles. Usage : node e2e-fenetres.cjs <racine> <sortie>
const puppeteer=require('puppeteer-core'),{spawn}=require('child_process'),fs=require('fs'),path=require('path');
const [root,out]=process.argv.slice(2);fs.mkdirSync(out,{recursive:true});const sleep=ms=>new Promise(r=>setTimeout(r,ms));
const sizes=process.env.SIZES?JSON.parse(process.env.SIZES):[[360,640],[390,844],[412,915],[844,390],[768,1024],[1024,768],[1280,720],[1920,1080],[2560,1080],[3840,2160]];
(async()=>{const srv=spawn('node',['server.js'],{cwd:root,stdio:'ignore'});await sleep(2500);
const browser=await puppeteer.launch({executablePath:process.env.CHROME_PATH||'/usr/bin/google-chrome',headless:'new',args:['--no-sandbox','--autoplay-policy=no-user-gesture-required']});const rep=[];
try{for(const [w,h] of sizes){const ctx=await browser.createBrowserContext();const p=await ctx.newPage();const mobile=w<900;await p.setViewport({width:w,height:h,isMobile:mobile,hasTouch:mobile});
 const errors=[];p.on('pageerror',e=>errors.push('PAGEERROR '+e.message.slice(0,200)));p.on('console',m=>{if(m.type()==='error')errors.push(m.text().slice(0,200))});p.on('dialog',d=>d.accept());
 await p.goto('http://127.0.0.1:3000/',{waitUntil:'load'});await sleep(2500);const tag=`${w}x${h}`;const r={taille:tag,fenetres:{}};
 async function check(name){await sleep(450);await p.evaluate(()=>{window.__rfh=[]});/* 60.1 : attendre que la fenêtre ait fini de s’ouvrir (position stable sur 3 mesures) ; avant, une mesure pendant l’animation donnait un faux « hors écran » intermittent en 844×390 */await p.waitForFunction(()=>{const d=document.querySelector('.rf-dialog-panel');if(!d)return false;const r=d.getBoundingClientRect(),k=[r.top,r.bottom,document.getElementById('rf-dialog-content').getBoundingClientRect().bottom].join();window.__rfh=(window.__rfh||[]).concat(k).slice(-3);return window.__rfh.length===3&&window.__rfh.every(x=>x===k)},{polling:100,timeout:5000}).catch(()=>{});const c=await p.evaluate(()=>{const d=document.getElementById('rf-dialog');const hd=d.querySelector('.rf-dialog-panel').getBoundingClientRect(),ct=document.getElementById('rf-dialog-content').getBoundingClientRect();
   return{visible:!d.hidden&&getComputedStyle(d).display!=='none',titre:document.getElementById('rf-dialog-title').textContent,focusFermer:document.activeElement.id==='rf-close',
   mesure:{haut:Math.round(hd.top),bas:Math.round(ct.bottom),h:innerHeight},dansEcran:hd.top>=-1&&hd.left>=-1&&hd.right<=innerWidth+1&&ct.bottom<=innerHeight+1&&ct.right<=innerWidth+1,debordX:document.getElementById('rf-dialog-content').scrollWidth>document.getElementById('rf-dialog-content').clientWidth+1,
   fondInerte:[...document.querySelectorAll('body > *:not(#rf-dialog):not(script):not(style)')].every(e=>e.inert),role:d.getAttribute('role'),modal:d.getAttribute('aria-modal'),label:!!document.getElementById(d.getAttribute('aria-labelledby'))?.textContent}});
  await p.screenshot({path:path.join(out,`${tag}-${name}.png`)});
  // piège du focus : 40 tabulations restent dans la fenêtre
  let sorti=false;for(let i=0;i<40;i++){await p.keyboard.press('Tab');if(!await p.evaluate(()=>document.getElementById('rf-dialog').contains(document.activeElement))){sorti=true;break}}
  await p.keyboard.down('Shift');for(let i=0;i<5;i++){await p.keyboard.press('Tab');if(!await p.evaluate(()=>document.getElementById('rf-dialog').contains(document.activeElement)))sorti=true}await p.keyboard.up('Shift');
  c.pieceFocus=!sorti;await p.keyboard.press('Escape');await sleep(200);
  Object.assign(c,await p.evaluate(()=>({fermeParEchap:document.getElementById('rf-dialog').hidden,fondRestaure:![...document.querySelectorAll('body > *')].some(e=>e.inert&&e.dataset.rfInert),focusRendu:document.activeElement.tagName+(document.activeElement.id?'#'+document.activeElement.id:'')+' '+(document.activeElement.textContent||'').trim().slice(0,20)})));
  r.fenetres[name]=c;}
 for(const n of ['Paramètres','Musiques']){await p.evaluate(n=>{const b=[...document.querySelectorAll('.accueil-btn')].find(b=>b.textContent.trim()===n);b.focus();b.click()},n);await check('titre-'+n);}
 await p.evaluate(()=>{[...document.querySelectorAll('.accueil-btn')].find(b=>/Nouvelle Partie/.test(b.textContent)).click()});await sleep(800);
 await p.evaluate(()=>document.querySelector('[data-display-mode="windowed"]').click());
 await p.waitForFunction(()=>(document.getElementById('narrative')||{}).textContent?.trim().length>20,{timeout:30000});await p.waitForFunction(()=>!document.body.classList.contains('video-playing'),{timeout:90000}).catch(()=>{});await sleep(2500);
 for(const [id,n] of [['rf-qm-settings','jeu-Paramètres'],['rf-qm-map','jeu-Parcours'],['rf-qm-codex','jeu-Codex'],['rf-qm-music','jeu-Musiques']]){
  await p.evaluate(()=>{document.getElementById('btn-landscape-menu').click()});await sleep(500);
  if(id==='rf-qm-map')await p.screenshot({path:path.join(out,`${tag}-menu-ouvert.png`)});
  await p.evaluate(id=>{const b=document.getElementById(id);b.focus();b.click()},id);await sleep(1200);await check(n);}
 r.choixApres=await p.$$eval('#choices button',b=>b.length);r.erreurs=errors;rep.push(r);
 const bad=Object.entries(r.fenetres).filter(([k,v])=>!(v.visible&&v.focusFermer&&v.dansEcran&&!v.debordX&&v.fondInerte&&v.pieceFocus&&v.fermeParEchap&&v.fondRestaure)).map(([k,v])=>k+':'+JSON.stringify(v));
 if(bad.length||errors.length)global.__ko=(global.__ko||0)+1;
 console.log(tag,'erreurs:',errors.length,'fenêtres KO:',bad.length?bad.join(' | '):'0','choix:',r.choixApres);await ctx.close();}
}finally{await browser.close();srv.kill()}fs.writeFileSync(path.join(out,'rapport.json'),JSON.stringify(rep,null,1));process.exit(global.__ko?1:0);})(); // 60.1 : une fenêtre KO fait échouer le script (avant : code 0 malgré le KO)
