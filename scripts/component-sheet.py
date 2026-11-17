"""Detailed component sheet for the Rotozest SS rotary gear pump (L foot-mount).
One panel per component: photo evidence, dimensioned drawing, confirmed features.
Run: python3 -I scripts/component-sheet.py   → docs/3d-review/component-sheet.png
Sizes in mm, read off photo 15 with the body taken as Ø102 (±5%). Source of truth: docs/3d-pump-spec.md.
"""
import math
from PIL import Image, ImageDraw, ImageFont

U = "scrape/images/wp-content/uploads/2025/01/"
FD = "/System/Library/Fonts/Supplemental/"
T = ImageFont.truetype(FD + "Arial Bold.ttf", 26)
H2 = ImageFont.truetype(FD + "Arial Bold.ttf", 17)
TX = ImageFont.truetype(FD + "Arial.ttf", 15)
SM = ImageFont.truetype(FD + "Arial.ttf", 13)
SB = ImageFont.truetype(FD + "Arial Bold.ttf", 13)

INK, BLUE, MUTE, LINE = (14, 42, 59), (0, 119, 168), (95, 106, 114), (214, 224, 230)
STEEL, STEEL2, IRON, DARK, HOLE = (205, 210, 214), (178, 184, 190), (38, 40, 43), (70, 74, 78), (255, 255, 255)

W, PH = 1600, 640  # sheet width, panel height


def photo(name, box, size=300):
    im = Image.open(U + name).convert("RGBA")
    bg = Image.new("RGBA", im.size, (244, 244, 244, 255))
    bg.alpha_composite(im)
    c = bg.convert("RGB").crop(box)
    c.thumbnail((size, size))
    return c


class Pen:
    def __init__(self, d, ox, oy, k):
        self.d, self.ox, self.oy, self.k = d, ox, oy, k

    def p(self, x, y):  # drawing mm → pixels, y up
        return (self.ox + x * self.k, self.oy - y * self.k)

    def rect(self, x0, y0, x1, y1, fill, outline=INK, r=0):
        a, b = self.p(x0, y1), self.p(x1, y0)
        if r:
            self.d.rounded_rectangle([a, b], radius=r * self.k, fill=fill, outline=outline, width=2)
        else:
            self.d.rectangle([a, b], fill=fill, outline=outline, width=2)

    def circ(self, x, y, r, fill, outline=INK, w=2):
        cx, cy = self.p(x, y)
        R = r * self.k
        self.d.ellipse([cx - R, cy - R, cx + R, cy + R], fill=fill, outline=outline, width=w)

    def poly(self, pts, fill, outline=INK):
        self.d.polygon([self.p(*q) for q in pts], fill=fill, outline=outline)

    def line(self, x0, y0, x1, y1, col=INK, w=2):
        self.d.line([self.p(x0, y0), self.p(x1, y1)], fill=col, width=w)

    def dim_h(self, x0, x1, y, text, off=0):
        a, b = self.p(x0, y), self.p(x1, y)
        self.d.line([a, b], fill=BLUE, width=1)
        for q in (a, b):
            self.d.line([(q[0], q[1] - 6), (q[0], q[1] + 6)], fill=BLUE, width=1)
        self.d.text(((a[0] + b[0]) / 2 - len(text) * 3.4, a[1] - 18 + off), text, fill=BLUE, font=SM)

    def dim_v(self, x, y0, y1, text):
        a, b = self.p(x, y0), self.p(x, y1)
        self.d.line([a, b], fill=BLUE, width=1)
        for q in (a, b):
            self.d.line([(q[0] - 6, q[1]), (q[0] + 6, q[1])], fill=BLUE, width=1)
        self.d.text((a[0] + 6, (a[1] + b[1]) / 2 - 8), text, fill=BLUE, font=SM)

    def label(self, x, y, text, col=INK, font=SM):
        self.d.text(self.p(x, y), text, fill=col, font=font)


