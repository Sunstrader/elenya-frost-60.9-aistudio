#!/usr/bin/env node
// Empreinte narrative : exporte la STRUCTURE du récit (sans le texte) et les TEXTES séparément.
// Usage : node tools/empreinte_narrative.js [dossier_sortie]
// Produit structure.json, textes.json et affiche les deux empreintes SHA-256.
'use strict';
const fs = require('node:fs'), path = require('node:path'), crypto = require('node:crypto');
const { loadEngine } = require('../elenya-refonte-52.4/qa/engine.cjs');
const root = path.resolve(__dirname, '../elenya-refonte-52.4/project');
const { api } = loadEngine(root);
const TEXT_KEYS = new Set(['text', 'narrative', 'getDynamicNarrative', 'response', 'title', 'journal', 'feedback', 'memoryEcho', 'emotionalBeat']);
const ASSET_KEYS = new Set(['image', 'imageMobile', 'postTransitionImage', 'postTransitionImageMobile', 'transitionGif', 'transitionGifMobile', 'sprite', 'spriteLeft', 'spriteRight', 'voice', 'stage', 'presentation']);
const flagRe = /(?:hasFlag|hasGlobalFlag|getGauge|hasItem)\(\s*['"]([^'"]+)['"]/g;
function fnInfo(f) { const src = String(f); const reads = [...src.matchAll(flagRe)].map(m => m[1]); return { fn: crypto.createHash('sha256').update(src).digest('hex').slice(0, 16), reads: [...new Set(reads)].sort() }; }
function val(v) { return typeof v === 'function' ? fnInfo(v) : v; }
function exportDb(db) {
  const structure = {}, texts = {};
  for (const id of Object.keys(db).sort()) {
    const s = db[id], st = {}, tx = {};
    for (const k of Object.keys(s).sort()) {
      if (k === 'choices') continue;
      if (TEXT_KEYS.has(k)) { tx[k] = typeof s[k] === 'function' ? String(s[k]) : s[k]; if (typeof s[k] === 'function') st[k + '_reads'] = fnInfo(s[k]).reads; continue; }
      if (ASSET_KEYS.has(k)) continue;
      st[k] = val(s[k]);
    }
    st.choices = (s.choices || []).map((c, i) => {
      const o = {};
      for (const k of Object.keys(c).sort()) {
        if (TEXT_KEYS.has(k)) { tx['choice' + i + '.' + k] = typeof c[k] === 'function' ? String(c[k]) : c[k]; continue; }
        o[k] = val(c[k]);
      }
      return o;
    });
    structure[id] = st; texts[id] = tx;
  }
  return { structure, texts };
}
const classic = exportDb(api.DB), ng = exportDb(api.NGPLUS_DB);
const structure = { classic: classic.structure, ngplus: ng.structure };
const texts = { classic: classic.texts, ngplus: ng.texts };
const h = o => crypto.createHash('sha256').update(JSON.stringify(o)).digest('hex');
const out = process.argv[2];
if (out) { fs.mkdirSync(out, { recursive: true }); fs.writeFileSync(path.join(out, 'structure.json'), JSON.stringify(structure, null, 1)); fs.writeFileSync(path.join(out, 'textes.json'), JSON.stringify(texts, null, 1)); }
const r = { scenesClassiques: Object.keys(structure.classic).length, scenesNGPlus: Object.keys(structure.ngplus).length, empreinteStructure: h(structure), empreinteTextes: h(texts) };
console.log(JSON.stringify(r, null, 2));
