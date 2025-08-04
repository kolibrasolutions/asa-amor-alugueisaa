import { useState, useEffect, useCallback, useMemo, useRef, memo } from 'react';
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
import { Bell, Globe, Plus, Trash2, Images, Smartphone } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { sendNtfyTest } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';
import { useNotificationSettings } from '@/hooks/useNotificationSettings';
import { PWASettings } from './PWASettings';
import { PWASettingsTest } from './PWASettingsTest';
import { PWASettingsSimple } from './PWASettingsSimple';

interface NtfyConfig {
  topic: string;
  name: string;
}

// Componente com estado local para evitar re-renderizações
const NtfyInput = memo(({ 
  id, 
  label, 
  defaultValue, 
  onChange, 
  placeholder, 
  className,
  icon 
}: {
  id: string;
  label: string;
  defaultValue: string;
  onChange: (value: string) => void;
  placeholder: string;
  className?: string;
  icon?: React.ReactNode;
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  
  const handleSave = () => {
    if (inputRef.current) {
      onChange(inputRef.current.value);
    }
  };
  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSave();
    }
  };
  
  const handleBlur = () => {
    handleSave();
  };
  
  return (
    <div className="space-y-2">
      <Label htmlFor={id} className="flex items-center gap-2 text-sm">
        {icon}
        {label}
      </Label>
      <Input
        ref={inputRef}
        id={id}
        type="text"
        placeholder={placeholder}
        defaultValue={defaultValue}
        onKeyDown={handleKeyDown}
        onBlur={handleBlur}
        className={className}
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize={label.includes('Nome') ? 'words' : 'off'}
        spellCheck="false"
        inputMode="text"
      />
    </div>
  );
});

export const SettingsManagement = () => {
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const [activeTab, setActiveTab] = useState('banners');
  
  // Use the new notification settings hook
  const {
    ntfyConfigs,
    ntfyServerUrl,
    isTestingNtfy,
    updateNtfyConfig,
    addNtfyConfig,
    removeNtfyConfig,
    setNtfyServerUrl,
    handleSaveNtfyConfig,
    handleExportConfig,
    handleImportConfig,
    handleTestNtfy
  } = useNotificationSettings();





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
          <div key={`ntfy-config-${index}`} className={`${isMobile ? 'flex flex-col space-y-4 p-3' : 'grid grid-cols-1 md:grid-cols-3 gap-4 p-4'} border rounded-lg`}>
            <NtfyInput
               id={`ntfy-name-${index}`}
               label="Nome do Funcionário"
               defaultValue={config.name}
               onChange={(value) => updateNtfyConfig(index, 'name', value)}
               placeholder="Maria"
               className={`${isMobile ? 'text-base' : ''}`}
               icon={<Bell className="w-4 h-4" />}
             />

            <NtfyInput
               id={`ntfy-topic-${index}`}
               label="Tópico do ntfy"
               defaultValue={config.topic}
               onChange={(value) => updateNtfyConfig(index, 'topic', value)}
               placeholder="noivas-cirlene-maria-2024"
               className={`${isMobile ? 'text-base' : ''}`}
               icon={<Globe className="w-4 h-4" />}
             />

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
        <NtfyInput
          id="ntfy-server"
          label=""
          defaultValue={ntfyServerUrl}
          onChange={(value) => setNtfyServerUrl(value)}
          placeholder="https://ntfy.sh"
          className={`${isMobile ? 'text-base' : ''}`}
          icon={<Globe className="w-4 h-4" />}
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
            <TabsTrigger value="pwa" className={`data-[state=active]:border-b-2 ${isMobile ? 'text-xs whitespace-nowrap px-1.5 py-2 min-w-0 flex-shrink-0' : ''}`}>
              {isMobile ? 'PWA' : 'Aplicativo'}
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

            <TabsContent value="pwa" className="m-0 overflow-hidden">
              <div className="max-w-full overflow-hidden">
                <PWASettingsSimple />
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