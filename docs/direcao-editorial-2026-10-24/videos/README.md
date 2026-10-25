# Vídeos da Catalisa: como são feitos e o que aprendemos

Cópia do conhecimento do gerador de vídeos (`~/Projects/videos.catalisa.app`, repo `klederson/videos.catalisa.app`, ramo `nuvem`) para quem trabalha no site. A direção de arte está no `README.md` da pasta acima; aqui fica a parte de **vídeo**: público, gramática, cenas, produção e armadilhas.

## 1. Para quem é a comunicação (regra de 24/10/2026)

A Catalisa **não vende serviço de banco**. Ela vende a **tecnologia** para quem compra e implementa produtos de crédito e de banco:

- **bancos**, **financeiras**, **FIDCs**, **securitizadoras**, **fintechs**;
- **investidores** (pessoas com capital) que querem montar o próprio produto de crédito ou de banco.

A comunicação existe para essa pessoa **comprar e implementar**. Consequências:

| Faça | Evite |
|---|---|
| Protagonista é quem cria e opera: o executivo, a diretora, a criadora do produto | Protagonista correntista em filme comercial |
| “A sua marca”, “a sua operação”, “o seu cliente”, “a sua equipe” | “O seu banco te ajuda a…” falando com o correntista |
| A experiência do cliente final entra como **prova** (“01 / O app do seu cliente”) | Vender Pix, conta ou crédito para pessoa física |
| O processo dele é o diferencial: plataforma de capacidades que ele monta do jeito dele | “Solução pronta para FIDC” (vertical vira prateleira de ERP; ver posicionamento de 04/09/2026) |
| CTA “Imagine seu produto”, “Conheça Banking”, “Conheça a Credit” | Prometer abertura de conta, aprovação, prazo ou contratação automática |

O filme com o correntista como protagonista **não foi descartado**: é **vitrine**, a peça que o comprador mostra ao cliente dele ou que a Catalisa usa para mostrar a experiência que ele vai entregar (`roteiros/b2-vitrine.json`).

Fonte do posicionamento: `wpp.bb.catalisa.io/docs/plans/2026-09-04-posicionamento-credito-e-hotsite.md`. Ali está a conversa com um CIO de banco grande: “não deve vender como uma solução para FIDC”, “cada operação tem a sua característica, o processo é o diferencial competitivo”, “não se trata de solução pronta, e sim de plataforma com os building blocks e agora uso de IA que acelera a entrega”.

## 2. A gramática de todo filme

**Cena editorial (desejo) → prova real do produto → frase do site → cartela.** Uma ideia por filme, de 25 a 35 s, em 16:9 e 9:16.

- **Título:** as frases do site (“Uma conta. Várias formas de operar.”, “Crédito tem começo. A operação continua.”, “Quem cria define o produto.”, “A base comum continua. O lastro muda.”).
- **Locução:** opcional. Nos testes de 24/10 os filmes saíram **sem locução**, só trilha e texto, como campanha de luxo; a voz espera a escolha do dono.
- **Prova:** tela real com o rótulo “Interface de referência · ambiente demonstrativo”. Tela que ainda não foi capturada é listada como pendência, nunca inventada.

## 3. As cenas do gerador (contrato em `remotion/types.ts`)

| Cena | O que faz | Quando usar |
|---|---|---|
| `collage` | Papel de cor chapada, foto recortada em arco/círculo/meia-lua, celular ou tela com print real; peças entram como papel sendo posicionado; título em Inter Light linha a linha; rótulo mono; logo no rodapé | Abertura, quem compra, cada capacidade, cartela final |
| `flow` | Navegação real no celular a partir de prints: toque, empurra, “01 / 05” | A prova de uma jornada do app |
| `pedestal` | As telas no palco de concreto do site | Mostrar app e desktop juntos |
| `kinetic`, `broll`, `screen`… | Cenas antigas, ainda disponíveis | Use pouco; a linha editorial é a colagem |

Transições com sentido: `dive` (o círculo abre a próxima cena: foco), `line` (o traço laranja liga uma etapa à outra), `push` (a tela empurra a anterior). **Nada de zoom lento**: as peças encaixam e ficam paradas, ou derivam alguns pixels para o lado.

