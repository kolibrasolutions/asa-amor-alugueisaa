import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// WhatsApp CallMeBot Integration
interface WhatsAppConfig {
  phoneNumber: string;
  apiKey: string;
}

// ntfy.sh Integration
interface NtfyConfig {
  topic: string;
  serverUrl?: string; // Opcional, padrão é ntfy.sh
}

interface RentalSummary {
  customerName: string;
  eventDate: string;
  startDate: string;
  endDate: string;
  itemsCount: number;
  status: string;
  products?: Array<{
    name: string;
    sku?: string;
    description?: string;
    quantity: number;
    brand?: string;
    color?: string;
    size?: string;
  }>;
}

// === NTFY.SH FUNCTIONS ===

export async function sendNtfyNotification(
  config: NtfyConfig,
  summary: RentalSummary
): Promise<boolean> {
  try {
    // Validar configurações
    if (!config.topic) {
      console.error('Ntfy config incomplete: topic is required');
      return false;
    }

    const serverUrl = config.serverUrl || 'https://ntfy.sh';
    const message = formatRentalMessageNtfy(summary);
    
    console.log('Sending ntfy notification:', {
      topic: config.topic,
      server: serverUrl,
      messageLength: message.length
    });
    
    // Fazer a requisição POST para ntfy.sh
    const response = await fetch(`${serverUrl}/${config.topic}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Title': 'Novo Aluguel Registrado',
        'Priority': 'default',
        'Tags': 'wedding,dress,rental,new_order'
      },
      body: message
    });
    
    if (response.ok) {
      console.log('Ntfy notification sent successfully');
      return true;
    } else {
      console.error('Ntfy notification failed:', response.status, response.statusText);
      return false;
    }
    
  } catch (error) {
    console.error('Error sending ntfy notification:', error);
    return false;
  }
}

export async function sendNtfyTest(config: NtfyConfig): Promise<boolean> {
  try {
    if (!config.topic) {
      console.error('Ntfy config incomplete: topic is required');
      return false;
    }

    const serverUrl = config.serverUrl || 'https://ntfy.sh';
    const testMessage = `Teste de notificacao do sistema ASA Amor Alugueis

Este e um teste para verificar se as notificacoes estao funcionando corretamente.

Se voce recebeu esta mensagem, a integracao esta funcionando!

Data/Hora: ${new Date().toLocaleString('en-US')}`;
    
    console.log('=== TESTE NTFY DEBUG ===');
    console.log('Topico:', config.topic);
    console.log('Servidor:', serverUrl);
    console.log('URL completa:', `${serverUrl}/${config.topic}`);
    console.log('========================');
    
    const response = await fetch(`${serverUrl}/${config.topic}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain',
        'Title': 'Teste ASA Amor Alugueis',
        'Priority': 'default',
        'Tags': 'test'
      },
      body: testMessage
    });
    
    if (response.ok) {
      console.log('Teste ntfy enviado com sucesso!');
      return true;
    } else {
      console.error('Falha no teste ntfy:', response.status, response.statusText);
      return false;
    }
    
  } catch (error) {
    console.error('Error testing ntfy:', error);
    return false;
  }
}

function formatRentalMessageNtfy(summary: RentalSummary): string {
  let productsText = '';
  
  if (summary.products && summary.products.length > 0) {
    productsText = summary.products.map(product => {
      // Linha 1: Nome + SKU, Cor, Tamanho na mesma linha
      const inlineDetails = [];
      if (product.sku) inlineDetails.push(`SKU: ${product.sku}`);
      if (product.color) inlineDetails.push(`Cor: ${product.color}`);
      if (product.size) inlineDetails.push(`Tamanho: ${product.size}`);
      if (product.brand) inlineDetails.push(`Marca: ${product.brand}`);
      
      const inlineText = inlineDetails.length > 0 ? ` (${inlineDetails.join(', ')})` : '';
      
      let result = `• ${product.name}${inlineText}`;
      
      // Linha 2: Descrição (se existir)
      if (product.description) {
        result += `\n  ${product.description}`;
      }
      
      // Linha 3: Quantidade
      result += `\n  Quantidade: ${product.quantity}`;
      
      return result;
    }).join('\n\n');
  } else {
    productsText = `${summary.itemsCount} produto(s)`;
  }

  return `🎉 NOVO ALUGUEL REGISTRADO

👤 Cliente: ${summary.customerName}
📅 Data do Evento: ${summary.eventDate}
📋 Período: ${summary.startDate} até ${summary.endDate}

👗 PRODUTOS ALUGADOS:
${productsText}

📊 Total de itens: ${summary.itemsCount}
📌 Status: ${getStatusEmoji(summary.status)} ${getStatusText(summary.status)}

Sistema ASA Amor Aluguéis`;
}

