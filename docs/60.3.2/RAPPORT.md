# RAPPORT — V60.3.2 (depuis v60.3.1, branche v60.3.2)

Objet : traiter les ré-audits V60.3.1 (`revue-6031/rapports/` : romance 7, QA narratif 7,5, playtest, bible). Les correctifs restent locaux : aucun arc réécrit, aucun identifiant supprimé, pas de narration vocale, sauvegardes compatibles.

Chaque point est prouvé par `tests/correctifs-6032.cjs` (dans `npm test`), sur le moteur réel, avec des parties guidées et des états tirés de ces parties.

## 1. Romance et trio après une domination (romance N1, N3, N7 ; F1 à F5 ; QA n°2 et n°4)
- **Avant.** Chaque condition recopiait ses propres exclusions. « À genoux » (`domination_acte3_O/E`, `domination_path_chosen`) et l'emprise passaient au dôme, à PROPOSER, dans `trioConsenti56_`, dans TENIR, GARDER et ARC57_KAELEN_CONFLIT. FIN_OMBRE et FIN_ECLAIREUR n'excluaient que la domination du même partenaire.
- **Après.** Une seule fonction, `dominationRomance6032_`, appelée partout. **Doctrine retenue : dominer l'un ferme aussi la romance avec l'autre**, qui a été témoin de l'ordre.
- **Preuve.**
  - Rejeu du dernier choix avant le dôme : le témoin déclenche le dôme ; les 6 drapeaux de domination et `possession = 12` le ferment.
  - Au dôme, PROPOSER bascule vers PROPOSER_REFUS.
  - Au Trône, FIN_POLY, FIN_OMBRE, FIN_ECLAIREUR et les deux reconversions sont absentes après chacun des 4 drapeaux d'acte 3 et de crevasse. FIN_OMBRE (témoin offert) se ferme après « À genoux, Alistair ».
  - TENIR et GARDER : témoins offerts, fermés après une domination.
- **Hasard** (1 500 parties, graines 5001 à 6500, même outil `tests/_mesure-6032.cjs` avant et après) :

| Mesure | 60.3.1 | 60.3.2 |
|---|---|---|
| Fin romantique ou FIN_POLY après domination | 5 | **0** |
| Dont romance avec l'autre partenaire | 5 | **0** |
| `trio_accord` après domination | 2 | **0** |
| Tendresses ou PROPOSER choisis après domination | 25 | **0** |

## 2. FIN_POLY et trio consenti (QA n°1, romance N2, N4, N5, N6)
- **Scène `TRIO6032_QUESTION`.** Elle est proposée dans la salle commune et au bivouac de la tempête, seulement si les deux romances sont ouvertes, sans domination, refus, pause ni nuit non réparée, et avec un lien ≥ 4 pour chacun. Les deux disent oui, chacun pour lui (et Kaelen le dit aussi à Alistair). `lisiere_trio_ouvert` n'est posé qu'à ce moment-là. « Retirer la question » ne pose rien.
- **Dôme.** Trois « Oui » explicites. Journal : « L'accord est révocable par chacun… ».
- **FIN_POLY.** Un accord suivi d'une pause donne la variante « L'accord du dôme tient… ». « enchaînés » n'apparaît plus jamais avec `trio_accord`.
- **Preuve.**
  - Partie guidée, graine 208 : chaise libre (oui), puis dôme (oui ×3), puis FIN_POLY, sans « enchaînés » ; même résultat avec une pause.
  - Joueur qui favorise le trio (outil de recherche) : FIN_POLY dans 13 parties sur 600.
- **Limite honnête.** **Au hasard, FIN_POLY reste à 0 sur 1 500** : il faut enchaîner volontairement trois choix rares (la question, le oui au dôme, FIN_POLY parmi 9 au Trône). La question à trois est vue 35 fois, acceptée 18 fois ; `trio_accord` est posé 2 fois (2 aussi en 60.3.1, mais celles-là pouvaient suivre une domination).

## 3. Quête des dettes (QA n°3, playtest n°2)
- **Au seuil du Trône** (ACTE4_08_SEUIL_ETERNITE) :
  - avec les deux dettes entendues : la révélation, puis le choix ;
  - avec une seule : la rendre à celui qu'on a entendu (« dette_rendue_une_6032 », la quête est accomplie) ;
  - si l'on franchit le seuil sans décider : « manquée ».
- **Preuve.** Une dette rendue → accomplie ; seuil franchi → manquée ; deux dettes : révélation, retour au seuil, choix « Rendre » → accomplie.
- **Hasard** (sur 1 500 parties) : la quête démarre dans 485 parties (484 en 60.3.1) :

| État de la quête des dettes | 60.3.1 | 60.3.2 |
|---|---|---|
| Accomplie | 10 | **93** |
| Manquée | 0 | **257** |
| Encore « en cours » à la fin | 474 | **135** |

Les 135 « en cours » sont des parties qui s'arrêtent avant le seuil (game over, par exemple).

## 4. Lignées des fins sans vérité (bible N6)
TEMOIN, EQUILIBRE, RECONCILIATION et DETTE_ANNULEE sont maintenant de la lignée « Les Trônes partagés », avec le cadre « Il peut seulement se partager… ». FIN_REDEMPTION et FIN_VERITE ne changent pas. Au hasard, « Trône de Vérité » ou « cesser de mentir » apparaissait dans **31** de ces fins ; il n'apparaît plus dans **aucune**.

## Tests et fixtures modifiés (honnêtement)
Les gardes ferment des routes figées qui passaient **précisément** par une domination. `tools/regen-fixtures-6032.cjs` ne les régénère que si elles cassent, et enregistre la raison constatée dans `tests/fixtures/regen-6032.json` :
- **Routes de fins :**
  - FIN_POLY : la route d'origine passait par « À genoux, Kaelen » ;
  - FIN_ECLAIREUR : idem ;
  - GAME_OVER_SCELLEE : `POLY_REPARER` après « À genoux, Alistair ».
- **3 échos rares** désynchronisés à ARC57_KAELEN_CONFLIT (crevasse ou acte 3) : de nouvelles routes ont été trouvées pour les trois.
- **Parcours « alistair »** : il passait par `domination_acte3_O`. L'outil avait aussi signalé le parcours NG+, à tort (il l'avait rejoué en mode classique) : la route d'origine est conservée.
- **`sauvegardes-601`** : un choix ne peut disparaître d'une sauvegarde que si celle-ci porte une domination et que ce choix est une romance. Deux retraits sont listés dans la sortie du test : `alistair#123:FIN_ECLAIREUR` et `possession#82:POLY_REPARER`.
- **`correctifs-6031`** : le témoin de la reconversion était tiré d'une partie qui portait `domination_path_chosen`. Ce drapeau est retiré du témoin et la possession y est mise à 0.
- **Empreinte narrative** : nouvel écart enregistré dans `empreinte-60.3.2.json`.
- **Correctif en cours de route** : un commentaire mal placé masquait le texte de PROPOSER. La QA moteur (`check.cjs`) l'a détecté, et il a été corrigé avant le passage final.

Pendant le travail, `node_modules` a été supprimé par erreur (nettoyage d'un worktree temporaire). Les dépendances ont été réinstallées avec `npm install` ; le lockfile est réaligné sur `package.json`.
