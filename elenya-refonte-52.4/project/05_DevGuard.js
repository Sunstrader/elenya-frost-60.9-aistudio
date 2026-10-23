/**
 * 60.2 — Verrou des diagnostics (audit V60.1, point critique).
 * Dans Apps Script, toute fonction globale dont le nom ne finit pas par « _ » est appelable par
 * n'importe quel visiteur via google.script.run. Les 36 fonctions de diagnostic et d'outillage
 * (serverRun*, serverGetQA*, serverValidateDatabase, imageReviewer*) sont désormais privées
 * (suffixe « _ ») : Apps Script refuse de les appeler depuis le client.
 * Seule porte d'entrée : serverDevDiagnostic(nom, args), qui exige À LA FOIS
 *   1) la propriété de script ELENYA_DEV_DIAG = "1" (absente par défaut : tout est fermé) ;
 *   2) un utilisateur identifié qui est le propriétaire du script, ou listé dans ELENYA_DEV_EMAILS.
 * Un visiteur anonyme (adresse vide) est toujours refusé.
 */
var EF_DIAGNOSTICS_602_ = ['imageReviewerBootstrap','imageReviewerSave','imageReviewerWebBootstrap','serverGetQAScene','serverGetQASceneCatalog','serverRunAAAHealthCheck','serverRunAct1PayoffContinuityQA','serverRunAct1PlaytestFixQA','serverRunAssetQA','serverRunComprehensiveQA','serverRunContinuityPriorityQA','serverRunDeferredRomanceQA','serverRunEnginePolishQA','serverRunFailureStateQA','serverRunLisiereContinuityQA','serverRunNGPlusUltraQA','serverRunNarrativeQA','serverRunNarrativeVoicePolishQA','serverRunNpcThemeAudit','serverRunPayoffAudit','serverRunReturnSafetyQA','serverRunRomanceAgencyQA','serverRunRomanceCrossQA','serverRunRouteDensityAudit','serverRunSecondaryLockQA','serverRunSecondaryReturnQA','serverRunSecondaryRoutesQA','serverRunSecondaryStateMachineQA','serverRunSemanticNarrativeQA','serverRunTriggerDensityQA','serverRunV5203AIAuditFixQA','serverRunV5205MultiTestersQA','serverRunV5215VisualCoherenceQA','serverRunV5220UltimateQA','serverRunV52ModularQA','serverValidateDatabase'];

function efEmailActif_() {
  try { return String(Session.getActiveUser().getEmail() || '').trim().toLowerCase(); } catch (e) { return ''; }
}
function efEmailProprietaire_() {
  try { return String(Session.getEffectiveUser().getEmail() || '').trim().toLowerCase(); } catch (e) { return ''; }
}
/** Propriétaire identifié (exécution depuis l'éditeur, ou visiteur = propriétaire). */
function efEstProprietaire_() {
  var actif = efEmailActif_();
  return !!actif && actif === efEmailProprietaire_();
}
/** Développement autorisé : drapeau de script ET utilisateur autorisé. */
function efDevAutorise_() {
  try {
    var props = PropertiesService.getScriptProperties();
    if (String(props.getProperty('ELENYA_DEV_DIAG') || '') !== '1') return false;
    var actif = efEmailActif_();
    if (!actif) return false;
    if (actif === efEmailProprietaire_()) return true;
    var liste = String(props.getProperty('ELENYA_DEV_EMAILS') || '').toLowerCase().split(',').map(function (x) { return x.trim(); }).filter(Boolean);
    return liste.indexOf(actif) >= 0;
  } catch (e) { return false; }
}
/** Seule fonction publique de diagnostic : refuse tout hors développement autorisé. */
function serverDevDiagnostic(nom, args) {
  if (!efDevAutorise_()) return { ok: false, error: 'DIAGNOSTIC_RESERVE_DEV' };
  nom = String(nom || '');
  if (EF_DIAGNOSTICS_602_.indexOf(nom) < 0) return { ok: false, error: 'DIAGNOSTIC_INCONNU' };
  var g = (typeof globalThis !== 'undefined') ? globalThis : this;
  var f = g[nom + '_'];
  if (typeof f !== 'function') return { ok: false, error: 'DIAGNOSTIC_ABSENT' };
  return f.apply(null, Array.isArray(args) ? args : []);
}
