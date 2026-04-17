import type { Course } from '../trainingCourses';
import type { ContentBlock } from '../trainingBlockTypes';

export const whatsappAvancadoCourse: Course = {
  slug: 'whatsapp-avancado',
  titleKey: 'courses.whatsappAvancado.title',
  descriptionKey: 'courses.whatsappAvancado.description',
  durationKey: 'courses.whatsappAvancado.duration',
  available: true,
  track: 'avancado',
  audience: 'todos',
  difficulty: 'avancado',
  prerequisites: ['primeiros-passos'],
  colorScheme: 'green',
  totalXP: 200,
  modules: [
    {
      slug: 'dispositivos',
      titleKey: 'courses.whatsappAvancado.modules.dispositivos.title',
      descriptionKey: 'courses.whatsappAvancado.modules.dispositivos.description',
      lessons: [
        {
          slug: 'baileys-vs-cloud-api',
          titleKey: 'courses.whatsappAvancado.modules.dispositivos.lessons.baileysVsCloud',
          durationMin: 10,
          interactivity: 'high',
          xpPoints: 40,
          contentBlocks: [
            {
              type: 'heading',
              text: 'Baileys vs Cloud API: Dois Drivers, Uma Plataforma',
              level: 'h2',
            },
            {
              type: 'comparison-table',
              columns: [
                { label: 'Característica' },
                { label: 'Baileys (Web)', highlighted: false },
                { label: 'Cloud API (Meta)', highlighted: true },
              ],
              rows: [
                { feature: 'Aprovação Meta', values: ['', 'Não necessária', 'Sim (Business Account)'] },
                { feature: 'Custo por mensagem', values: ['', 'Zero (apenas infra)', 'Cobrado pela Meta'] },
                { feature: 'Limite de mensagens', values: ['', 'Limitado pelo número', 'Até 250k/dia (tier 4)'] },
                { feature: 'Templates obrigatórios', values: ['', 'Não', 'Sim (para iniciar conversa)'] },
                { feature: 'Conexão', values: ['', 'QR Code / Pairing Code', 'Credenciais de API'] },
                { feature: 'Risco de ban', values: ['', 'Moderado (uso massivo)', 'Baixo (oficial Meta)'] },
                { feature: 'Funcionalidades', values: ['', 'Todas do app WhatsApp', 'Templates + respostas'] },
                { feature: 'Ideal para', values: ['', 'PMEs, uso moderado', 'Enterprise, alto volume'] },
              ],
            } as ContentBlock,
            {
              type: 'mockui',
              variant: 'whatsapp-chat',
              interactionSteps: [
                { targetId: 'msg-text', instruction: 'Mensagem via Baileys — enviada pelo protocolo Web', position: 'right' },
                { targetId: 'msg-template', instruction: 'Template HSM via Cloud API — aprovado pela Meta', position: 'right' },
                { targetId: 'msg-reply', instruction: 'Resposta do usuário — recebida por ambos os drivers', position: 'left' },
                { targetId: 'msg-image', instruction: 'Mídia via Cloud API — URL pública obrigatória', position: 'right' },
              ],
              initialData: {
                messages: [
                  { type: 'text', content: 'Olá! Seu pedido foi recebido. (Baileys)', from: 'bot' },
                  { type: 'template', templateName: 'order_update', content: 'Pedido #5678 atualizado para "Em transporte". (Cloud API)', from: 'bot' },
                  { type: 'text', content: 'Obrigado! Quando chega?', from: 'user' },
                  { type: 'image', content: 'rastreio-mapa.jpg', caption: 'Acompanhe em tempo real', from: 'bot' },
                ],
              },
            } as ContentBlock,
            {
              type: 'callout',
              variant: 'warning',
              title: 'Baileys e termos de uso',
              text: 'O Baileys é uma implementação não-oficial do protocolo WhatsApp Web. A Meta não aprova seu uso comercial. Para operações de alto volume ou que envolvam informações financeiras sensíveis, recomendamos migrar para a Cloud API oficial.',
            },
            {
              type: 'diagram-animated',
              variant: 'architecture',
              nodes: [
                { id: 'app', label: 'Sua Aplicação\n(Painel Catalisa)', x: 400, y: 20, color: '#6366f1', w: 200 },
                { id: 'driver-factory', label: 'Driver Factory', x: 400, y: 130, color: '#0f766e', w: 200 },
                { id: 'baileys', label: 'Baileys Driver\n(Web Protocol)', x: 180, y: 250, color: '#16a34a', w: 180 },
                { id: 'cloud', label: 'Cloud API Driver\n(Meta Official)', x: 620, y: 250, color: '#1d4ed8', w: 180 },
                { id: 'whatsapp-web', label: 'WhatsApp Web\nProtocol', x: 80, y: 380, color: '#16a34a' },
                { id: 'meta-api', label: 'Meta Graph API\nv17+', x: 720, y: 380, color: '#1d4ed8' },
              ],
              edges: [
                { from: 'app', to: 'driver-factory', label: 'usa', animated: true },
                { from: 'driver-factory', to: 'baileys', label: 'instancia', animated: true },
                { from: 'driver-factory', to: 'cloud', label: 'instancia', animated: true },
                { from: 'baileys', to: 'whatsapp-web', animated: true },
                { from: 'cloud', to: 'meta-api', animated: true },
              ],
              viewBox: { w: 900, h: 460 },
            } as ContentBlock,
            {
              type: 'accordion-faq',
              items: [
                {
                  question: 'Posso ter dispositivos Baileys e Cloud API na mesma conta?',
                  answer: 'Sim! O Driver Factory da Catalisa seleciona o driver correto por dispositivo. Você pode ter o número pessoal conectado via Baileys e o número corporativo via Cloud API, tudo gerenciado no mesmo painel.',
                },
                {
                  question: 'Como faço a migração de Baileys para Cloud API?',
                  answer: 'No painel, acesse o dispositivo e clique em "Migrar Driver". O sistema desconecta o Baileys, solicita suas credenciais da Cloud API e reconecta com o novo driver. Histórico de conversas e workflows existentes são preservados.',
                },
                {
                  question: 'Qual é o limite de mensagens com Baileys?',
                  answer: 'Não existe um limite técnico fixo, mas a Meta pode banir números que enviam muitas mensagens não-solicitadas. Recomendamos no máximo 1.000 mensagens/dia por número em Baileys, com intervalos aleatórios entre envios.',
                },
              ],
            } as ContentBlock,
            {
              type: 'quiz',
              quizId: 'wpp-drivers-q1',
              variant: 'multiple-choice',
              question: 'Uma fintech quer enviar extratos mensais para 50.000 clientes via WhatsApp. Qual driver é mais adequado?',
              options: [
                { label: 'Baileys — pois é gratuito e sem limite técnico', value: 'baileys' },
                { label: 'Cloud API — pois é oficial, escala e tem menor risco de ban', value: 'cloud' },
                { label: 'Ambos em paralelo para distribuir a carga', value: 'both' },
              ],
              correctAnswer: 'cloud',
              explanation: 'Para alto volume (50k mensagens) em contexto financeiro, a Cloud API é obrigatória. Além de suportar o volume com templates aprovados, ela garante compliance com as políticas da Meta para serviços financeiros, reduzindo risco de ban.',
              xpBonus: 15,
            } as ContentBlock,
          ],
        },
        {
          slug: 'conexao-troubleshooting',
          titleKey: 'courses.whatsappAvancado.modules.dispositivos.lessons.conexaoTroubleshooting',
          durationMin: 9,
          interactivity: 'high',
          xpPoints: 35,
          contentBlocks: [
            {
              type: 'heading',
              text: 'Conexão, QR Code e Troubleshooting',
              level: 'h2',
            },
            {
              type: 'step-by-step',
              steps: [
                {
                  title: 'Conectar via QR Code',
                  description: 'Acesse "Dispositivos" → "Novo Dispositivo" → "Baileys". O painel gera um QR Code válido por 20-40 segundos. Abra o WhatsApp no celular → Configurações → Aparelhos Conectados → Conectar Aparelho.',
                },
                {
                  title: 'Usar Pairing Code (sem câmera)',
                  description: 'Se não tiver acesso à câmera, clique em "Usar Código de Pareamento". Digite o número e o sistema fornece um código de 8 dígitos para inserir no WhatsApp.',
                },
                {
                  title: 'Aguardar estabilização da sessão',
                  description: 'Após a leitura do QR, aguarde o status mudar para "Conectado". Leva 3-10 segundos. Durante esse tempo, o Baileys sincroniza as chaves de criptografia.',
                },
                {
                  title: 'Verificar status do dispositivo',
                  description: 'O painel mostra o status em tempo real: Conectado (verde), Conectando (amarelo), Desconectado (vermelho). Hover no status exibe o motivo da última desconexão.',
                },
              ],
            } as ContentBlock,
            {
              type: 'mockui',
              variant: 'whatsapp-chat',
              interactionSteps: [
                { targetId: 'msg-text', instruction: 'Dispositivo conectado com sucesso', position: 'right' },
                { targetId: 'msg-question', instruction: 'Status muda para "Conectando..." ao reconectar', position: 'right' },
                { targetId: 'msg-reply', instruction: 'Mensagem do cliente chega normalmente', position: 'left' },
                { targetId: 'msg-template', instruction: 'Bot responde automaticamente via workflow', position: 'right' },
              ],
              initialData: {
                messages: [
                  { type: 'system', content: 'Dispositivo conectado via QR Code', from: 'system' },
                  { type: 'text', content: 'Oi, quero saber do meu pedido', from: 'user' },
                  { type: 'text', content: 'Olá! Qual o número do seu pedido?', from: 'bot' },
                  { type: 'text', content: '#4521', from: 'user' },
                  { type: 'template', templateName: 'order_status', content: 'Pedido #4521 - Status: Em transporte. Previsão: amanhã.', from: 'bot' },
                ],
              },
            } as ContentBlock,
            {
              type: 'accordion-faq',
              items: [
                {
                  question: 'O dispositivo fica desconectando frequentemente. O que fazer?',
                  answer: 'Desconexões frequentes (>5/hora) indicam: 1) Outra instância usando o mesmo número (connectionReplaced), 2) Credenciais corrompidas (badSession — use Reset), 3) Instabilidade de rede, 4) Rate limit da Meta. Verifique os logs de desconexão para identificar o motivo exato.',
                },
                {
                  question: 'Recebi erro 405 no WhatsApp. O que significa?',
                  answer: 'Status 405 indica que o número foi temporariamente banido pela Meta. PARE imediatamente de tentar reconectar. Aguarde 30-60 minutos antes de tentar novamente. Reconexões durante o ban aumentam a duração da penalidade.',
                },
                {
                  question: 'Como forçar uma reconexão?',
                  answer: 'Use o botão "Reconectar (Forçar)" no painel do dispositivo ou chame POST /wpp/reconnect com { "force": true }. Isso fecha a sessão atual e inicia uma nova. Use com moderação pois pode causar "connectionReplaced" se outro processo ainda estiver ativo.',
                },
                {
                  question: 'O que faz o botão "Reset"?',
                  answer: 'Reset apaga completamente as credenciais WaAuth salvas no banco de dados e desconecta o dispositivo. Após um reset, um novo QR Code é necessário. Use quando a sessão estiver corrompida (badSession) e o Reconectar normal não funcionar.',
                },
              ],
            } as ContentBlock,
            {
              type: 'interactive-demo',
              title: 'Diagnóstico de Conexão: Identifique e Resolva',
              scenarios: [
                {
                  id: 'diag-connection-replaced',
                  label: 'Erro: connectionReplaced',
                  description: 'O dispositivo desconecta a cada minuto com o erro "connectionReplaced".',
                  steps: [
                    { instruction: 'Verifique se há outra instância usando o mesmo número', action: 'check-instances', feedback: 'Detectado: 2 instâncias ativas (produção + staging) no mesmo número.' },
                    { instruction: 'Desconecte a instância extra no painel de staging', action: 'disconnect-staging', feedback: 'Instância staging desconectada. Apenas produção está ativa agora.' },
                    { instruction: 'Confirme que o dispositivo estabilizou', action: 'verify-stable', feedback: 'Status: Conectado (verde) por 5 minutos sem desconexão. Problema resolvido.' },
                  ],
                },
                {
                  id: 'diag-bad-session',
                  label: 'Erro: badSession',
                  description: 'O dispositivo não reconecta e mostra "badSession" nos logs.',
                  steps: [
                    { instruction: 'Tente o Reconectar (Forçar)', action: 'force-reconnect', feedback: 'Falha: badSession persiste. Credenciais corrompidas.' },
                    { instruction: 'Execute o Reset para limpar credenciais WaAuth', action: 'reset-device', feedback: 'WaAuth apagado. Dispositivo aguardando novo QR Code.' },
                    { instruction: 'Escaneie o novo QR Code no celular', action: 'scan-qr', feedback: 'QR escaneado. Status: Conectado. Sessão restaurada com sucesso.' },
                  ],
                },
                {
                  id: 'diag-ban-405',
                  label: 'Erro: 405 (Ban temporário)',
                  description: 'O número retorna status 405 ao tentar reconectar.',
                  steps: [
                    { instruction: 'PARE todas as tentativas de reconexão', action: 'stop-reconnect', feedback: 'Reconexão automática desativada para este dispositivo.' },
                    { instruction: 'Aguarde o período de cooldown (30-60 min)', action: 'wait-cooldown', feedback: '45 minutos se passaram. Pronto para tentar novamente.' },
                    { instruction: 'Reconecte com cautela e monitore', action: 'careful-reconnect', feedback: 'Reconexão bem-sucedida! Configure alertas para evitar ações que causem novo ban.' },
                  ],
                },
              ],
            } as ContentBlock,
            {
              type: 'callout',
              variant: 'important',
              title: 'Monitoramento proativo',
              text: 'Configure um webhook de sistema para o evento "device.disconnected" para ser alertado imediatamente quando um dispositivo cair. Automações que dependem de WhatsApp devem ter lógica de fallback quando o dispositivo estiver offline.',
            },
            {
              type: 'quiz',
              quizId: 'wpp-conn-q1',
              variant: 'multiple-choice',
              question: 'Um dispositivo mostra status "connectionReplaced" e fica desconectando a cada minuto. Qual é a causa mais provável e a solução?',
              options: [
                { label: 'Senha incorreta — reconfigurar credenciais', value: 'a' },
                { label: 'Outra instância do servidor usando o mesmo número — garantir apenas uma instância ativa', value: 'b' },
                { label: 'QR Code expirado — gerar novo QR', value: 'c' },
                { label: 'WhatsApp desatualizado no celular — atualizar o app', value: 'd' },
              ],
              correctAnswer: 'b',
              explanation: '"connectionReplaced" significa que outra instância (ou outro servidor) tomou o controle da sessão. A solução é garantir que apenas uma instância do worker-session gerencie aquele número. Verifique se não há múltiplos ambientes conectados ao mesmo número.',
              xpBonus: 15,
            } as ContentBlock,
          ],
        },
      ],
    },
    {
      slug: 'mensagens-e-eventos',
      titleKey: 'courses.whatsappAvancado.modules.mensagensEventos.title',
      descriptionKey: 'courses.whatsappAvancado.modules.mensagensEventos.description',
      lessons: [
        {
          slug: 'media-reacoes-templates',
          titleKey: 'courses.whatsappAvancado.modules.mensagensEventos.lessons.mediaReacoes',
          durationMin: 9,
          interactivity: 'high',
          xpPoints: 40,
          contentBlocks: [
            {
              type: 'heading',
              text: 'Mídia, Reações e Templates HSM',
              level: 'h2',
            },
            {
              type: 'paragraph',
              text: 'O WhatsApp suporta mensagens ricas. Explore os tipos na simulação abaixo.',
            },
            {
              type: 'mockui',
              variant: 'whatsapp-chat',
              interactionSteps: [
                { targetId: 'msg-text', instruction: 'Mensagem de texto simples', position: 'right' },
                { targetId: 'msg-image', instruction: 'Imagem com legenda', position: 'right' },
                { targetId: 'msg-question', instruction: 'Documento PDF enviado', position: 'right' },
                { targetId: 'msg-reply', instruction: 'Reação de emoji na mensagem', position: 'right' },
                { targetId: 'msg-template', instruction: 'Template HSM aprovado pela Meta', position: 'right' },
              ],
              initialData: {
                messages: [
                  { type: 'text', content: 'Olá! Seu pedido #1234 foi confirmado.', from: 'bot' },
                  { type: 'image', content: 'comprovante-pedido.jpg', caption: 'Comprovante de pedido', from: 'bot' },
                  { type: 'document', content: 'nota-fiscal-1234.pdf', from: 'bot' },
                  { type: 'reaction', content: '👍', targetMessageId: 'msg-1', from: 'user' },
                  { type: 'template', templateName: 'order_confirmation', from: 'bot' },
                ],
              },
            } as ContentBlock,
            {
              type: 'mockui',
              variant: 'whatsapp-chat',
              interactionSteps: [
                { targetId: 'msg-text', instruction: 'Clique para ver como enviar uma mensagem de texto via API', position: 'right' },
                { targetId: 'msg-image', instruction: 'Envie imagens com legenda personalizada', position: 'right' },
                { targetId: 'msg-template', instruction: 'Templates HSM permitem reabrir conversas fora da janela de 24h', position: 'right' },
              ],
              initialData: {
                messages: [
                  { type: 'template', templateName: 'shipping_update', content: 'Seu pedido #9876 saiu para entrega! Previsão: hoje até 18h.', from: 'bot' },
                  { type: 'text', content: 'Ótimo! Obrigado pela atualização.', from: 'user' },
                  { type: 'image', content: 'mapa-rastreio.jpg', caption: 'Acompanhe em tempo real pelo mapa', from: 'bot' },
                ],
              },
            } as ContentBlock,
            {
              type: 'code',
              language: 'json',
              text: `// Enviando mídia via API da Catalisa
POST /wpp/send-media
{
  "tenantId": "tenant-abc123",
  "jid": "5511999999999@s.whatsapp.net",
  "mediaType": "image",
  "url": "https://cdn.exemplo.com/produto-123.jpg",
  "caption": "Seu produto está pronto para retirada! 🎉",
  "mimetype": "image/jpeg"
}

// Enviando reação
POST /wpp/send-reaction
{
  "tenantId": "tenant-abc123",
  "jid": "5511999999999@s.whatsapp.net",
  "messageId": "3EB0A1B2C3D4E5F6",
  "emoji": "👍"
}

// Template HSM (Cloud API)
POST /wpp/send-template
{
  "tenantId": "tenant-abc123",
  "jid": "5511999999999@s.whatsapp.net",
  "templateName": "order_confirmation",
  "language": "pt_BR",
  "components": [
    {
      "type": "body",
      "parameters": [
        { "type": "text", "text": "João" },
        { "type": "text", "text": "#1234" }
      ]
    }
  ]
}`,
            } as ContentBlock,
            {
              type: 'callout',
              variant: 'tip',
              title: 'Templates HSM: janela de 24h',
              text: 'Mensagens fora de templates HSM só podem ser enviadas dentro da janela de 24h após a última mensagem do usuário. Fora dessa janela, use um template aprovado para reabrir a conversa. Isso é uma regra da Meta, não da Catalisa.',
            },
            {
              type: 'interactive-demo',
              title: 'Explorando Tipos de Mensagens',
              scenarios: [
                {
                  id: 'send-image',
                  label: 'Enviar Imagem com Legenda',
                  description: 'Simule o envio de uma imagem de produto com legenda personalizada.',
                  steps: [
                    { instruction: 'Selecione o tipo de mensagem "Imagem"', action: 'select-image-type', feedback: 'Campo de URL e legenda exibidos.' },
                    { instruction: 'Cole a URL da imagem', action: 'paste-url', feedback: 'Preview da imagem carregado.' },
                    { instruction: 'Adicione a legenda "Produto disponível! Clique para ver"', action: 'add-caption', feedback: 'Legenda configurada.' },
                    { instruction: 'Clique em Enviar', action: 'send', feedback: 'Imagem enviada com sucesso! Status: delivered.' },
                  ],
                },
                {
                  id: 'send-template',
                  label: 'Usar Template HSM',
                  description: 'Envie uma mensagem usando um template pré-aprovado pela Meta.',
                  steps: [
                    { instruction: 'Selecione "Template HSM" como tipo', action: 'select-template', feedback: 'Lista de templates aprovados exibida.' },
                    { instruction: 'Escolha o template "order_confirmation"', action: 'choose-template', feedback: 'Variáveis do template: {{1}} = nome, {{2}} = número do pedido.' },
                    { instruction: 'Preencha as variáveis com "Maria" e "5678"', action: 'fill-vars', feedback: 'Preview: "Olá Maria! Seu pedido #5678 foi confirmado."' },
                    { instruction: 'Envie o template', action: 'send-template', feedback: 'Template enviado! Pode ser enviado fora da janela de 24h.' },
                  ],
                },
              ],
            } as ContentBlock,
          ],
        },
        {
          slug: 'eventos-webhooks',
          titleKey: 'courses.whatsappAvancado.modules.mensagensEventos.lessons.eventosWebhooks',
          durationMin: 9,
          interactivity: 'high',
          xpPoints: 40,
          contentBlocks: [
            {
              type: 'heading',
              text: 'Eventos WhatsApp e Webhooks Avançados',
              level: 'h2',
            },
            {
              type: 'paragraph',
              text: 'Cada interação no WhatsApp gera eventos. Veja como eles fluem pela plataforma.',
            },
            {
              type: 'diagram-animated',
              variant: 'data-flow',
              nodes: [
                { id: 'whatsapp', label: 'WhatsApp\n(Usuário)', x: 60, y: 180, color: '#16a34a' },
                { id: 'worker', label: 'Worker Session\n(Baileys/Cloud)', x: 250, y: 180, color: '#0f766e', w: 160 },
                { id: 'redis', label: 'Redis\nPub/Sub', x: 460, y: 180, color: '#dc2626' },
                { id: 'sse', label: 'SSE\nServer', x: 650, y: 80, color: '#7c3aed' },
                { id: 'webhook-basic', label: 'Basic Webhook\nWorker', x: 650, y: 180, color: '#ea580c' },
                { id: 'webhook-adv', label: 'Advanced\nWebhook Worker', x: 650, y: 280, color: '#b45309' },
                { id: 'seu-sistema', label: 'Seu Sistema\n(endpoint)', x: 860, y: 180, color: '#1d4ed8', w: 140 },
              ],
              edges: [
                { from: 'whatsapp', to: 'worker', label: 'envia msg', animated: true },
                { from: 'worker', to: 'redis', label: 'publica evento', animated: true },
                { from: 'redis', to: 'sse', animated: true },
                { from: 'redis', to: 'webhook-basic', animated: true },
                { from: 'redis', to: 'webhook-adv', animated: true },
                { from: 'sse', to: 'seu-sistema', label: 'stream', animated: true },
                { from: 'webhook-basic', to: 'seu-sistema', label: 'POST HTTP', animated: true },
                { from: 'webhook-adv', to: 'seu-sistema', label: 'POST + HMAC', animated: true },
              ],
              viewBox: { w: 1040, h: 380 },
            } as ContentBlock,
            {
              type: 'step-by-step',
              steps: [
                {
                  title: 'messages.upsert',
                  description: 'Nova mensagem recebida ou atualizada. Evento mais comum para integrações de atendimento.',
                },
                {
                  title: 'messages.update',
                  description: 'Status de mensagem alterado (sent, delivered, read). Use para confirmar entrega e leitura.',
                },
                {
                  title: 'connection.update',
                  description: 'Status do dispositivo mudou (open, close, connecting). Essencial para monitoramento de uptime.',
                },
                {
                  title: 'chats.update / contacts.upsert',
                  description: 'Conversa ou contato atualizados. Sincronize dados de perfil e metadados de chat.',
                },
                {
                  title: 'groups.upsert / group-participants.update',
                  description: 'Grupo criado/atualizado ou participante adicionado/removido. Para automações de grupos.',
                },
                {
                  title: 'call',
                  description: 'Chamada recebida ou perdida. Crie alertas ou respostas automáticas para chamadas não atendidas.',
                },
              ],
            } as ContentBlock,
            {
              type: 'mockui',
              variant: 'settings',
              interactionSteps: [
                { targetId: 'settings-integracao', instruction: 'Em Integrações, configure os endpoints que receberão eventos WhatsApp.', position: 'right' },
                { targetId: 'settings-devices', instruction: 'Cada dispositivo gera eventos independentes no canal events:{tenantId}.', position: 'right' },
              ],
            } as ContentBlock,
            {
              type: 'mockui',
              variant: 'whatsapp-chat',
              interactionSteps: [
                { targetId: 'msg-text', instruction: 'Mensagem recebida gera evento messages.upsert', position: 'left' },
                { targetId: 'msg-reply', instruction: 'Resposta do bot gera evento messages.upsert (outbound)', position: 'right' },
                { targetId: 'msg-question', instruction: 'Confirmação de leitura gera messages.update status=READ', position: 'left' },
                { targetId: 'msg-image', instruction: 'Mídia recebida inclui URL para download no evento', position: 'left' },
              ],
              initialData: {
                messages: [
                  { type: 'text', content: 'Oi, preciso de ajuda com meu pedido', from: 'user' },
                  { type: 'text', content: 'Claro! Me informe o número do pedido.', from: 'bot' },
                  { type: 'text', content: 'É o pedido #7890', from: 'user' },
                  { type: 'image', content: 'screenshot-erro.jpg', caption: 'Está aparecendo esse erro', from: 'user' },
                ],
              },
            } as ContentBlock,
            {
              type: 'sandbox',
              variant: 'webhook-config',
              instructions: 'Configure um Advanced Webhook que: 1) Escuta o evento "messages.upsert" 2) Filtra apenas mensagens de um grupo específico (jid: "120363000000@g.us") 3) Aponta para "https://meu-sistema.com/webhook/whatsapp" 4) Usa HMAC-SHA256 com uma chave secreta. Preencha todos os campos e salve a configuração.',
              validation: {
                type: 'contains',
                expected: {
                  eventType: 'messages.upsert',
                  filters: [{ field: 'jid', value: '120363000000@g.us' }],
                  hmacEnabled: true,
                },
              },
              solution: {
                name: 'Monitorar Grupo Vendas',
                eventTypes: ['messages.upsert'],
                filters: [{ field: 'jid', operator: 'equals', value: '120363000000@g.us' }],
                targetUrl: 'https://meu-sistema.com/webhook/whatsapp',
                hmacSecret: 'meu-segredo-forte-aqui',
                retryPolicy: { maxAttempts: 5, backoffMultiplier: 2 },
              },
              xpReward: 25,
            } as ContentBlock,
            {
              type: 'quiz',
              quizId: 'wpp-events-q1',
              variant: 'multiple-choice',
              question: 'Qual evento você deve escutar para detectar quando um cliente leu sua mensagem no WhatsApp?',
              options: [
                { label: 'messages.upsert com status="read"', value: 'a' },
                { label: 'messages.update com update.status="READ"', value: 'b' },
                { label: 'chats.update com unreadCount=0', value: 'c' },
                { label: 'contact.read com timestamp', value: 'd' },
              ],
              correctAnswer: 'b',
              explanation: 'O evento "messages.update" é disparado quando o status de uma mensagem muda. O campo update.status pode ser "SENT", "DELIVERED" ou "READ". Use esse evento para saber exatamente quando o cliente abriu sua mensagem.',
              xpBonus: 15,
            } as ContentBlock,
          ],
        },
        {
          slug: 'cenarios-end-to-end',
          titleKey: 'courses.whatsappAvancado.modules.mensagensEventos.lessons.cenariosE2E',
          durationMin: 8,
          interactivity: 'high',
          xpPoints: 45,
          contentBlocks: [
            {
              type: 'heading',
              text: 'Cenários End-to-End: Da Recepção ao Atendimento',
              level: 'h2',
            },
            {
              type: 'paragraph',
              text: 'Combine eventos, webhooks e workflows em jornadas completas de atendimento.',
            },
            {
              type: 'diagram-animated',
              variant: 'sequence',
              nodes: [
                { id: 'cliente', label: 'Cliente', x: 80, y: 60, color: '#16a34a' },
                { id: 'wpp', label: 'WhatsApp\nCatalisa', x: 280, y: 60, color: '#0f766e' },
                { id: 'workflow', label: 'Workflow\nEngine', x: 480, y: 60, color: '#6366f1' },
                { id: 'ai', label: 'AI Agent', x: 680, y: 60, color: '#a855f7' },
                { id: 'atendente', label: 'Atendente\nHumano', x: 880, y: 60, color: '#ea580c' },
              ],
              edges: [
                { from: 'cliente', to: 'wpp', label: '1. "Quero suporte"', animated: true },
                { from: 'wpp', to: 'workflow', label: '2. messages.upsert', animated: true },
                { from: 'workflow', to: 'ai', label: '3. RUN_AGENT', animated: true },
                { from: 'ai', to: 'wpp', label: '4. Triagem automática', animated: true },
                { from: 'wpp', to: 'cliente', label: '5. "Em qual área posso ajudar?"', animated: true },
                { from: 'cliente', to: 'wpp', label: '6. "Financeiro"', animated: true },
                { from: 'wpp', to: 'workflow', label: '7. Resposta categorizada', animated: true },
                { from: 'workflow', to: 'atendente', label: '8. Transferir para humano', animated: true },
              ],
              viewBox: { w: 1000, h: 380 },
            } as ContentBlock,
            {
              type: 'callout',
              variant: 'pro-tip',
              title: 'Human-in-the-loop',
              text: 'Configure um timeout no AI Agent: se o agente não conseguir resolver em 3 turnos, escale automaticamente para um atendente humano. Use o evento "workflow.action.failed" ou um timer com DELAY + CONDITIONAL para implementar esse padrão.',
            },
            {
              type: 'interactive-demo',
              title: 'Roteamento de Mensagens por Tipo',
              scenarios: [
                {
                  id: 'route-by-type',
                  label: 'Rotear por Tipo de Lead',
                  description: 'Veja como diferentes tipos de lead são atendidos por agentes diferentes.',
                  steps: [
                    {
                      instruction: 'Lead tipo CORRETOR envia mensagem.',
                      action: 'corretor-msg',
                      feedback: 'Workflow detecta tipo CORRETOR → Aciona Agente "Consultor Imobiliário".',
                    },
                    {
                      instruction: 'Lead tipo CLIENTE_FINAL envia mensagem.',
                      action: 'cliente-msg',
                      feedback: 'Workflow detecta tipo CLIENTE_FINAL → Aciona Agente "Atendimento Geral".',
                    },
                    {
                      instruction: 'Lead sem tipo (PROSPECT) envia mensagem.',
                      action: 'prospect-msg',
                      feedback: 'Workflow detecta tipo vazio → Aciona Agente "Qualificador" para identificar o perfil.',
                    },
                  ],
                },
              ],
            } as ContentBlock,
            {
              type: 'interactive-demo',
              title: 'Jornada Completa: Suporte via WhatsApp',
              scenarios: [
                {
                  id: 'suporte-simples',
                  label: 'Dúvida Simples (Resolvida pelo AI)',
                  description: 'O cliente pergunta o horário de funcionamento e o AI Agent responde imediatamente.',
                  steps: [
                    { instruction: 'Cliente envia: "Qual o horário de vocês?"', action: 'client-message', feedback: 'Evento messages.upsert capturado. Workflow "Triagem de Suporte" iniciado.' },
                    { instruction: 'AI Agent analisa a intenção', action: 'ai-analyze', feedback: 'Intenção detectada: HORARIO_FUNCIONAMENTO. Score de confiança: 0.95.' },
                    { instruction: 'AI Agent responde automaticamente', action: 'ai-respond', feedback: 'Mensagem enviada: "Atendemos de segunda a sexta, das 8h às 18h. Posso ajudar com mais alguma coisa?"' },
                  ],
                },
                {
                  id: 'suporte-complexo',
                  label: 'Problema Complexo (Escalado para Humano)',
                  description: 'O cliente reclama de cobrança indevida e o sistema escala para um atendente.',
                  steps: [
                    { instruction: 'Cliente envia: "Fui cobrado errado!"', action: 'client-complaint', feedback: 'Evento capturado. Intenção: RECLAMACAO_COBRANCA. Prioridade: ALTA.' },
                    { instruction: 'AI Agent tenta coletar informações', action: 'ai-collect', feedback: 'AI pergunta: "Pode me informar o número da fatura?" — 2 turnos sem resolução.' },
                    { instruction: 'Timeout atingido: escalar para humano', action: 'escalate', feedback: 'Notificação enviada para fila "Suporte Financeiro". Atendente Marcos recebeu o caso.' },
                  ],
                },
              ],
            } as ContentBlock,
            {
              type: 'quiz',
              quizId: 'wpp-e2e-q1',
              variant: 'multiple-choice',
              question: 'Um bot WhatsApp recebe uma mensagem de áudio. Como a Catalisa disponibiliza esse conteúdo para um AI Agent processar?',
              options: [
                { label: 'O áudio é transcrito automaticamente e o texto fica no evento', value: 'a' },
                { label: 'O evento messages.upsert contém a URL do áudio para download — o AI Agent precisa chamar uma ferramenta de transcrição', value: 'b' },
                { label: 'Áudios não são suportados e geram um erro', value: 'c' },
                { label: 'O evento é ignorado para não sobrecarregar o sistema', value: 'd' },
              ],
              correctAnswer: 'b',
              explanation: 'O evento messages.upsert inclui a URL do arquivo de mídia. Para processar áudio com IA, o AI Agent deve usar uma ferramenta de transcrição (como Whisper via Custom Action HTTP_WEBHOOK) que baixa o áudio e retorna o texto transcrito para o contexto da conversa.',
              xpBonus: 20,
            } as ContentBlock,
          ],
        },
      ],
    },
  ],
};
