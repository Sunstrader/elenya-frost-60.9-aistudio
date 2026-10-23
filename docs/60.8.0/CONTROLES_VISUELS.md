# Contrôles visuels réellement faits — V60.8.0

Tout a été fait dans Chrome 154 headless, sur PC 1366×768 et sur mobile 390×844. Les captures sont dans `/workspace/elenya-remaster/qa-608/` (hors ZIP, sauf mention contraire).

| Contrôle | Script | Captures | Regardées à l'œil |
|---|---|---|---|
| 52.5.4 vs 60.x, styles calculés | `visuel.cjs` | `captures-52.5.4/`, `captures-avant/`, `captures-apres/`, `comparaisons/` | oui (choix, menu, narration) |
| Menu rapide complet | `sonde-menu.cjs` | `menu-apres/`, `captures-finales/*-07-menu.png` | oui |
| Parcours final : accueil → lancement → cinématique → narration → choix → personnage → menu → codex → sauvegarde → chargement → plein écran | `visuel.cjs` | `captures-finales/` (22 images) ; 0 erreur JS ; sauvegarde reprise sur la même scène | oui : narration et choix (PC, mobile), menu (mobile) |
| Journal de route et sac dans le Codex, avant/après rechargement | `codex-journal.cjs` | `codex-journal/` | oui (PC, mobile) |
| Les 36 fins | `fins.cjs` | `fins-avant/` (défaut) puis `fins/` (72 images) | oui : FIN_POLY, FIN_SERAPHINE_LAME, GAME_OVER_SCELLEE ; les autres par contrôle automatique (texte affiché, 0 erreur JS) |
| Suites e2e du dépôt | `npm run test:e2e` | `/workspace/elenya-remaster/captures-e2e/` | non |
