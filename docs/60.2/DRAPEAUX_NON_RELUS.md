# Drapeaux posés jamais relus (60.2, tools/classer-drapeaux-602.cjs)

Classement individuel ; aucune suppression en bloc, aucun raccord automatique. Limite : jugement fondé sur le lieu de pose, le texte du choix et le nom du drapeau, sans relecture complète de chaque scène ; les « conséquences abandonnées » et « dépendances manquantes » sont des candidats à un écho, pas des bugs prouvés.

Bilan : {"trace technique":16,"conséquence abandonnée":10,"dépendance manquante":2,"garde-fou":3}

| Drapeau | Classe | Raison | Posé par |
|---|---|---|---|
| _frag_larme_vu | trace technique | marque d’affichage du fragment de la Larme ; le préfixe _ indique un usage interne | FRAGMENT_KALTHAR_LARME/A, FRAGMENT_KALTHAR_LARME/B |
| _intimite_E_recente | trace technique | fenêtre d’intimité récente ; jamais testée depuis 57, la temporisation passe par les jauges | ACTE2_06_NUIT_AUBERGE/E, ACTE2_06_NUIT_AUBERGE/E_TRI, ACTE2_07_INTIMITE_E/B |
| _intimite_O_recente | trace technique | idem côté Kaelen | ACTE2_06_NUIT_AUBERGE/O, ACTE2_06_NUIT_AUBERGE/O_TRI, ACTE2_07_INTIMITE_O/B |
| _lien_O_1_vu | trace technique | marque de scène de lien vue | ACTE1_05_BIVOUAC/O1, ACTE1_05_BIVOUAC/O2, ACTE1_05_BIVOUAC/O3 |
| _lien_O_2_doux | conséquence abandonnée | ton « doux » du lien 2 de Kaelen : aucun écho ne le relit (à relire si on veut récompenser ce ton) | ROMANCE_DEFERRED_KAELEN/CONF_TRUST |
| approche_volieres_vue | trace technique | marque de passage | ACTE2_01C_CHEMIN_VOLIERES/NEXT |
| artefact_citadelle | dépendance manquante | objet ramassé à l’acte 3 sans usage ultérieur ; aucune scène ne le demande | ACTE3_13_ARTEFACT/A |
| bivouac_lisiere_fini | trace technique | fin de séquence de bivouac | ACTE1_08B_BIVOUAC_LISIERE/REPARTIR |
| chute_solo_givre | conséquence abandonnée | chute de la voie solo à l’acte 1, jamais rappelée | ACTE1_03_FAMILIER_2/S |
| convergence_acknowledged | trace technique | accusé de lecture de la convergence (acte 1) | ACTE1_06C_CONVERGENCE/V28_O, ACTE1_06C_CONVERGENCE/V28_E, ACTE1_06C_CONVERGENCE/V28_S |
| crevasse_finie | trace technique | fin de séquence de crevasse ; les conséquences passent par crevasse_* relus | ACTE3_09B_BIVOUAC_TEMPETE/POLY_REPARER, ACTE3_09B_BIVOUAC_TEMPETE/AVANCER, ACTE3_09B_ROMANCE_URGENCE/A |
| felure_E_vue | garde-fou | pose à l’affichage de la fêlure ; la répétition est déjà empêchée par l’historique des scènes | ROMANCE_FELURE_E/REPARER, ROMANCE_FELURE_E/SUSPENDRE, ROMANCE_FELURE_E/FINIR |
| felure_O_vue | garde-fou | idem côté Kaelen | ROMANCE_FELURE_O/REPARER, ROMANCE_FELURE_O/SUSPENDRE, ROMANCE_FELURE_O/FINIR |
| lien_marche_blanche_vu | trace technique | marque de scène vue | LIEN_MARCHE_BLANCHE_B/NEXT |
| limite_auberge_vue | trace technique | marque de scène vue | ACTE2_07B_REACTION_E/NEXT_REFUS, ACTE2_07B_REACTION_O/NEXT_REFUS |
| lisiere_exploration_active | garde-fou | posé puis retiré (REMOVE_FLAG) pendant l’exploration : état transitoire | ACTE1_08B_BIVOUAC_LISIERE/SUIVRE_CHANT, ACTE1_08B_BIVOUAC_LISIERE/REPARTIR, ACTE1_08B_LYRA_ECHO/A |
| marche1_solo | trace technique | trace du choix solo à la marche 1 ; la voie solo est relue via voie_solo | LIEN_MARCHE_1/S_FROID |
| marche2_solo | trace technique | idem marche 2 | LIEN_MARCHE_2/S_FROID |
| marche_blanche_solo | trace technique | idem marche blanche | LIEN_MARCHE_BLANCHE/S_FROID |
| prymaelis_encountered | trace technique | rencontre de Primaëlys notée ; aucune branche ne dépend de la rencontre | ACTE2_14_MINE_PRYMAËLIS/O, ACTE2_14_MINE_PRYMAËLIS/E_REDEMPTION, ACTE2_14_MINE_PRYMAËLIS/E_CRAVACHE |
| river_reunion_complete | trace technique | fin de séquence de la rivière | ACTE2_17_RETROUVAILLES_SORTIE/A, ACTE2_17_RETROUVAILLES_SORTIE/B, ACTE2_17_RETROUVAILLES_SORTIE/C |
| solo_convergence_choisie | conséquence abandonnée | choix solo explicite à la convergence, non rappelé ensuite | ACTE1_06C_CONVERGENCE/V28_S |
| solo_froid_surface | conséquence abandonnée | froid de surface en solo, jamais rappelé | ACTE1_07_RETROUVAILLES/S |
| sommeil_lourd | dépendance manquante | sommeil lourd à l’acte 3 : aucune scène suivante ne le teste | ACTE3_05_FIEVRE/A |
| triangulation_payoff_vu | trace technique | marque d’affichage du payoff | ACTE1_07B_REACTION_TRIANGULATION/CONTINUE |
| v28_bascule_auberge_E | conséquence abandonnée | reliquat V28 (bascule de romance à l’auberge) ; remplacé par les drapeaux romance_* relus | ACTE2_06_NUIT_AUBERGE/V28_E_SOLO |
| v28_bascule_auberge_O | conséquence abandonnée | idem Kaelen | ACTE2_06_NUIT_AUBERGE/V28_O_SOLO |
| v28_conversion_finale_E | conséquence abandonnée | reliquat V28 ; la reconversion finale est relue via V28_FIN_RECONVERSION_E (condition sur voie_solo) | ACTE4_09_TRONE_EBENE/V28_FIN_RECONVERSION_E |
| v28_conversion_finale_O | conséquence abandonnée | idem Kaelen | ACTE4_09_TRONE_EBENE/V28_FIN_RECONVERSION_O |
| v28_reconquete_crevasse_E | conséquence abandonnée | reliquat V28 (reconquête à la crevasse) | ACTE3_09B_BIVOUAC_TEMPETE/V28_RECONQUERIR_E |
| v28_reconquete_crevasse_O | conséquence abandonnée | idem Kaelen | ACTE3_09B_BIVOUAC_TEMPETE/V28_RECONQUERIR_O |
