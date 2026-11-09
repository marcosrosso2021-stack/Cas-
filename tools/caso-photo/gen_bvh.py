# Génère les variantes « _indirect » / directes des gabarits three-mesh-bvh (équivalent du préprocesseur de leur build)
import re,glob,sys,os
root=sys.argv[1]
pat=re.compile(r'/\*\s*@if\s+INDIRECT\s*\*/(.*?)(?:/\*\s*@else\s*\*/(.*?))?/\*\s*@endif\s*\*/',re.S)
for f in glob.glob(os.path.join(root,'**/*.template.js'),recursive=True):
    src=open(f).read()
    for ind,suf in [(True,'_indirect'),(False,'')]:
        s=src
        while True:
            m=pat.search(s)
            if not m:break
            s=s[:m.start()]+(m.group(1) if ind else (m.group(2) or ''))+s[m.end():]
        s=re.sub(r'/\*\s*@echo\s+INDIRECT_STRING\s*\*/',suf,s)
        assert '@if' not in s and '@echo' not in s,f
        open(f.replace('.template.js',suf+'.generated.js'),'w').write(s)
print('ok')
