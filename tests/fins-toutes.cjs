// 60.0 : routes regénérées (routes-fins-60.0.0.json) : fragment de Kalthar jeune, agonies et derniers souffles intercalés.
// 58.0 : + parcours légaux vers FIN_ECLAIREUR / FIN_OMBRE / FIN_SOLO (issus des 9 parcours), le hasard seul ne suffisant plus après l’ajout des choix 58.
// 54.0.0 : fins consolidées (9 principales + Corona secrète + échecs + épilogues + 2 NG+), anciennes fins = variantes.
// 53.5 : toutes les fins. 1) rejoue les parcours légaux (trouvés par recherche en faisceau, aucun état injecté)
// vers les fins rares (dont les 7 autrefois jamais atteintes) et les 3 épilogues de l’acte 5 ; 2) 300 parties classiques + 100 NG+ au hasard ; 3) bilan.
const fs = require('node:fs'), path = require('node:path'), assert = require('node:assert/strict');
const { playRandom } = require('./lib.cjs');
const root = path.resolve(__dirname, '../elenya-refonte-52.4');
const { api } = require(root + '/qa/engine.cjs').loadEngine(root + '/project');
const clone = x => JSON.parse(JSON.stringify(x));
const routes = JSON.parse(fs.readFileSync(path.join(__dirname, 'fixtures/routes-fins-60.8.0b.json'), 'utf8'));
const fins = {}, rejoues = {}, variantes = {};
const noteVariante = r => { if (r.state) for (const f of r.state.flags || []) if (f.startsWith('variante_')) variantes[f.slice(9)] = (variantes[f.slice(9)] || 0) + 1; };
for (const [cible, route] of Object.entries(routes)) {
  let s = { gameMode: 'classic' };
  for (const [scene, cle] of route) {
    const d = api.serverGetPendingScene(clone(s)); s = d.renderedState;
    assert.equal(s.currentSceneId, scene, cible + ' : écart de parcours');
    const r = api.serverProcessChoice(clone(s), cle); assert(!r.error, cible + ' : ' + r.error); s = r.updatedState;
  }
  const rs = api.serverGetPendingScene(clone(s)).renderedState, fin = rs.currentSceneId;
  const main = (api.DB[cible] && api.DB[cible].aliasOf) || cible;
  assert.equal(fin, main, 'fin rare non atteinte : ' + cible + ' (attendu ' + main + ')');
  if (main !== cible) { assert(rs.flags.includes('variante_' + cible), 'variante absente : ' + cible); variantes[cible] = (variantes[cible] || 0) + 1; }
  rejoues[cible] = route.length + ' choix'; fins[main] = (fins[main] || 0) + 1;
}
let err = 0;
const { n } = require('./lot.cjs');
for (let i = 0; i < n(300, 60); i++) { const r = playRandom(api, 50000 + i, 'classic'); if (r.erreur) err++; else { fins[r.fin] = (fins[r.fin] || 0) + 1; noteVariante(r); } }
for (let i = 0; i < n(100, 20); i++) { const r = playRandom(api, 60000 + i, 'ngplus'); if (r.erreur) err++; else { fins[r.fin] = (fins[r.fin] || 0) + 1; noteVariante(r); } }
assert.equal(err, 0);
const toutes = Object.keys(api.DB).filter(id => api.DB[id].isEnd && !api.DB[id].aliasOf);
const alias = Object.keys(api.DB).filter(id => api.DB[id].aliasOf);
const variantesManquantes = alias.filter(id => !variantes[id]);
assert.deepEqual(variantesManquantes, [], 'variantes jamais atteintes : ' + variantesManquantes.join(', '));
const jamais = toutes.filter(id => !fins[id]);
assert.deepEqual(jamais, [], 'fins jamais atteintes : ' + jamais.join(', '));
console.log(JSON.stringify({ rejoues, finsAtteintes: Object.keys(fins).length, finsClassiquesDeclarees: toutes.length, finsClassiquesManquantes: jamais.length, jamais, fins, variantes }, null, 1));
