import type { Course } from '../trainingCourses';
import type { ContentBlock } from '../trainingBlockTypes';

export const customActionsCourse: Course = {
  slug: 'custom-actions',
  titleKey: 'courses.customActions.title',
  descriptionKey: 'courses.customActions.description',
  durationKey: 'courses.customActions.duration',
  available: true,
  track: 'avancado',
  audience: 'todos',
  difficulty: 'avancado',
  prerequisites: ['construindo-workflows'],
  colorScheme: 'purple',
  totalXP: 200,
  modules: [
    {
      slug: 'custom-actions-module',
      titleKey: 'courses.customActions.modules.customActionsModule.title',
      descriptionKey: 'courses.customActions.modules.customActionsModule.description',
      lessons: [
        {
          slug: 'tipos-de-custom-actions',
          titleKey: 'courses.customActions.modules.customActionsModule.lessons.tipos',
          durationMin: 8,
          interactivity: 'medium',
          xpPoints: 30,
          contentBlocks: [
            {
              type: 'heading',
              text: 'Os Três Tipos de Custom Actions',
              level: 'h2',
            },
            {
              type: 'comparison-table',
              columns: [
                { label: 'Tipo' },
                { label: 'JAVASCRIPT', highlighted: true },
                { label: 'HTTP_WEBHOOK' },
                { label: 'AI_AGENT' },
              ],
              rows: [
                { feature: 'Execução', values: ['', 'Sandbox Node.js', 'Chamada HTTP externa', 'LLM via prompt'] },
                { feature: 'Latência típica', values: ['', '< 50ms', '100ms–2s', '1s–10s'] },
                { feature: 'Acesso a variáveis', values: ['', 'Sim', 'Via body/headers', 'Via contexto'] },
                { feature: 'Dependência externa', values: ['', 'Nenhuma', 'URL pública', 'Chave de API de IA'] },
                { feature: 'Melhor para', values: ['', 'Transformação de dados', 'Integração de APIs', 'Decisões inteligentes'] },
              ],
            } as ContentBlock,
            {
              type: 'mockui',
              variant: 'custom-action-form',
              interactionSteps: [
                { targetId: 'action-name', instruction: 'Digite o nome da sua Custom Action', position: 'right' },
                { targetId: 'action-type-select', instruction: 'Selecione entre JAVASCRIPT, HTTP_WEBHOOK ou AI_AGENT', position: 'bottom' },
                { targetId: 'input-schema-editor', instruction: 'Defina os campos de entrada que sua action precisa receber', position: 'left' },
              ],
            } as ContentBlock,
            {
              type: 'callout',
              variant: 'tip',
              title: 'Escolha o tipo certo',
              text: 'Use JAVASCRIPT para manipular dados localmente sem latência de rede. Use HTTP_WEBHOOK quando precisar consultar um sistema externo. Use AI_AGENT quando a decisão depende de linguagem natural ou análise contextual.',
            },
            {
              type: 'accordion-faq',
              items: [
                {
                  question: 'Posso misturar tipos em um mesmo workflow?',
                  answer: 'Sim! Um workflow pode ter ações JAVASCRIPT, HTTP_WEBHOOK e AI_AGENT ao mesmo tempo. Cada ação é executada independentemente dentro do DAG de execução.',
                },
                {
                  question: 'Custom Actions têm acesso ao banco de dados?',
                  answer: 'Não diretamente. Ações JAVASCRIPT rodam em sandbox isolado. Para acessar dados do painel, use uma ação HTTP_WEBHOOK apontando para a API do painel, ou use as ações nativas de Lead antes da Custom Action.',
                },
                {
                  question: 'É possível reutilizar a mesma Custom Action em vários workflows?',
                  answer: 'Exatamente! Essa é a principal vantagem. Você define a Custom Action uma vez e a referencia em quantos workflows quiser. Ao atualizar a Custom Action, todos os workflows que a usam recebem a atualização automaticamente.',
                },
              ],
            } as ContentBlock,
            {
              type: 'quiz',
              quizId: 'ca-tipos-q1',
              variant: 'multiple-choice',
              question: 'Você precisa calcular o score de qualificação de um lead somando pontos de diferentes campos preenchidos. Qual tipo de Custom Action é mais adequado?',
              options: [
                { label: 'HTTP_WEBHOOK — para chamar uma API de scoring', value: 'webhook' },
                { label: 'JAVASCRIPT — para executar a lógica localmente sem latência', value: 'javascript' },
                { label: 'AI_AGENT — para o modelo decidir o score', value: 'ai' },
              ],
              correctAnswer: 'javascript',
              explanation: 'JAVASCRIPT é ideal para cálculos determinísticos com dados já disponíveis. A lógica roda em sandbox local com latência mínima e sem necessidade de serviços externos.',
              xpBonus: 10,
            } as ContentBlock,
          ],
        },
        {
          slug: 'criando-rest-action',
          titleKey: 'courses.customActions.modules.customActionsModule.lessons.criandoRest',
          durationMin: 10,
          interactivity: 'high',
          xpPoints: 40,
          contentBlocks: [
            {
              type: 'heading',
              text: 'Criando sua Primeira REST Action',
              level: 'h2',
            },
            {
              type: 'step-by-step',
              steps: [
                {
                  title: 'Acesse Custom Actions no menu',
                  description: 'No painel lateral, clique em "Configurações" → "Custom Actions". Clique no botão "Nova Action" no canto superior direito.',
                },
                {
                  title: 'Defina o nome e tipo',
                  description: 'Dê o nome "Buscar Endereço por CEP" e selecione o tipo "HTTP_WEBHOOK". Adicione uma descrição clara: "Consulta o ViaCEP e retorna logradouro, bairro, cidade e UF".',
                },
                {
                  title: 'Configure o Input Schema',
                  description: 'Defina os campos de entrada: { "cep": { "type": "string", "required": true, "description": "CEP no formato 00000-000" } }',
                },
                {
                  title: 'Configure a chamada HTTP',
                  description: 'URL: https://viacep.com.br/ws/{{input.cep}}/json/ — Método: GET — Sem headers adicionais necessários.',
                },
                {
                  title: 'Mapeie o Output Schema',
                  description: 'Defina o que a action retorna: { "logradouro": "string", "bairro": "string", "cidade": "string", "uf": "string" }. O mapeamento transforma a resposta do ViaCEP no formato do seu output schema.',
                },
                {
                  title: 'Teste antes de salvar',
                  description: 'Use o painel de testes com um CEP real, como "01310-100". Verifique se o output aparece corretamente antes de publicar.',
                },
              ],
              autoPlay: false,
            } as ContentBlock,
            {
              type: 'mockui',
              variant: 'custom-action-form',
              interactionSteps: [
                { targetId: 'action-name', instruction: 'Digite o nome da action: "Buscar Endereço por CEP"', position: 'right' },
                { targetId: 'action-type-select', instruction: 'Selecione o tipo HTTP_WEBHOOK', position: 'bottom' },
                { targetId: 'input-schema-editor', instruction: 'Adicione o campo "cep" como string required', position: 'left' },
                { targetId: 'http-url-field', instruction: 'Cole a URL do ViaCEP com {{input.cep}}', position: 'top' },
                { targetId: 'test-button', instruction: 'Clique em Testar para validar', position: 'bottom' },
              ],
              initialData: {
                actionName: 'Buscar Endereço por CEP',
                actionType: 'HTTP_WEBHOOK',
                method: 'GET',
                url: 'https://viacep.com.br/ws/{{input.cep}}/json/',
              },
            } as ContentBlock,
            {
              type: 'callout',
              variant: 'important',
              title: 'Variáveis de input nas URLs',
              text: 'Use a sintaxe {{input.nomeDoCampo}} para interpolar campos do input schema diretamente na URL ou nos headers. Isso funciona da mesma forma que variáveis em workflows normais.',
            },
            {
              type: 'code',
              language: 'json',
              text: `// Exemplo de Output Schema para a action de CEP
{
  "type": "object",
  "properties": {
    "logradouro": {
      "type": "string",
      "description": "Nome da rua ou avenida"
    },
    "bairro": {
      "type": "string",
      "description": "Bairro do endereço"
    },
    "cidade": {
      "type": "string",
      "description": "Município"
    },
    "uf": {
      "type": "string",
      "description": "Sigla do estado (2 letras)"
    },
    "erro": {
      "type": "boolean",
      "description": "true quando o CEP não é encontrado"
    }
  }
}`,
            } as ContentBlock,
          ],
        },
        {
          slug: 'input-output-schemas',
          titleKey: 'courses.customActions.modules.customActionsModule.lessons.schemas',
          durationMin: 9,
          interactivity: 'high',
          xpPoints: 35,
          contentBlocks: [
            {
              type: 'heading',
              text: 'Input e Output Schemas: Contrato da sua Action',
              level: 'h2',
            },
            {
              type: 'paragraph',
              text: 'Schemas definem o contrato de entrada e saída da action, permitindo que o workflow conecte ações automaticamente.',
            },
            {
              type: 'diagram-animated',
              variant: 'flow',
              nodes: [
                { id: 'trigger', label: 'Trigger\n(Lead Criado)', x: 50, y: 120, color: '#6366f1' },
                { id: 'input', label: 'Input Schema\n{ cep: string }', x: 230, y: 120, color: '#8b5cf6' },
                { id: 'action', label: 'Custom Action\nBuscar CEP', x: 410, y: 120, color: '#a855f7', w: 140 },
                { id: 'output', label: 'Output Schema\n{ logradouro, bairro }', x: 600, y: 120, color: '#8b5cf6' },
                { id: 'next', label: 'Próxima Ação\nAtualizar Lead', x: 800, y: 120, color: '#6366f1' },
              ],
              edges: [
                { from: 'trigger', to: 'input', label: 'dispara', animated: true },
                { from: 'input', to: 'action', label: 'alimenta', animated: true },
                { from: 'action', to: 'output', label: 'produz', animated: true },
                { from: 'output', to: 'next', label: '{{actions.buscarCep.output.logradouro}}', animated: true },
              ],
              viewBox: { w: 960, h: 260 },
            } as ContentBlock,
            {
              type: 'sandbox',
              variant: 'variable-interpolation',
              instructions: 'Pratique a interpolação de outputs de Custom Actions. Complete: 1) Para acessar o logradouro retornado pela action "buscarCep": {{actions.buscarCep.output.logradouro}} 2) Para acessar o telefone formatado pela action "formatarTel": {{actions.formatarTel.output.telefoneFormatado}}',
              validation: {
                type: 'contains',
                expected: { var1: '{{actions.buscarCep.output.logradouro}}' },
              },
              xpReward: 15,
            } as ContentBlock,
            {
              type: 'mockui',
              variant: 'custom-action-form',
              interactionSteps: [
                { targetId: 'action-name', instruction: 'Digite "Formatar Telefone"', position: 'right' },
                { targetId: 'action-type-select', instruction: 'Selecione JAVASCRIPT', position: 'bottom' },
                { targetId: 'input-schema-editor', instruction: 'Adicione "telefone" como string required e "ddd" como string optional', position: 'left' },
                { targetId: 'test-button', instruction: 'Clique em Testar para validar o schema', position: 'bottom' },
              ],
              initialData: {
                actionName: 'Formatar Telefone',
                actionType: 'JAVASCRIPT',
                inputSchema: { telefone: { type: 'string', required: true }, ddd: { type: 'string' } },
                outputSchema: { telefoneFormatado: { type: 'string' } },
              },
            } as ContentBlock,
            {
              type: 'code',
              language: 'json',
              text: `// Input Schema — define o que você precisa receber
{
  "type": "object",
  "required": ["cep"],
  "properties": {
    "cep": {
      "type": "string",
      "pattern": "^\\\\d{5}-?\\\\d{3}$",
      "description": "CEP brasileiro"
    },
    "complemento": {
      "type": "string",
      "description": "Complemento opcional (apto, sala, etc)"
    }
  }
}

// Usando a action em um workflow:
// {{actions.buscarEndereco.output.logradouro}} → "Av. Paulista"
// {{actions.buscarEndereco.output.uf}} → "SP"`,
            } as ContentBlock,
            {
              type: 'sandbox',
              variant: 'custom-action',
              instructions: 'Crie uma Custom Action do tipo JAVASCRIPT chamada "Formatar Telefone" que recebe um campo "telefone" (string) e retorna "telefoneFormatado" no padrão (XX) XXXXX-XXXX. Use o código: return { telefoneFormatado: input.telefone.replace(/(\\d{2})(\\d{4,5})(\\d{4})/, "($1) $2-$3") };',
              validation: {
                type: 'contains',
                expected: { outputSchema: { telefoneFormatado: 'string' } },
              },
              solution: {
                name: 'Formatar Telefone',
                type: 'JAVASCRIPT',
                inputSchema: { telefone: { type: 'string', required: true } },
                code: 'return { telefoneFormatado: input.telefone.replace(/(\\d{2})(\\d{4,5})(\\d{4})/, "($1) $2-$3") };',
                outputSchema: { telefoneFormatado: { type: 'string' } },
              },
              xpReward: 20,
            } as ContentBlock,
            {
              type: 'quiz',
              quizId: 'ca-schema-q1',
              variant: 'true-false',
              question: 'Verdadeiro ou Falso: Se uma Custom Action tem um campo marcado como "required" no Input Schema, o workflow irá falhar se esse campo não for fornecido durante a execução.',
              options: [
                { label: 'Verdadeiro', value: 'true' },
                { label: 'Falso', value: 'false' },
              ],
              correctAnswer: 'true',
              explanation: 'Correto! A validação do Input Schema acontece antes da execução da action. Se um campo obrigatório estiver faltando, a execução do workflow é interrompida e o erro é registrado no log de execuções.',
              xpBonus: 10,
            } as ContentBlock,
          ],
        },
      ],
    },
    {
      slug: 'integracoes-prontas',
      titleKey: 'courses.customActions.modules.integracoesProntas.title',
      descriptionKey: 'courses.customActions.modules.integracoesProntas.description',
      lessons: [
        {
          slug: 'templates-stripe-sendgrid',
          titleKey: 'courses.customActions.modules.integracoesProntas.lessons.templatesStripe',
          durationMin: 9,
          interactivity: 'high',
          xpPoints: 45,
          contentBlocks: [
            {
              type: 'heading',
              text: 'Integrações com Stripe e SendGrid via Templates',
              level: 'h2',
            },
            {
              type: 'paragraph',
              text: 'Templates prontos de Custom Actions permitem integrar serviços populares em poucos cliques. Importe, preencha suas credenciais e use.',
            },
            {
              type: 'accordion-faq',
              items: [
                {
                  question: 'Stripe: quais operações estão disponíveis?',
                  answer: 'Criar cliente, criar checkout session, consultar assinatura e criar reembolso. Todos os templates usam a API REST do Stripe com autenticação via Bearer token.',
                },
                {
                  question: 'SendGrid: o que posso automatizar?',
                  answer: 'Enviar e-mail transacional, adicionar contato a lista e remover unsubscribe. Ideal para notificações de workflow como confirmações e follow-ups.',
                },
                {
                  question: 'HubSpot e PipeDrive: CRMs suportados?',
                  answer: 'Sim. HubSpot: criar/atualizar contato, adicionar a deal, atualizar stage. PipeDrive: criar deal, mover stage, criar atividade.',
                },
                {
                  question: 'Slack e Google Sheets: integrações de produtividade?',
                  answer: 'Slack: enviar mensagem para canal e criar alerta de incidente. Google Sheets: adicionar linha, ler dados e atualizar célula.',
                },
              ],
            } as ContentBlock,
            {
              type: 'step-by-step',
              steps: [
                {
                  title: 'Acesse a galeria de templates',
                  description: 'Em "Custom Actions", clique na aba "Templates". Você verá templates organizados por categoria: Pagamentos, Email, CRM, Notificações e Produtividade.',
                },
                {
                  title: 'Selecione o template Stripe — Criar Checkout',
                  description: 'Clique no card "Stripe: Criar Checkout Session". Leia a descrição para entender o que a action faz, quais inputs precisa e o que retorna.',
                },
                {
                  title: 'Importe o template',
                  description: 'Clique em "Importar Template". O sistema cria a Custom Action com todos os campos pré-configurados, incluindo Input Schema, Output Schema e a chamada HTTP.',
                },
                {
                  title: 'Configure suas credenciais',
                  description: 'Na seção "Headers", substitua "Bearer {{secrets.STRIPE_SECRET_KEY}}" pela sua chave. Use o sistema de Secrets do painel para não expor a chave no código.',
                },
                {
                  title: 'Teste com dados reais',
                  description: 'Use o modo teste da action com um priceId real do Stripe (modo teste). Verifique se o checkoutUrl é retornado corretamente no output.',
                },
              ],
            } as ContentBlock,
            {
              type: 'mockui',
              variant: 'workflow-canvas',
              interactionSteps: [
                { targetId: 'action-name', instruction: 'Arraste o bloco "Stripe: Criar Checkout" para o canvas', position: 'right' },
                { targetId: 'input-schema-editor', instruction: 'Conecte o output do trigger ao input "priceId" da action', position: 'left' },
                { targetId: 'test-button', instruction: 'Clique em Executar Teste para simular o fluxo completo', position: 'bottom' },
              ],
              initialData: {
                workflowName: 'Checkout Automático',
                nodes: [
                  { id: 'trigger', type: 'LEAD_CREATED', label: 'Lead Criado' },
                  { id: 'stripe', type: 'CUSTOM_ACTION', label: 'Stripe: Criar Checkout' },
                  { id: 'notify', type: 'SEND_MESSAGE', label: 'Enviar Link por WhatsApp' },
                ],
              },
            } as ContentBlock,
            {
              type: 'callout',
              variant: 'warning',
              title: 'Nunca hardcode credenciais',
              text: 'Sempre use o sistema de Secrets do painel (configurações → Secrets) para armazenar API Keys. Use {{secrets.NOME_DA_CHAVE}} nos templates. Credenciais no código aparecem nos logs de execução e são um risco de segurança.',
            },
            {
              type: 'sandbox',
              variant: 'webhook-config',
              instructions: 'Configure um template de Custom Action HTTP_WEBHOOK para o SendGrid. Nome: "Enviar Email Transacional". Método: POST. URL: https://api.sendgrid.com/v3/mail/send. Header Authorization: Bearer {{secrets.SENDGRID_API_KEY}}. Input schema: "to" (string, required), "subject" (string, required), "body" (string, required). Teste com dados fictícios.',
              validation: {
                type: 'contains',
                expected: { type: 'HTTP_WEBHOOK', http: { method: 'POST' } },
              },
              solution: {
                name: 'Enviar Email Transacional',
                type: 'HTTP_WEBHOOK',
                http: {
                  method: 'POST',
                  url: 'https://api.sendgrid.com/v3/mail/send',
                  headers: { Authorization: 'Bearer {{secrets.SENDGRID_API_KEY}}' },
                },
                inputSchema: {
                  to: { type: 'string', required: true },
                  subject: { type: 'string', required: true },
                  body: { type: 'string', required: true },
                },
              },
              xpReward: 25,
            } as ContentBlock,
            {
              type: 'interactive-demo',
              title: 'Simulação: Importar Template Stripe',
              scenarios: [
                {
                  id: 'import-stripe',
                  label: 'Importar e configurar Stripe Checkout',
                  description: 'Simule o processo completo de importar o template de Stripe e configurar suas credenciais.',
                  steps: [
                    {
                      instruction: 'Clique em "Templates" na barra de navegação de Custom Actions',
                      action: 'click-templates-tab',
                      feedback: 'Galeria de templates carregada com 24 integrações disponíveis.',
                    },
                    {
                      instruction: 'Clique no card "Stripe: Criar Checkout Session"',
                      action: 'click-stripe-template',
                      feedback: 'Preview do template exibido: recebe priceId e customerId, retorna checkoutUrl.',
                    },
                    {
                      instruction: 'Clique em "Importar Template"',
                      action: 'click-import',
                      feedback: 'Custom Action criada com sucesso! ID: stripe-checkout-session',
                    },
                    {
                      instruction: 'Substitua o header de Authorization pelo seu Secret',
                      action: 'update-header',
                      feedback: 'Header atualizado: Authorization: Bearer {{secrets.STRIPE_SECRET_KEY}}',
                    },
                  ],
                },
              ],
            } as ContentBlock,
          ],
        },
        {
          slug: 'rest-api-tools',
          titleKey: 'courses.customActions.modules.integracoesProntas.lessons.restApiTools',
          durationMin: 9,
          interactivity: 'high',
          xpPoints: 50,
          contentBlocks: [
            {
              type: 'heading',
              text: 'Conectando Qualquer API REST em 5 Minutos',
              level: 'h2',
            },
            {
              type: 'paragraph',
              text: 'O tipo HTTP_WEBHOOK conecta qualquer API REST ao seu workflow. Veja o fluxo de execução:',
            },
            {
              type: 'diagram-animated',
              variant: 'sequence',
              nodes: [
                { id: 'workflow', label: 'Workflow', x: 80, y: 60, color: '#6366f1' },
                { id: 'action', label: 'Custom Action\nHTTP_WEBHOOK', x: 300, y: 60, color: '#a855f7' },
                { id: 'api', label: 'API Externa\n(qualquer REST)', x: 520, y: 60, color: '#ec4899' },
                { id: 'response', label: 'Response\nMapeado', x: 520, y: 200, color: '#10b981' },
                { id: 'next', label: 'Próxima\nAção', x: 300, y: 200, color: '#6366f1' },
              ],
              edges: [
                { from: 'workflow', to: 'action', label: '1. dispara com inputs', animated: true },
                { from: 'action', to: 'api', label: '2. HTTP Request', animated: true },
                { from: 'api', to: 'response', label: '3. JSON Response', animated: true },
                { from: 'response', to: 'next', label: '4. output mapeado', animated: true },
                { from: 'next', to: 'workflow', label: '5. {{actions.x.output.*}}', animated: false },
              ],
              viewBox: { w: 700, h: 300 },
            } as ContentBlock,
            {
              type: 'mockui',
              variant: 'custom-action-form',
              interactionSteps: [
                { targetId: 'action-name', instruction: 'Digite "Validar E-mail"', position: 'right' },
                { targetId: 'action-type-select', instruction: 'Selecione HTTP_WEBHOOK', position: 'bottom' },
                { targetId: 'input-schema-editor', instruction: 'Adicione "email" como string required', position: 'left' },
                { targetId: 'http-url-field', instruction: 'Cole a URL da API Hunter com {{input.email}} e {{secrets.HUNTER_API_KEY}}', position: 'top' },
                { targetId: 'test-button', instruction: 'Teste com um e-mail real para ver o score', position: 'bottom' },
              ],
              initialData: {
                actionName: 'Validar E-mail',
                actionType: 'HTTP_WEBHOOK',
                method: 'GET',
                url: 'https://api.hunter.io/v2/email-verifier?email={{input.email}}&api_key={{secrets.HUNTER_API_KEY}}',
              },
            } as ContentBlock,
            {
              type: 'code',
              language: 'json',
              text: `// Configuração completa de uma Custom Action HTTP_WEBHOOK
// para validar e-mail via API Hunter.io

{
  "name": "Validar E-mail",
  "type": "HTTP_WEBHOOK",
  "description": "Verifica se um e-mail existe e é entregável",
  "inputSchema": {
    "email": { "type": "string", "required": true }
  },
  "http": {
    "method": "GET",
    "url": "https://api.hunter.io/v2/email-verifier?email={{input.email}}&api_key={{secrets.HUNTER_API_KEY}}",
    "headers": {}
  },
  "outputMapping": {
    "status": "$.data.status",
    "score": "$.data.score",
    "entregavel": "$.data.result"
  },
  "outputSchema": {
    "status": { "type": "string" },
    "score": { "type": "number" },
    "entregavel": { "type": "string" }
  }
}`,
            } as ContentBlock,
            {
              type: 'accordion-faq',
              items: [
                {
                  question: 'Como funciona o JSONPath no Output Mapping?',
                  answer: 'Use notação JSONPath ($.campo.subcampo) para extrair campos aninhados da resposta da API. Por exemplo, $.data.status extrai o campo "status" dentro do objeto "data" da resposta JSON.',
                },
                {
                  question: 'E se a API retornar uma estrutura complexa com arrays?',
                  answer: 'JSONPath suporta navegação em arrays com $.items[0].name ou $.results[*].id. Você pode mapear qualquer nível de aninhamento sem precisar de transformação adicional.',
                },
                {
                  question: 'Posso usar variáveis de secrets nos headers?',
                  answer: 'Sim! Use {{secrets.NOME_DA_CHAVE}} em qualquer campo: URL, headers ou body. Os secrets são resolvidos no momento da execução e nunca aparecem nos logs.',
                },
              ],
            } as ContentBlock,
            {
              type: 'mockui',
              variant: 'custom-action-form',
              interactionSteps: [
                { targetId: 'http-url-field', instruction: 'Cole a URL da API com variáveis de interpolação {{input.campo}}', position: 'top' },
                { targetId: 'http-headers', instruction: 'Adicione headers de autenticação usando {{secrets.SUA_CHAVE}}', position: 'left' },
                { targetId: 'output-mapping', instruction: 'Mapeie os campos da resposta JSON para o Output Schema', position: 'left' },
                { targetId: 'test-button', instruction: 'Teste a action com dados reais antes de salvar', position: 'bottom' },
              ],
              initialData: {
                actionName: 'Consultar API Externa',
                actionType: 'HTTP_WEBHOOK',
                method: 'GET',
              },
            } as ContentBlock,
            {
              type: 'sandbox',
              variant: 'custom-action',
              instructions: 'Configure uma Custom Action HTTP_WEBHOOK que consulte a API pública de piadas do Chuck Norris (https://api.chucknorris.io/jokes/random) e retorne o campo "value" como "piada". Sem input schema necessário. Teste e certifique-se que o output contém o campo "piada" com texto.',
              validation: {
                type: 'contains',
                expected: { type: 'HTTP_WEBHOOK', outputSchema: { piada: 'string' } },
              },
              solution: {
                name: 'Piada Aleatória',
                type: 'HTTP_WEBHOOK',
                http: { method: 'GET', url: 'https://api.chucknorris.io/jokes/random' },
                outputMapping: { piada: '$.value' },
                outputSchema: { piada: { type: 'string' } },
              },
              xpReward: 25,
            } as ContentBlock,
            {
              type: 'quiz',
              quizId: 'ca-rest-q1',
              variant: 'multiple-choice',
              question: 'Qual a forma correta de referenciar o output de uma Custom Action chamada "validarEmail" em uma mensagem WhatsApp subsequente?',
              options: [
                { label: '{{validarEmail.status}}', value: 'a' },
                { label: '{{actions.validarEmail.output.status}}', value: 'b' },
                { label: '{{output.validarEmail.status}}', value: 'c' },
                { label: '{{custom.validarEmail.status}}', value: 'd' },
              ],
              correctAnswer: 'b',
              explanation: 'A sintaxe correta é {{actions.nomeAcao.output.campo}}. O prefixo "actions" indica que é o output de uma ação anterior, "validarEmail" é o ID/nome da ação, "output" acessa o schema de saída e "status" é o campo específico.',
              xpBonus: 15,
            } as ContentBlock,
          ],
        },
      ],
    },
  ],
};
