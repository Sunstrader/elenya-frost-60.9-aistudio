# Corrections de l’audit V60.1 — version 60.2.0

Base : tag `v60.1.0`, mission `brief-601/MISSION_602.md`. Pas de réécriture du moteur. Chaque point : constat · correction (ou raison) · fichiers · test et résultat réel · risques.
Tous les résultats ci-dessous sont des exécutions réelles (Node 20, Chrome du système) ; voir `RESULTATS_TESTS.md`.

## 1. Préserver V60.1
- **Constat** : toute modification risquait de casser les fins, agonies, NG+, sauvegardes, relations et romances.
- **Correction** : aucune scène supprimée et aucun identifiant changé. Une seule ligne de texte ajoutée : l’écho de possession au Trône.
- **Fichiers** : `23_Refonte.js` (1 écho).
- **Test** : `npm test` (43 tests) et `npm run test:full`, tous verts ; empreinte narrative 60.1 inchangée en structure.
- **Risque** : faible.

## 2. CRITIQUE — Apps Script : diagnostics appelables par tout visiteur
- **Constat** : dans Apps Script, toute fonction globale sans « _ » final est appelable par `google.script.run`. 36 fonctions de diagnostic ou d’outillage étaient ouvertes, en plus de 7 fonctions d’administration du Reviewer (création, rotation, liste et révocation des jetons d’agents) et de 7 helpers de QA (`_validateSceneDatabase`, `_sceneSourceForQA`, `_functionSource`…).
- **Correction** :
  - les 36 diagnostics et les 7 helpers de QA passent en privé (suffixe `_`), ce qui est un blocage réel côté Apps Script et non un simple masquage ;
  - une seule porte reste ouverte : `serverDevDiagnostic(nom, args)`, dans le nouveau fichier `05_DevGuard.js`. Elle exige la propriété de script `ELENYA_DEV_DIAG=1`, un utilisateur identifié qui est le propriétaire ou figure dans `ELENYA_DEV_EMAILS`, et un nom présent dans la liste blanche ;
  - l’administration du Reviewer est réservée au propriétaire (`efEstProprietaire_`) ;
  - le tri d’images passe par cette même porte ;
  - côté Node, les tests et le miroir `server.js` appellent les versions privées, déjà filtrées par `ELENYA_DIAG`.
- **Fichiers** : `05_DevGuard.js` (nouveau), `90_QA.js`, `95_NGPlus_Ultra_QA.js`, `50_Server_API.js`, `ImageReviewer_Backend.js`, `ImageReviewer.html`, `Reviewer_Backend.js`, `DATABASE_Acte1.js` (commentaire), `qa/engine.cjs`, `docs/60.2/DEPLOIEMENT.md`.
- **Test** : `tests/gas-verrou-602.cjs` simule l’espace global Apps Script, avec les 26 fichiers `.js` dans l’ordre de chargement. Résultat :
  - 0 diagnostic public ; 80 fonctions publiques restantes, listées dans `docs/60.2-fonctions-publiques.json` ;
  - refus `DIAGNOSTIC_RESERVE_DEV` pour un visiteur anonyme (avec ou sans drapeau), pour le propriétaire sans drapeau et pour un tiers avec drapeau ; refus `DIAGNOSTIC_INCONNU` pour un nom hors liste ;
  - accès autorisé pour le propriétaire ou un développeur listé, drapeau posé ;
  - les 7 fonctions d’administration refusées à un anonyme comme à un tiers ; le jeu reste jouable.
- **Risques** :
  - **Le déploiement réel n’a pas été validé** : c’est une simulation.
  - `Session.getActiveUser()` peut renvoyer une adresse vide en web app (`USER_DEPLOYING`, autre domaine). Le propriétaire peut alors devoir passer par l’éditeur ou par `ELENYA_DEV_EMAILS`.
  - Le tri d’images est fermé tant que `ELENYA_DEV_DIAG` est absente.

