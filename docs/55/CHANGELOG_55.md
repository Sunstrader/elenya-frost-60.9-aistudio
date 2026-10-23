# 55.0.0
- **Récit :**
  - la Fêlure (une romance peut être réparée, suspendue ou finie) ;
  - 21 conséquences différées ;
  - « La Lame à Nu » de nouveau jouable ;
  - deux scènes non consenties retirées ;
  - répétitions réduites.
- **Fins :** même structure (9 + Corona + 2 NG+). Une rupture ferme la fin romantique du compagnon et le trio.
- **Interface :**
  - boutons de choix argent sur verre givré ;
  - plus de débordement horizontal sur grand écran ;
  - plein écran proposé clairement (lancement + reprise), sans blocage.
- **Voix :** la narration vocale est retirée. La musique et les effets sont inchangés.
- **Sauvegardes :** compatibles 52.5.4, 53.x et 54. Les anciennes scènes retirées redirigent.

# 55.0.1 (correctif)
- **Sirène :** la 55.0.0 avait changé un mot dans ACTE3_03B_RESISTANCE (« l’insigne » était devenu « le médaillon », dans la passe contre les répétitions). Le mot d’origine est rétabli.
- La séquence de la sirène est de nouveau identique à la 54.0.0, octet pour octet : 384 nœuds parcourus, 0 différence.
- Nouveau test `tests/sirene-intacte.cjs`. Il compare la séquence de la sirène à une empreinte prise sur la 54.0.0, et échoue si la 55.0.0 n’est pas corrigée (vérifié).
- Les scènes retirées en 55.0.0 (ACTE4_04_POLY_ALISTAIR, ACTE4_04_POLY_KAELEN) étaient orphelines en 54 : aucun choix n’y menait. Elles ne font pas partie de la séquence de la sirène.
