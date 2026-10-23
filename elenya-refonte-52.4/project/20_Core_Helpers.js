function _parseDynamicText(text, state) {
  let output = text;
  const regex = /{if:(flags|gauges|timers).([^>|<|=]+)(?:([>|<|=]+)(\d+))?}([\s\S]*?)(?:{else}([\s\S]*?))?{endif}/g;
  while (regex.test(output)) {
    output = output.replace(regex, (match, type, key, op, val, tT, tF) => {
      let sV = type === 'flags' ? state.flags.includes(key) : (state[type][key] || 0);
      let met = op ? (
        op === '>' ? sV > val :
        op === '<' ? sV < val :
        op === '>=' ? sV >= val :
        op === '<=' ? sV <= val :
        op === '=' ? sV == val :
        sV == val
      ) : (type === 'flags' ? sV : !!sV);
      return met ? tT : (tF || "");
    });
  }
  return output;
}

function checkRequirements(requires, state) {
  if (!requires) return true;
  for (const [key, cond] of Object.entries(requires)) {
    const [type, name] = key.split('.');
    const val = (state[type] && state[type][name]) || 0;
    if (cond.max !== undefined && val > cond.max) return false;
    if (cond.min !== undefined && val < cond.min) return false;
  }
  return true;
}

function hasAnyFlag(state, ...flags) {
  if (!state || !Array.isArray(state.flags)) return false;
  return flags.some(f => state.flags.includes(f));
}

function hasAllFlags(state, ...flags) {
  if (!state || !Array.isArray(state.flags)) return false;
  return flags.every(f => state.flags.includes(f));
}

function resolveSprites(gs) {
  if (!gs || typeof gs.hasFlag !== 'function') return { left: null, right: null };
  const left = (gs.hasFlag('kaelen_perdu') || gs.hasFlag('kaelen_perdu_definitif') || gs.hasFlag('kaelen_mort')) ? null : 'Kaelen';
  const right = (gs.hasFlag('alistair_perdu') || gs.hasFlag('alistair_perdu_definitif') || gs.hasFlag('alistair_mort') || gs.hasFlag('alistair_emprisonne')) ? null : 'Alistair';
  return { left, right };
}


// ===== V40.3 : PRÉSENCE PHYSIQUE ≠ RELATION ROMANTIQUE =====
function _ctxHasFlag(ctx, flag) {
  if (!ctx) return false;
  if (typeof ctx.hasFlag === 'function') return !!ctx.hasFlag(flag);
  return Array.isArray(ctx.flags) && ctx.flags.includes(flag);
}
function _ctxGauge(ctx, gauge) {
  if (!ctx) return 0;
  if (typeof ctx.getGauge === 'function') return Number(ctx.getGauge(gauge) || 0);
  return Number((ctx.gauges && ctx.gauges[gauge]) || 0);
}
function relationAvailableO(ctx) {
  return _ctxHasFlag(ctx,'avec_ombre')
      || _ctxHasFlag(ctx,'relation_O_ouverte_acte1')
      || _ctxHasFlag(ctx,'focus_romantique_O')
      || _ctxHasFlag(ctx,'kaelen_retrouvailles_choisi')
      || _ctxGauge(ctx,'lien_O') >= 3;
}
function relationAvailableE(ctx) {
  return _ctxHasFlag(ctx,'avec_eclaireur')
      || _ctxHasFlag(ctx,'relation_E_ouverte_acte1')
      || _ctxHasFlag(ctx,'focus_romantique_E')
      || _ctxHasFlag(ctx,'alistair_retrouvailles_choisi')
      || _ctxGauge(ctx,'lien_E') >= 3;
}

