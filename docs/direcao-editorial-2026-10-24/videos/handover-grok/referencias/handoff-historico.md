# Handoff · Direção editorial e filmes da Catalisa (24/10/2026)

> Pausado a pedido do dono (limite semanal em 93%), para continuar no **Codex**.
> Este arquivo guarda bem decisão e armadilha; guarda mal estado. Se a realidade discordar, o arquivo está errado, e corrigi-lo é parte da tarefa.
> Cópia idêntica em `site.catalisa.io/docs/direcao-editorial-2026-10-24/videos/HANDOFF.md`.

## §−1 · O que foi pedido, nas palavras do dono, e as regras que valem sempre

Pedido original: vídeos da Catalisa “no estilo das propagandas de revistas chiques, bauhaus… quase um editorial de moda, de grandes marcas como as de perfume, bolsas, alta costura… o mesmo tipo de fotografia, roteiro… só que falando do nosso produto”; “mulheres elegantes com óculos escuros, cadeiras de praia, um executivo na cadeira com aquela pintura de fundo (spotlight), iates, Rivieras, kite surf”. Depois: “esse vai ser o nosso mote estratégico de estilo e comunicação visual”.

Evoluções, na ordem:
1. Guia estruturado (direção de arte, estratégia, estilo, comunicação, roteiros) e salvo no repo do site.
2. Combinar as fotos com a colagem Bauhaus das inspirações (presença de cor, contrastes) → quadros de **fusão**.
3. Tipografia “sem elegância” → Inter Light, assinatura de revista. A identidade **recusa serifa**.
4. C4: a atriz “parecia fugindo” e “expressão não positiva” → espelhada, refeita sorrindo.
5. Teste B2 aprovado (“ficou excelente”).
6. **Correção de público (a mais importante):** “não vendemos o serviço de banco e sim a tecnologia para quem compra: BANCOS, FIDCs, FINANCEIRAS, SECURITIZADORAS, FINTECHS e RICOS QUE QUEREM MONTAR PRODUTOS DE CRÉDITO E BANCO”. O B2 vira **vitrine**.
7. “A comunicação é para ele comprar e implementar.” Conteúdo pelo **Codex** (“é mais assertivo usando as instruções”). Cobrir todas as capacidades de CBP e CCP, o projeto de **onboarding PJ do banco grande** (sem citar o nome: tudo é Catalisa para o mercado), **agro** (Garantia Viva) e **recebíveis médicos**. Vai virar vídeos e uma apresentação completa para clientes.
8. Uma **temporada em sequência**: pequenas histórias que se explicam sozinhas e, em ordem, contam uma história maior. Variar cenário, animação e imagem. **Escrever o plano antes de implementar.** Mostrar cada filme ao sair; no fim, um artefato com todos, ligado no menu aos outros.
9. Não usar a tela com “bloqueada: assinatura_pendente” (`credit-operation.png`).

Regras permanentes (consequência prática):
- **Público = quem compra e implementa a tecnologia.** Protagonista é o executivo, a diretora ou a criadora. O cliente final entra como prova (“o app do seu cliente”). Filme de correntista é vitrine.
- **Não vender “solução para FIDC”**: vertical é caso, o processo do comprador é o diferencial (posicionamento de 04/09, conversa com CIO).
- **Nada de prometer** abertura de conta, aprovação, prazo; nada de número ou cliente sem fonte; nenhum nome de cliente.
- **Conteúdo e mensagem: Codex.** Claude produz e **não reescreve a mensagem** (só quebra de linha e tamanho).
- **Amarelo só no ponto do logo ou em objeto pequeno**, até o dono decidir sobre o amarelo como forma grande.
- **Toda tela passa por inspeção** antes de entrar (ver lista de vetadas em `videos/README.md §8` do site).
- Sem commit/publicação fora do pedido; render um formato por vez (máquina já caiu).

## §0 · Comece aqui

**Estado em uma frase:** a linguagem está pronta e aprovada, o gerador tem a cena `collage` com 10 tipos de entrada, há 6 filmes de teste renderizados (B2 vitrine, BK1, CR1, CBP-01, CCP-03, MOT-02) e o Codex já escreveu o catálogo com ~90 ideias de filme; **o plano da temporada não foi escrito** e é o próximo passo.

| Frente | Estado |
|---|---|
| Guia de estilo (artefato 1) | Publicado, v5 |
| Filmes temporada 1 (artefato 2) | Publicado, mas **anterior à correção de público** (fala com correntista): refazer a partir do catálogo |
| Catálogo de conteúdo (Codex) | `site…/videos/ideias-de-conteudo.md`, 200 KB, completo (A mapa de capacidades, B ~90 fichas, C séries, D frases proibidas, E apresentação) |
| Gerador (`videos.catalisa.app`, ramo `nuvem`) | Commitado em 09595d6 + o commit deste handoff |
| Plano da temporada | **Não escrito** |
| Artefato 3 (temporada) | **Não criado** |

