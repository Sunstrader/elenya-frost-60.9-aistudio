# Rapport de tests — 55.0.0 (résultats réels, 14/10/2026)
Rien n’est déclaré validé sur le lint ou le build seuls. Aucun test n’a été modifié pour passer au vert.
Le seul test changé est `run-all.cjs` : il enregistre deux nouveaux tests et accepte une nouvelle empreinte 55, qui est documentée.

## Commandes et résultats
| Commande | Résultat |
|---|---|
| `npm run lint` | 56 fichiers, 0 erreur, 0 avertissement (exit 0) |
| `npm test` (`tests/run-all.cjs`) | **18/18 OK**, exit 0 (log : `tests/npm-test.log`) |
| `npm run build` | index.html synchronisé (400 186 octets) |
| `node qa-tools/e2e.cjs` (10 tailles, de 360×640 à 3840×2160) | 10/10 : 0 erreur console, choix présents, menu présent, pas de barre du bas, **aucun débordement horizontal** |
| `node qa-tools/e2e-fenetres.cjs` (10 tailles) | 10/10 : 0 erreur, 0 fenêtre en défaut |
| `node qa-tools/e2e-saves.cjs` | stockage plein : 0 erreur ; sauvegarde corrompue : reprise visible, 0 erreur |

Détail de `npm test` :
- Suites historiques (6) : OK.
- Empreinte : 320 scènes.
- Base de données : 240 scènes classiques et 80 NG+, aucune impasse.
- 115 sauvegardes 52.5.4 rechargées : OK.
- Sauvegarde corrompue : OK.
- Test du singe (300 parties classiques + 100 NG+) : 14 fins distinctes, sans erreur.
- Toutes les fins : 20 distinctes, 18/18 classiques, 19 parcours rejoués.
- Récit 55 : Fêlure OK, 7 échos vérifiés, Lame à Nu OK. Sur 400 parties réelles : Fêlure 16 fois, Lame à Nu 54 fois.
- Interface 55 : aucune trace de voix dans 41 fichiers ; réglages musique et effets présents ; migration des anciens réglages ; plein écran proposé au lancement et à la reprise ; bandeau auto-masqué.
- Assets : 441 URLs (vérifiées hors ligne seulement).
- Page assemblée : OK.
- Préchargement : OK.
- Typographie : OK.

## Échecs rencontrés pendant le travail (et corrigés)
1. `npm test` en échec (17/18) et lint en échec : `Suite historique : check`, avec une « SyntaxError: Unexpected token '}' » dans Scripts_Refonte.html. En retirant `stopVoice();`, il était resté `RF.}` et `RF.if(`. Corrigé, puis 18/18.
2. Une capture à 1280×720 montrait un bouton de choix blanc sur argent clair, illisible. Corrigé (fond sombre givré), puis recapturé.
3. `debordementX` était vrai de 1024 à 3840 px (déjà le cas en 54, d’après `ecrans.log` de la 54). Corrigé, puis 10/10 à faux.

## Captures
Les captures sont dans `livraison/captures-55.0.0/` (hors ZIP) : écran titre, fenêtre de lancement, récit et menu, sur 10 tailles.

## Scores (auto-évaluation honnête, sur 10)
| Critère | 54 | 55 |
|---|---|---|
| Cohérence du récit | 7 | 7,5 |
| Romances (agentivité, conséquences) | 6,5 | 7,5 |
| Consentement | 7 | 8,5 |
| Conséquences des choix | 5 | 6 |
| Interface / lisibilité | 7 | 7,5 |
| Technique / dette | 6,5 | 7,5 |
| Tests | 8 | 8,5 |

Limite : ces notes ne reposent sur aucun test avec de vrais joueurs.

## 55.0.1
- `npm run lint` : 0 erreur.
- `npm test` : **19/19 OK**. Nouveau test « Sirène » : 384 nœuds, identiques à la 54.0.0.
- `npm run build` : OK.
- Les tests navigateur (e2e) n’ont pas été relancés : seul un mot du texte serveur a changé, et l’interface n’a pas bougé.