def hexagon(pen, x, y, af, fill):
    R = af / math.sqrt(3)
    pen.poly([(x + R * math.cos(math.radians(a)), y + R * math.sin(math.radians(a))) for a in range(0, 360, 60)], fill)


def notes(d, x, y, lines, w=430):
    for ln in lines:
        bold = ln.startswith("!")
        t = ln.lstrip("!")
        font = SB if bold else TX
        # crude wrap
        words, cur = t.split(" "), ""
        for wd in words:
            test = (cur + " " + wd).strip()
            if d.textlength(test, font=font) > w:
                d.text((x, y), cur, fill=INK, font=font)
                y += 20
                cur = wd
            else:
                cur = test
        d.text((x, y), cur, fill=INK, font=font)
        y += 24


panels = []


def panel(num, title, src, crop, draw_fn, lines):
    panels.append((num, title, src, crop, draw_fn, lines))


# ---------------------------------------------------------------- component drawings
def d_shaft(d, x, y):
    pen = Pen(d, x + 40, y + 230, 3.2)
    # side view: shaft from x=-38 (tip) to 0 (housing face), plus seal
    pen.rect(-38, -8, 0, 8, DARK)
    pen.line(-38, -6.6, -36.6, -8, (255, 255, 255))
    pen.rect(-34, 5, -6, 8.4, STEEL)  # key above
    pen.rect(0, -13, 2, 13, IRON)
    pen.label(2.5, 15, "oil seal Ø26", MUTE)
    pen.dim_h(-38, 0, 22, "38 out of housing")
    pen.dim_v(-46, -8, 8, "Ø16")
    pen.dim_h(-34, -6, -18, "key 28 × 5 × 5, round ends", off=30)
    # end view
    pen2 = Pen(d, x + 330, y + 230, 3.2)
    pen2.circ(0, 0, 13, IRON)
    pen2.circ(0, 0, 8, DARK)
    pen2.rect(-2.5, 5, 2.5, 9.5, STEEL, r=0)
    pen2.circ(0, 0, 1.5, HOLE)
    pen2.label(-14, -18, "end view: centre-drill Ø3, key on top", MUTE)


def d_housing(d, x, y):
    pen = Pen(d, x + 40, y + 250, 2.4)
    pen.rect(0, -33.5, 37, 33.5, STEEL)
    pen.line(0, 32, 1.5, 33.5)
    pen.rect(-38, -8, 0, 8, DARK)
    pen.rect(37, -41, 59, 41, IRON)
    pen.label(38, 44, "plate", MUTE)
    pen.dim_h(0, 37, 40, "37")
    pen.dim_v(-12, -33.5, 33.5, "Ø67")
    pen2 = Pen(d, x + 320, y + 250, 2.4)
    pen2.circ(0, 0, 33.5, STEEL)
    pen2.circ(0, 0, 13, IRON)
    pen2.circ(0, 0, 8, DARK)
    for a in (90, 210, 330):
        pen2.circ(26 * math.cos(math.radians(a)), 26 * math.sin(math.radians(a)), 3.4, DARK)
    pen2.label(-40, -40, "end face: 3 tapped holes M8", INK, SB)
    pen2.label(-40, -46.5, "on Ø52 PCD, 120° apart, no screws", MUTE)


