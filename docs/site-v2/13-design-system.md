# 13 — Design system: o contrato

> **Para quem constrói o site — humano ou IA.** Este documento é normativo: onde ele diz
> "nunca", é catraca de build, não preferência. A versão renderizada, com cada peça viva e
> navegável, é `artefatos/2026-08-27-sistema-visual.html`.
>
> **Como usar:** leia §1 e §2 antes de escrever qualquer linha. Ao escolher um componente,
> abra §4 e confira as três perguntas — *existe para*, *usar quando*, *não usar*.

---

## 0. A proposição, que precede tudo

O protagonista do site é **o modelo**, não o catálogo de produtos. Os produtos entram como
**prova de flexibilidade** do motor. Um site que lista produtos e pede que o visitante
escolha vira catálogo — e catálogo foi exatamente o desvio que esta versão corrige.

    o balde     32 blocos, 207 ações        existe, e NÃO se vende
    o manual    o pacote declarativo        é a razão de o próximo produto custar dias
    o kit       o produto com porta própria é o que se contrata
    a cidade    a base única por empresa    é o que retém e expande

---

## 1. Átomos

### 1.1 Cor — quatro papéis, não uma lista

```css
--marca-amb:#FDC234;
--pap:  color-mix(in srgb, #FCFCFD 95%, var(--marca-amb));  /* #FCF9F3 fundo      */
--pap2: color-mix(in srgb, #F4F4F7 94%, var(--marca-amb));  /* #F5F1EB quadro     */
--pap3: color-mix(in srgb, #ECECF2 92%, var(--marca-amb));  /* #EDE9E3 dentro do desenho */
--rule: color-mix(in srgb, #E1E2E9 93%, var(--marca-amb));  /* #E3E0DC fio        */
--rule2:color-mix(in srgb, #C7C9D4 93%, var(--marca-amb));  /* #CBC9C9 fio forte  */
--ink:#101317; --ink2:#39404A; --mut:#6C6B7A;               /* a tinta NÃO se aquece */
--acc:#734B9C;   /* A DECISÃO — fio, texto, estado ativo, um botão sólido por tela */
--lim:#8F6206;   /* O ATO HUMANO e o LIMITE — ponto, selo, tracejado               */
--neg:#B3261E;   /* SÓ a negativa — o que não atravessa                            */
```

| regra | teste |
|---|---|
| Nenhuma cor sem procedência | `grep -oE '#[0-9A-Fa-f]{6}'` no CSS só pode achar as receitas. **Hexadecimal literal reprova o build** |
| Roxo nunca em área grande chapada | regra do styleguide da casa |
| Laranja `--accent` só como fio | em área chapada, com papel quente, cai no clichê creme-e-terracota |
| Contraste | ink 17,7:1 · ink2 10,0:1 · acc 6,2:1 · lim 5,1:1 · mut 5,0:1 — todos sobre `--pap` |

**Modo escuro:** três estados obrigatórios — `:root` claro completo, `@media (prefers-color-scheme:dark)` guardado por `:root:not([data-theme="light"])`, e `:root[data-theme="dark"]`. Papel é conceito de modo claro; no escuro voltam os neutros frios do styleguide.

### 1.2 Tipografia — três vozes que não se cruzam

| voz | família | papel |
|---|---|---|
| afirmação | **Source Serif 4** 600 | manchete e prosa longa |
| controle | **Instrument Sans** 400/600 | interface, rótulo, botão |
| evidência | **IBM Plex Mono** 400/500 | número, hora, rótulo de seção, nome de token, legenda de quadro |

Escala: display `clamp(34,5.6vw,64)` · título `clamp(24,3.4vw,36)` · prosa 16/1.6 · interface 14,5 · dado mono 12 tracking .1em · rótulo mono 10,5 tracking .14em maiúsculas.
Prosa perto de **65 caracteres** por linha. Manchete com `text-wrap:balance`.
**Nunca:** serifada em botão · mono em texto corrido · uma quarta família.

### 1.3 Espaço — seis degraus

`13 · 22 · 26 · 36 · 52 · 78` px. Grossa de propósito: impede o ajuste fino que produz páginas sutilmente desalinhadas.

⚠️ **O defeito real que apareceu aqui:** célula de grade com `border-right` e padding zerado à esquerda deixa o conteúdo **colado na borda da vizinha**.

