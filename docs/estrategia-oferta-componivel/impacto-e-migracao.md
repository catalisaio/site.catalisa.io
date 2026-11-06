# Impacto da oferta componível nas verticais e nos produtos

Este plano acompanha a [arquitetura da oferta Catalisa](README.md). A direção afeta o site institucional, a comunicação comercial e a composição futura dos produtos e das verticais. O trabalho atual do Med mantém seu escopo; a adoção desta arquitetura é uma frente posterior.

O caminho proposto é preservar funcionalidades, dados, jornadas e integrações que já funcionam. A revisão começa por enquadramento comercial e composição. Mudanças técnicas entram onde o mapa de dependências demonstrar necessidade.

## O que muda nas verticais

As verticais passam a ter uma composição explícita de produtos e capacidades. Continuam oferecendo ao seu público uma experiência única, com linguagem, regras e responsabilidade próprias.

| Área | Efeito futuro nas verticais | Estratégia de reaproveitamento |
|---|---|---|
| Posicionamento | Explicar a vertical como uma solução de mercado apoiada por produtos Catalisa | Preservar marca, público e proposta específica |
| Pacotes | Reunir funções e processos por resultado ou especialidade | Acrescentar metadados aos pacotes existentes antes de criar outro instalador |
| Equipes virtuais | Identificar funções, responsabilidades e ações permitidas | Reaproveitar agentes, ferramentas e workflows com contexto explícito |
| Experiência operacional | Tornar tarefas, aprovações, histórico e pendências consistentes | Compartilhar componentes e contratos adequados; preservar telas de domínio |
| Integrações | Definir quais produtos e sistemas participam de uma jornada | Reutilizar conectores e ações existentes, com configuração por organização |
| Acessos | Coordenar permissões entre os produtos contratados | Preservar o IAM como origem e o isolamento por organização e vínculo |
| Dados | Manter a origem e a autoridade sobre registros de cada domínio | Compartilhar referências e eventos; avaliar qualquer necessidade de cópia ou migração |
| Cobrança | Explicar o pacote e atribuir o consumo ao contrato correto | Mapear a medição atual antes de introduzir direitos de uso ou faturamento diferentes |
| Suporte | Dar clareza sobre quem responde pela solução entregue | Oferecer um percurso de atendimento compreensível mesmo quando vários produtos participam |

No Med, isso pode reorganizar a equipe virtual, os pacotes de rotinas e os componentes de operação. Os vínculos de profissionais e equipes e o contexto clínico de cada unidade precisam ser preservados. A solução não depende de apresentar ao médico produtos de outros segmentos.

No Jurídico e nas demais verticais, a mesma lógica preserva o vocabulário e as regras profissionais do domínio. Alterações na base compartilhada devem ser avaliadas em todos os consumidores antes da adoção.

## Fronteiras que precisam ficar claras

### Office e a plataforma compartilhada

Office entrega trabalho operacional para usuários de negócio. IA, workflows, identidade, dados, documentos e integrações são capacidades que podem sustentar Office e os demais produtos.

Antes de transformar funcionalidades atuais em um produto Office, mapear o que pertence à experiência operacional, à administração da plataforma e às configurações de construção. Isso permite reaproveitar a base sem expor desnecessariamente ferramentas técnicas ao comprador de operação.

### Atendimento e funções de comunicação

Atendimento reúne canais, conversas, solicitações e continuidade. Eventos e notificações necessários à operação mínima de outro produto não geram, por si só, uma dependência comercial de Atendimento. O escopo de uma contratação precisa distinguir essas situações.

### Domínios e dados

Banking permanece responsável pelos registros financeiros do seu domínio. Credit, pelos registros das operações de crédito. A vertical clínica preserva seu contexto clínico. Office acompanha tarefas e referências; Atendimento conserva o contexto do relacionamento.

Uma composição não concede acesso automático a todos esses registros. O contexto autorizado deve acompanhar a consulta, a ação e o retorno de cada etapa.

## Classificação inicial de mudanças

As classes abaixo indicam onde investigar. Não representam estimativa de horas ou garantia de esforço pequeno.

| Mudança | Classe inicial | O que confirmar |
|---|---|---|
| Explicação da oferta no site Catalisa | Editorial | Fronteiras, linguagem, navegação e posição das ofertas atuais |
| Apresentação de Office e Atendimento | Editorial e catálogo | Escopo de compra, maturidade de cada entrega e experiência demonstrável |
| Relação de composição das verticais | Catálogo e configuração | Dependências já existentes e metadados de instalação |
| Pacotes de funções e rotinas | Produto e configuração | Versionamento, recursos exigidos e aplicação por organização |
| Componentes comuns de operação | Reaproveitamento a avaliar | O que pode ser compartilhado sem substituir telas de domínio |
| Login, organizações e permissões entre produtos | Estrutural se houver unificação | Modelos de sessão, vínculos e direitos de uso existentes |
| Medição e cobrança de uma composição | Estrutural se o contrato mudar | Contrato pagador, unidade, eventos de consumo e prevenção de duplicidade |
| Compartilhamento ou movimentação de dados | Estrutural se necessário | Fonte de verdade, contexto autorizado, referências e compatibilidade |
| Ambientes operacionais futuros de Banking e Credit | Nova experiência com reaproveitamento | Jornadas, papéis e componentes comuns após estabilização |

