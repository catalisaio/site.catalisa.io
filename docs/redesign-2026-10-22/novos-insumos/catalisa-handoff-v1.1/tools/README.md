# Ferramentas de handoff

`python3 tools/validate_reference.py` verifica as 69 rotas, recursos locais, IDs, H1, rótulo Visão, sintaxe JS quando Node está disponível, fixture de conceito e checksums. A validação completa de JSON Schema usa `jsonschema` se já estiver instalado; o comando informa quando não há validador geral e executa checagens limitadas com `validate_contracts.py`, sem dependências. Não instala dependências nem chama serviços externos.

A auditoria mobile anterior está em `evidence/mobile-layout-previous.json`, com limitações documentadas. Para reproduzir layout no repo de produção, usar a ferramenta de browser test adotada pelo time e os estados da matriz de QA; não basta validar o DOM inicial.

O instalador copia em diretórios novos e recusa colisões. Faça um commit/backup normal do repo antes de importar. Ele não executa comandos do projeto, não instala pacotes, não muda AGENTS/CLAUDE, não cria segredos e não publica nada. Se a cópia for interrompida, inspecione os dois diretórios antes de uma nova execução.