```css
.faixa div{ padding:26px 22px; border-right:1px solid var(--rule) }
.faixa div:first-child{ padding-left:0 }   /* só a primeira, para alinhar com o texto */
.faixa div:last-child{ border-right:0 }
```

### 1.4 Traço — o peso carrega sentido

| peso | cor | significa |
|---|---|---|
| 1,2 | `--rule2` | estrutura, grade, eixo |
| 1,5 | `--acc` | a decisão, o caminho, o ativo |
| 1,5 tracejado | `--lim` | o ato humano, o retorno, o limite |
| 1,6 | `--neg` | o que não atravessa |

Tracejado **só** para retorno, ausência e limite — nunca por estética.

### 1.5 Raio, sombra, superfície

Raio **máximo 3px**. **Zero sombra.** Três superfícies (`--pap`, `--pap2`, `--pap3`), separadas por **fio**, nunca por elevação. Sombra e canto mole são a assinatura visual mais reconhecível de página gerada.

### 1.6 Ícone

SVG de traço, grade 24, peso 1,6, pontas arredondadas, `currentColor`. **Nunca emoji** — regra da casa, com motivo técnico: o campo de ícone dos produtos resolve por nome lucide, e emoji vira componente vazio sem erro.

### 1.7 Estados

Quatro sempre: repouso, foco, ativo, impedido. Foco com `outline:2px solid var(--acc); outline-offset:3px` — **nunca `outline:none` sem substituto**. Alvo de toque ≥ 44px. **Um botão sólido por tela.**

### 1.8 Numeral

`font-variant-numeric: tabular-nums` em tudo que aparece em coluna. Número só entra se foi **medido**.

---

## 2. As sete regras que decidem quando o gosto empata

| # | regra | teste verificável |
|---|---|---|
| R1 | **O card é o último recurso.** Antes dele: lista com fio → matriz → objeto desenhado por item → prosa ao lado da ilustração | duas peças da mesma página nunca usam a mesma forma; **≥50% das seções com recurso visual** |
| R2 | **Nada de movimento depende de quadro** | zero `requestAnimationFrame` no caminho crítico; zero `behavior:'smooth'`; zero `overflow` no `<html>`; relógio de 120ms como rede |
| R3 | **Caso plausível não é caso factual** | nenhum cliente, depoimento ou número inventado; todo mock marcado como mock **na peça**; escopo na home, lista de faltas na subpágina |
| R4 | **Jargão de fornecedor fora, vocabulário de mercado dentro** | *visão 360*, *base única*, *esteira*, *alçada* entram; *semantic data layer*, *agentic orchestration*, *infinitas combinações* saem |
| R5 | **Lista anti-slop** | sem gradiente roxo-azul, sem card arredondado com barra de acento, sem grade de cards com ícone, sem passos numerados abstratos, sem emoji marcador |
| R6 | **Mobile e acessibilidade** | zero rolagem horizontal em 414px · toque ≥44px · corpo ≥14px · contraste 4,5 contra o primeiro fundo opaco · testar **768px**, o tamanho mais arriscado |
| R7 | **Catracas de build** | hexadecimal literal reprova · todo `var(--x)` tem `--x:` · chave desbalanceada reprova · classe usada sem regra reprova · `node --check` no JS embutido |

---

## 3. Moléculas

