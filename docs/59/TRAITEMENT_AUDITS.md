# V59 — Traitement des six audits V58

Sources : `revue-58/rapports/` (continuity, bible, romance, playtest, qa-narratif, audit-final).
Chaque point a été revérifié dans le code de v58.0.0 avant d’être corrigé. Les tests de régression sont dans
`tests/audits-59.cjs` (blocs nommés ci-dessous), `tests/version-unique.cjs`, `tests/entetes-db.cjs` et `tests/tics-59.cjs`, tous dans `npm test`.
Légende : ✅ corrigé · ◐ corrigé en partie (le reste est listé dans PROBLEMES_RESTANTS_59) · ✗ rejeté (faux positif ou choix assumé).

## Critiques (traités en premier)

| Audit # | Constat | Traitement | Test |
|---|---|---|---|
| qa 1 / romance (contexte) | La domination ouvre les fins romance (FIN_OMBRE/FIN_ECLAIREUR acceptent domination_acte3_*, crevasse_domination). | ✅ Ces drapeaux ne qualifient plus le lien ; les deux choix exigent `!dominationActive59_(gs)`. | audits-59 `dominationExclutRomance` |
| qa 2 | La rupture avec Séraphine n’empêche pas sa fin d’amour. | ✅ SERAPHINE_COEUR et SERAPHINE_LAME exigent `!seraphine_rompue_57`. | `ruptureSeraphine` |
| bible 1 / bible 2 | ORAYA_INDICE_3 (et _2) nomment Oraya avant FRAGMENT_4_STELE. | ✅ Indices réécrits : ils ne révèlent ni nom, ni lien, ni couleur des yeux. | `orayaSansRevelation` |
| playtest 1 | Mort par surcharge invisible. | ✅ La mort exige les deux avertissements vus et tombe sur une scène à au moins deux choix réels ; jauge du givre affichée (`#givre-jauge`) ; chaque choix qui fait monter le givre l’annonce (« ❄ Le givre monte (+N). »). | `surchargeEtVenin` + failureStates (90_QA) |
| playtest 2 | Un seul avertissement. | ✅ Second avertissement `AVERTISSEMENT_SURCHARGE_2` (instabilité ≥ 50, ou ≥ 46 avec 2 absorptions). | idem |
| playtest 3 | CAUTERISER soigne et tue (+5 instabilité). | ✅ Coût remplacé par volonté −2. | idem |
| romance 1 | FIN_POLY consentie peut lire le texte de possession. | ✅ La branche trio_accord passe avant double_jeu (rappel en une ligne) ; titre « Ni l’un sans l’autre ». | `romanceSirene` |
| romance 2 | La domination reste le moteur de la sirène (réveil d’asservissement). | ✅ Réveil 06 réécrit sans asservissement ; trois choix A / A_ASSUMER / A_LIBERER. Le twist (réveil auprès du « mauvais » partenaire) est intact. | `romanceSirene` + `sirene-twist.cjs` |
| romance 3 | Répliques de l’après-sirène hors voix. | ✅ ACTE3_07 réécrit dans le registre de chacun. | `romanceSirene` |

## Majeurs

