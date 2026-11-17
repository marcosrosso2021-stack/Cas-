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
  const photo=[r.thumbnail,r.serpapi_thumbnail,Array.isArray(r.thumbnails)?r.thumbnails[0]:''].find(photoOk)||'';
  out.push({produit,prix:Math.round(prix*100)/100,devise,magasin,url,maj,photo});
 }
 return garder(out.sort((a,b)=>a.prix-b.prix),120);
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

 async function chercher(q,pays,ip){
  q=court(q,100);pays=String(pays||'FR').toUpperCase();
  if(!pret())return [503,{error:'Recherche de prix pas encore activée sur le serveur.'}];
  if(q.length<2)return [400,{error:'Recherche trop courte.'}];
  const [gl,hl,devise]=PAYS[pays]||PAYS.FR,cle=(PAYS[pays]?pays:'FR')+'|'+q.toLowerCase();
  const c=cache.get(cle);if(c&&Date.now()-c.t<TTL)return [200,c.v];
  if(j!==jour()){j=jour();n=0;parIp.clear()}
  const mi=parIp.get(ip)||0;
  if(mi>=PARIP||n>=JOUR)return [429,{error:'Trop de recherches aujourd\'hui, réessaie demain.'}];
  parIp.set(ip,mi+1);n++;
  const p=new URLSearchParams({engine:'google_shopping',q,gl,hl,api_key:KSA||KSP});
  const url=KSA?'https://www.searchapi.io/api/v1/search?'+p:'https://serpapi.com/search.json?'+p;
  const ac=new AbortController(),to=setTimeout(()=>ac.abort(),20000);
  try{
   const r=await F(url,{signal:ac.signal});const js=await r.json().catch(()=>null);
   /* « aucun résultat » arrive comme une erreur chez SerpApi : c'est une liste vide, pas une panne */
   const vide=js&&typeof js.error==='string'&&/hasn'?t returned any results|no results/i.test(js.error);
   if(!vide&&(!r.ok||!js||js.error)){(opts.log||console.error)('[casô] prix : service en erreur',r.status,court(js&&js.error,200));
    return [502,{error:'Le service de prix ne répond pas, réessaie plus tard.'}]}
   const v=vide?[]:convertir(js,devise);
   cache.set(cle,{t:Date.now(),v});if(cache.size>3000)cache.delete(cache.keys().next().value);
   return [200,v];
  }catch(e){(opts.log||console.error)('[casô] prix : service injoignable',e&&e.name);return [502,{error:'Le service de prix ne répond pas, réessaie plus tard.'}]}
  finally{clearTimeout(to)}
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

module.exports={creer,convertir,garder,photoOk,PAYS};
