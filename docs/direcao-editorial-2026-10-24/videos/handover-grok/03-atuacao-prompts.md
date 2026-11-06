# Atuação · usar o mesmo material

O objetivo é dar vida ao personagem dentro do filme editorial completo. Um clipe isolado da atriz se mexendo é um insumo, não um episódio entregue. Texto, captura real, trilha, transições e encerramento continuam na montagem.

## Duas formas de dar vida, com custos diferentes

**Local, sem geração nova:** entradas de papel, máscaras, recortes, deslocamentos de poucos pixels, sombra, revelação por arco/círculo e reutilização do clipe já produzido. Isso não faz uma pessoa de uma fotografia executar uma ação corporal nova. Chamar esse resultado de colagem animada; não de atuação nova gratuita.

**Atuação gerada:** a ferramenta recebe a fotografia canônica como quadro inicial e gera um clipe curto. Somente usar se a conta realmente permitir sem despesa/consumo adicional no contexto atual; o fato de mostrar créditos não basta. Os prompts abaixo são especificações de atuação, não autorização para gastar ou iniciar chamadas pagas. Se não houver geração gratuita disponível, entregar a montagem local e registrar a atuação opcional como pendência.

## Regras de tomada

Um gesto pequeno por clipe, idealmente 5 s, câmera fixa, uma tomada contínua. Atores já posicionados, pés plantados e mãos apoiadas quando possível. Respiração, olhar e sorriso discreto bastam. Evitar caminhar, virar o corpo, retirar óculos, tocar chapéu, manipular telefone, digitar, abrir notebook ou sincronizar fala: aumentam a chance de deformar mãos e identidade e podem exigir novos objetos.

Pedido em inglês, texto final em pt-BR. Usar prompt de movimento compatível com o que se vê na fotografia; não recontar uma pessoa nova. Acrescentar a preservação necessária ao modelo escolhido sem uma lista extensa de ações contraditórias. Não pedir legenda, logotipo, tela do produto ou documento no vídeo da pessoa. Essas camadas entram depois, com arquivos reais.

## Clipe já existente da criadora

`exemplos/a-casa-01-gen4-5-pro/gen/gen4-5.mp4`: Gen-4.5 pelo site Pro, 1280×720, aproximadamente 5,04 s, 24 fps, sem áudio. Custo histórico de 60 créditos. Foi incorporado na cena p1 de um filme de 30 s em dois formatos. O rosto e o ambiente mantiveram coerência na inspeção; houve algum deslocamento dos pés apesar do pedido de mantê-los parados. Não anunciar perfeição nem gerar refação automática. Reutilizar esse arquivo preserva créditos.

O hash do arquivo de imagem enviado está em `exemplos/a-casa-01-gen4-5-pro/review/generation.json`. O prompt da criadora abaixo é o prompt efetivamente usado. Os demais são instruções de atuação preparadas para esta passagem, ainda sem clipe gerado.


## A criadora

Quadro inicial: `assets/personagens/c7b-criadora.jpg`.

Respiração, olhar para o espectador, sorriso discreto e um pequeno gesto da mão que já está livre. A mão apoiada conserva o contato.

```text
Locked-off camera. The woman gently turns her head toward the viewer. The hand already resting on the purple circle stays in contact with it. Her extended free hand makes a small, open-palmed presenting gesture, then settles. She gives a warm, confident smile. Her feet stay planted. Natural breathing and subtle fabric movement. The geometric studio panels remain perfectly still. One continuous shot.
```


## O executivo

Quadro inicial: `assets/personagens/c1-executivo.jpg`.

Uma respiração e um pequeno movimento de olhar, encerrando com expressão segura. Manter mãos e corpo apoiados.

```text
Locked-off camera. The seated executive breathes naturally, shifts his gaze gently toward the viewer and settles into a calm, confident expression. His hands remain resting in their original positions. Preserve the exact chair, suit, painted backdrop and side lighting. One continuous restrained editorial shot.
```


