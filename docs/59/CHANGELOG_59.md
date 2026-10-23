# CHANGELOG 59.0.0

Base : v58.0.0. Objet : corriger les six audits V58 (détail point par point dans `TRAITEMENT_AUDITS.md`).

## Critiques
- La domination exclut les fins romance (FIN_OMBRE, FIN_ECLAIREUR, Séraphine d’amour) et les reconversions. Il n’y a plus qu’un seuil d’emprise (12).
- La rupture avec Séraphine ferme ses fins d’amour.
- Les indices Oraya ne révèlent plus rien avant la stèle.
- Surcharge : deux avertissements, une mort qui ne tombe jamais sur une transition, une jauge du givre visible, un retour « ❄ » à chaque choix, et un bouton « Reprendre avant la chute ».
- Venin : CAUTERISER ne fait plus monter le givre, et la mort ne tombe que sur une scène à choix réels.
- Sirène : le réveil se fait sans asservissement, avec trois choix ensuite, et le refus est valorisé. Les fièvres ont des voix distinctes, l’intensité est gardée et le twist est intact.
- FIN_POLY : la branche consentie passe en premier ; titre « Ni l’un sans l’autre ».

## Majeurs et autres
- Le trio est plus atteignable ; les épilogues lisent le trio consenti.
- 16 échos relisent les drapeaux porteurs ; le fragment Kalthar jeune s’atteint à mémoire 4.
- Continuité : `kaelen_reste` et `alistair_reste` sont posés ; Alistair libre ou absent dans les fins Séraphine et Vérité ; ERREUR_SCENE ramène à la dernière scène connue.
- Chaque fin qui ouvre l’acte 5 a son épilogue propre, avec 3 échos au plus.
- Ouverture réécrite ; les « sept pointes » sont relues au Trône.
- Bible : PRYMAËLIS expliqué (ancienne graphie, gardiennes du lieu) ; ambre = relique ; Fen n’agit plus sur la mémoire ; Inquisition = bras armé de l’Ordre ; entrées Codex Oraya et Trône.
- NG+ : héritage relationnel `last_classic_lien:*`.
- FIN_DOMINATION est titrée « Domination » ; ENTREE_SANCTUAIRE a une image.
- Voix : Mira et Alistair ; passe anti-tics avec plafonds.
- UI entièrement en français ; version unique 59.0.0 ; en-têtes de DB exacts ; copie morte archivée.
- Outils QA : graines décorrélées, clé `non_vus_aleatoire`, fins NG+ inspectées en mode NG+.

## Tests ajoutés
`tests/audits-59.cjs` (14 blocs), `tests/version-unique.cjs`, `tests/entetes-db.cjs`, `tests/tics-59.cjs`. Fixtures regénérées : `parcours-59.0.0.json`, `routes-fins-59.0.0.json`, `baseline/empreinte-59.0.0.json` (écart voulu). Une seule exception documentée dans le test des sauvegardes 52.5.4 : en domination, la reconversion n’est plus proposée.
