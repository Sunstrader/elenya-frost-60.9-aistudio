# RAPPORT — Elenya V60.3.0 (mission ADN, phase 2)

Base : V60.2.0, sans retour à la 52.4. Ordre suivi : fins → systèmes → exploration → (hubs) → trio → (voix). Les étapes entre parenthèses sont **non faites** (voir PROBLEMES_OUVERTS).

## Mécaniques restaurées ou rendues réelles
| Système | Avant (60.2) | Maintenant (60.3) | Effet concret |
|---|---|---|---|
| Fins historiques | 20 écrans + 16 alias | 36 écrans distincts, chacun avec sa lignée | Chaos, Témoin, Domination, Séraphine, Mira, Mortelle… ont retrouvé leur titre, leur succès et leur image |
| Réputation | 13 écritures, 0 lecture | lue dans 1 halte, à l'accueil du culte et dans 9 fins ; ouvre 1 choix | Le texte et les options changent selon le village, l'Ordre et le culte |
| Inventaire | 2 objets sans interface | 4 objets utiles + « Sac » dans les Statistiques | La carte ouvre l'abri ; le pain modifie la fin solo ; l'éclat de Veyra et la plume de Mira sont rappelés au Trône |
| Volonté | 5 lectures, survies gratuites | Les survies partagées (sirène, Sceau) coûtent 2 | Une agonie surmontée laisse une trace |
| Quêtes | `state.quests` jamais utilisé | Journal de route de 6 pistes, calculé à partir de drapeaux réels | Chaque piste en cours donne un indice vers les scènes facultatives |
| Exploration | Absente | 4 haltes (salle commune, abri, puits, stèle) | 7 scènes sans entrée sont rendues accessibles |
| Indice du trio | `poly_eligible` posé, jamais lu | lu dans 2 scènes | Indice narratif, sans aucun effet sur le consentement |

## Arcs et contenus restaurés
- Joutes de Kaelen (`JOUTE_O_1`) et d'Alistair (`JOUTE_E_1`) : 0/400 → 23/400 parties.
- Abri de la Marche Blanche, joute psychologique, fragment de l'Obsidienne : 0 → 22, 7 et 3 sur 400.
- Fragment de la stèle et du nom (`FRAGMENT_4_ENRICHI`) : 1 → 68 sur 400.
- Oraya au puits, puis Oraya en solo : seulement quand Elenya arrive seule (2/400, choix délibéré).

## Gains de la V60 conservés (vérifiés par les tests)
Agonies avec choix, Fêlure, pardon d'Oraya (vrai choix), refus d'Alistair sans rupture, 3 états de Séraphine, consentement du trio (`trio_accord` posé uniquement par `TRIO_NUIT_DOME`), NG+ après les 5 game over, cycle de sauvegarde sur 205 états, verrou des diagnostics, twist de la sirène, absence de narration vocale.

## Mesures (parties au hasard, 400, même générateur, 60.2 → 60.3)
- Écrans de fin distincts atteints : 13 → 17.
- FIN_BRISEE : 22,3 % → 14,8 %. FIN_CHAOS : 0 → 10,3 %.
- Game over : 35,0 % → 33,0 %.
- Scènes jamais vues : 20 → 13.

## Tests
Voir `TESTS.md`. Résumé : `npm test` **44/44** (nouveau test `adn-603.cjs`). Lint et build OK. Navigateur : voir le bilan e2e. Les tests modifiés sont listés avec leur raison : ils attendaient l'ancienne redirection des variantes.

## Régressions restantes et éléments non vérifiés
Voir `PROBLEMES_OUVERTS.md` : hubs non regroupés, voix non relues, trio rare au hasard, rendu du journal non capturé.

## Notes honnêtes (sur 10, auto-évaluation)
1. Profondeur aventure / gameplay : 6 (était 4). Les haltes existent, mais ne sont pas encore un vrai système d'exploration.
2. Qualité et cohérence du récit : 6,5 (inchangé ; voix non relues).
3. Compagnons et romances : 6,5 (joutes rendues, indices du trio ; pas de nouvel arc).
4. Conséquences et diversité des parcours : 7 (était 5,5 : fins distinctes, réputation et objets lus).
5. Fiabilité technique et visuelle : 7,5 (tests au vert, compatibilité des sauvegardes ; nouveau panneau non capturé).