## 3. `npm test` : plus de 700 s sans bilan chez le relecteur, 80 s annoncées
- **Constat** :
  - le lanceur exécute les tests en série (`execFileSync`), sans parallélisme ;
  - les tests longs sont combinatoires et non bouclés : Récit 55 (16 s), Échos 57/58 (13 s), Toutes les fins (12,5 s), check (9 s), test du singe (8,5 s) ;
  - aucune sortie n’apparaissait avant la fin de chaque test, et l’environnement (CPU, Node) n’était pas affiché. Sur une machine plus lente ou partagée, une attente longue sans signe de vie ressemble à un blocage.
  - Les doublons ont été examinés : `test:legacy` relance `check`, mais il ne fait pas partie de `npm test`. `fins-toutes` et `fins-routes-601` se recoupent sur les fins rares mais ne vérifient pas la même chose (variantes classiques et NG+ d’un côté, routes négatives de l’autre) : les deux sont gardés.
- **Correction** :
  - chaque test annonce son début sur la sortie d’erreur et affiche sa durée ;
  - un en-tête affiche la machine (Node, nombre et modèle de CPU, mémoire, exécution en série) ;
  - un bilan final donne la durée totale et les 8 tests les plus lents ;
  - aucun contrôle n’est retiré.
- **Fichiers** : `tests/run-all.cjs`.
- **Test** : durée réelle ici, 92,1 s pour 43 tests (budget 180 s). Le lot complet est donné dans `RESULTATS_TESTS.md`.
- **Risque** : la durée dépend de la machine. Les 700 s du relecteur n’ont pas été reproduites ici ; la cause reste à confirmer sur sa machine grâce aux durées par test.

## 4. Fins, sauvegardes, morts, échos rares, drapeaux
- **Fins (36)**
  - Classement : les 36 sont atteintes par décisions (route complète depuis une partie neuve), 0 par injection d’état, 0 par simple présence de la scène.
  - Les 16 variantes ont chacune un texte propre, vérifié en retirant le drapeau de variante.
  - Fichiers : `tools/classer-fins-602.cjs`, `FINS_CLASSEMENT.md`.
- **Sauvegardes**
  - Test `tests/sauvegardes-cycle-602.cjs`. Le cycle complet est réel : `serverSaveGame` → propriétés utilisateur (en fragments) → nouveau moteur (fermeture) → `serverLoadGame` → reprise.
  - Vérifiés à la reprise : même scène, mêmes choix, même texte (donc mêmes conséquences différées, relations et jauges), premier choix accepté.
  - Résultat : **90/90** sauvegardes 60.1 et **115/115** sauvegardes 52.5.4.
  - NG+ après chacun des 5 types de game over : 5 héritages distincts.
- **Morts**
  - Test `tests/morts-602.cjs`. Chaque mort part de la route réelle qui y mène, sans aucun état injecté.
  - Céder mène au bon GAME_OVER. Survivre ramène au jeu, avec un coût :
    - venin : volonté −3 ;
    - surcharge : instabilité −24, volonté −2 ;
    - possession : emprise −10, volonté −2 ; cette survie est désormais relue au Trône ;
    - sirène et Sceau : volonté −1.
  - **Constat** : `MAIN_TENDUE` et `TENUE` ne coûtent aucune jauge, seulement un drapeau relu plus tard. C’est volontaire en 60.1 (le compagnon porte le poids), mais la survie y est gratuite : point ouvert.
- **83 échos rares sans route**
  - Examen individuel, sans parcours artificiel : `tools/classer-echos-602.cjs`, `ECHOS_RARES.md`.
  - Lecture statique : aucun n’est inaccessible ni contradictoire ; les 83 sont « rares ».
  - Jeu aléatoire sur 400 parties, épilogue compris :
    - 62 drapeaux jamais posés ;
    - 6 drapeaux et scènes hôtes jamais réunis ;
    - 13 échos affichés ;
    - 2 échos dont les conditions sont réunies mais dont le texte est absent, tous deux au Trône (Séraphine « nom brûlé », fêlure d’Alistair). Cause : le plafond de 4 échos au Trône fixé en 60.1. Laissé tel quel, car le comportement attendu n’est pas établi.
  - Correction d’outil : `tools/qa-550/echos-atteints.cjs` tient compte des interceptions globales (les agonies) qui reviennent par RETURN.
