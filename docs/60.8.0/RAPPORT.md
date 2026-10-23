# Rapport V60.8.0 — Elenya Frost

Branche `v60.8.0`, partie de `v60.3.2`. La 60.7.0 (ZIP vérifié, SHA-256 e3dc8f12…7349) n'est que la 60.3.1 avec ses 6 retouches de texte ; ces retouches ont été portées. Le style historique de référence est la 52.5.4. Les rapports de revue lus et traités sont dans `revue-608/rapports/` : scenario, romance, choix, routes, sauvegardes. `da-visuel.md` et `uiux.md` ne sont jamais arrivés.

**Verdict : livrable, mais pas « prête » au sens de l'utilisateur.** Tous les tests automatiques passent et les 36 fins s'affichent. Il manque encore un parcours de jeu à la main des fins rares et une relecture humaine des textes de fin (voir PROBLEMES_OUVERTS.md).

## 1. Comparaison 60.7.0 / 52.5.4
- 60.7.0 = 60.3.1 + numéro de version + 6 retouches de texte (ouverture et chute de l'acte 1, auberge et stèle, « promesse »). Elle n'avait pas les correctifs 60.3.2 : domination → aucune romance, chaise libre, dette manquée, lignées.
- 52.5.4 : servie en Chrome à côté de la 60.x pour comparer les styles calculés (`qa-608/comparaisons/`).

## 2. Style visuel (contrôlé dans Chrome, PC 1366×768 et mobile 390×844)
Seuls les défauts démontrés sur capture ont été corrigés. Images et sprites n'ont pas été touchés.
1. Boutons de choix : rayon de 12 px (« verre givré » 55.0) au lieu de la pilule 52.5.4. Après correction, styles calculés identiques à la 52.5.4 : rayon 999 px, filet rgba(224,237,248,.6), fond rgba(7,19,33,.82).
2. Menu rapide : « Retour au menu » et « Sauvegarder » étaient coupés (hauteur fixe). Le menu suit maintenant son contenu, dans la limite de l'écran.
3. Écrans de fin (défaut trouvé en capturant les 36 fins) :
   - le bouton voisin du récapitulatif s'étirait sur 508 px et devenait un ovale géant ;
   - le début du texte sortait par le haut, sans pouvoir y remonter (`justify-content:flex-end`).
   Correction : récapitulatif sur toute la largeur, boutons à leur hauteur, ancrage bas « safe ». Captures avant : `qa-608/fins-avant/`. Après : `qa-608/fins/`.
Tout est dans `Cinematic_UI_Landscape.html` (blocs commentés « 60.8.0 »), puis `npm run build`.

## 3. Rythme
Part des écrans à choix unique : **44,4 % → 34,2 %** (`tests/_mesure-608.cjs` ; `qa-608/rythme-avant.json`, `rythme-apres.json`).

Fusions (avant : écran de transition à un seul bouton ; après : son texte s'affiche en tête de l'écran suivant, ses effets sont conservés) :

| Scène fusionnée | Choix qui y menait |
|---|---|
| LIEN_MARCHE_2B | LIEN_MARCHE_2 : O_REPARER, E_REPARER, SILENCE, S_FROID |
| ACTE2_02B_PANTHERE_LIBEREE | ACTE2_02_QS_FAMILIERS : A |
| ACTE2_02B_PANTHERE_ABSORBEE | ACTE2_02_QS_FAMILIERS : B |
| ACTE3_11_PRISON_ECHANGE | ACTE3_11_JUGEMENT : O |
| ACTE4_07B_CHOC_FRAGMENT | ACTE4_07_ADIEU_KALTHAR : A |

Ces 5 scènes restent dans la base, pour les sauvegardes.

Choix ajoutés (avant : 1 seule issue ou 1 issue de plus ; après : une vraie décision) :

| Écran | Choix ajoutés |
|---|---|
| ACTE1_03_FAMILIER_1 | R608_CHAINES (défier Alistair), R608_NOM_OMBRE (demander son nom à Kaelen) |
| ACTE1_04_AUTOMATE | R608_FEN_ABRI (protéger Fen), R608_CRISTAL (saisir le pouvoir) |
| ACTE2_05_ARRIVEE_AUBERGE | R608_CENDRE (écouter les mercenaires), R608_AZAYA |
| ACTE3_01_TENSION_GROUPE | R608_ECOUTER (laisser parler Kaelen et Alistair), R608_MORSURE |
| ACTE3_03B_RESISTANCE | R608_CONTRECHANT |
| ACTE3_09_ENTREE_SANCTUAIRE | R608_STELES |
| ACTE2_13_PRYMAELIS | R608_PAUME |
| ACTE2_11_RIVE_NORD | R608_RIVE_SUD (si un compagnon est perdu) |
| ACTE4_01_HALTE_DOME | R608_ARCHE, R608_PRIERE |
| ACTE4_08_CORRIDOR_OBSIDIENNE | R608_REFLET_COURONNE, R608_REFLET_VIDE |
| FRAGMENT_ANCESTRE_KALTHAR_REVEIL | R608_VERITE |

Revue `choix.md` :
- Les 9 drapeaux qui n'étaient jamais relus le sont désormais. Une phrase apparaît plus loin pour : Confrères (aveu de Kaelen), Fen protégé (adieu de Fen), aveu à Kalthar (adieu), querelle écoutée (mise au point), rive regardée (retrouvailles), contre-chant (Lyra), nom de Kaelen (nuit à l'auberge). Les reflets du corridor colorent l'épilogue (ACTE5_01_LENDEMAIN), sans créer de fin supplémentaire.
- Rééquilibrages : CONTRECHANT passe d'instabilité +3 à +2 avec volonté +1 ; RIVE_SUD n'a plus de malus ; MORSURE passe de volonté +1 « gratuite » à instabilité −1.
- R608_NOM_OMBRE : aucune scène ultérieure ne « révèle » le nom de Kaelen. Le texte de base l'emploie dès ACTE1_03_FAMILIER_2 (vérifié en partie réelle), donc pas de rupture de continuité.
- Joueur prudent : épilogue coloré par les reflets. Je n'ai pas ajouté `r608_querelle_ecoutee` aux conditions de FIN_EQUILIBRE : le texte de R608_ECOUTER dit « rien n'est réglé », ce serait incohérent. Je n'ai créé aucune fin « prudence » artificielle.

