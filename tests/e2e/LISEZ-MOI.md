# Tests navigateur (facultatifs)

En bref : ces scripts ouvrent le jeu dans Chrome sans écran, prennent des captures et vérifient la console.
Ils demandent Google Chrome et deux petites bibliothèques libres (puppeteer-core, pixelmatch, pngjs).

1. Dans le dossier `tests/e2e`, lancer `npm i puppeteer-core@24 pixelmatch@5 pngjs@7`.
2. `node e2e.cjs ../.. ./captures` : matrice de 10 tailles d'écran, captures + erreurs console.
3. `node e2e-saves.cjs ../..` : reprise d'une sauvegarde 52.5.4, stockage plein, état corrompu.
4. `node perf.cjs ../..` : poids transféré et temps d'affichage du menu (réseau 4G simulé).
5. `node cmp.cjs dossierA dossierB` : compare deux séries de captures (pixels différents).

Le chemin de Chrome est `/usr/bin/google-chrome` ; adapte la ligne `executablePath` sur Windows/Mac.
6. `node e2e-config.cjs ../..` : vérifie que EF_CONFIG tout à false redonne le comportement 53.0.0.
