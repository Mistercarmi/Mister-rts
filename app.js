// Application principale - RTS Medieval
class RTSMedieval {
    constructor() {
        this.initialized = false;
        this.isOnline = navigator.onLine;
        this.isMobile = this.detectMobile();
        this.touchSupported = 'ontouchstart' in window;
    }

    // Détecter si c'est un appareil mobile
    detectMobile() {
        const userAgent = navigator.userAgent;
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
    }

    // Initialiser l'application
    init() {
        if (this.initialized) return;

        console.log('🏰 Initialisation de RTS Medieval...');
        
        // Vérifier les prérequis
        if (!this.checkSupport()) {
            this.showUnsupportedBrowser();
            return;
        }

        // Configurer l'environnement
        this.setupEnvironment();
        
        // Enregistrer le service worker
        this.registerServiceWorker();
        
        // Initialiser l'interface
        ui.init();
        
        // Configurer les événements globaux
        this.setupGlobalEvents();
        
        // Tentative de chargement automatique
        this.tryAutoLoad();
        
        this.initialized = true;
        console.log('✅ RTS Medieval initialisé avec succès !');
    }

    // Vérifier le support du navigateur
    checkSupport() {
        // Vérifier localStorage
        if (typeof Storage === 'undefined') {
            console.error('❌ LocalStorage non supporté');
            return false;
        }

        // Vérifier JSON
        if (typeof JSON === 'undefined') {
            console.error('❌ JSON non supporté');
            return false;
        }

        // Vérifier les fonctions ES6 de base
        try {
            eval('const test = () => {}');
        } catch (e) {
            console.error('❌ ES6 non supporté');
            return false;
        }

        return true;
    }

    // Configurer l'environnement
    setupEnvironment() {
        // Configuration mobile
        if (this.isMobile) {
            this.configureMobile();
        }

        // Configuration offline
        if (!this.isOnline) {
            this.configureOffline();
        }

        // Configuration des performances
        this.configurePerformance();
    }

    // Configuration mobile
    configureMobile() {
        console.log('📱 Configuration mobile activée');
        
        // Prévenir le zoom
        const viewport = document.querySelector('meta[name="viewport"]');
        if (viewport) {
            viewport.content = 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover';
        }

        // Prévenir le scroll bounce
        document.body.style.position = 'fixed';
        document.body.style.width = '100%';
        document.body.style.height = '100%';
        document.body.style.overflow = 'hidden';

        // Améliorer les performances tactiles
        document.body.style.touchAction = 'manipulation';
        document.body.style.webkitTouchCallout = 'none';
        document.body.style.webkitUserSelect = 'none';

        // Gérer l'orientation
        this.handleOrientationChange();
    }

    // Configuration offline
    configureOffline() {
        console.log('🔌 Mode hors ligne activé');
        ui.showNotification('Mode hors ligne - Vos parties seront sauvegardées localement', 'info');
    }

    // Configuration des performances
    configurePerformance() {
        // Optimiser les animations
        if (this.isMobile) {
            // Réduire les animations sur mobile
            document.documentElement.style.setProperty('--animation-duration', '0.2s');
        }

        // Prévenir les fuites mémoire
        this.setupMemoryManagement();
    }

    // Gérer les changements d'orientation
    handleOrientationChange() {
        const handleChange = () => {
            setTimeout(() => {
                // Forcer un redimensionnement
                window.dispatchEvent(new Event('resize'));
                
                // Recommander le mode paysage
                if (window.innerHeight > window.innerWidth) {
                    ui.showNotification('💡 Tournez votre appareil en mode paysage pour une meilleure expérience', 'info');
                }
            }, 100);
        };

        window.addEventListener('orientationchange', handleChange);
        window.addEventListener('resize', handleChange);
    }

