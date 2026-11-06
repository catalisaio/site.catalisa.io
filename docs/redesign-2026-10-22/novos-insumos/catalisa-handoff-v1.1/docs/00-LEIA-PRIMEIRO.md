# O que foi aprovado e o que falta

## Missão da próxima equipe
Levar o site aprovado para o repositório e a infraestrutura da Catalisa com fidelidade visual, conteúdo rastreável e integrações reais. Não substituir a direção atual por uma landing page SaaS genérica. Começar por inventariar o repo de destino e suas instruções; adaptar a implementação ao stack existente.

## Decisões consolidadas
- Site principal como marca e referência arquitetural. Produtos setoriais e vitrines SaaS aprofundam os contextos comerciais.
- Minimalismo com expressão Bauhaus: geometria com propósito, bastante espaço, roxo como eixo e laranja como acento de vida.
- Home aprovada. Páginas internas precisam ter ritmos próprios; consistência não exige repetir hero, grade de cards e CTA em todas elas.
- Banking e Credit são as estrelas do ecossistema. Mostrar produto, canais, operação e interfaces reais com origem explícita.
- Catálogo de building blocks em grid; detalhes com linguagem de negócio, exemplos, limites e documentação já no início.
- Lab é CTA do topo. Deve transformar uma descrição em uma representação visual do produto, não em um chat genérico.
- Contato é uma experiência própria: três perguntas abertas ou sugestões, depois nome, depois resumo, conceito e continuidade com contexto.
- Visão é o nome da página e da navegação em `/visao/`.
- Assinatura em minúsculas e símbolo `c.` pertencem à direção adotada no protótipo. Validar arquivos finais com o responsável pela marca antes de padronizar outros canais.

## Como interpretar as evidências
**Implementado na referência** significa que existe HTML/CSS/JS e comportamento local verificável. **Documentado** significa que o catálogo ou uma fonte descreve a capacidade. **Proposto** significa que este handoff especifica trabalho futuro. Não tratar essas categorias como equivalentes.

A auditoria mobile existente tem 207 medições em 69 rotas e três larguras. Ela verifica estado inicial e largura, não todos os estados nem todos os aparelhos. Não usar esse resultado como certificado de acessibilidade, performance ou prontidão de produção.

## Pontos ainda não resolvidos no ambiente de destino
URL e stack do repo de produção; autenticação serviço-a-serviço; tenant e identidade da Catalisa; APIs reais de contatos/leads/conversas/agentes; webhook e fila de atendimento; modelos e orçamento de IA; retenção e publicação da política de privacidade; plataforma de observabilidade; domínio canônico e redirects; licenças e autorização de todas as imagens e fontes.

O handoff não depende dessas respostas para ser lido ou executado. Elas são condições de integração, com tarefas e critérios de aceite no backlog. Nenhuma credencial, segredo ou endpoint privado foi incluído.
