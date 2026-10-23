P='/workspace/elenya-remaster/work/elenya-refonte-52.4/project/'
R=[
('DATABASE_Acte1.js',"Alistair voit l’échange et comprend qu’une porte vient de se fermer devant lui,","Alistair voit l’échange et comprend que quelque chose vient de se décider sans lui,",1),
('DATABASE_Acte1.js',"Pour la première fois, elle ressemble moins à une cage qu’à une porte laissée ouverte.","Pour la première fois, elle ne promet rien. Elle attend.",1),
('DATABASE_Acte1.js',"« Alors ne ferme pas la porte. »","« Alors garde-la allumée. »",1),
('DATABASE_Acte2.js',"\"Alistair a posé ton manteau près de la porte.\\n\\n\" +\n","\"Alistair a posé ton manteau près de la porte.\\n\\n\" +\n",0),
('DATABASE_Acte2.js',"Alistair a posé ton manteau près de la porte, plié.","Ton manteau est plié au pied du lit. Alistair ne dit pas que c’est lui.",1),
('DATABASE_Acte2.js',"Alistair a posé ton manteau près de la porte. Son regard te suit une seconde, puis il s’occupe du verrou.","Alistair a mis ton manteau à sécher sur le dossier de la chaise. Son regard te suit une seconde, puis il s’occupe du verrou.",1),
('DATABASE_Acte2.js',"Alistair reste près de la porte, son insigne éteint dans la main.","Alistair s’est adossé au chambranle, le pouce sur son médaillon éteint.",1),
('DATABASE_Acte2.js',"Alistair reste près de la porte, son médaillon éteint dans la main.","Alistair s’est adossé au chambranle, le pouce sur son médaillon éteint.",1),
('DATABASE_Acte2.js',"Alistair reste près de la porte, son emblème éteint dans la main.","Alistair s’est adossé au chambranle, le pouce sur son médaillon éteint.",1),
('DATABASE_Acte2.js',"Il reste près de la porte, sans en faire une scène.","Il retourne à sa paillasse, sans en faire une scène.",1),
('DATABASE_Acte2.js',"Kaelen s’assied près de la lucarne. Alistair reste près de la porte.","Kaelen s’assied près de la lucarne. Alistair, sur la première marche de l’escalier.",1),
('DATABASE_Acte2.js',"La porte reste ouverte et il ne cherche pas à convertir ton « pas encore » en promesse.","Il ne cherche pas à convertir ton « pas encore » en promesse.",1),
('DATABASE_Acte3.js',"« Me laisser une porte et m’obliger à admettre que je peux vouloir rester. »","« Me laisser partir et m’obliger à admettre que je veux rester. »",1),
('DATABASE_Acte4.js',"Comme un homme qui a enfin trouvé une porte qu’il peut ouvrir sans qu’on la lui arrache.","Comme un homme qui, pour une fois, a le droit de vouloir quelque chose.",1),
('DATABASE_Acte4.js',"Ici, pour la première fois, le silence n’est pas une cage.","Ici, pour la première fois, personne n’attend rien de toi.",1),
('DATABASE_Acte4.js',"La porte reste ouverte, mais il ne la franchit pas à ta place.","Il ne te retient pas, et ne fait pas un pas de plus.",1),
('DATABASE_Acte4.js',"Depuis, chaque porte ressemble davantage à quelque chose qu’on pourrait verrouiller.","Depuis, chaque couloir te paraît un peu plus étroit.",1),
('DATABASE_Acte5.js',"« Ami, si tu veux. La porte reste ouverte. »","« Ami, si tu veux. Le reste, tu me le diras quand tu le sauras. »",1),
('DATABASE_Endings.js',"et parce qu’il sait que la porte demeurera ouverte.","et parce qu’il sait qu’il peut partir, ce qui le fait rester.",1),
('DATABASE_Endings.js',"Le silence qui suit n’est plus une cage. C’est l’espace","Le silence qui suit est inconfortable. C’est l’espace",1),
('DATABASE_Relations.js',"L’embrasser avant qu’il puisse transformer l’instant en prière. La porte reste ouverte.","L’embrasser avant qu’il puisse transformer l’instant en prière.",1),
]
done=0
for f,a,b,n in R:
    if n==0: continue
    p=P+f;t=open(p,encoding='utf-8').read();c=t.count(a)
    if c==0: print('ABSENT',f,a[:60]);continue
    t=t.replace(a,b,1);open(p,'w',encoding='utf-8').write(t);done+=1
print('remplacements',done)
