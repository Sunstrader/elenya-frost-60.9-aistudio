# Problèmes ouverts — V60.8.0

Importants (raisons pour lesquelles la version n'est pas déclarée « prête ») :
1. Les fins rares n'ont pas été jouées à la main de bout en bout : POLY, VEYRA, SERAPHINE_LAME, SERAPHINE_COEUR, RECONCILIATION, REDEMPTION, EQUILIBRE, VERITE, DOMINATION, GAME_OVER_POSSESSION et les 3 épilogues de l'acte 5. Elles sont rejouées par le moteur et affichées dans Chrome, mais leur texte n'a pas été relu par un humain.
2. Revues `da-visuel.md` et `uiux.md` jamais reçues : le style a été contrôlé uniquement contre la 52.5.4, à partir de mes propres captures.

Secondaires :
3. Sur PC 1366×768, les écrans de fin longs (ex. FIN_POLY) demandent de faire défiler le panneau pour voir les boutons. Le défilement fonctionne, mais rien ne le signale visuellement.
4. Les libellés du haut du menu rapide (Journal, Notes, Liens, Apparition) sont peu contrastés. C'était déjà le cas avant, je n'y ai pas touché.
5. « porte », « cage », « insigne » subsistent dans le texte historique non réécrit (environ 200 occurrences de « porte »). Seuls les passages réécrits en ont été nettoyés.
6. Côté client, l'ancien run NG+ reste dans `localStorage` en tant que copie `_backup` (garde-fou existant). Le serveur, lui, est purgé.
7. FIN_RECONCILIATION et FIN_REDEMPTION (instabilité < 10) restent difficiles. Les choix R608 audacieux (+2 à +4) les éloignent, les choix prudents (−1/−2) les rapprochent. L'équilibrage est à valider en playtest.
8. Le premier écran du Codex affiche « Les premières entrées apparaîtront… » sous le journal tant qu'aucune entrée de codex n'est découverte. Le message est exact, mais il peut prêter à confusion.
9. Une exécution isolée de `parcours-57` a échoué juste après la régénération, puis a passé à chaque nouvelle exécution (3 fois, et dans `npm test`). Origine probable : lecture du fichier pendant son écriture.
