#!/usr/bin/env node
// Lanceur unique des tests (npm test). Sortie en français. Code de sortie 1 si un test échoue.
// Options : ONLINE=1 pour vérifier aussi que les URLs d'assets répondent (réseau requis).
'use strict';
const { execFileSync } = require('node:child_process');
const fs = require('node:fs'), path = require('node:path');
const { engine, playRandom, clone } = require('./lib.cjs');
const ROOT = path.resolve(__dirname, '..');
const LOT = require('./lot.cjs'); const T_DEBUT = Date.now(); // 60.1 : lot rapide (npm test) ou complet (npm run test:full)
const ENV = Object.assign({}, process.env, { CHECK_RUNS: process.env.CHECK_RUNS || String(LOT.n(500, 60)), PARTIES60: process.env.PARTIES60 || String(LOT.n(300, 30)) });
console.log('Lot : ' + (LOT.complet ? 'complet' : 'rapide') + ' (CHECK_RUNS=' + ENV.CHECK_RUNS + ' par mode, PARTIES60=' + ENV.PARTIES60 + ')');
console.log('Machine : Node ' + process.version + ', ' + require('node:os').cpus().length + ' CPU (' + ((require('node:os').cpus()[0] || {}).model || '?') + '), ' + Math.round(require('node:os').totalmem() / 1e9) + ' Go, tests en série (aucun parallélisme)');
const results = []; let failed = 0;
// 60.2 : progression visible (début de chaque test sur stderr), durée de chaque test, bilan des plus lents.
const T0 = Date.now(); let n = 0;
function test(nom, fn) {
  const t = Date.now(); n++; process.stderr.write('… [' + n + '] ' + nom.slice(0, 90) + '\n');
  try { const info = fn(); results.push({ nom, ok: true, ms: Date.now() - t, info }); console.log('OK   ' + nom + ' (' + ((Date.now() - t) / 1000).toFixed(1) + ' s)' + (info ? ' — ' + (typeof info === 'string' ? info : JSON.stringify(info)) : '')); }
  catch (e) { failed++; results.push({ nom, ok: false, ms: Date.now() - t, erreur: String(e.message || e).slice(0, 600) }); console.log('ÉCHEC ' + nom + ' (' + ((Date.now() - t) / 1000).toFixed(1) + ' s) — ' + String(e.message || e).slice(0, 600)); }
}
process.on('exit', () => { const lents = results.slice().sort((a, b) => (b.ms || 0) - (a.ms || 0)).slice(0, 8);
  console.log('\nDurée totale : ' + ((Date.now() - T0) / 1000).toFixed(1) + ' s — plus lents : ' + lents.map(r => r.nom.slice(0, 40) + ' ' + ((r.ms || 0) / 1000).toFixed(1) + ' s').join(' | ')); });
const assert = (c, m) => { if (!c) throw new Error(m); };

// 1. Suite historique du projet (bivouac, romance, check complet, premier lancement, choix, reviewer)
for (const f of ['bivouac-kaelen', 'romance', 'check', 'first-run', 'choice-distinctness', 'image-reviewer']) {
  test('Suite historique : ' + f, () => { execFileSync(process.execPath, ['elenya-refonte-52.4/qa/' + f + '.cjs'], { cwd: ROOT, stdio: 'pipe', timeout: 600000, env: ENV }); });
}
const { api } = engine();

