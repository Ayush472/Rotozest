// Procedural 3D model of the Rotozest SS rotary gear pump, L foot-mount version.
// Every part follows docs/3d-pump-spec.md, which records which product photo confirms it.
// Holes are really cut (CSG), ports carry a modelled BSP thread, and the render uses studio
// reflections, ground-truth ambient occlusion and MSAA. 1 scene unit = 100 mm.
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { GTAOPass } from "three/examples/jsm/postprocessing/GTAOPass.js";
import { OutputPass } from "three/examples/jsm/postprocessing/OutputPass.js";
import { toCreasedNormals } from "three/examples/jsm/utils/BufferGeometryUtils.js";
import { Brush, Evaluator, SUBTRACTION } from "three-bvh-csg";

const MM = 0.01;
const H = 105; // body axis height above the floor (mm): body, flange, gear ring, box, plate opening
const HS = 120; // shaft / bearing-housing axis, 15 mm above the body axis (component sheet panel 12)
const SEG = 160; // radial segments for turned parts
const CSG_SEG = 96; // turned parts that get holes cut (CSG cost scales with triangles)

// ============================================================ textures
function canvasTexture(w: number, h: number, draw: (c: CanvasRenderingContext2D) => void, srgb = true) {
  const cv = document.createElement("canvas");
  cv.width = w;
  cv.height = h;
  draw(cv.getContext("2d")!);
  const t = new THREE.CanvasTexture(cv);
  if (srgb) t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 8;
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  return t;
}
const rnd = (a: number, b: number) => a + Math.random() * (b - a);

/** Lathe turning marks: thin rings around the part. */
function turningMarks() {
  return canvasTexture(
    16,
    2048,
    (c) => {
      for (let y = 0; y < 2048; y++) {
        const g = 70 + Math.random() * 26 + (Math.random() < 0.03 ? 30 : 0);
        c.fillStyle = `rgb(${g},${g},${g})`;
        c.fillRect(0, y, 16, 1);
      }
    },
    false,
  );
}

/** Investment-cast / bead-blasted stainless: fine even grain. */
function castGrain(scale = 1) {
  const t = canvasTexture(
    512,
    512,
    (c) => {
      const img = c.createImageData(512, 512);
      for (let i = 0; i < img.data.length; i += 4) {
        const v = 128 + rnd(-38, 38);
        img.data[i] = img.data[i + 1] = img.data[i + 2] = v;
        img.data[i + 3] = 255;
      }
      c.putImageData(img, 0, 0);
      c.filter = "blur(0.8px)";
      c.drawImage(c.canvas, 0, 0);
    },
    false,
  );
  t.repeat.set(scale, scale);
  return t;
}

/** Sand-cast iron under black paint: lumpy with pits and runs. */
function castIronBump() {
  const t = canvasTexture(
    1024,
    1024,
    (c) => {
      const img = c.createImageData(1024, 1024);
      for (let i = 0; i < img.data.length; i += 4) {
        const v = 128 + rnd(-30, 30);
        img.data[i] = img.data[i + 1] = img.data[i + 2] = v;
        img.data[i + 3] = 255;
      }
      c.putImageData(img, 0, 0);
      c.filter = "blur(3px)";
      c.drawImage(c.canvas, 0, 0);
      c.filter = "none";
      for (let i = 0; i < 2600; i++) {
        const r = rnd(1, 7);
        const g = c.createRadialGradient(0, 0, 0, 0, 0, r);
        g.addColorStop(0, Math.random() < 0.6 ? "rgba(255,255,255,0.35)" : "rgba(0,0,0,0.45)");
        g.addColorStop(1, "rgba(128,128,128,0)");
        c.save();
        c.translate(rnd(0, 1024), rnd(0, 1024));
        c.fillStyle = g;
        c.beginPath();
        c.arc(0, 0, r, 0, Math.PI * 2);
        c.fill();
        c.restore();
      }
    },
    false,
  );
  t.repeat.set(2.5, 2.5);
  return t;
}

function makeMaterials() {
  const turn = turningMarks();
  const castSS = castGrain(3);
  const iron = castIronBump();
  return {
    // turned SS 304/316 (flange, body, gear ring, housing): bright with fine rings
    turned: new THREE.MeshPhysicalMaterial({ color: 0xd9dcdf, metalness: 1, roughness: 0.34, roughnessMap: turn, anisotropy: 0.15, anisotropyRotation: Math.PI / 2, envMapIntensity: 0.85 }),
    // investment-cast / bead-blasted rear cover: light, diffuse grey, brighter than the turned flats at 3/4 views (16, 12-1)
    castSS: new THREE.MeshPhysicalMaterial({ color: 0x9a9b98, metalness: 0.65, roughness: 0.66, bumpMap: castSS, bumpScale: 1.4, envMapIntensity: 0.75 }),
    fastener: new THREE.MeshPhysicalMaterial({ color: 0xd6d8da, metalness: 1, roughness: 0.28, envMapIntensity: 0.85 }),
    zinc: new THREE.MeshPhysicalMaterial({ color: 0xc8c9c4, metalness: 1, roughness: 0.3 }),
    thread: new THREE.MeshPhysicalMaterial({ color: 0x9a9da0, metalness: 1, roughness: 0.32, side: THREE.DoubleSide }),
    bore: new THREE.MeshPhysicalMaterial({ color: 0x45484b, metalness: 1, roughness: 0.5, side: THREE.DoubleSide }),
    shaft: new THREE.MeshPhysicalMaterial({ color: 0x2b2d30, metalness: 0.9, roughness: 0.3, roughnessMap: turn }),
    key: new THREE.MeshPhysicalMaterial({ color: 0xc6c8ca, metalness: 1, roughness: 0.22 }),
    rubber: new THREE.MeshStandardMaterial({ color: 0x101010, metalness: 0, roughness: 0.75 }),
    // painted cast-iron bracket: satin black over a rough casting
    iron: new THREE.MeshPhysicalMaterial({ color: 0x040405, metalness: 0.05, roughness: 0.42, bumpMap: iron, bumpScale: 4, clearcoat: 0.6, clearcoatRoughness: 0.3, envMapIntensity: 0.4 }),
    dark: new THREE.MeshStandardMaterial({ color: 0x050505, metalness: 0.2, roughness: 0.8, side: THREE.DoubleSide }),
  };
}
type Mats = ReturnType<typeof makeMaterials>;