Campos da `collage` (quadro de referência 1600×900 no 16:9 e 1080×1920 no 9:16): `layers` / `layersMobile` (cada peça: `kind` shape|photo|phone|screen, `shape` rect|circle|arch|half, `box` [x,y,w,h], `color`, `src`, `focus`, `zoom`, `flip`, `enter` up|down|left|right|grow|reveal|fade|none, `at`, `drift`), `kicker`, `headline` (quebre com `\n`), `sub`, `textAt`, `size`, `textColor`, `kickerColor`, `textColorMobile`, `signMobile`, `sign` color|light|false, `logoBig`, `button`.

## 4. Tipografia em movimento

- Título em **Inter Light (300)**, entrelinha 1,0, espaçamento −0,035 em, quebrado por sentido.
- Rótulo em **JetBrains Mono**, caixa alta, espaçamento 0,26 em. No vertical, ele fica logo acima do título (o topo é das fotos).
- Logo “Catalisa.” como assinatura no rodapé esquerdo: branco no fundo escuro, roxo no claro. Use o PNG recortado (`logo-tight.png`): o SVG tem margem no viewBox e o logo sai pequeno e deslocado.

## 5. Elenco e imagens

- Quadros gerados por IA (Runway `gen4_image`, ~5 créditos). Para mudar só a expressão ou um detalhe, gere com a imagem anterior como **referência** (`REF=foto.jpg node scripts/board-gen.mjs …` com `@ref` no prompt): cenário, roupa e pose se mantêm.
- Os rostos **ainda não são fixos** entre imagens. Elenco consistente pede uma ficha por personagem com rosto em vários ângulos (≈30–40 créditos cada).
- Personagens são inventados; nunca apresentados como clientes reais.
- **Gesto sempre de construir**, de frente para a composição ou para a câmera. De costas, empurrando para fora ou saindo do quadro lê como fuga (aconteceu no C4 e foi corrigido espelhando a foto).
- Expressão positiva: a primeira versão da criadora estava séria demais; refeita com sorriso a partir da mesma imagem.
- Foto 1280×720 ampliada para tela cheia perde nitidez: amplie antes (`lanczos` + `unsharp`) e evite close de detalhe em foto pequena; prefira recortes menores (arco, círculo).

## 6. Armadilhas que já custaram tempo

- **Comentário `//` dentro de objeto JSX em linha única** engole o resto da linha e quebra o build.
- **zsh não divide variável em palavras** (`for t in $T`); para laços de render, use Python com `subprocess`.
- **Texto e fundo mudam entre 16:9 e 9:16**: título escuro caiu sobre a faixa roxa no vertical. Use `textColorMobile`/`signMobile`.
- **Logo SVG com margem** fica pequeno e desalinhado; use o PNG recortado.
- **Render pesado**: renderize um formato por vez; a máquina tem 30 GB e já caiu com render 3D em paralelo.
- A **fonte não carregada** cai na mono do sistema sem erro: o render carrega Inter (200–800) e JetBrains Mono de propósito.

## 7. Arquivos

- `roteiros/b2-vitrine.json`: a vitrine do correntista (B2).
- `roteiros/bk1-banking.json`: BK1, Banking Platform para quem compra (“O banco digital da sua marca.”).
- `roteiros/cr1-credit.json`: CR1, Credit Platform para quem estrutura crédito.
- `quadros/`: um quadro de cada cena, nos dois formatos.
- Para renderizar: no repo do gerador, copie o roteiro para `jobs/<nome>/storyboard.json` com os assets e rode `node scripts/render.mjs --job jobs/<nome> --format 16:9`.

## 8. Telas que NÃO entram em vídeo nem em apresentação

Conferidas em 24/10/2026 em `public/redesign/screens/`:

| Tela | Por quê |
|---|---|
| `credit-operation.png` | Mostra "bloqueada: assinatura_pendente / gravame_pendente / registro_pendente" em vermelho e códigos internos crus (`vehicle-secured-loan`, `payroll-loan-standard`). Lê como erro do produto. O dono vetou. |
| `bank-mobile.png` | "Olá, Klederson": nome real do dono. Use o print de demonstração (Helena). |
| `bank-live-accounts.jpg` | A lista de contas mostra "Fundo MedFund", nome de cliente real. |
| `bank-access.jpg` | E-mails e nomes da equipe de backoffice. |

Regra geral: antes de usar uma captura, olhe a tela inteira atrás de nome real, e-mail, cliente, erro em vermelho, código interno ou estado de falha. Na dúvida, não use.
