# Elenya Frost 56.0.0 — résumé
Base : v55.0.1 (conservée comme point de retour). Travail sur la branche `v56.0.0`. Rien n’a été publié.

## Priorité absolue (faite et testée)
1. **FIN_POLY = trio consenti seulement.** Condition : `trio_accord` + les deux présents + liens ≥ 3 + aucune rupture + aucune domination. Les jauges seules (`poly_eligible`, `poly_active`) ne suffisent plus.
2. **FIN_DOMINATION séparée.** Nouveau choix au Trône (« Les garder. Les deux. Comme des satellites. ») → scène `FIN_DOMINATION`, variante de L’Ère de Glace (`FIN_HIVER`). Texte distinct : ordre, pas accord.
3. **Rupture non rouverte.** `romanceAvailableO/E` refuse si `romance_X_rompue`. Toutes les options romantiques (intent romance, scènes intimes, FIN_OMBRE/ECLAIREUR/POLY, reconversion) sont verrouillées. Alliance et présence restent possibles. Vérifié après save/load (round-trip JSON).
4. **Tests positifs et négatifs** : `tests/romances-fins-56.cjs` + cas négatifs dans `90_QA.js` (visibilité des fins).

## Choix = conséquences (fait, partiel)
- Carte des drapeaux : `FLAGS_MAP_56.json` (442 posés, 336 relus, 130 jamais relus → 61 A, 9 B, 60 C).
- **18 échos** relient des drapeaux A/B déjà posés (Mira, Lyra, joute, bivouac, larme de Kalthar, fragments, dettes, refus, jalousie, main tendue…) sans inventer des dizaines de scènes.
- ~100 drapeaux restent sans relecture (surtout C et une partie de A NG+).

## Narration / personnages / NG+ (limité)
- Pas de nouvelle réécriture massive d’arcs : la carte blanche a été concentrée sur la priorité absolue et les conséquences.
- NG+ : structure inchangée (2 fins). Les drapeaux NG+ non relus sont listés dans la carte ; pas de nouvelle couche NG+ dans cette livraison.
- Sirène + twist du réveil : **identiques octet à octet à la 55.0.1** (test `sirene-intacte.cjs` : 384 nœuds).

## Technique
- Version 56.0.0. Source de vérité = fichiers du projet. `npm run build` synchronise `index.html`.
- Pas de narration vocale (conservé depuis 55).
- Sauvegardes 52.5.4 / 53 / 54 / 55 : compatibles. Les anciens états avec `poly_eligible` sans `trio_accord` ne voient plus FIN_POLY (voulu). Une domination mène désormais à FIN_DOMINATION.

## Non fait (honnêtement)
- Approfondissement narratif large (Elenya/Oraya/Veyra/Silas/Lyra/Mira) au-delà des échos.
- NG+ « nouvelle compréhension » renforcée.
- Relire / câbler les ~100 drapeaux restants.
- Relecture humaine. Nouvelles illustrations.
- Tests navigateur e2e non relancés en 56 (seuls moteur + lint + build + sirène + romances/fins). Relancer recommandés avant publication.
