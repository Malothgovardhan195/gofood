import React, { useState, useEffect } from 'react';
import '../darkTheme.css';

// Import the new components
import { ThemeProvider } from './ThemeContext';

const EnhancedFeatures = ({ children }) => {
  useEffect(() => {
    // Register Service Worker for PWA
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js')
        .then((registration) => {
          console.log('SW registered: ', registration);
        })
        .catch((registrationError) => {
          console.log('SW registration failed: ', registrationError);
        });
    }
  }, []);

  return (
    <ThemeProvider>
      <div>
        {/* PWA Install Banner */}
        <PWAInstallBanner />

        {/* Main App Content */}
        {children}
      </div>
    </ThemeProvider>
  );
};

// PWA Install Banner Component
const PWAInstallBanner = () => {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showInstallBanner, setShowInstallBanner] = useState(false);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstallBanner(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const choiceResult = await deferredPrompt.userChoice;
      
      if (choiceResult.outcome === 'accepted') {
        console.log('User accepted the install prompt');
      }
      
      setDeferredPrompt(null);
      setShowInstallBanner(false);
    }
  };

  if (!showInstallBanner) return null;

  return (
    <div className="alert alert-info alert-dismissible fade show m-3" role="alert">
      <div className="d-flex align-items-center">
        <i className="fas fa-mobile-alt fa-2x me-3"></i>
        <div className="flex-grow-1">
          <strong>Install GoFood App</strong>
          <p className="mb-0">Get the full app experience! Install GoFood for faster access and offline ordering.</p>
        </div>
        <button 
          className="btn btn-primary me-2" 
          onClick={handleInstallClick}
        >
          Install
        </button>
        <button 
          type="button" 
          className="btn-close" 
          onClick={() => setShowInstallBanner(false)}
          aria-label="Close"
        ></button>
      </div>
    </div>
  );
};

export default EnhancedFeatures;
