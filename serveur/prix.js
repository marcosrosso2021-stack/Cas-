/* casô : prix des matériaux en ligne (Google Shopping, via SearchApi.io ou SerpApi)
   - la clé reste sur le serveur : variable SEARCHAPI_KEY (conseillée) ou SERPAPI_KEY, sur Clever Cloud
   - PRIX_JOUR : recherches payantes au plus par jour, pour tout le serveur (défaut 100)
   - PRIX_IP : recherches payantes au plus par jour et par adresse (défaut 30)
   - PRIX_CACHE_H : une même recherche n'est payée qu'une fois pendant ce temps, en heures (défaut 12)
   Réponse : [{produit, prix (TTC), devise, magasin, url, maj}] du moins cher au plus cher. */
'use strict';

// pays casô -> Google : gl (pays), hl (langue), devise
const PAYS={FR:['fr','fr','EUR'],BE:['be','fr','EUR'],CH:['ch','fr','CHF'],LU:['lu','fr','EUR'],ES:['es','es','EUR'],PT:['pt','pt','EUR'],
 IT:['it','it','EUR'],DE:['de','de','EUR'],NL:['nl','nl','EUR'],GB:['uk','en','GBP'],US:['us','en','USD'],CA:['ca','fr','CAD'],
 RO:['ro','ro','RON'],PL:['pl','pl','PLN'],TR:['tr','tr','TRY'],MA:['ma','fr','MAD']};

function jour(){return new Date().toISOString().slice(0,10)}
function court(s,n){return String(s==null?'':s).replace(/\s+/g,' ').trim().slice(0,n)}

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
  out.push({produit,prix:Math.round(prix*100)/100,devise,magasin,url,maj});
 }
 return out.sort((a,b)=>a.prix-b.prix).slice(0,30);
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
   if(!r.ok||!js||js.error)return [502,{error:'Le service de prix ne répond pas, réessaie plus tard.'}];
   const v=convertir(js,devise);
   cache.set(cle,{t:Date.now(),v});if(cache.size>3000)cache.delete(cache.keys().next().value);
   return [200,v];
  }catch(e){return [502,{error:'Le service de prix ne répond pas, réessaie plus tard.'}]}
  finally{clearTimeout(to)}
 }
 return {chercher,pret,etat:()=>({pret:pret(),jour:j===jour()?n:0,limite:JOUR})};
}

module.exports={creer,convertir,PAYS};