// === WHATSAPP FUNCTIONS ===

export async function sendWhatsAppNotification(
  config: WhatsAppConfig,
  summary: RentalSummary
): Promise<boolean> {
  try {
    // Validar configurações
    if (!config.phoneNumber || !config.apiKey) {
      console.error('WhatsApp config incomplete:', config);
      return false;
    }

    // Formatar a mensagem do resumo do aluguel
    const message = formatRentalMessage(summary);
    
    // Converter espaços para + (formato que funciona)
    const encodedMessage = message.replace(/ /g, '+');
    
    // Usar o formato exato que funciona
    const phoneNumber = config.phoneNumber;
    
    // Montar URL da API CallMeBot
    const url = `https://api.callmebot.com/whatsapp.php?phone=${phoneNumber}&text=${encodedMessage}&apikey=${config.apiKey}`;
    
    console.log('Sending WhatsApp notification:', {
      phone: phoneNumber,
      apiKey: config.apiKey,
      messageLength: message.length
    });
    
    // Fazer a requisição
    const response = await fetch(url, {
      method: 'GET',
      mode: 'no-cors' // Evitar problemas de CORS
    });
    
    // Como usamos no-cors, não conseguimos verificar o status
    // Vamos assumir sucesso se não houver erro
    console.log('WhatsApp notification sent successfully');
    return true;
    
  } catch (error) {
    console.error('Error sending WhatsApp notification:', error);
    return false;
  }
}

// Função para gerar URL de teste que pode ser aberta no navegador
export function generateTestUrl(config: WhatsAppConfig): string {
  // Usar exatamente o formato que funciona: espaços como +
  const message = 'This+is+a+test';
  
  // Usar o formato exato que funciona
  const phoneNumber = config.phoneNumber;
  
  return `https://api.callmebot.com/whatsapp.php?phone=${phoneNumber}&text=${message}&apikey=${config.apiKey}`;
}

// Função para detectar se estamos em desenvolvimento
function isDevelopment(): boolean {
  return window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
}

// Função para contornar CORS em desenvolvimento
async function sendWhatsAppDev(config: WhatsAppConfig): Promise<boolean> {
  try {
    console.log('🔧 Modo desenvolvimento: Usando JSONP workaround');
    
    const message = 'This+is+a+test';
    const url = `https://api.callmebot.com/whatsapp.php?phone=${config.phoneNumber}&text=${message}&apikey=${config.apiKey}`;
    
    // Criar iframe invisível para fazer a requisição
    const iframe = document.createElement('iframe');
    iframe.style.display = 'none';
    iframe.src = url;
    
    document.body.appendChild(iframe);
    
    // Aguardar um pouco e remover iframe
    setTimeout(() => {
      document.body.removeChild(iframe);
    }, 3000);
    
    console.log('📱 Requisição enviada via iframe. Verifique seu WhatsApp em alguns segundos.');
    return true;
    
  } catch (error) {
    console.error('Erro no modo desenvolvimento:', error);
    return false;
  }
}

