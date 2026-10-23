// 57 : recherche guidée (sans état injecté) des 9 parcours exigés. Usage : node rand57.cjs <scenario> [N]
const path=require('path');const root=path.resolve(__dirname,'../../elenya-refonte-52.4');
const {api}=require(root+'/qa/engine.cjs').loadEngine(root+'/project');
const clone=x=>JSON.parse(JSON.stringify(x));
function rng(seed){let s=seed>>>0;return()=>{s=(Math.imul(s,1664525)+1013904223)>>>0;return s/4294967296;};}
const F=(s,f)=>(s.flags||[]).includes(f), G=(s,g)=>Number((s.gauges||{})[g]||0);
const S={
 solo:{ok:(s,v)=>s.currentSceneId==='FIN_SOLO',w:c=>/^S$|SOLO|seule|_S$|^S_/.test(c.key+' '+c.text)?8:1},
 kaelen:{ok:(s,v)=>s.currentSceneId==='FIN_OMBRE',w:c=>/^O|_O$|Kaelen|OMBRE/.test(c.key+' '+c.text)?6:/^E|_E$|Alistair/.test(c.key+' '+c.text)?0.3:1},
 alistair:{ok:(s,v)=>s.currentSceneId==='FIN_ECLAIREUR',w:c=>/^E|_E$|Alistair|ECLAIR/.test(c.key+' '+c.text)?6:/^O|_O$|Kaelen/.test(c.key+' '+c.text)?0.3:1},
 rupture:{ok:(s,v)=>F(s,'romance_O_rompue')||F(s,'romance_E_rompue'),w:c=>/ROMPRE|rupture|FELURE|PARTIR/.test(c.key+' '+(c.intent||''))?40:/romance|tendresse/.test(c.intent||'')?3:1},
 pause:{ok:(s,v)=>F(s,'romance_deferred_O_payoff')||F(s,'romance_deferred_E_payoff')||F(s,'romance_deferred_O_closed')||F(s,'romance_deferred_E_closed'),w:c=>/DEFER|PLUS_TARD|PAUSE|CONF_|R_ROMANCE|V517/.test(c.key)?40:/romance|confiance/.test(c.intent||'')?3:1},
 instabilite:{ok:(s,v)=>v.has('ACTE4_09_TRONE_EBENE')&&G(s,'instabilite')>=25,w:c=>/instabilite/.test(JSON.stringify(c.effects||[]))?6:1},
 possession:{ok:(s,v)=>v.has('ACTE4_09_TRONE_EBENE')&&G(s,'possession')>=12,w:c=>/possession|domination|corruption/.test(JSON.stringify(c.effects||[])+(c.intent||''))?8:1},
 domination:{ok:(s,v)=>s.currentSceneId==='FIN_HIVER'&&F(s,'variante_FIN_DOMINATION'),w:c=>c.key==='DOMINER'?200:c.key==='FIN_DOMINATION'?1000:/domination|DOMIN|POUVOIR/.test(c.key+(c.intent||''))?6:1},
 branche_alistair:{ok:(s,v)=>v.has('ARC58_ALISTAIR_SERRURE'),w:c=>/V57_ARC57_ALISTAIR|CONDITION|V58_ARC58_ALISTAIR_SERRURE/.test(c.key)?300:/^E|_E$|Alistair/.test(c.key+' '+c.text)?4:1},
 branche_village:{ok:(s,v)=>v.has('ARC58_EPILOGUE_VILLAGE')&&v.has('ARC57_CONSEIL_FACTIONS'),w:c=>/V57_ARC57_CONSEIL|V58_ARC58_EPILOGUE|PARTAGE|EPILOGUE/.test(c.key)?300:/culte|Oraya|ACCUEIL/i.test(c.text+c.next)?6:1},
 branche_solo:{ok:(s,v)=>v.has('ARC58_SOLO_CRETE')&&s.currentSceneId==='FIN_SOLO',w:c=>/V58_ARC58_SOLO|^S$|SOLO|seule|_S$|^S_/.test(c.key+' '+c.text)?(c.key.startsWith('V58')?300:8):1},
 ngplus:{mode:'ngplus',ok:(s,v)=>/^NG_FIN_/.test(s.currentSceneId)&&v.has('NGP_15_DERNIER_CHOIX'),w:c=>/SAVOIR|TEMOIGNER|NOMMER|FEN|MEMOIRE|QUESTION/.test(c.key)?5:1},
};
const nom=process.argv[2], N=+process.argv[3]||3000, sc=S[nom];
for(let i=0;i<N;i++){
  const r=rng(((57000+i)*7919)>>>0); let s={gameMode:sc.mode||'classic'}; const p=[], v=new Set();
  for(let step=0;step<450;step++){
    const d=api.serverGetPendingScene(clone(s)); if(!d) break; s=d.renderedState; v.add(s.currentSceneId);
    if(sc.ok(s,v) && (d.isEnd || !['kaelen','alistair','solo','domination','ngplus','branche_solo'].includes(nom))){
      if(!d.isEnd){ // finir la partie au hasard pour un parcours complet
      } else { console.log(JSON.stringify({scenario:nom,fin:s.currentSceneId,graine:57000+i,parcours:p})); process.exit(0); }
    }
    if(d.isEnd) break;
    const ch=d.choices||[]; if(!ch.length) break;
    const w=ch.map(c=>sc.w(c)); const t=w.reduce((a,b)=>a+b,0); let x=r()*t,j=0; while(j<ch.length-1&&(x-=w[j])>0) j++;
    p.push([s.currentSceneId,ch[j].key]);
    const res=api.serverProcessChoice(clone(s),ch[j].key); if(!res||res.error) break; s=res.updatedState;
  }
  if(d0(s,v)) {}
}
function d0(){return false}
console.error('aucun parcours',nom); process.exit(2);