Verificar o estado:
```bash
cd ~/Projects/videos.catalisa.app && git log --oneline -3 && npx tsc --noEmit -p . && node scripts/validate.mjs examples/b2-vitrine   # os outros exemplos guardam só o roteiro; monte o job (§6) antes de validar
ls jobs/*/out/*.mp4          # filmes renderizados (jobs/ não é versionado)
wc -c ~/Projects/site.catalisa.io/docs/direcao-editorial-2026-10-24/videos/ideias-de-conteudo.md
```

Links:
- Guia de estilo: https://claude.ai/artifact/Bmzb4XEp65RaWPuNad8FTx
- Filmes T1 (antigo público): https://claude.ai/artifact/BVRBz9jdJyPU67pxL6WUMa
- Fonte dos artefatos (scratchpad da sessão, pode sumir): `guia/build.py`, `filmes/build2.py`. Na dúvida, leia o artefato com a ação `read` e reconstrua.

## §1 · O que foi entregue

| Onde | O quê |
|---|---|
| `site…/docs/direcao-editorial-2026-10-24/README.md` | Guia completo: mote, estratégia, cenários, elenco, luz, cor, tipografia, movimento, som, o que não fazer, roteiros, produção, referências com links |
| `site…/conceitos/` | 10 quadros-conceito (Runway): executivo, piscina, círculo, iate, kite, agro, criadora (c7 e c7b sorrindo), desktop, mão no iate |
| `site…/fusao/` | 14 quadros de fusão (foto + colagem + tela) e `gerar-fusao.py` (PIL, sem crédito), com `fonts/` |
| `site…/filmes.md` | Temporada 1 antiga (11 filmes), anterior à correção de público |
| `site…/videos/README.md` | Como os vídeos são feitos, regra de público, cenas, tipografia, elenco, armadilhas, telas vetadas |
| `site…/videos/ideias-de-conteudo.md` | Catálogo do Codex |
| `site…/videos/roteiros/*.json`, `quadros/` | Os 6 roteiros e quadros de conferência |
| `videos.catalisa.app` | Cena `collage`, `flow`, `pedestal`; transições `push/line/dive`; entradas `up/down/left/right/grow/reveal/fade/wipe/spin`, `slices`, peça `line`; `scripts/board-gen.mjs`; `examples/` com os 6 roteiros (b2-vitrine com assets) |

Filmes renderizados (locais, em `jobs/<nome>/out/{16x9,9x16}.mp4`): `b2-ritmo` (vitrine), `bk1-banking`, `cr1-credit`, `t-cbp01`, `t-ccp03` (refeito sem a tela vetada), `t-mot02`.

## §2 · O modelo

- **Gramática:** cena editorial (desejo) → prova real → frase do site → cartela. 25–35 s, 16:9 e 9:16, uma ideia por filme, sem locução por enquanto.
- **Colagem:** quadro de referência 1600×900 / 1080×1920; `layers` e `layersMobile` próprios (o vertical é recomposto, não cortado).
- **Custo:** a colagem e a prova são grátis (local). Cena animada por IA: Runway ≈5 créditos/quadro, 5 créditos/s de vídeo; um filme com 3–4 planos animados ≈ 90–200 créditos. **Saldo Runway: ~2 créditos.**
- **Telas:** 25 capturas em `site.catalisa.io/public/redesign/screens/`; mais 1.328 prints por tema em `~/.config/catalisa/prints-por-produto` (memória “Prints dos produtos para os vídeos”), ainda **não** explorados para os filmes.

## §3 · O que foi construído, e o defeito que cada peça conserta

- `collage`: os primeiros vídeos eram “tela após tela, zoom lento”; a colagem dá vida sem IA e sem crédito.
- Regra do título acima da assinatura: o título caía sobre o logo do rodapé.
- `textColorMobile`/`signMobile`/`kickerColorMobile`: no vertical o fundo muda e o título escuro caía sobre o roxo.
- Rótulo do vertical acima do título: o topo é das fotos e o rótulo caía sobre elas.
- PNG do logo recortado: o SVG tem margem no viewBox e saía pequeno e deslocado.
- Fontes 200/300 + JetBrains Mono no render: sem isso cai na mono do sistema, sem erro.
- `board-gen.mjs` com `REF`: mudar expressão/gesto mantendo cenário, roupa e pose (c7 → c7b).

## §4 · Troubleshooting (a forma do erro)

