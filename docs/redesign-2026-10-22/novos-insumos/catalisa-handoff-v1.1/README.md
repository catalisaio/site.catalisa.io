# Catalisa | Handoff final do site v1.1

Entrega de 22/10/2026 para continuar a implementação no repositório de produção, sem depender desta conversa. O pacote contém referência executável, conteúdo, direção de marca, contratos propostos e plano de entrega.

## Comece aqui
1. Leia `docs/00-LEIA-PRIMEIRO.md` e `PROMPT-PARA-O-CODEX.md`.
2. Abra `Catalisa-Handoff-Estrategia-Design-Producao.pdf` para a visão consolidada e visual.
3. Use `docs/01-estrategia.md`, `02-linguagem.md` e `03-direcao-visual.md` como critérios de fidelidade.
4. Consulte `docs/04-paginas-e-componentes.md`, `inventario-paginas.csv` e `conteudo-atual.json` para migrar cada página.
5. Implemente as integrações a partir de `docs/05-producao.md`, `contracts/` e `docs/06-backlog-e-aceite.md`.
6. Use `docs/07-inspiracoes-e-decisoes.md` para incorporar novas referências sem apagar decisões aprovadas.
7. Valide com `tools/validate_reference.py` e com a matriz de aceite. O resultado atual de QA está em `evidence/`.

## Estrutura
- `reference/site/`: cópia de código e assets da versão aprovada; 69 páginas estáticas, gerador e documentos técnicos existentes. Não depende do serviço de hospedagem desta conversa.
- `design/`: tokens semânticos propostos, CSS de referência e atlas vetorial para revisão de estilo.
- `contracts/`: contrato HTTP proposto, schema de conceito, eventos e payloads fictícios.
- `docs/`: decisões, estratégia, copy, produção e aceite.
- `evidence/`: auditoria mobile anterior e rastreabilidade da entrega.
- `install-handoff.sh`: importa documentação e referência em pastas novas de um repo existente. Não sobrescreve AGENTS.md, CLAUDE.md, código ou configurações existentes.

## Rodar a referência
Requer Node.js para gerar e Python 3 para servir localmente, sem instalar pacotes:

```sh
cd reference/site
node build.mjs
python3 -m http.server 8080 --directory dist
```

Abra http://localhost:8080/. Este servidor é apenas para desenvolvimento. Para produção, use o deploy já adotado pelo repo e as configurações documentadas no handoff. Não publique `.openai/hosting.json` de outro ambiente; esse arquivo não faz parte da referência independente.

## Estado desta entrega
Baseline de referência: commit `fb78ff5d7229e1ccac83646d6c2bbafbde9a19b6`, versão salva 26. A linha visual é v1.1; a versão v1 anterior está registrada em `evidence/v1.json`. A navegação usa **Visão**, rota `/visao/`.

O site funciona como referência navegável e demonstrativa. IA, persistência de conversas, cadastro de leads, atendimento humano e canais de envio ainda precisam de backend. Este pacote documenta essas lacunas, mas não declara que elas já foram implementadas.
