# 06 — Produtos possíveis, derivados do que já somos

> Pedido do dono: *"inclusive se FICO for mesmo tão bom assim, documente ideias de produtos
> que possamos desenvolver baseado no que somos e o que temos."*
>
> Regra deste documento: **nenhuma ideia entra sem estar ancorada em bloco, ação ou pacote
> que já existe** — e cada uma diz o que falta, se o que falta é **dado ou código**, e qual
> é a unidade de cobrança. Ideia sem âncora é sugestão de consultor; com âncora é roadmap.
>
> Ele não é plano de execução. É o mapa que deveria vir antes dele.

---

## 0. A lição do FICO, em uma linha

FICO não ficou clara por ter plataforma. Ficou clara por ter **uma unidade de valor (a
decisão)** e **um ativo de dado que ninguém copia (o score)**. Este documento organiza as
ideias por esses dois eixos, nesta ordem de importância:

1. **Produtos cuja unidade de cobrança é a decisão ou o resultado** (§1) — é onde o dinheiro
   é maior e a concorrência é menor.
2. **Produtos que capturam operação e alimentam o dado** (§2) — é onde o CAC é menor e o
   ciclo é curto.
3. **Movimentos de plataforma** (§3) — é onde o valuation muda.
4. **O ativo de dado** (§4) — é a decisão estratégica mais importante da empresa.

---

## 1. Frente de decisão — onde a unidade de cobrança é o resultado

### 1.1 `decisao.catalisa.app` — a política que a área muda sem chamar a TI ★★★

| | |
|---|---|
| **O que é** | Autoria, versionamento, simulação e execução de política de decisão — crédito, elegibilidade, alçada, precificação, triagem. A regra vira tabela, a tabela vira versão, a versão vira registro de quem decidiu o quê. |
| **Usa** | `decision-engine` (DMN versionado, alterado **sem deploy**), `decision-platform` (busca o dado, aplica a política, devolve o veredito), `bureaus` (com cache que impede pagar duas vezes pelo mesmo CPF), `audit-trail`, `feature-flags` |
| **Existe** | os cinco blocos, em produção ou beta |
| **Falta** | a casca de produto: tela de autoria para quem **não é de TI**, simulação sobre carteira, comparação entre versões. **Código**, e é o único item caro da lista |
| **Unidade** | assinatura por política publicada **+ por decisão executada** |
| **Por que é o primeiro** | é infraestrutura de receita de todos os outros da §1 — crédito, cobrança, seguros e antecipação plugam nele. Construir uma vez, cobrar N vezes. É literalmente o movimento do FICO |

### 1.2 `credito.catalisa.app` — a esteira de originação inteira ★★★

| | |
|---|---|
| **O que é** | Do "quanto eu consigo?" no WhatsApp até o contrato assinado e o dinheiro na conta. |
| **Usa, em ordem** | `wpp` → `data-extraction` (documento vira JSON com nota de confiança) → `bureaus` → `decision-platform` → `pricing-engine` (taxa por faixa de risco) → `calculations-engine` (parcela, IOF, **CET**) → `banking-product-portfolio` (versão **congelada** em cada contrato) → `document-template` → `e-signature` → `baas`/`payments` |
| **Existe** | **todos os dez blocos.** Esta é a esteira mais completa que a Catalisa tem sem saber |
| **Falta** | o pacote (**dado**), e o parceiro que carrega a licença e o funding (**contrato, não código**) |
| **Público** | correspondente bancário, cooperativa, financeira pequena, fintech de nicho, crédito no ponto de venda |
| **Unidade** | por proposta analisada **+ pontos-base sobre o originado** |
| **Risco** | é o mais regulado da lista. A Catalisa **não é instituição autorizada** — o `baas` já diz isso no próprio README, e a página tem que dizer também |

### 1.3 `cobranca.catalisa.app` — a régua que decide quem vale abordar ★★★

**A melhor razão valor/esforço da lista inteira.**

