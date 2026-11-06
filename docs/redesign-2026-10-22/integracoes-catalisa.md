# Mapeamento inicial de integração com a Catalisa

Leitura de código em 22/10/2026, repositório local `wpp.bb.catalisa.io`, HEAD `ccc7f04277607ddc03bafff2994d38618ac0ce65`. A descoberta começou pelo código e avançou para consultas remotas de metadados descritas abaixo. O usuário depois indicou `admin@catalisa.app` como conta do site. Isso não comprova execução de IA, persistência ou envio.

## Conta indicada pelo usuário

Em 22/10/2026, após a indicação explícita de `admin@catalisa.app`, `inspect-site-owner-staging.mjs` autenticou no staging usando a configuração privada já existente dessa conta. `GET /auth/me` confirmou a correspondência, e a listagem encontrou **Atendimento Catalisa**, slug `atendimento-catalisa`, ativo e privado. [Evidência sem credenciais ou IDs internos](qa/integrations/admin-staging-readonly.json). O script somente autentica e faz GETs; não cria conversas, leads, agentes ou envios.

O agente declara dez ferramentas, incluindo consulta e alteração de leads, envio de WhatsApp e criação de evento de calendário. Não deve ser encaminhado diretamente ao visitante público com esse escopo. A implementação deve preparar um agente próprio do site na mesma conta, com conhecimento autorizado e ferramentas restritas; persistência e encaminhamento são operações do BFF vinculadas à sessão. O agente de atendimento existente permanece intacto. A configuração de conhecimento ainda não foi comprovada por esta consulta de inventário.

A conta indicada substitui a candidata Ágora como referência de ownership. Ainda faltam identificar e configurar o escopo próprio do site, a credencial de serviço, a persistência, o contrato de geração estruturada e o canal/fila de atendimento. IDs e segredos ficam no servidor; nome e e-mail de login não são credenciais de runtime do site.

## Consultas verificadas no staging

Em 22/10/2026, `scripts/inspect-catalisa-staging.mjs` consultou o painel de staging usando uma configuração local já existente do hotsite Ágora. A configuração é uma candidata de integração, não a seleção automática do tenant do site institucional. [Evidência sem credenciais ou IDs internos](qa/integrations/staging-readonly.json).

| Consulta | Resultado observado | Alcance da evidência |
|---|---|---|
| `GET /ai/status` | HTTP 200; IA habilitada | O serviço responde; não prova geração nem orçamento disponível |
| `GET /agents/:id` com credencial de serviço | HTTP 200; agente ativo, quatro ferramentas declaradas | O contrato de leitura autenticada e o agente candidato estão acessíveis; toolset e autorização para o site ainda exigem definição |
| `GET /public/capture/:code` | HTTP 200; `formFields` nulo na resposta | O recurso público existe; não comprova que submissão aceite só nome ou dispense telefone/e-mail |

Nenhuma conversa, lead, agendamento, mensagem ou chamada de geração foi criada. O script restringe a origem ao staging conhecido, usa somente GET e grava apenas status e metadados permitidos. A primeira execução sem acesso de rede falhou na resolução de nomes; a execução com permissão de rede produziu os resultados acima.

## Fontes inspecionadas

Todos os caminhos abaixo são relativos a `wpp.bb.catalisa.io/apps/painel-cliente-api/src/modules/`:

