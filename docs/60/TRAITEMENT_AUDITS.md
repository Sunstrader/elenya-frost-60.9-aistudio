# Traitement des ré-audits V59 → 60.0.0

Sources : `revue-59/rapports/` (continuity, bible, romance, playtest, qa-narratif ; pas d’audit-final cette fois).
Chaque point a été vérifié dans le code avant d’être corrigé. Statuts : **Corrigé** (corrigé et testé), **Partiel** (amélioré mais pas réglé), **Non corrigé** (avec la raison), **Rejeté** (avec la raison).
Les tests de régression sont dans `tests/audits-60.cjs`, branché dans `npm test`. Le nom du bloc est entre crochets.

## P0 (playtest)
| # | Point | Statut | Correction | Test |
|---|---|---|---|---|
| P0-1 | Le garde-fou de surcharge testait la scène d’arrivée, d’où une mort après « Suivant » | **Corrigé** | La mort différée est supprimée. Au seuil fatal, `surcharge_magique` mène à `AGONIE_SURCHARGE`, qui propose deux choix : RENDRE (−24 givre, −2 volonté, retour) ou CÉDER (→ GAME_OVER_SURCHARGE). La mort vient donc toujours d’un choix explicite. | [repriseEtSuivant], [agonies] |
| P0-2 | « Reprendre avant la chute » renvoyait vers la mort (54/173) | **Corrigé** | La sauvegarde de reprise n’est prise que sur une scène qui a au moins deux choix. Comme toute mort passe désormais par une agonie à deux choix, la reprise offre toujours un choix qui survit. Sur 120 parties au hasard, 56 morts : toutes rattrapables par la reprise. Le clic réel sur le bouton a été vérifié avec Playwright en 390×844 et 1280×800. | [repriseEtSuivant], `qa-tools/visuel-60.cjs` |
| P0-3 | Mort par venin sur `ENTREE_SANCTUAIRE:ENTRER` (33/33) | **Corrigé** | `timer_venin_check` mène à `AGONIE_VENIN` : GELER (+2 tours, −3 volonté) ou CÉDER. | [repriseEtSuivant], [agonies] |

## Playtest V59
| # | Statut | Commentaire |
|---|---|---|
| 4 Coût affiché seulement après le clic | **Corrigé** | Le bouton porte « ❄+N » (avec aria-label) avant le clic. [coutAvantClic], vérifié à l’écran. |
| 5 Mort deux choix après le 2ᵉ avertissement | **Corrigé** | Remplacée par l’agonie (choix explicite). Le test V59 `audits-59` attendait la mort directe ; son attente a été mise à jour vers `AGONIE_SURCHARGE`. C’est le comportement demandé par le P0, pas un test assoupli. |
| 6 ABANDON (sirène) | **Corrigé** | Un dernier souffle, `SIRENE_DERNIER_SOUFFLE`, propose LUTTER ou CÉDER. ABANDON garde sa destination GAME_OVER_SIRENE, donc le test de twist reste intact : un déclencheur intercepte, et seulement si ABANDON a été joué (`sirene_abandon_60`). Une sauvegarde chargée sur l’écran de fin y reste. [derniersSouffles] |
| 7 SUBMIT (acte 4) | **Corrigé** | `SCEAU_DERNIER_SOUFFLE` : RELEVER ou CÉDER. [derniersSouffles] |
| 8 Rythme (≈45 % de scènes à un choix) | **Non corrigé** | Mesuré à 45,4 %, en hausse à cause des scènes ajoutées. Ce chantier d’écriture reste ouvert. |
| 9 Tests verts malgré les bugs | **Corrigé** | `audits-60` rejoue de vraies parties ; il échouait avant les corrections. |
| 10 Jauges possession / lien implicites | **Non corrigé** | Choix d’écriture maintenu ; à rediscuter. |
| 11 Image d’ENTREE_SANCTUAIRE | **Partiel** | L’image est dans le code ; son rendu n’a pas été regardé spécifiquement. |
| 12 Interface jamais vue | **Partiel** | Une passe Playwright réelle couvre la jauge, le coût, le chevauchement et la reprise en 390×844 et 1280×800. Elle a corrigé la jauge mobile, qui chevauchait les choix, et le bouton de reprise étiré sur ordinateur. Le reste de l’interface n’est couvert que par les tests e2e existants (10 tailles). |
| 13 Échos rares (33 contre 23 annoncés) | **Partiel** | Chiffre actuel honnête : 34 textes sur 196 non vus au hasard. Aucun n’est inaccessible (contrôle statique + rendu). |

