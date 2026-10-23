// 60.2 (point 7) : Chrome réel, PC (1280×800) et mobile (390×844). EXÉCUTÉ, pas statique : clics réels.
// Nouvelle partie → 8 choix cliqués → menu → sauvegarde → fermeture/réouverture → reprise même scène → écran de fin (état de route réelle).
// Contrôles : aucun cadre bleu visible (bordure/contour à dominante bleue), aucune voix (speechSynthesis espionné, aucun audio de voix).
const { chromium } = require('playwright-core');
const { spawn } = require('child_process'), fs = require('fs'), path = require('path');
const root = process.argv[2], cap = process.argv[3] || '../captures-e2e/visuel-602'; fs.mkdirSync(cap, { recursive: true });
const sleep = ms => new Promise(r => setTimeout(r, ms));
const { engine, clone } = require(path.join(path.resolve(root), 'tests/lib.cjs')); const { api } = engine();
function etatFin(nom) { const rec = require(path.join(path.resolve(root), 'tests/fixtures/routes-fins-60.8.0.json'))[nom]; let s = { gameMode: 'classic' };
  for (const [, k] of rec.parcours.slice(0, -1)) { s = api.serverGetPendingScene(clone(s)).renderedState; s = api.serverProcessChoice(clone(s), k).updatedState; } return api.serverGetPendingScene(clone(s)).renderedState; }
