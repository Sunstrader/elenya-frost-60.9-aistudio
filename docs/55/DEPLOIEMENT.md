# DÉPLOIEMENT — mettre en ligne la 55.0.0
Je n’ai rien publié. C’est toi qui décides quand mettre en ligne.

## Étape 1 — Préparer
1. Dézippe `elenya-frost-55.0.0.zip`.
2. Ouvre le dossier `game/elenya-refonte-52.4/project/`.
3. Garde le ZIP 54.0.0 de côté : c’est ta roue de secours.

## Étape 2 — Remplacer les fichiers (en partant de la 54.0.0)
Pour chaque fichier :
1. clique sur son nom dans Apps Script ;
2. fais Ctrl+A puis Suppr ;
3. colle le contenu du fichier du même nom (ouvre-le avec le Bloc-notes, puis Ctrl+A, Ctrl+C).

Fichiers `.js` (16) :
- `10_Triggers`, `20_Core_Helpers`, `22_State`, `23_Refonte`, `30_SceneManager`, `90_QA` ;
- `DATABASE_Acte1`, `DATABASE_Acte2`, `DATABASE_Acte3`, `DATABASE_Acte4`, `DATABASE_Acte5` ;
- `DATABASE_Endings`, `DATABASE_Fragments`, `DATABASE_Index`, `DATABASE_Relations`, `DATABASE_Secondary`.

Fichiers `.html` (5) :
- `Cinematic_UI_InputGuard`, `Cinematic_UI_Landscape`, `Game_Interface`, `Scripts_Game`, `Scripts_Refonte`.

Aucun fichier n’est ajouté ni supprimé. Clique sur la disquette pour enregistrer.

## Étape 3 — Publier sans changer l’adresse
1. Ouvre **Déployer > Gérer les déploiements**.
2. Clique sur le crayon du déploiement existant.
3. Dans **Version**, choisis **Nouvelle version**, mets la description `55.0.0`, puis clique sur **Déployer**.

## Étape 4 — Vérifier
1. Le menu titre s’affiche. Dans les informations techniques, la version est **V55.0.0**.
2. Nouvelle partie : la fenêtre « Jouer en plein écran ? » apparaît. Les deux boutons lancent la partie.
3. Continuer : un petit bandeau propose le plein écran, puis disparaît seul.
4. Il n’y a plus de bouton de narration vocale. La musique et les effets fonctionnent.

## Si la 55.0.0 est déjà en ligne → 55.0.1
Il suffit de recoller 3 fichiers : `22_State`, `90_QA` et `DATABASE_Acte3`. Publie ensuite une nouvelle version avec la description `55.0.1`.