// L'amitié conserve le lien ; elle suspend uniquement les accès amoureux.
function romanceAvailableO(ctx) {
  // 56.0 : une rupture (romance_O_rompue) ferme la romance pour de bon.
  // Présence, affinité ou jauge ne la rouvrent pas. L’alliance reste possible.
  return companionPresentO(ctx) && relationAvailableO(ctx)
    && !hasAnyRelationshipPause_(ctx, 'O')
    && !_ctxHasFlag(ctx, 'romance_O_rompue')
    && !dominationRomance6032_(ctx); // 60.3.3 (romance P2) : joutes, conversations reportées

}
function romanceAvailableE(ctx) {
  return companionPresentE(ctx) && relationAvailableE(ctx)
    && !hasAnyRelationshipPause_(ctx, 'E')
    && !_ctxHasFlag(ctx, 'romance_E_rompue')
    && !dominationRomance6032_(ctx); // 60.3.3 (romance P2)

}
function hasAnyRelationshipPause_(ctx, route) {
  return _ctxHasFlag(ctx, 'amis_' + route)
    || _ctxHasFlag(ctx, 'amis_' + route + '_ferme')
    || _ctxHasFlag(ctx, 'romance_en_pause_' + route);
}

// V50.4.0 — présence physique : un choix ponctuel (ex. chute) ne verrouille pas l'autre romance.
function companionPresentO(ctx) {
  return !_ctxHasFlag(ctx,'kaelen_mort') && !_ctxHasFlag(ctx,'kaelen_perdu') && !_ctxHasFlag(ctx,'kaelen_perdu_definitif');
}
function companionPresentE(ctx) {
  return !_ctxHasFlag(ctx,'alistair_mort') && !_ctxHasFlag(ctx,'alistair_perdu') && !_ctxHasFlag(ctx,'alistair_perdu_definitif') && !_ctxHasFlag(ctx,'alistair_emprisonne');
}

// ===== V51 — CONDITIONS SÉMANTIQUES =====
// Une seule grammaire pour distinguer présence, ouverture relationnelle et intimité.
// 59 : un seul seuil d’emprise (possession), partagé par possedee57_ et la domination. L’instabilité déborde sans gouverner.
const POSSESSION_EMPRISE = 12;
// 59 : une domination finale (« À genoux ») exclut les fins romance d’un seul partenaire.
function dominationActive59_(gs) { return _ctxHasFlag(gs,'go_poly_domination') || _ctxHasFlag(gs,'domination_finale'); }
// 59 : une scène où le joueur décide vraiment (au moins deux choix). Les morts différées n’y tombent que là.
function sceneAChoixReel59_(id) {
  try { const S = (typeof DB !== 'undefined' && DB[id]) || (typeof NGPLUS_DB !== 'undefined' && NGPLUS_DB[id]) || null; if (!S) return true; return !!S && Array.isArray(S.choices) && S.choices.length >= 2 && !/^FRAGMENT_/.test(String(id)); } catch (_) { return true; }
}
// 59 : Alistair vivant ET libre (ni mort, ni perdu, ni emprisonné) : il peut agir dans un épilogue.
function alistairLibre59_(gs) { return !_ctxHasFlag(gs,'alistair_mort') && !_ctxHasFlag(gs,'alistair_perdu') && !_ctxHasFlag(gs,'alistair_perdu_definitif') && !_ctxHasFlag(gs,'alistair_emprisonne'); }
const COND = Object.freeze({
  companionPresentO: (gs) => companionPresentO(gs),
  companionPresentE: (gs) => companionPresentE(gs),
  solo: (gs) => _ctxHasFlag(gs,'voie_solo') || _ctxHasFlag(gs,'voie_solo_profonde'),
  canApproachO: (gs) => companionPresentO(gs),
  canApproachE: (gs) => companionPresentE(gs),
  romanceOpenO: (gs) => romanceAvailableO(gs),
  romanceOpenE: (gs) => romanceAvailableE(gs),
  canIntimateO: (gs, minLien=4) => romanceAvailableO(gs) && _ctxGauge(gs,'lien_O') >= minLien,
  canIntimateE: (gs, minLien=4) => romanceAvailableE(gs) && _ctxGauge(gs,'lien_E') >= minLien,
  domination: (gs) => _ctxGauge(gs,'possession') >= POSSESSION_EMPRISE,
  polyEligible: (gs) => _ctxHasFlag(gs,'poly_eligible') || _ctxHasFlag(gs,'poly_active') || _ctxHasFlag(gs,'ngplus_route_both') || _ctxHasFlag(gs,'ngplus_truce')
});

function lastClassicEndingFromFlags(ctx) {
  const flags = ctx && Array.isArray(ctx.globalFlags) ? ctx.globalFlags : [];
  const hit = flags.find(f => String(f).startsWith('last_classic_end:'));
  return hit ? String(hit).slice('last_classic_end:'.length) : null;
}

