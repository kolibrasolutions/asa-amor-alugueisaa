import { useState, useEffect, useCallback } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import ColorsManagement from './ColorsManagement';
import SizesManagement from './SizesManagement';
import { BannersManagement } from './BannersManagement';
import { CategoriesManagement } from './CategoriesManagement';
import { AllSectionsImagesManagement } from '../domains/section-images/components/AllSectionsImagesManagement';
import { AdminBackButton } from './AdminHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/components/ui/use-toast';
import { Bell, Globe, Plus, Trash2, Images } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { sendNtfyTest } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';

interface NtfyConfig {
  topic: string;
  name: string;
}

export const SettingsManagement = () => {
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const [activeTab, setActiveTab] = useState('banners');
  
  // Ntfy State
  const [ntfyConfigs, setNtfyConfigs] = useState<NtfyConfig[]>([{ topic: '', name: '' }]);
  const [ntfyServerUrl, setNtfyServerUrl] = useState('https://ntfy.sh');
  const [isTestingNtfy, setIsTestingNtfy] = useState<{[key: string]: boolean}>({});

  // Debug visual para mobile - declarar primeiro
  const showMobileDebug = useCallback((message: string) => {
    if (window.innerWidth < 768) {
      toast({
        title: "📱 Debug Mobile",
        description: message,
        duration: 2000,
      });
    }
  }, [toast]);

  // Carregar configurações do localStorage na inicialização
  useEffect(() => {
    console.log('🟠 SETTINGS DEBUG: Carregando configurações...');
    console.log('🟠 SETTINGS DEBUG: URL atual:', window.location.href);
    console.log('🟠 SETTINGS DEBUG: User Agent:', navigator.userAgent);
    console.log('🟠 SETTINGS DEBUG: Is Mobile?', window.innerWidth < 768);
    console.log('🟠 SETTINGS DEBUG: localStorage disponível?', typeof(Storage) !== "undefined");
    
    showMobileDebug(`URL: ${window.location.href}`);
    
    // Listar TODAS as chaves do localStorage para debug
    console.log('🟠 SETTINGS DEBUG: TODAS as chaves localStorage:');
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      const value = localStorage.getItem(key);
      console.log(`  ${key}: ${value}`);
    }
    
    // Ntfy
    const savedNtfyConfigs = localStorage.getItem('ntfy_configs');
    const savedNtfyServer = localStorage.getItem('ntfy_server_url');
    
    console.log('🟠 SETTINGS DEBUG: savedNtfyConfigs:', savedNtfyConfigs);
    console.log('🟠 SETTINGS DEBUG: savedNtfyServer:', savedNtfyServer);
    
    showMobileDebug(`localStorage: ${localStorage.length} chaves total`);
    
    if (savedNtfyConfigs) {
      try {
        const parsed = JSON.parse(savedNtfyConfigs);
        console.log('🟠 SETTINGS DEBUG: Parsed configs:', parsed);
        setNtfyConfigs(parsed);
        showMobileDebug(`✅ ${parsed.length} funcionário(s) carregados`);
      } catch (error) {
        console.error('🔴 SETTINGS DEBUG: Erro ao parsear configs:', error);
        setNtfyConfigs([{ topic: '', name: '' }]);
        showMobileDebug('❌ Erro ao carregar configs');
      }
    } else {
      showMobileDebug('⚠️ Nenhuma config encontrada');
      
      // Verificar se há chaves relacionadas ao ntfy com nomes diferentes
      const allKeys = Object.keys(localStorage);
      const ntfyRelatedKeys = allKeys.filter(key => key.toLowerCase().includes('ntfy'));
      if (ntfyRelatedKeys.length > 0) {
        console.log('🟠 SETTINGS DEBUG: Chaves relacionadas ao NTFY encontradas:', ntfyRelatedKeys);
        showMobileDebug(`🔍 Encontradas chaves: ${ntfyRelatedKeys.join(', ')}`);
      }
    }
    if (savedNtfyServer) setNtfyServerUrl(savedNtfyServer);
  }, [showMobileDebug]);

  const handleSaveNtfyConfig = useCallback(() => {
    console.log('🟠 SETTINGS DEBUG: Salvando configurações...');
    showMobileDebug('Salvando configurações...');
    
    const hasEmptyFields = ntfyConfigs.some(config => !config.topic || !config.name);
    if (hasEmptyFields) {
      toast({
        title: "Erro",
        description: "Preencha o nome e tópico para todos os funcionários",
        variant: "destructive",
      });
      showMobileDebug('Erro: campos vazios');
      return;
    }

    // Salvar no localStorage
    const configsJson = JSON.stringify(ntfyConfigs);
    localStorage.setItem('ntfy_configs', configsJson);
    localStorage.setItem('ntfy_server_url', ntfyServerUrl);
    
    // Verificar se foi salvo corretamente
    const saved = localStorage.getItem('ntfy_configs');
    console.log('🟠 SETTINGS DEBUG: Verificação pós-save:', saved);

    toast({
      title: "✅ Configurações salvas",
      description: "Configurações do ntfy foram salvas com sucesso!",
    });
    showMobileDebug('Configurações salvas com sucesso!');
  }, [ntfyConfigs, ntfyServerUrl, toast, showMobileDebug]);

  // Exportar configurações para sincronização
  const handleExportConfig = useCallback(() => {
    const configData = {
      ntfy_configs: ntfyConfigs,
      ntfy_server_url: ntfyServerUrl,
      exported_at: new Date().toISOString(),
      exported_from: navigator.userAgent,
      url: window.location.href
    };
    
    const configText = JSON.stringify(configData, null, 2);
    
    // Copiar para clipboard
    navigator.clipboard.writeText(configText).then(() => {
      toast({
        title: "📋 Configurações copiadas!",
        description: "Cole no outro dispositivo e clique em Importar",
      });
      showMobileDebug('Configurações copiadas para clipboard');
    }).catch(() => {
      // Fallback: mostrar em um alert
      alert('Copie estas configurações:\n\n' + configText);
    });
  }, [ntfyConfigs, ntfyServerUrl, toast, showMobileDebug]);

  // Importar configurações
  const handleImportConfig = useCallback(() => {
    const configText = prompt('Cole aqui as configurações exportadas do outro dispositivo:');
    if (!configText) return;

    try {
      const configData = JSON.parse(configText);
      
      if (configData.ntfy_configs) {
        setNtfyConfigs(configData.ntfy_configs);
        console.log('🟠 SETTINGS DEBUG: Configs importadas:', configData.ntfy_configs);
      }
      
      if (configData.ntfy_server_url) {
        setNtfyServerUrl(configData.ntfy_server_url);
      }

      toast({
        title: "✅ Configurações importadas!",
        description: "Clique em 'Salvar Configurações' para aplicar",
      });
      showMobileDebug(`Importadas ${configData.ntfy_configs?.length || 0} configs`);
      
    } catch (error) {
      toast({
        title: "❌ Erro na importação",
        description: "Formato inválido. Verifique os dados copiados.",
        variant: "destructive",
      });
      showMobileDebug('Erro ao importar configurações');
    }
  }, [toast, showMobileDebug]);

  const handleTestNtfy = useCallback(async (index: number) => {
    const config = ntfyConfigs[index];
    if (!config.topic) {
      toast({
        title: "Erro",
        description: "Configure primeiro o tópico do ntfy",
        variant: "destructive",
      });
      return;
    }

    setIsTestingNtfy(prev => ({ ...prev, [index]: true }));

    try {
      console.log('Testando ntfy com:', {
        topic: config.topic,
        server: ntfyServerUrl
      });

      const success = await sendNtfyTest({
        topic: config.topic,
        serverUrl: ntfyServerUrl
      });

      if (success) {
        toast({
          title: "🎉 Teste enviado!",
          description: `Mensagem de teste enviada para ${config.name}! Verifique o app em alguns segundos.`,
        });
      } else {
        toast({
          title: "❌ Erro no teste",
          description: "Não foi possível enviar a mensagem. Verifique se o tópico está correto.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Erro no teste ntfy:', error);
      toast({
        title: "❌ Erro no teste",
        description: "Erro ao enviar mensagem de teste. Verifique o console para mais detalhes.",
        variant: "destructive",
      });
    } finally {
      setIsTestingNtfy(prev => ({ ...prev, [index]: false }));
    }
  }, [ntfyConfigs, ntfyServerUrl, toast]);

  const addNtfyConfig = useCallback(() => {
    setNtfyConfigs(prev => [...prev, { topic: '', name: '' }]);
  }, []);

  const removeNtfyConfig = useCallback((index: number) => {
    setNtfyConfigs(prev => prev.filter((_, i) => i !== index));
  }, []);

  const updateNtfyConfig = useCallback((index: number, field: keyof NtfyConfig, value: string) => {
    console.log('🟠 SETTINGS DEBUG: Atualizando config:', { index, field, value });
    showMobileDebug(`Atualizando ${field}: ${value}`);
    
    setNtfyConfigs(prev => {
      const newConfigs = prev.map((config, i) =>
        i === index ? { ...config, [field]: value } : config
      );
      console.log('🟠 SETTINGS DEBUG: Novas configs:', newConfigs);
      return newConfigs;
    });
  }, [showMobileDebug]);

  const NotificationsTab = () => (
    <div className={`${isMobile ? 'space-y-4' : 'space-y-6'}`}>
      <Alert>
        <Bell className="h-4 w-4" />
        <AlertDescription className={`${isMobile ? 'text-sm' : ''}`}>
          <strong>ntfy.sh - Notificações Push Gratuitas:</strong>
          <br />1. <strong>Instale o app ntfy:</strong> <a href="https://play.google.com/store/apps/details?id=io.heckel.ntfy" target="_blank" className="text-blue-600 underline">Android</a> | <a href="https://apps.apple.com/app/ntfy/id1625396347" target="_blank" className="text-blue-600 underline">iOS</a>
          <br />2. <strong>Abra o app</strong> e clique em "Subscribe to topic"
          <br />3. <strong>Digite seu tópico único</strong> para cada funcionário (ex: noivas-cirlene-maria-2024)
          <br />4. <strong>Configure os tópicos abaixo</strong> e teste a integração
          <br /><br />
          <strong>✅ Vantagens:</strong> 100% gratuito, sem limites, funciona offline, muito confiável
        </AlertDescription>
      </Alert>

      <div className="space-y-4">
        {ntfyConfigs.map((config, index) => (
          <div key={index} className={`${isMobile ? 'flex flex-col space-y-4 p-3' : 'grid grid-cols-1 md:grid-cols-3 gap-4 p-4'} border rounded-lg`}>
            <div className="space-y-2">
              <Label htmlFor={`ntfy-name-${index}`} className="flex items-center gap-2 text-sm">
                <Bell className="w-4 h-4" />
                Nome do Funcionário
              </Label>
              <Input
                key={`name-${index}-${config.name}`}
                id={`ntfy-name-${index}`}
                placeholder="Maria"
                value={config.name}
                onChange={(e) => {
                  e.preventDefault();
                  updateNtfyConfig(index, 'name', e.target.value);
                }}
                className={`${isMobile ? 'text-base' : ''}`}
                autoComplete="off"
                autoCorrect="off"
                autoCapitalize="words"
                spellCheck="false"
                inputMode="text"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor={`ntfy-topic-${index}`} className="flex items-center gap-2 text-sm">
                <Bell className="w-4 h-4" />
                Tópico do ntfy
              </Label>
              <Input
                key={`topic-${index}-${config.topic}`}
                id={`ntfy-topic-${index}`}
                placeholder="noivas-cirlene-maria-2024"
                value={config.topic}
                onChange={(e) => {
                  e.preventDefault();
                  updateNtfyConfig(index, 'topic', e.target.value);
                }}
                className={`${isMobile ? 'text-base' : ''}`}
                autoComplete="off"
                autoCorrect="off"
                autoCapitalize="off"
                spellCheck="false"
                inputMode="text"
              />
            </div>

            <div className={`flex ${isMobile ? 'flex-col space-y-2' : 'items-end'} gap-2`}>
              <Button 
                variant="outline" 
                onClick={() => handleTestNtfy(index)}
                disabled={isTestingNtfy[index]}
                className={`${isMobile ? 'w-full' : 'flex-1'}`}
              >
                {isTestingNtfy[index] ? 'Enviando...' : 'Testar'}
              </Button>
              {ntfyConfigs.length > 1 && (
                <Button
                  variant="destructive"
                  size={isMobile ? "default" : "icon"}
                  onClick={() => removeNtfyConfig(index)}
                  className={`${isMobile ? 'w-full flex items-center justify-center gap-2' : ''}`}
                >
                  <Trash2 className="w-4 h-4" />
                  {isMobile && 'Remover'}
                </Button>
              )}
            </div>
          </div>
        ))}

        <Button
          variant="outline"
          onClick={addNtfyConfig}
          className={`w-full flex items-center justify-center gap-2 ${isMobile ? 'py-3' : ''}`}
        >
          <Plus className="w-4 h-4" />
          Adicionar Funcionário
        </Button>
      </div>

      <div className="space-y-2">
        <Label htmlFor="ntfy-server" className="flex items-center gap-2 text-sm">
          <Globe className="w-4 h-4" />
          Servidor ntfy (opcional)
        </Label>
        <Input
          id="ntfy-server"
          placeholder="https://ntfy.sh"
                        value={ntfyServerUrl}
              onChange={(e) => setNtfyServerUrl(e.target.value)}
              className={`${isMobile ? 'text-base' : ''}`}
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="off"
              spellCheck="false"
              inputMode="url"
        />
        <p className="text-xs md:text-sm text-gray-500">
          Deixe como ntfy.sh ou use seu próprio servidor
        </p>
      </div>

      <Separator />

      <div className={`${isMobile ? 'space-y-3' : 'flex gap-3'}`}>
        <Button 
          onClick={handleSaveNtfyConfig} 
          className={`flex items-center gap-2 ${isMobile ? 'w-full py-3' : 'flex-1'}`}
        >
          <Bell className="w-4 h-4" />
          Salvar Configurações
        </Button>
        
        <Button 
          variant="outline"
          onClick={handleExportConfig} 
          className={`flex items-center gap-2 ${isMobile ? 'w-full py-3' : ''}`}
        >
          📋 Exportar
        </Button>
        
        <Button 
          variant="outline"
          onClick={handleImportConfig} 
          className={`flex items-center gap-2 ${isMobile ? 'w-full py-3' : ''}`}
        >
          📥 Importar
        </Button>
      </div>
    </div>
  );

  return (
    <>
      {isMobile && (
        <style>{`
          .mobile-settings-container * {
            max-width: 100% !important;
            box-sizing: border-box !important;
            word-wrap: break-word !important;
            overflow-wrap: break-word !important;
          }
          .mobile-settings-container img {
            max-width: 100% !important;
            height: auto !important;
          }
          .mobile-settings-container .grid {
            display: flex !important;
            flex-direction: column !important;
          }
        `}</style>
      )}
      <div 
        className={`p-4 md:p-6 space-y-4 md:space-y-6 max-w-full overflow-hidden ${isMobile ? 'mobile-settings-container' : ''}`}
        style={isMobile ? {
          maxWidth: '100vw',
          boxSizing: 'border-box'
        } : {}}
      >
      <AdminBackButton />
      <div className="max-w-full overflow-hidden">
        <h2 className={`font-semibold ${isMobile ? 'text-xl' : 'text-2xl'} truncate`}>
          {isMobile ? 'Configurações' : 'Configurações do Site'}
        </h2>
        {!isMobile && (
          <p className="text-muted-foreground text-sm md:text-base">
            Gerencie as configurações gerais do site
          </p>
        )}
      </div>

      <Card 
        className="overflow-hidden"
        style={isMobile ? {
          maxWidth: '100%',
          width: '100%',
          boxSizing: 'border-box'
        } : {}}
      >
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList 
            className={`w-full border-b rounded-none pt-2 ${
              isMobile 
                ? 'px-1 overflow-x-auto justify-start scrollbar-hide flex-nowrap gap-1' 
                : 'px-6 justify-start'
            }`}
            style={isMobile ? { 
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
              WebkitOverflowScrolling: 'touch',
              maxWidth: '100%'
            } : {}}
          >
            <TabsTrigger value="banners" className={`data-[state=active]:border-b-2 ${isMobile ? 'text-xs whitespace-nowrap px-1.5 py-2 min-w-0 flex-shrink-0' : ''}`}>
              Banners
            </TabsTrigger>
            <TabsTrigger value="site-images" className={`data-[state=active]:border-b-2 ${isMobile ? 'text-xs whitespace-nowrap px-1.5 py-2 min-w-0 flex-shrink-0' : ''}`}>
              {isMobile ? 'Fotos' : 'Imagens do Site'}
            </TabsTrigger>
            <TabsTrigger value="colors" className={`data-[state=active]:border-b-2 ${isMobile ? 'text-xs whitespace-nowrap px-1.5 py-2 min-w-0 flex-shrink-0' : ''}`}>
              Cores
            </TabsTrigger>
            <TabsTrigger value="sizes" className={`data-[state=active]:border-b-2 ${isMobile ? 'text-xs whitespace-nowrap px-1.5 py-2 min-w-0 flex-shrink-0' : ''}`}>
              {isMobile ? 'Tam.' : 'Tamanhos'}
            </TabsTrigger>
            <TabsTrigger value="categories" className={`data-[state=active]:border-b-2 ${isMobile ? 'text-xs whitespace-nowrap px-1.5 py-2 min-w-0 flex-shrink-0' : ''}`}>
              {isMobile ? 'Cat.' : 'Categorias'}
            </TabsTrigger>
            <TabsTrigger value="notifications" className={`data-[state=active]:border-b-2 ${isMobile ? 'text-xs whitespace-nowrap px-1.5 py-2 min-w-0 flex-shrink-0' : ''}`}>
              {isMobile ? 'Notif.' : 'Notificações'}
            </TabsTrigger>
          </TabsList>

          <div className={`${isMobile ? 'p-3' : 'p-6'} overflow-hidden`}>
            <TabsContent value="banners" className="m-0 overflow-hidden">
              <div className="max-w-full overflow-hidden">
                <BannersManagement />
              </div>
            </TabsContent>

            <TabsContent value="site-images" className="m-0 overflow-hidden">
              <div className="max-w-full overflow-hidden">
                <AllSectionsImagesManagement />
              </div>
            </TabsContent>

            <TabsContent value="colors" className="m-0 overflow-hidden">
              <div className="max-w-full overflow-hidden">
                <ColorsManagement />
              </div>
            </TabsContent>

            <TabsContent value="sizes" className="m-0 overflow-hidden">
              <div className="max-w-full overflow-hidden">
                <SizesManagement />
              </div>
            </TabsContent>

            <TabsContent value="categories" className="m-0 overflow-hidden">
              <div className="max-w-full overflow-hidden">
                <CategoriesManagement />
              </div>
            </TabsContent>

            <TabsContent value="notifications" className="m-0 overflow-hidden">
              <div className="max-w-full overflow-hidden">
                <NotificationsTab />
              </div>
            </TabsContent>
          </div>
        </Tabs>
      </Card>
    </div>
    </>
  );
};

export default SettingsManagement; 