# Journal des corrections — 60.1.0 (fiabilisation)

Source : audit indépendant `brief-601/AUDIT_GPT_V60.md`. Chaque ligne : fichier · problème · solution · test qui le prouve.

## Phase 1 — tests reproductibles
| Fichier | Problème | Solution | Test qui le prouve |
|---|---|---|---|
| `elenya-refonte-52.4/qa/check.cjs` | 1000 parties semblaient bloquer. Cause mesurée : le volume seul (≈ 66 000 transitions à ≈ 1 ms, ≈ 70 s) sans aucune sortie pendant le calcul. Pas de boucle infinie : la partie la plus longue dure 239 ms. | Graine (`CHECK_SEED`=524), nombre de parties (`CHECK_RUNS`), budget (`CHECK_BUDGET_MS`), journal par partie `qa/journal-parcours.log` | `npm test` (check à 60/mode) ; `npm run test:full` (500/mode) ; test « Budget du lot » |
| `tests/run-all.cjs`, `tests/lot.cjs`, `package.json` | Une seule suite longue | Lot rapide (préfixe des mêmes graines) et lot complet ; `npm test` / `npm run test:full` / `npm run test:e2e` | Budget rapide 67 s ≤ 180 s |
| `package.json` | puppeteer et playwright pris dans un `node_modules` extérieur effacé | devDependencies exactes + package-lock | e2e lancés après `npm install` dans un dézip neuf (RESULTATS_TESTS) |
| `tests/e2e/e2e-fenetres.cjs` | Sortait en code 0 malgré une fenêtre KO ; faux « hors écran » en 844×390 | Code 1 sur KO ; mesure après 3 positions stables (l’animation dure 280 ms) | `npm run test:e2e` (fenetres-1/2) |
| `tests/e2e/e2e-57.cjs` | Dépendait d’un fichier dans /tmp | État des Portes reconstruit depuis la fixture de parcours | `npm run test:e2e` |

## Phase 2 — systèmes critiques
| Fichier | Problème | Solution | Test |
|---|---|---|---|
| `tools/gen-routes-601.cjs`, `tests/fixtures/routes-fins-60.1.0.json` | Pas de route rejouable pour chaque fin | Route déterministe par fin (graine notée) | `tests/fins-routes-601.cjs` |
| `tests/fins-routes-601.cjs` | Aucune route négative | Au Trône, depuis un état réel : solo, ruptures, domination, compagnon absent, refus du trio n’offrent pas la fin interdite ; contrôle positif FIN_POLY | idem |
| `DATABASE_Secondary.js`, `10_Triggers.js`, `90_QA.js` | La possession critique tuait sans dernière seconde (seule catégorie sans agonie) | `AGONIE_POSSESSION` : OUVRIR (emprise −10, volonté −2, retour) ou CEDER (mort) | `tests/systemes-601.cjs` (5 catégories, déclencheur réel) ; suite historique QA |
| `30_SceneManager.js` `_saveGlobals` | L’union des globaux ressuscitait une chute ou un lien ancien | L’état est maître des préfixes `last_classic_(end|chute|lien):` | `tests/sauvegardes-601.cjs` |
| `50_Server_API.js`, `DATABASE_NGPlus.js` | NG+ après un game over n’héritait de rien | `last_classic_chute:GAME_OVER_X` + liens ; une ligne d’héritage par type de chute | `tests/sauvegardes-601.cjs` |
| `tests/fixtures/sauvegardes-60.1.0.json` | Trop peu de sauvegardes figées | 90 états (dont 3 NG+) ; garde du format (22 clés, schemaVersion 50) : tout changement exige `tests/migration-sauvegardes.cjs` | idem ; e2e « fermer/rouvrir » (visuel-601) |
| `tests/sauvegardes-601.cjs` | Les choix ajoutés en 60.1 (TENUE) cassaient l’égalité stricte | Même scène + tous les choix d’origine toujours offerts ; les ajouts sont listés dans la sortie, pas masqués | idem (`choixAjoutes`) |

