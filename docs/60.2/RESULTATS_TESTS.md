# Résultats des tests — 60.2.0 (sorties réelles, 15/10/2026, heure de Paris)

Machine : Node v20.19.2, 8 CPU Intel Xeon, 17 Go, tests en série.

| Commande | Où | Résultat |
|---|---|---|
| `npm test` (lot rapide) | dépôt | **43/43 OK**, 92,1 s |
| `npm run test:full` (lot complet) | dépôt | **tout OK**, 329,7 s (check 76,6 s, Récit 55 59,2 s, Toutes les fins 46,7 s, Audits V59 43,2 s) |
| `npm run lint` | dépôt | 57 fichiers, 0 erreur, 0 avertissement |
| `npm run test:legacy` | dépôt | code 0 |
| `node tests/e2e/visuel-602.cjs` | dépôt | PC 1280×800 et mobile 390×844 : 8 choix cliqués, menu, sauvegarde → réouverture → même scène (FEN_INDICE_1), fin FIN_OMBRE ; 0 cadre bleu, 0 voix, 0 erreur de page |
| Dézip neuf du ZIP + `npm install` + `npm test` + `npm run test:e2e` | **fichiers exacts du ZIP** | voir `tests/fresh.log` dans le ZIP (exécuté après l’étiquette, résultats recopiés ci-dessous dans le ZIP final) |

Sorties détaillées des tests 60.2 :
- `gas-verrou-602` : `docs/60.2-fonctions-publiques.json` (80 publiques, 36 diagnostics privés, refus vérifiés).
- `morts-602` : `docs/60.2/morts.json`.
- `sauvegardes-cycle-602` : `{"sauvegardes60":"90/90","sauvegardes5254":"115/115","ngplusApresGameOver":"VENIN,SURCHARGE,POSSESSION,SIRENE,SCELLEE"}`.
- `echos-erreurs-602` : `{"antiPlantage":true,"journalDevSeulement":true,"imbrication":"OK","affichagesReels":3739,"erreursReelles":0}`.

