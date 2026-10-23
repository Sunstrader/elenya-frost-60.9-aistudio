# Rapport 60.8.1 (branche v60.8.1, base tag v60.8.0) — NON PUBLIÉ

## A. NG_FIN_LIBERATION
- Diagnostic : la logique du jeu était correcte (NGP_15_DERNIER_CHOIX/FINAL → NGP_U15_LIBRE → NG_FIN_LIBERATION). La fixture enregistrait une copie de la route VIDE, et les tests (regen-fixtures-608, fins-routes-601) acceptaient la famille de fins au lieu de l'identifiant.
- Correction : nouvelle route [NGP_15_DERNIER_CHOIX, FINAL] + [NGP_U15_LIBRE, AGIR]. Outils et tests vérifient désormais l'identifiant exact.
- Nouveau test fins-exactes-6081 : vérifie, pour chacune des 36 fins, l'identifiant, isEnd, le titre, la variante, les drapeaux finaux NG+, une signature textuelle propre et l'absence des signatures des autres fins. Il contrôle aussi que textes et routes sont distincts, sans paragraphe doublé, sans Markdown ni lampe hors LIBERATION, et inclut une non-régression LIBERATION ≠ VIDE. Son échec sur v60.8.0 est prouvé (brief-6081/preuve-echec-ancien-code.log).
- Faux positifs corrigés dans parcours-60.8.0 :
  - rupture → FIN_SERAPHINE ;
  - domination → FIN_DOMINATION ;
  - ngplus → NG_FIN_AMOUR.
- AGIR et COMPRENDRE : le moteur montre que les deux mènent à NG_FIN_LIBERATION (brief-6081/preuve-liberation-agir-comprendre.log).

## B. Intégration des rapports (revue-6081 et revue-608)
- **Romance**
  - Le dôme du trio exige O et E présents, intéressés et non froids ; il est fermé si Alistair est au cachot. Simulation sur 1500 parties : refus imposés 10 → 0, FIN_POLY toujours atteignable.
  - Kaelen ou Alistair peuvent refermer le dôme ; le texte du Sceau est cohérent.
- **Narration**
  - Échos NG+ : plus de doublons, et la lampe n'apparaît que dans LIBERATION.
  - SACRIFICE vérifie la présence réelle du compagnon ; Sept est corrigé.
  - Nouveaux échos r608 : chaînes et morsure ; écho de nom en solo.
  - Markdown rendu en italique côté client.
  - Bible corrigée : Confrères, Kalthar, R608_VERITE.
  - L'écho de l'architecte est réservé à LIBERATION.
- **Gameplay**
  - Au 2e passage au Sceau, SUBMIT devient SUBMIT_FINAL, explicitement étiqueté « sans retour » (GAME_OVER_SCELLEE).
  - FIN_EQUILIBRE a un titre et une signature propres, plus une variante consort.
  - La carte de fin d'acte masque les choix et les rend inertes au clic.
  - Le compteur de fins est expliqué ; bilan « Ton propre chemin » sur toutes les fins, morts comprises ; Séraphine qualifiée de « méfiante ».
- **Surcharge** : mesurée, non retenue (voir PROBLEMES_OUVERTS.md).
- Chaque correction a son test : romance-6081, narration-6081, gameplay-6081, fins-exactes-6081. Leur échec sur l'ancien code est prouvé.

## C. Vérifications : voir le rapport final de l'agent (journaux dans livraison/).