| | |
|---|---|
| **O que é** | Régua de cobrança por WhatsApp que **decide quem abordar, quando e com qual oferta** — e para de gastar contato com quem não vai pagar. |
| **Usa** | `wpp`, o pacote `cadencia-retomada` (**já existe**), `decision-engine` (propensão como regra, antes de virar modelo), `payments` (Pix na mensagem), `billing`, `data-store`, `audit-trail`, o motor de metas/OKR |
| **Existe** | quase tudo. A cadência com **teto de contato** já está desenhada e é justamente o que separa cobrança de spam |
| **Falta** | a política de propensão — e ela **começa como tabela DMN**, não como modelo. **Dado, não código** |
| **Unidade** | **percentual do recuperado.** É a melhor unidade de toda a lista: alinhamento perfeito, e é como o mercado brasileiro já compra (assessoria cobra 10–30%) |
| **Bônus estratégico** | é o produto que mais rápido gera o **ativo de dado de pagamento** (§4) |

### 1.4 `antecipacao.catalisa.app` — e os setores seguintes ★★

Já existe: mesa, portal do cedente, dossiê, score, borderô, proposta. O mapa de setores já
mediu **~80% do pacote como setor-agnóstico** — *"o que chamamos de glosa é, no motor,
`dilutionRate`"*.

**Ordem de menor atrito, já registrada:** terceirização (sacado grande e nomeável, empenho
público como lastro) → logística (CT-e é lastro nativo) → energia (sacado regulado, mas
ticket acima do nosso segmento).

**A trava é anterior e não é código:** *"não abra setor novo antes de fechar o funding e o
registro"*. Precificamos e não liberamos dinheiro. Enquanto isso durar, o produto vendável
é **a esteira**, não o crédito — e isso é uma oferta legítima para quem **tem** o dinheiro:
securitizadora, FIDC, factoring.

> **Ideia derivada, e talvez a mais rápida de todas:** vender a esteira **para quem já tem
> funding**. A antecipadora traz o dinheiro e o registro; nós trazemos a captura por
> WhatsApp do cedente pequeno — que é exatamente quem ela não consegue atender abaixo de
> R$ 400 mil/mês de faturamento. Zero risco de balanço, receita por operação analisada.

### 1.5 `seguros.catalisa.app` (corretor) e `seguradoras.catalisa.app` ★★

Dois produtos, não um — públicos e dores diferentes.

| | corretor | seguradora / assessoria |
|---|---|---|
| A dor | a apólice vence e ninguém liga; a renovação se perde no vão | o sinistro chega em documento solto e a análise é manual |
| Usa | `cadencia-retomada`, `calendar`, `document-template`, `e-signature`, `payments`, `wpp` | `data-extraction`, `decision-platform`, `document-template`, `audit-trail`, `rooms` |
| Falta | pacote (**dado**) + integração com cotador (**código, e depende do parceiro**) | pacote (**dado**) |
| Unidade | por apólice renovada, ou % da comissão | por sinistro analisado |

### 1.6 `onboarding` / abertura de relação com KYC ★

`customers` (CPF validado, isolado por organização) + `bureaus` + `data-extraction` +
`e-signature` + `baas` (KYC) + `audit-trail`. *"Abra a conta do seu cliente pelo WhatsApp,
com o documento lido, a consulta feita e a assinatura coletada."* Vende-se sozinho como
peça, e é pré-requisito de 1.2 e 1.5.

---

## 2. Frente de captura — ciclo curto, CAC baixo, e é ela que gera o dado

### 2.1 `vendas.catalisa.app` — o Ágora decomposto ★★★

O plano de decomposição já está escrito e verificado contra o código. O monolito
`vitrine-comercial` vira **três pacotes que se compram separados**:

| pacote | serve sozinho a quem |
|---|---|
| `atendimento-entrada` | só quer atender fora do horário e encher a agenda |
| `rooms-comercial` | já vende bem e só quer **parar de escrever proposta** |
| `cadencia-retomada` | perde lead no vão do follow-up |

**Por que isto é produto e não refatoração:** três preços de entrada em vez de um, e o
menor deles é baixo o bastante para ser compra por impulso. É o funil da própria Catalisa.

⚠️ Registrado no plano: os três templates de `rooms-comercial` têm gatilho vazio de
propósito — instalados avulsos, **nascem e nunca disparam**. Esse pacote só funciona como
pacote.

