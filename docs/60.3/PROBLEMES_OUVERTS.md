# Problèmes ouverts — V60.3.0

Ce qui reste de la mission ADN et de la 60.2. Ces points sont listés honnêtement, aucun n'est caché.

1. **Hubs pas regroupés (étape 4 non faite).** Le nombre de choix *visibles* en jeu est plus bas que le compte statique (Auberge 20, Trône 18) : sur 150 parties au hasard, on mesure au plus 9 au Trône (5,9 en moyenne), 8 au bivouac de la crevasse et 7 à l'auberge. Le regroupement « parler / explorer / se reposer » n'est pas fait. Il changerait les clés de choix utilisées par 36 routes de fin enregistrées et par les sauvegardes figées : il faut d'abord prévoir des choix « miroirs ». C'est reporté. À l'auberge, quatre refus ou limites restent présentés côte à côte.
2. **Voix des personnages (étape 6) non relue.** Il n'y a pas eu de relecture comparative 52.4 ↔ 60.3 de Kaelen, d'Alistair et de Fen. Seuls les nouveaux textes ont été écrits dans leur voix (Kaelen sec et transactionnel, Alistair retenu et dévot, Fen sans parole). Risque R9 toujours **non vérifié**.
3. **Concentration des issues.** Elle a baissé sans disparaître. Sur 400 parties au hasard, Sacrifice + Brisée représentent 32,8 % (43,5 % en 60.2) et FIN_BRISEE seule 14,8 % (22,3 %).
4. **Le trio reste rare au hasard** : 0/400 dans ce tirage (2/400 en 60.2, une variance normale pour un événement aussi rare). Les indices sont ajoutés, mais le consentement explicite demande plusieurs choix délibérés, et c'est voulu.
5. **Scènes encore jamais vues au hasard : 13** (20 en 60.2). Restent `ACTE5_01*` (épilogue facultatif après la fin), `DETTE_CHOIX`, `VEYRA_DERNIER_PACTE`, `ACTE2_07_TRUCE_FORCEE` et `ACTE1_08_SECRET`. Elles restent atteignables par des choix délibérés (tests 60.2), mais ne sont pas signalées davantage.
6. **`ACTE2_07_TRANSE_FEN` reste retirée** : le moteur la redirige volontairement depuis 52.5.4. Elle n'a pas été ranimée.
7. **Plafond d'échos au Trône** : les 2 échos rares masqués de la 60.2 ne sont pas traités.
8. **Journal de route et Sac** : affichés dans le panneau Statistiques. Le rendu dans le navigateur n'a pas été vérifié par une capture dédiée (voir TESTS.md).
9. **Apps Script** : verrou des diagnostics validé seulement en simulation (inchangé depuis 60.2). La cible de l'utilisatrice est AI Studio.
10. **Fins sans succès / succès sans scène** : `ach_fin_secrete` et `ach_fin_ng_trone_deux_places` sont retirés du compteur mais restent dans le registre, pour ne pas toucher aux succès déjà débloqués.
