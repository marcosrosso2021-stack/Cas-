/* casô : prix des matériaux en ligne (Google Shopping, via SearchApi.io ou SerpApi)
   - la clé reste sur le serveur : variable SEARCHAPI_KEY (conseillée) ou SERPAPI_KEY, sur Clever Cloud
   - PRIX_JOUR : recherches payantes au plus par jour, pour tout le serveur (défaut 100)
   - PRIX_IP : recherches payantes au plus par jour et par adresse (défaut 30)
   - PRIX_CACHE_H : une même recherche n'est payée qu'une fois pendant ce temps, en heures (défaut 12)
   Réponse : [{produit, prix (TTC), devise, magasin, url, maj, photo}] du moins cher au plus cher.
   Photos : l'appli refuse les images d'autres sites ; elles passent par ce serveur (image), seulement depuis les hôtes du service. */
'use strict';

// pays casô -> Google : gl (pays), hl (langue), devise
const PAYS={FR:['fr','fr','EUR'],BE:['be','fr','EUR'],CH:['ch','fr','CHF'],LU:['lu','fr','EUR'],ES:['es','es','EUR'],PT:['pt','pt','EUR'],
 IT:['it','it','EUR'],DE:['de','de','EUR'],NL:['nl','nl','EUR'],GB:['uk','en','GBP'],US:['us','en','USD'],CA:['ca','fr','CAD'],
 RO:['ro','ro','RON'],PL:['pl','pl','PLN'],TR:['tr','tr','TRY'],MA:['ma','fr','MAD']};

function jour(){return new Date().toISOString().slice(0,10)}
function court(s,n){return String(s==null?'':s).replace(/\s+/g,' ').trim().slice(0,n)}

/* photo d'un produit : petite image déjà dans la réponse, ou adresse https chez un hôte du service (jamais ailleurs : pas de relais ouvert) */
const HOTES=/(^|\.)(gstatic\.com|googleusercontent\.com|serpapi\.com|searchapi\.io)$/i;
function hoteOk(u){try{const x=new URL(u);return x.protocol==='https:'&&!x.username&&!x.port&&HOTES.test(x.hostname)}catch(e){return false}}
function photoOk(u){return typeof u==='string'&&(/^data:image\/(jpeg|png|webp|gif);base64,[A-Za-z0-9+/=]+$/.test(u)?u.length<=20000:u.length<=2000&&hoteOk(u))}