def d_plate(d, x, y):
    pen = Pen(d, x + 210, y + 470, 1.75)
    HB, R, BW = 105, 70, 90  # body axis height, arch radius about the body axis, half foot width
    HS = HB + 15  # shaft axis 15 above the body axis
    def tan(side):
        px, py = side * BW, -HB
        dd = math.hypot(px, py); a = math.atan2(py, px); b = math.acos(R / dd); tt = a + side * b
        return (math.cos(tt) * R, HB + math.sin(tt) * R, tt)
    tr, tl = tan(1), tan(-1)
    pts = [(-BW, 0), (BW, 0), (tr[0], tr[1])]
    t0, t1 = tr[2], tl[2] + 2 * math.pi
    for i in range(41):
        tt = t0 + (t1 - t0) * i / 40
        pts.append((math.cos(tt) * R, HB + math.sin(tt) * R))
    pen.poly(pts, IRON)
    pen.circ(0, HB, 62, (58, 61, 65), (90, 94, 98), 2)
    # pear opening: Ø72 round the housing on the shaft axis + Ø40 lobe below (bottom at 64), joined by tangents
    yA, rA, yB, rB = HS, 36, 84, 20
    al = math.asin((rA - rB) / (yA - yB))
    pear = [(rA * math.cos(t), yA + rA * math.sin(t)) for t in [al + (math.pi - 2 * al) * i / 30 for i in range(31)]]
    pear += [(rB * math.cos(t), yB + rB * math.sin(t)) for t in [math.pi - al + (math.pi + 2 * al) * i / 30 for i in range(31)]]
    pen.poly(pear, HOLE)
    pen.circ(0, HS, 33.5, None, STEEL2, 2)
    pen.circ(0, HS, 2, BLUE)
    pen.circ(0, HB, 2, (200, 60, 60))
    for zz in (47.5, -47.5):  # 2 bolts on the body axis, in line with the flange's back-face tapped holes
        pen.circ(zz, HB, 11, (210, 210, 205))
        pen.circ(zz, HB, 4.5, HOLE)
    pen.label(6, HS + 2, "shaft axis", BLUE)
    pen.label(6, HB - 6, "body axis (15 lower)", (200, 60, 60))
    pen.label(-44, HS - 40, "housing Ø67", MUTE)
    pen.dim_v(BW + 10, 0, HB, "body axis ↑ 105")
    pen.dim_v(-BW - 26, HB, HB + R, "R70")
    pen.dim_h(-BW, BW, -10, "180 at the foot (flanks splay out)")
    pen.label(-70, HB - 66, "pear opening (O + 0); 2 bolts on the body axis", BLUE)


def d_base(d, x, y):
    pen = Pen(d, x + 50, y + 300, 2.0)
    BL, AW, SW = 89, 44, 92
    pen.rect(-22, -90, 0, 90, IRON)
    for z0 in (SW / 2, -SW / 2 - AW):
        inner_low = z0 > 0
        pen.poly([(0, z0), (BL, z0), (BL, z0 + AW), (0, z0 + AW)], IRON)
        gz0, gz1 = (z0, z0 + 9) if inner_low else (z0 + AW - 9, z0 + AW)
        pen.poly([(0, gz0), (BL - 4, gz0), (BL - 4, gz1), (0, gz1)], DARK)
    for zc in (SW / 2 + AW / 2, -SW / 2 - AW / 2):
        for xx in (12, 72):
            pen.circ(xx, zc, 6, HOLE)
    pen.rect(0, -SW / 2, 48, SW / 2, IRON)  # solid first half
    pen.rect(0, -51, 97, 51, None, STEEL2)
    pen.label(54, 4, "slot", BLUE, SB)
    pen.label(4, 4, "solid", (230, 230, 230), SB)
    pen.label(70, 62, "pump ends at 97 →", MUTE)
    pen.dim_h(0, BL, 100, "arms 89 from the plate")
    pen.dim_v(BL + 18, -90, 90, "180")
    pen.label(-10, -104, "4 holes Ø12, 2 per arm (confirmed by you)", INK, SB)
    pen2 = Pen(d, x + 330, y + 470, 1.6)
    pen2.rect(-22, 0, 0, 190, IRON)
    pen2.rect(0, 0, 89, 14, IRON)
    pen2.poly([(0, 14), (89, 14), (0, 34)], DARK)
    pen2.line(0, 34, 89, 14, BLUE, 2)
    pen2.label(14, 48, "gusset 34 above floor → 0", BLUE, SB)
    pen2.label(-20, -8, "side view", MUTE)


