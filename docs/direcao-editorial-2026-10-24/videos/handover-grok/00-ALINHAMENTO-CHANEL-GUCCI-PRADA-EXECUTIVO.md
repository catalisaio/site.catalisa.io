# Alinhamento Editorial Executivo · Temporada "A casa" & Filme Master (1m50s)
**Direção de Arte: Chanel / Gucci / Prada (Editorial B2B de Luxo Silencioso + Bauhaus Quente)**
**Data:** 24/10/2026

---

## 1. Direção Estética: Chanel / Gucci / Prada Executivo B2B

Todo o pacote audiovisual da Catalisa — tanto o **Filme Master Comercial de 1m50s (`jobs/a-casa-00-filme-master`)** quanto os **31 mini-clipes da temporada (`a-casa-01` a `a-casa-31`)** — segue rigorosamente a estética de campanha editorial de moda/arquitetura associada à sobriedade executiva B2B:

1. **Paleta Bauhaus Quente (Zero Dark-Fintech):**
   - Papel quente `#F6F3EE` (base principal) e areia `#EEE8DF` (blocos arquitetônicos).
   - Ameixa Catalisa `#734B9C` e ameixa profundo `#35213F` (blocos de contraste editorial).
   - Laranja Bauhaus `#F18A43` (linha condutora horizontal e acento cirúrgico).
   - Grafite quente `#1A1D23` (tipografia principal).
2. **Tipografia & Hierarquia Silenciosa:**
   - **Títulos (`Inter Light 300`, tracking `-0.035em`):** Frases curtas, diretas, sem exclamações, sem promessas milagrosas.
   - **Kicker Indexado (`JetBrains Mono` Uppercase):** Funciona como código de catálogo editorial e índice de referência cruzada entre o Filme Master e os episódios da temporada.
   - **Subtítulo Técnico + Aviso de Demonstração:** Quando houver interface de produto (`screen` ou `phone`), incluir sempre o aviso discreto `"Interface de referência · ambiente demonstrativo"`.
3. **Elenco Canônico & Enquadramento:**
   - Usar exclusivamente os retratos canônicos aprovados: `c1-executivo.jpg`, `c2-piscina.jpg`, `c3-circulo.jpg`, `c4-iate.jpg`, `c5-kite.jpg`, `c6-agro.jpg`, `c7b-criadora.jpg` (**nunca** `c7-criadora.jpg`), `c8-desktop.jpg` (com `focus: [0.32, 0.38]` e `zoom: 1.28`) e `c9-assinatura.jpg`, além do vídeo `gen/gen4-5.mp4`.
   - Zero texto sobreposto no rosto dos personagens.
   - Zero barras pretas (`pillarbox`/`letterbox`) nas telas de produto (`screens/`).
4. **Rigor Regulatório e Terminológico:**
   - Proibido citar `FIDC`, `securitizadora`, `debêntures`, `CRI/CRA` como promessa regulatória própria, `split de liquidação`, nomes de bureaus de terceiros ou números inflados (`90+`, `650+`).
   - Quando falar de composição, usar a tese **80/20** (*"80% da fundação pronta · 20% configurável sem código"*).

---

## 2. Os 5 Lastros Reais da Arquitetura Catalisa (Capítulo 05 · Episódios 23–30)

Por determinação direta do fundador Klederson Bueno (`t22u`), o **Capítulo 05 (Os Lastros)** do Filme Master e os episódios correspondentes da temporada (`a-casa-23` a `a-casa-30`) contemplam obrigatoriamente os **5 lastros reais** operados sobre a mesma arquitetura de crédito, dossiê, garantias e CCB da **Catalisa Credit Platform (CCP)** integrada ao **Catalisa Banking Platform (CBP)**:

1. **Imobiliário (`a-casa-23` / `m08`):**
   - Alienação fiduciária de imóveis, *home equity*, garantias imobiliárias, matrícula, laudo de avaliação e dossiê completo vinculado à operação.