// ============================================================ geometry helpers
/** Lathe solid around the shaft axis (X). `pts` = [radius, x] in mm, from the axis back to the axis. */
function latheGeo(pts: [number, number][], segs = SEG, axisY = H) {
  const g = new THREE.LatheGeometry(pts.map(([r, x]) => new THREE.Vector2(r * MM, x * MM)), segs);
  g.rotateZ(-Math.PI / 2); // lathe axis Y → X
  g.translate(0, axisY * MM, 0);
  return toCreasedNormals(g, Math.PI / 6);
}

/** Chamfered band: radius r from x0 to x1. */
function band(r: number, x0: number, x1: number, ch = 1): [number, number][] {
  return [
    [r - ch, x0],
    [r, x0 + ch],
    [r, x1 - ch],
    [r - ch, x1],
  ];
}

function roundedRect(w: number, h: number, r: number) {
  const s = new THREE.Shape();
  const x = -w / 2, y = -h / 2;
  s.moveTo(x + r, y);
  s.lineTo(x + w - r, y);
  s.absarc(x + w - r, y + r, r, -Math.PI / 2, 0, false);
  s.lineTo(x + w, y + h - r);
  s.absarc(x + w - r, y + h - r, r, 0, Math.PI / 2, false);
  s.lineTo(x + r, y + h);
  s.absarc(x + r, y + h - r, r, Math.PI / 2, Math.PI, false);
  s.lineTo(x, y + r);
  s.absarc(x + r, y + r, r, Math.PI, Math.PI * 1.5, false);
  return s;
}

const hole = (cx: number, cy: number, r: number) => {
  const p = new THREE.Path();
  p.absarc(cx, cy, r, 0, Math.PI * 2, true);
  return p;
};

/** Extrude with rounded edges on both faces. Shape in XY (mm), extruded along +Z by `depth`. */
function slabGeo(shape: THREE.Shape, depth: number, bevel: number, curveSegments = 48) {
  const g = new THREE.ExtrudeGeometry(shape, { depth: Math.max(depth - 2 * bevel, 0.2), bevelEnabled: true, bevelThickness: bevel, bevelSize: bevel, bevelOffset: -bevel, bevelSegments: 6, curveSegments });
  g.translate(0, 0, bevel);
  g.scale(MM, MM, MM);
  g.computeVertexNormals();
  return g;
}

/** Cylinder along an axis (mm), for CSG cutting. */
function rod(r: number, len: number, axis: "x" | "y" | "z", at: [number, number, number], segs = 64) {
  const g = new THREE.CylinderGeometry(r * MM, r * MM, len * MM, segs);
  if (axis === "x") g.rotateZ(Math.PI / 2);
  if (axis === "z") g.rotateX(Math.PI / 2);
  g.translate(at[0] * MM, at[1] * MM, at[2] * MM);
  return g;
}

function box(w: number, h: number, d: number, at: [number, number, number]) {
  return new THREE.BoxGeometry(w * MM, h * MM, d * MM).translate(at[0] * MM, at[1] * MM, at[2] * MM);
}

const evaluator = new Evaluator();
evaluator.attributes = ["position", "normal", "uv"];
/** Subtract each cutter from `base`, return a mesh. */
function cut(base: THREE.BufferGeometry, cutters: THREE.BufferGeometry[], mat: THREE.Material) {
  const clean = (g: THREE.BufferGeometry) => {
    const n = g.index ? g.toNonIndexed() : g;
    for (const k of Object.keys(n.attributes)) if (!["position", "normal", "uv"].includes(k)) n.deleteAttribute(k);
    n.clearGroups();
    return n;
  };
  let acc = new Brush(clean(base));
  acc.updateMatrixWorld();
  for (const c of cutters) {
    const b = new Brush(clean(c));
    b.updateMatrixWorld();
    acc = evaluator.evaluate(acc, b, SUBTRACTION);
  }
  return new THREE.Mesh(acc.geometry, mat);
}

/** Hex nut or bolt head with chamfered crown, axis +Y, sitting on y=0. */
function hexHead(af: number, h: number, mat: THREE.Material) {
  const R = af / Math.sqrt(3);
  const g = new THREE.Group();
  const flat = (geo: THREE.BufferGeometry) => {
    const n = geo.toNonIndexed();
    n.computeVertexNormals(); // crisp hex flats, not a barrel
    return n;
  };
  g.add(new THREE.Mesh(flat(new THREE.CylinderGeometry(R * MM, R * MM, (h - 1) * MM, 6).translate(0, ((h - 1) / 2) * MM, 0)), mat));
  g.add(new THREE.Mesh(flat(new THREE.CylinderGeometry(af * 0.47 * MM, R * MM, 1 * MM, 6).translate(0, (h - 0.5) * MM, 0)), mat));
  return g;
}

function washer(od: number, id: number, t: number, mat: THREE.Material) {
  const pts: [number, number][] = [[id / 2, 0], [od / 2 - 0.4, 0], [od / 2, 0.4], [od / 2, t - 0.4], [od / 2 - 0.4, t], [id / 2, t], [id / 2, 0]];
  return new THREE.Mesh(new THREE.LatheGeometry(pts.map(([r, y]) => new THREE.Vector2(r * MM, y * MM)), 48), mat);
}

