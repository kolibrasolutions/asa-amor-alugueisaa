import { supabase } from '@/integrations/supabase/client';

interface NtfyConfig {
  topic: string;
  name: string;
}

interface NotificationSettings {
  ntfy_configs: NtfyConfig[];
  ntfy_server_url: string;
  whatsapp_phone?: string;
  whatsapp_api_key?: string;
}

/**
 * Busca as configurações de notificação do usuário atual no Supabase
 * Com fallback para localStorage para compatibilidade
 */
export const getNotificationSettings = async (): Promise<NotificationSettings> => {
  try {
    // Tentar buscar do Supabase primeiro
    const { data: { user } } = await supabase.auth.getUser();
    
    if (user) {
      const { data, error } = await supabase
        .from('notification_settings')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (!error && data) {
        console.log('✅ Configurações carregadas do Supabase:', data);
        return {
          ntfy_configs: data.ntfy_configs || [],
          ntfy_server_url: data.ntfy_server_url || 'https://ntfy.sh',
          whatsapp_phone: data.whatsapp_phone,
          whatsapp_api_key: data.whatsapp_api_key
        };
      }
    }

    // Fallback para localStorage se não encontrar no Supabase
    console.log('⚠️ Usando fallback para localStorage...');
    return getNotificationSettingsFromLocalStorage();
    
  } catch (error) {
    console.error('Erro ao buscar configurações do Supabase:', error);
    // Fallback para localStorage em caso de erro
    return getNotificationSettingsFromLocalStorage();
  }
};

/**
 * Busca configurações do localStorage (fallback)
 */
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