    // Enregistrer le service worker
    registerServiceWorker() {
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('./sw.js')
                .then(registration => {
                    console.log('✅ Service Worker enregistré:', registration);
                })
                .catch(error => {
                    console.log('❌ Erreur Service Worker:', error);
                });
        }
    }

    // Configurer les événements globaux
    setupGlobalEvents() {
        // Gestion des erreurs
        window.addEventListener('error', (event) => {
            console.error('❌ Erreur JavaScript:', event.error);
            this.handleError(event.error);
        });

        // Gestion des promesses rejetées
        window.addEventListener('unhandledrejection', (event) => {
            console.error('❌ Promesse rejetée:', event.reason);
            this.handleError(event.reason);
        });

        // Gestion de la connexion
        window.addEventListener('online', () => {
            this.isOnline = true;
            ui.showNotification('✅ Connexion rétablie', 'success');
        });

        window.addEventListener('offline', () => {
            this.isOnline = false;
            ui.showNotification('📡 Connexion perdue - Mode hors ligne activé', 'info');
        });

        // Gestion de la visibilité
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.handlePageHidden();
            } else {
                this.handlePageVisible();
            }
        });

        // Gestion des touches
        document.addEventListener('keydown', (event) => {
            this.handleKeypress(event);
        });

        // Prévenir le menu contextuel sur mobile
        if (this.isMobile) {
            document.addEventListener('contextmenu', (e) => {
                e.preventDefault();
            });
        }
    }

    // Gérer les erreurs
    handleError(error) {
        // Sauvegarder l'état en cas d'erreur
        if (gameLogic && gameLogic.getGameState()) {
            gameLogic.saveGame();
        }

        // Afficher une notification d'erreur
        ui.showNotification('Une erreur est survenue. Votre partie a été sauvegardée.', 'error');
    }

    // Gérer la page cachée
    handlePageHidden() {
        console.log('📱 Application mise en arrière-plan');
        
        // Sauvegarder automatiquement
        if (gameLogic && gameLogic.getGameState()) {
            gameLogic.saveGame();
        }
        
        // Mettre en pause si en cours
        if (gameLogic && gameLogic.getGameMode() === 'playing') {
            gameLogic.pauseGame();
        }
    }

    // Gérer la page visible
    handlePageVisible() {
        console.log('📱 Application remise au premier plan');
        
        // Reprendre si nécessaire
        if (gameLogic && gameLogic.getGameMode() === 'paused') {
            setTimeout(() => {
                if (confirm('Reprendre la partie ?')) {
                    gameLogic.pauseGame();
                }
            }, 500);
        }
    }

    // Gérer les touches
    handleKeypress(event) {
        // Raccourcis clavier
        if (event.ctrlKey || event.metaKey) {
            switch (event.key) {
                case 's':
                    event.preventDefault();
                    if (gameLogic && gameLogic.getGameState()) {
                        gameLogic.saveGame();
                        ui.showNotification('Partie sauvegardée', 'success');
                    }
                    break;
                case 'r':
                    event.preventDefault();
                    if (confirm('Redémarrer la partie ?')) {
                        location.reload();
                    }
                    break;
            }
        }

        // Touches de jeu
        switch (event.key) {
            case 'Escape':
                if (gameLogic && gameLogic.getGameState()) {
                    gameLogic.pauseGame();
                }
                break;
            case ' ':
                event.preventDefault();
                if (gameLogic && gameLogic.getGameState()) {
                    gameLogic.pauseGame();
                }
                break;
        }
    }

    // Tentative de chargement automatique
    tryAutoLoad() {
        const savedGame = localStorage.getItem('rts_medieval_save');
        if (savedGame) {
            console.log('💾 Partie sauvegardée trouvée');
            // L'interface se chargera de proposer le chargement
        }
    }

    // Configurer la gestion mémoire
    setupMemoryManagement() {
        // Nettoyer les intervalles et timeouts orphelins
        setInterval(() => {
            // Forcer le garbage collection si possible
            if (window.gc) {
                window.gc();
            }
        }, 60000); // Toutes les minutes
    }

    // Afficher message navigateur non supporté
    showUnsupportedBrowser() {
        document.body.innerHTML = `
            <div style="display: flex; justify-content: center; align-items: center; height: 100vh; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; font-family: Arial, sans-serif; text-align: center;">
                <div style="background: white; color: #333; padding: 40px; border-radius: 20px; max-width: 400px;">
                    <h1>🏰 RTS Medieval</h1>
                    <p>Votre navigateur n'est pas supporté.</p>
                    <p>Veuillez utiliser :</p>
                    <ul style="text-align: left; margin: 20px 0;">
                        <li>Safari sur iOS</li>
                        <li>Chrome sur Android</li>
                        <li>Chrome, Firefox, Safari sur ordinateur</li>
                    </ul>
                    <button onclick="location.reload()" style="background: #667eea; color: white; border: none; padding: 10px 20px; border-radius: 10px; cursor: pointer;">
                        Réessayer
                    </button>
                </div>
            </div>
        `;
    }

    // Obtenir les informations système
    getSystemInfo() {
        return {
            userAgent: navigator.userAgent,
            platform: navigator.platform,
            language: navigator.language,
            online: navigator.onLine,
            mobile: this.isMobile,
            touchSupported: this.touchSupported,
            screenSize: `${window.screen.width}x${window.screen.height}`,
            viewportSize: `${window.innerWidth}x${window.innerHeight}`,
            devicePixelRatio: window.devicePixelRatio,
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
        };
    }

    // Debug - Afficher les informations système
    debugInfo() {
        console.table(this.getSystemInfo());
    }
}

// Initialiser l'application quand le DOM est prêt
document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 DOM prêt, initialisation de RTS Medieval...');
    
    // Créer l'instance de l'application
    window.app = new RTSMedieval();
    
    // Initialiser
    app.init();
    
    // Debug en développement
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        console.log('🔧 Mode développement activé');
        window.debug = () => app.debugInfo();
        window.gameLogic = gameLogic;
        window.ui = ui;
    }
});

// Gestion des erreurs globales
window.addEventListener('error', (event) => {
    console.error('💥 Erreur globale:', event.error);
});

// Message de bienvenue
console.log(`
🏰 RTS Medieval - Jeu de Stratégie en Temps Réel
📱 Optimisé pour iPhone et Android
🎮 Jouable directement depuis GitHub Pages
⚔️ Que la bataille commence !
`);