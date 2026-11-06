# 01 — Descoberta

## 1. O pedido, nas palavras do dono

Registrado literalmente porque é o insumo mais valioso do processo e porque o playbook
mede que dor escrita por nós soa a marketing e dor ditada pelo dono soa a verdade.

> *"percebi que vender a catalisa como plataforma tem sido muito difícil — as pessoas não
> entendem, ou quando entendem não sabem usar. Uso muito a analogia de lego sobre a
> Catalisa e isso se aplica aqui: as pessoas que compram um balde de 5000 peças de lego não
> sabem montar coisas significativas com isso sem um manual. Então vender o lego temático é
> muito mais rentável."*

> *"Com isso eu quero um site que fale grandiosamente da plataforma, seja técnico mas claro
> o suficiente para leigos, para investidores e executivos compreenderem a plataforma, a
> geração de valor, o potencial, as possibilidades — e que tenha um excelente pitch
> comercial mostrando os produtos já feitos, **não como cases mas como potencial**. No fim é
> um case, mas o foco é mostrar como a plataforma é flexível sem ficar falando muito da
> plataforma, e sim do modelo e da arquitetura dela."*

> *"o truque e a dificuldade aqui é como fazer algo tão elegante, executivo, bonito e
> significativo, com conteúdo real bom, que interesse."*

E o adendo que, na leitura desta descoberta, **deixou de ser adendo e virou a tese** (§2 de
`02-conceito.md`):

> *"é possível combinar as soluções e tirar ainda mais proveito quando você centraliza os
> dados: você pode ter diversos produtos com uma visão 360 dos dados, interligar jornadas e
> canais."*

Requisitos de forma, também literais: *"moderno, elegante e executivo"*, *"rico visualmente
e com baixa carga cognitiva — menos texto, mais visual, imagens, svgs, animações, scroll to
navigate"*, mídia do **Pexels**.

---

## 2. O diagnóstico do site atual

O site em produção vende **capacidade**. Medido em `src/i18n/locales/pt-BR/home.json`:

| O que a home diz hoje | O que isso é |
|---|---|
| *"Plataforma multi-tenant de CRM, atendimento e automação com agentes de IA"* | categoria genérica — cinco concorrentes escrevem igual |
| *"60+ Building Blocks enterprise"* | contagem de peças — é o balde |
| *"Empresas composable lançam features 80% mais rápido (Gartner)"* | estatística de terceiro sobre uma categoria, não sobre nós |
| *"Da ideia à produção em minutos"* | promessa de velocidade sem objeto: produção de quê? |
| Seis subtítulos rotativos no herói | seis posicionamentos, ou seja, nenhum |

Há 34 páginas e 33 seções reutilizáveis. O problema não é falta de conteúdo — é que o
conteúdo responde *"o que a plataforma tem"* e o comprador pergunta *"o que eu levo pra
casa"*.

**A regra do playbook que isso viola** (§5.1): manchete e subtítulo do herói são
**posicionamento**; palavra-chave mora no `<title>`, na meta description e no FAQ. O herói
atual gastou a única decisão de categoria que o site toma.

### O mesmo erro já foi medido dentro de casa

Não é opinião. A fase F7 (cross-check de features) do hotsite do Ágora encontrou exatamente
isto, e está registrado em `docs/guides/hotsite-playbook.md`:

> *"o site vendia a plataforma e o pacote entregava só a jornada comercial. Não era mentira
> — mas quem instalasse depois de ler a página de bastidores não encontraria nada daquilo
> ligado, e concluiria que o site exagerou. O pior desfecho possível para uma página
> construída sobre honestidade."*

E a correção de nomenclatura de 24/08, também do dono:

> *"não chame de vitrine a não ser que seja genérico para outros produtos; senão dê o nome
> correto — rooms, workflow… e nunca o nome do produto."*

O padrão é o mesmo nos três casos: **a Catalisa fala da máquina para quem quer o produto.**

---

## 3. O inventário — medido, não deduzido

Tudo abaixo foi contado no código em 27/08/2026, com o comando ao lado. Nenhum número
neste documento é estimativa.

### 3.1 A camada de infraestrutura — `~/Projects/building-blocks-v2`

