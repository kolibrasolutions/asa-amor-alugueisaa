import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { sendNtfyTest } from '@/lib/utils';

interface NtfyConfig {
  topic: string;
  name: string;
}

interface NotificationSettings {
  id?: string;
  ntfy_configs: NtfyConfig[];
  ntfy_server_url: string;
  whatsapp_phone?: string;
  whatsapp_api_key?: string;
}

// Função para buscar configurações do localStorage (fallback)
const getNotificationSettingsFromLocalStorage = (): NotificationSettings => {
  const ntfyConfigsString = localStorage.getItem('ntfy_configs');
  const ntfyServerUrl = localStorage.getItem('ntfy_server_url') || 'https://ntfy.sh';
  const whatsappPhone = localStorage.getItem('whatsapp_phone');
  const whatsappApiKey = localStorage.getItem('whatsapp_api_key');
  
  let ntfyConfigs: NtfyConfig[] = [];
  
  // Tentar carregar novo formato de configuração
  if (ntfyConfigsString) {
    try {
      ntfyConfigs = JSON.parse(ntfyConfigsString);
    } catch (error) {
      console.error('Erro ao parsear configurações ntfy do localStorage:', error);
    }
  }
  
  // Compatibilidade com formato antigo
  if (ntfyConfigs.length === 0) {
    const legacyNtfyTopic = localStorage.getItem('ntfy_topic');
    if (legacyNtfyTopic) {
      ntfyConfigs = [{ topic: legacyNtfyTopic, name: 'Funcionário' }];
    }
  }
  
  return {
    ntfy_configs: ntfyConfigs,
    ntfy_server_url: ntfyServerUrl,
    whatsapp_phone: whatsappPhone || undefined,
    whatsapp_api_key: whatsappApiKey || undefined
  };
};

