# DÉPLOIEMENT — 60.1.0

Rien n’a été publié par l’agent. Ce document décrit l’état réel du dépôt ; le test `tests/deploiement.cjs` vérifie qu’il cite chaque fichier de la source.

## Plateforme
- **Production : Google Apps Script** (application web, `appsscript.json` : V8, `ANYONE_ANONYMOUS`). Le nom de l’app et les URL jsDelivr des assets ne changent pas.
- **Développement et QA : Node** (`server.js`), qui sert la même source et simule `google.script.run`. `railway.json` permet un miroir Node (Railway) ; ce n’est pas la plateforme de production. En miroir, `PORT` est fourni par la plateforme : le serveur écoute alors sur 0.0.0.0 et refuse les méthodes de diagnostic (sauf `ELENYA_DIAG=1`).

## Source unique
`elenya-refonte-52.4/project/` est la seule source. `archives/` (copies mortes 52) est exclu du ZIP de livraison (`export-ignore`) ; le test `tests/source-unique.cjs` échoue si une autre copie de la source apparaît.

## Fichiers à placer dans Apps Script (tous, mêmes noms sans extension)
### Code serveur (.gs)
- `00_EntryPoints` (`00_EntryPoints.js`)
- `10_Triggers` (`10_Triggers.js`)
- `20_Core_Helpers` (`20_Core_Helpers.js`)
- `21_Assets` (`21_Assets.js`)
- `22_State` (`22_State.js`)
- `23_Refonte` (`23_Refonte.js`)
- `24_NGPlus_Ultra` (`24_NGPlus_Ultra.js`)
- `25_NGPlus_Ultra_Visuals` (`25_NGPlus_Ultra_Visuals.js`)
- `30_SceneManager` (`30_SceneManager.js`)
- `50_Server_API` (`50_Server_API.js`)
- `90_QA` (`90_QA.js`)
- `95_NGPlus_Ultra_QA` (`95_NGPlus_Ultra_QA.js`)
- `DATABASE_Acte1` (`DATABASE_Acte1.js`)
- `DATABASE_Acte2` (`DATABASE_Acte2.js`)
- `DATABASE_Acte3` (`DATABASE_Acte3.js`)
- `DATABASE_Acte4` (`DATABASE_Acte4.js`)
- `DATABASE_Acte5` (`DATABASE_Acte5.js`)
- `DATABASE_Endings` (`DATABASE_Endings.js`)
- `DATABASE_Fragments` (`DATABASE_Fragments.js`)
- `DATABASE_Index` (`DATABASE_Index.js`)
- `DATABASE_Misc` (`DATABASE_Misc.js`)
- `DATABASE_NGPlus` (`DATABASE_NGPlus.js`)
- `DATABASE_Relations` (`DATABASE_Relations.js`)
- `DATABASE_Secondary` (`DATABASE_Secondary.js`)
- `ImageReviewer_Backend` (`ImageReviewer_Backend.js`)
- `Reviewer_Backend` (`Reviewer_Backend.js`)

### HTML
- `Character_3D_Runtime` (`Character_3D_Runtime.html`) : inclus par V12_Jeu
- `Character_Modular_Runtime` (`Character_Modular_Runtime.html`) : inclus par V12_Jeu
- `Cinematic_UI_InputGuard` (`Cinematic_UI_InputGuard.html`) : inclus par V12_Jeu
- `Cinematic_UI_Landscape` (`Cinematic_UI_Landscape.html`) : inclus par V12_Jeu
- `Cinematic_UI_Runtime` (`Cinematic_UI_Runtime.html`) : inclus par V12_Jeu
- `Cinematic_UI_Styles` (`Cinematic_UI_Styles.html`) : inclus par V12_Jeu
- `Game_Interface` (`Game_Interface.html`) : inclus par V12_Jeu
- `ImageReviewer` (`ImageReviewer.html`) : outil de relecture (doGet ?mode=…)
- `JRPG_UI_Runtime` (`JRPG_UI_Runtime.html`) : inclus par V12_Jeu
- `JRPG_UI_Styles` (`JRPG_UI_Styles.html`) : inclus par V12_Jeu
- `Reviewer` (`Reviewer.html`) : outil de relecture (doGet ?mode=…)
- `Scripts_Game` (`Scripts_Game.html`) : inclus par V12_Jeu
- `Scripts_Refonte` (`Scripts_Refonte.html`) : inclus par V12_Jeu
- `Styles_Game` (`Styles_Game.html`) : inclus par V12_Jeu
- `V12_Jeu` (`V12_Jeu.html`) : page du jeu (doGet)

### Manifeste et autres
- `appsscript.json` : manifeste (à coller dans l’éditeur, « Afficher le fichier manifeste »).
- `.clasp.json` : non déployé (note de développement)
- `MISE_A_JOUR_REVIEWER_V4.txt` : non déployé (note de développement)
- `elenya-frames.css` : non déployé (note de développement)
- `assets/`, `elenya-frames/`, `elenya-frames.css` : servis par jsDelivr en production, par `server.js` en local ; rien à copier dans Apps Script.

## Procédure (manuelle, par le propriétaire)
1. Garder le ZIP 60.0.0 comme roue de secours.
2. Remplacer dans l’éditeur Apps Script chaque fichier listé ci-dessus (y compris `Cinematic_UI_Landscape`, oublié dans les notes 55 à 58).
3. Déployer → Gérer les déploiements → nouvelle version `60.1.0`.
4. Les sauvegardes 52.5.4 à 60 restent compatibles (format inchangé, tests `Sauvegardes` et `sauvegardes-601`).

## Limite connue
Dans Apps Script, toute fonction globale est appelable par `google.script.run` : les fonctions de diagnostic (`serverValidateDatabase`, `serverRunAAAHealthCheck`…) restent appelables en production. La restriction ne vaut que pour le serveur Node.