// 2. Empreinte narrative : la structure du récit doit être identique à la 52.5.4
test('Empreinte narrative identique à la 52.5.4 (ou écarts documentés 53.4.0 / 53.5.0 / 53.6.0 / 54.0.0 / 55.0.0 / 56.0.0 / 57.0.0 / 58.0.0 / 59.0.0 / 60.0.0 / 60.1.0 / 60.3.1 / 60.3.2 / 60.8.0 / 60.8.1)', () => {
  const out = JSON.parse(execFileSync(process.execPath, ['tools/empreinte_narrative.js'], { cwd: ROOT }).toString());
  const base = JSON.parse(fs.readFileSync(path.join(__dirname, 'baseline/empreinte-52.5.4.json'), 'utf8'));
  // V53.4 : seuls les écarts documentés dans baseline/empreinte-53.4.0.json sont admis.
  const base534 = JSON.parse(fs.readFileSync(path.join(__dirname, 'baseline/empreinte-53.4.0.json'), 'utf8'));
  const base535 = JSON.parse(fs.readFileSync(path.join(__dirname, 'baseline/empreinte-53.5.0.json'), 'utf8'));
  const base536 = JSON.parse(fs.readFileSync(path.join(__dirname, 'baseline/empreinte-53.6.0.json'), 'utf8'));
  const base550 = JSON.parse(fs.readFileSync(path.join(__dirname, 'baseline/empreinte-55.0.0.json'), 'utf8'));
  // 56.0 : FIN_DOMINATION séparée du trio, refus possible du trio, ruptures verrouillées (écart documenté).
  const base560 = JSON.parse(fs.readFileSync(path.join(__dirname, 'baseline/empreinte-56.0.0.json'), 'utf8'));
  // 57.0 : scènes annexes (arcs, dilemme du grain, conflits de romance), choix instabilité/possession/savoir (écart documenté docs/57).
  // 58.0 : branches réelles, romances/solo, NG+ recadré, passe de style (écart documenté docs/58).
  const base580 = JSON.parse(fs.readFileSync(path.join(__dirname, 'baseline/empreinte-58.0.0.json'), 'utf8'));
  // 59.0 : corrections des six audits V58 (écart documenté docs/59/TRAITEMENT_AUDITS.md).
  const base590 = JSON.parse(fs.readFileSync(path.join(__dirname, 'baseline/empreinte-59.0.0.json'), 'utf8'));
  // 60.0 : corrections des cinq ré-audits V59 (écart documenté docs/60/TRAITEMENT_AUDITS.md).
  const base600 = JSON.parse(fs.readFileSync(path.join(__dirname, 'baseline/empreinte-60.0.0.json'), 'utf8'));
  // 60.1 : choix TENUE / MAIN_TENDUE, conflit de Kaelen déplacé à la HALTE_DOME (écart documenté docs/60.1/JOURNAL_CORRECTIONS.md).
  const base601 = JSON.parse(fs.readFileSync(path.join(__dirname, 'baseline/empreinte-60.1.0.json'), 'utf8'));
  // 60.3.1 : halte stèle → STELE603_INDICE, quêtes, gardes de consentement (écart documenté docs/60.3.1/RAPPORT.md).
  const base6031 = JSON.parse(fs.readFileSync(path.join(__dirname, 'baseline/empreinte-60.3.1.json'), 'utf8'));
  // 60.3.2 : domination → aucune romance, question de la chaise libre, dettes au seuil, lignées (docs/60.3.2/RAPPORT.md).
  const base6032 = JSON.parse(fs.readFileSync(path.join(__dirname, 'baseline/empreinte-60.3.2.json'), 'utf8'));
  // 60.8.0 : rythme (5 transitions fusionnées, choix R608_*), moments romance R608, réécritures (docs/60.8.0/RAPPORT.md).
  const base608 = JSON.parse(fs.readFileSync(path.join(__dirname, 'baseline/empreinte-60.8.0.json'), 'utf8'));
  // 60.8.1 : choix SUBMIT_FINAL, LAISSER_O/E_REFERME (Kaelen/Alistair referment la question) — écart documenté docs/60.8.1/RAPPORT.md.
  const base6081 = JSON.parse(fs.readFileSync(path.join(__dirname, 'baseline/empreinte-60.8.1.json'), 'utf8'));
  const base570 = JSON.parse(fs.readFileSync(path.join(__dirname, 'baseline/empreinte-57.0.0.json'), 'utf8'));
  const base540 = JSON.parse(fs.readFileSync(path.join(__dirname, 'baseline/empreinte-54.0.0.json'), 'utf8'));
  assert(out.empreinteStructure === base6081.empreinteStructure || out.empreinteStructure === base608.empreinteStructure || out.empreinteStructure === base6032.empreinteStructure || out.empreinteStructure === base6031.empreinteStructure || out.empreinteStructure === base601.empreinteStructure || out.empreinteStructure === base600.empreinteStructure || out.empreinteStructure === base590.empreinteStructure || out.empreinteStructure === base580.empreinteStructure || out.empreinteStructure === base570.empreinteStructure || out.empreinteStructure === base560.empreinteStructure || out.empreinteStructure === base550.empreinteStructure || out.empreinteStructure === base540.empreinteStructure || out.empreinteStructure === base.empreinteStructure || out.empreinteStructure === base534.empreinteStructure || out.empreinteStructure === base535.empreinteStructure || out.empreinteStructure === base536.empreinteStructure, 'structure modifiée : ' + out.empreinteStructure);
  return { scenes: out.scenesClassiques + out.scenesNGPlus, textesIdentiques: out.empreinteTextes === base.empreinteTextes };
});