## Phase 3 — récit
| Fichier | Problème | Solution | Test |
|---|---|---|---|
| `23_Refonte.js` | Trône et DEPART_VILLAGE saturés d’échos | Plafond partagé `_echosEmpiles601_` (Trône 4, départ 3) ; arc Kaelen déplacé à la HALTE_DOME. Trône : 9,8 → 8 paragraphes en moyenne (max 13 → 8) ; départ : 5 → 4 choix max | `tests/recit-55.cjs`, empreinte 60.1 |
| `23_Refonte.js`, `DATABASE_Secondary.js` | Conditions de FIN_POLY illisibles | Écho au Trône : l’accord tient, ou pourquoi il est perdu ; journal du trio explicite ; le consentement reste obligatoire | `tests/fins-routes-601.cjs` (trioRefuse, domination) |
| `DATABASE_Secondary.js` | Taux de game over élevé | MAIN_TENDUE (sirène, compagnon présent, lien ≥ 2) et TENUE (Sceau, compagnon présent) : 592 → 524 morts sur 1500 (39,5 % → 34,9 %) | `/tmp` simulation notée dans RESULTATS_TESTS ; systemes-601 |
| `tools/gen-echos-rares-601.cjs` | Échos rares sans route | 72 routes fixes rejouées ; 83 sans route (résultat négatif conservé) | `tests/echos-rares-601.cjs` |
| `tools/metrique-choix-uniques.cjs` | 37,6 % contre 45 % : métrique ambiguë | Deux mesures : statique 77/215 = 35,8 % des scènes ; en jeu 44,7 % des affichages | sortie de l’outil |
| — | Chronologie Fen/Kalthar/Oraya/Veyra | Vérifiée : seules « trois siècles » / « trois cents ans » | `tests/systemes-601.cjs` |
| — | Oraya, Alistair, Séraphine | Pardon = 1 choix sur 3 ; refus d’Alistair sans rupture ; 3 textes distincts de Séraphine au Trône | `tests/fins-routes-601.cjs` |
| `DATABASE_Secondary.js` | Tic « Personne ne » au-dessus du plafond après TENUE | Réécrit « sans un mot » | `tests/tics-59.cjs` |

## Phase 4 — visuel
| Fichier | Problème | Solution | Test |
|---|---|---|---|
| `tests/e2e/visuel-601.cjs` | Pas de preuve en capture | Musiques 844×390, Codex 1280×720 et 390×844, ENTREE_SANCTUAIRE (image serveur = fond décodé), lancement à 2 tailles, fermer/rouvrir | `npm run test:e2e` (captures hors ZIP) |
| `tests/e2e/visuel-601.cjs` | Codex vide dans le test | Cause : le Codex lit les scènes vues dans ce navigateur (`ef_visited`, exporté avec la sauvegarde), pas `sceneHistory`. Le test sème `ef_visited` comme un vrai navigateur ; l’assertion n’est pas affaiblie | idem |
| `Scripts_Game.html`, `Styles*.html` | Noms « narration » restants | `launch-start-*`, `chooseLaunchAndStart`, CSS mort retiré | `tests/reliquats-narration.cjs` |
| `50_Server_API.js` | Préchargement d’une image 404 (Crevasse_blizzard) | Précharge l’image remappée | `tests/urls-affichees-601.cjs` |
| `24_NGPlus_Ultra.js` | NGP_U03_VIVRE pointait vers `undefined.webp` | Carte `village:'village'` | idem |

## Phase 5 — déploiement
| Fichier | Problème | Solution | Test |
|---|---|---|---|
| `server.js` | Méthodes de diagnostic ouvertes en production ; port figé | `PORT`/`HOST` par env ; diagnostic en 403 sauf `ELENYA_DIAG=1` ou local | `tests/serveur-diag.cjs` (`prodDiag 403`, `prodJeu 200`, `localDiag 200`) |
| `docs/60.1/DEPLOIEMENT.md` | Plateforme floue, Cinematic_UI_Landscape absent | Production = Apps Script ; Node = miroir dev/QA ; liste complète des fichiers | `tests/deploiement.cjs` |
| `.gitattributes` | Deux dossiers source | Source unique `elenya-refonte-52.4/project/` ; `archives/` exclu de l’archive | `tests/source-unique.cjs` |
| `22_State.js`, `90_QA.js`, `package.json`, `Scripts_Game.html` | Version | 60.1.0 partout | `tests/version-unique.cjs` |
