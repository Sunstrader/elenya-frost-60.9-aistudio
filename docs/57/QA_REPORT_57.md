# RAPPORT QA — 57.0.0 (vérifié sur la machine de travail, 14/10/2026)

| Contrôle | Résultat |
|---|---|
| `npm test` | 22/22 OK (dont récit 57, 9 parcours, sirène, sauvegardes 52.5.4, singe 300+100, toutes les fins, typographie) |
| `npm run lint` | 56 fichiers, 0 erreur, 0 avertissement |
| `npm run build` | OK (index.html, 400 297 octets) |
| `qa/check.cjs` | ok : 29 contrôles |
| `tools/qa-550/flags57.cjs` | 601 drapeaux posés, 556 relus ; A=0, B=0, C=45 (documentés) |
| `tools/qa-550/echos57.cjs` | 128 échos, 0 scène cible manquante |
| Sirène | 384 nœuds identiques à la 55.0.1 / 54.0.0 |
| 9 parcours (`tests/parcours-57.cjs`) | solo → FIN_SOLO ; Kaelen → FIN_OMBRE ; Alistair → FIN_ECLAIREUR ; rupture → FIN_SERAPHINE_COEUR ; pause → FIN_BRISEE ; instabilité → FIN_SOLO ; possession → FIN_HIVER ; domination → FIN_HIVER (variante) ; NG+ → NG_FIN_LIBERATION. Parties jouées de bout en bout, sans état injecté |
| E2E navigateur, 10 tailles (360×640 à 3840×2160) | 0 erreur console, 0 débordement horizontal |
| E2E fenêtres, 10 tailles | 0 erreur, 0 fenêtre KO |
| E2E sauvegardes (reprise 52.5.4, stockage plein, sauvegarde corrompue) | OK, 0 erreur |
| E2E récit 57 (sauvegarde réelle du parcours instabilité, 3 tailles) | écho affiché, choix « tempête » affiché, scène suivante affichée, 0 erreur |

## Défaut trouvé et corrigé en 57
Un bloc CSS se trouvait hors de `<style>` dans `Cinematic_UI_Landscape.html` (avec un « \n » littéral). Il s’affichait en haut de l’écran lors de la reprise d’une sauvegarde. Il existait déjà avant la 57 ; il est corrigé et vérifié sur les captures.
