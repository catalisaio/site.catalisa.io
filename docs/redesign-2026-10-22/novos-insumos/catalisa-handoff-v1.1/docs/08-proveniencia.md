# Proveniência e limites

## Fonte de referência
Snapshot do projeto implementado em 22/10/2026, commit indicado em `evidence/baseline.json`. Código, conteúdo e assets foram copiados do checkout atual. O inventário foi extraído das 69 rotas renderizadas. A extração não substitui os estados adicionais definidos em JavaScript.

## Fontes editoriais disponíveis no snapshot
- `assets/blocks.json`: documentação e maturidade capturadas anteriormente, com URL da fonte por capacidade.
- `connection/editorial-data.js`: fontes dos textos de Perspectivas.
- `platforms.js`, `products.js` e metadados em `experience.js`: capturas, contexto e composição.
- `reference/site/docs/FLAGSHIP-PRODUCTS.md`: fontes do repo de Banking/Credit, datas e limites.
- `reference/site/docs/CONTACT-EXPERIENCE.md` e `LAB-PROTOTYPE.md`: estado demonstrativo e ponto de integração.
- `connection/presskit.js` e `assets/brand/`: paleta e arquivos da assinatura adotada nesta versão.

Documentação pública de referência: https://docs.catalisa.app/ e site https://catalisa.io/. Repositório indicado na conversa: https://github.com/catalisaio/wpp.bb.catalisa.io. O repo de produção do site não foi identificado pelo usuário nesta etapa. Não confundir o repo de produto com o repo do site.

## O que não foi revalidado nesta entrega
Não foram feitos novos testes nas APIs privadas da Catalisa, nem nova revisão de cada página pública externa. Datas, fontes e maturidades são o snapshot disponível no site; exigem revisão antes do lançamento. Inspirações adicionais que o usuário ainda possui não foram vistas nem incorporadas automaticamente.

## Integridade
`CHECKSUMS.sha256` lista os hashes dos arquivos entregues, exceto ele mesmo. O código de referência não inclui Git, credenciais, configuração da conta de hospedagem nem screenshots internos de QA do navegador. Imagens do site e fontes estão incluídas como assets de referência; sua presença não constitui confirmação de licença para todos os usos.

## Tipos de afirmação
O guia diferencia decisão aprovada, comportamento local implementado, descrição vinda do catálogo e recomendação futura. APIs em `contracts/` são contratos propostos para o backend do site, não endpoints comprovados da plataforma. Tokens consolidados e limites numéricos dos schemas são propostas de implementação; ajustar por decisão registrada.
