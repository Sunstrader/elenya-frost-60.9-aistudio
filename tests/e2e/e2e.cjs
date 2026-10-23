// E2E : captures + erreurs console sur la matrice d'écrans. Usage : node e2e.cjs <racine_projet> <dossier_sortie>
const puppeteer=require('puppeteer-core'),{spawn}=require('child_process'),fs=require('fs'),path=require('path');
const [root,out]=process.argv.slice(2);fs.mkdirSync(out,{recursive:true});
const sizes=process.env.SIZES?JSON.parse(process.env.SIZES):[[360,640],[390,844],[412,915],[844,390],[768,1024],[1024,768],[1280,720],[1920,1080],[2560,1080],[3840,2160]];
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
(async()=>{
  const srv=spawn('node',['server.js'],{cwd:root,stdio:'ignore'});await sleep(2500);
  const browser=await puppeteer.launch({executablePath:process.env.CHROME_PATH||'/usr/bin/google-chrome',headless:'new',args:['--no-sandbox','--autoplay-policy=no-user-gesture-required']});
  const report=[];
  try{for(const [w,h] of sizes){
    const page=await browser.newPage();const mobile=w<900;
    await page.setViewport({width:w,height:h,isMobile:mobile,hasTouch:mobile,deviceScaleFactor:1});
    const errors=[];page.on('console',m=>{if(m.type()==='error')errors.push(m.text().slice(0,200))});page.on('pageerror',e=>errors.push('PAGEERROR '+String(e.message).slice(0,200)));
    page.on('dialog',d=>d.accept());page.on('response',x=>{if(x.status()>=400)errors.push('HTTP '+x.status()+' '+x.url().slice(0,160))});
    const t0=Date.now();await page.goto('http://127.0.0.1:3000/',{waitUntil:'load',timeout:60000});const loadMs=Date.now()-t0;
    await sleep(3000);const tag=`${w}x${h}`;
    await page.screenshot({path:path.join(out,`${tag}-1-titre.png`)});
    const r={taille:tag,chargementMs:loadMs};
    try{
      await page.evaluate(()=>{[...document.querySelectorAll('.accueil-btn')].find(b=>/Nouvelle Partie/.test(b.textContent)).click()});await sleep(800);
      await page.screenshot({path:path.join(out,`${tag}-2-lancement.png`)});
      await page.evaluate(()=>document.querySelector('[data-display-mode="windowed"]').click());
      await page.waitForFunction(()=>(document.getElementById('narrative')||{}).textContent?.trim().length>20,{timeout:30000});
      await page.waitForFunction(()=>!document.body.classList.contains('video-playing'),{timeout:90000}).catch(()=>{});await sleep(2500);
      await page.screenshot({path:path.join(out,`${tag}-3-recit.png`)});
      r.choix=await page.$$eval('#choices button',b=>b.length);
      const vis=await page.evaluate(()=>{const v=s=>{const e=document.querySelector(s);if(!e)return null;const c=getComputedStyle(e);return c.display!=='none'&&c.visibility!=='hidden'&&e.getBoundingClientRect().width>0};return{dock:v('.game-control-dock'),footer:v('.footer'),btnMenu:v('#btn-landscape-menu'),menus:document.querySelectorAll('#btn-landscape-menu').length,debordementX:document.documentElement.scrollWidth>innerWidth+1}});
      Object.assign(r,vis);
      await page.evaluate(()=>document.getElementById('btn-landscape-menu')?.click());await sleep(1000);
      await page.screenshot({path:path.join(out,`${tag}-4-menu.png`)});
    }catch(e){r.echec=String(e.message).slice(0,200)}
    r.erreursConsole=errors;report.push(r);await page.close();
    console.log(JSON.stringify(r));
  }}finally{await browser.close();srv.kill()}
  fs.writeFileSync(path.join(out,'rapport.json'),JSON.stringify(report,null,1));
})();
