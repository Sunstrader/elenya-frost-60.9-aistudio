# QA 60.0.0
- `npm test` : tous les tests passent (dont `audits-60`, parcours et routes 60, empreinte 60, twist de la sirène).
- lint, build et test:legacy : OK. flags57 : N=0, A=0, B=0, C=31. Échos : 196 textes, 34 non vus au hasard, 0 inaccessible.
- Simulation de 1 500 parties au hasard : 39 % de game over ; fragment jeune 819 ; trio_accord 10 ; FIN_POLY 0 (23 avec la sonde trio).
- Reprise : sur 120 parties, 56 morts, toutes rattrapables par « Reprendre avant la chute ».
- Navigateur : voir les résultats e2e ci-dessous. Captures dans `captures-60/`, hors ZIP.
- Visuel Playwright (`qa-tools/visuel-60.cjs`), en 390×844 et 1280×800 : la jauge ne chevauche pas les choix, le coût ❄ est visible, et un clic réel sur la reprise mène à AGONIE_SURCHARGE, avec 0 erreur console.
- e2e (10 tailles), sauvegardes navigateur, e2e-57 (récit) : OK, 0 erreur console.
- Fenêtres (10 tailles) : OK. Un écart est signalé mais ne fait pas échouer la passe : en 844×390 (mobile paysage), le titre de la fenêtre « Musiques découvertes » sort de l’écran (`dansEcran:false`).
