// Service Worker pour RTS Medieval
const CACHE_NAME = 'rts-medieval-v1.0.0';
const STATIC_CACHE_NAME = 'rts-medieval-static-v1.0.0';

// Fichiers à mettre en cache
const STATIC_FILES = [
    './',
    './index.html',
    './style.css',
    './app.js',
    './game-data.js',
    './game-logic.js',
    './game-ui.js',
    './manifest.json'
];

// Ressources dynamiques
const DYNAMIC_CACHE_NAME = 'rts-medieval-dynamic-v1.0.0';

// Installation du service worker
self.addEventListener('install', (event) => {
    console.log('🔧 Service Worker: Installation');
    
    event.waitUntil(
        caches.open(STATIC_CACHE_NAME)
            .then((cache) => {
                console.log('📦 Service Worker: Mise en cache des fichiers statiques');
                return cache.addAll(STATIC_FILES);
            })
            .then(() => {
                console.log('✅ Service Worker: Installation terminée');
                return self.skipWaiting();
            })
            .catch((error) => {
                console.error('❌ Service Worker: Erreur d\'installation', error);
            })
    );
});

// Activation du service worker
self.addEventListener('activate', (event) => {
    console.log('🚀 Service Worker: Activation');
    
    event.waitUntil(
        caches.keys()
            .then((cacheNames) => {
                return Promise.all(
                    cacheNames.map((cacheName) => {
                        // Supprimer les anciens caches
                        if (cacheName !== STATIC_CACHE_NAME && 
                            cacheName !== DYNAMIC_CACHE_NAME) {
                            console.log('🗑️ Service Worker: Suppression ancien cache', cacheName);
                            return caches.delete(cacheName);
                        }
                    })
                );
            })
            .then(() => {
                console.log('✅ Service Worker: Activation terminée');
                return self.clients.claim();
            })
    );
});

// Interception des requêtes
self.addEventListener('fetch', (event) => {
    const requestUrl = new URL(event.request.url);
    
    // Stratégie Cache First pour les fichiers statiques
    if (STATIC_FILES.includes(requestUrl.pathname) || 
        requestUrl.pathname === '/' || 
        requestUrl.pathname === '/index.html') {
        
        event.respondWith(
            caches.match(event.request)
                .then((cachedResponse) => {
                    if (cachedResponse) {
                        return cachedResponse;
                    }
                    
                    return fetch(event.request)
                        .then((response) => {
                            // Mettre en cache la nouvelle réponse
                            if (response.status === 200) {
                                const responseClone = response.clone();
                                caches.open(STATIC_CACHE_NAME)
                                    .then((cache) => {
                                        cache.put(event.request, responseClone);
                                    });
                            }
                            return response;
                        });
                })
                .catch(() => {
                    // Retourner une page d'erreur hors ligne
                    return new Response(`
                        <!DOCTYPE html>
                        <html>
                        <head>
                            <title>RTS Medieval - Hors ligne</title>
                            <meta name="viewport" content="width=device-width, initial-scale=1">
                            <style>
                                body { 
                                    font-family: Arial, sans-serif; 
                                    display: flex; 
                                    justify-content: center; 
                                    align-items: center; 
                                    height: 100vh; 
                                    margin: 0;
                                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                                    color: white;
                                }
                                .container { 
                                    text-align: center; 
                                    background: rgba(255,255,255,0.1);
                                    padding: 40px;
                                    border-radius: 20px;
                                }
                                .icon { font-size: 4rem; margin-bottom: 20px; }
                                .title { font-size: 2rem; margin-bottom: 20px; }
                                .message { font-size: 1.2rem; margin-bottom: 30px; }
                                .button { 
                                    background: white;
                                    color: #667eea;
                                    border: none;
                                    padding: 15px 30px;
                                    border-radius: 25px;
                                    font-size: 1.1rem;
                                    cursor: pointer;
                                    text-decoration: none;
                                    display: inline-block;
                                }
                            </style>
                        </head>
                        <body>
                            <div class="container">
                                <div class="icon">🏰</div>
                                <div class="title">RTS Medieval</div>
                                <div class="message">Vous êtes hors ligne</div>
                                <p>Vos parties sauvegardées sont disponibles</p>
                                <button class="button" onclick="location.reload()">Réessayer</button>
                            </div>
                        </body>
                        </html>
                    `, {
                        headers: { 'Content-Type': 'text/html' }
                    });
                })
        );
        return;
    }
    
    // Stratégie Network First pour les autres requêtes
    event.respondWith(
        fetch(event.request)
            .then((response) => {
                // Mettre en cache les réponses valides
                if (response.status === 200 && 
                    event.request.method === 'GET' &&
                    !requestUrl.pathname.startsWith('/api/')) {
                    
                    const responseClone = response.clone();
                    caches.open(DYNAMIC_CACHE_NAME)
                        .then((cache) => {
                            cache.put(event.request, responseClone);
                        });
                }
                return response;
            })
            .catch(() => {
                // Fallback sur le cache
                return caches.match(event.request)
                    .then((cachedResponse) => {
                        if (cachedResponse) {
                            return cachedResponse;
                        }
                        
                        // Réponse par défaut pour les requêtes non mises en cache
                        return new Response('Contenu indisponible hors ligne', {
                            status: 503,
                            headers: { 'Content-Type': 'text/plain' }
                        });
                    });
            })
    );
});

// Gestion des messages
self.addEventListener('message', (event) => {
    if (event.data.action === 'skipWaiting') {
        self.skipWaiting();
    }
});

// Synchronisation en arrière-plan
self.addEventListener('sync', (event) => {
    if (event.tag === 'background-sync') {
        event.waitUntil(
            // Synchroniser les données de jeu si nécessaire
            Promise.resolve()
        );
    }
});

// Notification push (si implémentée plus tard)
self.addEventListener('push', (event) => {
    if (event.data) {
        const options = {
            body: event.data.text(),
            icon: './icon-192.png',
            badge: './icon-72.png',
            vibrate: [100, 50, 100],
            data: {
                dateOfArrival: Date.now(),
                primaryKey: 1
            }
        };
        
        event.waitUntil(
            self.registration.showNotification('RTS Medieval', options)
        );
    }
});

// Clic sur notification
self.addEventListener('notificationclick', (event) => {
    event.notification.close();
    
    event.waitUntil(
        clients.openWindow('/')
    );
});

// Gestion des erreurs
self.addEventListener('error', (event) => {
    console.error('❌ Service Worker: Erreur', event.error);
});

// Gestion des promesses rejetées
self.addEventListener('unhandledrejection', (event) => {
    console.error('❌ Service Worker: Promesse rejetée', event.reason);
});

console.log('🎮 Service Worker RTS Medieval chargé');