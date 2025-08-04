import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Download, X, RefreshCw, Wifi, WifiOff, RotateCw, AlertTriangle } from 'lucide-react';
import { useRegisterSW } from 'virtual:pwa-register/react';

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

declare global {
  interface WindowEventMap {
    beforeinstallprompt: BeforeInstallPromptEvent;
  }
}

export const PWAInstallPromptSimple: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [showOfflineReady, setShowOfflineReady] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  const {
    offlineReady: [offlineReady, setOfflineReady],
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegistered(r) {
      console.log('SW Registered: ' + r);
    },
    onRegisterError(error) {
      console.log('SW registration error', error);
    },
  });

  useEffect(() => {
    const handler = (e: BeforeInstallPromptEvent) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstallPrompt(true);
    };

    const handleOffline = () => {
      setIsOnline(false);
      if (isInstalled && 'serviceWorker' in navigator) {
        navigator.serviceWorker.getRegistration().then(registration => {
          if (registration) {
            setShowOfflineReady(true);
          }
        });
      }
    };
    
    const handleOnline = () => {
      setIsOnline(true);
      setShowOfflineReady(false);
    };

    window.addEventListener('beforeinstallprompt', handler);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Check if app is already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [isInstalled]);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      setIsInstalled(true);
    }
    
    setDeferredPrompt(null);
    setShowInstallPrompt(false);
  };

  const handleDismiss = () => {
    setShowInstallPrompt(false);
  };

  const handleUpdate = () => {
    updateServiceWorker(true);
  };

  const handleDismissOffline = () => {
    setShowOfflineReady(false);
  };

  const handleDismissOfflineReady = () => {
    setOfflineReady(false);
  };

  const handleDismissNeedRefresh = () => {
    setNeedRefresh(false);
  };

  // Don't show anything if already installed
  if (isInstalled) {
    return (
      <>
        {/* Update Available */}
        {needRefresh && (
          <Card className="fixed bottom-4 right-4 w-80 z-50 shadow-lg border-blue-200 bg-blue-50">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <RefreshCw className="h-5 w-5 text-blue-600" />
                  <CardTitle className="text-sm text-blue-900">Atualização Disponível</CardTitle>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleDismissNeedRefresh}
                  className="h-6 w-6 p-0 text-blue-600 hover:text-blue-800"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <CardDescription className="text-blue-700 mb-3">
                Uma nova versão do aplicativo está disponível.
              </CardDescription>
              <Button 
                onClick={handleUpdate} 
                size="sm" 
                className="w-full bg-blue-600 hover:bg-blue-700"
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                Atualizar Agora
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Offline Ready */}
        {offlineReady && (
          <Card className="fixed bottom-4 right-4 w-80 z-50 shadow-lg border-green-200 bg-green-50">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <WifiOff className="h-5 w-5 text-green-600" />
                  <CardTitle className="text-sm text-green-900">Pronto para Offline</CardTitle>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleDismissOfflineReady}
                  className="h-6 w-6 p-0 text-green-600 hover:text-green-800"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <CardDescription className="text-green-700">
                O aplicativo está pronto para funcionar offline.
              </CardDescription>
            </CardContent>
          </Card>
        )}

        {/* Offline Status */}
        {showOfflineReady && (
          <Card className="fixed bottom-4 right-4 w-80 z-50 shadow-lg border-orange-200 bg-orange-50">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <WifiOff className="h-5 w-5 text-orange-600" />
                  <CardTitle className="text-sm text-orange-900">Modo Offline</CardTitle>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleDismissOffline}
                  className="h-6 w-6 p-0 text-orange-600 hover:text-orange-800"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <CardDescription className="text-orange-700">
                Você está offline. O aplicativo continuará funcionando com os dados em cache.
              </CardDescription>
            </CardContent>
          </Card>
        )}
      </>
    );
  }

  return (
    <>
      {/* Install Prompt */}
      {showInstallPrompt && (
        <Card className="fixed bottom-4 right-4 w-80 z-50 shadow-lg">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Download className="h-5 w-5 text-blue-600" />
                <CardTitle className="text-sm">Instalar Aplicativo</CardTitle>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleDismiss}
                className="h-6 w-6 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <CardDescription className="mb-3">
              Instale o aplicativo para uma experiência melhor e acesso offline.
            </CardDescription>
            <div className="flex gap-2">
              <Button onClick={handleInstall} size="sm" className="flex-1">
                <Download className="mr-2 h-4 w-4" />
                Instalar
              </Button>
              <Button onClick={handleDismiss} variant="outline" size="sm">
                Agora não
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </>
  );
};

export default PWAInstallPromptSimple;