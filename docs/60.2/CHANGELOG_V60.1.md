# CHANGELOG — 60.1.0 → 60.2.0

## Sécurité (critique)
- Nouveau fichier `05_DevGuard.js` : porte unique `serverDevDiagnostic`, protégée par la propriété `ELENYA_DEV_DIAG` et par l’utilisateur (propriétaire ou `ELENYA_DEV_EMAILS`).
- 36 diagnostics et 7 helpers de QA passent en privé (suffixe `_`).
- Administration du Reviewer réservée au propriétaire.
- Le tri d’images passe par la porte de diagnostic.

## Moteur et récit
- Les erreurs d’écho sont mémorisées, et journalisées en développement seulement (`_echoErreur602_`, `efEchoErreurs602_`).
- Écho au Trône relisant `possession_agonie_ouverte_601`.

## Tests
- Nouveaux :
  - `gas-verrou-602` : verrou Apps Script ;
  - `echos-erreurs-602` : erreurs d’écho et imbrication ;
  - `sauvegardes-cycle-602` : 205 sauvegardes, NG+ après 5 game over ;
  - `morts-602` : morts depuis des routes réelles ;
  - `e2e/visuel-602` : Chrome PC et mobile, clics réels.
- `run-all.cjs` : début de chaque test annoncé, durée par test, en-tête machine, bilan des tests les plus lents.
- `echos-atteints` : prise en compte des interceptions globales qui reviennent par RETURN.
- `deploiement.cjs` lit désormais `docs/60.2/DEPLOIEMENT.md`.

## Outils et documents
- Outils : `classer-fins-602`, `classer-echos-602`, `classer-drapeaux-602`, `relecture-602`.
- Documents `docs/60.2/` : DEPLOIEMENT, FINS_CLASSEMENT, ECHOS_RARES, DRAPEAUX_NON_RELUS, RELECTURE, AUDIT_CORRECTIONS_V60.1, PROBLEMES_OUVERTS, RESULTATS_TESTS.

## Version
- 60.2.0 : `package.json`, `22_State.js`, `90_QA.js`, `Scripts_Game.html`, README, AGENTS.
- Format de sauvegarde inchangé : 22 clés, schemaVersion 50.
