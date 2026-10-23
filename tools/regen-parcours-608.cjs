// 60.8.0 : régénère les parcours de parcours-57 qui ne remplissent plus leur condition (fin + condition + textes),
// en gardant le préfixe jouable de la route 60.3.2 et en cherchant une suite (graines déterministes). Outil, pas un test.
'use strict';
const fs = require('fs'), path = require('path'); const { engine, rng, clone } = require('../tests/lib.cjs'); const { api } = engine();
const FX = p => path.join(__dirname, '../tests/fixtures', p);
const FUS = ['LIEN_MARCHE_2B', 'ACTE2_02B_PANTHERE_LIBEREE', 'ACTE2_02B_PANTHERE_ABSORBEE', 'ACTE3_11_PRISON_ECHANGE', 'ACTE4_07B_CHOC_FRAGMENT'];
const F = (s, f) => (s.flags || []).includes(f), G = (s, g) => Number((s.gauges || {})[g] || 0);
const ATTENDU = {
  solo: s => s.currentSceneId === 'FIN_SOLO', kaelen: s => s.currentSceneId === 'FIN_OMBRE', alistair: s => s.currentSceneId === 'FIN_ECLAIREUR',
  rupture: s => F(s, 'romance_O_rompue') || F(s, 'romance_E_rompue'),
  pause: s => ['O', 'E'].some(x => F(s, 'romance_deferred_' + x + '_payoff') || F(s, 'romance_deferred_' + x + '_closed')),
  instabilite: (s, v) => v.has('ACTE4_09_TRONE_EBENE') && G(s, 'instabilite') >= 25,
  possession: (s, v) => v.has('ACTE4_09_TRONE_EBENE') && G(s, 'possession') >= 12,
  domination: s => s.currentSceneId === 'FIN_DOMINATION' && F(s, 'variante_FIN_DOMINATION') };
const TEXTES = { instabilite: /penses par éclats|givre craque sous tes pas|tempête peut les fendre|ne trouve rien à gouverner|givre déborde encore/,
  possession: /comptes tes compagnons|baissent la tête avant|Il a seulement besoin que tu veuilles garder|regagner leur franchise/ };
const PREF = { rupture: /ROMPRE|RUPTURE|ROMPU|BRISER/, domination: /DOMIN|GENOUX|ORDONN/, possession: /ABSORB|PRENDRE|GARDER|TRONE|POSSES/, instabilite: /TEMPETE|LIBERER|DECHAIN/ };
const fam = id => ((api.DB[id] || api.NGPLUS_DB[id] || {}).family) || id;
function bilan(nom, rec, par) { let s = { gameMode: 'classic' }; const v = new Set(); let t = '';
  for (const [id, k] of par) { const d = api.serverGetPendingScene(clone(s)); s = d.renderedState; v.add(s.currentSceneId); t += '\n' + (d.narrative || '');
    if (s.currentSceneId !== id || !d.choices.some(c => c.key === k)) return false; s = api.serverProcessChoice(clone(s), k).updatedState; }
  const d = api.serverGetPendingScene(clone(s)); s = d.renderedState; v.add(s.currentSceneId); t += '\n' + (d.narrative || '');
  return d.isEnd && s.currentSceneId === rec.fin /* 60.8.1 : identifiant exact */ && ATTENDU[nom](s, v) && (!TEXTES[nom] || TEXTES[nom].test(t)); }
const P = JSON.parse(fs.readFileSync(FX('parcours-60.8.0.json'))), OLD = JSON.parse(fs.readFileSync(FX('parcours-60.3.2.json'))); const J = {};
for (const nom of Object.keys(ATTENDU)) { const rec = P[nom]; if (bilan(nom, rec, rec.parcours)) { J[nom] = 'conforme'; continue; }
  const pre = OLD[nom].parcours.filter(([id]) => !FUS.includes(id)); let trouve = null;
  for (let cut = pre.length; cut >= 0 && !trouve; cut = cut > 0 ? Math.max(0, cut - 15) : -1) {
    let s0 = { gameMode: 'classic' }, ok = true; for (const [id, k] of pre.slice(0, cut)) { const d = api.serverGetPendingScene(clone(s0)); s0 = d.renderedState; if (s0.currentSceneId !== id || !d.choices.some(c => c.key === k)) { ok = false; break; } s0 = api.serverProcessChoice(clone(s0), k).updatedState; }
    if (!ok) continue;
    for (let sd = 1; sd <= (cut === 0 ? 1500 : 150) && !trouve; sd++) { const r = rng(sd * 7919 + cut); let s = clone(s0); const route = pre.slice(0, cut);
      for (let i = 0; i < 450; i++) { const d = api.serverGetPendingScene(clone(s)); s = d.renderedState; if (d.isEnd) break; const ks = d.choices.map(c => c.key);
        const fav = PREF[nom] ? ks.filter(k => PREF[nom].test(k)) : []; const L = fav.length && r() < 0.7 ? fav : ks; const k = L[Math.floor(r() * L.length)];
        route.push([s.currentSceneId, k]); s = api.serverProcessChoice(clone(s), k).updatedState; }
      if (bilan(nom, rec, route)) trouve = { route, sd, cut }; } }
  J[nom] = trouve ? { graine: trouve.sd, prefixe: trouve.cut } : 'ÉCHEC'; if (trouve) rec.parcours = trouve.route; process.stderr.write(nom + ' ' + JSON.stringify(J[nom]) + '\n'); }
fs.writeFileSync(FX('parcours-60.8.0.json'), JSON.stringify(P)); console.log(JSON.stringify(J));
