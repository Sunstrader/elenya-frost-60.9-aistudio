# CHANGELOG — 60.3.1

- Stèle sous la tempête (acte 3) : la halte `STELE603` mène à `STELE603_INDICE` (indice sans nom ni Trône) au lieu de `FRAGMENT_4_ENRICHI`. Oraya n'est plus révélée avant `FRAGMENT_4_STELE`.
- Journal : la quête des dettes lit les vrais drapeaux (`dette_O/E_confrontee`, `dette_systeme_compris`, `dette_position_finale`, `dette_rendue_aux_deux`, `dette_abolie_structurellement`), avec un indice par étape.
- Journal : la quête de Fen devient « manquée » si l'on remonte sans lui parler. Nouvel état « manquée » (✗) dans le panneau.
- Salle commune : « Aider l'aubergiste » est ouvert dès une réputation de 0 (fermé si hostile), avec une réplique qui ne parle plus du grain.
- `V28_FIN_RECONVERSION_O/E` : bloquées après une domination (crevasse, acte 3), un refus ou une amitié.
- Indices du trio (salle commune, bivouac) : soumis à `indiceTrio6031_` (consentement, romances ouvertes, aucune domination ni aucun refus, nuit réparée). Textes réécrits d'après l'audit romance.
- Dôme : `trio_nuit_dome` exige `lisiere_trio_ouvert` (la réparation seule ne suffit plus).
- Fins : plus de paragraphe de réputation en double (TEMOIN, EQUILIBRE, RECONCILIATION, REDEMPTION) ; aucun écho sur FIN_CHAOS ni FIN_DOMINATION ; cadres propres à ces deux variantes ; titre interne « **Domination** » retiré ; FIN_CHAOS ne nomme que les compagnons présents.
- Client : `autoSave()` protégé contre l'absence de `qaModeEnabled` (erreur au retour arrière).
- Haltes signalées par « Explorer : ».
- Tests : nouveau `tests/correctifs-6031.cjs` dans `npm test` ; outil de mesure `tests/_mesure-6031.cjs` ; empreinte 60.3.1 ; `audits-59` et `adn-603` ajustés (voir RAPPORT).
- Version 60.3.1.
