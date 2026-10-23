// 60.1 (romance N8, audit) : plafond d’échos par scène, partagé entre les listes 55 à 59 qui s’emboîtent
// (la plus ancienne passe d’abord). Le Trône en empilait jusqu’à 9 en plus de son texte.
var _echoProf601_ = 0, _echoCompte601_ = 0;
// 60.2 : un écho fautif ne fait jamais planter la scène (anti-plantage gardé), mais l'erreur n'est plus avalée :
// elle est mémorisée (au plus 50, une fois par écho) ; en dev (ELENYA_DEV_DIAG=1 ou EF_ECHO_DIAG) elle est aussi journalisée.
var _echoErreurs602_ = [], _echoErreursVues602_ = {};
function _echoDiagDev602_() {
  try { if (typeof EF_ECHO_DIAG !== 'undefined' && EF_ECHO_DIAG) return true; return String(PropertiesService.getScriptProperties().getProperty('ELENYA_DEV_DIAG') || '') === '1'; } catch (_) { return false; }
}
function _echoErreur602_(id, i, err) {
  const cle = id + '#' + i; if (_echoErreursVues602_[cle]) return; _echoErreursVues602_[cle] = 1;
  if (_echoErreurs602_.length < 50) _echoErreurs602_.push({ scene: id, echo: i, message: String(err && err.message || err) });
  if (_echoDiagDev602_()) try { console.warn('[écho 60.2] ' + cle + ' : ' + String(err && err.message || err)); } catch (_) {}
}
function efEchoErreurs602_() { return _echoErreurs602_.slice(); }
// 60.8.0 : un écho marqué 'etat' (4e élément) dit où en est un compagnon absent (rupture, séparation, pause).
// Il passe hors plafond : sans lui, une partie chargée d'échos taisait l'absence de Séraphine au Trône.
var ECHOS_PLAFOND_601 = { ACTE4_09_TRONE_EBENE: 4, ACTE4_01_DEPART_VILLAGE: 3 };
function _echosEmpiles601_(id, base, echos) {
  const cap = ECHOS_PLAFOND_601[id] || Infinity;
  return function(gs) {
    if (_echoProf601_++ === 0) _echoCompte601_ = 0;
    try {
      let t = base(gs);
      echos.forEach((e, i) => { try { if ((e[3] === 'etat' || _echoCompte601_ < cap) && e[1](gs)) { t += '\n\n' + (typeof e[2] === 'function' ? e[2](gs) : e[2]); if (e[3] !== 'etat') _echoCompte601_++; } } catch (err) { _echoErreur602_(id, i, err); } });
      return t;
    } finally { _echoProf601_--; }
  };
}
// Refonte 52.4 — couches additives. Identifiants classiques et schéma 50 conservés.
var _refonteApplied = false;
var REFONTE_ART_BASE = 'https://cdn.jsdelivr.net/gh/Sunstrader/elenya-3d-assets@b02779d6f91076b3bfedc96622b311255ce7f1ac/game-v56/backgrounds/';
var REFONTE_BACKGROUND_NAMES = {
  'winter-library-oblique':'Bibliothèque — vue de la mezzanine',
  'winter-greenhouse-oblique':'Serre — bassin et verrières',
  'snow-forest-sideview':'Lisière — pente nocturne',
  'basalt-ravine-oblique':'Combe — après les lances de givre',
  'rustic-inn-corner':'Auberge — salle commune',
  'awakening-frost-chamber':'Réveil — autel de basalte',
  'basalt-catacombs-transverse':'Galeries — voûtes irrégulières',
  'ebony-throne-lateral':'Trône — cathédrale éventrée'
};
function refonteAsset_(url,state,id) {
  if(!url||/\/cg\/|\/endings\//.test(url))return url;
  let name=null;
  if(/\/bibliotheque\.webp$/.test(url))name='winter-library-oblique';
  if(/\/serre\.webp$/.test(url))name='winter-greenhouse-oblique';
  if(/\/auberge\.webp$/.test(url))name='rustic-inn-corner';
  if(/^NG_FIN_CYCLE/.test(id))name='awakening-frost-chamber';
  if(/^(ACTE1_04_TRANSITION|ACTE1_06_REMONTEE|ACTE1_06C_CONVERGENCE|NGP_05C_CENDRES)$/.test(id))name='basalt-catacombs-transverse';
  if(id==='KAELEN_SILENCE')name='snow-forest-sideview';
  if(id==='ACTE4_09_TRONE_EBENE')name='ebony-throne-lateral';
  if(/^(ACTE3_02_SAUVETAGE|ACTE3_03_LA_SIRENE|ACTE3_03B_RESISTANCE|LYRA_INDICE_1)$/.test(id)){
    if(id!=='ACTE3_02_SAUVETAGE'&&(state.flags||[]).includes('sauvetage_lance'))name='basalt-ravine-oblique';
    else return 'https://cdn.jsdelivr.net/gh/Sunstrader/Releases@main/Acte%203/Ravin_202606191345.jpeg';
  }
  return name?REFONTE_ART_BASE+name+'.webp':url;
}
function applyRefonte_() {
  if (_refonteApplied) return;
  _refonteApplied = true;
  const responses = {
    NGP_01_SEUIL: {
      MEMOIRE:"Tu laisses les lettres se dissoudre sous ta paume. Les vies reviennent sans ordre, mais tu ne détournes plus les yeux : cette fois, tu veux pouvoir les comparer.",
      REFUS:"Une croûte blanche recouvre les mots. La pierre se tait ; ta mémoire, elle, ne s’efface pas. Tu garderas le droit de contredire ce qu’elle raconte.",
      FEN:"Fen se raidit, puis pose son museau contre ton poignet. Il ne nie pas. Tu desserres les doigts pour lui laisser une issue ; il reste.",
      COURONNE:"Le diadème mord ton front. Tu le soulèves aussitôt d’un doigt : porter une couronne ne lui donne pas encore le droit de penser à ta place."
    },
    NGP_02_NEUF_ECHOS: {
      KALTHAR:"Tu écartes les reflets des trônes pour chercher le même visage derrière chacun. Fen tourne la tête vers une fenêtre qui n’était pas là un instant plus tôt.",
      AMOUR:"Tu retiens les mains plutôt que les couronnes. Ce qui te trouble n’est pas qu’elles t’aient touchée : c’est de ne plus savoir, dans certaines vies, si elles pouvaient repartir.",
      TRONE:"Tu contournes le siège au lieu de t’y asseoir. Dans la neige, ses quatre pieds ont laissé une seule empreinte, comme si tout le monde devait finir au même endroit.",
      SILENCE:"Tu suis le rythme de ton souffle. Fen ne te guide pas ; il attend que tu choisisses la première empreinte. Tu avances, sans explication à offrir."
    },
    NGP_03_PALAIS_ECHO: {
      PROMESSE:"Le reflet cesse de sourire. « Alors laisse-moi finir, même si ce que tu entends te déplaît. » Pour une fois, tu n’essaies pas de saisir la main derrière le verre.",
      COLERE:"Une coupe éclate au bord de la table. Kalthar ne recule pas. « Ta colère n’efface pas ce que je te dois. » Tu laisses les éclats à leur place.",
      PARDON:"« Tu n’as pas à décider maintenant », répond le reflet. Le soulagement qui passe sur son visage ne ressemble pas à une absolution.",
      DEPART:"Tu dépasses la fenêtre sans te retourner. « Vis », souffle la voix derrière toi. Ce n’est plus un ordre ; tu peux poursuivre même sans lui répondre."
    },
    NGP_04_FRESQUE_REPRISE: {
      DETTE:"Sous le motif royal, tu découvres des marques superposées. Plusieurs mains ont corrigé la même inscription. Tu emportes la question de leur origine, pas encore une réponse.",
      GEL:"La fissure cesse de rougeoyer sous tes doigts. Maintenir la fermeture exige pourtant un effort continu : la garder n’est pas la réparer.",
      BRISER:"Tu fends une bordure du relief. Le dessin se brise sans que la chaleur derrière lui disparaisse. Détruire le récit du piège n’a pas détruit le piège.",
      FEN:"Le petit corps se détend sous ta main. Fen touche le cercle de Stase de son museau, puis retire la tête. Tu acceptes ce premier aveu incomplet."
    },
    NGP_05_CONFRERIE: {
      OMBRE:"Tu suis la ligne du contrat jusque sous la neige. Elle ne mène pas vers Kaelen mais vers ceux qui ont décidé de sa dette avant sa naissance.",
      ECLAIREUR:"Tu retournes l’empreinte du sceau. Sous l’emblème de foi apparaît le dessin d’une serrure : tu veux examiner le mécanisme avant de chercher son héritier.",
      LIBERTE:"Tu effaces les deux marques. Leur contour demeure un instant dans l’air, puis s’éteint. Il reste à décider ce que tu feras des preuves.",
      TRIANGLE:"Tu gardes les deux empreintes séparées dans tes paumes. Les réunir ne t’autorise pas à confondre les deux hommes qui les portent."
    },
    NGP_06_DEUX_PORTES: {
      O:"La porte noire s’entrouvre. Tu annonces ton arrivée avant d’entrer ; le bruit de la lame s’arrête, puis une voix te répond : « Entre. »",
      E:"Tu frappes au bois clair. Alistair interrompt sa prière et ouvre lui-même. Sa première décision de cette vie n’est pas de te barrer le passage.",
      BOTH:"Tu ouvres les deux portes sans appeler personne à toi. Les deux hommes se regardent avant de regarder ta main vide.",
      NONE:"Le givre condamne les serrures, pas la route. Tu passes entre les portes et rejoins seule la lumière de la stèle."
    },
    NGP_07_KAELEN_ECHO: {
      STAY:"Kaelen range les morceaux du contrat. « Je commence par marcher avec toi jusqu’au prochain tournant. Après, tu me reposeras la question. »",
      DISTANCE:"Il ramasse les fragments sans chercher à retenir ta main. « Tu ne me dois pas une place parce que j’ai cessé de te vendre. » Il s’écarte de la porte."
    },
    NGP_08_ALISTAIR_ECHO: {
      STAY:"Alistair détache la clé de sa chaîne. « Si je recommence à appeler protection ce qui te retient, dis-le-moi. » Tu réponds : « Je n’attendrai pas ton accord. »",
      DISTANCE:"Il ne ramasse pas la clé. « Alors je n’en chercherai pas une autre. » Pour la première fois, tu peux quitter la pièce sans qu’il te précède."
    },
    NGP_09_DEUX_ECHOS: {
      TRUCE:"Kaelen garde sa dague au fourreau. Alistair laisse son insigne sur la pierre. Le désaccord n’a pas disparu ; aucun des deux ne cherche à en faire ton épreuve.",
      NONE:"Tu refuses de distribuer les places. Ils acquiescent séparément : leur liberté ne dépendra pas du nombre de mains que tu choisis de prendre.",
      O:"Tu tends la main vers Kaelen sans la refermer. Il te rejoint de son propre mouvement ; Alistair s’écarte, sans qu’on lui demande de bénir ce choix.",
      E:"Alistair regarde ta main avant de la prendre. Kaelen incline la tête et se décale. La place laissée vide ne devient pas une dette envers lui."
    },
    NGP_10_ORAYA: {
      PARDON:"Oraya incline la tête. « Je répondrai quand même de ce que j’ai fait. » Tu gardes cette phrase plutôt que la promesse d’un oubli.",
      PUNIR:"Elle cherche une défense, puis renonce. « Je ne peux pas exiger de toi la paix que je t’ai refusée. » Tu passes sans lui offrir ton pardon.",
      SILENCE:"Tu laisses la stèle entre vous. Oraya comprend que ton silence n’est ni un acquittement ni une invitation à recommencer son plaidoyer."
    },
    NGP_11_LYRA: {
      LIBERER:"Lyra ouvre la bouche, puis choisit de ne pas chanter. Tu restes près d’elle. C’est ainsi qu’elle vérifie que tu pensais vraiment ce que tu disais.",
      CHANT:"Tu manques la première note. Lyra rit et la reprend plus bas. Rien ne se plie à vos voix, et aucune de vous n’essaie de corriger le monde.",
      POUVOIR:"« Le garder ne m’oblige pas à m’en servir », répond Lyra. Tu acquiesces ; elle attend encore un instant avant de te croire.",
      SILENCE:"Lyra déplace légèrement son manteau pour te faire une place. Vous regardez le ciel ouvert. Elle ne transforme pas ta présence en dette."
    },
    NGP_12_FEN: {
      LETTING_GO:"Tu ouvres les mains. Le reflet de Kalthar ne revient pas les remplir. Fen se blottit contre ton poignet : ce qui survit n’est plus une promesse de résurrection.",
      REFUSE:"Tu serres le petit corps contre toi et cherches le roi dans ses yeux. Fen remue pour respirer ; tu desserres ta prise, mais pas encore ton refus.",
      SILENCE:"Tu le tiens contre ton cœur sans rappeler le roi. Le poids chaud du furet suffit pour cet instant. Tu ne lui demandes pas d’être quelqu’un d’autre."
    },
    NGP_13_BRASIER: {
      GEL:"Le feu s’arrête contre ta paume, sans s’éteindre. Tu traces une limite que tu devras entretenir ; tu n’as pas vaincu la chaleur en prétendant qu’elle n’existait plus.",
      MORTEL:"Le froid quitte lentement tes doigts. Le Brasier ne trouve plus en toi la même prise, mais tes jambes tremblent : avancer mortelle aura aussi un prix.",
      LIBERTE:"Les miroirs éclatent les uns après les autres. Tu protèges ton visage de ton bras ; même la liberté laisse des éclats à ramasser.",
      POSSESSION:"La brûlure passe sous ta peau. L’espace d’un souffle, tu entends tes pensées avec une voix étrangère. Tu as pris la prison en toi, pas supprimé son prisonnier."
    },
    NGP_14_TRONE_BRIS: {
      DESTROY:"L’accoudoir cède. Tu attends que le monde tombe avec lui ; seul le bois noir s’effondre. Ceux qui vivaient à son ombre sont encore debout.",
      TRANSFORM:"Tu retires au mécanisme le droit d’ordonner. Les empreintes restent lisibles dans le bois : elles pourront être consultées, jamais obéies.",
      KEEP:"Tu retires les mains. Le siège demeure intact. Ta promesse de ne pas l’utiliser ne lie ni ta peur future ni ceux qui viendront après toi.",
      SACRIFICE:"Tu prends la place du mécanisme. Aussitôt, toutes les attentes se tournent vers toi. Tu reconnais trop tard la forme familière de cette solution."
    },
    NGP_15_DERNIER_CHOIX: {
      FRONTIERE:"Tu traces la limite au sol, puis la prolonges d’un pas. Elle devra laisser passer les vivants sans laisser entrer le Brasier.",
      CYCLE:"Tu prononces encore le nom de Kalthar comme un rappel. Les traces de pas s’effacent autour de toi. Le premier matin revient.",
      FINAL:"Tu poses la couronne à terre. Personne ne sait encore comment vivre sans elle. Tu acceptes de commencer sans leur imposer la réponse.",
      LOVE:"Tu tends la main et attends. Ce sont leurs pas, pas ton pouvoir, qui comblent la distance.",
      THRONE:"Vous revenez ensemble jusqu’au siège. Cette fois, le silence entre vous n’attend pas que tu désignes qui doit s’asseoir.",
      VOID:"Tu n’installes personne à ta place. La place vide inquiète le monde, mais elle ne lui donne aucun ordre."
    }
  };
  Object.keys(responses).forEach(id=>{
    const s=NGPLUS_DB[id]; if(!s)return;
    s.choices.forEach(c=>{if(!c.response&&responses[id][c.key])c.response=responses[id][c.key];});
  });
  // Les embranchements ci-dessous sont de vraies scènes avec une décision propre.
  const branches = [
    ['NGP_05_CONFRERIE','OMBRE','NGP_05A_ARCHIVES','Le nom sous la clause','bibliotheque',
      "Tu trouves le contrat sous une pile de copies. Le nom de Kaelen figure sur la dernière, pas sur la première.\n\nTu pourrais lui tendre cet héritage comme une accusation. Tu pourrais aussi en garder la preuve contre ceux qui le réclament. L’encre n’effacera pas ce qu’il a fait ; elle permet de distinguer sa décision de leur ordre.",
      ['PREUVE','Conserver une copie pour confronter les Confrères.','ngplus_preuve_contrat','memoire_kalthar',2,"Tu plies la copie sans l’ajouter à sa dette. Le texte servira de preuve, pas de laisse."],
      ['RENDRE','Laisser à Kaelen le droit de disposer de son contrat.','ngplus_contrat_rendu','volonte',2,"Tu ne brûles pas le papier à sa place. Pour défaire une emprise, tu commences par renoncer à ce geste-là."]],
    ['NGP_05_CONFRERIE','ECLAIREUR','NGP_05B_SCEAU','La serrure sans héritier','observatoire',
      "Le dessin du sceau n’est pas une bénédiction complète. Une partie de ses traits ramène toujours le porteur vers la même porte.\n\nTu peux en révéler le fonctionnement à Alistair ou briser ce dernier lien avant de le retrouver. Savoir n’est pas encore choisir pour lui.",
      ['EXPLIQUER','Conserver le dessin pour qu’Alistair décide en connaissance de cause.','ngplus_sceau_explique','memoire_kalthar',2,"Tu emportes le dessin ouvert, sans masquer le trait qui enferme. La décision suivante lui appartiendra."],
      ['ROMPRE','Rompre l’ancrage qui te lie au sceau, sans toucher à sa foi.','ngplus_ancrage_rompu','volonte',2,"Tu retires ton nom du cercle. La lumière demeure ; c’est son droit sur toi qui vient de disparaître."]],
    ['NGP_05_CONFRERIE','LIBERTE','NGP_05C_CENDRES','Ce qui vaut la peine de garder','galeries-basalte',
      "Les marques ont disparu, mais le papier ne s’est pas entièrement consumé. Un témoin pourrait encore le lire.\n\nDétruire les preuves protégerait ceux que les contrats désignent. Les conserver empêcherait leurs auteurs de prétendre qu’ils n’ont jamais existé. Tu ne peux pas obtenir les deux certitudes à la fois.",
      ['ARCHIVER','Garder les preuves, sans les noms des victimes.','ngplus_archive_anonyme','memoire_kalthar',2,"Tu sépares les clauses des noms. L’histoire pourra être racontée sans livrer de nouvelles prises."],
      ['DETRUIRE','Détruire les derniers exemplaires.','ngplus_copies_detruites','volonte',2,"Tu attends que la dernière lettre soit illisible. La preuve est perdue, mais personne ne pourra reprendre ce papier contre eux."]],
    ['NGP_07_KAELEN_ECHO','STAY','NGP_07B_PAS','Rester au prochain tournant','mansarde-auberge',
      "Kaelen attend sur le seuil. Il n’a plus de contrat à te montrer.\n\n« Si je reste, je ne te suivrai pas dans toutes tes décisions. »\n\n« Tu penses que je te le demanderais ? »\n\n« Je pense qu’un jour tu pourrais en avoir peur. Je préfère te le dire avant. »\n\nTu peux lui répondre sans transformer ce départ en nouveau serment.",
      ['EGAL','« Contredis-moi quand il le faut. Reste si tu le veux. »','ngplus_kaelen_egal','lien_O',2,"Il hoche la tête. « Tu vas regretter de me l’avoir proposé. » Son sourire ne retire rien au sérieux de l’accord."],
      ['AMI','« Marchons ensemble. Sans promesse amoureuse. »','ngplus_kaelen_amitie','volonte',2,"« Ensemble, alors », répond-il. Il n’essaie pas de transformer ce mot en autre chose."]],
    ['NGP_08_ALISTAIR_ECHO','STAY','NGP_08B_SEUIL','La place près de la porte','dome-magique',
      "Alistair reste près de la porte ouverte. Il garde les mains visibles, comme s’il apprenait à ne pas cacher une clé.\n\n« Je ne sais pas encore protéger sans décider à la place des autres. »\n\n« Alors demande avant d’agir. »\n\nIl inspire, puis pose enfin une question qui ne contient pas sa réponse :\n\n« Quelle place veux-tu me donner ? »",
      ['EGAL','« À mes côtés, pas devant ma liberté. »','ngplus_alistair_egal','lien_E',2,"Il quitte le seuil pour se mettre à ta hauteur. Le passage reste libre derrière vous."],
      ['AMI','« Celle d’un ami. Pas d’un gardien ni d’un amant. »','ngplus_alistair_amitie','volonte',2,"Il accueille la limite sans marchander. « Je peux commencer par cela. »"]]
  ];
  branches.forEach(b=>{
    const original=NGPLUS_DB[b[0]].choices.find(c=>c.key===b[1]);
    const next=original.next; original.next=b[2];
    NGPLUS_DB[b[2]]={sceneNumber:b[2],chapter:NGPLUS_DB[b[0]].chapter,title:b[3],mood:'exploration',image:ELENYA_ART_V54_BASE+'backgrounds/'+b[4]+'.webp',text:b[5],choices:[b[6],b[7]].map(c=>({key:c[0],text:c[1],importance:'major',effects:[{type:'SET_FLAG',target:c[2]},{type:'ADD_GAUGE',target:c[3],value:c[4]}],response:c[5],next}))};
  });
  NGPLUS_DB.NGP_05C_CENDRES.choices.find(c=>c.key==='ARCHIVER').effects.push({type:'UNLOCK_ACHIEVEMENT',target:'ach_archive_sans_chaines'});
  ['NGP_07B_PAS','NGP_08B_SEUIL'].forEach(id=>NGPLUS_DB[id].choices.find(c=>c.key==='AMI').effects.push({type:'UNLOCK_ACHIEVEMENT',target:'ach_amitie_choisie'}));
  const love=NGPLUS_DB.NGP_15_DERNIER_CHOIX.choices.find(c=>c.key==='LOVE'),oldLove=love.condition;
  love.condition=gs=>oldLove(gs)&&!gs.hasFlag('ngplus_kaelen_amitie')&&!gs.hasFlag('ngplus_alistair_amitie');
  const throne=NGPLUS_DB.NGP_15_DERNIER_CHOIX.choices.find(c=>c.key==='THRONE');
  throne.condition=gs=>gs.hasFlag('ngplus_route_both')&&!gs.hasFlag('ngplus_trone_detruit')&&!gs.hasFlag('ngplus_trone_memoire');
  const finale=NGPLUS_DB.NGP_15_DERNIER_CHOIX.getDynamicNarrative;
  NGPLUS_DB.NGP_15_DERNIER_CHOIX.getDynamicNarrative=gs=>{
    let consequence='';
    if(gs.hasFlag('ngplus_mortelle'))consequence='Tes doigts ne répondent plus au givre. Ce choix rend impossible de porter toi-même une frontière magique.\n\n';
    else if(gs.hasFlag('ngplus_brasier_absorbe'))consequence='La brûlure demeure sous ta peau. Absorber le Brasier ne l’a pas fait disparaître ; tu refuses de l’oublier en regardant ceux qui restent.\n\n';
    if(gs.hasFlag('ngplus_preuve_contrat')||gs.hasFlag('ngplus_sceau_explique'))consequence+='Les preuves sont encore dans tes mains. Elles pourront être transmises au lieu de devenir un nouveau secret royal.\n\n';
    return consequence+finale(gs);
  };
  // Trois effets explicitement liés à leur choix, pas déduits des jauges.
  const visualChoices=[['ACTE1_02_RENCONTRE_2','S','ground-frost'],['ACTE2_08_MATIN_AUBERGE','S','crossbow-frost'],['ACTE3_02_SAUVETAGE','A','ice-storm'],['ACTE3_02_SAUVETAGE','B','ice-lance']];
  visualChoices.forEach(([id,key,effect])=>{const c=DB[id]&&(DB[id].choices||[]).find(c=>c.key===key);if(c)c.presentationEffect=effect;});
  // Ce premier indice précédait la présentation de Lyra et la répétait presque mot pour mot.
  DB.LYRA_INDICE_1.getDynamicNarrative=gs=>{
    const aftermath=gs.hasFlag('sauvetage_lance')?'Les lances vibrent encore dans le basalte.':'Le givre retombe en poussière dans la combe.';
    return aftermath+' La survivante se protège les yeux, puis regarde ta main.\n\nElle commence un geste vers toi et s’arrête. Sous sa manche apparaît une brûlure circulaire ; elle la recouvre aussitôt.\n\n« Ne me demandez pas de chanter. »\n\nLa phrase est presque inaudible. À ton cou, Fen se raidit. Tu ne sais pas encore lequel des deux a reconnu l’autre.';
  };
}

function refontePresentation_(state,scene,sceneId) {
  const latest=state.narrative&&state.narrative.lastChoicePresentation;
  const effect=latest&&latest.destination===sceneId?latest.effect:null;
  const flags=state.flags||[];
  return {effect,groundFrozen:sceneId==='ACTE1_03_FAMILIER_1'&&flags.includes('react_givre'),
    iceStormAftermath:/^(ACTE3_03|LYRA_INDICE_1)/.test(sceneId)&&flags.includes('sauvetage_burst'),
    // Les compagnons ne gèlent que si le scénario affirme qu’ils sont immobilisés.
    frozenCharacter:sceneId==='ACTE3_06_REVEIL_TORDU'?(flags.includes('reve_poly')?'both':flags.includes('reve_O')?'Kaelen':flags.includes('reve_E')?'Alistair':null):null,
    ambience: ['ACTE1_05_BIVOUAC','ACTE1_05B_REVEIL_BIVOUAC'].includes(sceneId) && flags.includes('avec_ombre') && !flags.includes('avec_eclaireur') ? 'quiet' : /SIRENE|ENVOUTEMENT|RESISTANCE/.test(sceneId)?'wind': /AUBERGE|BIVOUAC|CAMPEMENT/.test(sceneId)?'fire': /FORET|MARCHE|NEIGE|TEMPETE/.test(sceneId)?'wind':'quiet'};
}

function serverGetExplorer() {
  applyRefonte_();
  applyFins54_();
  applyRecit55_();
  applyRomance56_();
  applyRecit56_();
  applyRecit57_();
  applyRecit57b_();
  applyRecit58_();
  applyRecit59_();
  if (typeof applyAdn603_ === 'function') applyAdn603_();
  if (typeof applyRythme608_ === 'function') applyRythme608_();
  return {version:BUILD_VERSION,backgrounds:Object.keys(REFONTE_BACKGROUND_NAMES).map(id=>({url:REFONTE_ART_BASE+id+'.webp',name:REFONTE_BACKGROUND_NAMES[id]})),scenes:[...Object.entries(DB).map(([id,s])=>[id,s,'classic']),...Object.entries(NGPLUS_DB).map(([id,s])=>[id,s,'ngplus'])].filter(([id])=>id!=='ERREUR_SCENE').map(([id,s,mode])=>({id,sceneNumber:s.sceneNumber||id,title:s.title||id,chapter:s.chapter||1,mode,end:!!s.isEnd&&!s.aliasOf,aliasOf:s.aliasOf||null,achievement:s.achievementId||null,choices:(s.choices||[]).map(c=>({key:c.key,text:c.text,next:c.next,conditional:!!(c.condition||c.requires)}))}))};
}

// ===== 54.0.0 : FINS CONSOLIDÉES =====
// Neuf fins principales, une fin secrète (Corona), deux fins NG+.
// Les anciennes fins deviennent des variantes : leurs choix mènent à la fin principale
// avec un drapeau « variante_<ancien id> » ; les anciens identifiants restent des alias
// lisibles pour les sauvegardes arrêtées sur une ancienne fin.
const FINS54_GROUPES = {
  FIN_SERAPHINE_COEUR: ['FIN_SERAPHINE'],
  FIN_SOLO: ['FIN_MIRA'],
  FIN_VERITE: ['FIN_RECONCILIATION','FIN_REDEMPTION','FIN_EQUILIBRE','FIN_DETTE_ANNULEE','FIN_TEMOIN'],
  FIN_HIVER: ['FIN_SERAPHINE_LAME','FIN_VEYRA','FIN_DOMINATION'],
  FIN_SACRIFICE: ['FIN_MORTELLE'],
  FIN_BRISEE: ['FIN_CHAOS']
};
const FINS54_PRINCIPALES = ['FIN_OMBRE','FIN_ECLAIREUR','FIN_SERAPHINE_COEUR','FIN_POLY','FIN_SOLO','FIN_VERITE','FIN_HIVER','FIN_SACRIFICE','FIN_BRISEE'];
const FINS54_SECRETES = ['FIN_CORONA'];
const FINS54_NG_GROUPES = {
  NG_FIN_LIBERATION: ['NG_FIN_AMOUR','NG_FIN_DEUX_MAINS','NG_FIN_FRONTIERE','NG_FIN_VIDE'],
  NG_FIN_CYCLE: []
};
const FINS54_TITRES = { FIN_SACRIFICE: 'La Couronne Rendue', FIN_VERITE: 'Le Trône de Vérité', NG_FIN_LIBERATION: 'La Fin du Cycle', NG_FIN_CYCLE: 'Le Roi du Recommencement' };
// 60.3.1 (bible N4/N5) : une variante peut avoir son propre cadre (chaîne vide = aucun cadre).
const FINS54_CADRES_VARIANTES = {
  FIN_DOMINATION: 'Personne ne te contredit plus. C’est ce que tu as voulu, et c’est tout ce qui te reste.',
  FIN_CHAOS: ''
};
// 60.3.2 (bible N6) : fins rattachées à FIN_VERITE sans exiger la vérité : lignée et cadre propres.
const FINS6032_LIGNEES = { FIN_TEMOIN:'Les Trônes partagés', FIN_EQUILIBRE:'Les Trônes partagés', FIN_RECONCILIATION:'Les Trônes partagés', FIN_DETTE_ANNULEE:'Les Trônes partagés' };
const FINS6032_CADRE_PARTAGE = 'Le trône ne guérit rien. Il peut seulement se partager — et laisser d’autres réparer avec toi.';
['FIN_TEMOIN','FIN_EQUILIBRE','FIN_RECONCILIATION','FIN_DETTE_ANNULEE'].forEach(function(v) { FINS54_CADRES_VARIANTES[v] = FINS6032_CADRE_PARTAGE; });
const FINS54_CADRES = {
  FIN_SERAPHINE_COEUR: 'La lampe reste allumée. Ce qui change, c’est la main qui la tient avec toi.',
  FIN_SOLO: 'Tu pars. Ce qui compte, c’est qui sait où tu vas.',
  FIN_VERITE: 'Le trône ne guérit rien. Il peut seulement cesser de mentir — et laisser d’autres réparer avec toi.',
  FIN_HIVER: 'Le froid gagne. Il prend seulement un autre visage que le tien.',
  FIN_SACRIFICE: 'Tu rends ce que le trône t’a donné. Le prix change de forme, pas de poids.',
  FIN_BRISEE: 'Rien ne tient jusqu’au bout. Ce qui reste, c’est ce que tu as refusé de sauver.',
  NG_FIN_LIBERATION: 'Le cycle se défait. Reste à savoir ce que tu gardes entre les mains.',
  NG_FIN_CYCLE: 'Le cycle tient encore. Cette fois, tu sais exactement pourquoi.'
};
const FINS54_ALIAS = {};
const FINS603_DISTINCTES = true;
let _fins54Applied = false;
function fins54MainOf_(id) { return FINS54_ALIAS[id] || id; }
function _fins54Narr_(scene) {
  if (typeof scene.getDynamicNarrative === 'function') return scene.getDynamicNarrative;
  const t = scene.text || scene.narrative || '';
  return function() { return t; };
}
function _fins54Apply_(db, groupes) {
  if (!db) return;
  Object.keys(groupes).forEach(function(main) {
    const M = db[main]; if (!M) return;
    const variantes = groupes[main].filter(function(v) { return db[v]; });
    variantes.forEach(function(v) { FINS54_ALIAS[v] = main; });
    if (FINS54_TITRES[main]) M.title = FINS54_TITRES[main];
    const base = _fins54Narr_(M);
    const vNarr = {}; const vTitre = {};
    variantes.forEach(function(v) { vNarr[v] = _fins54Narr_(db[v]); vTitre[v] = db[v].title || v; });
    const cadre = FINS54_CADRES[main] || '';
    const rendu = function(v, gs) {
      const cadreV = Object.prototype.hasOwnProperty.call(FINS54_CADRES_VARIANTES, v) ? FINS54_CADRES_VARIANTES[v] : cadre;
      if (FINS603_DISTINCTES) return /* 60.8.1 (playtest #3) : pas de Markdown brut, l’interface ne le convertit pas */ vTitre[v] + ' — de la lignée « ' + (FINS6032_LIGNEES[v] || M.title) + ' »\n\n' + vNarr[v](gs) + (cadreV ? '\n\n' + cadreV : '');
      return M.title + ' — variante « ' + vTitre[v] + ' »\n\n' + vNarr[v](gs) + (cadre ? '\n\n' + cadre : '');
    };
    M.variants = variantes.slice();
    M.getDynamicNarrative = function(gs) {
      for (let i = 0; i < variantes.length; i++) if (gs.hasFlag('variante_' + variantes[i])) return rendu(variantes[i], gs);
      return base(gs);
    };
    // 60.3 (ADN R1) : les fins historiques retrouvent leur propre écran (titre, succès, image).
    // Le choix ne redirige plus vers la fin principale ; il pose variante_<id> et mène à l'ancienne scène.
    // Celle-ci lit la narration de la fin principale au moment du rendu, pour garder tous les échos
    // ajoutés plus tard à la famille. Sauvegardes arrêtées sur la fin principale : inchangées.
    if (FINS603_DISTINCTES) {
      variantes.forEach(function(v) {
        const A = db[v];
        A.family = main; A.familyTitle = M.title;
        Object.keys(db).forEach(function(id) {
          (db[id].choices || []).forEach(function(c) {
            if (c.next !== v) return;
            c.effects = (c.effects || []).slice();
            if (!c.effects.some(function(e) { return e.type === 'SET_FLAG' && e.target === 'variante_' + v; })) c.effects.push({ type: 'SET_FLAG', target: 'variante_' + v });
          });
        });
        A.getDynamicNarrative = function(gs) { return gs.hasFlag('variante_' + v) ? db[main].getDynamicNarrative(gs) : rendu(v, gs); };
        if (!A.image && M.image) A.image = M.image;
        if (M.postEnding) A.postEnding = true;
      });
      return;
    }
    // Reroute : chaque choix menant à une variante mène à la fin principale.
    Object.keys(db).forEach(function(id) {
      (db[id].choices || []).forEach(function(c) {
        const v = c.next; if (variantes.indexOf(v) < 0) return;
        c.next = main;
        c.effects = (c.effects || []).slice();
        c.effects.push({ type: 'SET_FLAG', target: 'variante_' + v });
        const ach = db[v].achievementId;
        if (ach && !c.effects.some(function(e) { return e.type === 'UNLOCK_ACHIEVEMENT' && e.target === ach; })) c.effects.push({ type: 'UNLOCK_ACHIEVEMENT', target: ach });
      });
    });
    // Alias : l'ancienne scène affiche la variante sous le titre principal.
    variantes.forEach(function(v) {
      const A = db[v];
      A.aliasOf = main; A.title = M.title;
      A.getDynamicNarrative = function(gs) { return rendu(v, gs); };
      if (M.postEnding) A.postEnding = true;
      if (M.image && !A.image) A.image = M.image;
    });
  });
}
function applyFins54_() {
  if (_fins54Applied) return;
  _fins54Applied = true;
  if (typeof DB !== 'undefined') _fins54Apply_(DB, FINS54_GROUPES);
  if (typeof DB !== 'undefined') {
    // Images existantes plus justes que le Trône pour les deux fins de Séraphine.
    const serre = 'https://cdn.jsdelivr.net/gh/Sunstrader/elenya-3d-assets@main/game-v54/backgrounds/serre.webp';
    const autel = 'https://cdn.jsdelivr.net/gh/Sunstrader/Releases@main/Acte%203/Autel_int%C3%A9rieur_avec_%C3%A9p%C3%A9e_bris%C3%A9e_202606191345.jpeg';
    if (DB.FIN_SERAPHINE_COEUR) DB.FIN_SERAPHINE_COEUR.image = serre;
    if (DB.FIN_SERAPHINE) DB.FIN_SERAPHINE.image = serre;
    if (DB.FIN_SERAPHINE_LAME) DB.FIN_SERAPHINE_LAME.image = autel;
    if (DB.FIN_HIVER) {
      const hiverImg = DB.FIN_HIVER.image;
      DB.FIN_HIVER.image = function(gs) { return gs.hasFlag('variante_FIN_SERAPHINE_LAME') ? autel : (typeof hiverImg === 'function' ? hiverImg(gs) : hiverImg); };
    }
  }
  if (typeof NGPLUS_DB !== 'undefined') {
    _fins54Apply_(NGPLUS_DB, FINS54_NG_GROUPES);
    const S = NGPLUS_DB.NGP_01_SEUIL;
    if (S && !S._seraphine54) {
      S._seraphine54 = true;
      const base = _fins54Narr_(S);
      S.getDynamicNarrative = function(gs) {
        const a = gs.achievements || [];
        let echo = '';
        if (a.indexOf('ach_fin_seraphine_coeur') >= 0) echo = 'Une odeur de cire et de lampe froide te traverse. Une voix qui n’est pas encore née dans ce cycle dit ton nom comme on garde une flamme : Séraphine. Elle ne te connaît pas. Toi, tu te souviens de sa main.';
        else if (a.indexOf('ach_fin_seraphine_lame') >= 0) echo = 'Un éclat de verre blanc dans ta mémoire : Séraphine, une lame entre vous, et le sceau que tu as choisi plutôt qu’elle. Ce cycle-ci, elle te regardera sans savoir pourquoi tu baisses les yeux.';
        return base(gs) + (echo ? '\n\n' + echo : '');
      };
    }
    const L = NGPLUS_DB.NG_FIN_LIBERATION;
    if (L && !L._seraphine54) {
      L._seraphine54 = true;
      const baseL = L.getDynamicNarrative;
      L.getDynamicNarrative = function(gs) {
        const a = gs.achievements || [];
        const t = baseL(gs);
        return a.indexOf('ach_fin_seraphine_coeur') >= 0 && !ngVariante6081_(gs) ? t + '\n\nQuelque part dans la ville, une lampe s’allume à la fenêtre du Conclave. Tu sais qui la tient. Cette fois, personne ne vous obligera à vous cacher pour la regarder brûler.' : t;
      };
    }
  }
}

// ===== 55.0 : CONSÉQUENCES DIFFÉRÉES ET ROMANCES QUI PEUVENT FINIR =====
// Chaque écho relit un choix ancien qui, jusqu’en 54, était noté puis oublié.
// 60.1 (qa V59 #1, audit) : FIN_POLY lisible. Le consentement reste la seule porte (trio_accord) ; au Trône,
// le texte dit si l’accord tient encore, ou ce qui l’a défait.
function raisonsPoly601_(gs) {
  const r = [];
  if (!companionPresentO(gs)) r.push("Kaelen n’est plus là pour le tenir");
  if (!companionPresentE(gs)) r.push("Alistair n’est plus là pour le tenir");
  if (gs.hasFlag('romance_O_rompue')) r.push("Kaelen a repris sa main");
  if (gs.hasFlag('romance_E_rompue')) r.push("Alistair a cessé de prier pour toi");
  if (dominationRomance6032_(gs)) r.push("tu as voulu commander là où il fallait demander"); // 60.3.3 (romance P4)
  if (gs.hasFlag('amis_O') || gs.hasFlag('amis_O_ferme')) r.push("Kaelen t’a dit ami, et il le reste");
  if (gs.hasFlag('amis_E') || gs.hasFlag('amis_E_ferme')) r.push("Alistair t’a dit ami, et il le reste");
  if (gs.hasFlag('trio_question_refermee_6033')) r.push("tu as refermé la question toi-même");
  if ((gs.getGauge('lien_O') || 0) < 3 && companionPresentO(gs)) r.push("le lien avec Kaelen s’est relâché en chemin");
  if ((gs.getGauge('lien_E') || 0) < 3 && companionPresentE(gs)) r.push("le lien avec Alistair s’est relâché en chemin");
  return r;
}
function textePoly601_(gs) {
  if (!gs.hasFlag('trio_accord')) return '';
  const r = raisonsPoly601_(gs);
  return r.length ? "L’accord du dôme te revient, intact dans ta mémoire, mais il ne tient plus ici : " + r.join(', ') + ". Le Trône ne te proposera pas d’être trois."
    : "L’accord du dôme tient encore. Ils sont là tous les deux, et aucun ne baisse les yeux : si tu le demandes, le Trône vous laissera rester trois.";
}
const RECIT55_ECHOS = [
  ['ACTE4_09_TRONE_EBENE', gs => gs.hasFlag('trio_accord'), gs => textePoly601_(gs)],
  ['ACTE3_08_MISE_AU_POINT', gs => gs.getGauge('possession') >= 4 && !gs.hasFlag('veyra_pacte_accepte'), "Entre deux rafales, une voix de femme, tout près de ton oreille : « Égale. » Tu te retournes. Il n’y a que le vent, et Fen qui gronde vers rien."],
  ['ACTE3_08_MISE_AU_POINT', gs => gs.hasFlag('combat_mine_O') && companionPresentO(gs), "Kaelen frotte encore l’entaille de la mine sur son avant-bras, celle qu’il a prise à ta place. Il ne la montre pas. Il ne la cache pas non plus."],
  ['ACTE3_09_VILLAGE_CACHE', gs => gs.hasFlag('venin_ignore'), "Oraya regarde la veine noire à ton bras. « Tu l’as laissée monter exprès. » Ce n’est pas une question. « Tu as toujours confondu le courage et le mépris de toi-même. »"],
  ['ACTE3_09B_BIVOUAC_TEMPETE', gs => gs.hasFlag('refus_deux_auberge') && companionPresentO(gs) && companionPresentE(gs), "Personne ne reparle de la mansarde, ni de la nuit où tu les as renvoyés tous les deux. Mais ils dorment de part et d’autre du feu, exactement à égale distance de toi, comme s’ils s’étaient mis d’accord."],
  ['ACTE4_01_DEPART_VILLAGE', gs => gs.hasFlag('venin_cauterise'), "Sous ton gant, l’écaille blanche de la veine gelée ne fond pas. Elle ne fondra plus. Tu as payé en givre, et le givre se souvient de ce qu’on lui doit."],
  ['ACTE4_01_HALTE_DOME', gs => gs.hasFlag('nuit_fen_repos'), "Fen se cale contre ton flanc, comme la nuit de l’auberge où tu as choisi le sommeil plutôt que les hommes. Il s’en souvient, visiblement. Il ronronne presque, ce qui est absurde pour un furet."],
  ['ACTE4_05_ARRIVEE_PORTES_1', gs => gs.hasFlag('silas_ami') || gs.hasFlag('silas_verite_acceptee'), "Sur la dernière borne avant les Portes, quelqu’un a noué un ruban de marchand. Dessous, gravé au couteau : « Trois patrouilles à l’est. — S. » Silas paie sa dette à sa façon : de loin, et sans signer en entier."],
  ['ACTE4_05_ARRIVEE_PORTES_1', gs => gs.hasFlag('silas_bouton_pille') && !gs.hasFlag('silas_ami'), "Un éclaireur de l’Ordre gît près des Portes, gelé depuis la veille. À sa ceinture pend une bourse que tu reconnais : celle que tu as prise à Silas. Quelqu’un l’a revendue. L’Ordre savait donc que tu passerais par la forêt rousse."],
  ['ACTE4_05_ARRIVEE_PORTES_1', gs => gs.hasFlag('silas_ignore') && !gs.hasFlag('silas_ami'), "Un colporteur emmitouflé attend près des Portes. Ce n’est pas Silas. Mais il te regarde comme lui : comme on regarde une rumeur qui marche."],
  ['ACTE4_06_MASQUE_TOMBE_1', gs => gs.hasFlag('insigne_alistair_ramasse') && companionPresentE(gs), "Il porte encore le médaillon que tu avais ramassé pour lui dans la neige. Il le pose entre vous avant de parler, comme une pièce à conviction contre lui-même."],
  ['ACTE4_06_MASQUE_TOMBE_1', gs => gs.hasFlag('felure_E_reparee'), "Tu as déjà lu la lettre. Tu sais maintenant à quoi Séraphine lui demandait d’être prêt."],
  ['ACTE4_06_OMBRE_AVEU', gs => gs.hasFlag('elenya_soin_kaelen_tempete'), "Sans y penser, il touche l’épaule que tu as soignée pendant la tempête. Il parle mieux quand il a une raison de croire que tu ne frapperas pas."],
  ['ACTE4_06_OMBRE_AVEU', gs => gs.hasFlag('kaelen_demi_verite'), "« Je t’avais promis la suite pour les Portes, » dit-il. « La voilà. »"],
  ['ACTE4_07_ADIEU_KALTHAR', gs => gs.hasFlag('fen_a_bu_givre'), "« Tu m’as nourri, cette nuit-là, » dit-il. « Avec ton givre. C’est pour ça que j’ai encore une voix ce soir. Je te la rends. »"],
  ['ACTE4_08_CORRIDOR_OBSIDIENNE', gs => gs.hasFlag('seraphine_page_gardee'), "La page du registre que tu as gardée te brûle presque à travers la poche : « Promise à la Lame Blanche. » Tu ne lui as jamais dit que tu la portais sur toi."],
  ['ACTE4_08_SEUIL_ETERNITE', gs => gs.hasFlag('nomade_offrande_couronne'), "Le fragment de couronne que tu as donné au Nomade repose sur la première marche. Il est arrivé avant toi. À moins qu’il ne t’ait jamais quittée."],
  ['ACTE4_09_TRONE_EBENE', gs => gs.hasFlag('veyra_rejetee'), "Quelque part dans l’obsidienne, une femme rit doucement : celle que tu as refusée à l’autel. Elle n’est pas partie. Elle attend de voir si tu vas lui donner raison."],
  ['ACTE4_09_TRONE_EBENE', gs => gs.hasFlag('romance_O_rompue') && companionPresentO(gs), "Kaelen se tient à trois pas, ni plus près ni plus loin. Il a tenu parole : il est là, et il n’est plus à toi."],
  ['ACTE4_09_TRONE_EBENE', gs => gs.hasFlag('romance_E_rompue') && companionPresentE(gs), "Alistair marche derrière toi, comme il l’avait dit. Il ne prie plus pour toi. Il prie pour que tu choisisses bien."],
  ['ACTE4_09_TRONE_EBENE', gs => gs.hasFlag('felure_O_reparee') && companionPresentO(gs), "Kaelen ne plaisante pas en voyant le Trône. C’est sa façon de te dire qu’il reste."],
  ['ACTE4_09_TRONE_EBENE', gs => gs.hasFlag('felure_E_reparee') && companionPresentE(gs), "Alistair a rangé la lettre de sa sœur contre son cœur. Ce soir, il ne cache plus rien."]
];
let _recit55Applied = false;
function applyRecit55_() {
  if (_recit55Applied || typeof DB === 'undefined') return;
  _recit55Applied = true;
  const parScene = {};
  RECIT55_ECHOS.forEach(e => { (parScene[e[0]] = parScene[e[0]] || []).push(e); });
  Object.keys(parScene).forEach(id => {
    const S = DB[id]; if (!S) return;
    S.getDynamicNarrative = _echosEmpiles601_(id, _fins54Narr_(S), parScene[id]);
  });
  // Une romance finie ferme la fin du compagnon et le trio, jamais l’alliance.
  const ferme = { FIN_OMBRE: ['O'], FIN_ECLAIREUR: ['E'], FIN_POLY: ['O', 'E'] };
  Object.keys(DB).forEach(id => (DB[id].choices || []).forEach(c => {
    const routes = ferme[c.next]; if (!routes) return;
    const old = c.condition;
    c.condition = gs => routes.every(r => !gs.hasFlag('romance_' + r + '_rompue')) && (old ? old(gs) : true);
  }));
  // La scène « La Lame à Nu » redevient accessible depuis l’aveu de Kaelen.
  const aveu = DB.ACTE4_06_OMBRE_AVEU;
  if (aveu && DB.ACTE4_06B_TEST_KAELEN && !aveu.choices.some(c => c.key === 'PREUVE')) {
    aveu.choices.push({ key: 'PREUVE', importance: 'major', text: "« Prouve-le. »",
      condition: gs => companionPresentO(gs) && !dominationActive59_(gs) && !gs.hasFlag('romance_O_rompue'), // 60 (continuité V59 N5)
      effects: [{ type: 'SET_FLAG', target: 'kaelen_preuve_demandee' }],
      response: "Il ne s’offusque pas. Il a l’air presque soulagé qu’on lui demande enfin quelque chose de concret.",
      next: 'ACTE4_06B_TEST_KAELEN' });
  }
}

// ===== 56.0 : UNE RUPTURE FERME TOUTES LES PORTES ROMANTIQUES =====
// Toute option romantique vers Kaelen (O) ou Alistair (E) exige l’absence de rupture,
// quelles que soient les jauges (présence, affinité, lien) ou d’anciens drapeaux.
const ROMANCE56_SCENES = /SPICY|^R_[OE]_|NUIT_INVITE|ROMANCE_URGENCE|LIEN_LISIERE|^FIN_(OMBRE|ECLAIREUR|POLY)$/;
const ROMANCE56_EXCLUS = { PROPOSER_REFUS: 1 };
let _romance56Applied = false;
function romance56Routes_(c) {
  const routes = [];
  const t = String(c.target || '');
  const roman = c.intent === 'romance' || ROMANCE56_SCENES.test(String(c.next || ''));
  if (!roman) return routes;
  if (/Kaelen/.test(t) || /^O_|_O$/.test(c.key || '') || /_KAELEN|_O(_|$)/.test(String(c.next || ''))) routes.push('O');
  if (/Alistair/.test(t) || /^E_|_E$/.test(c.key || '') || /_ALISTAIR|_E(_|$)/.test(String(c.next || ''))) routes.push('E');
  if (c.next === 'FIN_POLY') { if (routes.indexOf('O') < 0) routes.push('O'); if (routes.indexOf('E') < 0) routes.push('E'); }
  return routes;
}
function applyRomance56_() {
  if (_romance56Applied || typeof DB === 'undefined') return;
  _romance56Applied = true;
  Object.keys(DB).forEach(id => {
    if (/^ROMANCE_FELURE_/.test(id)) return;
    (DB[id].choices || []).forEach(c => {
      if (ROMANCE56_EXCLUS[c.key]) return;
      const routes = romance56Routes_(c); if (!routes.length) return;
      const old = c.condition;
      c.condition = gs => routes.every(r => !gs.hasFlag('romance_' + r + '_rompue')) && (old ? old(gs) : true);
      c._rupture56 = routes.join('');
    });
  });
}

// ===== 56.0 : CONSÉQUENCES PERCEPTIBLES (choix majeurs → échos) =====
// On relie des drapeaux de catégorie A/B déjà posés, sans inventer des dizaines de scènes.
const RECIT56_ECHOS = [
  ['ACTE2_08_MATIN_AUBERGE', gs => gs.hasFlag('jalousie_auberge_vue'), "Ce matin, personne ne nomme la jalousie d’hier soir. Elle est quand même dans la pièce, posée entre les bols."],
  ['ACTE3_01_FRONTIERE_1', gs => gs.hasFlag('main_tendue_crevasse'), "Tu te souviens de la main tendue au-dessus du vide. Celle qui l’a prise — ou refusée — change encore la façon dont tu marches ici."],
  ['ACTE3_08_MISE_AU_POINT', gs => gs.hasFlag('kaelen_refuse'), "Kaelen te regarde de biais. Il a déjà dit non une fois. Il n’a pas oublié que tu l’as entendu."],
  ['ACTE3_08_MISE_AU_POINT', gs => gs.hasFlag('alistair_refuse'), "Alistair garde ses distances, pas par froideur : par respect pour le non qu’il t’a opposé, et pour le tien."],
  ['ACTE4_01_DEPART_VILLAGE', gs => gs.hasFlag('mira_payee'), "Une boutique sans enseigne a laissé une pièce sur le rebord. Mira a été payée. Elle le dira, si on lui demande."],
  ['ACTE4_01_DEPART_VILLAGE', gs => gs.hasFlag('mira_rejetee'), "Tu croises un regard de fille des toits. Mira n’a rien reçu de toi. Elle n’oublie pas les dettes, même celles qu’on refuse."],
  ['ACTE4_05_ARRIVEE_PORTES_1', gs => gs.hasFlag('lyra_a_parle') && !gs.hasFlag('lyra_punie'), "Une note de chant, très loin. Lyra a parlé — et tu l’as laissée faire. Le son n’est plus une arme. Pas tout à fait."],
  ['ACTE4_05_ARRIVEE_PORTES_1', gs => gs.hasFlag('lyra_punie'), "Le silence autour des portes est trop propre. Tu as puni Lyra. La Citadelle s’en souvient mieux que toi."],
  ['ACTE4_06_OMBRE_AVEU', gs => gs.hasFlag('joute_predatrice'), "Kaelen reconnaît le geste : celui de la joute où tu as choisi de mordre plutôt que de céder. Il n’a pas peur. Il vérifie."],
  ['ACTE4_06_OMBRE_AVEU', gs => gs.hasFlag('joute_fragile'), "Kaelen te regarde autrement. À la joute, tu as montré ta fragilité. Il la traite comme une arme qu’on ne rend pas."],
  ['ALISTAIR_LETTRE_SOEUR', gs => gs.hasFlag('bivouac_glace_repare'), "Alistair touche la pierre. « On a déjà réparé quelque chose ensemble, » dit-il, sans préciser quoi. Tu te souviens du bivouac."],
  ['ALISTAIR_LETTRE_SOEUR', gs => gs.hasFlag('bivouac_glace_isole'), "Alistair ne cherche pas ta chaleur. Au bivouac, tu t’étais isolée. Il a appris à ne plus proposer."],
  ['ACTE4_09_TRONE_EBENE', gs => gs.hasFlag('kalthar_larme_souvenir'), "Une larme de Kalthar, quelque part dans ta mémoire. Tu l’as gardée. Le Trône la sent."],
  ['ACTE4_09_TRONE_EBENE', gs => gs.hasFlag('kalthar_larme_rejet'), "Tu as rejeté la larme de Kalthar. Le Trône n’en parle pas. Fen, lui, baisse la tête."],
  ['ACTE4_09_TRONE_EBENE', gs => gs.hasFlag('frag3_pacte_dit'), "Le pacte dit à voix haute dans le fragment revient ici, plus lourd. Tu ne peux plus prétendre ne pas savoir ce qu’il coûtait."],
  ['ACTE4_09_TRONE_EBENE', gs => gs.hasFlag('frag4_silence'), "Tu as choisi le silence devant le dernier fragment. Le Trône te le rend : un blanc où aurait dû se trouver un nom."],
  ['ACTE4_09_TRONE_EBENE', gs => gs.hasFlag('dette_rendue_aux_deux'), "Tu as rendu la dette aux deux. Ni Kaelen ni Alistair n’est plus un créancier. Ça change la façon dont ils te regardent régner."],
  ['ACTE5_01_LENDEMAIN', gs => gs.hasFlag('dette_abolition_voulue') || gs.hasFlag('dette_abolie_structurellement'), "Quelqu’un, dans la file, parle d’une dette abolie. Ce n’est plus une rumeur : c’est un de tes gestes."],
];
let _recit56Applied = false;
function applyRecit56_() {
  if (_recit56Applied || typeof DB === 'undefined') return;
  _recit56Applied = true;
  const par = {};
  RECIT56_ECHOS.forEach(e => { (par[e[0]] = par[e[0]] || []).push(e); });
  Object.keys(par).forEach(id => {
    const S = DB[id]; if (!S) return;
    S.getDynamicNarrative = _echosEmpiles601_(id, _fins54Narr_(S), par[id]);
  });
}

// ===== 57.0 : TOUS LES DRAPEAUX A/B RELIÉS À UNE CONSÉQUENCE PERCEPTIBLE =====
const RECIT57_ECHOS = [
  // — Acte 1 —
  ['LIEN_MARCHE_1', gs => gs.hasFlag('ton_sarcasme'), "Ton ton coupant de tout à l’heure flotte encore. Fen marche un pas plus loin que d’habitude, comme pour ne pas se couper."],
  ['ACTE1_08B_BIVOUAC_LISIERE', gs => gs.hasFlag('lisiere_confiance_E'), "Alistair a répondu pour lui, pas pour l’Ordre. Il le regrette déjà un peu, et il te regarde comme on regarde quelqu’un qui garde un secret."],
  ['ACTE1_08B_BIVOUAC_LISIERE', gs => gs.hasFlag('lisiere_flirt_E'), "Alistair rougit encore quand tu tends la main vers le feu. Il prie moins fort ce soir, et il le sait."],
  ['ACTE1_08B_BIVOUAC_LISIERE', gs => gs.hasFlag('jalousie_kaelen_contenue'), "« Jaloux ? » Le mot reste entre vous. Kaelen ne l’a pas nié. Il ne l’a pas avoué non plus. Il l’a rangé, comme une lame."],
  // — Acte 2 —
  ['ACTE2_01B_SILAS_CONFIDENCE', gs => gs.hasFlag('silas_a_parle_1'), "Silas a parlé parce que tu l’as pressé. Il s’en souviendra : chez les contrebandiers, celle qui force une parole en devient responsable."],
  ['ACTE2_08_MATIN_AUBERGE', gs => gs.hasFlag('elenya_soin_alistair_matin'), "Alistair a gardé le manteau plié sur son bras. Tu lui as demandé s’il avait dormi. Personne ne lui avait posé la question depuis des années."],
  ['ACTE2_08_MATIN_AUBERGE', gs => gs.hasFlag('nuit_fen_amis'), "Fen a dormi roulé contre ta botte. Rien d’autre ne s’est passé, et c’est précisément ce qui le rend si léger ce matin."],
  ['ACTE2_08_MATIN_AUBERGE', gs => gs.hasFlag('alistair_a_vu_refus_O'), "Alistair a vu Kaelen reprendre sa place hier soir. Il ne dit rien. Il pose seulement sa tasse un peu plus loin de la sienne."],
  ['ACTE2_08_MATIN_AUBERGE', gs => gs.hasFlag('kaelen_a_vu_refus_E'), "Kaelen a vu Alistair repartir seul hier soir. Il sourit à moitié. Il ne l’encaisse pas comme une victoire. Il compte les refus comme d’autres comptent les pièces."],
  ['ACTE2_10_RAVIN', gs => gs.hasFlag('bivouac_glace_joute'), "Depuis la joute du bivouac, chaque pas sur la glace ressemble à une question qu’on n’a pas fini de poser."],
  ['ACTE2_10_RAVIN', gs => gs.hasFlag('joute_intime_E'), "Alistair marche à ta droite. Tu lui as dit que sa foi était une lumière. Il essaie, maladroitement, de ne pas te faire mentir."],
  ['ACTE2_10_RAVIN', gs => gs.hasFlag('joute_intime_O'), "« Mon seul regret est de ne pas me souvenir de toi. » Kaelen n’a pas répondu. Il marche plus près, sans te toucher."],
  ['ACTE2_15_SOUVENIRS_MINE', gs => gs.hasFlag('combat_mine_E'), "Alistair porte encore la trace de ce que tu lui as dit dans la mine. Ses idoles ne sont pas brisées. Elles sont fêlées, et il le voit."],
  ['ACTE2_15_SOUVENIRS_MINE', gs => gs.hasFlag('combat_mine_S'), "Tu as refermé le livre d’acier sans un mot. Le silence de la mine te ressemble plus que tu ne voudrais."],
  ['ACTE2_17_RETROUVAILLES_SORTIE', gs => gs.hasFlag('nuit_intense_E'), "Alistair ne cache pas d’où il vient. Il a passé la nuit près de toi et ne demande pas pardon à son dieu pour ça."],
  ['ACTE2_17_RETROUVAILLES_SORTIE', gs => gs.hasFlag('nuit_intense_O'), "Kaelen a répondu à ton geste. Ce matin il est plus calme, presque prudent, comme si la nuit l’avait endetté envers toi."],
  ['ACTE2_17_RETROUVAILLES_SORTIE', gs => gs.hasFlag('nuit_nord_S'), "Tu reviens des générateurs avec du givre dans les cils. Seule, tu as entendu le Nord respirer. Tu marches mieux."],
  ['ACTE2_12_QS_FLEURS', gs => gs.hasFlag('secret_ancetre_kaelen'), "Le souvenir de l’ancêtre de Kaelen te suit entre les fleurs. Tu sais d’où vient sa dette. Lui ne sait pas que tu sais."],
  ['ACTE2_12_QS_FLEURS', gs => gs.hasFlag('verite_lignee_alistair'), "Tu as vu la lignée d’Alistair. Le médaillon pèse plus lourd à son cou depuis que tu le lui as rendu."],
  ['ACTE3_01_FRONTIERE_1', gs => gs.hasFlag('nomade_aborde'), "Le nomade à qui tu as parlé a laissé une trace de pas vers le nord. Il t’a crue. C’est rare, ici."],
  ['ACTE3_01_FRONTIERE_1', gs => gs.hasFlag('nomade_ignore'), "Tu as ignoré le nomade. La frontière le sait : aucun feu ne s’allume pour vous ce soir."],
  ['ACTE3_01_FRONTIERE_1', gs => gs.hasFlag('nomade_silence_partage'), "Une minute de silence avec un inconnu. Le Nord te la rend : le vent tombe quand tu passes."],
  ['ACTE3_10_ACCUEIL_CULTE_1', gs => gs.hasFlag('kaelen_main_partagee_tempete'), "Ta main a trouvé celle de Kaelen pendant la tempête. Il ne l’a pas mentionné depuis. Il ne l’a pas lâchée non plus."],
  ['ACTE3_01_FRONTIERE_1', gs => gs.hasFlag('joute_silence_O'), "Tu l’avais laissé décider, la dernière fois. Kaelen n’a pas aimé ce pouvoir-là. Il te le rend en te demandant ton avis."],
  ['ACTE3_01_FRONTIERE_1', gs => gs.hasFlag('kaelen_libre_choisir'), "« La porte est encore là. » Kaelen ne l’a pas prise. Il le rappelle, une fois, d’un regard."],
  // — Acte 3 —
  ['ACTE3_10_ACCUEIL_CULTE_1', gs => gs.hasFlag('seraphine_observatrice'), "Séraphine se souvient que tu as laissé Alistair parler à ta place. Elle s’adresse à lui d’abord. Puis, seulement, à toi."],
  ['ACTE4_01_DEPART_VILLAGE', gs => gs.hasFlag('seraphine_main'), "Séraphine ne parle pas du registre. Elle touche juste l’endroit de la neige où ta main a caché la ligne."],
  ['ACTE3_08_MISE_AU_POINT', gs => gs.hasFlag('romance_deferred_O_payoff'), "Kaelen t’a montré quelque chose qu’il ne pouvait pas facturer. Il recommence, un peu, à chaque halte."],
  ['ACTE3_08_MISE_AU_POINT', gs => gs.hasFlag('romance_deferred_O_closed'), "Kaelen a compris que tu n’avais pas oublié. Il ne demande plus. Il attend, sans rancune, à distance."],
  ['ACTE3_08_MISE_AU_POINT', gs => gs.hasFlag('romance_deferred_E_payoff'), "Alistair porte son sceau éteint sans le cacher. Tu l’as touché sans le rallumer. Il apprend à croire autrement."],
  ['ACTE3_08_MISE_AU_POINT', gs => gs.hasFlag('romance_deferred_E_closed'), "L’attente n’a pas ressemblé à un rejet. Alistair te le prouve en restant, simplement."],
  ['ACTE3_10_ACCUEIL_CULTE_1', gs => gs.hasFlag('solo_choix_definitif_acte3'), "Tu as dit à Oraya que tu marchais seule. Le culte l’a appris avant toi : on te regarde comme une femme qui ne doit rien à personne."],
  ['ACTE3_10_ACCUEIL_CULTE_1', gs => gs.hasFlag('solo_oraya_dette_rendue'), "Oraya porte la plaque sur sa poitrine. Elle ne te remercie pas. Rendre un souvenir n’est pas pardonner, et elle le sait."],
  ['ACTE3_10_ACCUEIL_CULTE_1', gs => gs.hasFlag('solo_oraya_limite_retrouvee'), "La plaque dans ta poche te rappelle la limite que tu avais posée toi-même. Les fidèles du culte reculent quand ils s’approchent trop."],
  ['ACTE3_10_ACCUEIL_CULTE_1', gs => gs.hasFlag('solo_oraya_passe_brise'), "Tu as brisé la plaque. Oraya ne te regarde plus comme son œuvre. Elle a peur, et la peur la rend honnête."],
  ['ACTE3_13_ARTEFACT', gs => gs.hasFlag('frag1_nom_cherche'), "Ton reflet dans le fragment avait failli te rendre ton nom. Ici, l’artefact murmure les deux premières lettres."],
  ['ACTE3_13_ARTEFACT', gs => gs.hasFlag('frag2_hesitation'), "« Je ne sacrifierai pas — » Tu t’étais interrompue devant le trône du souvenir. L’artefact attend la fin de la phrase."],
  ['ACTE3_13_ARTEFACT', gs => gs.hasFlag('frag3_ligne_ecoutee'), "Tu as écouté respirer la ligne de givre. Maintenant, l’artefact respire au même rythme. Tu sais où il cède."],
  ['ACTE3_13_ARTEFACT', gs => gs.hasFlag('verite_kalthar'), "L’épée brisée t’a montré Kalthar tel qu’il était. Fen se tait quand tu le regardes. Il sait ce que tu as vu."],
  ['ACTE3_13_ARTEFACT', gs => gs.hasFlag('frag_k_jeune_couronne'), "Dans la vision, tu as posé la couronne. Le jeune Kalthar ne l’a pas reprise. Tu commences à comprendre pourquoi Fen n’en veut pas."],
  // — Séraphine —
  ['ACTE4_01_HALTE_DOME', gs => gs.hasFlag('seraphine_lame_gardee'), "Séraphine porte toujours la dague que tu lui as laissée. Elle ne la tire plus pour menacer. Elle la touche pour se rassurer."],
  ['ACTE4_01_DEPART_VILLAGE', gs => gs.hasFlag('seraphine_brule_serments'), "Les serments de Séraphine ont brûlé. Elle a perdu des alliés pour ça, et elle te le dit sans reproche : « Ça valait la cendre. »"],
  ['ACTE4_09_TRONE_EBENE', gs => gs.hasFlag('seraphine_tenue'), "« Regarde-moi. Pas la Lame. » Séraphine s’en souvient. Elle te regarde maintenant avant de regarder ta main."],
  ['ACTE4_05_ARRIVEE_PORTES_1', gs => gs.hasFlag('trio_refuse'), "Tu leur as proposé d’essayer à trois, pour de vrai, sans forcer cette nuit. Ni Kaelen ni Alistair n’a dit non. Ils marchent côte à côte, mal à l’aise, honnêtes."],
  // — Veyra —
  ['ACTE4_05_ARRIVEE_PORTES_1', gs => gs.hasFlag('veyra_defiee'), "Tu as traité Veyra de menteuse. Aux portes, ses partisans s’écartent de toi : on ne contredit pas Veyra sans en payer le prix plus tard."],
  ['ACTE4_05_ARRIVEE_PORTES_1', gs => gs.hasFlag('veyra_ignoree'), "Tu es partie en silence devant Veyra. Elle déteste ça plus qu’une insulte. Ses messagers t’attendent déjà."],
  ['ACTE4_05_ARRIVEE_PORTES_1', gs => gs.hasFlag('veyra_fragment_brise'), "Le fragment de Veyra est brisé. Sa vérité ne vit plus dans un objet. Elle ne vit plus qu’en toi, et ça te rend dangereuse pour elle."],
  ['ACTE4_05_ARRIVEE_PORTES_1', gs => gs.hasFlag('veyra_mensonge_avoue'), "Veyra t’a rendu ce qu’elle avait retiré de l’histoire. Tu connais maintenant le passage manquant. Les portes, elles, ne le connaissent pas."],
  // — Acte 4 —
  ['ACTE4_06_MASQUE_TOMBE_2', gs => gs.hasFlag('alistair_confronte'), "« Montre-moi que tu ne mens pas encore. » Tu as été dure, et juste. Alistair encaisse. Il n’a pas d’excuse prête."],
  ['ACTE4_06B_TEST_KAELEN', gs => gs.hasFlag('kaelen_preuve_demandee'), "Tu lui as dit : prouve-le. Kaelen n’a jamais été aussi silencieux. Il préfère une épreuve à une absolution."],
  ['ACTE4_09_TRONE_EBENE', gs => gs.hasFlag('alistair_lettre_montree'), "La lettre de la sœur d’Alistair, vous l’avez lue ensemble. Il n’a plus de secret à protéger devant le Trône."],
  ['ACTE4_09_TRONE_EBENE', gs => gs.hasFlag('dette_solution_personnelle'), "Tu as choisi de libérer ceux que tu aimes, pas le monde entier. Le Trône trouve ça petit. Toi, tu trouves ça possible."],
  ['ACTE4_09_ISSUES_SECONDAIRES', gs => gs.hasFlag('veyra_fin_pouvoir'), "Tu as demandé son pouvoir à Veyra, rien d’autre. Le Trône t’en reconnaît le goût. Il t’ouvre les bras plus vite."],
  // — NG+ —
  ['NGP_02_NEUF_ECHOS', gs => gs.hasFlag('ngplus_couronne_reprise'), "La couronne de givre pèse déjà sur ton front. Tu l’as reprise avant toute réponse. Les neuf échos baissent la tête, comme devant une reine."],
  ['NGP_02_NEUF_ECHOS', gs => gs.hasFlag('ngplus_fen_interroge'), "« Toi, tu savais. » Fen ne nie pas. Il marche derrière toi maintenant, plus derrière tes pas qu’à côté."],
  ['NGP_02_NEUF_ECHOS', gs => gs.hasFlag('ngplus_memoire_acceptee'), "Tu as accepté de revoir les fins. Elles ne te font plus mal comme des souvenirs. Elles te parlent comme des témoins."],
  ['NGP_02_NEUF_ECHOS', gs => gs.hasFlag('ngplus_refus_initial'), "La stèle gelée ne parle plus. Tu as refusé que les vies passées dictent celle-ci. Les échos murmurent quand même, plus bas."],
  ['NGP_03_PALAIS_ECHO', gs => gs.hasFlag('ngplus_cherche_verite'), "Ce que toutes les fins avaient en commun : le reflet le sait. Il hésite à te le dire parce que tu l’as demandé tout haut."],
  ['NGP_03_PALAIS_ECHO', gs => gs.hasFlag('ngplus_defi_trone'), "Le Trône veut toujours quelqu’un dessus. Tu l’as dit. Dans le palais d’écho, le siège vide se retourne vers toi."],
  ['NGP_03_PALAIS_ECHO', gs => gs.hasFlag('ngplus_these_amour'), "Ce que vous faisiez de l’amour. La phrase résonne dans les couloirs du palais. Kalthar l’a entendue, quelque part."],
  ['NGP_04_FRESQUE_REPRISE', gs => gs.hasFlag('ngplus_colere_kalthar'), "Trois siècles de silence. Ta colère a fissuré le reflet. La fresque porte la même fissure, au même endroit."],
  ['NGP_04_FRESQUE_REPRISE', gs => gs.hasFlag('ngplus_pardon_prudent'), "Tu ne sais pas encore si tu peux pardonner. La fresque, elle, n’a jamais su. Vous vous ressemblez sur ce point."],
  ['NGP_04_FRESQUE_REPRISE', gs => gs.hasFlag('ngplus_promesse_kalthar'), "« Je te laisserai me dire la vérité. » Sur la fresque, une silhouette que tu n’avais jamais remarquée tient la bouche ouverte."],
  ['NGP_04_FRESQUE_REPRISE', gs => gs.hasFlag('ngplus_vie_avant_morts'), "Tu as choisi de vivre d’abord. La fresque te paraît plus petite. Les morts attendront, et ils le savent."],
  ['NGP_05_CONFRERIE', gs => gs.hasFlag('ngplus_briser_fresque'), "La fresque fendue a fait du bruit jusqu’ici. La Confrérie te reçoit comme on reçoit quelqu’un qui casse ce qu’il n’aime pas."],
  ['NGP_05_CONFRERIE', gs => gs.hasFlag('ngplus_fen_confession'), "Fen a parlé devant la fresque, parce que tu as attendu. Il ne se cache plus derrière son pelage. La Confrérie le voit : un roi, pas un renard."],
  ['NGP_05_CONFRERIE', gs => gs.hasFlag('ngplus_gardienne_gel'), "Tu as accepté d’être la gardienne du Gel. La Confrérie le sent sur ta peau et baisse les armes, prudemment."],
  ['NGP_05_CONFRERIE', gs => gs.hasFlag('ngplus_nom_cycle'), "Tu cherches le nom de celui qui a créé le cycle. Un archiviste détourne les yeux trop vite."],
  ['NGP_06_DEUX_PORTES', gs => gs.hasFlag('ngplus_contrat_kaelen'), "Le contrat de Kaelen, tu l’as lu. Tu sais ce qu’il a vendu et à qui. La porte de l’Ombre s’ouvre d’un cran, sans effort."],
  ['NGP_06_DEUX_PORTES', gs => gs.hasFlag('ngplus_sceau_leonhart'), "L’origine du Sceau Leonhart n’a plus de secret. La porte de l’Éclat brille moins, comme humiliée."],
  ['NGP_06_DEUX_PORTES', gs => gs.hasFlag('ngplus_deux_marques'), "Les deux marques te suivent. Devant les portes, elles brûlent ensemble : aucune ne veut que tu choisisses l’autre."],
  ['NGP_06_DEUX_PORTES', gs => gs.hasFlag('ngplus_marques_brisees'), "Les marques sont en cendres. Les deux portes ne te reconnaissent plus. Tu devras les ouvrir à la main."],
  ['NGP_13_BRASIER', gs => gs.hasFlag('ngplus_contrat_source'), "Le premier contrat avait un auteur. Tu l’as demandé à Kaelen. L’écho de l’Ombre te répond par un nom raturé."],
  ['NGP_13_BRASIER', gs => gs.hasFlag('ngplus_kaelen_baiser'), "Kaelen a réduit lui-même la distance. Dans l’écho, il ne te touche plus comme un fantôme. Il te touche comme un choix."],
  ['NGP_13_BRASIER', gs => gs.hasFlag('ngplus_kaelen_libre'), "« Trouve-la. » Kaelen cherche sa liberté sans toi. Il revient quand même, de temps en temps, pour te dire où il en est."],
  ['NGP_13_BRASIER', gs => gs.hasFlag('ngplus_alistair_baiser'), "Alistair a choisi le baiser et t’a rendu la clé. Il n’a plus besoin de permission divine. Ça le terrifie et le libère."],
  ['NGP_13_BRASIER', gs => gs.hasFlag('ngplus_alistair_libre'), "La porte reste ouverte pour Alistair. Il ne la franchit pas. Il la regarde comme une preuve que tu ne le retiens pas."],
  ['NGP_13_BRASIER', gs => gs.hasFlag('ngplus_sceau_source'), "Le premier sceau a été forgé par quelqu’un qui avait peur de toi. Alistair pâlit quand l’écho le confirme."],
  ['NGP_10_ORAYA', gs => gs.hasFlag('ngplus_route_none'), "Tu as gelé les deux portes. Oraya te voit arriver seule, et elle, qui a toujours su quoi t’offrir, ne sait pas quoi te proposer."],
  ['NGP_11_LYRA', gs => gs.hasFlag('ngplus_architecte_demande'), "Tu as exigé le nom de l’architecte. Lyra l’a entendu à travers les murs. Elle chante une note de trop, pour te prévenir."],
  ['NGP_11_LYRA', gs => gs.hasFlag('ngplus_oraya_pardon'), "Tu as pardonné à Oraya sans l’absoudre. Lyra te regarde avec méfiance : elle se demande si ce pardon s’étendra à elle."],
  ['NGP_11_LYRA', gs => gs.hasFlag('ngplus_oraya_punition'), "Oraya n’aura pas ton pardon. Lyra le sait. Elle parle plus vite, pour ne pas subir le même jugement."],
  ['NGP_11_LYRA', gs => gs.hasFlag('ngplus_oraya_silence'), "Tu as laissé Oraya seule avec ce qu’elle a fait. Lyra trouve ce silence plus cruel qu’une sentence."],
  ['NGP_12_FEN', gs => gs.hasFlag('ngplus_lyra_chant'), "Vous avez chanté sans magie, Lyra et toi. Fen fredonne encore l’air en marchant. Il n’a pas chanté depuis trois siècles."],
  ['NGP_12_FEN', gs => gs.hasFlag('ngplus_lyra_liberee'), "La voix de Lyra est à elle. Fen le note : « Tu as fait pour elle ce que personne n’a fait pour moi. »"],
  ['NGP_12_FEN', gs => gs.hasFlag('ngplus_lyra_pouvoir'), "Lyra garde son pouvoir pour elle-même. Fen hoche la tête. Il connaît le prix d’un pouvoir qu’on ne prête à personne."],
  ['NGP_14_TRONE_BRIS', gs => gs.hasFlag('ngplus_kalthar_amour'), "Il t’a aimée. Ou protégée. La réponse de Kalthar, tu la portes devant le Trône brisé, et elle te rend moins seule."],
  ['NGP_14_TRONE_BRIS', gs => gs.hasFlag('ngplus_kalthar_lache'), "Tu l’as laissé partir. Le Trône brisé n’a plus de roi à réclamer. Il ne réclame que toi."],
  ['NGP_14_TRONE_BRIS', gs => gs.hasFlag('ngplus_kalthar_silence'), "Tu l’as serré sans réponse. Kalthar n’a pas parlé. Devant le Trône, son silence te protège encore."],
  ['NGP_14_TRONE_BRIS', gs => gs.hasFlag('ngplus_miroirs_brises'), "Les miroirs des fins sont brisés. Le Trône ne peut plus te montrer ce que tu deviendras. Il doit te demander."],
  ['NGP_15_DERNIER_CHOIX', gs => gs.hasFlag('ngplus_trone_garde'), "Tu gardes le Trône et promets de ne jamais l’utiliser. Il te croit à moitié. C’est déjà beaucoup."],
  ['NGP_15_DERNIER_CHOIX', gs => gs.hasFlag('ngplus_trone_sacrifice'), "Tu t’es offerte à sa place. Le Trône a refusé, ou accepté : tu ne sais pas encore. Ce dernier choix te le dira."],
];
// 60.8.1 (narration P1-1/2) : une variante NG+ rend la narration de NG_FIN_LIBERATION ; les échos et la lampe
// propres à LIBERATION ne doivent pas s'y ajouter une seconde fois (phrases doublées, lampe du Conclave partout).
function ngVariante6081_(gs) { return (gs.flags || []).some(f => String(f).indexOf('variante_NG_') === 0) || ['NG_FIN_AMOUR','NG_FIN_DEUX_MAINS','NG_FIN_FRONTIERE','NG_FIN_VIDE'].some(v => gs.hasFlag && gs.hasFlag('variante_' + v)); }
// toString renvoie la condition d'origine : les audits statiques y lisent les drapeaux requis.
const ngEcho6081_ = (fin, c) => { if (fin !== 'NG_FIN_LIBERATION') return c; const w = gs => !ngVariante6081_(gs) && c(gs); w.toString = () => c.toString(); return w; };
// Fins NG+ : chaque décision finale colore toutes les fins NG+.
['NG_FIN_AMOUR','NG_FIN_CYCLE','NG_FIN_DEUX_MAINS','NG_FIN_FRONTIERE','NG_FIN_LIBERATION','NG_FIN_VIDE'].forEach(fin => {
  RECIT57_ECHOS.push(
    [fin, ngEcho6081_(fin, gs => gs.hasFlag('ngplus_final_amour')), "Tu as tendu la main sans retenir personne. Ceux qui sont restés le font pour eux-mêmes."],
    [fin, ngEcho6081_(fin, gs => gs.hasFlag('ngplus_final_cycle')), "Tu as refusé de laisser Kalthar partir. Le cycle reprend, et tu le sais."],
    [fin, ngEcho6081_(fin, gs => gs.hasFlag('ngplus_final_frontiere')), "Tu es devenue la frontière. Le Brasier te touche sans franchir ta peau."],
    [fin, ngEcho6081_(fin, gs => gs.hasFlag('ngplus_final_libre')), "Tu avances sans couronne. Ta tête est plus légère que tu ne l’aurais cru."],
    [fin, ngEcho6081_(fin, gs => gs.hasFlag('ngplus_final_trone')), "Tu es retournée une dernière fois vers le Trône. Il s’en souviendra, même brisé."],
    [fin, ngEcho6081_(fin, gs => gs.hasFlag('ngplus_final_void')), "Tu as laissé le silence décider. Il a décidé doucement."],
    // 60.8.1 : nommer l'architecte mène toujours à LIBERATION (ngplus_final_libre) ; l'écho n'appartient qu'à elle.
    [fin, ngEcho6081_(fin, gs => fin === 'NG_FIN_LIBERATION' && gs.hasFlag('ngplus_architecte_nomme_57')), "Tu as nommé l’architecte : toi, la première. Le cycle ne se referme pas derrière toi, parce que tu sais enfin pourquoi il avait été construit."]
  );
});
let _recit57Applied = false;
function _echos57Apply_(db, liste) {
  const par = {};
  liste.forEach(e => { (par[e[0]] = par[e[0]] || []).push(e); });
  Object.keys(par).forEach(id => {
    const S = db[id]; if (!S) return;
    const base = _fins54Narr_(S), echos = par[id];
    S.getDynamicNarrative = _echosEmpiles601_(id, base, echos);
    // La source inspectée (QA) reste celle du texte de base, enrichie des échos.
    const src = String(base) + '\n' + echos.map(e => String(e[1]) + ' ' + e[2]).join('\n');
    S.getDynamicNarrative.toString = () => src;
  });
}
function applyRecit57_() {
  if (_recit57Applied || typeof DB === 'undefined') return;
  _recit57Applied = true;
  _echos57Apply_(DB, RECIT57_ECHOS.filter(e => DB[e[0]]));
  if (typeof NGPLUS_DB !== 'undefined') _echos57Apply_(NGPLUS_DB, RECIT57_ECHOS.filter(e => !DB[e[0]] && NGPLUS_DB[e[0]]));
}

// ===== 57.0 étapes 2-5 : arcs, romances, instabilité ≠ possession, NG+ recadré =====
// Instabilité = le pouvoir qui déborde (tempête, givre, corps). Possession = l’emprise du Trône sur les autres (contrôle, appartenance).
function instabilite57_(gs) { return Number(gs.getGauge ? gs.getGauge('instabilite') : 0) || 0; }
function possession57_(gs) { return Number(gs.getGauge ? gs.getGauge('possession') : 0) || 0; }
function instable57_(gs) { return instabilite57_(gs) >= 25; }
function calme57_(gs) { return instabilite57_(gs) <= 8; }
function possedee57_(gs) { return possession57_(gs) >= POSSESSION_EMPRISE; }
function libre57_(gs) { return possession57_(gs) <= 4; }

const _sc57_ = (id, hote, chapter, title, mood, texte, choix) => ({ id, hote, chapter, title, mood, texte, choix });
// Scènes annexes (retour par PUSH_RETURN → RETURN), accrochées à une scène hôte.
const SCENES57 = [
  _sc57_('ARC57_VEYRA_COLPORTEUSE', 'ACTE2_08_MATIN_AUBERGE', 2, "La reine sans couronne", 'mystery',
    gs => "Une colporteuse vend des rubans près de l’âtre. Entre deux prix, elle parle d’une femme du Nord qui « rend aux gens ce que les rois leur ont pris ». Elle ne dit pas son nom tout de suite.\n\n« Veyra, » finit-elle par souffler. « Elle paie en vérités. On ne sait jamais combien elle en garde. »\n\nFen se raidit sur ton épaule. Il ne grogne pas. Il écoute, comme quelqu’un qui connaît déjà la fin de l’histoire.",
    [ { key:'RETENIR', text:"Retenir le nom. « Combien en garde-t-elle ? »", effects:[{type:'SET_FLAG',target:'veyra_graine_57'},{type:'SET_FLAG',target:'veyra_question_57'}], response:"La colporteuse sourit. « Celles qui la feraient perdre. »", next:'RETURN' },
      { key:'IGNORER', text:"Payer un ruban et ne rien demander.", effects:[{type:'SET_FLAG',target:'veyra_graine_57'}], response:"Le ruban est bleu de givre. Tu ne sais pas encore pourquoi tu l’as choisi.", next:'RETURN' } ]),
  _sc57_('ARC57_ALISTAIR_ERREUR', 'ACTE3_08_MISE_AU_POINT', 3, "Ce que la cage a coûté", 'tension',
    gs => "Tu lui demandes ce que la cage a coûté. Alistair met longtemps à répondre.\n\n« J’ai envoyé ta position à l’Ordre. Au village. Je croyais qu’ils viendraient avec des médecins. Ils sont venus avec des chaînes. » Il ne baisse pas les yeux. « Je l’ai fait pour te protéger. C’est la pire phrase que je connaisse. »\n\nIl ne te demande rien. Il ne sait pas encore faire autrement que demander, et il se tait quand même.",
    [ { key:'CONDITION', text:"« Tu ne décideras plus jamais à ma place. Pas même pour me sauver. »", effects:[{type:'SET_FLAG',target:'alistair_erreur_avouee_57'},{type:'SET_FLAG',target:'alistair_promesse_choix_57'},{type:'ADD_GAUGE',target:'volonte',value:2}], response:"« Plus jamais. » Il le dit comme on signe. Tu verras s’il tient.", next:'RETURN' },
      { key:'COUPER', text:"« Alors ne me protège plus. »", effects:[{type:'SET_FLAG',target:'alistair_erreur_avouee_57'},{type:'SET_FLAG',target:'alistair_erreur_coupe_57'},{type:'ADD_GAUGE',target:'lien_E',value:-2}], response:"Il hoche la tête. Il reste. Mais il marche désormais derrière, et plus jamais devant.", next:'RETURN' } ]),
  _sc57_('ARC57_CONSEIL_FACTIONS', 'ACTE3_10_ACCUEIL_CULTE_1', 3, "Le grain du village", 'tension',
    gs => "Les réserves de grain du village ne passeront pas l’hiver pour tout le monde. Le culte réclame sa part pour les réfugiés de la frontière. Trois déserteurs de l’Ordre réclament la leur : ils ont ouvert les portes de la cellule pour toi.\n\nOraya ne plaide pas. Elle attend de voir qui tu nourris. " + (instable57_(gs) ? "Le givre court sous tes ongles : personne n’ose te presser, et ce silence-là ressemble à de la peur." : possedee57_(gs) ? "Tous te regardent comme celle qui tranchera. Tu sens l’envie de décider pour eux. C’est le Trône qui a soif." : "Tu sens le poids de chaque bol. Aucun choix ne sera propre."),
    [ { key:'REFUGIES', text:"Donner le grain aux réfugiés du culte.", effects:[{type:'SET_FLAG',target:'grain_refugies_57'},{type:'ADD_REP',target:'culte',value:2},{type:'ADD_REP',target:'ordre',value:-2}], response:"Les déserteurs partent avant l’aube. L’un d’eux crache dans la neige. Tu l’as vu.", next:'RETURN' },
      { key:'DESERTEURS', text:"Nourrir les déserteurs : ils ont risqué leur vie pour toi.", effects:[{type:'SET_FLAG',target:'grain_deserteurs_57'},{type:'ADD_REP',target:'ordre',value:1},{type:'ADD_REP',target:'culte',value:-2}], response:"Oraya note quelque chose sur une tablette. Tu sais que c’est ton nom.", next:'RETURN' },
      { key:'PARTAGE', text:"Partager, et rationner tout le monde — toi comprise.", effects:[{type:'SET_FLAG',target:'grain_partage_57'},{type:'ADD_GAUGE',target:'volonte',value:2},{type:'ADD_REP',target:'village',value:1}], response:"Personne n’est content. Personne ne meurt cette semaine. C’est la politique, peut-être.", next:'RETURN' },
      { key:'ORDONNER', condition: gs => possedee57_(gs), text:"Ordonner. Leur faire accepter ton partage par la seule force de ta voix.", effects:[{type:'SET_FLAG',target:'grain_ordonne_57'},{type:'ADD_GAUGE',target:'possession',value:3}], response:"Ils obéissent tous. Personne ne discute. C’est exactement ce qui t’effraie.", next:'RETURN' } ]),
  _sc57_('ARC57_KAELEN_CONFLIT', 'ACTE4_01_HALTE_DOME', /* 60.1 : déplacé du hub DEPART_VILLAGE (densité, romance 8) */ 4, "Le contrat qui n’est pas fini", 'tension',
    gs => "Kaelen a reçu une lettre de la Confrérie. Il te la tend sans que tu la demandes. Elle porte ton prix.\n\n« Je pourrais la brûler et te dire que c’est réglé. Ça ne le serait pas. » Il plie ses gants, les replie. « Je ne veux pas que tu m’aimes à crédit. »",
    [ { key:'ENSEMBLE', text:"« On la brûle ensemble. Et tu me dis qui l’a écrite. »", effects:[{type:'SET_FLAG',target:'kaelen_conflit_resolu_57'},{type:'ADD_GAUGE',target:'lien_O',value:1}], response:"Il te donne trois noms. Le troisième le fait trembler.", next:'RETURN' },
      { key:'PAUSE', text:"« J’ai besoin de temps avant de te croire. »", effects:[{type:'SET_FLAG',target:'kaelen_conflit_pause_57'},{type:'SET_FLAG',target:'_romance_deferred_O'}], response:"« Prends-le. » Il ne t’approche plus. Il ne part pas non plus.", next:'RETURN' } ]),
  _sc57_('ARC57_SERAPHINE_CONFLIT', 'ACTE4_01_DEPART_VILLAGE', 4, "La Lame et la liste", 'tension',
    gs => "Séraphine a gardé une liste. Des noms de l’Ordre qu’elle compte tuer quand tout sera fini. Le tien y était. Il est barré. Le dernier nom est plié dans la marge ; elle pose son pouce dessus quand tu lis.\n\n« Je ne vais pas te mentir. Je l’ai barré tard. » Elle ne se défend pas. « Si tu veux partir, c’est maintenant. »",
    [ { key:'RESTER', text:"Rester. « Barre aussi les autres. Pas pour moi. Pour toi. »", effects:[{type:'SET_FLAG',target:'seraphine_conflit_repare_57'},{type:'ADD_GAUGE',target:'volonte',value:1}], response:"Elle ne barre rien ce soir. Mais elle range la liste dans ta main.", next:'RETURN' },
      { key:'PAUSE', text:"« Pas maintenant. Je reviendrai quand je saurai quoi en penser. »", effects:[{type:'SET_FLAG',target:'seraphine_pause_57'}], response:"« Je serai là. Avec ou sans liste. »", next:'RETURN' },
      { key:'ROMPRE', condition: gs => gs.hasFlag('seraphine_baiser') || gs.hasFlag('seraphine_amour') || (gs.getGauge('lien_seraphine') || 0) >= 4, text:"« Je ne peux pas aimer quelqu’un qui tient des comptes de morts. »", effects:[{type:'SET_FLAG',target:'seraphine_rompue_57'}], response:"Elle hoche la tête, une fois. Puis elle reprend son poste, à l’arrière, sans un mot de trop.", next:'RETURN' },
      { key:'SEPARER', condition: gs => !(gs.hasFlag('seraphine_baiser') || gs.hasFlag('seraphine_amour') || (gs.getGauge('lien_seraphine') || 0) >= 4), text:"« Je ne peux pas marcher derrière quelqu’un qui tient des comptes de morts. »", effects:[{type:'SET_FLAG',target:'seraphine_separee_59'}], response:"Elle hoche la tête, une fois. Puis elle reprend son poste, à l’arrière, sans un mot de trop.", next:'RETURN' } ]),  // 60 (romance V59 N4, qa #8) : séparation sans romance ≠ rupture amoureuse
];
// Conditions d’accès aux scènes annexes.
const ACCES57 = {
  ARC57_VEYRA_COLPORTEUSE: gs => !gs.hasFlag('veyra_graine_57'),
  ARC57_ALISTAIR_ERREUR: gs => (gs.hasFlag('alistair_a_promis_cage') || gs.hasFlag('alistair_emprisonne') || gs.hasFlag('alistair_confronte') || gs.getGauge('lien_E') >= 3) && !gs.hasFlag('alistair_erreur_avouee_57'),
  ARC57_CONSEIL_FACTIONS: gs => !gs.hasFlag('grain_refugies_57') && !gs.hasFlag('grain_deserteurs_57') && !gs.hasFlag('grain_partage_57') && !gs.hasFlag('grain_ordonne_57'),
  ARC57_KAELEN_CONFLIT: gs => typeof romanceAvailableO === 'function' && romanceAvailableO(gs) && !dominationRomance6032_(gs) && gs.getGauge('lien_O') >= 4 && !gs.hasFlag('kaelen_conflit_resolu_57') && !gs.hasFlag('kaelen_conflit_pause_57'),
  ARC57_SERAPHINE_CONFLIT: gs => (gs.hasFlag('seraphine_main') || gs.hasFlag('seraphine_lame_gardee') || gs.hasFlag('seraphine_tenue')) && !gs.hasFlag('seraphine_conflit_repare_57') && !gs.hasFlag('seraphine_pause_57') && !gs.hasFlag('seraphine_rompue_57'),
};
const LIBELLES57 = {
  ARC57_VEYRA_COLPORTEUSE: "Écouter la colporteuse qui parle d’une reine sans couronne.",
  ARC57_ALISTAIR_ERREUR: "Demander à Alistair ce que la cage a vraiment coûté.",
  ARC57_CONSEIL_FACTIONS: "Trancher la querelle du grain entre le culte et les déserteurs.",
  ARC57_KAELEN_CONFLIT: "Lire la lettre que Kaelen tient sans l’ouvrir.",
  ARC57_SERAPHINE_CONFLIT: "Demander à Séraphine ce qu’elle cache dans sa manche.",
};

// Choix conditionnés (instabilité, possession, savoir) ajoutés à des scènes existantes.
const CHOIX57 = [
  ['ACTE4_05_ARRIVEE_PORTES_1', { key:'I57_TEMPETE', condition: gs => instable57_(gs), text:"Ne rien sacrifier. Laisser la tempête fendre les vantaux.", intent:'violence', effects:[{type:'SET_FLAG',target:'portes_tempete_57'},{type:'ADD_GAUGE',target:'instabilite',value:5}], response:"L’obsidienne éclate. La Larme reste dans ta main — et Alistair saigne d’un éclat que tu n’as pas su retenir.", next:'ACTE4_06_MASQUE_TOMBE_1' }],
  ['ACTE4_05_ARRIVEE_PORTES_1', { key:'P57_ORDRE', condition: gs => possedee57_(gs), text:"Ordonner aux gardiens des portes d’ouvrir. Ils t’appartiennent déjà un peu.", intent:'domination', effects:[{type:'SET_FLAG',target:'portes_ordonnees_57'},{type:'ADD_GAUGE',target:'possession',value:3}], response:"Les gardiens ouvrent, les yeux vides. Kaelen détourne le regard : il connaît ce regard, il l’a eu.", next:'ACTE4_06_MASQUE_TOMBE_1' }],
  ['ACTE4_05_ARRIVEE_PORTES_1', { key:'S57_SILAS', condition: gs => gs.hasFlag('silas_laissez_passer_57'), text:"Montrer le jeton de contrebandier que Silas t’a confié au village.", effects:[{type:'SET_FLAG',target:'portes_silas_57'}], response:"Une poterne s’ouvre sur le flanc. Silas avait dit vrai : la Citadelle a toujours eu des fournisseurs.", next:'ACTE4_06_MASQUE_TOMBE_1' }],
  ['ACTE2_04_VILLAGE_HOSTILE', { key:'SILAS_LAISSEZ_PASSER', condition: gs => gs.hasFlag('silas_a_parle_1') && !gs.hasFlag('silas_laissez_passer_57'), text:"Prendre le jeton que Silas glisse dans ta main sans le regarder.", effects:[{type:'SET_FLAG',target:'silas_laissez_passer_57'}], response:"« Tu ne m’as pas dénoncé quand tu pouvais. Ça vaut une porte, un jour. »", next:'RETURN_SELF' }],
  ['ACTE4_09_TRONE_EBENE', { key:'I57_GIVRE', condition: gs => calme57_(gs) && libre57_(gs) && !gs.hasFlag('trone_maitrise_57'), text:"Poser la main sur le Trône sans trembler. Ton pouvoir t’obéit, et tu ne veux rien posséder.", effects:[{type:'SET_FLAG',target:'trone_maitrise_57'},{type:'ADD_GAUGE',target:'volonte',value:2}], response:"Le Trône hésite. Il ne trouve aucune faille par où entrer : ni tempête, ni faim. Cette fois, c’est lui qui attend.", next:'RETURN_SELF' }],
  ['VEYRA_DERNIER_PACTE', { key:'EGALE_57', condition: gs => gs.hasFlag('veyra_graine_57') && gs.hasFlag('veyra_mensonge_avoue'), text:"« On m’a parlé de toi bien avant ce Trône. Je te parle d’égale à égale, pas de reine à reine. »", effects:[{type:'SET_FLAG',target:'veyra_egale_57'},{type:'SET_FLAG',target:'veyra_position_finale'}], response:"Veyra rit, pour de vrai. « La colporteuse. Elle est à moi. Tu as écouté plus tôt que les autres. » Elle ne t’aide pas. Elle cesse de te mentir.", next:'RETURN' }],
  // NG+ : savoirs acquis dans la boucle
  ['NGP_12_FEN', { key:'SAVOIR_FRESQUE', condition: gs => gs.hasFlag('ngplus_fen_confession') || gs.hasFlag('ngplus_fen_interroge'), text:"« Le ravin, la première fois. Tu connaissais le chemin. Tu l’avais déjà marché, roi. »", effects:[{type:'SET_FLAG',target:'ngplus_savoir_ravin_57'},{type:'ADD_GAUGE',target:'memoire_kalthar',value:2}], response:"Fen ferme les yeux. « Je l’ai marché avec toi. Il y a trois siècles, et il y a une vie. Je ne pouvais pas te le dire sans te le voler. »", next:'NGP_13_BRASIER' }],
  ['NGP_10_ORAYA', { key:'TEMOIGNER_57', condition: gs => gs.hasFlag('ngplus_memoire_acceptee') || gs.hasFlag('ngplus_cherche_verite'), text:"Raconter à Oraya, une par une, les fins où elle t’a gardée. Ne rien pardonner. Témoigner.", effects:[{type:'SET_FLAG',target:'ngplus_oraya_temoin_57'}], response:"Oraya écoute jusqu’au bout. Elle ne demande pas pardon : tu ne lui en as pas laissé la place. Elle demande seulement à se souvenir avec toi.", next:'NGP_11_LYRA' }],
  ['NGP_15_DERNIER_CHOIX', { key:'NOMMER_ARCHITECTE', condition: gs => gs.hasFlag('ngplus_architecte_demande') && (gs.hasFlag('ngplus_nom_cycle') || gs.hasFlag('ngplus_contrat_source') || gs.hasFlag('ngplus_sceau_source')), text:"Prononcer le nom de l’architecte du cycle. Toi, la première fois, qui avais peur de perdre.", effects:[{type:'SET_FLAG',target:'ngplus_architecte_nomme_57'},{type:'SET_FLAG',target:'ngplus_final_libre'}], response:"Le nom est le tien. La première Elenya a bâti le cycle pour ne jamais perdre ceux qu’elle aimait. Tu peux le défaire parce que tu le comprends.", next:'NGP_U15_LIBRE' }],
];

// Échos des étapes 2-5 (arcs, romances, instabilité/possession, NG+ recadré).
const RECIT57B_ECHOS = [
  // Veyra semée dès les actes 1-2
  ['LIEN_MARCHE_1', gs => true, "Sur un mur des ruines, quelqu’un a gravé une couronne barrée et un V. Le givre ne l’a pas recouvert. Fen évite de le regarder."],
  ['VEYRA_PACTE', gs => gs.hasFlag('veyra_graine_57'), "Le nom de Veyra, tu l’as entendu à l’auberge, entre deux rubans. Tu sais déjà qu’elle paie en vérités et qu’elle en garde."],
  ['VEYRA_PACTE', gs => gs.hasFlag('veyra_question_57'), "« Combien en gardes-tu ? » La question de la colporteuse te revient. Veyra la lit sur ton visage et sourit."],
  // Fen/Kalthar : indices plus tôt, recadrés en NG+
  ['ACTE2_10_RAVIN', gs => true, "Fen saute d’un bloc à l’autre sans hésiter, comme s’il connaissait le ravin. Un furet né au village ne devrait pas savoir où la glace tient."],
  ['ACTE2_08_MATIN_AUBERGE', gs => true, "Quand l’aubergiste prononce le nom de Kalthar dans une vieille chanson, Fen renverse ton bol. Exprès, tu en es presque sûre."],
  ['NGP_04_FRESQUE_REPRISE', gs => true, "Cette fois, tu reconnais le furet peint dans un coin de la fresque. Il était là depuis le début. Au ravin. À l’auberge. Dans la chanson."],
  // Kaelen : des actes répétés
  ['ACTE4_06B_TEST_KAELEN', gs => gs.hasFlag('kaelen_main_partagee_tempete'), "Kaelen ne parle pas. Il tend la main, paume ouverte, comme dans la tempête. Le même geste. Il n’a jamais su dire mieux."],
  ['ACTE4_06B_TEST_KAELEN', gs => gs.hasFlag('kaelen_conflit_resolu_57'), "La lettre brûlée tient encore dans sa poche, en cendres. Il te montre ses mains vides, une à une : rien de caché."],
  // Alistair : protège sans décider, erreurs coûteuses
  ['ACTE4_06_MASQUE_TOMBE_1', gs => gs.hasFlag('alistair_promesse_choix_57'), "Il s’interpose. Puis il se souvient de sa promesse et recule d’un pas : il te laisse la serrure. Ça lui coûte tout ce que son Ordre lui a appris."],
  ['ACTE4_06_MASQUE_TOMBE_1', gs => gs.hasFlag('alistair_erreur_coupe_57'), "Tu lui as dit de ne plus te protéger. Il obéit, et c’est pire : il ne fait plus rien pour te retenir, même quand il le devrait."],
  ['ACTE4_06_MASQUE_TOMBE_1', gs => gs.hasFlag('portes_tempete_57'), "Le sang d’Alistair coule encore de l’éclat d’obsidienne. Il ne t’accuse pas. Il te regarde comme on regarde une avalanche."],
  ['ACTE4_06_MASQUE_TOMBE_1', gs => gs.hasFlag('portes_ordonnees_57'), "Les gardiens aux yeux vides vous suivent encore. Alistair compte ceux que tu as pliés. Il en a peur plus que de la Citadelle."],
  ['ACTE4_06_MASQUE_TOMBE_1', gs => gs.hasFlag('portes_silas_57'), "Par la poterne de Silas, personne ne vous attendait. L’embuscade d’Alistair perd son terrain : il doit te parler au lieu de te barrer la route."],
  // Elenya : son pouvoir façonne sa pensée (instabilité) — distincte de l’emprise (possession)
  ['ACTE2_17_RETROUVAILLES_SORTIE', gs => instable57_(gs), "Tu penses par éclats. Chaque bruit devient une fissure possible, chaque visage une surface à ne pas geler. Ton pouvoir ne te parle pas : il te déborde."],
  ['ACTE2_17_RETROUVAILLES_SORTIE', gs => calme57_(gs), "Ton pouvoir dort sous ta peau, tranquille. Tu remarques le froid comme un sens de plus : où la glace tient, où elle ment."],
  ['ACTE3_08_MISE_AU_POINT', gs => instable57_(gs), "Les villageois s’écartent quand tu passes : le givre craque sous tes pas. Mais un enfant te demande de figer la rivière pour ses moutons, et tu le fais en un souffle."],
  ['ACTE3_08_MISE_AU_POINT', gs => possedee57_(gs), "Tu remarques que tu comptes tes compagnons comme des pièces. Qui est à toi, qui ne l’est pas encore. La pensée ne vient pas de ton givre. Elle vient du Trône."],
  ['ACTE3_08_MISE_AU_POINT', gs => possedee57_(gs) && companionPresentO(gs), "Kaelen reconnaît l’emprise dans ta voix. Il a servi des maîtres. « Pas toi, » dit-il seulement. Ce n’est pas une prière, c’est un avertissement."],
  ['ACTE3_08_MISE_AU_POINT', gs => instable57_(gs) && companionPresentE(gs), "Alistair garde une main sur son sceau. Pas pour te maîtriser : pour éponger le froid quand il déborde. Il a appris à le faire sans te demander d’avoir honte."],
  ['ACTE4_05_ARRIVEE_PORTES_1', gs => instable57_(gs), "La glace des portes chante quand tu approches. Ta tempête peut les fendre — et tout ce qui se tient trop près avec."],
  ['ACTE4_05_ARRIVEE_PORTES_1', gs => possedee57_(gs), "Les gardiens des portes baissent la tête avant que tu ne parles. Le Trône les a déjà préparés pour toi. Tu pourrais leur ordonner n’importe quoi."],
  ['ACTE4_09_TRONE_EBENE', gs => instable57_(gs) && !possedee57_(gs), "Le Trône essaie d’entrer par la tempête et n’y trouve rien à gouverner : ton pouvoir est sauvage, pas soumis. Il te blesse, il ne te possède pas."],
  ['ACTE4_09_TRONE_EBENE', gs => possedee57_(gs) && !instable57_(gs), "Ton pouvoir est parfaitement calme, et c’est le danger : le Trône n’a pas besoin de tempête. Il a seulement besoin que tu veuilles garder."],
  ['ACTE4_09_TRONE_EBENE', gs => gs.hasFlag('trone_maitrise_57'), "Le Trône te laisse passer sans prix. Il ne sait pas quoi faire d’une femme qui n’a ni peur ni faim."],
  ['ACTE4_09_ISSUES_SECONDAIRES', gs => gs.hasFlag('veyra_egale_57'), "Veyra se tient à l’écart, sans pacte. Elle t’a dit la vérité une fois, d’égale à égale. Elle ne la répétera pas."],
  // Romances : réactions à la rupture, pauses, solo valorisé
  ['ACTE4_06_OMBRE_AVEU', gs => gs.hasFlag('romance_O_rompue'), "Kaelen te parle comme à une cliente : court, exact, sans rien laisser traîner. C’est sa façon de te respecter après la rupture. Elle te fait plus mal qu’une colère."],
  ['ACTE4_09_ISSUES_SECONDAIRES', gs => gs.hasFlag('romance_E_rompue'), "Alistair ne prie plus pour toi à voix haute. Tu le surprends une fois à remuer les lèvres. Il s’arrête quand il voit que tu l’as vu."],
  ['ACTE4_09_TRONE_EBENE', gs => gs.hasFlag('seraphine_rompue_57'), "Séraphine garde l’arrière, impeccable. Elle a rompu sans scène. Elle te couvre quand même : la Lame tient ses promesses, même celles qu’elle ne fait plus.", 'etat'],
  // 60 : les agonies survécues laissent une trace lisible.
  ['ACTE4_08_CORRIDOR_OBSIDIENNE', gs => gs.hasFlag('venin_agonie_gelee_60'), "Ta jambe garde le froid de la morsure que tu as gelée toi-même, au bord de la mort. Tu marches avec."],
  ['ACTE4_09_TRONE_EBENE', gs => gs.hasFlag('possession_agonie_ouverte_601'), "Ta main s’est déjà ouverte une fois, au bord de tout garder. Devant le Trône, elle se souvient comment on fait."], // 60.2 : conséquence de l’agonie de possession relue
  ['ACTE4_08_CORRIDOR_OBSIDIENNE', gs => gs.hasFlag('surcharge_agonie_rendue_60'), "Tu as déjà tout rendu au sol une fois, la magie au bord des lèvres. Tu sais ce que coûte de lâcher prise à temps."],
  ['ACTE4_08_CORRIDOR_OBSIDIENNE', gs => gs.hasFlag('sceau_tenue_601'), "Tes coudes se souviennent de deux mains sous le Sceau. Tu ne l’as pas porté seule."],
  ['ACTE4_01_HALTE_DOME', gs => gs.hasFlag('sirene_main_tendue_601'), "Tu sais quelle main a trouvé la tienne dans le chant. Elle aussi le sait. Aucun de vous ne le dit."],
  ['ACTE4_08_CORRIDOR_OBSIDIENNE', gs => gs.hasFlag('sceau_dernier_souffle_60'), "Tes bras se souviennent du Sceau, et de l’instant où tu les as relevés quand tout disait de céder."],
  ['ACTE4_09_TRONE_EBENE', gs => gs.hasFlag('seraphine_separee_59') && !gs.hasFlag('seraphine_rompue_57'), "Séraphine garde l’arrière. Vous ne marchez plus ensemble, mais elle te couvre encore. La Lame ne demande pas qu’on l’aime pour faire son travail.", 'etat'],
  ['ACTE4_09_TRONE_EBENE', gs => gs.hasFlag('seraphine_conflit_repare_57'), "La liste de Séraphine est dans ta poche. Elle n’y a plus ajouté de nom depuis le village."],
  ['ACTE4_09_TRONE_EBENE', gs => gs.hasFlag('kaelen_conflit_pause_57'), "Kaelen marche à deux pas. Pas un de plus, pas un de moins. Il tient le prix que tu as fixé."],
  ['ACTE4_09_TRONE_EBENE', gs => gs.hasFlag('seraphine_pause_57'), "Séraphine a gardé sa liste dans la manche. Elle ne l’a pas sortie depuis le village. Elle attend que tu la demandes.", 'etat'],
  ['ACTE4_09_TRONE_EBENE', gs => gs.hasFlag('fin_solo') || gs.hasFlag('solo_choix_definitif_acte3') || gs.hasFlag('nuit_nord_S'), "Seule devant le Trône. Il cherche une main à tordre, un nom à menacer. Il ne trouve que la tienne."],
  // Conséquences différées (Silas, Lyra, Mira, politique, Oraya)
  ['ACTE5_01_LENDEMAIN', gs => gs.hasFlag('grain_refugies_57'), "Les réfugiés du culte ont passé l’hiver. Les déserteurs, non : on a retrouvé l’un d’eux au col. Personne ne te le reproche tout haut."],
  ['ACTE5_01_LENDEMAIN', gs => gs.hasFlag('grain_deserteurs_57'), "Les déserteurs ont fondé une garde au village. Le culte ne t’adresse plus la parole. Oraya garde ton nom sur sa tablette."],
  ['ACTE5_01_LENDEMAIN', gs => gs.hasFlag('grain_partage_57'), "Tout le monde a eu faim, personne n’est mort. On raconte l’histoire du grain partagé comme une plaisanterie. C’est la meilleure victoire que tu aies eue."],
  ['ACTE5_01_LENDEMAIN', gs => gs.hasFlag('grain_ordonne_57'), "Le partage que tu as imposé a tenu. Mais personne ne vient plus te demander conseil : on vient te demander des ordres."],
  ['ACTE5_01_LENDEMAIN', gs => gs.hasFlag('portes_silas_57'), "Silas a ouvert une route de contrebande par la poterne. Elle nourrit trois villages. Il refuse qu’on lui donne ton nom."],
  ['ACTE5_01_LENDEMAIN', gs => gs.hasFlag('oraya_pardonnee'), "Le pardon n’a rien effacé. Oraya travaille aux cuisines, sous surveillance. Les familles ne la saluent pas. Tu ne leur demandes pas de le faire."],
  ['ACTE5_01_LENDEMAIN', gs => gs.hasFlag('mira_payee'), "Mira a racheté un toit avec ce que tu lui as donné. Elle y loge des enfants des rues. Elle te fait payer le thé quand même."],
  ['ACTE5_01_LENDEMAIN', gs => gs.hasFlag('mira_rejetee'), "Mira a vendu à l’Ordre la carte de vos routes. Elle te l’écrit elle-même : « Tu ne m’as rien laissé d’autre à vendre. »"],
  ['ACTE5_01_LENDEMAIN', gs => gs.hasFlag('lyra_a_parle') && !gs.hasFlag('lyra_punie'), "Lyra chante au marché. Ce n’est plus une arme. Les gens s’arrêtent quand même, parce qu’elle a l’air de chanter pour elle."],
  ['ACTE5_01_LENDEMAIN', gs => instable57_(gs), "Ton givre déborde encore la nuit. On a construit les maisons neuves à distance de la tienne. Par prudence, disent-ils. Par respect, aussi."],
  ['ACTE5_01_LENDEMAIN', gs => possedee57_(gs), "Ceux qui t’entourent ne te contredisent plus. Tu as gagné leur obéissance. Tu cherches encore comment regagner leur franchise."],
  ['ACTE5_01_LENDEMAIN', gs => calme57_(gs) && libre57_(gs), "Ton pouvoir est calme et tu ne retiens personne. On te consulte, on te contredit, on revient. C’est ce que tu voulais."],
  // NG+ recadré
  ['NGP_12_FEN', gs => gs.hasFlag('ngplus_lyra_liberee') || gs.hasFlag('ngplus_lyra_chant'), "Tu revois la première fois, à l’auberge, quand Fen avait renversé ton bol à la chanson de Kalthar. Ce n’était pas un caprice. C’était un deuil."],
  ['NGP_14_TRONE_BRIS', gs => gs.hasFlag('ngplus_savoir_ravin_57'), "Tu sais maintenant pourquoi il connaissait le ravin. Le Trône brisé te paraît moins vieux que votre chemin."],
  ['NGP_11_LYRA', gs => gs.hasFlag('ngplus_oraya_temoin_57'), "Oraya t’a écoutée sans être pardonnée. Lyra le sait : ici, on peut témoigner sans absoudre."],
];

let _recit57bApplied = false;
function applyRecit57b_() {
  if (_recit57bApplied || typeof DB === 'undefined') return;
  _recit57bApplied = true;
  const dbDe = id => (DB[id] ? DB : (typeof NGPLUS_DB !== 'undefined' && NGPLUS_DB[id] ? NGPLUS_DB : null));
  SCENES57.forEach(s => {
    const H = DB[s.hote]; if (!H) return;
    DB[s.id] = { sceneNumber: s.id, chapter: s.chapter, title: s.title, mood: s.mood, image: H.image, voice: '',
      getDynamicNarrative: s.texte, choices: s.choix.map(c => Object.assign({}, c)) };
    H.choices = H.choices || [];
    H.choices.push({ key: 'V57_' + s.id, timeCost: 0, condition: ACCES57[s.id], text: LIBELLES57[s.id],
      effects: [{ type: 'PUSH_RETURN', target: s.hote }], next: s.id });
  });
  CHOIX57.forEach(([id, c]) => {
    const db = dbDe(id); if (!db) return;
    const S = db[id]; S.choices = S.choices || [];
    const ch = Object.assign({}, c);
    if (ch.next === 'RETURN_SELF') { ch.effects = (ch.effects || []).concat([{ type: 'PUSH_RETURN', target: id }]); ch.next = 'ARC57_ECHO_' + ch.key; ch._texte57 = ch.response; delete ch.response; }
    // Un choix 57 qui rejoindrait une destination déjà prise mène d’abord à sa propre scène (pas de convergence immédiate).
    if (ch.next !== 'RETURN_SELF' && ch.next !== 'RETURN' && !String(ch.next).startsWith('ARC57_ECHO_') && S.choices.some(x => x.next === ch.next)) {
      const sid = (db === DB ? 'ARC57_' : 'NGP57_') + ch.key, suite = ch.next;
      if (!db[sid]) db[sid] = { sceneNumber: sid, chapter: S.chapter, title: S.title, mood: S.mood, image: S.image, voice: '',
        text: ch.response, choices: [{ key: 'SUITE', text: "Continuer.", next: suite }] };
      delete ch.response; ch.next = sid;
    }
    if (!S.choices.some(x => x.key === ch.key)) S.choices.push(ch);
    if (String(ch.next).startsWith('ARC57_ECHO_') && !db[ch.next]) {
      db[ch.next] = { sceneNumber: ch.next, chapter: S.chapter, title: S.title, mood: S.mood, image: S.image, voice: '',
        text: ch._texte57, choices: [{ key: 'RETURN', text: "Continuer.", next: 'RETURN' }] };
    }
  });
  // Rupture avec Séraphine : ses choix romantiques se ferment (pas l’alliance).
  Object.keys(DB).forEach(id => (DB[id].choices || []).forEach(c => {
    if (c.target === 'Séraphine' && ['romance','tendresse','intimite','desir'].includes(c.intent)) {
      const cond = c.condition;
      c.condition = gs => !gs.hasFlag('seraphine_rompue_57') && (typeof cond === 'function' ? cond(gs) : true);
    }
  }));
  const enDB = RECIT57B_ECHOS.filter(e => DB[e[0]]);
  const enNG = RECIT57B_ECHOS.filter(e => !DB[e[0]] && typeof NGPLUS_DB !== 'undefined' && NGPLUS_DB[e[0]]);
  _echos57Apply_(DB, enDB);
  if (typeof NGPLUS_DB !== 'undefined') _echos57Apply_(NGPLUS_DB, enNG);
}

// ===== 58.0 : BRANCHES RÉELLES, ARCS ET ROMANCES APPROFONDIS, NG+ RECADRÉ =====
// Chaque entrée : scène à part entière. « entree » = [scèneHôte, condition, libellé] (choix ajouté à l’hôte, avec retour si retour=true).
const SCENES58 = [
  // — B1 : la promesse d’Alistair change la scène des masques (branche, pas écho) —
  { id:'ARC58_ALISTAIR_SERRURE', img:'ACTE4_06_MASQUE_TOMBE_1', chapter:4, title:"La clé tendue", mood:'tension',
    entree:['ACTE4_06_MASQUE_TOMBE_1', gs => gs.hasFlag('alistair_promesse_choix_57'), "Lui rappeler sa promesse, sans hausser la voix : « Tu m’as juré de ne plus décider pour moi. »", false],
    texte: gs => "Il a encore la main levée, le médaillon en travers de la serrure. Tu ne cries pas. Tu répètes seulement ses mots à lui.\n\nAlistair ferme les yeux. On entend, derrière les vantaux, les bottes de l’Ordre qui montent l’escalier. Il pourrait les attendre. Il pourrait te livrer, et se dire que c’est pour ton bien. Il l’a déjà fait une fois.\n\nIl décroche le médaillon de son cou et le pose dans ta paume. Le métal est chaud de lui.\n\n« C’est la clé de leur piège. Fais-en ce que tu veux. » Sa voix se casse sur le dernier mot. « Je ne saurai jamais si j’ai eu raison. C’est ça, te laisser choisir. »",
    choix:[
      { key:'GARDER', text:"Garder la clé, et lui dire de rester à ta droite.", effects:[{type:'SET_FLAG',target:'allie_alistair_58'},{type:'ADD_GAUGE',target:'lien_E',value:2}], next:'ACTE4_06_OMBRE_AVEU' },
      { key:'RENDRE', text:"La lui rendre. « Ouvre, toi. Mais parce que tu le veux. »", effects:[{type:'SET_FLAG',target:'allie_alistair_58'},{type:'SET_FLAG',target:'alistair_choix_rendu_58'},{type:'ADD_GAUGE',target:'volonte',value:2}], next:'ACTE4_06_OMBRE_AVEU' } ] },
  { id:'ARC58_ALISTAIR_ABSENT', img:'ACTE4_06_MASQUE_TOMBE_1', chapter:4, title:"Celui qui ne retient plus", mood:'action',
    entree:['ACTE4_06_MASQUE_TOMBE_1', gs => gs.hasFlag('alistair_erreur_coupe_57'), "Passer devant lui. Il t’a promis de ne plus te protéger.", false],
    texte: gs => "Tu passes devant lui. Il ne bouge pas.\n\nLe piège de l’Ordre se referme quand même — une herse de lumière, des chaînes qui sortent du sol. Alistair connaissait le mécanisme. Il te l’aurait dit, avant. Tu lui as demandé de ne plus te protéger, et il obéit avec une précision qui ressemble à du deuil.\n\nLes chaînes mordent ton poignet. Le givre répond tout seul, trop fort, et la pierre éclate autour de vous.",
    choix:[
      { key:'BRISER', text:"Briser les chaînes seule, quitte à te blesser.", effects:[{type:'ADD_GAUGE',target:'instabilite',value:4},{type:'SET_FLAG',target:'chaines_brisees_seule_58'}], next:'ACTE4_06_OMBRE_AVEU' },
      { key:'APPELER', text:"« Alistair. Aide-moi. C’est moi qui le demande. »", effects:[{type:'SET_FLAG',target:'alistair_rappele_58'},{type:'ADD_GAUGE',target:'lien_E',value:1}], next:'ACTE4_06_OMBRE_AVEU' } ] },
  // — B3 : la poterne de Silas devient une vraie route, Silas allié —
  { id:'ARC58_POTERNE_SILAS', img:'ACTE4_05_ARRIVEE_PORTES_1', chapter:4, title:"La porte des fournisseurs", mood:'mystery',
    entree:['ACTE4_06_MASQUE_TOMBE_1', gs => gs.hasFlag('portes_silas_57') && !gs.hasFlag('allie_silas_58'), "Suivre le couloir des contrebandiers au lieu du grand escalier.", false],
    texte: gs => "Le couloir sent le sel et la cire. Silas t’attend au bout, assis sur une caisse de vin volé à l’Ordre.\n\n« Je t’avais dit qu’un jeton valait une porte. » Il se lève, sans hâte. « Il vaut aussi trois hommes, si tu acceptes qu’ils ne s’agenouillent devant personne. Toi comprise. »\n\nDerrière lui, des contrebandiers qui n’ont jamais vu une reine et n’en veulent pas.",
    choix:[
      { key:'ACCEPTER', text:"« Personne ne s’agenouille. C’est ma seule condition aussi. »", effects:[{type:'SET_FLAG',target:'allie_silas_58'},{type:'ADD_REP',target:'village',value:1}], next:'ACTE4_06_OMBRE_AVEU' },
      { key:'SEULE', text:"Le remercier, et continuer sans eux.", effects:[{type:'SET_FLAG',target:'silas_decline_58'}], next:'ACTE4_06_OMBRE_AVEU' } ] },
  // — B5 : instabilité et possession ouvrent des issues au Trône —
  { id:'ARC58_TEMPETE_RENDUE', img:'ACTE4_09_TRONE_EBENE', chapter:4, title:"Rendre la tempête", mood:'intimate',
    entree:['ACTE4_09_TRONE_EBENE', gs => instable57_(gs) && !possedee57_(gs) && !gs.hasFlag('pouvoir_rendu_58'), "Poser les deux mains sur la glace du sol et rendre la tempête au Nord.", true],
    texte: gs => "Tu t’agenouilles. Pas devant le Trône : devant la glace.\n\nLa tempête ne veut pas partir. Elle a été ta voix pendant des mois, ta colère quand tu n’avais pas de mots, ton seul abri. Tu la sens s’accrocher à tes os.\n\nTu la laisses couler quand même, doigt par doigt, dans les fissures du sol. Le Nord la reprend comme on reprend un enfant qui revient tard.\n\nQuand tu te relèves, tu as froid. Pour de vrai, comme tout le monde.",
    choix:[ { key:'RETOUR', text:"Te relever, plus légère et plus nue.", effects:[{type:'SET_FLAG',target:'pouvoir_rendu_58'},{type:'ADD_GAUGE',target:'instabilite',value:-20},{type:'ADD_GAUGE',target:'volonte',value:3}], next:'RETURN' } ] },
  { id:'ARC58_EMPRISE_LACHEE', img:'ACTE4_09_TRONE_EBENE', chapter:4, title:"Ouvrir la main", mood:'tension',
    entree:['ACTE4_09_TRONE_EBENE', gs => possedee57_(gs) && !gs.hasFlag('emprise_lachee_58'), "Compter ceux que tu tiens. Puis les lâcher, un par un.", true],
    texte: gs => "Tu les comptes. Les gardiens des portes. Les fidèles qui baissent la tête. " + (companionPresentO(gs) ? "Kaelen, qui ne te contredit plus depuis des jours. " : "") + (companionPresentE(gs) ? "Alistair, qui prie à voix basse pour quelqu’un qu’il ne reconnaît plus. " : "") + "\n\nChaque fil est une chaleur. Les lâcher, c’est accepter qu’ils puissent partir.\n\nTu ouvres la main. Les fils cèdent avec un bruit de verre. Quelqu’un, derrière toi, respire comme on respire après une noyade.",
    choix:[ { key:'RETOUR', text:"Regarder qui reste.", effects:[{type:'SET_FLAG',target:'emprise_lachee_58'},{type:'ADD_GAUGE',target:'possession',value:-10},{type:'ADD_GAUGE',target:'volonte',value:2}], next:'RETURN' } ] },
  // — B4 : Veyra devient une alliée-témoin possible —
  { id:'ARC58_VEYRA_TEMOIN', img:'ACTE4_09_TRONE_EBENE', chapter:4, title:"La marchande de vérités", mood:'mystery',
    entree:['ACTE4_09_ISSUES_SECONDAIRES', gs => gs.hasFlag('veyra_egale_57') && !gs.hasFlag('veyra_temoin_58') && !gs.hasFlag('veyra_refus_58'), "Demander à Veyra de rester. Pas comme reine. Comme témoin.", true],
    texte: gs => "« Témoin de quoi ? » Veyra croise les bras. « De ta grandeur ? »\n\n« De ce que je vais faire. Pour que personne ne puisse le réécrire. Pas même toi. »\n\nElle te regarde longtemps. Toute sa vie, elle a gardé des vérités pour les vendre plus tard. Tu lui demandes d’en garder une gratuitement.",
    choix:[
      { key:'ACCEPTE', condition: gs => gs.hasFlag('veyra_question_57') || gs.hasFlag('veyra_mensonge_avoue'), text:"« Tu m’as demandé un jour combien j’en gardais. Garde celle-là. »", effects:[{type:'SET_FLAG',target:'veyra_temoin_58'}], next:'RETURN' },
      { key:'LAISSER', text:"La laisser partir. Elle ne doit rien.", effects:[{type:'SET_FLAG',target:'veyra_refus_58'}], next:'RETURN' } ] },
  // — B2 : épilogue différent selon le grain —
  { id:'ARC58_EPILOGUE_VILLAGE', img:'ACTE5_01_LENDEMAIN', chapter:5, title:"Le village, au printemps", mood:'calm',
    entree:['ACTE5_01_LENDEMAIN', gs => (gs.hasFlag('grain_partage_57')||gs.hasFlag('grain_refugies_57')||gs.hasFlag('grain_deserteurs_57')||gs.hasFlag('grain_ordonne_57')) && !gs.hasFlag('epilogue_village_58'), "Retourner au village où tu as partagé — ou non — le grain.", true],
    texte: gs => gs.hasFlag('grain_partage_57') ? "La fête du dégel a lieu sans toi, puis avec toi quand tu arrives. Personne ne t’offre la place d’honneur. On te tend un bol, le même que les autres, et une vieille te reproche le rationnement de l’hiver en riant. Tu ris aussi.\n\nC’est ici que tu comprends ce que tu as gagné : le droit d’être contredite par des gens qui ont mangé."
      : gs.hasFlag('grain_refugies_57') ? "Les réfugiés ont planté des orges à l’ouest du village. Les maisons des déserteurs sont vides ; une seule porte porte encore une marque à la craie, un mot que tu ne veux pas lire.\n\nLe culte t’accueille comme une bienfaitrice. Tu acceptes leur pain, et tu passes devant la porte vide en rentrant."
      : gs.hasFlag('grain_deserteurs_57') ? "La garde des déserteurs t’escorte, fière, raide, dans des uniformes repeints. Le camp du culte est parti vers le sud.\n\nOraya t’a laissé une tablette : les noms de ceux qui n’ont pas passé l’hiver. Elle n’a rien écrit d’autre. Elle n’en avait pas besoin."
      : "Tout le monde est là, et tout le monde se tait quand tu entres. Le partage que tu as imposé a tenu. On t’a gardé la meilleure chaise.\n\nTu cherches quelqu’un qui oserait te dire que tu avais tort. Personne ne lève les yeux.",
    choix:[ { key:'RETOUR', text:"Reprendre la route.", effects:[{type:'SET_FLAG',target:'epilogue_village_58'}], next:'RETURN' } ] },
  // — R1 : Kaelen, les trois noms —
  { id:'ARC58_KAELEN_TROIS_NOMS', img:'ACTE4_01_DEPART_VILLAGE', chapter:4, title:"Le troisième nom", mood:'intimate',
    entree:['ACTE4_05_ARRIVEE_PORTES_1', gs => gs.hasFlag('kaelen_conflit_resolu_57') && !gs.hasFlag('kaelen_trois_noms_58'), "Demander à Kaelen le troisième nom, celui qui l’a fait trembler.", true],
    texte: gs => "Il ne répond pas tout de suite. Il nettoie une lame qui est déjà propre.\n\n« Le premier contrat, ce n’est pas la Confrérie qui l’a signé. C’est ma mère. J’avais sept ans. Elle a eu de quoi passer l’hiver. » Il remet la lame au fourreau, d’un geste exact. « Je ne lui en veux pas. C’est ça le pire. Je ferais pareil. »\n\nIl te regarde enfin. « Voilà. Tu sais ce que je vaux. Le prix d’un hiver. »",
    choix:[
      { key:'TENIR', condition: gs => romanceAvailableO(gs) && !dominationRomance6032_(gs), // 60.3.2 (romance F4)
        text:"Prendre sa main, celle qui tient la lame. « Un hiver, c’est des vies entières. Tu ne vaux pas moins. »", intent:'tendresse', target:'Kaelen', effects:[{type:'SET_FLAG',target:'kaelen_trois_noms_58'},{type:'SET_FLAG',target:'kaelen_mere_comprise_58'},{type:'ADD_GAUGE',target:'lien_O',value:2}], next:'RETURN' },
      { key:'QUESTION', text:"« Est-ce que tu veux la retrouver ? »", intent:'confiance', target:'Kaelen', effects:[{type:'SET_FLAG',target:'kaelen_trois_noms_58'},{type:'SET_FLAG',target:'kaelen_mere_cherchee_58'},{type:'ADD_GAUGE',target:'lien_O',value:1}], next:'RETURN' },
      { key:'SILENCE', text:"T’asseoir près de lui. Ne rien racheter.", effects:[{type:'SET_FLAG',target:'kaelen_trois_noms_58'}], next:'RETURN' } ] },
  // — R2 : Alistair, la prière sans nom —
  { id:'ARC58_ALISTAIR_PRIERE', img:'ACTE4_01_DEPART_VILLAGE', chapter:4, title:"Une prière sans ton nom", mood:'intimate',
    entree:['ACTE4_01_DEPART_VILLAGE', gs => gs.hasFlag('alistair_promesse_choix_57') && !gs.hasFlag('alistair_priere_58'), "Lire la page qu’Alistair a arrachée de son bréviaire.", true],
    texte: gs => "C’est une prière. Il l’a recopiée cent fois, enfant. Il l’a corrigée cette nuit.\n\nPartout où l’Ordre disait « la sorcière », il a écrit « elle ». Partout où l’Ordre disait « la sauver », il a raturé. Il n’a rien mis à la place.\n\n« Je ne sais plus quoi demander pour toi, » dit-il. « Alors je demande seulement que tu choisisses. C’est une prière ridicule. »",
    choix:[
      { key:'GARDER', condition: gs => romanceAvailableE(gs) && !dominationRomance6032_(gs), // 60.3.2 (romance F5)
        text:"Plier la page et la glisser contre ton cœur. « Elle n’est pas ridicule. Elle est à moi. »", intent:'tendresse', target:'Alistair', effects:[{type:'SET_FLAG',target:'alistair_priere_58'},{type:'SET_FLAG',target:'alistair_priere_gardee_58'},{type:'ADD_GAUGE',target:'lien_E',value:2}], next:'RETURN' },
      { key:'ECRIRE', text:"Prendre sa plume. Écrire toi-même ce qu’il peut demander.", intent:'confiance', target:'Alistair', effects:[{type:'SET_FLAG',target:'alistair_priere_58'},{type:'SET_FLAG',target:'alistair_priere_ecrite_58'},{type:'ADD_GAUGE',target:'volonte',value:1}], next:'RETURN' } ] },
  // — R3 : Séraphine, la liste brûlée —
  { id:'ARC58_SERAPHINE_LISTE', img:'ACTE4_01_DEPART_VILLAGE', chapter:4, title:"Un nom par flamme", mood:'intimate',
    entree:['ACTE4_01_HALTE_DOME', gs => gs.hasFlag('seraphine_conflit_repare_57') && !gs.hasFlag('seraphine_liste_58'), "Rejoindre Séraphine au feu, la liste à la main.", true],
    texte: gs => "Le tien, barré, elle le brûle d’abord, sans le relire. Puis elle lit chaque nom à voix haute avant de le brûler. Un capitaine. Un confesseur. Une enfant de chœur devenue inquisitrice. Elle ne pardonne à aucun. Elle renonce seulement à les tuer.\n\nAu dernier, celui qui était plié dans la marge, sa voix flanche. C’est le sien, écrit par elle, il y a longtemps.\n\n« Celui-là, je n’arrive pas à le brûler. »",
    choix:[
      { key:'ENSEMBLE', condition: gs => !gs.hasFlag('seraphine_rompue_57'), text:"Poser ta main sur la sienne, au-dessus de la flamme. Attendre qu’elle décide.", intent:'tendresse', target:'Séraphine', effects:[{type:'SET_FLAG',target:'seraphine_liste_58'},{type:'SET_FLAG',target:'seraphine_nom_brule_58'},{type:'ADD_GAUGE',target:'lien_seraphine',value:2}], next:'RETURN' },
      { key:'GARDER', condition: gs => !gs.hasFlag('seraphine_rompue_57'), text:"« Garde-le. Mais c’est moi qui le garde pour toi. »", intent:'confiance', target:'Séraphine', effects:[{type:'SET_FLAG',target:'seraphine_liste_58'},{type:'SET_FLAG',target:'seraphine_nom_garde_58'},{type:'ADD_GAUGE',target:'lien_seraphine',value:1}], next:'RETURN' } ] },
  // — R4 : solo, le vœu sur la crête —
  { id:'ARC58_SOLO_CRETE', img:'ACTE4_01_DEPART_VILLAGE', chapter:4, title:"La crête, seule", mood:'calm',
    entree:['ACTE4_01_DEPART_VILLAGE', gs => (gs.hasFlag('solo_choix_definitif_acte3') || gs.hasFlag('nuit_nord_S')) && !gs.hasFlag('solo_voeu_58'), "Monter seule sur la crête avant le départ.", true],
    texte: gs => "Personne ne te suit. Fen, si, mais Fen ne compte pas comme quelqu’un ; il compte comme toi.\n\nD’en haut, tu vois le village, la Citadelle, la route entre les deux. Tu essaies de dire tout haut ce que tu veux. Pas ce que tu dois. Ce que tu veux.\n\nC’est plus difficile que tous les combats.",
    choix:[
      { key:'MAISON', text:"« Une maison. Une porte que je ferme moi-même. »", effects:[{type:'SET_FLAG',target:'solo_voeu_58'},{type:'SET_FLAG',target:'solo_voeu_maison_58'},{type:'ADD_GAUGE',target:'volonte',value:2}], next:'RETURN' },
      { key:'ROUTE', text:"« Marcher. Ne jamais appartenir à un seul endroit. »", effects:[{type:'SET_FLAG',target:'solo_voeu_58'},{type:'SET_FLAG',target:'solo_voeu_route_58'},{type:'ADD_GAUGE',target:'volonte',value:2}], next:'RETURN' },
      { key:'APPRENDRE', text:"« Apprendre ce que je suis sans que personne me le dise. »", effects:[{type:'SET_FLAG',target:'solo_voeu_58'},{type:'SET_FLAG',target:'solo_voeu_savoir_58'},{type:'ADD_GAUGE',target:'memoire_kalthar',value:1}], next:'RETURN' } ] },
];
// NG+ : recadrages profonds (scènes vécues autrement grâce au savoir)
const SCENES58_NG = [
  { id:'NGP58_RAVIN_REVU', img:'NGP_13_BRASIER', chapter:3, title:"Le ravin, vu par lui", mood:'intimate',
    entree:['NGP_13_BRASIER', gs => gs.hasFlag('ngplus_savoir_ravin_57') && !gs.hasFlag('ngplus_ravin_revu_58'), "Demander à Fen de te raconter le ravin. Sa version.", true],
    texte: gs => "Il raconte. Tu reconnais chaque pas, mais pas la peur.\n\n« Tu glissais vers le bord gauche. Là où la glace est creuse. Je le savais parce que j’y étais tombé, avec toi, il y a trois siècles. Je t’ai mordu la botte pour te faire changer de pied. Tu m’as traité de sale bête. »\n\nTu ris. Lui non.\n\n« Chaque fois que je t’ai sauvée sans te le dire, je t’ai volé un choix. Je recommencerais. C’est ça que je suis venu avouer. »",
    choix:[
      { key:'PARDON', text:"« Tu m’as volé des choix. Tu m’as aussi laissé la vie pour en faire d’autres. »", effects:[{type:'SET_FLAG',target:'ngplus_ravin_revu_58'},{type:'SET_FLAG',target:'ngplus_fen_compris_58'}], next:'RETURN' },
      { key:'LIMITE', text:"« La prochaine fois, tu me le dis. Même si je tombe. »", effects:[{type:'SET_FLAG',target:'ngplus_ravin_revu_58'},{type:'SET_FLAG',target:'ngplus_fen_limite_58'},{type:'ADD_GAUGE',target:'volonte',value:2}], next:'RETURN' } ] },
  { id:'NGP58_PREMIERE_ELENYA', img:'NGP_15_DERNIER_CHOIX', chapter:3, title:"Celle qui avait peur de perdre", mood:'mystery',
    entree:['NGP_15_DERNIER_CHOIX', gs => gs.hasFlag('ngplus_architecte_demande') && !gs.hasFlag('ngplus_premiere_vue_58'), "Regarder dans la glace la première Elenya, celle qui a bâti le cycle.", true],
    texte: gs => "Elle te ressemble à s’y méprendre, sauf les yeux : les siens comptent. Les vivants, les morts, ceux qu’elle pourrait perdre demain.\n\n« Je n’ai pas construit une prison, » dit-elle. « J’ai construit un endroit où personne ne meurt pour toujours. Tu appelles ça une boucle. Moi, j’appelais ça une promesse. »\n\nTu comprends ce que chaque fin a répété : elle t’aimait trop pour te laisser finir.",
    choix:[
      { key:'COMPRENDRE', text:"« Je sais. Et je vais quand même finir. »", effects:[{type:'SET_FLAG',target:'ngplus_premiere_vue_58'},{type:'SET_FLAG',target:'ngplus_premiere_comprise_58'},{type:'ADD_GAUGE',target:'volonte',value:2}], next:'RETURN' },
      { key:'ACCUSER', text:"« Tu as appelé amour ce qui était de la peur. »", effects:[{type:'SET_FLAG',target:'ngplus_premiere_vue_58'},{type:'SET_FLAG',target:'ngplus_premiere_accusee_58'}], next:'RETURN' } ] },
  { id:'NGP58_KAELEN_SANS_CONTRAT', img:'NGP_09_DEUX_ECHOS', chapter:2, title:"Un homme qu’on n’a pas acheté", mood:'intimate',
    entree:['NGP_09_DEUX_ECHOS', gs => (gs.hasFlag('ngplus_contrat_kaelen') || gs.hasFlag('ngplus_contrat_source')) && !gs.hasFlag('ngplus_kaelen_libre_vu_58'), "Montrer à Kaelen le contrat que tu as lu. Le déchirer devant lui, ou le lui rendre.", true],
    texte: gs => "Dans cette vie-ci, il ne te connaît que depuis quelques jours. Il ne sait pas que tu l’as aimé, ou perdu, ou les deux. Il voit seulement une inconnue qui tient son prix entre deux doigts.\n\n« Qu’est-ce que tu veux en échange ? »\n\nLa question qu’il a posée à tout le monde, toute sa vie.",
    choix:[
      { key:'DECHIRER', text:"Le déchirer. « Rien. C’est la seule chose que je sais de toi : personne ne t’a jamais répondu ça. »", effects:[{type:'SET_FLAG',target:'ngplus_kaelen_libre_vu_58'},{type:'SET_FLAG',target:'ngplus_contrat_dechire_58'}], next:'RETURN' },
      { key:'RENDRE', text:"Le lui rendre. « C’est à toi de décider ce qu’il vaut. »", effects:[{type:'SET_FLAG',target:'ngplus_kaelen_libre_vu_58'},{type:'SET_FLAG',target:'ngplus_contrat_rendu_58'},{type:'ADD_GAUGE',target:'volonte',value:1}], next:'RETURN' } ] },
];
// Échos 58 : relire les branches (chaque drapeau 58 a une suite perceptible)
const RECIT58_ECHOS = [
  ['ACTE4_06_OMBRE_AVEU', gs => gs.hasFlag('allie_alistair_58'), "Alistair marche à ta droite, sans médaillon. Il ne te protège pas. Il te suit, et c’est plus dur pour lui."],
  ['ACTE4_06_OMBRE_AVEU', gs => gs.hasFlag('alistair_choix_rendu_58'), "Il a ouvert la serrure lui-même, parce que tu le lui as rendu possible. Il regarde ses mains comme si elles venaient de lui être rendues."],
  ['ACTE4_06_OMBRE_AVEU', gs => gs.hasFlag('chaines_brisees_seule_58'), "Ton poignet saigne de givre. Tu as brisé les chaînes seule. Kaelen n’ose pas te demander si tu as mal."],
  ['ACTE4_06_OMBRE_AVEU', gs => gs.hasFlag('alistair_rappele_58'), "Tu l’as appelé, et il est venu. Une fois. Ce n’est pas encore une confiance. C’est une porte."],
  ['ACTE4_06_OMBRE_AVEU', gs => gs.hasFlag('allie_silas_58'), "Les hommes de Silas tiennent le couloir derrière vous. Ils ne t’appellent pas « Majesté ». Ils t’appellent « la patronne », pour rire."],
  ['ACTE4_06_OMBRE_AVEU', gs => gs.hasFlag('silas_decline_58'), "Silas a haussé les épaules quand tu as refusé ses hommes. « La porte reste ouverte. » Tu sais qu’il le pense."],
  ['ACTE4_09_TRONE_EBENE', gs => gs.hasFlag('pouvoir_rendu_58'), "Tu n’as plus de tempête à offrir au Trône. Il te regarde comme on regarde une main vide : sans rien à prendre."],
  ['ACTE4_09_TRONE_EBENE', gs => gs.hasFlag('emprise_lachee_58'), "Ceux que tu tenais sont libres. Certains sont partis. Ceux qui restent te regardent en face."],
  ['ACTE4_09_ISSUES_SECONDAIRES', gs => gs.hasFlag('veyra_temoin_58'), "Veyra se tient près de la colonne, les bras croisés, témoin. Elle n’a rien à vendre de cette nuit."],
  ['ACTE4_09_ISSUES_SECONDAIRES', gs => gs.hasFlag('veyra_refus_58'), "Veyra est partie. Elle racontera cette nuit à sa manière. Tu l’as laissée libre de mentir."],
  ['ACTE4_09_TRONE_EBENE', gs => gs.hasFlag('kaelen_mere_comprise_58') && companionPresentO(gs), "Kaelen garde sa main près de la tienne. Le prix d’un hiver. Tu ne l’as pas cru, et il commence à ne plus le croire non plus."],
  ['ACTE4_09_TRONE_EBENE', gs => gs.hasFlag('alistair_priere_gardee_58') && companionPresentE(gs), "La page d’Alistair est contre ton cœur. Une prière sans ton nom, qui demande seulement que tu choisisses."],
  ['ACTE4_09_TRONE_EBENE', gs => gs.hasFlag('seraphine_nom_brule_58'), "Séraphine n’a plus de liste. Elle a brûlé son propre nom avec ta main sur la sienne. Elle se tient plus droite."],
  ['ACTE4_09_TRONE_EBENE', gs => gs.hasFlag('solo_voeu_58'), "Tu te souviens de la crête. Tu as dit ce que tu voulais à voix haute. Le Trône n’en fait pas partie."],
  ['ACTE5_01_LENDEMAIN', gs => gs.hasFlag('kaelen_mere_cherchee_58'), "Kaelen est parti deux jours vers le sud. Il est revenu sans rien dire, puis il a dit : « Elle va bien. Elle ne m’a pas reconnu. C’est mieux. »"],
  ['ACTE5_01_LENDEMAIN', gs => gs.hasFlag('alistair_priere_ecrite_58'), "Alistair récite chaque matin la prière que tu as écrite pour lui. Elle est courte. Elle ne demande rien à personne."],
  ['ACTE5_01_LENDEMAIN', gs => gs.hasFlag('seraphine_nom_garde_58'), "Tu gardes toujours le nom de Séraphine dans une boîte en fer. Elle te demande parfois s’il est encore là. Elle ne demande jamais à le reprendre."],
  ['ACTE5_01_LENDEMAIN', gs => gs.hasFlag('solo_voeu_maison_58'), "Tu as une maison. La porte ferme de l’intérieur. Tu l’ouvres souvent."],
  ['ACTE5_01_LENDEMAIN', gs => gs.hasFlag('solo_voeu_route_58'), "Tu es repartie au troisième jour. Fen dort dans ta capuche. Tu n’as laissé d’adresse à personne, et personne ne t’en veut."],
  ['ACTE5_01_LENDEMAIN', gs => gs.hasFlag('solo_voeu_savoir_58'), "Tu tiens un carnet de ce que tu découvres sur ton pouvoir. Personne ne l’a écrit avant toi. Il commence par : « Je ne sais pas. »"],
  ['ACTE5_01_LENDEMAIN', gs => gs.hasFlag('epilogue_village_58'), "Le chemin du village est marqué dans la neige par tes propres pas. Tu y reviendras."],
  ['NGP_14_TRONE_BRIS', gs => gs.hasFlag('ngplus_fen_compris_58'), "Fen ne te sauve plus en silence. Il te prévient, maintenant, et c’est toi qui choisis où mettre le pied."],
  ['NGP_14_TRONE_BRIS', gs => gs.hasFlag('ngplus_fen_limite_58'), "« Je te le dirai, même si tu tombes. » Fen l’a promis. Devant le Trône brisé, il le fait : « Gauche. Creux. À toi. »"],
  ['NGP_10_ORAYA', gs => gs.hasFlag('ngplus_contrat_dechire_58'), "Kaelen garde un morceau du contrat déchiré dans sa poche. Il ne sait pas pourquoi une inconnue lui a donné rien. Il marche plus près."],
  ['NGP_10_ORAYA', gs => gs.hasFlag('ngplus_contrat_rendu_58'), "Kaelen a rangé son contrat sans le lire. Il te regarde comme une question qu’il a le droit de poser plus tard."],
];
['NG_FIN_AMOUR','NG_FIN_CYCLE','NG_FIN_DEUX_MAINS','NG_FIN_FRONTIERE','NG_FIN_LIBERATION','NG_FIN_VIDE'].forEach(fin => {
  RECIT58_ECHOS.push(
    [fin, ngEcho6081_(fin, gs => gs.hasFlag('ngplus_premiere_comprise_58')), "La première Elenya t’aimait trop pour te laisser finir. Tu as fini quand même, avec tendresse. Elle n’a pas protesté."],
    [fin, ngEcho6081_(fin, gs => gs.hasFlag('ngplus_premiere_accusee_58')), "Tu as appelé sa peur par son nom. La glace a gardé l’écho de ta voix, plus longtemps que toutes les fins."]);
});

let _recit58Applied = false;
function _scene58_(db, s) {
  const H = db[s.img] || {};
  db[s.id] = { sceneNumber: s.id, chapter: s.chapter, title: s.title, mood: s.mood, image: H.image, voice: '', getDynamicNarrative: s.texte, choices: s.choix.map(c => Object.assign({}, c)) };
  const [hote, cond, lib, retour] = s.entree; const Ho = db[hote]; if (!Ho) return;
  Ho.choices = Ho.choices || [];
  if (!Ho.choices.some(c => c.key === 'V58_' + s.id))
    Ho.choices.push({ key: 'V58_' + s.id, timeCost: 0, condition: cond, text: lib, effects: retour ? [{ type: 'PUSH_RETURN', target: hote }] : [], next: s.id });
}
function applyRecit58_() {
  if (_recit58Applied || typeof DB === 'undefined') return;
  _recit58Applied = true;
  SCENES58.forEach(s => _scene58_(DB, s));
  if (typeof NGPLUS_DB !== 'undefined') SCENES58_NG.forEach(s => _scene58_(NGPLUS_DB, s));
  _echos57Apply_(DB, RECIT58_ECHOS.filter(e => DB[e[0]]));
  if (typeof NGPLUS_DB !== 'undefined') _echos57Apply_(NGPLUS_DB, RECIT58_ECHOS.filter(e => !DB[e[0]] && NGPLUS_DB[e[0]]));
}


// ===================== 59.0 — traitement des audits V58 =====================
// 59 : drapeaux porteurs de sens qui n’étaient relus nulle part (audit QA narratif n° 7).
const RECIT59_ECHOS = [
  // 60 (qa V59 #2, #6) : la crevasse ferme le trio à voix haute ; un accord à trois passé est relu dans une fin à deux.
  ['ACTE4_01_HALTE_DOME', gs => gs.hasFlag('crevasse_domination') && gs.hasFlag('lisiere_trio_ouvert'), "Personne ne reparle d’être trois. Depuis la crevasse, depuis ton ordre, la question s’est refermée d’elle-même, et aucun des deux ne la rouvrira."],
  ['FIN_OMBRE', gs => gs.hasFlag('trio_accord'), "Il y avait eu un accord à trois, dans le dôme. Il ne s’est pas brisé : il s’est resserré autour de deux. Alistair le sait. Il te bénit sans ton nom, à voix basse, et c’est la dernière prière qu’il te fait."],
  ['FIN_ECLAIREUR', gs => gs.hasFlag('trio_accord'), "Il y avait eu un accord à trois, dans le dôme. Il ne s’est pas brisé : il s’est resserré autour de deux. Kaelen le sait, et il lève deux doigts en partant, comme on solde un compte."],
  ['ACTE3_08_MISE_AU_POINT', gs => gs.hasFlag('liens_brises') && gs.hasFlag('apres_sirene_libere_59'), "Celui que tu as libéré le premier marche un peu plus près. Il ne dit pas merci. Il ne s’éloigne pas non plus."],
  ['ACTE3_08_MISE_AU_POINT', gs => gs.hasFlag('liens_brises') && gs.hasFlag('apres_sirene_assume_59'), "Tu n’as pas plaidé. Kaelen l’a remarqué, Alistair aussi. Ce n’est pas un pardon. C’est un endroit d’où repartir."],
  ['ACTE3_08_MISE_AU_POINT', gs => gs.hasFlag('depart_malaise') && !gs.hasFlag('apres_sirene_assume_59') && !gs.hasFlag('apres_sirene_libere_59'), "Personne ne propose de halte. Le malaise marche avec vous, à la même allure."],
  ['ACTE2_01_RENCONTRE_SILAS_1', gs => gs.hasFlag('secret_ancetre_partage'), "Le secret des cendres, tu ne l’as pas gardé pour toi. Fen dort contre ton cou, plus lourd, comme si la confidence l’avait rassuré."],
  ['ACTE2_17_RETROUVAILLES_SORTIE', gs => gs.hasFlag('solo_lucidite'), "La lucidité de la communion ne t’a pas quittée. Tu vois les visages avant qu’ils ne parlent, et tu choisis de les laisser parler quand même."],
  ['ACTE4_05_ARRIVEE_PORTES_1', gs => gs.hasFlag('solo_identite_finale'), "Devant les portes, tu sais ton nom sans que personne le prononce. C’est la première porte que tu franchis sans demander qui tu es."],
  ['ACTE1_07_RETROUVAILLES', gs => gs.hasFlag('truce_initiale'), "La trêve que tu as imposée tient encore. Kaelen et Alistair ne se parlent pas, mais ils marchent du même côté de toi."],
  ['LIEN_MARCHE_1', gs => gs.hasFlag('compagnon_chute_O') && companionPresentO(gs), "Kaelen n’a pas reparlé de la chute. Il marche du côté du vide, sans en avoir l’air."],
  ['LIEN_MARCHE_1', gs => gs.hasFlag('compagnon_chute_E') && companionPresentE(gs), "Alistair n’a pas reparlé de la chute. Il garde une main libre, toujours du côté du vide."],
  ['ACTE4_09_TRONE_EBENE', gs => gs.hasFlag('surcharge_partagee'), "Le givre se souvient d’avoir été partagé. Il monte moins vite quand on te tient la main."],
  ['ACTE4_09_TRONE_EBENE', gs => gs.hasFlag('surcharge_relachee') && !gs.hasFlag('surcharge_partagee'), "Tu as déjà relâché le givre une fois, d’un coup, dans la terre. Tu sais ce que ça coûte. Le Trône aussi."],
  ['ACTE4_09_TRONE_EBENE', gs => gs.hasFlag('felure_O_suspendue') && companionPresentO(gs), "La fêlure avec Kaelen n’est pas refermée. Vous l’avez suspendue. Il la porte comme une lame au fourreau."],
  ['ACTE4_09_TRONE_EBENE', gs => gs.hasFlag('felure_E_suspendue') && companionPresentE(gs), "La fêlure avec Alistair n’est pas refermée. Il ne prie pas pour qu’elle se ferme. Il attend que tu le décides."],
  ['ACTE4_06B_TEST_KAELEN', gs => gs.hasFlag('dague_kaelen_prise'), "La dague qu’il t’avait laissée au début du voyage est toujours à ta ceinture. Il la regarde avant de sortir la sienne. Il n’a jamais demandé que tu la rendes."],
  ['ACTE4_09_TRONE_EBENE', gs => gs.hasFlag('reveil_autel_inspecte'), "Sur l’accoudoir du Trône, le motif est gravé : une couronne ouverte, sept pointes, dont une brisée. Tes doigts le reconnaissent avant toi. C’était sur la pierre de ton réveil."],
  ['ACTE4_05_ARRIVEE_PORTES_1', gs => gs.hasFlag('trio_attente'), "Dans le dôme, vous avez choisi d’attendre. Personne ne l’a regretté à voix haute. Personne n’a oublié la question non plus."],
];

let _recit59Applied = false;
// Second avertissement de surcharge : on reprend les choix du premier, avec un drapeau propre et un IGNORER sans ambiguïté.
function _surcharge2_59_(db) {
  const A = db.AVERTISSEMENT_SURCHARGE; if (!A || db.AVERTISSEMENT_SURCHARGE_2) return;
  const B = Object.assign({}, A, { sceneNumber: 'SURCHARGE_SURSIS_2', title: "Le Givre au cœur", mood: 'danger' });
  B.getDynamicNarrative = gs => "Cette fois, le givre ne demande plus. Il a gagné tes coudes, ta nuque, le bord de tes lèvres. Quand tu respires, l’air gèle dans ta bouche.\n\n"
    + (gs.hasFlag('surcharge_ignoree') ? "Tu l’as ignoré une fois. Il s’en souvient. " : "")
    + "C’est le dernier avertissement : au prochain excès, la magie ne te débordera pas. Elle te remplacera.\n\n"
    + (companionPresentO(gs) ? "Kaelen ne demande plus combien de temps. Il se place entre toi et le vide, comme si ça pouvait servir. " : "")
    + (companionPresentE(gs) ? "Alistair ne prie pas. Il te regarde et attend que tu le lui demandes. " : "")
    + "Fen tremble contre ta gorge.";
  B.choices = A.choices.map(c => {
    const d = Object.assign({}, c, { effects: (c.effects || []).map(e => (e.type === 'SET_FLAG' && e.target === '_surcharge_sursis_vu') ? { type: 'SET_FLAG', target: '_surcharge_sursis2_vu' } : e) });
    if (!d.effects.some(e => e.target === '_surcharge_sursis2_vu')) d.effects.push({ type: 'SET_FLAG', target: '_surcharge_sursis2_vu' });
    if (c.key === 'IGNORER') { d.text = "Serrer les poings une dernière fois. Le prochain excès te tuera, et tu le sais."; d.response = "Le givre se tait. Ce n’est pas une victoire. C’est le silence d’avant la chute."; }
    return d;
  });
  db.AVERTISSEMENT_SURCHARGE_2 = B;
}
// Retour visible : chaque choix qui fait monter le givre le dit, avec la valeur.
function _feedbackGivre59_(db) {
  Object.keys(db).forEach(id => {
    (db[id].choices || []).forEach(c => {
      if (c._givre59) return;
      const v = (c.effects || []).filter(e => e.type === 'ADD_GAUGE' && e.target === 'instabilite').reduce((a, e) => a + (Number(e.value) || 0), 0);
      if (v > 0) { c.feedback = (c.feedback ? c.feedback + ' ' : '') + '❄ Le givre monte (+' + v + ').'; c._givre59 = true; }
      else if (v < 0) { c.feedback = (c.feedback ? c.feedback + ' ' : '') + '❄ Le givre reflue (' + v + ').'; c._givre59 = true; }
    });
  });
}

// 59 : chaque fin principale garde son dernier battement. Le passage vers l’épilogue a sa propre phrase,
// pose un drapeau de provenance, et l’épilogue s’ouvre sur une clôture propre à la fin vécue.
const EPILOGUE59 = {
  FIN_OMBRE: ["Rester encore un peu dans l’ombre qu’il a gardée.", "Kaelen dort, pour une fois, avant toi. Tu restes éveillée à le regarder ne pas monter la garde."],
  FIN_ECLAIREUR: ["Voir si la cage tient encore au matin.", "Alistair a laissé la porte de la chapelle ouverte toute la nuit. Il dit que c’est pour l’air. Ce n’est pas pour l’air."],
  FIN_SERAPHINE_COEUR: ["Attendre que la lampe s’éteigne d’elle-même.", "La lampe brûle encore quand tu te réveilles. Séraphine a gagné la dispute : c’est elle qui l’a tenue."],
  FIN_POLY: ["Voir ce que trois ombres font d’un matin.", "Ils se disputent la dernière tasse sans te la proposer. C’est la première fois que tu n’es pas l’arbitre, et tu ris."],
  FIN_SOLO: ["Marcher seule jusqu’au premier village.", "Personne ne t’attend au bas de la tour. Tu descends quand même, et la neige garde tes pas, rien que les tiens."],
  FIN_VERITE: ["Lire ce que le socle dit maintenant.", "Sur le socle, ton vrai nom a remplacé l’autre. Quelqu’un a déjà gratté une lettre. Tu la regraves toi-même."],
  FIN_HIVER: ["Compter ce que l’hiver a gardé.", "Le givre a tout pris, sauf ce que tu as décidé de lui refuser. La liste est courte. Tu la sais par cœur."],
  FIN_SACRIFICE: ["Écouter ce qui reste du monde sans toi.", "Ils parlent de toi au passé, et ils se trompent sur les détails. Le monde tient quand même. C’est ce que tu voulais."],
  FIN_BRISEE: ["Ramasser ce qui peut l’être.", "Les éclats de la couronne sont restés où ils sont tombés. Tu en gardes un. Pas pour régner. Pour te souvenir du poids."],
};
function _epilogue59_(db) {
  Object.keys(EPILOGUE59).forEach(id => {
    const F = db[id]; if (!F || !Array.isArray(F.choices)) return;
    const c = F.choices.find(x => x.key === 'EPILOGUE'); if (!c || c._ep59) return;
    c.text = EPILOGUE59[id][0];
    c.effects = (c.effects || []).concat([{ type: 'SET_FLAG', target: 'epilogue_de_' + id }]);
    c._ep59 = true;
  });
}
// Au plus 3 échos dans l’épilogue, les plus récents (et les plus propres à la route) d’abord.
function _epilogueClos59_(db) {
  const E = db.ACTE5_01_LENDEMAIN; if (!E || E._clos59) return;
  const inner = E.getDynamicNarrative, src = String(inner);
  const listes = [RECIT59_ECHOS, RECIT58_ECHOS, RECIT57B_ECHOS, RECIT57_ECHOS].map(l => l.filter(e => e[0] === 'ACTE5_01_LENDEMAIN').map(e => e[2]));
  const prio = [].concat(...listes);
  E.getDynamicNarrative = function (gs) {
    const t = String(inner.call(this, gs));
    const paras = t.split('\n\n');
    const echosPresents = prio.filter(x => paras.includes(x));
    const garder = new Set(echosPresents.slice(0, 3));
    const corps = paras.filter(p => !prio.includes(p) || garder.has(p));
    const fin = Object.keys(EPILOGUE59).find(id => gs.hasFlag('epilogue_de_' + id));
    return (fin ? EPILOGUE59[fin][1] + '\n\n' : '') + corps.join('\n\n');
  };
  E.getDynamicNarrative.toString = () => src;
  E._clos59 = true;
}
function applyRecit59_() {
  if (_recit59Applied || typeof DB === 'undefined') return;
  _recit59Applied = true;
  _surcharge2_59_(DB);
  _feedbackGivre59_(DB);
  _echos57Apply_(DB, RECIT59_ECHOS.filter(e => DB[e[0]]));
  _epilogue59_(DB);
  (DB.ACTE4_07_ADIEU_KALTHAR && DB.ACTE4_07_ADIEU_KALTHAR.choices || []).forEach(c => { if (!(c.effects || []).some(e => e.target === 'kalthar_adieu_vu_59')) c.effects = (c.effects || []).concat([{ type: 'SET_FLAG', target: 'kalthar_adieu_vu_59' }]); });
  _epilogueClos59_(DB);
  if (typeof NGPLUS_DB !== 'undefined') _feedbackGivre59_(NGPLUS_DB);
}

// ===== 60.3 : MISSION ADN — HALTES, SYSTÈMES RÉELS, JOURNAL DE QUÊTES, INDICES DU TRIO =====
// Additif : aucune scène ni aucun identifiant supprimé ; les nouveaux drapeaux finissent par 603.
const ITEMS603 = {
  plume_mira: 'Plume de Mira',
  fragment_couronne_veyra: 'Éclat de la couronne de Veyra',
  carte_marche_blanche: 'Carte griffonnée de la Marche Blanche',
  pain_village_603: 'Pain du village, enveloppé de lin'
};
// Journal de quêtes : chaque quête est lue depuis des drapeaux existants (aucun état caché nouveau).
const QUETES603 = [
  // 60.3.1 (playtest #1) : la halte ne se rouvre pas ; quittée sans Fen, la piste est « manquée » (et non « en cours » à vie).
  { id:'fen', titre:'Ce que Fen se rappelle', debut:g=>g.hasFlag('_halte603_entree')||g.hasFlag('_halte603_auberge'), fin:g=>g.hasFlag('_halte603_fen'), manquee:g=>g.hasFlag('_halte603_quittee'), indice:'Fen s’agite près de l’âtre de la salle commune. Lui parler avant de remonter.' },
  { id:'abri', titre:'L’abri de la Marche Blanche', debut:g=>g.hasItem('carte_marche_blanche'), fin:g=>g.hasFlag('_abri603_visite'), indice:'La carte de l’aubergiste indique un abri avant le ravin.' },
  { id:'oraya', titre:'La reine qui ne doit rien', debut:g=>g.hasFlag('_village603_oraya_vue'), fin:g=>g.hasFlag('_v28_oraya_guide_vu')||g.hasFlag('solo_oraya_passe_brise')||g.hasFlag('_oraya603_suivie'), indice:'Oraya a proposé de te guider au village caché.' },
  // 60.3.1 (bible N1) : la stèle de l'acte 3 ne donne qu'un indice ; le nom revient au seuil du Trône (FRAGMENT_4_STELE).
  { id:'stele', titre:'Le nom sur la stèle', debut:g=>g.hasFlag('_stele603_indice'), fin:g=>g.hasFlag('_fragment_4_vu')||g.hasFlag('_frag4_enrichi_vu'), indice:'La pierre de la tempête attend que ta mémoire revienne. Peut-être au seuil du Trône.' },
  // 60.3.1 (qa #2, playtest #2) : branchée sur les drapeaux réellement posés (DATABASE_Acte3/Secondary).
  { id:'dette', titre:'Les dettes de Kaelen et d’Alistair', debut:g=>g.hasFlag('dette_O_confrontee')||g.hasFlag('dette_E_confrontee')||g.hasFlag('dette_systeme_compris'), fin:g=>g.hasFlag('dette_position_finale')||g.hasFlag('dette_rendue_aux_deux')||g.hasFlag('dette_abolie_structurellement')||g.hasFlag('dette_rendue_une_6032'),
    manquee:g=>g.hasFlag('_seuil6032_franchi'), // 60.3.2 (qa #3) : le seuil du Trône franchi sans décision
    indice:g=>!(g.hasFlag('dette_O_confrontee')&&g.hasFlag('dette_E_confrontee'))&&!g.hasFlag('dette_systeme_compris')?'Kaelen et Alistair portent chacun une dette. Les entendre, ou au moins rendre la sienne à l’un d’eux avant le Trône.':!g.hasFlag('dette_systeme_compris')?'Mettre les deux dettes côte à côte : à l’artefact, ou au seuil du Trône.':'Au seuil du Trône, décider ce que deviennent les dettes.' },
  { id:'veyra', titre:'Le dernier pacte de Veyra', debut:g=>g.hasItem('fragment_couronne_veyra'), fin:g=>g.hasFlag('_veyra_pacte_vu')||g.hasFlag('veyra_pacte_final'), indice:'L’éclat de couronne de Veyra pèsera au moment du Trône.' }
];
function quetes603_(gs) {
  const out = [];
  QUETES603.forEach(function(q) {
    let d = false, f = false;
    let mq = false;
    try { d = !!q.debut(gs); f = !!q.fin(gs); mq = !f && !!(q.manquee && q.manquee(gs)); } catch (_) {}
    let ind = ''; try { ind = typeof q.indice === 'function' ? q.indice(gs) : q.indice; } catch (_) {}
    if (d || f) out.push({ id:q.id, titre:q.titre, etat: f ? 'accomplie' : (mq ? 'manquée' : 'en cours'), indice: (f || mq) ? '' : ind });
  });
  return out;
}
function _narr603_(scene) {
  if (typeof scene.getDynamicNarrative === 'function') return scene.getDynamicNarrative;
  const t = scene.text || scene.narrative || '';
  return function() { return t; };
}
function _ajout603_(db, id, fn) {
  const S = db[id]; if (!S) return;
  const base = _narr603_(S);
  S.getDynamicNarrative = function(gs) { let a = ''; try { a = fn(gs) || ''; } catch (_) {} return base(gs) + (a ? '\n\n' + a : ''); };
}
// 60.3.1 (romance P1/P3) : un indice du trio n'apparaît que si rien ne contredit le consentement
// (refus, amitié, pause, rupture, domination, nuit non réparée, emprise) et si les deux romances sont ouvertes.
function indiceTrio6031_(gs) {
  const f = k => gs.hasFlag(k);
  if (!f('poly_eligible') || f('_trio_nuit_vue') || !companionPresentO(gs) || !companionPresentE(gs)) return false;
  if (f('double_jeu') && !f('poly_repare_60')) return false;
  if (['crevasse_domination','domination_acte3_O','domination_acte3_E','go_poly_domination','domination_finale','kaelen_refuse','alistair_refuse','amis_O','amis_E','amis_O_ferme','amis_E_ferme','romance_en_pause_O','romance_en_pause_E','romance_O_rompue','romance_E_rompue','refus_deux_auberge'].some(f)) return false;
  if ((gs.getGauge('possession') || 0) >= 12) return false;
  return (f('interet_romantique_O') || f('lisiere_romance_O_ouverte')) && (f('interet_romantique_E') || f('lisiere_romance_E_ouverte'));
}
// 60.3.2 : la question à trois peut être posée quand rien ne contredit le consentement et que les deux
// romances sont ouvertes (sans exiger les seuils élevés de poly_eligible, réservés à l'indice).
function trioQuestion6032_(g) {
  const f = k => g.hasFlag(k);
  if (f('_trio6032_question_vue') || f('lisiere_trio_ouvert') || f('trio_refuse') || f('_trio_nuit_vue') || f('trio_question_refermee_6033') || f('trio_question_refusee_6033')) return false;
  if (!romanceAvailableO(g) || !romanceAvailableE(g) || dominationRomance6032_(g)) return false;
  if (f('double_jeu') && !f('poly_repare_60')) return false;
  if (['kaelen_refuse','alistair_refuse','refus_deux_auberge'].some(f)) return false;
  // 60.3.3 (romance P9) : comme l'indice du trio, il faut un intérêt romantique réel envers les deux.
  // La question attend qu'il existe ; elle n'est pas « brûlée » par un non prévisible.
  if (!trioInteret6033_(g,'O') || !trioInteret6033_(g,'E')) return false;
  return (g.getGauge('lien_O') || 0) >= 4 && (g.getGauge('lien_E') || 0) >= 4;
}
function trioInteret6033_(g, r) {
  return ['interet_romantique_','lisiere_romance_','focus_romantique_'].some(function(p) { return g.hasFlag(p === 'lisiere_romance_' ? p + r + '_ouverte' : p + r); });
}
// 60.3.3 (romance P1) : la réponse de chacun dépend de ce qu'il a vécu, jamais du bouton choisi.
function trioOui6033_(g, r) {
  if (!trioInteret6033_(g, r)) return false;
  if (g.hasFlag(r === 'O' ? 'kaelen_refuse' : 'alistair_refuse') || g.hasFlag(r === 'O' ? 'joute_froide_O' : 'joute_froide_E')) return false;
  return (g.getGauge('lien_' + r) || 0) >= 5;
}
let _adn603Applied = false;
function applyAdn603_() {
  if (_adn603Applied || typeof DB === 'undefined') return;
  _adn603Applied = true;
  const vu = f => g => !g.hasFlag(f);

  // --- Halte 1 : la salle commune de l'auberge (acte 2) ---
  DB.HALTE603_AUBERGE = {
    sceneNumber:'HALTE603_AUBERGE', chapter:2, title:'La Salle Commune', mood:'exploration',
    image: DB.ACTE2_06_NUIT_AUBERGE && DB.ACTE2_06_NUIT_AUBERGE.image,
    getDynamicNarrative: function(gs) {
      let t = "La salle commune est basse de plafond, le feu trop grand pour l’espace. La laine des manteaux mouillés sèche en sentant la bière et le bois brûlé. Personne ne te salue. Quelques regards s’attardent, puis se détournent. Le bruit des conversations baisse d’un cran, juste assez pour que tu l’entendes.";
      const v = gs.getRep ? gs.getRep('village') : 0, c = gs.getRep ? gs.getRep('culte') : 0, o = gs.getRep ? gs.getRep('ordre') : 0;
      if (v >= 1) t += "\n\nL’aubergiste pose un bol devant toi sans que tu l’aies demandé. « On a su, pour le grain. » Il n’en dit pas plus. Ici, c’est un remerciement.";
      else if (v <= -1) t += "\n\nL’aubergiste essuie le même verre depuis que tu es entrée. Quand tu t’approches, il recule d’un pas. On a parlé de toi, et pas en bien.";
      if (o <= -2) t += "\n\nDeux soldats de l’Ordre jouent aux dés près de la porte. L’un d’eux crache par terre quand tu passes. L’Ordre n’oublie pas.";
      else if (c >= 2) t += "\n\nUne femme aux mains tachées d’encre trace discrètement le signe du culte en te voyant. Les fidèles ont entendu parler de toi.";
      if (indiceTrio6031_(gs))
        t += "\n\nÀ la table du fond, Kaelen et Alistair boivent sans se battre. Kaelen pousse la cruche vers Alistair ; Alistair la remplit sans prier dessus. Il reste une chaise libre entre eux. Ni l’un ni l’autre ne l’a poussée vers toi. Ni l’un ni l’autre ne l’a retirée.";
      return t;
    },
    choices: [
      { key:'RUMEURS', condition: vu('_halte603_rumeurs'), text:"Écouter ce qu’on raconte au comptoir.",
        response:"Un colporteur parle d’un abri taillé dans la glace, avant le ravin de la Marche Blanche. « Ceux qui le trouvent n’ont plus froid de la même façon. » L’aubergiste griffonne le chemin sur un bout de cuir et te le glisse.",
        effects:[{type:'SET_FLAG',target:'_halte603_rumeurs'},{type:'ADD_ITEM',target:'carte_marche_blanche'}], next:'HALTE603_AUBERGE' },
      // 60.3.1 (qa #3, playtest #3) : plus de seuil de réputation (aucune source village avant l'acte 3) ; seule l'hostilité ferme l'option.
      { key:'VILLAGE', condition: g => !g.hasFlag('_halte603_pain') && (g.getRep ? g.getRep('village') : 0) >= 0, text:"Aider l’aubergiste à décharger la carriole des réfugiés.",
        response:"Tu portes des sacs jusqu’à ce que tes bras tremblent. L’aubergiste te tend un pain enveloppé de lin. « Pour la route. Ici, on paie avec ce qu’on porte. »",
        effects:[{type:'SET_FLAG',target:'_halte603_pain'},{type:'ADD_ITEM',target:'pain_village_603'},{type:'ADD_GAUGE',target:'volonte',value:1},{type:'ADD_REP',target:'village',value:1}], next:'HALTE603_AUBERGE' },
      { key:'JOUTE_O', condition: g => !g.hasFlag('_joute_O1_vu') && companionPresentO(g) && relationAvailableO(g), text:"Kaelen t’attend près de l’escalier, bras croisés. Aller entendre ses termes.",
        effects:[{type:'SET_FLAG',target:'_halte603_auberge'},{type:'PUSH_RETURN',target:'HALTE603_AUBERGE'}], next:'JOUTE_O_1' },
      { key:'JOUTE_E', condition: g => !g.hasFlag('_joute_E1_vu') && companionPresentE(g) && (typeof relationAvailableE !== 'function' || relationAvailableE(g)), text:"Alistair tourne une clé entre ses doigts. Lui demander ce qu’elle ouvre.",
        effects:[{type:'SET_FLAG',target:'_halte603_auberge'},{type:'PUSH_RETURN',target:'HALTE603_AUBERGE'}], next:'JOUTE_E_1' },
      // ACTE2_07_TRANSE_FEN reste retirée (redirigée par le moteur depuis 52.5.4) : la halte ne la ranime pas.
      { key:'FEN', condition: vu('_halte603_fen'), text:"Fen fixe l’âtre sans cligner. S’asseoir près de lui et regarder ce qu’il regarde.",
        response:"Dans les braises, une forme : un trône, puis une main qui s’en écarte. Fen pose son museau sur ton genou, comme pour dire qu’il l’a vue aussi. Tu ne sais pas encore si c’est un souvenir ou un avertissement.",
        effects:[{type:'SET_FLAG',target:'_halte603_auberge'},{type:'SET_FLAG',target:'_halte603_fen'},{type:'ADD_GAUGE',target:'memoire_kalthar',value:1}], next:'HALTE603_AUBERGE' },
      { key:'REMONTER', text:"Remonter à l’étage. La nuit n’attend pas.", effects:[{type:'SET_FLAG',target:'_halte603_auberge'},{type:'SET_FLAG',target:'_halte603_quittee'}], next:'ACTE2_06_NUIT_AUBERGE' }
    ]
  };
  if (DB.ACTE2_06_NUIT_AUBERGE) DB.ACTE2_06_NUIT_AUBERGE.choices.unshift(
    { key:'HALTE603', condition: vu('_halte603_auberge'), text:"Descendre dans la salle commune avant de monter. Les voix en bas ne sont pas toutes fermées.", effects:[{type:'SET_FLAG',target:'_halte603_entree'}], next:'HALTE603_AUBERGE' });

  // --- Halte 2 : l'abri de la Marche Blanche (scènes 2.09B jusque-là sans entrée) ---
  const mb = DB.LIEN_MARCHE_BLANCHE_B;
  if (mb && DB.ACTE2_09B_BIVOUAC_GLACE) {
    mb.choices = (mb.choices || []).slice();
    mb.choices.unshift({ key:'ABRI603', condition: g => g.hasItem('carte_marche_blanche') || (g.getGauge('volonte') || 0) >= 6,
      text:"Quitter la piste et chercher l’abri taillé dans la glace.",
      response:"La carte de cuir — ou ton entêtement — te mène à une fente dans la paroi. Dedans, il fait presque doux.",
      effects:[{type:'SET_FLAG',target:'_abri603_visite'}], next:'ACTE2_09B_BIVOUAC_GLACE' });
  }

  // --- Halte 3 : le village caché, Oraya (acte 3) ---
  if (DB.ACTE3_09_VILLAGE_CACHE && DB.V28_ORAYA_PROPOSE_GUIDE) {
    DB.ACTE3_09_VILLAGE_CACHE.choices.unshift({ key:'ORAYA603', condition: g => !g.hasFlag('_village603_oraya_vue') && !companionPresentO(g) && !companionPresentE(g),
      text:"Une silhouette encapuchonnée t’attend au bord du puits. Oraya. L’écouter avant d’entrer.",
      effects:[{type:'SET_FLAG',target:'_village603_oraya_vue'}], next:'V28_ORAYA_PROPOSE_GUIDE' });
  }

  // --- Halte 4 : la stèle sous la tempête (acte 3, bivouac) ---
  if (DB.ACTE3_09B_BIVOUAC_TEMPETE && DB.FRAGMENT_4_ENRICHI) {
    // 60.3.1 (bible N1, critique) : la halte n'ouvre plus FRAGMENT_4_ENRICHI à l'acte 3. Elle mène à un indice
    // sans nom ni Trône ; la révélation reste à FRAGMENT_4_STELE (acte 4). Clé STELE603 conservée (sauvegardes).
    DB.STELE603_INDICE = {
      sceneNumber:'STELE603_INDICE', chapter:3, title:'La Pierre sous la Neige', mood:'exploration',
      image: DB.ACTE3_09B_BIVOUAC_TEMPETE.image,
      getDynamicNarrative: function(gs) {
        return "Fen creuse jusqu’à ce que ses pattes saignent. Dessous, une pierre plate, plus vieille que la crevasse. Des lettres y sont gravées, rongées par trois hivers de trop. Tu reconnais la forme d’un nom sans pouvoir le lire.\n\nQuand tu poses la main dessus, la pierre est tiède. Une seconde, tu sens d’autres mains sur tes poignets, et une voix qui dit « C’est le prix ». Puis plus rien. Juste la neige, et Fen qui gronde doucement.";
      },
      choices: [{ key:'NEXT', text:"Recouvrir la pierre. Ce nom reviendra quand tu seras prête.", effects:[{type:'SET_FLAG',target:'_stele603_indice'},{type:'ADD_GAUGE',target:'memoire_kalthar',value:1}], next:'RETURN' }]
    };
    DB.ACTE3_09B_BIVOUAC_TEMPETE.choices.unshift({ key:'STELE603', condition: g => !g.hasFlag('_stele603_indice') && !g.hasFlag('_frag4_enrichi_vu') && !g.hasFlag('_fragment_4_vu'),
      text:"Fen gratte la neige au pied de la crevasse. Une pierre gravée dépasse. S’arrêter pour la regarder.",
      effects:[{type:'PUSH_RETURN',target:'ACTE3_09B_BIVOUAC_TEMPETE'}], next:'STELE603_INDICE' });
    _ajout603_(DB, 'ACTE3_09B_BIVOUAC_TEMPETE', function(gs) {
      if (indiceTrio6031_(gs))
        return "Ils se relaient pour garder le feu sans se le dire. Quand Kaelen s’endort, Alistair lui remonte sa cape sur l’épaule. Il voit que tu l’as vu. Il ne s’en excuse pas.";
      return '';
    });
  }

  // --- 60.3.2 (qa V60.3.1 #1) : une ouverture consentie à trois, explicite, en dehors de la Lisière ---
  // N'apparaît que là où l'indice du trio s'affiche (consentement non contredit, deux romances ouvertes).
  DB.TRIO6032_QUESTION = {
    sceneNumber:'TRIO6032_QUESTION', chapter:2, title:'La Chaise Libre', mood:'intimate',
    image: DB.ACTE2_06_NUIT_AUBERGE && DB.ACTE2_06_NUIT_AUBERGE.image,
    getDynamicNarrative: function(gs) {
      return "Tu t’assieds sur la chaise libre. Tu ne touches personne.\n\n« Je ne vous demande rien ce soir, » dis-tu. « Je veux seulement savoir si la question a le droit d’exister. À trois. Chacun répond pour lui. Non est une vraie réponse. »\n\nKaelen repose sa chope. Alistair cesse de tourner sa clé. Ils se regardent, longtemps, comme deux hommes qui ont appris à se méfier de tout ce qui se décide trop vite.";
    },
    choices: [
      { key:'ATTENDRE', text:"Attendre leur réponse sans la souffler.",
        response:"« Oui, » dit Kaelen. « Qu’elle existe. Pas plus, pas ce soir. » Alistair prend son temps. « Oui. À condition que n’importe lequel de nous puisse la refermer. » Il regarde Kaelen. « Toi aussi. » Kaelen hoche la tête, puis le dit : « Moi aussi. Oui. »",
        journal:"À l’auberge, Kaelen et Alistair ont dit oui, chacun pour lui, à ce que la question d’un lien à trois puisse exister. Rien n’est promis ; chacun peut la refermer.",
        effects:[{type:'SET_FLAG',target:'_trio6032_question_vue'},{type:'SET_FLAG',target:'lisiere_trio_ouvert'},{type:'SET_FLAG',target:'trio_question_6032'}], next:'RETURN' },
      { key:'RETIRER', text:"Te lever. « Oubliez. Ce n’était pas le moment. »",
        response:"Personne ne te retient. Kaelen pousse la cruche vers toi, comme si de rien n’était. C’est sa façon de dire merci.",
        effects:[{type:'SET_FLAG',target:'_trio6032_question_vue'}], next:'RETURN' }
    ]
  };
  DB.HALTE603_AUBERGE.choices.splice(DB.HALTE603_AUBERGE.choices.length - 1, 0,
    { key:'TRIO6032', condition: g => trioQuestion6032_(g),
      text:"T’asseoir sur la chaise libre et leur demander, à chacun, si la question a le droit d’exister.",
      effects:[{type:'PUSH_RETURN',target:'HALTE603_AUBERGE'}], next:'TRIO6032_QUESTION' });
  if (DB.ACTE3_09B_BIVOUAC_TEMPETE) DB.ACTE3_09B_BIVOUAC_TEMPETE.choices.push(
    { key:'TRIO6032', condition: g => trioQuestion6032_(g),
      text:"Leur demander, à chacun, si la question d’être trois a le droit d’exister.",
      effects:[{type:'PUSH_RETURN',target:'ACTE3_09B_BIVOUAC_TEMPETE'}], next:'TRIO6032_QUESTION' });

  // --- 60.3.2 (qa V60.3.1 #3, playtest #2) : les dettes se règlent au seuil du Trône (écran presque toujours traversé) ---
  const seuil = DB.ACTE4_08_SEUIL_ETERNITE;
  if (seuil && DB.DETTE_REVELATION && DB.DETTE_CHOIX) {
    seuil.choices = seuil.choices.map(function(c) { const k = Object.assign({}, c); k.effects = (c.effects || []).concat([{type:'SET_FLAG',target:'_seuil6032_franchi'}]); return k; });
    const regle = g => g.hasFlag('dette_position_finale') || g.hasFlag('dette_rendue_une_6032');
    seuil.choices.unshift(
      { key:'DETTE6032_REVELATION', condition: g => g.hasFlag('dette_O_confrontee') && g.hasFlag('dette_E_confrontee') && !g.hasFlag('dette_systeme_compris') && !regle(g),
        text:"Avant le seuil : poser côte à côte la dette de Kaelen et celle d’Alistair.", effects:[{type:'PUSH_RETURN',target:'ACTE4_08_SEUIL_ETERNITE'}], next:'DETTE_REVELATION' },
      { key:'DETTE6032_CHOIX', condition: g => g.hasFlag('dette_systeme_compris') && !regle(g),
        text:"Avant le seuil : décider ce qui peut encore être hérité des anciennes dettes.", effects:[{type:'PUSH_RETURN',target:'ACTE4_08_SEUIL_ETERNITE'}], next:'DETTE_CHOIX' },
      { key:'DETTE6032_RENDRE_O', condition: g => g.hasFlag('dette_O_confrontee') && !g.hasFlag('dette_E_confrontee') && !regle(g) && companionPresentO(g),
        text:"Rendre à Kaelen le contrat qu’il t’a montré. « Ça ne m’appartient pas. »",
        response:"Il le prend sans le lire. Il le plie en quatre, puis en huit, jusqu’à ce qu’il ne puisse plus le plier. « Personne ne m’avait jamais rendu quelque chose, » dit-il.",
        journal:"Au seuil du Trône, tu as rendu à Kaelen le contrat de sa dette.",
        effects:[{type:'SET_FLAG',target:'dette_rendue_une_6032'},{type:'SET_FLAG',target:'dette_rendue_O_6032'},{type:'ADD_GAUGE',target:'volonte',value:1}], next:'ACTE4_08_SEUIL_ETERNITE' },
      { key:'DETTE6032_RENDRE_E', condition: g => g.hasFlag('dette_E_confrontee') && !g.hasFlag('dette_O_confrontee') && !regle(g) && companionPresentE(g),
        text:"Rendre à Alistair le sceau de son devoir. « Ta foi ne me doit rien. »",
        response:"Il garde le sceau dans sa paume ouverte, longtemps, comme on garde un oiseau qui hésite. « Je ne sais pas encore quoi en faire, » dit-il. « C’est la première fois que j’ai le choix. »",
        journal:"Au seuil du Trône, tu as rendu à Alistair le sceau de sa dette.",
        effects:[{type:'SET_FLAG',target:'dette_rendue_une_6032'},{type:'SET_FLAG',target:'dette_rendue_E_6032'},{type:'ADD_GAUGE',target:'volonte',value:1}], next:'ACTE4_08_SEUIL_ETERNITE' });
  }

  // --- Réputation : effets lus dans les scènes ---
  _ajout603_(DB, 'ACTE3_10_ACCUEIL_CULTE_1', function(gs) {
    const c = gs.getRep ? gs.getRep('culte') : 0;
    if (c >= 2) return "Une fidèle te reconnaît. « C’est elle, pour le grain. » La garde du culte s’écarte un peu plus que prévu.";
    if (c <= -2) return "Un murmure court dans les rangs : on se souvient que tu as nourri leurs ennemis. Les lances restent levées un instant de trop.";
    return '';
  });
  // 60.3.1 (bible N3) : les variantes de FIN_VERITE lisent déjà la narration de FIN_VERITE (FINS603_DISTINCTES) ;
  // les envelopper aussi doublait le paragraphe. (bible N4/N5) : pas d'écho de réputation sur la dissolution ni la domination.
  ['FIN_VERITE','FIN_HIVER','FIN_SOLO','FIN_SACRIFICE','FIN_BRISEE'].forEach(function(id) {
    _ajout603_(DB, id, function(gs) {
      if (gs.hasFlag('variante_FIN_CHAOS') || gs.hasFlag('variante_FIN_DOMINATION')) return '';
      const v = gs.getRep ? gs.getRep('village') : 0, o = gs.getRep ? gs.getRep('ordre') : 0, c = gs.getRep ? gs.getRep('culte') : 0;
      const l = [];
      if (v >= 2) l.push("Au village, on garde une place près du feu pour celle qui avait partagé le grain.");
      else if (v <= -2) l.push("Au village, on ferme les volets quand on prononce ton nom.");
      if (o <= -3) l.push("L’Ordre inscrit ton nom parmi ceux qu’il ne pardonnera pas.");
      if (c >= 3) l.push("Le culte chante ton nom à l’envers, comme on chante les reines qui ont rendu quelque chose.");
      if (gs.hasItem('pain_village_603') && id === 'FIN_SOLO') l.push("Au fond de ton sac, le pain de l’aubergiste. Tu ne pars pas tout à fait seule.");
      return l.join(' ');
    });
  });

  // --- Inventaire : l'éclat de Veyra et la plume de Mira se rappellent au Trône ---
  _ajout603_(DB, 'ACTE4_09_TRONE_EBENE', function(gs) {
    const l = [];
    if (gs.hasItem('fragment_couronne_veyra')) l.push("L’éclat de couronne de Veyra chauffe contre ta hanche. Elle attend une réponse.");
    if (gs.hasItem('plume_mira')) l.push("La plume de Mira dépasse de ta manche. Une route de contrebande reste ouverte.");
    return l.join(' ');
  });

  // --- Volonté : les survies partagées coûtent quelque chose (R10) ---
  Object.keys(DB).forEach(function(id) {
    (DB[id].choices || []).forEach(function(c) {
      if ((c.key === 'MAIN_TENDUE' && (c.effects||[]).some(e => e.target === 'sirene_main_tendue_601')) ||
          (c.key === 'TENUE' && (c.effects||[]).some(e => e.target === 'sceau_tenue_601'))) {
        if (!(c.effects||[]).some(e => e.target === 'volonte')) {
          c.effects = c.effects.slice();
          c.effects.push({type:'ADD_GAUGE',target:'volonte',value:-2});
          c.effects.push({type:'SET_FLAG',target:'survie_portee_603'});
        }
      }
    });
  });

  // ===================== 60.3.3 — audits revue-6032 (romance P1/P5/P6/P7/P8/P9) =====================
  // La question à trois : chacun répond pour lui. Attendre ne vaut jamais oui ; la réponse dépend de ce que
  // Kaelen et Alistair ont vécu (intérêt réel et lien solide), pas du bouton choisi. Un seul non referme la
  // question pour les trois. Elenya dit son propre oui. Kaelen demande l'accord d'Alistair.
  // Le décor suit le lieu : auberge (chaise, chope, cruche) ou bivouac (feu, dague, sceau).
  function trio6033_(lieu) {
    const auberge = lieu === 'auberge';
    const base = auberge ? DB.ACTE2_06_NUIT_AUBERGE : DB.ACTE3_09B_BIVOUAC_TEMPETE;
    const intro = auberge
      ? "Tu t’assieds sur la chaise libre. Tu ne touches personne."
      : "Tu t’assieds entre eux, au feu, sans toucher personne. Le vent couche les flammes, puis les relâche.";
    const gestes = auberge
      ? "Kaelen repose sa chope. Alistair cesse de tourner sa clé."
      : "Kaelen pose sa dague à plat sur ses genoux. Alistair cesse de frotter son sceau.";
    const lieuJ = auberge ? "À l’auberge" : "Au bivouac, dans la tempête";
    const ouiTxt = "« Oui, » dit Kaelen. « Qu’elle existe. Pas plus, pas ce soir. » Il se tourne vers Alistair. « Et toi, avec moi dedans ? » Alistair prend son temps. « Oui. Avec toi dedans. À condition que n’importe lequel de nous puisse la refermer. » Il te regarde. « Et toi ? »\n\n« Pour moi aussi, oui, » dis-tu. « Qu’elle existe. Et que chacun de nous puisse la refermer. »";
    const nonDeux = "« Non, » dit Kaelen, sans dureté. « Pas parce que c’est toi. Parce que ce n’est pas moi. » Alistair hoche la tête. « Pour moi non plus. Merci d’avoir demandé. »\n\nPersonne ne se lève. " + (auberge ? "Kaelen pousse la cruche vers toi." : "Kaelen remet une bûche dans le feu.") + " La question est refermée, et rien d’autre ne l’est.";
    const nonO = "Alistair commence : « Je crois que… » Kaelen l’arrête d’un geste, sans le regarder. « Non. Pas moi. Pas à trois. » Il le dit à toi, puis à Alistair, à égalité.\n\nAlistair baisse la tête. « Alors c’est non pour nous trois. Une question ne tient pas si l’un de nous doit s’y forcer. » " + (auberge ? "Personne ne se lève de table." : "Personne ne quitte le feu.");
    const nonE = "Kaelen hausse une épaule, prêt à dire oui. Alistair secoue la tête avant lui. « Non. Je ne saurais pas. Et je ne veux pas apprendre en vous faisant payer mes doutes. »\n\nKaelen ne discute pas. « Alors c’est non. Pour nous trois. » " + (auberge ? "Il repose sa chope." : "Il remet une bûche.");
    const refusFx = [{type:'SET_FLAG',target:'_trio6032_question_vue'},{type:'SET_FLAG',target:'trio_question_refusee_6033'}];
    const jRefus = lieuJ + ", tu as demandé si la question d’un lien à trois avait le droit d’exister. La réponse a été non, et elle a été entendue.";
    return {
      sceneNumber:'TRIO6033_' + (auberge ? 'AUBERGE' : 'BIVOUAC'), chapter: auberge ? 2 : 3,
      title: auberge ? 'La Chaise Libre' : 'Le Feu Partagé', mood:'intimate',
      image: base && base.image,
      getDynamicNarrative: function() {
        return intro + "\n\n« Je ne vous demande rien " + (auberge ? "ce soir" : "cette nuit") + ", » dis-tu. « Je veux seulement savoir si la question a le droit d’exister. À trois. Chacun répond pour lui. Non est une vraie réponse. »\n\n" + gestes + " Ils se regardent, longtemps, comme deux hommes qui ont appris à se méfier de tout ce qui se décide trop vite.";
      },
      choices: [
        { key:'ATTENDRE', condition: g => trioOui6033_(g,'O') && trioOui6033_(g,'E'), text:"Attendre leur réponse sans la souffler.", intent:'confiance', importance:'major',
          response: ouiTxt,
          journal: lieuJ + ", Kaelen et Alistair ont dit oui, chacun pour lui et l’un à l’autre, à ce que la question d’un lien à trois puisse exister. Tu as dit oui aussi. Rien n’est promis ; chacun peut la refermer.",
          effects:[{type:'SET_FLAG',target:'_trio6032_question_vue'},{type:'SET_FLAG',target:'lisiere_trio_ouvert'},{type:'SET_FLAG',target:'trio_question_6032'}], next:'RETURN' },
        { key:'ATTENDRE_NON', condition: g => !trioOui6033_(g,'O') && !trioOui6033_(g,'E'), text:"Attendre leur réponse sans la souffler.", intent:'confiance', importance:'major',
          response: nonDeux, journal: jRefus, effects: refusFx, next:'RETURN' },
        { key:'ATTENDRE_NON_O', condition: g => !trioOui6033_(g,'O') && trioOui6033_(g,'E'), text:"Attendre leur réponse sans la souffler.", intent:'confiance', importance:'major',
          response: nonO, journal: jRefus, effects: refusFx, next:'RETURN' },
        { key:'ATTENDRE_NON_E', condition: g => trioOui6033_(g,'O') && !trioOui6033_(g,'E'), text:"Attendre leur réponse sans la souffler.", intent:'confiance', importance:'major',
          response: nonE, journal: jRefus, effects: refusFx, next:'RETURN' },
        { key:'RETIRER', text: auberge ? "Te lever. « Oubliez. Ce n’était pas le moment. »" : "Te relever, dos au vent. « Oubliez. Ce n’était pas le moment. »", intent:'distance',
          response: auberge ? "Personne ne te retient. Kaelen pousse la cruche vers toi, comme si de rien n’était. C’est sa façon de dire merci." : "Personne ne te retient. Kaelen remet une bûche, comme si de rien n’était. C’est sa façon de dire merci.",
          effects:[{type:'SET_FLAG',target:'_trio6032_question_vue'}], next:'RETURN' }
      ]
    };
  }
  DB.TRIO6032_QUESTION = trio6033_('auberge'); // même identifiant : une sauvegarde arrêtée ici reste valide
  DB.TRIO6033_BIVOUAC = trio6033_('bivouac');
  if (DB.ACTE3_09B_BIVOUAC_TEMPETE) DB.ACTE3_09B_BIVOUAC_TEMPETE.choices.forEach(function(c) { if (c.key === 'TRIO6032') c.next = 'TRIO6033_BIVOUAC'; });

  // Révocation réelle (P6) : refermer la question est un choix, qui retire l'ouverture.
  DB.TRIO6033_REFERMER = {
    sceneNumber:'TRIO6033_REFERMER', chapter:3, title:'La Question Refermée', mood:'intimate',
    image: DB.ACTE3_09B_BIVOUAC_TEMPETE && DB.ACTE3_09B_BIVOUAC_TEMPETE.image,
    getDynamicNarrative: function() {
      return "La question à trois existe toujours entre vous. Personne n’y a touché depuis qu’elle a été dite. Elle peut rester ouverte. Elle peut aussi se refermer, par n’importe lequel d’entre vous, sans avoir à se justifier.";
    },
    choices: [
      { key:'REFERMER', text:"« Je la referme. Pas contre vous. Pour moi. »", intent:'liberte', importance:'major',
        response:"Kaelen hoche la tête, une fois. Alistair dit : « Merci de l’avoir dit à voix haute. » Rien d’autre ne change. C’est exactement ce que l’accord promettait.",
        journal:"Tu as refermé la question d’un lien à trois. Personne ne te l’a reproché.",
        effects:[{type:'REMOVE_FLAG',target:'lisiere_trio_ouvert'},{type:'SET_FLAG',target:'trio_question_refermee_6033'}], next:'RETURN' },
      { key:'LAISSER', condition: g => trioOui6033_(g,'O') && trioOui6033_(g,'E'), text:"Ne rien changer. La laisser ouverte, sans la pousser.", intent:'confiance',
        response:"Tu n’ajoutes rien. Elle reste là, posée entre vous, sans poids.",
        effects:[], next:'RETURN' },
      // 60.8.1 (romance R6) : « n’importe lequel de nous » vaut aussi pour eux. Si l’un d’eux ne dit plus oui
      // (refus, froid, lien retombé), c’est lui qui la referme, sans reproche ; la tienne reste entière.
      { key:'LAISSER_O_REFERME', condition: g => !trioOui6033_(g,'O'), text:"Ne rien changer. La laisser ouverte, sans la pousser.", intent:'confiance',
        response:"Kaelen parle avant toi. « Je la referme, moi. Pas contre toi, pas contre lui. Je ne dis plus oui, et je ne veux pas faire semblant. » Alistair hoche la tête. Personne ne s’éloigne du feu.",
        journal:"Kaelen a refermé la question d’un lien à trois. Il l’a dit simplement ; personne ne le lui a reproché.",
        effects:[{type:'REMOVE_FLAG',target:'lisiere_trio_ouvert'},{type:'SET_FLAG',target:'trio_question_refermee_6033'},{type:'SET_FLAG',target:'trio_refermee_par_O_6081'}], next:'RETURN' },
      { key:'LAISSER_E_REFERME', condition: g => trioOui6033_(g,'O') && !trioOui6033_(g,'E'), text:"Ne rien changer. La laisser ouverte, sans la pousser.", intent:'confiance',
        response:"Alistair lève la main, doucement. « Je la referme. J’ai dit qu’on pourrait, chacun. Je ne dis plus oui, et je ne veux pas apprendre en vous faisant payer mes doutes. » Kaelen ne discute pas. Rien d’autre ne change.",
        journal:"Alistair a refermé la question d’un lien à trois. Il l’a dit simplement ; personne ne le lui a reproché.",
        effects:[{type:'REMOVE_FLAG',target:'lisiere_trio_ouvert'},{type:'SET_FLAG',target:'trio_question_refermee_6033'},{type:'SET_FLAG',target:'trio_refermee_par_E_6081'}], next:'RETURN' }
    ]
  };
  const refermerChoix = function(retour) {
    return { key:'TRIO6033_REFERMER', condition: g => g.hasFlag('trio_question_6032') && g.hasFlag('lisiere_trio_ouvert') && !g.hasFlag('_trio_nuit_vue') && !g.hasFlag('trio_question_refermee_6033'),
      text:"Repenser à la question à trois. La laisser ouverte, ou la refermer.", intent:'liberte',
      effects:[{type:'PUSH_RETURN',target:retour}], next:'TRIO6033_REFERMER' };
  };
  if (DB.HALTE603_AUBERGE) DB.HALTE603_AUBERGE.choices.splice(DB.HALTE603_AUBERGE.choices.length - 1, 0, refermerChoix('HALTE603_AUBERGE'));
  if (DB.ACTE3_09B_BIVOUAC_TEMPETE) DB.ACTE3_09B_BIVOUAC_TEMPETE.choices.push(refermerChoix('ACTE3_09B_BIVOUAC_TEMPETE'));

  // romance P10 : pas de baiser ni de serment amoureux avec Séraphine sous emprise.
  [['SERAPHINE_COEUR_3_LAME','BAISER'],['SERAPHINE_DERNIER_SERMENT','AIMER']].forEach(function(p) {
    const S = DB[p[0]]; if (!S) return;
    S.choices.forEach(function(c) {
      if (c.key !== p[1]) return; const old = c.condition;
      c.condition = g => (!old || old(g)) && (g.getGauge('possession') || 0) < POSSESSION_EMPRISE;
    });
  });

}

// ===== 60.8.0 : RYTHME — transitions mécaniques fusionnées, vraies décisions ajoutées =====
// Fusion : une scène de pure réaction (pas d'image propre, un seul choix sans condition) devient la réponse
// du choix qui y menait ; la scène reste dans DB pour les sauvegardes et les retours (RETURN/PUSH_RETURN).
var _rythme608Applied = false;
function fusion608_(id) {
  const S = DB[id]; if (!S || !Array.isArray(S.choices) || S.choices.length !== 1 || S.choices[0].condition) return 0;
  const suite = S.choices[0], narr = _narr603_(S); let n = 0;
  Object.keys(DB).forEach(function(pid) {
    if (pid === id) return;
    (DB[pid].choices || []).forEach(function(c) {
      if (c.next !== id) return;
      const avant = c.response;
      c.response = function(gs) {
        let a = ''; try { a = typeof avant === 'function' ? (avant(gs) || '') : (avant || ''); } catch (_) {}
        let b = ''; try { b = narr(gs) || ''; } catch (_) {}
        return [a, b].filter(Boolean).join('\n\n');
      };
      c.effects = (c.effects || []).concat(suite.effects || []);
      c.next = suite.next; c._fusion608 = id; n++;
    });
  });
  S._fusionnee608 = n > 0; return n;
}
function choix608_(id, choix, enTete) {
  const S = DB[id]; if (!S) return;
  S.choices = (S.choices || []).slice();
  choix.forEach(function(c) { if (!S.choices.some(x => x.key === c.key)) { if (enTete) S.choices.unshift(c); else S.choices.push(c); } });
}
function applyRythme608_() {
  if (_rythme608Applied || typeof DB === 'undefined') return;
  _rythme608Applied = true;
  // 1. Fusions (avant → après : 5 écrans « Continuer » en moins sur la route principale).
  ['LIEN_MARCHE_2B', 'ACTE2_02B_PANTHERE_LIBEREE', 'ACTE2_02B_PANTHERE_ABSORBEE', 'ACTE3_11_PRISON_ECHANGE', 'ACTE4_07B_CHOC_FRAGMENT'].forEach(fusion608_);

  // 2. Vraies décisions sur des écrans qui n'avaient qu'une sortie.
  const f = (gs, k) => gs.hasFlag(k);
  choix608_('ACTE1_03_FAMILIER_1', [
    { key: 'R608_CHAINES', text: "Le couper avant qu’il finisse : « Quelles chaînes ? Je ne te connais pas. »",
      response: "Alistair s’arrête net, la main toujours ouverte. Il cherche une réponse qui ne ressemble pas à un sermon et n’en trouve pas tout de suite. Derrière lui, l’homme en noir laisse échapper un souffle qui pourrait être un rire.",
      effects: [{ type: 'ADD_GAUGE', target: 'volonte', value: 1 }, { type: 'SET_FLAG', target: 'r608_chaines_questionnees' }], next: 'ACTE1_03_FAMILIER_2' },
    { key: 'R608_NOM_OMBRE', text: "Te tourner vers l’homme en noir. « Et toi, tu n’as pas de nom ? »",
      response: "« Kaelen. » Il le dit comme on pose une pièce sur une table, sans te la donner. « Ça te suffira pour l’instant. » Le prêtre fronce les sourcils ; tu as parlé à l’autre en premier.",
      effects: [{ type: 'ADD_GAUGE', target: 'affinite_ombre', value: 1 }, { type: 'SET_FLAG', target: 'r608_nom_kaelen_demande' }], next: 'ACTE1_03_FAMILIER_2' }
  ]);
  choix608_('ACTE1_04_AUTOMATE', [
    { key: 'R608_FEN_ABRI', text: "Glisser Fen sous ton manteau avant de bouger. Le reste attendra une seconde.",
      response: "Tu perds l’instant d’avance. La lame de l’automate passe si près que tu sens le vent de son tranchant sur ta nuque. Contre ta poitrine, Fen cesse de trembler.",
      effects: [{ type: 'SET_FLAG', target: 'fragment_kalthar_1' }, { type: 'ADD_GAUGE', target: 'instabilite', value: -2 }, { type: 'SET_FLAG', target: 'r608_fen_protege' }], next: 'ACTE1_05_BIVOUAC' },
    { key: 'R608_CRISTAL', text: "Plonger la main vers le cristal de sa poitrine. Cette lumière te ressemble trop.",
      response: "Le cristal gèle sous tes doigts avant de se fendre. Pendant un battement, tu sens l’automate te reconnaître. Puis il s’effondre, et le froid remonte jusqu’à ton coude sans redescendre.",
      effects: [{ type: 'SET_FLAG', target: 'fragment_kalthar_1' }, { type: 'ADD_GAUGE', target: 'instabilite', value: 4 }, { type: 'ADD_GAUGE', target: 'memoire_kalthar', value: 1 }], next: 'ACTE1_05_BIVOUAC' }
  ]);
  choix608_('ACTE2_05_ARRIVEE_AUBERGE', [
    { key: 'R608_CENDRE', text: "T’asseoir près des mercenaires, dos au mur, et écouter.",
      response: "Ils parlent de contrats, de chevaux, d’un col fermé. Puis l’un baisse la voix : les Confrères de Cendre paient double pour un visage qu’on leur livre vivant. Quand tu relèves la tête, l’aubergiste te tend la clé sans te regarder.",
      effects: [{ type: 'SET_FLAG', target: 'r608_confreres_entendus' }], next: 'ACTE2_06_NUIT_AUBERGE' },
    { key: 'R608_AZAYA', text: "Tendre deux doigts vers Azaya. Fen jugera.",
      response: "La chatte renifle tes doigts, longtemps. Fen gronde sans bouger. Azaya finit par frotter sa joue contre ton poignet et repart, la queue haute. L’aubergiste hausse un sourcil : « D’habitude, elle mord. »",
      effects: [{ type: 'ADD_GAUGE', target: 'instabilite', value: -1 }, { type: 'SET_FLAG', target: 'r608_azaya' }], next: 'ACTE2_06_NUIT_AUBERGE' }
  ]);
  choix608_('ACTE3_01_TENSION_GROUPE', [
    { key: 'R608_ECOUTER', condition: gs => f(gs, 'avec_ombre') && f(gs, 'avec_eclaireur'),
      text: "Ne rien ordonner. Les laisser dire ce qu’ils ravalent depuis le ravin.",
      response: "Kaelen parle le premier, bas : il n’a pas confiance dans un homme qui prie en comptant les morts. Alistair répond qu’il n’a pas confiance dans un homme qui ne les compte pas. Ils se taisent en même temps. Rien n’est réglé, mais plus rien n’est caché.",
      effects: [{ type: 'ADD_GAUGE', target: 'tension_triangle', value: -2 }, { type: 'SET_FLAG', target: 'r608_querelle_ecoutee' }], next: 'ACTE3_01_FRONTIERE_1' },
    { key: 'R608_MORSURE', text: "Poser deux doigts sur la morsure et compter ses battements.",
      response: "Onze battements. Puis douze. Le rythme ralentit quand tu respires plus lentement, comme si la morsure t’écoutait aussi. Fen te regarde faire sans cligner des yeux.",
      effects: [{ type: 'ADD_GAUGE', target: 'instabilite', value: -1 }, { type: 'SET_FLAG', target: 'r608_morsure_comptee' }], next: 'ACTE3_01_FRONTIERE_1' }
  ]);
  choix608_('ACTE3_03B_RESISTANCE', [
    { key: 'R608_CONTRECHANT', text: "Fredonner faux, exprès, pour casser sa note.",
      response: "Ta voix déraille et la note de Lyra se fend. Un instant, Kaelen cligne des yeux. Puis Lyra change de ton, sans effort, et tu comprends qu’elle te laissait faire.",
      effects: [{ type: 'ADD_GAUGE', target: 'instabilite', value: 2 }, { type: 'ADD_GAUGE', target: 'volonte', value: 1 }, { type: 'SET_FLAG', target: 'r608_contrechant' }], next: 'ACTE3_04_ENVOUTEMENT' }
  ]);
  choix608_('ACTE3_09_ENTREE_SANCTUAIRE', [
    { key: 'R608_STELES', text: "T’arrêter devant les stèles et lire les noms.",
      response: "Des noms de bergers, de veuves, d’enfants morts l’hiver. Sur une stèle plus haute, un nom a été martelé jusqu’à la pierre nue. Il en reste une seule lettre : un K. Tu reprends la marche plus lentement.",
      effects: [{ type: 'ADD_GAUGE', target: 'memoire_kalthar', value: 1 }, { type: 'SET_FLAG', target: 'r608_steles_lues' }], next: 'ACTE3_09B_BIVOUAC_TEMPETE' }
  ]);
  choix608_('ACTE2_13_PRYMAELIS', [
    { key: 'R608_PAUME', text: "Poser ta paume nue sur le nom gravé.",
      response: "Le bronze est tiède. Sous ta main, les runes se remettent en place une à une, comme des doigts qui se rappellent un instrument. Tu retires la main avant qu’elles aient fini.",
      effects: [{ type: 'ADD_GAUGE', target: 'memoire_kalthar', value: 1 }, { type: 'ADD_GAUGE', target: 'instabilite', value: 2 }], next: 'ACTE2_13_MATIN_BIVOUAC' }
  ]);
  choix608_('ACTE2_11_RIVE_NORD', [
    { key: 'R608_RIVE_SUD', condition: gs => f(gs, 'alistair_perdu') || f(gs, 'kaelen_perdu'),
      text: "Regarder une dernière fois la rive sud avant de chercher un abri.",
      response: gs => gs.hasFlag('alistair_perdu')
        ? "Tu cherches l’or dans la brume. Il n’y a plus que la brume. Kaelen attend derrière toi sans te presser, ce qui est pire que s’il te pressait."
        : "Tu cherches une silhouette noire sur les rochers. Rien ne bouge. Alistair murmure une prière, puis s’interrompt : tu ne lui as rien demandé.",
      effects: [{ type: 'SET_FLAG', target: 'r608_rive_regardee' }], next: 'ACTE2_12_NUIT_ISOLEE' }
  ]);
  choix608_('ACTE4_01_HALTE_DOME', [
    { key: 'R608_ARCHE', text: "Poser tes mains sur l’arche fissurée et la geler toi-même.",
      response: "La glace monte de tes paumes et ferme la fissure. L’arche cesse de gémir. Toi, tu mets plus longtemps à cesser de trembler.",
      effects: [{ type: 'ADD_GAUGE', target: 'instabilite', value: 3 }, { type: 'ADD_GAUGE', target: 'volonte', value: 1 }], next: 'ACTE4_02_CHOIX_CHAMBRE' }
  ]);
  choix608_('ACTE4_08_CORRIDOR_OBSIDIENNE', [
    { key: 'R608_REFLET_COURONNE', text: "Soutenir le regard du reflet couronné.",
      response: "Il ne baisse pas les yeux. Toi non plus. Quand tu repars, il marche au même rythme que toi.",
      effects: [{ type: 'SET_FLAG', target: 'reflet608_couronne' }], next: 'ACTE4_08_SEUIL_ETERNITE' },
    { key: 'R608_REFLET_VIDE', text: "Suivre des yeux le reflet aux mains vides.",
      response: "Il ouvre les mains, paumes vers toi. Il n’y a rien dedans, et il n’a pas l’air de le regretter.",
      effects: [{ type: 'SET_FLAG', target: 'reflet608_mains_vides' }], next: 'ACTE4_08_SEUIL_ETERNITE' }
  ]);
  _ajout603_(DB, 'ACTE4_08_SEUIL_ETERNITE', function(gs) {
    if (gs.hasFlag('reflet608_couronne')) return "Tu entres avec le reflet couronné encore dans l’œil. Le Trône te paraît moins haut que tu ne l’imaginais.";
    if (gs.hasFlag('reflet608_mains_vides')) return "Tu entres en pensant à des mains vides. Le Trône te paraît soudain très lourd à porter pour une seule personne.";
    return '';
  });
  choix608_('FRAGMENT_ANCESTRE_KALTHAR_REVEIL', [
    { key: 'R608_VERITE', text: "Dire la vérité : « J’ai vu un homme. Je crois que je l’aimais. »",
      response: gs => gs.hasFlag('avec_ombre') && companionPresentO(gs) /* 60.8.1 bible #5 */ ? "Kaelen ne sourit pas. « Alors ne laisse pas un mort décider à ta place. » Il reprend la marche le premier."
        : gs.hasFlag('avec_eclaireur') && companionPresentE(gs) ? "Alistair hoche la tête lentement. Il ne cite aucun texte. « Merci de me l’avoir dit. »"
        : "Tu le dis à voix haute, pour Fen et pour la neige. Dit comme ça, ça te fait moins peur.",
      effects: [{ type: 'SET_FLAG', target: '_frag_k_jeune_vu' }, { type: 'ADD_GAUGE', target: 'memoire_kalthar', value: 1 }, { type: 'SET_FLAG', target: 'r608_kalthar_avoue' }], next: 'RETURN' }
  ]);
  applyRomance608_();
  // Échos : un choix 60.8 se rappelle plus tard.
  _ajout603_(DB, 'ACTE2_06_NUIT_AUBERGE', gs => gs.hasFlag('r608_azaya') ? "Au milieu de la nuit, un poids léger s’installe au pied du lit. Azaya. Fen la laisse rester." : '');
  _ajout603_(DB, 'ACTE3_10_ACCUEIL_CULTE_1', gs => gs.hasFlag('r608_steles_lues') ? "Tu cherches parmi les fidèles quelqu’un qui saurait quel nom commençait par K. Aucun ne soutient ton regard assez longtemps." : '');
  // Revue choix.md : chaque décision R608 laisse une trace lisible plus loin (aucune nouvelle scène).
  _ajout603_(DB, 'ACTE4_06_OMBRE_AVEU', gs => gs.hasFlag('r608_confreres_entendus') ? "Tu te rappelles la voix basse des mercenaires, à l’auberge : les Confrères paient double pour un visage qu’on leur livre vivant. Tu comprends enfin lequel." : '');
  _ajout603_(DB, 'FEN_ADIEU', gs => gs.hasFlag('r608_fen_protege') ? "Il se glisse une dernière fois sous ton manteau, à l’endroit exact où tu l’avais caché face à l’automate. Il s’en souvenait." : '');
  _ajout603_(DB, 'ACTE4_07_ADIEU_KALTHAR', gs => gs.hasFlag('r608_kalthar_avoue') ? "Tu avais dit à voix haute, devant le fragment, que tu l’aimais. Il ne te répond pas avec des mots. Le froid qui te quitte est plus doux que celui qui t’a réveillée." : '');
  _ajout603_(DB, 'ACTE3_08_MISE_AU_POINT', gs => gs.hasFlag('r608_querelle_ecoutee') && companionPresentO(gs) && companionPresentE(gs) ? "Depuis la frontière, Kaelen et Alistair se disputent à voix haute plutôt que dans ton dos. Tu préfères ça." : '');
  _ajout603_(DB, 'ACTE2_17_RETROUVAILLES_SORTIE', gs => gs.hasFlag('r608_rive_regardee') ? "Sur la rive nord, tu avais cherché une silhouette dans la brume. Elle est là, devant toi, couverte de givre. Tu ne dis rien de la brume." : '');
  _ajout603_(DB, 'ACTE3_04_ENVOUTEMENT', gs => gs.hasFlag('r608_contrechant') ? "Entre deux phrases, Lyra te jette un regard en coin. Aucune voix n’avait osé chanter faux contre elle depuis longtemps, et elle ne l’a pas oublié." : '');
  // 60.8.1 (narration P1-7, QA #8) : les deux décisions R608 qui n'étaient jamais relues.
  _ajout603_(DB, 'ACTE4_06_MASQUE_TOMBE_1', gs => gs.hasFlag('r608_chaines_questionnees') ? "« Quelles chaînes ? » lui avais-tu demandé, le premier jour. Il a mis tout ce chemin à te répondre, et ce n’est pas la réponse qu’il espérait donner." : '');
  _ajout603_(DB, 'ACTE3_05_FIEVRE', gs => gs.hasFlag('r608_morsure_comptee') ? "Tu poses deux doigts sur la morsure, comme à la frontière. Onze battements, douze. La fièvre ne ralentit pas, mais tu sais au moins compter avec elle." : '');
  _ajout603_(DB, 'AGONIE_VENIN', gs => gs.hasFlag('r608_morsure_comptee') ? "Tu cherches la morsure du bout des doigts. Tu avais appris son rythme ; il s’affole maintenant, et c’est ce rythme connu qui te dit de ne pas lâcher." : '');
  // 60.8.1 (bible #1) : en voie solo, Kaelen ne passe pas devant ta chambre.
  _ajout603_(DB, 'ACTE2_06_NUIT_AUBERGE', gs => gs.hasFlag('r608_nom_kaelen_demande') && companionPresentO(gs) && gs.hasFlag('avec_ombre') ? "Kaelen passe devant ta chambre. « Tu es la seule à m’avoir demandé mon nom avant de me demander mon prix. » Il ne s’arrête pas." : '');
  // Revue routes.md §5 : SUBMIT ↔ RELEVER bouclait sans limite (volonté −1 à chaque tour). On ne se relève qu'une fois ;
  // la réponse le dit, et au second passage restent l'aide d'un compagnon (TENUE) ou céder.
  const sceau = DB.SCEAU_DERNIER_SOUFFLE, rel = sceau && sceau.choices.find(c => c.key === 'RELEVER');
  if (rel && !rel._borne608) { rel._borne608 = true; const old = rel.condition;
    rel.condition = gs => (!old || old(gs)) && !gs.hasFlag('sceau_dernier_souffle_60');
    rel.response = "Le Sceau s’arrête. Tu as gagné un instant, et rien de plus. Tes bras tremblent : ils ne se relèveront pas une deuxième fois."; }
  // 60.8.1 (playtest 608 #2) : après RELEVER, la seconde agonie n'offrait que CEDER (mort sur choix unique).
  // Au second passage, SUBMIT dit clairement qu'il n'y aura pas de retour et mène directement à la fin ;
  // s'il reste un compagnon pour soutenir tes bras, l'agonie (TENUE) reste proposée.
  const mt2 = DB.ACTE4_06_MASQUE_TOMBE_2, sub = mt2 && mt2.choices.find(c => c.key === 'SUBMIT');
  if (sub && !sub._borne6081) { sub._borne6081 = true; const oldS = sub.condition;
    const aide = gs => (gs.hasFlag('avec_ombre') && companionPresentO(gs)) || (gs.hasFlag('avec_eclaireur') && companionPresentE(gs));
    sub.condition = gs => (!oldS || oldS(gs)) && (!gs.hasFlag('sceau_dernier_souffle_60') || aide(gs));
    mt2.choices.push({ key: 'SUBMIT_FINAL', condition: gs => (!oldS || oldS(gs)) && gs.hasFlag('sceau_dernier_souffle_60') && !aide(gs),
      text: "Abandonner pour de bon. Laisser le Sceau s’apposer. (Fin du voyage, sans retour possible.)",
      response: "Tu ne relèves pas les bras. Tu le savais déjà la première fois.", effects: [], next: 'GAME_OVER_SCELLEE' }); }
  // Revue routes.md §6.3 : FIN_SERAPHINE_LAME exige l'amour de Séraphine puis une emprise montante. Un indice le dit.
  _ajout603_(DB, 'SERAPHINE_DERNIER_SERMENT', gs => { const p = gs.getGauge('possession') || 0; return p >= 6 && p < 12 && (gs.getGauge('lien_seraphine') || 0) >= 4 ? "Séraphine fixe le givre sombre au fond de tes yeux. « Si tu deviens ce que je chassais, » dit-elle, « je resterai quand même. Avec la lame. »" : ''; });
  // Épilogue : la posture prise devant les reflets colore le lendemain, sans fin supplémentaire.
  _ajout603_(DB, 'ACTE5_01_LENDEMAIN', gs => gs.hasFlag('reflet608_couronne') ? "Certains matins, tu revois le reflet couronné du corridor. Tu as appris à lui tourner le dos sans le briser." : gs.hasFlag('reflet608_mains_vides') ? "Tu gardes les mains nues, même dans le froid. Le corridor t’avait montré ce qu’elles valaient vides." : '');
}

// ===== 60.8.0 : ROMANCES PAR ÉVÉNEMENTS (revue-608/romance.md, partie 2) =====
// Moments éveillés, une voix par personnage. Aucune jauge de lien au-delà de +1. Un refus est relu plus tard,
// sans baisse de jauge ni relance. Fen : geste seulement, aucune pensée prêtée avant ACTE4_07_ADIEU_KALTHAR.
function romanceOuverte608_(gs, r) {
  return (r === 'O' ? romanceAvailableO(gs) : romanceAvailableE(gs)) && !dominationRomance6032_(gs)
    && !gs.hasFlag(r === 'O' ? 'kaelen_refuse' : 'alistair_refuse');
}
function applyRomance608_() {
  const presO = gs => companionPresentO(gs) && !dominationRomance6032_(gs);
  const presE = gs => companionPresentE(gs) && !dominationRomance6032_(gs);
  // Dôme : le oui de chacun dépend de ce qu'il a vécu (même règle que la question à trois, 60.3.3 P1).
  // Sans cela, deux oui « automatiques » restaient possibles au dôme pour un partenaire refroidi ou sans intérêt déclaré.
  const dome = DB.TRIO_NUIT_DOME;
  if (dome) dome.choices.forEach(function(c) {
    const old = c.condition;
    if (c.key === 'PROPOSER') c.condition = gs => (!old || old(gs)) && trioOui6033_(gs, 'O') && trioOui6033_(gs, 'E');
    if (c.key === 'PROPOSER_REFUS') c.condition = gs => (!old || old(gs)) || !trioOui6033_(gs, 'O') || !trioOui6033_(gs, 'E');
  });
  // Kaelen — confiance : la gourde (acte 1), relue au test de l'acte 4.
  const rb = DB.ACTE1_05B_REVEIL_BIVOUAC, a = rb && (rb.choices || []).find(c => c.key === 'A');
  if (a) choix608_('ACTE1_05B_REVEIL_BIVOUAC', [{ key: 'R608_GOURDE', condition: gs => (!a.condition || a.condition(gs)) && gs.hasFlag('avec_ombre') && presO(gs),
    text: "Tendre la gourde à Kaelen. Il a veillé ; la cendre est froide de son côté.",
    response: "Il boit. Il te rend la gourde plus pleine qu’il ne l’a prise : il a ajouté de la neige fondue. « Ça, je ne te le facture pas. Ne t’y habitue pas. »",
    intent: 'confiance', effects: (a.effects || []).concat([{ type: 'SET_FLAG', target: 'kaelen_gourde_608' }]), next: a.next }]);
  _ajout603_(DB, 'ACTE4_06B_TEST_KAELEN', gs => gs.hasFlag('kaelen_gourde_608') && companionPresentO(gs) ? "Il te tend la gourde avant que tu la demandes. Le même geste qu’au premier bivouac. Il n’a jamais su dire mieux." : '');
  // Kaelen — confidence (non romantique) au matin de l'auberge.
  _ajout603_(DB, 'ACTE2_08_MATIN_AUBERGE', gs => presO(gs) && !gs.hasFlag('kaelen_mort') ? "Dans un coin, Kaelen compte ses pièces à voix basse. Il s’arrête à sept, comme si le chiffre le piquait, et ne recompte pas. Il range la bourse. « Peu importe. »" : '');
  // Alistair — confidence : la prière qu'il regrette (dôme, hors trio).
  choix608_('ACTE4_01_HALTE_DOME', [{ key: 'R608_PRIERE', condition: gs => presE(gs) && !gs.hasFlag('alistair_aveu_608'),
    text: "Demander à Alistair pour quoi il priait, au début.",
    response: gs => "Il garde la main sur son sceau un long moment. « Pour que tu échoues. Une fois, la première nuit. Je l’ai fait, et Dieu ne m’a pas répondu. Je crois que c’était une réponse. »" + (romanceOuverte608_(gs, 'E') ? " Il ne détourne pas les yeux. « Maintenant, je prie autrement. Pour toi, pas contre toi. Je veux garder les deux, toi et ma foi. »" : " « Je te le dis parce que tu as le droit de savoir qui marche à côté de toi. »"),
    intent: 'confiance', effects: [{ type: 'SET_FLAG', target: 'alistair_aveu_608' }], next: 'ACTE4_02_CHOIX_CHAMBRE' }]);
  // Refus respectés, relus plus loin (aucune pénalité).
  _ajout603_(DB, 'ACTE3_09B_BIVOUAC_TEMPETE', function(gs) {
    const l = [];
    if (gs.hasFlag('kaelen_refuse') && companionPresentO(gs)) l.push("Kaelen s’assoit à la distance que tu as fixée. Pas un pas de plus. Il te passe le sel quand même.");
    if (gs.hasFlag('alistair_refuse') && companionPresentE(gs)) l.push("Alistair laisse un espace entre vos couvertures, net comme une ligne tracée. Pas pour s’éloigner : pour que tu saches que tu peux partir.");
    return l.join(' ');
  });
  // Fen — confiance au ravin (geste, pas de pensée), confidence d'Elenya au premier bivouac solo.
  choix608_('ACTE2_10_RAVIN', [{ key: 'R608_FEN_LIGNE', text: "Suivre Fen, qui saute d’un bloc à l’autre sans hésiter.",
    response: "Tu poses le pied exactement là où il a posé les pattes. La glace tient. Sur l’autre bloc, Fen t’attend, la queue enroulée autour de lui, et remonte dans ton col sans un bruit.",
    effects: [{ type: 'SET_FLAG', target: 'fen_suivi_608' }, { type: 'ADD_GAUGE', target: 'instabilite', value: -1 }], next: 'ACTE2_10_RIVIERE_CRISTAL' }]);
  _ajout603_(DB, 'ACTE1_05_BIVOUAC', gs => !companionPresentO(gs) && !companionPresentE(gs) ? "« Je ne sais pas ce que je suis », dis-tu au furet, tout bas. Fen cligne une fois, longuement, et ne détourne pas les yeux." : '');
  _ajout603_(DB, 'ACTE4_07_ADIEU_KALTHAR', gs => gs.hasFlag('fen_suivi_608') ? "Au ravin, tu avais mis tes pas dans les siens sans demander pourquoi il savait où la glace tenait. Maintenant, tu sais." : '');
}
