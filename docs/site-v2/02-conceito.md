# 02 — Conceito

## 0. A pergunta que abre este documento

Pedido do dono, literal:

> *"qual seria o melhor mote pra gente? plataforma composable? agêntica? não quero soar
> genérico demais e não ter um público claro. Qual nosso melhor propósito, onde podemos
> ganhar mais $$, onde fique clara a proposta pro mercado assim como é pra FICO?"*

Este documento responde nesta ordem: **por que "composable" e "agêntica" são as duas
respostas erradas** (§1), **qual é o mote** (§2), **onde está o dinheiro** (§3), **a
analogia do LEGO corrigida** (§4), **o ativo composto** (§5), **a nomenclatura** (§6) e
**o que a página não pode prometer** (§7).

---

## 1. As duas respostas erradas, e por quê

### "Plataforma composable"

É **verdadeiro e inútil**. Verdadeiro porque é exatamente o que a arquitetura é — 32 blocos,
207 ações, produto declarado como dado. Inútil como mote por três motivos:

1. **É palavra de analista, não de comprador.** Nenhum dono de clínica, escritório ou
   distribuidora digitou "composable" na vida. O playbook já cobra isso na §5.4: fora
   *workflow*, *pipeline*, *LLM*, *orquestração*.
2. **Já tem dono.** FICO usa "composable decisioning" como bandeira institucional; TOTVS
   usa "Ecossistema 3D"; Gartner cunhou o termo. Entrar por ali é chegar terceiro numa
   conversa que não é sua.
3. **Descreve a Catalisa, não o ganho de quem compra.** Composability é uma propriedade
   nossa. O comprador não paga pela nossa propriedade.

**Onde ela fica:** na página "Por dentro", como descritor técnico, e no material de
investidor. Nunca no herói.

### "Agêntica"

É **verdadeiro e perigoso**. Três motivos:

1. **É a palavra mais lotada de 2026.** Todo produto de software se declara agêntico. Um
   mote que todos usam não posiciona — dilui.
2. **Centra o mecanismo, não o resultado.** O comprador não quer agentes; quer que a
   mensagem de terça 22h47 não se perca.
3. **É o oposto do nosso diferencial real.** O que a Catalisa aprendeu e documentou, com
   caso medido, é que **agência solta é o risco, não o produto**:

   > *"Instrução a modelo não é garantia. Estrutura é."* — e os três casos que provaram:
   > o campo que não existe no schema, a ferramenta que o agente não tem, e o telefone que
   > o modelo inventou porque a ferramenta o obrigava a preencher.

   Vender "agêntica" é vender exatamente o medo que o produto resolve. O comprador de
   verdade — o escritório, a clínica, a mesa de crédito — está com **medo** de agente
   solto. O nosso argumento é a **trava**, não a autonomia.

**Onde ela fica:** em nenhum lugar como bandeira. O que se diz é o que a estrutura garante.

---

## 2. O mote

O invariante que atravessa **todos os sete produtos já construídos** — e é preciso olhar os
sete juntos para vê-lo:

| produto | o que chega | o que se decide | o que nasce | onde a pessoa entra |
|---|---|---|---|---|
| Jurídico | mensagem às 22h47 | qual área, se é urgente | consulta marcada na agenda real | o advogado atende a consulta |
| Clínica | "vocês atendem?" | especialidade, encaixe | registro da consulta | **quem atendeu libera** o prontuário |
| Recrutamento | candidato, cliente, consultor no mesmo número | triagem, aderência | parecer escrito no ATS | o consultor decide o shortlist |
| Ágora | visitante no site | se vira reunião | pré-proposta em rascunho | **alguém libera** a proposta |
| Antecipação | notas de OS no WhatsApp | dossiê, score, banda, borderô | proposta com líquido e custo efetivo | **a mesa decide** acima da alçada |
| Personal | aluno com dúvida | agenda, PAR-Q | treino e resumo do dia | o profissional ajusta |
| Adega | "manda o de sempre" | maioridade, estoque, fiado | pedido, Pix, entrega | o dono confere a fila |

Lido em coluna, é sempre a mesma máquina:

> ### Conversa vira decisão. Decisão vira ato. E o ato tem dono.

Três substantivos, nenhum jargão, e cada um verificável no código: o canal (`SEND_MESSAGE`,
Rooms, o site), a decisão (workflow, DMN, scorecard, `actionPolicy`), o ato (documento,
evento na agenda, proposta, pedido), e o dono (o gate humano, o `AuditTrail`, a assinatura).