| | |
|---|---|
| Building blocks **documentados no padrão** (frontmatter validado + 16 seções canônicas) | **32** |
| Endpoints somados | **863** |
| Entidades de domínio somadas | **199** |
| Em produção · beta · alpha | **14 · 17 · 1** |
| Categorias | **10** — Financeiro (8), Comunicação (6), Plataforma (3), Identidade (3), Documentos (3), Dados (3), Inteligência (2), Decisão (2), Produtividade (1), Comércio (1) |

Contado varrendo o frontmatter de `src/*/README.md`. O site `docs.catalisa.app`
(`apps/docs`) não tem conteúdo próprio: **tudo vem do README do módulo**, que é a fonte de
verdade única. Cada README tem as mesmas 16 seções, das quais 5 são **comerciais**
(o problema, proposta de valor, casos de uso reais, mercado e diferenciais, modelo de
cobrança e ROI) e 8 são técnicas.

**Isso é raro e é ativo de site:** já existe, escrito e validado por schema, o argumento
comercial de 32 produtos de infraestrutura, com **concorrente nomeado e preço público
citado** para cada um. O novo site não precisa inventar posicionamento — precisa escolher
o que mostrar.

Os blocos, por categoria:

- **Identidade** — IAM, API Keys, SSO
- **Dados** — Customers, Data Store, Bureaus
- **Decisão** — Decision Engine (DMN), Decision Platform
- **Financeiro** — BaaS, Payments, Billing, Pricing Engine, Calculations Engine, Open Finance, Products, Banking Product Portfolio
- **Documentos** — Document Template, E-Signature, File Storage
- **Comunicação** — WPP, WPP Business, Rooms, Email, Slack, Meta Account
- **Comércio** — Commerce (130 endpoints, 32 entidades — o maior)
- **Inteligência** — AI Engine, Data Extraction
- **Produtividade** — Calendar
- **Plataforma** — Audit Trail, Feature Flags, Webhooks Engine

### 3.2 A camada de operação — `~/Projects/wpp.bb.catalisa.io`

O painel é onde os blocos viram trabalho: leads e funil, conversas, workflows, agentes,
ações customizadas, data store, base de conhecimento, metas/OKR, salas de vídeo, agenda.

| | |
|---|---|
| Tipos de ação de workflow | **207** (`enum WorkflowActionType`, `apps/painel-cliente-api/prisma/schema.prisma`) |

**207 é o número do LEGO.** É a contagem literal de peças distintas que se encaixam entre
si. E é um número que nenhum concorrente de "chatbot de WhatsApp" tem.

### 3.3 A camada que ninguém vê e que decide tudo: **o produto é DADO**

Do guia `docs/guides/produto-novo-sobre-a-plataforma.md`:

> *"Um produto novo **não deve precisar de uma linha de código de produto**. O
> `PackageDefinition` já declara tipo de lead, funil com estágios, agentes, workflows,
> perfil de copiloto com os três fan-outs, e os OKRs. O único arquivo existente que se toca
> são **duas linhas** de registro."*

E o instalador, verificado:

    POST /workflow-templates/:slug/install            → workflows + agentes + ações customizadas
    POST /workflow-templates/packages/:slug/install    → tudo acima + tipo de lead, funil,
                                                          perfil de copiloto e OKRs

**Esta é a frase mais valiosa do inventário inteiro, e o site atual não a diz em lugar
nenhum.** Um produto novo da Catalisa não é um projeto de software: é um documento
declarativo instalado por uma chamada de API.

A lacuna conhecida, dita aqui porque a §5.7 obriga: **a base de conhecimento ainda não é
declarada no pacote** (~40 linhas no instalador). Enquanto isso durar, toda instalação
termina com um passo manual — e sem ele o produto responde genérico.

### 3.4 A camada de venda — a casca de hotsite

`apps/hotsite-kit` é a camada estrutural compartilhada: geração de uma página por rota,
CSP, cabeçalhos, sessão assinada, desafio, tetos por IP e teto diário, transporte do chat.
Cada produto traz **só** o tema e o roteiro.

    src/theme/<produto>.css   ~80 linhas — cor, marca, tipografia. É o produto.
    src/site.html             o roteiro. É o produto.
    (a casca)                 NÃO se toca.