// Função para teste com detecção de ambiente
export async function sendWhatsAppTest(config: WhatsAppConfig): Promise<boolean> {
  try {
    // Validar configurações
    if (!config.phoneNumber || !config.apiKey) {
      console.error('WhatsApp config incomplete:', config);
      return false;
    }

    console.log('=== TESTE WHATSAPP DEBUG ===');
    console.log('Número:', config.phoneNumber);
    console.log('API Key:', config.apiKey);
    console.log('Ambiente:', isDevelopment() ? 'Desenvolvimento' : 'Produção');
    console.log('=============================');

    // Se estamos em desenvolvimento (localhost), usar workaround
    if (isDevelopment()) {
      console.log('🚨 CORS bloqueado em localhost - usando workaround');
      return await sendWhatsAppDev(config);
    }

    // Código original para produção
    const message = 'This+is+a+test';
    const phoneNumber = config.phoneNumber;
    const url = `https://api.callmebot.com/whatsapp.php?phone=${phoneNumber}&text=${message}&apikey=${config.apiKey}`;
    
    console.log('URL completa:', url);
    
    // Implementar retry logic baseado na documentação
    const maxRetries = 3;
    let lastError = null;
    
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      console.log(`Tentativa ${attempt}/${maxRetries}`);
      
      try {
        // Método 1: Simular requisição do WhatsApp com User-Agent específico
        const response = await fetch(url, {
          method: 'GET',
          mode: 'cors',
          headers: {
            'User-Agent': 'WhatsApp/2.23.20.0',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
            'Accept-Language': 'pt-BR,pt;q=0.9,en;q=0.8',
            'Cache-Control': 'no-cache',
          }
        });
        
        const text = await response.text();
        console.log(`Resposta tentativa ${attempt}:`, text);
        
        if (text.includes('Message queued') || text.includes('Message sent')) {
          console.log('✅ Sucesso!');
          return true;
        } else if (text.includes('APIKey is invalid')) {
          console.log(`❌ API Key inválida na tentativa ${attempt}`);
          lastError = 'API Key inválida';
          
          // Aguardar antes da próxima tentativa (rate limiting)
          if (attempt < maxRetries) {
            console.log('Aguardando 30 segundos antes da próxima tentativa...');
            await new Promise(resolve => setTimeout(resolve, 30000));
          }
        } else {
          console.log(`⚠️ Resposta inesperada na tentativa ${attempt}:`, text);
          lastError = text;
        }
        
      } catch (corsError) {
        console.log(`CORS error na tentativa ${attempt}, tentando no-cors...`);
        
        // Método 2: fetch no-cors como fallback
        try {
          await fetch(url, {
            method: 'GET',
            mode: 'no-cors'
          });
          
          console.log(`Requisição no-cors enviada (tentativa ${attempt})`);
          return true;
        } catch (noCorsError) {
          console.log(`Erro no-cors na tentativa ${attempt}:`, noCorsError);
          lastError = noCorsError;
        }
      }
    }
    
    console.log('❌ Todas as tentativas falharam');
    console.log('Último erro:', lastError);
    return false;
    
  } catch (error) {
    console.error('Error testing WhatsApp:', error);
    return false;
  }
}

// Função para aguardar antes de retry (baseado na documentação de rate limiting)
export async function waitForRateLimit(): Promise<void> {
  console.log('Aguardando 60 segundos para evitar rate limiting...');
  await new Promise(resolve => setTimeout(resolve, 60000));
}

function formatRentalMessage(summary: RentalSummary): string {
  let productsText = '';
  
  if (summary.products && summary.products.length > 0) {
    productsText = '\n\n👗 PRODUTOS ALUGADOS:\n' + summary.products.map(product => {
      // Linha 1: Nome + SKU, Cor, Tamanho na mesma linha
      const inlineDetails = [];
      if (product.sku) inlineDetails.push(`SKU: ${product.sku}`);
      if (product.color) inlineDetails.push(`Cor: ${product.color}`);
      if (product.size) inlineDetails.push(`Tamanho: ${product.size}`);
      if (product.brand) inlineDetails.push(`Marca: ${product.brand}`);
      
      const inlineText = inlineDetails.length > 0 ? ` (${inlineDetails.join(', ')})` : '';
      
      let result = `• ${product.name}${inlineText}`;
      
      // Linha 2: Descrição (se existir)
      if (product.description) {
        result += `\n  ${product.description}`;
      }
      
      // Linha 3: Quantidade
      result += `\n  Quantidade: ${product.quantity}`;
      
      return result;
    }).join('\n\n');
  }

  return `🎉 NOVO ALUGUEL REGISTRADO

👤 Cliente: ${summary.customerName}
📅 Data do Evento: ${summary.eventDate}
📋 Período: ${summary.startDate} até ${summary.endDate}${productsText}

📊 Total de itens: ${summary.itemsCount}
📌 Status: ${getStatusEmoji(summary.status)} ${getStatusText(summary.status)}

Sistema ASA Amor Aluguéis`;
}

function getStatusEmoji(status: string): string {
  const statusEmojis: Record<string, string> = {
    'pending': '⏳',
    'confirmed': '✅',
    'in_progress': '🔄',
    'completed': '🎊',
    'cancelled': '❌'
  };
  return statusEmojis[status] || '📋';
}

function getStatusText(status: string): string {
  const statusTexts: Record<string, string> = {
    'pending': 'Pendente',
    'confirmed': 'Confirmado',
    'in_progress': 'Em Andamento',
    'completed': 'Finalizado',
    'cancelled': 'Cancelado'
  };
  return statusTexts[status] || status;
}