### 2.2 `comercio.catalisa.app` — a família do bairro ★★

Um pacote com **perfis** (adega, mercearia, padaria, açougue, pet shop), não cinco pacotes —
recomendação já registrada, com o motivo: *"cinco pacotes é cinco vezes o custo de
manutenção e quatro chances de eles divergirem em silêncio."*

**O que falta é quase nada:** `COMMERCE_BB_BASE_URL` (uma linha de env) e a base de
conhecimento no `PackageDefinition` (~40 linhas). O bloco `commerce` tem **130 endpoints e
32 entidades** — é o maior da casa e está subutilizado.

Bar e pizzaria entram na estratégia **B1** (camada de relacionamento sobre o PDV que eles já
têm), nunca B2. *"Entrar em ficha técnica é competir onde somos os mais fracos e abandonar
onde somos os únicos."*

### 2.3 `contratos.catalisa.app` ★★

`document-template` (variáveis tipadas, template versionado) + `e-signature` +
`data-extraction` + `wpp`. *"O contrato nasce do modelo, vai pelo WhatsApp, volta assinado,
e a trilha diz quem assinou o quê e quando."* É **horizontal** — vende para todos os
verticais da §2 como acessório, o que o torna barato de vender.

### 2.4 `consultoria.catalisa.app` — e isto é **canal**, não produto ★★★

`AccessGrant` + o motor de metas em três níveis + a carteira. Uma consultoria, contabilidade
ou agência opera a carteira de clientes dela sobre a Catalisa, com permissão que o cliente
concede e **revoga**.

**Por que a prioridade é alta apesar de não gerar receita direta grande:** cada operador é
distribuição. Um operador com 12 clientes vende 12 vezes sem CAC nosso. É o item que mais
muda a curva de aquisição — e o primeiro operador já está nomeado nos documentos.

