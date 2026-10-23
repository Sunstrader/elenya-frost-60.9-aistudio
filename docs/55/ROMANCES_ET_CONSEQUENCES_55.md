# Romances et conséquences — 55.0.0

## Ce qui existait en 54
Les romances (Kaelen, Alistair, Séraphine, le trio) montaient avec des jauges (`lien_X`, `affinite_X`, `presence_X`) et des drapeaux de scène. Une romance ne pouvait que monter ou stagner : rien ne l’abîmait vraiment, et beaucoup de choix intimes posaient des drapeaux jamais relus.

## Ce qui change en 55
### 1. La Fêlure (nouvelles scènes ROMANCE_FELURE_O et ROMANCE_FELURE_E)
- **Quand :** à l’arrivée au dôme (ACTE4_02_CHOIX_CHAMBRE), une seule fois par compagnon.
- **Conditions :**
  - une romance engagée (intérêt, lisière, focus ou romance réelle) ;
  - le compagnon est présent ;
  - aucune pause en cours ;
  - **et** une relation abîmée : distance ≥ 3 ou lien ≤ 3.
- **Trois issues :**

| Choix | Effet immédiat | Conséquence plus tard |
|---|---|---|
| Réparer | lien +3, distance −3 ; Kaelen avoue une demi-vérité / Alistair montre la lettre | écho au trône (« ce qui a été réparé ») |
| Suspendre | `romance_en_pause_X` : plus d’intimité tant que la pause dure | la relation reste possible |
| Finir | `romance_X_rompue` + pause, lien −1 | plus de nuit avec ce compagnon ; sa fin romantique et le trio sont **fermés** ; l’alliance reste possible ; écho de rupture au trône |

### 2. Conséquences différées (21 échos)
21 choix passés sont maintenant rappelés plus tard dans le texte, par exemple :
- Veyra appelée « Égale » ;
- le combat de la mine aux côtés de Kaelen ;
- le venin ignoré (Oraya s’en souvient) ;
- refuser les deux à l’auberge ;
- le venin cautérisé ;
- le repos de Fen ;
- trois variantes de Silas ;
- l’insigne d’Alistair ramassé ;
- les soins de Kaelen ;
- Fen qui a bu le givre ;
- la page gardée par Séraphine ;
- la couronne du nomade ;
- Veyra rejetée ;
- la rupture ou la réparation, au trône.

Le test vérifie 7 de ces échos (affichés quand le souvenir existe, absents sinon).

### 3. Consentement
- Les deux scènes à trois non consenties (POLY_ALISTAIR, POLY_KAELEN) sont **retirées**.
- Une ancienne sauvegarde arrêtée sur l’une d’elles reprend à ACTE4_05_ARRIVEE_PORTES_1.
- La fin du trio (FIN_POLY) reste accessible seulement par l’accord des trois, et seulement s’il n’y a pas de rupture.

### 4. « La Lame à Nu » (ACTE4_06B_TEST_KAELEN)
- Cette scène était orpheline. Elle est maintenant atteinte par le choix PREUVE dans ACTE4_06_OMBRE_AVEU.
- Elle a été atteinte dans 54 parties sur 400, sans état injecté.

## Mesures réelles (400 parties au hasard, `tests/recit-55.cjs`)
- Fêlure vue : 16 parties sur 400.
- Lame à Nu : 54 parties sur 400.

## Limites
- Séraphine n’a pas de Fêlure : sa route a déjà ses propres fractures (`seraphine_fracture_vue`).
- Mira et Lyra n’ont pas de romance développée.
