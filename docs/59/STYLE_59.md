# Style — 59.0.0

Remplace `docs/57/STYLE.md`.

## Tics (audit-final 6)
Comptes par fichier d’acte figés dans `tests/baseline/tics-59.json`. `tests/tics-59.cjs` échoue si un tic progresse (« Personne ne », « Pas encore », « le reste », « quelque chose », « silence »).
Passe 59 : 7 occurrences réécrites (Acte 2, Acte 3, Secondary). Le test empêche la dérive ; il ne remplace pas une relecture humaine.

## Voix
- **Kaelen** : phrases courtes ; lexique de contrat et de dette (réservé, avec la narration quand le thème l’exige).
- **Mira** : gouaille de rue (« J’aime les associés qui sentent le roussi. »), pas de lexique comptable.
- **Alistair** : registre liturgique (« Ce que tu tais, je le garderai comme on garde une veille. »).
- **Séraphine** : franchise militaire. **Veyra** : ironie de marchande. **Fen** : gestes plutôt que mots.

## Sirène
L’intensité émotionnelle et sensuelle de la fièvre est gardée. Les chutes diffèrent : le contrat pour Kaelen, la foi pour Alistair. Le twist est vérifié par `tests/sirene-twist.cjs`.

## Typographie
Espaces insécables avant « : ? ! ; » et dans « … ».
