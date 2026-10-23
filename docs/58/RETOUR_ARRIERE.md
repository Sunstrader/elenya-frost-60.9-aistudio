# RETOUR ARRIÈRE — 58.0.0
- Git : `git checkout refs/tags/v57.0.0^{commit}`.
- Apps Script : republier la 57.0.0 depuis le ZIP 57.
- Une sauvegarde 58 se lit en 57. Exception : une partie arrêtée dans une scène ARC58_*/NGP58_*, inconnue de la 57. La 57 gère une scène inconnue sans planter (test « sauvegarde corrompue »), mais la position exacte de la partie est perdue. Pour l’éviter, reprendre la partie hors de ces scènes avant le retour arrière.
