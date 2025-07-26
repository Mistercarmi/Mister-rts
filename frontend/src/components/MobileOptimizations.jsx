import React, { useEffect, useState } from 'react';

const MobileOptimizations = ({ children }) => {
  const [isMobile, setIsMobile] = useState(false);
  const [orientation, setOrientation] = useState('portrait');
  const [installPrompt, setInstallPrompt] = useState(null);

  useEffect(() => {
    // Détection mobile
    const checkMobile = () => {
      const userAgent = navigator.userAgent;
      const mobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
      setIsMobile(mobile);
    };

    // Détection orientation
    const checkOrientation = () => {
      const orientation = window.screen.orientation?.angle === 0 || window.screen.orientation?.angle === 180 
        ? 'portrait' : 'landscape';
      setOrientation(orientation);
    };

    checkMobile();
    checkOrientation();

    // Événements
    window.addEventListener('orientationchange', checkOrientation);
    window.addEventListener('resize', checkOrientation);

    // PWA Install prompt
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setInstallPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Optimisations performances mobile
    if (isMobile) {
      // Désactiver le zoom sur double tap
      document.addEventListener('touchstart', (e) => {
        if (e.touches.length > 1) {
          e.preventDefault();
        }
      });

      // Prévenir le comportement par défaut du scroll
      document.addEventListener('touchmove', (e) => {
        if (e.target.closest('.game-map')) {
          e.preventDefault();
        }
      }, { passive: false });

      // Optimisations CSS pour mobile
      document.body.style.touchAction = 'manipulation';
      document.body.style.userSelect = 'none';
      document.body.style.webkitUserSelect = 'none';
      document.body.style.webkitTouchCallout = 'none';
    }

    return () => {
      window.removeEventListener('orientationchange', checkOrientation);
      window.removeEventListener('resize', checkOrientation);
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, [isMobile]);

  const handleInstallClick = async () => {
    if (installPrompt) {
      installPrompt.prompt();
      const { outcome } = await installPrompt.userChoice;
      if (outcome === 'accepted') {
        setInstallPrompt(null);
      }
    }
  };

  return (
    <div className={`mobile-optimized ${isMobile ? 'is-mobile' : ''} ${orientation}`}>
      {/* Notification d'installation PWA */}
      {installPrompt && (
        <div className="fixed top-4 left-4 right-4 bg-blue-600 text-white p-4 rounded-lg shadow-lg z-50">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold">Installer RTS Medieval</h3>
              <p className="text-sm">Ajoutez le jeu à votre écran d'accueil</p>
            </div>
            <div className="flex space-x-2">
              <button 
                onClick={handleInstallClick}
                className="bg-white text-blue-600 px-4 py-2 rounded font-medium"
              >
                Installer
              </button>
              <button 
                onClick={() => setInstallPrompt(null)}
                className="text-white/80 hover:text-white"
              >
                ✕
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Conseil d'orientation pour mobile */}
      {isMobile && orientation === 'portrait' && (
        <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 text-white">
          <div className="text-center p-8">
            <div className="text-6xl mb-4">📱 ↻</div>
            <h2 className="text-2xl font-bold mb-2">Meilleure Expérience</h2>
            <p className="text-lg mb-4">Tournez votre appareil en mode paysage</p>
            <p className="text-sm text-gray-300">pour une expérience de jeu optimale</p>
          </div>
        </div>
      )}

      {children}

      {/* Styles CSS pour mobile */}
      <style jsx>{`
        .mobile-optimized.is-mobile {
          -webkit-tap-highlight-color: transparent;
          -webkit-touch-callout: none;
          -webkit-user-select: none;
          -moz-user-select: none;
          -ms-user-select: none;
          user-select: none;
        }

        .mobile-optimized.is-mobile button {
          min-height: 44px;
          min-width: 44px;
          touch-action: manipulation;
        }

        .mobile-optimized.is-mobile input,
        .mobile-optimized.is-mobile textarea {
          font-size: 16px; /* Empêche le zoom sur iOS */
        }

        .mobile-optimized.is-mobile .game-cell {
          min-height: 40px;
          min-width: 40px;
        }

        @media (max-width: 768px) {
          .mobile-optimized {
            font-size: 14px;
          }
          
          .mobile-optimized .game-map {
            touch-action: none;
          }
        }
      `}</style>
    </div>
  );
};

export default MobileOptimizations;