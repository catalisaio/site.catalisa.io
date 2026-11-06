# Implementação de produção

## Estado real da referência
| Recurso | Hoje | Trabalho de produção |
|---|---|---|
| Navegação e 69 rotas | HTML estático | Migrar ou hospedar preservando rotas e redirects |
| Busca e filtros | Dados locais | Pode continuar local; atualizar catálogo com fonte validada |
| Documentação e maturidade | Snapshot em blocks.json | Definir fonte e rotina editorial de atualização |
| Abas, SVGs e demonstrações | Estados locais | Manter como explicação quando apropriado |
| Galeria e press-kit | Assets locais | Revisar direitos, tamanhos, cache e downloads |
| Vídeos | Montagens de referência | Identificar como tal ou gravar material atualizado |
| Lab | Modelos por palavras-chave | Ligar ao backend e renderizador de conceito validado |
| Contato | Estado em memória; IDs mock | Sessão persistente, lead/contato, agente e transferência |
| E-mail/WhatsApp | Escolha e confirmação simuladas | Canal real, entrega e histórico de estado |
| Inteligência de mercado | Não instalada | Eventos controlados, categorias e visão agregada |
| SEO | noindex,nofollow em toda rota | Canônico, indexação seletiva, sitemap e metadados |

## Arquitetura recomendada
Preservar o stack de produção já existente sempre que viável. Esta recomendação define responsabilidades, não impõe uma nova plataforma:
1. Frontend público com páginas renderizadas e componentes interativos progressivos.
2. Backend do site (BFF) para sessão, idempotência, validação e integração. Segredos e tenant ficam no servidor.
3. Adaptadores para contatos, leads, conversas, agentes, workflow e canais da Catalisa. Mapear cada um ao contrato real da instalação.
4. Trabalho assíncrono para geração/refinamento de conceito e encaminhamento. Estados persistidos, retries limitados e erro explícito.
5. Renderer determinístico a partir de JSON validado. O modelo não retorna HTML/JS arbitrário para execução.
6. Observabilidade de execução e auditoria de transições. Analytics de produto usa taxonomia própria e dados minimizados.

## Sessão, contato e identidade
O visitante pode começar sem e-mail. Criar uma sessão opaca no servidor; usar cookie seguro, HttpOnly e SameSite conforme a arquitetura real. Evitar expor tokens e identificadores internos de tenant. Vincular mensagens, revisões e trabalhos ao mesmo contexto.

Ordem obrigatória do contato: ideia → contexto/público → objetivo/direção → nome → persistência de identidade provisória + lead → resumo → geração de conceito → ajustes → continuidade. Persistir cada resposta, não apenas o resumo final.

Nome não é chave única. Não deduplicar pessoas globalmente pelo nome e não vincular histórico a outro contato sem prova de identidade. Se a API de contatos exigir um endereço que ainda não existe, criar primeiro um registro provisório no backend do site e um lead não qualificado, ou usar mecanismo equivalente aprovado na instalação. Enriquecer e reconciliar depois, mantendo o histórico. Não inventar e-mail nem alterar a ordem para contornar o contrato.

Falha ao registrar identidade: preservar respostas e mostrar nova tentativa. Não declarar cadastro concluído ou avançar silenciosamente para geração vinculada a um contato inexistente. Uma chave de idempotência evita duplicar contatos/leads em retries e cliques repetidos.

## Geração de conceito
Receber briefing e versão, selecionar capacidades do catálogo autorizado e produzir o schema restrito fornecido no pacote. Rejeitar slugs desconhecidos, campos extras perigosos e textos além dos limites. Tratar briefing, mensagens e conteúdo recuperado como dados não confiáveis: não permitir que instruções do visitante ampliem ferramentas, tenant ou permissões do agente. O agente do site explica e prepara conceitos; não executa transações bancárias, aprovações de crédito ou publicação de produtos. O backend valida schema e regras de negócio antes de armazenar. A interface recebe trabalho pendente e acompanha o estado por polling; streaming é uma melhoria opcional.

O resultado deve conter: hipótese resumida, telas conceituais, participantes, capacidades com papel e maturidade, jornada e limites. Não prometer viabilidade, compliance, aprovação de crédito ou disponibilidade de produto completo. A prévia não cria um SaaS de produção.

