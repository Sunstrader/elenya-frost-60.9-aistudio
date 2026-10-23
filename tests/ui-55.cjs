#!/usr/bin/env node
// 55.0 : narration vocale retirée (sans toucher musique/SFX) et plein écran proposé sans blocage.
'use strict';
const fs = require('node:fs'), path = require('node:path');
const P = path.resolve(__dirname, '../elenya-refonte-52.4/project');
const all = fs.readdirSync(P).filter(f => /\.(js|html)$/.test(f)).map(f => [f, fs.readFileSync(path.join(P, f), 'utf8')]);
const err = [];
const interdit = /speechSynthesis|SpeechSynthesisUtterance|preloadUpmcVoice|unlockVoice|stopVoice|toggleSpeak|voicePlayer|previewPlayer|btn-rf-narrate|btn-voice-hover|voiceParts|VOICE_ENABLED|setNarrationForNewGame/;
for (const [f, s] of all) { const m = s.match(interdit); if (m) err.push(f + ' contient encore « ' + m[0] + ' »'); }
const ref = fs.readFileSync(path.join(P, 'Scripts_Refonte.html'), 'utf8');
if (!/ambience/.test(ref) || !/effects/.test(ref)) err.push('réglages musique/effets disparus');
if (!/delete prefs\[k\]/.test(ref)) err.push('migration des anciens réglages voix absente');
const game = fs.readFileSync(path.join(P, 'Scripts_Game.html'), 'utf8');
const gi = fs.readFileSync(path.join(P, 'Game_Interface.html'), 'utf8');
if (!/data-display-mode="fullscreen"/.test(gi) || !/data-display-mode="windowed"/.test(gi)) err.push('choix plein écran / fenêtre absent au lancement');
const cg = game.slice(game.indexOf('function continueGame'), game.indexOf('function offerFullscreenOnResume'));
if (!/offerFullscreenOnResume\(\)/.test(cg)) err.push('plein écran non proposé à la reprise');
if (!/setTimeout\(\(\)=>bar\.classList\.remove\('show'\)/.test(game)) err.push('bandeau plein écran non auto-masqué');
const css = fs.readFileSync(path.join(P, 'Cinematic_UI_Landscape.html'), 'utf8');
if (!/ui-55-givre-argent/.test(css)) err.push('couche de style 55 absente');
if (err.length) { console.error(err.join('\n')); process.exit(1); }
console.log(JSON.stringify({ fichiers: all.length, ok: true }));
