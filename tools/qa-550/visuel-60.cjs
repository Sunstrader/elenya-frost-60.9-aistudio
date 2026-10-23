// Passe visuelle 60 (Playwright, Chrome du système) : jauge du givre, coût ❄ avant le clic, bouton de reprise.
const { chromium } = require('/workspace/elenya-remaster/pw/node_modules/playwright-core');
const { spawn } = require('child_process'), fs = require('fs'), path = require('path');
const root = process.argv[2], cap = process.argv[3] || 'captures-60/visuel'; fs.mkdirSync(cap, { recursive: true });
const sleep = ms => new Promise(r => setTimeout(r, ms));
const base = { gameMode: 'classic', flags: ['avec_ombre', '_fen_introduced', '_surcharge_sursis_vu'], gauges: { instabilite: 44, possession: 0, lien_O: 3 }, achievements: [], globalFlags: [], returnStack: [] };
const tailles = [[390, 844, true], [1280, 800, false]];
(async () => {
  const srv = spawn('node', ['server.js'], { cwd: root, stdio: 'ignore' }); await sleep(2500);
  const browser = await chromium.launch({ executablePath: '/usr/bin/google-chrome', args: ['--no-sandbox'] }); const out = [];
  async function page(w, h, mobile, setup) {
    const ctx = await browser.newContext({ viewport: { width: w, height: h }, isMobile: mobile, hasTouch: mobile }); const p = await ctx.newPage(); const errs = [];
    p.on('pageerror', e => errs.push(String(e.message).slice(0, 200))); p.on('dialog', d => d.accept());
    await p.goto('http://127.0.0.1:3000/'); await p.evaluate(setup); await p.reload(); await sleep(2000);
    await p.evaluate(() => { const b = [...document.querySelectorAll('button')].find(b => /Plus tard/.test(b.textContent)); if (b) b.click(); });
    await p.evaluate(() => { const b = document.getElementById('btn-continue-classic'); if (b) b.click(); });
    await p.waitForFunction(() => (document.getElementById('narrative') || {}).textContent?.trim().length > 20, null, { timeout: 30000 }).catch(() => {}); await sleep(2500);
    await p.evaluate(() => { const b = [...document.querySelectorAll('button')].find(b => /Plus tard/.test(b.textContent)); if (b) b.click(); });
    return { p, ctx, errs };
  }
  const box = (p, sel) => p.evaluate(s => { const e = document.querySelector(s); if (!e) return null; const r = e.getBoundingClientRect(); return { x: r.x, y: r.y, w: r.width, h: r.height, vis: getComputedStyle(e).display !== 'none' && r.width > 0 }; }, sel);
  const chevauche = (a, b) => a && b && a.x < b.x + b.w && b.x < a.x + a.w && a.y < b.y + b.h && b.y < a.y + a.h;
  try {
    for (const [w, h, m] of tailles) {
      const r = { taille: w + 'x' + h };
      // 1. Jauge + coût ❄ sur ABSORBER_FILON
      const s1 = Object.assign({}, base, { currentSceneId: 'ACTE2_14_VALVE_INTERMEDIAIRE' });
      let { p, ctx, errs } = await page(w, h, m, new Function(`localStorage.clear();localStorage.setItem('elenya_state',${JSON.stringify(JSON.stringify(s1))});`));
      await p.evaluate(() => { const c = document.getElementById('choices'); if (c) c.scrollIntoView({ block: 'end' }); }); await sleep(800);
      r.jauge = await box(p, '#givre-jauge'); r.cout = await p.evaluate(() => [...document.querySelectorAll('#choices .givre-cout')].map(e => e.textContent));
      const choix = await p.evaluate(() => [...document.querySelectorAll('#choices button')].map(b => { const q = b.getBoundingClientRect(); return { x: q.x, y: q.y, w: q.width, h: q.height }; }));
      r.jaugeChevaucheChoix = choix.some(c => chevauche(r.jauge, c));
      await p.screenshot({ path: path.join(cap, `jauge-cout-${w}x${h}.png`) }); r.erreurs1 = errs; await ctx.close();
      // 2. Game over → reprise → l’agonie (deux choix, dont un qui survit)
      const avant = Object.assign({}, base, { currentSceneId: 'AGONIE_SURCHARGE', flags: base.flags.concat(['_surcharge_sursis2_vu']), gauges: { instabilite: 58 } });
      const mort = Object.assign({}, avant, { currentSceneId: 'GAME_OVER_SURCHARGE' });
      ({ p, ctx, errs } = await page(w, h, m, new Function(`localStorage.clear();localStorage.setItem('elenya_state',${JSON.stringify(JSON.stringify(mort))});localStorage.setItem('elenya_avant_chute',${JSON.stringify(JSON.stringify(avant))});`)));
      await p.waitForSelector('#btn-reprendre-chute', { timeout: 30000 }).catch(() => {});
      await p.evaluate(() => { const b = document.getElementById('btn-reprendre-chute'); if (b) b.scrollIntoView({ block: 'center' }); }); await sleep(800);
      r.bouton = await box(p, '#btn-reprendre-chute');
      r.boutonDansLEcran = !!r.bouton && r.bouton.y >= 0 && r.bouton.y + r.bouton.h <= h;
      await p.screenshot({ path: path.join(cap, `game-over-${w}x${h}.png`) });
      if (r.bouton) { await p.click('#btn-reprendre-chute', { timeout: 120000 }).then(() => r.clicReel = true).catch(async () => { r.clicReel = false; await p.evaluate(() => document.getElementById('btn-reprendre-chute').click()); }); await sleep(3000);
        r.apresReprise = await p.evaluate(() => ({ scene: (JSON.parse(localStorage.getItem('elenya_state') || '{}')).currentSceneId, choix: [...document.querySelectorAll('#choices button')].map(b => b.textContent.trim().slice(0, 40)) }));
        await p.screenshot({ path: path.join(cap, `apres-reprise-${w}x${h}.png`) }); }
      r.erreurs2 = errs; await ctx.close(); out.push(r);
    }
  } finally { await browser.close(); srv.kill(); }
  console.log(JSON.stringify(out, null, 1));
})();