Durante falha, preservar o briefing. Explicar o que deu errado de maneira útil e permitir retry. Um fallback de demonstração precisa ser identificado como exemplo, com escolha do visitante; não mascarar a falha como geração real. Estabelecer timeout, limite de custo e quotas no servidor antes de abrir o recurso ao público.

## Refinamento e versionamento
Cada mudança significativa cria nova versão do conceito, associada à versão do briefing. Alterar o briefing invalida a interpretação anterior sem apagar o histórico. Guardar pedido do visitante e hipótese do agente separadamente. Revisão humana altera a jornada e os estados; não marcar como aprovado algo que aguarda uma pessoa.

## Atendimento e canais
O botão de continuidade abre escolha clara: aqui, e-mail ou WhatsApp, conforme canais efetivamente instalados. Coletar endereço somente quando necessário. Mostrar o contexto que acompanhará o pedido e pedir confirmação antes do encaminhamento.

No backend: criar solicitação persistente e uma saída transacional/evento de entrega. O adaptador executa o envio e atualiza estados como accepted, queued, delivered, failed ou assigned. “Pessoa assumiu” exige confirmação de atribuição recebida do sistema de atendimento; nunca um timer.

Validar origem e assinatura dos webhooks, aplicar deduplicação por ID do evento e preservar ordem/versão das transições. Se o serviço só confirmar recebimento, mostrar recebido, não entregue. Definir fila responsável e comportamento fora do horário antes do lançamento.

## Histórico e inteligência
Registrar respostas, revisões, conceito e encaminhamento com sessão, correlação, horário e origem (visitante, sistema, agente, pessoa). Separar conteúdo de conversa de logs técnicos. Não registrar prompts brutos, dados pessoais ou credenciais em logs genéricos.

As categorias de mercado são hipóteses revisáveis: setor, problema, capacidade, tipo de produto, intenção e desfecho. Dar ao responsável do produto meios de corrigir categorias. Relatórios agregados não precisam expor nomes ou conversas completas. A política de finalidade, retenção, exclusão e acesso deve ser definida e publicada pelos responsáveis da Catalisa antes da coleta real.

## Adaptadores e fontes reais
Consultar `docs/CATALISA-CONTACT-AGENT-PROMPT.md` na referência para a proposta anterior de agente/workflow, com seus contratos e limites. Não copiar nomes de serviços como se fossem endpoints instalados. O backend do site traduz o contrato proposto deste handoff para APIs verificadas no repo e no ambiente.

Manter IA, banco, fila e canais atrás de adaptadores. Uma indisponibilidade de provedor não deve corromper a conversa nem gerar leads duplicados. Não chamar diretamente provedores de IA ou APIs privadas a partir do navegador.

## SEO e lançamento
A referência gera `noindex,nofollow`. Antes do lançamento, escolher o domínio canônico, revisar redirects do site antigo, garantir status HTTP corretos para 404 e rotas removidas, inserir canônicos e metadados sociais e gerar sitemap somente com páginas públicas aprovadas. Páginas ou conceitos privados continuam fora de indexação.

Dois cuidados: não indexar conversas ou demos individualizadas e não publicar fontes/editoriais desatualizadas como fatos atuais. Revisar especialmente maturidades, capturas e textos de Perspectivas antes de remover noindex.

## Assets, performance e acessibilidade
Inventário de mídia e hashes acompanham o pacote. Confirmar direitos de uso e licença das fontes. Compressão, dimensões explícitas, imagens responsivas, poster de vídeo, lazy loading abaixo da dobra e carregamento seletivo dos scripts por página. Não baixar todos os prints em resolução máxima antes de o visitante abrir a galeria.

Testar contraste, teclado, foco de modal e retorno, rótulos, anúncios de estado, zoom e redução de movimento. Rótulos essenciais não devem existir apenas dentro de SVGs ou imagens. Reduzir duplicações de cores e CSS incremental depois de congelar a referência visual.

## Entrega e reversão
Publicar primeiro em staging. Realizar testes de integração com dados fictícios e canais de teste. Confirmar instrumentação e falhas previsíveis. Fazer o corte de domínio e indexação em mudança separada e reversível. Preservar build anterior e plano de retorno; definir quem monitora erros e filas após o lançamento.
