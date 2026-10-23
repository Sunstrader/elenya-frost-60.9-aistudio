# Journal de la 55.0.0 (point de départ : v54.0.0, commit f9f0696)

| Étape | Commit | Ce qui a été fait |
|---|---|---|
| 1-2. Audit + bible | 8cbad8c | Audit chiffré (AUDIT_55.md) : répétitions (insigne 94, porte 147, cage 27), tics, 2 choix décoratifs, ~275 drapeaux jamais relus, scènes orphelines, bug `preloadUpmcVoice` (appelée, jamais définie), ~380 lignes de code voix mort, CSS des boutons défini 7 fois. Bible narrative (BIBLE_55.md). |
| 3. Décisions d’arcs | 5cb1438 | ARCS_ET_PERSONNAGES_55.md : aucun personnage ajouté, retiré ni fusionné ; arcs modifiés : Kaelen, Alistair, Silas, Veyra, Fen, Oraya. |
| 4. Récit | e7672b6 | La Fêlure (2 scènes). 21 échos différés. « La Lame à Nu » reconnectée. Scènes à trois non consenties retirées (avec redirection). Rupture qui ferme les fins concernées. Passe de répétitions : insigne 98→37, porte 143→128, « n’est pas une cage » 2→0. Nouveau test recit-55. |
| 5. Technique / interface | 9c2992d | Narration vocale retirée (synthèse, voix Piper, aperçu, bouton, réglages ; anciens réglages effacés des sauvegardes de préférences). Musique et effets gardés. Plein écran proposé au lancement avec un texte plus clair, et à la reprise par un bandeau non bloquant. Couche « argent + verre givré » pour les boutons de choix. Version 55.0.0. Test ui-55. |
| 5b. Correctifs | 1073b37 | Un reste de la suppression (`RF.}`) cassait Scripts_Refonte : détecté par `check.cjs`, corrigé. Fond des boutons rendu opaque (texte blanc illisible sur argent clair, vu sur capture). Débordement horizontal ≥ 1024 px (présent depuis la 54) corrigé. |
| 6. Docs + livraison | (ce commit) | Les 8 livrables, ZIP, manifeste. |
