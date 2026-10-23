# Rapport QA 59.0.0

Les commandes ont été lancées en local sur le box. Rien n’a été déployé.

| Contrôle | Résultat |
|---|---|
| `npm test` (28 tests) | ✅ 28/28 |
| `npm run -s lint` / `build` / `test:legacy` | ✅ / ✅ (index.html synchronisé) / ✅ |
| `tests/audits-59.cjs` (14 blocs de régression) | ✅ |
| `node tools/qa-550/flags57.cjs` | A=0, B=0, C=31 (traces documentées), N=0 |
| Échos (`echos-atteints.cjs`) | 189 textes. Non vus au hasard : 33 en 200 parties (23 en 3 000). Inaccessibles : 0 |
| Fins (`fins-toutes.cjs`) | 18/18 fins classiques déclarées atteintes, 20 fins distinctes, 23 parcours rejoués |
| 9 parcours exigés | ✅ (fixtures regénérées : `parcours-59.0.0.json`) |
| Sauvegardes 52.5.4 | ✅ 115 sauvegardes (une exception documentée : en domination, la reconversion n’est plus proposée) |
| Sirène (twist) | ✅ rêve Kaelen → réveil Alistair ; rêve Alistair → réveil Kaelen |
| E2E navigateur, 10 tailles (`e2e.cjs`) | ✅ aucune erreur console, pas de débordement |
| E2E fenêtres (`e2e-fenetres.cjs`, 2 lots de 5 tailles) | ✅ 10/10 tailles : 0 erreur, 0 fenêtre KO |
| E2E sauvegardes (`e2e-saves.cjs`) | ✅ reprise, stockage plein, état corrompu |
| E2E récit 57 (`e2e-57.cjs`) | ✅ 3 tailles |
| E2E 59 (`qa-tools/e2e-59.cjs`, nouveau) | ✅ jauge « ❄ Givre : dangereux » visible ; bouton « Reprendre avant la chute » présent ; un clic recharge l’état d’avant la chute, qui passe par l’avertissement attendu |

## Partie au hasard (300 classiques + 100 NG+, test du singe)
Fins : GAME_OVER_SIRENE 56, GAME_OVER_SCELLEE 55, FIN_BRISEE 46, GAME_OVER_SURCHARGE 43 (contre 75/300 en V58), GAME_OVER_VENIN 36, FIN_SACRIFICE 24, FIN_HIVER 20, FIN_SOLO 7, FIN_OMBRE 5, FIN_SERAPHINE_COEUR 4, FIN_VERITE 3, FIN_POLY 1. NG+ : 96 LIBERATION, 4 CYCLE.
Le joueur au hasard choisit souvent ABANDON ou SUBMIT, qui annoncent pourtant leur issue : ces game over restent nombreux au hasard. Un joueur réel est prévenu, et peut reprendre avant la chute.

## Limites
- Rien n’a été vérifié dans un déploiement Apps Script réel. Le serveur local (`server.js`) a servi de substitut.
- La capture du game over montre l’invite plein écran par-dessus l’écran. Le bouton est vérifié dans le DOM (visible, cliquable), pas à l’œil.
- Les tics sont plafonnés, pas relus par un humain.
