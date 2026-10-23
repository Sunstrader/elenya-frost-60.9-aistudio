# TESTS — V60.3.1

| Commande | Résultat réel | Où |
|---|---|---|
| `npm test` (lot rapide) | **45/45 OK** (44 + `correctifs-6031`), environ 87 s, après la dernière modification | `tests/t6031.log` |
| `npm run lint` / `npm run build` | aucune erreur / `index.html` synchronisé | — |
| `npm run test:e2e` (Chrome headless) | **8/8 OK** : e2e 216 s, saves 18 s, recit-57 90 s, fenetres-1 459 s, fenetres-2 192 s, visuel-60 42 s, visuel-601 54 s, visuel-602 424 s | `tests/e2e6031.log` |
| ZIP décompressé à neuf (`npm install` puis `npm test`) | voir `tests/fresh6031.log` dans le ZIP | ZIP |

Pendant la mise au point, le premier passage de `npm test` a donné 3 échecs : empreinte, `audits-59` (mot « Domination ») et `adn-603` (indice du trio). Les causes et les ajustements sont décrits dans RAPPORT.md, section « Tests modifiés ». L'empreinte a été enregistrée comme écart documenté. Aucun test n'a été désactivé.

## Nouveau test : `tests/correctifs-6031.cjs`
Une preuve par point (stèle, dettes, pain, Fen, reconversion, indices du trio, échos des fins, CHAOS et DOMINATION, autoSave). Détail dans RAPPORT.md.

## Mesures (hors `npm test`)
`node tests/_mesure-6031.cjs 400` : tableau avant/après dans RAPPORT.md.

## Non vérifié
- Rendu visuel de l'état « manquée » (✗) dans le panneau Statistiques : pas de capture dédiée.
- La nouvelle scène `STELE603_INDICE` utilise l'image du bivouac : pas de capture dédiée.
