// 1. 定义缓存名称（以后如果要更新文件，请把 v1 改成 v2, v3...）
const CACHE_NAME = 'ai-tools-v1';

// 2. 列出所有需要离线使用的文件
const urlsToCache = [
  './',
  './index.html',
  './style.css',
  './icon.png',
  './manifest.json',
  './start_video/start_video.html',
  './screen/screen.html',
  './rmb/rmb.html',
  './color_mixer/color_mixer.html',
  './number_to_qr/number_to_qr.html',
  './chicken_soup/chicken_soup.html',
  './chicken_soup/data.js',
  './ruozhiba/ruozhiba.html'
];

// 3. 安装阶段：将文件一次性存入手机缓存
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('正在预缓存关键资源...');
      return cache.addAll(urlsToCache);
    })
  );
  // 强制立即接管控制权
  self.skipWaiting();
});

// 4. 激活阶段：清理旧版本的缓存（方便你以后更新代码）
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('清理旧缓存:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// 5. 拦截请求：先去缓存里找，找到了就直接用缓存，找不到再去联网
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      // 如果缓存中有，直接返回；否则发起网络请求
      return response || fetch(event.request);
    })
  );
});