// 3. Intégrité de la base de scènes
test('Intégrité DB : destinations existantes, aucune impasse hors fins', () => {
  const r = api.serverValidateDatabase();
  assert(!r.missing.length && !r.deadEnds.length && !r.placeholders.length, JSON.stringify(r).slice(0, 400));
  for (const db of [api.DB, api.NGPLUS_DB]) for (const [id, s] of Object.entries(db)) for (const c of s.choices || []) if (c.next && c.next !== 'RETURN') assert(api.DB[c.next] || api.NGPLUS_DB[c.next], id + ' -> ' + c.next + ' absent');
  return { scenes: r.scenes, ngPlus: r.ngPlusScenes };
});

// 4. Sauvegardes 52.5.4 : chargées dans la nouvelle version, même scène, mêmes choix
test('Sauvegardes 52.5.4 (synthétiques, tous actes + NG+) chargées (même scène, anciens choix conservés)', () => {
  const fx = JSON.parse(fs.readFileSync(path.join(__dirname, 'fixtures/sauvegardes-52.5.4.json'), 'utf8'));
  let n = 0;
  for (const s of fx.sauvegardes) {
    const d = api.serverGetPendingScene(clone(s.state));
    // 53.5 : une sauvegarde arrêtée sur la rive nord voit d’abord la nouvelle scène de la lettre
    // (qui revient ensuite à la rive nord) ; c’est le seul écart attendu.
    const intercepte = { ACTE2_11_RIVE_NORD: 'ALISTAIR_LETTRE_SOEUR' }[s.attendu.scene];
    if (intercepte && d && d.renderedState.currentSceneId === intercepte) { n++; continue; }
    // 53.6 : au-delà de 40 d’instabilité, une sauvegarde reçoit d’abord le sursis de surcharge (une seule fois).
    if ((s.state.gauges || {}).instabilite >= 40 && d && d.renderedState.currentSceneId === 'AVERTISSEMENT_SURCHARGE') { n++; continue; }
    assert(d && d.renderedState.currentSceneId === s.attendu.scene, 'scène différente pour ' + s.attendu.scene);
    // 53.5 : de nouveaux choix peuvent s’ajouter ; aucun ancien choix ne disparaît,
    // sauf ACTE5_01_LENDEMAIN, dont les choix A/B/C ont été déplacés deux scènes plus loin
    // (ACTE5_01C_DERNIERE_QUESTION), derrière un unique « SUITE ».
    const cles = (d.choices || []).map(c => c.key);
    const deplaces = { ACTE5_01_LENDEMAIN: ['SUITE'] };
    if (deplaces[s.attendu.scene]) assert(JSON.stringify(cles) === JSON.stringify(deplaces[s.attendu.scene]), 'choix inattendus pour ' + s.attendu.scene);
    // 59.0 (continuité, audit V58) : une reconversion n’est plus offerte quand la domination est active
    // (go_poly_domination / domination_finale) ; c’est le seul retrait voulu, documenté dans docs/59/TRAITEMENT_AUDITS.md.
    else if ((s.state.flags || []).some(f => f === 'go_poly_domination' || f === 'domination_finale')) assert(s.attendu.choix.filter(k => !/^V28_FIN_RECONVERSION_/.test(k)).every(k => cles.includes(k)), 'choix disparus pour ' + s.attendu.scene);
    else assert(s.attendu.choix.every(k => cles.includes(k)), 'choix disparus pour ' + s.attendu.scene + ' : ' + JSON.stringify(s.attendu.choix) + ' → ' + JSON.stringify(cles));
    n++;
  }
  return n + ' sauvegardes';
});