2. **Consórcio (`a-casa-24` / `m08`):**
   - Operação com cotas contempladas e não contempladas, cessão/alienação de cotas, anuência e governança de grupos na mesma esteira.
3. **Auto / Veículos (`a-casa-25` / `m08`):**
   - CCB automotiva, financiamento de veículos leves/pesados e frotas, vistoria, gravame e formalização digital com reserva de saldo.
4. **Agro · Garantia Viva (`a-casa-27` e `a-casa-28` / `m09`):**
   - Crédito rural estruturado com **CPR Financeira + CCB**, avaliação técnica de lote e **monitoramento diário de rebanho** (*"A garantia continua viva"*).
5. **Saúde · Recebíveis Médicos (`a-casa-29` e `a-casa-30` / `m09`):**
   - Antecipação de plantões e faturamento médico/hospitalar **confirmada na origem**, com trava de domicílio e liquidação direta na conta.

*(Nota: o episódio `a-casa-26` consolida a **Governança Multi-Lastro — Imobiliário, Consórcio e Auto no CCP**, conectando os 3 primeiros lastros antes da entrada em Agro e Saúde nos episódios 27–30).*

---

## 3. Sistema de Edição Modular & Referência Cruzada Visual (`jobs/a-casa-00-filme-master`)

Por direção criativa solicitada por Klederson Bueno (`t23u`), o **Filme Master de 1m50s (110.0s)** foi arquitetado para funcionar simultaneamente como **peça contínua de 110 segundos** e como **matriz modular de 6 Capítulos e 10 Submódulos de 11.0s** com referência cruzada direta para os 31 mini-clipes da temporada:

### 3.1. Ponto de Corte Limpo (Cut-Point Bauhaus em `.0s` + Linha `#F18A43` em `y: 54%`)
- No Filme Master (`jobs/a-casa-00-filme-master/job.json` e `storyboard.json`), configuramos `"transition": 0` e `"transitionStyle": "cut"`.
- Cada um dos **10 submódulos** tem duração exata de **`11.0s` (330 frames a 30 fps)**, iniciando e terminando em múltiplos exatos de `11.0s` (`0.0s`, `11.0s`, `22.0s`, `33.0s`, `44.0s`, `55.0s`, `66.0s`, `77.0s`, `88.0s`, `99.0s`, `110.0s`).
- Em todos os módulos, a linha condutora laranja Bauhaus (`#F18A43`) atravessa o quadro exatamente na coordenada vertical **`y: 54%`**:
  - **16:9 (`1600x900`):** `"box": [0, 486, 1600, 5]`
  - **9:16 (`1080x1920`):** `"box": [0, 1036, 1080, 6]`
- Isso cria um **Match-Cut geométrico perfeito**: qualquer capítulo ou submódulo pode ser cortado como clipe independente (via `jobs/a-casa-00-filme-master/slice-chapters.sh`) ou emendado com um mini-clipe da temporada sem salto visual e sem vazamento de transição.

### 3.2. Kicker Indexado (`JetBrains Mono`) & Mapa de Referência Cruzada (`crossref-map.json`)
Cada cena do Filme Master exibe no topo o código do Capítulo e o intervalo de Episódios correspondentes da temporada, e compartilha o **mesmo personagem canônico + mesma tela de produto** do quadro de abertura dos respectivos mini-clipes:

| Módulo Master | Janela (`s`) | Kicker Indexado (`JetBrains Mono`) | Personagens Canônicos | Telas de Produto | Episódios da Temporada |
| :--- | :---: | :--- | :--- | :--- | :--- |
| **`m01-manifesto`** | `00.0s – 11.0s` | `CAP. 01 · MANIFESTO // REF. EP 01` | `gen4-5.mp4`, `c5-kite` | `studio-canvas.png` | `a-casa-01` |
| **`m02-studio-8020`** | `11.0s – 22.0s` | `CAP. 02 · STUDIO & POLÍTICA 80/20 // REF. EPS 02–05` | `c7b-criadora`, `c1-executivo` | `studio-canvas.png`, `workflows-canvas.jpg` | `a-casa-02` a `a-casa-05` |
| **`m03-onboarding-pj-mesa`** | `22.0s – 33.0s` | `CAP. 02 · ONBOARDING PJ & ALÇADAS // REF. EPS 06–08` | `c3-circulo`, `c8-desktop` | `workflows-detail.png`, `mesa-fila.jpg` | `a-casa-06` a `a-casa-08` |
| **`m04-cbp-marca-pix`** | `33.0s – 44.0s` | `CAP. 03 · BANKING CBP & PIX // REF. EPS 09–10` | `c3-circulo`, `c2-piscina` | `04-home.png`, `09-pix-comprovante.png`, `app-inicio.jpg` | `a-casa-09` a `a-casa-10` |
| **`m05-cbp-tesouraria-credito`** | `44.0s – 55.0s` | `CAP. 03 · TESOURARIA & CONTA-CRÉDITO // REF. EPS 11–13` | `c8-desktop`, `c3-circulo` | `bank-desktop.jpg`, `bank-live-holds.jpg` | `a-casa-11` a `a-casa-13` |
| **`m06-ccp-originacao-politica`** | `55.0s – 66.0s` | `CAP. 04 · ORIGINAÇÃO, DOSSIÊ & DECISÃO // REF. EPS 14–17` | `c1-executivo`, `c3-circulo` | `credit-queue.png`, `workflows-detail.png` | `a-casa-14` a `a-casa-17` |
| **`m07-ccp-ccb-carteira`** | `66.0s – 77.0s` | `CAP. 04 · EMISSÃO CCB, RESERVA & CARTEIRA // REF. EPS 18–22` | `c1-executivo`, `c4-iate`, `c9-assinatura` | `credit-portfolio.png`, `bank-statement.jpg` | `a-casa-18` a `a-casa-22` |
| **`m08-lastros-imob-consorcio-auto`** | `77.0s – 88.0s` | `CAP. 05 · LASTROS: IMOBILIÁRIO · CONSÓRCIO · AUTO // REF. EPS 23–26` | `c1-executivo`, `c8-desktop`, `c4-iate` | `credit-portfolio.png`, `desktop-inicio.jpg` | `a-casa-23` a `a-casa-26` |
| **`m09-lastros-agro-saude`** | `88.0s – 99.0s` | `CAP. 05 · LASTROS: AGRO GARANTIA VIVA & SAÚDE // REF. EPS 23–30` | `c6-agro`, `c3-circulo` | `credit-queue.png`, `bank-live-holds.jpg` | `a-casa-27` a `a-casa-30` |
| **`m10-fecho-imagine`** | `99.0s – 110.0s` | `CAP. 06 · IMAGINE SEU PRODUTO // REF. EP 31` | `c7b-criadora`, `c3-circulo`, `c1-executivo` | `studio-canvas.png` | `a-casa-31` |

### 3.3. Regra para os Mini-Clipes da Temporada (`a-casa-02` a `a-casa-31`)
Ao gerar ou revisar qualquer episódio `a-casa-XX`:
1. Consulte `jobs/a-casa-00-filme-master/crossref-map.json` para verificar o `chapterId`, o `kickerCode` e o `sharedOpeningAsset` daquele episódio.
2. No `kicker` da primeira cena do episódio, inclua a referência cruzada reversa para o Filme Master (ex.: `A CASA · EP 02 // REF. MASTER CAP. 02 · 00:11`).
3. Mantenha a linha Bauhaus `#F18A43` na coordenada `y: 486` (`16:9`) / `y: 1036` (`9:16`) na cena de abertura ou fechamento para permitir corte cruzado (*match-cut*) direto com o Filme Master.
