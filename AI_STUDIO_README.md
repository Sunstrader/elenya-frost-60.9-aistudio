# Elenya Frost V60.9 — Import Google AI Studio

## Contenu
Projet complet (commit ec2c20cc8095e0f707f33370ceec0e604a221d92).
Fichiers à la racine : index.html (point d'entrée), scripts/, styles/, elenya-refonte-52.4/ (moteur + assets), tests/, tools/, server.js.

## AI Studio
- Point d'entrée recommandé : index.html
- Le jeu est une application web mono-fichier (HTML + CSS inline + JS).
- server.js est le pont Node/Express local (ou Railway) vers le moteur isolé ; non requis pour un import purement client dans AI Studio.
- Styles V52 sécurisés : injectés par scripts/build.js depuis styles/v60.9-style-override.html.

## Tests exécutés
- build : RÉUSSI (override présent)
- fins-exactes : 36 fins, textes et routes distincts
- romance : sceau cohérent

## Limites
- Médias CDN (art54/art55) : certains fonds de scène sont servis depuis le CDN ; les webp locaux (8 fonds + UI) sont inclus.
- Aucune modification narrative.
