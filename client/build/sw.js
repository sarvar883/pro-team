self.addEventListener('install', (event) => {
  console.log('SW install');
});

self.addEventListener('activate', (event) => {
  return self.clients.claim();
});