| id | peça | existe para | não usar quando |
|---|---|---|---|
| M1 | **Botão** `.btn-p` / `.btn-s` | uma conversão por tela; o ponto âmbar amarra a marca à ação | três ou mais juntos — dois viram link |
| M2 | **Selo de estado** `.chip2` | classificar capacidade com honestidade; os selos são literais | como categoria de produto ou enfeite |
| M3 | **Lista com fio** `.fio-lista` | a alternativa padrão ao card; serve para quase tudo | acima de sete itens — vira parede |
| M4 | **Faixa de números** `.conta` | lastro imediato à manchete | com número de terceiro, ou não medido |
| M5 | **Citação verbatim** `.cit2` | palavra de terceiro que não pode ser parafraseada | para frase nossa — isso é manchete |
| M6 | **Marginália de decisão** `.mg2` | nomear **que decisão do leitor** a seção avança | como resumo do parágrafo |
| M7 | **Quadro com legenda** `.q` | tabela numerada com fonte; vira evidência citável | na home |
| M8 | **Par certo/errado** `.par` | mostrar a regra em vez de enunciá-la | fora de documentação, exceto para nomear o modelo errado antes do certo |
| M9 | **Ponto de cobertura** `.pt.f2/.f1/.f0` | ler matriz sem legenda | na home; e sempre com o **sujeito invertido** — "onde a sua operação é manual", não "o que cobrimos" |
| M10 | **Bloco de limite** `LimitBlock` | nomear o limite antes de o comprador achá-lo | na home — escopo ≠ confissão |
| M11 | **FAQItem** `<details>` nativo | derruba objeção e alimenta o `FAQPage`; funciona sem JS | pergunta que ninguém faz |
| M12 | **KeyValue** | ficha técnica: rótulo fixo, fato à direita | acima de seis linhas — vira tabela, e tabela tem legenda |
| M13 | **StepRow** | o passo com o **gatilho** à esquerda — e o gatilho nunca é uma pessoa | quando não houver gatilho real |
| M14 | **ProductRow** | linha de catálogo: nome, **dor**, porta, estado | grade de cards com logotipo |
| M15 | **PriceRow** | a unidade variável por etapa | plano por franquia de execução — é cobrar por peça de LEGO |
| M16 | **ChannelRow** | canal com estado real, **inclusive o que não existe** | omitir Telegram/Teams em vez de marcá-los como ausentes |
| M17 | **BeforeAfter** | o mesmo dia nas duas versões, com o pé que conta | sem medição — o pé descreve a condição, não a quantidade |
| M18 | **Callout** | nota que interrompe de propósito; âmbar = limite, roxo = leitura | mais de um por seção |
| M19 | **SourceCite** | a fonte que torna prova de terceiro utilizável | sem ela o número vira alegação nossa |
| M20 | **PageIndex** | sumário lateral que marca onde o leitor está | na home |

### 3.1 Átomos — 25 no total

`Button` · `StatusSeal` · `CoverageDot` · `Icon` · `Eyebrow` · `Numeral` · `Rule` · `Kicker` · `ThemeToggle` ·
`Link` (fio a 40%, fecha no hover) · `Tag` (categoria, não estado) · `StageBadge` (número **e** nome) ·
`Meter` (sempre com o denominador dito) · `Divider` (só com rótulo que informa) · `Anchor` (§ citável) ·
`LangSwitch` · `SkipLink` (primeiro elemento do corpo) · `Ordinal` · `Ratio` (2/6 informa mais que 33%) ·
`Delta` (com base temporal declarada; "sem medição" é estado legítimo) · `Timestamp` (**hora de parede**, nunca `toISOString()`) ·
`Highlight` (uma expressão por seção) · `Abbr` (toda sigla na primeira ocorrência) · `Caption` (com crédito) ·
`Empty` (vazio sem explicação parece defeito).

### 3.2 Moléculas acrescentadas na segunda leva

`PullQuote` (uma por página, na virada do argumento) · `Figure` (com `alt`, `loading=lazy` e dimensões) ·
`StatCompare` (quando a lacuna é o argumento — 130 rotas × 6 embrulhadas) · `TimelineMark` (data vinda de arquivo versionado) ·
`Definition` (termo nosso definido na primeira aparição) · `RiskRow` (**risco sem mitigação vira confissão**) ·
`Breadcrumb` · `NextPrev` · `InlineCTA` · `Segmented`.

### 3.3 Estruturas acrescentadas

`ComparisonTable` (com a declaração de que não somos avaliados por analista) · `MethodPhases` (a catraca é o que separa método de intenção) ·
`RiskTable` · `Glossary` (não definir termo de mercado) · `RelatedPages` (o rótulo nomeia a **dúvida**, não a categoria) ·
`StatusBoard` (a peça que envelhece mais rápido).

---

## 4. Componentes