**Estado corrigido em 27/08: EM PRODUÇÃO desde 20/08/2026** — 12 PRs na master (#755–#766),
em produção e staging, smokados na tela. O ciclo inteiro funciona, incluindo a revogação que
cai na requisição seguinte. O que sobra é conveniência: assistente de plano, tela de carteira
e envio automático do convite por e-mail (hoje o link é repassado à mão).

**Consequência para o roadmap:** este item sai de "construir" e entra em "vender". É o
movimento de menor custo e maior efeito da lista inteira — a capacidade já está paga.

### 2.5 Os verticais já no ar — o que falta é catálogo, não construção ★

Jurídico, clínica, recrutamento, personal, Ágora. O trabalho aqui não é produto novo: é
**empacotar como instalável** o que hoje é hotsite + tenant montado à mão, e publicar preço.

---

## 3. Movimentos de plataforma — onde o valuation muda

### 3.1 Marketplace de pacotes — o análogo direto do FICO Marketplace ★★★

**A ideia mais importante deste documento.**

Como o produto é **dado** (`PackageDefinition`), um terceiro pode escrever um. Um contador
que conhece o dia de uma transportadora pode declarar o pacote da transportadora sem
escrever código — e publicá-lo.

O que isso muda: **o custo marginal do próximo vertical deixa de ser nosso.** Deixa de haver
teto de quantos verticais a Catalisa cobre, e passa a haver efeito de rede — mais pacotes,
mais razões para instalar; mais tenants, mais razão para autorar.

O que falta, e é honesto listar: versionamento de pacote, sandbox de instalação, curadoria e
revisão (um pacote ruim queima a plataforma), medição de uso por pacote (o `billing` já
mede uso) e o modelo de repasse. **É código, é caro, e é o investimento com maior retorno
estratégico da lista.**

⚠️ E um pré-requisito **já conhecido e não resolvido**: o instalador ainda não declara a
base de conhecimento. Sem ela, todo pacote de terceiro instala e **responde genérico** — que
é o oposto do que promete.

### 3.2 Vender bloco avulso — a linha de receita que já está escrita e não é vendida ★★

`docs.catalisa.app` já publica **32 blocos** com 16 seções canônicas cada, **concorrente
nomeado e preço público citado**, validado por schema no build. São **863 endpoints** e
**199 entidades** de argumento comercial pronto.

Hoje isso não é oferta. Deveria ser: *"use um bloco, sem usar o resto"* — o modelo Stripe e
o modelo FICO. Os candidatos mais autônomos e com dor mais nomeável:

| bloco | a frase que vende |
|---|---|
| `bureaus` | consulta com **cache que impede pagar duas vezes pelo mesmo CPF** |
| `calculations-engine` | parcela, IOF e **CET** como API testada, não como planilha |
| `e-signature` + `document-template` | contrato gerado e assinado, com trilha por signatário |
| `rooms` | sala de vídeo com gravação e **transcrição em português** |
| `data-store` | banco de documentos multi-tenant **sem criar tabela para cada cliente** |
| `wpp` | WhatsApp **no número que a empresa já usa**, sem trocar de linha |

**Falta:** publicar preço (os 32 dizem *"precificação em definição"*), e um caminho de
autoatendimento. `api-keys` já resolve credencial com escopo por rota e rotação sem queda.

### 3.3 Academy e certificação de operador ★

Já existe `training/` no site atual, com Supabase, progresso e certificado. Ligado à §2.4,
vira o funil de operadores certificados — que é distribuição, e é como TOTVS e ServiceNow
escalaram sem crescer o time de vendas na mesma proporção.

---

## 4. O ativo de dado — a decisão estratégica mais importante

FICO vale o que vale por causa do score, não da plataforma. A pergunta que a Catalisa tem
que responder é: **qual é o número que só nós vamos ter?**

Dois candidatos reais, e ambos já nascem do código:

### 4.1 Índice de diluição por sacado

Quanto cada operadora de saúde, concessionária, prefeitura ou grande sacado historicamente
**não** paga. Hoje é `dilutionRate` e `glosa_sacado`, e o motor já é genérico — o nome é que
é de saúde.

**Por que é defensável:** ninguém no Brasil tem esse número **por sacado, visto do lado do
cedente pequeno**. As securitizadoras têm a carteira delas; nós teríamos o agregado de quem
está abaixo da linha que elas atendem.

### 4.2 Índice de resposta e de pagamento por segmento e canal

Quem responde, em quanto tempo, por qual porta; e quem **paga** depois de qual régua. Sai de
`wpp` + o motor de cadência + `payments`, e o produto 1.3 é a máquina que mais rápido o
acumula.

### 4.3 O que isso exige antes de existir

Dito aqui porque a §5.7 obriga e porque subestimar isto é o erro clássico:

- **Volume.** Nenhum dos dois vale nada com dez clientes.
- **Base legal.** Agregado derivado de dado de cliente exige LGPD tratada no contrato desde
  o primeiro cliente — **não dá para consertar depois**.
- **Governança.** Quem pode ver o agregado, com que granularidade, e o que **nunca** sai.
- **Uma decisão de produto:** o índice é benefício de quem é cliente, ou é produto vendido
  também a quem não é? As duas respostas são legítimas; são estratégias diferentes.

---

## 5. A ordem que este mapa sugere

Não é ordem de valor — é ordem de **atrito**.

| | o quê | por quê agora |
|---|---|---|
| 1 | **`vendas.catalisa.app`** (decomposição do Ágora) | é dado, o plano está escrito, e cria três preços de entrada |
| 2 | **`cobranca.catalisa.app`** | maior razão valor/esforço, unidade de cobrança perfeita, e alimenta o ativo de dado |
| 3 | **`consultoria.catalisa.app`** | **a capacidade já está em produção** — falta a porta comercial. É distribuição, e muda a curva de aquisição de todos os outros |
| 4 | **`comercio.catalisa.app`** | uma env + 40 linhas destravam o maior bloco da casa |
| 5 | **antecipação como esteira para quem tem funding** | remove a trava que não é código |
| 6 | **`decisao.catalisa.app`** | caro, mas é a fundação de receita da frente financeira |
| 7 | **`credito.catalisa.app`** | maior ticket, maior regulação — depende de 6 e de parceiro |
| 8 | **Marketplace de pacotes** | maior retorno estratégico; exige 3.1 inteiro resolvido |

**Nada disto é tarefa.** É o mapa para a conversa, e a decisão é do dono.