- **Comentário `//` dentro de objeto JSX numa linha** engole o resto e quebra o build.
- **zsh não divide `$VAR` em palavras** em `for`; laços de render em Python.
- **O que vale no 16:9 quebra no 9:16**: confira os dois com quadros parados (`render.mjs --still`) antes do render completo.
- **Tela “de demonstração” com cara de erro** (estado em vermelho, código cru) ou com nome real: inspecione a tela inteira.
- **Codex monta fichas por modelo**: linhas duplicadas (“14–20 s” duas vezes) e fecho de outro filme (CBP-02 com “Conheça a Credit”). Leia cada ficha e use só as linhas coerentes.
- **Comando longo é interrompido** e a sessão pode cair: separe edição de render, e confira depois o que entrou (`ls -la out/`).

## §5 · O que falta

**Decisão (dono):**
1. Voz: escolher na comparação ou seguir sem locução.
2. Amarelo como forma grande na colagem: sim ou não.
3. Recarregar a Runway (cenas animadas, elenco fixo).
4. Elenco fixo por IA (≈30–40 créditos por personagem) ou elenco real com autorização.

**Pronto para pegar:**
1. **Escrever o plano da temporada** “A casa” (manifesto → Montar → Operar o banco → Operar o crédito → Os lastros → Final) a partir do catálogo do Codex (seções A–C e E), com variedade de cenário, animação e imagem, e mostrar ao dono **antes** de produzir.
2. Capturas limpas para: agro (lote, avaliação, acompanhamento), recebíveis médicos (plantões, antecipação), dossiê da mesa, formalização/assinatura sem código cru, onboarding PJ. Procurar primeiro em `~/.config/catalisa/prints-por-produto`.
3. Produzir os episódios mostrando cada um ao sair; depois o **artefato 3 (temporada)** com todos, sequência e história, ligado na barra de menu dos artefatos 1 e 2.
4. Refazer o artefato 2 (filmes) com o público certo, ou marcá-lo como superado.
5. Apresentação comercial completa (seção E do catálogo do Codex).
6. `prompts/director.md` ainda não documenta `collage`, `flow`, `pedestal` nem as transições novas.

**Escopo novo:** elenco fixo (character bible), cenas animadas por IA, locução.

## §6 · Ambiente

- Gerador: `~/Projects/videos.catalisa.app`, ramo `nuvem` (PR #1 rascunho para `main`). `jobs/` e `.cache/` não são versionados; `examples/` sim.
- Render: `node scripts/render.mjs --job jobs/<nome> --format 16:9` (um por vez; `RENDER_CONCURRENCY=3`). Quadro parado: `--still <s> --out x.jpg --scale 0.4`.
- Montar um job a partir de `examples/<nome>/storyboard.json`: copiar fotos de `.cache/board/` (ampliar com `ffmpeg -vf "scale=2560:-2:flags=lanczos,unsharp=5:5:0.5"`), telas de `site.catalisa.io/public/redesign/screens/`, prints de `examples/b2-vitrine/prints/`, logos de `examples/b2-vitrine/brand/`; trilha com `node scripts/stock.mjs --job jobs/<nome>` (usa `musicStock`).
- Codex: `codex exec -C ~/Projects/site.catalisa.io --sandbox workspace-write --skip-git-repo-check - < prompt.md`, pedindo para escrever **um arquivo só**. Documentos internos são copiados antes para uma pasta fora do repo (não versionar planos internos no repo do site).
- Runway: chave em `~/.config/runway/api_key`, nunca impressa.

### §6.1 · Sessões paralelas

- O repo do site tem trabalho de outra sessão não commitado na `master` (SEO, rotas, `docs/redesign-2026-10-22/` e `docs/site-v2/` não versionados). **Não misture**: versione `docs/direcao-editorial-2026-10-24/` num worktree próprio a partir de `origin/master`. As referências a `../redesign-2026-10-22/` só existem na cópia local.
- O `videos.catalisa.app` não tem outra sessão ativa; o ramo `nuvem` é compartilhado com a migração para a nuvem (PR #1).

## §7 · Mini-prompt para a próxima sessão (Codex ou Claude)

> Leia `videos.catalisa.app/docs/plans/2026-10-24-direcao-editorial-handoff.md` (§−1, §0, §5) e `site.catalisa.io/docs/direcao-editorial-2026-10-24/videos/README.md`. Confira o estado com os comandos do §0. A fase de linguagem e testes acabou; **não abra frente nova sem o dono pedir**. Próximo passo: escrever o **plano da temporada “A casa”** a partir de `videos/ideias-de-conteudo.md`, falando com quem **compra e implementa** a tecnologia (bancos, financeiras, FIDCs, securitizadoras, fintechs, investidores), cobrindo CBP, CCP, onboarding PJ (sem nome de cliente), agro e recebíveis médicos, variando cenário, animação e imagem, e mostrar ao dono antes de produzir. Método: mensagem do Codex, produção na cena `collage`, conferir 16:9 e 9:16 com quadros parados, inspecionar cada tela antes de usar.