| id | peça | existe para | não usar quando |
|---|---|---|---|
| C1 | Herói vídeo cheio | abertura da home; vídeo é ambiente, não informação | em subpágina; um vídeo por site |
| C2 | Herói dividido com lista | afirmação forte com a prova ao lado | a foto for genérica |
| C3 | Herói carrossel sobre foto | quando a **quantidade** é o argumento | menos de quatro itens; como navegação principal |
| C4 | Herói tipo puro com diagrama | quando fotografia mentiria — **é o padrão na dúvida** | — |
| C5 | Herói escuro com painel | mostrar o que roda sem ninguém falando | sem a marcação de encenado (bloqueia publicação) |
| C6 | Herói com abas | partes iguais, ordem indiferente | se a ordem carrega informação → usar C10 |
| C7 | Faixa de mídia | respiro entre argumentos densos | duas seguidas; foto repetida da própria página |
| C8 | Tira com encaixe | sequência que anda de lado sem sequestrar a rolagem | **rolagem presa está proibida** |
| C9 | Grelha de revelação | ritmo em sequência curta | `opacity:0` no CSS — nada nasce escondido |
| C10 | Roteiro fixo | a ordem carrega informação | passos de uma tela cada — usar 16vh |
| C11 | Diagrama | substituir parágrafo | caixa-e-seta genérica |

### 4.0 Estruturas de página

Blocos que já são uma seção inteira, com o argumento embutido. Vieram do mapa de páginas do `11`.

| peça | existe para | regra que não se negocia |
|---|---|---|
| `SiteHeader` | agrupar pela **pergunta do visitante**, não pelos nossos módulos | abre por clique; no toque não existe passar o mouse |
| `SiteFooter` | o mapa inteiro + privacidade e termos | **a verificação do Google OAuth depende dessas páginas** |
| `ThreeQuestions` | preço, prazo, e "se não funcionar" | **sempre**, em B2B |
| `ProofTwoAxis` | capacidade é nossa, demanda é de terceiro, o que falta é declarado | vai onde um site normal poria logotipos |
| `ScopeTable` | dentro e fora, antes da conversa comercial | primeira seção depois do herói |
| `PricingByStage` | a unidade por etapa, com o **porquê** de cada uma | o que está fechado é a unidade, não o número |
| `CapabilityIndex` | escala para 207 ações sem virar 207 páginas | o site **linka** para `docs.catalisa.app`, não reimplementa |
| `StageIndex` | as seis etapas como eixo do catálogo | por etapa os produtos se somam; por setor, competem |
| `BreakageLog` | o defeito medido **e o que ele mudou** | sem a lição, é autodepreciação |
| `LiveDemoCTA` | o produto atendendo, no lugar de "fale com vendas" | só se o que responde disser quando é encenado |

### 4.2 Proibidos — existem em quase todo site B2B e não podem existir neste

Documentados porque a tentação aparece quando a página parece vazia, e porque **uma IA construindo o site vai propor cada um deles se ninguém disser não**.

| proibido | por quê | no lugar |
|---|---|---|
| `LogoWall` | carteira zerada; logotipo de parceiro lido como cliente é mentira por omissão | `ProofTwoAxis` |
| `Testimonial` | depoimento inventado morre em *"posso falar com essa empresa?"* | artefato real anonimizado |
| `CaseStudyCard` | caso plausível não é caso factual | `ProductRow` com a dor e a porta |
| `CustomerCounter` | o número real hoje é zero | `StatStrip` com o que foi contado no código |
| `TrustBadges` | não há certificação nem prêmio | `ScopeTable` e a página de confiança |
| `ActivityFeed` | encenação vendida como tempo real | `HeroPanel`, com "exemplo ilustrativo" no rodapé |

### 4.1 A régua do diagrama — quatro perguntas, todas precisam de sim

1. **Carrega argumento?** Se o desenho sai, o argumento cai junto.
2. **Substitui texto?** O parágrafo vira rótulo dentro dele.
3. **Vem do mundo do assunto?** Funcionaria igual num site de logística? Então refaça.
4. **A animação explica?** Dá para dizer *o que se move e por quê*.

### 4.2 Os catorze diagramas disponíveis

`01` o ciclo (operação→dado→pacote→produto) · `02` a pilha invertida · `03` dado ou código ·
`04` um motor, vários vocabulários · `05` o custo do enésimo produto · `06` um pacote, muitos
perfis · `07` base única e visão 360 · `08` a escada do composto · `09` o que não atravessa ·
`10` a versão congelada · `11` a fronteira é o toolset · `12` a régua do dia ·
`13` mapa de posicionamento · `14` duas frentes, uma máquina.

---

## 5. Movimento — o conjunto aprovado