## Sortie du lot rapide (dépôt)
```
Lot : rapide (CHECK_RUNS=60 par mode, PARTIES60=30)
Machine : Node v20.19.2, 8 CPU (Intel(R) Xeon(R) Processor), 17 Go, tests en série (aucun parallélisme)
OK   Suite historique : bivouac-kaelen (0.2 s)
OK   Suite historique : romance (0.2 s)
OK   Suite historique : check (9.9 s)
OK   Suite historique : first-run (0.1 s)
OK   Suite historique : choice-distinctness (0.2 s)
OK   Suite historique : image-reviewer (0.2 s)
OK   Empreinte narrative identique à la 52.5.4 (ou écarts documentés 53.4.0 / 53.5.0 / 53.6.0 / 54.0.0 / 55.0.0 / 56.0.0 / 57.0.0 / 58.0.0 / 59.0.0 / 60.0.0 / 60.1.0) (0.2 s) — {"scenes":326,"textesIdentiques":false
OK   Intégrité DB : destinations existantes, aucune impasse hors fins (0.0 s) — {"scenes":246,"ngPlus":80}
OK   Sauvegardes 52.5.4 (synthétiques, tous actes + NG+) chargées (même scène, anciens choix conservés) (0.1 s) — 115 sauvegardes
OK   Sauvegarde corrompue ou vide : pas de plantage (0.0 s)
OK   Test du singe : 60 parties classiques + 20 NG+ sans erreur ni blocage (8.3 s) — {"finsDistinctes":13,"fins":{"FIN_VERITE":1,"GAME_OVER_SIRENE":3,"FIN_OMBRE":1,"FIN_BRISEE":18,"FIN_SACRIFICE":10,"FIN_HIVER":4,"FIN_
OK   Toutes les fins atteintes : parcours rejoués vers les fins rares + 60 classiques + 20 NG+ (12.5 s) — {"finsDistinctes":20,"classiques":"18/18","rejoues":23}
OK   Récit 55 : Fêlure, conséquences différées, « La Lame à Nu », redirections (16.1 s) — {"felure":"OK","echos":"OK (7 vérifiés)","lameANu":"OK","jeuReel":{"parties":100,"felure":9,"lameANu":24}}
OK   Sirène : retournement du réveil préservé, clés et drapeaux compatibles (0.2 s) — {"O":"rêve Kaelen → réveil Alistair","E":"rêve Alistair → réveil Kaelen"}
OK   Version unique (package.json → moteur, repli UI, README, AGENTS) et libellés UI en français (0.1 s) — {"version":"60.2.0","ok":true}
OK   En-têtes des DATABASE : nombre réel de scènes (0.1 s) — {"DATABASE_Acte1.js":30,"DATABASE_Acte2.js":48,"DATABASE_Acte3.js":33,"DATABASE_Acte4.js":24,"DATABASE_Acte5.js":4,"DATABASE_Endings.js":25,"DATABASE_Frag
OK   Audits V58 : régressions des points critiques et majeurs (0.2 s) — {"dominationExclutRomance":"OK","ruptureSeraphine":"OK","orayaSansRevelation":"OK","surchargeEtVenin":"transition testée : ACTE3_09_ENTREE_SANCT
OK   Audits V59 : reprise, agonies, bible, trio, romance (V60) (4.7 s) — {"repriseEtSuivant":{"parties":30,"morts":15,"sauvables":15,"parType":{"GAME_OVER_SURCHARGE":6,"GAME_OVER_SIRENE":4,"GAME_OVER_VENIN":3,"GAME_OVE
OK   Tics d’écriture : plafonds par fichier d’acte (V59) (0.1 s) — {"fichiers":7,"ok":true}
OK   Échos 57/58 : aucun écho inaccessible (parties + graphe + rendu) (13.2 s) — {"textes":199,"nonAtteints":55,"inaccessibles":0}
OK   Romances/fins 56 : trio consenti ≠ domination, rupture non rouverte (positifs + négatifs) (0.2 s) — {"polyPositif":"OK","polyNegatifJauges":"OK","dominationDistincte":"OK","dominationFermeTrio":"OK","ruptureO":
OK   Récit 57 : instabilité ≠ possession, Silas/Veyra/Alistair/Séraphine, dilemme politique, NG+ par le savoir (positifs + négatifs) (0.2 s) — {"instabilitePossession":"OK","silas":"OK","veyra":"OK","alistair":"O
OK   Les 9 parcours exigés (solo, Kaelen, Alistair, rupture, pause/réparation, instabilité, possession, domination, NG+) rejoués de bout en bout (1.9 s) — {"solo":"FIN_SOLO (109 choix)","kaelen":"FIN_OMBRE (135 cho
OK   Récit 58 : branches réelles (Alistair, Silas, Veyra, Trône, épilogue), romances et solo approfondis, NG+ recadré (0.2 s) — {"alistairBranche":"OK","branchesTrone":"OK","epilogueVillage":"OK","romances":"OK","
OK   Interface 55 : voix retirée, musique/SFX gardés, plein écran proposé sans blocage (0.1 s) — {"fichiers":42,"ok":true}
OK   Assets : inventaire des URLs (hors ligne) (0.0 s) — 441 URLs (liste : tests/assets-urls.txt)
OK   Page assemblée : aucun script avalé par une balise <style> non fermée (corrigé en 53.3.0) (0.0 s) — tous les scripts actifs ; fenêtres et cadre du récit présents
OK   Préchargement : indices des scènes suivantes fournis par le serveur (0.1 s) — 63/115 scènes avec indices
OK   Typographie : apostrophes typographiques dans les textes des scènes (0.0 s) — aucune apostrophe droite restante
OK   Serveur (60.1) : diagnostic refusé en production, jeu ouvert (0.4 s) — {"prodDiag":403,"prodJeu":200,"localDiag":200}
OK   Déploiement (60.1) : DEPLOIEMENT.md cite chaque fichier, includes présents (0.1 s) — {"fichiers":46,"includes":12}
OK   Source unique (60.1) : aucune copie hors du dossier canonique (0.1 s) — {"canonique":"elenya-refonte-52.4/project","copies":0}
OK   Sauvegardes 60.1 : 90 états figés (dont NG+), format gardé, NG+ après game over (0.3 s) — {"choixAjoutes":["pause#118 SCEAU_DERNIER_SOUFFLE:TENUE"],"sauvegardes60":"90 (dont NG+ 3)","format":"inchangé (22 cl�
OK   Interface 60.1 : aucun reliquat de narration vocale (ids, fonctions, CSS) (0.1 s) — {"reliquats":0}
OK   Échos rares 60.1 : un parcours fixe par écho rare trouvé (rejoué, texte affiché) (3.0 s) — {"rares":155,"rejoues":72,"sansRoute":83}
OK   Images affichées 60.1 : inventaire PC/mobile/préchargement (hors ligne) (0.3 s) — {"urls":66,"enLigne":false,"echecs":[]}
OK   Verrou Apps Script 60.2 (simulation GAS) : diagnostics privés, porte serverDevDiagnostic (drapeau + utilisateur autorisé), admin Reviewer propriétaire seul (0.2 s) — {"publiques":["Date","_choiceRelationalTarge
OK   Échos 60.2 : erreurs mémorisées (anti-plantage gardé), journal en dev seulement, imbrication et plafond corrects (5.3 s) — {"antiPlantage":true,"journalDevSeulement":true,"imbrication":"OK","affichagesReels":3
OK   Sauvegardes 60.2 : cycle complet sauvegarde → stockage → nouveau moteur → chargement → reprise (90 + 115 anciennes), NG+ après les 5 types de game over (6.8 s) — {"sauvegardes60":"90/90","sauvegardes5254"
OK   Morts 60.2 : 5 morts depuis des routes réelles ; céder → GAME_OVER, survivre → retour au jeu avec conséquence (1.2 s) — {"VENIN":{"agonie":"AGONIE_VENIN","choixRoute":77,"survies":{"GELER":{"trone":"visité
OK   Systèmes 60.1 : agonie à deux choix pour chaque catégorie de mort (déclencheur réel, survie, céder), chronologie unique (0.2 s) — {"categories":{"VENIN":"déclencheur → AGONIE_VENIN → survie OK / céder 
OK   Fins 60.1 : 36 routes déterministes rejouées, routes négatives au Trône (solo, ruptures, domination, compagnon absent, refus du trio), Oraya / Alistair / Séraphine (5.1 s) — {"fins":36,"rejouees":36,"sansRout
OK   Budget du lot rapide : 92 s ≤ 180 s (0.0 s)
Durée totale : 92.1 s — plus lents : Récit 55 : Fêlure, conséquences différée 16.1 s | Échos 57/58 : aucun écho inaccessible (p 13.2 s | Toutes les fins atteintes : parcours rej 12.5 s | Suite historique : chec
```