## Continuité V59
| # | Statut | Commentaire |
|---|---|---|
| N1 Boucle `ERREUR_SCENE` | **Corrigé** | `30_SceneManager` ne propose plus un choix dont la destination n’existe pas. [pasDeBoucleErreur] |
| N2 `poly_active` jamais posé | **Corrigé** | Alias d’écriture `trio_accord → poly_active`. [polyEtAlias] |
| N3 Alias `amis` ⇄ `ferme` dans les deux sens | **Corrigé** | Il ne reste que l’alias ancien nom → canonique (migration). L’alias de retrait reste symétrique, ce qui est voulu. [polyEtAlias] |
| N4 `kaelen_emprisonne` jamais posé | **Rejeté (documenté)** | La garde est conservée par symétrie, avec un commentaire. |
| N5 PREUVE proposé après rupture ou domination | **Corrigé** | Condition `!dominationActive59_ && !romance_O_rompue`. Parcours « domination » regénéré en conséquence. |
| N6 Alias `secret_partage` | **Rejeté (documenté)** | Conservé pour migrer les sauvegardes 52.x. |
| N7 Graphe construit à l’exécution | **Non corrigé** | Pas d’export du graphe à l’exécution (dette). |
| 15 (V58) `ERREUR_SCENE` | **Corrigé** | Voir N1. |

## Bible V59
| # | Statut | Commentaire |
|---|---|---|
| 1 / N2 Révélations précoces dans ORAYA_INDICE_1/3 | **Corrigé** | Plus de « siècles », de « reconnaissance », de « mêmes yeux », ni d’yeux bleus. [bible] |
| 4 / 15 / N3 / N4 Couleur des yeux | **Corrigé** | Règle (BIBLE_60) : ambre = relique ou transe ; bleu = Kalthar ; gris = Oraya. Les 5 scènes fautives ont été corrigées (FRAG_K, FRAGMENT_1, FRAGMENT_4, ORAYA_CONFRONTATION, Acte 3). [bible] |
| N1 Codex Kalthar sans id | **Corrigé** | `ACTE3_12_AUTEL_KALTHAR` restauré ; chaque entrée du Codex pointe vers une scène qui existe. [bible] |
| 11 Cri du NOMADE | **Rejeté (assumé)** | Indice voulu. |
| 12 Codex vu à l’écran | **Partiel** | Les id sont vérifiés par le test, mais pas l’affichage du Codex. |
| N5 Échos réveil/Trône | **À surveiller** | Aucun changement. |

## Romance V59
| # | Statut | Commentaire |
|---|---|---|
| N1 Trio rouvert en un clic | **Corrigé** | Il faut maintenant un vrai beat de réparation, `POLY_REPARER`, au bivouac de la tempête (les deux présents, sans rupture ni domination). `double_jeu` ne rouvre plus le trio sans `poly_repare_60`. [trio] |
| N2 « Personne n’a choisi cette nuit » disculpe Elenya | **Corrigé** | Clôture conditionnelle : POLY → « Toi, si, à moitié » ; ASSUMER → texte propre ; le texte original ne reste que pour les routes à deux. [romanceEtQa] |
| N3 ACTE3_08 faux sur la route E | **Corrigé** | Ligne propre à reve_E. [romanceEtQa] |
| N4 SEPARER pose la rupture amoureuse | **Corrigé** | `seraphine_separee_59` a son propre écho au Trône. [romanceEtQa] |
| N5 Répliques recyclées | **Corrigé** | Variantes de voix (Kaelen rend la relique ; Alistair « Je t’ai tenue en croyant être choisi »). |
| N6 Tic « Cette fois » | **Corrigé** | Deux occurrences retirées. Les plafonds de tics restent verts. |
| N7 Haine mélodramatique aux Portes | **Corrigé** | Remplacée par « Alistair et Kaelen ne marchent plus jamais du même côté de toi… ». |
| N8 Trop d’échos au Trône | **Non corrigé** | Pas de plafond. Les échos V60 sont placés au corridor pour ne pas aggraver la situation. |
| 8 (V58) Hub DEPART_VILLAGE | **Non corrigé** | Toujours chargé. |

