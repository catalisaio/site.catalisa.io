"""Fusão: as fotos editoriais recortadas em formas Bauhaus, com a cor chapada da marca e a prova de produto.
Renderiza em 2x e reduz, para bordas limpas."""
import os, sys
from PIL import Image, ImageDraw, ImageFilter, ImageFont, ImageChops

HERE = os.path.dirname(os.path.abspath(__file__))
BOARD = '/home/klederson/Projects/videos.catalisa.app/.cache/board'
PRINTS = '/home/klederson/Projects/videos.catalisa.app/jobs/b3-pix-seguro/prints'
SCREENS = '/home/klederson/Projects/videos.catalisa.app/remotion/public/screens'
FD = os.path.join(HERE, 'fonts')
FONT = os.path.join(FD, 'Inter-300.ttf')
MONO = os.path.join(FD, 'JBMono.ttf')

PAPEL = (246, 243, 238); CREME = (236, 228, 214); ROXO = (115, 75, 156); PROFUNDO = (53, 33, 63)
LARANJA = (241, 138, 67); PONTO = (253, 194, 52); TINTA = (26, 29, 35); LILAS = (205, 186, 224)
TURQ = (79, 199, 214)
K = 2  # supersampling


class Canvas:
    def __init__(s, w, h, bg):
        s.w, s.h = w, h
        s.im = Image.new('RGB', (w * K, h * K), bg)

    def _mask(s, shape, box):
        x0, y0, x1, y1 = [v * K for v in box]
        m = Image.new('L', s.im.size, 0)
        d = ImageDraw.Draw(m)
        if shape == 'rect':
            d.rectangle((x0, y0, x1, y1), fill=255)
        elif shape == 'circle':
            d.ellipse((x0, y0, x1, y1), fill=255)
        elif shape == 'arch':  # semicírculo em cima
            r = (x1 - x0) / 2
            d.rectangle((x0, y0 + r, x1, y1), fill=255)
            d.ellipse((x0, y0, x1, y0 + 2 * r), fill=255)
        elif shape == 'half-top':  # meia-lua com a reta embaixo
            d.pieslice((x0, y0, x1, y0 + 2 * (y1 - y0)), 180, 360, fill=255)
        elif shape == 'half-left':
            d.pieslice((x0, y0, x0 + 2 * (x1 - x0), y1), 90, 270, fill=255)
        elif shape == 'round':
            d.rounded_rectangle((x0, y0, x1, y1), radius=int(0.11 * (x1 - x0)), fill=255)
        return m

    def shadow(s, shape, box, off=10, blur=22, alpha=70):
        m = s._mask(shape, [box[0] + off, box[1] + off, box[2] + off, box[3] + off])
        m = m.filter(ImageFilter.GaussianBlur(blur * K)).point(lambda v: v * alpha // 255)
        s.im.paste((20, 12, 24), (0, 0), m)

    def shape(s, shape, box, color, grain=True, shadow=False):
        if shadow:
            s.shadow(shape, box)
        m = s._mask(shape, box)
        layer = Image.new('RGB', s.im.size, color)
        if grain:  # papel: leve textura na cor chapada
            n = Image.effect_noise(s.im.size, 18).convert('RGB')
            layer = Image.blend(layer, ImageChops.multiply(layer, n.point(lambda v: 205 + v // 5)), 0.55)
        s.im.paste(layer, (0, 0), m)

    def photo(s, path, shape, box, focus=(0.5, 0.5), shadow=True, zoom=1.0, flip=False):
        if shadow:
            s.shadow(shape, box)
        src = Image.open(path).convert('RGB')
        if flip:
            src = src.transpose(Image.FLIP_LEFT_RIGHT)
        bw, bh = (box[2] - box[0]) * K, (box[3] - box[1]) * K
        sc = max(bw / src.width, bh / src.height) * zoom
        src = src.resize((max(1, int(src.width * sc)), max(1, int(src.height * sc))), Image.LANCZOS)
        cx = min(max(focus[0] * src.width - bw / 2, 0), src.width - bw)
        cy = min(max(focus[1] * src.height - bh / 2, 0), src.height - bh)
        crop = src.crop((int(cx), int(cy), int(cx) + int(bw), int(cy) + int(bh)))
        full = Image.new('RGB', s.im.size)
        full.paste(crop, (box[0] * K, box[1] * K))
        s.im.paste(full, (0, 0), s._mask(shape, box))

    def phone(s, path, x, y, w):
        src = Image.open(path).convert('RGB')
        h = int(w * src.height / src.width)
        bez = max(5, w // 28)
        s.shadow('round', (x - bez, y - bez, x + w + bez, y + h + bez), off=14, blur=26, alpha=90)
        s.shape('round', (x - bez, y - bez, x + w + bez, y + h + bez), (22, 20, 26), grain=False)
        s.photo(path, 'round', (x, y, x + w, y + h), shadow=False)
        return h

    def screen(s, path, box, frame=PAPEL):
        p = 8
        s.shape('rect', (box[0] - p, box[1] - p, box[2] + p, box[3] + p), frame, grain=False, shadow=True)
        s.photo(path, 'rect', box, focus=(0.0, 0.0), shadow=False)

    def line(s, a, b, color, w=2):
        ImageDraw.Draw(s.im).line([v * K for v in (*a, *b)], fill=color, width=w * K)

    def text(s, xy, txt, size, color, mono=False, spacing=1.08, track=0):
        f = ImageFont.truetype(MONO if mono else FONT, size * K)
        d = ImageDraw.Draw(s.im)
        y = xy[1] * K
        for ln in txt.split('\n'):
            if track:
                for i, ch in enumerate(ln):
                    x = xy[0] * K + d.textlength(ln[:i], font=f) + i * track * K
                    d.text((x, y), ch, font=f, fill=color)
            else:
                d.text((xy[0] * K, y), ln, font=f, fill=color)
            y += int(size * K * spacing)

    def sign(s, x, y, h=30):
        # assinatura da marca no rodapé, como numa página de revista
        px = s.im.getpixel(((x + 40) * K, (y + h // 2) * K))
        dark = sum(px) < 380
        lg = Image.open(os.path.join(FD, 'logo-white.png' if dark else 'logo-color.png')).convert('RGBA')
        lg = lg.resize((int(lg.width * h * K / lg.height), h * K), Image.LANCZOS)
        s.im.paste(lg, (x * K, y * K), lg)

    def dot(s, x, y, r=7):
        s.shape('circle', (x - r, y - r, x + r, y + r), PONTO, grain=False)

    def save(s, name):
        out = s.im.resize((s.w, s.h), Image.LANCZOS)
        out.save(os.path.join(HERE, 'out', name + '.jpg'), quality=88)


def label(c, x, y, t, color=TINTA):
    c.text((x, y), t.upper(), 13, color, mono=True, track=3.6)


def head(c, x, y, t, size=62, color=TINTA):
    sz = int(size * 1.14)
    n = t.count('\n') + 1
    if c.h == 900 and y + n * sz > 900 - 175:  # o título termina acima da assinatura, com respiro
        y = 900 - 175 - n * sz
    c.text((x, y), t, sz, color, spacing=1.0, track=-0.035 * sz)
    c.sign(x, 900 - 92 if c.h == 900 else c.h - 130, 30 if c.h == 900 else 44)


W, H = 1600, 900
b = lambda n: os.path.join(BOARD, n + '.jpg')

# 1 · Banking na piscina: arco com a foto, faixa laranja, sol amarelo, celular como prova
c = Canvas(W, H, PAPEL)
c.shape('rect', (1010, 0, 1250, H), LARANJA)
c.shape('circle', (1090, 90, 1410, 410), PONTO)
c.photo(b('c2-piscina'), 'arch', (690, 120, 1110, 900), focus=(0.5, 0.52))
c.shape('half-top', (1240, 640, 1600, 820), ROXO)
c.shape('rect', (1240, 820, 1600, 900), ROXO)
c.phone(f'{PRINTS}/04-home.png', 1290, 300, 230)
label(c, 90, 96, 'Catalisa / Banking')
head(c, 90, 560, 'O banco\nacompanha o\nritmo da pessoa.')
c.save('f1-banking-piscina')

# 2 · Credit no estúdio: fundo profundo, a foto num círculo, meia-lua laranja, a mesa como prova
c = Canvas(W, H, PROFUNDO)
c.shape('half-top', (330, 760, 610, 900), LARANJA)
c.shape('rect', (1380, 0, 1600, 360), LILAS)
c.photo(b('c1-executivo'), 'circle', (640, 70, 1400, 830), focus=(0.47, 0.5), zoom=1.05)
c.screen(f'{SCREENS}/mesa-fila.jpg', (1110, 590, 1530, 800))
label(c, 90, 96, 'Catalisa / Credit', CREME)
head(c, 90, 300, 'Crédito\ntem começo.\nA operação\ncontinua.', 64, PAPEL)
c.save('f2-credit-estudio')

# 3 · Iate: a foto fatiada em tiras, sol laranja atrás, faixa turquesa
c = Canvas(W, H, CREME)
c.shape('circle', (1150, 40, 1520, 410), LARANJA)
c.shape('rect', (560, 640, 1600, 900), TURQ)
for i, (x0, x1, dy) in enumerate([(640, 860, 60), (878, 1098, 0), (1116, 1336, 90)]):
    # cada tira mostra a parte correspondente da mesma foto
    src_w = 1336 - 640
    c.shadow('rect', (x0, 120 + dy, x1, 780 + dy - 60))
    full = Canvas(W, H, CREME)
    full.photo(b('c4-iate'), 'rect', (640, 120, 1336, 780), focus=(0.32, 0.5), shadow=False)
    m = c._mask('rect', (x0, 120 + dy, x1, 780 + dy - 60))
    shifted = full.im.transform(full.im.size, Image.AFFINE, (1, 0, 0, 0, 1, -dy * K))
    c.im.paste(shifted, (0, 0), m)
c.phone(f'{PRINTS}/09-pix-comprovante.png', 1390, 470, 150)
label(c, 90, 96, 'Catalisa / Banking')
head(c, 90, 520, 'Um aparelho.\nUm ponto de\ncontinuidade.')
c.save('f3-banking-iate')

# 4 · Agro: retângulo alto, sol nascendo atrás, faixa roxa com o título
c = Canvas(W, H, PAPEL)
c.shape('circle', (1180, 60, 1560, 440), LARANJA)
c.photo(b('c6-agro'), 'rect', (760, 0, 1320, 900), focus=(0.66, 0.5), zoom=1.1)
c.shape('rect', (0, 560, 760, 900), ROXO)
c.shape('circle', (1320, 640, 1500, 820), PONTO)
label(c, 90, 96, 'Catalisa / Credit · Garantia Viva')
head(c, 90, 250, 'A garantia\nestá no pasto.', 64)
c.text((90, 630), 'Cada lote avaliado.\nAcompanhado todo dia.', 30, PAPEL, spacing=1.35)
c.save('f4-credit-agro')

# 5 · Kite: faixa panorâmica, grande círculo roxo, a linha laranja ligando
c = Canvas(W, H, PAPEL)
c.shape('circle', (-200, 600, 300, 1100), ROXO)
c.photo(b('c5-kite'), 'rect', (420, 260, 1600, 700), focus=(0.6, 0.45))
c.shape('half-top', (1180, 140, 1480, 290), LARANJA)
c.line((300, 790), (1500, 790), LARANJA, 2)
label(c, 90, 96, 'Catalisa / Plataforma')
head(c, 90, 330, 'A forma\nsegue a\nconexão.', 54)
c.save('f5-plataforma-kite')

# 6 · Desktop em casa: arco, retângulo lilás, o desktop como prova
c = Canvas(W, H, CREME)
c.shape('rect', (1120, 0, 1600, 520), LILAS)
c.photo(b('c8-desktop'), 'arch', (620, 110, 1080, 900), focus=(0.47, 0.45), zoom=1.3)
c.screen(f'{SCREENS}/desktop-inicio.jpg', (1010, 470, 1530, 799))
c.shape('circle', (1420, 90, 1540, 210), LARANJA)
label(c, 90, 96, 'Catalisa / Banking · Desktop')
head(c, 90, 560, 'Mais espaço\npara olhar\na conta.')
c.save('f6-banking-desktop')

# 7 · Detalhe no iate: círculo com a mão e o celular, retângulos chapados
c = Canvas(W, H, PROFUNDO)
c.shape('rect', (0, 0, 520, 900), ROXO)
c.photo(b('c9-assinatura'), 'circle', (560, 90, 1280, 810), focus=(0.62, 0.5))
c.shape('rect', (1230, 600, 1600, 900), LARANJA)
c.phone(f'{PRINTS}/08-pix-revisao.png', 1330, 160, 180)
label(c, 90, 96, 'Catalisa / Banking · Pix', CREME)
head(c, 90, 520, 'Entre tocar e\nacontecer,\nexiste uma base.', 50, PAPEL)
c.save('f7-banking-detalhe')

# 8 · A criadora: a foto em faixa alta, círculos e linhas finas
c = Canvas(W, H, PAPEL)
c.shape('circle', (980, 80, 1500, 600), ROXO)
c.photo(b('c7b-criadora'), 'rect', (720, 0, 1180, 900), focus=(0.60, 0.5), flip=True)
c.shape('rect', (1140, 600, 1600, 900), LARANJA)
c.screen(f'{SCREENS}/console-contas.jpg', (1200, 330, 1520, 560))
label(c, 90, 96, 'Catalisa / Credit · Quem cria')
head(c, 90, 470, 'Quem cria\ndefine o produto.\nQuem opera\ncontinua a história.', 50)
c.save('f8-credit-criadora')

# 9 · Vertical para reels: a piscina numa coluna de formas
V = Canvas(1080, 1920, PAPEL)
V.shape('circle', (540, 120, 1020, 600), PONTO)
V.shape('rect', (0, 360, 380, 1500), LARANJA)
V.photo(b('c2-piscina'), 'arch', (160, 300, 860, 1500), focus=(0.5, 0.5), zoom=1.1)
V.phone(f'{PRINTS}/07-pix-valor.png', 700, 1010, 260)
V.shape('rect', (0, 1500, 1080, 1920), ROXO)
label(V, 90, 140, 'Catalisa / Banking')
head(V, 90, 1590, 'O banco acompanha\no ritmo da pessoa.', 58, PAPEL)
V.save('f9-vertical-piscina')


# ---- variantes com o título de cada filme ----
def piscina(name, lab, title):
    c = Canvas(W, H, PAPEL)
    c.shape('rect', (1010, 0, 1250, H), LARANJA)
    c.shape('circle', (1090, 90, 1410, 410), PONTO)
    c.photo(b('c2-piscina'), 'arch', (690, 120, 1110, 900), focus=(0.5, 0.52))
    c.shape('half-top', (1240, 640, 1600, 820), ROXO); c.shape('rect', (1240, 820, 1600, 900), ROXO)
    c.phone(f'{PRINTS}/04-home.png', 1290, 300, 230)
    label(c, 90, 96, lab); head(c, 90, 560, title); c.save(name)
piscina('g-b1', 'Catalisa / Banking', 'Uma conta.\nVárias formas\nde operar.')

def estudio(name, lab, title, size=60):
    c = Canvas(W, H, PROFUNDO)
    c.shape('half-top', (330, 760, 610, 900), LARANJA); c.shape('rect', (1380, 0, 1600, 360), LILAS)
    c.photo(b('c1-executivo'), 'circle', (640, 70, 1400, 830), focus=(0.47, 0.5), zoom=1.05)
    c.screen(f'{SCREENS}/mesa-fila.jpg', (1110, 590, 1530, 800))
    label(c, 90, 96, lab, CREME); head(c, 90, 300, title, size, PAPEL); c.save(name)
estudio('g-c1', 'Catalisa / Credit · Mesa', 'Uma proposta\nchega.\nO contexto\nvem junto.', 56)

c = Canvas(W, H, CREME)
c.shape('circle', (1150, 40, 1520, 410), LARANJA); c.shape('rect', (560, 640, 1600, 900), TURQ)
for (x0, x1, dy) in [(640, 860, 60), (878, 1098, 0), (1116, 1336, 90)]:
    c.shadow('rect', (x0, 120 + dy, x1, 720 + dy))
    full = Canvas(W, H, CREME); full.photo(b('c4-iate'), 'rect', (640, 120, 1336, 780), focus=(0.32, 0.5), shadow=False)
    c.im.paste(full.im.transform(full.im.size, Image.AFFINE, (1, 0, 0, 0, 1, -dy * K)), (0, 0), c._mask('rect', (x0, 120 + dy, x1, 720 + dy)))
c.phone(f'{PRINTS}/09-pix-comprovante.png', 1390, 470, 150)
label(c, 90, 96, 'Catalisa / Credit · Formalização'); head(c, 90, 500, 'Aceitar uma\nproposta é\noutro começo.')
c.save('g-c2')

c = Canvas(W, H, CREME)
c.shape('rect', (1120, 0, 1600, 520), LILAS)
c.photo(b('c8-desktop'), 'arch', (620, 110, 1080, 900), focus=(0.47, 0.45), zoom=1.3)
c.screen(f'{SCREENS}/desktop-inicio.jpg', (1010, 470, 1530, 799))
c.shape('circle', (1420, 90, 1540, 210), LARANJA)
label(c, 90, 96, 'Catalisa / Banking · Posição'); head(c, 90, 520, 'Ter um saldo.\nEntender o que\npode usar.', 56)
c.save('g-b4')

c = Canvas(W, H, PAPEL)
c.shape('rect', (0, 600, 640, 900), ROXO)
c.photo(b('c3-circulo'), 'rect', (640, 0, 1240, 900), focus=(0.5, 0.5), zoom=1.0)
c.shape('half-top', (1240, 120, 1600, 300), LARANJA)
c.screen(f'{SCREENS}/console-contas.jpg', (1140, 380, 1530, 748))
label(c, 90, 96, 'Catalisa / Banking · Console'); head(c, 90, 300, 'Quem opera\nprecisa enxergar\no contexto.', 52)
c.text((90, 680), 'Contas e bloqueios\ncom contexto de origem.', 28, PAPEL, spacing=1.35)
c.save('g-b5')
print('ok')
