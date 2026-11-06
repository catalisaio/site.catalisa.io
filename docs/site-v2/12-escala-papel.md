# 12 — A escala de papel: como estender o styleguide sem sair dele

> Pergunta do dono, 27/08: o styleguide manda usar só as cores dele, mas também manda
> **estender**. O estilo tinta-e-papel quer um neutro quente, e o styleguide só tem neutro
> frio. *"Pode sugerir algo?"*

---

## 1. O conflito, dito com precisão

Os neutros do styleguide têm **viés violeta**, derivados da marca:
`#FBFAFB · #F6F4F8 · #EDEAF1 · #E9E6ED · #171320`. Isso é coerente e é o que faz o painel
parecer de uma casa só.

Papel, por definição, é **quente**. Um site que quer parecer papel com neutro violeta parece
tela, não papel — o tratamento de imagem carrega o estilo sozinho e a página não acompanha.

A saída errada é inventar uma escala nova (foi o que aconteceu por conta própria num dos
artefatos: onze cores fora da paleta, entre elas um creme `#F2EFE8` que é o clichê que a
própria lista anti-slop da casa proíbe). Cor inventada não é extensão — é deriva.

---

## 2. A proposta: o papel **nasce do âmbar da marca**

Em vez de escolher um creme, **derive** cada neutro de papel misturando o neutro do
styleguide com um traço de `--secondary` (`#FDC234`). Toda cor passa a ter procedência: é
token da casa + token da casa.

| token do styleguide | vira | receita |
|---|---|---|
| `--bg` `#FBFAFB` | **`#FBF7F2`** | 95% `--bg` + 5% `--secondary` |
| `--surface` `#FFFFFF` | **`#FFFDF9`** | 97% + 3% |
| `--surface-2` `#F6F4F8` | **`#F6F1EC`** | 94% + 6% |
| `--surface-3` `#EDEAF1` | **`#EEE7E3`** | 92% + 8% |
| `--border` `#E9E6ED` | **`#EAE3E0`** | 93% + 7% |

**A tinta não se aquece.** `--text` `#171320`, `--text-2` `#5A5468` e `--text-3` `#8E8899`
ficam como estão — é assim que impresso funciona: **papel quente, tinta fria**. Aquecer a
tinta junto produz um marrom que lê como envelhecido, não como impresso.

Em CSS isso pode ser literalmente a receita, o que torna a procedência auditável:

```css
--papel-0: color-mix(in srgb, var(--bg) 95%, var(--secondary));
--papel-1: color-mix(in srgb, var(--surface-2) 94%, var(--secondary));
--papel-2: color-mix(in srgb, var(--surface-3) 92%, var(--secondary));
```

### Contraste, medido sobre `#FBF7F2`

| | |
|---|---|
| `--text` | **acima de 15:1** |
| `--text-2` `#5A5468` | 6,2:1 |
| `--brand` `#734B9C` | **6,1:1** — passa para texto |
| `--brand-600` `#5E3D80` | 8,0:1 |
| `--text-3` `#8E8899` | 3,1:1 — **só para rótulo grande**, nunca corpo |

---

## 3. A honestidade sobre o clichê

Medindo o viés quente (R menos B): a proposta dá **+9**; o creme que o agente inventou,
**+10**; o clichê de IA `#F4F1EA`, **+10**. **Warmth sozinha não distingue.**

O que distingue é a **combinação**, e é isso que a lista anti-slop realmente proíbe: creme
quente **+ serifada display + acento terracota**. A proposta tem creme quente + **acento roxo
da marca** + **ponto âmbar**, sem terracota nenhuma, e num papel bem mais claro (`#FBF7F2`
contra `#F2EFE8`). São territórios diferentes — mas a distância é pequena o bastante para
exigir cuidado no acento: **se um dia entrar laranja em área chapada, cai no clichê.**
`--accent` `#FE8342` fica restrito a fio e a estado, nunca a fundo.

---

## 4. As três opções, e a recomendação

| | o que é | quando escolher |
|---|---|---|
| **A · Escala de papel derivada** *(recomendada)* | os cinco neutros acima, nomeados no styleguide como escala de **marketing** | se o tinta-e-papel for a direção. Dá o calor sem inventar cor, e a receita é auditável |
| **B · Manter o neutro frio** | nada muda na paleta; o "papel" vem só do tratamento de imagem e do grão | se a prioridade for unidade absoluta com o painel — é o que o artefato `20f8f93f` já faz |
| **C · Dois territórios** | painel fica frio, site fica quente, documentados como escalas separadas | se marketing e produto forem evoluir em ritmos diferentes. É o mais realista a médio prazo, e o mais fácil de divergir sem ninguém notar |

**Recomendo A**, com uma condição de governança que é o que separa extensão de deriva:

> A escala entra no styleguide **como token nomeado, com a receita ao lado** — nunca como
> hexadecimal solto numa página. E a catraca de build que já existe (todo `var(--x)` tem um
> `--x:` definido) passa a valer também para o site: **hexadecimal literal no CSS reprova.**

Assim, quando alguém perguntar de onde veio `#FBF7F2`, a resposta é uma linha de código, não
uma lembrança.
