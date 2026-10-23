# Résultats des tests — 60.1.0 (sorties réelles, 15/10/2026, heure de Paris)

| Commande | Résultat |
|---|---|
| `npm test` (lot rapide) | **39/39 OK**, 80 s (budget 180 s) |
| `npm run test:full` (lot complet) | **tout OK**, 318 s (budget 1200 s) |
| `npm run lint` | 56 fichiers, 0 erreur, 0 avertissement |
| `npm run build` | index.html synchronisé (403 890 octets) |
| `npm run test:legacy` | code 0 |
| `npm run test:e2e` (Chrome réel, captures hors dépôt) | e2e 213 s · saves 18 s · recit-57 89 s · fenetres-1 271 s · fenetres-2 195 s · visuel-60 39 s · visuel-601 60 s : **7/7 OK** |
| `ONLINE=1 node tests/urls-affichees-601.cjs` | `{"urls":66,"enLigne":true,"echecs":[]}` |
| Dézip neuf du ZIP + `npm install` + `npm test` | voir `tests/fresh.log` dans le ZIP (exécuté après l’étiquette) |

Mesures (joueur aléatoire, 1500 parties, graines 5000+) : game over 524/1500 = 34,9 % (60.0 : 592 = 39,5 %) ; choix uniques 44,8 % des affichages ; trio_accord 6/1500.
Fins : 36/36 routes rejouées ; 7 routes négatives au Trône OK + contrôle positif FIN_POLY.
Échos rares : 155, dont 72 rejoués par route fixe, 83 sans route (négatif conservé).

## Sortie du lot rapide
```
OK   Suite historique : bivouac-kaelen
OK   Suite historique : romance
OK   Suite historique : check
OK   Suite historique : first-run
OK   Suite historique : choice-distinctness
OK   Suite historique : image-reviewer
OK   Empreinte narrative identique à la 52.5.4 (ou écarts documentés 53.4.0 / 53.5.0 / 53.6.0 / 54.0.0 / 55.0.0 / 56.0.0 / 57.0.0 / 58.0.0 / 59.0.0 / 60.0.0 
OK   Intégrité DB : destinations existantes, aucune impasse hors fins — {"scenes":246,"ngPlus":80}
OK   Sauvegardes 52.5.4 (synthétiques, tous actes + NG+) chargées (même scène, anciens choix conservés) — 115 sauvegardes
OK   Sauvegarde corrompue ou vide : pas de plantage
OK   Test du singe : 60 parties classiques + 20 NG+ sans erreur ni blocage — {"finsDistinctes":13,"fins":{"FIN_VERITE":1,"GAME_OVER_SIRENE":3,"FIN_OMBRE":1,"F
OK   Toutes les fins atteintes : parcours rejoués vers les fins rares + 60 classiques + 20 NG+ — {"finsDistinctes":20,"classiques":"18/18","rejoues":23}
OK   Récit 55 : Fêlure, conséquences différées, « La Lame à Nu », redirections — {"felure":"OK","echos":"OK (7 vérifiés)","lameANu":"OK","jeuReel":{
OK   Sirène : retournement du réveil préservé, clés et drapeaux compatibles — {"O":"rêve Kaelen → réveil Alistair","E":"rêve Alistair → réveil Ka
OK   Version unique (package.json → moteur, repli UI, README, AGENTS) et libellés UI en français — {"version":"60.1.0","ok":true}
OK   En-têtes des DATABASE : nombre réel de scènes — {"DATABASE_Acte1.js":30,"DATABASE_Acte2.js":48,"DATABASE_Acte3.js":33,"DATABASE_Acte4.js":24,"DATABASE
OK   Audits V58 : régressions des points critiques et majeurs — {"dominationExclutRomance":"OK","ruptureSeraphine":"OK","orayaSansRevelation":"OK","surcharge
OK   Audits V59 : reprise, agonies, bible, trio, romance (V60) — {"repriseEtSuivant":{"parties":30,"morts":15,"sauvables":15,"parType":{"GAME_OVER_SURCHARGE":
OK   Tics d’écriture : plafonds par fichier d’acte (V59) — {"fichiers":7,"ok":true}
OK   Échos 57/58 : aucun écho inaccessible (parties + graphe + rendu) — {"textes":198,"nonAtteints":54,"inaccessibles":0}
OK   Romances/fins 56 : trio consenti ≠ domination, rupture non rouverte (positifs + négatifs) — {"polyPositif":"OK","polyNegatifJauges":"OK","dominationDi
OK   Récit 57 : instabilité ≠ possession, Silas/Veyra/Alistair/Séraphine, dilemme politique, NG+ par le savoir (positifs + négatifs) — {"instabilitePoss
OK   Les 9 parcours exigés (solo, Kaelen, Alistair, rupture, pause/réparation, instabilité, possession, domination, NG+) rejoués de bout en bout — {"solo"
OK   Récit 58 : branches réelles (Alistair, Silas, Veyra, Trône, épilogue), romances et solo approfondis, NG+ recadré — {"alistairBranche":"OK","branches
OK   Interface 55 : voix retirée, musique/SFX gardés, plein écran proposé sans blocage — {"fichiers":41,"ok":true}
OK   Assets : inventaire des URLs (hors ligne) — 441 URLs (liste : tests/assets-urls.txt)
OK   Page assemblée : aucun script avalé par une balise <style> non fermée (corrigé en 53.3.0) — tous les scripts actifs ; fenêtres et cadre du récit pr
OK   Préchargement : indices des scènes suivantes fournis par le serveur — 63/115 scènes avec indices
OK   Typographie : apostrophes typographiques dans les textes des scènes — aucune apostrophe droite restante
OK   Serveur (60.1) : diagnostic refusé en production, jeu ouvert — {"prodDiag":403,"prodJeu":200,"localDiag":200}
OK   Déploiement (60.1) : DEPLOIEMENT.md cite chaque fichier, includes présents — {"fichiers":45,"includes":12}
OK   Source unique (60.1) : aucune copie hors du dossier canonique — {"canonique":"elenya-refonte-52.4/project","copies":0}
OK   Sauvegardes 60.1 : 90 états figés (dont NG+), format gardé, NG+ après game over — {"choixAjoutes":["pause#118 SCEAU_DERNIER_SOUFFLE:TENUE"],"sauvegar
OK   Interface 60.1 : aucun reliquat de narration vocale (ids, fonctions, CSS) — {"reliquats":0}
OK   Échos rares 60.1 : un parcours fixe par écho rare trouvé (rejoué, texte affiché) — {"rares":155,"rejoues":72,"sansRoute":83}
OK   Images affichées 60.1 : inventaire PC/mobile/préchargement (hors ligne) — {"urls":66,"enLigne":false,"echecs":[]}
OK   Systèmes 60.1 : agonie à deux choix pour chaque catégorie de mort (déclencheur réel, survie, céder), chronologie unique — {"categories":{"VENIN":"d
OK   Fins 60.1 : 36 routes déterministes rejouées, routes négatives au Trône (solo, ruptures, domination, compagnon absent, refus du trio), Oraya / Alistair
OK   Budget du lot rapide : 80 s ≤ 180 s
```
