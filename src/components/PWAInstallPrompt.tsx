import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Download, X, RefreshCw, Wifi, WifiOff, RotateCw, AlertTriangle } from 'lucide-react';
import { useRegisterSW } from 'virtual:pwa-register/react';
import { useDataSync } from '@/hooks/useDataSync';

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

export const PWAInstallPrompt: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [showOfflineReady, setShowOfflineReady] = useState(false);
  
  // Hook de sincronização de dados
  const { 
    isOnline, 
    isSyncing, 
    lastSyncTime, 
    pendingSync, 
    syncError,
    performSync,
    clearSyncError
  } = useDataSync();

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
      // Only show offline ready if service worker is registered and app is installed
      if (isInstalled && 'serviceWorker' in navigator) {
        navigator.serviceWorker.getRegistration().then(registration => {
          if (registration) {
            setShowOfflineReady(true);
          }
        });
      }
    };
    
    const handleOnline = () => {
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

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      setDeferredPrompt(null);
      setShowInstallPrompt(false);
    }
  };

  const handleUpdateClick = () => {
    updateServiceWorker(true);
  };



  const close = () => {
    setOfflineReady(false);
    setNeedRefresh(false);
    setShowInstallPrompt(false);
    setShowOfflineReady(false);
  };

  // Don't show install prompt if already installed
  if (isInstalled) {
    return null;
  }

  return (
    <>
      {/* Install Prompt */}
      {showInstallPrompt && deferredPrompt && (
        <Card className="fixed bottom-4 right-4 w-80 z-50 shadow-lg border-primary">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm flex items-center gap-2">
                <Download className="h-4 w-4" />
                Instalar App
              </CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowInstallPrompt(false)}
                className="h-6 w-6 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <CardDescription className="text-xs">
              Instale o Sistema Administrativo para acesso rápido e offline
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="flex gap-2">
              <Button
                onClick={handleInstallClick}
                size="sm"
                className="flex-1"
              >
                Instalar
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowInstallPrompt(false)}
              >
                Agora não
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Update Available */}
      {needRefresh && (
        <Card className="fixed bottom-4 right-4 w-80 z-50 shadow-lg border-blue-500">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm flex items-center gap-2">
                <RefreshCw className="h-4 w-4" />
                Atualização Disponível
              </CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={close}
                className="h-6 w-6 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <CardDescription className="text-xs">
              Uma nova versão do sistema está disponível
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="flex gap-2">
              <Button
                onClick={handleUpdateClick}
                size="sm"
                className="flex-1"
                variant="default"
              >
                Atualizar
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={close}
              >
                Depois
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Offline Ready - Only show when actually offline */}
      {(offlineReady || showOfflineReady) && !isOnline && (
        <Card className="fixed bottom-4 right-4 w-80 z-50 shadow-lg border-green-500">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm flex items-center gap-2">
                <WifiOff className="h-4 w-4" />
                Modo Offline Ativo
              </CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={close}
                className="h-6 w-6 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <CardDescription className="text-xs">
              Sem conexão - usando dados em cache
            </CardDescription>
          </CardHeader>
        </Card>
      )}

      {/* Connection Status Indicator */}
       {!isOnline && (
         <div className="fixed top-4 right-4 z-50">
           <Card className="border-orange-500 bg-orange-50">
             <CardContent className="p-3">
               <div className="flex items-center gap-2 text-orange-700">
                 <WifiOff className="h-4 w-4" />
                 <div className="flex flex-col">
                   <span className="text-sm font-medium">Sem conexão</span>
                   {pendingSync && (
                     <span className="text-xs text-orange-600">Dados pendentes para sincronizar</span>
                   )}
                 </div>
               </div>
             </CardContent>
           </Card>
         </div>
       )}

       {/* Sync Status Indicator */}
       {isSyncing && (
         <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50">
           <Card className="border-blue-500 bg-blue-50">
             <CardContent className="p-3">
               <div className="flex items-center gap-2 text-blue-700">
                 <RotateCw className="h-4 w-4 animate-spin" />
                 <span className="text-sm font-medium">Sincronizando dados...</span>
               </div>
             </CardContent>
           </Card>
         </div>
       )}

       {/* Sync Error Indicator */}
       {syncError && (
         <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50">
           <Card className="border-red-500 bg-red-50">
             <CardContent className="p-3">
               <div className="flex items-center gap-2 text-red-700">
                 <AlertTriangle className="h-4 w-4" />
                 <div className="flex flex-col">
                   <span className="text-sm font-medium">Erro na sincronização</span>
                   <div className="flex items-center gap-2 mt-1">
                     <span className="text-xs">{syncError}</span>
                     <Button
                       size="sm"
                       variant="outline"
                       onClick={() => {
                         clearSyncError();
                         performSync();
                       }}
                       className="h-6 px-2 text-xs"
                     >
                       Tentar novamente
                     </Button>
                   </div>
                 </div>
                 <Button
                   variant="ghost"
                   size="sm"
                   onClick={clearSyncError}
                   className="h-6 w-6 p-0 ml-2"
                 >
                   <X className="h-3 w-3" />
                 </Button>
               </div>
             </CardContent>
           </Card>
         </div>
       )}

       {/* Sync Success Indicator */}
       {isOnline && lastSyncTime && !isSyncing && !syncError && (
         <div className="fixed top-4 right-4 z-40">
           <Card className="border-green-500 bg-green-50">
             <CardContent className="p-2">
               <div className="flex items-center gap-2 text-green-700">
                 <Wifi className="h-3 w-3" />
                 <span className="text-xs">Sincronizado {lastSyncTime.toLocaleTimeString()}</span>
                 <Button
                   variant="ghost"
                   size="sm"
                   onClick={performSync}
                   className="h-5 w-5 p-0 ml-1"
                   title="Sincronizar agora"
                 >
                   <RefreshCw className="h-3 w-3" />
                 </Button>
               </div>
             </CardContent>
           </Card>
         </div>
       )}
    </>
  );
};

export default PWAInstallPrompt;