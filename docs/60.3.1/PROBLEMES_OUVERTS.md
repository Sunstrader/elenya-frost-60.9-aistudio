# PROBLÈMES OUVERTS — après 60.3.1

## Non traités (hors périmètre « faible risque »)
1. **Écrans à choix unique : 44,4 %** (playtest n°4, objectif < 30 %). Il faut fusionner des scènes de transition, ce qui touche le graphe et les sauvegardes arrêtées sur ces scènes.
2. **Haltes rares** (playtest n°5) : seules les étiquettes « Explorer : » ont été ajoutées. Fréquences au hasard sur 400 parties : salle commune 59, abri 25, stèle 52, Oraya 2 (exige d'arriver seule au village). Pas de nouvelle halte par acte.
3. **Oraya à plusieurs** (qa n°11) : la halte du puits reste réservée à Elenya seule.
4. **Concentration des fins** pour le joueur prudent (BRISEE + SACRIFICE, playtest n°6), **agonies fréquentes** (playtest n°8), **hubs à 9 choix** (n°10), **artefact à issue forcée** (n°12) : non traités.
5. **Image de la salle commune** (playtest n°9) : c'est toujours celle de la chambre.
6. **Journal et Sac enfouis dans les Statistiques**, sans toast d'obtention (playtest n°7).
7. **FIN_POLY rare** (1/1 500 au hasard, qa n°4) et ordre des branches de FIN_POLY avec une pause (romance P4) : non traités. Oui d'Alistair implicite (P5), journal « récompense » (P6), réparation rapide (P7), départ du troisième (P8) : non traités.
8. **Bible** : lignée « Le Trône de Vérité » sur des fins sans vérité (N6), code mort `oraya_punie` (N7), indice Fen trop appuyé dans URGENCE_NARRATIVE (N9), bleu hors Kalthar (N11), affichage du Codex PRYMAËLIS (V58-12) : non traités.
9. **Faction `ombre` morte**, **30 drapeaux jamais relus** (dont `survie_portee_603`), scènes orphelines redirigées : inchangés.
10. **Continuité** R1 (`poly_eligible` dans `legacyReadOnly`), R2 (alias `amis_*`) : inchangés.

## Limites des correctifs
- **Anciennes sauvegardes 60.3** qui ont déjà ouvert la stèle à l'acte 3 : elles gardent `_frag4_enrichi_vu` et `frag4_nom_prononce`. Au seuil du Trône, `FRAGMENT_4_STELE` rejoue la révélation (bible N2) sans variante « tu le savais déjà ».
- **Quête des dettes** : elle est maintenant visible (123/400), mais rarement accomplie au hasard (3/400). La fin passe par `DETTE_CHOIX` au Trône, qui exige les deux confrontations, puis l'artefact.
- **Quête de Fen** : la piste est marquée « manquée » ; elle n'est pas proposée à nouveau ailleurs.
- `FRAGMENT_4_ENRICHI` reste atteignable par le déclencheur historique `memoire_seuil_12` à `ACTE4_07` (après `FRAGMENT_4_STELE`) : 2 parties sur 400, toujours après `_fragment_4_vu`.
