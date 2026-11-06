# 11 — Arquitetura de conteúdo: o modelo das seis etapas, testado, e o mapa de subpáginas

> Perguntas do dono, 27/08, todas legítimas e todas com resposta diferente:
> **(a)** as seis etapas servem para todo produto — crédito cabe aqui?
> **(b)** a matriz de lacunas não nos prejudica, parecendo produto falho?
> **(c)** onde ficam as subpáginas — produto, geração de valor, arquitetura, plataforma,
> segurança, agêntico — e qual a melhor abordagem para as *features*?
> **(d)** o canal não pode ser só WhatsApp, e o valor não é só canal.
> **(e)** usar vocabulário de mercado (dados, visão 360) em vez de fugir de todo jargão.

---

## 1. As seis etapas, testadas produto a produto

Testei o modelo contra os dez produtos, existentes e planejados. O resultado tem duas
partes: **crédito é o melhor encaixe de todos**, e **uma das seis etapas está com o nome
errado**.

### 1.1 Crédito cabe — e é o caso mais perfeito da lista

| etapa | o que acontece numa esteira de crédito | existe? |
|---|---|---|
| 01 Atender | a pessoa pede simulação, por qualquer canal | ✅ |
| 02 Decidir | bureau com cache, política em tabela versionada, pontuação, faixa de taxa, alçada | ✅ |
| 03 — | proposta com parcela, IOF e **custo efetivo total**; contrato do modelo; assinatura | ✅ |
| 04 Executar | desembolso e o registro dele; a versão do produto congelada no contrato | ✅ |
| 05 Retomar | régua de cobrança, renegociação, renovação | ✅ |
| 06 Responder | quem aprovou, quando, sob qual versão da política | ✅ |

Não é coincidência: **o ciclo de vida da FICO é um ciclo de crédito**, e foi dele que o
modelo veio. Crédito não é a exceção — é o caso canônico. O que gerou a dúvida foi o nome da
etapa 03.

### 1.2 O nome errado: “Propor” é comercial demais

`Propor` funciona para Ágora e Antecipação e **quebra** para clínica, personal e comércio —
onde o que sai não é uma proposta, é um pedido, um plano de treino, um parecer.

**Correção: a etapa 03 passa a ser `Formalizar`** — *o que sai por escrito e passa a valer*.

| produto | o que a etapa 03 produz |
|---|---|
| Crédito | proposta com custo efetivo, e o contrato |
| Antecipação | borderô e proposta com o líquido |
| Ágora | a pré-proposta comercial |
| Recrutamento | o parecer sobre o candidato |
| Personal | o plano de treino |
| Comércio | o pedido com o Pix |
| Clínica | o encaminhamento e o documento da consulta |

Com esse nome, **as seis etapas passam a servir os dez produtos**.

### 1.3 Onde o modelo genuinamente não serve — e isso precisa ser dito

| não serve para | por quê |
|---|---|
| **Bloco vendido avulso** (bureau, cálculo, assinatura como API) | não há relação com cliente final; é insumo, não etapa. Se um dia formos vender bloco avulso, é **outra** página, com outra estrutura |
| **A mesa de crédito** (a tela de quem analisa) | é operação interna, não jornada de cliente. Ela vive *dentro* da etapa 02, como ferramenta de quem decide |
| **Rooms, agenda, conhecimento** | são capacidades transversais; atravessam etapas em vez de ocupar uma |

**Consequência de desenho:** o eixo das seis etapas é o eixo da **relação com o cliente final
da empresa contratante**. Tudo que não estiver nesse eixo — infraestrutura avulsa, ferramenta
interna, capacidade transversal — entra por outra porta do site, nunca forçado dentro de uma
etapa.

---

## 2. A matriz de lacunas: o dono está certo, e a correção é inverter o sujeito

A preocupação, verbatim: *“tenho dúvidas se isso não pode nos prejudicar ao invés de ajudar,
parecer falho, focar em meia dúzia de produtos.”*

**Procede, e por um motivo específico:** uma matriz de lacunas só é lida como diagnóstico
quando o leitor já confia no enquadramento. Na home ele ainda não confia — então ele lê a
tabela como **o nosso boletim**, e vê buracos.

### A correção, em três movimentos

