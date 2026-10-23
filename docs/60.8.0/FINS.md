# État des 36 fins — V60.8.0

Ce que « vérifiée » veut dire ici :
1. **Route rejouée** : une suite de choix figée (`tests/fixtures/routes-fins-60.8.0.json`) est rejouée par le vrai moteur et aboutit à cette fin (`tests/fins-routes-601.cjs`, `tests/fins-toutes.cjs`, dans `npm test`).
2. **Affichée** : l'état final a été chargé dans Chrome (PC 1366×768 et mobile 390×844), puis on a cliqué sur « Continuer ». Le texte de fin s'affiche, sans erreur JS (`qa-608/fins.cjs` ; captures `qa-608/fins/pc-<FIN>.png` et `mobile-<FIN>.png`).

Ce qui n'a **pas** été fait : jouer chaque fin à la main depuis le début, et relire chaque texte de fin pour juger sa qualité. Seule une partie des captures a été regardée à l'œil : FIN_POLY, FIN_SERAPHINE_LAME, GAME_OVER_SCELLEE, avant et après correction. Pour les autres, le contrôle est automatique : texte affiché et aucune erreur JS.

| # | Fin | Mode | Route rejouée (moteur) | Affichée Chrome PC / mobile | Route régénérée en 60.8 | À revoir à la main |
|---|---|---|---|---|---|---|
| 1 | ACTE5_02_DEPART | classic | oui (125 choix) | oui / oui | non | oui : rare ou jamais vue au hasard, parcours de jeu réel à faire |
| 2 | ACTE5_02_RETOUR | classic | oui (126 choix) | oui / oui | non | oui : rare ou jamais vue au hasard, parcours de jeu réel à faire |
| 3 | ACTE5_02_VEILLE | classic | oui (124 choix) | oui / oui | non | oui : rare ou jamais vue au hasard, parcours de jeu réel à faire |
| 4 | FIN_CORONA | classic | oui (131 choix) | oui / oui | non | lecture du texte |
| 5 | FIN_DETTE_ANNULEE | classic | oui (122 choix) | oui / oui | non | lecture du texte |
| 6 | FIN_EQUILIBRE | classic | oui (131 choix) | oui / oui | non | oui : rare ou jamais vue au hasard, parcours de jeu réel à faire |
| 7 | FIN_MIRA | classic | oui (110 choix) | oui / oui | non | lecture du texte |
| 8 | FIN_MORTELLE | classic | oui (118 choix) | oui / oui | non | lecture du texte |
| 9 | FIN_RECONCILIATION | classic | oui (129 choix) | oui / oui | non | oui : rare ou jamais vue au hasard, parcours de jeu réel à faire |
| 10 | FIN_REDEMPTION | classic | oui (134 choix) | oui / oui | non | oui : rare ou jamais vue au hasard, parcours de jeu réel à faire |
| 11 | FIN_SERAPHINE | classic | oui (119 choix) | oui / oui | non | lecture du texte |
| 12 | FIN_SERAPHINE_COEUR | classic | oui (115 choix) | oui / oui | non | oui : rare ou jamais vue au hasard, parcours de jeu réel à faire |
| 13 | FIN_SERAPHINE_LAME | classic | oui (124 choix) | oui / oui | oui | oui : rare ou jamais vue au hasard, parcours de jeu réel à faire |
| 14 | FIN_TEMOIN | classic | oui (122 choix) | oui / oui | non | lecture du texte |
| 15 | FIN_VERITE | classic | oui (117 choix) | oui / oui | non | oui : rare ou jamais vue au hasard, parcours de jeu réel à faire |
| 16 | FIN_VEYRA | classic | oui (118 choix) | oui / oui | oui | oui : rare ou jamais vue au hasard, parcours de jeu réel à faire |
| 17 | GAME_OVER_POSSESSION | classic | oui (109 choix) | oui / oui | non | oui : rare ou jamais vue au hasard, parcours de jeu réel à faire |
| 18 | GAME_OVER_VENIN | classic | oui (75 choix) | oui / oui | non | lecture du texte |
| 19 | FIN_POLY | classic | oui (123 choix) | oui / oui | oui | oui : rare ou jamais vue au hasard, parcours de jeu réel à faire |
| 20 | FIN_DOMINATION | classic | oui (123 choix) | oui / oui | oui | oui : rare ou jamais vue au hasard, parcours de jeu réel à faire |
| 21 | FIN_ECLAIREUR | classic | oui (119 choix) | oui / oui | non | lecture du texte |
| 22 | FIN_OMBRE | classic | oui (131 choix) | oui / oui | non | lecture du texte |
| 23 | FIN_SOLO | classic | oui (106 choix) | oui / oui | non | lecture du texte |
| 24 | GAME_OVER_SIRENE | classic | oui (77 choix) | oui / oui | non | lecture du texte |
| 25 | FIN_SACRIFICE | classic | oui (110 choix) | oui / oui | non | lecture du texte |
| 26 | FIN_BRISEE | classic | oui (120 choix) | oui / oui | non | lecture du texte |
| 27 | GAME_OVER_SCELLEE | classic | oui (101 choix) | oui / oui | oui | lecture du texte |
| 28 | FIN_CHAOS | classic | oui (112 choix) | oui / oui | oui | lecture du texte |
| 29 | GAME_OVER_SURCHARGE | classic | oui (133 choix) | oui / oui | non | lecture du texte |
| 30 | FIN_HIVER | classic | oui (107 choix) | oui / oui | non | lecture du texte |
| 31 | NG_FIN_LIBERATION | ngplus | oui (27 choix) | oui / oui | non | lecture du texte |
| 32 | NG_FIN_VIDE | ngplus | oui (27 choix) | oui / oui | non | lecture du texte |
| 33 | NG_FIN_AMOUR | ngplus | oui (24 choix) | oui / oui | non | lecture du texte |
| 34 | NG_FIN_FRONTIERE | ngplus | oui (23 choix) | oui / oui | non | lecture du texte |
| 35 | NG_FIN_DEUX_MAINS | ngplus | oui (25 choix) | oui / oui | non | lecture du texte |
| 36 | NG_FIN_CYCLE | ngplus | oui (25 choix) | oui / oui | non | lecture du texte |

Pour les NG+, la route de NG_FIN_LIBERATION finit sur la scène NG_FIN_VIDE, avec la variante `variante_NG_FIN_LIBERATION` (le test l'accepte par famille ou variante). Le texte affiché est celui de cette variante.

Revue `revue-608/rapports/routes.md` (indépendante) : 36/36 atteintes en simulation, 0 inaccessible. Il y relève 4 fins vues une seule fois sur 1 500 parties au hasard, et 9 jamais vues au hasard (atteintes par route ciblée).
