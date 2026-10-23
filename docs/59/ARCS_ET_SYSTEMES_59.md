# Arcs, romances et systèmes — 59.0.0

Remplace `docs/57/ARCS_ET_SYSTEMES.md` (gardé pour l’historique).

## Instabilité ≠ possession (seuils 59)
- **Instabilité (givre, 0-60)** : débordement du pouvoir. Jauge visible en bas à gauche (max 58).
  - Premier avertissement à 40 (`AVERTISSEMENT_SURCHARGE`). Second à 50, ou à 46 après deux absorptions (`AVERTISSEMENT_SURCHARGE_2`).
  - La mort (`GAME_OVER_SURCHARGE`, à 58, ou 52 après deux absorptions) exige les deux avertissements et une scène à au moins deux choix réels.
  - Chaque choix qui fait monter ou baisser le givre l’annonce (« ❄ Le givre monte (+N). »).
- **Possession (0-30)** : emprise du Trône sur les autres. Un seul seuil : `POSSESSION_EMPRISE = 12` (`20_Core_Helpers.js`). Il commande à la fois les textes d’emprise (`possedee57_`) et l’ordre « À genoux » (`COND.domination`). L’instabilité seule n’ouvre plus la domination.
- Game over : un bouton « Reprendre avant la chute » recharge l’état sauvé juste avant le choix fatal.

## Ordre de priorité des fins et de l’acte 5 (continuité 14)
1. **Domination active** (`dominationActive59_` : go_poly_domination, domination_finale ou possession ≥ 12 au Trône) : elle exclut FIN_OMBRE, FIN_ECLAIREUR, les fins Séraphine d’amour et les reconversions. À l’acte 5, la réplique « Je reste pour le trône. Pas pour le reste. » l’emporte sur une romance réelle. C’est voulu : une romance ne survit pas à un ordre.
2. **Ruptures** (romance_*_rompue, seraphine_rompue_57) : elles ferment la fin d’amour du personnage.
3. **Trio consenti** (`trioConsenti56_` : trio_accord sans domination) : FIN_POLY lit d’abord la branche consentie ; double_jeu n’ajoute qu’une ligne de mémoire.
4. **Romance simple**, puis **amitié**, puis **solo**.

## Épilogues (audit-final 3)
Chaque fin qui ouvre l’acte 5 a son passage et sa clôture (`EPILOGUE59`, 23_Refonte.js). L’épilogue garde au plus trois échos.
FIN_SOLO, FIN_HIVER et FIN_SACRIFICE sont terminales : leur texte tient lieu de clôture.

## NG+ (qa 14)
À une fin classique, en plus de `last_classic_end:*`, le jeu garde `last_classic_lien:*` (trio_accord, seraphine_rompue_57, liens_brises, kaelen_mort, alistair_mort, domination_finale). NGP_01_SEUIL relit le trio, la rupture et l’absence.

## Arcs et romances
Inchangés depuis 57-58, sauf :
- **Sirène** : le twist reste (réveil auprès du « mauvais » partenaire). Plus d’asservissement au réveil ; trois choix ensuite (assumer, libérer, avancer). Le refus de la sirène est valorisé.
- **Séraphine** : la rupture amoureuse n’est proposée que si une romance existe ; sinon on se sépare.
- **Inquisition** : bras armé de l’Ordre du Soleil (Codex).