def d_flange(d, x, y):
    pen = Pen(d, x + 120, y + 260, 2.0)
    pen.rect(-22, -70, -7, 70, IRON)
    pen.rect(-7, -62, 0, 62, (58, 61, 65))
    pen.rect(0, -54, 20, 54, STEEL)
    pen.line(0, 52.5, 1.5, 54)
    pen.rect(20, -50.4, 20.6, 50.4, DARK)
    pen.rect(20.6, -51, 58.6, 51, STEEL2)
    pen.label(36, 2, "body 38", MUTE)
    pen.label(16, -60, "hairline joint", BLUE)
    for yy in (25,):
        pen.rect(-24, yy - 9, -22, yy + 9, (210, 210, 205))
        pen.rect(-31, yy - 6.5, -24, yy + 6.5, (210, 210, 205))
    pen.label(-80, -70, "bolt heads on the BACK", MUTE)
    pen.dim_h(0, 20, 60, "20")
    pen.dim_h(-22, 0, -78, "plate 15 + boss 7")
    pen.dim_v(-40, -54, 54, "Ø108")


def d_body(d, x, y):
    pen = Pen(d, x + 190, y + 250, 2.0)
    # section along shaft: O with flats
    pts = []
    for i in range(0, 361, 3):
        a = math.radians(i)
        X, Y = 51 * math.cos(a), 51 * math.sin(a)
        X = max(-44, min(44, X))
        pts.append((X, Y))
    pen.poly(pts, STEEL)
    for s in (1, -1):
        pen.rect(s * 44 - (12 if s > 0 else 0), -12, s * 44 + (0 if s > 0 else 12), 12, DARK)
    pen.label(44, 12, "DELIVERY flat", INK, SB)
    pen.label(-112, 12, "SUCTION flat", INK, SB)
    pen.dim_h(-44, 44, -60, "88 across flats")
    pen.dim_v(60, -51, 51, "Ø102")
    pen.label(-18, 56, "logo", MUTE)
    # flat face view
    pen2 = Pen(d, x + 330, y + 470, 1.6)
    pen2.rect(0, -36, 38, 40, (225, 228, 231))  # curved part above
    pen2.rect(0, -36, 38, 18, STEEL)  # the flat
    pen2.circ(19, -6, 12, DARK)
    pen2.circ(19, -6, 9, (120, 124, 128))
    pen2.circ(4, 4, 2.5, DARK)
    pen2.rect(4, 22, 36, 32, None, INK, r=5)
    pen2.label(7, 33, "DELIVERY", INK, SM)
    pen2.label(39, 16, "edge of flat", BLUE)
    pen2.label(-2, -42, "label on the curve above the flat; port low in the flat; tap on the plate side", MUTE)


def d_port(d, x, y):
    pen = Pen(d, x + 190, y + 300, 3.6)
    pen.rect(-20, -26, 20, 0, STEEL)
    pen.rect(-12.2, -24, 12.2, 0, (110, 114, 118))
    for i in range(12):
        yy = -1.6 - i * 1.81
        pen.line(-12.2, yy, -10.6, yy - 0.9, INK, 1)
        pen.line(12.2, yy, 10.6, yy - 0.9, INK, 1)
    pen.poly([(-14.8, 0), (-12.2, -2.6), (12.2, -2.6), (14.8, 0)], (150, 155, 160))
    pen.dim_h(-12.2, 12.2, 6, "¾\" BSP, Ø24 tapping")
    pen.dim_v(24, -24, 0, "25 deep")
    pen.label(-20, -30, "14 threads per inch (1.81 mm pitch), chamfered mouth", MUTE)