export const useNotificationSettings = () => {
  const { toast } = useToast();
  const [settings, setSettings] = useState<NotificationSettings>({
    ntfy_configs: [{ topic: '', name: '' }],
    ntfy_server_url: 'https://ntfy.sh'
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isTestingNtfy, setIsTestingNtfy] = useState<{[key: string]: boolean}>({});
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Carregar configurações do Supabase
  const loadSettings = useCallback(async () => {
    try {
      setLoading(true);
      
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        console.log('Usuário não autenticado, carregando do localStorage...');
        setIsAuthenticated(false);
        // Carregar do localStorage se não estiver autenticado
        const localSettings = getNotificationSettingsFromLocalStorage();
        setSettings({
          ntfy_configs: localSettings.ntfy_configs.length > 0 ? localSettings.ntfy_configs : [{ topic: '', name: '' }],
          ntfy_server_url: localSettings.ntfy_server_url,
          whatsapp_phone: localSettings.whatsapp_phone,
          whatsapp_api_key: localSettings.whatsapp_api_key
        });
        setLoading(false);
        return;
      }

      setIsAuthenticated(true);

      const { data, error } = await supabase
        .from('notification_settings')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
        console.error('Erro ao carregar configurações:', error);
        toast({
          title: "Erro",
          description: "Não foi possível carregar as configurações de notificação",
          variant: "destructive",
        });
        return;
      }

      if (data) {
        setSettings({
          id: data.id,
          ntfy_configs: data.ntfy_configs || [{ topic: '', name: '' }],
          ntfy_server_url: data.ntfy_server_url || 'https://ntfy.sh',
          whatsapp_phone: data.whatsapp_phone,
          whatsapp_api_key: data.whatsapp_api_key
        });
      } else {
        // Tentar migrar do localStorage se não houver dados no Supabase
        await migrateFromLocalStorage();
      }
    } catch (error) {
      console.error('Erro ao carregar configurações:', error);
      toast({
        title: "Erro",
        description: "Erro inesperado ao carregar configurações",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  // Migrar dados do localStorage para o Supabase
  const migrateFromLocalStorage = useCallback(async () => {
    try {
      const savedNtfyConfigs = localStorage.getItem('ntfy_configs');
      const savedNtfyServer = localStorage.getItem('ntfy_server_url');
      const savedWhatsappPhone = localStorage.getItem('whatsapp_phone');
      const savedWhatsappApiKey = localStorage.getItem('whatsapp_api_key');

      if (savedNtfyConfigs || savedNtfyServer || savedWhatsappPhone || savedWhatsappApiKey) {
        console.log('Migrando dados do localStorage para Supabase...');
        
        let ntfyConfigs = [{ topic: '', name: '' }];
        if (savedNtfyConfigs) {
          try {
            ntfyConfigs = JSON.parse(savedNtfyConfigs);
          } catch (e) {
            console.error('Erro ao parsear ntfy_configs do localStorage:', e);
          }
        }

        const migrationData = {
          ntfy_configs: ntfyConfigs,
          ntfy_server_url: savedNtfyServer || 'https://ntfy.sh',
          whatsapp_phone: savedWhatsappPhone,
          whatsapp_api_key: savedWhatsappApiKey
        };

        await saveSettings(migrationData);
        
        // Limpar localStorage após migração bem-sucedida
        localStorage.removeItem('ntfy_configs');
        localStorage.removeItem('ntfy_server_url');
        localStorage.removeItem('whatsapp_phone');
        localStorage.removeItem('whatsapp_api_key');
        
        toast({
          title: "✅ Migração concluída",
          description: "Suas configurações foram migradas para a nuvem e agora sincronizam entre dispositivos!",
        });
      }
    } catch (error) {
      console.error('Erro na migração do localStorage:', error);
    }
  }, [toast]);

  // Salvar configurações no Supabase ou localStorage
  const saveSettings = useCallback(async (newSettings: Partial<NotificationSettings>) => {
    try {
      setSaving(true);
      
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        // Salvar no localStorage se não estiver autenticado
        console.log('Usuário não autenticado, salvando no localStorage...');
        const updatedSettings = { ...settings, ...newSettings };
        
        // Salvar no localStorage
        localStorage.setItem('ntfy_configs', JSON.stringify(updatedSettings.ntfy_configs));
        localStorage.setItem('ntfy_server_url', updatedSettings.ntfy_server_url);
        if (updatedSettings.whatsapp_phone) {
          localStorage.setItem('whatsapp_phone', updatedSettings.whatsapp_phone);
        }
        if (updatedSettings.whatsapp_api_key) {
          localStorage.setItem('whatsapp_api_key', updatedSettings.whatsapp_api_key);
        }
        
        setSettings(updatedSettings);
        
        toast({
          title: "✅ Configurações salvas",
          description: "Configurações salvas localmente. Faça login para sincronizar entre dispositivos.",
        });
        
        return true;
      }

      const updatedSettings = { ...settings, ...newSettings };
      
      const saveData = {
        user_id: user.id,
        ntfy_configs: updatedSettings.ntfy_configs,
        ntfy_server_url: updatedSettings.ntfy_server_url,
        whatsapp_phone: updatedSettings.whatsapp_phone,
        whatsapp_api_key: updatedSettings.whatsapp_api_key
      };

      let result;
      if (settings.id) {
        // Atualizar registro existente
        result = await supabase
          .from('notification_settings')
          .update(saveData)
          .eq('id', settings.id)
          .select()
          .single();
      } else {
        // Criar novo registro
        result = await supabase
          .from('notification_settings')
          .insert(saveData)
          .select()
          .single();
      }

      if (result.error) {
        console.error('Erro ao salvar configurações:', result.error);
        toast({
          title: "Erro",
          description: "Não foi possível salvar as configurações",
          variant: "destructive",
        });
        return false;
      }

      setSettings({
        id: result.data.id,
        ntfy_configs: result.data.ntfy_configs,
        ntfy_server_url: result.data.ntfy_server_url,
        whatsapp_phone: result.data.whatsapp_phone,
        whatsapp_api_key: result.data.whatsapp_api_key
      });

      toast({
        title: "✅ Configurações salvas",
        description: "Suas configurações foram salvas e sincronizadas na nuvem!",
      });
      
      return true;
    } catch (error) {
      console.error('Erro ao salvar configurações:', error);
      toast({
        title: "Erro",
        description: "Erro inesperado ao salvar configurações",
        variant: "destructive",
      });
      return false;
    } finally {
      setSaving(false);
    }
  }, [settings, toast]);

  // Funções para gerenciar configurações ntfy
  const updateNtfyConfig = useCallback((index: number, field: keyof NtfyConfig, value: string) => {
    const newConfigs = settings.ntfy_configs.map((config, i) =>
      i === index ? { ...config, [field]: value } : config
    );
    setSettings(prev => ({ ...prev, ntfy_configs: newConfigs }));
  }, [settings.ntfy_configs]);

  const addNtfyConfig = useCallback(() => {
    setSettings(prev => ({
      ...prev,
      ntfy_configs: [...prev.ntfy_configs, { topic: '', name: '' }]
    }));
  }, []);

  const removeNtfyConfig = useCallback((index: number) => {
    setSettings(prev => ({
      ...prev,
      ntfy_configs: prev.ntfy_configs.filter((_, i) => i !== index)
    }));
  }, []);

  const setNtfyServerUrl = useCallback((url: string) => {
    setSettings(prev => ({ ...prev, ntfy_server_url: url }));
  }, []);

  const handleSaveNtfyConfig = useCallback(async () => {
    const hasEmptyFields = settings.ntfy_configs.some(config => !config.topic || !config.name);
    if (hasEmptyFields) {
      toast({
        title: "Erro",
        description: "Preencha o nome e tópico para todos os funcionários",
        variant: "destructive",
      });
      return;
    }

    await saveSettings(settings);
  }, [settings, saveSettings, toast]);

  const handleExportConfig = useCallback(() => {
    const configData = {
      ntfy_configs: settings.ntfy_configs,
      ntfy_server_url: settings.ntfy_server_url,
      exported_at: new Date().toISOString(),
      exported_from: navigator.userAgent,
      url: window.location.href
    };
    
    const configText = JSON.stringify(configData, null, 2);
    
    navigator.clipboard.writeText(configText).then(() => {
      toast({
        title: "📋 Configurações copiadas!",
        description: "Cole no outro dispositivo e clique em Importar",
      });
    }).catch(() => {
      alert('Copie estas configurações:\n\n' + configText);
    });
  }, [settings, toast]);

  const handleImportConfig = useCallback(() => {
    const configText = prompt('Cole aqui as configurações exportadas do outro dispositivo:');
    if (!configText) return;

    try {
      const configData = JSON.parse(configText);
      
      const newSettings = { ...settings };
      if (configData.ntfy_configs) {
        newSettings.ntfy_configs = configData.ntfy_configs;
      }
      if (configData.ntfy_server_url) {
        newSettings.ntfy_server_url = configData.ntfy_server_url;
      }

      setSettings(newSettings);
      toast({
        title: "✅ Configurações importadas!",
        description: "Clique em 'Salvar Configurações' para aplicar",
      });
      
    } catch (error) {
      toast({
        title: "❌ Erro na importação",
        description: "Formato inválido. Verifique os dados copiados.",
        variant: "destructive",
      });
    }
  }, [settings, toast]);

  const handleTestNtfy = useCallback(async (index: number) => {
    const config = settings.ntfy_configs[index];
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
      const success = await sendNtfyTest({
        topic: config.topic,
        serverUrl: settings.ntfy_server_url
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
      toast({
        title: "❌ Erro no teste",
        description: "Erro ao enviar mensagem de teste.",
        variant: "destructive",
      });
    } finally {
      setIsTestingNtfy(prev => ({ ...prev, [index]: false }));
    }
  }, [settings, toast]);

  // Carregar configurações na inicialização
  useEffect(() => {
    loadSettings();
  }, [loadSettings]);

  return {
    // Estados
    ntfyConfigs: settings.ntfy_configs,
    ntfyServerUrl: settings.ntfy_server_url,
    loading,
    saving,
    isTestingNtfy,
    
    // Funções
    updateNtfyConfig,
    addNtfyConfig,
    removeNtfyConfig,
    setNtfyServerUrl,
    handleSaveNtfyConfig,
    handleExportConfig,
    handleImportConfig,
    handleTestNtfy,
    saveSettings,
    loadSettings,
    setSettings
  };
};