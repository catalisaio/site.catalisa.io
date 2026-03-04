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
              type: 'paragraph',
              text: 'A Catalisa não é uma solução monolítica. É uma plataforma composta por 21 blocos independentes que podem ser ativados, combinados e configurados conforme a necessidade do seu negócio. Você paga e usa apenas o que precisa.',
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
                { id: 'billing', label: 'Billing &\nMeteração', x: 800, y: 120, color: '#0d9488' },
                { id: 'decision', label: 'Decision\nEngine', x: 80, y: 250, color: '#14b8a6' },
                { id: 'pricing', label: 'Pricing\nDinâmico', x: 220, y: 250, color: '#14b8a6' },
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
                { label: 'Blocos Incluídos' },
                { label: 'Disponível em' },
              ],
              rows: [
                { feature: 'Comunicação', values: ['', 'WhatsApp, E-mail, SMS, Push', 'Todos os planos'] },
                { feature: 'CRM', values: ['', 'Leads, Pipeline, Segmentação', 'Starter+'] },
                { feature: 'Automação', values: ['', 'Workflows, Triggers, Schedulers', 'Starter+'] },
                { feature: 'IA', values: ['', 'AI Agents, AI Assistant, AI Analytics', 'Pro+'] },
                { feature: 'Financeiro', values: ['', 'Billing, Pricing, Invoicing', 'Pro+'] },
                { feature: 'Compliance', values: ['', 'E-Signature, Audit Trail, LGPD', 'Enterprise'] },
                { feature: 'Dev Tools', values: ['', 'Feature Flags, Webhooks, API', 'Todos os planos'] },
              ],
            } as ContentBlock,
            {
              type: 'callout',
              variant: 'tip',
              title: 'Filosofia composável',
              text: 'Cada bloco expõe APIs REST e eventos padronizados. Isso significa que o Decision Engine pode disparar um Workflow que usa o Billing para cobrar, e o resultado pode ser enviado via WhatsApp — tudo sem código personalizado.',
            },
            {
              type: 'accordion-faq',
              items: [
                {
                  question: 'Posso ativar apenas os blocos que preciso?',
                  answer: 'Sim. O painel de administração permite ativar ou desativar módulos por organização. Módulos desativados não aparecem na interface e não geram custos de metering.',
                },
                {
                  question: 'Os blocos compartilham dados entre si?',
                  answer: 'Sim, através de um barramento de eventos interno. Quando um Lead é criado no CRM, o Workflow Engine recebe o evento. Quando um Workflow dispara o Billing, o resultado volta como evento para atualizar o Lead.',
                },
                {
                  question: 'Como sei quais blocos estão ativos na minha conta?',
                  answer: 'Acesse Configurações → Módulos. Você verá o status de cada bloco, data de ativação e métricas de uso dos últimos 30 dias.',
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
              explanation: 'E-Signature captura a assinatura → Workflows recebe o evento de assinatura concluída → Billing processa a cobrança. Os três blocos trabalham em sequência via o barramento de eventos da plataforma.',
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
              type: 'paragraph',
              text: 'O painel unifica todos os blocos em uma interface coerente. Você não precisa alternar entre sistemas diferentes — tudo está integrado. Veja como navegar e combinar blocos para casos de uso reais.',
            },
            {
              type: 'step-by-step',
              steps: [
                {
                  title: 'Navegação principal',
                  description: 'O menu lateral organiza os blocos em seções: Leads (CRM), Conversas (WhatsApp), Automação (Workflows), Agentes (IA) e Configurações. Módulos não ativos aparecem com um cadeado.',
                },
                {
                  title: 'Painel de Visão Geral',
                  description: 'O dashboard principal agrega métricas de todos os blocos ativos: leads captados hoje, mensagens enviadas, workflows executados e receita do período.',
                },
                {
                  title: 'Criando conexões entre blocos',
                  description: 'Ao criar um Workflow, você pode usar ações de qualquer bloco ativo. O editor de workflow lista todas as ações disponíveis organizadas por categoria de bloco.',
                },
                {
                  title: 'Monitoramento unificado',
                  description: 'O log de execuções unificado mostra eventos de todos os blocos em ordem cronológica. Filtros permitem ver apenas eventos de um bloco específico.',
                },
              ],
            } as ContentBlock,
            {
              type: 'mockui',
              variant: 'dashboard',
              interactionSteps: [
                { targetId: 'nav-leads', instruction: 'Clique em Leads para ver o CRM integrado', position: 'right' },
                { targetId: 'nav-automacao', instruction: 'Clique em Automação para acessar os Workflows', position: 'right' },
                { targetId: 'metric-card-workflows', instruction: 'Este card mostra execuções de Workflows hoje', position: 'bottom' },
                { targetId: 'metric-card-messages', instruction: 'Mensagens WhatsApp enviadas pelo bloco de comunicação', position: 'bottom' },
              ],
              initialData: {
                leadsHoje: 47,
                mensagensEnviadas: 312,
                workflowsExecutados: 89,
                receitaMes: 'R$ 18.450',
              },
            } as ContentBlock,
            {
              type: 'callout',
              variant: 'exercise',
              title: 'Pratique: Explore o painel',
              text: 'Use o MockUI acima para navegar pelos diferentes blocos. Observe como o dashboard centraliza informações de módulos distintos em uma visão única. Clique em cada card de métrica para ver o detalhamento.',
            },
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
              text: 'Decision Engine + Pricing Dinâmico',
              level: 'h2',
            },
            {
              type: 'paragraph',
              text: 'O Decision Engine avalia regras de negócio em tempo real para determinar aprovações, classificações e próximas etapas. Combinado com o Pricing Dinâmico, você cria sistemas de precificação baseados em perfil e comportamento.',
            },
            {
              type: 'diagram-animated',
              variant: 'flow',
              nodes: [
                { id: 'lead', label: 'Lead\nSubmete Proposta', x: 60, y: 140, color: '#0d9488' },
                { id: 'decision', label: 'Decision Engine\nAvalia Critérios', x: 250, y: 140, color: '#0f766e', w: 160 },
                { id: 'risk-a', label: 'Risco A\n(Baixo)', x: 470, y: 60, color: '#10b981' },
                { id: 'risk-b', label: 'Risco B\n(Médio)', x: 470, y: 140, color: '#f59e0b' },
                { id: 'risk-c', label: 'Risco C\n(Alto)', x: 470, y: 220, color: '#ef4444' },
                { id: 'pricing', label: 'Pricing Dinâmico\n(Calcula Oferta)', x: 660, y: 140, color: '#0d9488', w: 160 },
                { id: 'proposta', label: 'Proposta\nPersonalizada', x: 860, y: 140, color: '#6366f1' },
              ],
              edges: [
                { from: 'lead', to: 'decision', label: 'envia dados', animated: true },
                { from: 'decision', to: 'risk-a', label: 'score ≥ 80', animated: true },
                { from: 'decision', to: 'risk-b', label: '50 ≤ score < 80', animated: true },
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
              text: `// Configuração de regra no Decision Engine
{
  "name": "Classificação de Risco de Crédito",
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
              title: 'Simulação: Decision Engine em Ação',
              scenarios: [
                {
                  id: 'lead-risco-a',
                  label: 'Lead com Score Alto (Score: 92)',
                  description: 'Simule um lead de alto score passando pelo Decision Engine e recebendo oferta com desconto.',
                  steps: [
                    { instruction: 'Lead submete proposta com score 92', action: 'submit-high-score', feedback: 'Decision Engine avaliando... Score 92 ≥ 80 → Classificado como RISCO_A' },
                    { instruction: 'Pricing Dinâmico aplica multiplicador 0.85', action: 'apply-multiplier', feedback: 'Preço base R$ 1.200 × 0.85 = R$ 1.020 (desconto automático por baixo risco)' },
                    { instruction: 'Proposta gerada e enviada via WhatsApp', action: 'send-proposal', feedback: 'Mensagem WhatsApp enviada: "Sua proposta exclusiva: R$ 1.020/mês — válida por 48h"' },
                  ],
                },
                {
                  id: 'lead-risco-c',
                  label: 'Lead com Score Baixo (Score: 38)',
                  description: 'Veja como o Decision Engine encaminha leads de alto risco para revisão manual.',
                  steps: [
                    { instruction: 'Lead submete proposta com score 38', action: 'submit-low-score', feedback: 'Decision Engine avaliando... Score 38 < 50 → Classificado como RISCO_C' },
                    { instruction: 'Ação: REQUIRE_MANUAL_REVIEW disparada', action: 'trigger-review', feedback: 'Tarefa criada para o time de crédito. Lead marcado com tag "Revisão Manual".' },
                    { instruction: 'Notificação enviada ao responsável', action: 'notify-team', feedback: 'E-mail enviado: "Novo lead aguarda revisão de crédito: João Silva (score: 38)"' },
                  ],
                },
              ],
            } as ContentBlock,
            {
              type: 'quiz',
              quizId: 'bb-decision-q1',
              variant: 'multiple-choice',
              question: 'Uma empresa de seguros quer aplicar taxas diferentes baseadas na idade e histórico de sinistros do cliente. Qual combinação de blocos resolve isso sem código?',
              options: [
                { label: 'Apenas Workflows com ação CONDITIONAL', value: 'a' },
                { label: 'Decision Engine (classificar perfil) + Pricing Dinâmico (calcular taxa)', value: 'b' },
                { label: 'AI Agents para decidir e Billing para cobrar', value: 'c' },
                { label: 'Feature Flags para ativar taxas diferentes', value: 'd' },
              ],
              correctAnswer: 'b',
              explanation: 'O Decision Engine é projetado exatamente para classificação multi-critério (idade + histórico). O Pricing Dinâmico aplica multiplicadores baseados na classificação. Juntos, eliminam a necessidade de código e permitem auditoria completa das decisões.',
              xpBonus: 20,
            } as ContentBlock,
          ],
        },
        {
          slug: 'billing-webhooks',
          titleKey: 'courses.buildingBlocks.modules.blocosEmAcao.lessons.billingWebhooks',
          durationMin: 9,
          interactivity: 'medium',
          xpPoints: 40,
          contentBlocks: [
            {
              type: 'heading',
              text: 'Billing e Advanced Webhooks',
              level: 'h2',
            },
            {
              type: 'paragraph',
              text: 'O bloco de Billing gerencia planos, assinaturas e métricas de uso. Os Advanced Webhooks garantem entrega confiável de eventos para sistemas externos. Juntos, permitem integrar seu faturamento com qualquer ERP ou gateway de pagamento.',
            },
            {
              type: 'comparison-table',
              columns: [
                { label: 'Capacidade' },
                { label: 'Billing Block', highlighted: true },
                { label: 'Advanced Webhooks' },
              ],
              rows: [
                { feature: 'Propósito', values: ['', 'Gerenciar planos e cobranças', 'Entregar eventos externamente'] },
                { feature: 'Metering', values: ['', 'Sim (por uso, por assento)', 'Não aplicável'] },
                { feature: 'Retry automático', values: ['', 'Não (cobrança é síncrona)', 'Sim (até 10 tentativas)'] },
                { feature: 'HMAC-SHA256', values: ['', 'Não', 'Sim (verificação de autenticidade)'] },
                { feature: 'Dashboard de logs', values: ['', 'Faturas e pagamentos', 'Histórico de entregas'] },
                { feature: 'Integração nativa', values: ['', 'Stripe, PagSeguro, Asaas', 'Qualquer endpoint HTTPS'] },
              ],
            } as ContentBlock,
            {
              type: 'step-by-step',
              steps: [
                {
                  title: 'Configure seu plano de cobrança',
                  description: 'Em Configurações → Billing, crie um plano com nome, preço base, ciclo (mensal/anual) e limites de uso. Exemplo: "Plano Pro — R$ 299/mês — até 5 dispositivos WhatsApp".',
                },
                {
                  title: 'Ative a metering por uso',
                  description: 'Para cobrança variável, ative "Metering". Defina as métricas que serão contadas: mensagens enviadas, leads criados, workflows executados. Configure o preço por unidade excedente.',
                },
                {
                  title: 'Configure o webhook de billing',
                  description: 'Crie um Advanced Webhook que escuta eventos de billing: "payment.succeeded", "subscription.renewed", "invoice.overdue". Aponte para o endpoint do seu ERP.',
                },
                {
                  title: 'Teste o fluxo completo',
                  description: 'Use o modo teste do Billing para simular uma cobrança. Verifique nos logs do Advanced Webhook se o evento foi entregue com sucesso ao endpoint configurado.',
                },
              ],
            } as ContentBlock,
            {
              type: 'callout',
              variant: 'pro-tip',
              title: 'Assinatura HMAC nos webhooks',
              text: 'Sempre valide a assinatura HMAC-SHA256 nos seus endpoints que recebem Advanced Webhooks. O header "X-Catalisa-Signature" contém o hash do payload. Isso garante que os eventos vieram realmente da Catalisa e não de terceiros mal-intencionados.',
            },
            {
              type: 'code',
              language: 'typescript',
              text: `// Validação de HMAC-SHA256 no seu endpoint (Node.js/Express)
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

  // Processar o evento com segurança
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
              text: 'O bloco de E-Signature permite coletar assinaturas digitais juridicamente válidas dentro de workflows. Feature Flags controlam quais funcionalidades estão ativas para cada segmento de usuários, permitindo rollouts graduais e testes A/B.',
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
                { id: 'billing', label: 'Ativar Billing\n(cobrança)', x: 780, y: 100, color: '#6366f1' },
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
              type: 'paragraph',
              text: 'Feature Flags são chaves booleanas (ou com variantes) que controlam o comportamento da plataforma sem deploy. Elas podem ser segmentadas por organização, plano, usuário específico ou percentual de tráfego.',
            },
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
              instructions: 'Monte um workflow que: 1) É disparado quando um Lead é aprovado 2) Gera e envia um contrato via E-Signature 3) Aguarda o evento de assinatura (wait state) 4) Quando assinado, atualiza o Lead para status "Cliente" e dispara o Billing. Use o sandbox para arrastar e conectar os blocos.',
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
              question: 'Verdadeiro ou Falso: Feature Flags permitem ativar uma nova funcionalidade apenas para 10% dos usuários sem precisar fazer um novo deploy da aplicação.',
              options: [
                { label: 'Verdadeiro', value: 'true' },
                { label: 'Falso', value: 'false' },
              ],
              correctAnswer: 'true',
              explanation: 'Exatamente! Feature Flags são avaliados em runtime. A configuração de rollout percentual distribui o novo comportamento para a fração configurada dos usuários sem nenhum deploy adicional. Isso permite validar funcionalidades gradualmente com risco controlado.',
              xpBonus: 15,
            } as ContentBlock,
          ],
        },
      ],
    },
  ],
};