| Recurso | Fonte de código | Achado |
|---|---|---|
| Leads | `leads/dto/create-lead.dto.ts` e `leads/leads.service.ts:133` | `name`, `phone`, `type`; e-mail opcional. O serviço normaliza e exige telefone válido de 10–15 dígitos, valida tipo no escopo do dono e rejeita duplicação por telefone no mesmo owner. |
| API de leads | `leads/leads.controller.ts:67` | `POST /leads`, com usuário resolvido pela autenticação. Não é uma rota anônima para o navegador. |
| Autenticação | `api-tokens/guards/jwt-or-api-token.guard.ts`, `api-token.strategy.ts` | O guard combina JWT IAM e API token `Bearer tok_…`, resolve o usuário no servidor. A credencial não pode ir para o bundle. |
| Agente dedicado | `agents/agents.controller.ts:352` e `agents/dto/chat-with-agent.dto.ts` | `POST /agents/:id/chat` recebe mensagem, `conversationId` opcional e contexto. Responde com `conversationId`, texto, ferramentas e métricas opcionais. Guard de autenticação, IA habilitada, billing e throttle. |
| Histórico de agente | `agents/agents.controller.ts:401` | Listagem e detalhe de conversas sob `/agents/:id/conversations`; atualização de contexto também existe. Autorização é por usuário resolvido. |
| Assistente geral | `ai-assistant/ai-assistant.controller.ts:119`, `dto/chat-message.dto.ts`, `dto/create-session.dto.ts` | `POST /ai/chat` e `/ai/sessions` são assistente do painel. Podem executar ferramentas do usuário. Não encaminhar briefing público ao assistente geral com credencial ampla. |
| Entrada de evento | `incoming-webhooks/incoming-webhooks.controller.ts` | `POST /incoming-webhooks`, `X-API-Token` obrigatório e HMAC conforme configuração. Não equivale a confirmação de entrega de WhatsApp/e-mail nem atribuição humana. |
| Mensagens | `messages/messages.controller.ts` | O controller consultado expõe leitura/estatísticas. Não inferir um endpoint de envio a partir dele. |

## Consequências concretas

1. **Identidade provisória é necessária antes do canal.** Depois das três respostas e do nome, persistir no banco do site uma identidade aleatória por sessão e um lead provisório com histórico. Não chamar `POST /leads` com telefone vazio, fictício ou derivado do nome. A experiência aprovada não coleta telefone nessa etapa. O lead CRM real pode ser reconciliado depois da escolha de canal e da identificação apropriada, preservando a vinculação. Verificar se a instalação tem recurso equivalente que dispense duplicação de persistência.
2. **Não usar o assistente geral do painel para o visitante público.** Verificar um agente próprio do site, com conhecimento e ferramentas restritos, e credencial de serviço adequada. O BFF escolhe agente/tenant; o browser não fornece esses IDs. Texto do visitante não pode ampliar permissões, ferramentas ou escopo.
3. **Resposta de agente é texto.** O DTO consultado não garante o schema do conceito do handoff. O adaptador terá de solicitar a saída estruturada, validar o JSON no servidor e rejeitar conteúdo fora do contrato. Nenhum `response` vira HTML executável. Confirmar suporte de schema e orçamento no mecanismo real antes de marcar H07 como feito.
4. **Histórico externo não substitui autorização da sessão do site.** IDs de conversa são associados no servidor a uma sessão opaca e a revisões. Não aceitar um ID arbitrário do visitante para carregar conversa de outro contexto.
5. **Evento aceito não é mensagem entregue.** Verificar workflow/fila, canal de teste, assinatura e callbacks de entrega/atribuição antes de implementar estados de atendimento. O contexto entregue inclui respostas, versões, conceito e ajustes.

## Mapeamento ainda a comprovar

| Contrato proposto no handoff | Destino candidato | O que falta verificar |
|---|---|---|
| Sessão pública do site | BFF Netlify + persistência compartilhada | Cookies, política, autorização, expiração, retenção e isolamento |
| Mensagens/revisões | Banco do site + associação a conversa de agente | Idempotência, concorrência, retomada e propriedade |
| Identidade/lead após nome | Registro provisório no BFF | Recurso instalado equivalente e reconciliação CRM posterior |
| Geração/refinamento | Agente dedicado por `/agents/:id/chat` | Ambiente, agente, toolset permitido, schema, quotas, custo, timeout, correlação e retries |
| Atendimento e canais | Workflow/adaptadores de canal | API de envio, fila, consentimento/confirmacão, eventos de aceite/entrega/atribuição e falhas |
| Inteligência de mercado | Eventos minimizados e agregação | Política e taxonomia revisáveis, sem conversa bruta em analytics |

## Próxima validação

O staging e uma credencial candidata já responderam a leituras autenticadas. A próxima validação é definir o escopo do site, o agente dedicado e a persistência de sessão, e então exercitar operações com dados fictícios no tenant adequado. O código do site já tem Netlify Functions e Supabase, mas a presença dessas bibliotecas não comprova um banco preparado para as novas sessões. Não criar dados de contato nem executar envios sem um fluxo de teste concreto e rastreável. Nenhum segredo foi copiado para este documento ou para os assets do site.

H04 está em descoberta, não concluído. H05–H10 continuam pendentes até persistência e testes reais.
