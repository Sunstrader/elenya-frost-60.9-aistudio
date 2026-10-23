/** Fragment DB ACTE5 — 4 scènes de base (compte vérifié par tests/entetes-db.cjs).
 * Texte réécrit à plusieurs reprises (57-59) ; les scènes ajoutées à l’exécution sont dans 23_Refonte.js. */
function _dbActe5V52_() {
  return {
'ACTE5_01_LENDEMAIN': {
    sceneNumber: 'ACTE5_01',
    chapter: 5,
    title: "Le Lendemain du Trône",
    mood: 'epilogue',
    image: "https://cdn.jsdelivr.net/gh/Sunstrader/Releases@main/Acte%203/Campement_dans_la_neige_(matin)_202606191345.jpeg",
    getDynamicNarrative: (gs) => {
      let text = "Le jour se lève sur un monde qui a changé — ou qui n’a pas changé du tout.\n\n";
      text += "Tu es encore là. Ou plus tout à fait.\n\n";
      if (gs.hasFlag('fen_accepte')) {
        text += "Parfois, quand le vent tombe, tu entends encore un sifflement très bas.\n\n";
      }
      if (gs.hasFlag('oraya_pardonnee')) {
        text += "Oraya veille quelque part. Elle ne prie plus. Elle attend.\n\n";
      }
      text += "Le Trône est derrière toi. Ou sous toi. Ou en toi.\n\n";
      text += "Il reste à décider ce que tu en fais maintenant.";
      if (companionPresentO(gs) && (gs.hasFlag('avec_ombre') || gs.hasFlag('kaelen_reste'))) {
        if (gs.hasFlag('joute_froide_O') || gs.hasFlag('domination_path_chosen') || gs.hasFlag('domination_acte3_O') || gs.hasFlag('kaelen_perdu_definitif')) {
          text += "\n\nKaelen est encore là, au matin. Il ne se rapproche pas. « Je reste pour le trône. Pas pour le reste. »";
        } else if (gs.hasFlag('amis_O') || gs.hasFlag('romance_en_pause_O')) {
          text += "\n\nKaelen est encore là, au matin. « Compagnon de route. Comme on s’est dit. »";
        } else if (gs.hasFlag('soir_avec_kaelen') || gs.hasFlag('romance_reelle_O') || gs.hasFlag('kaelen_jusqu_au_bout') || gs.hasFlag('kaelen_amour_libre')) {
          text += "\n\nKaelen est encore là, au matin. Il ne fait pas de discours. « Je suis là. »";
        }
      }
      if (companionPresentE(gs) && (gs.hasFlag('avec_eclaireur') || gs.hasFlag('alistair_reste'))) {
        if (gs.hasFlag('joute_froide_E') || gs.hasFlag('domination_path_chosen') || gs.hasFlag('domination_acte3_E') || gs.hasFlag('crevasse_domination')) {
          text += "\n\nAlistair est près du seuil. Il ne propose pas la marche. « Je veille. C’est tout. »";
        } else if (gs.hasFlag('amis_E') || gs.hasFlag('romance_en_pause_E')) {
          text += "\n\nAlistair te tend une outre. « Ami, si tu veux. Ce que tu tais, je le garderai comme on garde une veille. »";
        } else if (gs.hasFlag('soir_avec_alistair') || gs.hasFlag('romance_reelle_E') || gs.hasFlag('alistair_foi_libre') || gs.hasFlag('alistair_pour_toi')) {
          text += "\n\nAlistair est près du seuil. « On peut marcher un peu. Sans serment. »";
        }
      }
      return text;
    },
    choices: [
      {
        key: 'SUITE',
        text: "Descendre vers ceux qui t’attendent.",
        next: 'ACTE5_01B_PREMIER_MATIN'
      }
    ]
  },

'ACTE5_02_VEILLE': {
    sceneNumber: 'ACTE5_02V',
    chapter: 5,
    title: "La Veille",
    mood: 'epilogue',
    image: "https://cdn.jsdelivr.net/gh/Sunstrader/Releases@main/Acte%203/Place_du_village_avec_statue_202606191345.jpeg",
    isEnd: true,
    getDynamicNarrative: (gs) => {
      return "Tu restes.\n\n" +
        "Les saisons passent. Les gens s’habituent. Certains t’apportent des offrandes. D’autres te maudissent en silence.\n\n" +
        "Tu ne réponds plus. Tu veilles.\n\n" +
        (gs.hasFlag('acte5_geoles_ouvertes') ? "Les anciennes geôles de l’Ordre deviennent des greniers, puis des écoles. Personne ne se souvient très bien qui a eu l’idée. Tu préfères ça.\n\n" : "") +
        (gs.hasFlag('acte5_noms_rendus') ? "Chaque hiver, au premier gel, le village relit la liste des noms. Elle s’allonge. Un jour, tu entends un enfant y ajouter le tien, entre deux inconnus, et tu ne le corriges pas.\n\n" : "") +
        (gs.hasFlag('acte5_tombe_fen') ? "Sur la tombe sans corps, quelqu’un dépose chaque printemps une plume blanche. Ce n’est pas toi. Tu ne cherches pas à savoir qui.\n\n" : "") +
        (gs.hasFlag('seraphine_amour') ? "Séraphine veille avec toi. Elle tient la lampe ; tu tiens le froid à distance. Certains soirs, vous échangez les rôles, pour voir.\n\n" : "") +
        (trioConsenti56_(gs) ? "Certains soirs, trois ombres se partagent le même banc devant ta porte. On jase au village. Vous laissez jaser.\n\n" : "") +
        "Et quelque part, dans le froid qui n’est plus tout à fait le tien, tu sais que c’est assez.";
    },
    choices: []
  },

'ACTE5_02_DEPART': {
    sceneNumber: 'ACTE5_02D',
    chapter: 5,
    title: "Le Départ",
    mood: 'epilogue',
    image: "https://cdn.jsdelivr.net/gh/Sunstrader/Releases@main/Acte%203/Cr%C3%AAte_neigeuse_202606191345.jpeg",
    isEnd: true,
    getDynamicNarrative: (gs) => {
      let text = "Tu pars.\n\n" +
        "Sans couronne. Sans mythe. Sans dette.\n\n" +
        "Le Nord t’ouvre ses portes. Ou le Sud. Ou n’importe où.\n\n";
      if (companionPresentO(gs) && (gs.getGauge('presence_O') || 0) >= 5) {
        text += "Derrière toi, une dague est plantée dans la neige. Kaelen ne t’a pas suivie. Il n’a pas eu besoin de le faire.\n\n";
      }
      if (companionPresentE(gs) && (gs.getGauge('presence_E') || 0) >= 5) {
        text += "Plus loin, une faible lueur disparaît entre les arbres. Alistair prie encore — non pour te retenir, mais pour que ton choix reste tien.\n\n";
      }
      if ((gs.getGauge('presence_S') || 0) >= 8) {
        text += "Quand le vent se lève, trois notes semblent revenir avec lui. Tu reconnais la mélodie de Fen sans confondre le souvenir avec une présence. Tu n’as pas vaincu la solitude. Tu l’as choisie.\n\n";
      }
      if (gs.hasFlag('acte5_noms_rendus')) text += "Tu emportes une copie de la liste des noms, pliée contre ta poitrine. Dans chaque village, tu en lis quelques-uns, et tu en apprends d’autres.\n\n";
      if (gs.hasFlag('acte5_tombe_fen')) text += "Avant de franchir le col, tu te retournes une seule fois vers la tombe de Fen. Puis tu tiens ta promesse : tu ne regardes plus en arrière.\n\n";
      if (gs.hasFlag('seraphine_amour')) text += "Séraphine marche à ta gauche, la cape blanche roulée au fond de son sac. « Personne ne nous reconnaîtra, » dit-elle. Elle a tort. Elle s’en moque.\n\n";
      if (gs.hasFlag('mira_apprend_disparaitre')) text += "Mira t’a appris à disparaître sans te perdre. Tu découvres que cela s’apprend aussi pour revenir.\n\n";
      text += "Pour la première fois, la route n’a pas de fin écrite à l’avance.\n\n" +
        "Et même lorsque tu marches seule, ceux qui t’ont aimée ne disparaissent plus simplement parce que tu leur as fermé la porte.";
      return text;
    },
    choices: []
  },

'ACTE5_02_RETOUR': {
    sceneNumber: 'ACTE5_02R',
    chapter: 5,
    title: "Ceux qui Restent",
    mood: 'epilogue',
    image: "https://cdn.jsdelivr.net/gh/Sunstrader/Releases@main/Acte%203/Campement_dans_la_neige_(nuit)_202606191345.jpeg",
    isEnd: true,
    getDynamicNarrative: (gs) => {
      let text = "Tu reviens sur tes pas.\n\n";
      let rencontres = 0;
      if (gs.hasFlag('avec_ombre') && companionPresentO(gs)) {
        text += "Kaelen est encore là. Il ne dit rien. Il range juste une dague de plus.\n\n";
        rencontres++;
      }
      if (gs.hasFlag('avec_eclaireur') && companionPresentE(gs)) {
        text += "Alistair est encore là. Son insigne est éteint. Il sourit quand même.\n\n";
        rencontres++;
      }
      if (gs.hasFlag('mira_alliee') || gs.hasFlag('mira_complice')) {
        text += "Mira lève un sourcil. « T’as oublié un truc ? »\n\n";
        rencontres++;
      }
      if (gs.hasFlag('seraphine_fin_alliee') || gs.hasFlag('seraphine_fin_sans_serment')) { text += "Séraphine aussi. Elle t’observe comme on surveille une promesse. « Je reste, » dit-elle. « Pour vérifier. » Tu la crois.\n\n"; rencontres++; }
      if (gs.hasFlag('seraphine_amour')) { text += "Séraphine t’attend sur le seuil. Elle ne dit pas « je reste ». Elle te prend la main, et c’est la même chose.\n\n"; rencontres++; }
      if (gs.hasFlag('veyra_fin_egalite')) { text += "Veyra est assise près du feu, sans contrat. « Je pouvais partir, » dit-elle. « C’est pour ça que je suis restée. »\n\n"; rencontres++; }
      if (trioConsenti56_(gs) && rencontres >= 2) text += "Kaelen pousse une place vers toi sur le banc, entre lui et Alistair. Personne n’a besoin de dire ce que cette place veut dire.\n\n";
      text += rencontres ? "Tu ne réponds pas. Tu t’assieds simplement près de ceux qui sont restés.\n\n" : "Personne ne t’attend ici. Tu t’assieds un instant, seule avec ce choix.\n\n";
      text += "Le monde peut attendre.";
      return text;
    },
    choices: []
  },
  // ==========================================
  // FRAGMENTS (enrichis V27)
  // ==========================================
  };
}
