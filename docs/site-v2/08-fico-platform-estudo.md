# 08 — FICO Platform: estudo da arquitetura de argumento

> Pedido do dono: *"eu prefiro um site com argumentos mais na linha da FICO. Eu sei que
> disse que não era pra ser comercial, mas isso me fez abrir a mente. Não gosto do
> layout/design deles — os argumentos do FICO Platform não fazem sentido aqui? Aproveite e
> pesquise mais sobre a FICO Platform."*
>
> **Resposta curta: fazem, e uma peça deles é melhor do que qualquer coisa proposta em
> `04-direcoes.md`.** É a forma como a FICO organiza o catálogo. Ela resolve, sozinha, o
> problema de posicionamento — e o design deles não tem nada a ver com isso: o que se copia
> é a **ordem do argumento**, não a tinta.
>
> Levantado em 27/08/2026 nas páginas da própria FICO (Platform, Composable Workspaces,
> Intelligent Decisions, Technical Architecture, AI & Analytics), no anúncio do FICO
> Marketplace e na análise da theCUBE Research.

---

## 1. As sete peças do argumento da FICO

### 1.1 O mote é resultado + relação, nunca tecnologia

> **"Applied Intelligence — Powering Your Customer Connections"**

Nem "plataforma", nem "composable", nem "agêntica" na manchete. A palavra técnica está em
"Applied", que é adjetivo, e o substantivo é **conexão com o cliente**. A categoria só
aparece no subtítulo, e mesmo lá subordinada ao ganho.

**Vale aqui:** confirma a decisão de `02-conceito.md` §1 — descartar "composable" e
"agêntica" como bandeira, sem descartá-las como descritor técnico mais fundo no site.

### 1.2 ★ O catálogo é organizado pelo CICLO DE VIDA, não por setor nem por produto

**Esta é a peça mais valiosa do estudo inteiro.**

A navegação de soluções da FICO não tem "para bancos", "para seguradoras", "para varejo".
Tem **estágios da relação com o cliente**:

    Attract & Engage · Onboard & Originate · Nurture & Manage
    Protect & Comply · Contact & Communicate · Scoring Solutions

Trinta e poucas soluções penduradas em seis ganchos. O visitante não precisa saber o nome
de nenhum produto: ele sabe em que ponto da própria operação está doendo.

**Por que isso é exatamente o remédio para o nosso problema:** hoje a Catalisa tem sete
produtos que parecem sete projetos sem relação — jurídico, clínica, recrutamento, adega,
antecipação. Organizados por setor, eles **competem por atenção**. Organizados por estágio,
eles **se somam**, e o mapa de estágios vira, sem nenhum esforço adicional, o **mapa de
venda cruzada**: o cliente vê a própria linha com buracos.

### 1.3 A unidade de valor é a decisão, e ela é um objeto

> *"Build a decision-centric enterprise"* · *"Model decisions with open standards, automate
> with business rules, and support human-in-the-loop AI."*

A decisão não é descrita como funcionalidade: é um **objeto de negócio**, discreto,
versionável e reutilizável. E tem um ciclo de vida próprio, dito em cinco verbos:

    Model → Author → Test & Validate → Automate → Improve

O efeito retórico é forte: transforma "plataforma" em **prática**. Deixa de ser uma lista de
recursos e vira algo que uma pessoa faz.

**Vale aqui, quase intacto.** A Catalisa tem `decision-engine` com DMN versionado e
alterado sem deploy, `decision-platform` como esteira, `pricing-engine`,
`calculations-engine`, `bureaus` e `audit-trail`. Os cinco verbos descrevem o que já existe.

### 1.4 A frase que vende para o comprador certo

> *"Speed and efficiency of changes **without relying on IT**"*

A FICO nomeia o ator: o **business technologist** — a pessoa de risco, de produto, de
crédito, que hoje espera fila de TI para mudar uma regra. É para ela que o argumento é
escrito, e ela é quem tem orçamento e dor.

**Vale aqui**, e mais ainda: no nosso segmento não existe fila de TI — existe **ausência de
TI**. A dona da clínica não espera a TI; ela simplesmente não muda nada, nunca.

