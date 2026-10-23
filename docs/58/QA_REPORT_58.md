# Rapport QA — 58.0.0
Toutes les commandes ont été exécutées sur la boîte, le 15/10/2026.

| Vérification | Résultat |
|---|---|
| `npm test` | 24/24 OK. Inclut le singe (300 parties classiques + 100 NG+), toutes les fins (20 distinctes), les 9 parcours, `recit-57`, `recit-58`, `sirene-twist`, les échos et l’empreinte 58. |
| `npm run lint` / `build` | OK (index.html : 400 297 octets) |
| `test:legacy` (dont `check.cjs` 241/80, 195 choix NG+) | OK |
| `flags57` | 634 drapeaux posés, A = 0, B = 0, C = 45 |
| Échos (`echos-atteints`, 200 parties + graphe + rendu) | 172 textes, 0 inaccessible, 32 rares |
| Sirène | Rêve Kaelen → réveil Alistair ; rêve Alistair → réveil Kaelen. Clés et drapeaux de la 55.0.1 inchangés, reprise de sauvegarde à chaque scène de la séquence. |
| Navigateur, 10 tailles (de 360×640 à 3840×2160) | e2e OK, 0 erreur console, pas de débordement horizontal |
| Fenêtres (Paramètres, Parcours, Codex, Musiques), 10 tailles | 0 KO. Lancé en deux passes : la première a été coupée par le délai après 6 tailles, la seconde a couvert les 4 restantes. |
| Sauvegardes (52.5.4, stockage plein, état corrompu) | OK |
| e2e récit 57 (3 tailles) | OK |

Les captures sont hors du ZIP, dans `/workspace/elenya-remaster/captures-58`.