/** Acorn (dome cap) nut: washer, hex, dome. Axis +Y. */
function acornNut(mat: THREE.Material) {
  const g = new THREE.Group();
  g.add(washer(17, 8, 1.6, mat));
  const hex = hexHead(13, 7.2, mat);
  hex.position.y = 1.6 * MM;
  const dome: THREE.Vector2[] = [new THREE.Vector2(0, 0)];
  for (let i = 0; i <= 20; i++) {
    const a = (i / 20) * (Math.PI / 2);
    dome.push(new THREE.Vector2(Math.cos(a) * 6.3 * MM, Math.sin(a) * 6.6 * MM));
  }
  const d = new THREE.Mesh(new THREE.LatheGeometry(dome.reverse(), 48), mat);
  d.position.y = 8.8 * MM;
  const neck = new THREE.Mesh(new THREE.CylinderGeometry(6.3 * MM, 6.3 * MM, 1 * MM, 48), mat);
  neck.position.y = 8.6 * MM;
  g.add(hex, neck, d);
  return g;
}

/** Point a +Y object along `dir` and move it (mm). */
function place(o: THREE.Object3D, pos: [number, number, number], dir: THREE.Vector3) {
  o.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir.clone().normalize());
  o.position.set(pos[0] * MM, pos[1] * MM, pos[2] * MM);
  return o;
}

/** Internal thread: a helical crest just inside a bore wall, going down -Y from the face. */
function spiral(boreR: number, depth: number, pitch: number, crest: number, m: Mats) {
  const turns = depth / pitch - 0.6, pts: THREE.Vector3[] = [];
  for (let i = 0; i <= turns * 48; i++) {
    const a = (i / 48) * Math.PI * 2;
    pts.push(new THREE.Vector3(Math.cos(a) * (boreR - crest * 0.3) * MM, (-1 - (i / 48) * pitch) * MM, Math.sin(a) * (boreR - crest * 0.3) * MM));
  }
  return new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), Math.round(turns * 64), crest * MM, 5, false), m.thread);
}
/** ¾" BSP female thread, 14 TPI. */
const bspThread = (boreR: number, depth: number, m: Mats) => spiral(boreR, depth, 25.4 / 14, 0.62, m);

/** Bore wall + dark floor for a drilled hole, axis +Y, depth going down -Y. */
function boreLiner(r: number, depth: number, m: Mats) {
  const g = new THREE.Group();
  g.add(new THREE.Mesh(new THREE.CylinderGeometry(r * MM, r * MM, depth * MM, 48, 1, true).translate(0, (-depth / 2) * MM, 0), m.bore));
  g.add(new THREE.Mesh(new THREE.CircleGeometry(r * MM, 48).rotateX(-Math.PI / 2).translate(0, -depth * MM, 0), m.dark));
  return g;
}

// ============================================================ decals
function decalMat(tex: THREE.Texture, opts: Partial<THREE.MeshPhysicalMaterialParameters> = {}) {
  // laser-etched ink: matte, non-metallic, so the black stays black under the softbox (photos 15, 16, 11)
  return new THREE.MeshPhysicalMaterial({ map: tex, transparent: true, metalness: 0, roughness: 0.9, specularIntensity: 0.1, envMapIntensity: 0.12, polygonOffset: true, polygonOffsetFactor: -8, depthWrite: false, ...opts });
}

/** Label wrapped on the body cylinder. Canvas X = round the circumference, canvas Y = along the shaft. */
function wrapLabel(tex: THREE.Texture, r: number, x: number, lenX: number, angleCenter: number, arc: number) {
  const g = new THREE.CylinderGeometry(r * MM, r * MM, lenX * MM, 64, 1, true, angleCenter - arc / 2, arc);
  g.rotateZ(-Math.PI / 2);
  g.translate(x * MM, H * MM, 0);
  return new THREE.Mesh(g, decalMat(tex));
}

/** Canvas drawn so text reads along the shaft (DELIVERY / SUCTION). */
function alongShaft(len: number, across: number, draw: (c: CanvasRenderingContext2D, W: number, Hh: number) => void, flip = false) {
  return canvasTexture(across, len, (c) => {
    c.translate(across / 2, len / 2);
    c.rotate(flip ? Math.PI / 2 : -Math.PI / 2); // flip: reads correctly from the -Z (suction) side
    c.translate(-len / 2, -across / 2);
    draw(c, len, across);
  });
}

const ETCH = "#0a0a0a";
function ovalLabel(text: string, flip = false) {
  return alongShaft(
    1600,
    500,
    (c, W, Hh) => {
      c.strokeStyle = ETCH;
      c.lineWidth = 40;
      c.beginPath();
      c.roundRect(24, 24, W - 48, Hh - 48, (Hh - 48) / 2);
      c.stroke();
      c.fillStyle = ETCH;
      c.font = "900 300px 'Arial Black', Arial, Helvetica, sans-serif";
      c.textAlign = "center";
      c.textBaseline = "middle";
      c.fillText(text, W / 2, Hh / 2 + 14, W - 240);
    },
    flip,
  );
}

/** Top marking (component sheet panel 11, photos 15 / 12-1), seen from the delivery side:
 *  RZ mark turned 90° anticlockwise, "Rotozest" reading bottom → top, oblong (mark height) with a bold
 *  arrow towards DELIVERY; bottoms aligned. Drawn in a "photo frame" (right = +X, up = towards -Z), rotated in. */
