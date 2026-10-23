# Audit 55 — état de la 54.0.0 avant la refonte

Ce document décrit ce que j’ai mesuré dans le jeu avant de le modifier. Les chiffres viennent de scripts lancés sur le moteur réel : `tools/qa-550/audit.cjs` et `visites.cjs` (800 parties au hasard). Ce ne sont pas des estimations.

## 1. Récit : répétitions
Mots signalés par l’auteur, comptés dans tous les textes (scènes, choix, réponses ; classique et NG+) :

| Mot | Occurrences |
|---|---|
| « insigne(s) » | **94** — presque toujours l’insigne d’Alistair, souvent « son insigne éteint dans la main » |
| « porte(s) » | **147** (dont une partie de vraies portes ; une quarantaine sont des métaphores : « une porte laissée ouverte », « fermer la porte », « devenir une porte ») |
| « cage(s) » | **27** (motif « cage dorée » d’Alistair, plus des formules « … n’est pas une cage » répétées dans plusieurs fins) |
| « terme » | aucune répétition notable |
| « silence » | 92 · « givre » 105 · « froid » 62 · « glace » 53 (attendus dans un jeu de givre ; pas traités en priorité) |

Tics de phrase repérés : « Alistair a posé ton manteau près de la porte » (5 variantes de la même scène), « Alistair reste près de la porte » (4), « X n’est plus une cage » (5 fins).

## 2. Choix
- **Choix strictement décoratifs** (aucun effet, même destination qu’un autre choix de la scène) : 2 seulement.
  - `ACTE4_06_MASQUE_TOMBE_1:NEXT` : c’est un simple « continuer », il est acceptable.
  - `FIN_BRISEE` au Trône : il reste volontairement toujours disponible, c’est une issue de repli.
- **Choix qui posent une mémoire jamais relue :** 700 mémoires sont posées par des choix. Environ 275 ne sont jamais relues ailleurs dans le code.
  - Le chiffre est surestimé : certaines sont lues par préfixe (`variante_…`, `ngpu_…`). Mais une centaine de mémoires classiques sont vraiment sans suite.
  - Exemples : `silas_ignore`, `silas_bouton_pille`, `insigne_alistair_ramasse`, `nuit_fen_repos`, `refus_deux_auberge`, `combat_mine_O`, `venin_ignore`, `venin_cauterise`, `fen_a_bu_givre`, `veyra_rejetee`, `nomade_offrande_couronne`, `elenya_soin_kaelen_tempete`.
  - **C’est le vrai défaut « choix sans conséquence » du jeu** : le joueur choisit, le jeu note, et plus rien ne s’en souvient.

## 3. Scènes inaccessibles
Graphe statique (choix + déclencheurs) puis 800 parties au hasard :
- **Orphelines réelles** (aucun choix ni déclencheur n’y mène) :
  - `ACTE4_04_POLY_ALISTAIR` et `ACTE4_04_POLY_KAELEN` : deux nuits « à la chaîne ». Leur texte décrit une possession et une violence sans consentement (« tu les possèdes tous deux »), ce qui contredit les règles de romance du jeu ;
  - `ACTE4_06B_TEST_KAELEN` ;
  - `ACTE2_07_TRANSE_FEN` : déjà retirée volontairement, le moteur redirige les anciennes sauvegardes.
- Toutes les autres scènes non vues au hasard sont rares mais atteignables : fins secondaires, Corona, épilogues, `JOUTE_*`, fragments. Elles sont couvertes par les parcours rejoués de `tests/fins-toutes.cjs`.

## 4. Personnages (nombre de scènes qui les nomment)
Alistair 163 · Kaelen 158 · Fen 107 · Kalthar 51 · Oraya 24 · Séraphine 17 · Lyra 13 · Silas 10 · Mira 10 · Veyra 8 · Corona 2.
- **Silas** : son choix à l’acte 2 (épargner, ignorer, piller) n’a presque aucune suite.
- **Veyra** : elle surgit tard (pacte à l’autel), sans préparation avant l’acte 3.
- **Mira** : elle n’existe que sur la voie solitaire. Elle est attachante, mais isolée.

## 5. Romances
- Les deux romances principales montent bien jusqu’à l’acte 4, mais **elles ne peuvent pas s’abîmer pour de bon**. Une relation négligée (beaucoup de distance, peu de lien) se ferme sans un mot : le choix de nuit disparaît en silence, et la fin du compagnon reste parfois accessible par d’autres chemins.
- Le polyamour consenti est cohérent (`poly_eligible`). Les deux scènes orphelines ci-dessus en sont l’envers non consenti.

## 6. Technique
- **Fonction inexistante appelée :** `preloadUpmcVoice` (dans `Scripts_Game` et `Scripts_Refonte`). Elle n’est définie nulle part et plante si l’ancien réglage « voix du jeu » est resté dans le navigateur d’un joueur.
- **Narration vocale :** environ 380 lignes de code mort (synthèse du navigateur, voix Piper téléchargée depuis un CDN, aperçu vocal, déverrouillage audio). La voix est déjà forcée à « désactivée » à chaque scène, mais tout le code est toujours chargé.
- **CSS contradictoire :** le style des boutons de choix est redéfini 7 fois dans 4 fichiers (`JRPG_UI_Styles`, `Cinematic_UI_Styles` ×3, `Cinematic_UI_Landscape` ×3). C’est la dernière définition qui s’applique.
- **Plein écran :** il est déjà proposé avant une nouvelle partie, sans bloquer si on refuse. Rien n’est proposé quand on **reprend** une partie.
- **Débordement horizontal léger** au-delà de 1024 px (connu depuis la 53.4).
- Tests 54.0.0 : 17/17, 0 erreur console sur 10 tailles.