// ===== HELPERS V28 : ROUTES FLUIDES =====
function getRouteMode(state) {
  if (!state || !Array.isArray(state.flags)) return 'solo';
  const o = state.flags.includes('avec_ombre');
  const e = state.flags.includes('avec_eclaireur');
  if (o && e) return 'poly';
  if (o) return 'ombre';
  if (e) return 'eclaireur';
  return (state.flags.includes('voie_solo_profonde') || state.flags.includes('voie_solo')) ? 'solo' : 'neutre';
}

function joinCompanion(state, route) {
  if (!state.flags) state.flags = [];
  if (route === 'O') {
    if (!state.flags.includes('avec_ombre')) state.flags.push('avec_ombre');
    state.flags = state.flags.filter(f => f !== 'voie_solo' && f !== 'voie_solo_profonde');
    if (!state.flags.includes('solo_bascule_vers_O')) state.flags.push('solo_bascule_vers_O');
  } else if (route === 'E') {
    if (!state.flags.includes('avec_eclaireur')) state.flags.push('avec_eclaireur');
    state.flags = state.flags.filter(f => f !== 'voie_solo' && f !== 'voie_solo_profonde');
    if (!state.flags.includes('solo_bascule_vers_E')) state.flags.push('solo_bascule_vers_E');
  }
}

/**
 * Route relationnelle souple.
 * - O/E : compagnon principal ajouté sans effacer l'autre.
 * - solo : ne supprime jamais les jauges de relation déjà gagnées.
 * Cette fonction sert aux effets de bascule et aux choix de convergence.
 */
function switchCompanion(state, route, options = {}) {
  if (!state.flags) state.flags = [];
  const r = String(route || '').toUpperCase();
  const keepOther = options.keepOther !== false;

  if (r === 'O') {
    if (!state.flags.includes('avec_ombre')) state.flags.push('avec_ombre');
    if (!keepOther) state.flags = state.flags.filter(f => f !== 'avec_eclaireur');
    state.flags = state.flags.filter(f => f !== 'voie_solo' && f !== 'voie_solo_profonde');
    state.flags.push(...(['pont_O_depuis_E'].filter(f => !state.flags.includes(f))));
  } else if (r === 'E') {
    if (!state.flags.includes('avec_eclaireur')) state.flags.push('avec_eclaireur');
    if (!keepOther) state.flags = state.flags.filter(f => f !== 'avec_ombre');
    state.flags = state.flags.filter(f => f !== 'voie_solo' && f !== 'voie_solo_profonde');
    state.flags.push(...(['pont_E_depuis_O'].filter(f => !state.flags.includes(f))));
  }
  state.route = state.flags.includes('avec_ombre') && state.flags.includes('avec_eclaireur')
    ? 'poly'
    : state.flags.includes('avec_ombre') ? 'ombre'
    : state.flags.includes('avec_eclaireur') ? 'eclaireur' : 'solo';
  return state.route;
}

// ===== HELPERS V27 =====
function _echo(gs, flag, textIfTrue, textIfFalse = "") {
  return gs.hasFlag(flag) ? textIfTrue : textIfFalse;
}

function hasItem(state, id) {
  return state.inventory && state.inventory.includes(id);
}

function addItem(state, id) {
  if (!state.inventory) state.inventory = [];
  if (!state.inventory.includes(id) && state.inventory.length < 8) {
    state.inventory.push(id);
  }
}

function removeItem(state, id) {
  if (!state.inventory) return;
  state.inventory = state.inventory.filter(i => i !== id);
}

function addRep(state, faction, value) {
  if (!state.reputation) state.reputation = { ordre:0, culte:0, ombre:0, village:0 };
  state.reputation[faction] = (state.reputation[faction] || 0) + value;
  if (state.reputation[faction] > 20) state.reputation[faction] = 20;
  if (state.reputation[faction] < -20) state.reputation[faction] = -20;
}

function getRep(state, faction) {
  return (state.reputation && state.reputation[faction]) || 0;
}

