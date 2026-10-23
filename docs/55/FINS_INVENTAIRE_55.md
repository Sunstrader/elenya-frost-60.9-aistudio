# Inventaire des fins — 55.0.0
Structure inchangée depuis la 54 : 9 fins principales, 1 fin secrète (Corona), 2 fins NG+, plus des morts prématurées.
Le choix final se fait à ACTE4_09_TRONE_EBENE (et à ACTE4_09_ISSUES_SECONDAIRES pour les issues secondaires).
Nouveau en 55 : une **rupture** (`romance_X_rompue`, issue « Finir » de la Fêlure) ferme la fin romantique du compagnon et la fin du trio.

| # | Fin principale | Id | Conditions principales (code réel) | Variantes |
|---|---|---|---|---|
| 1 | Trône des Cendres (Kaelen) | FIN_OMBRE | Kaelen présent, consort_kaelen, lien_O ≥ 4, affinité Ombre ≥ Éclaireur, plus un acte fort (joute gagnée, domination, nuit) ou lien_O ≥ 6 ; **pas de rupture**. Variante solo : voie solo, Kaelen absent mais vivant, présence ≥ 8 ou affinité ≥ 10, lien ≥ 3 | reconversion solo |
| 2 | La Cage Dorée (Alistair) | FIN_ECLAIREUR | Mêmes règles, du côté d’Alistair (consort_alistair, lien_E ≥ 4…) ; **pas de rupture** | reconversion solo |
| 3 | La Lampe et le Givre (Séraphine) | FIN_SERAPHINE_COEUR | seraphine_amour, et pas de possession ≥ 10 sans lame brisée | FIN_SERAPHINE (alliée, seraphine_position_finale) |
| 4 | Ligne Commune (trio) | FIN_POLY | poly_eligible avec lien_O ≥ 3 et lien_E ≥ 3, ou fin par domination ; **aucune rupture** | — |
| 5 | Ligne de Fuite | FIN_SOLO | voie_solo et fin_solo | FIN_MIRA (route sans nom vécue + fuite acceptée) |
| 6 | Le Trône de Vérité | FIN_VERITE | verite_complete, nom prononcé (fragment 4), Oraya pardonnée ou ignorée, instabilité < 20, pas de domination finale | Réconciliation (douceur, instabilité < 10, affinités proches à 3 près, aucune domination) ; Rédemption (Oraya pardonnée, Lyra libérée, Fen accepté, douceur) ; Équilibre (les deux présents, reliques complètes…) ; Dette annulée ; Témoin |
| 7 | L’Ère de Glace | FIN_HIVER | instabilité ≥ 15, et voie solo ou les deux liens ≤ 2 | Veyra (veyra_position_finale) ; Séraphine-Lame (amour + possession ≥ 10, lame non brisée) |
| 8 | La Couronne Rendue | FIN_SACRIFICE | lien_O ≥ 3 ou lien_E ≥ 3 | FIN_MORTELLE (instabilité ≤ 14) |
| 9 | Fin brisée | FIN_BRISEE | toujours proposée (issue par défaut) | FIN_CHAOS (instabilité ≥ 30) |
| secrète | Corona Glacialis | FIN_CORONA | corona_position_finale + corona_comprise (vision vue, mémoire de Kalthar ≥ 10, volonté ≥ 6) | — |
| NG+ 1 | La Fin du Cycle | NG_FIN_LIBERATION | « Avancer sans couronne » | Amour, Deux mains, Frontière, Vide |
| NG+ 2 | Le Roi du Recommencement | NG_FIN_CYCLE | Kalthar refusé et possession ≥ 8 | — |

Morts prématurées (inchangées) :
- GAME_OVER_SURCHARGE ;
- GAME_OVER_SIRENE (séquence non modifiée) ;
- GAME_OVER_VENIN (un dernier sursis, depuis la 54) ;
- GAME_OVER_POSSESSION ;
- GAME_OVER_SCELLEE.

## Vérification
`tests/fins-toutes.cjs` rejoue un parcours réel vers chaque fin rare (fichier `tests/fixtures/routes-fins-55.0.0.json`, régénéré pour la 55). Il joue aussi 300 parties classiques et 100 NG+.
Résultat : 20 fins distinctes atteintes, 18/18 fins classiques, 19 parcours rejoués.
