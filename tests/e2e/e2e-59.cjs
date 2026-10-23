// E2E 59 : jauge du givre visible et bouton « Reprendre avant la chute » après un game over.
const puppeteer=require('puppeteer-core'),{spawn}=require('child_process'),fs=require('fs'),path=require('path');
const root=process.argv[2],cap=process.argv[3]||'captures-59/e2e59';fs.mkdirSync(cap,{recursive:true});const sleep=ms=>new Promise(r=>setTimeout(r,ms));
const base={gameMode:'classic',flags:['avec_ombre','_fen_introduced'],gauges:{instabilite:44,possession:0,lien_O:3},achievements:[],globalFlags:[],returnStack:[]};
(async()=>{
  const srv=spawn('node',['server.js'],{cwd:root,stdio:'ignore'});await sleep(2500);
  const browser=await puppeteer.launch({executablePath:process.env.CHROME_PATH||'/usr/bin/google-chrome',headless:'new',args:['--no-sandbox']});const out={};
  async function fresh(setup){const p=await browser.newPage();await p.setViewport({width:1280,height:800});const errs=[];p.on('pageerror',e=>errs.push(String(e.message).slice(0,300)));p.on('dialog',d=>d.accept());
    await p.goto('http://127.0.0.1:3000/',{waitUntil:'load'});await p.evaluate(setup);await p.reload({waitUntil:'load'});await sleep(2500);return {p,errs}}
  try{
    const s1=Object.assign({},base,{currentSceneId:'ACTE3_08_MISE_AU_POINT'});
    let {p,errs}=await fresh(new Function(`localStorage.clear();localStorage.setItem('elenya_state',${JSON.stringify(JSON.stringify(s1))});`));
    await p.evaluate(()=>document.getElementById('btn-continue-classic')&&document.getElementById('btn-continue-classic').click());
    await p.waitForFunction(()=>(document.getElementById('narrative')||{}).textContent?.trim().length>20,{timeout:30000}).catch(()=>{});await sleep(1500);
    out.jauge=await p.evaluate(()=>{const g=document.getElementById('givre-jauge');return g?{visible:getComputedStyle(g).display!=='none'&&g.offsetWidth>0,texte:g.textContent.trim().slice(0,60)}:null});
    await p.screenshot({path:path.join(cap,'jauge-givre.png')});out.erreurs1=errs;await p.close();
    const avant=Object.assign({},base,{currentSceneId:'ACTE3_08_MISE_AU_POINT'});const go=Object.assign({},base,{currentSceneId:'GAME_OVER_SURCHARGE'});
    ({p,errs}=await fresh(new Function(`localStorage.clear();localStorage.setItem('elenya_state',${JSON.stringify(JSON.stringify(go))});localStorage.setItem('elenya_avant_chute',${JSON.stringify(JSON.stringify(avant))});`)));
    await p.evaluate(()=>document.getElementById('btn-continue-classic')&&document.getElementById('btn-continue-classic').click());
    await p.waitForFunction(()=>!!document.getElementById('btn-reprendre-chute'),{timeout:30000}).catch(()=>{});await sleep(1000);
    out.boutonReprise=await p.evaluate(()=>{const b=document.getElementById('btn-reprendre-chute');return b?{visible:b.offsetWidth>0,texte:b.textContent.trim()}:null});
    await p.screenshot({path:path.join(cap,'game-over-reprise.png')});
    if(out.boutonReprise){await p.evaluate(()=>document.getElementById('btn-reprendre-chute').click());await sleep(3000);
      out.apresReprise=await p.evaluate(()=>{try{return JSON.parse(localStorage.getItem('elenya_state')).currentSceneId}catch(e){return null}});}
    out.erreurs2=errs;await p.close();
  }finally{await browser.close();srv.kill()}
  console.log(JSON.stringify(out,null,1));
})();
