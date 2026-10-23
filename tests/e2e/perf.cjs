const puppeteer=require('puppeteer-core'),{spawn}=require('child_process');const sleep=ms=>new Promise(r=>setTimeout(r,ms));
(async()=>{const srv=spawn('node',['server.js'],{cwd:process.argv[2],stdio:'ignore'});await sleep(2500);
const b=await puppeteer.launch({executablePath:process.env.CHROME_PATH||'/usr/bin/google-chrome',headless:'new',args:['--no-sandbox']});const p=await b.newPage();await p.setViewport({width:390,height:844,isMobile:true,hasTouch:true});
const c=await p.createCDPSession();await c.send('Network.enable');const by={};const types={};c.on('Network.responseReceived',e=>types[e.requestId]=e.type);c.on('Network.loadingFinished',e=>{const t=types[e.requestId]||'Other';by[t]=(by[t]||0)+e.encodedDataLength});
await c.send('Network.emulateNetworkConditions',{offline:false,latency:150,downloadThroughput:1.6e6/8*8/8*4,uploadThroughput:750e3/8});
const t0=Date.now();await p.goto('http://127.0.0.1:3000/',{waitUntil:'load'});const load=Date.now()-t0;
await p.waitForFunction(()=>{const l=document.getElementById('startup-loader');return !l||l.classList.contains('hidden')},{timeout:20000}).catch(()=>{});const menu=Date.now()-t0;await sleep(4000);
const m=await p.metrics();console.log(JSON.stringify({chargementMs:load,menuVisibleMs:menu,octetsParType:by,totalHorsImagesVideo:Object.entries(by).filter(([k])=>!['Image','Media'].includes(k)).reduce((a,[,v])=>a+v,0),jsHeapMo:(m.JSHeapUsedSize/1e6).toFixed(1)}));
await b.close();srv.kill()})();
