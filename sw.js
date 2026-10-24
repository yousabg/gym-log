// Network-first so updates show up; falls back to cache when offline (e.g. gym basement).
const CACHE='gymlog-v17';
const ASSETS=['./','index.html','manifest.json','icon-180.png','icon-192.png','icon-512.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)));self.skipWaiting()});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==CACHE).map(k=>caches.delete(k)))));self.clients.claim()});
self.addEventListener('fetch',e=>{
  // Only the app itself and the Firebase SDK; never cache database traffic.
  const u=new URL(e.request.url);
  if(e.request.method!=='GET'||(u.origin!==location.origin&&u.host!=='www.gstatic.com'))return;
  e.respondWith(fetch(e.request).then(r=>{const copy=r.clone();caches.open(CACHE).then(c=>c.put(e.request,copy));return r})
    .catch(()=>caches.match(e.request).then(r=>r||caches.match('index.html'))));
});
