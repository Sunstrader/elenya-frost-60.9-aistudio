#!/usr/bin/env node
// 60.1 (audit T03) : URLs d’images réellement envoyées au navigateur (après remappage V54), PC et mobile,
// pour chaque scène classique et NG+ rendue avec un état neutre, plus les préchargements. ONLINE=1 : chaque URL est
// interrogée (HEAD puis GET partiel) ; sinon, inventaire seul. Sortie 1 si une URL répond ≥ 400.
'use strict';
const { engine } = require('./lib.cjs'); const { api } = engine();
const urls = new Map();
const note = (u, d) => { if (typeof u === 'string' && /^https?:/.test(u)) urls.set(u, d); };
for (const [db, mode] of [[api.DB, 'classic'], [api.NGPLUS_DB, 'ngplus']]) for (const id of Object.keys(db)) {
  let d; try { d = api.serverGetPendingScene({ gameMode: mode, currentSceneId: id, flags: [], gauges: {} }); } catch (e) { continue; }
  if (!d) continue; note(d.image, id); note(d.imageMobile, id + ' (mobile)'); note(d.sprite, id + ' (sprite)');
  (d.preloadHints || []).forEach(h => { note(h.image, id + ' (préchargement)'); note(h.imageMobile, id + ' (préchargement mobile)'); });
}
(async () => {
  const out = { urls: urls.size, enLigne: !!process.env.ONLINE, echecs: [] };
  if (process.env.ONLINE) { const L = [...urls.keys()]; let i = 0;
    await Promise.all(Array.from({ length: 8 }, async () => { while (i < L.length) { const u = L[i++]; try { let r = await fetch(u, { method: 'HEAD' }); if (r.status >= 400) r = await fetch(u, { headers: { Range: 'bytes=0-0' } }); if (r.status >= 400) out.echecs.push(r.status + ' ' + u + ' ← ' + urls.get(u)); } catch (e) { out.echecs.push('ERR ' + u + ' ← ' + urls.get(u)); } } })); }
  console.log(JSON.stringify(out)); process.exit(out.echecs.length ? 1 : 0);
})();
