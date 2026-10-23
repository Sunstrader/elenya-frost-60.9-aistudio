# TESTS — V60.3.0

| Commande | Résultat réel | Où |
|---|---|---|
| `npm test` (lot rapide) | **44/44 OK**, 87,5 s, sur le dépôt après la dernière modification du moteur | `tests/t603.log` |
| `npm test` sur le ZIP fraîchement décompressé (`npm install` puis `npm test`) | voir `tests/fresh603.log` dans le ZIP | ZIP |
| `npm run lint` / `npm run build` | 0 erreur, 0 avertissement / `index.html` synchronisé | — |
| `npm run test:e2e` (Chrome headless, 10 tailles d'écran PC et mobile) | **8/8 OK** : e2e 258 s, saves 18 s, recit-57 89 s, fenetres-1 159 s, fenetres-2 210 s, visuel-60 41 s, visuel-601 54 s, visuel-602 144 s | `tests/e2e603.log` ; captures hors ZIP |

Réserve e2e : la suite navigateur a démarré avant le dernier commit moteur. Ce commit ne change qu'une option de la halte, l'option Fen, désormais sans redirection vers la scène retirée. Il n'a pas été relancé dans Chrome. `npm test` l'a été.

## Nouveau test : `tests/adn-603.cjs`
- Fins : 36 écrans, 0 alias, 16 lignées, et chaque fin distincte a un titre propre.
- Halte de l'auberge depuis une **partie neuve** (choix guidés, graine trouvée par recherche, pas d'état injecté) : salle commune → rumeurs → carte dans l'inventaire → abri de la Marche Blanche.
- Journal de route : la quête « abri » est accomplie et transmise au client ; les objets sont nommés.
- Sauvegarde → JSON → reprise : inventaire et quêtes identiques.
- Réputation : même scène réelle, réputation du village forcée à +3 ou −3. Le texte change, et le choix réservé apparaît ou disparaît (seule la réputation est injectée).
- Volonté : coût de −2 sur `MAIN_TENDUE` et `TENUE`.
- Trio : `poly_eligible` est lu ; aucune option de halte ne pose `trio_accord`.

## Tests modifiés (ils attendaient l'ancienne redirection des variantes)
- `qa/check.cjs` : 36 fins affichées et 0 alias (au lieu de 20 et 16) ; 6 fins NG+ atteintes (au lieu de 2).
- `tests/romances-fins-56.cjs` : la domination mène à `FIN_DOMINATION`, de la lignée `FIN_HIVER`.
- `tests/parcours-57.cjs`, `tests/fins-routes-601.cjs`, `tests/echos-rares-601.cjs` : une fin distincte est acceptée si elle appartient à la famille attendue. Les 36 routes et les 72 échos rares sont toujours rejoués.

## Mesures au hasard (outil `tests/_dist.cjs`, hors `npm test`, 400 parties)
Voir RAPPORT.md. Ce sont des **mesures**, pas des tests réussis ou échoués.

## Non vérifié
- Rendu visuel du « Journal de route » et du « Sac » dans le panneau Statistiques (pas de capture dédiée).
- Déploiement réel (AI Studio ou Apps Script) : rien n'a été déployé.
- Relecture des voix (étape 6).
