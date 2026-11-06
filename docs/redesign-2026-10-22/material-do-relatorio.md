# Material do relatório transferido para o site

O relatório foi copiado integralmente para [reports/2026-10-20-retrospectiva-24-meses](reports/2026-10-20-retrospectiva-24-meses/). Ele conserva a narrativa, o conteúdo técnico e o padrão visual que começaram a convergir no trabalho de outubro. Este repositório passa a ser o local de continuidade desse material para o redesign.

O corte técnico permanece em 20/10/2026, com a edição visual e de diligência produzida em 21/10. A cópia do projeto anterior fica como registro histórico. Os originais do relatório, PDFs e dados não foram apagados da origem.

## Leituras e exemplos de composição

| Material | Para que usar no redesign |
|---|---|
| [Infográfico](reports/2026-10-20-retrospectiva-24-meses/infografico.html) · [PDF](reports/2026-10-20-retrospectiva-24-meses/infografico.pdf) | Abertura ruído → estrutura, hierarquia, geometria, três bases e variedade de seções |
| [Índice do dossiê](reports/2026-10-20-retrospectiva-24-meses/dossie.html) | Caminhos de aprofundamento para públicos e perguntas diferentes |
| [Cadeia de valor](reports/2026-10-20-retrospectiva-24-meses/cadeia-de-valor.html) · [PDF](reports/2026-10-20-retrospectiva-24-meses/cadeia-de-valor.pdf) | Sequência de entradas, transformação, resultado e controle; modo de apresentação |
| [Dashboard](reports/2026-10-20-retrospectiva-24-meses/dashboard.html) · [PDF](reports/2026-10-20-retrospectiva-24-meses/dashboard.pdf) | Gráficos com tabelas, contexto, filtros e fontes |
| [Timeline](reports/2026-10-20-retrospectiva-24-meses/timeline.html) | Navegação por marcos, exploração progressiva e relação entre entregas |
| [Relatório completo](reports/2026-10-20-retrospectiva-24-meses/relatorio-completo.html) · [PDF](reports/2026-10-20-retrospectiva-24-meses/relatorio-completo.pdf) | Biblioteca das 110 frentes de valor e suas fontes |
| [Developy](reports/2026-10-20-retrospectiva-24-meses/developy.html) · [PDF](reports/2026-10-20-retrospectiva-24-meses/developy.pdf) | Explicação da infraestrutura ligada a problemas concretos dos produtos |
| [Investidores](reports/2026-10-20-retrospectiva-24-meses/investidores.html) · [PDF](reports/2026-10-20-retrospectiva-24-meses/investidores.pdf) | Ativos, capacidades, distribuição e distinção entre potencial e tração |
| [Entrevistas](reports/2026-10-20-retrospectiva-24-meses/entrevistas.html) · [PDF](reports/2026-10-20-retrospectiva-24-meses/entrevistas.pdf) | Casos narrativos que conectam problema, decisão de engenharia e resultado |
| [Sumário da diligência](reports/2026-10-20-retrospectiva-24-meses/diligencia.html) | Conclusões, pontos fortes, fragilidades, riscos e ações propostas |
| [Diligência técnica](reports/2026-10-20-retrospectiva-24-meses/diligencia-tecnica.html) | Matriz técnica e perguntas por área |
| [Diligência corporativa](reports/2026-10-20-retrospectiva-24-meses/diligencia-corporativa.html) | Dependências documentais para direitos, contratos, pessoas e finanças |
| [Evidências](reports/2026-10-20-retrospectiva-24-meses/diligencia-evidencias.html) | Proveniência, relações entre fontes, riscos e pedidos |
| [Homologação](reports/2026-10-20-retrospectiva-24-meses/homologacao.html) | Limites das afirmações sobre prontidão e critérios de avaliação por escopo |

Os PDFs das leituras de diligência e homologação também estão na pasta. O [LEIA-ME histórico](reports/2026-10-20-retrospectiva-24-meses/LEIA-ME.txt) descreve os recursos e o método da edição original.

## Padrão visual reutilizável

