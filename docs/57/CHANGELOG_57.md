# CHANGELOG 57.0.0 (depuis 56.0.0)

## Conséquences des drapeaux
- Les 98 drapeaux A/B qui n’étaient pas lus sont maintenant reliés à une conséquence perceptible (128 échos, classique et NG+).
- `tools/qa-550/flags57.cjs` donne A=0 et B=0. Les 45 drapeaux C sont documentés dans `FLAGS_C.md`.

## Arcs
- **Veyra** : semée dès les actes 1-2 (couronne barrée, colporteuse) ; un choix final « d’égale à égale » est réservé à qui l’a écoutée tôt.
- **Fen/Kalthar** : indices précoces (le ravin, la chanson, les ruines), recadrés en NG+ (la fresque, le choix « Tu connaissais le chemin »).
- **Alistair** : son erreur coûteuse est avouée (il a dénoncé ta position à l’Ordre). Elenya peut lui faire promettre de ne plus décider à sa place, ce qui se vérifie à l’acte 4, ou couper, ce qui a un coût.
- **Kaelen** : gestes répétés, et conflit autour de la lettre-contrat (résolution ou pause).
- **Silas** : son jeton ouvre la poterne à l’acte 4, puis une route de contrebande dans l’épilogue.
- **Mira, Lyra, Oraya** : conséquences dans l’épilogue. Le pardon d’Oraya n’efface rien, et en NG+ on peut témoigner sans absoudre.
- **Dilemme politique** : le grain du village, avec 3 issues imparfaites plus 1 issue de possession.

## Romances
- **Séraphine** : conflit (sa liste de noms), pause, réparation ou rupture. La rupture ferme tous ses choix romantiques.
- **Kaelen et Alistair** : leurs réactions à une rupture sont maintenant écrites.
- **Solo** : un écho de force au Trône.

## Instabilité et possession
- Ce sont désormais deux systèmes distincts, avec des seuils, des textes, des perceptions des personnages et des solutions propres à chacun, en positif comme en négatif.
- `endingSeeds.possession` ne contient plus l’instabilité (avant, les deux étaient additionnées).

## NG+
- 3 choix conditionnés par le savoir acquis : le ravin, témoigner, nommer l’architecte.
- Les scènes sont recadrées.

## Style
- La formule « pour la première fois » passe de 41 à 26 occurrences.

## Tests
- Ajout de `tests/recit-57.cjs` et `tests/parcours-57.cjs` (les 9 parcours) ; le total passe à 22 tests.
- `check.cjs` : 29 contrôles.
- Empreinte 57.

## Structure
- Structure à l’exécution : 251 scènes classiques (+10 : 5 annexes, 5 transitions propres aux choix 57) et 82 NG+ (+2). Base brute inchangée : 241/80.