### 1.5 A arquitetura é contada em cinco camadas, de cima para baixo

Cada camada tem uma promessa de uma linha:

| camada | a promessa, verbatim |
|---|---|
| Solutions | *"Purpose-built solutions across every stage of the customer lifecycle"* |
| Business Productivity | *"The AI-powered operating system to automate and augment human intelligence"* |
| Intelligent Agentic Orchestration | *"Proven, trusted building blocks for the AI era"* |
| Semantic Data Layer | *"The shared intelligence foundation — always-on, enriched, decision-ready"* |
| Enterprise Control Plane | *"The core everything runs on — enterprise-ready from day 0"* |

**Repare na ordem: a solução está no TOPO.** A arquitetura é apresentada como o que
*sustenta* o produto, não como o produto. É a correção exata do erro do nosso site atual,
onde blocos, workflows e Studio são quatro páginas de primeiro nível.

**Vale aqui, com a estrutura traduzida:**

    o produto              agora · juridico · med · antecipacao · …
    o pacote               o produto declarado como DADO (PackageDefinition)
    a operação             leads, funil, agentes, fluxos, conhecimento, metas — 207 ações
    o núcleo de dados      um cadastro, uma linha do tempo, por empresa
    os blocos              32 blocos · 863 endpoints · IAM, trilha, chaves, isolamento

### 1.6 Composability é contada como REUSO, e o benefício é tempo

> *"Save time, money, and human capital by **mixing, matching, and reusing** preconfigured
> services and prepackaged business capabilities in new ways across different applications."*

Nunca "nossa arquitetura é modular". Sempre "você reaproveita e chega antes".

**Vale aqui, e temos número melhor que o deles:** produto novo é **zero linha de código de
produto**; ~80% da esteira de antecipação atravessa setores; três chaves separam uma adega
de um pet shop.

### 1.7 O dado centralizado é vendido como multiplicador, não como banco

> *"a rich, contextualized view of every customer"* · *"a single, unified view to find
> signals in the data deluge"*

O argumento é que o perfil unificado **melhora o desempenho preditivo em todas as
aplicações ao mesmo tempo** — decisão, comunicação, fraude. É o juro composto, dito na
língua de quem compra analytics.

**Vale aqui** — e é o "sidenote" do dono, que `02-conceito.md` §5 já promoveu a tese.

---

## 2. O Marketplace — o movimento que muda o modelo de negócio

Anunciado em 2026. Um catálogo curado de **decision assets**: dados de terceiros, APIs,
modelos de machine learning, analytics e soluções de parceiros (LexisNexis, Prove Identity,
Mitek, Pipl, SentiLink, iPacket).

Os três argumentos, e os três se aplicam a nós:

1. **Tempo.** *"Integrações que levam semanas ou meses podem ser concluídas em horas."* Um
   banco grande *"contornou um esforço interno projetado de dois anos e US$ 1,5 milhão"*.
2. **Reuso entre silos.** *"Decision products podem ser usados por qualquer pessoa da
   empresa com acesso autorizado"* — o mesmo ativo serve fraude, originação, gestão de
   carteira e marketing.
3. **Governança como fosso.** Catálogo **curado**, com linhagem, dependências e segurança —
   a curadoria é o produto, porque um ativo ruim queima a plataforma inteira.

**Vale aqui, e é a §3.1 de `06-produtos-possiveis.md`.** A diferença estrutural a nosso
favor: na FICO o ativo publicado é sobretudo **dado**; aqui o ativo publicado seria um
**pacote inteiro** — funil, agentes, fluxos e metas — porque o produto já é dado. É um
marketplace de *operações prontas*, não de *fontes de dados*. Nenhum concorrente brasileiro
tem essa forma.

E a trava conhecida continua sendo a mesma: **sem base de conhecimento declarada no pacote,
todo pacote de terceiro instala e responde genérico.**

---

## 3. O que NÃO se copia — e por quê