// 5. Sauvegarde corrompue : le moteur ne plante pas et revient à un état valide
test('Sauvegarde corrompue ou vide : pas de plantage', () => {
  for (const bad of [null, {}, { currentSceneId: 'SCENE_INEXISTANTE' }, { flags: 'pas-un-tableau', gauges: null }, { gameMode: 'ngplus', currentSceneId: 42 }]) {
    const d = api.serverGetPendingScene(bad);
    assert(d && d.renderedState && d.renderedState.currentSceneId, 'état invalide pour ' + JSON.stringify(bad));
  }
});

// 6. Test du singe : parties aléatoires à graine fixe
test('Test du singe : ' + LOT.n(300, 60) + ' parties classiques + ' + LOT.n(100, 20) + ' NG+ sans erreur ni blocage', () => {
  const fins = {}, err = [];
  for (let i = 0; i < LOT.n(300, 60); i++) { const r = playRandom(api, 20000 + i, 'classic'); r.erreur ? err.push(r.erreur + ' @' + r.scene) : (fins[r.fin] = (fins[r.fin] || 0) + 1); }
  for (let i = 0; i < LOT.n(100, 20); i++) { const r = playRandom(api, 30000 + i, 'ngplus'); r.erreur ? err.push(r.erreur + ' @' + r.scene) : (fins[r.fin] = (fins[r.fin] || 0) + 1); }
  assert(!err.length, err.slice(0, 5).join(' | '));
  return { finsDistinctes: Object.keys(fins).length, fins };
});

// 6 bis. 53.5 : toutes les fins atteintes (parcours rejoués + 400 parties au hasard)
test('Toutes les fins atteintes : parcours rejoués vers les fins rares + ' + LOT.n(300, 60) + ' classiques + ' + LOT.n(100, 20) + ' NG+', () => {
  const out = JSON.parse(execFileSync(process.execPath, [path.join(__dirname, 'fins-toutes.cjs')], { cwd: ROOT, timeout: 600000, env: ENV }).toString());
  return { finsDistinctes: out.finsAtteintes, classiques: (out.finsClassiquesDeclarees - out.finsClassiquesManquantes) + '/' + out.finsClassiquesDeclarees, rejoues: Object.keys(out.rejoues).length };
});

