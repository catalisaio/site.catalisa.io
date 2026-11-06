# Backlog e critérios de aceite

Não há estimativa de prazo neste documento: esforço depende do repo e dos serviços existentes. A ordem abaixo reduz o risco de descobrir contratos incompatíveis só no fim.

| ID | Prioridade | Trabalho | Dependência | Evidência de conclusão |
|---|---|---|---|---|
| H01 | P0 | Inventariar repo, instruções, stack e deploy | Acesso ao repo | Mapa de diferenças e plano de adaptação revisado |
| H02 | P0 | Importar referência e congelar baseline | H01 | Build local das 69 rotas e assets sem falta |
| H03 | P0 | Migrar navegação, tokens e famílias de páginas | H02 | Comparação visual desktop/mobile e rotas preservadas |
| H04 | P0 | Mapear APIs reais e tenant | Ambiente de integração | Contratos exercitados e IDs de correlação documentados |
| H05 | P0 | Persistir sessão, mensagens e revisão do briefing | H04 | Reload recupera o estado autorizado sem duplicação |
| H06 | P0 | Criar contato provisório e lead após nome | H05 | Retry idempotente; três respostas e nome ligados ao histórico |
| H07 | P0 | Gerar conceito estruturado com IA | H04,H06 | Schema validado; limite de custo; erro e retry reais |
| H08 | P0 | Ligar renderer e refinamento versionado | H07 | Telas, peças e jornada coerentes; mudanças rastreadas |
| H09 | P0 | Integrar atendimento e canal escolhido | H04,H06 | Aceite, entrega, falha e atribuição distinguíveis |
| H10 | P0 | Endurecer backend público | H05-H09 | Quotas, autorização, origem, validação e logs sem segredos |
| H11 | P0 | Revisar conteúdo, origem e maturidade | Responsáveis de produto | Catálogo, prints, exemplos e alegações aprovados |
| H12 | P0 | Corrigir contraste e validar acessibilidade | H03 | Leitura, teclado, foco, zoom e movimento reduzido verificados |
| H13 | P0 | Preparar SEO, privacidade, domínio e redirects | H11 + responsável | Checklist de lançamento aprovado e plano de retorno |
| H14 | P1 | Instrumentar funil e taxonomia de mercado | H05 + política definida | Eventos sem conversa bruta e agregados conferidos |
| H15 | P1 | Otimizar mídia e scripts por rota | H03 | Medições em mobile real e regressões tratadas |
| H16 | P1 | Atualização editorial de catálogo e capturas | H11 | Responsável, data de revisão e fonte por item |

## Testes críticos de integração
1. Enviar as três respostas e o nome. Verificar uma sessão, uma identidade provisória e um lead vinculados; repetir a mesma requisição e confirmar ausência de duplicação.
2. Interromper antes e depois do nome. Retomar somente no contexto autorizado, sem recuperar histórico de outra pessoa.
3. Forçar falha de cadastro. Respostas permanecem; geração não declara sucesso e a nova tentativa não duplica registros.
4. Forçar timeout de IA. O trabalho muda para falha/expiração; briefing permanece e o usuário consegue tentar de novo.
5. Injetar saída fora do schema, slug inexistente ou HTML/script no conteúdo. Backend rejeita ou trata como texto; nada executável aparece no DOM.
6. Pedir revisão humana. Tela e jornada mostram pendência até o evento real de aprovação/atribuição pertinente.
7. Alterar briefing depois da prévia. Histórico preservado; nova versão ligada ao briefing atual e resultado anterior marcado como superado.
8. Pedir WhatsApp sem canal configurado. Não apresentar sucesso falso. Oferecer alternativa operacional disponível.
9. Duplicar ou reordenar webhook. Uma única transição válida, com evidência e correlação.
10. Transferir para atendimento. A pessoa recebe respostas, versões, conceito e ajustes no mesmo histórico. “Assumiu” só após evento real.

## Matriz de QA por família
| Área | Conferência obrigatória |
|---|---|
| Todas as 69 rotas | 200/404 correto, um H1, título, canônico, links e assets, sem overflow relevante |
| Menu | Abrir, rolar, fechar, Escape, teclado, retorno de foco e CTA Lab |
| Catálogo | Busca, categoria, maturidade, limpar, vazio e documentação no detalhe |
| Visão/Studio/Workflows/Agentes/Governança | Todos os estados alteram texto e arte de modo coerente; redução de movimento |
| Banking/Credit | Canais, etapas, pendências, modalidades, prints, zoom e vídeo com controles |
| Contato | Fluxo completo com erro, retorno, edição, reload e integração real |
| Lab | Briefing livre, processamento, sucesso, falha e adaptação mobile |
| Press-kit | Todos os formatos abrem; dimensões, transparência e contraste corretos |
| Perspectivas | Texto, fontes, datas, filtros, links e leitura mobile |

## Gate de lançamento
- Nenhum P0 aberto sem exceção registrada pelo responsável.
- Sem placeholders, links quebrados, segredo no bundle ou falsa confirmação de envio.
- Baseline visual aprovado em 320, 390, 768 e desktop; testar também Safari/iOS e Chrome/Android físicos.
- Nenhuma página individualizada ou conversa indexável por acidente.
- Recuperação de sessão e acesso a histórico com isolamento demonstrado.
- Logs, alertas, fila e canal de suporte monitorados.
- Rollback exercitado em staging, com responsável identificado.

O relatório de 207 medições incluído é evidência anterior de layout, não substitui esta bateria de produção. Os fixtures de contrato são dados fictícios para o backend e não comprovam integração.
