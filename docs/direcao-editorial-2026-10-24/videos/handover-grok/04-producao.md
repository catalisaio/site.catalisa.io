# Produção · do material ao filme completo

## Ambiente e arquivos que realmente existem

Usar `/home/klederson/Projects/videos.catalisa.app`. Ler `CLAUDE.md` e o contrato atual em `remotion/types.ts`. Os exemplos `examples/t-cbp01` etc. geralmente guardam só o roteiro. Os dois jobs incluídos em `exemplos/` neste pacote guardam roteiro, fotos, capturas, marca, música e saídas, com caminhos relativos intactos. Para reproduzir, copiar um deles para um **novo nome** em `jobs/` no gerador; não sobrescrever as entregas existentes.

`codigo-local.patch` registra as mudanças ainda não commitadas em `remotion/types.ts`, `remotion/Video.tsx`, `scripts/validate.mjs` e `prompts/director.md`. A camada `kind: 'video'` já funciona no checkout atual e foi renderizada de verdade. Num checkout limpo, inspecionar e usar `git apply --check` antes de aplicar; se o suporte já existir, não reaplicar. O kit não substitui o repositório/dependências do gerador.

## Workflow por episódio

1. Ler a ficha do episódio no plano e as fichas do catálogo citadas em Base. Conservar uma tese, um fecho e CTA coerente com o produto; remover linhas de tempo duplicadas e fechos copiados de outra ficha.
2. Localizar e **ver a captura inteira**, não apenas o nome do arquivo. Conferir dados, conta, cabeçalho, rodapé, nomes, emails, códigos internos, promessas e estado. Para jornadas, usar o mesmo caso, com referências consistentes.
3. Montar o job: `storyboard.json`, `photos/`, `screens/`, `brand/`, `audio/` e `gen/` somente se houver clipe já disponível. Assets devem existir; copiar não autoriza uso editorial de uma captura.
4. Escrever o filme completo: cena editorial → prova legível (~12 s no conjunto de uma ou duas telas) → frase → marca/CTA. Aproximadamente 30 s; cada filme apresenta a situação e o produto sem depender do anterior.
5. Variar por episódio cenário, enquadramento, recorte, entrada, máscara e relação da fotografia com a prova. Usar a atuação pronta quando ela fizer sentido. Não clonar 31 vezes o manifesto trocando só o título.
6. Validar, renderizar quadros dos dois formatos e olhar os arquivos reais. Corrigir contrastes, cortes, sobreposições, ausência de rótulos e nitidez.
7. Renderizar o filme horizontal até terminar. Depois renderizar o vertical. Inspecionar quadros de todas as cenas e assistir ao conjunto com trilha.
8. Atualizar o estado e enviar o link de cada filme ao sair. Continuar a sequência sem esperar confirmação rotineira. Se faltar prova indispensável, marcar aguardando captura e continuar outro episódio viável; não inventar a demonstração para completar a série.

## Comandos

No repositório do gerador, substituindo `nome-do-episodio` pelo job real:

```bash
node scripts/validate.mjs jobs/nome-do-episodio --target 30
node scripts/render.mjs --job jobs/nome-do-episodio --format 16:9 --still 2.5 --out jobs/nome-do-episodio/review/abertura-16x9.jpg --scale 0.5
node scripts/render.mjs --job jobs/nome-do-episodio --format 9:16 --still 2.5 --out jobs/nome-do-episodio/review/abertura-9x16.jpg --scale 0.5
```

Repetir `--still` no meio de cada cena de prova e no encerramento; o tempo depende do roteiro e da sobreposição das transições. Olhar os JPGs antes de seguir.

```bash
RENDER_CONCURRENCY=3 node scripts/render.mjs --job jobs/nome-do-episodio --format 16:9
```

Aguardar terminar; só então:

```bash
RENDER_CONCURRENCY=3 node scripts/render.mjs --job jobs/nome-do-episodio --format 9:16
```

