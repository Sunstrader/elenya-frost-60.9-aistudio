/** Fragment DB SECONDARY — 38 scènes de base (compte vérifié par tests/entetes-db.cjs).
 * Texte réécrit à plusieurs reprises (57-59) ; les scènes ajoutées à l’exécution sont dans 23_Refonte.js. */
function _dbSecondaryV52_() {
  return {

'SERAPHINE_COEUR_1_GARDE': {
  sceneNumber: '3.SC1', chapter: 3, title: "La Garde Blanche", mood: 'intimate',
  image: "https://cdn.jsdelivr.net/gh/Sunstrader/Releases@main/Acte%203/Campement_dans_la_neige_(nuit)_202606191345.jpeg", sprite: "https://cdn.jsdelivr.net/gh/Sunstrader/elenya-3d-assets@main/game-v54/sprites/seraphine.webp",
  getDynamicNarrative: (gs) => {
    let t = "";
    t += "La nuit tombe sur le village caché. Tout le monde dort, sauf deux personnes qu’on a dressées à ne jamais dormir en territoire ennemi.\n\n";
    t += "Séraphine monte la garde au bord du cratère, sa cape blanche repliée sous elle pour ne pas briller. Elle ne se retourne pas quand tu approches. « Vous marchez comme une reine, » dit-elle. « Lourdement. On vous entend depuis la place. »\n\n";
    if (gs.hasFlag('seraphine_ennemie')) t += "Il reste de la colère dans sa voix, celle de l’après-midi. Mais elle ne porte pas la main à son arme. Elle te laisse t’asseoir à deux pas d’elle, ce qui, venant d’elle, ressemble presque à une invitation.\n\n"; else t += "Elle te laisse t’asseoir à deux pas d’elle. Pas plus près. Elle mesure les distances comme d’autres comptent leurs prières.\n\n";
    if (gs.hasFlag('alistair_soeur_confiee') || gs.hasFlag('seraphine_curiosite')) t += "Tu penses aux pommes volées dans le verger du cloître, au dessin d’enfant au dos d’une lettre. Impossible de superposer cette petite fille à la femme qui te regarde comme une sentence.\n\n";
    t += "« L’Ordre m’a appris trois choses sur vous, » reprend-elle. « Que vous mentez en souriant. Que vous gelez ce que vous aimez. Et que je serai celle qui vous arrêtera. » Elle tourne enfin la tête. Elle a les yeux d’Alistair, sans rien de leur doute. « Pour l’instant, vous n’avez souri qu’une fois. »";
    return t.replace(/\n+$/, '');
  },
  choices: [
    { key: 'ESCRIME', text: "« Montre-moi comment l’Ordre compte m’arrêter. » Lui tendre une lame de givre.", intent: 'romance', target: "Séraphine", importance: 'major', response: "Elle se lève sans hésiter. Vous croisez le fer au bord du vide, en silence, jusqu’à ce que vos souffles fument dans le même nuage. Elle gagne la première passe. Tu gagnes la deuxième. À la troisième, elle s’arrête, la pointe à un doigt de ta gorge, et ne recule pas tout de suite. « Encore une fois, » dit-elle. Ce n’est pas une question.", journal: "Tu as croisé le fer avec Séraphine au bord du cratère. Elle a dit « encore ».", effects: [{ type: "ADD_GAUGE", target: "lien_seraphine", value: 2 }, { type: "SET_FLAG", target: "seraphine_etincelle" }, { type: "SET_FLAG", target: "_seraphine_coeur_1_vu" }], next: 'RETURN' },
    { key: 'CHAPELLE', condition: (gs) => gs.hasFlag('alistair_soeur_confiee') || gs.hasFlag('alistair_retrouvailles_choisi') || gs.hasFlag('seraphine_curiosite'), text: "« Alistair dit que tu chantais faux à la chapelle. Exprès. »", intent: 'tendresse', target: "Séraphine", importance: 'major', response: "Quelque chose se fend dans son visage, une fêlure qu’elle ne t’avait jamais montrée. « Il a dit ça ? » Un silence. « C’était pour qu’on me renvoie du chœur. Le chœur chantait pour le Trône vide. Je refusais de chanter pour une absence. » Elle détourne les yeux, furieuse d’en avoir trop dit. Puis, très bas : « Il chante juste, lui. C’est insupportable. »", journal: "Séraphine t’a confié pourquoi elle chantait faux : elle refusait de chanter pour un Trône vide.", effects: [{ type: "ADD_GAUGE", target: "lien_seraphine", value: 2 }, { type: "SET_FLAG", target: "seraphine_etincelle" }, { type: "SET_FLAG", target: "_seraphine_coeur_1_vu" }], next: 'RETURN' },
    { key: 'PRUDENCE', text: "« Alors je ne sourirai plus. Bonne garde, Inquisitrice. »", intent: 'distance', target: "Séraphine", importance: 'minor', response: "« Bonne nuit, Majesté. » Elle le dit comme on referme un registre. Tu viens de choisir la sécurité. Tu ne sais pas encore ce qu’elle t’a coûté.", journal: "Tu as gardé tes distances avec Séraphine.", effects: [{ type: "SET_FLAG", target: "seraphine_coeur_ferme" }, { type: "SET_FLAG", target: "_seraphine_coeur_1_vu" }], next: 'RETURN' }
  ]
},

'SERAPHINE_COEUR_2_REGISTRE': {
  sceneNumber: '3.SC2', chapter: 3, title: "Ce que l’Ordre ne compte pas", mood: 'intimate',
  image: "https://cdn.jsdelivr.net/gh/Sunstrader/Releases@main/Acte%203/Place_du_village_avec_statue_202606191345.jpeg", sprite: "https://cdn.jsdelivr.net/gh/Sunstrader/elenya-3d-assets@main/game-v54/sprites/seraphine.webp",
  getDynamicNarrative: (gs) => {
    let t = "";
    t += "Après les registres, Séraphine disparaît. Tu la retrouves derrière la chapelle du village, assise dans la neige, le dernier registre ouvert sur les genoux. Elle ne lit plus. Elle fixe une seule ligne.\n\n";
    t += "Tu reconnais l’écriture de l’Ordre, ronde et calme, celle qui a vendu tant d’enfants. *Leonhart, Séraphine. Quatre ans. Promise à la Lame Blanche. Destination : le Trône, au retour de la Reine.*\n\n";
    t += "« Ils ne m’ont pas élevée pour vous combattre, » dit-elle sans lever les yeux. « Ils m’ont élevée pour vous tuer. Toute ma vie était une date de livraison. »\n\n";
    if (gs.hasFlag('reve_O') || gs.hasFlag('reve_E') || gs.hasFlag('reve_poly')) t += "Elle rit, un son affreux. « Et mon frère ne parle plus d’une certaine nuit, près d’une sirène. Vous prenez tout ce qui porte notre nom, Majesté. Même ce que vous ne vouliez pas prendre. »\n\n";
    t += "Ses mains tremblent. Pas de froid : elle n’a jamais eu froid de sa vie. L’Ordre lui a appris à s’en passer, comme du reste.";
    return t.replace(/\n+$/, '');
  },
  choices: [
    { key: 'MAIN', text: "T’asseoir dans la neige à côté d’elle. Poser ta main sur la ligne, pour la cacher.", intent: 'tendresse', target: "Séraphine", importance: 'major', response: "Elle regarde ta main longtemps. Puis elle pose la sienne dessus, gant contre peau, et appuie, comme pour effacer l’encre. « Ne faites pas ça, » murmure-t-elle. Elle ne retire pas la main.", journal: "Tu as caché de ta main la ligne qui promettait Séraphine à ta mort.", effects: [{ type: "ADD_GAUGE", target: "lien_seraphine", value: 2 }, { type: "SET_FLAG", target: "seraphine_main" }, { type: "SET_FLAG", target: "_seraphine_coeur_2_vu" }], next: 'RETURN' },
    { key: 'DECHIRER', text: "Arracher la page et la lui tendre. « Ta vie ne leur appartient plus. Fais-en ce que tu veux. »", intent: 'liberte', target: "Séraphine", importance: 'major', response: "Elle plie la page en quatre, très soigneusement, et la glisse contre son cœur, sous l’armure. « Je la garde. Pour me souvenir de ce que j’ai failli être. » Puis, plus bas : « Merci. » Le mot a l’air de lui écorcher la gorge.", journal: "Tu as arraché du registre la page qui vendait Séraphine. Elle la garde contre son cœur.", effects: [{ type: "ADD_GAUGE", target: "lien_seraphine", value: 2 }, { type: "ADD_GAUGE", target: "volonte", value: 1 }, { type: "SET_FLAG", target: "seraphine_page_gardee" }, { type: "SET_FLAG", target: "_seraphine_coeur_2_vu" }], next: 'RETURN' },
    { key: 'LAISSER', text: "La laisser seule avec la page. Certaines blessures ne supportent pas de témoin.", intent: 'distance', target: "Séraphine", importance: 'minor', response: "Tu t’éloignes. Derrière toi, un bruit de papier, puis plus rien. Le lendemain, elle te salue d’un signe de tête impeccable. Le mur est revenu, et c’est toi qui l’as laissé se reconstruire.", journal: "Tu as laissé Séraphine seule avec ce que l’Ordre avait écrit d’elle.", effects: [{ type: "SET_FLAG", target: "seraphine_coeur_ferme" }, { type: "SET_FLAG", target: "_seraphine_coeur_2_vu" }], next: 'RETURN' }
  ]
},

'SERAPHINE_COEUR_3_LAME': {
  sceneNumber: '4.SC3', chapter: 4, title: "Le Gant ôté", mood: 'intimate',
  image: "https://cdn.jsdelivr.net/gh/Sunstrader/Releases@main/Acte%204/Int%C3%A9rieur_du_d%C3%B4me_(alc%C3%B4ves)_202606191345.jpeg", sprite: "https://cdn.jsdelivr.net/gh/Sunstrader/elenya-3d-assets@main/game-v54/sprites/seraphine.webp",
  getDynamicNarrative: (gs) => {
    let t = "";
    t += "Séraphine a suivi le dôme à distance pendant toute la montée, tache blanche dans la tempête. Quand le vent devient meurtrier, tu ouvres une brèche dans la glace. Elle hésite une seconde de trop, puis entre.\n\n";
    if (companionPresentO(gs) && companionPresentE(gs)) t += "Kaelen la regarde passer comme on regarde une lame qu’on n’a pas encore identifiée. Alistair, lui, ne regarde que toi. Il a compris quelque chose avant toi, peut-être.\n\n";
    t += "Plus tard, dans l’alcôve la plus éloignée, elle défait les sangles de son bras droit. Sous le brassard, attachée à même la peau, une dague d’os blanc, fine comme une aiguille, couverte de runes de scellement.\n\n";
    t += "« La Lame Blanche, » dit-elle. « On me l’a cousue au bras le jour de mes vœux. Elle ne sert qu’une fois, et contre une seule personne. Elle s’éveillera quand nous serons devant le Trône. » Elle te tend la dague, manche en avant. Sa main ne tremble plus. « Je ne sais pas si je pourrai m’empêcher de m’en servir. Alors je vous la donne. Ou je la garde, si vous me faites confiance. Choisissez. Moi, je n’y arrive pas. »";
    return t.replace(/\n+$/, '');
  },
  choices: [
    { key: 'CONFIANCE', text: "Refermer ses doigts sur le manche. « Garde-la. Je préfère ta main sur elle à n’importe quelle autre. »", intent: 'confiance', target: "Séraphine", importance: 'major', response: "Elle te fixe comme si tu venais de commettre la plus belle imprudence de ta vie. « Vous êtes folle. » Elle rattache la dague. En serrant la sangle, ses doigts frôlent les tiens, et y restent.", journal: "Tu as laissé la Lame Blanche à Séraphine, par confiance.", effects: [{ type: "ADD_GAUGE", target: "lien_seraphine", value: 2 }, { type: "SET_FLAG", target: "seraphine_lame_gardee" }, { type: "SET_FLAG", target: "_seraphine_coeur_3_vu" }], next: 'RETURN' },
    { key: 'PRENDRE', text: "Prendre la dague. « Pas parce que je te crains. Parce que tu n’as pas à porter ça seule. »", intent: 'confiance', target: "Séraphine", importance: 'major', response: "Elle laisse partir la dague comme on laisse partir un membre. Puis elle respire, profondément, pour la première fois depuis que tu la connais. « Personne ne m’a jamais rien pris pour m’alléger. »", journal: "Tu as pris la Lame Blanche pour que Séraphine ne la porte plus seule.", effects: [{ type: "ADD_GAUGE", target: "lien_seraphine", value: 1 }, { type: "SET_FLAG", target: "seraphine_lame_prise" }, { type: "SET_FLAG", target: "_seraphine_coeur_3_vu" }], next: 'RETURN' },
    { key: 'BAISER', condition: (gs) => (gs.getGauge('lien_seraphine') || 0) >= 4, text: "Ne pas regarder la dague. La regarder, elle. Lui demander, à voix basse, si tu peux l’embrasser.", intent: 'romance', target: "Séraphine", importance: 'major', response: "Elle ne répond pas avec des mots. Elle pose la dague entre vous, sur la pierre, comme une frontière qu’on décide d’enjamber, et c’est elle qui franchit les derniers centimètres. Le baiser a le goût du froid et de la cire de chapelle. Quand elle s’écarte, elle a l’air terrifiée, et vivante. « C’est ça, » souffle-t-elle. « C’est ça qu’ils avaient peur que je trouve. » Elle rattache la Lame sans te quitter des yeux.", journal: "Dans le dôme, Séraphine t’a embrassée, la Lame Blanche posée entre vous.", effects: [{ type: "ADD_GAUGE", target: "lien_seraphine", value: 2 }, { type: "SET_FLAG", target: "seraphine_baiser" }, { type: "SET_FLAG", target: "seraphine_lame_gardee" }, { type: "SET_FLAG", target: "_seraphine_coeur_3_vu" }, { type: "UNLOCK_ACHIEVEMENT", target: "ach_seraphine_baiser" }], next: 'RETURN' },
    { key: 'RECULER', text: "« Garde-la, et garde tes distances. Ce sera plus simple pour nous deux. »", intent: 'distance', target: "Séraphine", importance: 'minor', response: "« Plus simple, » répète-t-elle. Elle rattache la dague. « Oui. Vous avez raison. » Elle a l’air de croire que tu viens de la sauver. Tu as l’impression du contraire.", journal: "Tu as demandé à Séraphine de garder la Lame, et ses distances.", effects: [{ type: "SET_FLAG", target: "seraphine_coeur_ferme" }, { type: "SET_FLAG", target: "seraphine_lame_gardee" }, { type: "SET_FLAG", target: "_seraphine_coeur_3_vu" }], next: 'RETURN' }
  ]
},

'SERAPHINE_COEUR_4_FRERE': {
  sceneNumber: '4.SC4', chapter: 4, title: "Le Frère", mood: 'tension',
  image: "https://cdn.jsdelivr.net/gh/Sunstrader/Releases@main/Acte%203/Cr%C3%AAte_neigeuse_202606191345.jpeg", sprite: "https://cdn.jsdelivr.net/gh/Sunstrader/elenya-3d-assets@main/game-v54/sprites/seraphine.webp",
  getDynamicNarrative: (gs) => {
    let t = "";
    t += "Au pied des portes d’obsidienne, Alistair te prend à part. Il ne s’embarrasse pas de préambule ; il ne l’a jamais fait quand il s’agissait de sa sœur.\n\n";
    t += "« Je vous ai vues, dans le dôme. » Sa voix est très calme. C’est sa voix d’avant les batailles.\n\n";
    if (gs.hasFlag('interet_romantique_E') || gs.hasFlag('romance_reelle_E') || (gs.getGauge('lien_E') || 0) >= 8) t += "« Je ne vais pas te demander ce que j’étais pour toi. Je crois que je le sais. » Il serre l’emblème si fort que le métal lui marque la paume. « Je vais seulement te demander de ne pas lui faire ce que tu m’as fait. Elle n’a pas appris à guérir. On ne lui a appris qu’à obéir. »\n\n"; else t += "« Elle n’a jamais rien eu à elle. Pas un jouet, pas une chambre, pas un nom qui ne soit pas déjà promis. Si tu es une chose de plus qu’on lui prend, je ne te le pardonnerai pas. Si tu es la première chose qu’elle choisit… » Il ne finit pas. Il n’ose pas.\n\n";
    if (gs.hasFlag('reve_O') || gs.hasFlag('reve_E')) t += "Entre vous, il y a aussi la nuit de la sirène, et tout ce qu’elle a déplacé. Il ne la nomme pas. Il n’en a pas besoin.\n\n";
    if (companionPresentO(gs)) t += "Plus loin, Kaelen fait mine d’affûter une dague. Il écoute tout. Il ne dit rien, et c’est sans doute la chose la plus gentille qu’il ait jamais faite.\n\n";
    t += "Derrière lui, Séraphine attend, assez loin pour ne pas entendre, assez près pour voir ton visage. Elle sait exactement de quoi vous parlez.";
    return t.replace(/\n+$/, '');
  },
  choices: [
    { key: 'VERITE', text: "« Je l’aime, Alistair. Je ne sais pas encore ce que ça vaut. Mais je ne mentirai ni à elle ni à toi. »", intent: 'confiance', target: "Alistair", importance: 'major', response: "Il ferme les yeux. Quand il les rouvre, il y a du chagrin, et autre chose qui ressemble à du soulagement. « Alors dis-le-lui à elle avant de le dire à Dieu. Elle a attendu plus longtemps que lui. » Il s’écarte pour te laisser passer.", journal: "Tu as dit à Alistair que tu aimais sa sœur.", effects: [{ type: "ADD_GAUGE", target: "lien_seraphine", value: 1 }, { type: "ADD_GAUGE", target: "lien_E", value: 1 }, { type: "SET_FLAG", target: "alistair_sait_seraphine" }, { type: "SET_FLAG", target: "_seraphine_coeur_4_vu" }], next: 'RETURN' },
    { key: 'SECRET', text: "« Ce qui s’est passé dans le dôme ne regarde que nous. »", intent: 'distance', target: "Alistair", importance: 'major', response: "« Tout ce qui la regarde me regarde, depuis qu’elle a quatre ans. » Il te dévisage longtemps. « Très bien. Garde ton secret. Mais dans notre famille, les secrets finissent toujours dans un registre. » Plus loin, Séraphine baisse les yeux. Elle a compris que tu ne l’as pas revendiquée.", journal: "Tu as refusé de parler de Séraphine à son frère.", effects: [{ type: "ADD_GAUGE", target: "lien_seraphine", value: -1 }, { type: "ADD_GAUGE", target: "lien_E", value: -2 }, { type: "SET_FLAG", target: "seraphine_secret" }, { type: "SET_FLAG", target: "_seraphine_coeur_4_vu" }], next: 'RETURN' }
  ]
},

'SERAPHINE_COEUR_5_EVEIL': {
  sceneNumber: '4.SC5', chapter: 4, title: "La Lame s’éveille", mood: 'tension',
  image: "https://cdn.jsdelivr.net/gh/Sunstrader/elenya-3d-assets@main/game-v54/backgrounds/trone-ebene.webp", sprite: "https://cdn.jsdelivr.net/gh/Sunstrader/elenya-3d-assets@main/game-v54/sprites/seraphine.webp",
  getDynamicNarrative: (gs) => {
    let t = "";
    t += "Dans le corridor d’obsidienne, la Lame Blanche se met à chanter.\n\n";
    if (gs.hasFlag('seraphine_lame_prise')) t += "Tu la portes à ta ceinture, et c’est contre ta hanche qu’elle vibre, doucement d’abord, puis comme un cœur affolé. Elle ne t’obéit pas. Elle cherche une autre main. À trois pas de toi, Séraphine s’est figée, le bras droit tendu malgré elle vers l’arme, les dents serrées.\n\n"; else t += "Sous le brassard de Séraphine, la dague vibre, doucement d’abord, puis comme un cœur affolé. Séraphine s’est arrêtée net. Son bras droit se lève tout seul, centimètre par centimètre, et ses yeux te supplient de ne pas comprendre ce que tu comprends.\n\n";
    t += "« Elle me demande de le faire, » dit-elle. Sa voix se casse. « Trois siècles de prières dans une aiguille. Elle sait que vous êtes là. Elle sait que je… » Elle ne finit pas. « Si je cède, ce sera rapide. Ils me l’ont promis quand j’avais quatre ans. »\n\n";
    if ((gs.getGauge('possession') || 0) >= 10) t += "Et sous ta peau, quelque chose répond à la Lame. Le givre de la possession, celui que tu as nourri, se tend vers elle comme vers une ennemie familière. Tu comprends, glacée, que la Lame ne cherche pas Elenya. Elle cherche la tyranne. Et elle la trouve.\n\n";
    t += "Au bout du corridor, le Trône attend. Il a tout son temps.";
    return t.replace(/\n+$/, '');
  },
  choices: [
    { key: 'TENIR', text: "Prendre son poignet à deux mains. « Regarde-moi. Pas la Lame. Moi. »", intent: 'confiance', target: "Séraphine", importance: 'major', response: "La Lame tire, Séraphine tire contre elle, et pendant une seconde atroce tu ne sais pas qui va gagner. Puis son bras retombe contre ta poitrine. Elle tremble. Tu ne lâches pas. « Encore une fois, » souffle-t-elle, comme au bord du cratère, et cette fois c’est une prière.", journal: "Dans le corridor, tu as tenu le bras de Séraphine contre l’appel de la Lame.", effects: [{ type: "ADD_GAUGE", target: "lien_seraphine", value: 1 }, { type: "SET_FLAG", target: "seraphine_tenue" }, { type: "SET_FLAG", target: "_seraphine_coeur_5_vu" }], next: 'RETURN' },
    { key: 'OFFRIR', text: "Ne pas te défendre. « Si tu dois le faire, fais-le en me regardant. »", intent: 'sacrifice', target: "Séraphine", importance: 'critical', response: "Elle hurle. Pas de douleur : de refus. La pointe s’arrête contre ta clavicule, perce la peau, une goutte de sang gèle aussitôt. Puis Séraphine arrache la Lame de son bras, sangles et peau avec, et la brise contre le mur d’obsidienne. Elle saigne. Toi aussi. Aucune de vous ne recule. « Plus jamais, » dit-elle. « Plus jamais vous ne me demanderez ça. »", journal: "Tu t’es offerte à la Lame Blanche. Séraphine l’a brisée plutôt que de s’en servir.", irreversible: true, effects: [{ type: "ADD_GAUGE", target: "lien_seraphine", value: 2 }, { type: "ADD_GAUGE", target: "volonte", value: 1 }, { type: "ADD_GAUGE", target: "possession", value: -3 }, { type: "SET_FLAG", target: "seraphine_lame_brisee" }, { type: "SET_FLAG", target: "_seraphine_coeur_5_vu" }], next: 'RETURN' }
  ]
},

'FIN_SERAPHINE_COEUR': {
  sceneNumber: 'FIN_SERAPHINE_COEUR', chapter: 4, title: "La Lampe et le Givre", mood: 'end',
  image: "https://cdn.jsdelivr.net/gh/Sunstrader/elenya-3d-assets@main/game-v54/backgrounds/trone-ebene.webp", sprite: "https://cdn.jsdelivr.net/gh/Sunstrader/elenya-3d-assets@main/game-v54/sprites/seraphine.webp",
  isEnd: true, postEnding: true, achievementId: 'ach_fin_seraphine_coeur',
  getDynamicNarrative: (gs) => {
    let t = "";
    t += "Tu ne t’assieds pas sur le Trône. Tu poses la Larme d’Ébène sur l’accoudoir, comme on rend une clé, et tu te tournes vers la seule personne restée debout à côté de toi.\n\n";
    if (gs.hasFlag('seraphine_lame_brisee')) t += "Séraphine a le bras bandé de lin blanc, là où la Lame était cousue. Elle refuse qu’on efface la cicatrice. « Je veux me souvenir qu’on peut arracher ce qu’on vous a cousu dessus. »\n\n";
    if (!gs.hasFlag('seraphine_lame_brisee') && gs.hasFlag('seraphine_lame_prise')) t += "La Lame Blanche repose dans un coffret que vous avez scellé ensemble, à deux mains. Vous avez jeté la clé dans le lac, le premier jour du dégel.\n\n";
    if (!gs.hasFlag('seraphine_lame_brisee') && !gs.hasFlag('seraphine_lame_prise')) t += "La Lame Blanche dort sous son brassard. Elle ne s’éveillera plus : tu le sais, parce que chaque nuit, Séraphine pose ta main dessus avant de s’endormir, pour vérifier.\n\n";
    t += "L’Ordre réclame sa fille. Elle répond par une lettre de trois lignes que les archivistes recopieront pendant des siècles sans comprendre pourquoi elle est si courte : *Je ne suis promise à personne. Je me suis donnée à quelqu’un. Ce n’est pas la même chose.*\n\n";
    if (gs.hasFlag('alistair_mort')) t += "Alistair n’est pas là pour le voir. Certaines nuits, Séraphine se réveille en criant son nom, et tu la tiens jusqu’à ce que le nom redevienne un souvenir au lieu d’une blessure. Vous apprenez à porter cette absence à deux.\n\n";
    if (alistairLibre59_(gs) && gs.hasFlag('alistair_sait_seraphine')) t += "Alistair vous unit lui-même, dans une chapelle sans Ordre, avec un psaume qu’il a réécrit pour l’occasion. Il le chante juste. Séraphine, à côté de toi, chante faux. Exprès. Tu ne l’as jamais autant aimée.\n\n";
    if (alistairLibre59_(gs) && gs.hasFlag('seraphine_secret')) t += "Alistair met un an à vous adresser de nouveau la parole. Le secret que tu as voulu garder a fini, comme il l’avait prédit, dans un registre : celui des rumeurs de cour. Le jour où il revient, il ne dit rien. Il s’assoit à votre table, et Séraphine pleure pour la première fois depuis ses quatre ans.\n\n";
    if (alistairLibre59_(gs) && !gs.hasFlag('alistair_sait_seraphine') && !gs.hasFlag('seraphine_secret')) t += "Alistair vient vous voir au premier printemps, sans insigne, et regarde longtemps sa sœur rire. « Je ne savais pas qu’elle savait faire ça, » te dit-il. Toi non plus.\n\n";
    if (!gs.hasFlag('alistair_mort') && !alistairLibre59_(gs)) t += "Alistair n’est pas là. Séraphine écrit une lettre par saison à un frère qui ne répond pas, et elle les garde toutes, cachetées, dans le tiroir de la lampe.\n\n";
    if (companionPresentO(gs)) t += "Kaelen, lui, s’est nommé garde du corps de la reine consort. « Quelqu’un doit protéger l’Inquisitrice de toi, » dit-il. Il ment très bien. Il veille sur vous deux.\n\n";
    t += "Le Nord ne dégèle pas en un jour. Mais il y a désormais, dans la plus haute tour, une lampe allumée toute la nuit, et deux silhouettes qui se disputent pour savoir qui la tiendra.\n\nOn t’avait promis qu’une femme viendrait te sceller. Elle est venue. Elle est restée.";
    return t.replace(/\n+$/, '');
  },
  choices: [{ key: 'EPILOGUE', text: "Voir ce qui reste après le Trône.", next: 'ACTE5_01_LENDEMAIN' }]
},

'FIN_SERAPHINE_LAME': {
  sceneNumber: 'FIN_SERAPHINE_LAME', chapter: 4, title: "Le Sceau Blanc", mood: 'end',
  image: "https://cdn.jsdelivr.net/gh/Sunstrader/elenya-3d-assets@main/game-v54/backgrounds/trone-ebene.webp", sprite: "https://cdn.jsdelivr.net/gh/Sunstrader/elenya-3d-assets@main/game-v54/sprites/seraphine.webp",
  isEnd: true, achievementId: 'ach_fin_seraphine_lame',
  getDynamicNarrative: (gs) => {
    let t = "";
    t += "Devant le Trône, la Lame Blanche se tait d’un coup. Le silence est pire que le chant.\n\n";
    t += "Séraphine marche vers toi. Elle ne tremble plus. Tu comprends avant qu’elle parle : elle a vu ce que tu es devenue. Le givre qui monte de tes pas n’est plus un bouclier. C’est une couronne, et elle a des dents.\n\n";
    t += "« Je vous aime, » dit-elle. C’est la première fois qu’elle le dit, et c’est la dernière. « C’est pour ça que ce sera moi. »\n\n";
    t += "Tu pourrais l’arrêter. Tu as le pouvoir de geler son sang avant qu’elle fasse un pas de plus. Tu ne le fais pas. Peut-être parce qu’une part de toi attendait cette main depuis la fresque. Peut-être parce que c’est la seule personne à qui tu aies jamais permis de te dire non.\n\n";
    t += "La Lame entre sans douleur, juste sous le cœur. Séraphine t’embrasse en même temps, pour que tu ne sois pas seule au moment où le froid change de camp. La glace se referme sur vous deux : sur toi, qui t’endors, et sur elle, qui refuse de lâcher ta main pendant que le sceau prend.\n\n";
    if (alistairLibre59_(gs)) t += "Quand Alistair trouve le bloc, des jours plus tard, il y voit deux femmes enlacées dans le cristal, les yeux clos. L’une porte une couronne. L’autre a le bras nu, là où la Lame était cousue. Il ne prie pas. Il s’assoit contre la glace et attend, comme elle l’attendait autrefois à travers une porte.\n\n";
    t += "L’Ordre proclame la victoire de la Lame Blanche. Il n’ose jamais dire à voix haute ce que tout le monde voit à travers la glace : elle ne t’a pas vaincue. Elle t’a gardée.\n\nQuelque part, très loin sous le givre, quelqu’un compte encore les jours. Pas ceux de ta mort. Ceux de votre réveil.";
    return t.replace(/\n+$/, '');
  },
  choices: []
},

'AVERTISSEMENT_SURCHARGE': {
  sceneNumber: 'SURCHARGE_SURSIS', chapter: 3, title: "Le Givre sous la Peau", mood: 'tension',
  image: "https://cdn.jsdelivr.net/gh/Sunstrader/Releases@main/Acte%203/Marche_dans_la_temp%C3%AAte_202606191345.jpeg",
  getDynamicNarrative: (gs) => {
    let t = "";
    t += "Tes doigts ne se déplient plus. Le givre a gagné tes ongles, puis la peau de tes poignets, en fines écailles qui crissent quand tu bouges. Chaque battement de cœur pousse un peu plus de froid dans tes veines.\n\n";
    t += "Tu le sais avec une certitude de bête : encore quelques excès, et la magie ne t’obéira plus. Elle te remplacera.\n\n";
    if (companionPresentO(gs)) t += "Kaelen a vu. Pour une fois, il ne plaisante pas. « Combien de temps ? » Tu ne réponds pas.\n\n";
    if (companionPresentE(gs)) t += "Alistair a déjà la main sur son médaillon, prêt à prier, ou à te sceller. Il ne sait pas lequel des deux il redoute le plus.\n\n";
    t += "Fen se plaque contre ta gorge, brûlant. Il attend que tu choisisses ce que tu vas sacrifier pour rester toi.";
    return t.replace(/\n+$/, '');
  },
  choices: [
    { key: 'RELACHER', text: "Relâcher le givre dans le sol, d’un coup. Tant pis pour ce qu’il emportera.", response: "Tu t’agenouilles et ouvres les mains. Le froid quitte ton corps comme une marée, et la terre gèle sur dix pas à la ronde. Des oiseaux tombent des branches. Tu respires. Tu as payé, et quelque chose d’autre a payé avec toi.", journal: "Au bord de la surcharge, tu as relâché le givre dans la terre.", effects: [{ type: "ADD_GAUGE", target: "instabilite", value: -18 }, { type: "ADD_GAUGE", target: "volonte", value: -1 }, { type: "SET_FLAG", target: "surcharge_relachee" }, { type: "SET_FLAG", target: "_surcharge_sursis_vu" }], next: 'RETURN' },
    { key: 'FEN', text: "Laisser Fen boire le surplus. Il a soif, tu le sens.", response: "Fen mord. Le froid reflue vers lui en une longue gorgée qui te laisse étourdie. Quand il relâche ta peau, ses yeux brillent d’une lueur qui n’a rien d’animal, et il ne te regarde pas. Tu as l’impression d’avoir nourri quelque chose. Tu ne sais pas quoi.", journal: "Au bord de la surcharge, tu as laissé Fen boire ton givre.", effects: [{ type: "ADD_GAUGE", target: "instabilite", value: -14 }, { type: "ADD_GAUGE", target: "memoire_kalthar", value: 1 }, { type: "ADD_GAUGE", target: "possession", value: 1 }, { type: "SET_FLAG", target: "fen_a_bu_givre" }, { type: "SET_FLAG", target: "_surcharge_sursis_vu" }], next: 'RETURN' },
    { key: 'AIDE', condition: (gs) => companionPresentO(gs) || companionPresentE(gs), text: "Demander de l’aide. À voix haute. Pour une fois.", response: "Les mots te coûtent plus que le givre. Mais des mains se posent sur tes poignets, chaudes, maladroites, et le froid se partage entre plusieurs corps au lieu de te dévorer seule. Aucun de vous trois ne nomme ce que cela veut dire. Tout le monde s’en souviendra.", journal: "Au bord de la surcharge, tu as demandé de l’aide.", effects: [{ type: "ADD_GAUGE", target: "instabilite", value: -12 }, { type: "ADD_GAUGE", target: "lien_O", value: 1 }, { type: "ADD_GAUGE", target: "lien_E", value: 1 }, { type: "SET_FLAG", target: "surcharge_partagee" }, { type: "SET_FLAG", target: "_surcharge_sursis_vu" }], next: 'RETURN' },
    { key: 'IGNORER', text: "Serrer les poings. Tu es la Reine. Le givre obéira. (Il ne te préviendra plus qu’une fois.)", response: "Le givre n’obéit pas. Il attend. Tu viens de lui dire que tu ne l’écouteras pas la prochaine fois non plus.", journal: "Tu as ignoré l’avertissement du givre.", effects: [{ type: "SET_FLAG", target: "surcharge_ignoree" }, { type: "SET_FLAG", target: "_surcharge_sursis_vu" }], next: 'RETURN' }
  ]
},

// 60 (playtest V59 P0 1-3) : la mort différée n’arrive plus sur « Suivant ». Au seuil fatal, une scène d’agonie
// laisse un vrai choix : se sauver en payant, ou céder. « Reprendre avant la chute » revient donc toujours à un choix qui survit.
'AGONIE_SURCHARGE': {
  sceneNumber: 'SURCHARGE_AGONIE', chapter: 3, title: "Le Givre au bord", mood: 'danger',
  image: "https://cdn.jsdelivr.net/gh/Sunstrader/Releases@main/Acte%203/Marche_dans_la_temp%C3%AAte_202606191345.jpeg",
  getDynamicNarrative: (gs) => {
    let t = "Le givre a atteint ta gorge. Tu ne sens plus tes mains. Ce qui pense encore en toi pense lentement, comme sous la glace d’un lac.\n\n";
    t += "Il ne reste qu’un geste possible avant que la magie prenne ta place : tout rendre au sol, maintenant, et payer ce que cela coûtera.\n\n";
    if (companionPresentO(gs)) t += "Kaelen a posé la main sur ton bras, malgré la morsure. Il ne dit rien. Il ne lâche pas.\n\n";
    if (companionPresentE(gs)) t += "Alistair a cessé de prier. Il te regarde, et attend que tu choisisses de rester.\n\n";
    t += "Fen gronde contre ta nuque.";
    return t;
  },
  choices: [
    { key: 'RENDRE', text: "Tout rendre au sol. Rester toi, quoi qu’il en coûte. (❄ −24, volonté −2)", response: "Tu frappes la terre des deux paumes. Le froid sort de toi en hurlant et fend le sol sur vingt pas. Quand tu rouvres les yeux, tu trembles. Tu es là.", effects: [{ type: 'ADD_GAUGE', target: 'instabilite', value: -24 }, { type: 'ADD_GAUGE', target: 'volonte', value: -2 }, { type: 'SET_FLAG', target: 'surcharge_agonie_rendue_60' }], next: 'RETURN' },
    { key: 'CEDER', text: "Laisser le givre finir ce qu’il a commencé. (Mort)", response: "Tu fermes les yeux. Le froid ne te fait plus mal. C’est ce qui t’effraie le plus, puis plus rien ne t’effraie.", effects: [], next: 'GAME_OVER_SURCHARGE' }
  ]
},
'AGONIE_POSSESSION': {
  sceneNumber: 'POSSESSION_AGONIE', chapter: 4, title: "La Main fermée", mood: 'danger',
  image: "https://cdn.jsdelivr.net/gh/Sunstrader/elenya-3d-assets@main/game-v54/backgrounds/royaume-souvenirs.webp",
  // 60.1 : la possession critique ouvre, comme le venin et la surcharge, une dernière seconde à deux choix.
  getDynamicNarrative: (gs) => {
    let t = "Ta main s’est refermée sur tout ce qui pouvait partir : un nom, une manche, un souffle. Le givre serre pour toi, et il ne sait plus s’arrêter.\n\n";
    t += "Il te reste une seconde pour ouvrir les doigts. Ce que tu lâcheras ne reviendra pas tout de suite.\n\n";
    if (companionPresentO(gs)) t += "Kaelen ne recule pas. Il attend que tu le laisses partir pour pouvoir rester.\n\n";
    if (companionPresentE(gs)) t += "Alistair pose sa paume ouverte à côté de la tienne, sans la prendre.\n\n";
    t += "Fen, ou la mémoire de son poids, s’éloigne d’un pas. Pour te montrer comment on fait.";
    return t;
  },
  choices: [
    { key: 'OUVRIR', text: "Ouvrir la main. Laisser partir ce qui n’est pas à toi. (emprise −10, volonté −2)", response: "Tes doigts se desserrent un à un. Un nom s’envole, que tu ne retiendras plus. Tu respires, et l’air ne t’appartient pas : il te traverse.", effects: [{ type: 'ADD_GAUGE', target: 'possession', value: -10 }, { type: 'ADD_GAUGE', target: 'volonte', value: -2 }, { type: 'SET_FLAG', target: 'possession_agonie_ouverte_601' }], next: 'RETURN' },
    { key: 'CEDER', text: "Serrer jusqu’au bout. (Mort)", response: "Tu serres. Le monde entier tient dans ton poing, et ton poing n’est plus à toi.", effects: [], next: 'GAME_OVER_POSSESSION' }
  ]
},
'AGONIE_VENIN': {
  sceneNumber: 'VENIN_AGONIE', chapter: 3, title: "La Veine noire", mood: 'danger',
  image: "https://cdn.jsdelivr.net/gh/Sunstrader/elenya-3d-assets@main/game-v54/backgrounds/foret-noire.webp",
  getDynamicNarrative: (gs) => {
    let t = "La veine noire touche ton cœur. Tu le sens battre à contretemps, une fois sur deux étranger.\n\n";
    t += "Tu peux encore geler la blessure jusqu’à l’os. Cela laissera une trace que rien ne fera fondre, et une part de ta volonté avec elle.\n\n";
    t += "Fen pousse son museau contre ta paume, là où le venin est entré.";
    return t;
  },
  choices: [
    { key: 'GELER', text: "Geler la veine jusqu’à l’os. Gagner deux jours. (volonté −3)", response: "La douleur est blanche, puis plus rien. Le venin s’arrête sous la glace. Pas pour toujours. Assez pour arriver.", effects: [{ type: 'ADD_TIMER', target: 'venin', value: 2 }, { type: 'ADD_GAUGE', target: 'volonte', value: -3 }, { type: 'SET_FLAG', target: 'venin_cauterise' }, { type: 'SET_FLAG', target: 'venin_agonie_gelee_60' }], next: 'RETURN' },
    { key: 'CEDER', text: "Laisser le venin gagner. (Mort)", response: "Tu t’assois dans la neige. Aucune voix ne te demande de te relever. C’est la première chose douce depuis longtemps.", effects: [], next: 'GAME_OVER_VENIN' }
  ]
},

'SIRENE_DERNIER_SOUFFLE': {
  sceneNumber: 'SIRENE_SOUFFLE', chapter: 3, title: "Le dernier souffle", mood: 'danger',
  image: "https://cdn.jsdelivr.net/gh/Sunstrader/Releases@main/Acte%203/Marche_dans_la_temp%C3%AAte_202606191345.jpeg",
  getDynamicNarrative: (gs) => "Tu fermes les yeux. Le chant entre, doux, très doux, et commence à défaire ce que tu es, nœud après nœud.\n\nIl reste un nœud. Un seul. Celui qui sait encore ton nom.\n\nFen mord ton poignet jusqu’au sang.",
  choices: [
    { key: 'LUTTER', text: "Serrer ce dernier nœud. Rouvrir les yeux.", response: "Tu rouvres les yeux. La mélodie recule d’un pas, vexée. Elle n’a pas fini avec toi.", effects: [{ type: 'ADD_GAUGE', target: 'volonte', value: -1 }, { type: 'SET_FLAG', target: 'sirene_dernier_souffle_60' }], next: 'ACTE3_04_ENVOUTEMENT' },
    // 60.1 (audit : game over 39 %) : un lien tenu offre une troisième issue, sans coût de volonté. Céder reste possible.
    { key: 'MAIN_TENDUE', condition: (gs) => (gs.hasFlag('avec_ombre') && (gs.getGauge('lien_O') || 0) >= 2) || (gs.hasFlag('avec_eclaireur') && (gs.getGauge('lien_E') || 0) >= 2), text: "Chercher, à tâtons, la main de celui qui est resté près de toi.", response: "Une main trouve la tienne et serre, fort, jusqu’à ce que la mélodie ait honte d’elle-même. Tu rouvres les yeux sur un visage qui ne te lâche pas.", effects: [{ type: 'SET_FLAG', target: 'sirene_dernier_souffle_60' }, { type: 'SET_FLAG', target: 'sirene_main_tendue_601' }], next: 'ACTE3_04_ENVOUTEMENT' },
    { key: 'CEDER', text: "Le laisser se défaire. (Mort)", response: "Le dernier nœud glisse. C’est très doux. C’est tout.", effects: [{ type: 'SET_FLAG', target: 'sirene_dernier_souffle_60' }], next: 'GAME_OVER_SIRENE' }
  ]
},
'SCEAU_DERNIER_SOUFFLE': {
  sceneNumber: 'SCEAU_SOUFFLE', chapter: 4, title: "Sous le Sceau", mood: 'danger',
  image: "https://cdn.jsdelivr.net/gh/Sunstrader/elenya-3d-assets@main/game-v54/backgrounds/trone-ebene.webp",
  getDynamicNarrative: (gs) => "Tu baisses les bras. Le Sceau descend, lent comme une neige qui sait qu’on ne l’arrêtera pas.\n\nÀ un doigt de ta peau, il hésite. Il attend que tu le veuilles vraiment.",
  choices: [
    { key: 'RELEVER', text: "Relever les bras. Encore une fois.", response: "Le Sceau s’arrête. Tu as gagné un instant, et rien de plus.", effects: [{ type: 'ADD_GAUGE', target: 'volonte', value: -1 }, { type: 'SET_FLAG', target: 'sceau_dernier_souffle_60' }], next: 'ACTE4_06_MASQUE_TOMBE_2' },
    { key: 'TENUE', condition: (gs) => (gs.hasFlag('avec_ombre') && companionPresentO(gs)) || (gs.hasFlag('avec_eclaireur') && companionPresentE(gs)), text: "Laisser quelqu’un d’autre soutenir tes bras, pour une fois.", response: "Deux mains sous tes coudes, sans un mot. Le Sceau recule devant ce qu’il ne sait pas compter : un poids partagé.", effects: [{ type: 'SET_FLAG', target: 'sceau_dernier_souffle_60' }, { type: 'SET_FLAG', target: 'sceau_tenue_601' }], next: 'ACTE4_06_MASQUE_TOMBE_2' },
    { key: 'CEDER', text: "Le laisser se poser. (Fin du voyage)", response: "Le Sceau se pose. Il est froid, d’un froid qui n’est pas le tien.", effects: [], next: 'GAME_OVER_SCELLEE' }
  ]
},
'ALISTAIR_LETTRE_SOEUR': {
  sceneNumber: '2.08S', chapter: 2, title: "Le Sceau Blanc", mood: 'intimate',
  image: "https://cdn.jsdelivr.net/gh/Sunstrader/Releases@main/Acte%201/Bivouac_aube_alistair.jpeg", sprite: "https://cdn.jsdelivr.net/gh/Sunstrader/Releases@main/Sprite%20Alistair%20bg/SPRITE_ALISTAIR_DEBOUT_FACE_202606231808.png",
  getDynamicNarrative: (gs) => {
    let t = "Sur la rive nord, pendant que le feu prend, tu trouves Alistair assis sur une pierre, une lettre ouverte sur les genoux. Elle a voyagé avec lui depuis l’auberge. Le cachet est blanc, intact d’un côté, brisé de l’autre — le sceau de l’Ordre, posé par une main qui appuie trop fort.\n\n";
    t += "Il ne la cache pas. Il la tourne vers toi, comme on montre une blessure.\n\n";
    t += "*Frère. L’Ordre compte les jours. Reviens avant la fonte, ou je viendrai te chercher moi-même. Ne m’oblige pas à choisir entre toi et ce que nous avons juré. — S.*\n\n";
    t += "« Séraphine, » dit-il. « Ma sœur. Elle a toujours été la meilleure de nous deux. C’est bien ce qui m’effraie. »\n\n";
    t += "Il approche la lettre des flammes, s’arrête, et la replie dans sa manche.";
    return t;
  },
  choices: [
    { key: 'DEMANDER', text: "« Parle-moi d’elle. Pas de l’Ordre. D’elle. »", intent: 'confiance', target: 'Alistair', importance: 'minor',
      response: "Il sourit malgré lui. « Elle volait des pommes dans le verger du cloître et me laissait porter la punition. Puis elle venait me lire des psaumes à travers la porte jusqu’à ce que je m’endorme. » Le sourire s’éteint. « L’Ordre lui a appris à aimer comme on garde une prison. »",
      journal: "Alistair t’a parlé de sa sœur, Séraphine, et du délai que l’Ordre lui a donné.",
      effects: [{ type: "SET_FLAG", target: "seraphine_lettre_vue" }, { type: "SET_FLAG", target: "alistair_soeur_confiee" }, { type: "ADD_GAUGE", target: "lien_E", value: 1 }], next: 'RETURN' },
    { key: 'RELIRE', text: "Lui demander si tu peux lire la lettre toi-même.", intent: 'confiance', target: 'Séraphine', importance: 'minor',
      response: "Il hésite, puis te la tend. L’écriture est droite, nerveuse, appuyée au point de trouer le papier. Au dos, dans un coin, presque effacé, un dessin d’enfant : deux silhouettes et une pomme. Elle ne l’a pas gratté. Tu te demandes quel genre de femme menace son frère au recto et garde ce dessin au verso.",
      journal: "Tu as lu la lettre de Séraphine. Au dos, un dessin d’enfant qu’elle n’a jamais effacé.",
      effects: [{ type: "SET_FLAG", target: "seraphine_lettre_vue" }, { type: "SET_FLAG", target: "seraphine_curiosite" }, { type: "ADD_GAUGE", target: "lien_seraphine", value: 1 }, { type: "ADD_GAUGE", target: "lien_E", value: 1 }], next: 'RETURN' },
    { key: 'SILENCE', text: "Ne rien demander. Rester assise à côté de lui jusqu’à ce que le feu baisse.", intent: 'distance', target: 'Alistair', importance: 'minor',
      response: "Vous regardez le feu ensemble. Au bout d’un long moment, il murmure : « Merci de ne pas en faire une confession. » Il garde la lettre. Tu sais qu’elle reviendra.",
      journal: "Tu as laissé Alistair garder pour lui la lettre de sa sœur.",
      effects: [{ type: "SET_FLAG", target: "seraphine_lettre_vue" }, { type: "ADD_GAUGE", target: "lien_E", value: 1 }, { type: "ADD_GAUGE", target: "volonte", value: 1 }], next: 'RETURN' }
  ]
},

'TRIO_NUIT_DOME': {
  sceneNumber: '4.02T', chapter: 4, title: "Trois Alcôves, une Question", mood: 'intimate',
  image: "https://cdn.jsdelivr.net/gh/Sunstrader/Releases@main/Acte%204/Int%C3%A9rieur_du_d%C3%B4me_(alc%C3%B4ves)_202606191345.jpeg", spriteLeft: "https://cdn.jsdelivr.net/gh/Sunstrader/Releases@main/Sprites%20-%20Kaelen%20bg/SPRITE_KAELEN_DEBOUT_PROFIL_202606231737-removebg-preview.png", spriteRight: "https://cdn.jsdelivr.net/gh/Sunstrader/Releases@main/Sprite%20Alistair%20bg/SPRITE_ALISTAIR_DEBOUT_FACE_202606231808.png",
  getDynamicNarrative: (gs) => {
    let t = "Les trois alcôves du dôme sont creusées côte à côte. Personne n’entre dans la sienne.\n\n";
    t += "Kaelen s’adosse à la paroi, bras croisés. Alistair reste debout, comme s’il attendait qu’on lui assigne une place. Tu comprends qu’ils attendent tous les deux la même chose : que tu choisisses, une fois de plus, et qu’on en finisse.\n\n";
    t += "Tu ne choisis pas. Tu t’assieds par terre, au milieu.\n\n";
    t += "« Je ne vais pas vous départager, » dis-tu. « Je ne vais pas non plus vous demander de vous partager. Je vous pose une question, à tous les deux, et vous avez le droit de répondre non. »\n\n";
    if (gs.hasFlag('reve_poly')) t += "Ils se souviennent d’une autre nuit à trois. Celle-là, tu ne l’as pas demandée. Kaelen ne s’assoit qu’après avoir vu tes mains ouvertes, et Alistair attend que tu le regardes avant de bouger.\n\n";
    if (gs.hasFlag('reve_O') || gs.hasFlag('reve_E')) t += "On ne parle pas de la nuit de la sirène. Elle est là quand même, assise entre vous trois : la nuit où tu as tendu la main vers l’un et où l’autre s’est réveillé à sa place. Cette fois, tu veux que chacun sache exactement à qui tu parles.\n\n";
    t += "Le silence dure. Puis Kaelen s’assoit à ta gauche. Alistair, après une hésitation qui ressemble à une prière, s’assoit à ta droite.";
    return t;
  },
  choices: [
    { key: 'PROPOSER', condition: (gs) => romanceAvailableO(gs) && romanceAvailableE(gs) && !gs.hasFlag('go_poly_domination') && !dominationRomance6032_(gs) /* 60.3.2 (romance F2) */, text: "« Je veux qu’on essaie, à trois. Pas cette nuit forcément. Mais pour de vrai, et chacun peut partir quand il veut. »", intent: 'romance', target: 'Kaelen & Alistair', importance: 'critical',
      response: "Kaelen regarde Alistair. Alistair regarde Kaelen. « Oui, » dit Kaelen. « Une condition : personne ne fait semblant. » Alistair met plus longtemps. « Oui. Et personne ne promet ce qu’il ne sait pas tenir. » Il tend la main à Kaelen, pas à toi. Kaelen la prend. « Oui, » dit-il encore, à lui cette fois. Vous restez assis tous les trois jusqu’à ce que le dôme cesse de gémir.",
      journal: "Dans le dôme, tu as proposé à Kaelen et Alistair un lien à trois, librement consenti par chacun. Chacun a dit oui, pour lui-même et à l’autre. L’accord est révocable par chacun. Au Trône, il ne tiendra que s’il tient encore pour eux.",
      effects: [{ type: "SET_FLAG", target: "trio_accord" }, { type: "SET_FLAG", target: "_trio_nuit_vue" }, { type: "ADD_GAUGE", target: "lien_O", value: 1 }, { type: "ADD_GAUGE", target: "lien_E", value: 1 }], next: 'RETURN' },
    { key: 'PROPOSER_REFUS', condition: (gs) => !(romanceAvailableO(gs) && romanceAvailableE(gs) && !gs.hasFlag('go_poly_domination') && !dominationRomance6032_(gs)), text: "« Je veux qu’on essaie, à trois. Pas cette nuit forcément. Mais pour de vrai, et chacun peut partir quand il veut. »", intent: 'romance', target: 'Kaelen & Alistair', importance: 'critical',
      response: "Le silence revient, plus lourd. Kaelen secoue la tête le premier, sans colère. « Pas comme ça. Pas maintenant. » Alistair détourne le regard. « Je ne dirai pas oui pour te faire plaisir. Tu mérites mieux qu’un oui que je ne pense pas. » Personne ne part. Mais personne ne dit oui. La question reste posée, et c’est une réponse.",
      journal: "Dans le dôme, tu as proposé un lien à trois. Ils ont refusé, et tu l’as entendu.",
      effects: [{ type: "SET_FLAG", target: "trio_refuse" }, { type: "SET_FLAG", target: "_trio_nuit_vue" }], next: 'RETURN' },
    { key: 'ATTENDRE', text: "« Je ne sais pas encore ce que je veux. Je voulais seulement qu’on se le dise en face. »", intent: 'confiance', target: 'Kaelen & Alistair', importance: 'major',
      response: "« C’est déjà plus honnête que tout ce que l’Ordre m’a appris, » souffle Alistair. Kaelen pose la tête contre la paroi. « On a le temps, Reine. Pour une fois, on a le temps. »",
      journal: "Dans le dôme, tu as nommé l’attirance à trois sans rien exiger.",
      effects: [{ type: "SET_FLAG", target: "trio_attente" }, { type: "SET_FLAG", target: "_trio_nuit_vue" }], next: 'RETURN' }
  ]
},

'ACTE5_01B_PREMIER_MATIN': {
  sceneNumber: 'ACTE5_01B', chapter: 5, title: "Le Premier Matin", mood: 'epilogue',
  image: "https://cdn.jsdelivr.net/gh/Sunstrader/Releases@main/Acte%203/Place_du_village_avec_statue_202606191345.jpeg",
  getDynamicNarrative: (gs) => {
    let t = "Ils sont venus. Pas en foule : par petits groupes, en gardant leurs distances, comme on s’approche d’un lac dont on ne sait pas encore s’il porte.\n\n";
    t += "Des bergers. Une vieille femme qui serre un chapelet de l’Ordre et ne le lâche pas. Des enfants qui n’ont jamais vu de printemps et qui regardent la neige fondre au bord des toits comme un tour de magie.\n\n";
    if (gs.hasFlag('relique_silas') || gs.hasFlag('silas_verite_acceptee')) t += "Quelqu’un te tend le parchemin de Silas, déplié à la main : les noms des serviteurs qui ont survécu au Gel. Certains sont là, dans la foule. Ils ont trois siècles de silence dans les épaules.\n\n";
    else if (gs.hasFlag('silas_ami')) t += "Un bouton gravé d’un flocon est posé sur une borne, à hauteur d’enfant. Silas n’est pas là, mais il a laissé sa manière de dire bonjour.\n\n";
    if (gs.hasFlag('seraphine_fin_alliee') || gs.hasFlag('seraphine_ouvre_geoles')) t += "Séraphine se tient à l’écart, sans emblème. Derrière elle, une file de gens pâles sortis des geôles de l’Ordre clignent des yeux au soleil.\n\n";
    if (gs.hasFlag('veyra_fin_egalite')) t += "Veyra est assise sur un muret, la cicatrice au coin de la lèvre. Elle n’a rien à vendre aujourd’hui. Ça lui va mal, et elle le sait.\n\n";
    if (gs.hasFlag('lyra_liberee')) t += "Quelque part, une voix chante une chanson de marche, sans pouvoir, un peu faux. Tu reconnais Lyra. Aucun genou ne touche la neige. C’est la plus belle chose que tu aies entendue depuis ton réveil.\n\n";
    t += "Ils attendent que tu parles. Tu sais déjà que ton premier geste comptera plus que tous tes discours.";
    return t;
  },
  choices: [
    { key: 'GEOLES', text: "Ouvrir ce qui est encore fermé : les geôles, les greniers, les archives de l’Ordre.", intent: 'liberte', target: 'Monde', importance: 'major',
      response: "Il faut toute la journée. Certaines portes ne s’ouvrent qu’au marteau. Le soir, une femme sortie d’une cellule te demande si elle doit te remercier. Tu réponds que non. Elle le fait quand même, à sa façon : en partant.",
      journal: "Ton premier acte après le Trône a été d’ouvrir les geôles et les archives.",
      effects: [{ type: "SET_FLAG", target: "acte5_geoles_ouvertes" }], next: 'ACTE5_01C_DERNIERE_QUESTION' },
    { key: 'NOMS', text: "Rendre les noms : lire tout haut ceux que l’Ordre a effacés, et laisser chacun ajouter les siens.", intent: 'memoire', target: 'Monde', importance: 'major',
      response: "Tu commences par Kalthar. Puis Oraya. Puis des inconnus, des dizaines, des centaines. Quand ta voix se brise, quelqu’un d’autre continue. La liste ne finit pas ce jour-là. Elle ne finira peut-être jamais, et c’est bien.",
      journal: "Ton premier acte après le Trône a été de rendre les noms effacés.",
      effects: [{ type: "SET_FLAG", target: "acte5_noms_rendus" }, { type: "ADD_GAUGE", target: "memoire_kalthar", value: 1 }], next: 'ACTE5_01C_DERNIERE_QUESTION' },
    { key: 'TOMBE', text: "Creuser une tombe pour Fen, là où la neige fond en premier.", intent: 'memoire', target: 'Fen', importance: 'major',
      response: "Il n’y a pas de corps. Tu creuses quand même. Tu poses dans le trou une plume, une pierre de la fresque et tes deux mains, une longue minute. Quand tu te relèves, trois notes passent dans le vent, et tu ne te retournes pas pour vérifier.",
      journal: "Ton premier acte après le Trône a été d’offrir une tombe à Fen — et à Kalthar.",
      effects: [{ type: "SET_FLAG", target: "acte5_tombe_fen" }], next: 'ACTE5_01C_DERNIERE_QUESTION' }
  ]
},

'ACTE5_01C_DERNIERE_QUESTION': {
  sceneNumber: 'ACTE5_01C', chapter: 5, title: "La Dernière Question", mood: 'epilogue',
  image: "https://cdn.jsdelivr.net/gh/Sunstrader/Releases@main/Acte%203/Cr%C3%AAte_neigeuse_202606191345.jpeg",
  getDynamicNarrative: (gs) => {
    let t = "Le soir tombe sur le premier jour sans hiver imposé.\n\n";
    t += "Tu montes seule sur la crête, là où le vent hésite entre deux saisons. En bas, les feux s’allument un à un, sans que personne te demande la permission. C’est exactement ce que tu voulais. C’est aussi la chose la plus vertigineuse que tu aies jamais vue.\n\n";
    if (trioConsenti56_(gs)) t += "Deux silhouettes t’attendent au pied de la crête, assez proches pour se parler, assez loin pour te laisser venir. Elles ne te demandent rien. Elles sont là.\n\n";
    else if (companionPresentO(gs) && companionPresentE(gs)) t += "Kaelen et Alistair attendent au pied de la crête, chacun de son côté du chemin. Ils ne te suivront pas sans y être invités.\n\n";
    else if (companionPresentO(gs)) t += "Kaelen attend au pied de la crête, une dague plantée dans la neige à côté de lui, garde tournée vers le ciel — sa façon de dire qu’il ne la tirera pas.\n\n";
    else if (companionPresentE(gs)) t += "Alistair attend au pied de la crête, une lanterne posée à ses pieds. Il ne l’allume pas. Il te laisse décider s’il faut de la lumière.\n\n";
    t += "Il reste une question, la seule qui compte encore : où es-tu chez toi, maintenant que plus rien ne t’y oblige ?";
    return t;
  },
  choices: [
    { key: 'A', text: "Rester. Veiller.", next: 'ACTE5_02_VEILLE' },
    { key: 'B', text: "Partir. Sans regarder en arrière.", next: 'ACTE5_02_DEPART' },
    { key: 'C', text: "Revenir sur tes pas. Voir qui reste.", next: 'ACTE5_02_RETOUR' }
  ]
},
'VEYRA_VERITE': {
  sceneNumber:'3.V2',chapter:3,title:"Le Fragment qui Ment",mood:'tension',
  getDynamicNarrative:(gs)=>{
    let t="Le fragment de couronne de Veyra chauffe dans ta paume alors qu’il devrait être mort depuis trois siècles.\n\nLe Nomade t’avait avertie : une relique ne ment pas comme une personne. Elle ment par omission.\n\n";
    if(gs.hasFlag('veyra_recit_mis_en_doute')) t+="Tu sais déjà que le récit de Veyra ne tient pas entièrement. Ce que tu découvres est pire : elle a mélangé deux vérités pour fabriquer une conclusion qui lui appartenait.\n\n";
    return t+"Veyra apparaît dans le reflet du métal. Comme toujours lorsqu’elle refuse de demander pardon, sa langue passe brièvement sur la cicatrice qui coupe sa lèvre. « Tu voulais savoir si je t’avais menti. La réponse est oui. Pas sur tout. C’est ce qui rend le mensonge utile. »";
  },
  choices:[
    {key:'VERITE',text:"« Alors donne-moi ce que tu as retiré de l’histoire. »",intent:'memoire',target:'Veyra',importance:'major',response:"Veyra ferme les yeux. « Kalthar avait choisi de mourir avant que tu choisisses pour lui. J’ai caché ça parce que je voulais que ta colère me soit utile. »",journal:"Tu as forcé Veyra à reconnaître qu’elle avait utilisé la mort de Kalthar pour orienter ta colère.",effects:[{type:'SET_FLAG',target:'veyra_verite_decouverte'},{type:'SET_FLAG',target:'veyra_mensonge_avoue'},{type:'ADD_GAUGE',target:'memoire_kalthar',value:2}],next:'RETURN'},
    {key:'BRISER',text:"Briser le fragment. Refuser que sa vérité continue de vivre dans un objet.",intent:'liberte',target:'Elenya',importance:'critical',irreversible:true,feedback:"Le fragment se fend. Veyra ne peut plus utiliser cette relique pour te rappeler à elle.",journal:"Tu as brisé le fragment de couronne de Veyra après avoir découvert que son récit était incomplet.",effects:[{type:'SET_FLAG',target:'veyra_verite_decouverte'},{type:'SET_FLAG',target:'veyra_fragment_brise'},{type:'ADD_GAUGE',target:'volonte',value:2},{type:'ADD_GAUGE',target:'possession',value:-1}],next:'RETURN'}
  ]
},

'VEYRA_DERNIER_PACTE': {
  sceneNumber:'4.V3',chapter:4,title:"Le Pacte qui n’en est plus un",mood:'intimate',
  getDynamicNarrative:(gs)=>"Veyra t’attend avant le Trône, sans contrat, sans garde, sans couronne. Son pouce trouve sa cicatrice, s’y arrête — puis sa main retombe avant le vieux geste de défense.\n\n« Si tu me choisis à la fin, je ne veux pas que ce soit parce que tu me dois quelque chose. Et je refuse de te devoir ma survie. »",
  choices:[
    {key:'EGALITE',text:"« Alors aucun pacte. Seulement deux personnes qui peuvent encore partir. »",intent:'liberte',target:'Veyra',importance:'critical',irreversible:true,feedback:"Veyra accepte une relation qui ne repose plus sur une dette.",journal:"Avant le Trône, tu as refusé tout nouveau pacte avec Veyra.",effects:[{type:'SET_FLAG',target:'veyra_position_finale'},{type:'SET_FLAG',target:'veyra_fin_egalite'}],next:'RETURN'},
    {key:'POUVOIR',text:"« Je veux ton pouvoir. Rien d’autre. »",intent:'possession',target:'Veyra',importance:'critical',irreversible:true,feedback:"Tu nommes enfin le pacte pour ce qu’il est.",journal:"Tu as conservé Veyra comme alliance de pouvoir, sans l’appeler amour.",effects:[{type:'SET_FLAG',target:'veyra_position_finale'},{type:'SET_FLAG',target:'veyra_fin_pouvoir'},{type:'ADD_GAUGE',target:'possession',value:2}],next:'RETURN'}
  ]
},

'SERAPHINE_FRACTURE': {
  sceneNumber:'3.S3',chapter:3,title:"La Foi après la preuve",mood:'tension',
  getDynamicNarrative:(gs)=>"Séraphine pose sur la table trois registres de l’Ordre. Les noms d’enfants y sont suivis de sommes, de serments, puis de dates de transfert.\n\n« Je croyais que mon frère avait trahi l’Ordre pour toi. L’Ordre l’avait déjà vendu avant qu’il sache parler. »\n\nAlistair ne lui demande pas pardon. Il lui laisse le registre. Séraphine en aligne les trois coins avec une précision presque violente, puis arrache de son propre ongle le petit sceau blanc de l’Ordre collé sur la couverture. Elle le garde entre deux doigts au lieu de le jeter.",
  choices:[
    {key:'OUVRIR',text:"« Alors ouvre les geôles avec moi. Pas pour lui. Pour ceux qui y sont encore. »",intent:'liberte',target:'Séraphine',importance:'major',response:"Séraphine ferme le registre. « Pour eux. Pas pour toi. » C’est assez.",journal:"Séraphine a découvert que l’Ordre traitait les serments comme des propriétés transmissibles.",effects:[{type:'SET_FLAG',target:'seraphine_fracture_vue'},{type:'SET_FLAG',target:'seraphine_ouvre_geoles'}],next:'RETURN'},
    {key:'BRULER',text:"« Brûle leurs serments. Tous. Même ceux qui te donnent encore du pouvoir. »",intent:'sacrifice',target:'Séraphine',importance:'critical',irreversible:true,response:"Elle approche le premier registre d’une flamme sacrée. « Si je commence, je ne m’arrête pas. »",journal:"Tu as demandé à Séraphine de brûler les serments héréditaires de l’Ordre.",effects:[{type:'SET_FLAG',target:'seraphine_fracture_vue'},{type:'SET_FLAG',target:'seraphine_brule_serments'}],next:'RETURN'}
  ]
},

'SERAPHINE_DERNIER_SERMENT': {
  sceneNumber:'4.S4',chapter:4,title:"Le Dernier Serment",mood:'intimate',
  getDynamicNarrative:(gs)=>"Séraphine attend devant une porte de l’Ordre déjà ouverte.\n\nElle tient encore entre deux doigts le petit sceau blanc arraché au registre. Elle le casse en deux sans quitter tes yeux.\n\n« Dis-moi une seule chose : après le Trône, est-ce que tu reconstruiras une autre institution qui prétendra sauver les gens malgré eux ? »",
  choices:[
    {key:'NON',text:"« Non. Et si je le fais, tu me combattras. »",intent:'liberte',target:'Séraphine',importance:'critical',irreversible:true,response:"« Alors j’espère ne jamais avoir à tenir cette promesse. »",journal:"Tu as donné à Séraphine le droit de te combattre si ton règne reproduisait les prisons de l’Ordre.",effects:[{type:'SET_FLAG',target:'seraphine_position_finale'},{type:'SET_FLAG',target:'seraphine_fin_alliee'}],next:'RETURN'},
    {key:'AIMER',condition:(gs)=>gs.hasFlag('seraphine_baiser')&&(gs.getGauge('lien_seraphine')||0)>=6,text:"« Je ne te promets pas un monde. Je te demande si tu veux bien y vivre avec moi. »",intent:'romance',target:'Séraphine',importance:'critical',irreversible:true,response:"Séraphine regarde le sceau brisé dans sa main, puis toi. « C’est la première question qu’on me pose, » dit-elle. « Oui. » Elle a l’air de quelqu’un qui vient de sauter d’une falaise, et qui découvre qu’elle vole.",journal:"Tu as demandé à Séraphine de vivre avec toi. Elle a dit oui.",effects:[{type:'SET_FLAG',target:'seraphine_position_finale'},{type:'SET_FLAG',target:'seraphine_amour'}],next:'RETURN'},
    {key:'AUCUNE',text:"« Je ne te promets rien. Les promesses sont précisément ce qui nous a conduits ici. »",intent:'liberte',target:'Séraphine',importance:'critical',irreversible:true,response:"Séraphine sourit tristement. « Alors personne ne pourra vendre cette phrase après ta mort. »",journal:"Tu as refusé de remplacer les anciens serments par un nouveau serment personnel.",effects:[{type:'SET_FLAG',target:'seraphine_position_finale'},{type:'SET_FLAG',target:'seraphine_fin_sans_serment'}],next:'RETURN'}
  ]
},

'MIRA_ROUTE_SANS_NOM': {
  sceneNumber:'3.M3',chapter:3,title:"La Route sans Nom",mood:'exploration',
  text:"Mira te fait quitter la route principale avant minuit. Pendant trois heures, vous ne parlez presque pas.\n\nElle connaît les passages qui n’existent sur aucune carte. À l’aube, des cavaliers passent à trente mètres de votre cache. Mira ne sort pas sa lame. Elle te pose seulement deux doigts sur le poignet : attends.\n\nQuand le danger s’éloigne, tu comprends ce qu’elle proposait réellement lorsqu’elle disait disparaître. Pas une fuite romantique. Une compétence. Une vie faite d’absence choisie.",
  choices:[
    {key:'APPRENDRE',text:"« Apprends-moi à disparaître sans me perdre. »",intent:'confiance',target:'Mira',importance:'major',response:"Mira sourit. « Ça, c’est une question que je sais enseigner. »",journal:"Mira t’a montré ce que signifie réellement vivre hors des routes et des institutions.",effects:[{type:'SET_FLAG',target:'mira_route_sans_nom_vecue'},{type:'SET_FLAG',target:'mira_apprend_disparaitre'}],next:'RETURN'},
    {key:'RESTER',text:"« Je comprends mieux. Mais je ne sais pas encore si cette vie est la mienne. »",intent:'distance',target:'Mira',importance:'major',response:"« Parfait. Les mauvaises fuites commencent toujours par quelqu’un qui prétend être sûr. »",journal:"Tu as vécu une nuit sur les routes secrètes de Mira sans lui promettre de la suivre.",effects:[{type:'SET_FLAG',target:'mira_route_sans_nom_vecue'}],next:'RETURN'}
  ]
},

'DETTE_REVELATION': {
  sceneNumber:'3.D1',chapter:3,title:"Le Livre des Créances",mood:'tension',
  text:"Tu poses côte à côte ce que Kaelen appelle sa dette et ce qu’Alistair appelle son devoir. Les deux objets glissent légèrement sur la pierre et viennent se toucher avec un bruit sec. Aucun ne reste au-dessus de l’autre.\n\nLes mots diffèrent. La structure est identique : quelqu’un souffre, quelqu’un sauve, puis le survivant cesse de s’appartenir entièrement.\n\nOraya reconnaît le mécanisme avant toi. « Nous avons fait la même chose avec les serments. Avec le sang. Avec les morts. »\n\nCe n’est plus une histoire entre trois personnes. C’est une architecture.",
  choices:[
    {key:'ANNULER',text:"« Alors on n’annule pas deux dettes. On détruit le principe qui les rend héréditaires. »",intent:'liberte',target:'Monde',importance:'critical',response:"Pour la première fois, Kaelen et Alistair regardent le même ennemi.",journal:"Tu as compris que les dettes de Kaelen et d’Alistair étaient deux expressions d’un système plus vaste.",effects:[{type:'SET_FLAG',target:'dette_systeme_compris'},{type:'SET_FLAG',target:'dette_abolition_voulue'}],next:'RETURN'},
    {key:'PERSONNEL',text:"« Je peux libérer ceux que j’aime sans prétendre réécrire le monde entier. »",intent:'liberte',target:'Elenya',importance:'major',response:"Oraya acquiesce. « C’est déjà plus que ce que nous avons fait. »",journal:"Tu as choisi de traiter les dettes personnelles sans promettre d’abolir tout le système.",effects:[{type:'SET_FLAG',target:'dette_systeme_compris'},{type:'SET_FLAG',target:'dette_solution_personnelle'}],next:'RETURN'}
  ]
},

'DETTE_CHOIX': {
  sceneNumber:'4.D2',chapter:4,title:"Ce que personne ne peut hériter",mood:'intimate',
  text:"Avant le Trône, Kaelen et Alistair déposent chacun devant toi le symbole de ce qu’ils te devaient. Comme la première fois, les deux pièces glissent l’une vers l’autre et s’arrêtent côte à côte — jamais l’une sur l’autre.\n\nTu pourrais les rendre. Les détruire. Les conserver comme preuve.\n\nMais la vraie question est ailleurs : qu’est-ce qui empêchera quelqu’un de reconstruire la même dette après votre mort ?",
  choices:[
    {key:'ABOLIR',text:"Détruire les deux symboles. « Rien de ça ne sera transmissible. Ni amour, ni faute, ni salut. »",intent:'liberte',target:'Monde',importance:'critical',irreversible:true,feedback:"La voie Dette annulée devient une décision politique et intime.",journal:"Tu as décidé qu’aucune dette d’amour, de sang ou de salut ne pourrait être transmise comme un héritage.",effects:[{type:'SET_FLAG',target:'dette_position_finale'},{type:'SET_FLAG',target:'dette_abolie_structurellement'}],next:'RETURN'},
    {key:'RENDRE',text:"Rendre chaque symbole à celui qui le portait. « Votre liberté ne m’appartient pas non plus. »",intent:'liberte',target:'Kaelen & Alistair',importance:'critical',irreversible:true,feedback:"Tu refuses même de posséder la preuve de leur libération.",journal:"Tu as rendu à Kaelen et Alistair les symboles de leurs dettes.",effects:[{type:'SET_FLAG',target:'dette_position_finale'},{type:'SET_FLAG',target:'dette_rendue_aux_deux'}],next:'RETURN'}
  ]
},

'SILAS_MEMOIRES': {
    sceneNumber: 'V26.4.S',
    chapter: 3,
    title: "Ce que le Marchand se Rappelait",
    mood: 'exploration',
    sprite: "https://cdn.jsdelivr.net/gh/Sunstrader/Releases@main/Sprites%20-%20Silas%20bg/SPRITE_SILAS_DEBOUT_COURBE_SUPPLIANT_202606231802.png",
    getDynamicNarrative: (gs) => {
      let text = "Silas t’attend dans une ruelle du village caché. Il n’a pas l’air effrayé, ce soir. Juste… las.\n\n" + "« Majesté, » dit-il en s’inclinant maladroitement. « Je ne suis pas un homme d’histoire. Mais ma famille garde des choses du palais, depuis l’aïeule qui y vendait des étoffes avant le Gel. »\n\n";
      if (gs.hasFlag('silas_histoire_1')) text = "Silas t’attend dans une ruelle du village caché. Il a l’air moins effrayé que la dernière fois. Juste… las.\n\n" + "« Majesté, » dit-il en s’inclinant maladroitement. « Je vous ai déjà parlé de l’aïeule et de ses étoffes. Il reste une chose que ma mère ne racontait qu’à voix basse. »\n\n";
      if (!gs.hasFlag('silas_histoire_1')) {
        text += "« Elle disait que Kalthar n’était pas un tyran. Juste un homme qui a aimé trop fort une femme qui a aimé trop fort le monde. »\n\n";
      } else if (!gs.hasFlag('silas_histoire_2')) {
        text += "« Elle disait que l’Ordre, au début, priait devant ta statue. Pas contre. Ils ont changé de camp quand ils ont compris que tu ne reviendrais pas les bénir. »\n\n";
      } else {
        text += "« Elle m’a donné ça. » Il te tend un petit objet enveloppé dans un chiffon. « Elle disait que ça reviendrait à la Reine, un jour. »\n\n";
      }
      text += "Il te regarde avec des yeux trop vieux pour son visage. « Je ne sais pas si c’est vrai. Mais je sais que vous m’avez laissé vivre. Ça compte. »";
      return text;
    },
    choices: [
      {
        key: 'A',
        condition: (gs) => !gs.hasFlag('silas_histoire_1'),
        text: "Écouter la première histoire.",
        effects: [
          { type: "SET_FLAG", target: "silas_histoire_1" },
          { type: "ADD_GAUGE", target: "instabilite", value: -2 },
          { type: "ADD_TIMER", target: "venin", value: 1 }
        ],
        next: 'RETURN'
      },
      {
        key: 'B',
        condition: (gs) => gs.hasFlag('silas_histoire_1') && !gs.hasFlag('silas_histoire_2'),
        text: "Écouter la deuxième histoire.",
        effects: [
          { type: "SET_FLAG", target: "silas_histoire_2" },
          { type: "ADD_GAUGE", target: "instabilite", value: -2 }
        ],
        next: 'RETURN'
      },
      {
        key: 'C',
        condition: (gs) => gs.hasFlag('silas_histoire_2') && !gs.hasFlag('silas_histoire_3'),
        text: "Prendre l’objet.",
        effects: [
          { type: "SET_FLAG", target: "silas_histoire_3" },
          { type: "SET_FLAG", target: "relique_silas" },
          { type: "ADD_GAUGE", target: "instabilite", value: -3 }
        ],
        next: 'RETURN'
      }
    ]
  },

'ORAYA_INDICE_1': {
    sceneNumber: 'V26.5.O1',
    chapter: 3,
    title: "Les Larmes qui ne Coulaient pas",
    mood: 'intimate',
    sprite: "https://cdn.jsdelivr.net/gh/Sunstrader/Releases@main/Sprites%20-%20Grande%20Pr%C3%AAtresse%20bg/SPRITE_PRETRESSE_DEBOUT_AUTORITAIRE_202606231801.png",
    getDynamicNarrative: (gs) => {
      return "Oraya s’approche de Fen. Sa main se tend — puis s’arrête à mi-chemin, comme si elle craignait de brûler.\n\n" +
        "Ses yeux rougis par le froid se remplissent de larmes. Pas des larmes rituelles. Pas des larmes de prêtresse.\n\n" +
        "Des larmes de femme qui vient de retrouver quelque chose qu’elle croyait perdu.\n\n" +
        "« Pardonnez-moi, » murmure-t-elle en baissant la main. « C’est… il me rappelle quelqu’un. »\n\n" +
        "Elle ne dit pas qui. Elle n’en a pas besoin. Fen la regarde avec une intensité que tu ne lui connais pas. Tu ne sais pas lire ce regard-là.\n\n" +
        "Quelque chose, entre eux, s’est passé. Quelque chose que tu ne comprends pas encore.";
    },
    choices: [{
      key: 'NEXT',
      text: "Ne rien dire. Observer.",
      effects: [
        { type: "SET_FLAG", target: "oraya_indice_1" }
      ],
      next: 'RETURN'
    }]
  },

'ORAYA_INDICE_2': {
    sceneNumber: 'V26.5.O2',
    chapter: 3,
    title: "Ce qu’elle Savait sans Dire",
    mood: 'tension',
    sprite: "https://cdn.jsdelivr.net/gh/Sunstrader/Releases@main/Sprites%20-%20Grande%20Pr%C3%AAtresse%20bg/SPRITE_PRETRESSE_DEBOUT_AUTORITAIRE_202606231801.png",
    getDynamicNarrative: (gs) => {
      return "Oraya t’attend près de l’autel. Elle ne t’a pas suivie — elle t’a devancée.\n\n" +
        "« Vous avez mal à l’épaule gauche, » dit-elle sans te regarder. « Depuis le réveil. Une douleur ancienne, pas une blessure récente. »\n\n" +
        "Tu la fixes. Elle ne peut pas savoir ça.\n\n" +
        "« La stèle, » explique-t-elle. « Les textes du rituel disent que la Stase ne guérit pas. Elle fige. Une blessure d’avant le sommeil reste une blessure d’avant. »\n\n" +
        "Elle se tait. Puis, plus bas :\n\n" +
        "« Je sais ce que ça fait d’avoir mal au même endroit très longtemps. »\n\n" +
        "Elle s’éloigne avant que tu puisses répondre. Mais tu as vu ses mains trembler.";
    },
    choices: [{
      key: 'NEXT',
      text: "La laisser partir.",
      effects: [
        { type: "SET_FLAG", target: "oraya_indice_2" }
      ],
      next: 'RETURN'
    }]
  },

'ORAYA_INDICE_3': {
    sceneNumber: 'V26.5.O3',
    chapter: 3,
    title: "La Main qui Hésitait",
    mood: 'tension',
    sprite: "https://cdn.jsdelivr.net/gh/Sunstrader/Releases@main/Sprites%20-%20Grande%20Pr%C3%AAtresse%20bg/SPRITE_PRETRESSE_DEBOUT_AUTORITAIRE_202606231801.png",
    getDynamicNarrative: (gs) => {
      return "Oraya tient l’écrin d’obsidienne. La Larme d’Ébène pulse à l’intérieur, synchronisée avec ton propre cœur.\n\n" +
        "Ses mains tremblent. Pas de révérence. Pas de peur.\n\n" +
        "D’hésitation.\n\n" +
        "« Majesté, » dit-elle, et sa voix se brise sur le titre. « Si vous prenez cette pierre… vous saurez. »\n\n" +
        "Elle ne précise pas ce que tu sauras. Mais ses yeux, infiniment tristes, te fixent avec une intensité qui n’a rien de rituel.\n\n" +
        "Tu détournes le regard la première. Tu ne sais pas pourquoi.";
    },
    choices: [{
      key: 'NEXT',
      text: "Prendre la Larme. Sans un mot.",
      effects: [
        { type: "SET_FLAG", target: "oraya_indice_3" }
      ],
      next: 'RETURN'
    }]
  },

'ORAYA_CONFRONTATION': {
    sceneNumber: 'V26.5.OC',
    chapter: 4,
    title: "La Gardienne du Gel",
    mood: 'tension',
    sprite: "https://cdn.jsdelivr.net/gh/Sunstrader/Releases@main/Sprites%20-%20Grande%20Pr%C3%AAtresse%20bg/SPRITE_PRETRESSE_DEBOUT_AUTORITAIRE_202606231801.png",
    getDynamicNarrative: (gs) => {
      let text = "Tu la trouves dans le corridor d’obsidienne. Elle ne fuit pas. Elle t’attend.\n\n" +
        "Ses mains sont vides. Ouvertes. Paumes vers le haut, comme elle tenait l’écrin de la Larme — mais cette fois, il n’y a plus rien à offrir.\n\n" +
        "« Vous savez, » dit-elle. Sa voix ne tremble plus. Ce n’est pas du courage. C’est de la fatigue — celle d’une femme qui a porté un secret trop lourd pendant trop longtemps, et qui vient enfin de le poser.\n\n" +
        "Elle ne dit pas ce qu’elle a fait. Elle n’a pas besoin. Ses yeux — gris, infiniment tristes, infiniment familiers — le disent pour elle. Tu reconnais les yeux de la femme qui était près de toi pendant le rituel.\n\n";
      if (gs.hasFlag('frag1_visage_vu')) text += "Tu les avais aperçus dans le premier miroir, sans savoir alors à qui ils appartenaient.\n\n";
      if (gs.hasFlag('oraya_indice_1')) {
        text += "Tu te souviens de ses larmes en voyant Fen. Ce n’était pas du rituel. C’était du soulagement — celui d’une femme qui vient de retrouver quelque chose qu’elle croyait perdu depuis trois cents ans.\n\n";
      }
      if (gs.hasFlag('oraya_indice_2')) {
        text += "Tu te souviens de sa voix quand elle parlait de ton épaule blessée. Ce n’était pas de la dévotion. C’était de la mémoire — celle d’une femme qui sait ce que ça fait d’avoir mal au même endroit pendant des siècles.\n\n";
      }
      if (gs.hasFlag('oraya_indice_3')) {
        text += "Tu te souviens de son hésitation avant de te donner la Larme. Ce n’était pas du doute. C’était de la peur — peur que tu la haïsses, peur que tu la remercies, peur surtout que tu la regardes enfin.\n\n";
      }
      text += "Elle attend ton jugement. Pas comme une prêtresse. Comme une femme qui, quelque part entre la veille et la culpabilité, a oublié lequel des deux l’a gardée en vie.";
      return text;
    },
    choices: [
      {
        key: 'A',
        text: "Poser ta main sur sa joue. « Tu as fait ce que tu devais. Moi aussi. »",
        effects: [
          { type: "SET_FLAG", target: "oraya_pardonnee" },
          { type: "SET_FLAG", target: "oraya_confrontation_faite" },
          { type: "ADD_GAUGE", target: "instabilite", value: -3 }
        ],
        next: 'RETURN'
      },
      {
        key: 'B',
        text: "« Tu m’as volé trois siècles. Je ne te pardonnerai jamais. »",
        effects: [
          { type: "SET_FLAG", target: "oraya_punie" },
          { type: "SET_FLAG", target: "oraya_confrontation_faite" },
          { type: "ADD_GAUGE", target: "instabilite", value: 5 }
        ],
        next: 'RETURN'
      },
      {
        key: 'C',
        text: "La regarder en silence. Puis continuer vers le Trône.",
        effects: [
          { type: "SET_FLAG", target: "oraya_ignoree" },
          { type: "SET_FLAG", target: "oraya_confrontation_faite" }
        ],
        next: 'RETURN'
      }
    ]
  },

'LYRA_INDICE_1': {
    sceneNumber: 'V26.5.L1',
    chapter: 3,
    title: "La Voix qui se Souvient",
    mood: 'tension',
    sprite: "https://cdn.jsdelivr.net/gh/Sunstrader/Releases@main/Sprites%20-%20Lyra%20bg/SPRITE_LYRA_DEBOUT_HYPNOTIQUE_202606231756.png",
    getDynamicNarrative: (gs) => {
      return "Lyra s’arrête en te voyant. Pas de chant. Pas de sourire.\n\n" +
        "Ses yeux opalins s’élargissent. Elle reconnaît quelque chose.\n\n" +
        "« Vous… » commence-t-elle. Puis elle se reprend. « Majesté. »\n\n" +
        "Le titre sonne faux dans sa bouche. Comme un masque trop grand.\n\n" +
        "Elle détourne le regard vers l’eau. « J’ai chanté pour des rois. Des prêtres. Des monstres. Mais jamais pour quelqu’un qui… »\n\n" +
        "Elle ne finit pas. Elle n’a pas besoin.";
    },
    choices: [{
      key: 'NEXT',
      text: "Continuer.",
      effects: [
        { type: "SET_FLAG", target: "lyra_indice_1" }
      ],
      next: 'RETURN'
    }]
  },

'LYRA_VERITE': {
    sceneNumber: 'V26.5.LV',
    chapter: 3,
    title: "Ce que la Sirène Était",
    mood: 'tension',
    sprite: "https://cdn.jsdelivr.net/gh/Sunstrader/Releases@main/Sprites%20-%20Lyra%20bg/SPRITE_LYRA_DEBOUT_HYPNOTIQUE_202606231756.png",
    getDynamicNarrative: (gs) => {
      return "Lyra ne chante plus. Elle parle.\n\n" +
        "« L’Ordre m’a prise quand j’avais douze ans. Ils ont dit que ma voix était un don. Ils ont menti. C’était une arme. »\n\n" +
        "Elle touche sa gorge. « Ils m’ont brisée pour que je chante ce qu’ils voulaient. Des siècles. »\n\n" +
        "Ses yeux ne sont plus opalins. Ils sont humains. Fatigués. Anciens.\n\n" +
        "« Si vous me libérez… je ne saurai plus qui je suis. Mais au moins, ce ne sera plus eux qui décideront. »";
    },
    choices: [
      {
        key: 'A',
        text: "« Tu es libre. Va. »",
        effects: [
          { type: "SET_FLAG", target: "lyra_liberee" },
          { type: "SET_FLAG", target: "lyra_verite_revelee" },
          { type: "ADD_GAUGE", target: "instabilite", value: -2 }
        ],
        next: 'RETURN'
      },
      {
        key: 'B',
        text: "« Tu resteras. Ta voix m’appartient. »",
        effects: [
          { type: "SET_FLAG", target: "lyra_punie" },
          { type: "SET_FLAG", target: "lyra_verite_revelee" },
          { type: "ADD_GAUGE", target: "instabilite", value: 3 }
        ],
        next: 'RETURN'
      }
    ]
  },

'SILAS_VERITE': {
    sceneNumber: 'V26.5.1.SV',
    chapter: 4,
    title: "Ce que le Marchand Savait",
    mood: 'intimate',
    sprite: "https://cdn.jsdelivr.net/gh/Sunstrader/Releases@main/Sprites%20-%20Silas%20bg/SPRITE_SILAS_DEBOUT_COURBE_SUPPLIANT_202606231802.png",
    getDynamicNarrative: (gs) => {
      let text = "Tu le trouves au pied de la Citadelle. Il ne s’incline plus. Il se tient droit, pour la première fois.\n\n" +
        "« Majesté, » dit-il. Cette fois, ce n’est pas une formule. C’est un constat.\n\n" +
        "« Je savais qui vous étiez. Depuis la première nuit. Dans ma famille, on décrit vos yeux depuis trois siècles. »\n\n" +
        "Il te regarde avec des yeux trop vieux pour son visage.\n\n" +
        "« Je ne vous ai pas dénoncée. Pas par courage. Par dette. Ma famille vous doit trois siècles de silence. »\n\n" +
        "Il tend un dernier objet. Un parchemin. Les noms de tous les serviteurs royaux qui ont survécu au Gel.\n\n" +
        "« Ils sont encore là. Cachés. Ils attendent votre ordre. »\n\n";
      if (gs.hasFlag('silas_histoire_1') && gs.hasFlag('silas_histoire_2') && gs.hasFlag('silas_histoire_3')) {
        text += "Il sourit. Un vrai sourire. « L’aïeule avait raison. Vous êtes revenue. »\n\n";
      }
      if (gs.hasFlag('relique_silas')) {
        text += "L’objet qu’il t’a donné au village pulse faiblement dans ta poche. Comme un écho.\n\n";
      }
      text += "Il attend ton jugement.";
      return text;
    },
    choices: [
      {
        key: 'A',
        text: "Accepter le parchemin. « Dis-leur que la Reine est revenue. »",
        effects: [
          { type: "SET_FLAG", target: "silas_verite_acceptee" },
          { type: "ADD_GAUGE", target: "instabilite", value: -3 }
        ],
        next: 'RETURN'
      },
      {
        key: 'B',
        text: "Brûler le parchemin. « Je ne veux pas d’armée. Je veux la paix. »",
        effects: [
          { type: "SET_FLAG", target: "silas_verite_brulee" },
          { type: "ADD_GAUGE", target: "instabilite", value: -5 },
          { type: "SET_FLAG", target: "ton_douceur" }
        ],
        next: 'RETURN'
      },
      {
        key: 'C',
        text: "Ignorer Silas. Continuer vers le Trône.",
        effects: [
          { type: "SET_FLAG", target: "silas_verite_ignoree" }
        ],
        next: 'RETURN'
      }
    ]
  },

'SERAPHINE_INTRO': {
    sceneNumber: 'V27.SER.1',
    chapter: 3,
    title: "La Sœur de Lumière",
    mood: 'tension',
  onEnter:(state)=>{if(state&&Array.isArray(state.flags)&&!state.flags.includes('seraphine_intro_vue'))state.flags.push('seraphine_intro_vue');},
    image: "https://cdn.jsdelivr.net/gh/Sunstrader/Releases@main/Acte%203/Place_du_village_avec_statue_202606191345.jpeg",
    sprite: "https://cdn.jsdelivr.net/gh/Sunstrader/elenya-3d-assets@main/game-v54/sprites/seraphine.webp",
    getDynamicNarrative: (gs) => {
      let text = "Elle arrive sans bruit. Une silhouette blanche et or, plus fine qu’Alistair, plus tranchante.\n\n";
      text += "Ses yeux sont les mêmes que les siens — mais là où les siens doutent, les siens jugent.\n\n";
      text += "« Frère, » dit-elle. La voix est calme. Trop calme. « L’Ordre t’a cherché. Je t’ai trouvé. »\n\n";
      text += "Alistair se fige. Pour la première fois depuis des semaines, tu le vois réellement surpris.\n\n";
      text += "« Séraphine… »\n\n";
      text += "Elle ne le regarde pas. Elle te regarde. Et dans ce regard, tu lis déjà la sentence : menace. Miracle. Proie.\n\n";
      if (gs.hasFlag('seraphine_curiosite')) text += "Tu penses au dessin au dos de la lettre. Deux silhouettes et une pomme. Rien, dans cette femme, ne ressemble à ce dessin. C’est peut-être pour ça que tu n’arrives pas à détourner les yeux.\n\n";
      text += "« Majesté, » dit-elle enfin, s’inclinant d’un degré seulement. « L’Ordre du Soleil vous offre sa protection. Et me charge de m’assurer que mon frère ne devienne pas… un obstacle. »";
      return text;
    },
    choices: [
      {
        key: 'A',
        text: "« Ton frère n’est pas un obstacle. C’est un choix. »",
        response: "Séraphine ne cille pas. « C’est précisément ce que l’Ordre redoute : qu’il devienne capable de choisir contre nous. » Derrière elle, Alistair relève légèrement le menton. Pour une fois, personne ne parle de lui comme d’un serment ambulant sans qu’il l’entende.",
        effects: [
          { type: "SET_FLAG", target: "_seraphine_intro_vu" },
          { type: "SET_TIMER", target: "colere_ordre", value: 4 },
          { type: "ADD_GAUGE", target: "lien_E", value: 1 },
          { type: "ADD_REP", target: "ordre", value: -2 },
          { type: "SET_FLAG", target: "seraphine_hostile" }
        ],
        next: 'RETURN'
      },
      {
        key: 'B',
        text: "« L’Ordre n’offre rien. Il prend. »",
        response: "Le regard de Séraphine se durcit. « Et le givre, lui, demande la permission avant de recouvrir une ville ? » Elle ne recule pas. La question n’est pas une défense de l’Ordre : c’est un avertissement que ta propre puissance devra supporter le même examen.",
        effects: [
          { type: "SET_FLAG", target: "_seraphine_intro_vu" },
          { type: "SET_TIMER", target: "colere_ordre", value: 4 },
          { type: "ADD_GAUGE", target: "volonte", value: 1 },
          { type: "ADD_REP", target: "ordre", value: -4 },
          { type: "SET_FLAG", target: "seraphine_ennemie" }
        ],
        next: 'RETURN'
      },
      {
        key: 'C',
        text: "Laisser Alistair répondre.",
        response: "Alistair inspire. « Je ne suis pas son geôlier, Séraphine. » Sa sœur tourne enfin les yeux vers lui. « C’est précisément ce qui m’inquiète. » Aucun des deux ne hausse la voix. La fracture n’en est que plus nette.",
        effects: [
          { type: "SET_FLAG", target: "_seraphine_intro_vu" },
          { type: "SET_TIMER", target: "colere_ordre", value: 4 },
          { type: "ADD_GAUGE", target: "lien_E", value: 1 },
          { type: "SET_FLAG", target: "seraphine_observatrice" }
        ],
        next: 'RETURN'
      },
      {
        key: 'D',
        text: "« Tu peux rester. Mais tu ne commandes pas ici. »",
        effects: [
          { type: "SET_FLAG", target: "_seraphine_intro_vu" },
          { type: "SET_TIMER", target: "colere_ordre", value: 4 },
          { type: "ADD_GAUGE", target: "possession", value: 2 },
          { type: "ADD_REP", target: "ordre", value: -1 },
          { type: "SET_FLAG", target: "seraphine_tolerée" }
        ],
        next: 'RETURN'
      }
    ]
  },

'MIRA_RENCONTRE': {
    sceneNumber: 'V27.MIRA.1',
    chapter: 2,
    title: "La Contrebandière",
    mood: 'exploration',
  onEnter:(state)=>{if(state&&Array.isArray(state.flags)&&!state.flags.includes('mira_rencontree'))state.flags.push('mira_rencontree');},
    image: "https://cdn.jsdelivr.net/gh/Sunstrader/Releases@main/Acte%202/Village_barricad%C3%A9_au_loin_202606191345.jpeg",
    sprite: "https://cdn.jsdelivr.net/gh/Sunstrader/elenya-3d-assets@main/game-v54/sprites/mira.webp",
    getDynamicNarrative: (gs) => {
      return "Tu es seule. Ou presque.\n\n" +
        "Une jeune femme au manteau rapiécé te regarde depuis l’ombre d’un porche. Pas de révérence. Pas de peur. Juste une curiosité insolente.\n\n" +
        "« T’es la Reine de givre, hein ? » dit-elle. « On raconte que t’as gelé un continent. Moi j’ai gelé mon dîner trois fois cette semaine. On est presque égales. »\n\n" +
        "Elle s’approche. Une plume blanche est piquée dans ses cheveux — pas de magie, juste du style.\n\n" +
        "« Mira. Contrebande, informations, et parfois de la loyauté si on me paie correctement. T’as l’air d’avoir besoin des trois. »\n\n" +
        "Fen siffle doucement. Mira lui tire la langue.\n\n" +
        "« Ton rat est mignon. Il mord ? »";
    },
    choices: [
      {
        key: 'A',
        text: "« Il mord. Moi aussi. »",
        response: "Mira éclate d’un rire bref. « Parfait. J’aime les associés qui sentent le roussi. » Elle détache la plume blanche de ses cheveux et te la tend.",
        effects: [
          { type: "SET_FLAG", target: "_mira_rencontre_vu" },
          { type: "SET_FLAG", target: "mira_alliee" },
          { type: "ADD_GAUGE", target: "volonte", value: 1 },
          { type: "ADD_ITEM", target: "plume_mira" }
        ],
        next: 'RETURN'
      },
      {
        key: 'B',
        text: "« Je n’ai besoin de personne. »",
      response: "Mira lève les mains. « Reçu. Je sais reconnaître une porte fermée. »",
        effects: [
          { type: "SET_FLAG", target: "_mira_rencontre_vu" },
          { type: "SET_FLAG", target: "mira_rejetee" },
          { type: "ADD_GAUGE", target: "instabilite", value: 2 }
        ],
        next: 'RETURN'
      },
      {
        key: 'C',
        text: "« Tu mens déjà. Ça me plaît. »",
        response: "« Enfin quelqu’un qui apprécie mon sens du service. » Mira te tend sa plume. « Garde ça. Si quelqu’un te demande ce que ça signifie, mens mieux que moi. »",
        effects: [
          { type: "SET_FLAG", target: "_mira_rencontre_vu" },
          { type: "SET_FLAG", target: "mira_complice" },
          { type: "ADD_GAUGE", target: "volonte", value: 2 },
          { type: "ADD_ITEM", target: "plume_mira" }
        ],
        next: 'RETURN'
      },
      {
        key: 'D',
        text: "Lui donner une pièce (ou ce qui y ressemble) et partir.",
      response: "Elle fait disparaître le paiement. « Propre, net, sans dette. J’apprécie presque. »",
        effects: [
          { type: "SET_FLAG", target: "_mira_rencontre_vu" },
          { type: "SET_FLAG", target: "mira_payee" },
          { type: "ADD_REP", target: "village", value: 1 }
        ],
        next: 'RETURN'
      }
    ]
  },

'VEYRA_PACTE': {
    sceneNumber: 'V27.VEY.1',
    chapter: 3,
    title: "La Prêtresse Amère",
    mood: 'tension',
  onEnter:(state)=>{if(state&&Array.isArray(state.flags)&&!state.flags.includes('veyra_rencontree'))state.flags.push('veyra_rencontree');},
    image: "https://cdn.jsdelivr.net/gh/Sunstrader/Releases@main/Acte%203/Autel_int%C3%A9rieur_avec_%C3%A9p%C3%A9e_bris%C3%A9e_202606191345.jpeg",
    sprite: "https://cdn.jsdelivr.net/gh/Sunstrader/elenya-3d-assets@main/game-v54/sprites/veyra.webp",
    getDynamicNarrative: (gs) => {
      return "Elle t’attend près de l’autel, mais ce n’est pas Oraya.\n\n" +
        "Plus jeune. Plus dure. Une cicatrice traverse sa lèvre supérieure comme une signature.\n\n" +
        "« Oraya t’a donné des larmes et des excuses, » dit-elle. « Moi je te donne un choix. »\n\n" +
        "Elle pose un objet noir sur la pierre — un fragment de couronne brisée.\n\n" +
        "« Kalthar m’a aimée autrefois. Avant toi. Avant le Gel. Il m’a choisie pour porter une partie de sa colère. »\n\n" +
        "Ses yeux brillent d’une lueur qui n’est plus tout à fait humaine.\n\n" +
        "« Je peux t’apprendre à ne plus jamais avoir besoin d’eux. Ni de Kaelen. Ni d’Alistair. Ni d’Oraya. Juste le pouvoir. Pur. Sans dette. »\n\n" +
        "Elle tend la main.\n\n" +
        "« Ou tu peux continuer à jouer à la reine qui hésite. »";
    },
    choices: [
      {
        key: 'A',
        text: "Prendre sa main. Accepter le pacte.",
      response: "Veyra referme tes doigts sur le fragment. « Alors garde-le assez longtemps pour découvrir si je t’ai menti. »",
        effects: [
          { type: "SET_FLAG", target: "_veyra_pacte_vu" },
          { type: "SET_FLAG", target: "veyra_pacte_accepte" },
          { type: "ADD_GAUGE", target: "possession", value: 5 },
          { type: "ADD_GAUGE", target: "volonte", value: -2 },
          { type: "ADD_ITEM", target: "fragment_couronne_veyra" }
        ],
        next: 'RETURN'
      },
      {
        key: 'B',
        text: "« Je n’ai pas besoin de toi pour être seule. »",
        effects: [
          { type: "SET_FLAG", target: "_veyra_pacte_vu" },
          { type: "SET_FLAG", target: "veyra_rejetee" },
          { type: "ADD_GAUGE", target: "volonte", value: 2 },
          { type: "ADD_GAUGE", target: "possession", value: -1 }
        ],
        next: 'RETURN'
      },
      {
        key: 'C',
        text: "« Tu mens. Kalthar n’aimait personne. »",
      response: "Son sourire se fige. « Enfin une bonne question. Kalthar n’était pas l’homme que vos souvenirs ont besoin qu’il soit. »",
        effects: [
          { type: "SET_FLAG", target: "_veyra_pacte_vu" },
          { type: "SET_FLAG", target: "veyra_defiee" },
          { type: "ADD_GAUGE", target: "memoire_kalthar", value: 2 },
          { type: "ADD_GAUGE", target: "instabilite", value: 2 }
        ],
        next: 'RETURN'
      },
      {
        key: 'D',
        text: "Écouter en silence. Puis partir sans un mot.",
        effects: [
          { type: "SET_FLAG", target: "_veyra_pacte_vu" },
          { type: "SET_FLAG", target: "veyra_ignoree" },
          { type: "ADD_GAUGE", target: "volonte", value: 1 }
        ],
        next: 'RETURN'
      }
    ]
  },

'NOMADE_1': {
    sceneNumber: 'V27.NOM.1',
    chapter: 2,
    title: "L’Homme aux Yeux Vides",
    mood: 'exploration',
    image: "https://cdn.jsdelivr.net/gh/Sunstrader/Releases@main/Acte%201/Bivouac_aube_alistair.jpeg",
    getDynamicNarrative: (gs) => {
      return "Au bord de la rivière de cristal, quelqu’un est déjà là.\n\n" +
        "Un homme en manteau de voyage usé. Il ne te regarde pas. Il regarde l’eau.\n\n" +
        "Ses yeux sont d’un gris trop clair. Comme s’il avait vu trop de choses et que le monde avait décidé de les effacer.\n\n" +
        "Il ne parle pas. Il ne bouge pas. Quand tu passes près de lui, il incline à peine la tête — un salut, ou une reconnaissance.\n\n" +
        "Fen se plaque contre ton cou. Pour la première fois, il a peur.\n\n" +
        "L’homme reste. Tu continues.";
    },
    choices: [
      {
        key: 'A',
        text: "Tenter de lui parler.",
        response: "« Qui es-tu ? » demandes-tu. L’homme ne répond pas. Mais ses yeux quittent enfin l’eau pour Fen, et ses lèvres forment sans voix une syllabe que ton corps reconnaît avant ta mémoire. Fen se plaque davantage contre toi.",
        effects: [
          { type: "SET_FLAG", target: "_nomade_1_vu" },
          { type: "SET_FLAG", target: "nomade_aborde" },
          { type: "ADD_GAUGE", target: "memoire_kalthar", value: 1 }
        ],
        next: 'RETURN'
      },
      {
        key: 'B',
        text: "L’ignorer. Continuer.",
        effects: [
          { type: "SET_FLAG", target: "_nomade_1_vu" },
          { type: "SET_FLAG", target: "nomade_ignore" }
        ],
        next: 'RETURN'
      },
      {
        key: 'C_PLUME',
        text: "Lui laisser la plume blanche de Mira.",
        response: "Le Nomade prend la plume du bout des doigts. Quelque chose, enfin, ressemble à un sourire sur son visage. Il la plante dans une fissure de la borne de glace — un morceau de vie ordinaire au milieu des reliques. Fen cesse de trembler.",
        condition: (gs) => gs.hasItem && gs.hasItem('plume_mira'),
        effects: [
          { type: "REMOVE_ITEM", target: "plume_mira" },
          { type: "SET_FLAG", target: "_nomade_1_vu" },
          { type: "SET_FLAG", target: "nomade_offrande_plume" },
          { type: "ADD_GAUGE", target: "memoire_kalthar", value: 2 },
          { type: "ADD_GAUGE", target: "volonte", value: 1 }
        ],
        next: 'RETURN'
      },
      {
        key: 'C_COURONNE',
        text: "Lui laisser le fragment de couronne noire donné par Veyra.",
        response: "À peine le fragment touche-t-il sa paume que le Nomade retire la main comme s’il s’était brûlé. Puis il le ramasse malgré tout. « Pas… Kalthar », souffle-t-il — ses premiers mots. Fen pousse un cri aigu. Veyra t’a donné une relique, mais pas forcément la vérité qui allait avec.",
        condition: (gs) => gs.hasItem && gs.hasItem('fragment_couronne_veyra'),
        effects: [
          { type: "REMOVE_ITEM", target: "fragment_couronne_veyra" },
          { type: "SET_FLAG", target: "_nomade_1_vu" },
          { type: "SET_FLAG", target: "nomade_offrande_couronne" },
          { type: "SET_FLAG", target: "veyra_recit_mis_en_doute" },
          { type: "ADD_GAUGE", target: "memoire_kalthar", value: 3 }
        ],
        next: 'RETURN'
      },
      {
        key: 'D',
        text: "Rester une minute en silence à ses côtés.",
        response: "Une minute passe. Puis deux respirations se synchronisent presque malgré vous. L’homme ne parle toujours pas. Quand tu repars, il murmure quelque chose de trop bas pour être compris. Fen, lui, se retourne.",
        effects: [
          { type: "SET_FLAG", target: "_nomade_1_vu" },
          { type: "SET_FLAG", target: "nomade_silence_partage" },
          { type: "ADD_GAUGE", target: "volonte", value: 1 },
          { type: "ADD_GAUGE", target: "memoire_kalthar", value: 1 }
        ],
        next: 'RETURN'
      }
    ]
  },

'SERAPHINE_ARRIVEE': {
    sceneNumber: 'V27.SER.ARR',
    chapter: 3,
    title: "L’Inquisitrice",
    mood: 'tension',
  onEnter:(state)=>{if(state&&Array.isArray(state.flags)&&!state.flags.includes('seraphine_arrivee_vue'))state.flags.push('seraphine_arrivee_vue');},
    image: "https://cdn.jsdelivr.net/gh/Sunstrader/Releases@main/Acte%203/Crat%C3%A8re_avec_village_cach%C3%A9_202606191345.jpeg",
    sprite: "https://cdn.jsdelivr.net/gh/Sunstrader/elenya-3d-assets@main/game-v54/sprites/seraphine.webp",
    getDynamicNarrative: (gs) => {
      return "Le délai que l’Ordre t’avait accordé est écoulé.\n\n" +
        "Séraphine Leonhart apparaît au détour du chemin, cape blanche tachée de cendre, insigne de l’Inquisition brillant comme une lame.\n\n" +
        "« Assez de jeux, » dit-elle. « Mon frère. La Reine. L’Ordre réclame des comptes. »\n\n" +
        "Ses yeux glissent sur toi, puis sur Alistair. Il n’y a plus de tendresse fraternelle. Seulement du devoir.";
    },
    choices: [
      {
        key: 'A',
        text: "Te placer devant Alistair. « Il reste avec moi. »",
        response: "Séraphine fixe la place que tu viens de prendre devant son frère. « Avec vous ? » Elle tourne enfin les yeux vers Alistair. « Est-ce aussi ce que toi, tu veux ? » Alistair répond avant que tu puisses le faire : « Oui. Aujourd’hui, oui. »",
        effects: [
          { type: "SET_FLAG", target: "seraphine_arrivee_vue" },
          { type: "ADD_GAUGE", target: "lien_E", value: 1 },
          { type: "ADD_REP", target: "ordre", value: -3 },
          { type: "SET_FLAG", target: "seraphine_hostile" }
        ],
        next: 'RETURN'
      },
      {
        key: 'B',
        text: "Laisser Alistair décider.",
        response: "Alistair avance d’un pas. « Je ne retourne pas à l’Ordre aujourd’hui. » Séraphine serre la mâchoire. « Alors au moins, cette désobéissance est la tienne. » Elle te regarde ensuite, comme si elle venait de t’accorder un crédit qu’elle pourra reprendre.",
        effects: [
          { type: "SET_FLAG", target: "seraphine_arrivee_vue" },
          { type: "SET_FLAG", target: "seraphine_observatrice" }
        ],
        next: 'RETURN'
      },
      {
        key: 'C',
        text: "« L’Ordre n’a aucun droit ici. »",
        response: "La lumière de l’insigne de Séraphine monte d’un cran. « Alors nous avons enfin cessé de prétendre qu’il s’agit d’une négociation. » Elle ne tire pas son arme. Pas encore. Mais le prochain échange ne bénéficiera plus du vocabulaire de la courtoisie.",
        effects: [
          { type: "SET_FLAG", target: "seraphine_arrivee_vue" },
          { type: "ADD_GAUGE", target: "volonte", value: 2 },
          { type: "ADD_REP", target: "ordre", value: -5 },
          { type: "SET_FLAG", target: "seraphine_ennemie" }
        ],
        next: 'RETURN'
      }
    ]
  },
  // ==========================================
  // ACTE 3 — URGENCE + VILLAGE + ARCS ORAYA/LYRA/FEN + NOUVEAUX
  // ==========================================

// Séraphine déjà livrée en PARTIE 2 — version courte rappel
// ==========================================
  // ACTE 4 — CORRIDOR, TRÔNE, FINS (enrichi V27)
  // ==========================================

// ==========================================
  // NOUVELLES FINS V27
  // ==========================================

'MIRA_SUITE_SOLO': {
    sceneNumber: 'V27.MIRA.2',
    chapter: 3,
    title: "La Contrebandière — Suite",
    mood: 'exploration',
    condition: (gs) => (gs.hasFlag('mira_alliee') || gs.hasFlag('mira_complice')) && gs.hasFlag('voie_solo'),
    getDynamicNarrative: (gs) => {
      return "Mira te retrouve au bord du village caché, les bras croisés.\n\n" +
        "« T’as encore l’air de quelqu’un qui porte un continent sur le dos, » dit-elle. « Ça fait lourd. »\n\n" +
        "Elle te tend une gourde. L’eau est froide. Pas magique. Juste de l’eau.\n\n" +
        "« Je connais un passage. Personne ne le surveille. On peut disparaître avant que les prêtres et les assassins se rappellent que t’existes. »\n\n" +
        "Elle attend. Pas à genoux. Debout. Comme une égale.";
    },
    choices: [
      {
        key: 'A',
        text: "« Montre-moi le passage. »",
        effects: [
          { type: "SET_FLAG", target: "mira_fuite_acceptee" },
          { type: "ADD_GAUGE", target: "volonte", value: 2 }
        ],
        next: 'RETURN'
      },
      {
        key: 'B',
        text: "« Pas encore. J’ai des choses à finir. »",
        effects: [
          { type: "SET_FLAG", target: "mira_attend" },
          { type: "ADD_GAUGE", target: "volonte", value: 1 }
        ],
        next: 'RETURN'
      },
      {
        key: 'C',
        text: "« Tu pourrais partir sans moi. »",
        effects: [
          { type: "SET_FLAG", target: "mira_liberee" },
          { type: "ADD_GAUGE", target: "volonte", value: 1 }
        ],
        next: 'RETURN'
      }
    ]
  },

  // ==========================================
  // SCÈNES DE TRANSITION & NETTOYAGE
  // ==========================================

// Placeholder de continuité pour les scènes non encore détaillées
  // (elles restent compatibles avec le système V27 et peuvent être enrichies plus tard)
  



// ==========================================
  // FINS EXISTANTES ENRICHIES (V27)
  // ==========================================

// ==========================================
  // SCÈNE CRITIQUE RESTANTE
  // ==========================================

// ==========================================
  // JOUTES FINALES (Acte 3)
  // ==========================================

// ==========================================
  // SCÈNES MANQUANTES CRITIQUES
  // ==========================================

// ==========================================
  // NETTOYAGE FLAGS & HELPERS FINAUX
  // ==========================================

  // Note technique (ne pas afficher en jeu) :
  // Flags purgés ou rendus lisibles en V27 :
  // - serviteurs_reveles → remplacé par silas_verite_acceptee / silas_verite_brulee
  // - lyra_reduite_arme → intégré dans lyra_punie
  // - fragment_kalthar_1 → désormais lu via memoire_kalthar
  // Tous les flags de possession / volonte / memoire_kalthar sont initialisés
  // et clampés dans SceneManager.

  // Scène de secours pour éviter les dead-ends
  };
}
