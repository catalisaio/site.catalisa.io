# Reuso de artes da apresentação master — mídia v3

O pedido posterior à publicação foi substituir os vídeos atuais por boas imagens que já existem nos materiais Accenture/Vivere/master. A inspeção atual encontrou o diálogo “Filme conceitual” da Home como a reprodução restante: uma animação CSS entre duas figuras 3D. Os MP4 de Banking/Credit já haviam sido substituídos por capturas ampliáveis.

A pesquisa foi dirigida aos repositórios principais e ao acervo editorial local; não percorreu worktrees duplicados, credenciais ou arquivos privados de configuração. A fonte aproveitada foi o material já presente neste repositório, referenciado pela [mensagem mestra](../../../direcao-editorial-2026-10-24/vivere/mensagem-mestra.md) e pela [apresentação E9](../../../direcao-editorial-2026-10-24/vivere/e9-deck-texto.md). As referências aos clientes identificam o contexto de produção interno, não entram no site público.

| Local | Original preservado | Uso novo |
| --- | --- | --- |
| Home / Studio | `docs/direcao-editorial-2026-10-24/conceitos/c7b-criadora.jpg` | `/redesign/media-v3/editorial-creator.jpg`, substitui o background de telas e elimina o botão/player/modal de filme. Roxo, laranja e geometria relacionam a criadora à construção por composição. |
| Banking / antiga apresentação de reel | `docs/direcao-editorial-2026-10-24/conceitos/c3-circulo.jpg` | `/redesign/media-v3/editorial-composition.jpg`, apoio estático de linguagem visual antes das capturas de staging. |
| Credit / antiga apresentação de reel | `docs/direcao-editorial-2026-10-24/conceitos/c1-executivo.jpg` | `/redesign/media-v3/editorial-executive.jpg`, apoio estático do acervo da direção de crédito antes das capturas reais. |

Os três originais são JPEG 1280×720 (16:9), copiados byte a byte, com 54.436, 72.111 e 92.103 bytes respectivamente. Não houve geração nova, recorte de arquivo, composição raster ou conversão. Foram escolhidas imagens sem texto incorporado nem marca de cliente, evitando ainda manter português dentro de uma imagem nos outros seis idiomas. São artes editoriais, não depoimentos ou provas de interface; as capturas reais continuam separadas, identificadas e ampliáveis. Os retratos não identificam clientes na página.

`Home.tsx` remove o estado, botão e diálogo de reprodução. `home-media.css` adapta somente a imagem da seção Studio à coluna de texto e ao empilhamento mobile. `ProductShowcase.tsx` e seu CSS acrescentam as duas imagens estáticas nas galerias de Banking/Credit. Nenhum dado, fluxo, API, destino de link ou identidade/logotipo do ZIP foi alterado. O hero atual da Home permanece intacto. Não há novas mensagens de tradução: as imagens são decorativas e não acrescentam afirmações de produto.

[Proveniência e SHA256](media-v3-provenance.json) · [validação estática](media-v3-validation.json). A validação leve conferiu sintaxe TSX, remoção do player e igualdade/dimensões dos três arquivos. Não foi executado build, Chrome ou deploy por este worker. A renderização em 320/390/768/1440px, a compilação e a validação em staging ficam com o coordenador antes da próxima publicação.
