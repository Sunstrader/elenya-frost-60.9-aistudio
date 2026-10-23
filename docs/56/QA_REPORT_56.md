# Rapport de tests — 56.0.0
Rien n’est déclaré validé sur le lint ou le build seuls. Aucun test n’a été modifié pour masquer un défaut : les cas QA moteur ont été **mis à jour** pour exiger `trio_accord` (et pour ajouter des cas négatifs), ce qui est le comportement correct de la 56.

## Commandes et résultats
| Commande | Résultat |
|---|---|
| `npm run lint` | 0 erreur (exit 0) |
| `npm test` | **20/20 OK** (exit 0) |
| `npm run build` | index.html synchronisé |
| `node tests/sirene-intacte.cjs` | 384 nœuds, identique 54/55.0.1 |
| `node tests/romances-fins-56.cjs` | 12/12 assertions (positifs + négatifs) |
| `node elenya-refonte-52.4/qa/check.cjs` | OK (241 scènes classiques, 16 alias) |
| `node tests/fins-toutes.cjs` | FIN_POLY et FIN_DOMINATION rejouées ; 20 fins distinctes |

## Tests navigateur
Non relancés en 56 (changement moteur/données, pas d’UI). Les captures 55 restent valides pour l’interface. À relancer avant publication.

## Échecs rencontrés puis corrigés
1. Catalogue explorateur : 16 alias au lieu de 15 → compte mis à jour (FIN_DOMINATION).
2. Intent `pouvoir` inconnu sur FIN_DOMINATION → remplacé par `domination`.
3. QA `FIN_POLY` atteignable avec `poly_active` seul → fixture QA corrigée + cas négatifs.
4. Empreinte structurelle → nouvelle baseline `empreinte-56.0.0.json` documentée.