def d_box(d, x, y):
    pen = Pen(d, x + 200, y + 260, 2.1)
    # end view: round gear ring with flats, 4 nuts at 45° on Ø90, small cast box in front
    pts = []
    for i in range(0, 361, 3):
        a = math.radians(i)
        X, Y = 51 * math.cos(a), 51 * math.sin(a)
        pts.append((max(-44, min(44, X)), Y))
    pen.poly(pts, STEEL)
    pen.rect(-24, -36, 24, 36, STEEL2, r=8)
    pen.rect(-19, -30, 19, 30, (20, 20, 22), r=3)
    pen.label(-16, 2, "nameplate", (230, 230, 230))
    for cx, cy in ((30, 31), (-30, 31), (30, -31), (-30, -31)):
        hexagon(pen, cx, cy, 13, (230, 232, 234))
        pen.circ(cx, cy, 5.5, (245, 246, 247))
    pen.dim_h(-24, 24, -46, "cast box 48 wide")
    pen.dim_v(58, -36, 36, "72")
    pen.label(-60, 62, "round cast flange (body flats); nuts at ±30 / ±31", BLUE, SB)
    # side view
    pen2 = Pen(d, x + 380, y + 260, 2.1)
    pen2.rect(0, -51, 14, 51, STEEL)
    pen2.rect(14, -36, 43, 36, STEEL2, r=5)
    pen2.rect(14, -51, 22, 51, STEEL2)
    pen2.circ(18, -19, 2, DARK)
    hexagon(pen2, 16, 32, 9, (230, 232, 234))
    pen2.dim_h(0, 14, 58, "ring 14")
    pen2.dim_h(14, 43, -60, "box 29")
    pen2.label(-6, -70, "hole in the flange flat, above the bottom nut", MUTE)


def d_nut(d, x, y):
    pen = Pen(d, x + 150, y + 290, 6)
    pen.rect(-8.5, 0, 8.5, 1.6, (215, 218, 220))
    pen.rect(-7.5, 1.6, 7.5, 8.8, (230, 232, 234))
    pts = [(6.3 * math.cos(t), 8.8 + 6.6 * math.sin(t)) for t in [i * math.pi / 20 for i in range(21)]]
    pen.poly(pts, (240, 242, 244))
    pen.dim_v(-12, 0, 15.4, "15.4")
    pen.dim_h(-7.5, 7.5, -6, "13 AF hex")
    pen.label(9, 1, "washer Ø17", MUTE)
    pen.label(-6, 20, "M8 acorn (dome) nut", INK, SB)


