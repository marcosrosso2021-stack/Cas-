/* casô : appli hors ligne + notifications (copie pour la version GitHub ; le serveur casô sert le même code) */
const CACHE='caso-app-14',APP=/(\/|\/index\.html|\/devis\.html|\/manifest\.webmanifest|\/(?:icon-[a-z0-9-]+|favicon-32)\.png|\/chat\/[\w./-]+\.(?:js|json)|\/lib\/[\w.-]+\.js)$/;
const home=()=>new URL('./',self.registration.scope).pathname;
// repli sur l'accueil seulement pour l'appli elle-même (jamais pour devis.html : sinon l'appli s'ouvrirait dans le module)
const fromCache=u=>caches.open(CACHE).then(x=>x.match(u.pathname).then(m=>m||(/\.(?:png|webmanifest)$|\/chat\/|\/lib\/|\/devis\.html$/.test(u.pathname)?null:x.match(home()))));
const DEVIS=/\/devis\.html$/;
self.addEventListener('install',e=>{self.skipWaiting();e.waitUntil(caches.open(CACHE).then(c=>Promise.all([
 fetch(self.registration.scope,{cache:'reload'}).then(r=>{if(r.ok)return c.put(home(),r)}).catch(()=>{}),
 fetch(new URL('devis.html',self.registration.scope),{cache:'reload'}).then(r=>{if(r.ok)return c.put(home()+'devis.html',r)}).catch(()=>{})])))});
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x.startsWith('caso-app-')&&x!==CACHE).map(x=>caches.delete(x)))).then(()=>self.clients.claim())));
const LIB=/^https:\/\/cdn\.jsdelivr\.net\/npm\/(?:tesseract\.js@5\.1\.1|tesseract\.js-core@5\.1\.1|@tesseract\.js-data\/fra@1\.0\.0|pdfjs-dist@3\.11\.174)\//;
self.addEventListener('fetch',e=>{const q=e.request;if(q.method!=='GET')return;
 if(LIB.test(q.url)){e.respondWith(caches.open('caso-lib-1').then(c=>c.match(q.url).then(m=>m||fetch(q).then(r=>{if(r.ok||r.type==='opaque')c.put(q.url,r.clone());return r}))));return}const u=new URL(q.url);if(u.origin!==location.origin||!APP.test(u.pathname))return;
 // module devis : copie locale tout de suite, mise à jour en arrière-plan pour la prochaine ouverture
 if(DEVIS.test(u.pathname)){e.respondWith(caches.open(CACHE).then(x=>x.match(u.pathname).then(m=>{const net=fetch(q.url,{cache:'no-cache'}).then(r=>{if(r.ok)x.put(u.pathname,r.clone());return r});if(m){e.waitUntil(net.catch(()=>{}));return m}return net})));return}
 e.respondWith(new Promise(res=>{let done=false;const end=r=>{if(!done&&r){done=true;res(r)}};
  const t=setTimeout(()=>fromCache(u).then(end),4000);
  fetch(q.url,{cache:'no-cache'}).then(r=>{clearTimeout(t);if(r.ok){const c=r.clone();caches.open(CACHE).then(x=>x.put(u.pathname,c))}end(r)})
   .catch(()=>{clearTimeout(t);fromCache(u).then(m=>{end(m||Response.error())})})}))});
self.addEventListener('push',e=>{let d={};try{d=e.data.json()}catch(x){d={title:'casô',body:e.data?e.data.text():''}}
 e.waitUntil(self.registration.showNotification(d.title||'casô',{body:d.body||'',tag:d.tag,data:{url:d.url||'./'}}))});
self.addEventListener('notificationclick',e=>{e.notification.close();const u=(e.notification.data&&e.notification.data.url)||'./';
 e.waitUntil(self.clients.matchAll({type:'window',includeUncontrolled:true}).then(l=>{for(const c of l){if('focus' in c){c.postMessage({type:/agenda=/.test(u)?'agenda':'signed',url:u});return c.focus()}}return self.clients.openWindow(u)}))});