## Sequência de adoção

### Primeiro estabilizar e inventariar

Concluir a entrega atual do Med. Registrar os produtos, aplicações, templates, integrações, papéis e formas de uso existentes. Diferenciar uma capacidade disponível, um template configurável e uma experiência já pronta para um cliente operar.

O resultado é um mapa de correspondência entre o que existe e os conceitos da nova oferta, com os pontos de acoplamento identificados. O uso operacional descrito como Office é um ponto de partida para esse levantamento.

### Depois alinhar a comunicação da Catalisa

Revisar a apresentação institucional, a página de produtos, as páginas de Banking e Credit e a expressão comercial de Office e Atendimento. Manter as aplicações e verticais acessíveis na navegação contextual e nos links existentes.

O site deve permitir que um comprador entenda um produto e sua combinação com os demais sem precisar estudar aplicações de outros segmentos. O conteúdo técnico continua disponível como aprofundamento.

Preparar a revisão nos sete idiomas e conferir as rotas, os títulos, os links compartilhados e os formulários de interesse. A publicação segue o fluxo de staging e autorização já definido no repositório.

### Definir uma jornada de composição verificável

Escolher um percurso de valor limitado, com responsáveis e produtos definidos. Por exemplo: uma solicitação recebida em Atendimento gera uma tarefa no Office, consulta um registro autorizado em outro sistema e retorna um encaminhamento.

Comprovar a jornada com suas permissões, histórico, aprovações, retomada e atribuição de consumo. A extensão a Banking ou Credit deve usar regras e ações próprias desses domínios.

### Organizar os pacotes

Mapear cada pacote para produtos, funções, rotinas, integrações e recursos exigidos. Acrescentar esse modelo ao catálogo e ao processo de instalação existente quando for viável.

Regras de versão e atualização precisam preservar as configurações de cada cliente. A descoberta de uma dependência técnica não deve alterar silenciosamente uma contratação.

### Adotar progressivamente nas verticais

Escolher uma jornada de uma vertical para reaproveitar os componentes de operação. Preservar seus dados e seus caminhos de uso. Validar os demais consumidores da base compartilhada antes de ampliar a mudança.

Migrar configurações ou dados apenas quando o percurso de adoção demonstrar necessidade, com compatibilidade e reversão definidas. Não tratar a nova nomenclatura comercial como motivo suficiente para renomear identificadores técnicos.

### Evoluir a operação de Banking e Credit

Depois da estabilização, desenhar seus ambientes de trabalho com papéis, filas, pendências, aprovações e histórico. Reaproveitar a base de operação que se mostrar adequada e manter específicas as regras dos produtos financeiros e de crédito.

A referência do Med é a clareza da experiência. A implementação futura não pressupõe que suas telas ou seu modelo clínico sejam transferidos para outros domínios.

## Critérios para manter a mudança contida

- Fazer primeiro o mapa comercial e funcional, antes de extrair módulos.
- Preservar identificadores e contratos técnicos estáveis quando a mudança for de apresentação.
- Reaproveitar templates, ferramentas, componentes e instaladores existentes onde houver correspondência de responsabilidade.
- Separar o trabalho de comunicação de mudanças de identidade, cobrança e dados.
- Escolher uma composição e uma jornada para validar o modelo antes de propagar às verticais.
- Compartilhar por contratos, componentes ou kit de operação conforme o caso; uma única tecnologia de frontend não é pré-condição desta proposta.

## Decisões para a retomada

1. Confirmar as fronteiras de compra e operação de Office e Atendimento.
2. Mapear o painel atual entre administração da plataforma, construção e trabalho operacional.
3. Classificar as ofertas atuais, incluindo Decision e Biometrics, sem removê-las por consequência da nova taxonomia.
4. Escolher o primeiro pacote transversal e a primeira jornada de composição.
5. Definir o que uma contratação inclui e quais produtos são opcionais.
6. Confirmar as regras de identidade, medição e atribuição ao contrato.
7. Revisar o site Catalisa e, depois, planejar a adoção pelos produtos e verticais.

## Como verificar o resultado

Na comunicação, uma pessoa consegue explicar o trabalho de cada produto, escolher por onde começar e entender uma combinação sem confundir produto, capacidade e vertical.

Na operação, uma jornada composta mantém a origem dos registros, o contexto de acesso, os responsáveis e o histórico de cada etapa. Falhas e repetições são tratadas sem duplicar a ação ou o consumo atribuído. O cliente encontra suas tarefas, resultados e aprovações em uma experiência coerente.

Na migração, os clientes existentes conservam suas jornadas e dados enquanto a nova organização é adotada. Novos ambientes e novas formas de contratação recebem validação própria antes de substituir a operação anterior.