O render abre Chrome e escreve arquivos auxiliares; o sandbox da sessão pode exigir autorização de ferramenta. Isso não é uma nova aprovação criativa do usuário. Não iniciar duas renderizações completas ao mesmo tempo. A máquina tem cerca de 30 GB e já caiu com formatos em paralelo. Manter concorrência 3, no máximo 4 abas.

## Preview com avanço de vídeo

O preview desta sessão continua no endereço `http://127.0.0.1:5186/`. Foi necessário substituir o servidor Python simples por um servidor local com HTTP Range: o Python retornava 200 ao pedido de um trecho do MP4, e o Chrome podia voltar ao começo ao avançar o vídeo. O servidor corrigido entrega 206 com `Content-Range` e mantém os mesmos links. O helper está em `outils/serve-preview.mjs`; não abrir outro servidor na porta já ocupada. Para uma nova sessão, depois de confirmar que não há preview ativo, usar `node /caminho/do/kit/outils/serve-preview.mjs /caminho/do/site 5186`. Ele serve apenas em 127.0.0.1 e não publica o site na internet.

Conferência dos arquivos finais:

```bash
ffprobe -v error -show_entries stream=codec_name,codec_type,width,height,r_frame_rate:format=duration -of json jobs/nome-do-episodio/out/16x9.mp4
ffprobe -v error -show_entries stream=codec_name,codec_type,width,height,r_frame_rate:format=duration -of json jobs/nome-do-episodio/out/9x16.mp4
```

Para o roteiro atual de seis cenas do episódio 01:

```bash
ffmpeg -y -v error -i jobs/a-casa-01-manifesto/out/16x9.mp4 -vf "select='eq(n,75)+eq(n,195)+eq(n,330)+eq(n,510)+eq(n,690)+eq(n,855)',scale=640:360,tile=3x2" -frames:v 1 /tmp/conferencia-16x9.jpg
ffmpeg -y -v error -i jobs/a-casa-01-manifesto/out/9x16.mp4 -vf "select='eq(n,75)+eq(n,195)+eq(n,330)+eq(n,510)+eq(n,690)+eq(n,855)',scale=270:480,tile=3x2" -frames:v 1 /tmp/conferencia-9x16.jpg
```

Os tempos desse exemplo não valem automaticamente para outro episódio. Calcular os centros de cena a partir da duração real e das transições. Captura de seis quadros não substitui ouvir e assistir ao vídeo inteiro.

## Camada de atuação na colagem

Na primeira cena do manifesto, substituir apenas a peça da criadora, nos dois arrays de formato:

```json
{
  "kind": "video",
  "src": "gen/gen4-5.mp4",
  "box": [870, 0, 730, 900],
  "enter": "up",
  "at": 0.2,
  "shape": "rect",
  "focus": [0.5, 0.45]
}
```

O exemplo é horizontal; a caixa vertical é outra, conforme o job Pro incluído. O renderer usa `OffthreadVideo muted` e mantém recorte, foco, zoom e flip. `slices` é especial de foto, não de vídeo: remover esse campo da peça animada. Não substituir tela real por vídeo gerado. O clipe não traz fala nem trilha; o filme usa sua trilha existente.

## Som e marca

Os dois filmes usam a mesma `audio/track-475.mp3`, copiada dos jobs existentes. Não baixar outra trilha por rotina, nem afirmar que a licença é universal: a documentação de licença não acompanha este pacote; conservar a origem e validar direitos na etapa de publicação. Não há voz escolhida. Se o dono pedir voz no futuro, definir e registrar uma voz pt-BR consistente, sem trocar ator de voz entre episódios; esse trabalho não está iniciado.

## Armadilhas que não devem se repetir