E o BFF existe por uma razão de segurança, não de arquitetura: o token do tenant é do
**tenant inteiro**, e quem o tem lê a carteira toda. Ele mora no servidor e só ali.

### 3.5 O que já está no ar, ou em construção

| Produto | Domínio | O que é | Estado |
|---|---|---|---|
| Recrutamento | `recrutamento.catalisa.app` | candidato, cliente e consultor num número só; entrevista em vídeo transcrita, parecer sobre o ATS do cliente | no ar |
| Ágora | `agora.catalisa.app` | a reunião comercial: copiloto na sala, marco no meio, documento ao final. **É o funil real da Catalisa e a demonstração ao mesmo tempo** | no ar |
| Jurídico | `juridico.catalisa.app` | triagem por área, resposta com o material da casa, consulta marcada na agenda real | no ar |
| Clínica | `med.catalisa.app` | atende, tria por especialidade, agenda; registro nasce rascunho e só vira prontuário quando quem atendeu libera | no ar |
| Personal / Personal Lite | `personal.catalisa.app` · `personal-lite.catalisa.app` | agenda, treino por aluno, PAR-Q, dúvida de técnica | no ar |
| Antecipação | `antecipacao.catalisa.app` | mesa de crédito + portal do cedente; dossiê, score, borderô, proposta | portal e mesa prontos; hotsite em construção |
| Adega de bairro | — | catálogo, pedido, Pix, fiado, gate de maioridade, cadência | vertical desenhado, pacote não publicado |

**Planejados pelo dono:** seguros, seguradoras, consultoria, vendas, crédito, decisão, e a
expansão setorial da antecipação.

### 3.6 As duas famílias já mapeadas — e por que isso importa para o site

Dois documentos internos provam, com medição, que **um produto vira família sem fork**:

- **Comércio de bairro** (`2026-08-24-comercio-de-bairro-familia-de-verticais.md`): adega,
  mercearia, padaria, açougue, pet shop são **o mesmo pacote com outro catálogo**. Três
  chaves de configuração separam adega de pet shop. Bar e pizzaria herdam ~70% da máquina.
  Recomendação registrada: **um pacote com perfis, não cinco pacotes.**
- **Antecipação por setor** (`2026-08-26-antecipacao-mapa-de-setores.md`): *"o que chamamos
  de glosa é, no motor, `dilutionRate`."* Muda o nome e a causa, nunca a matemática.
  **~80% do pacote é setor-agnóstico**; o que muda é vocabulário, carga de histórico e um
  campo de lastro.

Essas duas medições são a **prova do argumento comercial do site novo**, e são melhores que
qualquer diagrama: mostram que a alavanca é real e que ela foi verificada contra o código.

### 3.7 A peça que muda o modelo de distribuição

`AccessGrant` (`2026-08-19-catalisa-para-consultorias.md`): um tenant concede acesso a
recursos seus para outro tenant, com revogação. O dono da conta continua sendo a empresa; a
consultoria opera para ela. Nenhum portal separado — **o painel ganha um modo, não um
irmão.**

Consequência comercial: um operador (consultoria, contabilidade, agência) pode atender
carteira sobre a Catalisa. É canal, não feature. Estado: **especificado, não implementado.**

---

## 4. O que a descoberta conclui

1. **O produto vendável não é a plataforma.** É o resultado montado — e a Catalisa já tem
   sete, com mais mapeados e a máquina para produzir o oitavo em dias.
2. **A plataforma não pode sumir da página** — ela é a resposta a *"como vocês têm tantos,
   tão rápido, e por que não vou ficar preso?"*. Mas ela entra como **prova**, nunca como
   protagonista.
3. **O argumento mais forte é o que o dono chamou de sidenote**: os produtos partilham o
   mesmo núcleo de dados. Um produto é um sistema; dois são uma visão; três são uma
   operação. Isso não é retórica — é a consequência direta de `PackageDefinition` +
   tenant único + 207 ações sobre o mesmo cadastro.
4. **A honestidade é o ativo, e ela tem preço.** O site precisa dizer o que ainda não
   combina (recurso não atravessa tenant; base de conhecimento fora do pacote; a
   antecipação precifica e ainda não libera dinheiro). É essa lista que faz o resto ser
   acreditado.
