import type { Course } from '../trainingCourses';
import type { ContentBlock } from '../trainingBlockTypes';

export const buildingBlocksCourse: Course = {
  slug: 'building-blocks',
  titleKey: 'courses.buildingBlocks.title',
  descriptionKey: 'courses.buildingBlocks.description',
  durationKey: 'courses.buildingBlocks.duration',
  available: true,
  track: 'avancado',
  audience: 'todos',
  difficulty: 'avancado',
  colorScheme: 'teal',
  totalXP: 200,
  modules: [
    {
      slug: 'arquitetura-modular',
      titleKey: 'courses.buildingBlocks.modules.arquitetura.title',
      descriptionKey: 'courses.buildingBlocks.modules.arquitetura.description',
      lessons: [
        {
          slug: 'vinte-um-blocos-modulares',
          titleKey: 'courses.buildingBlocks.modules.arquitetura.lessons.vintEUmBlocos',
          durationMin: 10,
          interactivity: 'medium',
          xpPoints: 40,
          contentBlocks: [
            {
              type: 'heading',
              text: 'A Plataforma Catalisa: 21 Blocos Modulares',
              level: 'h2',
            },
            {
              type: 'diagram-animated',
              variant: 'architecture',
              nodes: [
                { id: 'core', label: 'Core\nPlataforma', x: 380, y: 20, color: '#0f766e', w: 160, h: 50 },
                { id: 'crm', label: 'CRM &\nLeads', x: 80, y: 120, color: '#0d9488' },
                { id: 'whatsapp', label: 'WhatsApp\nMulti-tenant', x: 260, y: 120, color: '#0d9488' },
                { id: 'workflows', label: 'Workflow\nEngine', x: 440, y: 120, color: '#0d9488' },
                { id: 'ai', label: 'AI\nAgents', x: 620, y: 120, color: '#0d9488' },
                { id: 'billing', label: 'Billing &\nMeteracao', x: 800, y: 120, color: '#0d9488' },
                { id: 'decision', label: 'Decision\nEngine', x: 80, y: 250, color: '#14b8a6' },
                { id: 'pricing', label: 'Pricing\nDinamico', x: 220, y: 250, color: '#14b8a6' },
                { id: 'esign', label: 'E-Signature', x: 360, y: 250, color: '#14b8a6' },
                { id: 'flags', label: 'Feature\nFlags', x: 500, y: 250, color: '#14b8a6' },
                { id: 'webhooks', label: 'Advanced\nWebhooks', x: 640, y: 250, color: '#14b8a6' },
                { id: 'analytics', label: 'Analytics &\nObservability', x: 780, y: 250, color: '#14b8a6' },
              ],
              edges: [
                { from: 'core', to: 'crm', animated: true },
                { from: 'core', to: 'whatsapp', animated: true },
                { from: 'core', to: 'workflows', animated: true },
                { from: 'core', to: 'ai', animated: true },
                { from: 'core', to: 'billing', animated: true },
                { from: 'workflows', to: 'decision', animated: false },
                { from: 'workflows', to: 'pricing', animated: false },
                { from: 'workflows', to: 'esign', animated: false },
                { from: 'workflows', to: 'flags', animated: false },
                { from: 'workflows', to: 'webhooks', animated: false },
                { from: 'ai', to: 'analytics', animated: false },
              ],
              viewBox: { w: 960, h: 340 },
            } as ContentBlock,
            {
              type: 'comparison-table',
              columns: [
                { label: 'Categoria' },
                { label: 'Blocos Incluidos' },
                { label: 'Disponivel em' },
              ],
              rows: [
                { feature: 'Comunicacao', values: ['', 'WhatsApp, E-mail, SMS, Push', 'Todos os planos'] },
                { feature: 'CRM', values: ['', 'Leads, Pipeline, Segmentacao', 'Starter+'] },
                { feature: 'Automacao', values: ['', 'Workflows, Triggers, Schedulers', 'Starter+'] },
                { feature: 'IA', values: ['', 'AI Agents, AI Assistant, AI Analytics', 'Pro+'] },
                { feature: 'Financeiro', values: ['', 'Billing, Pricing, Invoicing', 'Pro+'] },
                { feature: 'Compliance', values: ['', 'E-Signature, Audit Trail, LGPD', 'Enterprise'] },
                { feature: 'Dev Tools', values: ['', 'Feature Flags, Webhooks, API', 'Todos os planos'] },
              ],
            } as ContentBlock,
            {
              type: 'diagram-animated',
              variant: 'data-flow',
              nodes: [
                { id: 'crm-ev', label: 'CRM\nLEAD_CREATED', x: 60, y: 40, color: '#0d9488' },
                { id: 'wpp-ev', label: 'WhatsApp\nMESSAGE_RECEIVED', x: 60, y: 140, color: '#16a34a' },
                { id: 'billing-ev', label: 'Billing\nPAYMENT_SUCCEEDED', x: 60, y: 240, color: '#f59e0b' },
                { id: 'bus', label: 'Barramento\nde Eventos', x: 300, y: 140, color: '#6366f1', w: 160 },
                { id: 'wf-engine', label: 'Workflow\nEngine', x: 540, y: 60, color: '#805AD5' },
                { id: 'webhooks', label: 'Advanced\nWebhooks', x: 540, y: 140, color: '#ea580c' },
                { id: 'analytics', label: 'Analytics', x: 540, y: 220, color: '#10b981' },
              ],
              edges: [
                { from: 'crm-ev', to: 'bus', animated: true },
                { from: 'wpp-ev', to: 'bus', animated: true },
                { from: 'billing-ev', to: 'bus', animated: true },
                { from: 'bus', to: 'wf-engine', label: 'processa', animated: true },
                { from: 'bus', to: 'webhooks', label: 'entrega', animated: true },
                { from: 'bus', to: 'analytics', label: 'registra', animated: true },
              ],
              viewBox: { w: 700, h: 300 },
            } as ContentBlock,
            {
              type: 'accordion-faq',
              items: [
                {
                  question: 'Qual e a filosofia composavel da plataforma?',
                  answer: 'Cada bloco expoe APIs REST e eventos padronizados. Isso significa que o Decision Engine pode disparar um Workflow que usa o Billing para cobrar, e o resultado pode ser enviado via WhatsApp -- tudo sem codigo personalizado.',
                },
                {
                  question: 'Posso ativar apenas os blocos que preciso?',
                  answer: 'Sim. O painel de administracao permite ativar ou desativar modulos por organizacao. Modulos desativados nao aparecem na interface e nao geram custos de metering.',
                },
                {
                  question: 'Os blocos compartilham dados entre si?',
                  answer: 'Sim, atraves de um barramento de eventos interno. Quando um Lead e criado no CRM, o Workflow Engine recebe o evento. Quando um Workflow dispara o Billing, o resultado volta como evento para atualizar o Lead.',
                },
                {
                  question: 'Como sei quais blocos estao ativos na minha conta?',
                  answer: 'Acesse Configuracoes -> Modulos. Voce vera o status de cada bloco, data de ativacao e metricas de uso dos ultimos 30 dias.',
                },
              ],
            } as ContentBlock,
            {
              type: 'quiz',
              quizId: 'bb-arquitetura-q1',
              variant: 'multiple-choice',
              question: 'Um cliente quer cobrar automaticamente quando um lead assina um contrato digital. Quais blocos da Catalisa precisam ser combinados?',
              options: [
                { label: 'CRM + WhatsApp', value: 'a' },
                { label: 'E-Signature + Billing + Workflows', value: 'b' },
                { label: 'Decision Engine + Analytics', value: 'c' },
                { label: 'Feature Flags + AI Agents', value: 'd' },
              ],
              correctAnswer: 'b',
              explanation: 'E-Signature captura a assinatura -> Workflows recebe o evento de assinatura concluida -> Billing processa a cobranca. Os tres blocos trabalham em sequencia via o barramento de eventos da plataforma.',
              xpBonus: 15,
            } as ContentBlock,
          ],
        },
        {
          slug: 'usando-blocos-no-painel',
          titleKey: 'courses.buildingBlocks.modules.arquitetura.lessons.usandoNoPainel',
          durationMin: 8,
          interactivity: 'high',
          xpPoints: 35,
          contentBlocks: [
            {
              type: 'heading',
              text: 'Como Usar os Blocos no Painel',
              level: 'h2',
            },
            {
              type: 'step-by-step',
              steps: [
                {
                  title: 'Navegacao principal',
                  description: 'O menu lateral organiza os blocos em secoes: Leads (CRM), Conversas (WhatsApp), Automacao (Workflows), Agentes (IA) e Configuracoes. Modulos nao ativos aparecem com um cadeado.',
                },
                {
                  title: 'Painel de Visao Geral',
                  description: 'O dashboard principal agrega metricas de todos os blocos ativos: leads captados hoje, mensagens enviadas, workflows executados e receita do periodo.',
                },
                {
                  title: 'Criando conexoes entre blocos',
                  description: 'Ao criar um Workflow, voce pode usar acoes de qualquer bloco ativo. O editor de workflow lista todas as acoes disponiveis organizadas por categoria de bloco.',
                },
                {
                  title: 'Monitoramento unificado',
                  description: 'O log de execucoes unificado mostra eventos de todos os blocos em ordem cronologica. Filtros permitem ver apenas eventos de um bloco especifico.',
                },
              ],
            } as ContentBlock,
            {
              type: 'mockui',
              variant: 'dashboard',
              interactionSteps: [
                { targetId: 'nav-leads', instruction: 'Clique em Leads para ver o CRM integrado', position: 'right' },
                { targetId: 'nav-workflows', instruction: 'Clique em Automacao para acessar os Workflows', position: 'right' },
                { targetId: 'nav-agents', instruction: 'Clique em Agentes para ver os AI Agents configurados', position: 'right' },
                { targetId: 'stat-leads', instruction: 'Leads captados hoje pelo bloco de CRM', position: 'bottom' },
                { targetId: 'stat-conversion', instruction: 'Este card mostra execucoes de Workflows hoje', position: 'bottom' },
                { targetId: 'stat-messages', instruction: 'Mensagens WhatsApp enviadas pelo bloco de comunicacao', position: 'bottom' },
              ],
              initialData: {
                leadsHoje: 47,
                mensagensEnviadas: 312,
                workflowsExecutados: 89,
                receitaMes: 'R$ 18.450',
              },
            } as ContentBlock,
            {
              type: 'diagram-animated',
              variant: 'data-flow',
              nodes: [
                { id: 'user', label: 'Usuario\n(Painel)', x: 60, y: 120, color: '#0f766e' },
                { id: 'crm-block', label: 'Bloco CRM\n(Leads)', x: 240, y: 40, color: '#0d9488' },
                { id: 'wpp-block', label: 'Bloco WhatsApp\n(Mensagens)', x: 240, y: 120, color: '#0d9488', w: 140 },
                { id: 'wf-block', label: 'Bloco Workflow\n(Automacao)', x: 240, y: 200, color: '#0d9488', w: 140 },
                { id: 'event-bus', label: 'Barramento\nde Eventos', x: 460, y: 120, color: '#6366f1', w: 140 },
                { id: 'dashboard', label: 'Dashboard\nUnificado', x: 660, y: 120, color: '#10b981', w: 140 },
              ],
              edges: [
                { from: 'user', to: 'crm-block', label: 'cria lead', animated: true },
                { from: 'user', to: 'wpp-block', label: 'envia msg', animated: true },
                { from: 'user', to: 'wf-block', label: 'cria workflow', animated: true },
                { from: 'crm-block', to: 'event-bus', animated: true },
                { from: 'wpp-block', to: 'event-bus', animated: true },
                { from: 'wf-block', to: 'event-bus', animated: true },
                { from: 'event-bus', to: 'dashboard', label: 'metricas', animated: true },
              ],
              viewBox: { w: 860, h: 280 },
            } as ContentBlock,
            {
              type: 'callout',
              variant: 'exercise',
              title: 'Pratique: Explore o painel',
              text: 'Use o MockUI acima para navegar pelos diferentes blocos. Clique em cada card de metrica para ver o detalhamento.',
            },
            {
              type: 'sandbox',
              variant: 'workflow-builder',
              instructions: 'Monte um mini-workflow que combina 3 blocos da Catalisa: 1) Trigger: LEAD_CREATED (bloco CRM) 2) Ação: SEND_MESSAGE de boas-vindas (bloco WhatsApp) 3) Ação: RUN_AGENT para qualificar o lead (bloco AI). Conecte os nós na ordem correta.',
              validation: {
                type: 'contains',
                expected: {
                  hasTrigger: 'LEAD_CREATED',
                  hasActions: ['SEND_MESSAGE', 'RUN_AGENT'],
                },
              },
              solution: {
                trigger: 'LEAD_CREATED',
                actions: [
                  { id: 'welcome', type: 'SEND_MESSAGE', message: 'Bem-vindo!' },
                  { id: 'qualify', type: 'RUN_AGENT', agentId: 'qualificador', dependsOn: ['welcome'] },
                ],
              },
              xpReward: 25,
            } as ContentBlock,
          ],
        },
      ],
    },
    {
      slug: 'blocos-em-acao',
      titleKey: 'courses.buildingBlocks.modules.blocosEmAcao.title',
      descriptionKey: 'courses.buildingBlocks.modules.blocosEmAcao.description',
      lessons: [
        {
          slug: 'decision-engine-pricing',
          titleKey: 'courses.buildingBlocks.modules.blocosEmAcao.lessons.decisionPricing',
          durationMin: 10,
          interactivity: 'high',
          xpPoints: 45,
          contentBlocks: [
            {
              type: 'heading',
              text: 'Decision Engine + Pricing Dinamico',
              level: 'h2',
            },
            {
              type: 'paragraph',
              text: 'O Decision Engine avalia regras de negocio em tempo real. Combinado com o Pricing Dinamico, cria sistemas de precificacao baseados em perfil e comportamento.',
            },
            {
              type: 'diagram-animated',
              variant: 'flow',
              nodes: [
                { id: 'lead', label: 'Lead\nSubmete Proposta', x: 60, y: 140, color: '#0d9488' },
                { id: 'decision', label: 'Decision Engine\nAvalia Criterios', x: 250, y: 140, color: '#0f766e', w: 160 },
                { id: 'risk-a', label: 'Risco A\n(Baixo)', x: 470, y: 60, color: '#10b981' },
                { id: 'risk-b', label: 'Risco B\n(Medio)', x: 470, y: 140, color: '#f59e0b' },
                { id: 'risk-c', label: 'Risco C\n(Alto)', x: 470, y: 220, color: '#ef4444' },
                { id: 'pricing', label: 'Pricing Dinamico\n(Calcula Oferta)', x: 660, y: 140, color: '#0d9488', w: 160 },
                { id: 'proposta', label: 'Proposta\nPersonalizada', x: 860, y: 140, color: '#6366f1' },
              ],
              edges: [
                { from: 'lead', to: 'decision', label: 'envia dados', animated: true },
                { from: 'decision', to: 'risk-a', label: 'score >= 80', animated: true },
                { from: 'decision', to: 'risk-b', label: '50 <= score < 80', animated: true },
                { from: 'decision', to: 'risk-c', label: 'score < 50', animated: true },
                { from: 'risk-a', to: 'pricing', animated: true },
                { from: 'risk-b', to: 'pricing', animated: true },
                { from: 'pricing', to: 'proposta', label: 'gera', animated: true },
              ],
              viewBox: { w: 1000, h: 300 },
            } as ContentBlock,
            {
              type: 'code',
              language: 'json',
              text: `// Configuracao de regra no Decision Engine
{
  "name": "Classificacao de Risco de Credito",
  "conditions": [
    {
      "field": "lead.score",
      "operator": "gte",
      "value": 80,
      "outcome": "RISCO_A",
      "pricingMultiplier": 0.85
    },
    {
      "field": "lead.score",
      "operator": "between",
      "value": [50, 79],
      "outcome": "RISCO_B",
      "pricingMultiplier": 1.0
    },
    {
      "field": "lead.score",
      "operator": "lt",
      "value": 50,
      "outcome": "RISCO_C",
      "action": "REQUIRE_MANUAL_REVIEW"
    }
  ]
}`,
            } as ContentBlock,
            {
              type: 'interactive-demo',
              title: 'Simulacao: Decision Engine em Acao',
              scenarios: [
                {
                  id: 'lead-risco-a',
                  label: 'Lead com Score Alto (Score: 92)',
                  description: 'Simule um lead de alto score passando pelo Decision Engine e recebendo oferta com desconto.',
                  steps: [
                    { instruction: 'Lead submete proposta com score 92', action: 'submit-high-score', feedback: 'Decision Engine avaliando... Score 92 >= 80 -> Classificado como RISCO_A' },
                    { instruction: 'Pricing Dinamico aplica multiplicador 0.85', action: 'apply-multiplier', feedback: 'Preco base R$ 1.200 x 0.85 = R$ 1.020 (desconto automatico por baixo risco)' },
                    { instruction: 'Proposta gerada e enviada via WhatsApp', action: 'send-proposal', feedback: 'Mensagem WhatsApp enviada: "Sua proposta exclusiva: R$ 1.020/mes -- valida por 48h"' },
                  ],
                },
                {
                  id: 'lead-risco-c',
                  label: 'Lead com Score Baixo (Score: 38)',
                  description: 'Veja como o Decision Engine encaminha leads de alto risco para revisao manual.',
                  steps: [
                    { instruction: 'Lead submete proposta com score 38', action: 'submit-low-score', feedback: 'Decision Engine avaliando... Score 38 < 50 -> Classificado como RISCO_C' },
                    { instruction: 'Acao: REQUIRE_MANUAL_REVIEW disparada', action: 'trigger-review', feedback: 'Tarefa criada para o time de credito. Lead marcado com tag "Revisao Manual".' },
                    { instruction: 'Notificacao enviada ao responsavel', action: 'notify-team', feedback: 'E-mail enviado: "Novo lead aguarda revisao de credito: Joao Silva (score: 38)"' },
                  ],
                },
              ],
            } as ContentBlock,
            {
              type: 'diagram-animated',
              variant: 'sequence',
              nodes: [
                { id: 'lead', label: 'Lead', x: 60, y: 40, color: '#0d9488' },
                { id: 'decision', label: 'Decision\nEngine', x: 240, y: 40, color: '#0f766e' },
                { id: 'pricing', label: 'Pricing\nDinamico', x: 420, y: 40, color: '#6366f1' },
                { id: 'lead2', label: 'Lead', x: 60, y: 180, color: '#0d9488' },
                { id: 'result', label: 'Proposta\nFinal', x: 420, y: 180, color: '#10b981' },
              ],
              edges: [
                { from: 'lead', to: 'decision', label: 'submete dados', animated: true },
                { from: 'decision', to: 'pricing', label: 'classificacao + multiplicador', animated: true },
                { from: 'pricing', to: 'result', label: 'preco calculado', animated: true },
                { from: 'result', to: 'lead2', label: 'proposta enviada', animated: true },
              ],
              viewBox: { w: 560, h: 240 },
            } as ContentBlock,
            {
              type: 'quiz',
              quizId: 'bb-decision-q1',
              variant: 'multiple-choice',
              question: 'Uma empresa de seguros quer aplicar taxas diferentes baseadas na idade e historico de sinistros do cliente. Qual combinacao de blocos resolve isso sem codigo?',
              options: [
                { label: 'Apenas Workflows com acao CONDITIONAL', value: 'a' },
                { label: 'Decision Engine (classificar perfil) + Pricing Dinamico (calcular taxa)', value: 'b' },
                { label: 'AI Agents para decidir e Billing para cobrar', value: 'c' },
                { label: 'Feature Flags para ativar taxas diferentes', value: 'd' },
              ],
              correctAnswer: 'b',
              explanation: 'O Decision Engine e projetado exatamente para classificacao multi-criterio (idade + historico). O Pricing Dinamico aplica multiplicadores baseados na classificacao. Juntos, eliminam a necessidade de codigo e permitem auditoria completa das decisoes.',
              xpBonus: 20,
            } as ContentBlock,
          ],
        },
        {
          slug: 'billing-webhooks',
          titleKey: 'courses.buildingBlocks.modules.blocosEmAcao.lessons.billingWebhooks',
          durationMin: 9,
          interactivity: 'high',
          xpPoints: 40,
          contentBlocks: [
            {
              type: 'heading',
              text: 'Billing e Advanced Webhooks',
              level: 'h2',
            },
            {
              type: 'paragraph',
              text: 'O Billing gerencia planos e metricas de uso. Os Advanced Webhooks entregam eventos de forma confiavel para sistemas externos.',
            },
            {
              type: 'diagram-animated',
              variant: 'data-flow',
              nodes: [
                { id: 'action', label: 'Acao do\nUsuario', x: 60, y: 100, color: '#0d9488' },
                { id: 'meter', label: 'Metering\n(Contagem)', x: 240, y: 100, color: '#0f766e', w: 130 },
                { id: 'plan', label: 'Plano &\nLimites', x: 420, y: 40, color: '#6366f1' },
                { id: 'invoice', label: 'Fatura\nGerada', x: 420, y: 160, color: '#f59e0b' },
                { id: 'webhook', label: 'Advanced\nWebhook', x: 600, y: 100, color: '#0d9488', w: 130 },
                { id: 'erp', label: 'ERP /\nGateway', x: 780, y: 100, color: '#10b981' },
              ],
              edges: [
                { from: 'action', to: 'meter', label: 'msg enviada', animated: true },
                { from: 'meter', to: 'plan', label: 'verifica limite', animated: true },
                { from: 'meter', to: 'invoice', label: 'excedente', animated: true },
                { from: 'invoice', to: 'webhook', label: 'evento', animated: true },
                { from: 'webhook', to: 'erp', label: 'HMAC-SHA256', animated: true },
              ],
              viewBox: { w: 900, h: 220 },
            } as ContentBlock,
            {
              type: 'comparison-table',
              columns: [
                { label: 'Capacidade' },
                { label: 'Billing Block', highlighted: true },
                { label: 'Advanced Webhooks' },
              ],
              rows: [
                { feature: 'Proposito', values: ['', 'Gerenciar planos e cobrancas', 'Entregar eventos externamente'] },
                { feature: 'Metering', values: ['', 'Sim (por uso, por assento)', 'Nao aplicavel'] },
                { feature: 'Retry automatico', values: ['', 'Nao (cobranca e sincrona)', 'Sim (ate 10 tentativas)'] },
                { feature: 'HMAC-SHA256', values: ['', 'Nao', 'Sim (verificacao de autenticidade)'] },
                { feature: 'Dashboard de logs', values: ['', 'Faturas e pagamentos', 'Historico de entregas'] },
                { feature: 'Integracao nativa', values: ['', 'Stripe, PagSeguro, Asaas', 'Qualquer endpoint HTTPS'] },
              ],
            } as ContentBlock,
            {
              type: 'step-by-step',
              steps: [
                {
                  title: 'Configure seu plano de cobranca',
                  description: 'Em Configuracoes -> Billing, crie um plano com nome, preco base, ciclo (mensal/anual) e limites de uso. Exemplo: "Plano Pro -- R$ 299/mes -- ate 5 dispositivos WhatsApp".',
                },
                {
                  title: 'Ative a metering por uso',
                  description: 'Para cobranca variavel, ative "Metering". Defina as metricas que serao contadas: mensagens enviadas, leads criados, workflows executados. Configure o preco por unidade excedente.',
                },
                {
                  title: 'Configure o webhook de billing',
                  description: 'Crie um Advanced Webhook que escuta eventos de billing: "payment.succeeded", "subscription.renewed", "invoice.overdue". Aponte para o endpoint do seu ERP.',
                },
                {
                  title: 'Teste o fluxo completo',
                  description: 'Use o modo teste do Billing para simular uma cobranca. Verifique nos logs do Advanced Webhook se o evento foi entregue com sucesso ao endpoint configurado.',
                },
              ],
            } as ContentBlock,
            {
              type: 'sandbox',
              variant: 'webhook-config',
              instructions: 'Configure um Advanced Webhook para receber eventos de billing. Defina: 1) URL do endpoint (ex: https://seu-erp.com/webhooks/catalisa) 2) Eventos a escutar: payment.succeeded, invoice.overdue 3) Secret para assinatura HMAC 4) Numero maximo de retries (1-10). Valide que o webhook esta funcional.',
              validation: {
                type: 'contains',
                expected: {
                  url: 'https://',
                  events: ['payment.succeeded'],
                  secret: true,
                },
              },
              solution: {
                url: 'https://seu-erp.com/webhooks/catalisa',
                events: ['payment.succeeded', 'invoice.overdue'],
                secret: 'whsec_minha_chave_secreta_32chars_min',
                maxRetries: 5,
                headers: { 'Content-Type': 'application/json' },
              },
              xpReward: 25,
            } as ContentBlock,
            {
              type: 'code',
              language: 'typescript',
              text: `// Validacao de HMAC-SHA256 no seu endpoint (Node.js/Express)
import crypto from 'crypto';

app.post('/webhooks/catalisa', (req, res) => {
  const signature = req.headers['x-catalisa-signature'] as string;
  const secret = process.env.CATALISA_WEBHOOK_SECRET!;

  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(JSON.stringify(req.body))
    .digest('hex');

  if (signature !== \`sha256=\${expectedSignature}\`) {
    return res.status(401).json({ error: 'Invalid signature' });
  }

  // Processar o evento com seguranca
  const { event, data } = req.body;
  if (event === 'payment.succeeded') {
    console.log('Pagamento confirmado:', data.invoiceId);
  }

  res.json({ received: true });
});`,
            } as ContentBlock,
          ],
        },
        {
          slug: 'esign-feature-flags',
          titleKey: 'courses.buildingBlocks.modules.blocosEmAcao.lessons.esignFlags',
          durationMin: 8,
          interactivity: 'high',
          xpPoints: 40,
          contentBlocks: [
            {
              type: 'heading',
              text: 'E-Signature e Feature Flags',
              level: 'h2',
            },
            {
              type: 'paragraph',
              text: 'O bloco de E-Signature coleta assinaturas digitais dentro de workflows. Feature Flags controlam rollouts graduais e testes A/B por segmento.',
            },
            {
              type: 'diagram-animated',
              variant: 'flow',
              nodes: [
                { id: 'lead', label: 'Lead Aprovado', x: 60, y: 100, color: '#0d9488' },
                { id: 'contrato', label: 'Gerar Contrato\n(PDF template)', x: 240, y: 100, color: '#0f766e' },
                { id: 'esign', label: 'E-Signature\nBloco', x: 420, y: 100, color: '#0d9488', w: 120 },
                { id: 'aguarda', label: 'Aguarda\nAssinatura', x: 420, y: 220, color: '#f59e0b' },
                { id: 'signed', label: 'Contrato\nAssinado', x: 600, y: 100, color: '#10b981' },
                { id: 'billing', label: 'Ativar Billing\n(cobranca)', x: 780, y: 100, color: '#6366f1' },
              ],
              edges: [
                { from: 'lead', to: 'contrato', animated: true },
                { from: 'contrato', to: 'esign', label: 'envia para', animated: true },
                { from: 'esign', to: 'aguarda', label: 'wait state', animated: false },
                { from: 'aguarda', to: 'signed', label: 'evento: signed', animated: true },
                { from: 'signed', to: 'billing', animated: true },
              ],
              viewBox: { w: 940, h: 300 },
            } as ContentBlock,
            {
              type: 'diagram-animated',
              variant: 'sequence',
              nodes: [
                { id: 'client', label: 'Aplicacao\nCliente', x: 60, y: 30, color: '#0d9488' },
                { id: 'ff-service', label: 'Feature Flags\nService', x: 280, y: 30, color: '#0f766e', w: 140 },
                { id: 'targeting', label: 'Targeting\nRules', x: 500, y: 30, color: '#6366f1' },
                { id: 'client2', label: 'Aplicacao\nCliente', x: 60, y: 160, color: '#0d9488' },
                { id: 'result-on', label: 'Feature\nAtiva', x: 280, y: 160, color: '#10b981' },
                { id: 'result-off', label: 'Feature\nInativa', x: 500, y: 160, color: '#ef4444' },
              ],
              edges: [
                { from: 'client', to: 'ff-service', label: 'check flag', animated: true },
                { from: 'ff-service', to: 'targeting', label: 'avalia regras', animated: true },
                { from: 'targeting', to: 'result-on', label: 'beta-tester', animated: true },
                { from: 'targeting', to: 'result-off', label: 'fora do rollout', animated: true },
                { from: 'result-on', to: 'client2', label: 'true', animated: true },
                { from: 'result-off', to: 'client2', label: 'false', animated: true },
              ],
              viewBox: { w: 640, h: 230 },
            } as ContentBlock,
            {
              type: 'accordion-faq',
              items: [
                {
                  question: 'O que sao Feature Flags?',
                  answer: 'Chaves booleanas (ou com variantes) que controlam o comportamento da plataforma sem deploy. Podem ser segmentadas por organizacao, plano, usuario especifico ou percentual de trafego.',
                },
                {
                  question: 'Como funciona o rollout gradual?',
                  answer: 'Voce define um percentual (ex: 20%) e a Feature Flag e avaliada em runtime para cada usuario. Apenas a fracao configurada recebe o novo comportamento, permitindo validar funcionalidades com risco controlado.',
                },
                {
                  question: 'Posso usar Feature Flags em workflows?',
                  answer: 'Sim. A acao CONDITIONAL pode verificar o valor de uma Feature Flag para decidir qual caminho do workflow executar, permitindo comportamento diferenciado sem alterar o workflow.',
                },
              ],
            } as ContentBlock,
            {
              type: 'code',
              language: 'json',
              text: `// Exemplo de Feature Flag para rollout gradual
{
  "flagKey": "novo-editor-workflow",
  "description": "Novo editor visual de workflows (beta)",
  "defaultValue": false,
  "targeting": [
    {
      "segment": "beta-testers",
      "value": true
    },
    {
      "rollout": {
        "percentage": 20,
        "value": true
      }
    }
  ],
  "environments": {
    "staging": true,
    "production": false
  }
}`,
            } as ContentBlock,
            {
              type: 'sandbox',
              variant: 'workflow-builder',
              instructions: 'Monte um workflow que: 1) E disparado quando um Lead e aprovado 2) Gera e envia um contrato via E-Signature 3) Aguarda o evento de assinatura (wait state) 4) Quando assinado, atualiza o Lead para status "Cliente" e dispara o Billing. Use o sandbox para arrastar e conectar os blocos.',
              validation: {
                type: 'contains',
                expected: {
                  actions: ['esign-send', 'wait-event', 'update-lead', 'billing-activate'],
                },
              },
              solution: {
                trigger: { type: 'LEAD_UPDATED', condition: 'status == APROVADO' },
                actions: [
                  { id: 'esign-send', type: 'E_SIGNATURE', template: 'contrato-padrao' },
                  { id: 'wait-event', type: 'WAIT_EVENT', event: 'esign.signed', dependsOn: ['esign-send'] },
                  { id: 'update-lead', type: 'UPDATE_LEAD', status: 'CLIENTE', dependsOn: ['wait-event'] },
                  { id: 'billing-activate', type: 'BILLING_ACTIVATE', dependsOn: ['update-lead'] },
                ],
              },
              xpReward: 30,
            } as ContentBlock,
            {
              type: 'quiz',
              quizId: 'bb-flags-q1',
              variant: 'true-false',
              question: 'Verdadeiro ou Falso: Feature Flags permitem ativar uma nova funcionalidade apenas para 10% dos usuarios sem precisar fazer um novo deploy da aplicacao.',
              options: [
                { label: 'Verdadeiro', value: 'true' },
                { label: 'Falso', value: 'false' },
              ],
              correctAnswer: 'true',
              explanation: 'Exatamente! Feature Flags sao avaliados em runtime. A configuracao de rollout percentual distribui o novo comportamento para a fracao configurada dos usuarios sem nenhum deploy adicional.',
              xpBonus: 15,
            } as ContentBlock,
          ],
        },
      ],
    },
  ],
};