### Por que esse mote resolve o problema do dono

| o problema | como o mote resolve |
|---|---|
| *"não entendem"* | não pede que ninguém entenda arquitetura: pede que reconheça o próprio dia |
| *"quando entendem não sabem usar"* | a frase já contém o objeto — o comprador pergunta "qual conversa?" e cai num produto |
| *"não quero soar genérico"* | "decisão registrada com dono" é o oposto do discurso de chatbot e o oposto do discurso agêntico |
| *"sem público claro"* | cada palavra endereça um público: **conversa** é o dono da operação, **decisão** é a instituição, **dono** é o regulador e o executivo |

### As três frases de venda derivadas — uma por público

**Para o dono da operação** (escritório, clínica, consultoria, loja, academia):
> *O atendimento resolve sozinho o que dá para resolver sozinho — e para exatamente no
> ponto em que você assina.*

**Para a instituição que decide sobre dinheiro** (financeira, securitizadora, seguradora,
cooperativa, fintech):
> *A esteira busca o dado, aplica a sua política e devolve a proposta — e registra quem
> decidiu o quê, quando, e com qual versão da regra.*

**Para investidor e executivo:**
> *Produto novo aqui é um documento, não um projeto. Sete no ar; o oitavo custa dias, não
> trimestres — e todos sobre o mesmo núcleo de dados.*

### O que NÃO é o mote

Não é *"IA para WhatsApp"* (categoria de chatbot, e o playbook registra o custo exato de ter
escorregado para lá uma vez). Não é *"automação"* (Zapier). Não é *"CRM"*. Não é
*"no-code"*. Todos descrevem meios, e todos têm ocupante consolidado.

---

## 3. Onde está o dinheiro — e por que são duas frentes, não uma

A resposta honesta não é um mercado só. O inventário mostra **duas frentes com economias
opostas e complementares**, e a tese de investimento é a ligação entre elas.

### Frente A — verticais de atendimento (captura)

Jurídico, clínica, recrutamento, personal, comércio de bairro, vendas/Ágora.

| | |
|---|---|
| Ciclo de venda | curto — a dor é nomeável numa frase |
| CAC | baixo — hotsite próprio por vertical, busca orgânica pela dor |
| Ticket | baixo a médio, recorrente |
| Custo marginal do próximo vertical | **quase nulo** — o pacote é dado; a família é perfil, não fork |
| Risco | commodity aparente: o mercado confunde com chatbot |

**O que ela realmente entrega:** volume, prova, e — o que importa mais — **a operação e o
dado**. Quem atende pelo nosso canal acumula, no nosso núcleo, o cadastro, a linha do tempo
e o comportamento de quem paga.

### Frente B — decisão sobre dinheiro (monetização)

Antecipação, crédito, cobrança, seguros, decisão como produto.

| | |
|---|---|
| Ciclo de venda | longo — é compra de instituição |
| Ticket | alto |
| **Unidade de cobrança** | **a decisão, ou o volume decidido** — não o assento |
| Profundidade que já existe | **8 dos 32 blocos são financeiros**: BaaS, Payments, Billing, Pricing Engine, Calculations Engine, Open Finance, Products, Banking Product Portfolio — mais Bureaus, Decision Engine e Decision Platform |
| Prova de que a categoria sustenta uma empresa inteira | **FICO** |
| Risco | funding e trilho de registro não são código (ver §7) |

**Por que aqui está o dinheiro maior:** porque uma decisão sobre dinheiro **tem preço
próprio**. Cobra-se por decisão, por operação originada ou por ponto-base do volume — e a
receita cresce com o cliente em vez de com o número de usuários dele. É a diferença entre
vender assento e vender resultado, e é literalmente o que separa a Frente A da Frente B.

### A ligação — e é ela a tese

> **A frente de atendimento origina a relação e o dado. A frente de decisão monetiza o que
> a operação já sabe.**

Não é teoria: é o que a própria TOTVS chama de Techfin, com TAM declarado **7× maior** que
o de gestão. E é exatamente o caminho que a Catalisa já andou sem nomear — a **antecipação
nasceu do WhatsApp do prestador de saúde**, não de uma mesa de crédito.

