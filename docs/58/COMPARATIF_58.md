# COMPARATIF 58 — versions concurrentes (objectif : page-turner romanesque)

Critères de jugement :
- **(T) tension** : la dernière ligne donne-t-elle envie de cliquer ?
- **(V) voix** : la réplique est-elle reconnaissable sans le nom de celui qui parle ?
- **(S) sous-texte** : la scène dit-elle plus que ses mots ?
- **(É) économie** : rien de superflu.

Pour chaque scène : A, B et éventuellement C, puis la version retenue (★) et pourquoi.

## ARC58_ALISTAIR_SERRURE — dernière réplique
- A : « Je te fais confiance. » Plat, et c’est ce que dirait n’importe qui (V faible).
- B : « Fais-en ce que tu veux. »
- C ★ : B + « Je ne saurai jamais si j’ai eu raison. C’est ça, te laisser choisir. »
- Pourquoi C : l’ordre de la scène, son coût et sa foi tiennent en deux phrases (S, T).

## ARC58_ALISTAIR_ABSENT — fin de scène
- A : il intervient au dernier moment. Rejetée : cela annule la conséquence.
- B ★ : il obéit « avec une précision qui ressemble à du deuil », et le givre fait éclater la pierre.
- Pourquoi B : la conséquence est réelle et la scène s’arrête sur l’action (T).

## ARC58_POTERNE_SILAS
- A : Silas offre ses hommes contre de l’or.
- B ★ : il les offre à condition que personne ne s’agenouille, « toi comprise ».
- C : il les offre sans condition. Rejetée : Silas perd sa voix.
- Pourquoi B : c’est la politique de Silas en une phrase (V, S).

## ARC58_TEMPETE_RENDUE — dernière ligne
- A : « Tu te sens libre. » Rejetée : on le dit au lieu de le montrer.
- B : « Le Nord te remercie. » Rejetée : sentimental.
- C ★ : « Tu as froid. Pour de vrai, comme tout le monde. »
- Pourquoi C : la perte et le gain tiennent dans une sensation (S, É).

## ARC58_EMPRISE_LACHEE
- A : tous restent. Rejetée : récompense automatique.
- B ★ : « Certains sont partis. Ceux qui restent te regardent en face » (dans l’écho qui suit). La scène elle-même finit sur un souffle de noyé.
- Pourquoi B : le prix est réel (S).

## ARC58_VEYRA_TEMOIN
- A : Veyra accepte toujours.
- B ★ : elle n’accepte que si Elenya l’a écoutée tôt (`veyra_question_57`) ou si elle lui a arraché sa vérité.
- Pourquoi B : le choix dépend d’un geste fait deux actes plus tôt (T, S).

## ARC58_EPILOGUE_VILLAGE (4 versions, toutes gardées, une par issue)
- Partage ★ : « le droit d’être contredite par des gens qui ont mangé ».
- Réfugiés ★ : la porte marquée à la craie.
- Déserteurs ★ : la tablette d’Oraya.
- Ordre imposé ★ : « On t’a gardé la meilleure chaise. Personne ne lève les yeux. »
- Version rejetée : un épilogue unique avec une ligne variable (trop faible).

## ARC58_KAELEN_TROIS_NOMS
- A : sa mère est une méchante. Rejetée : trop simple.
- B ★ : « Je ne lui en veux pas. C’est ça le pire. Je ferais pareil. » / « Le prix d’un hiver. »
- Pourquoi B : voix de contrat, blessure sans plainte (V, S).

## ARC58_ALISTAIR_PRIERE
- A : il écrit une prière d’amour. Rejetée : il redeviendrait le prêtre qui décide.
- B ★ : il rature « la sauver » et ne met rien à la place. « Une prière ridicule. »
- Pourquoi B : l’arc protéger → laisser choisir devient un objet (S).

## ARC58_SERAPHINE_LISTE
- A : elle brûle tout d’un coup.
- B ★ : un nom par flamme, et le dernier est le sien.
- Pourquoi B : la scène a une progression et un renversement (T).

## ARC58_SOLO_CRETE
- A : Elenya fait un discours. Rejetée.
- B ★ : « Ce que tu veux. C’est plus difficile que tous les combats. » Trois vœux concrets, chacun suivi dans l’épilogue.
- Pourquoi B : le solo devient un désir, pas une absence (S).

## NGP58_RAVIN_REVU
- A : Fen s’excuse.
- B ★ : il raconte la botte mordue (« sale bête »), puis : « Chaque fois que je t’ai sauvée sans te le dire, je t’ai volé un choix. Je recommencerais. »
- Pourquoi B : l’humour fait tomber la garde avant l’aveu (T, V).

## NGP58_PREMIERE_ELENYA
- A : la première Elenya est une méchante architecte. Rejetée.
- B ★ : « J’appelais ça une promesse. » L’amour devenu peur.
- Pourquoi B : la scène recadre toutes les fins précédentes (S).

## NGP58_KAELEN_SANS_CONTRAT
- A : il se souvient de toi. Rejetée : cela casse la NG+.
- B ★ : il ne te connaît pas et demande « Qu’est-ce que tu veux en échange ? ». La réponse « Rien » prend tout son sens grâce au savoir de la première partie.
- Pourquoi B : (S).

## Tics par voix (mesurés par n-grammes sur tout le texte)
Remplacement d’une occurrence sur deux, hors séquence de la sirène :
- « sans un mot » → « en silence » / « sans rien dire » : 5 ;
- « baisse les yeux » → « détourne le regard » / « fixe le sol » : 4, dont 2 annulées après relecture, le sens étant faux (« vers tes doigts ») ;
- « à voix haute » → « tout haut » : 5.
- « pour la première fois » : déjà réduit de 41 à 26 en 57 ; non retouché en 58.

## Séquence de la sirène (ACTE3_03B → 06) — versions concurrentes

Seule contrainte dure : le retournement (on se réveille à côté de « l’autre »). Les clés, destinations et drapeaux sont gardés tels quels, donc les sauvegardes prises dans la séquence restent valides (test `sirene-twist.cjs`).

| Version | Principe | Verdict |
|---|---|---|
| A — 55.0.1 (avant) | Fièvre crue, non consentie, vocabulaire de domination ; réveil annoncé par « le réel te frappe au visage » | Rejetée : le choc vient de la crudité, pas de la surprise ; la scène casse le ton des romances |
| B — ellipse et certitude | La fièvre passe en ellipse et ne nomme que celui qu’on croit (cicatrice, voix) ; le réveil s’ouvre sur un sourire, « tu sais qui c’est », puis « Ce n’est pas X. » | **Retenue** : la surprise est préparée par la certitude du lecteur, et l’indice loyal (les deux reflets en 03B, le médaillon froid côté Alistair) ne se comprend qu’après coup |
| C — indice explicite | Lyra prévient : « le chant ment sur les visages » | Rejetée : elle annonce le retournement, ce qui est contraire à la contrainte |

### Fièvre (ACTE3_05) — retour d’auteur
L’auteur aime la séquence : la version B (ellipse sèche) était trop sage. **Version D retenue** : la même ellipse finale, précédée d’un vrai crescendo sensuel (gestes, souffle, désir réciproque, sans description explicite ni domination subie). La certitude « c’est lui » reste le dernier mot avant le réveil, donc le retournement garde toute sa force. Le test `sirene-twist.cjs` est toujours vert.
