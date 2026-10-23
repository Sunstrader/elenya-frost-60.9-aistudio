const TRIGGERS = [
  {
    // 60 (qa V59 #5) : ABANDON garde sa destination (structure de la sirène protégée par sirene-twist.cjs),
    // mais la première fois, un dernier souffle laisse lutter ou céder.
    id: "sirene_dernier_souffle",
    check: (s) => s.currentSceneId === 'GAME_OVER_SIRENE' && s.flags.includes('sirene_abandon_60') && !s.flags.includes('sirene_dernier_souffle_60'),
    priority: 200,
    interceptToScene: 'SIRENE_DERNIER_SOUFFLE'
  },
  // ===== CRISES & GAME OVER (priorité maximale) =====
  // V52.0.3 : ancien trigger `crise_blessure` retiré.
  // Aucun timer `blessure` n'est produit par la V52 et la scène 800 est réservée
  // au passage du village où Alistair fait passer Elenya pour sa prisonnière.
{
  id: "timer_venin_check",
  check: (s) => s.timers && 
                typeof s.timers.venin === 'number' && 
                s.timers.venin === 0 &&          // exactement 0
                s.flags.includes('urgence_declenchee') &&  // seulement si l’urgence a été lancée
                s.currentSceneId !== 'GAME_OVER_VENIN' &&
                s.currentSceneId !== 'AGONIE_VENIN' &&  // 60 : l’agonie laisse un vrai choix (geler ou céder)
                !/^(FRAGMENT_|ACTE3_0[3-7])/.test(String(s.currentSceneId)) &&
                !String(s.currentSceneId).startsWith('FIN_') &&
                !String(s.currentSceneId).startsWith('GAME_OVER_'),
  priority: 98,
  interceptToScene: 'AGONIE_VENIN'
},
  {
    // 55.0 : une romance engagée mais abîmée se fissure la veille de la Citadelle.
    id: "felure_kaelen",
    check: (s) => s.currentSceneId === 'ACTE4_02_CHOIX_CHAMBRE' && romanceFelurePossible55_(s, 'O'),
    priority: 95,
    interceptToScene: 'ROMANCE_FELURE_O'
  },
  {
    id: "felure_alistair",
    check: (s) => s.currentSceneId === 'ACTE4_02_CHOIX_CHAMBRE' && romanceFelurePossible55_(s, 'E'),
    priority: 94,
    interceptToScene: 'ROMANCE_FELURE_E'
  },
  {
    // 54.0.0 : dernier sursis lisible avant la mort par le venin (une seule fois).
    id: "venin_dernier_sursis",
    check: (s) => s.timers && s.timers.venin === 1
      && s.flags.includes('urgence_declenchee')
      && !s.flags.includes('venin_alerte_vue')
      && !/^ACTE3_0[3-7]/.test(String(s.currentSceneId))
      && s.currentSceneId !== 'VENIN_DERNIER_SURSIS'
      && !String(s.currentSceneId).startsWith('FIN_')
      && !String(s.currentSceneId).startsWith('GAME_OVER_'),
    priority: 96,
    interceptToScene: 'VENIN_DERNIER_SURSIS'
  },
  {
    id: "timer_colere_ordre",
    check: (s) => s.timers && s.timers.colere_ordre !== undefined
      && s.timers.colere_ordre === 0
      && !s.flags.includes('seraphine_arrivee_vue')
      && !String(s.currentSceneId).startsWith('FIN_')
      && !String(s.currentSceneId).startsWith('GAME_OVER_'),
    priority: 97,
    interceptToScene: 'SERAPHINE_ARRIVEE'
  },
  {
    id: "surcharge_magique",
    check: (s) => {
      const inst = (s.gauges.instabilite || 0);
      const absorptions = [
        'filon_absorbe','energie_famillier_absorbee','panthere_absorbee'
      ].filter(f => s.flags.includes(f)).length;
      // 59 : la mort n’arrive qu’après les deux avertissements, et jamais sur une scène à choix unique.
      return ((inst >= 52 && absorptions >= 2) || inst >= 58)
      && s.flags.includes('_surcharge_sursis2_vu')
      && s.currentSceneId !== 'AGONIE_SURCHARGE'
      && !/^ACTE3_0[3-7]/.test(String(s.currentSceneId))
      && !String(s.currentSceneId).startsWith('FIN_')
      && !String(s.currentSceneId).startsWith('GAME_OVER_')
      && !String(s.currentSceneId).startsWith('FRAGMENT_')
      && !String(s.currentSceneId).startsWith('R_')
      && !String(s.currentSceneId).startsWith('JOUTE_')
      && !String(s.currentSceneId).startsWith('LIEN_');
    },
    priority: 150,
    interceptToScene: 'AGONIE_SURCHARGE'  // 60 : la mort ne vient que du choix CEDER
  },
  {
    id: "possession_avertissement",
    check: (s) => (s.gauges.possession || 0) >= 20
      && !s.flags.includes('_possession_warning_vu')
      && !String(s.currentSceneId).startsWith('FIN_')
      && !String(s.currentSceneId).startsWith('GAME_OVER_')
      && s.currentSceneId !== 'AVERTISSEMENT_POSSESSION',
    priority: 91,
    interceptToScene: 'AVERTISSEMENT_POSSESSION'
  },
  {
    id: "possession_critique",
    check: (s) => (s.gauges.possession || 0) >= 25
      && !String(s.currentSceneId).startsWith('FIN_')
      && !String(s.currentSceneId).startsWith('GAME_OVER_')
      && s.currentSceneId !== 'AGONIE_POSSESSION',
    priority: 90,
    interceptToScene: 'AGONIE_POSSESSION'  // 60.1 : la mort ne vient que du choix CEDER
  },

  // ===== FLASHBACKS =====
  {
    id: "fragment_acte1",
    check: (s) => s.currentSceneId === 'ACTE1_04_AUTOMATE' 
      && s.flags.includes('fresque_touched')
      && (s.gauges.instabilite >= 5)
      && !s.flags.includes('_fragment_1_vu'),
    priority: 100,
    interceptToScene: 'FRAGMENT_1_VISAGE'
  },
  {
    id: "fragment_acte2",
    check: (s) => s.currentSceneId === 'ACTE2_10_RIVIERE_CRISTAL' 
      && (s.gauges.instabilite >= 15) 
      && !s.flags.includes('_fragment_2_vu'),
    priority: 100,
    interceptToScene: 'FRAGMENT_2_TRONE'
  },
  {
    id: "fragment_acte3",
    check: (s) => s.currentSceneId === 'ACTE3_12_AUTEL_KALTHAR' 
      && (s.gauges.instabilite >= 25) 
      && !s.flags.includes('_fragment_3_vu'),
    priority: 100,
    interceptToScene: 'FRAGMENT_3_TRAHISON'
  },
  {
    id: "fragment_kalthar_jeune",
    check: (s) => (s.currentSceneId === 'ACTE3_12_AUTEL_KALTHAR' || s.currentSceneId === 'ACTE3_13_ARTEFACT')
      && (s.gauges.memoire_kalthar || 0) >= 4
      && !s.flags.includes('_frag_k_jeune_vu'),  // 60 (qa V59 #4) : plus d’exigence _fragment_3_vu ; la priorité garde l’ordre
    priority: 16,
    interceptToScene: 'FRAGMENT_ANCESTRE_KALTHAR_JEUNE'
  },
  {
    id: "fragment_acte4_final",
    check: (s) => s.currentSceneId === 'ACTE4_07_ADIEU_KALTHAR' 
      && !s.flags.includes('_fragment_4_vu'),
    priority: 101,
    interceptToScene: 'FRAGMENT_4_STELE'
  },
  {
    id: "fragment_serment_cendres",
    check: (s) => s.currentSceneId === 'ACTE3_09B_BIVOUAC_TEMPETE'
      && s.flags.includes('avec_ombre')
      && (s.gauges.instabilite || 0) >= 20
      && !s.flags.includes('_frag_serment_vu')
      && s.flags.includes('fresque_touched'),
    priority: 11,
    interceptToScene: 'FRAGMENT_SERMENT_CENDRES'
  },
  {
    id: "memoire_seuil_12",
    check: (s) => (s.gauges.memoire_kalthar || 0) >= 12
      && s.currentSceneId === 'ACTE4_07_ADIEU_KALTHAR'
      && !s.flags.includes('_frag4_enrichi_vu'),
    priority: 15,
    interceptToScene: 'FRAGMENT_4_ENRICHI'
  },

  // ===== V50.5 — PAYOFFS / SCÈNES ORPHELINES RESTAURÉES =====
  {
    id: "lisiere_fragment_croise",
    check: (s) => s.currentSceneId === 'ACTE2_01_RENCONTRE_SILAS_1'
      && s.flags.includes('bivouac_feu_O') && s.flags.includes('bivouac_feu_E')
      && !s.flags.includes('_frag_cendres_vu'),
    priority: 18,
    interceptToScene: 'FRAGMENT_CENDRES_SOLEIL'
  },
  {
    id: "lisiere_fragment_kaelen",
    check: (s) => s.currentSceneId === 'ACTE2_01_RENCONTRE_SILAS_1'
      && s.flags.includes('bivouac_feu_O') && !s.flags.includes('bivouac_feu_E')
      && !s.flags.includes('_frag_k_vu'),
    priority: 17,
    interceptToScene: 'FRAGMENT_KAELEN_ANCESTRE'
  },
  {
    id: "lisiere_fragment_alistair",
    check: (s) => s.currentSceneId === 'ACTE2_01_RENCONTRE_SILAS_1'
      && s.flags.includes('bivouac_feu_E') && !s.flags.includes('bivouac_feu_O')
      && !s.flags.includes('_frag_a_vu'),
    priority: 17,
    interceptToScene: 'FRAGMENT_ALISTAIR_ANCESTRE'
  },
  {
    id: "lendemain_confidence",
    check: (s) => s.currentSceneId === 'ACTE2_08_MATIN_AUBERGE'
      && (s.flags.includes('_lien_O_2_vu') || s.flags.includes('_lien_E_2_vu')
          || s.flags.includes('soir_avec_kaelen') || s.flags.includes('soir_avec_alistair')
          || s.flags.includes('intimite_O_auberge') || s.flags.includes('intimite_E_auberge'))
      && !s.flags.includes('_lendemain_confidence_vu'),
    priority: 14,
    interceptToScene: 'ACTE2_06B_LENDEMAIN_CONFIDENCE'
  },
  {
    id: "auberge_micro_reaction",
    check: (s) => s.currentSceneId === 'ACTE2_08_MATIN_AUBERGE'
      && (s.flags.includes('intimite_O_auberge') || s.flags.includes('intimite_E_auberge'))
      && !s.flags.includes('_micro_reaction_vu'),
    priority: 13,
    interceptToScene: 'ACTE2_08B_MICRO_REACTION'
  },

  // ===== PALIERS ROMANCE KAELEN =====
  {
    id: "palier_romance_O_2",
    check: (s) => s.currentSceneId === 'ACTE2_06_NUIT_AUBERGE' 
      && !s.flags.includes('soir_avec_kaelen') && !s.flags.includes('soir_avec_alistair')
      && romanceAvailableO(s)
      && (s.gauges.lien_O || 0) >= 2
      && !s.flags.includes('_lien_O_2_vu')
      && !s.flags.includes('_romance_beat_recent')
      && !(romanceAvailableO(s) && romanceAvailableE(s) && (s.gauges.lien_O||0)>=2 && (s.gauges.lien_E||0)>=2 && !s.flags.includes('_lien_O_2_vu') && !s.flags.includes('_lien_E_2_vu')),
    priority: 11,
    interceptToScene: 'LIEN_O_2_CONFIDENCE'
  },
  {
    id: "romance_O_1",
    check: (s) => s.currentSceneId === 'ACTE2_08_MATIN_AUBERGE' 
      && romanceAvailableO(s)
      && (s.gauges.lien_O || 0) >= 3
      && !s.flags.includes('_done_R_O_1')
      && !s.flags.includes('_romance_beat_recent')
      && !(romanceAvailableO(s) && romanceAvailableE(s) && (s.gauges.lien_O||0)>=3 && (s.gauges.lien_E||0)>=3 && !s.flags.includes('_done_R_O_1') && !s.flags.includes('_done_R_E_1')),
    priority: 10,
    interceptToScene: 'R_O_1'
  },
  {
    id: "joute_romance_O_1",
    check: (s) => s.currentSceneId === 'ACTE2_08_MATIN_AUBERGE'
      && romanceAvailableO(s)
      && (s.gauges.lien_O || 0) >= 3
      && !s.flags.includes('_joute_O1_vu')
      && !s.flags.includes('_done_R_O_1')
      && !s.flags.includes('_romance_beat_recent')
      && !(romanceAvailableO(s) && romanceAvailableE(s) && (s.gauges.lien_O||0)>=3 && (s.gauges.lien_E||0)>=3 && !s.flags.includes('_done_R_O_1') && !s.flags.includes('_done_R_E_1')),
    priority: 10,
    interceptToScene: 'JOUTE_O_1'
  },
  {
    id: "joute_romance_O_2",
    check: (s) => s.currentSceneId === 'ACTE3_09_VILLAGE_CACHE'
      && romanceAvailableO(s)
      && (s.gauges.lien_O || 0) >= 5
      && !s.flags.includes('_joute_O2_vu')
      && !s.flags.includes('_romance_beat_recent')
      && !(romanceAvailableO(s) && romanceAvailableE(s) && (s.gauges.lien_O||0)>=5 && (s.gauges.lien_E||0)>=5 && !s.flags.includes('_joute_O2_vu') && !s.flags.includes('_joute_E2_vu')),
    priority: 10,
    interceptToScene: 'JOUTE_O_2'
  },

  // ===== PALIERS ROMANCE ALISTAIR =====
  {
    id: "palier_romance_E_2",
    check: (s) => s.currentSceneId === 'ACTE2_06_NUIT_AUBERGE' 
      && !s.flags.includes('soir_avec_kaelen') && !s.flags.includes('soir_avec_alistair')
      && romanceAvailableE(s)
      && (s.gauges.lien_E || 0) >= 2
      && !s.flags.includes('_lien_E_2_vu')
      && !s.flags.includes('_romance_beat_recent')
      && !(romanceAvailableO(s) && romanceAvailableE(s) && (s.gauges.lien_O||0)>=2 && (s.gauges.lien_E||0)>=2 && !s.flags.includes('_lien_O_2_vu') && !s.flags.includes('_lien_E_2_vu')),
    priority: 11,
    interceptToScene: 'LIEN_E_2_CONFIDENCE'
  },
  {
    id: "romance_E_1",
    check: (s) => s.currentSceneId === 'ACTE2_08_MATIN_AUBERGE' 
      && romanceAvailableE(s)
      && (s.gauges.lien_E || 0) >= 3
      && !s.flags.includes('_done_R_E_1')
      && !s.flags.includes('_romance_beat_recent')
      && !(romanceAvailableO(s) && romanceAvailableE(s) && (s.gauges.lien_O||0)>=3 && (s.gauges.lien_E||0)>=3 && !s.flags.includes('_done_R_O_1') && !s.flags.includes('_done_R_E_1')),
    priority: 9,
    interceptToScene: 'R_E_1'
  },
  {
    id: "joute_romance_E_1",
    check: (s) => s.currentSceneId === 'ACTE2_08_MATIN_AUBERGE'
      && romanceAvailableE(s)
      && (s.gauges.lien_E || 0) >= 3
      && !s.flags.includes('_joute_E1_vu')
      && !s.flags.includes('_done_R_E_1')
      && !s.flags.includes('_romance_beat_recent')
      && !(romanceAvailableO(s) && romanceAvailableE(s) && (s.gauges.lien_O||0)>=3 && (s.gauges.lien_E||0)>=3 && !s.flags.includes('_done_R_O_1') && !s.flags.includes('_done_R_E_1')),
    priority: 9,
    interceptToScene: 'JOUTE_E_1'
  },
  {
    id: "joute_romance_E_2",
    check: (s) => s.currentSceneId === 'ACTE3_09_VILLAGE_CACHE'
      && romanceAvailableE(s)
      && (s.gauges.lien_E || 0) >= 5
      && !s.flags.includes('_joute_E2_vu')
      && !s.flags.includes('_romance_beat_recent')
      && !(romanceAvailableO(s) && romanceAvailableE(s) && (s.gauges.lien_O||0)>=5 && (s.gauges.lien_E||0)>=5 && !s.flags.includes('_joute_O2_vu') && !s.flags.includes('_joute_E2_vu')),
    priority: 9,
    interceptToScene: 'JOUTE_E_2'
  },

  // ===== LIAISONS & MICRO-SCÈNES =====
  {
    id: "lien_marche_1",
    check: (s) => s.currentSceneId === 'ACTE1_08_SECRET'
      && !s.flags.includes('lien_marche1_vu')
      && !String(s.currentSceneId).startsWith('LIEN_')
      && !String(s.currentSceneId).startsWith('FRAGMENT_')
      && !String(s.currentSceneId).startsWith('R_')
      && !String(s.currentSceneId).startsWith('JOUTE_'),
    priority: 12,
    interceptToScene: 'LIEN_MARCHE_1'
  },
  {
    id: "lien_marche_2",
    check: (s) => s.currentSceneId === 'ACTE2_08_MATIN_AUBERGE'
      && (
           s.flags.includes('_done_R_O_1')
        || s.flags.includes('_done_R_E_1')
        || s.flags.includes('_joute_O1_vu')
        || s.flags.includes('_joute_E1_vu')
      )
      && !s.flags.includes('lien_marche2_vu')
      && !String(s.currentSceneId).startsWith('LIEN_')
      && !String(s.currentSceneId).startsWith('FRAGMENT_')
      && !String(s.currentSceneId).startsWith('R_')
      && !String(s.currentSceneId).startsWith('JOUTE_'),
    priority: 8,
    interceptToScene: 'LIEN_MARCHE_2'
  },
  {
    id: "lien_pomme",
    check: (s) => s.currentSceneId === 'LIEN_MARCHE_2'
      && (
           s.flags.includes('kaelen_alistair_rapprochement')
        || (s.gameMode === 'ngplus' && s.globalFlags && s.globalFlags.includes('ng_plus_unlocked'))
        || ((s.gauges.lien_O || 0) >= 2 && (s.gauges.lien_E || 0) >= 2)
      )
      && !s.flags.includes('pomme_ramassee'),
    priority: 7,
    interceptToScene: 'LIEN_POMME'
  },
  {
    id: "lien_feu_partage",
    check: (s) => (s.currentSceneId === 'ACTE2_12_NUIT_ISOLEE' || s.currentSceneId === 'ACTE2_06_NUIT_AUBERGE')
      && s.flags.includes('pomme_ramassee')
      && !s.flags.includes('regard_partage_feu'),
    priority: 6,
    interceptToScene: 'LIEN_FEU_PARTAGE'
  },
  {
    id: "feu_partage_extension",
    check: (s) => (s.currentSceneId === 'ACTE3_01_FRONTIERE_1' || s.currentSceneId === 'ACTE3_08_MISE_AU_POINT')
      && s.flags.includes('pomme_ramassee')
      && s.flags.includes('regard_partage_feu')
      && !s.flags.includes('_feu_partage_ext_vu'),
    priority: 6,
    interceptToScene: 'FEU_PARTAGE_EXTENSION'
  },
  {
    id: "lien_non_dit",
    check: (s) => (s.currentSceneId === 'ACTE2_08_MATIN_AUBERGE' || s.currentSceneId === 'LIEN_MARCHE_2')
      && s.flags.includes('pomme_ramassee')
      && !s.flags.includes('silence_complice_auberge'),
    priority: 4,
    interceptToScene: 'LIEN_NON_DIT'
  },
  {
    id: "alistair_priere",
    check: (s) => s.currentSceneId === 'ACTE2_06_NUIT_AUBERGE'
      && s.flags.includes('avec_eclaireur')
      && !s.flags.includes('_alistair_priere_vu'),
    priority: 5,
    interceptToScene: 'ALISTAIR_PRIERE'
  },
  {
    id: "kaelen_silence",
    check: (s) => s.currentSceneId === 'ACTE3_09B_BIVOUAC_TEMPETE'
      && s.flags.includes('avec_ombre')
      && !s.flags.includes('_kaelen_silence_vu'),
    priority: 5,
    interceptToScene: 'KAELEN_SILENCE'
  },

  // ===== ARC ORAYA / LYRA / FEN =====
  {
    id: "oraya_indice_1",
    check: (s) => s.currentSceneId === 'ACTE3_10_ACCUEIL_CULTE_1'
      && !s.flags.includes('oraya_indice_1'),
    priority: 4,
    interceptToScene: 'ORAYA_INDICE_1'
  },
  {
    id: "oraya_indice_2",
    check: (s) => s.currentSceneId === 'ACTE3_12_AUTEL_KALTHAR'
      && s.flags.includes('oraya_indice_1')
      && !s.flags.includes('oraya_indice_2'),
    priority: 4,
    interceptToScene: 'ORAYA_INDICE_2'
  },
  {
    id: "oraya_indice_3",
    check: (s) => s.currentSceneId === 'ACTE3_13_ARTEFACT'
      && s.flags.includes('oraya_indice_2')
      && !s.flags.includes('oraya_indice_3'),
    priority: 4,
    interceptToScene: 'ORAYA_INDICE_3'
  },
  {
    id: "oraya_confrontation",
    check: (s) => s.currentSceneId === 'ACTE4_08_CORRIDOR_OBSIDIENNE'
      && s.flags.includes('oraya_indice_3')
      && s.flags.includes('_fragment_4_vu')
      && !s.flags.includes('oraya_confrontation_faite'),
    priority: 8,
    interceptToScene: 'ORAYA_CONFRONTATION'
  },
  {
    id: "lyra_indice_1",
    check: (s) => s.currentSceneId === 'ACTE3_03_LA_SIRENE'
      && !s.flags.includes('lyra_indice_1')
      && !s.flags.includes('sirene_acceptee'),
    priority: 4,
    interceptToScene: 'LYRA_INDICE_1'
  },
  {
    id: "lyra_verite",
    check: (s) => s.currentSceneId === 'ACTE3_03B_RESISTANCE'
      && s.flags.includes('lyra_indice_1')
      && !s.flags.includes('lyra_verite_revelee'),
    priority: 6,
    interceptToScene: 'LYRA_VERITE'
  },
  {
    id: "fen_indice_1",
    check: (s) => ['ACTE1_04_TRANSITION','ACTE1_04_AUTOMATE'].includes(s.currentSceneId)
      && Array.isArray(s.choiceHistory) && (s.choiceHistory[s.choiceHistory.length - 1] || {}).scene === 'ACTE1_04_FRESQUE'
      && s.flags.includes('fresque_touched')
      && !s.flags.includes('fen_fresque'),
    priority: 4,
    interceptToScene: 'FEN_INDICE_1'
  },
  {
    id: "fen_indice_2",
    check: (s) => s.currentSceneId === 'ACTE2_03_BIVOUAC_AUTOMNE'
      && !s.flags.includes('fen_note'),
    priority: 4,
    interceptToScene: 'FEN_INDICE_2'
  },
  {
    id: "fen_adieu",
    check: (s) => s.currentSceneId === 'ACTE4_07_ADIEU_KALTHAR'
      && s.flags.includes('fen_fresque')
      && s.flags.includes('fen_note')
      && !s.flags.includes('fen_adieu_scene'),
    priority: 9,
    interceptToScene: 'FEN_ADIEU'
  },

  // ===== NOUVEAUX PERSONNAGES V27 =====
  {
    id: "seraphine_intro",
    check: (s) => s.currentSceneId === 'ACTE3_09_VILLAGE_CACHE'
      && ((s.gauges.lien_E || 0) >= 4 || s.flags.includes('seraphine_curiosite'))
      && !s.flags.includes('_seraphine_intro_vu'),
    priority: 12,
    interceptToScene: 'SERAPHINE_INTRO'
  },
  {
    id: "veyra_pacte",
    check: (s) => s.currentSceneId === 'ACTE3_12_AUTEL_KALTHAR'
      && (s.gauges.possession || 0) >= 6
      && !s.flags.includes('_veyra_pacte_vu'),
    priority: 11,
    interceptToScene: 'VEYRA_PACTE'
  },
  {
    id: "nomade_apparition_1",
    check: (s) => s.currentSceneId === 'ACTE2_10_RIVIERE_CRISTAL'
      && !s.flags.includes('_nomade_1_vu'),
    priority: 6,
    interceptToScene: 'NOMADE_1'
  },
  {
    id: "mira_solo_1",
    // Mira intervient plus tard, sur la nuit isolée. Elle ne doit pas
    // interrompre le retour du choix Fen dans la scène de l’auberge.
    check: (s) => s.currentSceneId === 'ACTE2_12_NUIT_ISOLEE'
      && s.flags.includes('voie_solo')
      && !s.flags.includes('_mira_rencontre_vu')
      && !s.flags.includes('avec_ombre')
      && !s.flags.includes('avec_eclaireur'),
    priority: 7,
    interceptToScene: 'MIRA_RENCONTRE'
  },

  // ===== V53.6 — ROMANCE DE SÉRAPHINE ET SURSIS DE SURCHARGE =====
  {
    id: "surcharge_sursis",
    check: (s) => (s.gauges.instabilite || 0) >= 40
      && !s.flags.includes('_surcharge_sursis_vu')
      && s.currentSceneId !== 'AVERTISSEMENT_SURCHARGE'
      && !/^(FIN_|GAME_OVER_|FRAGMENT_|R_|JOUTE_|LIEN_|SERAPHINE_|ACTE5_|NGP_|NG_|ACTE3_0[3-7])/.test(String(s.currentSceneId)), // jamais pendant la sirène
    priority: 149,
    interceptToScene: 'AVERTISSEMENT_SURCHARGE'
  },
  {
    // 59 : second avertissement, au palier 50 (ou dès que la mort deviendrait possible).
    id: "surcharge_sursis_2",
    check: (s) => s.flags.includes('_surcharge_sursis_vu') && !s.flags.includes('_surcharge_sursis2_vu')
      && ((s.gauges.instabilite || 0) >= 50 || ((s.gauges.instabilite || 0) >= 46 && ['filon_absorbe','energie_famillier_absorbee','panthere_absorbee'].filter(f => s.flags.includes(f)).length >= 2))
      && s.currentSceneId !== 'AVERTISSEMENT_SURCHARGE_2' && s.currentSceneId !== 'AVERTISSEMENT_SURCHARGE'
      && !/^(FIN_|GAME_OVER_|NGP_|NG_|ACTE5_|ACTE3_0[3-7])/.test(String(s.currentSceneId)),
    priority: 148,
    interceptToScene: 'AVERTISSEMENT_SURCHARGE_2'
  },
  {
    id: "seraphine_coeur_1",
    check: (s) => ['ACTE3_10_ACCUEIL_CULTE_1', 'ACTE3_12_AUTEL_KALTHAR', 'ACTE3_13_ARTEFACT'].includes(s.currentSceneId)
      && s.flags.includes('seraphine_arrivee_vue') && !s.flags.includes('_seraphine_coeur_1_vu')
      && !s.flags.includes('alistair_mort'),
    priority: 6,
    interceptToScene: 'SERAPHINE_COEUR_1_GARDE'
  },
  {
    id: "seraphine_coeur_2",
    check: (s) => ['ACTE3_13_ARTEFACT', 'ACTE4_01_DEPART_VILLAGE'].includes(s.currentSceneId)
      && s.flags.includes('seraphine_fracture_vue') && s.flags.includes('seraphine_etincelle')
      && !s.flags.includes('seraphine_coeur_ferme') && !s.flags.includes('_seraphine_coeur_2_vu'),
    priority: 6,
    interceptToScene: 'SERAPHINE_COEUR_2_REGISTRE'
  },
  {
    id: "seraphine_coeur_3",
    check: (s) => ['ACTE4_01_HALTE_DOME', 'ACTE4_02_CHOIX_CHAMBRE'].includes(s.currentSceneId)
      && s.flags.includes('_seraphine_coeur_2_vu') && (s.gauges.lien_seraphine || 0) >= 3
      && !s.flags.includes('seraphine_coeur_ferme') && !s.flags.includes('_seraphine_coeur_3_vu'),
    priority: 9,
    interceptToScene: 'SERAPHINE_COEUR_3_LAME'
  },
  {
    id: "seraphine_coeur_4",
    check: (s) => ['ACTE4_05_ARRIVEE_PORTES_1', 'ACTE4_06_MASQUE_TOMBE_1'].includes(s.currentSceneId)
      && s.flags.includes('seraphine_baiser') && !s.flags.includes('_seraphine_coeur_4_vu')
      && !s.flags.includes('alistair_mort') && !s.flags.includes('alistair_perdu') && !s.flags.includes('alistair_perdu_definitif'),
    priority: 6,
    interceptToScene: 'SERAPHINE_COEUR_4_FRERE'
  },
  {
    id: "seraphine_coeur_5",
    check: (s) => ['ACTE4_08_CORRIDOR_OBSIDIENNE', 'ACTE4_08_SEUIL_ETERNITE'].includes(s.currentSceneId)
      && s.flags.includes('seraphine_baiser') && !s.flags.includes('_seraphine_coeur_5_vu'),
    priority: 6,
    interceptToScene: 'SERAPHINE_COEUR_5_EVEIL'
  },
  // ===== V53.5 — NOUVEAUX ARCS =====
  {
    id: "alistair_lettre_soeur",
    check: (s) => s.currentSceneId === 'ACTE2_11_RIVE_NORD'
      && !s.flags.includes('seraphine_lettre_vue')
      && !s.flags.includes('voie_solo') && !s.flags.includes('voie_solo_profonde')
      && !s.flags.includes('alistair_mort') && !s.flags.includes('alistair_perdu') && !s.flags.includes('alistair_perdu_definitif'),
    priority: 3,
    interceptToScene: 'ALISTAIR_LETTRE_SOEUR'
  },
  {
    id: "trio_nuit_dome",
    // 59 : deux fenêtres dans le dôme (la halte, puis la chambre) ; la nuit poly ne ferme la question que si rien n’a été réparé.
    // 60 (romance V59 N1, qa V59 #1-2) : troisième fenêtre aux Portes ; après la nuit poly, il faut le vrai beat de réparation
    // (poly_repare_60, au bivouac de la tempête), pas un simple choix au réveil ; la domination de la crevasse ferme la question.
    check: (s) => (s.currentSceneId === 'ACTE4_01_HALTE_DOME' || s.currentSceneId === 'ACTE4_02_CHOIX_CHAMBRE' || s.currentSceneId === 'ACTE4_05_ARRIVEE_PORTES_1')
      && !s.flags.includes('_trio_nuit_vue')
      && s.flags.includes('lisiere_trio_ouvert') // 60.3.1 (romance P2) : la réparation ne remplace plus l'ouverture consentie
      && (!s.flags.includes('double_jeu') || s.flags.includes('poly_repare_60'))
      && !s.flags.includes('crevasse_domination')
      // 56.0 : pas de question à trois après une rupture, une pause ou un ordre de domination.
      && !s.flags.includes('romance_O_rompue') && !s.flags.includes('romance_E_rompue')
      && !s.flags.includes('romance_en_pause_O') && !s.flags.includes('romance_en_pause_E')
      && !s.flags.includes('go_poly_domination') && !s.flags.includes('domination_finale')
      && !(typeof dominationRomance6032_ === 'function' && dominationRomance6032_(s)) // 60.3.2 (romance F1) : « À genoux », emprise
      && !s.flags.includes('trio_question_refusee_6033') && !s.flags.includes('trio_question_refermee_6033') // 60.3.3 : un non tient
      && !['amis_O','amis_E','amis_O_ferme','amis_E_ferme'].some(f => s.flags.includes(f)) // 60.3.3 (romance P3)
      && (s.gauges.lien_O || 0) >= 4 && (s.gauges.lien_E || 0) >= 4
      && !s.flags.includes('kaelen_mort') && !s.flags.includes('kaelen_perdu') && !s.flags.includes('kaelen_perdu_definitif')
      && !s.flags.includes('alistair_mort') && !s.flags.includes('alistair_perdu') && !s.flags.includes('alistair_perdu_definitif')
      // 60.8.1 (romance R2-R3, QA narratif) : le dôme ne s'ouvre que si les deux sont réellement là (Alistair au cachot
      // compte comme absent, comme pour la romance) et si chacun peut répondre pour lui-même : même règle que PROPOSER.
      // Avant, il s'ouvrait sur un refus imposé et brûlait la question pour toujours. Le non reste possible avant
      // (question à trois) et au dôme (ATTENDRE) ; aucun oui n'est posé à la place de quelqu'un.
      && companionPresentO(s) && companionPresentE(s)
      && (typeof trioOui6033_ !== 'function' || (function(g) { return trioOui6033_(g, 'O') && trioOui6033_(g, 'E'); })({ hasFlag: f => s.flags.includes(f), getGauge: k => Number((s.gauges || {})[k] || 0) })),
    priority: 8,
    interceptToScene: 'TRIO_NUIT_DOME'
  },

  // ===== RELIQUES / SILAS / URGENCE =====
  {
    id: "relique_kalthar_1",
    check: (s) => s.currentSceneId === 'ACTE2_10_RIVIERE_CRISTAL'
      && !s.flags.includes('relique_1_trouvee')
      && ((s.gauges.instabilite || 0) >= 10 || (s.gauges.memoire_kalthar || 0) >= 3),
    priority: 7,
    interceptToScene: 'RELIQUE_KALTHAR_1'
  },
  {
    id: "relique_kalthar_2",
    check: (s) => s.currentSceneId === 'ACTE3_09_VILLAGE_CACHE'
      && s.flags.includes('relique_1_trouvee')
      && !s.flags.includes('relique_2_trouvee'),
    priority: 7,
    interceptToScene: 'RELIQUE_KALTHAR_2'
  },
  {
    id: "relique_kalthar_3",
    check: (s) => s.currentSceneId === 'ACTE4_07_ADIEU_KALTHAR'
      && s.flags.includes('relique_2_trouvee')
      && !s.flags.includes('relique_3_trouvee'),
    priority: 7,
    interceptToScene: 'RELIQUE_KALTHAR_3'
  },
  {
    id: "silas_memoires",
    check: (s) => s.currentSceneId === 'ACTE3_09_VILLAGE_CACHE'
      && s.flags.includes('silas_ami')
      && !s.flags.includes('silas_histoire_3'),
    priority: 6,
    interceptToScene: 'SILAS_MEMOIRES'
  },
  {
    id: "silas_verite",
    check: (s) => s.currentSceneId === 'ACTE4_07_ADIEU_KALTHAR'
      && s.flags.includes('silas_ami')
      && s.flags.includes('silas_histoire_3')
      && !s.flags.includes('silas_verite_acceptee')
      && !s.flags.includes('silas_verite_brulee')
      && !s.flags.includes('silas_verite_ignoree'),
    priority: 6,
    interceptToScene: 'SILAS_VERITE'
  },
  {
    id: "urgence_narrative_acte3",
    check: (s) => s.currentSceneId === 'ACTE3_08_MISE_AU_POINT'
      && !s.flags.includes('urgence_declenchee')
      && (s.gauges.instabilite || 0) >= 20,
    priority: 7,
    interceptToScene: 'URGENCE_NARRATIVE'
  },
  {
    id: "dague_gravure",
    check: (s) => s.currentSceneId === 'ACTE3_08_MISE_AU_POINT'
      && s.flags.includes('dague_kaelen_prise')
      && !s.flags.includes('dague_gravee'),
    priority: 6,
    interceptToScene: 'ACTE_DAGUE_GRAVURE'
  },
  {
    id: "dague_combat_village",
    check: (s) => s.currentSceneId === 'ACTE3_09_VILLAGE_CACHE'
      && s.flags.includes('dague_kaelen_prise')
      && !s.flags.includes('dague_utilisee_combat')
      && !s.flags.includes('_dague_combat_vu'),
    priority: 7,
    interceptToScene: 'ACTE3_DAGUE_COMBAT'
  },
  {
    id: "aveu_parallele",
    check: (s) => (s.currentSceneId === 'ACTE4_05_ARRIVEE_PORTES_1' || s.currentSceneId === 'ACTE4_06_MASQUE_TOMBE_1')
      && s.flags.includes('pomme_ramassee')
      && s.flags.includes('regard_partage_feu')
      && !s.flags.includes('double_jeu')
      && !s.flags.includes('_aveu_parallele_vu'),
    priority: 8,
    interceptToScene: 'ACTE4_AVEU_PARALLELE'
  },
  {
    id: "silas_cameo",
    check: (s) => s.currentSceneId === 'ACTE3_09_VILLAGE_CACHE'
      && (s.flags.includes('silas_ami') || s.flags.includes('silas_mort'))
      && !s.flags.includes('_silas_cameo_vu'),
    priority: 5,
    interceptToScene: 'ACTE3_SILAS_CAMEO'
  },

  // ===== V28 : PRÉSENCE & BASCULES FLUIDES =====
  {
    id: "v28_oraya_guide_solo",
    check: (s) => s.currentSceneId === 'ACTE3_10_ACCUEIL_CULTE_1'
      && (s.flags.includes('voie_solo') || s.flags.includes('voie_solo_profonde'))
      && ((s.gauges.presence_O || 0) >= 6 || (s.gauges.presence_E || 0) >= 6)
      && !s.flags.includes('_v28_oraya_guide_vu'),
    priority: 8,
    interceptToScene: 'V28_ORAYA_PROPOSE_GUIDE'
  },
  {
    id: "v28_solo_echo_acte2",
    check: (s) => s.currentSceneId === 'ACTE2_08_MATIN_AUBERGE'
      && (s.flags.includes('voie_solo') || s.flags.includes('voie_solo_profonde'))
      && (s.gauges.presence_O || 0) + (s.gauges.presence_E || 0) >= 5
      && !s.flags.includes('_v28_solo_echo_acte2_vu')
      && !s.flags.includes('avec_ombre')
      && !s.flags.includes('avec_eclaireur'),
    priority: 6,
    interceptToScene: 'V28_SOLO_ECHO_AUBERGE'
  },

  // ===== V50 : PAYOFFS RECONNECTÉS =====
  {
    id: "v50_mira_suite_solo",
    check: (s) => s.currentSceneId === 'ACTE3_09_VILLAGE_CACHE'
      && (s.flags.includes('mira_alliee') || s.flags.includes('mira_complice'))
      && (s.flags.includes('voie_solo') || s.flags.includes('voie_solo_profonde'))
      && !s.flags.includes('mira_fuite_acceptee')
      && !s.flags.includes('mira_attend')
      && !s.flags.includes('mira_liberee'),
    priority: 13,
    interceptToScene: 'MIRA_SUITE_SOLO'
  },
  {
    id: "v50_dette_kaelen",
    check: (s) => s.currentSceneId === 'ACTE3_08_MISE_AU_POINT'
      && relationAvailableO(s)
      && (s.gauges.distance_O || 0) >= 3
      && !s.flags.includes('dette_O_confrontee')
      && !s.flags.includes('kaelen_perdu_definitif'),
    priority: 12,
    interceptToScene: 'KAELEN_CONFRONTATION_DETTE'
  },
  {
    id: "v50_dette_alistair",
    check: (s) => s.currentSceneId === 'ACTE3_08_MISE_AU_POINT'
      && relationAvailableE(s)
      && (s.gauges.distance_E || 0) >= 3
      && !s.flags.includes('dette_E_confrontee')
      && !s.flags.includes('alistair_mort')
      && !s.flags.includes('alistair_perdu_definitif'),
    priority: 11,
    interceptToScene: 'ALISTAIR_CONFRONTATION_DETTE'
  },

  // ===== VOIE SOLO =====
  {
    id: "solo_echo_acte1",
    check: (s) => s.currentSceneId === 'ACTE1_04_TRANSITION'
      && s.flags.includes('voie_solo')
      && !s.flags.includes('_solo_echo_vu'),
    priority: 9,
    interceptToScene: 'ACTE1_SOLO_ECHO'
  },
  {
    id: "solo_fen_acte2",
    check: (s) => s.currentSceneId === 'ACTE2_12_NUIT_ISOLEE'
      && s.flags.includes('voie_solo')
      && !s.flags.includes('_solo_fen_vu')
      && !s.flags.includes('avec_ombre')
      && !s.flags.includes('avec_eclaireur'),
    priority: 5,
    interceptToScene: 'ACTE_SOLO_FEN'
  }
];
