# PWA do Sistema Administrativo - Noivas Cirlene

## 📱 Progressive Web App (PWA)

O sistema administrativo agora funciona como um PWA, permitindo instalação no dispositivo e funcionamento offline.

### ✨ Funcionalidades PWA

- **Instalação no dispositivo**: Pode ser instalado como um app nativo
- **Funcionamento offline**: Cache inteligente para uso sem internet
- **Atualizações automáticas**: Notificações de novas versões
- **Ícones personalizados**: Interface dedicada para administração
- **Atalhos rápidos**: Acesso direto às principais funcionalidades

### 🚀 Como Instalar

#### No Desktop (Chrome/Edge)
1. Acesse `/admin` no navegador
2. Clique no ícone de instalação na barra de endereços
3. Ou use o prompt que aparece automaticamente
4. Confirme a instalação

#### No Mobile (Android/iOS)
1. Acesse `/admin` no navegador
2. No Chrome: Menu → "Adicionar à tela inicial"
3. No Safari: Compartilhar → "Adicionar à Tela de Início"
4. Confirme a instalação

### 🎯 Atalhos Disponíveis

O PWA inclui atalhos para acesso rápido:
- **Aluguéis**: `/admin/rentals`
- **Calendário**: `/admin/calendar`
- **Clientes**: `/admin/customers`

### 🔧 Configurações Técnicas

#### Manifest
- **Nome**: Noivas Cirlene - Sistema Administrativo
- **Nome Curto**: Admin Noivas
- **Escopo**: `/admin`
- **URL Inicial**: `/admin`
- **Tema**: #8B5A3C (marrom característico)
- **Fundo**: #FAF7F4 (bege claro)

#### Cache Strategy
- **Supabase**: NetworkFirst (24h cache)
- **Assets**: Cache com fallback
- **Atualizações**: Automáticas com notificação

#### Ícones
- **192x192**: `admin-icon-192.svg`
- **512x512**: `admin-icon-512.svg`
- **Formato**: SVG (escalável e leve)

### 📋 Funcionalidades Offline

#### Disponível Offline
- Interface do sistema
- Dados em cache do Supabase
- Navegação entre páginas
- Formulários (salvos ao reconectar)

#### Requer Conexão
- Sincronização de dados
- Upload de imagens
- Notificações push
- Backup em tempo real

### 🔄 Atualizações

O sistema detecta automaticamente novas versões e exibe:
- Notificação de atualização disponível
- Botão para aplicar atualização
- Reinicialização automática após atualização

### 🛠️ Desenvolvimento

#### Dependências PWA
```bash
npm install vite-plugin-pwa workbox-window
```

#### Configuração (vite.config.ts)
- Plugin VitePWA configurado
- Workbox para cache strategy
- Manifest com configurações específicas

#### Componentes
- `PWAInstallPrompt.tsx`: Gerencia instalação e atualizações
- Integrado apenas na área administrativa

### 🎨 Design

O PWA mantém a identidade visual:
- Cores do tema Noivas Cirlene
- Ícones personalizados com elementos administrativos
- Interface responsiva para mobile e desktop

### 📱 Compatibilidade

#### Suportado
- Chrome/Chromium (Desktop/Mobile)
- Edge (Desktop/Mobile)
- Safari (iOS 11.3+)
- Firefox (limitado)

#### Funcionalidades por Plataforma
- **Android**: Instalação completa, atalhos, notificações
- **iOS**: Instalação via Safari, funcionalidades básicas
- **Desktop**: Instalação como app, integração com SO

### 🔍 Monitoramento

O PWA inclui logs para:
- Registro do Service Worker
- Erros de instalação
- Status de cache
- Atualizações aplicadas

### 📞 Suporte

Para problemas com o PWA:
1. Verifique a conexão com internet
2. Limpe o cache do navegador
3. Reinstale o PWA se necessário
4. Consulte os logs do console do navegador

---

**Nota**: O PWA é específico para o sistema administrativo (`/admin`) e não afeta o catálogo público do site.