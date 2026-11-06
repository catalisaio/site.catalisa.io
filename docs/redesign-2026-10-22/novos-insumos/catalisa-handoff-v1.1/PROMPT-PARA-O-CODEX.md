# Prompt de entrada para o repo de produção

Você vai continuar o site Catalisa a partir deste handoff. A versão v1.1 é a referência de marca, estrutura, conteúdo e interação. O objetivo é implementar o site no repo de produção com integrações reais, mantendo a direção aprovada.

1. Leia as instruções existentes do repo, inclusive AGENTS.md, CLAUDE.md e documentos da equipe. Não os sobrescreva. Leia `docs/catalisa-handoff-2026-10-22/` caso o pacote já tenha sido importado, ou a pasta `docs/` deste pacote.
2. Abra o PDF e a referência `reference/site/`. Inspecione a Home, Visão, catálogo/detalhe, Studio, Workflows, Agentes, Governança, Desenvolvedores, Banking, Credit, Lab e Contato antes de propor abstrações.
3. Identifique stack, build, deploy, testes, fontes de conteúdo e serviços existentes. Faça um mapa explícito entre referência e repo. Preserve o stack quando viável. Não crie ou publique um novo site nesta conta sem necessidade.
4. Preserve a Home aprovada, o rótulo Visão em `/visao/`, o CTA de Lab no topo e a diversidade de layouts. Não substitua a direção por template SaaS uniforme. Valide em 320, 390, 768 e desktop.
5. Considere a referência estática executável, mas não produção completa. Distingua interação local, capacidade documentada e contrato proposto. Não apresente mock como envio real, IA real ou lead persistido.
6. Implemente o backend do site e adaptadores para os serviços reais da Catalisa. Os arquivos de `contracts/` são propostas: confirme os contratos instalados e registre o mapeamento. Nunca exponha segredos ou tenant no browser.
7. Contato: três respostas, depois nome, depois identidade provisória/lead persistidos com histórico, depois resumo, conceito e continuidade. Nome não é identificador único. Se o cadastro real exigir e-mail, use registro provisório sem inventar e-mail e sem mudar a sequência aprovada.
8. Geração: IA retorna JSON restrito validado, com slugs permitidos, telas, capacidades e jornada. Renderer determinístico; nenhum HTML/JS arbitrário. Persistência, idempotência, quotas, timeout e retry com estado verdadeiro.
9. Atendimento: enviar somente após escolha e confirmação do visitante. Distinguir recebido, entregue e pessoa atribuída. Garantir histórico e conceito disponíveis para a equipe no mesmo contexto.
10. Revalidar conteúdo, maturidades, origem de prints, links e licenças. O estado de uma API e a maturidade do produto não são inferidos de uma captura.
11. Integrar novas inspirações usando a matriz do handoff. Preserve decisões aprovadas e registre conflitos. Não afirme ter revisado arquivos que não abriu.
12. Trabalhe pelo backlog H01-H16 e critérios de aceite. Comece pelo que já está autorizado e reversível; só peça informação quando depender de uma decisão que o repo e os serviços não respondem. Não invente credenciais ou aprovações.
13. Antes de produção: revisão visual, acessibilidade, conteúdo, integração, SEO, política de dados, performance, observabilidade e rollback. A referência contém noindex/nofollow; liberar indexação apenas para páginas aprovadas, nunca conversas ou conceitos privados.

Ao terminar, entregue código testado, lista de integrações verificadas, evidências de QA, pendências concretas e procedimento de deploy/rollback. Não marque como concluído um P0 que só tem mock ou contrato desenhado.