## 4. Immersion
« cage », « porte », « terme », « insigne » ont été retirés des passages réécrits : tension de groupe, entrée du sanctuaire, cellules vides, autel, parvis, corridor, et libellés « Entrer dans la Citadelle » et « Pousser les battants de la nef ». Les plafonds de tics de `tests/tics-59.cjs` sont respectés. Ces mots subsistent ailleurs dans le texte historique (voir problèmes ouverts).

## 5. Romances (Kaelen, Alistair, Fen)
- Les correctifs 60.3.2 sont présents (la branche part de v60.3.2) et les idées de la 60.3.3 (stash) sont appliquées :
  - chacun répond selon son vécu à la question à trois ;
  - Elenya dit son propre oui ;
  - la question peut être refermée (TRIO6033_REFERMER) ;
  - la domination ferme `romanceAvailableO/E` ;
  - l'amitié n'est pas traitée comme une pause ;
  - pas de baiser ni de serment avec Séraphine sous emprise.
- Nouveau : au dôme, PROPOSER exige le oui de chacun (même règle `trioOui6033_`). Sinon, c'est le refus sans reproche.
- Moments ajoutés :
  - la gourde de Kaelen, avec un écho au test de l'acte 4 ;
  - « Sept » au matin de l'auberge ;
  - la prière regrettée d'Alistair (fermée après une domination) ;
  - les refus respectés relus au bivouac ;
  - Fen au ravin, relu à l'adieu à Kalthar ;
  - une confidence au furet sur la voie solo.
- Test `tests/romance-608.cjs` : aucun choix de refus ne baisse un lien (13 refus recensés), le non de chacun, la révocation, le dôme, le baiser fermé sous emprise, les moments R608 fermés par la domination.
- FIN_POLY reste atteinte (route figée, `correctifs-6032.cjs`).

## 6. Journal et sac
Le journal de route (quêtes ✓ / ✗ / •) et le sac s'affichent en tête du Codex en jeu. Avant, ils n'étaient visibles que dans les Statistiques de l'écran titre. Vérifié dans Chrome, PC et mobile, avant puis après sauvegarde et rechargement (`qa-608/codex-journal/`). Les données sont recalculées par le serveur à partir de l'état : aucun changement de format de sauvegarde.

## 7. Les 36 fins
Voir `FINS.md` : 36 sur 36 rejouées par le moteur et affichées dans Chrome, sur PC et sur mobile. Elles n'ont pas toutes été jouées à la main.

Revue `routes.md` :
- la boucle SUBMIT ↔ RELEVER est bornée : on ne se relève qu'une fois, et la réponse le dit ;
- la fenêtre de FIN_SERAPHINE_LAME est élargie : seuil de possession 10 → 8, FIN_SERAPHINE_COEUR ajustée en complément, et un indice apparaît au serment ;
- V28_SOLO_ECHO_AUBERGE : **atteignable**, vue en partie réelle (graine 280). Le rapport se trompait sur ce point, rien n'a été modifié ;
- un test vérifie qu'aucun choix ne pointe vers une scène fusionnée.

## 8. Systèmes protégés, sauvegardes
- La narration vocale reste désactivée (test « Interface 55 : voix retirée »). Aucun test n'a été supprimé ni affaibli. Les tests touchés ne changent que de fixtures, avec des explications en commentaire.
- Revue `sauvegardes.md` :
  - **B1 corrigé** : « Nouveau NG+ » purge maintenant l'ancien run (manifeste et fragments) ;
  - **M1 corrigé** : une scène inconnue passe par ERREUR_SCENE puis en ressort, au lieu de boucler ;
  - test `tests/sauvegardes-608.cjs`, qui échoue sur l'ancien code et passe sur le nouveau.
- Sauvegardes réelles 60.3.2 et **60.7.0** arrêtées sur chacune des 5 scènes fusionnées : 30 sur 30 rechargées, puis menées jusqu'à une fin (`rythme-608.cjs`).

## 9. Tests
Voir `TESTS.md` à la racine : `npm test` **49/49** et `npm run test:e2e` **8/8**, tous deux lancés après la dernière modification.

## 10. Livraison
ZIP `livraison/elenya-frost-60.8.0.zip`, avec le bundle Git (toutes les branches et tous les tags). Taille et SHA-256 : voir VERSIONS.md sur GitHub et le message de livraison.
