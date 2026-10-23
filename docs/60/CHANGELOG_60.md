# Changelog 60.0.0
- Agonies `AGONIE_SURCHARGE` et `AGONIE_VENIN`, derniers souffles `SIRENE_DERNIER_SOUFFLE` et `SCEAU_DERNIER_SOUFFLE` : toute mort vient d’un choix explicite (+4 scènes, 245 classiques).
- La reprise « avant la chute » n’est sauvée que sur une scène à au moins deux choix. La mort différée est supprimée.
- Coût en givre (❄+N) affiché sur les boutons. La jauge passe en haut sur mobile ; le bouton de reprise est mis en page correctement.
- Bible : indices d’Oraya, couleur des yeux, Codex Kalthar.
- Romance : réparation POLY_REPARER, clôture d’ACTE3_07 selon le choix, ACTE3_08 route E, SEPARER, voix, tic « Cette fois », Portes.
- QA : trio (3 fenêtres, crevasse explicite), domination ↔ fins romance, fragment Kalthar jeune (et son retour), héritage NG+, échos trio et agonies.
- Moteur : choix vers une scène absente filtrés, `poly_active`, alias amis.
- Tests : `tests/audits-60.cjs` ; parcours et routes regénérés en 60 ; empreinte 60 ; `qa-tools/visuel-60.cjs` (Playwright).