| Audit # | Constat | Traitement | Test |
|---|---|---|---|
| qa 3 / qa 4 | L’instabilité seule ouvre la domination ; deux seuils (12 / 15). | ✅ Seuil unique `POSSESSION_EMPRISE = 12` ; `COND.domination` = possession seule. | `dominationExclutRomance` |
| qa 5 | Trio consenti quasi inatteignable. | ✅ Déclencheur `trio_nuit_dome` sur ACTE4_01_HALTE_DOME **ou** ACTE4_02_CHOIX_CHAMBRE ; double_jeu admis s’il a été réparé. | parcours FIN_POLY regénéré (fins-toutes) |
| qa 6 | Après domination, Acte 5/épilogues parlent encore d’un trio. | ✅ Acte5 et Secondary lisent `trioConsenti56_`. | `romanceSirene` |
| qa 7 | 45 drapeaux posés jamais relus, catégorie C par défaut. | ✅ 16 échos RECIT59 relisent les drapeaux porteurs ; `flags57.cjs` n’a plus de C par défaut (catégorie N bloquante), traces techniques listées dans `tools/qa-550/traces-journal-59.json`. Résultat : A=0, B=0, C=31 (documentées), N=0. | `flags57.cjs` |
| qa 8 | 3 scènes orphelines. | ✗ Rejeté : ACTE2_07_TRANSE_FEN et ACTE4_04_POLY_* sont gardées volontairement comme cibles de redirection des anciennes sauvegardes (30_SceneManager, table de redirection). Les retirer casserait la compatibilité des saves. | sauvegardes 52.5.4 |
| qa 9 | Fragment « Kalthar jeune » inatteignable. | ✅ Seuil mémoire 6 → 4. | echos-atteints |
| qa 10 / playtest 6-8 | L’instabilité punit ; morts « piège » (ABANDON, SUBMIT) ; game over sans reprise. | ✅ Coûts annoncés dans les textes d’ABANDON/SUBMIT ; bouton « Reprendre avant la chute » (état `elenya_avant_chute` sauvé avant chaque choix). ◐ Non vérifié à l’écran dans un vrai navigateur Apps Script (voir QA_REPORT_59). | `surchargeEtVenin` |
| playtest 4 | ABSORBER_FILON +12. | ✅ +8, coût annoncé. | — (valeur lue par audits-59) |
| playtest 5 | Mort par venin sur une transition (ENTRER). | ✅ La mort par venin exige une scène à choix réels (`sceneAChoixReel59_`). | `surchargeEtVenin` |
| playtest 10 | 87 scènes à un seul choix. | ◐ Non traité en V59 (refonte de rythme, risque fort pour les saves) ; listé dans PROBLEMES_RESTANTS_59. | — |
| playtest 12 | Jauges invisibles. | ◐ Givre visible (jauge + retour par choix) ; possession et liens restent implicites, par choix d’écriture. | — |
| romance 4 | Le choix contredit la narration qui suit. | ✅ Choix O : « …que ce soit toi qui choisisses ». | `romanceSirene` |
| romance 5 | Refuser la sirène est puni. | ✅ ACTE3_08 valorise le refus. | `romanceSirene` |
| romance 6 | Fièvres O/E identiques. | ✅ Chutes distinctes (contrat pour Kaelen, foi pour Alistair). L’intensité de la scène est conservée. | `romanceSirene` |
| romance 7 | Le dôme ignore la nuit poly. | ✅ Ligne `reve_poly` au dôme. | `romanceSirene` |
| romance 8 | Cinq scènes romance sur un seul hub. | ✅ Entrées déplacées (trois noms aux portes, liste au dôme, prière d’Alistair au chapitre 4). | recit-58 (entrée mise à jour) |
| romance 9 | Conflit Séraphine avant toute romance. | ✅ ROMPRE conditionné à une romance (baiser, amour ou lien ≥ 4), sinon SEPARER. | `ruptureSeraphine` |
| romance 10 | La liste change de nature. | ✅ Liste semée tôt, payoff corrigé. | — |
| romance 11 | Titre FIN_POLY contradictoire. | ✅ « Ni l’un sans l’autre ». | `romanceSirene` |
| romance 12 | Insulte genrée (masque d’Alistair). | ✅ Remplacée. | `romanceSirene` |
| bible 3 | FIN_VERITE mal conditionnée. | ✅ La ligne Fen = Kalthar exige l’adieu vu (`fen_adieu_scene` ou `kalthar_adieu_vu_59`, posé à ACTE4_07_ADIEU_KALTHAR), l’ancien couple fresque+note restant admis. | — |
| bible 4 | Les yeux de Fen changent pendant la transe. | ✅ C’est la relique (la Larme) qui s’allume d’ambre ; Fen n’a plus d’yeux ambrés. | — |
| bible 5 / bible 6 | PRYMAËLIS vs Primaëlys ; trois sens du nom. | ✅ La gravure est présentée comme « l’ancienne graphie de Primaëlys, du temps où l’on donnait aux gardiennes le nom du lieu qu’elles gardaient » : lieu, gardienne et territoire sont une même tradition. Le nom du lieu reste Primaëlys partout dans le texte visible. | — |
| bible 7 | Inquisition / Ordre du Soleil non reliés. | ✅ Codex « L’Ordre » : l’Inquisition est son bras armé ; réplique ajoutée dans l’acte 2. | `codex` |
| continuity 1 | KILL pose alistair_mort, symétrie avec Kaelen. | ✗ Asymétrie voulue (scène du masque propre à Alistair) ; les lectures défensives de kaelen_mort sont conservées. | — |
| continuity 2 | amis_O_ferme / amis_E_ferme jamais posés. | ✗ Faux positif : écrits via `FLAG_WRITE_ALIASES` (22_State.js). | flags57 |
| continuity 3 | kaelen_reste / alistair_reste jamais posés. | ✅ Posés par les reconversions. | `continuite` |
| continuity 4 | Reconversion E possible si Alistair perdu ou emprisonné. | ✅ Gardes perdu/emprisonné/domination ajoutées aux deux reconversions. | `continuite` + sauvegardes (exception documentée dans run-all : une sauvegarde 52.5.4 en domination ne voit plus la reconversion) |
| continuity 5 | ACTE4_06B_TEST_KAELEN inaccessible. | ✗ Faux positif : atteint par le choix PREUVE ajouté à l’exécution ; la dague y est désormais relue (`dague_kaelen_prise`). | — |

