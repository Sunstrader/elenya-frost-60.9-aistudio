#!/usr/bin/env node
// Typographie française SÛRE dans les textes de la base (DATABASE_*.js et textes de scènes de 23_Refonte.js).
// Analyse le code avec acorn (analyseur JavaScript libre, MIT) et ne modifie QUE le contenu
// des chaînes de texte (jamais le code, les clés, les flags ni les URLs) :
//   - apostrophe droite entre deux lettres  ' → ’
//   - espace avant ? ! ;  → espace fine insécable (U+202F)
//   - espace avant :      → espace insécable (U+00A0)
//   - « + espace / espace + »  → espaces insécables
// Usage : node tools/typographie_fr.cjs [--ecrire]   (sans --ecrire : simulation, rien n'est modifié)
// acorn : npm i acorn@8 (dans un dossier d'outils) puis NODE_PATH=<dossier>/node_modules
'use strict';
const fs = require('node:fs'), path = require('node:path');
const acorn = require('acorn'), walk = require('acorn-walk');
const dir = path.resolve(__dirname, '../elenya-refonte-52.4/project');
const write = process.argv.includes('--ecrire');
const L = 'A-Za-zÀ-ÖØ-öø-ÿŒœ';
function isText(v) { return /\s/.test(v) && new RegExp('[' + L + ']{2}').test(v) && !/https?:|<\/?[a-z]|\$\{|^[\w.-]+$/.test(v); }
function fix(raw, quote) {
  let s = raw;
  const apo = quote === "'" ? new RegExp('(?<=[' + L + '])\\\\\'(?=[' + L + '])', 'g') : new RegExp('(?<=[' + L + '])\'(?=[' + L + '])', 'g');
  s = s.replace(apo, '’');
  s = s.replace(/ (?=[?!;])/g, '\u202F');
  s = s.replace(/ (?=:(\s|$|\\n))/g, '\u00A0');
  s = s.replace(/« /g, '«\u00A0').replace(/ »/g, '\u00A0»');
  return s;
}
let total = 0; const report = [];
for (const f of fs.readdirSync(dir).filter(f => /^(DATABASE_.*|23_Refonte)\.js$/.test(f))) {
  const src = fs.readFileSync(path.join(dir, f), 'utf8');
  const ast = acorn.parse(src, { ecmaVersion: 'latest', sourceType: 'script' });
  const edits = [];
  walk.full(ast, node => {
    if (node.type === 'Literal' && typeof node.value === 'string' && isText(node.value)) {
      const q = src[node.start]; const raw = src.slice(node.start + 1, node.end - 1); const nr = fix(raw, q);
      if (nr !== raw) edits.push([node.start + 1, node.end - 1, nr, raw]);
    } else if (node.type === 'TemplateElement' && isText(node.value.cooked || '')) {
      const raw = src.slice(node.start, node.end); const nr = fix(raw, '`');
      if (nr !== raw) edits.push([node.start, node.end, nr, raw]);
    }
  });
  edits.sort((a, b) => b[0] - a[0]);
  let out = src;
  for (const [a, b, nr] of edits) out = out.slice(0, a) + nr + out.slice(b);
  if (edits.length) { new acorn.Parser({ ecmaVersion: 'latest' }, out); acorn.parse(out, { ecmaVersion: 'latest' }); }
  total += edits.length; report.push(f + ' : ' + edits.length + ' chaînes');
  if (write && edits.length) fs.writeFileSync(path.join(dir, f), out);
}
console.log(report.join('\n') + '\nTotal : ' + total + ' chaînes ' + (write ? 'modifiées' : 'à modifier (simulation)'));