## A diretora do círculo

Quadro inicial: `assets/personagens/c3-circulo.jpg`.

Pequena mudança do olhar e sorriso contido; mesma pose e eixo do corpo. Formas do estúdio imóveis.

```text
Locked-off camera. The director in the lilac suit makes a subtle eye movement toward the composition, then looks forward with a quiet, confident smile. Natural breathing and minimal fabric movement. Keep her exact pose, face, hairstyle and clothing. The purple circle and orange lines remain perfectly still.
```


## A mulher da piscina

Quadro inicial: `assets/personagens/c2-piscina.jpg`.

Respiração, brisa mínima e reflexo suave da água. Preservar óculos; não inventar telefone ou retirar acessórios.

```text
Locked-off camera. The woman relaxes in her original pose beside the modernist pool. Natural breathing, a very light breeze in the fabric, and subtle water reflections. Preserve her sunglasses, face, clothing, chair, architecture and sunlight. No new objects or actions.
```


## O casal do iate

Quadro inicial: `assets/personagens/c4-iate.jpg`.

Leve troca de olhar e brisa discreta, sem deslocamento ou manobra do barco.

```text
Locked-off camera. The couple stays in their original positions on the wooden yacht. A subtle exchange of glances, relaxed breathing and a gentle breeze in the linen and silk. Preserve both identities, accessories, boat and coastline. No walking, no camera movement, no new objects.
```


## Diego · agro executivo fictício

Quadro inicial: `assets/personagens/c6-agro.jpg`.

Pequeno movimento de olhar e respiração. Não fazer pegar telefone, conduzir veículo ou gesticular com animais.

```text
Locked-off camera. The man in the white shirt remains beside the pickup in his original pose. He gently shifts his gaze toward the viewer with a restrained, confident expression. Natural breathing and slight shirt movement in the evening breeze. Preserve the hat, face, vehicle, cattle and golden-hour landscape.
```


## A executiva do escritório

Quadro inicial: `assets/personagens/c8-desktop.jpg`.

Pequeno olhar da área de trabalho para a composição, mãos em repouso. Não animar digitação nem fabricar conteúdo na tela.

```text
Locked-off camera. The woman at the wooden desk shifts her gaze subtly toward the viewer and returns to her work area. Keep her hands resting, with natural breathing and a quiet expression. Preserve her exact face, silver hair, cream blouse, desk, architecture and daylight. No typing and no changes to any screen content.
```


## Pipa e dunas

Quadro inicial: `assets/personagens/c5-kite.jpg`.

Brisa e oscilação mínima da pipa; manter horizonte e câmera fixos.

```text
Locked-off editorial landscape. A very gentle breeze moves the kite slightly above the dunes and turquoise water. Preserve the original framing, horizon, colors and sunlight. No camera movement, no new people, no text.
```


## Mão / assinatura editorial

Quadro inicial: `assets/personagens/c9-assinatura.jpg`.

Mínima respiração da mão sem novo toque ou conteúdo; documento e assinatura só por captura real.

```text
Locked-off close detail. The hand remains in its original resting position with barely perceptible natural movement. Preserve the device, fingers, lighting and wooden surface. No tapping, no writing, no signature and no changes to screen content.
```


## Conferência antes de incorporar

Ver começo, meio e fim: rosto, mão, dedos, contato com objetos, roupa, acessórios, luz, cenário e duração. Conferir se a direção do gesto lê como construção. Não disfarçar falha com um recorte que apague a mensagem. Sem áudio de fala; não introduzir voz aleatória. Preferir o trecho aproveitável e a foto original se o clipe não sustentar a qualidade, mantendo registro do limite.

Não esticar um clipe de 5 s para preencher 30 s nem repetir um gesto em loop visível. Na montagem atual a cena de abertura dura 4,6 s; o clipe tem duração suficiente. Se uma cena for maior que o clipe, ajustar a montagem com a fotografia e a prova, respeitando o episódio de 25–35 s.
