# Examen des 83 échos rares sans route (60.2, tools/classer-echos-602.cjs)

Aucun parcours artificiel : la condition de chaque écho est lue et chaque drapeau exigé est cherché dans la source (hors QA). Rien n’a été corrigé automatiquement : une correction demande d’établir le comportement attendu.

Bilan : {"rare":83}

Jeu aléatoire (400 parties) : {"drapeau jamais posé en 400 parties":62,"drapeau et hôte jamais ensemble":6,"affiché (rare)":13,"conditions réunies mais texte absent":2}

| Écho (scène :: début) | Classe | Détail | En jeu (parties drapeau / hôte / ensemble / affiché) | Constat |
|---|---|---|---|---|
| LIEN_MARCHE_1 :: Ton ton coupant de tout à l’heure flotte encore. Fen marche  | rare | exige ton_sarcasme | 0 / 370 / 0 / 0 | drapeau jamais posé en 400 parties |
| ACTE2_10_RAVIN :: Depuis la joute du bivouac, chaque pas sur la glace ressembl | rare | exige bivouac_glace_joute | 0 / 400 / 0 / 0 | drapeau jamais posé en 400 parties |
| ACTE2_10_RAVIN :: Alistair marche à ta droite. Tu lui as dit que sa foi était  | rare | exige joute_intime_E | 0 / 400 / 0 / 0 | drapeau jamais posé en 400 parties |
| ACTE2_10_RAVIN :: « Mon seul regret est de ne pas me souvenir de toi. » Kaelen | rare | exige joute_intime_O | 0 / 400 / 0 / 0 | drapeau jamais posé en 400 parties |
| ACTE3_01_FRONTIERE_1 :: Tu l’avais laissé décider, la dernière fois. Kaelen n’a pas  | rare | exige joute_silence_O | 0 / 397 / 0 / 0 | drapeau jamais posé en 400 parties |
| ACTE3_01_FRONTIERE_1 :: « La porte est encore là. » Kaelen ne l’a pas prise. Il le r | rare | exige kaelen_libre_choisir | 12 / 397 / 0 / 0 | drapeau et hôte jamais ensemble |
| ACTE3_08_MISE_AU_POINT :: Kaelen a compris que tu n’avais pas oublié. Il ne demande pl | rare | exige romance_deferred_O_closed | 2 / 342 / 0 / 0 | drapeau et hôte jamais ensemble |
| ACTE3_08_MISE_AU_POINT :: L’attente n’a pas ressemblé à un rejet. Alistair te le prouv | rare | exige romance_deferred_E_closed | 0 / 342 / 0 / 0 | drapeau jamais posé en 400 parties |
| ACTE3_10_ACCUEIL_CULTE_1 :: Oraya porte la plaque sur sa poitrine. Elle ne te remercie p | rare | exige solo_oraya_dette_rendue | 0 / 314 / 0 / 0 | drapeau jamais posé en 400 parties |
| ACTE4_09_ISSUES_SECONDAIRES :: Tu as demandé son pouvoir à Veyra, rien d’autre. Le Trône t’ | rare | exige veyra_fin_pouvoir | 0 / 50 / 0 / 0 | drapeau jamais posé en 400 parties |
| NG_FIN_AMOUR :: Tu as tendu la main sans retenir personne. Ceux qui sont res | rare | exige ngplus_final_amour | 0 / 0 / 0 / 0 | drapeau jamais posé en 400 parties |
| NG_FIN_AMOUR :: Tu as refusé de laisser Kalthar partir. Le cycle reprend, et | rare | exige ngplus_final_cycle | 0 / 0 / 0 / 0 | drapeau jamais posé en 400 parties |
| NG_FIN_AMOUR :: Tu es devenue la frontière. Le Brasier te touche sans franch | rare | exige ngplus_final_frontiere | 0 / 0 / 0 / 0 | drapeau jamais posé en 400 parties |
| NG_FIN_AMOUR :: Tu avances sans couronne. Ta tête est plus légère que tu ne  | rare | exige ngplus_final_libre | 0 / 0 / 0 / 0 | drapeau jamais posé en 400 parties |
| NG_FIN_AMOUR :: Tu es retournée une dernière fois vers le Trône. Il s’en sou | rare | exige ngplus_final_trone | 0 / 0 / 0 / 0 | drapeau jamais posé en 400 parties |
| NG_FIN_AMOUR :: Tu as laissé le silence décider. Il a décidé doucement. | rare | exige ngplus_final_void | 0 / 0 / 0 / 0 | drapeau jamais posé en 400 parties |
| NG_FIN_AMOUR :: Tu as nommé l’architecte : toi, la première. Le cycle ne se  | rare | exige ngplus_architecte_nomme_57 | 0 / 0 / 0 / 0 | drapeau jamais posé en 400 parties |
| NG_FIN_CYCLE :: Tu as tendu la main sans retenir personne. Ceux qui sont res | rare | exige ngplus_final_amour | 0 / 0 / 0 / 0 | drapeau jamais posé en 400 parties |
| NG_FIN_CYCLE :: Tu es devenue la frontière. Le Brasier te touche sans franch | rare | exige ngplus_final_frontiere | 0 / 0 / 0 / 0 | drapeau jamais posé en 400 parties |
| NG_FIN_CYCLE :: Tu avances sans couronne. Ta tête est plus légère que tu ne  | rare | exige ngplus_final_libre | 0 / 0 / 0 / 0 | drapeau jamais posé en 400 parties |
| NG_FIN_CYCLE :: Tu es retournée une dernière fois vers le Trône. Il s’en sou | rare | exige ngplus_final_trone | 0 / 0 / 0 / 0 | drapeau jamais posé en 400 parties |
| NG_FIN_CYCLE :: Tu as laissé le silence décider. Il a décidé doucement. | rare | exige ngplus_final_void | 0 / 0 / 0 / 0 | drapeau jamais posé en 400 parties |
| NG_FIN_CYCLE :: Tu as nommé l’architecte : toi, la première. Le cycle ne se  | rare | exige ngplus_architecte_nomme_57 | 0 / 0 / 0 / 0 | drapeau jamais posé en 400 parties |
| NG_FIN_DEUX_MAINS :: Tu as tendu la main sans retenir personne. Ceux qui sont res | rare | exige ngplus_final_amour | 0 / 0 / 0 / 0 | drapeau jamais posé en 400 parties |
| NG_FIN_DEUX_MAINS :: Tu as refusé de laisser Kalthar partir. Le cycle reprend, et | rare | exige ngplus_final_cycle | 0 / 0 / 0 / 0 | drapeau jamais posé en 400 parties |
| NG_FIN_DEUX_MAINS :: Tu es devenue la frontière. Le Brasier te touche sans franch | rare | exige ngplus_final_frontiere | 0 / 0 / 0 / 0 | drapeau jamais posé en 400 parties |
| NG_FIN_DEUX_MAINS :: Tu avances sans couronne. Ta tête est plus légère que tu ne  | rare | exige ngplus_final_libre | 0 / 0 / 0 / 0 | drapeau jamais posé en 400 parties |
| NG_FIN_DEUX_MAINS :: Tu es retournée une dernière fois vers le Trône. Il s’en sou | rare | exige ngplus_final_trone | 0 / 0 / 0 / 0 | drapeau jamais posé en 400 parties |
| NG_FIN_DEUX_MAINS :: Tu as laissé le silence décider. Il a décidé doucement. | rare | exige ngplus_final_void | 0 / 0 / 0 / 0 | drapeau jamais posé en 400 parties |
| NG_FIN_DEUX_MAINS :: Tu as nommé l’architecte : toi, la première. Le cycle ne se  | rare | exige ngplus_architecte_nomme_57 | 0 / 0 / 0 / 0 | drapeau jamais posé en 400 parties |
| NG_FIN_FRONTIERE :: Tu as tendu la main sans retenir personne. Ceux qui sont res | rare | exige ngplus_final_amour | 0 / 0 / 0 / 0 | drapeau jamais posé en 400 parties |
| NG_FIN_FRONTIERE :: Tu as refusé de laisser Kalthar partir. Le cycle reprend, et | rare | exige ngplus_final_cycle | 0 / 0 / 0 / 0 | drapeau jamais posé en 400 parties |
| NG_FIN_FRONTIERE :: Tu es devenue la frontière. Le Brasier te touche sans franch | rare | exige ngplus_final_frontiere | 0 / 0 / 0 / 0 | drapeau jamais posé en 400 parties |
| NG_FIN_FRONTIERE :: Tu avances sans couronne. Ta tête est plus légère que tu ne  | rare | exige ngplus_final_libre | 0 / 0 / 0 / 0 | drapeau jamais posé en 400 parties |
| NG_FIN_FRONTIERE :: Tu es retournée une dernière fois vers le Trône. Il s’en sou | rare | exige ngplus_final_trone | 0 / 0 / 0 / 0 | drapeau jamais posé en 400 parties |
| NG_FIN_FRONTIERE :: Tu as laissé le silence décider. Il a décidé doucement. | rare | exige ngplus_final_void | 0 / 0 / 0 / 0 | drapeau jamais posé en 400 parties |
| NG_FIN_FRONTIERE :: Tu as nommé l’architecte : toi, la première. Le cycle ne se  | rare | exige ngplus_architecte_nomme_57 | 0 / 0 / 0 / 0 | drapeau jamais posé en 400 parties |
| NG_FIN_LIBERATION :: Tu as refusé de laisser Kalthar partir. Le cycle reprend, et | rare | exige ngplus_final_cycle | 0 / 0 / 0 / 0 | drapeau jamais posé en 400 parties |
| NG_FIN_VIDE :: Tu as tendu la main sans retenir personne. Ceux qui sont res | rare | exige ngplus_final_amour | 0 / 0 / 0 / 0 | drapeau jamais posé en 400 parties |
| NG_FIN_VIDE :: Tu as refusé de laisser Kalthar partir. Le cycle reprend, et | rare | exige ngplus_final_cycle | 0 / 0 / 0 / 0 | drapeau jamais posé en 400 parties |
| NG_FIN_VIDE :: Tu es devenue la frontière. Le Brasier te touche sans franch | rare | exige ngplus_final_frontiere | 0 / 0 / 0 / 0 | drapeau jamais posé en 400 parties |
| NG_FIN_VIDE :: Tu avances sans couronne. Ta tête est plus légère que tu ne  | rare | exige ngplus_final_libre | 0 / 0 / 0 / 0 | drapeau jamais posé en 400 parties |
| NG_FIN_VIDE :: Tu es retournée une dernière fois vers le Trône. Il s’en sou | rare | exige ngplus_final_trone | 0 / 0 / 0 / 0 | drapeau jamais posé en 400 parties |
| NG_FIN_VIDE :: Tu as laissé le silence décider. Il a décidé doucement. | rare | exige ngplus_final_void | 0 / 0 / 0 / 0 | drapeau jamais posé en 400 parties |
| NG_FIN_VIDE :: Tu as nommé l’architecte : toi, la première. Le cycle ne se  | rare | exige ngplus_architecte_nomme_57 | 0 / 0 / 0 / 0 | drapeau jamais posé en 400 parties |
| ACTE3_08_MISE_AU_POINT :: Tu remarques que tu comptes tes compagnons comme des pièces. | rare | condition sur jauges | 0 / 342 / 0 / 0 | drapeau jamais posé en 400 parties |
| ACTE3_08_MISE_AU_POINT :: Kaelen reconnaît l’emprise dans ta voix. Il a servi des maît | rare | condition sur jauges | 0 / 342 / 0 / 0 | drapeau jamais posé en 400 parties |
| ACTE4_09_ISSUES_SECONDAIRES :: Veyra se tient à l’écart, sans pacte. Elle t’a dit la vérité | rare | exige veyra_egale_57 | 0 / 50 / 0 / 0 | drapeau jamais posé en 400 parties |
| ACTE4_09_TRONE_EBENE :: Séraphine garde l’arrière. Vous ne marchez plus ensemble, ma | rare | exige seraphine_separee_59 | 0 / 245 / 0 / 0 | drapeau jamais posé en 400 parties |
| ACTE5_01_LENDEMAIN :: Les réfugiés du culte ont passé l’hiver. Les déserteurs, non | rare | exige grain_refugies_57 | 35 / 113 / 17 / 17 | affiché (rare) |
| ACTE5_01_LENDEMAIN :: Les déserteurs ont fondé une garde au village. Le culte ne t | rare | exige grain_deserteurs_57 | 32 / 113 / 20 / 19 | affiché (rare) |
| ACTE5_01_LENDEMAIN :: Tout le monde a eu faim, personne n’est mort. On raconte l’h | rare | exige grain_partage_57 | 34 / 113 / 10 / 9 | affiché (rare) |
| ACTE5_01_LENDEMAIN :: Le partage que tu as imposé a tenu. Mais personne ne vient p | rare | exige grain_ordonne_57 | 0 / 113 / 0 / 0 | drapeau jamais posé en 400 parties |
| ACTE5_01_LENDEMAIN :: Silas a ouvert une route de contrebande par la poterne. Elle | rare | exige portes_silas_57 | 12 / 113 / 7 / 6 | affiché (rare) |
| ACTE5_01_LENDEMAIN :: Le pardon n’a rien effacé. Oraya travaille aux cuisines, sou | rare | exige oraya_pardonnee | 13 / 113 / 5 / 4 | affiché (rare) |
| ACTE5_01_LENDEMAIN :: Mira a racheté un toit avec ce que tu lui as donné. Elle y l | rare | exige mira_payee | 2 / 113 / 1 / 1 | affiché (rare) |
| ACTE5_01_LENDEMAIN :: Mira a vendu à l’Ordre la carte de vos routes. Elle te l’écr | rare | exige mira_rejetee | 18 / 113 / 0 / 0 | drapeau et hôte jamais ensemble |
| ACTE5_01_LENDEMAIN :: Lyra chante au marché. Ce n’est plus une arme. Les gens s’ar | rare | exige lyra_a_parle | 209 / 113 / 70 / 33 | affiché (rare) |
| ACTE5_01_LENDEMAIN :: Ton givre déborde encore la nuit. On a construit les maisons | rare | condition sur jauges | 0 / 113 / 0 / 96 | drapeau jamais posé en 400 parties |
| ACTE5_01_LENDEMAIN :: Ceux qui t’entourent ne te contredisent plus. Tu as gagné le | rare | condition sur jauges | 0 / 113 / 0 / 1 | drapeau jamais posé en 400 parties |
| ACTE5_01_LENDEMAIN :: Ton pouvoir est calme et tu ne retiens personne. On te consu | rare | condition sur jauges | 0 / 113 / 0 / 2 | drapeau jamais posé en 400 parties |
| ACTE4_09_ISSUES_SECONDAIRES :: Veyra se tient près de la colonne, les bras croisés, témoin. | rare | exige veyra_temoin_58 | 0 / 50 / 0 / 0 | drapeau jamais posé en 400 parties |
| ACTE4_09_ISSUES_SECONDAIRES :: Veyra est partie. Elle racontera cette nuit à sa manière. Tu | rare | exige veyra_refus_58 | 0 / 50 / 0 / 0 | drapeau jamais posé en 400 parties |
| ACTE4_09_TRONE_EBENE :: Séraphine n’a plus de liste. Elle a brûlé son propre nom ave | rare | exige seraphine_nom_brule_58 | 1 / 245 / 1 / 0 | conditions réunies mais texte absent |
| ACTE5_01_LENDEMAIN :: Kaelen est parti deux jours vers le sud. Il est revenu sans  | rare | exige kaelen_mere_cherchee_58 | 10 / 113 / 8 / 8 | affiché (rare) |
| ACTE5_01_LENDEMAIN :: Alistair récite chaque matin la prière que tu as écrite pour | rare | exige alistair_priere_ecrite_58 | 9 / 113 / 5 / 5 | affiché (rare) |
| ACTE5_01_LENDEMAIN :: Tu gardes toujours le nom de Séraphine dans une boîte en fer | rare | exige seraphine_nom_garde_58 | 1 / 113 / 0 / 0 | drapeau et hôte jamais ensemble |
| ACTE5_01_LENDEMAIN :: Tu as une maison. La porte ferme de l’intérieur. Tu l’ouvres | rare | exige solo_voeu_maison_58 | 48 / 113 / 12 / 12 | affiché (rare) |
| ACTE5_01_LENDEMAIN :: Tu es repartie au troisième jour. Fen dort dans ta capuche.  | rare | exige solo_voeu_route_58 | 44 / 113 / 19 / 19 | affiché (rare) |
| ACTE5_01_LENDEMAIN :: Tu tiens un carnet de ce que tu découvres sur ton pouvoir. P | rare | exige solo_voeu_savoir_58 | 38 / 113 / 15 / 15 | affiché (rare) |
| ACTE5_01_LENDEMAIN :: Le chemin du village est marqué dans la neige par tes propre | rare | exige epilogue_village_58 | 15 / 113 / 15 / 15 | affiché (rare) |
| NG_FIN_AMOUR :: La première Elenya t’aimait trop pour te laisser finir. Tu a | rare | exige ngplus_premiere_comprise_58 | 0 / 0 / 0 / 0 | drapeau jamais posé en 400 parties |
| NG_FIN_AMOUR :: Tu as appelé sa peur par son nom. La glace a gardé l’écho de | rare | exige ngplus_premiere_accusee_58 | 0 / 0 / 0 / 0 | drapeau jamais posé en 400 parties |
| NG_FIN_DEUX_MAINS :: La première Elenya t’aimait trop pour te laisser finir. Tu a | rare | exige ngplus_premiere_comprise_58 | 0 / 0 / 0 / 0 | drapeau jamais posé en 400 parties |
| NG_FIN_DEUX_MAINS :: Tu as appelé sa peur par son nom. La glace a gardé l’écho de | rare | exige ngplus_premiere_accusee_58 | 0 / 0 / 0 / 0 | drapeau jamais posé en 400 parties |
| NG_FIN_FRONTIERE :: La première Elenya t’aimait trop pour te laisser finir. Tu a | rare | exige ngplus_premiere_comprise_58 | 0 / 0 / 0 / 0 | drapeau jamais posé en 400 parties |
| NG_FIN_FRONTIERE :: Tu as appelé sa peur par son nom. La glace a gardé l’écho de | rare | exige ngplus_premiere_accusee_58 | 0 / 0 / 0 / 0 | drapeau jamais posé en 400 parties |
| NG_FIN_VIDE :: La première Elenya t’aimait trop pour te laisser finir. Tu a | rare | exige ngplus_premiere_comprise_58 | 0 / 0 / 0 / 0 | drapeau jamais posé en 400 parties |
| NG_FIN_VIDE :: Tu as appelé sa peur par son nom. La glace a gardé l’écho de | rare | exige ngplus_premiere_accusee_58 | 0 / 0 / 0 / 0 | drapeau jamais posé en 400 parties |
| FIN_OMBRE :: Il y avait eu un accord à trois, dans le dôme. Il ne s’est p | rare | exige trio_accord | 6 / 8 / 0 / 0 | drapeau et hôte jamais ensemble |
| FIN_ECLAIREUR :: Il y avait eu un accord à trois, dans le dôme. Il ne s’est p | rare | exige trio_accord | 6 / 2 / 0 / 0 | drapeau et hôte jamais ensemble |
| ACTE1_07_RETROUVAILLES :: La trêve que tu as imposée tient encore. Kaelen et Alistair  | rare | exige truce_initiale | 0 / 232 / 0 / 0 | drapeau jamais posé en 400 parties |
| ACTE4_09_TRONE_EBENE :: La fêlure avec Alistair n’est pas refermée. Il ne prie pas p | rare | exige felure_E_suspendue | 7 / 245 / 8 / 0 | conditions réunies mais texte absent |
