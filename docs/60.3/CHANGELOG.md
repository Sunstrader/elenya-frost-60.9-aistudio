# CHANGELOG — Elenya V60.3.0 (mission ADN, phase 2)

Base : `v60.2.0`. Branche et tag : `v60.3.0`. Aucune scène, aucun identifiant de fin ni aucun drapeau existant supprimé.

## 1. Fins historiques : chacune retrouve son écran
- `23_Refonte.js` (`_fins54Apply_`, interrupteur `FINS603_DISTINCTES`) : les 16 anciennes « variantes » de la 54 (Chaos, Témoin, Réconciliation, Rédemption, Équilibre, Dette soldée, Veyra, Domination, Séraphine, Lame de Séraphine, Mira, Mortelle, et les 4 fins NG+ Amour, Deux mains, Frontière, Vide) ne sont plus redirigées vers la fin principale. Le choix mène de nouveau à la scène historique, avec son titre, son succès et son image.
- Chaque fin garde sa **lignée** (`family`), affichée en sous-titre : « *La Tempête Sans Nom* — de la lignée « Hiver Inachevé » ». Les variantes utiles restent : la narration est lue dans la fin principale au moment du rendu, donc tous les échos ajoutés à la famille (55 à 60.2) s'affichent aussi sur la fin distincte.
- Compatibilité : une sauvegarde arrêtée sur une fin principale avec un drapeau `variante_*` s'affiche comme avant. Le drapeau `variante_*` est toujours posé.
- Écran : 36 fins sans alias (contre 20 écrans + 16 alias en 60.2).
- `Scripts_Game.html` (`ux513EndingProgress`) : le compteur « / 35 » excluait mal deux succès sans scène (`ach_fin_secrete`, `ach_fin_ng_trone_deux_places`). Ils ne comptent plus, le total devient celui des fins atteignables.

## 2. Systèmes qui agissent vraiment
- **Réputation** (jusque-là écrite 13 fois, jamais lue) : lue dans la salle commune de l'auberge (accueil, Ordre, culte), à l'accueil du culte (`ACTE3_10_ACCUEIL_CULTE_1`) et dans 9 fins (village, Ordre, culte). Elle ouvre aussi un choix réservé, « aider l'aubergiste », quand la réputation du village est d'au moins 1.
- **Inventaire** : deux objets nouveaux (`carte_marche_blanche`, `pain_village_603`) ont un usage. La carte ouvre l'abri de la Marche Blanche ; le pain change la fin solitaire. Au Trône, l'éclat de Veyra et la plume de Mira sont rappelés. Le panneau Statistiques affiche le **Sac**.
- **Volonté** : les survies partagées des agonies (`MAIN_TENDUE` pour la sirène, `TENUE` pour le Sceau) coûtent maintenant 2 de volonté et posent `survie_portee_603`. Correction de R10.
- **Quêtes** : `quetes603_()` construit un **journal de route** à partir de drapeaux réels (6 pistes : Fen, l'abri, Oraya, la stèle, la dette de Kaelen, le pacte de Veyra). Le serveur l'envoie à chaque scène (`quetes603`, `objets603`) et le panneau Statistiques l'affiche avec un indice pour chaque piste en cours. Le format de sauvegarde ne change pas : le journal est recalculé, pas stocké.

## 3. Haltes d'exploration
- **La salle commune** (`HALTE603_AUBERGE`, nouvelle scène, acte 2), avant la nuit de l'auberge. On y trouve les rumeurs et la carte, l'aide au village, la joute de Kaelen (`JOUTE_O_1`) et celle d'Alistair (`JOUTE_E_1`), toutes deux sans entrée jusqu'ici, ainsi qu'un moment avec Fen devant l'âtre. Chaque option ne se prend qu'une fois.
- **L'abri de la Marche Blanche** : `ACTE2_09B_BIVOUAC_GLACE`, `ACTE2_09B_JOUTE_PSY` et `FRAGMENT_KALTHAR_LARME` n'avaient aucune entrée. On y accède maintenant depuis `LIEN_MARCHE_BLANCHE_B`, avec la carte ou une volonté d'au moins 6.
- **Le puits du village caché** : Oraya propose de guider Elenya quand celle-ci arrive seule (`V28_ORAYA_PROPOSE_GUIDE`, puis `ACTE3_SOLO_ORAYA`).
- **La stèle sous la tempête** : `FRAGMENT_4_ENRICHI` (sans entrée jusqu'ici) est atteint depuis le bivouac de la crevasse, puis on revient au bivouac.
- `ACTE2_07_TRANSE_FEN` reste retirée. Le moteur la redirige depuis 52.5.4, et on respecte ce choix de création.

## 5. Trio
- `poly_eligible`, posé mais jamais lu, sert maintenant d'indice dans deux scènes : la salle commune et le bivouac de la crevasse. Kaelen et Alistair se relaient sans se le dire. Aucune option ne pose `trio_accord` : le consentement passe toujours et seulement par `TRIO_NUIT_DOME`.

## Version
- 60.3.0 dans `package.json`, `22_State.js`, `90_QA.js`, `Scripts_Game.html` et `index.html` (régénéré par `npm run build`).
