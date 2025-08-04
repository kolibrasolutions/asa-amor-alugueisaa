import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { 
  Smartphone, 
  Monitor, 
  Download, 
  Wifi, 
  WifiOff, 
  RotateCw, 
  CheckCircle, 
  AlertCircle 
} from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { useDataSync } from '@/hooks/useDataSync';

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export const PWASettings = () => {
  const isMobile = useIsMobile();
  const { isOnline, isSyncing, lastSyncTime, syncError, performSync } = useDataSync();
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isInstalling, setIsInstalling] = useState(false);

  useEffect(() => {
    // Verificar se já está instalado
    const checkIfInstalled = () => {
      const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
      const isInWebAppiOS = (window.navigator as any).standalone === true;
      setIsInstalled(isStandalone || isInWebAppiOS);
    };

    checkIfInstalled();

    // Listener para o evento beforeinstallprompt
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    // Listener para quando o app é instalado
    const handleAppInstalled = () => {
      setIsInstalled(true);
      setDeferredPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstallPWA = async () => {
    if (!deferredPrompt) return;

    setIsInstalling(true);
    try {
      await deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      
      if (outcome === 'accepted') {
        setIsInstalled(true);
      }
      
      setDeferredPrompt(null);
    } catch (error) {
      console.error('Erro ao instalar PWA:', error);
    } finally {
      setIsInstalling(false);
    }
  };

  const formatLastSync = (timestamp: Date | number | null) => {
    if (!timestamp) return 'Nunca';
    if (timestamp instanceof Date) {
      return timestamp.toLocaleString('pt-BR');
    }
    return new Date(timestamp).toLocaleString('pt-BR');
  };

  return (
    <div className={`${isMobile ? 'space-y-4' : 'space-y-6'}`}>
      {/* Status do PWA */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Smartphone className="w-5 h-5" />
            Status do PWA
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <span>Status da Instalação:</span>
            <Badge variant={isInstalled ? 'default' : 'secondary'}>
              {isInstalled ? (
                <><CheckCircle className="w-3 h-3 mr-1" /> Instalado</>
              ) : (
                <><Download className="w-3 h-3 mr-1" /> Não Instalado</>
              )}
            </Badge>
          </div>
          
          <div className="flex items-center justify-between">
            <span>Conexão:</span>
            <Badge variant={isOnline ? 'default' : 'destructive'}>
              {isOnline ? (
                <><Wifi className="w-3 h-3 mr-1" /> Online</>
              ) : (
                <><WifiOff className="w-3 h-3 mr-1" /> Offline</>
              )}
            </Badge>
          </div>

          <div className="flex items-center justify-between">
            <span>Última Sincronização:</span>
            <span className="text-sm text-muted-foreground">
              {formatLastSync(lastSyncTime)}
            </span>
          </div>

          {syncError && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Erro na sincronização: {syncError}
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Instalação do PWA */}
      {!isInstalled && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Download className="w-5 h-5" />
              Instalar Aplicativo
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert>
              <Smartphone className="h-4 w-4" />
              <AlertDescription>
                <strong>Instale o Sistema Administrativo como um aplicativo:</strong>
                <br />• Acesso mais rápido
                <br />• Funciona offline
                <br />• Notificações push
                <br />• Interface dedicada
              </AlertDescription>
            </Alert>

            {deferredPrompt ? (
              <Button 
                onClick={handleInstallPWA} 
                disabled={isInstalling}
                className="w-full"
              >
                {isInstalling ? (
                  <><RotateCw className="w-4 h-4 mr-2 animate-spin" /> Instalando...</>
                ) : (
                  <><Download className="w-4 h-4 mr-2" /> Instalar Aplicativo</>
                )}
              </Button>
            ) : (
              <div className="space-y-3">
                <Alert>
                  <AlertDescription>
                    <strong>Como instalar manualmente:</strong>
                  </AlertDescription>
                </Alert>
                
                <div className="space-y-2 text-sm">
                  <div className="flex items-start gap-2">
                    <Monitor className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <div>
                      <strong>Desktop (Chrome/Edge):</strong>
                      <br />1. Clique no ícone de instalação na barra de endereços
                      <br />2. Ou vá em Menu → "Instalar Sistema Administrativo"
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-2">
                    <Smartphone className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <div>
                      <strong>Mobile:</strong>
                      <br />• <strong>Android:</strong> Menu → "Adicionar à tela inicial"
                      <br />• <strong>iOS:</strong> Compartilhar → "Adicionar à Tela de Início"
                    </div>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Controles de Sincronização */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <RotateCw className="w-5 h-5" />
            Sincronização de Dados
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert>
            <AlertDescription>
              <strong>Sincronização Automática:</strong>
              <br />• A cada 5 minutos quando online
              <br />• Imediata ao reconectar à internet
              <br />• Retry automático em caso de falha
            </AlertDescription>
          </Alert>

          <Button 
            onClick={performSync} 
            disabled={isSyncing || !isOnline}
            variant="outline"
            className="w-full"
          >
            {isSyncing ? (
              <><RotateCw className="w-4 h-4 mr-2 animate-spin" /> Sincronizando...</>
            ) : (
              <><RotateCw className="w-4 h-4 mr-2" /> Sincronizar Agora</>
            )}
          </Button>

          {!isOnline && (
            <Alert variant="destructive">
              <WifiOff className="h-4 w-4" />
              <AlertDescription>
                Sem conexão com a internet. A sincronização será feita automaticamente quando a conexão for reestabelecida.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Informações Técnicas */}
      <Card>
        <CardHeader>
          <CardTitle>Informações Técnicas</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span>Escopo:</span>
            <span>/admin</span>
          </div>
          <div className="flex justify-between">
            <span>Estratégia de Cache:</span>
            <span>NetworkFirst</span>
          </div>
          <div className="flex justify-between">
            <span>Suporte a Offline:</span>
            <span>Sim</span>
          </div>
          <div className="flex justify-between">
            <span>Atualizações:</span>
            <span>Automáticas</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};