function topMark(logo: HTMLImageElement | null) {
  const W = 1100, Hh = 2000;
  return canvasTexture(W, Hh, (c) => {
    c.clearRect(0, 0, W, Hh);
    c.translate(W / 2, Hh / 2);
    c.rotate(-Math.PI / 2); // photo frame: Hh wide, W tall, origin centre
    // the group spans ~34 of the body's 38 mm in photo 15 (was ~22): draw 1.45× larger, centred
    c.scale(1.45, 1.45);
    c.translate(150, -10);
    const base = 330; // common bottom line (photo frame y grows downward)
    const mh = 640; // mark height after rotation
    if (logo) {
      const off = markCanvas(logo, mh, ETCH);
      // rotate the mark 90° anticlockwise, bottom on the common line
      c.save();
      c.translate(-470, base - off.width / 2);
      c.rotate(-Math.PI / 2);
      c.drawImage(off, -off.width / 2, -off.height / 2);
      c.restore();
    }
    c.save();
    c.translate(130, base - 300);
    c.rotate(-Math.PI / 2);
    c.fillStyle = ETCH;
    c.font = "bold 170px Arial, Helvetica, sans-serif";
    c.textAlign = "center";
    c.textBaseline = "middle";
    c.fillText("Rotozest", 0, 0);
    c.restore();
    const ox = 300, ow = 190, top = base - 600;
    c.strokeStyle = ETCH;
    c.lineWidth = 26;
    c.beginPath();
    c.roundRect(ox, top, ow, base - top, ow / 2);
    c.stroke();
    c.fillStyle = ETCH;
    c.fillRect(ox + ow / 2 - 22, top + 80, 44, base - top - 230);
    c.beginPath();
    c.moveTo(ox + ow / 2 - 62, base - 160);
    c.lineTo(ox + ow / 2 + 62, base - 160);
    c.lineTo(ox + ow / 2, base - 60);
    c.closePath();
    c.fill();
  });
}

/** Black anodised nameplate (panel 10): real RZ mark, silver lettering, 2-column grid of silver cells with dark text. */
function nameplate(logo: HTMLImageElement | null) {
  return canvasTexture(600, 948, (c) => {
    const SIL = "#c8c8c8", INK = "#151617", W = 600;
    c.clearRect(0, 0, 600, 948);
    c.fillStyle = "#0b0c0d";
    c.beginPath();
    c.roundRect(0, 0, 600, 948, 40);
    c.fill();
    c.strokeStyle = SIL; // thin bright rim (photo 16)
    c.lineWidth = 8;
    c.beginPath();
    c.roundRect(10, 10, 580, 928, 32);
    c.stroke();
    if (logo) {
      const off = markCanvas(logo, 160, SIL); // mark ≈17% of the plate height (photo 16)
      c.drawImage(off, (W - off.width) / 2, 30);
    }
    c.fillStyle = SIL;
    c.textAlign = "center";
    c.font = "bold 28px Arial, Helvetica, sans-serif";
    c.fillText("Rotozest", W / 2, 222);
    c.font = "bold 46px Arial, Helvetica, sans-serif";
    c.fillText("ROTARY GEAR PUMP", W / 2, 272, W - 60);
    const rows: [string, string][] = [["MODEL", "RZSS-075"], ["SIZE", '¾"X¾"BSP'], ["FLOW", "33.33 LPM"], ["PRESS", "10 kg/cm²"], ["SPEED", "1440 RPM"], ["SR.NO.", ""]];
    const x0 = 36, x1 = W - 36, xm = x0 + Math.round((x1 - x0) * 0.4);
    let y = 292;
    for (const [k, v] of rows) {
      c.fillStyle = SIL;
      c.fillRect(x0, y, xm - x0 - 6, 64);
      c.fillRect(xm + 6, y, x1 - xm - 6, 64);
      c.fillStyle = INK;
      c.textAlign = "left";
      c.font = "bold 46px Arial, Helvetica, sans-serif"; // text fills ~70% of the cell (photo 16)
      c.fillText(k, x0 + 10, y + 49, xm - x0 - 26);
      c.fillText(v, xm + 16, y + 49, x1 - xm - 26);
      y += 72;
    }
    c.fillStyle = SIL;
    c.textAlign = "center";
    c.font = "32px Arial, Helvetica, sans-serif";
    c.fillText("MFG. BY :", W / 2, y + 44);
    c.font = "bold 34px Arial, Helvetica, sans-serif";
    c.fillText("ROTOZEST INDUSTRIES", W / 2, y + 90, W - 70);
    c.font = "32px Arial, Helvetica, sans-serif";
    c.fillText("INDIA", W / 2, y + 134);
  });
}

/** The RZ mark alone from the logo SVG (viewBox 3200 × 868): x 0–864, minus the wordmark's first letter (x>770, y>500). */
function markCanvas(logo: HTMLImageElement, h: number, fill: string) {
  const sw = 864, sh = 868, k = h / sh;
  const off = document.createElement("canvas");
  off.width = Math.ceil(sw * k);
  off.height = h;
  const o = off.getContext("2d")!;
  o.drawImage(logo, 0, 0, sw * ((logo.naturalWidth || 3200) / 3200), sh * ((logo.naturalHeight || 868) / 868), 0, 0, off.width, off.height);
  o.clearRect(772 * k, 500 * k, off.width, off.height);
  o.globalCompositeOperation = "source-in";
  o.fillStyle = fill;
  o.fillRect(0, 0, off.width, off.height);
  return off;
}

function loadImage(src: string) {
  return new Promise<HTMLImageElement | null>((res) => {
    const im = new Image();
    im.onload = () => res(im);
    im.onerror = () => res(null);
    im.src = src;
  });
}