- **31 drapeaux posés jamais relus**
  - Classement un par un : `tools/classer-drapeaux-602.cjs`, `DRAPEAUX_NON_RELUS.md`.
  - Résultat : 16 traces techniques, 3 garde-fous, 10 conséquences abandonnées (dont 6 reliquats V28), 2 dépendances manquantes (`artefact_citadelle`, `sommeil_lourd`).
  - Aucune suppression ni aucun raccord. Le 32e drapeau, `possession_agonie_ouverte_601`, nouveau en 60.1 et non relu, est désormais relu au Trône.

## 5. `_echosEmpiles601_` avalait les erreurs
- **Correction** :
  - l’anti-plantage est gardé ;
  - chaque erreur est mémorisée, une fois par écho et au plus 50 au total, et lisible par `efEchoErreurs602_()` ;
  - elle n’est journalisée qu’en développement (`ELENYA_DEV_DIAG=1` ou `EF_ECHO_DIAG`), donc la production n’est pas inondée.
- **Test** : `tests/echos-erreurs-602.cjs` vérifie :
  - le texte est rendu malgré un écho fautif ;
  - aucun journal en production ; un journal en développement ;
  - en appels imbriqués, le plafond est partagé entre couches (4 au Trône), `_echoProf601_` revient à 0 et le compteur repart à zéro à chaque affichage ;
  - une base qui lève l’exception la laisse remonter, avec la profondeur rétablie ;
  - sur les 3 739 affichages des 36 routes réelles : 0 erreur d’écho.

## 6. Romances, consentement, continuité
- **Gardés et testés** (`tests/fins-routes-601.cjs`) :
  - le pardon d’Oraya est 1 choix explicite sur 3 ;
  - le refus d’Alistair n’est pas une rupture ;
  - les 3 états de Séraphine donnent des textes distincts ;
  - FIN_POLY n’est offerte qu’avec l’accord des deux (contrôle positif, plus les négatifs refus et domination).
- **Continuité** : `morts-602` (retour au jeu après agonie) et `sauvegardes-cycle-602` (NG+ après game over).
- **Relecture en contexte** : `RELECTURE.md` reprend le texte réellement affiché, depuis des routes réelles, pour Oraya, Alistair, les agonies et le Trône.

## 7. Chrome PC et mobile réels
- **Test** : `tests/e2e/visuel-602.cjs`, **exécuté** avec des clics réels, en 1280×800 et 390×844. Parcours testé :
  - nouvelle partie, puis 8 choix cliqués ;
  - ouverture du menu ;
  - sauvegarde, fermeture de la page, réouverture : reprise sur la même scène (FEN_INDICE_1) ;
  - écran de fin FIN_OMBRE depuis l’état réel d’une route.
- **Contrôles** : 0 cadre bleu visible, 0 appel à `speechSynthesis`, 0 audio de voix ; 0 erreur de page.
- **Statique, historique ou exécuté** : visuel-602 est exécuté en 60.2. Les captures 60.1 (`captures-601`) sont historiques. Les tests `tests/*.cjs` hors e2e sont des tests moteur, sans navigateur.
- **Constats visuels** (sur les captures, non corrigés) :
  - le compteur affiche « 1 / 35 fins découvertes » alors que les tests comptent 36 scènes de fin : le compteur suit 35 succès ; 3 clôtures d’épilogue (`ACTE5_02_*`) n’ont pas de succès, et 2 succès ne correspondent à aucune scène ;
  - les intitulés secondaires du menu sont peu contrastés.

## 8. Livraison
- ZIP complet dans `/workspace/elenya-remaster/livraison/elenya-frost-60.2.0.zip`. Les derniers tests sont lancés sur les fichiers exacts du ZIP (dézip neuf, puis `npm install`), voir `tests/fresh.log` dans le ZIP.
- Rien n’a été déployé ni publié.