| | o que muda |
|---|---|
| **1. Inverter o sujeito** | Deixa de ser *“cobertura por produto”* e passa a ser *“onde a sua operação ainda é manual”*. O visitante marca as **etapas que doem**, e a página devolve **quais produtos as resolvem**. O mesmo dado, psicologia oposta: sai de boletim nosso e vira diagnóstico dele |
| **2. Tirar da home** | A matriz vai para `/produtos`. Na home entra a afirmação positiva e verdadeira: **cada uma das seis etapas tem pelo menos um produto que a resolve como especialidade** — verificado, inclusive a 05 |
| **3. Mostrar só o que é real** | Nada de linhas “próximo” inflando a tabela com vazio. Seis produtos reais em vez de dez linhas com quatro delas quase vazias |

E a frase que desarma a leitura de fraqueza, dita **antes** da tabela:

> Nenhuma empresa precisa das seis etapas. A pergunta não é quantas nós cobrimos — é quais
> delas, na sua operação, ainda dependem de alguém lembrar.

---

## 3. Vocabulário: jargão de fornecedor × vocabulário de mercado

O pedido — *“use termos como dados, visão 360 etc., jargões comuns ao mercado”* — parece
contradizer a regra do `09`, e não contradiz. Faltava a distinção:

| | exemplo | veredito |
|---|---|---|
| **Jargão de fornecedor** — inventado para parecer categoria | *semantic data layer*, *decision-ready*, *agentic orchestration*, *composable workspace* | **fora.** Não ancora em nada que o comprador já tenha na cabeça |
| **Vocabulário de mercado** — o comprador já usa e já entende | **visão 360 do cliente**, **base única**, **cadastro único**, **fonte única de verdade**, **jornada**, **funil**, **esteira**, **originação**, **régua de cobrança**, **alçada**, **trilha de auditoria** | **dentro.** É âncora, não ruído — e usar o termo dele é o oposto de obscurecer |
| **Termo interno nosso** | *pacote*, *bloco*, *ação*, *etapa* | **dentro, se definido na primeira aparição** |

A regra corrigida do `09` §3: **não é “sem jargão” — é “sem jargão que só nós usamos”.**

Aplicado à seção do efeito composto, que era abstrata demais:

> **Antes:** “Todos operam sobre o mesmo cadastro e a mesma linha do tempo, dentro da conta
> do cliente. A cobertura soma em vez de se sobrepor.”
>
> **Depois:** “Todos os produtos gravam na **mesma base**, dentro da conta da empresa. Isso
> significa **visão 360 do cliente** desde o primeiro produto — e não como projeto de
> integração depois: o cadastro, o histórico de atendimento, os documentos e as decisões
> nascem no mesmo lugar. O segundo produto **não pede migração, não pede conector e não pede
> reconciliação**.”

---

## 4. Canais: mais completo, e o valor que não está no canal

O texto anterior — *“atendimento no WhatsApp, no site, em sala de vídeo e em portal”* — é
estreito em dois sentidos: subconta os canais e sugere que o valor **é** o canal.

### 4.1 O inventário real, conferido nos blocos em 27/08

| canal | estado |
|---|---|
| WhatsApp **no número que a empresa já usa** (sem trocar de linha, sem migrar conversa) | produção |
| WhatsApp oficial da Meta, multi-tenant, do template ao atendimento humano | produção |
| Sala de vídeo com convidado, gravação e **transcrição em português** | produção |
| E-mail — Gmail e Outlook atrás da mesma API | beta |
| Agenda — Google e Outlook, com disponibilidade calculada | beta |
| Slack | alpha |
| Site e portal, pela camada de servidor própria | produção |
| **Qualquer sistema que fale HTTP** — totem, PDV, aplicativo próprio, ERP — por requisição e por evento assinado com retentativa | produção |

⚠️ **Telegram e Microsoft Teams não existem hoje.** Citar seria promessa sem lastro. Totem e
PDV entram pela última linha — que é verdadeira e genérica — e não como logotipo de canal.

### 4.2 A metade que não é canal

O ponto do dono: *“não somos apenas úteis por canais, mas na operação — eficiência, processos
inteligentes e agênticos.”* Correto, e é o argumento mais forte contra a confusão com
chatbot. O que roda **sem conversa nenhuma**:

- **por horário** — o resumo da manhã: quantos chegaram, quantas reuniões hoje, quantas
  propostas esperando alguém liberar;
- **por evento** — a chamada encerrou, alguém liberou o documento, o pagamento entrou, o
  documento foi assinado;
- **por ausência** — quem parou de responder, com **teto de contato**;
- **em lote** — segmentar a base e agir sobre o segmento inteiro.

A frase que separa a categoria, e ela vale mais que a lista de canais:

> A pergunta que separa isto de um chatbot não é quantas mensagens ele responde. É **o que
> acontece depois que a conversa termina** — e quem disparou. A resposta nunca é uma pessoa.