## Moyens et mineurs

| Audit # | Constat | Traitement |
|---|---|---|
| continuity 6 | Acte 2 teste alistair_mort. | ✗ Restes legacy / NG+, inoffensifs, documentés. |
| continuity 7 / 8 | Séraphine et socle : seule la mort d’Alistair testée. | ✅ `alistairLibre59_` + branche « absent ». (`continuite`) |
| continuity 9 / 10 / 11 / 12 | alistair_sans_mission, O/E_distant_1, bivouac_*, kaelen_peur_touchee jamais posés. | ✗ Faux positifs : écrits via `FLAG_WRITE_ALIASES` ; bivouac_garde_main / bivouac_fen_calme sont `legacyReadOnly` (90_QA). |
| continuity 13 | Épilogue générique. | ✅ Voir audit-final 3. |
| continuity 14 | Priorité domination > romance non documentée. | ✅ Documentée dans `docs/59/ARCS_ET_SYSTEMES_59.md`. |
| continuity 15 | ERREUR_SCENE renvoie au réveil. | ✅ Retour à la dernière scène connue de l’historique. (`erreurScene`) |
| bible 8 | ORAYA_CONFRONTATION sans fragment. | ✗ Faux positif : la scène exige déjà `_fragment_4_vu`. |
| bible 9 | « Fen te restitue ta mémoire ». | ✅ Réécrit : les souvenirs remontent, Fen immobile. |
| bible 10 | « ancienne alliance avec Kalthar » trop tôt. | ✅ « une ancienne alliance ». |
| bible 11 | Cri du NOMADE_1 trop explicite. | ✗ Gardé : c’est un indice voulu, sans nom ni lien. |
| bible 12 | Clé Codex PRYMAËLIS. | ✅ Testé : la clé est en NFC et existe dans la DB. (`codex`) Vérification à l’écran non faite. |
| bible 13 | Pas d’entrées Codex Oraya / Trône. | ✅ Ajoutées (Oraya débloquée à FRAGMENT_4_STELE seulement). (`codex`) |
| bible 14 | Commentaire venin « 3 » vs 7. | ✅ Commentaire corrigé. |
| bible 15 | Couleur des yeux. | ✅ Règle fixée : ambre = transe (relique), bleu = Kalthar ; Oraya n’a plus d’yeux bleus dans les indices. Voir `docs/59/BIBLE_59.md`. |
| romance 13 / 14 / 15 | Écho de pause commun ; écho solo du Trône ; mots recyclés. | ✅ Échos séparés par personnage ; écho solo réécrit, réveil solo sans doublon ; « la patronne », « sans triomphe » et « première fois » répartis. |
| playtest 9 | URGENCE C : double coût non annoncé. | ✅ Le texte annonce la montée du givre. |
| playtest 11 | ENTREE_SANCTUAIRE sans image. | ✅ Image du cratère (URL jsDelivr existante). (`dominationNommeeEtImage`) |
| playtest 13 / qa 12 | Échos rares. | ◐ 16 nouveaux échos, graines décorrélées : 23 textes non vus au hasard sur 189 (contre 32). Aucun inaccessible. Le reste est dans PROBLEMES_RESTANTS_59. |
| qa 11 | Graines LCG corrélées. | ✅ echos-atteints et rand57 : graine × 7919 + 8 tours de chauffe. |
| qa 13 | FIN_DOMINATION présentée comme un simple hiver. | ✅ Le texte s’ouvre sur « **Domination** ». (`dominationNommeeEtImage`) |
| qa 14 | NG+ n’hérite pas des liens. | ✅ `last_classic_lien:*` (trio, rupture Séraphine, liens brisés, morts, domination) relus dans NGP_01_SEUIL. (`ngplusHeritage`) |
| qa 15 / audit-final 1 | Copie divergente `game/project/`. | ✅ Copie morte déplacée dans `archives/` (avec LISEZMOI). |
| audit-final 2 / 10 / 11 | README, AGENTS, repli UI et en-têtes de DB faux. | ✅ Version unique 59.0.0 ; en-têtes « N scènes de base » exacts. (`version-unique.cjs`, `entetes-db.cjs`) |
| audit-final 3 | Toutes les fins ont le même épilogue et le même libellé. | ✅ `EPILOGUE59` : passage et clôture propres à chaque fin qui ouvre l’acte 5 ; épilogue limité à 3 échos. FIN_SOLO, FIN_HIVER et FIN_SACRIFICE sont terminales (pas d’acte 5) : leur texte est déjà leur clôture. (`auditFinal`) |
| audit-final 4 / 5 | Ouverture contradictoire et plate. | ✅ Réécrite ; l’inspection du réveil sème les « sept pointes », relues au Trône. (`auditFinal`) |
| audit-final 6 | Tics d’écriture. | ◐ Passe ciblée (silence, quelque chose, Personne ne) et plafonds par fichier d’acte (`tests/tics-59.cjs`). Une relecture humaine reste à faire. |
| audit-final 7 | Voix mélangées. | ✅ Mira : « J’aime les associés qui sentent le roussi » ; Alistair : « Ce que tu tais, je le garderai comme on garde une veille ». ◐ Le lexique « dette » reste partagé par la narration (thème central). |
| audit-final 8 / 9 | Menus FR/EN ; trois libellés de retour. | ✅ « Nouvelle Partie+ », « Sauvegarde auto », « Retour au menu ». (`version-unique.cjs`) |
| audit-final 12 | Docs contradictoires sur le nombre de fins. | ✅ `docs/59/FINS.md` (tableau unique). |
| audit-final 13 | Docs 57 à la racine de la livraison. | ✅ La livraison 59 ne place que les docs 59 à la racine ; STYLE et ARCS sont repris en `STYLE_59.md` et `ARCS_ET_SYSTEMES_59.md`. |
| audit-final 14 | Clé « jamais » mal nommée. | ✅ Renommée `non_vus_aleatoire` (`docs/59-echos-atteints.json`). |
| audit-final 15 | sceneNumber et images d’acte 5. | ✗ Les sceneNumber restent tels quels (ils servent de clés de sauvegarde et de Codex) ; ◐ les illustrations de l’acte 5 sont ajoutées au brief `ILLUSTRATIONS_A_PRODUIRE.md` (non produites, budget zéro). |
