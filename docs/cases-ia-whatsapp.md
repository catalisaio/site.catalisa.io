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
- [Financeiro](#financeiro)
  - [Banco BMG — Renegociacao de Dividas](#6-banco-bmg--renegociacao-de-dividas-via-whatsapp)
- [Global / SaaS](#global--saas)
  - [Lotte Homeshopping — Moni](#7-lotte-homeshopping-coreia--moni)
  - [Synthesia — Fin by Intercom](#8-synthesia--fin-by-intercom)
- [Estudos de Mercado](#estudos-de-mercado)
  - [Forrester / Gupshup — Total Economic Impact](#estudo-forrester--gupshup--total-economic-impact)
  - [Dados complementares de mercado](#dados-complementares-de-mercado)
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

## Financeiro

### 6. Banco BMG — Renegociacao de Dividas via WhatsApp

| Campo | Detalhe |
|-------|---------|
| **Setor** | Bancario / Servicos Financeiros |
| **O que fizeram** | Plataforma O2OBOTS para renegociacao de dividas via WhatsApp. A IA aprende com cada interacao, identifica padroes comportamentais e personaliza mensagens conforme o perfil do inadimplente. Atendimento rapido e personalizado para que clientes se sintam confortaveis negociando. Tambem usado para onboarding de novos portadores de cartao e prevencao a fraude. |
| **Tecnologia** | Plataforma O2OBOTS (CRM via WhatsApp com IA). |

**Metricas:**
- **+40% no volume** de acordos de renegociacao fechados
- **79% de conversao** de boletos emitidos
- Custo por renegociacao: **R$ 4,99-9,90** (vs R$ 21-25 com humanos em call center) — aproximadamente **5x mais barato**
- Atendimento humano tinha 46% de retencao (IA supera)
- NPS **91** no onboarding de 180 mil novos portadores de cartao para varejistas

**Fontes:**
- [O2OBOTS — Renegociacao BMG](https://www.o2obots.com/aumento-de-acordos-fechados-de-renegociacao-de-dividas-do-banco-bmg-pelo-whatsapp-com-a-plataforma-o2obots)
- [O2OBOTS — NPS 91 Onboarding](https://www.o2obots.com/banco-bmg-alcanca-nps-91-com-o-onboarding-de-180-mil-novos-portadores-de-cartoes-para-varejistas-atraves-da-plataforma-da-o2obots)
- [O2OBOTS — Combate a fraude](https://www.o2obots.com/banco-bmg-aumenta-agilidade-no-combate-a-fraude-com-a-o2obots)

---

## Global / SaaS

### 7. Lotte Homeshopping (Coreia) — Moni

| Campo | Detalhe |
|-------|---------|
| **Setor** | Varejo / Home Shopping / E-commerce (Coreia do Sul) |
| **O que fizeram** | Agente de IA chamado "Moni" para suporte ao cliente. Iniciou na categoria de moda, expandiu para eletrodomesticos e outros itens (jan/2025). Redirecionou 30-40% das consultas para IA, habilitando suporte 24/7. |
| **Tecnologia** | Anthropic Claude 3.5 Sonnet via Amazon Bedrock + plataforma de agentes Sendbird na AWS. |

**Metricas:**
- **-40% reducao** na carga de trabalho de agentes humanos
- 30-40% das consultas redirecionadas para IA
- Suporte **24/7**
- Taxa de vitoria competitiva de **90%** (dados enterprise Sendbird)
- Melhoria na satisfacao de parceiros e reducao no tempo de lancamento de produtos

**Fontes:**
- [AWS — Lotte Homeshopping com Sendbird](https://aws.amazon.com/blogs/industries/lotte-homeshopping-reduces-human-agent-workload-by-40-with-sendbird-on-aws/)
- [Sendbird — Lotte case](https://sendbird.com/resources/lotte-homeshopping)

---

### 8. Synthesia — Fin by Intercom

| Campo | Detalhe |
|-------|---------|
| **Setor** | Tecnologia / AI Video / SaaS |
| **O que fizeram** | Com crescimento massivo, precisavam de suporte escalavel. Implementaram o agente de IA Fin do Intercom. Em 4 meses, contatos de clientes saltaram de 40 mil para 316 mil (aumento de 690%). Sem IA, precisariam de 150 pessoas no suporte. Lidaram sem aumentar headcount. Licao-chave: "Fin so funciona tao bem quanto o conteudo que voce coloca nele". |
| **Tecnologia** | Intercom Fin AI agent. |

**Metricas:**
- Spike de **690%** em contatos (40k para 316k) sem aumentar equipe
- **98,3% resolvidos** por self-service (apenas 1,7% precisou de humano)
- **-96% reducao** no tempo de resolucao (de 30 minutos para segundos)
- CSAT humano consistente em **93%**
- CSAT do Fin AI **dobrou** apos implementacao
- **1.300+ horas economizadas** em 6 mil conversas

**Fontes:**
- [Intercom — Synthesia case](https://www.intercom.com/customers/synthesia)
- [Intercom — Synthesia Pioneer](https://www.intercom.com/customers/synthesia-pioneer)

---

## Estudos de Mercado

### Estudo Forrester / Gupshup — Total Economic Impact

| Campo | Detalhe |
|-------|---------|
| **Estudo** | Forrester Consulting — Total Economic Impact (TEI) |
| **Encomendado por** | Meta |
| **Plataforma analisada** | Gupshup Conversation Cloud + WhatsApp Business Platform |
| **Data de publicacao** | Abril 2025 |
| **Metodologia** | 224 decisores pesquisados + 7 entrevistas em profundidade com experiencia em WhatsApp Business Platform e Gupshup Conversation Cloud |

**Metricas principais:**
- **270% ROI** em 3 anos para organizacao composta
- **+55% aumento em taxas de conversao** e 2,08% de aumento na receita geral
- **+20% maior valor medio de pedido (AOV)** gerando 1,17% de aumento na receita total
- **+50% engajamento do cliente** vs SMS e e-mail, gerando US$ 1,4 milhao em lucro
- **90% dos negocios** (varejo e e-commerce) viram aumento significativo em novos clientes
- **90%** reportaram taxas de abertura mais altas
- **92%** viram aumento em taxas de clique no WhatsApp

**Fontes:**
- [Gupshup — Press Release TEI](https://www.gupshup.io/resources/press-releases/gupshup-whatsapp-drive-270-roi-total-economic-impact-study)
- [PR Newswire — Gupshup 270% ROI](https://www.prnewswire.com/news-releases/gupshup-conversation-cloud-and-whatsapp-drove-270-roi-for-customers-according-to-total-economic-impact-findings-302428708.html)
- [Yahoo Finance — Gupshup TEI](https://finance.yahoo.com/news/gupshup-conversation-cloud-whatsapp-drove-150000389.html)

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