---

## 5. O mapa de subpáginas

### 5.1 A árvore

```
/                                a operação em seis etapas · o argumento inteiro
│
├── /etapas/atender              ┐
├── /etapas/decidir              │  6 páginas — a espinha operacional.
├── /etapas/formalizar           │  Cada uma: a dor, o que existe, quem serve,
├── /etapas/executar             │  e as capacidades daquela etapa em lista densa.
├── /etapas/retomar              │
├── /etapas/responder            ┘
│
├── /produtos                    o catálogo + o DIAGNÓSTICO (matriz invertida)
│   └── /produtos/<slug>         uma por produto — inclui o limite daquele produto
│
├── /plataforma                  arquitetura em cinco camadas, produto no topo
│   ├── /plataforma/dados        base única, visão 360, isolamento por conta
│   ├── /plataforma/decisao      a decisão como objeto: desenhar→escrever→simular→publicar→medir
│   ├── /plataforma/agentes      o que é agêntico, o que é determinístico, e por que a trava é estrutural
│   ├── /plataforma/canais       os canais E o que roda sem canal nenhum
│   └── /plataforma/capacidades  o ÍNDICE — tabela buscável de tudo que existe
│
├── /valor                       geração de valor: unidade de cobrança por etapa, as duas frentes
├── /seguranca                   isolamento, trilha, versão congelada, conformidade
├── /como-nasce                  o método e a velocidade — as datas reais
├── /o-que-quebrou               os defeitos medidos e o que cada um mudou
├── /estado                      o que existe, o que falta, o que não fazemos
└── /empresa
```

### 5.2 Onde cada dúvida do dono foi parar

| dúvida | destino |
|---|---|
| *“o que ainda não há” não precisa estar na home* | vai para **`/estado`** e, em recorte, para cada `/produtos/<slug>`. A home fica com **escopo** (o que está dentro e fora), que é diferente de confissão |
| *o limite de crédito especificamente* | **`/produtos/credito`**: “analisamos e não emprestamos — não somos instituição autorizada e não temos funding próprio”. Dito onde o comprador de crédito está, não onde o dono de clínica está |
| *a tabela das seis etapas com a pergunta de quem opera* | **`/produtos`** e as seis `/etapas/*`. Na home fica só a fita das seis etapas com uma linha cada |
| *“política de decisão em tabela versionada”* | **`/plataforma/decisao`** e `/etapas/decidir`. Sai do escopo da home |
| *“atendimento no WhatsApp…”* | **`/plataforma/canais`**, completo. Na home, uma linha genérica e honesta |

### 5.3 A abordagem para as *features* — a pergunta em aberto

O dono não sabia qual seria a melhor abordagem. Recomendação, com o motivo:

> **Feature não vira página. Feature vira linha dentro de uma etapa, e entrada num índice.**

Três níveis, e só três:

| nível | quantas páginas | o que responde |
|---|---|---|
| **Etapa** | 6 | *“o que resolve esta parte da minha operação?”* — as capacidades daquela etapa em lista densa com fio, sem card |
| **Produto** | 6 a 10 | *“o que eu contrato?”* |
| **Plataforma** | 5 | *“por que isso funciona junto e não trava?”* |

E **um** índice: `/plataforma/capacidades`, uma tabela buscável e filtrável — capacidade,
etapa que serve, estado, e a que produto pertence. É ela que escala para 207 ações sem virar
207 páginas, e é a página que o avaliador técnico vai usar. Uma tabela de 207 linhas com
filtro é útil; 207 páginas de 80 palavras são ruído e um desastre de SEO.

**O que não fazer, e é a tentação óbvia:** uma página por bloco (32) ou por ação (207). Isso
existe e já está pronto — é o `docs.catalisa.app`, alimentado pelo README de cada módulo. O
site institucional **linka para lá**, não o reimplementa.

---

## 6. O que muda no artefato executivo

1. Etapa 03 `Propor` → **`Formalizar`**, em todas as ocorrências.
2. A matriz sai da home e vai para `/produtos`, **com o sujeito invertido**.
3. A home ganha a afirmação positiva: cada etapa tem ao menos um produto que a resolve.
4. “O que ainda não há” sai da home → `/estado` e páginas de produto.
5. Canais reescritos completos, com o bloco “o que roda sem conversa nenhuma”.
6. O efeito composto reescrito com **visão 360** e **base única**.
7. Escopo (§1) permanece na home — é diferente de confissão, e é o que abre credibilidade.
