# Cases de IA + WhatsApp — Insumos Internos

> Documentacao interna de referencia para blog posts, apresentacoes e conteudo do site.
> Ultima atualizacao: Fevereiro 2026

---

## Sumario

- [Varejo / E-commerce](#varejo--e-commerce)
  - [Magazine Luiza — Lu no WhatsApp](#1-magazine-luiza--lu-no-whatsapp)
  - [Grupo Boticario — Consultora IA](#2-grupo-boticario--consultora-ia-no-e-commerce)
  - [Carrefour Brasil — Carina](#3-carrefour-brasil--carina)
- [Food / Delivery](#food--delivery)
  - [iFood — Multiplos Agentes IA](#4-ifood--multiplos-agentes-ia)
  - [KFC India — WhatsApp Bot](#5-kfc-india--whatsapp-bot)
- [Financeiro / Fintechs](#financeiro--fintechs)
  - [Banco BMG — Renegociacao de Dividas](#6-banco-bmg--renegociacao-de-dividas-via-whatsapp)
  - [Bradesco — BIA no WhatsApp](#7-bradesco--bia-no-whatsapp)
  - [Itau Unibanco — Pix no WhatsApp + Inteligencia de Investimentos](#8-itau-unibanco--pix-no-whatsapp--inteligencia-de-investimentos)
  - [Nubank — IA Chatbot + WhatsApp Pix](#9-nubank--ia-chatbot--whatsapp-pix)
  - [Banco do Brasil — WhatsApp Bot + Minhas Financas](#10-banco-do-brasil--whatsapp-bot--minhas-financas-ia)
  - [Santander Brasil — Chatbot IA](#11-santander-brasil--chatbot-ia)
  - [Banco BV — Agentes IA no WhatsApp](#12-banco-bv--agentes-ia-no-whatsapp)
  - [BTG Pactual — Assistente Virtual no WhatsApp](#13-btg-pactual--assistente-virtual-no-whatsapp)
  - [PicPay — Assistente Pix IA no WhatsApp](#14-picpay--assistente-pix-ia-no-whatsapp)
  - [Banco Inter — Pix via WhatsApp com IA](#15-banco-inter--pix-via-whatsapp-com-ia)
  - [Klarna — Assistente IA Global](#16-klarna--assistente-ia-global)
  - [DBS Bank — DBS Joy GenAI](#17-dbs-bank-singapura--dbs-joy-genai)
  - [HDFC Bank — EVA Chatbot](#18-hdfc-bank-india--eva-chatbot)
  - [Absa Bank — Abby Agentic AI](#19-absa-bank-africa-do-sul--abby-agentic-ai)
  - [Lemonade — AI Maya e AI Jim](#20-lemonade--ai-maya-e-ai-jim)
- [Global / SaaS](#global--saas)
  - [Lotte Homeshopping — Moni](#21-lotte-homeshopping-coreia--moni)
  - [Synthesia — Agente IA de Suporte](#22-synthesia--agente-ia-de-suporte)
- [Estudos de Mercado](#estudos-de-mercado)
  - [Estudo Forrester — ROI do WhatsApp Business](#estudo-forrester--roi-do-whatsapp-business)
  - [Dados complementares de mercado](#dados-complementares-de-mercado)
- [Insights para Conteudo](#insights-para-conteudo)
  - [Artigos diretos sobre cases](#artigos-diretos-sobre-cases)
  - [Artigos extrapolados / conteudo derivado](#artigos-extrapolados--conteudo-derivado)
- [Cases secundarios (menor detalhe)](#cases-secundarios)

---

## Varejo / E-commerce

### 1. Magazine Luiza — Lu no WhatsApp

| Campo | Detalhe |
|-------|---------|
| **Setor** | Varejo / E-commerce |
| **O que fizeram** | Transformaram a influenciadora virtual "Lu" em assistente de vendas com IA no WhatsApp. O sistema embute toda a jornada de compra — descoberta, comparacao, carrinho e pagamento — dentro do app de mensagens. Um "orquestrador" aciona agentes especializados para busca de produtos, comparacao de especificacoes, gestao de carrinho e engajamento. Clientes podem enviar fotos ou audios e receber recomendacoes, comparativos e checkout com Pix ou cartao de credito. |
| **Tecnologia** | Google Gemini (Flash e Pro, 5-12B parametros) para visao e comparacoes complexas; modelos open-source na Magalu Cloud para respostas rapidas e FAQs; LLMs maiores para raciocinio mais profundo. Arquitetura de orquestrador de agentes especializados. |

**Metricas:**
- Taxa de conversao **3x maior** que o app tradicional
- NPS **90/100** (vs 85 nos demais canais Magalu)
- De 300 mil usuarios iniciais para **1 milhao de usuarios frequentes**
- **8,5 milhoes** de interacoes mensais
- WhatsApp alcanca 99% dos smartphones brasileiros; Magalu tinha 15 milhoes de perfis aptos
- Reduz custo de aquisicao ao diminuir dependencia de midia paga

**Fontes:**
- [Exame — Lu do Magalu ganha cerebro com IA](https://exame.com/inteligencia-artificial/lu-do-magalu-ganha-cerebro-com-ia-e-vira-vendedora-dentro-do-whatsapp/)

---

### 2. Grupo Boticario — Consultora IA no E-commerce

| Campo | Detalhe |
|-------|---------|
| **Setor** | Beleza / Cosmeticos / E-commerce |
| **O que fizeram** | Lancaram assistente virtual de IA para e-commerce que funciona como consultora de beleza. Recomenda rotinas de beleza, sugere presentes, personaliza recomendacoes com base no perfil do cliente e suporta todo o processo de compra incluindo consulta de precos, status de pedidos e programa de fidelidade. Para 80% das revendedoras do Boticario, WhatsApp ja e a ferramenta preferida de vendas. |
| **Tecnologia** | Anthropic Claude Sonnet via Amazon Bedrock Agent; Amazon Titan Multimodal Embeddings para busca semantica vetorial de produtos. |

**Metricas:**
- **+46% de conversao** no primeiro mes
- Ticket medio **7,4% maior** entre usuarios da assistente
- 80% das revendedoras ja usam WhatsApp como canal principal de vendas

**Fontes:**
- [AWS Blog Brasil — Grupo Boticario com IA generativa](https://aws.amazon.com/pt/blogs/aws-brasil/como-o-grupo-boticario-esta-revolucionando-a-experiencia-de-compra-online-com-ia-generativa/)
- [Mundo do Marketing — Conversao +46%](https://mundodomarketing.com.br/grupo-boticario-lanca-assistente-de-ia-e-eleva-conversao-em-46-no-e-commerce)
- [WhizApp Blog](https://blog.whizapp.com.br/como-o-grupo-boticario-aumentou-em-46-a-conversao-no-e-commerce-com-ia-e-como-o-whiz-te-ajuda-a-fazer-o-mesmo/)
- [Grupo Boticario — IA e-commerce consultora](https://www.grupoboticario.com.br/midia/ia-ecommerce-consultora-beleza/)

---

### 3. Carrefour Brasil — Carina

| Campo | Detalhe |
|-------|---------|
| **Setor** | Varejo / Supermercado |
| **O que fizeram** | Assistente virtual no WhatsApp chamada "Carina" (Carrefour Inteligencia Artificial). Modelo hibrido combinando IA para perguntas simples com agentes humanos para consultas complexas. Nome escolhido por votacao publica (100 mil+ clientes, venceu com 64% dos votos). Persona: mae de 42 anos, super economica. Atende sobre enderecos de lojas, saldo do cartao, revisao de notas fiscais e SAC geral. |
| **Tecnologia** | Modelo hibrido (IA + agentes humanos); stack de IA especifica nao detalhada nas fontes. |

**Metricas:**
- 80% dos operadores de voz trabalhando remotamente com resultados superiores ao presencial
- Tarefas que levavam meio dia resolvidas em **menos de 1 hora**
- Economia de **R$ 100.000/ano** so em revisao de notas fiscais
- Inclusao social e melhoria de qualidade de vida ao eliminar horas de deslocamento

**Fontes:**
- [Carrefour Horizons — WhatsApp Assistant](https://horizons.carrefour.com/e-commerce/carrefour-brazil-launches-a-whatsapp-assistant)
- [IT Forum — Carrefour aposta em IA](https://itforum.com.br/noticias/carrefour-aposta-ia-atendimento-humanizado/)
- [Consumidor Moderno — Carina assistente virtual](https://consumidormoderno.com.br/carrefour-anuncia-carina-assistente-virtual-que-usa-ia/)

---

## Food / Delivery

### 4. iFood — Multiplos Agentes IA

| Campo | Detalhe |
|-------|---------|
| **Setor** | Food Delivery / FoodTech |
| **O que fizeram** | Multiplos agentes de IA para diferentes casos de uso: |

**Agentes:**

| Agente | Descricao | Publico |
|--------|-----------|---------|
| **Compr.AI** | Compras de supermercado via WhatsApp, modelo de comercio conversacional | Consumidores |
| **AILO** | Agente por texto e voz, no app e WhatsApp. Parceria com Prosus | Consumidores |
| **Cris** | Le o funil de vendas, mostra visualizacoes de pratos, identifica gargalos e sugere melhorias. Desenvolvido internamente, testes desde dez/2024 | Restaurantes |
| **Gerente iFood** | Agente via WhatsApp que executa transacoes (Pix, boletos), nao apenas informacional. Desenvolvido pela Zoop (subsidiaria de pagamentos). Lancado no Zoop Summit em out/2025 | Restaurantes |

Orquestrador de agentes planejado para 2026.

**Metricas:**
- Compr.AI: conversao **3-4x maior** que respostas tradicionais por botoes
- AILO: **+48% mais chances** de busca converter em pedido vs fluxo tradicional (teste com 70 mil+ pessoas, a partir de jun/2025)

**Fontes:**
- [Mobile Time — iFood Gerente](https://www.mobiletime.com.br/noticias/21/10/2025/ifood-gerente/)
- [iFood Institucional — Compr.AI](https://institucional.ifood.com.br/inovacao/compr-ai-compra-de-mercado-pelo-whatsapp/)
- [TI Inside — iFood agente de IA no WhatsApp](https://tiinside.com.br/05/08/2025/ifood-lanca-agente-de-ia-no-whatsapp/)
- [Mobile Time — iFood orquestrador de IA](https://www.mobiletime.com.br/noticias/05/08/2025/ifood-orquestrador-de-ia/)
- [Times Brasil — iFood Cris IA](https://timesbrasil.com.br/empresas-e-negocios/ifood-cris-ia-whatsapp-restaurantes/)
- [Contagio Comunicacao — AILO iFood](https://www.contagiocomunicacao.com/ideias/ailo-ifood-ia-delivery-restaurantes)

---

### 5. KFC India — WhatsApp Bot

| Campo | Detalhe |
|-------|---------|
| **Setor** | Fast Food / QSR |
| **O que fizeram** | Bot no WhatsApp para pedidos de comida. Clientes podem fazer pedidos diretamente pelo WhatsApp ao inves de canais tradicionais. |
| **Tecnologia** | WhatsApp bot (stack especifica nao detalhada). |

**Metricas:**
- **115 mil pedidos** processados em 6 meses
- **-30% bounce rate** vs canal tradicional
- **+18% taxa de recompra** entre usuarios do WhatsApp
- 67% dos usuarios preferem pedir via WhatsApp

---

## Financeiro / Fintechs

### 6. Banco BMG — Renegociacao de Dividas via WhatsApp

| Campo | Detalhe |
|-------|---------|
| **Setor** | Bancario / Servicos Financeiros |
| **O que fizeram** | Plataforma de CRM conversacional com IA para renegociacao de dividas via WhatsApp. A IA aprende com cada interacao, identifica padroes comportamentais e personaliza mensagens conforme o perfil do inadimplente. Atendimento rapido e personalizado para que clientes se sintam confortaveis negociando. Tambem usado para onboarding de novos portadores de cartao e prevencao a fraude. |
| **Tecnologia** | Plataforma de CRM conversacional com IA via WhatsApp. |

**Metricas:**
- **+40% no volume** de acordos de renegociacao fechados
- **79% de conversao** de boletos emitidos
- Custo por renegociacao: **R$ 4,99-9,90** (vs R$ 21-25 com humanos em call center) — aproximadamente **5x mais barato**
- Atendimento humano tinha 46% de retencao (IA supera)
- NPS **91** no onboarding de 180 mil novos portadores de cartao para varejistas

**Fontes:**
- [BMG — Renegociacao via WhatsApp](https://www.o2obots.com/aumento-de-acordos-fechados-de-renegociacao-de-dividas-do-banco-bmg-pelo-whatsapp-com-a-plataforma-o2obots)
- [BMG — NPS 91 Onboarding](https://www.o2obots.com/banco-bmg-alcanca-nps-91-com-o-onboarding-de-180-mil-novos-portadores-de-cartoes-para-varejistas-atraves-da-plataforma-da-o2obots)
- [BMG — Combate a fraude com IA](https://www.o2obots.com/banco-bmg-aumenta-agilidade-no-combate-a-fraude-com-a-o2obots)

---

### 7. Bradesco — BIA no WhatsApp

| Campo | Detalhe |
|-------|---------|
| **Setor** | Bancario / Servicos Financeiros |
| **O que fizeram** | BIA (Bradesco Inteligencia Artificial), assistente virtual com IA generativa atendendo clientes via app mobile e WhatsApp. Co-desenvolvida com Microsoft e Avanade na plataforma multi-agente "Bridge". Tambem pilotando "Smart Pix" para transferencias Pix por comando de voz no WhatsApp. |
| **Tecnologia** | Microsoft Azure OpenAI Service, Azure AI Foundry, Azure Cosmos DB. 10 LLMs implantados, 400+ experimentos, 20+ casos de uso em producao. |

**Metricas:**
- **90% de resolucao** sem intervencao humana (dados Bain)
- **95% de acuracia** nas respostas (dados Bain)
- **83%** de taxa de resolucao externa para consultas de clientes
- **89%** de retencao de solicitacoes (resolvidas sem escalonamento)
- **2 milhoes+ de requisicoes** processadas diariamente
- **2 bilhoes de tokens** de inferencia consumidos diariamente
- **8x crescimento** no uso da BIA apos integracao com GenAI
- **8x aumento de produtividade** para gerentes de agencia
- **-40% no tempo medio** de atendimento em call center (piloto)
- **+22% conversao** em cobrancas via agente MentorIA
- **-30%+ reducao** em custos de tecnologia
- Atende aproximadamente **74 milhoes de clientes**
- Construido em 8 semanas; superou meta original de 50% de retencao

**Fontes:**
- [Microsoft Customer Story — Azure AI Services](https://www.microsoft.com/en/customers/story/19177-banco-bradesco-sa-azure-ai-services)
- [Microsoft Customer Story — Azure AI Foundry](https://www.microsoft.com/en/customers/story/25660-banco-bradesco-sa-azure-ai-foundry)
- [Bain & Company — Bradesco AI](https://www.bain.com/client-results/ai/bradesco/)

---

### 8. Itau Unibanco — Pix no WhatsApp + Inteligencia de Investimentos

| Campo | Detalhe |
|-------|---------|
| **Setor** | Bancario / Servicos Financeiros |
| **O que fizeram** | Lancou "Inteligencia Itau", plataforma proprietaria de GenAI com multiplas solucoes. Pix no WhatsApp permite transferencias por voz, texto ou imagem, alem de divisao de contas e comprovantes instantaneos. Inteligencia de Investimentos atua como consultor financeiro 100% baseado em IA com recomendacoes hipercontextualizadas. |
| **Tecnologia** | Multiplos modelos fundacionais (proprietarios e open-source), refinados com dados proprietarios. 1.800 modelos de IA em uso, ~500 cientistas de dados dedicados. |

**Metricas:**
- Pix no WhatsApp: transacoes **20 segundos mais rapidas** que o app tradicional
- **90% de recorrencia** (usuarios que experimentam voltam a usar)
- Inteligencia de Investimentos: **97% de acuracia** nas respostas
- **79% de conversao** no funil de Inteligencia de Investimentos
- Expandiu de 10 mil para **100 mil usuarios** na Inteligencia de Investimentos
- **150 solucoes de GenAI** em producao
- **+141% de aumento** no volume de uso de GenAI (YoY, Q3 2025)
- **+35% velocidade** de implantacao de tecnologia em 2025

**Fontes:**
- [TI INSIDE — Itau 150 solucoes GenAI](https://tiinside.com.br/12/01/2026/itau-coloca-150-solucoes-de-genai-em-producao-e-amplia-uso-de-ia-em-141/)
- [ConvergenciaDigital — Inteligencia de Investimentos](https://convergenciadigital.com.br/mercado/itau-unibanco-expande-ia-generativa-de-investimentos-para-100-mil-clientes/)
- [Mobile Time — Itau IA WhatsApp](https://www.mobiletime.com.br/noticias/22/11/2024/itau-ia-whatsapp-app/)

---

### 9. Nubank — IA Chatbot + WhatsApp Pix

| Campo | Detalhe |
|-------|---------|
| **Setor** | Fintech / Banco Digital |
| **O que fizeram** | Parceria com OpenAI para IA em atendimento (chat e email), Pix via WhatsApp, ferramenta de busca enterprise (RAG), copilot para agentes de call center e deteccao de fraude com GPT-4o vision. |
| **Tecnologia** | OpenAI GPT-4o, GPT-4o mini, RAG (Retrieval-Augmented Generation). |

**Metricas:**
- **2 milhoes+ de chats e emails** mensais tratados
- Resolve ate **50% das consultas Tier 1** sem escalonamento humano
- **-70% no tempo** de resposta em chat
- **2,3x mais rapido** na resolucao de consultas com maior acuracia
- WhatsApp Pix testado com **2 milhoes de usuarios** (out-dez/2024)
- **-60% no tempo** de processamento de transacoes via WhatsApp

**Fontes:**
- [OpenAI Case Study — Nubank](https://openai.com/index/nubank/)
- [AIX Case Study — Nubank's Journey with AI](https://aiexpert.network/case-study-nubanks-journey-with-ai/)

---

### 10. Banco do Brasil — WhatsApp Bot + Minhas Financas IA

| Campo | Detalhe |
|-------|---------|
| **Setor** | Bancario / Servicos Financeiros |
| **O que fizeram** | Chatbot no WhatsApp que concentra 90% de todas as interacoes por bot. Lancou "Minhas Financas" no WhatsApp com IA generativa para gestao financeira, criacao de orcamentos e sugestoes de economia. Contratacao de emprestimo pessoal 100% via WhatsApp. Primeiro banco no Brasil a aplicar IA generativa em gestao financeira. |
| **Tecnologia** | IBM Watson (originalmente), evoluido com IA generativa. |

**Metricas:**
- WhatsApp concentra **90% de todas as interacoes** por bot
- Taxa de overflow (escalonamento para humano) de apenas **3,9%**
- Avaliacao media de **4,2/5** no WhatsApp; bot de agronegocio avaliado em **4,82/5**
- **8x aumento** no pico diario de interacoes apos adicionar botao WhatsApp no app BB
- Minhas Financas: **1,6 milhao de orcamentos** criados, **R$ 4,6 bilhoes** em economia sugeridos
- **3 milhoes+ de planos** financeiros executados, **R$ 22 bilhoes+** em valor total planejado
- **R$ 7,5 bilhoes** em economia alcancada para pessoas fisicas
- **460 milhoes+** de acessos totais, **25 milhoes+** de usuarios unicos
- **7 milhoes+** de pessoas fisicas atendidas por mes

**Fontes:**
- [Mobile Time — WhatsApp 90% das interacoes BB](https://www.mobiletime.com.br/noticias/30/09/2019/whatsapp-responde-por-90-dos-atendimentos-por-bot-do-banco-do-brasil/)
- [StartSe — Minhas Financas WhatsApp](https://www.startse.com/artigos/banco-do-brasil-lanca-minhas-financas-no-whatsapp/)
- [Agencia Brasil — BB primeiro banco com IA em gestao financeira](https://agenciabrasil.ebc.com.br/economia/noticia/2025-06/bb-torna-se-primeiro-banco-adotar-ia-em-gerenciador-de-financas)

---

### 11. Santander Brasil — Chatbot IA

| Campo | Detalhe |
|-------|---------|
| **Setor** | Bancario / Servicos Financeiros |
| **O que fizeram** | Chatbot IA via plataforma de chatbot IA para automatizar atendimento em canais digitais incluindo WhatsApp. Menu self-service baseado nos produtos e servicos mais solicitados, com respostas em linguagem conversacional. |
| **Tecnologia** | Plataforma de chatbot IA. |

**Metricas:**
- **+35% no NPS** para casos assistidos por agentes
- **-20% no SLA** de primeira resposta
- **-14% na carga** de trabalho da equipe de atendimento
- Taxa de retencao self-service **dobrou** de 3% para 6%
- NPS no app subiu de **68 para 74** (Q3 2023 para Q3 2024)
- **2x mais interacoes** usando IA no chatbot no mesmo periodo
- Vencedor do Premio interno 2024 de Excelencia em Atendimento

**Fontes:**
- [Santander Brasil — Customer Story](https://www.sprinklr.com/stories/santander-brasil/)
- [Telesintese — Santander dobrou uso de IA](https://telesintese.com.br/em-dois-anos-santander-dobrou-uso-de-ia-no-chatbot/)

---

### 12. Banco BV — Agentes IA no WhatsApp

| Campo | Detalhe |
|-------|---------|
| **Setor** | Bancario / Servicos Financeiros |
| **O que fizeram** | Agentes autonomos de IA no WhatsApp para atendimento, transitando de servico conversacional para resolutivo. Agentes entendem intencoes, adaptam-se ao contexto, executam tarefas end-to-end e mantem memoria de conversa entre sessoes. |
| **Tecnologia** | Plataforma brasileira de agentes de IA. |

**Metricas:**
- **-73% de reducao** em contatos recorrentes (rechamadas sobre o mesmo assunto em 30 dias)
- Disponibilidade **24/7**
- Agentes treinados exclusivamente com informacao oficial do banco (risco zero de alucinacao)
- Memoria continua permite retomar conversas sem repeticao

**Fontes:**
- [TI INSIDE — Banco BV agentes IA WhatsApp](https://tiinside.com.br/09/12/2025/banco-bv-escala-uso-de-agentes-de-ia-para-transformar-atendimento-via-whatsapp/)
- [Baguete — Banco BV WhatsApp](https://www.baguete.com.br/noticias/banco-bv-atende-no-whatsapp-com-agentes-de-ia)

---

### 13. BTG Pactual — Assistente Virtual no WhatsApp

| Campo | Detalhe |
|-------|---------|
| **Setor** | Bancario / Investimentos |
| **O que fizeram** | Assistente virtual com IA generativa no WhatsApp (lancado jan/2025) para transferencias Pix, pagamentos agendados, consulta de saldo e gestao de boletos. Interpreta texto, voz, imagens e ate anotacoes manuscritas. Divisao de contas e identificacao de valores em documentos. |
| **Tecnologia** | IA generativa (modelo especifico nao divulgado). |

**Metricas:**
- Limite de **R$ 500/dia** por transacao (ajustavel por perfil)
- Premiado por **inovacao em atendimento bancario**
- Interpreta texto, voz, imagens e manuscritos

**Fontes:**
- [BTG Pactual Blog — WhatsApp IA premiado](https://content.btgpactual.com/blog/institucional/inteligencia-artificial-no-whatsapp-btg-pactual-e-premiado-por-inovacao-em-atendimento-bancario)
- [Mobile Time — BTG Assistente IA](https://www.mobiletime.com.br/noticias/17/02/2025/btg-assistente-ia/)

---

### 14. PicPay — Assistente Pix IA no WhatsApp

| Campo | Detalhe |
|-------|---------|
| **Setor** | Fintech / Pagamentos |
| **O que fizeram** | Lancou PicPay Assistant no WhatsApp em parceria com Meta e Microsoft. IA interpreta mensagens, le imagens, entende audio, faz transacoes Pix e divide despesas de grupo automaticamente. Autenticacao biometrica em 100% das transacoes. |
| **Tecnologia** | Microsoft Azure OpenAI Service (GPT-4.1), parceria Meta WhatsApp Business. |

**Metricas:**
- **57 milhoes de contas** elegiveis para rollout gradual
- **5 milhoes de usuarios unicos** atendidos em um ano (IA de suporte)
- Autenticacao biometrica em **100% das transacoes**
- Descrita como "uma das empresas que mais integra GenAI" com brasileiros, atras apenas de big techs

**Fontes:**
- [Microsoft News Brasil — PicPay WhatsApp Pix IA](https://news.microsoft.com/pt-br/picpay-lanca-pix-no-whatsapp-com-ia-que-interpreta-audio-imagens-e-mensagens-alem-de-calcular-valores-automaticamente/)
- [ABES — PicPay GPT-4.1 multiagent](https://abes.com.br/en/picpay-adota-ia-mais-avancada-do-modelo-gpt-em-seu-assistente-e-entra-na-era-dos-multiagentes/)

---

### 15. Banco Inter — Pix via WhatsApp com IA

| Campo | Detalhe |
|-------|---------|
| **Setor** | Banco Digital / Fintech |
| **O que fizeram** | Pix integrado ao WhatsApp com LLM. IA interpreta texto, imagens e QR codes para extrair dados de transacao e processar pagamentos Pix sem precisar abrir o app do banco. |
| **Tecnologia** | LLM (provedor especifico nao divulgado). |

**Metricas:**
- Limite de **R$ 200/dia** (medida de seguranca)
- Inicialmente para segmentos Inter Win e Prime, com rollout gradual planejado
- Expansao planejada para Pix agendado, pagamentos de credito e reconhecimento de audio

**Fontes:**
- [Mobile Time — Pix Inter WhatsApp 2026](https://www.mobiletime.com.br/noticias/25/02/2026/pix-inter-whatsapp/)
- [Canaltech — Inter WhatsApp Pix](https://canaltech.com.br/apps/inter-libera-pix-no-whatsapp-veja-como-fazer-pagamentos-pelo-mensageiro/)

---

### 16. Klarna — Assistente IA Global

| Campo | Detalhe |
|-------|---------|
| **Setor** | Fintech / Buy Now Pay Later |
| **O que fizeram** | Assistente IA via OpenAI em todos os chats de atendimento globalmente. Processa reembolsos, devolucoes, consultas de cobranca e resolucao de disputas em 35+ idiomas, 24/7, em 23 mercados. |
| **Tecnologia** | OpenAI. |

**Metricas:**
- **2,3 milhoes de conversas** no primeiro mes
- Tratou **2/3 de TODOS** os chats de atendimento
- Equivalente ao trabalho de **700 agentes full-time**
- Tempo medio de resolucao: **menos de 2 minutos** (vs 11 minutos antes)
- **-25% queda** em consultas repetidas
- Igualou agentes humanos em satisfacao do cliente
- Projecao de **US$ 40 milhoes** em melhoria de lucro para 2024
- 23 mercados, 35+ idiomas

**Ressalva importante:** Em 2025, Klarna reverteu parcialmente a estrategia e voltou a investir em agentes humanos, reconhecendo que "custo parece ter sido um fator de avaliacao predominante demais" e a qualidade sofreu.

**Fontes:**
- [Klarna Press Release — AI Assistant](https://www.klarna.com/international/press/klarna-ai-assistant-handles-two-thirds-of-customer-service-chats-in-its-first-month/)
- [OpenAI Case Study — Klarna](https://openai.com/index/klarna/)

---

### 17. DBS Bank (Singapura) — DBS Joy GenAI

| Campo | Detalhe |
|-------|---------|
| **Setor** | Bancario / Servicos Financeiros (Asia) |
| **O que fizeram** | "DBS Joy", assistente virtual GenAI para clientes corporativos (foco em PMEs), acesso 24/7 para consultas bancarias. Tambem chatbot no WhatsApp para servicos de acoes (Hong Kong/EUA — cotacoes, alertas, relatorios, watchlists). |
| **Tecnologia** | GenAI (modelo especifico nao divulgado), integracao Salesforce. |

**Metricas:**
- **120 mil+ chats unicos** desde fev/2025
- ~**4 mil clientes corporativos** por mes usando o chatbot
- **+23% melhoria** em satisfacao do cliente
- Reducao no tempo medio de atendimento (AHT)
- Atualmente Singapura; expandindo para Hong Kong e India

**Fontes:**
- [DBS Newsroom — GenAI chatbot](https://www.dbs.com/newsroom/DBS_rolls_out_Gen_AI_powered_chatbot_to_all_corporate_clients)
- [Fortune — DBS Joy](https://fortune.com/2025/11/10/dbs-joy-rolls-out-gen-ai-chatbot/)

---

### 18. HDFC Bank (India) — EVA Chatbot

| Campo | Detalhe |
|-------|---------|
| **Setor** | Bancario / Servicos Financeiros (India) |
| **O que fizeram** | EVA (Electronic Virtual Assistant) desde 2017, presente no site, app, WhatsApp, Google Assistant e Facebook Messenger. Responde sobre produtos, taxas, codigos IFSC e processos de aplicacao. Tornou-se o maior chatbot da India por volume. |
| **Tecnologia** | Plataforma de NLP/chatbot. |

**Metricas:**
- **2,7 milhoes de consultas** atendidas nos primeiros 6 meses
- **85%+ de acuracia**
- **99,9% de uptime**
- Tempo de resposta: **segundos** (vs 8-10 minutos com agentes humanos)
- Maior chatbot da India por volume

**Fontes:**
- [Kevit Technologies — EVA Case Study](https://kevit.io/banking-chatbot-case-study-eva-by-hdfc/)
- [Analytics India Mag — EVA maior chatbot da India](https://analyticsindiamag.com/ai-news-updates/hdfc-banks-eva-becomes-indias-largest-smartest-chatbot/)

---

### 19. Absa Bank (Africa do Sul) — Abby Agentic AI

| Campo | Detalhe |
|-------|---------|
| **Setor** | Bancario / Servicos Financeiros (Africa) |
| **O que fizeram** | Primeira instituicao financeira na Africa (e uma das primeiras globalmente) a implantar IA agentica para clientes. Abby opera no site e WhatsApp em 8 paises (Botswana, Gana, Quenia, etc.). Pode ajudar a solicitar emprestimos, abrir contas de investimento e fazer pagamentos internacionais. |
| **Tecnologia** | Salesforce Agentforce platform. |

**Metricas:**
- **10 mil+ interacoes** com clientes por dia
- Opera em **8 paises**
- Primeiro banco africano com **IA agentica**
- Expandindo suporte para portugues e suaili

**Fontes:**
- [iAfrica — Absa primeiro banco africano com IA agentica](https://iafrica.com/absa-becomes-first-african-bank-to-launch-agentic-ai-for-customers/)
- [American Banker — Chatbot lessons from South Africa](https://www.americanbanker.com/news/south-african-banks-approach-to-chatbots-offers-lessons-for-u-s-players)

---

### 20. Lemonade — AI Maya e AI Jim

| Campo | Detalhe |
|-------|---------|
| **Setor** | Insurtech / Seguros |
| **O que fizeram** | Seguradora AI-native com dois chatbots: Maya (cotacoes de apolice em menos de 90 segundos) e Jim (processamento de sinistros). Jim avalia sinistros, verifica condicoes da apolice, roda algoritmos anti-fraude e envia instrucoes de pagamento — tudo automaticamente. |
| **Tecnologia** | Modelos proprietarios de IA/ML. |

**Metricas:**
- **98% de todos os sinistros** iniciam com AI Jim
- **40% dos sinistros** resolvidos sem intervencao humana
- Recorde mundial: sinistro liquidado em **2 segundos** (2023)
- Cotacoes geradas em **menos de 90 segundos** via AI Maya
- **90%+ de satisfacao** do cliente nas interacoes com AI Jim

**Fontes:**
- [AI Magazine — Lemonade recorde de 2 segundos](https://aimagazine.com/articles/lemonade-sets-world-record-with-2-second-ai-insurance-claim)
- [Devoteam — Lemonade GenAI case study](https://www.devoteam.com/expert-view/innovation-in-insurance/)

---

## Global / SaaS

### 21. Lotte Homeshopping (Coreia) — Moni

| Campo | Detalhe |
|-------|---------|
| **Setor** | Varejo / Home Shopping / E-commerce (Coreia do Sul) |
| **O que fizeram** | Agente de IA chamado "Moni" para suporte ao cliente. Iniciou na categoria de moda, expandiu para eletrodomesticos e outros itens (jan/2025). Redirecionou 30-40% das consultas para IA, habilitando suporte 24/7. |
| **Tecnologia** | Anthropic Claude 3.5 Sonnet via Amazon Bedrock + plataforma de agentes IA na AWS. |

**Metricas:**
- **-40% reducao** na carga de trabalho de agentes humanos
- 30-40% das consultas redirecionadas para IA
- Suporte **24/7**
- Melhoria na satisfacao de parceiros e reducao no tempo de lancamento de produtos

**Fontes:**
- [AWS — Lotte Homeshopping com agentes IA](https://aws.amazon.com/blogs/industries/lotte-homeshopping-reduces-human-agent-workload-by-40-with-sendbird-on-aws/)
- [Lotte Homeshopping — Case de agentes IA](https://sendbird.com/resources/lotte-homeshopping)

---

### 22. Synthesia — Agente IA de Suporte

| Campo | Detalhe |
|-------|---------|
| **Setor** | Tecnologia / AI Video / SaaS |
| **O que fizeram** | Com crescimento massivo, precisavam de suporte escalavel. Implementaram plataforma de agente IA para suporte. Em 4 meses, contatos de clientes saltaram de 40 mil para 316 mil (aumento de 690%). Sem IA, precisariam de 150 pessoas no suporte. Lidaram sem aumentar headcount. Licao-chave: "O agente IA so funciona tao bem quanto o conteudo que voce coloca nele". |
| **Tecnologia** | Plataforma de agente IA para suporte. |

**Metricas:**
- Spike de **690%** em contatos (40k para 316k) sem aumentar equipe
- **98,3% resolvidos** por self-service (apenas 1,7% precisou de humano)
- **-96% reducao** no tempo de resolucao (de 30 minutos para segundos)
- CSAT humano consistente em **93%**
- CSAT do agente IA **dobrou** apos implementacao
- **1.300+ horas economizadas** em 6 mil conversas

**Fontes:**
- [Synthesia — Case de suporte IA](https://www.intercom.com/customers/synthesia)
- [Synthesia — Pioneer em suporte IA](https://www.intercom.com/customers/synthesia-pioneer)

---

## Estudos de Mercado

### Estudo Forrester — ROI do WhatsApp Business

| Campo | Detalhe |
|-------|---------|
| **Estudo** | Forrester Consulting — Total Economic Impact (TEI) |
| **Encomendado por** | Meta |
| **Plataforma analisada** | Plataforma de conversacao em nuvem + WhatsApp Business Platform |
| **Data de publicacao** | Abril 2025 |
| **Metodologia** | 224 decisores pesquisados + 7 entrevistas em profundidade com experiencia em WhatsApp Business Platform e plataformas de conversacao em nuvem |

**Metricas principais:**
- **270% ROI** em 3 anos para organizacao composta
- **+55% aumento em taxas de conversao** e 2,08% de aumento na receita geral
- **+20% maior valor medio de pedido (AOV)** gerando 1,17% de aumento na receita total
- **+50% engajamento do cliente** vs SMS e e-mail, gerando US$ 1,4 milhao em lucro
- **90% dos negocios** (varejo e e-commerce) viram aumento significativo em novos clientes
- **90%** reportaram taxas de abertura mais altas
- **92%** viram aumento em taxas de clique no WhatsApp

**Fontes:**
- [Forrester TEI — WhatsApp Business ROI](https://www.gupshup.io/resources/press-releases/gupshup-whatsapp-drive-270-roi-total-economic-impact-study)
- [PR Newswire — 270% ROI WhatsApp Business](https://www.prnewswire.com/news-releases/gupshup-conversation-cloud-and-whatsapp-drove-270-roi-for-customers-according-to-total-economic-impact-findings-302428708.html)
- [Yahoo Finance — Forrester TEI Study](https://finance.yahoo.com/news/gupshup-conversation-cloud-whatsapp-drove-150000389.html)

---

### Dados complementares de mercado

| Fonte | Dado |
|-------|------|
| **Gartner** | Ate 2026, mais de 80% das empresas integrarao IA generativa na experiencia do cliente |
| **Accenture** | IA pode aumentar eficiencia operacional em ate 40% |
| **IDC** | Ate 2026, mais de US$ 300 bilhoes investidos em IA mundialmente |
| **Tidio** | Clientes viram aumento mediano de 20% no valor de pedido na primeira semana |
| **Benchmarks do setor** | Varejo: -40% tickets repetitivos; Bancos: +20% conversao com lembretes automatizados; Saude: -60% chamadas no call center; Reducao de ate 30% no tempo de resposta |
| **Chatbots geral** | Podem reduzir custos de suporte em ate 30%; bancos economizam US$ 0,50-0,70 por interacao |

---

## Insights para Conteudo

Ideias de artigos para o blog, derivadas dos cases documentados acima. Divididas em duas categorias: artigos que cobrem cases diretamente e artigos que extrapolam os cases para gerar conteudo mais amplo.

### Artigos diretos sobre cases

Artigos que reportam/analisam os cases tal como sao.

| # | Titulo sugerido | Angulo | Cases fonte | Formato |
|---|----------------|--------|-------------|---------|
| 1 | "Como a Lu do Magalu vende 3x mais pelo WhatsApp" | Deep dive no case Magalu — arquitetura de orquestrador, metricas, licoes | #1 Magalu | Blog post longo |
| 2 | "Boticario: +46% de conversao com consultora IA no e-commerce" | Case tecnico com foco na arquitetura de IA generativa | #2 Boticario | Blog post + CTA tecnico |
| 3 | "Os 4 agentes de IA do iFood (e o que vem em 2026)" | Mapa completo dos agentes, de Compr.AI ao Gerente | #4 iFood | Blog post longo |
| 4 | "Bradesco, Itau, Nubank: a corrida dos bancos brasileiros pela IA no WhatsApp" | Comparativo lado a lado dos 3 grandes | #7 Bradesco, #8 Itau, #9 Nubank | Blog post comparativo |
| 5 | "Banco BV cortou 73% das rechamadas com agentes autonomos" | Case focado em resolucao e agentes agenticos | #12 Banco BV | Blog post curto |
| 6 | "Klarna: US$40M economizados — e por que voltaram atras" | Case com contraponto critico sobre qualidade vs custo | #16 Klarna | Blog post opinativo |
| 7 | "De Singapura a Africa do Sul: como bancos globais usam IA no WhatsApp" | Panorama global — DBS, HDFC, Absa | #17 DBS, #18 HDFC, #19 Absa | Blog post panorama |
| 8 | "Lemonade: sinistro em 2 segundos — o futuro da insurtech" | Case de insurtech AI-native | #20 Lemonade | Blog post curto |
| 9 | "270% de ROI: o que o estudo Forrester revela sobre WhatsApp Business" | Reportagem sobre o TEI da Forrester | Forrester | Blog post dados |
| 10 | "PicPay e BTG no WhatsApp: Pix por voz, imagem e manuscrito" | Duplo case de fintechs brasileiras inovando em UX | #13 BTG, #14 PicPay | Blog post curto |

---

### Artigos extrapolados / conteudo derivado

Artigos que partem dos cases para gerar conteudo original mais amplo (tendencias, frameworks, opiniao, guias).

| # | Titulo sugerido | Angulo | Cases como insumo | Formato |
|---|----------------|--------|-------------------|---------|
| 1 | "O padrao dos 3x: por que conversao via WhatsApp e 3x maior que apps tradicionais" | Analise de tendencia — Magalu 3x, iFood 3-4x, Klarna 2/3 | #1, #4, #16 | Artigo analitico |
| 2 | "Agentes vs Chatbots: a evolucao de FAQ para execucao de transacoes" | Framework conceitual — de chatbot informacional a agente que faz Pix | #12 BV, #4 iFood Gerente, #13 BTG, #19 Absa | Artigo framework |
| 3 | "5 metricas que provam ROI de IA no WhatsApp (com dados reais)" | Guia pratico com metricas reais agregadas dos cases | Todos os cases + Forrester | Guia pratico |
| 4 | "WhatsApp como sistema operacional de vendas: a tese que esta se provando" | Thought leadership — WhatsApp nao e canal, e plataforma | #1 Magalu, #2 Boticario, #8 Itau, #14 PicPay | Artigo opiniao |
| 5 | "O que Bradesco, Nubank e Banco do Brasil ensinam sobre escalar IA" | Licoes de escala — 74M clientes, 2M chats/mes, 7M atendidos/mes | #7 Bradesco, #9 Nubank, #10 BB | Artigo licoes |
| 6 | "IA no financeiro: de cobranca a investimentos — o mapa completo" | Mapeamento dos 15 cases financeiros por caso de uso | Todos financeiros | Infografico + post |
| 7 | "Por que 90% das empresas viram mais clientes com WhatsApp (e como comecar)" | Artigo actionable usando dados Forrester como gancho | Forrester + #1, #2, #5 KFC | Guia de entrada |
| 8 | "A licao da Klarna: quando cortar custos com IA da errado" | Contraponto critico — qualidade vs automacao | #16 Klarna, #22 Synthesia | Artigo opiniao |
| 9 | "Orquestrador de agentes: o proximo passo apos o chatbot" | Tendencia tecnica — de bot unico a multi-agente | #1 Magalu, #4 iFood, #7 Bradesco | Artigo tecnico |
| 10 | "Do Brasil para o mundo: como empresas BR lideram IA conversacional" | Posicionamento Brasil como referencia global | #1-15 (cases BR) vs #17-19 (global) | Artigo posicionamento |

---

## Cases secundarios

Casos com menor profundidade de dados, uteis como referencia complementar.

### Bordinho Moveis
- **Setor:** Varejo de moveis (Minas Gerais)
- **Resumo:** Segundo a Meta, o agente de IA conseguiu responder praticamente a todos os clientes nas primeiras interacoes, ajudando na conversao de vendas.

### Biz / Gabiz
- **Setor:** RH / Servicos Financeiros
- **Resumo:** Lancou Gabiz, agente financeiro inteligente baseado em IA, 100% integrado ao WhatsApp, mudando como empresas interagem com colaboradores. Apresentado no CONARH 2025.
- **Fonte:** [SEGS — Biz agente financeiro com IA no WhatsApp](https://www.segs.com.br/seguros/427321-biz-lanca-agente-financeiro-com-ia-no-whatsapp-para-transformar-rh-em-canal-estrategico)

### Domino's Pizza — Dom
- **Setor:** Fast Food / QSR
- **Resumo:** Chatbot "Dom" no Facebook Messenger e SMS para pedidos. Campanha no Tinder no Dia dos Namorados gerou 5 milhoes+ de impressoes e 27 milhoes de impressoes no Facebook.
- **Fonte:** [BestPractice.AI — Domino's chatbot](https://www.bestpractice.ai/ai-case-study-best-practice/dominos_pizza_allows_customers_to_order_pizza_through_a_voice_conversational_chatbot_and_machine_learning)

### Starbucks — My Starbucks Barista
- **Setor:** Cafe / F&B
- **Resumo:** Chatbot "My Starbucks Barista" no app mobile com pedidos por voz e texto, recomendacoes com base em clima e historico de compras. Plataforma Deep Brew AI.
- **Metricas:** Mobile Order and Pay chegou a 26% das transacoes nos EUA; lojas reportaram ate 15% menos filas; Deep Brew gerou +30% ROI e +15% engajamento; pedidos mobile passam de 30% das transacoes nos EUA.
- **Fonte:** [DigitalDefynd — Starbucks AI case study](https://digitaldefynd.com/IQ/starbucks-using-ai-case-study/)

### Nike — NikeAI Beta
- **Setor:** Esportes / Varejo
- **Resumo:** IA preditiva analisa uso do app, historico de compras e sinais sociais para recomendacoes ultra-personalizadas. Lancou assistente conversacional NikeAI Beta.
- **Metricas:** Modelos similares aumentam taxa de recompra em ate 30%.
- **Fonte:** [AI Magazine — Nike AI strategies](https://aimagazine.com/news/coca-cola-nike-starbucks-retailer-ai-strategies)
