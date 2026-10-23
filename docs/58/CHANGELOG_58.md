# Journal des changements — 58.0.0 (depuis 57.0.0)

## Récit : vraies branches
- 11 scènes classiques 58 (ARC58_*) : la serrure d’Alistair et son absence, la poterne de Silas, la tempête rendue, l’emprise lâchée, Veyra témoin, l’épilogue du village (4 variantes selon le grain), les trois noms de Kaelen, la prière d’Alistair, la liste de Séraphine, la crête en solo.
- 3 scènes NG+ 58 : le ravin revu, la première Elenya, Kaelen sans contrat.
- Les choix d’entrée utilisent la clé `V58_<id>`, ajoutée aux scènes existantes. Aucune clé ancienne n’est modifiée.

## Sirène (ACTE3_03B → 06)
- Séquence réécrite : rythme, indices loyaux (les deux reflets, le médaillon froid), et une fièvre intense jusqu’à l’ellipse finale (version D).
- La fièvre ne repose plus sur la domination subie.
- Le retournement est intact : on se réveille à côté de l’autre.
- Les ID de scènes, les clés et les drapeaux sont inchangés : les sauvegardes prises dans la séquence restent valides.

## Échos
- Audit d’atteignabilité (`tools/qa-550/echos-atteints.cjs`), qui combine des parties aléatoires, le graphe (choix, retours, déclencheurs) et le rendu.
- 26 échos qui ne pouvaient pas s’afficher ont été reciblés vers une scène vue après leur drapeau. Parmi eux :
  - la graine de Veyra de l’acte 1, déplacée vers LIEN_MARCHE_1 ;
  - les échos NG_09, déplacés vers NGP_13 ;
  - `oraya_pardonne`, remplacé par `oraya_pardonnee`, le drapeau réellement normalisé.
- ARC58_VEYRA_TEMOIN est maintenant atteignable : son entrée a été déplacée du Trône vers ACTE4_09_ISSUES_SECONDAIRES, après le dernier pacte.
- Résultat : 0 écho inaccessible. 32 textes restent rares (routes étroites), ils sont atteignables mais n’ont pas été vus dans 200 parties aléatoires.

## Style
- Le comparatif COMPARATIF_58 présente 2 à 3 versions par scène clé, plus la sirène (versions A, B, C et D).
- Tics de langage réduits voix par voix.

## Tests
- `sirene-twist.cjs` remplace `sirene-intacte.cjs`.
- Ajouts : `recit-58.cjs` (dont Veyra témoin), le test d’échos et la fixture `routes-fins-58`.
- `recit-57` vérifie désormais la graine de Veyra là où elle s’affiche réellement : l’ancien test lisait une scène de redirection jamais montrée en jeu.

## Documents
- ILLUSTRATIONS_A_PRODUIRE (23 fiches, sans image produite), DEPLOIEMENT, RETOUR_ARRIERE.
