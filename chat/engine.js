/* Moteur d'apprentissage casô : recherche vectorielle, réordonnancement, mémoire, entraînement. Sans dépendance. */
(function(root){
"use strict";
var DIM=384, LAMBDA=0.3;
var ZW=/[̀-ͯ]/g;
function norm(s){
  return String(s).toLowerCase().replace(/[łŁ]/g,"l").replace(/[đĐ]/g,"d").replace(/ı/g,"i").replace(/ø/g,"o")
    .normalize("NFD").replace(ZW,"").replace(/[^\p{L}\p{N}\s]/gu," ").replace(/\s+/g," ").trim();
}
function hash(s,seed){var h=(2166136261^(seed||0))>>>0;for(var i=0;i<s.length;i++){h^=s.charCodeAt(i);h=Math.imul(h,16777619);}return h>>>0;}
function rng(seed){var a=seed>>>0;return function(){a=(a+0x6D2B79F5)>>>0;var t=a;t=Math.imul(t^(t>>>15),t|1);t^=t+Math.imul(t^(t>>>7),t|61);return((t^(t>>>14))>>>0)/4294967296;};}
function dl(a,b,max){ // distance de Damerau-Levenshtein (restreinte), avec borne
  var la=a.length,lb=b.length; if(Math.abs(la-lb)>max)return max+1; if(a===b)return 0;
  var p2=null,p1=new Array(lb+1),cur=new Array(lb+1),i,j;
  for(j=0;j<=lb;j++)p1[j]=j;
  for(i=1;i<=la;i++){
    cur[0]=i;var best=cur[0];
    for(j=1;j<=lb;j++){
      var c=a.charCodeAt(i-1)===b.charCodeAt(j-1)?0:1;
      var v=Math.min(p1[j]+1,cur[j-1]+1,p1[j-1]+c);
      if(p2&&i>1&&j>1&&a.charCodeAt(i-1)===b.charCodeAt(j-2)&&a.charCodeAt(i-2)===b.charCodeAt(j-1))v=Math.min(v,p2[j-2]+1);
      cur[j]=v;if(v<best)best=v;
    }
    if(best>max)return max+1;
    p2=p1;p1=cur;cur=new Array(lb+1);
  }
  return p1[lb];
}
function dot(a,b){var s=0;for(var i=0;i<DIM;i++)s+=a[i]*b[i];return s;}
function normalize(v){var s=0,i;for(i=0;i<DIM;i++)s+=v[i]*v[i];s=Math.sqrt(s)||1;for(i=0;i<DIM;i++)v[i]/=s;return v;}
function sigmoid(x){return 1/(1+Math.exp(-x));}
var NF=11; // nombre de traits du réordonnanceur
var W0=[1.0,1.4,0.3,1.6,0.3,0.15,0.4,0.6,0.0,0.0,0.0,0.0];

function create(DATA){
  var E={DIM:DIM,norm:norm,dl:dl,rng:rng};
  var langs=DATA.langs;
  var STOP=new Set(DATA.stop.split(" ")), KNOWN=new Set(DATA.known.split(" "));
  var ctxEmb=new Map(), baseCache=new Map(), wvCache=new Map();
  E.trained=false;

  /* ---------- plongements ---------- */
  function baseVec(w){
    var v=baseCache.get(w);if(v)return v;
    v=new Float32Array(DIM);
    var ch=Array.from(" "+w+" ");
    for(var n=3;n<=4;n++)for(var i=0;i+n<=ch.length;i++)v[hash(ch.slice(i,i+n).join(""),n)%DIM]+=1;
    v[hash("#"+w,9)%DIM]+=2;
    normalize(v);baseCache.set(w,v);return v;
  }
  function randIdx(key){ // vecteur d'indexation aléatoire creux, fixé par la clé
    var v=new Float32Array(DIM);
    for(var i=0;i<10;i++){var h=hash(key,100+i);v[h%DIM]+=(h&0x10000)?1:-1;}
    return v;
  }
  function wv(w){return baseVec(w);}
  function ctxOf(text){ // canal "contexte" appris : nul pour les mots jamais vus (fautes de frappe comprises)
    var toks=norm(text).split(" "),v=new Float32Array(DIM),any=false;
    toks.forEach(function(w){var c=ctxEmb.get(w);if(!c||STOP.has(w))return;var t=new Float32Array(c);normalize(t);for(var i=0;i<DIM;i++)v[i]+=t[i];any=true;});
    return any?normalize(v):null;
  }
  function embed(text){
    var toks=norm(text).split(" "),v=new Float32Array(DIM),any=false;
    for(var k=0;k<toks.length;k++){var w=toks[k];if(!w||(STOP.has(w)&&toks.length>1))continue;
      var x=wv(w),wt=w.length>3?1:0.6;for(var i=0;i<DIM;i++)v[i]+=wt*x[i];any=true;}
    return any?normalize(v):v;
  }
  E.embed=embed;

  /* ---------- corpus ---------- */
  var concepts=[],rows=[],exact=new Map(),MAT=new Float32Array(10000*DIM);
  var del1=new Map();
  function dkeys(n){var ch=Array.from(n),out=[n],i;if(ch.length<4)return out;for(i=0;i<ch.length;i++)out.push(ch.slice(0,i).concat(ch.slice(i+1)).join(""));return out;}
  function indexDel(i,n){dkeys(n).forEach(function(k){var a=del1.get(k);if(!a){a=[];del1.set(k,a);}a.push(i);});}
  function putRow(i,v){if((i+1)*DIM>MAT.length){var m=new Float32Array(MAT.length*2);m.set(MAT);MAT=m;}MAT.set(v,i*DIM);}
  function addRow(ci,lang,text,src){
    var n=norm(text);if(!n)return null;
    var ex=exact.get(n);
    if(ex){for(var i=0;i<ex.length;i++)if(rows[ex[i]].c===ci)return null;}
    var r={c:ci,lang:lang,text:text,n:n,v:embed(text),src:src||"base"};
    rows.push(r);var idx=rows.length-1;putRow(idx,r.v);indexDel(idx,n);
    if(!ex){ex=[];exact.set(n,ex);}ex.push(idx);
    concepts[ci].rows.push(idx);
    n.split(" ").forEach(function(t){KNOWN.add(t);});
    return r;
  }
  DATA.c.forEach(function(c){
    var ci=concepts.length;
    concepts.push({fr:c[0],kind:c[1],meta:c[2]||{},rows:[],hits:0,user:false});
    var al=c[3];Object.keys(al).forEach(function(l){al[l].forEach(function(a){addRow(ci,l,a);});});
  });
  E.concepts=concepts;E.rows=rows;E.exact=exact;E.langs=langs;
  var protoCache=null;
  function protos(){
    if(protoCache)return protoCache;
    protoCache=concepts.map(function(c){var v=new Float32Array(DIM),any=false;c.rows.forEach(function(ri){var r=rows[ri].cv;if(!r)return;any=true;for(var i=0;i<DIM;i++)v[i]+=r[i];});return any?normalize(v):null;});
    return protoCache;
  }
  function reembedAll(){rows.forEach(function(r){r.cv=ctxOf(r.text);});protoCache=null;facts.forEach(function(f){f.cv=ctxOf(f.text);});}

  /* ---------- profil utilisateur ---------- */
  var U={langs:{},fb:{},facts:[],learned:[],W:W0.slice(),seen:{},log:[]};
  var facts=U.facts;
  E.U=U;
  function langShare(l){var t=0;for(var k in U.langs)t+=U.langs[k];return t?(U.langs[l]||0)/t:0;}
  function topLangs(n){return Object.keys(U.langs).sort(function(a,b){return U.langs[b]-U.langs[a];}).filter(function(l){return l!=="fr";}).slice(0,n);}
  E.topLangs=topLangs;E.langShare=langShare;

  /* ---------- recherche + réordonnancement ---------- */
  function cands(q,K){
    var qn=norm(q);if(!qn)return {qn:qn,qv:null,list:[]};
    var qv=embed(qn),i,n=rows.length,sc=new Float32Array(n),idx=[];
    qv.cv=ctxOf(qn);
    for(i=0;i<n;i++){var s0=0,off=i*DIM;for(var j=0;j<DIM;j++)s0+=qv[j]*MAT[off+j];sc[i]=s0;if(s0>=0.22)idx.push(i);}
    idx.sort(function(x,y){return sc[y]-sc[x];});
    if(idx.length>80)idx.length=80;
    var have=new Set(idx);
    dkeys(qn).forEach(function(k){var a=del1.get(k);if(a&&a.length<=200)a.forEach(function(ri){if(!have.has(ri)){have.add(ri);idx.push(ri);}});});
    var best=new Map();
    idx.forEach(function(ri){var r=rows[ri],b=best.get(r.c);
      if(!b){b={c:r.c,ri:ri,cos:sc[ri],rs:[ri]};best.set(r.c,b);}else b.rs.push(ri);});
    var ex=exact.get(qn);
    if(ex)ex.forEach(function(ri){var r=rows[ri],b=best.get(r.c);if(!b){b={c:r.c,ri:ri,cos:1,rs:[ri]};best.set(r.c,b);}else{b.ri=ri;b.cos=1;b.rs.push(ri);}});
    var list=[];best.forEach(function(b){list.push(b);});
    list.sort(function(a,b){return b.cos-a.cos;});
    return {qn:qn,qv:qv,list:list.slice(0,K||14)};
  }
  function bigrams(s){var m={},i;for(i=0;i+1<s.length;i++){var g=s.substr(i,2);m[g]=(m[g]||0)+1;}return m;}
  function dice(a,b){if(a.length<2||b.length<2)return a===b?1:0;var A=bigrams(a),B=bigrams(b),inter=0,g;for(g in A)if(B[g])inter+=Math.min(A[g],B[g]);return 2*inter/(a.length+b.length-2);}
  function prefixLen(a,b){var n=Math.min(a.length,b.length),i=0;while(i<n&&a.charCodeAt(i)===b.charCodeAt(i))i++;return i;}
  function features(qn,qv,cd,opts){
    var r=rows[cd.ri],f=new Array(NF),m=Math.max(qn.length,r.n.length);
    var bestEdit=0,bestRow=r,i,ri;
    // meilleur alias du concept pour les traits lexicaux
    var cr=cd.rs||[cd.ri];
    for(i=0;i<cr.length;i++){var rr=rows[cr[i]];var mm=Math.max(qn.length,rr.n.length);
      if(Math.abs(qn.length-rr.n.length)>3)continue;
      var d=dl(qn,rr.n,3),e=1-d/mm;if(e>bestEdit){bestEdit=e;bestRow=rr;}}
    var exactHit=0;exactHit=(exact.get(qn)||[]).some(function(x){return rows[x].c===cd.c;})?1:0;
    var qt=qn.split(" "),at=bestRow.n.split(" "),cont=0;
    if(exactHit)cont=1;else{var ins=qt.every(function(t){return at.indexOf(t)>=0;}),ins2=at.every(function(t){return qt.indexOf(t)>=0;});cont=(ins||ins2)?0.7:0;}
    f[0]=cd.cos;f[1]=exactHit;f[2]=cont;f[3]=bestEdit;
    f[8]=qn.charAt(0)===bestRow.n.charAt(0)?1:0;
    f[9]=1-Math.abs(qn.length-bestRow.n.length)/Math.max(qn.length,bestRow.n.length);
    f[10]=dice(qn,bestRow.n);
    f[4]=prefixLen(qn,bestRow.n)/Math.max(qn.length,bestRow.n.length);
    f[5]=opts&&opts.neutral?0:langShare(bestRow.lang);
    var fbk=qn+"|"+cd.c,fb=U.fb[fbk]||0;
    f[6]=opts&&opts.neutral?0:Math.tanh(fb)*1+Math.min(0.5,Math.log(1+concepts[cd.c].hits)/8);
    var pc=protos()[cd.c];f[7]=(qv.cv&&pc)?dot(qv.cv,pc):0;
    cd.alias=bestRow;cd.f=f;return f;
  }
  function score(f,W){var s=W[NF]||0;for(var i=0;i<NF;i++)s+=W[i]*f[i];return s;}
  function search(q,opts){
    opts=opts||{};
    var c=cands(q,opts.K||30);if(!c.list.length)return {qn:c.qn,res:[]};
    var W=opts.W||U.W;
    c.list.forEach(function(cd){features(c.qn,c.qv,cd,opts);cd.score=opts.noRerank?cd.cos:score(cd.f,W);cd.p=sigmoid(cd.score-1.6);});
    c.list.sort(function(a,b){return b.score-a.score;});
    return {qn:c.qn,res:c.list};
  }
  E.search=search;

  /* ---------- analyse d'une phrase ---------- */
  var ABBR={};Object.keys(DATA.abbr).forEach(function(l){DATA.abbr[l].forEach(function(p){if(p[0]&&p[1]&&p[0]!==p[1])(ABBR[l]=ABBR[l]||{})[p[0]]=p[1];});});
  function spellfix(t){
    if(t.length<5)return null;var max=t.length<=8?1:2,best=null,bd=99;
    KNOWN.forEach(function(w){if(Math.abs(w.length-t.length)>max||w.length<3)return;var d=dl(t,w,max);if(d<bd){bd=d;best=w;}});
    return bd<=max?best:null;
  }
  E.spellfix=spellfix;
  function pickConcept(list){return list&&list.length?list[0]:null;}
  function analyze(text){
    var res={text:text,fixes:[],mentions:[],unknown:[],lang:null};
    var toks=norm(text).split(" ").filter(Boolean),i,j;
    // abréviations SMS (français partout, autres langues si le mot est inconnu)
    toks=toks.map(function(t){
      if(ABBR.fr&&ABBR.fr[t]){res.fixes.push([t,ABBR.fr[t]]);return ABBR.fr[t];}
      if(!KNOWN.has(t)){for(var l in ABBR){if(ABBR[l][t]){res.fixes.push([t,ABBR[l][t]]);return ABBR[l][t];}}}
      return t;});
    var used=new Array(toks.length).fill(false),langVotes={};
    function vote(l){langVotes[l]=(langVotes[l]||0)+1;}
    function mentionAt(i,n,how,cand){
      var span=toks.slice(i,i+n).join(" ");
      cand.alias=cand.alias||rows[cand.ri];
      res.mentions.push({span:span,c:cand.c,alias:cand.alias.text,lang:cand.alias.lang,how:how,p:cand.p,alts:cand.alts||[]});
      for(var k=i;k<i+n;k++)used[k]=true;vote(cand.alias.lang);
    }
    // 1. alias exacts, du plus long au plus court
    for(var n=4;n>=1;n--)for(i=0;i+n<=toks.length;i++){
      var ok=true;for(j=i;j<i+n;j++)if(used[j]){ok=false;break;}if(!ok)continue;
      var span=toks.slice(i,i+n).join(" ");
      if(n===1&&(span.length<3||STOP.has(span)))continue;
      var ex=exact.get(span);if(!ex)continue;
      var sr=search(span);var picks=sr.res.filter(function(r){return ex.some(function(x){return rows[x].c===r.c;});});
      if(!picks.length)continue;
      var top=picks[0];top.alts=picks.slice(1,4).map(function(a){return a.c;});
      mentionAt(i,n,"exact",top);
    }
    // 2. mots non reconnus : correction orthographique puis recherche floue
    for(i=0;i<toks.length;i++){
      if(used[i])continue;var t=toks[i];
      if(t.length<4||STOP.has(t)||/^\d+$/.test(t))continue;
      if(KNOWN.has(t)){var l0=null;continue;}
      var sr2=search(t),top2=sr2.res[0];
      if(top2&&top2.f&&top2.f[3]>=0.7&&top2.cos>=0.5){top2.alts=sr2.res.slice(1,4).map(function(a){return a.c;});mentionAt(i,1,"flou",top2);continue;}
      var fx=spellfix(t);
      if(fx){var ex2=exact.get(fx);if(ex2){var s3=search(fx),t3=s3.res[0];if(t3){res.fixes.push([t,fx]);t3.alts=s3.res.slice(1,4).map(function(a){return a.c;});mentionAt(i,1,"corrigé",t3);continue;}}
        res.fixes.push([t,fx]);continue;}
      res.unknown.push(t);
    }
    var bl=null,bv=0;for(var l in langVotes)if(langVotes[l]>bv){bv=langVotes[l];bl=l;}
    res.lang=bl;
    return res;
  }
  E.analyze=analyze;
  E.noteLang=function(res){res.mentions.forEach(function(m){U.langs[m.lang]=(U.langs[m.lang]||0)+1;concepts[m.c].hits++;});};

  /* ---------- mémoire (ajouter / mettre à jour / ignorer) ---------- */
  var fid=1;
  function addFact(text){
    var v=embed(text),best=null,bs=0;
    facts.forEach(function(f){var s=dot(v,f.v);if(s>bs){bs=s;best=f;}});
    var now=Date.now();
    function toks(t){return norm(t).split(" ").filter(function(w){return w&&!STOP.has(w);});}
    var jac=0;if(best){var A=toks(text),B=toks(best.text),inter=A.filter(function(w){return B.indexOf(w)>=0;}).length;jac=inter/Math.max(1,A.length+B.length-inter);}
    if(best&&bs>=0.985)return {action:"noop",fact:best};
    if(best&&(bs>=0.8||(bs>=0.6&&jac>=0.55))){var old=best.text;best.text=text;best.v=v;best.ver++;best.ts=now;learnContext(text,"fact:"+best.id);return {action:"update",fact:best,old:old};}
    var f={id:fid++,text:text,v:v,ts:now,hits:0,ver:1};facts.push(f);learnContext(text,"fact:"+f.id);return {action:"add",fact:f};
  }
  function searchFacts(q,thr,k){
    var v=embed(q),qc=ctxOf(q),out=[];
    facts.forEach(function(f){var s=dot(v,f.v);if(qc&&f.cv)s=Math.min(1,s+0.35*Math.max(0,dot(qc,f.cv)));if(s>=thr)out.push({f:f,s:s});});
    out.sort(function(a,b){return b.s-a.s;});return out.slice(0,k||3);
  }
  function forgetFact(q){var r=searchFacts(q,0.5,1)[0];if(!r)return null;U.facts.splice(U.facts.indexOf(r.f),1);return r.f;}
  E.addFact=addFact;E.searchFacts=searchFacts;E.forgetFact=forgetFact;

  /* ---------- apprentissage ---------- */
  function learnContext(text,key){ // indexation aléatoire : les mots d'une même phrase partagent un vecteur de contexte
    var r=randIdx(key);
    norm(text).split(" ").forEach(function(w){if(!w||STOP.has(w))return;var c=ctxEmb.get(w);if(!c){c=new Float32Array(DIM);ctxEmb.set(w,c);}for(var i=0;i<DIM;i++)c[i]+=r[i];wvCache.delete(w);});
  }
  E.addAlias=function(ci,alias,lang){
    var r=addRow(ci,lang||"perso",alias,"user");
    if(r){U.learned.push([ci,alias,lang||"perso"]);protoCache=null;learnContext(alias+" "+concepts[ci].fr,"c:"+ci);}
    return r;
  };
  E.addConcept=function(fr,def,alias){
    var ci=concepts.length;
    concepts.push({fr:fr,kind:"perso",meta:{def:def||""},rows:[],hits:0,user:true});
    addRow(ci,"fr",fr,"user");U.learned.push([-1,fr,"fr",def||""]);
    protoCache=null;return ci;
  };
  E.feedback=function(q,ci,good){
    var k=norm(q)+"|"+ci;U.fb[k]=(U.fb[k]||0)+(good?1:-1);
    U.log.push([norm(q),ci,good?1:0]);if(U.log.length>400)U.log.shift();
  };

  /* ---------- entraînement et évaluation ---------- */
  function typo(s,r,pool){
    var ch=Array.from(s);if(ch.length<5)return s;
    var op=Math.floor(r()*4),i=1+Math.floor(r()*(ch.length-2));
    if(op===0)ch.splice(i,1);
    else if(op===1){var t=ch[i];ch[i]=ch[i+1]||t;if(ch[i+1])ch[i+1]=t;}
    else if(op===2){ch[i]=pool[Math.floor(r()*pool.length)];}
    else ch.splice(i,0,ch[i]);
    return ch.join("");
  }
  function sample(seed,n,parity){
    var r=rng(seed),out=[],pool=Array.from("aeioursntlcmdp"),tries=0;
    while(out.length<n&&tries<n*20){tries++;
      var ri=Math.floor(r()*rows.length),row=rows[ri];
      if(row.src!=="base"||row.n.length<5||row.n.indexOf(" ")>=0&&row.n.length<8)continue;
      if((hash(row.n,1)&1)!==parity)continue;
      var q=typo(row.n,r,pool);if(q===row.n||exact.get(q))continue;
      out.push({q:q,c:row.c});
    }
    return out;
  }
  function evalOn(set,opts){
    var h1=0,h3=0;
    set.forEach(function(s){var res=search(s.q,opts).res;
      if(res[0]&&res[0].c===s.c)h1++;
      for(var i=0;i<3&&i<res.length;i++)if(res[i].c===s.c){h3++;break;}});
    return {n:set.length,r1:h1/set.length,r3:h3/set.length};
  }
  function* evalGen(set,variants){
    var out=variants.map(function(){return {h1:0,h3:0};}),i,v;
    for(i=0;i<set.length;i++){
      for(v=0;v<variants.length;v++){
        var res=search(set[i].q,variants[v]).res;
        if(res[0]&&res[0].c===set[i].c)out[v].h1++;
        for(var k=0;k<3&&k<res.length;k++)if(res[k].c===set[i].c){out[v].h3++;break;}
      }
      if(i%20===19)yield {phase:"eval",done:i+1,total:set.length};
    }
    return out.map(function(o){return {r1:o.h1/set.length,r3:o.h3/set.length};});
  }
  E.evaluateGen=function*(n){
    var set=sample(4242,n||150,0);
    var r=yield* evalGen(set,[{noRerank:true,neutral:true},{neutral:true,W:W0},{neutral:true}]);
    return {n:set.length,cosine:r[0],rerank_defaut:r[1],rerank_courant:r[2]};
  };
  function* trainRerankerGen(nq,epochs){
    var set=sample(777,nq,1),X=[],Y=[],i;
    for(i=0;i<set.length;i++){
      var c=cands(set[i].q,30);
      c.list.forEach(function(cd){X.push(features(c.qn,c.qv,cd,{neutral:true}));Y.push(cd.c===set[i].c?1:0);});
      if(i%20===19)yield {phase:"reranker",done:i+1,total:set.length};
    }
    var W=W0.slice(),lr=0.08,r=rng(5),idx=X.map(function(_,i){return i;});
    for(var ep=0;ep<epochs;ep++){
      idx.sort(function(){return r()-0.5;});
      for(var k=0;k<idx.length;k++){var j0=idx[k],z=score(X[j0],W),p=sigmoid(z-1.6),g=(p-Y[j0])*(Y[j0]?4:1);
        for(var j=0;j<NF;j++)W[j]-=lr*(g*X[j0][j]+0.001*W[j]);W[NF]-=lr*g*0.5;}
      lr*=0.8;
    }
    return W;
  }
  function contextPass(){
    ctxEmb.clear();
    concepts.forEach(function(c,ci){var words=new Set();c.rows.forEach(function(ri){rows[ri].n.split(" ").forEach(function(w){if(w&&!STOP.has(w))words.add(w);});});
      var r=randIdx("c:"+ci);words.forEach(function(w){var v=ctxEmb.get(w);if(!v){v=new Float32Array(DIM);ctxEmb.set(w,v);}for(var i=0;i<DIM;i++)v[i]+=r[i];});});
    facts.forEach(function(f){learnContext(f.text,"fact:"+f.id);});
    reembedAll();
  }
  E.trainGen=function*(opts){
    opts=opts||{};var t0=Date.now();
    yield {phase:"avant",done:0,total:1};
    var before=yield* E.evaluateGen(opts.n||150);
    yield {phase:"plongements",done:0,total:1};
    contextPass();
    yield {phase:"plongements",done:1,total:1};
    var Wnew=yield* trainRerankerGen(opts.q||400,opts.epochs||4);
    var val=sample(1313,100,0),cur=U.W.slice();
    var vc=yield* evalGen(val,[{neutral:true,W:cur},{neutral:true,W:Wnew}]);
    var adopted=(vc[1].r1>vc[0].r1)||(vc[1].r1===vc[0].r1&&vc[1].r3>vc[0].r3);
    if(adopted)U.W=Wnew;
    E.trained=true;
    yield {phase:"après",done:0,total:1};
    var after=yield* E.evaluateGen(opts.n||150);
    return {before:before,after:after,W:U.W.slice(),adopted:adopted,val:vc,ms:Date.now()-t0};
  };
  /* ---------- sauvegarde ---------- */
  E.dump=function(){return {v:1,langs:U.langs,fb:U.fb,facts:facts.map(function(f){return {id:f.id,text:f.text,ts:f.ts,hits:f.hits,ver:f.ver};}),learned:U.learned,W:U.W,seen:U.seen,trained:E.trained};};
  E.load=function(d){
    if(!d||d.v!==1)return false;
    U.langs=d.langs||{};U.fb=d.fb||{};U.seen=d.seen||{};if(d.W&&d.W.length===NF+1)U.W=d.W;
    (d.learned||[]).forEach(function(l){if(l[0]===-1){var ci=E.addConcept(l[1],l[3]);}else if(concepts[l[0]])E.addAlias(l[0],l[1],l[2]);});
    facts.length=0;(d.facts||[]).forEach(function(f){var x={id:f.id,text:f.text,v:embed(f.text),ts:f.ts,hits:f.hits||0,ver:f.ver||1};facts.push(x);fid=Math.max(fid,f.id+1);});
    if(d.trained){contextPass();E.trained=true;}
    return true;
  };
  E.isKnown=function(w){return KNOWN.has(w);};
  E.isStop=function(w){return STOP.has(w);};
  E.stats=function(){return {concepts:concepts.length,rows:rows.length,facts:facts.length,learned:U.learned.length,fb:Object.keys(U.fb).length,dim:DIM};};
  return E;
}
root.CasoEngine={create:create,norm:norm};
if(typeof module!=="undefined")module.exports=root.CasoEngine;
})(typeof window!=="undefined"?window:globalThis);