E a alavanca dentro da Frente B já está medida: *"o que chamamos de glosa é, no motor,
`dilutionRate`"* — **~80% do pacote de antecipação é setor-agnóstico**. O que muda por setor
é vocabulário, carga de histórico e um campo de lastro.

### O ativo proprietário — o análogo do FICO Score, dito com honestidade

O que dá clareza ao FICO não é a plataforma: é **possuir uma unidade de valor (a decisão) e
um ativo de dado que ninguém consegue copiar (o score)**.

A Catalisa tem candidato real a esse ativo, e ele já aparece no código:

- **Histórico de diluição por sacado** — quanto cada operadora, concessionária ou órgão
  historicamente **não** paga. Hoje é `dilutionRate`; com volume, é um número que ninguém
  mais no país tem por sacado pequeno.
- **Comportamento de resposta por canal e segmento** — quem responde, quando, por qual
  porta, e o que converte depois.

**Nenhum dos dois existe em escala hoje.** Dizer isso é obrigatório (§7). Mas **desenhar o
caminho até eles é a coisa mais investível que este site pode fazer** — e é o que o
documento `06-produtos-possiveis.md` detalha.

---

## 4. A analogia do LEGO, corrigida

A analogia do dono está certa e incompleta. Completa, ela vira a estrutura do site inteiro.

| | o que o dono disse | o que falta, e é o ponto |
|---|---|---|
| 1 | ninguém compra o balde de 5.000 peças | — |
| 2 | o kit temático é que vende | **porque ele vem com o manual e com a caixa da foto pronta** |
| 3 | — | **o kit só é barato de fazer porque a peça é padronizada** — e é a padronização que faz o segundo kit encaixar no primeiro |
| 4 | — | **quem tem dois kits não tem dois brinquedos: tem uma cidade** |

O item 3 é o argumento para investidor e executivo. O item 4 é o argumento de expansão de
receita dentro do cliente — e é o "sidenote" que virou tese.

**A tradução literal para o site:**

    o balde        → os 32 blocos e as 207 ações       (existe, e não se vende)
    a peça         → a ação e o bloco                   (a prova de que o kit é barato)
    o manual       → o PackageDefinition                (o produto é DADO)
    o kit          → agora, juridico, med, antecipacao… (é isto que se vende)
    a caixa        → o hotsite do produto               (é isto que o comprador vê primeiro)
    a cidade       → o núcleo de dados compartilhado    (é isto que retém e expande)

---

## 5. O ativo composto — o sidenote promovido a tese

> *"é possível combinar as soluções e tirar ainda mais proveito quando você centraliza os
> dados: você pode ter diversos produtos com uma visão 360 dos dados, interligar jornadas e
> canais."*

### Por que isso é estruturalmente verdadeiro aqui

Não é integração. É **ausência de integração**, porque nunca houve separação: os produtos da
Catalisa não conversam entre si — eles **são a mesma conta**. O mesmo `leadType`, o mesmo
funil, a mesma linha do tempo, o mesmo Data Store, a mesma base de conhecimento, os mesmos
agentes, as mesmas 207 ações. Um produto novo não chega como sistema vizinho; chega como
**mais um conjunto de peças ligadas ao que já está lá**.

O paralelo de mercado existe e é forte — e serve para explicar em uma frase a quem já
comprou software antes:

| quem | como chama |
|---|---|
| Microsoft | **Dataverse** — *"informação entrada num app está imediatamente disponível nos outros"* |
| ServiceNow | **single data model** — *"elimina a ponte que falta entre CRM, CPQ, ERP e campo"* |
| Palantir | **Ontology** — *"o writeback faz o valor do dado compor ao longo do tempo"* |
| FICO | **build once, reuse everywhere** — *"compounding intelligence"* |

### A escada, que é como isso vira seção de site

| | o que o cliente tem | o que aparece |
|---|---|---|
| **1 produto** | um sistema | a dor resolvida |
| **2 produtos** | uma **visão** | o mesmo cadastro atravessa as duas jornadas; nada é redigitado, nada é reconciliado |
| **3 produtos** | uma **operação** | a decisão de um usa o histórico do outro; o canal de um resolve o gargalo do outro |

**Exemplo concreto, e ele é real na nossa carteira** — a clínica que também antecipa:

1. `med` atende, tria e agenda pelo WhatsApp. O paciente e o procedimento entram no cadastro.
2. `antecipacao` lê **as mesmas notas de OS** que aquela operação gerou. O dossiê não pede
   upload: o dado já está lá.
