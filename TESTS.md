# TESTS — V60.8.0

| Commande | Résultat réel | Journal |
|---|---|---|
| `npm test` (lot rapide) | **49/49 OK**, 123,8 s, après la dernière modification | `tests/t608.log` |
| `npm run test:e2e` (Chrome headless) | **8/8 OK** : e2e 214 s, saves 18 s, recit-57 91 s, fenetres-1 159 s, fenetres-2 200 s, visuel-60 41 s, visuel-601 56 s, visuel-602 145 s | `tests/e2e608.log` |
| `npm run build` | `index.html` synchronisé | — |

Nouveaux tests (inscrits dans `run-all`) :
- `tests/rythme-608.cjs` : choix uniques < 38 % (mesure : 34,2 %), fusions traversées, 30 sauvegardes réelles 60.3.2 et 60.7.0 sur les scènes fusionnées (rechargement, chaque choix, jusqu'à une fin), 11/11 drapeaux R608 relus, aucun choix vers une scène fusionnée, Sceau borné, indice LAME.
- `tests/romance-608.cjs` : refus sans punition, oui de chacun (chaise libre, dôme), refermer, baiser fermé sous emprise, moments R608 fermés par la domination.
- `tests/sauvegardes-608.cjs` : purge NG+ (B1) et scène inconnue (M1). Échoue sur l'ancien code, vérifié.

Tests modifiés, sans aucune assertion retirée :
- pointés vers les fixtures 60.8.0 : fins-routes-601, fins-toutes, echos-rares-601, echos-erreurs-602, morts-602, parcours-57, e2e-57, visuel-602 ;
- correctifs-6032 : rejoue d'abord la route figée FIN_POLY, avec la recherche guidée en secours. La question posée au bivouac (TRIO6033_BIVOUAC, 60.3.3) compte comme la chaise libre. Le témoin retire 2 drapeaux posés plus tard, à l'acte 4 ;
- empreinte : base `baseline/empreinte-60.8.0.json` documentée.

Fixtures régénérées par `tools/regen-fixtures-608.cjs` et `tools/regen-parcours-608.cjs` ; ruptures et graines dans `tests/fixtures/regen-608*.json`. Les échos rares gardent la même couverture que la 60.3.2 (72 rejoués, 83 sans route).

Contrôles visuels réels (Chrome) : voir `docs/60.8.0/CONTROLES_VISUELS.md`.
