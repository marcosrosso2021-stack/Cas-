/* casô : appli hors ligne + notifications (copie pour la version GitHub ; le serveur casô sert le même code) */
const CACHE='caso-app-4',APP=/(\/|\/index\.html|\/devis\.html|\/manifest\.webmanifest|\/(?:icon-[a-z0-9-]+|favicon-32)\.png|\/chat\/[\w./-]+\.(?:js|json))$/;
const home=()=>new URL('./',self.registration.scope).pathname;
const fromCache=u=>caches.open(CACHE).then(x=>x.match(u.pathname).then(m=>m||(/\.(?:png|webmanifest)$|\/chat\//.test(u.pathname)?null:x.match(home()))));
self.addEventListener('install',e=>{self.skipWaiting();e.waitUntil(caches.open(CACHE).then(c=>fetch(self.registration.scope,{cache:'reload'}).then(r=>{if(r.ok)return c.put(home(),r)})).catch(()=>{}))});
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x.startsWith('caso-app-')&&x!==CACHE).map(x=>caches.delete(x)))).then(()=>self.clients.claim())));
const LIB=/^https:\/\/cdn\.jsdelivr\.net\/npm\/(?:tesseract\.js@5\.1\.1|tesseract\.js-core@5\.1\.1|@tesseract\.js-data\/fra@1\.0\.0|pdfjs-dist@3\.11\.174)\//;
const LIB2=/^https:\/\/cdnjs\.cloudflare\.com\/ajax\/libs\/(?:three\.js\/r128|pdf\.js\/2\.16\.105)\//;
self.addEventListener('fetch',e=>{const q=e.request;if(q.method!=='GET')return;
 if(LIB.test(q.url)||LIB2.test(q.url)){e.respondWith(caches.open('caso-lib-1').then(c=>c.match(q.url).then(m=>m||fetch(q).then(r=>{if(r.ok||r.type==='opaque')c.put(q.url,r.clone());return r}))));return}const u=new URL(q.url);if(u.origin!==location.origin||!APP.test(u.pathname))return;
 e.respondWith(new Promise(res=>{let done=false;const end=r=>{if(!done&&r){done=true;res(r)}};
  const t=setTimeout(()=>fromCache(u).then(end),4000);
  fetch(q.url,{cache:'no-cache'}).then(r=>{clearTimeout(t);if(r.ok){const c=r.clone();caches.open(CACHE).then(x=>x.put(u.pathname,c))}end(r)})
   .catch(()=>{clearTimeout(t);fromCache(u).then(m=>{end(m||Response.error())})})}))});
self.addEventListener('push',e=>{let d={};try{d=e.data.json()}catch(x){d={title:'casô',body:e.data?e.data.text():''}}
 e.waitUntil(self.registration.showNotification(d.title||'casô',{body:d.body||'',tag:d.tag,data:{url:d.url||'./'}}))});
self.addEventListener('notificationclick',e=>{e.notification.close();const u=(e.notification.data&&e.notification.data.url)||'./';
 e.waitUntil(self.clients.matchAll({type:'window',includeUncontrolled:true}).then(l=>{for(const c of l){if('focus' in c){c.postMessage({type:/agenda=/.test(u)?'agenda':'signed',url:u});return c.focus()}}return self.clients.openWindow(u)}))});
