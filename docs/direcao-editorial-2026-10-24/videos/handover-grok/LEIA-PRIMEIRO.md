<!-- DIRECAO-VIGENTE-25 -->
**Direção vigente:** leia [SINCRONIZACAO-2026-10-25.md](SINCRONIZACAO-2026-10-25.md) e [INDICE-31-CUES.md](INDICE-31-CUES.md) antes das referências históricas abaixo. Os dois masters atuais têm 29 cenas e os mesmos cue points; o master principal não contém UI.

# A casa · handover para o Grok

> Atualização executiva posterior: leia [ATUALIZACAO-EXECUTIVA.md](ATUALIZACAO-EXECUTIVA.md) e acompanhe os [novos filmes](../temporada-executiva.html). Os estados abaixo documentam a passagem original.

Este pacote reúne a mensagem, a direção visual, os personagens, as referências de atuação e o material de produção da temporada Catalisa **A casa**. É uma passagem documental solicitada pelo dono; nenhum agente Grok foi iniciado e nenhum novo crédito foi gasto para montá-lo.

## Mandato atual

Produzir a sequência aprovada, um episódio por vez, reaproveitando o mesmo material. Mostrar o link de cada filme assim que estiver pronto e continuar os demais sem pedir novamente aprovação do plano, de cada gesto ou do episódio seguinte. Cada vídeo se explica sozinho e, em ordem, os 31 contam uma história maior. Ao final, montar o site que costura os seis capítulos e dá acesso aos filmes individualmente.

**Despesa nova autorizada neste momento: zero.** O dono pediu para guardar os créditos. Colagem, composição, recortes, animações locais e reuso dos arquivos existentes podem prosseguir. O clipe Gen-4.5 já pago também pode ser reaproveitado. Atuação fotorealista nova depende de geração de vídeo disponível sem cobrança/consumo adicional; nenhuma disponibilidade gratuita do Grok foi verificada. Se a ferramenta exigir créditos ou upgrade, conservar a montagem com o material existente e registrar a pendência; não comprar nem gerar tentativas pagas.

O pedido de autonomia cobre as decisões rotineiras de produção e correções reversíveis. Não equivale a uma compra, publicação em produção, acesso novo ou aprovação automática de uma ferramenta do sistema. Se uma operação exigir autorização real do ambiente, informar a razão concreta. Não prometer que é possível suprimir esses controles.

## Leia nesta ordem

1. Este arquivo: mandato e estado real.
2. [Mensagem e convite à descoberta](01-mensagem.md).
3. [Estilo e personagens](02-estilo-personagens.md), vendo as fotografias correspondentes.
4. [Atuação e prompts](03-atuacao-prompts.md).
5. [Produção, render e conferência](04-producao.md).
6. [Temporada, provas e capturas pendentes](05-temporada-e-provas.md).
7. [Plano aprovado completo](referencias/plano-temporada-aprovado.md) e as fichas correspondentes no [catálogo](referencias/catalogo-conteudo.md).

O [painel visual](index.html) permite acompanhar o elenco, os quatro arquivos finais do episódio 01 e os 31 episódios. [PROMPT-PARA-GROK.md](PROMPT-PARA-GROK.md) é o texto para iniciar outra sessão. [manifesto-assets.json](manifesto-assets.json) registra origem, tamanho e SHA-256 dos arquivos copiados. O ZIP é transportável; caminhos `~/Projects/...` servem apenas para quem está nesta máquina.

## Estado real no momento da passagem

| Entrega | Estado |
|---|---|
| Plano da temporada | 31 episódios aprovados; seis capítulos; já existe versão HTML navegável no site. |
| Episódio 01 normal | Filme completo de 30 s em 16:9 e 9:16; fotografias, colagem e música existentes; zero geração nova de IA. |
| Episódio 01 Gen-4.5 | Filme completo de 30 s nos dois formatos; clipe de atuação de 5 s incorporado na primeira cena. Uma geração real no site Pro; 60 créditos já consumidos. |
| Comparativo de qualidade | Duas montagens reais, cada uma em dois formatos. Isso são quatro arquivos finais, **não quatro modelos comparados**. Não existe resultado Turbo gratuito. |
| Conta Free | A interface mostrou 500 créditos, mas exigiu Upgrade no Gen-4 Turbo; nenhuma geração iniciada. Saldo mostrado não comprova acesso ao modelo. |
| Conta Pro | Última observação após a geração: 2.190 créditos no site (2.250 antes). Não é uma consulta de saldo atual. API e assinatura web têm créditos separados. |
| Episódios 02–31 | Planejados; não renderizados como temporada. Há testes antigos reutilizáveis como referência, sujeitos à inspeção de mensagem e telas. |
| Voz | Não escolhida. Entregas atuais sem locução, com trilha e texto. Não gerar voz ou lip-sync por conta própria. |
| Médica fictícia | Existe descrição editorial, mas nenhum retrato canônico localizado neste kit. Usar os protagonistas existentes; não afirmar elenco ou clipe médico pronto. |
| Site final da temporada | Desejado e autorizado para construção local; ainda não construído como coleção completa dos 31 filmes. Não confundir plano/comparativo com temporada concluída. |

Os dois filmes existentes usam o texto anterior à conversa sobre “descobrir o novo”. A camada editorial nova está documentada; os MP4s não foram reescritos nem renderizados de novo neste handover.

## Qual orientação prevalece

Pedidos mais recentes do dono → plano aprovado e extensão editorial atual → regras de vídeo/telas vetadas → guia de estilo → catálogo → instruções genéricas do gerador. O handoff histórico é útil para decisões e erros, mas suas afirmações “plano não escrito”, “nenhum clipe gerado”, saldo e API obrigatória foram superadas.

O antigo pedido de aguardar quatro versões/modelos foi substituído pelo pedido de preservar créditos e seguir com o material existente. Não reabrir login, troca de chaves, bateria de modelos, character bible com novos ângulos, locução ou pesquisa de linguagem. Não fingir que capturas condicionadas foram obtidas. A função e o estado da prova prevalecem sobre uma imagem bonita.

## Repositórios e preservação

- Gerador: `/home/klederson/Projects/videos.catalisa.app`, ramo `nuvem`; `jobs/`, `library/` e `.cache/` ficam fora do git. O kit inclui os jobs reproduzíveis para não depender desses diretórios temporários.
- Site: `/home/klederson/Projects/site.catalisa.io`; guia, catálogo e plano em `docs/direcao-editorial-2026-10-24/`. Há trabalho alheio não commitado: não fazer stash/reset nem misturar alterações.
- PR #48 do site já foi mergeado por squash, conforme autorização anterior: https://github.com/catalisaio/site.catalisa.io/pull/48 . Não repetir o merge.
- Há mudanças locais ainda não commitadas para `kind: video` na colagem. O [patch](codigo-local.patch) preserva essas diferenças. Não assumir suporte em um checkout limpo nem aplicar o patch às cegas sobre arquivos que já o contêm.
- Nenhum commit, push ou deploy novo é parte desta passagem.

## Próxima ação útil

Abrir o painel visual, assistir ao episódio 01 completo e conferir a foto c7b com o clipe incorporado. Depois executar o episódio 02 com as provas efetivamente disponíveis e inspecionadas. Trabalhar a sequência sem novas confirmações rotineiras. Quando faltar prova indispensável, registrar a captura exata e continuar os episódios independentes que possam ser produzidos; manter a ordem comercial no site. Ao final, relatar qualquer episódio aguardando captura em vez de anunciá-lo como entregue.
