# ELENYA — L’Héritage de Primaëlys

**Slug technique : `Primaelys`** · **Version : lire `package.json` (60.8.1)**

RPG narratif fantasy à choix (Google Apps Script, avec un serveur Node local pour le développement et la QA). Il n’y a pas de narration vocale. La musique et les effets sonores sont conservés.

## Source unique
- Le jeu est dans `elenya-refonte-52.4/project/` : c’est le seul dossier chargé par `server.js` et `scripts/build.js`.
- `archives/` contient d’anciennes copies mortes. Ne pas les modifier.

## Commandes
- `npm start` : serveur local sur le port 3000.
- `npm test` : suite complète (récit, fins, sirène, échos, sauvegardes, typographie…).
- `npm run lint`, `npm run build` (synchronise `index.html`), `npm run test:legacy`.

## Documents
- Version en cours : `docs/59/` (CHANGELOG, QA_REPORT, RESUME, PROBLEMES_RESTANTS, TRAITEMENT_AUDITS, FINS).
- Versions précédentes : `docs/58/`, `docs/57/`.
- L’ancien chantier TTS (52.x, abandonné) est décrit dans `docs/archives/TTS_52.md`.