| # | efeito | regra |
|---|---|---|
| 01 | Revelação escalonada | 14px, 500ms, 90ms de escalonamento. **Nada nasce escondido no CSS** — quem esconde é o JS, e só abaixo da dobra |
| 02 | Roteiro fixo | 16vh por passo |
| 03 | Traço que se desenha | a rolagem controla o traço, não o relógio |
| 04 | Contadores | só sobre número medido; por tempo, não por quadro |
| 05 | Tira com encaixe | tween próprio de 420ms; `scroll-snap` para o arrasto |
| 06 | Paralaxe | amplitude **22% da altura da faixa** para cada lado, imagem a 150% |
| 07 | Barra de progresso | página longa de argumento |

⚠️ **Demonstrar um efeito de entrada em cena tem um problema próprio:** se a demo fica no topo
da página, ela nunca está abaixo da dobra — logo nunca é escondida, logo nunca anima. A regra
continua certa; **a demo é que precisa de um gatilho próprio** (botão de repetir + disparo ao
abrir a aba). Vale para qualquer vitrine de componente de entrada.

**Cortados, e por quê:** rolagem horizontal presa (sequestrava três telas e quebrava no resize) · `scroll-behavior:smooth` global (brigava com as transformações) · passos de 30vh (seis telas para seis frases).

---

## 6. Tratamento de mídia

Todas as imagens e vídeos passam pelo mesmo pipeline, que é o que faz a fotografia de banco parecer nossa:

```bash
# foto
ffmpeg -i in.jpg -vf "scale=1400:-2,format=gray,eq=contrast=1.26:brightness=0.02,\
lutyuv=y='(floor(val/16))*16+8'" -q:v 6 out.jpg
# vídeo (8s, sem áudio)
ffmpeg -i in.mp4 -t 8 -vf "scale=1200:-2,format=gray,eq=contrast=1.30:brightness=0.03,\
lutyuv=y='(floor(val/16))*16+8',fps=22" -c:v libx264 -crf 34 -an -movflags +faststart out.mp4
```

**A quantização em 16 níveis é o que produz o efeito de tinta eletrônica** — cinza de alto contraste sozinho parece só "foto em preto e branco". Depois, na página, o duotom por filtro SVG leva o realce até a cor do papel.

Busca e crédito por `wpp.bb.catalisa.io/scripts/pexels.mjs` (chave em `~/.config/pexels/api_key`); o script grava `CREDITOS.md`. Escolher é humano: **pelo mundo do assunto**, nunca "gente sorrindo em escritório".

---

## 7. Como validar antes de publicar

```bash
node -e '
const fs=require("fs"),h=fs.readFileSync(P,"utf8");
const js=[...h.matchAll(/<script>([\s\S]*?)<\/script>/g)].map(m=>m[1]).join("\n");
try{new Function(js);console.log("JS ok")}catch(e){console.log("JS ERRO",e.message)}
const css=[...h.matchAll(/<style>([\s\S]*?)<\/style>/g)].map(m=>m[1]).join("\n");
console.log("chaves",(css.match(/{/g)||[]).length,"/",(css.match(/}/g)||[]).length);
const sel=new Set([...css.matchAll(/\.([a-zA-Z][\w-]*)/g)].map(m=>m[1]));
const used=new Set();for(const m of h.replace(/<pre[\s\S]*?<\/pre>/g,"").matchAll(/class=("([^"]*)"|([a-zA-Z][\w-]*))/g))(m[2]||m[3]).split(/\s+/).forEach(c=>c&&used.add(c));
console.log("mortas:",[...sel].filter(c=>!used.has(c)).join(", ")||"nenhuma");
console.log("sem regra:",[...used].filter(c=>!sel.has(c)).join(", ")||"nenhuma");
const u=new Set([...h.matchAll(/var\((--[a-z0-9-]+)\)/g)].map(m=>m[1])),d=new Set([...h.matchAll(/(--[a-z0-9-]+)\s*:/g)].map(m=>m[1]));
console.log("tokens órfãos:",[...u].filter(t=>!d.has(t)).join(", ")||"nenhum");'
```

E o teste que realmente conta: **servir com o mesmo esqueleto do publicador** (`<!doctype html>` incluso), abrir no navegador e **medir valores computados**. Sem doctype o navegador entra em modo quirks e o `body` vira o rolador — a medição descreve um ambiente que não existe. E `document.visibilityState` entra no relatório: **aba oculta não roda quadro**, então "não anima" pode ser a medição mentindo.

Medir presença não é medir amplitude: um deslocamento de 6px "existe" e é invisível. **O critério é a amplitude.**
