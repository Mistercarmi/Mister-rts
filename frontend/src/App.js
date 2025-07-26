import React, { useEffect } from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import GameScreenWithBackend from "./components/GameScreenWithBackend";
import MobileOptimizations from "./components/MobileOptimizations";
import { Toaster } from "./components/ui/toaster";

function App() {
  useEffect(() => {
    // Enregistrement du service worker pour PWA
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
          .then((registration) => {
            console.log('SW registered: ', registration);
          })
          .catch((registrationError) => {
            console.log('SW registration failed: ', registrationError);
          });
      });
    }

    // Prévention du zoom sur double tap (mobile)
    let lastTouchEnd = 0;
    document.addEventListener('touchend', (event) => {
      const now = (new Date()).getTime();
      if (now - lastTouchEnd <= 300) {
        event.preventDefault();
      }
      lastTouchEnd = now;
    }, false);

    // Métadonnées pour le partage
    if (navigator.share) {
      window.shareGame = () => {
        navigator.share({
          title: 'RTS Medieval',
          text: 'Jouez à ce jeu de stratégie en temps réel !',
          url: window.location.href,
        });
      };
    }

    // Optimisations viewport pour mobile
    const viewport = document.querySelector('meta[name="viewport"]');
    if (viewport) {
      viewport.setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover');
    }

  }, []);

  return (
    <MobileOptimizations>
      <div className="App">
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<GameScreenWithBackend />} />
          </Routes>
        </BrowserRouter>
        <Toaster />
      </div>
    </MobileOptimizations>
  );
}

export default App;