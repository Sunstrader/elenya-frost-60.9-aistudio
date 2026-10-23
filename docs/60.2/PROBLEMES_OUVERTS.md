# Problèmes ouverts — 60.2.0

1. **Déploiement Apps Script réel non validé.** Le verrou n’est prouvé que par simulation. À vérifier après déploiement :
   - `google.script.run.serverValidateDatabase_()` doit échouer ;
   - `serverDevDiagnostic('serverValidateDatabase')` doit répondre `DIAGNOSTIC_RESERVE_DEV`.
2. **Identification du propriétaire en web app** (`USER_DEPLOYING`, accès anonyme) : `getActiveUser()` peut renvoyer une adresse vide, même pour le propriétaire. Passer alors par l’éditeur ou par `ELENYA_DEV_EMAILS`.
3. **Le tri d’images est fermé par défaut** : il faut `ELENYA_DEV_DIAG=1`.
4. **Durée de `npm test`** : 92 s ici. Les 700 s du relecteur ne sont pas reproduites ; les durées par test permettront de trouver la cause sur sa machine.
5. **Plafond d’échos au Trône (4)** : il masque 2 échos rares dont les conditions sont pourtant réunies (Séraphine « nom brûlé », fêlure d’Alistair). Le choix entre priorité et plafond reste à trancher par l’autrice.
6. **83 échos rares** : 62 ont un drapeau jamais posé en 400 parties aléatoires, 6 un drapeau et une scène hôte jamais réunis. Aucun n’est inaccessible en lecture statique.
7. **31 drapeaux jamais relus** : 10 conséquences abandonnées (dont 6 reliquats V28) et 2 dépendances manquantes (`artefact_citadelle`, `sommeil_lourd`) sont des candidats à un écho. Le classement repose sur le lieu de pose et le nom du drapeau.
8. **Survies gratuites** : `MAIN_TENDUE` (sirène) et `TENUE` (Sceau) ne coûtent aucune jauge.
9. **Compteur de fins** : l’écran affiche « / 35 » alors que les tests comptent 36 scènes de fin. Trois clôtures d’épilogue n’ont pas de succès, et deux succès (`ach_fin_secrete`, `ach_fin_ng_trone_deux_places`) n’ont pas de scène.
10. **Contraste** : les intitulés secondaires du menu rapide sont peu lisibles sur la capture PC.
11. **Taux de game over** au hasard : 34,9 %. Scènes à choix unique : 35,8 % (statique) et 44,8 % (en jeu). FIN_POLY reste rare au hasard (consentement explicite).
12. **Cache jsDelivr** : `autel-reveil.webp` et `chambre-automate.webp` ont répondu 404 sur la branche `@main` avant le 15/10 ; à surveiller.
13. **Fonctions de jeu publiques** (80) : elles ne prennent que l’état passé en argument et n’exposent pas les données des autres joueurs. Elles restent appelables, c’est le fonctionnement normal.
