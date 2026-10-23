#!/usr/bin/env node
// 59 : l’en-tête de chaque DATABASE_*.js annonce le vrai nombre de scènes de base.
'use strict';
const fs=require('fs'),path=require('path'),assert=require('assert/strict');
const P=path.resolve(__dirname,'../elenya-refonte-52.4/project');const out={};
for(const f of fs.readdirSync(P).filter(f=>/^DATABASE_.*\.js$/.test(f)&&!/Index/.test(f))){
  const s=fs.readFileSync(path.join(P,f),'utf8');const n=(s.match(/^\s{0,2}'[A-Z0-9_ËÉ]+':\s*\{/gm)||[]).length;
  const m=s.slice(0,300).match(/(\d+) scènes de base/);assert(m,f+' : en-tête');assert.equal(+m[1],n,f);out[f]=n;}
console.log(JSON.stringify(out));