// ============================================================ the pump (docs/3d-pump-spec.md + docs/3d-review/component-sheet.png)
// X along the shaft, +X towards the rear box. Plate front face at x = 0. +Z = DELIVERY side.
// Two axes: the shaft / bearing housing at HS = 120 mm, everything else on the body axis H = 105 mm.
async function buildPump(m: Mats) {
  const root = new THREE.Group();
  const [logoWhite, logoBlue] = await Promise.all([loadImage("/images/rotozest-logo-white.svg?v=2"), loadImage("/images/rotozest-logo.svg?v=2")]);
  const X = new THREE.Vector3(1, 0, 0), NX = new THREE.Vector3(-1, 0, 0);

  // ---------- Upright plate (panel 3): 22 thick, arch R70 about the body axis, flanks splay to a 180 foot ----------
  const R = 70, BW = 90;
  const tangent = (side: 1 | -1) => {
    const px = side * BW, py = -H, d = Math.hypot(px, py), a = Math.atan2(py, px), b = Math.acos(R / d);
    const t = a + side * b;
    return { x: Math.cos(t) * R, y: H + Math.sin(t) * R, ang: t };
  };
  const tl = tangent(-1), tr = tangent(1);
  const plateShape = new THREE.Shape();
  plateShape.moveTo(-BW, 0);
  plateShape.lineTo(BW, 0);
  plateShape.lineTo(tr.x, tr.y);
  plateShape.absarc(0, H, R, tr.ang, tl.ang + Math.PI * 2, false);
  plateShape.lineTo(-BW, 0);
  // PEAR-shaped opening ("O" over "0", photos 11, 15): a Ø72 circle hugging the Ø67 housing on the shaft axis
  // (~2.5 mm dark gap on top), merged by tangents into a Ø40 lobe below whose bottom is 64 above the floor;
  // the flange's front face shows through the lobe (photo 11).
  const pear = (dy: number) => {
    const yA = HS - dy, rA = 36, yB = 84 - dy, rB = 20, al = Math.asin((rA - rB) / (yA - yB));
    const p = new THREE.Path();
    p.moveTo(rA * Math.cos(al), yA + rA * Math.sin(al));
    p.absarc(0, yA, rA, al, Math.PI - al, false);
    p.lineTo(-rB * Math.cos(al), yB + rB * Math.sin(al));
    p.absarc(0, yB, rB, Math.PI - al, Math.PI * 2 + al, false);
    p.lineTo(rA * Math.cos(al), yA + rA * Math.sin(al));
    return p;
  };
  plateShape.holes.push(pear(0));
  // 2 bolts from the back at the SAME height, on the body axis (port height, photo 15), each in line with the tapped
  // hole that shows on the flange's back face beside the flat (z = ±47.5): one bolt line through plate and flange.
  // Washer edge sits close to the pear opening (photo 11).
  const BOLT_R = 47.5, BOLTS = [0, 180].map((d) => (d * Math.PI) / 180);
  const boltAt = (a: number): [number, number] => [BOLT_R * Math.cos(a), H + BOLT_R * Math.sin(a)];
  for (const a of BOLTS) {
    const [z, y] = boltAt(a);
    plateShape.holes.push(hole(z, y, 4.6));
  }
  const plate = new THREE.Mesh(slabGeo(plateShape, 15, 3, 72), m.iron);
  plate.rotation.y = -Math.PI / 2; // shape → ZY plane, extrude towards -X: slab from x −22 to −7
  plate.position.x = -7 * MM;
  root.add(plate);
  // raised cast ring on the front face, round the flange (15, 16, 12-1)
  {
    const s = new THREE.Shape();
    s.absarc(0, 0, 62, 0, Math.PI * 2, false);
    s.holes.push(pear(H)); // no bolt holes on the front: bolts are blind into the flange (photo 12-1)
    const ring = new THREE.Mesh(slabGeo(s, 7, 1.6, 72), m.iron); // boss x −7 → 0
    ring.rotation.y = Math.PI / 2;
    ring.position.set(-7 * MM, H * MM, 0);
    root.add(ring);
  }
  // bolts from the back: hex head + thick washer (11, 15); no nuts on the front
  for (const a of BOLTS) {
    const [z, y] = boltAt(a);
    root.add(place(washer(22, 9.5, 2.6, m.zinc), [-22, y, z], NX));
    root.add(place(hexHead(13, 6.5, m.zinc), [-24.6, y, z], NX));
  }

  // ---------- Base (panel 4 + photo 16 close-up): one casting, solid for the first half from the plate,
  // then split into two arms with an open slot; 4 holes (2 per arm); gusset along each arm's inner edge ----------
  const AW = 44, SLOT = 92, BL = 89, T = 14, SPLIT = 48, HW = SLOT / 2 + AW, r = 6;
  const base = new THREE.Shape();
  base.moveTo(-22, -HW);
  base.lineTo(BL - r, -HW);
  base.quadraticCurveTo(BL, -HW, BL, -HW + r);
  base.lineTo(BL, -SLOT / 2 - r);
  base.quadraticCurveTo(BL, -SLOT / 2, BL - r, -SLOT / 2);
  base.lineTo(SPLIT + 8, -SLOT / 2); // slot runs back to SPLIT with rounded inner corners
  base.quadraticCurveTo(SPLIT, -SLOT / 2, SPLIT, -SLOT / 2 + 8);
  base.lineTo(SPLIT, SLOT / 2 - 8);
  base.quadraticCurveTo(SPLIT, SLOT / 2, SPLIT + 8, SLOT / 2);
  base.lineTo(BL - r, SLOT / 2);
  base.quadraticCurveTo(BL, SLOT / 2, BL, SLOT / 2 + r);
  base.lineTo(BL, HW - r);
  base.quadraticCurveTo(BL, HW, BL - r, HW);
  base.lineTo(-22, HW);
  base.lineTo(-22, -HW);
  for (const s of [1, -1]) for (const x of [12, 72]) base.holes.push(hole(x, s * (SLOT / 2 + AW / 2), 6));
  {
    const g = slabGeo(base, T, 2.4, 32);
    g.rotateX(Math.PI / 2); // shape XY → XZ, extrude downward
    g.translate(0, T * MM, 0);
    root.add(new THREE.Mesh(g, m.iron));
  }
  for (const side of [1, -1] as const) {
    // gusset wall along the inner edge of each arm: 34 high at the plate, 0 at the arm end
    const gs = new THREE.Shape();
    gs.moveTo(0, T - 1);
    gs.lineTo(BL - 4, T - 1);
    gs.quadraticCurveTo(BL * 0.5, T + 6, 0, 34);
    gs.lineTo(0, T - 1);
    const gg = slabGeo(gs, 9, 1.6, 24);
    const zIn = (side * SLOT) / 2;
    gg.translate(0, 0, (side > 0 ? zIn : zIn - 9) * MM);
    root.add(new THREE.Mesh(gg, m.iron));
  }

  // ---------- Shaft, key, oil seal, bearing housing (panels 1, 2) on the SHAFT axis ----------
  const HX0 = -59; // housing end face
  root.add(cut(latheGeo([[0, HX0 - 38], [6.6, HX0 - 38], [8, HX0 - 36.6], [8, HX0], [0, HX0]], 96, HS), [box(30, 3.2, 5.2, [HX0 - 20, HS + 7.2, 0]), rod(1.5, 4, "x", [HX0 - 38, HS, 0], 24)], m.shaft));
  {
    const g = slabGeo(roundedRect(28, 5, 2.5), 4.6, 0.5, 16);
    g.rotateX(-Math.PI / 2);
    g.translate((HX0 - 20) * MM, (HS + 5.6) * MM, 0);
    root.add(new THREE.Mesh(g, m.key));
  }
  root.add(new THREE.Mesh(latheGeo([[8, HX0 - 0.6], [13, HX0 - 0.6], [13, HX0 + 1], [8, HX0 + 1]], 64, HS), m.rubber));
  const endHoles = [90, 210, 330].map((d) => (d * Math.PI) / 180);
  root.add(
    cut(
      latheGeo([[8.1, HX0], [12.8, HX0], [13.2, HX0 + 0.8], [32, HX0 + 0.8], [33.5, HX0 + 2.3], [33.5, 5], [8.1, 5]], CSG_SEG, HS),
      endHoles.map((a) => rod(5, 16, "x", [HX0 + 6, HS + 26 * Math.sin(a), 26 * Math.cos(a)], 32)),
      m.turned,
    ),
  );
  for (const a of endHoles) root.add(place(boreLiner(4.95, 12, m), [HX0 + 0.8, HS + 26 * Math.sin(a), 26 * Math.cos(a)], NX));

  // ---------- Front flange (panel 5) on the body axis: Ø108 × 25, groove ----------
  const FX0 = 0, FX1 = 20;
  // ≈M6 tapped hole drilled ALONG the shaft into the flange's back face, in the strip left exposed beside each flat
  // (outside z = ±44), at port height, opening towards the body, with a small countersink (photos 16, 12-1 close-ups)
  const FTAP_Z = BOLT_R; // same line as the plate bolt
  root.add(
    cut(
      latheGeo([[0, FX0], [52.4, FX0], [54, FX0 + 1.6], [54, FX1 - 3], [51, FX1], [0, FX1]], CSG_SEG),
      [1, -1].flatMap((s) => [
        rod(2.9, 22, "x", [FX1, H, s * FTAP_Z], 24),
        (() => { const g = new THREE.CylinderGeometry(4 * MM, 2.9 * MM, 1.1 * MM, 24); g.rotateZ(-Math.PI / 2); g.translate((FX1 - 0.55) * MM, H * MM, s * FTAP_Z * MM); return g; })(),
      ]),
      m.turned,
    ),
  );
  for (const s of [1, -1] as const) {
    const ft = boreLiner(2.9, 10, m);
    ft.add(spiral(2.9, 9, 1.0, 0.36, m));
    root.add(place(ft, [FX1 - 1.1, H, s * FTAP_Z], X));
  }
  // hairline joint between flange and body, trimmed by the flats so it doesn't cover the exposed strip
  root.add(cut(latheGeo([[0, FX1], [50.4, FX1], [50.4, FX1 + 0.6], [0, FX1 + 0.6]], 96), [1, -1].map((s) => box(4, 70, 20, [FX1 + 0.3, H, s * 54])), m.dark));

  // ---------- Body + gear ring (panels 6, 7, 8): round with flats both sides, ports on the body axis ----------
  const BX0 = FX1 + 0.6, BX1 = BX0 + 38, GX0 = BX1 + 0.6, GX1 = GX0 + 14, FLAT = 44, PX = BX0 + 19;
  const flatCut = (s: 1 | -1) => box(GX1 - BX0 + 2, 70, 20, [(BX0 + GX1) / 2, H, s * (FLAT + 10)]);
  const portCut = (s: 1 | -1) => rod(12.2, 40, "z", [PX, H, s * 36], 64);
  const chamfer = (s: 1 | -1) => {
    const g = new THREE.CylinderGeometry(14.8 * MM, 12.2 * MM, 3 * MM, 64);
    g.rotateX(s * (Math.PI / 2));
    g.translate(PX * MM, H * MM, s * (FLAT - 1.4) * MM);
    return g;
  };
  root.add(cut(latheGeo([[0, BX0], ...band(51, BX0, BX1, 1.2), [0, BX1]], CSG_SEG), [flatCut(1), flatCut(-1), portCut(1), portCut(-1), chamfer(1), chamfer(-1)], m.turned));
  root.add(cut(latheGeo([[0, BX1], [50.4, BX1], [50.4, GX0], [0, GX0]], 96), [flatCut(1), flatCut(-1)], m.dark));
  root.add(cut(latheGeo([[0, GX0], ...band(51, GX0, GX1, 1), [0, GX1]], CSG_SEG), [flatCut(1), flatCut(-1)], m.turned));
  for (const s of [1, -1] as const) {
    const dir = new THREE.Vector3(0, 0, s);
    const port = boreLiner(12.15, 26, m);
    port.add(bspThread(12.15, 22, m));
    root.add(place(port, [PX, H, s * FLAT], dir));
  }

  // Markings: DELIVERY / SUCTION on the curve just above each flat; logo block on top (panel 11).
  root.add(wrapLabel(ovalLabel("DELIVERY"), 51.12, PX, 34, -0.7, 0.21));
  root.add(wrapLabel(ovalLabel("SUCTION", true), 51.12, PX, 34, Math.PI + 0.7, 0.21));
  root.add(wrapLabel(topMark(logoBlue), 51.12, PX, 37, -Math.PI / 2, 0.62));

  // ---------- Rear cast cover (panel 8): round cast flange Ø104 × 8 with the same flats as the body (round top edge in
  // photos 16, 11, 12-1), 4 acorn nuts near its corners; nameplate box 48 × 72 × 21 on top ----------
  const CF0 = GX1, CF1 = GX1 + 8, CX0 = CF1, CX1 = CF1 + 21, NUTZ = 30, NUTY = 31;
  {
    const RC = 51;
    const shape = new THREE.Shape();
    const yf = Math.sqrt(RC * RC - FLAT * FLAT);
    shape.moveTo(FLAT, -yf);
    shape.lineTo(FLAT, yf);
    shape.absarc(0, 0, RC, Math.atan2(yf, FLAT), Math.atan2(yf, -FLAT), false);
    shape.lineTo(-FLAT, -yf);
    shape.absarc(0, 0, RC, Math.atan2(-yf, -FLAT), Math.atan2(-yf, FLAT) + Math.PI * 2, false);
    const coverFlange = new THREE.Mesh(slabGeo(shape, 8, 1.6, 96), m.castSS);
    coverFlange.rotation.y = Math.PI / 2;
    coverFlange.position.set(CF0 * MM, H * MM, 0);
    root.add(coverFlange);
  }
  const castBox = new THREE.Mesh(slabGeo(roundedRect(48, 72, 8), 21, 4, 32), m.castSS);
  castBox.rotation.y = Math.PI / 2;
  castBox.position.set(CX0 * MM, H * MM, 0);
  root.add(castBox);
  // small plain hole in the cover flange's flat side face, just above the bottom nut (16, 12-1)
  for (const s of [1, -1]) root.add(place(boreLiner(2, 6, m), [(CF0 + CF1) / 2, H - 19, s * (FLAT + 0.05)], new THREE.Vector3(0, 0, s)));
  for (const [zs, ys] of [[1, 1], [1, -1], [-1, 1], [-1, -1]]) root.add(place(acornNut(m.fastener), [CF1, H + ys * NUTY, zs * NUTZ], X));
  const np = new THREE.Mesh(new THREE.PlaneGeometry(38 * MM, 60 * MM), decalMat(nameplate(logoWhite), { metalness: 0, roughness: 0.4, specularIntensity: 0.5, envMapIntensity: 0.4, alphaTest: 0.5, transparent: false, depthWrite: true, clearcoat: 0.25, clearcoatRoughness: 0.25 }));
  np.rotation.y = Math.PI / 2;
  np.position.set((CX1 + 0.3) * MM, H * MM, 0);
  root.add(np);

  root.traverse((o) => {
    const mesh = o as THREE.Mesh;
    if (mesh.isMesh) {
      mesh.castShadow = !(mesh.material as THREE.Material).transparent;
      mesh.receiveShadow = true;
    }
  });
  const bb = new THREE.Box3().setFromObject(root);
  const ctr = bb.getCenter(new THREE.Vector3());
  root.position.set(-ctr.x, -bb.min.y, -ctr.z);
  return { root, size: bb.getSize(new THREE.Vector3()) };
}

