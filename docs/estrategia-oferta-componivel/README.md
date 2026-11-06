# Arquitetura da oferta e dos produtos Catalisa

Direção registrada em 27 de outubro de 2026 para a próxima evolução comercial e de produto da Catalisa.

A Catalisa passa a explicar sua oferta pelos produtos e pelo trabalho que eles realizam. Banking, Credit, Office e Atendimento são o núcleo inicial proposto de produtos componíveis. As verticais traduzem combinações desses produtos e capacidades específicas em experiências próprias de cada mercado.

**Essa direção afeta as verticais, inclusive o Med, na evolução futura.** O acabamento atual do site Med segue seu escopo. A reorganização será aplicada depois ao site Catalisa, à apresentação da oferta e, progressivamente, aos produtos e às verticais. A experiência do cliente de uma vertical continua falando a linguagem daquele mercado.

O objetivo é reduzir a confusão de uma Catalisa apresentada simultaneamente por muitos segmentos e permitir a venda de funções e capacidades sem exigir que o visitante entenda aplicações de outros setores.

## Direção e alcance

O usuário definiu como direção:

- Organizar a oferta da Catalisa em produtos que possam trabalhar juntos.
- Reconhecer Office como produto de operação do dia a dia aplicável a diferentes segmentos, a partir do uso operacional já realizado na própria empresa.
- Dar a Atendimento uma expressão comercial ligada aos canais e à continuidade do relacionamento.
- Preservar a composição que orienta o desenho das verticais.
- Evoluir futuramente ambientes de operação de Banking e Credit com a clareza de papéis, rotinas e responsabilidades buscada no Med, depois da estabilização das entregas atuais.
- Documentar o impacto nas verticais e buscar uma migração com o máximo de reaproveitamento.

As fronteiras detalhadas, o enquadramento das demais ofertas e a estrutura de contratação abaixo são propostas para orientar a próxima revisão. Preços, contratos, nomes definitivos e mudanças técnicas exigem decisões próprias.

O mapa de impacto e a sequência de adoção estão em [Impacto e migração](impacto-e-migracao.md). A representação estruturada está em [Oferta componível](oferta.json). Esses arquivos são documentação interna, sem integração ao catálogo público ou ao runtime.

## Produtos que o cliente consegue reconhecer

| Produto | Trabalho que organiza | Expressão comercial proposta |
|---|---|---|
| Banking | Produtos financeiros, contas, movimentações e sua operação, conforme parceiros e integrações contratados | Crie e opere seus produtos financeiros. |
| Credit | Originação, análise, formalização e acompanhamento de operações de crédito | Organize o crédito da proposta à carteira. |
| Office | Trabalho operacional, tarefas, documentos, agendas, aprovações e equipes humanas e virtuais | Coloque a operação do dia a dia para trabalhar. |
| Atendimento | Canais, conversas, distribuição de solicitações, histórico e continuidade do atendimento | Conecte cada pedido ao próximo passo. |

Banking e Credit organizam domínios de negócio. Office e Atendimento são transversais aos segmentos. Essa diferença não impede que os quatro sejam apresentados como produtos com responsabilidades e formas de operação próprias.

O nome Atendimento é funcional nesta proposta. Sua assinatura final e a forma de apresentação nos idiomas do site devem ser alinhadas na revisão comercial.

### Office e Atendimento

Atendimento organiza o relacionamento com quem chega pelos canais: a solicitação, a conversa, o encaminhamento e o retorno. Office organiza o trabalho que acontece na empresa: tarefa, responsável, prazo, documento, aprovação e conclusão.

Uma solicitação pode começar em Atendimento, gerar trabalho no Office e receber uma resposta quando esse trabalho avançar. Office também pode operar a partir de agendas, eventos, formulários e sistemas existentes. Sua contratação não precisa estar vinculada ao uso de um canal de conversa.

Office é um produto de operação. Os motores compartilhados de IA, workflows, dados e identidade continuam sendo capacidades da plataforma. O fato de um produto usar esses motores não significa que ele precise contratar Office para funcionar.

## Camadas com responsabilidades distintas

| Camada | Responsabilidade | Exemplos |
|---|---|---|
| Marca Catalisa | Dar unidade à oferta e à maneira de construir e operar | Site institucional, posicionamento e relacionamento comercial |
| Plataforma de capacidades | Sustentar os produtos e disponibilizar contratos reutilizáveis | Identidade, permissões, dados, eventos, IA, workflows, documentos, integrações e medição |
| Produtos componíveis | Entregar trabalhos de negócio com escopo reconhecível | Banking, Credit, Office e Atendimento |
| Pacotes de trabalho | Reunir funções, rotinas e integrações para um resultado | Agenda ocupada, operação conectada, análise e encaminhamento de propostas |
| Experiências por contexto | Apresentar a operação para seus usuários e seus papéis | Med, Jurídico e futuros ambientes operacionais de Banking e Credit |