| Arquivos | Responsabilidade |
|---|---|
| `design/entregas-bauhaus/identidade-transitoria.json` | Registro da aprovação, correções, princípios e funções das cores |
| `design/entregas-bauhaus/identidade-transitoria.css` | Tokens da identidade e fontes locais |
| `design/entregas-bauhaus/logo-full-color.svg` | Assinatura oficial com letras roxas e ponto amarelo |
| `reports/.../report-identity.css` e `report-identity.mjs` | Adaptação da identidade para as diversas leituras |
| `infografico.css` e `render-infografico.mjs` | Composição da abertura, arquitetura e faixas editoriais |
| `dossier.css`, `dashboard.css`, `timeline.css`, `value-chain.css` | Variações para leitura, dados, tempo e percurso operacional |
| `*-client.js` | Interações, filtros, modos de apresentação e exportação |
| `preview-*.png` | Capturas históricas para comparar desktop, mobile e impressão |
| `infografico-inter-regular.ttf` e `infografico-inter-bold.ttf` | Fontes locais copiadas também para o estudo visual |

Esses arquivos são exemplos e matéria-prima. A integração no React/Chakra do site deverá selecionar tokens, composições e comportamentos úteis, em vez de importar todas as folhas globais do relatório sem avaliar colisões.

## Dados e evidências

`dados.json`, `narrativa.json`, `dashboard-data.json`, `prs.csv`, `commits.csv`, `documentos.csv` e `modulos.csv` conservam o inventário e suas sínteses. `fontes-codigo.json`, `infra-evidencias.json`, `cobertura.json` e os manifestos permitem rastrear as afirmações. Os JSONs e CSVs de diligência preservam questões, riscos e pedidos documentais.

Os números citados na apresentação são recortes: 110 frentes editoriais, 159 diretórios, 222 tipos de ação e 2.840 PRs integrados à principal. Não equivalem a 110 produtos, 159 serviços comercializados, 222 integrações ativas ou uma medida direta de produtividade. Arquivos de teste medem inventário. Resultados de engenharia são ensaios históricos com cenários próprios.

Para usar uma evidência na comunicação pública, selecionar sua formulação, recorte e contexto no conteúdo de destino. O material contém acervo interno e a classificação da entrega original; estar sob `docs` não o transforma em conteúdo público de `src` ou `public`.

## Coleta e renderização são operações diferentes

Os scripts `gerar.mjs` e `gerar-infografico.mjs` regeneram HTML a partir dos dados locais congelados. Os módulos de renderização, estilos, scripts de cliente e fontes foram copiados junto; o caminho relativo até `design/entregas-bauhaus` continua funcionando dentro deste pacote.

`coletar.py` e `estruturar.py` preservam o processo de coleta e análise histórica. Recolher exige os repositórios de produto, BBs e Developy e o acesso às fontes. `estruturar.py` agora escreve nesta própria pasta e aceita `CATALISA_CORPUS_DIR` para indicar o corpus, em vez de gravar no repositório anterior. Não é necessário executar a coleta para consultar ou redesenhar o site.

Os verificadores `verificar*.mjs` são os scripts históricos da apresentação. Precisam de Playwright, Chrome e ferramentas como `pdfinfo`, `pdffonts` e `pdftotext`, conforme o arquivo. Seus JSONs de resultado são registros da execução anterior; a verificação desta transferência está separada em [verificacao-transferencia.json](verificacao-transferencia.json).

O `empacotar.py`, o ZIP e o manifesto do relatório preservam a entrega histórica. O manifesto do pacote de redesign registra os arquivos depois das adaptações de portabilidade, sem alterar silenciosamente o significado dos hashes antigos.

## Hosting histórico

A subpasta `hosting` foi copiada para preservar o material completo. Ela descreve a publicação anterior de `entregas.interno.catalisa.app`, com dependências de configuração local e autenticação próprias. Não integra o deploy do site institucional e não foi executada nesta transferência.

## O que esta transferência validou

Integridade das cópias, cobertura das 72 referências, disponibilidade dos originais e das fontes locais, vínculos de documentação e recursos locais das apresentações e regeneração HTML a partir do corpus congelado. O resultado detalhado fica em `verificacao-transferencia.json`.

O comportamento de aplicações de produto, os ensaios históricos e os ambientes de produção não foram reexecutados pela mudança de pasta. O relatório conserva os limites documentados de sua edição.