- `studio-builder.jpg` tem conta/email no cabeçalho; não entrou no episódio 01. O manifesto usa `studio-canvas.png`, que prova configuração/desenho, não execução real. Duas composições da mesma tela não são duas capacidades comprovadas.
- `04-home.png` do app sintético mostra chamadas de taxa zero/recebimento; não foi liberado integralmente. “Helena” sintética não basta para aprovar a tela.
- `credit-queue.png` tem um slug cru em uma linha; exige inspeção e captura/recorte apropriado antes de aprovar o uso. Não declarar toda a fila limpa.
- Um `disclaimer` no topo do storyboard não chega à colagem pelo render atual. Os rótulos do episódio 01 estão em `scene.sub`. Conferir que aparecem nos dois formatos.
- O título pode ser deslocado automaticamente para não atingir o logo. Na p3 isso causou cruzamento com uma linha; corrigiu-se retirando a linha horizontal e reposicionando a prova. A posição declarada no JSON não é a posição final garantida.
- O vertical tem `layersMobile`, `textAtMobile`, `textColorMobile`, `kickerColorMobile` e `signMobile`; precisa de conferência própria.
- Logo SVG com margem no viewBox fica pequeno/deslocado; usar os PNGs recortados. Inter pode cair em fonte mono se não carregar: olhar o render.
- O renderer atual busca as fontes pelo Google Fonts e segue com fallback se a rede falhar. Os TTFs locais incluídos tornam o painel transportável, mas não são conectados automaticamente ao `useBrandFonts` do vídeo; disponibilidade de rede/fonte precisa ser conferida no render.
- Upscale não cria detalhe novo: para foto pequena, usar recorte menor. Se necessário, Lanczos + unsharp como no job existente, sem geração paga.
- O validador pode avisar abertura sem `hook` e final sem `cta` porque são `collage`; esses avisos genéricos não exigem abandonar a linguagem aprovada. Corrigir erros reais de arquivo, contrato e duração.
- JSX em uma linha com comentário `//` pode engolir o restante. zsh não divide `$VAR` em palavras; para laços de render, preferir Python/subprocess com argumentos em lista.

## Runway / navegador, apenas para continuidade futura

Não é necessário acessar contas para montar a temporada local. As tentativas pela API foram recusadas por saldo; o dono depois autorizou usar o site já logado. A assinatura Pro web não abastece a API. Não pedir outra chave nem repetir consultas de saldo em loop.

A sessão real do Chrome foi ligada por depuração remota autorizada pelo dono, usando Chrome DevTools MCP/CLI `--autoConnect`. O perfil isolado em `/tmp/a-casa-runway-pro-profile` foi um caminho anterior inadequado para a sessão logada: não recriá-lo como solução. Não ler/copiar cookies, senhas ou perfis.

Os IDs de aba 12 (Free) e 14 (Pro) foram observações temporárias, não endereços permanentes. Ler a lista e o estado da interface, conferir conta/modelo/custo/duração antes de uma operação autorizada. Usar a aba certa; não ler Gmail nem outras abas para descobrir credenciais.

No editor de prompt da Runway, `fill` retornou sucesso mas não persistiu o texto. O que funcionou foi clicar no editor, selecionar o texto, usar `type_text`, sair com Tab e conferir em novo snapshot que o valor estava preenchido. Esperar o upload terminar **antes** de escrever o prompt; upload pode limpar o campo. Não clicar Gerar sem conferir. Este histórico evita atraso se uma geração for novamente autorizada; não concede verba.

Nunca registrar URLs assinadas de mídia, cookies, tokens, chaves ou perfis no kit ou site. Para baixar o resultado, identificar o vídeo real de ~5 s; havia vídeo promocional de ~10 s na mesma página. O arquivo já baixado está no pacote.

## Verificações já realizadas

O suporte a camada de vídeo passou em `npx tsc --noEmit -p .` durante a implementação; ambos os formatos foram renderizados. As folhas de seis cenas dos dois filmes foram inspecionadas; a folha da atuação também. Esses são registros do que foi feito, não homologação comercial de todas as telas nem garantia sobre episódios ainda não produzidos.
