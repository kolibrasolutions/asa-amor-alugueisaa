import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import ColorsManagement from './ColorsManagement';
import SizesManagement from './SizesManagement';
import { BannersManagement } from './BannersManagement';
import { CategoriesManagement } from './CategoriesManagement';
import { AdminBackButton } from './AdminHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/components/ui/use-toast';
import { MessageCircle, Phone, Key, Save, TestTube, Globe, Bell, Smartphone } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { sendWhatsAppTest, sendWhatsAppNotification, generateTestUrl, waitForRateLimit, sendNtfyTest } from '@/lib/utils';

export const SettingsManagement = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('banners');
  
  // WhatsApp State
  const [whatsappPhone, setWhatsappPhone] = useState('');
  const [whatsappApiKey, setWhatsappApiKey] = useState('');
  const [isTesting, setIsTesting] = useState(false);
  const [isWaitingRateLimit, setIsWaitingRateLimit] = useState(false);
  const [showDebugInfo, setShowDebugInfo] = useState(false);

  // Ntfy State
  const [ntfyTopic, setNtfyTopic] = useState('');
  const [ntfyServerUrl, setNtfyServerUrl] = useState('https://ntfy.sh');
  const [isTestingNtfy, setIsTestingNtfy] = useState(false);

  // Carregar configurações do localStorage na inicialização
  useEffect(() => {
    // WhatsApp
    const savedPhone = localStorage.getItem('whatsapp_phone');
    const savedApiKey = localStorage.getItem('whatsapp_api_key');
    
    if (savedPhone) setWhatsappPhone(savedPhone);
    if (savedApiKey) setWhatsappApiKey(savedApiKey);

    // Ntfy
    const savedNtfyTopic = localStorage.getItem('ntfy_topic');
    const savedNtfyServer = localStorage.getItem('ntfy_server_url');
    
    if (savedNtfyTopic) setNtfyTopic(savedNtfyTopic);
    if (savedNtfyServer) setNtfyServerUrl(savedNtfyServer);
  }, []);

  const handleSaveWhatsAppConfig = () => {
    if (!whatsappPhone || !whatsappApiKey) {
      toast({
        title: "Erro",
        description: "Preencha o telefone e a API key",
        variant: "destructive",
      });
      return;
    }

    // Salvar no localStorage
    localStorage.setItem('whatsapp_phone', whatsappPhone);
    localStorage.setItem('whatsapp_api_key', whatsappApiKey);

    toast({
      title: "✅ Configurações salvas",
      description: "Configurações do WhatsApp foram salvas com sucesso!",
    });
  };

  const handleSaveNtfyConfig = () => {
    if (!ntfyTopic) {
      toast({
        title: "Erro",
        description: "Preencha o tópico do ntfy",
        variant: "destructive",
      });
      return;
    }

    // Salvar no localStorage
    localStorage.setItem('ntfy_topic', ntfyTopic);
    localStorage.setItem('ntfy_server_url', ntfyServerUrl);

    toast({
      title: "✅ Configurações salvas",
      description: "Configurações do ntfy foram salvas com sucesso!",
    });
  };

  const handleTestNtfy = async () => {
    if (!ntfyTopic) {
      toast({
        title: "Erro",
        description: "Configure primeiro o tópico do ntfy",
        variant: "destructive",
      });
      return;
    }

    setIsTestingNtfy(true);

    try {
      console.log('Testando ntfy com:', {
        topic: ntfyTopic,
        server: ntfyServerUrl
      });

      const success = await sendNtfyTest({
        topic: ntfyTopic,
        serverUrl: ntfyServerUrl
      });

      if (success) {
        toast({
          title: "🎉 Teste enviado!",
          description: "Mensagem de teste enviada via ntfy! Verifique seu app em alguns segundos.",
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
      setIsTestingNtfy(false);
    }
  };

  const handleTestWhatsApp = async () => {
    if (!whatsappPhone || !whatsappApiKey) {
      toast({
        title: "Erro",
        description: "Configure primeiro o telefone e a API key",
        variant: "destructive",
      });
      return;
    }

    setIsTesting(true);

    try {
      console.log('Testando WhatsApp com:', {
        phone: whatsappPhone,
        apiKey: whatsappApiKey
      });

      const success = await sendWhatsAppTest(
        {
          phoneNumber: whatsappPhone,
          apiKey: whatsappApiKey
        }
      );

      if (success) {
        toast({
          title: "🎉 Teste enviado!",
          description: "Mensagem de teste enviada para o WhatsApp! Aguarde alguns segundos. Se não receber, verifique o console.",
        });
      } else {
        toast({
          title: "❌ Erro no teste",
          description: "Não foi possível enviar a mensagem. Verifique se o número está correto e se a API key é válida.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Erro no teste WhatsApp:', error);
      toast({
        title: "❌ Erro no teste",
        description: "Erro ao enviar mensagem de teste. Verifique o console para mais detalhes.",
        variant: "destructive",
      });
    } finally {
      setIsTesting(false);
    }
  };

  const handleTestDirectUrl = () => {
    if (!whatsappPhone || !whatsappApiKey) {
      toast({
        title: "Erro",
        description: "Configure primeiro o telefone e a API key",
        variant: "destructive",
      });
      return;
    }

    // URL exata como mostrado na documentação
    const exactUrl = `https://api.callmebot.com/whatsapp.php?phone=${whatsappPhone}&text=This%20is%20a%20test&apikey=${whatsappApiKey}`;

    // Abrir URL em nova aba
    window.open(exactUrl, '_blank');
    
    toast({
      title: "🔍 Teste Direto",
      description: "URL exata da documentação aberta. Deve aparecer 'Message queued' se a API key estiver correta.",
    });
  };

  const handleWaitRateLimit = async () => {
    setIsWaitingRateLimit(true);
    
    toast({
      title: "⏳ Aguardando Rate Limit",
      description: "Aguardando 60 segundos para evitar bloqueio da API. Isso pode resolver o erro 'APIKey is invalid'.",
    });

    try {
      await waitForRateLimit();
      
      toast({
        title: "✅ Pronto!",
        description: "Agora você pode tentar novamente os testes.",
      });
    } catch (error) {
      toast({
        title: "❌ Erro",
        description: "Erro durante a espera.",
        variant: "destructive",
      });
    } finally {
      setIsWaitingRateLimit(false);
    }
  };

  const handleTestInBrowser = () => {
    if (!whatsappPhone || !whatsappApiKey) {
      toast({
        title: "Erro",
        description: "Configure primeiro o telefone e a API key",
        variant: "destructive",
      });
      return;
    }

    const testUrl = generateTestUrl({
      phoneNumber: whatsappPhone,
      apiKey: whatsappApiKey
    });

    // Abrir URL em nova aba
    window.open(testUrl, '_blank');
    
    toast({
      title: "🌐 URL de teste aberta",
      description: "A URL de teste foi aberta em uma nova aba. Se aparecer 'Message queued', a mensagem foi enviada. Se aparecer erro, verifique os dados.",
    });
  };

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
            <TabsTrigger value="colors" className="data-[state=active]:border-b-2">
              Cores
            </TabsTrigger>
            <TabsTrigger value="sizes" className="data-[state=active]:border-b-2">
              Tamanhos
            </TabsTrigger>
            <TabsTrigger value="categories" className="data-[state=active]:border-b-2">
              Categorias
            </TabsTrigger>
          </TabsList>

          <div className="p-6">
            <TabsContent value="banners" className="m-0">
              <BannersManagement />
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
          </div>
        </Tabs>
      </Card>

      {/* Configurações ntfy.sh */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="w-5 h-5" />
            Notificações Push (ntfy.sh) - Recomendado ⭐
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <Alert>
            <Smartphone className="h-4 w-4" />
            <AlertDescription>
              <strong>ntfy.sh - Notificações Push Gratuitas:</strong>
              <br />1. <strong>Instale o app ntfy:</strong> <a href="https://play.google.com/store/apps/details?id=io.heckel.ntfy" target="_blank" className="text-blue-600 underline">Android</a> | <a href="https://apps.apple.com/app/ntfy/id1625396347" target="_blank" className="text-blue-600 underline">iOS</a>
              <br />2. <strong>Abra o app</strong> e clique em "Subscribe to topic"
              <br />3. <strong>Digite seu tópico único</strong> (ex: asa-amor-secreto-2024)
              <br />4. <strong>Configure o tópico abaixo</strong> e teste a integração
              <br /><br />
              <strong>✅ Vantagens:</strong> 100% gratuito, sem limites, funciona offline, muito confiável
            </AlertDescription>
          </Alert>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="ntfy-topic" className="flex items-center gap-2">
                <Bell className="w-4 h-4" />
                Tópico do ntfy
              </Label>
              <Input
                id="ntfy-topic"
                placeholder="asa-amor-secreto-2024"
                value={ntfyTopic}
                onChange={(e) => setNtfyTopic(e.target.value)}
              />
              <p className="text-sm text-gray-500">
                Escolha um nome único e difícil de adivinhar
              </p>
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
          </div>

          <Separator />

          <div className="flex flex-wrap gap-3">
            <Button onClick={handleSaveNtfyConfig} className="flex items-center gap-2">
              <Save className="w-4 h-4" />
              Salvar Configurações ntfy
            </Button>
            
            <Button 
              variant="outline" 
              onClick={handleTestNtfy}
              disabled={isTestingNtfy}
              className="flex items-center gap-2"
            >
              <TestTube className="w-4 h-4" />
              {isTestingNtfy ? 'Enviando...' : 'Testar ntfy'}
            </Button>
          </div>

          {ntfyTopic && (
            <Alert>
              <Bell className="h-4 w-4" />
              <AlertDescription>
                <strong>URL de teste (para debug):</strong>
                <br />
                <code style={{ fontSize: '12px', wordBreak: 'break-all' }}>
                  {ntfyServerUrl}/{ntfyTopic}
                </code>
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Configurações WhatsApp */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageCircle className="w-5 h-5" />
            Notificações WhatsApp (Alternativa)
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <Alert>
            <MessageCircle className="h-4 w-4" />
            <AlertDescription>
              <strong>Como configurar:</strong>
              <br />1. Adicione o número <strong>+34 644 87 21 57</strong> nos seus contatos do WhatsApp
              <br />2. Envie a mensagem: <strong>"I allow callmebot to send me messages"</strong>
              <br />3. Aguarde receber sua API key única (pode demorar até 2 minutos)
              <br />4. Configure abaixo e teste a integração
              <br /><br />
              <strong>⚠️ Problema "APIKey is invalid":</strong>
              <br />• <strong>Rate Limiting:</strong> Aguarde 30-60 segundos entre tentativas
              <br />• <strong>Delay do Sistema:</strong> Mensagens podem demorar até 1 minuto
              <br />• <strong>Navegador vs Mobile:</strong> API funciona diferente no celular vs navegador
              <br />• <strong>Solução:</strong> Use "Testar Diretamente" ou aguarde alguns minutos
            </AlertDescription>
          </Alert>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="whatsapp-phone" className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                Seu número do WhatsApp
              </Label>
              <Input
                id="whatsapp-phone"
                placeholder="+5535999163862"
                value={whatsappPhone}
                onChange={(e) => setWhatsappPhone(e.target.value)}
              />
              <p className="text-sm text-gray-500">
                Use o número exato que recebeu a API key (com +55)
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="whatsapp-api" className="flex items-center gap-2">
                <Key className="w-4 h-4" />
                API Key do CallMeBot
              </Label>
              <Input
                id="whatsapp-api"
                placeholder="123456"
                value={whatsappApiKey}
                onChange={(e) => setWhatsappApiKey(e.target.value)}
              />
              <p className="text-sm text-gray-500">
                Chave recebida do bot do WhatsApp
              </p>
            </div>
          </div>

          <Separator />

          <div className="space-y-4">
            <div className="flex flex-wrap gap-3">
              <Button onClick={handleSaveWhatsAppConfig} className="flex items-center gap-2">
                <Save className="w-4 h-4" />
                Salvar Configurações
              </Button>
              
              <Button 
                variant="ghost" 
                onClick={() => setShowDebugInfo(!showDebugInfo)}
                className="flex items-center gap-2"
              >
                <Key className="w-4 h-4" />
                {showDebugInfo ? 'Ocultar' : 'Mostrar'} Debug
              </Button>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-medium mb-2">🧪 Testes de Validação (em ordem):</h4>
              <div className="flex flex-wrap gap-2 mb-3">
                <Button 
                  variant="outline" 
                  onClick={handleTestDirectUrl}
                  className="flex items-center gap-2 text-sm"
                  size="sm"
                >
                  <Globe className="w-3 h-3" />
                  1. Testar Diretamente
                </Button>

                <Button 
                  variant="outline" 
                  onClick={handleTestInBrowser}
                  className="flex items-center gap-2 text-sm"
                  size="sm"
                >
                  <Globe className="w-3 h-3" />
                  2. Testar Sistema
                </Button>

                <Button 
                  variant="outline" 
                  onClick={handleTestWhatsApp}
                  disabled={isTesting}
                  className="flex items-center gap-2 text-sm"
                  size="sm"
                >
                  <TestTube className="w-3 h-3" />
                  3. {isTesting ? 'Enviando...' : 'Teste Final'}
                </Button>
              </div>
              
              <div className="border-t pt-3">
                <p className="text-sm text-gray-600 mb-2">💡 <strong>Se receber "APIKey is invalid":</strong></p>
                <Button 
                  variant="secondary" 
                  onClick={handleWaitRateLimit}
                  disabled={isWaitingRateLimit}
                  className="flex items-center gap-2 text-sm"
                  size="sm"
                >
                  <Key className="w-3 h-3" />
                  {isWaitingRateLimit ? 'Aguardando 60s...' : 'Aguardar Rate Limit'}
                </Button>
              </div>
            </div>
          </div>

          {showDebugInfo && whatsappPhone && whatsappApiKey && (
            <Alert>
              <Key className="h-4 w-4" />
              <AlertDescription>
                <strong>Informações de Debug:</strong>
                <br />
                <strong>Número configurado:</strong> {whatsappPhone}
                <br />
                <strong>API Key:</strong> {whatsappApiKey}
                <br />
                <strong>URL gerada:</strong> 
                <br />
                <code style={{ fontSize: '12px', wordBreak: 'break-all' }}>
                  {generateTestUrl({ phoneNumber: whatsappPhone, apiKey: whatsappApiKey })}
                </code>
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Outras configurações podem ser adicionadas aqui */}
      <Card>
        <CardHeader>
          <CardTitle>Outras Configurações</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500">
            Outras configurações do sistema podem ser adicionadas aqui futuramente.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}; 