const ESPION = () => { window.__voix = 0; try { const o = window.speechSynthesis; if (o) o.speak = () => { window.__voix++; }; } catch (e) {} };
const CONTROLE = () => { const bleus = []; for (const el of document.querySelectorAll('body *')) { const r = el.getBoundingClientRect(); if (r.width < 8 || r.height < 8) continue; const cs = getComputedStyle(el); if (cs.visibility === 'hidden' || cs.display === 'none' || +cs.opacity === 0) continue;
    for (const [w, c] of [[cs.borderTopWidth, cs.borderTopColor], [cs.outlineWidth, cs.outlineColor]]) { if (parseFloat(w) < 1) continue; const m = /rgba?\((\d+), (\d+), (\d+)(?:, ([\d.]+))?/.exec(c); if (!m) continue; const [R, G, B, A] = [+m[1], +m[2], +m[3], m[4] === undefined ? 1 : +m[4]];
      if (A > 0.5 && B > 150 && B > R + 70 && B > G + 20) bleus.push((el.id || el.className || el.tagName).toString().slice(0, 40) + ' ' + c); } }
  const audiosVoix = [...document.querySelectorAll('audio')].filter(a => /voix|voice|narrat|tts/i.test(a.currentSrc || a.src || '')).length;
  return { bleus: [...new Set(bleus)].slice(0, 10), voix: window.__voix || 0, audiosVoix }; };
(async () => {
  const srv = spawn('node', ['server.js'], { cwd: root, stdio: 'ignore', env: Object.assign({}, process.env, { PORT: '', HOST: '127.0.0.1' }) }); await sleep(2500);
  const browser = await chromium.launch({ executablePath: process.env.CHROME_PATH || '/usr/bin/google-chrome', args: ['--no-sandbox'] });
  const R = {}, errs = [];
  const page = async (ctx, w, h) => { const p = await ctx.newPage(); await p.addInitScript(ESPION); p.on('pageerror', e => errs.push(w + 'x' + h + ' ' + String(e.message).slice(0, 160))); p.on('dialog', d => d.accept()); return p; };
  const attendreTexte = p => p.waitForFunction(() => (document.getElementById('narrative') || {}).textContent?.trim().length > 20 && !document.body.classList.contains('video-playing'), null, { timeout: 60000 }).catch(() => {});
  const plusTard = p => p.evaluate(() => { const b = [...document.querySelectorAll('button')].find(b => /Plus tard/.test(b.textContent)); if (b) b.click(); });
  try {
    for (const [w, h, m] of [[1280, 800, false], [390, 844, true]]) {
      const tag = w + 'x' + h, r = R[tag] = { choixCliques: 0, scenes: [] };
      const ctx = await browser.newContext({ viewport: { width: w, height: h }, isMobile: m, hasTouch: m }); let p = await page(ctx, w, h);
      await p.goto('http://127.0.0.1:3000/'); await p.evaluate(() => localStorage.clear()); await p.reload(); await sleep(2500);
      await p.evaluate(() => [...document.querySelectorAll('.accueil-btn')].find(b => b.textContent.trim() === 'Nouvelle Partie').click()); await sleep(800);
      await p.evaluate(() => document.querySelector('[data-display-mode="windowed"]').click()); await attendreTexte(p); await sleep(1500); await plusTard(p);
      await p.screenshot({ path: path.join(cap, `dialogue-${tag}.png`) });
      for (let i = 0; i < 8; i++) {
        const b = p.locator('#choices .choice-btn:visible').first(); if (!(await b.count())) { await sleep(1500); continue; }
        const avant = await p.evaluate(() => JSON.parse(localStorage.getItem('elenya_state') || '{}').currentSceneId || '');
        await b.click({ timeout: 10000 }).catch(() => {}); r.choixCliques++;
        await p.waitForFunction(a => (JSON.parse(localStorage.getItem('elenya_state') || '{}').currentSceneId || '') !== a, avant, { timeout: 20000 }).catch(() => {});
        await attendreTexte(p); await sleep(1200); await plusTard(p); r.scenes.push(await p.evaluate(() => JSON.parse(localStorage.getItem('elenya_state') || '{}').currentSceneId));
        if (i === 3) await p.screenshot({ path: path.join(cap, `choix-${tag}.png`) });
      }
      r.styleEnJeu = await p.evaluate(CONTROLE);
      // Menu
      const menu = await p.evaluate(() => { const b = document.getElementById('btn-landscape-menu') || document.getElementById('btn-game-menu'); if (!b) return false; b.click(); return true; }); await sleep(700);
      r.menu = menu && await p.evaluate(() => !!document.querySelector('#rf-qm-codex, #rf-qm-settings'));
      await p.screenshot({ path: path.join(cap, `menu-${tag}.png`) }); r.styleMenu = await p.evaluate(CONTROLE);
      await p.keyboard.press('Escape'); await sleep(400);
      // Sauvegarde → fermeture → réouverture
      await p.evaluate(() => { const b = document.getElementById('btn-game-save'); if (b) b.click(); }); await sleep(1200);
      const scene = await p.evaluate(() => JSON.parse(localStorage.getItem('elenya_state') || '{}').currentSceneId); await p.close();
      p = await page(ctx, w, h); await p.goto('http://127.0.0.1:3000/'); await sleep(2500);
      await p.evaluate(() => { const b = document.getElementById('btn-continue-classic'); if (b) b.click(); }); await attendreTexte(p); await sleep(1500); await plusTard(p);
      const repris = await p.evaluate(() => JSON.parse(localStorage.getItem('elenya_state') || '{}').currentSceneId);
      r.sauvegarde = { scene, repris, ok: !!scene && scene === repris && r.choixCliques >= 8 };
      await p.screenshot({ path: path.join(cap, `reprise-${tag}.png`) }); await p.close();
      // Écran de fin depuis l'état réel d'une route (FIN_OMBRE), juste avant la fin
      p = await page(ctx, w, h); await p.goto('http://127.0.0.1:3000/'); await p.evaluate(s => { localStorage.clear(); localStorage.setItem('elenya_state', s); }, JSON.stringify(etatFin('FIN_OMBRE'))); await p.reload(); await sleep(2500);
      await p.evaluate(() => { const b = document.getElementById('btn-continue-classic'); if (b) b.click(); }); await attendreTexte(p); await sleep(1500); await plusTard(p);
      const fb = p.locator('#choices .choice-btn:visible', { hasText: '' }); const cle = await p.evaluate(() => [...document.querySelectorAll('#choices .choice-btn')].length);
      await p.evaluate(() => { const b = [...document.querySelectorAll('#choices .choice-btn')].find(b => /Kaelen|ombre/i.test(b.textContent)) || document.querySelector('#choices .choice-btn'); if (b) b.click(); });
      await p.waitForFunction(() => /^FIN_/.test(JSON.parse(localStorage.getItem('elenya_state') || '{}').currentSceneId || ''), null, { timeout: 30000 }).catch(() => {});
      await sleep(4000); await p.waitForFunction(() => !document.body.classList.contains('video-playing'), null, { timeout: 90000 }).catch(() => {}); await sleep(1500);
      r.fin = { scene: await p.evaluate(() => JSON.parse(localStorage.getItem('elenya_state') || '{}').currentSceneId), choixAuTrone: cle };
      r.fin.ok = /^FIN_/.test(r.fin.scene || ''); r.styleFin = await p.evaluate(CONTROLE);
      await p.screenshot({ path: path.join(cap, `fin-${tag}.png`) }); await ctx.close();
      r.ok = r.choixCliques >= 8 && r.menu && r.sauvegarde.ok && r.fin.ok && [r.styleEnJeu, r.styleMenu, r.styleFin].every(s => !s.bleus.length && !s.voix && !s.audiosVoix);
    }
  } finally { await browser.close(); srv.kill(); }
  const ko = Object.entries(R).filter(([, v]) => !v.ok).map(([k]) => k);
  fs.writeFileSync(path.join(cap, 'bilan-visuel-602.json'), JSON.stringify({ R, errs, ko }, null, 1));
  console.log(JSON.stringify({ R, errs, ko }, null, 1)); console.log('KO : ' + (ko.join(', ') || 'aucun') + ' ; erreurs page : ' + errs.length);
  process.exit(ko.length || errs.length ? 1 : 0);
})().catch(e => { console.error(e); process.exit(1); });
