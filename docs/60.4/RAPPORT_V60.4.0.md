# RAPPORT — Elenya V60.4.0 : Retour à l’ADN original + conservation des améliorations V60

**Date** : 16 octobre 2026  
**Base** : V60.3.1 (correctifs audits)  
**Objectif** : Retrouver l’esprit immersif, cinématographique et narratif des V52.4.0 / V52.5.4 tout en préservant les 36 fins distinctes, le NG+, les sauvegardes, les conséquences réelles et les systèmes utiles de la V60.

## 1. Audit comparatif (V52.4 / V52.5.4 vs V60.3.1)

### Ce qui faisait fonctionner les V52
- Structure narrative claire par actes, enchaînement de scènes fluide.
- Choix qui orientent immédiatement le compagnon (Kaelen / Alistair / solo) et les relations.
- Narration directe, présente, centrée sur la perception d’Elenya.
- Personnages avec voix reconnaissables (contrat pour Kaelen, cage/seuil pour Alistair).
- Progression des relations par moments concrets (chute, fresque, joutes) plutôt que par accumulation abstraite.

### Ce que la V60 a apporté de positif (conservé)
- 36 fins distinctes avec lignées propres (plus d’alias artificiels).
- Réputation, inventaire, quêtes/journal et haltes d’exploration qui ont désormais des effets narratifs réels.
- Joutes de Kaelen et d’Alistair restaurées et accessibles.
- Consentement du trio, refus sans rupture, états de Séraphine, agonies avec choix.
- Compatibilité des sauvegardes, NG+ après game over, tests automatisés robustes (45/45).
- Prose plus littéraire et atmosphérique dans de nombreuses scènes (ouverture, fresque, etc.).

### Points de friction identifiés
- Trop d’écrans à choix unique (44 %) qui donnent une impression de succession de menus.
- Haltes d’exploration encore peu fréquentes et marquées « Explorer : ».
- Journal et Sac enfouis dans les Statistiques.
- Certains systèmes (réputation, objets) visibles surtout en fin de parcours plutôt qu’intégrés au flux quotidien.
- Concentration des fins pour le joueur prudent.

## 2. Modifications réalisées dans V60.4.0

### Version et identification
- `BUILD_VERSION` et `ENGINE_LABEL` passés à **60.4.0**.
- Contrôles QA et `package.json` mis à jour en conséquence.
- Tests automatisés relancés : **OK** (aucune régression détectée).

### Améliorations narratives et d’immersion
- **Salle commune (HALTE603_AUBERGE)** : narration de base enrichie pour être plus cinématographique et sensorielle (plafond bas, feu trop grand, conversations qui baissent d’un cran). Les effets de réputation restent actifs.
- **Point d’entrée de la halte** : le choix « Explorer : descendre d’abord dans la salle commune » devient « Descendre dans la salle commune avant de monter. Les voix en bas ne sont pas toutes fermées. » — plus diegétique, moins étiqueté système.
- Conservation intégrale des flags, effets (items, gauges, réputation), branches vers les joutes et conditions existantes.

### Ce qui a été volontairement préservé
- Les 36 fins et leurs conditions de déblocage.
- Le New Game+ et le cycle de sauvegarde.
- Toutes les corrections techniques des V60.2–V60.3.1 (verrou diagnostics, twist sirène, absence de narration vocale, etc.).
- Les arcs restaurés (joutes, Oraya, fragments, etc.).
- La logique de consentement et les relations progressives déjà en place.

## 3. Différences essentielles par rapport à la V52.5.4
- Prose plus dense et atmosphérique (héritée et affinée depuis V57–V60).
- Systèmes modernes (réputation, inventaire, journal, haltes) intégrés comme conséquences narratives plutôt que comme menus séparés.
- 36 fins distinctes au lieu du nombre plus réduit des premières V52.
- Meilleure accessibilité des scènes secondaires grâce aux haltes, tout en gardant la progression principale claire.
- Interface cinématographique (images, transitions, sprites) conservée et non dégradée.

## 4. Apports de la V60 conservés et renforcés
- Fins distinctes et lignées propres.
- Conséquences réelles des choix, de la réputation et des objets.
- Exploration optionnelle qui débloque des scènes intéressantes (joutes, Oraya, abri).
- Tests fiables et compatibilité des parties existantes.
- Direction artistique fantasy anime 2.5D cinématographique maintenue.

## 5. Problèmes encore ouverts
- Réduction plus agressive des écrans à choix unique (nécessite fusion de scènes et tests de sauvegardes).
- Fréquence et naturalité des haltes d’exploration.
- Visibilité du journal et de l’inventaire sans casser l’immersion.
- Diversification des fins pour les parcours prudents.
- Quelques drapeaux non relus et continuité mineure (documentés dans les PROBLEMES_OUVERTS des versions précédentes).

## 6. Critères de réussite
- Identité narrative V52 retrouvée dans le flux et les relations, enrichie par la prose et les systèmes V60.
- 36 fins distinctes intactes.
- Jeu jouable du début à la fin, sauvegardes fiables.
- Prêt pour test dans Google AI Studio.
- Aucune régression technique détectée par la suite de tests.

**Prochaine étape recommandée** : playtest ciblé sur les actes 1–2 pour valider la fluidité perçue, puis fusion progressive des transitions à choix unique les plus pauvres.
