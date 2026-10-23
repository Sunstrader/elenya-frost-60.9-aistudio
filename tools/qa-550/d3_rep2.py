import re
P='/workspace/elenya-remaster/work/elenya-refonte-52.4/project/'
S=r'[ \u00a0\u202f]'
R=[('DATABASE_Acte1.js',"Alors ne ferme pas la porte.","Alors garde-la allumée."),
('DATABASE_Acte2.js',"La porte reste ouverte et il ne cherche","Il ne cherche"),
('DATABASE_Acte3.js',"Me laisser une porte et m’obliger à admettre que je peux vouloir rester.","Me laisser partir et m’obliger à admettre que je veux rester."),
('DATABASE_Acte5.js',"Ami, si tu veux. La porte reste ouverte.","Ami, si tu veux. Le reste, tu me le diras quand tu le sauras.")]
for f,a,b in R:
    p=P+f;t=open(p,encoding='utf-8').read()
    rx=re.compile(S.join(re.escape(w) for w in a.split(' ')))
    t2,n=rx.subn(b,t,count=1)
    print(f,n);open(p,'w',encoding='utf-8').write(t2)