// ============================================================ studio
/** Product-photo studio: light-grey sweep, big overhead softbox, side strips, black flags, dark ground. */
function studioEnvironment() {
  const s = new THREE.Scene();
  s.add(new THREE.Mesh(new THREE.SphereGeometry(20, 32, 16), new THREE.MeshBasicMaterial({ color: 0xb4b8bc, side: THREE.BackSide })));
  const panel = (w: number, h: number, pos: [number, number, number], k: number, look: [number, number, number] = [0, 1, 0]) => {
    const p = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshBasicMaterial({ color: new THREE.Color(k, k, k), side: THREE.DoubleSide }));
    p.position.set(...pos);
    p.lookAt(...look);
    s.add(p);
  };
  panel(9, 5, [0, 8, 0], 10, [0, 0, 0]); // overhead softbox → bright top band on cylinders
  panel(2.5, 7, [-8, 3.5, 4], 5); // left strip
  panel(2.5, 7, [8, 3.5, -3], 4); // right strip
  panel(10, 1.4, [0, 1.6, -9], 3); // back kicker
  panel(5, 10, [-7, 3, -6], 0.3); // softened: the suction flat is bright in photo 12-1
  panel(5, 10, [7, 3, 6], 0.3); // softened: a black flag here turned the delivery flat and cover near-black (photos 11, 16 show them bright)
  panel(30, 30, [0, -2.5, 0], 0.06, [0, 0, 0]); // dark ground → dark lower band, as in the photos
  return s;
}

