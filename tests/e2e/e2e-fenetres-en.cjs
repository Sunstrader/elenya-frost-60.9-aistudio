// QA 53.3.0 lot 11 : fenêtres en anglais (ef_ui_lang=en). Usage : node e2e-fenetres-en.cjs <racine> <sortie>
const puppeteer=require('puppeteer-core'),{spawn}=require('child_process'),path=require('path');const [root,out]=process.argv.slice(2);const sleep=ms=>new Promise(r=>setTimeout(r,ms));
(async()=>{const srv=spawn('node',['server.js'],{cwd:root,stdio:'ignore'});await sleep(2500);const b=await puppeteer.launch({executablePath:process.env.CHROME_PATH||'/usr/bin/google-chrome',headless:'new',args:['--no-sandbox']});
try{const p=await b.newPage();await p.setViewport({width:1280,height:720});const errs=[];p.on('pageerror',e=>errs.push(e.message));p.on('console',m=>{if(m.type()==='error')errs.push(m.text())});p.on('dialog',d=>d.accept());
await p.evaluateOnNewDocument(()=>localStorage.setItem('ef_ui_lang','en'));await p.goto('http://127.0.0.1:3000/',{waitUntil:'load'});await sleep(2500);
const R={boutons:await p.evaluate(()=>[...document.querySelectorAll('.accueil-btn')].map(b=>b.textContent.trim()))};
await p.evaluate(()=>[...document.querySelectorAll('.accueil-btn')].find(b=>b.textContent.trim()==='Settings').click());await sleep(500);
R.settings=await p.evaluate(()=>({titre:document.getElementById('rf-dialog-title').textContent,fermer:document.getElementById('rf-close').textContent,h3:[...document.querySelectorAll('#rf-dialog-content h3')].map(h=>h.textContent)}));
await p.screenshot({path:path.join(out,'1280x720-en-settings.png')});await p.keyboard.press('Escape');
await p.evaluate(()=>[...document.querySelectorAll('.accueil-btn')].find(b=>b.textContent.trim()==='Music').click());await sleep(500);
R.music=await p.evaluate(()=>({titre:document.getElementById('rf-dialog-title').textContent,premier:document.querySelector('.rf-track span')?.textContent}));R.erreurs=errs;console.log(JSON.stringify(R));
}finally{await b.close();srv.kill()}})();
