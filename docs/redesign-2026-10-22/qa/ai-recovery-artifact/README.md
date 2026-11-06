# Artefato de recuperação de IA — 26/10/2026

Release preparada: `20261026-ai-recovery`. Diretório isolado: `/tmp/catalisa-recovery-candidate`. A r2 foi preservada. **Nenhuma publicação em produção foi feita nesta etapa.**

A única mudança de conteúdo solicitada para esta compilação foi o texto PT/EN da política de privacidade: a geração utiliza o provedor configurado para o serviço, entre os fornecedores identificados. O HTML final preserva a identificação de Anthropic e OpenAI. Sem alterações visuais adicionais.

O [relatório de validação](validation.json) registra build completo com TypeScript, 257 snapshots, auditoria SEO de 256 rotas sem falhas/avisos, sitemap de 255 URLs e 144 originais de marca conferidos. O [browser](browser-release.json) passou 41 verificações com JavaScript e sem JavaScript, sem exceções. O [grafo nativo](native-bundle.json) tem 7 chunks iniciais e 29 na união estática das 17 páginas; o legado permanece separado. A [verificação de privacidade do artefato](private-artifact.json) inspecionou 917 arquivos sem encontrar arquivos privados ou valores de segredos configurados.

A [integridade](artifact-integrity.json) confirmou 258 HTMLs usando o mesmo módulo atual e as duas frases de privacidade. Entrada: `/assets/index-D2_-4OX5.js`, SHA256 `f8683d9ee4e6454467b43213982f951f28a733077504c9b45341a6a33694d57b`. Home: SHA256 `77bf263b9da94b47a6e2687e1593fde9c9b8dd54521ee0acf76b868f9db468a0`.

Esta auditoria usa uma API anônima local somente de leitura; não chama IA nem prova a recuperação do provedor. O coordenador fará separadamente a instalação em staging e os testes reais do Contato na sessão que falhou e do Lab. As evidências anteriores da r2 continuam históricas e não substituem esses testes de recuperação.

Continuam separados o aceite visual/editorial/política do responsável e a autorização explícita para produção. A coleta de mercado permanece desligada. Não houve deploy do painel nem alteração de building blocks. Não houve nova medição de performance: o limite histórico da Home r2, LCP 3,032s acima de 2,5s, permanece sem alegação de desempenho 100%.
