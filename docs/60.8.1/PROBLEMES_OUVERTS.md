# 60.8.1 : problèmes ouverts (non corrigés, à arbitrer)

1. **Surcharge (GAME_OVER_SURCHARGE)**
   - Mesure faite : seuils 52/58 → 56/60, agonies 82 → 73 sur 300 parties (agent raisonnable).
   - Gain faible, et FIN_MIRA disparaît au tirage. Rééquilibrage NON retenu.
   - Preuves : brief-6081/surcharge-avant.json, surcharge-apres-56-60.json.
2. **R5 (romance)**
   - ATTENDRE au dôme ferme la question du trio pour toujours.
   - Il faudrait un marqueur de fenêtre dans l'état. Non fait.
3. **Fins rares**
   - FIN_POLY est atteignable (route figée, 123 choix), mais rare : environ 1 partie sur 1500 avec une politique orientée romance.
   - Le « 0 » du QA est faux au sens strict, mais vrai en pratique.
4. **Haltes et rythme** : les constats « haltes d'exploration » de gameplay.md n'ont pas été retravaillés au-delà des corrections listées dans RAPPORT.md.
5. **Revue visuelle** : le rapport « visuel » de revue-6081 n'a jamais été reçu, donc il n'a pas été intégré. Des captures existent (qa-6081/), mais aucun regard humain n'a jugé l'esthétique.
6. **Morts au Sceau, profil prudent**
   - 9 GAME_OVER_SCELLEE avant et après la correction ; ce sont des clics volontaires sur « Abandonner pour de bon… (sans retour possible) ».
   - Un agent qui évite les choix étiquetés comme mortels ne meurt jamais.
   - Choix de design à confirmer.
7. **Validation hors simulation** : les tests Apps Script sont faits sous Node ; le déploiement réel n'est pas validé.
