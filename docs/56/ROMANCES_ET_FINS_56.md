# Romances et fins — 56.0.0

## Distinctions
| Notion | Signification | Ne donne PAS |
|---|---|---|
| Présence | compagnon vivant, pas perdu | romance, fin amoureuse |
| Affinité / lien (jauges) | proximité mesurée | consentement, trio |
| Attachement | drapeaux d’intérêt / romance réelle | fin si rupture |
| État relation | pause, amis, rompue | — |
| Consentement explicite | `trio_accord` (les 3 ont dit oui) | — |
| Éligibilité fin | conditions du choix au Trône | — |

## FIN_POLY (Ligne commune)
- Texte : « Rester avec tous les deux. Ensemble — parce qu’ils l’ont choisi aussi. »
- Conditions : `trioConsenti56_` → `trio_accord`, pas de rupture, pas de domination, liens ≥ 3, les deux présents.
- Négatif : `poly_eligible` / jauges max → **pas** de FIN_POLY.

## FIN_DOMINATION (Les Satellites)
- Texte : « Les garder. Les deux. Comme des satellites. »
- Conditions : `go_poly_domination` ou `domination_finale`.
- Alias → `FIN_HIVER` (variante). Jamais présentée comme romance heureuse.
- Si `trio_accord` + domination : FIN_POLY fermée, FIN_DOMINATION ouverte.

## Rupture
- `romance_X_rompue` ferme : intimité, FIN du compagnon, FIN_POLY, reconversion.
- Ne ferme pas : présence, alliance, choix politiques.
- Survive au save/load.

## Parcours de test couverts
Solo, Kaelen, Alistair, rupture avant fin, domination, trio consenti, jauges sans accord (négatif), reconversion bloquée, save/load rupture. Pause/réparation : héritées de 55 (Fêlure). Instabilité/possession hautes : chemins domination / hiver existants.