Um produto pode ter capacidades acessíveis por API e uma experiência de operação. Uma vertical pode reunir produtos e acrescentar suas próprias regras. O cliente compreende primeiro o trabalho que contrata; o aprofundamento revela como as peças se conectam.

## Como as verticais se encaixam

Uma vertical mantém sua marca, seu público, suas jornadas e suas regras de domínio. A composição indica quais produtos e capacidades participam da entrega. O cliente da vertical pode receber tudo como um pacote coerente, com implantação, suporte e capacidade de uso compreensíveis.

| Experiência | Composição proposta | O que permanece específico |
|---|---|---|
| Med | Office e Atendimento, com capacidades clínicas e de consulta | Vínculos por clínica, contexto clínico, papéis profissionais, revisão e liberação de documentos |
| Jurídico | Office e Atendimento, com capacidades jurídicas | Contexto dos casos, documentos, responsabilidades e revisão profissional |
| Demais verticais | Produtos e capacidades selecionados por jornada | Vocabulário, dados, regras, papéis e entregas de cada mercado |
| Operação de Banking | Banking e componentes operacionais; Office e Atendimento conforme o trabalho contratado | Contas, movimentações, autorizações e responsabilidades da operação financeira |
| Operação de Credit | Credit e componentes operacionais; Office, Atendimento e Banking conforme o trabalho contratado | Propostas, políticas, dossiês, formalização, carteira e alçadas |

Essas composições são o desenho de destino. Elas não afirmam que todos os produtos já estejam desacoplados, licenciados ou instaláveis dessa forma nas implementações atuais.

No Med, a comunicação continua sendo sobre a rotina médica e a clínica. O cliente não precisa conhecer a arquitetura da Catalisa para usar a solução. A aplicação futura pode reorganizar pacotes, funções e componentes internos, preservando os vínculos, as jornadas e a separação dos dados de cada clínica.

### Produtos e verticais do catálogo atual

O catálogo institucional consultado apresenta Banking, Credit, Med, Jurídico, Biometrics e Decision. A revisão precisa mapear essas ofertas, preservar suas entradas e definir sua posição na nova arquitetura.

Biometrics e Decision podem participar de composições e continuar tendo oferta própria quando houver comprador, escopo e operação independentes. A proposta dos quatro produtos iniciais não determina a retirada dessas ofertas. A classificação deve seguir o trabalho contratado e a experiência entregue.

## Equipes virtuais e pacotes

A equipe virtual é uma forma de operar os produtos. Cada função tem responsabilidades, contexto, ferramentas permitidas, regras de execução e uma pessoa responsável pelas decisões que exigem aprovação.

Office pode reunir funções de coordenação e apoio operacional. Atendimento pode oferecer funções de recepção e acompanhamento. Banking e Credit acrescentam funções específicas de seus domínios. A mesma base de funções pode receber rotinas diferentes em cada vertical.

O modelo separa três conceitos:

- A função assume uma responsabilidade, como acompanhar pendências.
- A rotina organiza o trabalho, como conferir um documento e encaminhar uma tarefa.
- O pacote combina funções, rotinas e integrações para um resultado que o cliente reconhece.

A autonomia é definida por ação. Uma função pode executar tarefas previstas nas regras, solicitar aprovação para uma exceção e preparar material para revisão em outro trecho do processo. Toda execução conserva o contexto do cliente e do produto.

Especializar um pacote para um segmento não exige duplicar os motores que o executam. Regras e dados de domínio continuam sob responsabilidade da vertical ou do produto correspondente.

## O significado de ser plugável

Produtos trabalham juntos por contratos de integração e responsabilidades explícitas. Essa composição precisa ser demonstrável em uma jornada, além de aparecer num diagrama.

Uma primeira jornada pode receber uma solicitação em Atendimento, abrir uma tarefa no Office, consultar uma operação em Credit ou Banking e devolver o encaminhamento ao responsável. Cada produto mantém a autoridade sobre seu domínio.

Para suportar a composição, a implementação precisa definir:

1. Identidade, organização, vínculo e permissões de cada participante.
2. Referências aos registros de origem e autoridade sobre cada informação.
3. Ações e eventos com entradas, saídas, versões e tratamento de falhas.
4. Correlação da jornada, retomada e prevenção de execução duplicada.
5. Aprovações, responsabilidades humanas e encaminhamento das exceções.
6. Dependências de instalação, configuração e recursos contratados.
7. Atribuição de uso e custos ao contrato correto.

