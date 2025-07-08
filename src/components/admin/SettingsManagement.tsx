import { useState, useEffect } from 'react';
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

interface NtfyConfig {
  topic: string;
  name: string;
}

export const SettingsManagement = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('banners');
  
  // Ntfy State
  const [ntfyConfigs, setNtfyConfigs] = useState<NtfyConfig[]>([{ topic: '', name: '' }]);
  const [ntfyServerUrl, setNtfyServerUrl] = useState('https://ntfy.sh');
  const [isTestingNtfy, setIsTestingNtfy] = useState<{[key: string]: boolean}>({});

  // Carregar configurações do localStorage na inicialização
  useEffect(() => {
    // Ntfy
    const savedNtfyConfigs = localStorage.getItem('ntfy_configs');
    const savedNtfyServer = localStorage.getItem('ntfy_server_url');
    
    if (savedNtfyConfigs) setNtfyConfigs(JSON.parse(savedNtfyConfigs));
    if (savedNtfyServer) setNtfyServerUrl(savedNtfyServer);
  }, []);

  const handleSaveNtfyConfig = () => {
    const hasEmptyFields = ntfyConfigs.some(config => !config.topic || !config.name);
    if (hasEmptyFields) {
      toast({
        title: "Erro",
        description: "Preencha o nome e tópico para todos os funcionários",
        variant: "destructive",
      });
      return;
    }

    // Salvar no localStorage
    localStorage.setItem('ntfy_configs', JSON.stringify(ntfyConfigs));
    localStorage.setItem('ntfy_server_url', ntfyServerUrl);

    toast({
      title: "✅ Configurações salvas",
      description: "Configurações do ntfy foram salvas com sucesso!",
    });
  };

  const handleTestNtfy = async (index: number) => {
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
  };

  const addNtfyConfig = () => {
    setNtfyConfigs(prev => [...prev, { topic: '', name: '' }]);
  };

  const removeNtfyConfig = (index: number) => {
    setNtfyConfigs(prev => prev.filter((_, i) => i !== index));
  };

  const updateNtfyConfig = (index: number, field: keyof NtfyConfig, value: string) => {
    setNtfyConfigs(prev => prev.map((config, i) => 
      i === index ? { ...config, [field]: value } : config
    ));
  };

  const NotificationsTab = () => (
    <div className="space-y-6">
      <Alert>
        <Bell className="h-4 w-4" />
        <AlertDescription>
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
          <div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 border rounded-lg">
            <div className="space-y-2">
              <Label htmlFor={`ntfy-name-${index}`} className="flex items-center gap-2">
                <Bell className="w-4 h-4" />
                Nome do Funcionário
              </Label>
              <Input
                id={`ntfy-name-${index}`}
                placeholder="Maria"
                value={config.name}
                onChange={(e) => updateNtfyConfig(index, 'name', e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor={`ntfy-topic-${index}`} className="flex items-center gap-2">
                <Bell className="w-4 h-4" />
                Tópico do ntfy
              </Label>
              <Input
                id={`ntfy-topic-${index}`}
                placeholder="noivas-cirlene-maria-2024"
                value={config.topic}
                onChange={(e) => updateNtfyConfig(index, 'topic', e.target.value)}
              />
            </div>

            <div className="flex items-end gap-2">
              <Button 
                variant="outline" 
                onClick={() => handleTestNtfy(index)}
                disabled={isTestingNtfy[index]}
                className="flex-1"
              >
                {isTestingNtfy[index] ? 'Enviando...' : 'Testar'}
              </Button>
              {ntfyConfigs.length > 1 && (
                <Button
                  variant="destructive"
                  size="icon"
                  onClick={() => removeNtfyConfig(index)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              )}
            </div>
          </div>
        ))}

        <Button
          variant="outline"
          onClick={addNtfyConfig}
          className="w-full flex items-center justify-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Adicionar Funcionário
        </Button>
      </div>

      <div className="space-y-2">
        <Label htmlFor="ntfy-server" className="flex items-center gap-2">
          <Globe className="w-4 h-4" />
          Servidor ntfy (opcional)
        </Label>
        <Input
          id="ntfy-server"
          placeholder="https://ntfy.sh"
          value={ntfyServerUrl}
          onChange={(e) => setNtfyServerUrl(e.target.value)}
        />
        <p className="text-sm text-gray-500">
          Deixe como ntfy.sh ou use seu próprio servidor
        </p>
      </div>

      <Separator />

      <Button onClick={handleSaveNtfyConfig} className="flex items-center gap-2">
        <Bell className="w-4 h-4" />
        Salvar Configurações
      </Button>
    </div>
  );

  return (
    <div className="space-y-6">
      <AdminBackButton />
      <div>
        <h2 className="text-2xl font-semibold">Configurações do Site</h2>
        <p className="text-muted-foreground">Gerencie as configurações gerais do site</p>
      </div>

      <Card>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="w-full justify-start border-b rounded-none px-6 pt-2">
            <TabsTrigger value="banners" className="data-[state=active]:border-b-2">
              Banners
            </TabsTrigger>
            <TabsTrigger value="site-images" className="data-[state=active]:border-b-2">
              Imagens do Site
            </TabsTrigger>
            <TabsTrigger value="colors" className="data-[state=active]:border-b-2">
              Cores
            </TabsTrigger>
            <TabsTrigger value="sizes" className="data-[state=active]:border-b-2">
              Tamanhos
            </TabsTrigger>
            <TabsTrigger value="categories" className="data-[state=active]:border-b-2">
              Categorias
            </TabsTrigger>
            <TabsTrigger value="notifications" className="data-[state=active]:border-b-2">
              Notificações
            </TabsTrigger>
          </TabsList>

          <div className="p-6">
            <TabsContent value="banners" className="m-0">
              <BannersManagement />
            </TabsContent>

            <TabsContent value="site-images" className="m-0">
              <AllSectionsImagesManagement />
            </TabsContent>

            <TabsContent value="colors" className="m-0">
              <ColorsManagement />
            </TabsContent>

            <TabsContent value="sizes" className="m-0">
              <SizesManagement />
            </TabsContent>

            <TabsContent value="categories" className="m-0">
              <CategoriesManagement />
            </TabsContent>

            <TabsContent value="notifications" className="m-0">
              <NotificationsTab />
            </TabsContent>
          </div>
        </Tabs>
      </Card>
    </div>
  );
};

export default SettingsManagement; 