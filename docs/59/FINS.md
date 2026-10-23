# Fins — tableau unique (59.0.0)

**9 fins principales + 1 secrète + 2 NG+**, plus les variantes (anciennes fins gardées comme alias) et les game over.

| Fin principale | Acte 5 | Variantes (drapeau `variante_<id>`) |
|---|---|---|
| FIN_OMBRE (Kaelen) | oui | — |
| FIN_ECLAIREUR (Alistair) | oui | — |
| FIN_SERAPHINE_COEUR | oui | FIN_SERAPHINE |
| FIN_POLY « Ni l’un sans l’autre » | oui | — |
| FIN_SOLO | non (terminale) | FIN_MIRA |
| FIN_VERITE | oui | FIN_RECONCILIATION, FIN_REDEMPTION, FIN_EQUILIBRE, FIN_DETTE_ANNULEE, FIN_TEMOIN |
| FIN_HIVER | non (terminale) | FIN_SERAPHINE_LAME, FIN_VEYRA, FIN_DOMINATION (titrée « Domination ») |
| FIN_SACRIFICE | non (terminale) | FIN_MORTELLE |
| FIN_BRISEE | oui | FIN_CHAOS |

- **Secrète** : FIN_CORONA.
- **NG+** : NG_FIN_LIBERATION « La Fin du Cycle » (variantes NG_FIN_AMOUR, NG_FIN_DEUX_MAINS, NG_FIN_FRONTIERE, NG_FIN_VIDE) et NG_FIN_CYCLE « Le Roi du Recommencement » (`FINS54_NG_GROUPES`).
- **Épilogues de l’acte 5** : ACTE5_02_DEPART, ACTE5_02_RETOUR, ACTE5_02_VEILLE.
- **Game over** : SURCHARGE, VENIN, POSSESSION, SIRENE, SCELLEE, avec un bouton « Reprendre avant la chute ».

Source : `FINS54_GROUPES` / `FINS54_PRINCIPALES` (23_Refonte.js). Vérifié par `tests/fins-toutes.cjs`.