## QA narratif V59
| # | Statut | Commentaire |
|---|---|---|
| 1 FIN_POLY absente au hasard | **Partiel** | Une 3ᵉ fenêtre de trio (Portes) a été ajoutée, ainsi que la réparation. Sur 1 500 parties au hasard : trio_accord 10, FIN_POLY **0**. Avec la sonde qui joue le trio : FIN_POLY 23. La fin est atteignable par choix délibérés (route fixée dans `fins-toutes`), pas au hasard. |
| 2 `crevasse_domination` bloque le trio en silence | **Corrigé** | Le déclencheur l’exclut, et un écho le dit au dôme. [trio] |
| 3 Domination de l’acte 3 compatible avec une fin romance | **Corrigé** | FIN_OMBRE et FIN_ECLAIREUR excluent `crevasse_domination` et `domination_acte3_*`. Les routes fixes ECLAIREUR/OMBRE de 59 passaient par cette domination ; elles sont remplacées par les parcours Kaelen et Alistair. [romanceEtQa] |
| 4 Fragment Kalthar jeune mort | **Corrigé** | Il ne dépend plus de `_fragment_3_vu` et se déclenche aussi à l’artefact. Le retour (`RETURN`) ne rejoue plus l’autel (bug trouvé pendant la regénération des parcours). 819/1 500 parties au hasard. [romanceEtQa] |
| 5 58 % de game over | **Partiel** | 39 % au hasard (572/1 500). Sirène 12 %, Sceau 12 % : ce sont désormais des choix explicites, rattrapables. |
| 6 Trio accordé puis fin à deux, sans relecture | **Corrigé** | Échos `trio_accord` sur FIN_OMBRE et FIN_ECLAIREUR. |
| 7 Orphelins avec une justification fausse | **Non corrigé / justification corrigée** | ACTE2_07_TRANSE_FEN et ACTE4_04_POLY_* sont du code mort, redirigé avant affichage, et conservés pour les sauvegardes anciennes. La justification V59 (« cibles de redirection ») était inexacte. |
| 8 SEPARER = rupture | **Corrigé** | Voir romance N4. |
| 9 Héritage NG+ partiel | **Partiel** | Les ruptures O/E et la domination sont héritées et relues. Rien n’est encore hérité après un game over. |
| 10 31 drapeaux C jamais relus | **Non corrigé** | Toujours 31 (catégorie N = 0). Les 3 drapeaux V60 sont relus par des échos. |
| 11 Échos rares | **Partiel** | Voir playtest 13. Pas de parcours fixe par écho. |
| 12 Domination très rare | **Non corrigé** | Cohérent avec la doctrine (possession seule). |

## Statuts V59 corrigés (`docs/59/TRAITEMENT_AUDITS.md` surévaluait)
Requalifiés, comme le disent les relecteurs :
- Playtest V58 1, 5 et 8 : **Partiel / non corrigé en V59**. Corrigés en V60 (P0-1 à 3).
- Bible V58 1, 4 et 15 : **Partiel en V59**. Corrigés en V60.
- Romance V58 2, 9 et 12 : **Partiel en V59**. 9 corrigé en V60 (N4) ; 2 et 12 restent partiels. Romance V58 8 : **non corrigé**.
- QA V58 4, 5, 7, 10, 12 et 14 : **Partiel en V59**. QA V58 8 et 9 : **non corrigés en V59**. En V60, 9 (fragment) est corrigé ; 8 n’a eu que sa justification corrigée.
