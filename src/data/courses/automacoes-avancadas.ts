import type { Course } from '../trainingCourses';
import type { ContentBlock } from '../trainingBlockTypes';

export const automacoesAvancadasCourse: Course = {
  slug: 'automacoes-avancadas',
  titleKey: 'courses.automacoesAvancadas.title',
  descriptionKey: 'courses.automacoesAvancadas.description',
  durationKey: 'courses.automacoesAvancadas.duration',
  available: true,
  track: 'avancado',
  audience: 'todos',
  difficulty: 'avancado',
  prerequisites: ['construindo-workflows', 'agentes-ia'],
  colorScheme: 'orange',
  totalXP: 300,
  modules: [
    {
      slug: 'combinando-tudo',
      titleKey: 'courses.automacoesAvancadas.modules.combinandoTudo.title',
      descriptionKey: 'courses.automacoesAvancadas.modules.combinandoTudo.description',
      lessons: [
        {
          slug: 'workflows-agentes-run-agent',
          titleKey: 'courses.automacoesAvancadas.modules.combinandoTudo.lessons.workflowsAgentes',
          durationMin: 12,
          interactivity: 'high',
          xpPoints: 60,
          contentBlocks: [
            {
              type: 'heading',
              text: 'Workflows + Agentes de IA: O Poder do RUN_AGENT',
              level: 'h2',
            },
            {
              type: 'diagram-animated',
              variant: 'flow',
              nodes: [
                { id: 'trigger', label: 'Trigger\nLead Criado', x: 60, y: 180, color: '#ea580c' },
                { id: 'enrich', label: 'Enriquecer\nDados (HTTP)', x: 230, y: 180, color: '#f97316' },
                { id: 'agent', label: 'RUN_AGENT\n"Qualificador IA"', x: 420, y: 180, color: '#a855f7', w: 160 },
                { id: 'score-high', label: 'Score Alto\n(≥ 8)', x: 620, y: 80, color: '#10b981' },
                { id: 'score-low', label: 'Score Baixo\n(< 8)', x: 620, y: 280, color: '#ef4444' },
                { id: 'send-msg', label: 'Enviar Proposta\nWhatsApp', x: 820, y: 80, color: '#16a34a' },
                { id: 'nurture', label: 'Adicionar ao\nNurture Flow', x: 820, y: 280, color: '#6366f1' },
              ],
              edges: [
                { from: 'trigger', to: 'enrich', label: 'novo lead', animated: true },
                { from: 'enrich', to: 'agent', label: 'dados enriquecidos', animated: true },
                { from: 'agent', to: 'score-high', label: '{{actions.agente.output.score}} ≥ 8', animated: true },
                { from: 'agent', to: 'score-low', label: '{{actions.agente.output.score}} < 8', animated: true },
                { from: 'score-high', to: 'send-msg', animated: true },
                { from: 'score-low', to: 'nurture', animated: true },
              ],
              viewBox: { w: 980, h: 380 },
            } as ContentBlock,
            {
              type: 'code',
              language: 'json',
              text: `// Configuração da ação RUN_AGENT em um workflow
{
  "id": "qualificar-lead",
  "type": "RUN_AGENT",
  "config": {
    "agentId": "agent-qualificador-vendas",
    "message": "Avalie este lead e retorne um score de 0-10: Nome: {{trigger.payload.nome}}, Empresa: {{trigger.payload.empresa}}, Cargo: {{trigger.payload.cargo}}, Site: {{trigger.payload.site}}",
    "context": {
      "leadId": "{{trigger.payload.id}}",
      "source": "{{trigger.payload.source}}"
    },
    "outputSchema": {
      "score": { "type": "number", "min": 0, "max": 10 },
      "justificativa": { "type": "string" },
      "proximaAcao": { "type": "string", "enum": ["PROPOSTA", "NURTURE", "DESQUALIFICAR"] }
    },
    "maxTokens": 500,
    "timeout": 30000
  },
  "dependsOn": ["enriquecer-dados"]
}

// Usando o output na próxima ação:
// {{actions.qualificar-lead.output.score}}        → 8.5
// {{actions.qualificar-lead.output.proximaAcao}}  → "PROPOSTA"
// {{actions.qualificar-lead.output.justificativa}} → "Lead de empresa B2B..."`,
            } as ContentBlock,
            {
              type: 'callout',
              variant: 'pro-tip',
              title: 'Output Schema estruturado',
              text: 'Defina sempre um outputSchema explícito no RUN_AGENT. Isso força o AI Agent a retornar dados estruturados (JSON), não texto livre. Use os campos do output diretamente em ações CONDITIONAL subsequentes via {{actions.nomeAgente.output.campo}}.',
            },
            {
              type: 'mockui',
              variant: 'workflow-canvas',
              interactionSteps: [
                { targetId: 'node-trigger', instruction: 'Trigger: Lead Criado com campo "empresa" preenchido', position: 'bottom' },
                { targetId: 'node-send-msg', instruction: 'Ação HTTP: Buscar dados da empresa no Clearbit', position: 'right' },
                { targetId: 'node-agent', instruction: 'RUN_AGENT: Agente Qualificador analisa e retorna score', position: 'right' },
                { targetId: 'node-conditional', instruction: 'CONDITIONAL: score ≥ 8 → Proposta, else → Nurture', position: 'left' },
              ],
              initialData: {
                nodes: [
                  { id: 'trigger', type: 'LEAD_CREATED', label: 'Lead Criado' },
                  { id: 'enrich', type: 'WEB_REQUEST', label: 'Enriquecer (Clearbit)' },
                  { id: 'agent', type: 'AI_AGENT', label: 'Qualificador IA' },
                  { id: 'conditional', type: 'CONDITIONAL', label: 'Score ≥ 8?' },
                ],
              },
            } as ContentBlock,
            {
              type: 'sandbox',
              variant: 'workflow-builder',
              instructions: 'Construa um workflow que: 1) Dispara quando um lead é criado 2) Executa o agente "Qualificador de Leads" via RUN_AGENT passando nome, empresa e telefone 3) Usa CONDITIONAL para verificar se o output.score ≥ 7 4) Se sim: envia mensagem WhatsApp de boas-vindas ao time 5) Se não: adiciona tag "nurture" ao lead. Use variáveis de interpolação corretamente.',
              validation: {
                type: 'contains',
                expected: {
                  hasTrigger: 'LEAD_CREATED',
                  hasActions: ['RUN_AGENT', 'CONDITIONAL'],
                  usesOutputVariable: 'actions.*.output.score',
                },
              },
              solution: {
                trigger: { type: 'LEAD_CREATED' },
                actions: [
                  {
                    id: 'run-qualificador',
                    type: 'RUN_AGENT',
                    config: {
                      agentId: 'qualificador-leads',
                      message: 'Avalie: {{trigger.payload.nome}}, {{trigger.payload.empresa}}, {{trigger.payload.telefone}}',
                    },
                  },
                  {
                    id: 'verificar-score',
                    type: 'CONDITIONAL',
                    config: { condition: '{{actions.run-qualificador.output.score}} >= 7' },
                    dependsOn: ['run-qualificador'],
                  },
                  {
                    id: 'send-wpp',
                    type: 'SEND_MESSAGE',
                    config: { message: 'Novo lead qualificado: {{trigger.payload.nome}}' },
                    dependsOn: ['verificar-score'],
                    condition: 'true',
                  },
                  {
                    id: 'add-tag',
                    type: 'UPDATE_LEAD',
                    config: { tags: ['nurture'] },
                    dependsOn: ['verificar-score'],
                    condition: 'false',
                  },
                ],
              },
              xpReward: 40,
            } as ContentBlock,
            {
              type: 'quiz',
              quizId: 'adv-runagent-q1',
              variant: 'multiple-choice',
              question: 'Qual é a principal vantagem de usar outputSchema ao configurar um RUN_AGENT?',
              options: [
                { label: 'Aumenta a velocidade de resposta do AI Agent', value: 'a' },
                { label: 'Garante que o agente retorne JSON estruturado que pode ser usado em ações CONDITIONAL', value: 'b' },
                { label: 'Reduz o custo de tokens do modelo de linguagem', value: 'c' },
                { label: 'Permite que o agente acesse mais ferramentas', value: 'd' },
              ],
              correctAnswer: 'b',
              explanation: 'O outputSchema instrui o AI Agent a sempre retornar dados no formato JSON especificado. Sem ele, o agente retorna texto livre que não pode ser usado diretamente em condicionais. Com ele, você pode fazer {{actions.agente.output.score}} >= 8 em um CONDITIONAL.',
              xpBonus: 20,
            } as ContentBlock,
          ],
        },
        {
          slug: 'multi-step-dag',
          titleKey: 'courses.automacoesAvancadas.modules.combinandoTudo.lessons.multiStepDag',
          durationMin: 12,
          interactivity: 'high',
          xpPoints: 65,
          contentBlocks: [
            {
              type: 'heading',
              text: 'Workflows Multi-Step com DAG de Dependências',
              level: 'h2',
            },
            {
              type: 'diagram-animated',
              variant: 'flow',
              nodes: [
                { id: 'trigger', label: 'Trigger\nLead Aprovado', x: 60, y: 200, color: '#ea580c' },
                { id: 'p1', label: 'Buscar CEP\n(paralelo 1)', x: 250, y: 100, color: '#0d9488' },
                { id: 'p2', label: 'Validar CPF\n(paralelo 2)', x: 250, y: 200, color: '#0d9488' },
                { id: 'p3', label: 'Score IA\n(paralelo 3)', x: 250, y: 300, color: '#a855f7' },
                { id: 'join', label: 'JOIN\n(aguarda tudo)', x: 460, y: 200, color: '#f59e0b', w: 120 },
                { id: 'decision', label: 'CONDITIONAL\nTodos Válidos?', x: 640, y: 200, color: '#6366f1', w: 140 },
                { id: 'approve', label: 'Aprovar\ne Notificar', x: 840, y: 120, color: '#10b981' },
                { id: 'review', label: 'Revisão\nManual', x: 840, y: 280, color: '#ef4444' },
              ],
              edges: [
                { from: 'trigger', to: 'p1', animated: true },
                { from: 'trigger', to: 'p2', animated: true },
                { from: 'trigger', to: 'p3', animated: true },
                { from: 'p1', to: 'join', animated: true },
                { from: 'p2', to: 'join', animated: true },
                { from: 'p3', to: 'join', animated: true },
                { from: 'join', to: 'decision', animated: true },
                { from: 'decision', to: 'approve', label: 'todos OK', animated: true },
                { from: 'decision', to: 'review', label: 'algum falhou', animated: true },
              ],
              viewBox: { w: 1000, h: 420 },
            } as ContentBlock,
            {
              type: 'code',
              language: 'json',
              text: `// Workflow com ações paralelas via dependsOn
{
  "trigger": { "type": "LEAD_UPDATED", "condition": "status == APROVADO" },
  "actions": [
    // Grupo 1: Rodam em PARALELO (sem dependsOn)
    {
      "id": "buscar-cep",
      "type": "CUSTOM_ACTION",
      "actionId": "buscar-endereco-cep",
      "config": { "cep": "{{trigger.payload.cep}}" }
    },
    {
      "id": "validar-cpf",
      "type": "CUSTOM_ACTION",
      "actionId": "validar-cpf-receita",
      "config": { "cpf": "{{trigger.payload.cpf}}" }
    },
    {
      "id": "score-ia",
      "type": "RUN_AGENT",
      "config": {
        "agentId": "analisador-credito",
        "message": "Score para: {{trigger.payload.nome}}"
      }
    },

    // Grupo 2: Roda DEPOIS de todas do Grupo 1
    {
      "id": "decidir-aprovacao",
      "type": "CONDITIONAL",
      "dependsOn": ["buscar-cep", "validar-cpf", "score-ia"],
      "config": {
        "condition": "{{actions.validar-cpf.output.valido}} == true AND {{actions.score-ia.output.score}} >= 7"
      }
    },

    // Grupo 3: Ramificações após a decisão
    {
      "id": "aprovar-lead",
      "type": "UPDATE_LEAD",
      "dependsOn": ["decidir-aprovacao"],
      "condition": "true",
      "config": { "status": "CLIENTE" }
    },
    {
      "id": "notificar-wpp",
      "type": "SEND_MESSAGE",
      "dependsOn": ["aprovar-lead"],
      "config": { "message": "Parabéns {{trigger.payload.nome}}! Proposta aprovada." }
    }
  ]
}`,
            } as ContentBlock,
            {
              type: 'callout',
              variant: 'important',
              title: 'Dependências circulares são rejeitadas',
              text: 'O sistema valida o DAG antes de salvar o workflow. Se detectar uma dependência circular (A depende de B que depende de A), a criação do workflow falha com erro "Circular dependency detected". Use dependsOn apenas para expressar dependências reais de dados.',
            },
            {
              type: 'interactive-demo',
              title: 'Execucao de DAG Passo a Passo',
              scenarios: [
                {
                  id: 'parallel-execution',
                  label: 'Acoes Paralelas e Join',
                  description: 'Veja como o executor processa acoes em paralelo e sincroniza no join.',
                  steps: [
                    { instruction: 'Trigger LEAD_UPDATED dispara o workflow', action: 'trigger-fire', feedback: 'Trigger ativado. 3 acoes sem dependsOn identificadas: buscar-cep, validar-cpf, score-ia. Iniciando execucao paralela.' },
                    { instruction: 'Buscar CEP completa primeiro (0.2s)', action: 'cep-done', feedback: 'buscar-cep: SUCCESS (0.2s). Output: { logradouro: "Av Paulista", cidade: "Sao Paulo" }. Aguardando validar-cpf e score-ia.' },
                    { instruction: 'Score IA e Validar CPF completam (1.2s e 0.8s)', action: 'all-parallel-done', feedback: 'validar-cpf: SUCCESS (0.8s, valido: true). score-ia: SUCCESS (1.2s, score: 8.5). Todas dependencias de decidir-aprovacao satisfeitas.' },
                    { instruction: 'CONDITIONAL avalia os resultados combinados', action: 'conditional-eval', feedback: 'Condicao: valido == true AND score >= 7 → TRUE. Ramificacao "true" selecionada. Tempo total paralelo: 1.2s (nao 2.2s sequencial).' },
                  ],
                },
                {
                  id: 'dependency-failure',
                  label: 'Falha em Dependencia',
                  description: 'Observe o comportamento quando uma acao paralela falha.',
                  steps: [
                    { instruction: 'Trigger dispara as 3 acoes em paralelo', action: 'trigger-fire-fail', feedback: '3 acoes iniciadas em paralelo: buscar-cep, validar-cpf, score-ia.' },
                    { instruction: 'validar-cpf falha com timeout', action: 'cpf-timeout', feedback: 'validar-cpf: FAILED (timeout 30s). Erro: "Receita Federal API unavailable". buscar-cep e score-ia completaram OK.' },
                    { instruction: 'decidir-aprovacao nao executa', action: 'skip-conditional', feedback: 'decidir-aprovacao: SKIPPED. Motivo: dependencia "validar-cpf" falhou. Acoes dependentes cascateiam o skip.' },
                    { instruction: 'Workflow finaliza com status FAILED', action: 'workflow-failed', feedback: 'Execucao: FAILED. 2 SUCCESS, 1 FAILED, 3 SKIPPED. Disponivel para reexecucao a partir de validar-cpf.' },
                  ],
                },
              ],
            } as ContentBlock,
            {
              type: 'sandbox',
              variant: 'variable-interpolation',
              instructions: 'Pratique interpolação de variáveis em um workflow multi-step. Complete as expressões: 1) Nome do lead: _____ (do trigger) 2) Score retornado pelo agente "analisador": _____ 3) Endereço retornado pela action "buscar-cep": _____ 4) Condição para score >= 8: _____',
              validation: {
                type: 'exact',
                expected: {
                  var1: '{{trigger.payload.nome}}',
                  var2: '{{actions.analisador.output.score}}',
                  var3: '{{actions.buscar-cep.output.logradouro}}',
                  var4: '{{actions.analisador.output.score}} >= 8',
                },
              },
              solution: {
                var1: '{{trigger.payload.nome}}',
                var2: '{{actions.analisador.output.score}}',
                var3: '{{actions.buscar-cep.output.logradouro}}',
                var4: '{{actions.analisador.output.score}} >= 8',
              },
              xpReward: 30,
            } as ContentBlock,
            {
              type: 'quiz',
              quizId: 'adv-dag-q1',
              variant: 'multiple-choice',
              question: 'Em um DAG de workflow, ações A, B e C não têm dependsOn. Ação D tem dependsOn: [A, B, C]. Qual é o comportamento correto de execução?',
              options: [
                { label: 'A, B e C rodam sequencialmente, depois D', value: 'sequential' },
                { label: 'A, B e C rodam em paralelo simultaneamente, D inicia somente quando todas as três completam', value: 'parallel' },
                { label: 'D roda primeiro, depois A, B e C', value: 'reverse' },
                { label: 'O sistema decide a ordem baseado no tempo de execução esperado', value: 'dynamic' },
              ],
              correctAnswer: 'parallel',
              explanation: 'Ações sem dependsOn são executadas em paralelo no início do workflow. D só começa quando A, B e C todas completam com sucesso. Isso é o principal benefício do DAG: maximiza paralelismo e minimiza tempo total de execução.',
              xpBonus: 25,
            } as ContentBlock,
          ],
        },
      ],
    },
    {
      slug: 'cenarios-reais',
      titleKey: 'courses.automacoesAvancadas.modules.cenariosReais.title',
      descriptionKey: 'courses.automacoesAvancadas.modules.cenariosReais.description',
      lessons: [
        {
          slug: 'lead-capture-qualificacao',
          titleKey: 'courses.automacoesAvancadas.modules.cenariosReais.lessons.leadCapture',
          durationMin: 12,
          interactivity: 'high',
          xpPoints: 60,
          contentBlocks: [
            {
              type: 'heading',
              text: 'Cenário Real: Lead Capture e Qualificação Automática',
              level: 'h2',
            },
            {
              type: 'paragraph',
              text: 'Jornada completa: do formulario web ao primeiro contato no WhatsApp, com qualificacao automatica por IA.',
            },
            {
              type: 'step-by-step',
              steps: [
                {
                  title: 'Webhook de entrada (formulário web)',
                  description: 'Configure um IncomingWebhook no painel para receber dados do formulário. URL gerada: https://panel-api.catalisa.app/webhooks/incoming/abc123. Configure o CORS do formulário para apontar para essa URL.',
                },
                {
                  title: 'Trigger do workflow',
                  description: 'Crie um workflow com trigger WEBHOOK_RECEIVED apontando para o IncomingWebhook configurado. O payload do formulário (nome, email, telefone, empresa) estará disponível em {{trigger.payload.*}}.',
                },
                {
                  title: 'Criar lead automaticamente',
                  description: 'Primeira ação: CREATE_LEAD com os dados do trigger. Configure mapeamento: nome → {{trigger.payload.name}}, email → {{trigger.payload.email}}, telefone → {{trigger.payload.phone}}.',
                },
                {
                  title: 'Qualificação paralela',
                  description: 'Execute em paralelo: 1) RUN_AGENT "Qualificador" para analisar o perfil 2) Custom Action HTTP para buscar dados da empresa no LinkedIn (se empresa preenchida). Use dependsOn para juntar os resultados.',
                },
                {
                  title: 'Roteamento por score',
                  description: 'CONDITIONAL: score >= 8 → Atribuir ao vendedor sênior + enviar WhatsApp personalizado. score 5-7 → Adicionar à sequência de nurture. score < 5 → Marcar como "Cold" e só contatar se demonstrar interesse.',
                },
                {
                  title: 'Primeiro contato WhatsApp',
                  description: 'Para leads qualificados (score ≥ 8): SEND_MESSAGE com mensagem personalizada usando {{actions.qualificador.output.abordagem}} para usar a sugestão de abordagem gerada pela IA.',
                },
              ],
            } as ContentBlock,
            {
              type: 'diagram-animated',
              variant: 'flow',
              nodes: [
                { id: 'form', label: 'Formulário\nWeb', x: 40, y: 180, color: '#6366f1' },
                { id: 'webhook', label: 'Incoming\nWebhook', x: 200, y: 180, color: '#7c3aed' },
                { id: 'create-lead', label: 'CREATE\nLEAD', x: 360, y: 180, color: '#ea580c' },
                { id: 'qual', label: 'RUN_AGENT\nQualificador', x: 520, y: 100, color: '#a855f7' },
                { id: 'enrich', label: 'Custom Action\nLinkedIn', x: 520, y: 260, color: '#0d9488' },
                { id: 'cond', label: 'CONDITIONAL\nScore?', x: 700, y: 180, color: '#f59e0b', w: 120 },
                { id: 'hot', label: 'Hot Lead\n(≥ 8)', x: 880, y: 80, color: '#10b981' },
                { id: 'warm', label: 'Warm Lead\n(5-7)', x: 880, y: 180, color: '#84cc16' },
                { id: 'cold', label: 'Cold Lead\n(< 5)', x: 880, y: 280, color: '#6b7280' },
              ],
              edges: [
                { from: 'form', to: 'webhook', label: 'POST', animated: true },
                { from: 'webhook', to: 'create-lead', animated: true },
                { from: 'create-lead', to: 'qual', animated: true },
                { from: 'create-lead', to: 'enrich', animated: true },
                { from: 'qual', to: 'cond', animated: true },
                { from: 'enrich', to: 'cond', animated: true },
                { from: 'cond', to: 'hot', label: '≥ 8', animated: true },
                { from: 'cond', to: 'warm', label: '5-7', animated: true },
                { from: 'cond', to: 'cold', label: '< 5', animated: true },
              ],
              viewBox: { w: 1020, h: 380 },
            } as ContentBlock,
            {
              type: 'sandbox',
              variant: 'trigger-config',
              instructions: 'Configure o trigger para o cenario de lead capture: 1) Selecione o tipo de trigger WEBHOOK_RECEIVED 2) Aponte para o IncomingWebhook "Formulario Site" 3) Defina os campos esperados no payload: name (string), email (string), phone (string), empresa (string, opcional) 4) Adicione uma condicao: phone deve estar preenchido (nao vazio).',
              validation: {
                type: 'contains',
                expected: {
                  triggerType: 'WEBHOOK_RECEIVED',
                  hasPayloadFields: ['name', 'email', 'phone'],
                  hasCondition: true,
                },
              },
              solution: {
                trigger: {
                  type: 'WEBHOOK_RECEIVED',
                  webhookId: 'formulario-site',
                  payloadSchema: {
                    name: { type: 'string', required: true },
                    email: { type: 'string', required: true },
                    phone: { type: 'string', required: true },
                    empresa: { type: 'string', required: false },
                  },
                  condition: '{{trigger.payload.phone}} != ""',
                },
              },
              xpReward: 30,
            } as ContentBlock,
            {
              type: 'mockui',
              variant: 'dashboard',
              interactionSteps: [
                { targetId: 'stat-leads', instruction: 'Leads captados pelo formulário nas últimas 24h', position: 'bottom' },
                { targetId: 'stat-conversion', instruction: 'Percentual de leads qualificados como "Hot" pelo AI Agent', position: 'bottom' },
                { targetId: 'stat-messages', instruction: 'Tempo médio do formulário ao primeiro contato WhatsApp', position: 'bottom' },
              ],
              initialData: {
                leadsHoje: 23,
                leadsHot: 8,
                leadsWarm: 11,
                leadsCold: 4,
                taxaQualificacao: '34.7%',
                tempoMedioContato: '47 segundos',
              },
            } as ContentBlock,
            {
              type: 'interactive-demo',
              title: 'Simulação: Lead Capture Completo',
              scenarios: [
                {
                  id: 'full-capture',
                  label: 'Formulário → Qualificação → WhatsApp',
                  description: 'Acompanhe a jornada completa de um lead desde o formulário web até o primeiro contato.',
                  steps: [
                    {
                      instruction: 'Formulário web envia dados: nome "Ana Costa", email "ana@empresa.com", telefone "+5511988887777".',
                      action: 'form-submit',
                      feedback: 'IncomingWebhook recebeu o payload. Workflow "Lead Capture" disparado.',
                    },
                    {
                      instruction: 'CREATE_LEAD cria o registro no CRM.',
                      action: 'create-lead',
                      feedback: 'Lead criado: Ana Costa (ID: lead-abc). Tipo: PROSPECT. Status: Novo.',
                    },
                    {
                      instruction: 'RUN_AGENT "Qualificador" analisa o perfil.',
                      action: 'run-agent',
                      feedback: 'Score: 8.2/10. Justificativa: "Empresa B2B, cargo de decisão". Próxima ação: PROPOSTA.',
                    },
                    {
                      instruction: 'SEND_MESSAGE envia proposta personalizada via WhatsApp.',
                      action: 'send-proposal',
                      feedback: 'Mensagem enviada: "Olá Ana! Notei que sua empresa pode se beneficiar do nosso CRM..."',
                    },
                  ],
                },
              ],
            } as ContentBlock,
          ],
        },
        {
          slug: 'follow-ups-automaticos',
          titleKey: 'courses.automacoesAvancadas.modules.cenariosReais.lessons.followUps',
          durationMin: 12,
          interactivity: 'high',
          xpPoints: 60,
          contentBlocks: [
            {
              type: 'heading',
              text: 'Follow-ups Automáticos e Sequências de Nutrição',
              level: 'h2',
            },
            {
              type: 'accordion-faq',
              items: [
                {
                  question: 'O que sao follow-ups automaticos?',
                  answer: 'Sequencias de mensagens enviadas ao longo do tempo para nutrir leads que ainda nao estao prontos para comprar. A chave e personalizacao baseada em comportamento e respeito ao opt-out.',
                },
                {
                  question: 'Qual a diferenca entre DELAY e agendar um horario fixo?',
                  answer: 'DELAY e relativo ao momento da acao anterior (ex: "48h depois"). Agendar horario fixo usa CRON ou data especifica. Para follow-ups, DELAY e preferivel pois respeita o ritmo individual de cada lead.',
                },
                {
                  question: 'Quantos follow-ups devo enviar antes de parar?',
                  answer: 'A pratica recomendada e 3-5 tentativas com intervalos crescentes (ex: 24h, 48h, 72h, 1 semana). Apos o ultimo, marque o lead como "Cold" e encerre a sequencia. Sempre respeite opt-out imediato.',
                },
              ],
            } as ContentBlock,
            {
              type: 'code',
              language: 'json',
              text: `// Workflow de Follow-up com DELAY e condicionais
{
  "trigger": { "type": "LEAD_UPDATED", "condition": "status == WARM" },
  "actions": [
    // Dia 0: Mensagem inicial
    {
      "id": "msg-dia-0",
      "type": "SEND_MESSAGE",
      "config": {
        "jid": "{{trigger.payload.phone}}@s.whatsapp.net",
        "message": "Olá {{trigger.payload.nome}}! Vi que você se interessou por {{trigger.payload.produto}}. Posso enviar mais informações?"
      }
    },

    // Aguardar 24h
    {
      "id": "delay-1",
      "type": "DELAY",
      "dependsOn": ["msg-dia-0"],
      "config": { "duration": "24h" }
    },

    // Verificar se respondeu (opt-out detection)
    {
      "id": "verificar-resposta",
      "type": "CONDITIONAL",
      "dependsOn": ["delay-1"],
      "config": {
        "condition": "{{lead.tags}} includes 'opt-out' OR {{lead.lastReply}} > '{{delay-1.startedAt}}'"
      }
    },

    // Se respondeu: parar a sequência
    {
      "id": "parar-nurture",
      "type": "UPDATE_LEAD",
      "dependsOn": ["verificar-resposta"],
      "condition": "responded",
      "config": { "tags": ["em-atendimento"] }
    },

    // Se não respondeu: segundo follow-up (dia 2)
    {
      "id": "msg-dia-2",
      "type": "SEND_MESSAGE",
      "dependsOn": ["verificar-resposta"],
      "condition": "no-response",
      "config": {
        "message": "{{trigger.payload.nome}}, deixo aqui um caso de sucesso que pode ser relevante para você: [link]"
      }
    }
  ]
}`,
            } as ContentBlock,
            {
              type: 'callout',
              variant: 'warning',
              title: 'Respeite o opt-out — é lei',
              text: 'A LGPD e as políticas da Meta exigem que mensagens de marketing parem imediatamente quando o usuário solicitar. Configure detecção automática de opt-out: palavras como "PARAR", "SAIR", "STOP", "NÃO QUERO" devem interromper qualquer sequência ativa do lead.',
            },
            {
              type: 'interactive-demo',
              title: 'Sequência de Follow-up em Ação',
              scenarios: [
                {
                  id: 'lead-engaja',
                  label: 'Lead Engaja na Sequência',
                  description: 'Veja como a sequência se comporta quando o lead responde positivamente.',
                  steps: [
                    { instruction: 'Dia 0: Mensagem inicial enviada para João', action: 'send-day0', feedback: 'Mensagem entregue: "Olá João! Vi que você se interessou por CRM..." Status: delivered ✓' },
                    { instruction: 'Delay de 24h iniciado', action: 'start-delay', feedback: 'Timer iniciado. Próxima verificação em 24h. Workflow em estado wait.' },
                    { instruction: 'João responde: "Sim, me conta mais!"', action: 'lead-replies', feedback: 'Evento messages.upsert capturado. Tag "respondeu" adicionada ao lead. Opt-out: false.' },
                    { instruction: 'CONDITIONAL detecta resposta, para sequência', action: 'detect-reply', feedback: 'Condição verdadeira: lastReply > delay.startedAt. Sequência de nurture pausada. Notificação enviada ao vendedor.' },
                  ],
                },
                {
                  id: 'lead-nao-engaja',
                  label: 'Lead Não Responde',
                  description: 'Acompanhe a sequência automática para leads que não interagem.',
                  steps: [
                    { instruction: 'Dia 0: Mensagem enviada. Sem resposta.', action: 'send-no-reply', feedback: 'Status: read ✓ (leu mas não respondeu). Timer de 24h ativo.' },
                    { instruction: 'Verificação: sem resposta após 24h', action: 'check-no-reply', feedback: 'Condição no-response = true. Avançando para follow-up do dia 2.' },
                    { instruction: 'Dia 2: Segundo follow-up enviado', action: 'send-day2', feedback: 'Mensagem com case de sucesso enviada. Novo timer de 48h iniciado.' },
                    { instruction: 'Sequência continua ou expira após N tentativas', action: 'expire-sequence', feedback: 'Após 5 tentativas sem resposta, lead marcado como "Cold" e sequência encerrada.' },
                  ],
                },
              ],
            } as ContentBlock,
            {
              type: 'sandbox',
              variant: 'workflow-builder',
              instructions: 'Monte uma sequência de follow-up de 3 etapas: 1) Mensagem inicial imediata 2) Delay de 48h 3) Verificação de opt-out (se contém tag "parar") 4) Se não opt-out: segundo follow-up com link para demonstração 5) Delay de 72h 6) Terceiro follow-up perguntando se ainda tem interesse. Use DELAY, CONDITIONAL e SEND_MESSAGE.',
              validation: {
                type: 'contains',
                expected: {
                  actions: ['SEND_MESSAGE', 'DELAY', 'CONDITIONAL', 'SEND_MESSAGE', 'DELAY', 'SEND_MESSAGE'],
                  hasOptOutCheck: true,
                },
              },
              solution: {
                trigger: { type: 'LEAD_UPDATED', condition: 'status == WARM' },
                actions: [
                  { id: 'msg-1', type: 'SEND_MESSAGE', config: { message: 'Olá! Posso te ajudar?' } },
                  { id: 'delay-1', type: 'DELAY', config: { duration: '48h' }, dependsOn: ['msg-1'] },
                  { id: 'check-optout', type: 'CONDITIONAL', config: { condition: '!lead.tags.includes("parar")' }, dependsOn: ['delay-1'] },
                  { id: 'msg-2', type: 'SEND_MESSAGE', config: { message: 'Confira nossa demo: [link]' }, dependsOn: ['check-optout'], condition: 'true' },
                  { id: 'delay-2', type: 'DELAY', config: { duration: '72h' }, dependsOn: ['msg-2'] },
                  { id: 'msg-3', type: 'SEND_MESSAGE', config: { message: 'Ainda tem interesse?' }, dependsOn: ['delay-2'] },
                ],
              },
              xpReward: 35,
            } as ContentBlock,
            {
              type: 'quiz',
              quizId: 'adv-followup-q1',
              variant: 'true-false',
              question: 'Verdadeiro ou Falso: Um workflow com ação DELAY fica bloqueando recursos do servidor enquanto aguarda o tempo configurado.',
              options: [
                { label: 'Verdadeiro', value: 'true' },
                { label: 'Falso', value: 'false' },
              ],
              correctAnswer: 'false',
              explanation: 'Falso! A ação DELAY persiste o estado do workflow no banco de dados e libera o processo completamente. Quando o tempo expira, um scheduler reativa o workflow do ponto onde parou. Você pode ter milhares de workflows em estado "wait" sem impacto na performance.',
              xpBonus: 15,
            } as ContentBlock,
          ],
        },
        {
          slug: 'monitoramento-metricas',
          titleKey: 'courses.automacoesAvancadas.modules.cenariosReais.lessons.monitoramento',
          durationMin: 12,
          interactivity: 'high',
          xpPoints: 55,
          contentBlocks: [
            {
              type: 'heading',
              text: 'Monitoramento, Métricas e Otimização de Workflows',
              level: 'h2',
            },
            {
              type: 'paragraph',
              text: 'O painel Catalisa oferece observabilidade completa para suas automacoes.',
            },
            {
              type: 'mockui',
              variant: 'dashboard',
              interactionSteps: [
                { targetId: 'chart-area', instruction: 'Execuções de workflows nas últimas 24h por status', position: 'top' },
                { targetId: 'activity-feed', instruction: 'Workflows com falha — clique para ver o log detalhado', position: 'right' },
                { targetId: 'stat-agents', instruction: 'Tempo médio de execução por workflow', position: 'bottom' },
                { targetId: 'stat-leads', instruction: 'Taxa de sucesso geral (meta: > 99%)', position: 'left' },
              ],
              initialData: {
                execucoesHoje: 1847,
                executandoAgora: 23,
                falhas: 12,
                taxaSucesso: '99.3%',
                tempoMedio: '2.4s',
                topWorkflows: [
                  { nome: 'Qualificação de Lead', execucoes: 892, taxaSucesso: '99.8%' },
                  { nome: 'Follow-up Automático', execucoes: 654, taxaSucesso: '98.9%' },
                  { nome: 'Onboarding Cliente', execucoes: 301, taxaSucesso: '100%' },
                ],
              },
            } as ContentBlock,
            {
              type: 'step-by-step',
              steps: [
                {
                  title: 'Acessar logs de execução',
                  description: 'Em "Automação" → "Execuções", você vê todas as execuções em tempo real e histórico. Filtre por workflow, status (success/failed/running), período e lead específico.',
                },
                {
                  title: 'Diagnosticar falhas',
                  description: 'Clique em uma execução com falha para ver o timeline completo: quais ações rodaram, qual falhou, o erro exato e o payload no momento da falha. Isso permite reproduzir e corrigir o problema.',
                },
                {
                  title: 'Reexecutar workflows falhos',
                  description: 'Para falhas causadas por indisponibilidade temporária de API externa, use "Reexecutar" na execução. O workflow retoma a partir da ação que falhou, não do início.',
                },
                {
                  title: 'Configurar alertas',
                  description: 'Em "Alertas", configure notificações por email ou WhatsApp quando: taxa de sucesso cair abaixo de 95%, uma ação específica falhar X vezes seguidas, ou tempo de execução ultrapassar um threshold.',
                },
                {
                  title: 'Analisar métricas de performance',
                  description: 'O painel de métricas mostra tempo médio por ação, ações mais lentas (gargalos), volume de execuções ao longo do tempo e correlação entre horários e taxas de falha.',
                },
              ],
            } as ContentBlock,
            {
              type: 'callout',
              variant: 'pro-tip',
              title: 'Idempotência nas ações',
              text: 'Configure ações críticas como idempotentes: use o campo "idempotencyKey" com um identificador único (ex: "{{trigger.payload.leadId}}-send-welcome") para garantir que, mesmo que o workflow seja reexecutado, a mensagem WhatsApp não seja enviada duas vezes ao mesmo lead.',
            },
            {
              type: 'accordion-faq',
              items: [
                {
                  question: 'Por quanto tempo os logs de execução são mantidos?',
                  answer: 'Logs são mantidos por 90 dias no plano Pro e 365 dias no plano Enterprise. Você pode exportar logs em formato JSON ou CSV para armazenamento próprio a qualquer momento.',
                },
                {
                  question: 'Como identificar qual ação está causando lentidão no workflow?',
                  answer: 'O timeline de execução mostra o tempo de cada ação individualmente. Ações com "duration > 5000ms" são destacadas em amarelo. Normalmente, ações HTTP_WEBHOOK que chamam APIs externas lentas são os maiores gargalos.',
                },
                {
                  question: 'É possível pausar todos os workflows de um lead específico?',
                  answer: 'Sim. Na página do lead, acesse a aba "Automações" e clique em "Pausar todas as execuções ativas". Isso para imediatamente qualquer workflow em estado wait (DELAY ou aguardando evento) para aquele lead.',
                },
                {
                  question: 'Workflows falhos afetam o faturamento?',
                  answer: 'Ações que falharam antes de completar não são cobradas pelo sistema de metering. Apenas execuções bem-sucedidas contam para o uso. Verifique a política exata no seu plano em Configurações → Billing.',
                },
              ],
            } as ContentBlock,
            {
              type: 'sandbox',
              variant: 'variable-interpolation',
              instructions: 'Configure alertas de monitoramento usando variáveis: 1) Para acessar a taxa de sucesso de um workflow: {{workflow.successRate}} 2) Para acessar o tempo médio de execução: {{workflow.avgDuration}} 3) Para acessar o número de falhas nas últimas 24h: {{workflow.failedLast24h}}. Complete os campos do alerta.',
              validation: {
                type: 'contains',
                expected: { successRate: '{{workflow.successRate}}' },
              },
              xpReward: 20,
            } as ContentBlock,
            {
              type: 'interactive-demo',
              title: 'Diagnóstico de Workflow Falho',
              scenarios: [
                {
                  id: 'diagnose-failure',
                  label: 'Investigar Falha de API Externa',
                  description: 'Um workflow de qualificação está falhando. Investigue e corrija o problema.',
                  steps: [
                    { instruction: 'Acesse Execuções e filtre por status "failed"', action: 'filter-failed', feedback: '12 execuções falhas encontradas nas últimas 2h. Todas no workflow "Qualificação de Lead".' },
                    { instruction: 'Clique na execução mais recente para ver o timeline', action: 'view-timeline', feedback: 'Timeline: ✓ CREATE_LEAD (0.3s) → ✓ DELAY (0ms) → ✗ CUSTOM_ACTION buscar-cep (timeout após 30s)' },
                    { instruction: 'Inspecione o erro da ação buscar-cep', action: 'inspect-error', feedback: 'Erro: "Request timeout: ViaCEP API not responding". URL: https://viacep.com.br/ws/01310-100/json/' },
                    { instruction: 'Adicione retry automático na Custom Action', action: 'add-retry', feedback: 'Retry configurado: 3 tentativas com backoff de 5s. Ações futuras terão resiliência a timeouts.' },
                    { instruction: 'Reexecute as 12 execuções falhas', action: 'reexecute-all', feedback: '12/12 execuções reexecutadas com sucesso. ViaCEP estava temporariamente indisponível.' },
                  ],
                },
              ],
            } as ContentBlock,
            {
              type: 'quiz',
              quizId: 'adv-monitor-q1',
              variant: 'multiple-choice',
              question: 'Seu workflow de "Envio de Proposta" está sendo executado mas os leads reclamam que estão recebendo a mensagem duas vezes. Qual é a causa mais provável e como resolver?',
              options: [
                { label: 'Bug no workflow — reescrever do zero', value: 'a' },
                { label: 'O workflow está sendo disparado duas vezes pelo mesmo evento — use idempotencyKey na ação SEND_MESSAGE', value: 'b' },
                { label: 'O WhatsApp tem delay e entrega em duplicata', value: 'c' },
                { label: 'Problema no servidor — reiniciar o worker', value: 'd' },
              ],
              correctAnswer: 'b',
              explanation: 'Mensagens duplicadas geralmente indicam que o workflow foi disparado duas vezes (ex: dois eventos LEAD_UPDATED em sequência rápida). A solução é usar idempotencyKey na ação SEND_MESSAGE com um valor único por lead+tipo-de-mensagem. Isso garante que a mensagem seja enviada no máximo uma vez, mesmo que o workflow rode múltiplas vezes.',
              xpBonus: 25,
            } as ContentBlock,
          ],
        },
      ],
    },
  ],
};
