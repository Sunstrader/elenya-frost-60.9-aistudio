import re,glob
P='/workspace/elenya-remaster/work/elenya-refonte-52.4/project/'
files=sorted(glob.glob(P+'DATABASE_*.js'))+[P+'23_Refonte.js',P+'24_NGPlus_Ultra.js']
pat=re.compile(r"(?<![\w_])([Ll]’|[Ss]on |[Ss]ans |[Ll]eur )insigne(?![\w_])")
skip=re.compile(r"^ (de l’Inquisition|d’Inquisiteur|de Séraphine|— celui qu’elle)")
n=[0,0,0];i=0
for f in files:
    t=open(f,encoding='utf-8').read()
    def rep(m):
        global i
        after=t[m.end():m.end()+30]
        if skip.match(after): return m.group(0)
        k=i%3; i+=1; n[k]+=1
        if k==0: return m.group(0)
        art=m.group(1); noun='médaillon' if k==1 else 'emblème'
        if k==1 and art in('l’','L’'): art='le ' if art=='l’' else 'Le '
        return art+noun
    t2=pat.sub(rep,t)
    if t2!=t: open(f,'w',encoding='utf-8').write(t2)
print('gardés',n[0],'médaillon',n[1],'emblème',n[2])
