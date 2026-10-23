# RETOUR EN ARRIÈRE — revenir à la 54.0.0
En bref : si la 55.0.0 pose problème, tu reviens à la version précédente en 2 minutes.

## Méthode rapide (recommandée)
1. Dans Apps Script, ouvre **Déployer > Gérer les déploiements**.
2. Clique sur le **crayon** du déploiement existant.
3. Dans **Version**, choisis l’ancienne version `54.0.0`, puis **Déployer**.

L’adresse du jeu ne change pas.

## Méthode complète (si l’ancienne version n’est plus listée)
Recolle les 21 fichiers listés dans `DEPLOIEMENT.md` (16 `.js` + 5 `.html`) depuis le ZIP **54.0.0**, puis publie une nouvelle version.

## Et les sauvegardes ?
- Les parties de la 55.0.0 se rechargent en 54.0.0. Les nouveaux drapeaux (`felure_…`, `romance_X_rompue`, `_fragment_4_vu`…) sont simplement ignorés. Une rupture n’aura donc plus d’effet en 54.
- Une partie arrêtée **sur une scène de Fêlure** (ROMANCE_FELURE_O / _E) n’existe pas en 54 : le jeu la renvoie au début de l’acte en cours.
- Les anciens réglages de narration vocale ont été effacés des préférences par la 55. La 54 reprend ses valeurs par défaut.
- Les succès restent acquis dans les deux sens.

## Pour un développeur
- Le dépôt git complet est dans `historique-git.bundle` (`git clone historique-git.bundle`).
- `git checkout v54.0.0` (commit f9f0696) revient exactement à la 54.
- `v55.0.0` est la livraison actuelle.
