# 10 — Achados da memória dos repositórios, e as correções que eles obrigaram

> Pedido do dono, 27/08: *"use o memory e o CLAUDE.md do wpp.bb.catalisa.io e do
> building-blocks-v2 para dar mais insumo pro seu trabalho aqui."*
>
> Foi a instrução mais rentável da sessão: ela **derrubou três afirmações minhas** que já
> estavam publicadas, e trouxe material que muda o que o site pode prometer.

---

## 1. As correções — o que eu tinha escrito errado

### 1.1 A operação por terceiro **está em produção**, não especificada

| | |
|---|---|
| **O que eu escrevi** | *"`AccessGrant` (modo consultoria): especificado, não implementado. Quatro fases desenhadas."* — em `02` §3.7, `06` §2.4 e nos dois artefatos |
| **A fonte do erro** | li `docs/plans/2026-08-19-catalisa-para-consultorias.md`, que era verdadeiro **no dia 19/08** |
| **A verdade** | `handoff-atual-2026-08-20`: **12 PRs na master (#755–#766), em produção E staging, smokados na tela.** O ciclo inteiro funciona |
| **O ciclo, verbatim** | a consultoria convida cliente sem conta → o cliente aceita → a concessão nasce **com o cliente como dono** → a consultoria entra e trabalha em metas, funil e rotina → o dono revoga e **cai na requisição seguinte** |
| **O que sobra** | conveniência, não capacidade: assistente de plano, tela de carteira, e o convite por e-mail (hoje o link é repassado à mão) |

**Consequência comercial, e é grande:** `consultoria.catalisa.app` sai de "construir" e entra
em "vender". É o item de maior efeito e menor custo do `06` — a capacidade já está paga.

**A lição:** documento de plano tem data. Ler um plano de 19/08 e concluir sobre 27/08 é o
mesmo erro que a memória chama de *"checar se a master andou antes de investigar"*.

### 1.2 O isolamento não vem de autorização. Vem de invariante.

`acl-de-rota-morta-em-72-de-73`: `@RequireRoute` existe em **1 controller de 73**. Há tela de
permissões gravando linhas que **nenhum guard lê**.

> *"O isolamento entre tenants hoje não vem de uma camada de autorização — vem de um
> invariante sem exceção: todo serviço resolve o dono a partir do usuário autenticado."*

Isso corta nos dois sentidos, e o site tem que dizer os dois:

- **A favor:** é mais forte do que ACL. Elimina uma classe inteira de vazamento entre
  clientes em vez de mitigá-la rota a rota — não há rota nova que "esqueceu" de aplicar a regra.
- **Contra:** **não existe divisão fina de papéis dentro de uma conta.** O site não pode
  prometer perfis granulares, e agora não promete.

### 1.3 Capacidade existir ≠ ser alcançável — seis ocorrências registradas

`capacidade-existe-nao-e-alcancavel` é a memória mais importante para quem escreve site:

> *"Já aconteceu **seis vezes** neste repo: a capacidade é escrita, revisada, testada,
> mergeada — e inalcançável por quem usa o produto. […] Vale como pergunta de fechamento de
> qualquer fase: **dá para fazer isso clicando?**"*

Casos que mudam o que a página pode dizer:

| capacidade | estado real |
|---|---|
| Instalação de pacote de vertical | **só** por `POST /workflow-templates/packages/:slug/install`. **Nenhuma tela.** Hoje é uma chamada feita por nós no provisionamento |
| `/clinic-portal/roster` (convidar médico e secretária) | rota funciona, **nenhuma página a chama**. A clínica se cadastra sozinha, recebe o código, e fica sem caminho para pôr alguém no quadro — enquanto `/comecar.html` promete "convida a equipe" no passo 03 |
| Ações de comércio do painel | **quebradas** — chamam a rota de produtos sem informar a loja |

**Regra que entra na F7 do plano:** o cross-check site → código passa a ter uma terceira
pergunta: *"dá para fazer isso clicando?"*. Promessa alcançável só por API é dita como tal.

---

## 2. O material novo — o que o site pode dizer e não estava dizendo

### 2.1 O conector de banco de dados já existe, e o discurso comercial o trata como obra

Da mesma memória, e é achado de venda:

> *"'Conecte sua base/API': o discurso comercial trata como coisa a construir, e o motor está
> pronto e maduro — `DATABASE` com pg/mysql2/mssql, SQL parametrizado, allowlist de
> identificador, `readOnly`, guarda contra requisição forjada e timeout. Falta só embalagem."*

Para a avaliação técnica, isso responde a segunda pergunta de toda reunião — *"conecta no que
eu já tenho?"* — com uma lista de garantias, não com uma promessa. Entrou no Quadro A2 do
artefato executivo, com o limite dito: **não há assistente que descubra o esquema e gere as
consultas; isso é configuração.**

### 2.2 "O modelo julga; não transporta" — a melhor peça de governança que temos

`agente-decide-nao-transporta`, dois defeitos do mesmo dia, com sinal trocado:

- **Transportar:** o agente recebeu 431 caracteres de um endereço assinado e devolveu 200 —
  parou sozinho no meio, sem estourar nenhum limite. Arquivo quebrado entregue com estado
  `enviado` e registro limpo. Conserto: o agente devolve um identificador curto e uma ação
  determinística busca o resto.
- **Decidir caso enumerável:** dois desfechos possíveis, e a resposta variava — o prompt do
  agente puxava sempre para a recusa. Passar o motivo no contexto **não venceu o prompt**.
  Conserto: condicional. 621 tokens → 0.

Vale como argumento porque é **verificável, específico e contraintuitivo** — e porque nenhum
concorrente que vende "agentes autônomos" pode dizer isso sem se contradizer.

### 2.3 Números e fatos que ancoram a honestidade

| fato | fonte |
|---|---|
| **12 tenants raiz em produção, 2 com credencial de WhatsApp; última escrita no data store em 20/07** | `producao-sem-clientes-reais`, medido em 17/08 |
| O bloco de comércio tem **130 rotas**; o painel embrulha **6** | `commerce-bb-tem-130-rotas` |
| São **32 blocos**, não 19; produção roda em modo standalone | `padroes-arquiteturais-bb-v2` |
| Comércio de bairro **não tem ERP** — sistema próprio, ruim ou nenhum; o que existe é importação, nunca sincronia de duas vias | `comercio-de-bairro-nao-tem-erp` |

---

## 3. Duas preferências permanentes do dono que eu estava violando

### 3.1 Todo artefato leva toggle de tema

`artefato-sempre-com-toggle-de-tema` — pedido explícito, com "SEMPRE" em maiúsculas:

> *"Todo artefato que eu publicar leva um toggle visível de claro/escuro. Não é por página, é
> padrão."*

E os quatro cuidados que a memória já registra: script de init **antes do `<style>`**, rótulo
que lê o tema **efetivo** (não só o carimbo), seguir o sistema enquanto não houver escolha
explícita, e `try/catch` no armazenamento.

**Os três artefatos desta frente foram corrigidos em 27/08.** O padrão entra na F8 do plano
como catraca.

### 3.2 Dois sistemas de design, não um

`artefato-segue-design-system-precisao`: *"'Precisão' é só hotsite; artefato do produto segue
o revamp v1 do painel (roxo `#734B9C`)."*

O acento do artefato executivo foi alinhado a **`#734B9C`** — o roxo da casa — em vez do tom
mais escuro que eu havia escolhido por contraste.

---

## 4. O que isso muda no plano

1. **`05-plano.md` F7 ganha a terceira pergunta:** *"dá para fazer isso clicando?"*. Promessa
   alcançável só por API é declarada como tal.
2. **`05-plano.md` F8 ganha uma catraca:** toggle de tema visível, com init antes da primeira
   pintura.
3. **O `06` reordena:** `consultoria.catalisa.app` sobe, porque a capacidade já existe.
4. **A leitura de plano passa a exigir a data.** Antes de citar um documento de `docs/plans/`,
   conferir se a memória ou a master já o superaram — foi assim que este erro nasceu.

---

## 5. Armadilha de artefato: efeito de rolagem que morre em silêncio

> Achado em 27/08 medindo no navegador, depois de o dono reportar duas vezes que as
> animações em rolagem não funcionavam. **As duas primeiras hipóteses minhas estavam
> erradas** — só a medição resolveu.

### O que quebra

| causa | sintoma | como confirmar |
|---|---|---|
| **`requestAnimationFrame` no caminho crítico** | um guard `if(tick)return; tick=true; rAF(()=>{ …; tick=false })` **trava para sempre** se o quadro nunca vier. Em aba oculta e dentro de iframe, não vem | `document.visibilityState` e um contador de rAF |
| **Quem rola não é quem você acha** | no visualizador de artefato pode ser a página de fora; o evento de scroll **nunca chega** ao documento de dentro | `document.scrollingElement` e um contador de eventos no `window` |
| **`overflow` no `<html>`** | tira do `documentElement` o papel de rolador e passa ao `body`: `documentElement.scrollTop` trava em 0 | comparar `html.scrollTop` com `body.scrollTop` |
| **Teste local sem `<!doctype>`** | modo quirks, o `body` vira o rolador, e a medição descreve um ambiente que não existe | `document.compatMode` tem que ser `CSS1Compat` |

### A regra

**Nada de correção de rolagem depende de quadro.** Estrangule por tempo (`Date.now()`), não
por `requestAnimationFrame`, e acrescente um **relógio de segurança** de ~120 ms que relê a
geometria — assim o efeito funciona mesmo quando o evento de scroll não chega.

### Como testar de verdade

Servir o arquivo **envolvido no mesmo esqueleto do publicador** (`<!doctype html>` + `head` +
`body`), abrir no navegador e medir valores computados — não olhar. E lembrar que **aba
oculta não roda quadro**: `visibilityState` entra no relatório, senão a medição mente.
Relacionado: [[tab-em-background-engole-clique-sintetico]] e
[[artefato-publicado-tem-que-ser-aberto]].

### O outro achado, de alinhamento

Célula de grade com `border-right` e `padding-…-0` no lado esquerdo deixa o conteúdo
**colado na borda da célula vizinha**. A correção é `padding` simétrico em todas e
`padding-left:0` **só na primeira**, para ela seguir alinhada à coluna de texto.
