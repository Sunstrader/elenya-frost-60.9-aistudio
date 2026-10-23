# Problèmes ouverts — 60.1.0

1. **Cache jsDelivr (résolu au dernier passage, à surveiller)** : le 15/10 après-midi, les 66 URL répondent (0 échec). Plus tôt : `autel-reveil.webp` et `chambre-automate.webp` répondent 404 sur `cdn.jsdelivr.net/...@main` alors que GitHub (raw) les sert en 200. Cache périmé du CDN : il faut une purge par le propriétaire (les URL ne sont pas modifiées, règle jsDelivr). Mesure : `ONLINE=1 node tests/urls-affichees-601.cjs`.
2. **83 échos rares sans route** sur 155 : aucune graine trouvée dans le budget ; résultat négatif conservé dans `tests/fixtures/echos-rares-60.1.0.json`.
3. **FIN_POLY rare au hasard** : `trio_accord` dans 6 parties aléatoires sur 1500. La fin est atteignable par route fixe ; c’est voulu (consentement explicite des deux), mais elle reste peu visible.
4. **Game over 34,9 %** des parties aléatoires (524/1500), contre 39,5 % en 60.0. Joueur aléatoire, donc pessimiste ; à mesurer en vrai test joueur. GAME_OVER_POSSESSION est désormais précédé d’une agonie.
5. **Choix uniques** : 35,8 % des scènes (statique), 44,7 % des affichages en jeu. Écart expliqué, non réduit.
6. **Apps Script** : les fonctions de diagnostic restent appelables par `google.script.run` (seul le miroir Node les ferme).
7. **31 drapeaux de catégorie C** (posés, jamais lus) restent listés par l’inventaire des drapeaux.
8. **Codex** : il dépend des scènes vues dans ce navigateur (`ef_visited`) ou importées avec une sauvegarde exportée ; une sauvegarde serveur seule ne le remplit pas.
9. **Fins variantes** : certaines fins (ex. FIN_DOMINATION) sont des variantes affichées sur une autre scène de fin ; la route est jugée par le drapeau `variante_*`.