def d_plate_txt(d, x, y):
    W, Hh = 300, 470
    plate = Image.new("RGB", (W, Hh), "white")
    pd = ImageDraw.Draw(plate)
    pd.rounded_rectangle([0, 0, W - 1, Hh - 1], radius=18, fill=(14, 14, 16))
    SIL, INKD = (200, 200, 200), (20, 20, 22)
    logo = Image.open("public/images/registered-logo.webp").convert("RGBA")
    mark = logo.crop((0, 0, int(logo.width * 0.215), logo.height))
    mark.thumbnail((70, 70))
    plate.paste(Image.new("RGBA", mark.size, SIL + (255,)), ((W - mark.width) // 2, 14), mark)
    f1 = ImageFont.truetype(FD + "Arial.ttf", 12)
    f2 = ImageFont.truetype(FD + "Arial Bold.ttf", 19)
    f3 = ImageFont.truetype(FD + "Arial Bold.ttf", 15)
    f4 = ImageFont.truetype(FD + "Arial.ttf", 15)
    def ctext(yy, s, font, col=SIL):
        pd.text(((W - pd.textlength(s, font=font)) / 2, yy), s, fill=col, font=font)
    ctext(90, "Rotozest", f1)
    ctext(110, "ROTARY GEAR PUMP", f2)
    rows = [("MODEL", "RZSS-075"), ("SIZE", '¾"X¾"BSP'), ("FLOW", "33.33 LPM"), ("PRESS", "10 kg/cm²"), ("SPEED", "1440 RPM"), ("SR.NO.", "")]
    x0, x1, xm, yy = 18, W - 18, 18 + int((W - 36) * 0.4), 140
    for k, v in rows:
        pd.rectangle([x0, yy, xm - 2, yy + 34], fill=SIL)
        pd.rectangle([xm + 2, yy, x1, yy + 34], fill=SIL)
        pd.text((x0 + 6, yy + 8), k, fill=INKD, font=f3)
        pd.text((xm + 8, yy + 8), v, fill=INKD, font=f4)
        yy += 38
    ctext(yy + 10, "MFG. BY :", f4)
    ctext(yy + 32, "ROTOZEST INDUSTRIES", f3)
    ctext(yy + 54, "INDIA", f4)
    d._image.paste(plate, (x + 150, y + 40))


def d_marks(d, x, y):
    """Top marking seen from the delivery side (photo 15): RZ mark turned 90° anticlockwise,
    Rotozest reading bottom to top, oblong with a bold arrow towards DELIVERY; bottoms aligned."""
    W, Hh = 470, 300
    canvas = Image.new("RGB", (W, Hh), STEEL)
    logo = Image.open("public/images/registered-logo.webp").convert("RGBA")
    mark = logo.crop((0, 0, int(logo.width * 0.215), logo.height)).rotate(90, expand=True)
    mark.thumbnail((200, 200))
    base_y = 250
    canvas.paste(Image.new("RGBA", mark.size, (20, 21, 22, 255)), (40, base_y - mark.height), mark)
    txt = Image.new("RGBA", (220, 46), (0, 0, 0, 0))
    ImageDraw.Draw(txt).text((0, 0), "Rotozest", fill=(20, 21, 22, 255), font=ImageFont.truetype(FD + "Arial Bold.ttf", 38))
    txt = txt.rotate(90, expand=True)
    canvas.paste(txt, (262, base_y - txt.height), txt)
    cd = ImageDraw.Draw(canvas)
    top = base_y - mark.height
    cd.rounded_rectangle([322, top, 372, base_y], radius=25, outline=(20, 21, 22), width=6)
    cd.rectangle([341, top + 22, 353, base_y - 40], fill=(20, 21, 22))
    cd.polygon([(331, base_y - 44), (363, base_y - 44), (347, base_y - 14)], fill=(20, 21, 22))
    cd.text((8, 274), "<- shaft side          delivery side at the bottom          box side ->", fill=MUTE, font=SM)
    d._image.paste(canvas, (x + 10, y + 64))


def d_offset(d, x, y):
    pen = Pen(d, x + 200, y + 290, 1.9)
    pts = []
    for i in range(0, 361, 3):
        a = math.radians(i)
        X, Y = 51 * math.cos(a), 51 * math.sin(a)
        pts.append((max(-44, min(44, X)), Y))
    pen.poly(pts, STEEL)
    pen.circ(0, 15, 33.5, None, (90, 94, 98), 2)
    pen.circ(0, 15, 8, DARK)
    pen.circ(0, 15, 1.6, BLUE)
    pen.circ(0, 0, 1.6, (200, 60, 60))
    for s in (1, -1):
        pen.rect(s * 41 - (6 if s > 0 else 0), -12, s * 41 + (0 if s > 0 else 6), 12, DARK)
    pen.line(-70, 15, 70, 15, BLUE, 1)
    pen.line(-70, 0, 70, 0, (200, 60, 60), 1)
    pen.label(54, 26, "shaft / drive gear", BLUE)
    pen.label(54, 4, "body axis", (200, 60, 60))
    pen.dim_v(-82, 0, 15, "15")
    pen.label(-60, -64, "ports on the body axis (gear mesh)", MUTE)


panel(1, "Shaft, key and oil seal", "11.png", (0, 150, 520, 560), d_shaft, [
    "!Black-oxide steel shaft Ø16, sticks out 38 mm.",
    "Chamfered tip with a small centre-drill hole (11).",
    "Bright steel key 28 × 5 × 5 with round ends in a keyway on top, outer half (11, 15).",
    "Black rubber oil seal Ø26 flush in the housing end face (11).",
])
panel(2, "Bearing housing", "11.png", (40, 280, 420, 660), d_housing, [
    "!Turned stainless barrel Ø67 × 37 behind the plate.",
    "Flat machined end face, 1.5 mm chamfer on the edge.",
    "!3 tapped holes on Ø52, 120° apart, empty: no screws. (11 + your note; size M8–M10 unsure)",
])
panel(3, "Upright plate (cast iron)", "16.png", (0, 0, 560, 760), d_plate, [
    "!Bigger and bulkier than the pump: arch R70 about the body axis; flanks splay out to a 180 mm foot (16).",
    "15 mm slab + 7 mm raised boss ring on the front (22 overall, photo 15 measured), satin black over rough sand-cast texture. Arch R70.",
    "!PEAR-shaped opening (O over 0): Ø72 round the housing on the shaft axis, Ø40 lobe below (bottom 64 above the floor); the flange face shows through the lobe (11, 15 + your note).",
    "!No nuts and no holes on the front. 2 bolts from the back (hex head + thick washer) on the body axis (port height, 15), z = ±47.5, each in line with the flange's back-face tapped hole: one bolt line through plate and flange (your note).",
    "Shaft axis 120 above the ground; body axis 105.",
])
panel(4, "Base (U-shape)", "16.png", (0, 540, 1000, 1000), d_base, [
    "!One casting: solid across the full width for the first ~48 mm from the plate, then two arms to ~89 mm with an open slot between them (16 close-up + your note).",
    "!4 holes Ø12, 2 per arm, at 12 and 72 from the plate (15, 16, 12-1, 11; confirmed by you).",
    "Each arm ~40 wide × 14 thick; gusset wall along the inner edge of each arm (15, 11, 12-1).",
    "!Gusset on each arm starts from 0 at the arm end and rises gently to ≈34 mm (about the arm width) at the plate. (15, 11 + your note)",
])
panel(5, "Front flange", "15.png", (440, 80, 640, 640), d_flange, [
    "!Turned stainless ring Ø≈108 × 20 (measured on 15 at 4.26 px/mm), larger than the body, hairline joint to the body (15, 16).",
    "On the BODY axis (15 mm below the shaft). Sits against the plate’s raised front ring. Wide 45° chamfer on its back edge. ≈M6 tapped hole each side drilled ALONG the shaft into the flange back face, in the strip beside the flat, at port height (16, 12-1 close-ups).",
    "!No nuts in front. Mounting bolts enter from the plate’s back and thread into the flange (11, 15).",
])
panel(6, "Pump body", "15.png", (560, 100, 820, 640), d_body, [
    "!Round \"O\" Ø102 × 38 with full-length flats on both sides, 88 across flats.",
    "!Flats on both sides carry on across the gear ring. Label on the curved surface just above the flat; port in the flat.",
    "Small ≈M6 tapped hole is in the FRONT FLANGE (radial, at port height, near its back edge), not on the flat (16 close-up).",
    "Logo marking on the round top (see 11).",
])
panel(7, "Ports (×2)", "16.png", (300, 330, 600, 620), d_port, [
    "!¾\" BSP female, Ø24 tapping, ~25 deep, bright machined thread. Centre on the body axis (gear mesh), ~15 below the shaft.",
    "14 TPI (1.81 mm pitch), chamfered entry ~1.3 mm.",
    "Visible spiral thread inside, dark bottom (11, 12-1, 16).",
])
panel(8, "Gear ring and rear cast box", "12-1.png", (120, 150, 700, 620), d_box, [
    "!Gear ring: bright turned, ~14 long, round with the same flats as the body.",
    "!Cast cover flange: ROUND Ø102 with the same flats as the body, 8 thick (round top edge in 16, 11, 12-1). 4 acorn nuts on it at ±30 / ±31 (15 at ~58° elevation), all inside the ring outline.",
    "!Rear cast box ≈48 wide × 72 tall × 29 long, drafted cast sides, chamfered top corners, nameplate ≈38 × 60 on its end face.",
    "!2 small PLAIN holes Ø4, in the cover flange's flat side face, just above the bottom nut (16, 12-1).",
])
panel(9, "Acorn nut set (×4)", "16.png", (540, 140, 720, 320), d_nut, [
    "!M8 acorn (dome) nut, 13 mm across flats, polished stainless.",
    "Thin washer under each nut (~1–1.5 mm); one looks split, so possibly spring washers (12-1).",
    "Domes point towards the nameplate end (16, 12-1).",
])
panel(10, "Nameplate", "16.png", (720, 260, 900, 560), d_plate_txt, [
    "!Black anodised ≈38 × 60, rounded, bonded (no rivets). Table = grid of silver cells with dark text (16).",
    "Real RZ mark at the top (upright), small Rotozest, ROTARY GEAR PUMP full width; MFG. BY : / ROTOZEST INDUSTRIES / INDIA centred below (16).",
])
panel(12, "Assembly end view: shaft offset", "15.png", (180, 120, 980, 640), d_offset, [
    "!The shaft and bearing housing sit ~15 mm ABOVE the body axis (15: housing centre y≈310, body centre y≈375; 11: opening gap tiny on top, big below).",
    "Body, front flange, gear ring, cast box and the plate opening share the body axis. Ports sit on the body axis, where the gears mesh.",
])
panel(11, "Markings", "15.png", (560, 140, 780, 330), d_marks, [
    "!Laser-etched black. RZ mark turned 90° anticlockwise; oblong = mark height; bold arrow to DELIVERY (15, 12-1).",
    "DELIVERY / SUCTION: heavy bold text inside one thick pill outline, ~80% of the flat width (15, 12-1). Double oblong outline: unsure, looks single.",
    "Top block is centred on the body between flange and box.",
    "Labels read correctly from their own side.",
])

# ---------------------------------------------------------------- compose
cols = 2
rows = math.ceil(len(panels) / cols)
PW = W // cols
sheet = Image.new("RGB", (W, 120 + rows * PH), "white")
d = ImageDraw.Draw(sheet)
d._image = sheet
d.text((28, 26), "Rotozest SS rotary gear pump: component sheet (to confirm before 3D modelling)", fill=INK, font=T)
d.text((28, 66), "Each panel: photo evidence (left), drawing with sizes in mm (middle), confirmed features (bottom). Sizes ±5%. Reply with the panel number and any correction.", fill=MUTE, font=TX)
for i, (num, title, src, crop, fn, lines) in enumerate(panels):
    x = (i % cols) * PW
    y = 110 + (i // cols) * PH
    d.rectangle([x + 12, y, x + PW - 12, y + PH - 14], outline=LINE, width=2)
    d.text((x + 28, y + 14), f"{num}. {title}", fill=INK, font=H2)
    d.text((x + 28, y + 36), f"photo {src.replace('.png', '')}", fill=BLUE, font=SM)
    sheet.paste(photo(src, crop, 240), (x + 28, y + 62))
    # drawing on its own canvas, trimmed and fitted into the slot right of the photo
    sub = Image.new("RGB", (1500, 900), "white")
    sd = ImageDraw.Draw(sub)
    sd._image = sub
    fn(sd, 220, 40)
    bbox = Image.eval(sub.convert("L"), lambda v: 255 - v).getbbox()
    if bbox:
        sub = sub.crop((max(bbox[0] - 8, 0), max(bbox[1] - 8, 0), bbox[2] + 8, bbox[3] + 8))
    slot_w, slot_h = PW - 330, 300
    sub.thumbnail((slot_w, slot_h))
    sheet.paste(sub, (x + 290 + (slot_w - sub.width) // 2, y + 56 + (slot_h - sub.height) // 2))
    notes(d, x + 28, y + 380, lines, w=PW - 80)
sheet.save("docs/3d-review/component-sheet.png", optimize=True)
print(sheet.size)