3. O histórico de glosa **por operadora** que a clínica acumulou atendendo é o que faz a
   proposta dela ser melhor que a de um cedente novo.

O terceiro passo é o juro composto: **a clínica ganha taxa melhor por ter operado no
sistema.** Nenhum concorrente de chatbot pode oferecer isso, e nenhuma securitizadora pode
oferecer o atendimento.

### A regra de honestidade que anda junto

Hoje, e isto entra na página: **recurso não atravessa tenant, nem para automação.** O
workflow roda no tenant onde mora; quem precisa cruzar usa webhook. O composto é **dentro
da mesma empresa**, não entre empresas — e é assim que tem que ser.

---

## 6. Nomenclatura

### O problema com "vitrine"

Já corrigido internamente pelo dono em 24/08 e vale para o site: *"vitrine descreve o nosso
uso, não o que a peça faz"*. E o uso é duplo — é nossa demonstração e vira o funil do
cliente. Um cliente que instala não deveria ler a palavra que descreve a nossa intenção de
vender.

### A proposta

| camada | nome interno | nome comercial | por quê |
|---|---|---|---|
| infraestrutura | building block | **bloco** | já é o nome, já está documentado, já tem site |
| peça de automação | `WorkflowActionType` | **ação** | 207 delas; é a peça de LEGO |
| o produto como dado | `PackageDefinition` | **pacote** | é o manual + as peças do kit |
| o produto vendido | (hoje: "vitrine") | **produto**, com nome próprio | Ágora, Jurídico, Clínica… |
| o conjunto | (hoje: "vitrine") | **a linha** ou simplesmente **Produtos** | ver abaixo |
| o site do produto | hotsite | **a porta** do produto | `<produto>.catalisa.app` já é o padrão |

Para o conjunto, três candidatos, em ordem de preferência:

1. **Produtos** — a palavra plana. Não tenta ser esperta, e é o que o comprador procura.
2. **A Linha** — sugere família e continuidade ("a linha Catalisa"), e prepara o cross-sell.
3. **As Portas** — só se a Direção B (§`04-direcoes.md`) for a escolhida; aí ela é a
   metáfora do site inteiro e o nome carrega significado em vez de decorar.

**Descartar:** vitrine, marketplace (ainda não é — ver `06`), soluções (genérico), apps
(colide com `.catalisa.app` e com o menu atual do site).

---

## 7. O que a página NÃO pode prometer

Esta seção existe porque a §5.7 do playbook **bloqueia publicação**, e porque a credibilidade
da página inteira depende de ela nomear os próprios limites antes de o comprador achá-los.

| limite | estado real | como a página trata |
|---|---|---|
| Base de conhecimento no pacote | **não é declarada** — ~40 linhas faltando no instalador; hoje é passo manual | não prometer "instalação de uma chamada" sem ressalva |
| Recurso entre tenants | **não atravessa**, nem por automação | dizer que o composto é dentro da mesma empresa |
| Antecipação | precifica e **não libera dinheiro** — não temos funding nem registro em CERC/B3 | vender a esteira, jamais o crédito |
| ~~`AccessGrant` (modo consultoria)~~ | **corrigido em 27/08: está em produção** | pode ser vendido. O que falta é conveniência — envio de e-mail do convite é manual |
| Clientes citáveis | **não há autorização registrada** | *"recortes possíveis"*, nunca *"casos de verdade"*; ou artefato real anonimizado |
| Permissão granular por rota no painel | **não existe** — `@RequireRoute` está em 1 controller de 73; o isolamento vem de **invariante de posse**, não de autorização | vender isolamento entre contas (é sólido), nunca papéis finos dentro da conta |
| Instalação de pacote | **só por API** — não há tela | não prometer autosserviço de instalação |
| Cobrança dos blocos | 32 READMEs dizem *"precificação em definição"* | não publicar tabela de preço de bloco |
| Vertical farmácia | **não derivar sem estudo regulatório** | fora da página |
| Restaurante com cozinha | ficha técnica, CMV de prato e KDS **não existem** | vender a camada de relacionamento (B1), nunca o produto completo |

**A melhor prova disponível hoje, enquanto não houver cliente autorizado, é um artefato real
anonimizado** — uma proposta gerada de verdade com os dados borrados vale mais que dez
logotipos.