// 6b. 55.0 : Fêlure des romances, échos différés, scène reconnectée, scènes retirées
test('Récit 55 : Fêlure, conséquences différées, « La Lame à Nu », redirections', () => {
  return JSON.parse(execFileSync(process.execPath, [path.join(__dirname, 'recit-55.cjs')], { cwd: ROOT, timeout: 600000, env: ENV }).toString());
});
test('Sirène : retournement du réveil préservé, clés et drapeaux compatibles', () => JSON.parse(execFileSync(process.execPath, [path.join(__dirname, 'sirene-twist.cjs')], { cwd: ROOT, timeout: 120000 }).toString()));
test('Version unique (package.json → moteur, repli UI, README, AGENTS) et libellés UI en français', () => JSON.parse(execFileSync(process.execPath, [path.join(__dirname, 'version-unique.cjs')], { cwd: ROOT }).toString()));
test('En-têtes des DATABASE : nombre réel de scènes', () => JSON.parse(execFileSync(process.execPath, [path.join(__dirname, 'entetes-db.cjs')], { cwd: ROOT }).toString()));
test('Audits V58 : régressions des points critiques et majeurs', () => JSON.parse(execFileSync(process.execPath, [path.join(__dirname, 'audits-59.cjs')], { cwd: ROOT, timeout: 600000, env: ENV }).toString()));
test('Audits V59 : reprise, agonies, bible, trio, romance (V60)', () => JSON.parse(execFileSync(process.execPath, [path.join(__dirname, 'audits-60.cjs')], { cwd: ROOT, timeout: 600000, env: ENV }).toString()));
test('Tics d’écriture : plafonds par fichier d’acte (V59)', () => JSON.parse(execFileSync(process.execPath, [path.join(__dirname, 'tics-59.cjs')], { cwd: ROOT }).toString()));
test('Échos 57/58 : aucun écho inaccessible (parties + graphe + rendu)', () => execFileSync(process.execPath, [path.join(ROOT, 'tools/qa-550/echos-atteints.cjs'), String(LOT.n(200, 60))], { cwd: ROOT, timeout: 900000 }).toString().trim().split('\n')[0]);
test('Romances/fins 56 : trio consenti ≠ domination, rupture non rouverte (positifs + négatifs)', () => JSON.parse(execFileSync(process.execPath, [path.join(__dirname, 'romances-fins-56.cjs')], { cwd: ROOT, timeout: 120000 }).toString()));
test('ADN 60.3 : fins distinctes, haltes d’exploration, réputation/inventaire/volonté/quêtes réels, sauvegarde, indice du trio', () => JSON.parse(execFileSync(process.execPath, [path.join(__dirname, 'adn-603.cjs')], { cwd: ROOT, timeout: 120000 }).toString()));
test('Correctifs 60.3.1 : stèle sans révélation, quête des dettes, pain à réputation 0, Fen manquée, reconversion et indices du trio, échos des fins, autoSave', () => JSON.parse(execFileSync(process.execPath, [path.join(__dirname, 'correctifs-6031.cjs')], { cwd: ROOT, timeout: 120000 }).toString()));
test('Correctifs 60.3.2 : aucune romance ni trio après domination, FIN_POLY par oui explicites, dettes réglables ou manquées, lignées des fins sans vérité', () => JSON.parse(execFileSync(process.execPath, [path.join(__dirname, 'correctifs-6032.cjs')], { cwd: ROOT, timeout: 300000 }).toString()));
test('Rythme 60.8.0 : écrans à choix unique < 38 %, fusions traversées, sauvegardes arrêtées sur une scène fusionnée rechargeables', () => JSON.parse(execFileSync(process.execPath, [path.join(__dirname, 'rythme-608.cjs')], { cwd: ROOT, timeout: 300000 }).toString()));
test('Romances 60.8.0 : refus sans punition, oui de chacun (chaise libre, dôme), refermer possible, pas de baiser sous emprise, moments R608 fermés par la domination', () => JSON.parse(execFileSync(process.execPath, [path.join(__dirname, 'romance-608.cjs')], { cwd: ROOT, timeout: 120000 }).toString()));
test('Romances 60.8.1 : dôme seulement si chacun peut dire oui et si Alistair n’est pas au cachot, question refermable par Kaelen ou Alistair, Sceau cohérent', () => JSON.parse(execFileSync(process.execPath, [path.join(__dirname, 'romance-6081.cjs')], { cwd: ROOT, timeout: 120000 }).toString()));
test('Narration 60.8.1 : pas de spoiler Sept, Kaelen perdu absent de FIN_SACRIFICE, décisions R608 relues, pas d’écho Kaelen en solo', () => JSON.parse(execFileSync(process.execPath, [path.join(__dirname, 'narration-6081.cjs')], { cwd: ROOT, timeout: 120000 }).toString()));
test('Gameplay 60.8.1 : après RELEVER, SUBMIT n’aboutit plus à une agonie à choix unique', () => JSON.parse(execFileSync(process.execPath, [path.join(__dirname, 'gameplay-6081.cjs')], { cwd: ROOT, timeout: 120000 }).toString()));
test('Sauvegardes 60.8.0 : nouveau NG+ purge l’ancien run (manifeste, fragments), scène inconnue → ERREUR_SCENE → sortie (revue sauvegardes B1, M1)', () => JSON.parse(execFileSync(process.execPath, [path.join(__dirname, 'sauvegardes-608.cjs')], { cwd: ROOT, timeout: 60000 }).toString()));
test('Récit 57 : instabilité ≠ possession, Silas/Veyra/Alistair/Séraphine, dilemme politique, NG+ par le savoir (positifs + négatifs)', () => JSON.parse(execFileSync(process.execPath, [path.join(__dirname, 'recit-57.cjs')], { cwd: ROOT, timeout: 120000 }).toString()));
test('Les 9 parcours exigés (solo, Kaelen, Alistair, rupture, pause/réparation, instabilité, possession, domination, NG+) rejoués de bout en bout', () => JSON.parse(execFileSync(process.execPath, [path.join(__dirname, 'parcours-57.cjs')], { cwd: ROOT, timeout: 300000 }).toString()));
test('Récit 58 : branches réelles (Alistair, Silas, Veyra, Trône, épilogue), romances et solo approfondis, NG+ recadré', () => JSON.parse(execFileSync(process.execPath, [path.join(__dirname, 'recit-58.cjs')], { cwd: ROOT, timeout: 120000 }).toString()));
test('Interface 55 : voix retirée, musique/SFX gardés, plein écran proposé sans blocage', () => JSON.parse(execFileSync(process.execPath, [path.join(__dirname, 'ui-55.cjs')], { cwd: ROOT, timeout: 60000 }).toString()));

