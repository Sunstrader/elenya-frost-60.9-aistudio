// 60.1 : preuves visuelles (Playwright, Chrome du système). Usage : node visuel-601.cjs <racine> <dossier_captures>
// 1) fenêtre Musiques en 844×390 (titre dans l’écran, après l’animation) ; 2) Codex en jeu (entrées visibles, Kalthar présent) ;
// 3) image d’ENTREE_SANCTUAIRE réellement chargée (ressource reçue + affichée) ; 4) fenêtre de lancement (plein écran ou fenêtré) ;
// 5) sauvegarde → fermeture de la page → réouverture → même scène. Sortie 1 si une preuve manque.
const { chromium } = require('playwright-core');
const { spawn } = require('child_process'), fs = require('fs'), path = require('path');
const root = process.argv[2], cap = process.argv[3] || '../captures-e2e/visuel-601'; fs.mkdirSync(cap, { recursive: true });
const sleep = ms => new Promise(r => setTimeout(r, ms));
const etat = id => ({ gameMode: 'classic', currentSceneId: id, flags: ['avec_ombre', '_fen_introduced', 'oraya_rencontree'], gauges: { lien_O: 3, memoire_kalthar: 4 }, achievements: [], globalFlags: [], returnStack: [] });
(async () => {
  const srv = spawn('node', ['server.js'], { cwd: root, stdio: 'ignore', env: Object.assign({}, process.env, { PORT: '', HOST: '127.0.0.1' }) }); await sleep(2500);
  const browser = await chromium.launch({ executablePath: process.env.CHROME_PATH || '/usr/bin/google-chrome', args: ['--no-sandbox'] });
  const R = {}, errs = [];
  const stable = p => p.waitForFunction(() => { const d = document.querySelector('.rf-dialog-panel'); if (!d) return false; const k = String(Math.round(d.getBoundingClientRect().top)); window.__st = (window.__st || []).concat(k).slice(-3); return window.__st.length === 3 && window.__st.every(x => x === k); }, null, { polling: 100, timeout: 5000 }).catch(() => {});
  async function ouvrir(w, h, mobile, state) {
    const ctx = await browser.newContext({ viewport: { width: w, height: h }, isMobile: mobile, hasTouch: mobile }); const p = await ctx.newPage();
    p.on('pageerror', e => errs.push(w + 'x' + h + ' ' + String(e.message).slice(0, 160))); p.on('dialog', d => d.accept());
    await p.goto('http://127.0.0.1:3000/'); if (state) { await p.evaluate(s => { localStorage.clear(); localStorage.setItem('elenya_state', s); }, JSON.stringify(state)); await p.reload(); }
    await sleep(2200); return { ctx, p };
  }
  const continuer = async p => { await p.evaluate(() => { const b = document.getElementById('btn-continue-classic'); if (b) b.click(); });
    await p.waitForFunction(() => (document.getElementById('narrative') || {}).textContent?.trim().length > 20, null, { timeout: 30000 }).catch(() => {});
    await p.waitForFunction(() => !document.body.classList.contains('video-playing'), null, { timeout: 60000 }).catch(() => {}); await sleep(2000);
    await p.evaluate(() => { const b = [...document.querySelectorAll('button')].find(b => /Plus tard/.test(b.textContent)); if (b) b.click(); }); };
  try {
    // 1. Musiques 844×390 depuis l’accueil
    { const { ctx, p } = await ouvrir(844, 390, true);
      await p.evaluate(() => [...document.querySelectorAll('.accueil-btn')].find(b => b.textContent.trim() === 'Musiques').click()); await sleep(300); await stable(p);
      R.musiques = await p.evaluate(() => { const t = document.getElementById('rf-dialog-title').getBoundingClientRect(); return { titre: document.getElementById('rf-dialog-title').textContent, haut: Math.round(t.top), bas: Math.round(t.bottom), h: innerHeight }; });
      R.musiques.ok = R.musiques.haut >= 0 && R.musiques.bas <= R.musiques.h && /Musiques/.test(R.musiques.titre);
      await p.screenshot({ path: path.join(cap, 'musiques-844x390.png') }); await ctx.close(); }
    // 2. Codex en jeu, 1280×720 et 390×844
    for (const [w, h, m] of [[1280, 720, false], [390, 844, true]]) { const sv = JSON.parse(fs.readFileSync(path.join(root, 'tests/fixtures/sauvegardes-60.1.0.json'), 'utf8')).sauvegardes.find(x => x.state.gameMode === 'classic' && (x.state.sceneHistory || []).includes('ACTE3_12_AUTEL_KALTHAR') && !x.attendu.fin);
      // Un navigateur qui a joué ces scènes garde aussi « ef_visited » (le Codex s’appuie sur ce qui a été vu ici, ou importé avec la sauvegarde).
      const { ctx, p } = await ouvrir(w, h, m, sv.state); await p.evaluate(v => localStorage.setItem('ef_visited', v), JSON.stringify(sv.state.sceneHistory || [])); await p.reload(); await sleep(2000); await continuer(p);
      await p.evaluate(() => document.getElementById('btn-landscape-menu').click()); await sleep(500);
      await p.evaluate(() => { const b = document.getElementById('rf-qm-codex'); b.focus(); b.click(); }); await sleep(400); await stable(p);
      const c = await p.evaluate(() => ({ titre: document.getElementById('rf-dialog-title').textContent, texte: document.getElementById('rf-dialog-content').textContent.slice(0, 4000) }));
      R['codex-' + w + 'x' + h] = { titre: c.titre, kalthar: /Kalthar/.test(c.texte), longueur: c.texte.length, ok: /Codex/i.test(c.titre) && /Kalthar/.test(c.texte) };
      await p.screenshot({ path: path.join(cap, `codex-${w}x${h}.png`) }); await ctx.close(); }
    // 3. Image d’ENTREE_SANCTUAIRE
    { const { ctx, p } = await ouvrir(1280, 720, false, etat('ACTE3_09_ENTREE_SANCTUAIRE')); const recu = [];
      p.on('response', r => { if (/Crat%C3%A8re_avec_village_cach/.test(r.url())) recu.push(r.status()); });
      await continuer(p);
      // Le décor d’origine (« Cratère… ») est remappé côté serveur vers le décor V54 « village » (21_Assets.js, voulu) :
      // on vérifie que l’URL envoyée est celle que le fond affiche, et que l’image est réellement décodée.
      const attendu = await p.evaluate(async () => { const r = await fetch('/api/gas/serverGetPendingScene', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ args: [JSON.parse(localStorage.getItem('elenya_state'))] }) }); const j = await r.json(); return (j.result || j).image || null; });
      const charge = await p.waitForFunction(() => { const m = /url\(["']?([^"')]+)/.exec(document.body.style.getPropertyValue('--bg-before') || ''); if (!m) return false; window.__img = window.__img || Object.assign(new Image(), { src: m[1] }); return window.__img.complete && window.__img.naturalWidth > 0 ? m[1] : false; }, null, { polling: 250, timeout: 45000 }).then(h => h.jsonValue()).catch(() => null);
      await sleep(1500);
      R.entreeSanctuaire = { scene: await p.evaluate(() => JSON.parse(localStorage.getItem('elenya_state') || '{}').currentSceneId), imageServeur: attendu, fondAffiche: charge, ok: !!charge && !!attendu && charge === attendu };
      await p.screenshot({ path: path.join(cap, 'entree-sanctuaire-1280x720.png') }); await ctx.close(); }
    // 4. Lancement : fenêtre plein écran / fenêtré
    for (const [w, h, m] of [[390, 844, true], [1280, 720, false]]) { const { ctx, p } = await ouvrir(w, h, m);
      await p.evaluate(() => { const b = [...document.querySelectorAll('.accueil-btn')].find(b => b.textContent.trim() === 'Nouvelle Partie'); b.click(); }); await sleep(900);
      const l = await p.evaluate(() => { const d = document.getElementById('launch-start-modal'); const r = d && d.getBoundingClientRect(); return { present: !!d, visible: !!d && !d.hidden && r.width > 0, titre: (document.getElementById('launch-start-title') || {}).textContent, boutons: [...document.querySelectorAll('[data-display-mode]')].map(b => b.dataset.displayMode) }; });
      await p.screenshot({ path: path.join(cap, `lancement-${w}x${h}.png`) });
      await p.evaluate(() => document.querySelector('[data-display-mode="windowed"]').click());
      await p.waitForFunction(() => (document.getElementById('narrative') || {}).textContent?.trim().length > 20, null, { timeout: 30000 }).catch(() => {});
      l.partieLancee = await p.evaluate(() => (document.getElementById('narrative') || {}).textContent.trim().length > 20);
      l.ok = l.visible && l.boutons.includes('windowed') && l.partieLancee; R['lancement-' + w + 'x' + h] = l; await ctx.close(); }
    // 5. Fermeture puis réouverture
    { const ctx = await browser.newContext({ viewport: { width: 1280, height: 720 } }); let p = await ctx.newPage(); p.on('dialog', d => d.accept());
      await p.goto('http://127.0.0.1:3000/'); await p.evaluate(s => { localStorage.clear(); localStorage.setItem('elenya_state', s); }, JSON.stringify(etat('ACTE2_08_MATIN_AUBERGE'))); await p.reload(); await sleep(2000); await continuer(p);
      const avant = await p.evaluate(() => [...document.querySelectorAll('#choices button')].map(b => b.textContent.trim()));
      await p.evaluate(() => document.querySelector('#choices button').click()); await sleep(3500);
      const scene1 = await p.evaluate(() => JSON.parse(localStorage.getItem('elenya_state') || '{}').currentSceneId);
      await p.close(); p = await ctx.newPage(); await p.goto('http://127.0.0.1:3000/'); await sleep(2200); await continuer(p);
      const scene2 = await p.evaluate(() => JSON.parse(localStorage.getItem('elenya_state') || '{}').currentSceneId);
      R.reouverture = { choixAvant: avant.length, sceneAvantFermeture: scene1, sceneApresReouverture: scene2, ok: !!scene1 && scene1 === scene2 && scene1 !== 'ACTE2_08_MATIN_AUBERGE' };
      await p.screenshot({ path: path.join(cap, 'reouverture-1280x720.png') }); await ctx.close(); }
  } finally { await browser.close(); srv.kill(); }
  R.erreurs = errs; const ko = Object.entries(R).filter(([k, v]) => v && typeof v === 'object' && 'ok' in v && !v.ok).map(([k]) => k);
  fs.writeFileSync(path.join(cap, 'rapport.json'), JSON.stringify(R, null, 1)); console.log(JSON.stringify(R, null, 1)); console.log('KO : ' + (ko.join(', ') || 'aucun') + ' ; erreurs page : ' + errs.length);
  process.exit(ko.length || errs.length ? 1 : 0);
})();
