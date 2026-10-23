// E2E navigateur : reprise d'une sauvegarde 52.5.4, stockage plein, état corrompu.
const puppeteer=require('puppeteer-core'),{spawn}=require('child_process'),fs=require('fs'),path=require('path');
const root=process.argv[2];const sleep=ms=>new Promise(r=>setTimeout(r,ms));
const fx=JSON.parse(fs.readFileSync(path.join(root,'tests/fixtures/sauvegardes-52.5.4.json'))).sauvegardes;
const pick=fx.find(s=>s.state.gameMode==='classic'&&/ACTE3/.test(s.attendu.scene)&&!s.attendu.fin)||fx[5];
(async()=>{
  const srv=spawn('node',['server.js'],{cwd:root,stdio:'ignore'});await sleep(2500);
  const browser=await puppeteer.launch({executablePath:process.env.CHROME_PATH||'/usr/bin/google-chrome',headless:'new',args:['--no-sandbox']});
  const out={};
  async function fresh(setup){const p=await browser.newPage();await p.setViewport({width:390,height:844,isMobile:true,hasTouch:true});
    const errs=[];p.on('pageerror',e=>errs.push(String(e.stack||e.message).slice(0,500)));p.on('dialog',d=>d.accept());
    await p.goto('http://127.0.0.1:3000/',{waitUntil:'load'});await p.evaluate(setup);await p.reload({waitUntil:'load'});await sleep(2500);return {p,errs}}
  try{
    // 1. Reprise d'une sauvegarde 52.5.4
    let {p,errs}=await fresh(new Function(`localStorage.clear();const s=${JSON.stringify(pick.state)};localStorage.setItem('elenya_state',JSON.stringify(s));`));
    out.repriseBoutonVisible=await p.evaluate(()=>{const b=document.getElementById('btn-continue-classic');return !!b&&getComputedStyle(b).display!=='none'});
    await p.evaluate(()=>document.getElementById('btn-continue-classic').click());
    await p.waitForFunction(()=>(document.getElementById('narrative')||{}).textContent?.trim().length>20,{timeout:30000}).catch(()=>{});await sleep(2000);
    out.sceneAttendue=pick.attendu.scene;out.sceneObtenue=await p.evaluate(()=>{try{return JSON.parse(localStorage.getItem('elenya_state')).currentSceneId}catch(e){return null}});
    out.choixAffiches=await p.$$eval('#choices button',b=>b.length);out.erreurs1=errs;await p.close();
    // 2. Stockage plein
    ({p,errs}=await fresh(()=>{localStorage.clear()}));
    await p.evaluate(()=>{Storage.prototype.setItem=function(){const e=new Error('QuotaExceededError');e.name='QuotaExceededError';throw e}});
    await p.evaluate(()=>{[...document.querySelectorAll('.accueil-btn')].find(b=>/Nouvelle Partie/.test(b.textContent)).click()});await sleep(500);
    await p.evaluate(()=>document.querySelector('[data-display-mode="windowed"]').click());
    await p.waitForFunction(()=>(document.getElementById('narrative')||{}).textContent?.trim().length>20,{timeout:30000}).catch(()=>{});await sleep(1500);
    out.stockagePlein={texteAffiche:await p.evaluate(()=>(document.getElementById('narrative')||{}).textContent.trim().length>20),avis:await p.evaluate(()=>!!document.querySelector('[role=alert]')&&document.querySelector('[role=alert]').textContent.slice(0,60)),erreurs:errs};
    await p.close();
    // 3. État principal corrompu, copie de secours présente
    ({p,errs}=await fresh(new Function(`localStorage.clear();const s=${JSON.stringify(pick.state)};s.gameMode='classic';localStorage.setItem('elenya_state','{corrompu');localStorage.setItem('elenya_classic_state','{corrompu');localStorage.setItem('elenya_classic_state_backup',JSON.stringify(s));`)));
    out.corrompu={repriseVisible:await p.evaluate(()=>{const b=document.getElementById('btn-continue-classic');return !!b&&getComputedStyle(b).display!=='none'}),journal:await p.evaluate(()=>localStorage.getItem('ef_error_log')),erreurs:errs};
    await p.close();
  }finally{await browser.close();srv.kill()}
  console.log(JSON.stringify(out,null,1));
})();