function decrementTimers(state, previousScene, nextScene, timeCost) {
  if (!state.timers) return;

  // V51.7.6 — coût temporel explicite. Sans métadonnée, l'ancien comportement reste valide.
  let resolvedTimeCost = timeCost;
  if (resolvedTimeCost === undefined || resolvedTimeCost === null) {
    const prev = String(previousScene || '');
    const next = String(nextScene || '');
    const mainAct3Move = prev !== next && /^ACTE3_/.test(prev) && /^ACTE3_/.test(next);
    const sanctuaryReached = next === 'ACTE3_09_VILLAGE_CACHE';
    resolvedTimeCost = mainAct3Move && !sanctuaryReached ? 1 : 0;
  }
  resolvedTimeCost = Math.max(0, Math.floor(Number(resolvedTimeCost) || 0));

  Object.keys(state.timers).forEach(t => {
    if (typeof state.timers[t] !== 'number' || state.timers[t] <= 0) return;
    if (t === 'venin') {
      if (resolvedTimeCost <= 0) return;
      state.timers[t] = Math.max(0, state.timers[t] - resolvedTimeCost);
      return;
    }
    state.timers[t]--;
  });
}

// ==========================================
// 4. OUTILS AAA — NORMALISATION & INTEGRITE
// ==========================================

// ===== 55.0 — LA FÊLURE =====
// Romance engagée (signaux explicites) mais abîmée (distance ou lien faible) : la scène s’impose une fois.
function romanceEngagee55_(ctx, r) {
  return ['interet_romantique_' + r, 'lisiere_romance_' + r + '_ouverte', 'focus_romantique_' + r, 'romance_reelle_' + r]
    .some(f => _ctxHasFlag(ctx, f));
}
function romanceFelurePossible55_(ctx, r) {
  const present = r === 'O' ? companionPresentO(ctx) : companionPresentE(ctx);
  if (!present || !romanceEngagee55_(ctx, r)) return false;
  if (_ctxHasFlag(ctx, 'felure_' + r + '_vue') || hasAnyRelationshipPause_(ctx, r)) return false;
  return _ctxGauge(ctx, 'distance_' + r) >= 3 || _ctxGauge(ctx, 'lien_' + r) <= 3;
}

// ===== 60.3.2 — DOMINATION → AUCUNE ROMANCE (romance V60.3.1 N1/N3, qa #2/#4) =====
// Helper unique : toute domination (crevasse, « À genoux » de l'acte 3, ordre final) ou une emprise
// installée ferme les romances avec Kaelen ET Alistair, le trio consenti et FIN_POLY.
// Dominer l'un devant l'autre ferme aussi la romance avec le témoin : il a vu l'ordre.
function dominationRomance6032_(ctx) {
  return ['crevasse_domination','domination_acte3_O','domination_acte3_E','domination_path_chosen','go_poly_domination','domination_finale']
    .some(function(f) { return _ctxHasFlag(ctx, f); }) || _ctxGauge(ctx, 'possession') >= 12;
}

// ===== 56.0 — TRIO CONSENTI vs DOMINATION =====
// Consentement explicite des trois (trio_accord). Jamais compensé par des jauges.
function trioConsenti56_(gs) {
  return companionPresentO(gs) && companionPresentE(gs)
    && _ctxHasFlag(gs, 'trio_accord')
    && !_ctxHasFlag(gs, 'romance_O_rompue')
    && !_ctxHasFlag(gs, 'romance_E_rompue')
    && !_ctxHasFlag(gs, 'go_poly_domination')
    && !_ctxHasFlag(gs, 'domination_finale')
    && !_ctxHasFlag(gs, 'crevasse_domination')
    && !dominationRomance6032_(gs) // 60.3.2 (romance N1, F3)
    // 60.3.3 (romance P3) : « restons amis » est une limite, pas une pause ; une question refermée ou refusée l'est aussi.
    && !['amis_O','amis_E','amis_O_ferme','amis_E_ferme','trio_question_refermee_6033','trio_question_refusee_6033'].some(function(f) { return _ctxHasFlag(gs, f); })
    && _ctxGauge(gs, 'lien_O') >= 3
    && _ctxGauge(gs, 'lien_E') >= 3;
}
function dominationTrio56_(gs) {
  return companionPresentO(gs) && companionPresentE(gs)
    && (_ctxHasFlag(gs, 'go_poly_domination') || _ctxHasFlag(gs, 'domination_finale'));
}