/* réponse du service -> liste casô (sans doublon, prix > 0, liens https seulement) */
function convertir(json,devise){
 const maj=jour(),vus=new Set(),out=[];
 const L=[].concat(json&&json.shopping_results||[],json&&json.inline_shopping_results||[],json&&json.shopping_ads||[]);
 for(const r of L){
  if(!r||typeof r!=='object')continue;
  const prix=typeof r.extracted_price==='number'?r.extracted_price:parseFloat(String(r.price||'').replace(/[^\d,.]/g,'').replace(',','.'));
  const produit=court(r.title,160),magasin=court(r.source||r.seller||r.domain,60);
  if(!produit||!magasin||!isFinite(prix)||prix<=0||prix>1e6)continue;
  const url=[r.link,r.product_link].find(u=>/^https:\/\/[^\s"'<>]+$/i.test(u||''))||'';
  const k=(produit+'|'+magasin+'|'+prix).toLowerCase();if(vus.has(k))continue;vus.add(k);
  const photo=[r.thumbnail,r.serpapi_thumbnail,Array.isArray(r.serpapi_thumbnails)?r.serpapi_thumbnails[0]:'',Array.isArray(r.thumbnails)?r.thumbnails[0]:''].find(photoOk)||'';
  out.push({produit,prix:Math.round(prix*100)/100,devise,magasin,url,maj,photo});
 }
 return garder(out.sort((a,b)=>a.prix-b.prix),120);
}
/* résultats Google d'un site : seules les pages dont Google affiche le prix, dans la devise du pays, et qui sont bien sur ce site */
const SYMB={EUR:/€|eur/i,GBP:/£|gbp/i,USD:/\$|usd/i,CHF:/chf|fr\.?/i,CAD:/\$|cad/i,RON:/lei|ron/i,PLN:/zł|pln/i,TRY:/₺|try|tl/i,MAD:/dh|mad/i};
function surSite(json,devise,mag,nom){
 const maj=jour(),vus=new Set(),out=[];
 for(const r of (json&&json.organic_results)||[]){
  if(!r||typeof r!=='object')continue;
  let host='';try{const u=new URL(r.link);if(u.protocol==='https:')host=u.hostname.toLowerCase()}catch(e){}
  if(host!==mag&&!host.endsWith('.'+mag))continue;
  const rs=r.rich_snippet||{},de=[rs.bottom,rs.top,rs].map(x=>x&&x.detected_extensions).find(d=>d&&d.price!=null);if(!de)continue;
  const prix=typeof de.price==='number'?de.price:parseFloat(String(de.price).replace(/[^\d,.]/g,'').replace(',','.'));
  if(!isFinite(prix)||prix<=0||prix>1e6)continue;
  if(de.currency&&!(SYMB[devise]||/./).test(String(de.currency)))continue;
  const produit=court(r.title,160);if(!produit||vus.has(r.link))continue;vus.add(r.link);
  out.push({produit,prix:Math.round(prix*100)/100,devise,magasin:nom,url:r.link,maj,photo:photoOk(r.thumbnail)?r.thumbnail:'',src:'site'});
 }
 return out.sort((a,b)=>a.prix-b.prix);
}
/* tous les magasins trouvés restent dans la liste : au-delà de n offres, l'offre la moins chère de chaque magasin d'abord, puis les moins chères.
   Les petites images incluses sont limitées à 600 Ko en tout (les autres passent par le relais d'images). */
function garder(L,n){
 if(L.length>n){const vus=new Set(),a=[],b=[];for(const x of L){const k=x.magasin.toLowerCase();if(vus.has(k))b.push(x);else{vus.add(k);a.push(x)}}
  L=a.concat(b).slice(0,n).sort((x,y)=>x.prix-y.prix)}
 let o=0;for(const x of L)if(x.photo.startsWith('data:')){o+=x.photo.length;if(o>6e5)x.photo=''}
 return L;
}

function creer(opts={}){
 const env=opts.env||process.env,F=opts.fetch||globalThis.fetch;
 const KSA=env.SEARCHAPI_KEY||'',KSP=env.SERPAPI_KEY||'';
 const JOUR=+env.PRIX_JOUR||100,PARIP=+env.PRIX_IP||30,TTL=(+env.PRIX_CACHE_H||12)*36e5;
 const cache=new Map(),parIp=new Map();let j='',n=0;
 const pret=()=>!!(KSA||KSP);

 const PANNE=[502,{error:'Le service de prix ne répond pas, réessaie plus tard.'}],TROP=[429,{error:'Trop de recherches aujourd\'hui, réessaie demain.'}];
 /* une recherche payante de plus pour cette adresse : false si la limite du jour est atteinte */
 function quota(ip){if(j!==jour()){j=jour();n=0;parIp.clear()}const mi=parIp.get(ip)||0;if(mi>=PARIP||n>=JOUR)return false;parIp.set(ip,mi+1);n++;return true}
 /* un appel au service : la réponse, null en cas de panne ; « aucun résultat » (une erreur chez SerpApi) donne {} */
 async function appel(params){
  const p=new URLSearchParams(Object.assign({},params,{api_key:KSA||KSP}));
  const url=KSA?'https://www.searchapi.io/api/v1/search?'+p:'https://serpapi.com/search.json?'+p;
  const ac=new AbortController(),to=setTimeout(()=>ac.abort(),20000);
  try{const r=await F(url,{signal:ac.signal});const js=await r.json().catch(()=>null);
   if(js&&typeof js.error==='string'&&/hasn'?t returned any results|no results/i.test(js.error))return {};
   if(!r.ok||!js||js.error){(opts.log||console.error)('[casô] prix : service en erreur',r.status,court(js&&js.error,200));return null}
   return js;
  }catch(e){(opts.log||console.error)('[casô] prix : service injoignable',e&&e.name);return null}
  finally{clearTimeout(to)}
 }
 function garde(cle,v){cache.set(cle,{t:Date.now(),v});if(cache.size>3000)cache.delete(cache.keys().next().value);return [200,v]}

 /* mag = domaine d'une enseigne (ex. pointp.fr), nom = son nom : recherche limitée à cette enseigne (voir chercherMag) */
 async function chercher(q,pays,ip,mag,nom){
  q=court(q,100);pays=String(pays||'FR').toUpperCase();
  if(!pret())return [503,{error:'Recherche de prix pas encore activée sur le serveur.'}];
  if(q.length<2)return [400,{error:'Recherche trop courte.'}];
  if(mag)return chercherMag(q,pays,ip,String(mag).toLowerCase(),court(nom,40));
  const [gl,hl,devise]=PAYS[pays]||PAYS.FR,cle=(PAYS[pays]?pays:'FR')+'|'+q.toLowerCase();
  const c=cache.get(cle);if(c&&Date.now()-c.t<TTL)return [200,c.v];
  if(!quota(ip))return TROP;
  const js=await appel({engine:'google_shopping',q,gl,hl});if(!js)return PANNE;
  return garde(cle,convertir(js,devise));
 }
 /* Une enseigne absente de la liste générale (le service ne rend qu'une quarantaine d'offres par recherche) :
    1. Google Shopping avec le nom de l'enseigne, en ne gardant que ses offres ;
    2. sinon les pages de son site qui affichent un prix dans Google (« src:'site' » : prix lu sur la page, TTC ou HT selon l'enseigne).
    Chaque étape compte comme une recherche payante. */
 async function chercherMag(q,pays,ip,mag,nom){
  if(!/^[a-z0-9-]+(\.[a-z0-9-]+)+$/.test(mag)||mag.length>60||!nom)return [400,{error:'Magasin inconnu.'}];
  const [gl,hl,devise]=PAYS[pays]||PAYS.FR,cle=(PAYS[pays]?pays:'FR')+'|'+q.toLowerCase()+'|'+mag;
  const c=cache.get(cle);if(c&&Date.now()-c.t<TTL)return [200,c.v];
  const nk=t=>String(t).normalize('NFD').toLowerCase().replace(/[^a-z0-9]/g,''),k=nk(nom),kd=nk(mag.split('.')[0]);
  if(!quota(ip))return TROP;
  const a=await appel({engine:'google_shopping',q:q+' '+nom,gl,hl});if(!a)return PANNE;
  let v=convertir(a,devise).filter(x=>{const m=nk(x.magasin);return m.includes(k)||k.includes(m)||m.includes(kd)});
  if(!v.length){
   if(!quota(ip))return TROP;
   const b=await appel({engine:'google',q:q+' site:'+mag,gl,hl});if(!b)return PANNE;
   v=surSite(b,devise,mag,nom);
  }
  return garde(cle,v);
 }
 /* relais d'une photo : hôtes du service seulement, image seulement, 400 Ko au plus, sans redirection, gardée en mémoire */
 const imgs=new Map();
 async function image(u){
  if(!photoOk(u)||u.startsWith('data:'))return [400,{error:'Image refusée.'}];
  const c=imgs.get(u);if(c)return [200,c];
  const ac=new AbortController(),to=setTimeout(()=>ac.abort(),8000);
  try{const r=await F(u,{signal:ac.signal,redirect:'error'});const type=String(r.headers&&r.headers.get&&r.headers.get('content-type')||'').split(';')[0].trim().toLowerCase();
   if(!r.ok||!/^image\/(jpeg|png|webp|gif|avif)$/.test(type))return [502,{error:'Image indisponible.'}];
   const buf=Buffer.from(await r.arrayBuffer());if(!buf.length||buf.length>4e5)return [502,{error:'Image indisponible.'}];
   const v={type,buf};imgs.set(u,v);if(imgs.size>400)imgs.delete(imgs.keys().next().value);return [200,v];
  }catch(e){return [502,{error:'Image indisponible.'}]}finally{clearTimeout(to)}
 }
 return {chercher,image,pret,etat:()=>({pret:pret(),jour:j===jour()?n:0,limite:JOUR})};
}

module.exports={creer,convertir,surSite,garder,photoOk,PAYS};
