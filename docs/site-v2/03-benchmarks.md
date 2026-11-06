# 03 — Benchmarks

> Levantado em 27/08/2026, a pedido do dono: *"busque benchmarks de cases como esse,
> ecossistemas, plataformas — pensei em Totvs e Sinqia mas não sei se são os melhores
> exemplos"*, e depois *"FICO tb seria um bom case não?"*, *"Oracle talvez?"*,
> *"Microsoft?"*.
>
> **Resposta curta: FICO é o melhor, Microsoft é o segundo, TOTVS é o terceiro.** Sinqia e
> Oracle são os menos aplicáveis. Palantir e ServiceNow entram como referência de
> **argumento**, não de negócio.

---

## 1. O quadro

| | O que é | O que o site deles resolve que o nosso precisa resolver | O que **copiar** | O que **recusar** |
|---|---|---|---|---|
| **FICO** ★ | Era "a empresa do score"; virou plataforma de decisão composable com marketplace de ativos reutilizáveis | Vender **soluções** (originação, fraude, cobrança) mantendo a plataforma embaixo, sem que a plataforma roube a cena | A unidade de valor ser **a decisão**; *"build once, reuse everywhere"* → **compounding intelligence**; blocos independentes que cada caso de uso monta; um **ativo de dado proprietário** que dá a categoria | A opacidade enterprise (preço sob consulta, linguagem de analista). E não temos score próprio — **não fingir que temos** |
| **Microsoft** ★ | Dynamics 365 + Power Platform sobre **Dataverse** | O argumento do dado centralizado, dito para quem já comprou software antes | *"Informação entrada num app está imediatamente disponível nos outros"* — é a nossa §5 do conceito, em uma frase que o mercado já entende | O tamanho do menu. O site deles funciona porque a marca já é conhecida; um desconhecido com 30 produtos na navegação some |
| **TOTVS** | ERP + verticais (12 setores) + Techfin + Business Performance — "Ecossistema 3D" | Como um ecossistema brasileiro conta cross-sell e expansão de TAM | A tese **gestão → techfin**, com TAM declarado **7× maior** — é exatamente a nossa Frente A → Frente B; e a ideia de **perfis verticais** em vez de produtos separados | A estrutura de portal corporativo. É catálogo de fornecedor, não argumento |
| **Palantir Foundry** | Ontology como modelo vivo da organização | Como explicar que o valor **compõe** com o tempo | *"O writeback faz o valor do ativo de dado compor: o insight de um usuário alimenta a decisão de outro"* — é a melhor formulação existente do nosso item 4 do LEGO | O tom de mistério e o vocabulário fechado. Nosso site precisa ser **claro para leigos** |
| **ServiceNow** | Now Platform: um modelo de dados, muitos workflows | Como dizer "modular, comece por um, expanda" sem soar a upsell | *"Elimina a ponte que falta entre CRM, CPQ, ERP e campo"*; e o desenho modular explícito: comece com uma solução, expanda conforme cresce | A densidade de produto na home. E o vocabulário de TI — nosso comprador não é o CIO |
| **Stripe** | Suíte interoperável, uma integração | Densidade técnica **com** elegância; tipografia e respiro como argumento de qualidade | *"Uma integração"* como promessa; o rigor tipográfico e o espaço em branco; documentação como peça de marketing | O público. Stripe fala com quem escreve código; metade do nosso público não escreve |
| **Oracle** | Fusion Applications + OCI, full-stack acoplado | — | O argumento de **acoplamento nativo** dando à IA acesso a dado transacional sem conector | Praticamente tudo o mais. É suíte por aquisição, e o site reflete isso |
| **Sinqia** | Software para o mercado financeiro; verticais por aquisição | — | Só a leitura de mercado: o setor financeiro brasileiro compra vertical especializado | Não serve de referência de site nem de narrativa. Escala e posicionamento distantes demais |

---

## 2. Por que FICO é o melhor análogo — a leitura em detalhe

Quatro coincidências estruturais, não superficiais:

1. **A unidade de valor é a decisão.** FICO não cobra por assento; cobra pela decisão e pelo
   volume decidido. A Catalisa tem, hoje, `decision-engine` (DMN versionado, alterado sem
   deploy), `decision-platform` (a esteira que busca o dado, aplica a política e devolve o
   veredito), `pricing-engine` (taxa por faixa de risco), `calculations-engine` (parcela,
   IOF, CET), `bureaus` (com cache que impede pagar duas vezes pelo mesmo CPF) e
   `banking-product-portfolio` (versão congelada em cada contrato). **É a mesma caixa de
   ferramentas.**
2. **Vende solução, mantém a plataforma embaixo.** É exatamente a correção que este site
   precisa fazer.
3. **Reuso composto.** *"Misture, combine e reutilize serviços pré-configurados em
   aplicações diferentes"* é a descrição literal do `PackageDefinition` + ações + templates.
4. **Um ativo de dado que dá a categoria.** É o que a Catalisa **ainda não tem** — e é a
   diferença que o `06-produtos-possiveis.md` trata como a decisão estratégica mais
   importante da empresa.

**A ressalva honesta:** FICO tem 70 anos de curva de dado e um score que é padrão de
mercado. Copiar a **estrutura de proposta** é certo; sugerir paridade é o tipo de exagero
que a §5.7 bloqueia.

---

## 3. O que nenhum deles tem, e nós temos

Registrado porque é o material do site que não se copia de benchmark nenhum:

1. **A porta é o WhatsApp de quem já usa WhatsApp.** Nenhum dos oito entra pelo canal onde a
   pequena e média empresa brasileira já opera — e o `wpp` faz isso **no número que a
   empresa já usa, sem trocar de linha nem migrar conversa**.
2. **Produto novo é documento.** FICO e ServiceNow precisam de projeto de implantação. Aqui,
   um pacote instala tipo de lead, funil, workflows, agentes, perfil de copiloto e OKRs por
   uma chamada de API — e o hotsite é tema + roteiro sobre casca compartilhada.
3. **O método está escrito e é auditável.** O playbook, as nove fases com catraca, os
   postmortems, o *"o que quebrou"*. É a matéria-prima de uma página que nenhum concorrente
   consegue produzir sem ter vivido — e é a base inteira da **Direção C**.
4. **O segmento abaixo da linha do ERP.** A AntecipaFácil exige faturamento acima de
   **R$ 400 mil/mês**. Abaixo disso o mercado atende mal, e é exatamente quem já conversa
   por WhatsApp e não tem sistema.

---

## 4. Referência visual (o outro tipo de benchmark)

O playbook (F0, item 3) exige referência **de setor**, não de "landing page bonita". Para um
site institucional que fala com investidor, executivo e comprador ao mesmo tempo:

| referência | o que observar | onde ela erra para o nosso caso |
|---|---|---|
| `fico.com` | a hierarquia soluções → plataforma → blocos | frio, corporativo, sem alma |
| `palantir.com` | densidade escura, tipografia grande, respiro | hermético demais |
| `stripe.com` | tipografia, espaço em branco, o rigor | fala com quem escreve código |
| `linear.app` | movimento ao rolar que **explica** em vez de enfeitar | produto único, não ecossistema |
| `totvs.com` | como um ecossistema BR se organiza | portal corporativo, não argumento |

E as proibições da §4.1 do playbook valem inteiras: nada de creme quente com serifada e
terracota, nada de herói com gradiente roxo-azul sobre branco, nada de emoji como marcador,
nada de card-grid com ícone, nada de passos numerados abstratos, nada de número inventado.
