# PROBLÈMES OUVERTS — après 60.3.2

1. **FIN_POLY au hasard : 0 sur 1 500.** Elle est atteignable par des choix volontaires (13 parties sur 600 chez un joueur qui favorise le trio), mais rare : trois choix rares s'enchaînent. Le Trône à 9 choix y contribue.
2. **Écrans à choix unique : 44,6 %.** Haltes rares, hubs à 9 choix : non traités.
3. **Séraphine (romance F6)** : BAISER et AIMER ne sont pas fermés par l'emprise. Non traité, hors des priorités de cette version.
4. **Le scène `DETTE_REVELATION`** cite Oraya. Au seuil du Trône, c'est cohérent dans la plupart des parties, mais Oraya n'est pas testée comme présente.
5. **Romance N8** (même phrase pour le départ du troisième), **bible N7** (code mort `oraya_punie`), **N9** (« De la reconnaissance »), **N11** (bleu hors de Kalthar), **sauvegardes 60.3 déjà spoilées** (pas de variante « tu le savais déjà ») : non traités.
6. **Playtest :**
   - fins du joueur prudent concentrées sur BRISEE et SACRIFICE ;
   - agonies fréquentes ;
   - Journal et Sac enfouis dans les Statistiques ;
   - image de la salle commune ;
   - quête de la stèle validée sans action ;
   - pain peu utilisé.

   Aucun de ces points n'est traité.
7. **QA :**
   - faction `ombre` jamais utilisée ;
   - 30 drapeaux jamais relus ;
   - scènes orphelines encore redirigées ;
   - `dominationActive59_` reste étroit : il est conservé pour la compatibilité, et le nouveau helper le complète.
8. **Lockfile** réaligné par `npm install` (plages d'origine remplacées par les versions exactes de `package.json`).