// 7. Inventaire des assets (et vérification réseau si ONLINE=1)
test('Assets : inventaire des URLs ' + (process.env.ONLINE ? '(vérifiées en ligne)' : '(hors ligne)'), () => {
  const urls = new Set();
  for (const f of fs.readdirSync(path.join(ROOT, 'elenya-refonte-52.4/project'))) {
    const p = path.join(ROOT, 'elenya-refonte-52.4/project', f); if (fs.statSync(p).isDirectory()) continue;
    for (const m of fs.readFileSync(p, 'utf8').matchAll(/https:\/\/[^\s'"`)<>]+\.(?:webp|png|jpg|jpeg|gif|mp4|mp3|m4a|ogg|wav)/g)) urls.add(m[0]);
  }
  fs.writeFileSync(path.join(__dirname, 'assets-urls.txt'), [...urls].sort().join('\n') + '\n');
  if (process.env.ONLINE) {
    const bad = execFileSync(process.execPath, [path.join(__dirname, 'check-urls.cjs')], { cwd: ROOT, timeout: 900000 }).toString().trim();
    assert(!bad, 'URLs en échec :\n' + bad);
  }
  return urls.size + ' URLs (liste : tests/assets-urls.txt)';
});

// 8. Page assemblée : détecte les blocs HTML « avalés » par une balise <style> non fermée
test('Page assemblée : aucun script avalé par une balise <style> non fermée (corrigé en 53.3.0)', () => {
  const html = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');
  let swallowed = 0, i = 0;
  const re = /<(style|script)\b[^>]*>/gi; let m;
  while ((m = re.exec(html))) {
    const close = '</' + m[1].toLowerCase() + '>';
    const end = html.toLowerCase().indexOf(close, re.lastIndex);
    const stop = end < 0 ? html.length : end; // une balise jamais fermée avale tout jusqu'à la fin
    if (m[1].toLowerCase() === 'style') swallowed += (html.slice(re.lastIndex, stop).match(/<script\b/gi) || []).length;
    if (end < 0) break;
    re.lastIndex = end + close.length; i++;
  }
  assert(swallowed === 0, swallowed + ' scripts avalés par un <style> non fermé (0 attendu depuis 53.3.0)');
  for (const id of ['rf-dialog', 'rf-dialog-panel', 'elenya-jrpg-ui-runtime-v1', 'elenya-cinematic-ui-runtime-v1', 'elenya-input-guard-v1', 'efCadreRecitActif'])
    assert(html.includes(id), id + ' absent de la page assemblée');
  return 'tous les scripts actifs ; fenêtres et cadre du récit présents';
});

// 9. Lot 04 : indices de préchargement de la scène suivante (images https uniquement, 4 maximum)
test('Préchargement : indices des scènes suivantes fournis par le serveur', () => {
  const fx = JSON.parse(fs.readFileSync(path.join(__dirname, 'fixtures/sauvegardes-52.5.4.json'), 'utf8'));
  let avec = 0;
  for (const s of fx.sauvegardes) {
    const d = api.serverGetPendingScene(clone(s.state));
    const h = d.preloadHints || [];
    assert(Array.isArray(h) && h.length <= 4, 'indices invalides pour ' + s.attendu.scene);
    for (const x of h) for (const u of [x.image, x.imageMobile]) assert(!u || /^https:\/\//.test(u), 'URL non https : ' + u);
    if (h.length) avec++;
  }
  assert(avec > 0, 'aucun indice de préchargement');
  return avec + '/' + fx.sauvegardes.length + ' scènes avec indices';
});

// 10. Lot 12 : plus d'apostrophe droite entre deux lettres dans les textes de scène
test('Typographie : apostrophes typographiques dans les textes des scènes', () => {
  let n = 0;
  for (const db of [api.DB, api.NGPLUS_DB]) for (const s of Object.values(db)) for (const t of [s.title, s.text, ...(s.choices || []).map(c => c.text)]) if (typeof t === 'string' && /[a-zà-ÿ]'[a-zà-ÿ]/i.test(t)) n++;
  assert(n === 0, n + ' textes avec apostrophe droite');
  return 'aucune apostrophe droite restante';
});

test('Serveur (60.1) : diagnostic refusé en production, jeu ouvert', () => JSON.parse(execFileSync(process.execPath, [path.join(__dirname, 'serveur-diag.cjs')], { cwd: ROOT, timeout: 60000 }).toString()));
test('Déploiement (60.1) : DEPLOIEMENT.md cite chaque fichier, includes présents', () => JSON.parse(execFileSync(process.execPath, [path.join(__dirname, 'deploiement.cjs')], { cwd: ROOT }).toString()));
test('Source unique (60.1) : aucune copie hors du dossier canonique', () => JSON.parse(execFileSync(process.execPath, [path.join(__dirname, 'source-unique.cjs')], { cwd: ROOT }).toString()));
test('Sauvegardes 60.1 : 90 états figés (dont NG+), format gardé, NG+ après game over', () => JSON.parse(execFileSync(process.execPath, [path.join(__dirname, 'sauvegardes-601.cjs')], { cwd: ROOT }).toString()));
test('Interface 60.1 : aucun reliquat de narration vocale (ids, fonctions, CSS)', () => JSON.parse(execFileSync(process.execPath, [path.join(__dirname, 'reliquats-narration.cjs')], { cwd: ROOT }).toString()));
test('Échos rares 60.1 : un parcours fixe par écho rare trouvé (rejoué, texte affiché)', () => JSON.parse(execFileSync(process.execPath, [path.join(__dirname, 'echos-rares-601.cjs')], { cwd: ROOT }).toString()));
test('Images affichées 60.1 : inventaire PC/mobile/préchargement ' + (process.env.ONLINE ? '(vérifiées en ligne)' : '(hors ligne)'), () => JSON.parse(execFileSync(process.execPath, [path.join(__dirname, 'urls-affichees-601.cjs')], { cwd: ROOT, timeout: 600000 }).toString()));
test('Verrou Apps Script 60.2 (simulation GAS) : diagnostics privés, porte serverDevDiagnostic (drapeau + utilisateur autorisé), admin Reviewer propriétaire seul', () => JSON.parse(execFileSync(process.execPath, [path.join(__dirname, 'gas-verrou-602.cjs')], { cwd: ROOT, timeout: 600000 }).toString()));
test('Échos 60.2 : erreurs mémorisées (anti-plantage gardé), journal en dev seulement, imbrication et plafond corrects', () => JSON.parse(execFileSync(process.execPath, [path.join(__dirname, 'echos-erreurs-602.cjs')], { cwd: ROOT, timeout: 600000 }).toString()));
test('Sauvegardes 60.2 : cycle complet sauvegarde → stockage → nouveau moteur → chargement → reprise (90 + 115 anciennes), NG+ après les 5 types de game over', () => JSON.parse(execFileSync(process.execPath, [path.join(__dirname, 'sauvegardes-cycle-602.cjs')], { cwd: ROOT, timeout: 600000 }).toString()));
test('Morts 60.2 : 5 morts depuis des routes réelles ; céder → GAME_OVER, survivre → retour au jeu avec conséquence', () => JSON.parse(execFileSync(process.execPath, [path.join(__dirname, 'morts-602.cjs')], { cwd: ROOT, timeout: 600000 }).toString()));
test('Systèmes 60.1 : agonie à deux choix pour chaque catégorie de mort (déclencheur réel, survie, céder), chronologie unique', () => JSON.parse(execFileSync(process.execPath, [path.join(__dirname, 'systemes-601.cjs')], { cwd: ROOT, timeout: 600000 }).toString()));
test('Fins 60.1 : 36 routes déterministes rejouées, routes négatives au Trône (solo, ruptures, domination, compagnon absent, refus du trio), Oraya / Alistair / Séraphine', () => JSON.parse(execFileSync(process.execPath, [path.join(__dirname, 'fins-routes-601.cjs')], { cwd: ROOT, timeout: 600000 }).toString()));
test('Fins 60.8.1 : 36 fins à l’identifiant exact (drapeaux, titre, texte propre, aucune famille), non-régression LIBERATION ≠ VIDE', () => JSON.parse(execFileSync(process.execPath, [path.join(__dirname, 'fins-exactes-6081.cjs')], { cwd: ROOT, timeout: 600000 }).toString()));
// 60.1 : budget global du lot (TEST_BUDGET_MS ; défaut 180 s en rapide, 1 200 s en complet). Dépassé = échec affiché, pas masqué.
const DUREE = Date.now() - T_DEBUT, BUDGET_LOT = +process.env.TEST_BUDGET_MS || LOT.n(1200000, 180000);
test('Budget du lot ' + (LOT.complet ? 'complet' : 'rapide') + ' : ' + Math.round(DUREE / 1000) + ' s ≤ ' + BUDGET_LOT / 1000 + ' s', () => { assert(DUREE <= BUDGET_LOT, 'budget dépassé'); });
fs.writeFileSync(path.join(__dirname, LOT.complet ? 'resultats-complet.json' : 'resultats.json'), JSON.stringify({ date: new Date().toISOString(), lot: LOT.complet ? 'complet' : 'rapide', dureeMs: DUREE, echecs: failed, results }, null, 1));
console.log(failed ? `\n${failed} test(s) en échec.` : '\nTous les tests sont passés.');
process.exit(failed ? 1 : 0);