| peça da FICO | por que não |
|---|---|
| **A pilha de prova** — *"90% dos maiores credores usam FICO Scores"*, Líder no Gartner MQ 2026, 24 logotipos, *"BMO aumenta eficiência em 50%"* | Não temos cliente ativo. Copiar o **formato** da prova sem ter a prova é o caminho mais curto para a §5.7 bloquear a publicação. A nossa prova é outra (§4) |
| **O vocabulário** — *semantic data layer*, *agentic orchestration*, *decision-ready*, *digital workforce* | A FICO fala com o CIO de um banco. Metade do nosso público é dono de operação, e o dono pediu *"claro o suficiente para leigos"* |
| **O ativo de dado** — o FICO Score, padrão de mercado há décadas | Temos candidato (`dilutionRate` por sacado), e ele **não existe em escala**. Sugerir paridade é exagero |
| **O layout** — azul corporativo, fotografia de banco de imagem, pilha animada de camadas | Rejeitado explicitamente pelo dono. E cai em metade da lista de proibições da §4.1 do playbook |
| **A largura do catálogo** — 30+ soluções na navegação | Temos sete. Um menu com trinta itens vindo de uma marca desconhecida some |

---

## 4. A pilha de prova: os produtos SÃO a evidência

> Correção do dono, 27/08: *"sobre o que você mencionou na pilha de provas — a nossa são os
> produtos em cima da plataforma, isso mais que prova tudo."* **Está certo, e a versão
> anterior desta seção subestimava isso.**

A prova principal não é substituta de nada: são **sete produtos verticais construídos sobre a
própria plataforma, em domínios que não se parecem** — direito, saúde, recrutamento, crédito,
varejo de bairro e treino físico. É mais difícil de simular que uma lista de clientes:
logotipo se aluga com um piloto; seis domínios rodando sobre um motor só, não.

**Mas ela prova um eixo, não dois** — e nomear isso é o que a torna utilizável numa reunião:

| eixo | a prova | quem a fornece |
|---|---|---|
| **A plataforma funciona** | os sete produtos, com as datas de plano e encerramento em arquivo versionado | **nós**, verificável agora |
| **A categoria tem demanda** | Itaú, Klarna, Lemonade, Boticário, Magalu — relatórios públicos | **terceiros**, e é o eixo que produto nosso nenhum prova |
| **Alguém pagou por isto** | ausente | ninguém, hoje — e a página diz isso |

As duas primeiras se completam e cobrem as duas perguntas que um comitê faz. A terceira fica
declarada como ausente, porque a avaliação pergunta de qualquer jeito.

E duas provas menores, que só existem porque a operação é honesta por construção:

1. **O produto atendendo quem chega.** `agora.catalisa.app` é o funil comercial real *e* a
   demonstração. O `/experimente` do jurídico senta o visitante nos dois lados do mesmo
   atendimento, e cada linha vem da execução que acabou de rodar. **Testar vence acreditar.**
2. **O artefato real anonimizado.** Uma proposta gerada de verdade com os dados borrados
   vale mais que dez logotipos.
3. **A prova de mercado com fonte, de terceiros.** Itaú, Klarna, Lemonade, Magalu, Boticário
   — 29 artigos já publicados no site, hoje tratados como blog. A frase que os transforma em
   argumento: *"a categoria já foi provada por quem tem escala; o que ninguém tinha era um
   jeito de chegar lá em dias em vez de trimestres."*

E uma quarta, que é nossa e a FICO não tem: **o registro do que quebrou.** Ninguém publica
isso, e é por isso que vale.

---

## 5. O que este estudo muda no plano

Uma coisa, e é grande: **nasce a Direção D**, documentada em `04-direcoes.md` §6.

Ela toma de empréstimo a **ordem do argumento** da FICO — ciclo de vida como eixo do
catálogo, decisão como objeto, arquitetura contada de cima para baixo a partir da solução,
reuso vendido como tempo, dado centralizado como multiplicador — e nada da tinta.

E ela **absorve a Direção B**: o argumento do juro composto continua sendo a espinha, mas
deixa de precisar da metáfora elétrica para se sustentar, porque a matriz produto × estágio
**mostra o buraco na linha do cliente** sem precisar de nenhuma analogia.
