# 05 — Plano de execução, com catraca

O método é o do `hotsite-playbook.md`, adaptado ao maior dos hotsites. Cada fase tem
**entrada**, **trabalho** e **catraca** — condição verificável sem a qual não se passa para
a seguinte. As catracas existem porque cada uma já foi violada e o estrago foi medido.

**Estado atual: F0 concluída, F1 aguardando a escolha da direção.**

---

## F0 — Briefing, descoberta e pesquisa ✅ concluída

**Entregou:** `01-descoberta.md`, `02-conceito.md`, `03-benchmarks.md`,
`06-produtos-possiveis.md`, `07-vis-a-vis-site-atual.md`.

**Catraca:** o dono leu e validou. ⬜

---

## F1 — Direção e plano de design ⬅️ **aqui**

**Trabalho:** as três direções (`04-direcoes.md`) + o artefato navegável.

**Catraca:** **o dono abriu o artefato, navegou nas três, e escolheu uma** — inteira ou em
síntese. Sem isso não se escreve conteúdo, porque a gramática visual decide o que cada
seção pode ser.

Decisões que travam junto com a direção, e que não se rediscutem depois:
- o **mote** (`02` §2) e a manchete do herói;
- **tema claro, escuro ou único** — e um tema só é decisão legítima, não omissão;
- o mapa de rotas e a **nomenclatura** (`02` §6);
- quais números entram, com a reconciliação do "60+" resolvida (`07` §4).

---

## F2 — Mídia (Pexels)

Roda **antes** do artefato fiel: mídia é conteúdo, e artefato sem imagem valida metade do
site. É o buraco por onde o `med` passou.

Ferramenta: `wpp.bb.catalisa.io/scripts/pexels.mjs` (`buscar` lista, `baixar` grava e
registra o crédito em `CREDITOS.md`). Chave em `~/.config/pexels/api_key`.

Escolha pelo **mundo do argumento**, nunca "gente sorrindo em escritório".

**Catraca:** `src/assets/` não está vazio, e o `CREDITOS.md` existe.

---

## F3 — O site inteiro como artefato, aprovado antes do wiring

O site inteiro, navegável, com **conteúdo final e mídia final** — sem encanamento. O que se
valida: gramática visual, ritmo, copy, densidade, navegação e os dois temas.

Mídia embutida em base64 **só aqui**. Teto de 16 MB.

**Catraca:** o dono abriu, clicou em cada controle e aprovou.

---

## F4 — Roteiro de conteúdo, rotas e busca

Tabela de rotas com `id`, rota em português legível, `<title>` ≤ 60 caracteres, descrição de
140–158, prioridade. **As descrições falam a dor, não a categoria.**

Aqui também: o **mapa de redirecionamentos** das 94 rotas atuais. Rota que morre sem 301
queima autoridade acumulada — e é a única perda irreversível de todo o plano.

**Catraca:** cada página tem título, descrição e rota próprios; nenhum link aponta para rota
inexistente; **toda rota atual tem destino**.

---

## F5 — Construção

Este site **não** é um hotsite do kit: é o Vite/React/Chakra que já existe, com
pré-renderização Puppeteer de 80+ rotas e i18n em 36 namespaces. O desenho é próprio.

**A dívida herdada é remover o que não vai ser usado**, não trocar a cor e seguir — foi
exatamente o erro que produziu 78% de CSS morto no `med`.

**Catraca:** `npm run build` passa · `npm run lint` limpo · CSS morto ≤ 15% · **metade das
seções de cada página tem recurso visual** (a régua da §3.7 do playbook, medida página a
página, não só no fim).

---

## F6 — Revisão de copy, SEO e argumento comercial

Ler o site **inteiro como texto corrido**, não como estrutura. Produzir
`docs/site-v2/08-revisao-copy.md`: o que foi corrigido, o que só o dono decide, o que fica
como risco.

O que essa passada procura, por evidência do que já achou antes: seção que contradiz a
vizinha · o mesmo caso com números diferentes em dois pontos · o termo mais buscado ausente
por extenso · CTAs demais para a mesma ação · **as três perguntas que travam toda compra
B2B** (preço, prazo, e "se não funcionar") sem resposta.

**Catraca:** o documento existe e a lista de "só o dono decide" foi entregue.

---

## F7 — Cross-check contra o código

Tabela de mão dupla, verificada **contra o código**:

| direção | pergunta |
|---|---|
| site → código | cada promessa existe mesmo? |
| código → site | o que existe e o site não vende? |
| site → instalável | quem contratar encontra ligado, ou é só da plataforma? |

A terceira linha é a que quase passou no Ágora, e é a mesma armadilha aqui em escala maior.

**Catraca:** `docs/site-v2/09-cross-check.md` com as três direções fechadas, e as promessas
sem lastro **cortadas ou implementadas**.

---

## F8 — Pente fino de produção

`<head>` e JSON-LD · **mobile como passada dedicada**, medindo 414 px de verdade (e 768 px,
o tamanho mais arriscado) · acessibilidade e contraste real contra o fundo opaco ·
performance · medição · legal (LGPD, Consent Mode v2, e o que a verificação do Google OAuth
exige).

**Catraca:** zero rolagem horizontal em 414 px · alvos de toque ≥ 44 px · corpo ≥ 14 px ·
todas as páginas abertas no modo dispositivo.

---

## F9 — Corte, e o fim definido

**A substituição do site atual é a fase de maior risco de todo o plano**, e o risco não é
técnico:

1. **Os 301 antes do corte** (F4). Sem eles, a autoridade de 94 rotas evapora.
2. **A verificação do Google OAuth depende de páginas específicas** — a home explica o
   propósito do app e a política de privacidade descreve o uso dos dados. Mexer nelas sem
   cuidado pode derrubar uma verificação já conquistada. **Conferir antes de publicar.**
3. **As apresentações com convite não podem quebrar** — é o funil assistido que está de pé.
4. **`agora.catalisa.app` continua sendo o funil vivo.** O site novo desagua nele.

**O fim, por escrito, antes de começar:**

> *O visitante entra pela busca ou por indicação, entende em oito segundos em que categoria
> a Catalisa está, encontra um produto que corresponde à dor dele, atravessa até a porta
> daquele produto e é atendido — e o código de tudo isso está na master, com o site antigo
> redirecionado.*

**Catraca:** o fim escrito foi atingido, ou está dito o que falta e **de quem é**.
