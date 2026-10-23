# RAPPORT — V60.3.1 (depuis v60.3.0, branche v60.3.1)

Objet : corriger les audits V60.3 (`revue-603/rapports/` : bible 6,5, QA narratif 8, playtest 7, romance 7,5, continuité 8,5). Correctifs locaux uniquement : aucun arc réécrit, aucun moteur refait, aucun identifiant de scène, de choix ou de drapeau supprimé. Pas de narration vocale.

## Points corrigés, avec preuve

Chaque preuve est rejouée par `tests/correctifs-6031.cjs` (inclus dans `npm test`), sur le moteur réel, à partir d'états issus de vraies parties.

| # | Problème (audit) | Ce qui existait | Correctif | Preuve (simulation de chemin) |
|---|---|---|---|---|
| 1 | Halte `STELE603` (ACTE3_09B_BIVOUAC_TEMPETE) ouvre `FRAGMENT_4_ENRICHI` et nomme Oraya à l'acte 3 (bible N1, critique ; N2 et N10 par voie de conséquence) | `next:'FRAGMENT_4_ENRICHI'`, condition `!_frag4_enrichi_vu` | La clé `STELE603` reste, mais mène à une nouvelle scène `STELE603_INDICE` : une pierre au nom illisible, sans Oraya ni Trône, qui pose seulement `_stele603_indice` et +1 mémoire. Elle n'est plus rejouable. La révélation reste à `FRAGMENT_4_STELE` (acte 4). La quête « Le nom sur la stèle » s'achève sur `_fragment_4_vu`. | Graine 74 : `STELE603 → STELE603_INDICE → bivouac`. Ni `_frag4_enrichi_vu`, ni `frag4_nom_prononce`, ni `verite_complete` ne sont posés. À `ACTE4_07`, `FRAGMENT_4_STELE` passe en premier. Garde statique : plus aucun choix ne mène à `FRAGMENT_4_ENRICHI`. Au hasard (400 parties, graines 5001-5400) : fuite d'Oraya **53 → 0**. |
| 2 | Quête de la dette branchée sur des drapeaux jamais posés (qa n°2, playtest n°2) | début `dette_kaelen` (en réalité un minuteur), `dette_connue`, `contrat_vu` ; fin `dette_annulee`, `dette_rendue` | Début : `dette_O_confrontee`, `dette_E_confrontee` ou `dette_systeme_compris`. Fin : `dette_position_finale`, `dette_rendue_aux_deux` ou `dette_abolie_structurellement`. L'indice suit l'étape (les entendre tous les deux, puis l'artefact, puis le Trône). Titre : « Les dettes de Kaelen et d'Alistair ». | Graine 74 : quête visible « en cours » avec indice. Le vrai choix `DETTE_CHOIX:RENDRE` la marque « accomplie ». Au hasard : visible **0 → 123/400**, accomplie **0 → 3/400** (les autres parties s'arrêtent avant le Trône ou ne font pas le choix). |
| 3 | « Aider l'aubergiste » et le pain inaccessibles avec une réputation village à 0 (qa n°3, playtest n°3) | condition `getRep('village') >= 1`, alors qu'aucune source n'existe avant l'acte 3 | Seuil `>= 0` (seule l'hostilité ferme l'option). La réplique ne parle plus du grain (« Ici, on paie avec ce qu'on porte »). Le texte d'accueil lié au grain reste réservé à `village >= 1`. | Graine 37 : `village = 0 → VILLAGE → pain_village_603` dans l'inventaire ; `village = -1` → option absente. Au hasard : pain **0 → 32/400**. |
| 4a | `V28_FIN_RECONVERSION_O/E` permet une romance après une domination (qa n°1, n°10) | seulement `!dominationActive59_` | Mêmes exclusions que `FIN_OMBRE`/`FIN_ECLAIREUR` (`crevasse_domination`, `domination_acte3_O/E`), plus le refus et l'amitié (`kaelen_refuse`/`alistair_refuse`, `amis_*`, `amis_*_ferme`, `romance_en_pause_*`). | Condition évaluée sur un état réel au Trône : possible sans ces drapeaux, bloquée par chacun d'eux. Au hasard : reconversion après domination **2 → 0** ; FIN_OMBRE/ECLAIREUR après domination **2 → 0**. |
| 4b | Indices du trio sur de simples jauges (romance P1 et P3) | `poly_eligible && présents && !_trio_nuit_vue` | Fonction `indiceTrio6031_` : il faut en plus les deux romances ouvertes ; elle échoue sur refus, amitié, pause, rupture, domination (crevasse, acte 3, finale), nuit non réparée (`double_jeu` sans `poly_repare_60`) et possession ≥ 12. Les textes reprennent les réécritures de l'audit (« Il reste une chaise libre entre eux… », « Il voit que tu l'as vu. Il ne s'en excuse pas. »). | Rendu réel de la salle commune : indice visible quand tout est consenti ; absent avec chacun de ces drapeaux, avec `double_jeu` et sans romance ouverte. |
| 4c | Au dôme, la réparation tenait lieu d'ouverture à trois (romance P2) | `lisiere_trio_ouvert \|\| poly_repare_60` | `lisiere_trio_ouvert` est exigé. La réparation reste obligatoire après `double_jeu`. | Vérifié dans la source par le test. `fins-routes-601` (route du trio consenti) et `audits-60` (trio) restent verts. |
| 5 | Paragraphe de réputation affiché deux fois dans TEMOIN, EQUILIBRE, RECONCILIATION et REDEMPTION (bible N3) | `_ajout603_` enveloppait FIN_VERITE **et** ses variantes, qui relisent la narration de FIN_VERITE | Les 4 variantes sont retirées de la liste. | Rendu réel avec réputation (village 3, ordre −3, culte 3) : écho présent **une fois** dans les 5 fins (FIN_VERITE comprise). |
| 6 | FIN_CHAOS et FIN_DOMINATION contredisent leur texte (bible N4, N5 ; et N8) | écho de réputation hérité de FIN_BRISEE et FIN_HIVER ; cadre « un autre visage que le tien » ; titre interne **Domination** doublé | Aucun écho de réputation sur ces deux variantes. Cadre propre par variante (`FINS54_CADRES_VARIANTES` : aucun cadre pour CHAOS ; « Personne ne te contredit plus… » pour DOMINATION). Titre interne retiré. FIN_CHAOS ne nomme que les compagnons présents (N8). | Rendu réel : CHAOS garde « Personne ne saura… » sans écho ni cadre BRISEE ; DOMINATION sans « autre visage » ni « **Domination** ». |
| 7 | Quête de Fen bloquée « en cours » (playtest n°1) | début `_halte603_auberge`, alors que la halte ne se rouvre pas | Drapeau d'entrée `_halte603_entree` et drapeau de sortie `_halte603_quittee` (choix REMONTER). Quittée sans Fen, la piste devient « manquée » (✗ dans le journal) au lieu de rester « en cours » à vie. L'indice dit maintenant de lui parler avant de remonter. | Graine 37 : `REMONTER` sans Fen → « manquée » ; `FEN` → « accomplie ». Au hasard : « en cours » à la fin **28 → 0** (35 manquées). |
| 8 | Erreur JS `qaModeEnabled is not defined` au retour arrière (playtest n°11) | `autoSave()` appelait une fonction qui n'existe dans aucun fichier | Garde `typeof qaModeEnabled === 'function'`. `index.html` est régénéré par `npm run build`. | Le test exécute la ligne gardée sans la fonction : aucune exception. Aucun appel non gardé dans `Scripts_Game.html` ni dans `index.html`. |

## P1 à faible risque
- **Haltes signalées** : les entrées des haltes de la salle commune et de la stèle commencent par « Explorer : » (texte seulement).
- **Écrans à choix unique** : **non traité**. Le taux reste à 44,4 % (19 695 écrans sur 44 347, 400 parties). Il faudrait fusionner des scènes de transition, ce qui touche le graphe et les sauvegardes arrêtées sur ces scènes : ce n'est pas un correctif à faible risque. Voir PROBLEMES_OUVERTS.

## Écart d'empreinte documenté
La structure narrative change (nouvelle scène `STELE603_INDICE`, nouveaux choix et conditions). La nouvelle empreinte est enregistrée dans `tests/baseline/empreinte-60.3.1.json`, et `run-all.cjs` l'admet comme les écarts précédents.

## Tests modifiés (et pourquoi)
- `tests/audits-59.cjs` : il cherchait le mot « Domination », qui venait du titre interne en double (bible N5). Il vérifie désormais le titre de l'écran, *Les Satellites*.
- `tests/adn-603.cjs` : l'indice du trio passe par `indiceTrio6031_`. Le test vérifie l'appel, puis que la fonction lit `poly_eligible`.
- Aucun test n'a été désactivé ou masqué.

## Sauvegardes
Aucun identifiant retiré. Une sauvegarde 60.3 arrêtée sur `FRAGMENT_4_ENRICHI` se charge toujours (la scène existe). `sauvegardes-601` et `sauvegardes-cycle-602` (90 + 115 sauvegardes) restent verts. Une ancienne partie qui a déjà vu la stèle 60.3 garde ses drapeaux (voir PROBLEMES_OUVERTS).

## Mesure au hasard
Outil `tests/_mesure-6031.cjs` (hors `npm test`), 400 parties, graines 5001 à 5400, même outil sur v60.3.0 et v60.3.1 :

| Mesure | 60.3.0 | 60.3.1 |
|---|---|---|
| FRAGMENT_4_ENRICHI avant `_fragment_4_vu` | 53 | **0** |
| Halte stèle visitée | 53 | 52 |
| Quête dette visible / accomplie | 0 / 0 | **123 / 3** |
| Pain obtenu | 0 | **32** |
| Quête Fen « en cours » à la fin | 28 | **0** (35 « manquée ») |
| Reconversion ou romance après domination | 2 / 2 | **0 / 0** |
| Écrans à choix unique | 44,4 % | 44,4 % |
| Erreurs moteur | 0 | 0 |
