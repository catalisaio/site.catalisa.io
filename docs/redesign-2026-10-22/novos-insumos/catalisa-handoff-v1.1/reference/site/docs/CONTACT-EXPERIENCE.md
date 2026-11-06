# Contato — Conversa → Conceito → Atendimento

Rota /contato/. A identidade editorial e a escultura da primeira versão foram preservadas. contact-demo.js e contact-demo.css acrescentam o atelier de produto à conversa original, em contact.js/contact.css.

## Experiência atual
- Instruções explícitas: texto livre ou sugestão clicável, sem formato obrigatório. A sugestão também responde e avança.
- Motivo, contexto e direção → nome → resumo editável → demo. O nome vem antes de gerar o conceito; e-mail/WhatsApp ficam para a continuidade.
- Preparação visual curta e abertura de um workspace com produto desktop/app, Building Blocks com links e maturidade do catálogo, jornada visual com reprodução.
- Modelos locais de clínica, crédito, recrutamento, comércio e atendimento. Classificação por palavras-chave, explicitamente sem inferência de IA.
- Ajustes clicáveis ou digitados: revisão humana, aplicativo e explicação das peças. Pedido não reconhecido fica anotado, com limite explícito, sem falsa geração.
- Revisão humana muda jornada, tela de revisão e tela de estado. Não confirma automaticamente o que aguarda uma pessoa.
- Histórico e ponto de partida podem ser revisados. Alterar o brief invalida a prévia anterior até a nova geração.
- Identificação local simulada após o nome: contactId e leadId provisórios, preservados durante a experiência. Nenhum cadastro real é criado. O download inclui essas referências.
- Continuidade: reaproveita o nome, escolhe aqui/e-mail/WhatsApp, endereço se pertinente, confirmação explícita e visão do contexto que chegaria ao atendimento.
- Simulação de equipe assumindo com referência ao contexto existente. Não há pessoa ou fila real conectada.
- Download de conversa e conceito estruturado; reinício e pausa de animação.

## Limites e próxima integração
Sem chamadas de IA, criação de lead, envio de mensagens ou estado persistente. Tudo fica em memória nesta página. A API, o renderer e a transferência real precisam de uma integração de backend. O documento CATALISA-CONTACT-AGENT-PROMPT.md contém o prompt completo de construção do agente + workflow, contratos propostos, schema restrito e mapeamento a validar na instalação.

O conceito renderizado é uma interpretação demonstrativa com nomes e dados fictícios, não uma especificação de viabilidade ou uma aplicação publicada. A composição sugere peças, sem garantir a disponibilidade do produto completo.

## Verificação
Desktop: conversa livre, resumo, telas com escolha preservada, ajuste por botão e texto, peças, animação da jornada, continuidade na página e simulação de equipe assumindo. Mobile: exemplos de clínica e crédito em 390 e 320 px, app clicável, continuidade por e-mail, confirmação antes do encaminhamento e largura sem overflow. Renderização de 35 combinações de modelos/abas/revisão/encaminhamento; sintaxe JS, build e referências locais das 69 páginas.

## Vínculo futuro com agentes e leads
O prompt de construção exige criar/atualizar contato e lead antes da demo e anexar o histórico anterior da sessão. Define eventos e taxonomia para inteligência de mercado agregada, separando afirmações do visitante de hipóteses do agente. Não existe coleta de analytics nem backend conectado neste protótipo.
