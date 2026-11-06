# Inventário de mídia — site novo

[Galeria de revisão](review.html) · [Inventário completo](inventory.json). No preview local, abrir **http://localhost:5175/docs/redesign-2026-10-22/qa/media-refresh/review.html**. O HTML também funciona como arquivo local e usa os originais do repositório; não foram geradas novas imagens.

Escopo: AST TypeScript/JSX, URLs CSS e JSONs de capturas/press kit em `src/redesign`; dimensões lidas com Sharp e apenas metadados MP4 com ffprobe. Sem Chrome, build, encoding de vídeo, geração por IA ou alteração de mídias/componentes. 174 arquivos inventariados; 85 slots JSX e 103 SVGs inline registrados. Arquivos inexistentes: 0.

## Prioridades

P0: hero da Home, `financial-city.webp`, atualmente 1536×1024. Arte nova deve respeitar espaço da composição, leitura mobile e identidade aprovada, sem interface fictícia apresentada como produto. O coordenador está responsável pela geração da arte nova.

P1: demais artes da Home e a sequência “film”; depois os dois reels de Banking/Credit e as imagens de protótipo/referência no topo dos produtos. P2: rever atualidade e qualidade das capturas secundárias, sempre com origem e dados de demonstração. Logos e identidade são protegidos e ficam fora da substituição.

| Prioridade | Arquivo | Dimensões existentes | Páginas |
| --- | --- | --- | --- |
| P1 | `/redesign/architecture.webp` | 1254×1254 | /arquitetura, /composicoes, /, /design-system |
| P1 | `/redesign/banking.webp` | 1672×941 | /ecossistema, / |
| P0 | `/redesign/financial-city.webp` | 1536×1024 | /, /design-system |
| P1 | `/redesign/hero.webp` | 1536×1024 | /ecossistema/med, /ecossistema/juridico, /ecossistema/recrutamento, /ecossistema/biometrics, /ecossistema/decision, shared/new-site, / |
| P1 | `/redesign/media/banking-reel.mp4` | 1280×720 / 12s | /ecossistema/banking |
| P1 | `/redesign/media/credit-reel.mp4` | 1280×720 / 12s | /ecossistema/credit |
| P1 | `/redesign/studio.webp` | 1891×831 | / |

## Home, Studio, Banking e Credit

**Home:** seis elementos de imagem e cinco arquivos. A imagem `architecture.webp` aparece na arquitetura e no “film”. O “film” é uma composição de `hero.webp` e `architecture.webp` com CSS; não existe vídeo MP4 nessa página. As dimensões nativas e usos/classes/atributos estão no JSON. São artes ilustrativas, não capturas de produtos.

**Studio:** cinco screenshots: Builder 1920×1013, Canvas 1600×870, Painel 1600×900 e duas telas de preparação 1280×800. Builder/Canvas/Painel possuem URL de origem publicada; a data original não é informada. As duas preparações são de 20/10/2026, uma prévia local e um candidato local de design anterior à execução da IA. A origem é preservada com caminho/commit; não provaram sessão de IA executada nem publicação em produção. Studio não contém vídeo. Diagramas e demos React/SVG são exemplos de interface, não screenshots reais adicionais.

**Banking:** o hero usa `bank-desktop.jpg` 1440×900 (protótipo com dados de exemplo) e `bank-mobile.png` 1080×2316 (material de referência em aparelho, não captura ao vivo). Galeria inclui console/protótipos e duas capturas documentadas do console implementado em staging: `bank-live-accounts.jpg` 1200×1133 e `bank-live-holds.jpg` 1200×750. O reel é MP4 H.264 1280×720, 30fps, 12s, poster `bank-desktop.jpg`, copiado do handoff.

**Credit:** hero `credit-queue.png` 1440×900; material de referência com tenant demonstrativo. Política/simulação/operações/carteira são capturas de referência, não certificadas atuais por este levantamento. Acordos e obrigações têm proveniência de staging, 1440×980, guia de 25/09/2026. Portal 1568×737. Reel MP4 H.264 1280×720, 30fps, 12s, poster `credit-queue.png`, copiado do handoff. Ambos os reels são montagens de screenshots, não gravações demonstradas de ações reais do produto.

## Proveniência e limites

O JSON distingue `illustrative-art`, `documented-real-capture` (staging), `documented-local-capture`, `documented-reference-capture`, `prototype-reference`, `screenshot-reel` e `identity`. Preserva origem, caminhos, hashes dos metadados e SHA256 local, além da igualdade com o arquivo do ZIP quando disponível. Referência antiga não é classificada automaticamente como atual ou publicada.

Os locais extraídos estaticamente incluem abas e modais; não afirmam que todo arquivo seja baixado em cada visita. O arquivo completo de identidade é enumerado porque o press kit monta nomes dinamicamente. Os casos JSX dinâmicos permanecem explícitos no inventário e são cobertos pelos JSONs de captura/identidade. Não houve avaliação visual em browser ou confirmação independente do ambiente fonte. A página de revisão tem noindex e não altera o site publicado.
