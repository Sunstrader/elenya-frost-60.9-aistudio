# TESTS — V60.3.2

| Commande | Résultat réel | Où |
|---|---|---|
| `npm test` (lot rapide) | **46/46 OK** (45 + `correctifs-6032`), 97,5 s, après la dernière modification | `tests/t6032.log` |
| `npm run lint` / `npm run build` | aucune erreur / `index.html` synchronisé | — |
| `npm run test:e2e` (Chrome headless) | **8/8 OK** : e2e 212 s, saves 18 s, recit-57 88 s, fenetres-1 529 s, fenetres-2 193 s, visuel-60 40 s, visuel-601 54 s, visuel-602 289 s | `tests/e2e6032.log` |
| ZIP décompressé à neuf (`npm install` puis `npm test`) | voir `tests/fresh6032.log` dans le ZIP | ZIP |

Pendant la mise au point :
- un commentaire mal fermé avalait le texte de PROPOSER : détecté par `check` (hardErrors), corrigé ;
- plafond de tics « silence » dépassé dans l'Acte 3 par un commentaire : reformulé ;
- des routes fixes passaient par une domination puis par une romance (fuite désormais bloquée) : fixtures régénérées (`tools/regen-fixtures-6032.cjs`, raisons dans `tests/fixtures/regen-6032.json`) ;
- `sauvegardes-601` : une clé romance disparue n'est admise que si la sauvegarde porte une domination ; les retraits sont listés ;
- empreinte narrative : nouvelle référence `baseline/empreinte-60.3.2.json` (écart documenté) ;
- e2e : 5 suites échouaient faute de `node_modules` (environnement, pas le jeu) ; après `npm install`, 8/8 OK.
Aucun test n'a été désactivé.

## Nouveau test : `tests/correctifs-6032.cjs`
Fuites romance/trio après domination, trio consenti au dôme (oui explicites, sans « enchaînés »), FIN_POLY atteinte (graine 208), quête de la dette (manquée / accomplie), lignée des fins sans vérité.

## Mesures (hors `npm test`)
`node tests/_mesure-6032.cjs 1500` (graines 5001–6500) : tableau avant/après dans RAPPORT.md.

## Non vérifié
- Pas de capture dédiée de la scène `TRIO6032_QUESTION` ni des choix DETTE6032 au Seuil.
- FIN_POLY reste à 0/1500 en jeu aléatoire (13/600 en jeu guidé).