Integrações com sistemas externos entram pelos mesmos princípios. Um cliente pode compor um produto Catalisa com sistemas que já utiliza.

### Autonomia comercial

O cliente deve conseguir começar por um produto com uma operação mínima coerente. Produtos adicionais ampliam o trabalho que ele consegue realizar. Capacidades internas compartilhadas não se tornam automaticamente novas contratações obrigatórias.

Uma conta pode contratar Office para organizar o trabalho operacional, Atendimento para os canais ou uma combinação com Banking e Credit. Uma vertical pode empacotar a combinação apropriada para seu público.

A proposta comercial precisa explicar produto, implantação e capacidade de uso. O reaproveitamento técnico exige uma regra de atribuição de custos e medição que evite cobrar o mesmo trabalho mais de uma vez. A definição dessas regras antecede qualquer mudança no faturamento existente.

## Experiências operacionais de Banking e Credit

A referência do Med é a clareza com que o usuário encontra suas unidades, equipe, agenda, pendências e próximos passos. O reaproveitamento futuro é de um ambiente de trabalho com componentes comuns e funções próprias de cada domínio.

No Banking, esse ambiente pode reunir contas, movimentações, solicitações, exceções e autorizações. No Credit, propostas, análises, documentos, formalização, carteira e acompanhamento. Os papéis e as ações devem refletir as responsabilidades reais de cada operação.

Esses ambientes podem ser experiências dos próprios produtos, sem a criação automática de novas marcas. O investimento deve acompanhar a estabilização de Banking e Credit e aproveitar componentes e contratos existentes quando forem adequados.

## Consequências para o site Catalisa

A entrada comercial passa a organizar a compreensão pelos produtos e pelo trabalho que eles resolvem. Setores e verticais demonstram aplicações e ficam disponíveis no aprofundamento contextual.

Uma explicação de abertura para testar é:

> A Catalisa oferece produtos para operações financeiras, crédito, atendimento e trabalho do dia a dia. Comece pelo que sua empresa precisa e conecte os demais produtos conforme sua operação cresce.

As páginas de Banking e Credit aprofundam seus domínios. Office explica o trabalho operacional em linguagem transversal. Atendimento mostra o percurso dos pedidos e das conversas. Uma seção de composição demonstra como as peças trabalham juntas.

A base técnica continua acessível por capacidades, arquitetura, integrações e documentação. Uma página comercial pode explicar funções de uma empresa sem recorrer a exemplos de saúde, advocacia ou outros setores.

A revisão deve preservar a direção visual e a voz da Catalisa: imagem editorial, produto como prova, situações reconhecíveis, chamadas claras e responsabilidades legíveis. Não exige copiar a composição visual de uma vertical.

As rotas, os links compartilhados, o SEO e os sete idiomas entram no plano de transição. A definição comercial precede alterações no menu e no catálogo público.

## Caminho de menor mudança

Preservar as implementações e jornadas existentes é a hipótese inicial. O primeiro trabalho é mapear capacidades, produtos, pacotes e experiências; depois ajustar comunicação e metadados de composição. Extrações de código e migrações de dados devem responder a uma necessidade concreta.

A expectativa de reaproveitamento não é uma estimativa de esforço. Permissões, instalação, isolamento, contratos e cobrança podem exigir mudanças de produto. A análise por área está no [plano de impacto](impacto-e-migracao.md).

## Referências para a próxima etapa

- [Estratégia e posicionamento do site](../redesign-2026-10-22/novos-insumos/catalisa-handoff-v1.1/docs/01-estrategia.md).
- [Linguagem e conteúdo](../redesign-2026-10-22/novos-insumos/catalisa-handoff-v1.1/docs/02-linguagem.md).
- [Direção editorial](../direcao-editorial-2026-10-24/README.md).
- [Catálogo institucional consultado](../../src/redesign/data/product-directory.json).
- [Composições da arquitetura](../../src/redesign/data/architecture.json).
- [Jornadas de operação](../../src/redesign/data/operations.json).

No repositório `wpp.bb.catalisa.io`, a implementação a mapear inclui `apps/painel-cliente`, `apps/painel-cliente-api`, `apps/painel-cliente-worker`, `apps/hotsite-kit` e os templates em `apps/painel-cliente-api/src/modules/workflow-templates`. O kit compartilhado de sites demonstra reaproveitamento de estrutura; a composição comercial e operacional dos produtos exige seu próprio mapa de contratos.
