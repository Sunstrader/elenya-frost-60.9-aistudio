// 60.1 : taille des lots aléatoires. ELENYA_LOT=complet (npm run test:full) garde les volumes historiques ;
// le lot rapide (npm test, par défaut) rejoue un préfixe des mêmes graines : mêmes parties, moins nombreuses.
'use strict';
const complet = process.env.ELENYA_LOT === 'complet';
module.exports = { complet, n: (full, rapide) => (complet ? full : rapide) };