/** Mount an orbitable viewer in `el`. Returns a cleanup function. */
export async function mountPump(el: HTMLElement, opts: { reducedMotion: boolean; view?: [number, number, number] }) {
  const renderer = new THREE.WebGLRenderer({ antialias: false, alpha: true, powerPreference: "high-performance" });
  const dpr = Math.min(window.devicePixelRatio, 2);
  renderer.setPixelRatio(dpr);
  renderer.setSize(el.clientWidth, el.clientHeight);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.AgXToneMapping;
  renderer.toneMappingExposure = 1.3;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.VSMShadowMap;
  renderer.domElement.style.touchAction = "none";
  el.appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  const pmrem = new THREE.PMREMGenerator(renderer);
  const env = pmrem.fromScene(studioEnvironment(), 0.01).texture;
  scene.environment = env;

  const key = new THREE.DirectionalLight(0xffffff, 1.4);
  key.position.set(1.5, 6, 2.5);
  key.castShadow = true;
  key.shadow.mapSize.set(2048, 2048);
  const sc = key.shadow.camera;
  sc.left = sc.bottom = -3;
  sc.right = sc.top = 3;
  sc.near = 1;
  sc.far = 14;
  key.shadow.radius = 14;
  key.shadow.blurSamples = 24;
  key.shadow.bias = -0.0003;
  scene.add(key, new THREE.HemisphereLight(0xffffff, 0x8e959c, 0.18));

  const m = makeMaterials();
  const { root, size } = await buildPump(m);
  scene.add(root);

  const floor = new THREE.Mesh(new THREE.PlaneGeometry(16, 16), new THREE.ShadowMaterial({ opacity: 0.32 }));
  floor.rotation.x = -Math.PI / 2;
  floor.receiveShadow = true;
  scene.add(floor);

  const camera = new THREE.PerspectiveCamera(28, el.clientWidth / el.clientHeight, 0.05, 50);
  const target = new THREE.Vector3(0, size.y * 0.47, 0);
  const radius = size.length() / 2;
  const fit = () => {
    const vFov = THREE.MathUtils.degToRad(camera.fov);
    const hFov = 2 * Math.atan(Math.tan(vFov / 2) * camera.aspect);
    return (radius / Math.sin(Math.min(vFov, hFov) / 2)) * 0.95;
  };
  let dist = fit();
  camera.position.copy(target).addScaledVector(new THREE.Vector3(...(opts.view ?? [0.62, 0.5, 0.85])).normalize(), dist);
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.target.copy(target);
  controls.enableDamping = true;
  controls.enablePan = false;
  controls.minDistance = dist * 0.4;
  controls.maxDistance = dist * 1.8;
  controls.maxPolarAngle = Math.PI * 0.495;
  controls.autoRotate = !opts.reducedMotion;
  controls.autoRotateSpeed = 0.7;
  controls.addEventListener("start", () => (controls.autoRotate = false));
  controls.update();

  // Post: MSAA scene render → ground-truth AO (contact darkening in crevices) → tone map.
  const rt = new THREE.WebGLRenderTarget(el.clientWidth * dpr, el.clientHeight * dpr, { samples: 4, type: THREE.HalfFloatType });
  const composer = new EffectComposer(renderer, rt);
  composer.addPass(new RenderPass(scene, camera));
  const ao = new GTAOPass(scene, camera, el.clientWidth, el.clientHeight);
  ao.updateGtaoMaterial({ radius: 0.12, distanceExponent: 1.4, thickness: 1, scale: 1.1, samples: 16 });
  ao.blendIntensity = 0.85;
  composer.addPass(ao);
  composer.addPass(new OutputPass());

  // Debug hook to match product-photo angles: el.__pump.look([x, y, z], zoom)
  Object.assign(el, {
    __pump: {
      look: (d: [number, number, number], zoom = 1) => {
        controls.autoRotate = false;
        camera.fov = 28;
        camera.updateProjectionMatrix();
        camera.position.copy(target).addScaledVector(new THREE.Vector3(...d).normalize(), dist * zoom);
        controls.update();
      },
      // Near-orthographic view (very long lens from far away) for drawing-style comparisons.
      ortho: (d: [number, number, number], zoom = 1) => {
        controls.autoRotate = false;
        controls.maxDistance = 1e4;
        controls.minPolarAngle = 0;
        controls.maxPolarAngle = Math.PI;
        camera.fov = 1.2;
        camera.near = 1;
        camera.far = 2000;
        camera.updateProjectionMatrix();
        const far = (radius / Math.sin(THREE.MathUtils.degToRad(camera.fov) / 2)) * 1.05 * zoom;
        const dir = new THREE.Vector3(...d).normalize();
        camera.up.set(0, 1, 0);
        if (Math.abs(dir.y) > 0.99) camera.up.set(-1, 0, 0); // top view: shaft runs left → right
        camera.position.copy(target).addScaledVector(dir, far);
        camera.lookAt(target);
        controls.update();
      },
    },
  });

  const ro = new ResizeObserver(() => {
    const w = el.clientWidth, h = el.clientHeight;
    renderer.setSize(w, h);
    composer.setSize(w, h);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    dist = fit();
  });
  ro.observe(el);

  let visible = true;
  const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting));
  io.observe(el);
  renderer.setAnimationLoop(() => {
    if (!visible) return;
    controls.update();
    composer.render();
  });

  return () => {
    renderer.setAnimationLoop(null);
    ro.disconnect();
    io.disconnect();
    controls.dispose();
    composer.dispose();
    rt.dispose();
    scene.traverse((o) => {
      const mesh = o as THREE.Mesh;
      if (mesh.isMesh) {
        mesh.geometry.dispose();
        for (const mat of (Array.isArray(mesh.material) ? mesh.material : [mesh.material]) as THREE.MeshPhysicalMaterial[]) {
          mat.map?.dispose();
          mat.dispose();
        }
      }
    });
    env.dispose();
    pmrem.dispose();
    renderer.dispose();
    renderer.domElement.remove();
  };
}
