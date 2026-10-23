// 60.2 (point 4) : classement INDIVIDUEL des drapeaux posés jamais relus (liste de tools/qa-550/flags57.cjs).
// Le lieu de pose est lu dans la base ; la classe est un jugement manuel, argumenté ligne par ligne. Rien n'est supprimé ni raccordé automatiquement.
const fs=require('fs'),path=require('path'),{execFileSync}=require('child_process');const {engine}=require('../tests/lib.cjs');const {api}=engine();
const liste=JSON.parse(execFileSync(process.execPath,[path.join(__dirname,'qa-550/flags57.cjs'),'--list']).toString());
const nonRelus=[...liste.A,...liste.B,...liste.C,...liste.N];
const J={
 _frag_larme_vu:['trace technique','marque d’affichage du fragment de la Larme ; le préfixe _ indique un usage interne'],
 _intimite_E_recente:['trace technique','fenêtre d’intimité récente ; jamais testée depuis 57, la temporisation passe par les jauges'],
 _intimite_O_recente:['trace technique','idem côté Kaelen'],
 _lien_O_1_vu:['trace technique','marque de scène de lien vue'],
 _lien_O_2_doux:['conséquence abandonnée','ton « doux » du lien 2 de Kaelen : aucun écho ne le relit (à relire si on veut récompenser ce ton)'],
 approche_volieres_vue:['trace technique','marque de passage'],
 artefact_citadelle:['dépendance manquante','objet ramassé à l’acte 3 sans usage ultérieur ; aucune scène ne le demande'],
 bivouac_lisiere_fini:['trace technique','fin de séquence de bivouac'],
 chute_solo_givre:['conséquence abandonnée','chute de la voie solo à l’acte 1, jamais rappelée'],
 convergence_acknowledged:['trace technique','accusé de lecture de la convergence (acte 1)'],
 crevasse_finie:['trace technique','fin de séquence de crevasse ; les conséquences passent par crevasse_* relus'],
 felure_E_vue:['garde-fou','pose à l’affichage de la fêlure ; la répétition est déjà empêchée par l’historique des scènes'],
 felure_O_vue:['garde-fou','idem côté Kaelen'],
 lien_marche_blanche_vu:['trace technique','marque de scène vue'],
 limite_auberge_vue:['trace technique','marque de scène vue'],
 lisiere_exploration_active:['garde-fou','posé puis retiré (REMOVE_FLAG) pendant l’exploration : état transitoire'],
 marche1_solo:['trace technique','trace du choix solo à la marche 1 ; la voie solo est relue via voie_solo'],
 marche2_solo:['trace technique','idem marche 2'],
 marche_blanche_solo:['trace technique','idem marche blanche'],
 prymaelis_encountered:['trace technique','rencontre de Primaëlys notée ; aucune branche ne dépend de la rencontre'],
 river_reunion_complete:['trace technique','fin de séquence de la rivière'],
 solo_convergence_choisie:['conséquence abandonnée','choix solo explicite à la convergence, non rappelé ensuite'],
 solo_froid_surface:['conséquence abandonnée','froid de surface en solo, jamais rappelé'],
 sommeil_lourd:['dépendance manquante','sommeil lourd à l’acte 3 : aucune scène suivante ne le teste'],
 triangulation_payoff_vu:['trace technique','marque d’affichage du payoff'],
 v28_bascule_auberge_E:['conséquence abandonnée','reliquat V28 (bascule de romance à l’auberge) ; remplacé par les drapeaux romance_* relus'],
 v28_bascule_auberge_O:['conséquence abandonnée','idem Kaelen'],
 v28_conversion_finale_E:['conséquence abandonnée','reliquat V28 ; la reconversion finale est relue via V28_FIN_RECONVERSION_E (condition sur voie_solo)'],
 v28_conversion_finale_O:['conséquence abandonnée','idem Kaelen'],
 v28_reconquete_crevasse_E:['conséquence abandonnée','reliquat V28 (reconquête à la crevasse)'],
 v28_reconquete_crevasse_O:['conséquence abandonnée','idem Kaelen'],
};
const pose=f=>{const r=[];for(const D of [api.DB,api.NGPLUS_DB])for(const [id,s] of Object.entries(D)){for(const c of s.choices||[])if(JSON.stringify(c.effects||[]).includes('"'+f+'"'))r.push(id+'/'+c.key);if(String(JSON.stringify(s.effects||s.onEnter||'')||'').includes(f))r.push(id+' (entrée)')}return r};
const lignes=nonRelus.map(f=>({drapeau:f,classe:(J[f]||['NON CLASSÉ','nouveau drapeau non relu : à examiner'])[0],raison:(J[f]||[])[1]||'',pose:pose(f).slice(0,3).join(', ')||'pose dynamique'}));
const bilan={};lignes.forEach(l=>bilan[l.classe]=(bilan[l.classe]||0)+1);
fs.writeFileSync(path.join(__dirname,'../docs/60.2/DRAPEAUX_NON_RELUS.md'),'# Drapeaux posés jamais relus (60.2, tools/classer-drapeaux-602.cjs)\n\nClassement individuel ; aucune suppression en bloc, aucun raccord automatique. Limite : jugement fondé sur le lieu de pose, le texte du choix et le nom du drapeau, sans relecture complète de chaque scène ; les « conséquences abandonnées » et « dépendances manquantes » sont des candidats à un écho, pas des bugs prouvés.\n\nBilan : '+JSON.stringify(bilan)+'\n\n| Drapeau | Classe | Raison | Posé par |\n|---|---|---|---|\n'+lignes.map(l=>`| ${l.drapeau} | ${l.classe} | ${l.raison} | ${l.pose} |`).join('\n')+'\n');
console.log(JSON.stringify({total:lignes.length,bilan}));if(bilan['NON CLASSÉ'])process.exitCode=1;
