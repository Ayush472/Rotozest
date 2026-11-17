# 3D product models for Rotozest pumps

*Researched 2026-11-17. The aim is accurate, interactive 3D models of the SS and CI rotary gear pumps on product pages, while keeping mobile LCP under 2 s.*

## Summary
- **Accuracy:** Turntable photogrammetry in RealityScan 2.0 is free for companies under USD 1M revenue. Spray each pump with AESUB Blue (it vanishes on its own) and shoot under cross-polarized light. If CAD/STEP files exist, converting them is even more accurate.
- **AI image-to-3D** (TRELLIS.2, Hunyuan3D, Meshy, Tripo, Rodin) is fast but not dimensionally faithful, and nameplate text comes out unreadable. Use it only as a placeholder.
- **Web:** one GLB per pump at 0.5–1.5 MB (Meshopt + KTX2), shown with `<model-viewer>`. A poster image is the LCP element, and the viewer loads only on click, so speed is not affected.
- **Gaussian splats** run on the web now, but they have no AR, give wrong reflections on steel and make bigger files. Not recommended.

## 1. Ways to create the model
| Method | Accuracy | Shiny steel | Cost | Time per pump | Licence |
|---|---|---|---|---|---|
| RealityScan 2.0 (ex-RealityCapture) | High, ~0.1–0.5 mm with scale bars | Needs spray/polarizers | Free under USD 1M revenue, else USD 1,250/seat/yr ([license](https://www.realityscan.com/license?lang=en-us)) | ~1 h shoot + 30–90 min processing | Commercial OK under threshold |
| Agisoft Metashape Standard | High | Needs spray | ~USD 179 one-time (not checked on Agisoft's own page) | Slower | Perpetual |
| Meshroom | Medium-high | Needs spray | Free | Slowest, needs NVIDIA GPU | MPL-2.0 |
| Apple Object Capture | Medium-high | Apple calls reflective objects a "challenge" | Free | 15–30 min | OK |
| Phone apps (Polycam, KIRI, Scaniverse, Luma) | Medium | Poor unless sprayed | Free to ~USD 200/yr | 10–20 min | Check each app's terms |
| Gaussian splatting | Not measurable | Reflections baked in | Free to cheap | 20–40 min | Varies |
| AI image-to-3D | **Low for dimensions** | Visually OK | Free to ~USD 20/mo | Minutes | TRELLIS.2 MIT; Hunyuan3D excludes the EU/UK/KR; Meshy/Tripo free tier unclear |
| Structured-light scanner (Revopoint POP 3 Plus / MINI 2) | 0.02–0.08 mm | Still needs spray | ₹65k–85k / ~₹1.96 lakh | 30–60 min | You own it |
| Ahmedabad scanning service | High | They spray | ~₹1,300–2,500/h (directory listings) | 1–2 h | Work for hire |
| CAD/STEP → Blender | **Highest** | Not a problem: materials are defined, not captured | In-house time or ~₹3k–15k freelance (estimate) | 4–16 h | You own it |

## 2. Capture guide for stainless steel
- **AESUB Blue** (~USD 39 per 400 ml): matte for 1–2 h, gone in ~4 h, faster in Ahmedabad heat. Do **two passes**: sprayed for geometry, unsprayed and cross-polarized for colour.
- **Cross-polarization:** polarizing film on 2 LED panels plus a circular polarizer on the lens. This helps the texture pass but does not fully kill metal glare.
- **Setup:** a motorized turntable rated for 30 kg, coded markers, a 200 mm scale bar, a matte black backdrop, and softboxes at 45° plus top fill.
- **Photos:** 3 heights × 36 shots, then flip and repeat, plus 20–40 close-ups, for about 150–250 per pump. Use f/8–11, ISO 100–200, a tripod, and locked focus and white balance.
- **Nameplate/logo:** make it a texture decal plus a normal map from a square-on polarized photo, not geometry.

## 3. Cleanup and web pipeline
1. Reconstruct, then set scale in metres.
2. Clean up in Blender and split the parts.
3. Retopologize to **30k–80k triangles** (max 100k).
4. Bake normal, AO and base colour into one 2048² atlas.
5. PBR values:

   | Part | Base colour | Metalness | Roughness |
   |---|---|---|---|
   | Polished SS | ~`#C4C7CA` | 1.0 | 0.08–0.18 |
   | Brushed SS | same | 1.0 | 0.30–0.45 |
   | Black cast-iron bracket | `#1A1A1A` | 0 | 0.6–0.8 |
   | Nameplate | – | 1.0 | ~0.35 |

6. Compress:
   ```bash
   npm i -g @gltf-transform/cli
   gltf-transform optimize pump-raw.glb pump.glb --compress meshopt --texture-compress ktx2 --texture-size 2048
   gltf-transform inspect pump.glb
   ```
7. Budget per pump: GLB 0.5–1.5 MB (hard limit 2 MB), poster 30–60 KB, optional USDZ for iOS AR.

## 4. Website integration (keeps speed)
- **`<model-viewer>` 4.x** (~210 KB gz, three.js included). It has a poster, lazy loading, AR (WebXR / Scene Viewer / Quick Look), accessibility and the decoders built in. Choose it over react-three-fiber or plain three.js.
- **Pattern:**
  - `next/image` poster with `priority` is the LCP element, with a "View in 3D" button over it.
  - The click runs a dynamic `import('@google/model-viewer')` in a client component.
  - Reserve the box with `aspect-ratio: 1`, so there is no layout shift.
  - Serve GLBs with immutable cache headers and no preload.
- **Reflections:** a small neutral studio HDRI (Poly Haven, CC0) as `environment-image`, with `tone-mapping="neutral"`.
- **AR:** `ar ar-modes="webxr scene-viewer quick-look"` with `ar-scale="fixed"`, so buyers see the true size on their floor.
- **Accessibility:** `alt` text, no auto-rotate with reduced motion, and keep the 2D photos and spec table.

## 5. SEO
- Add `Product.subjectOf` → `3DModel` → `encoding.contentUrl` (.glb). Google supports this markup since March 2024.
- Google shows 3D/AR results only through Merchant Center/Shopping feeds, so don't expect 3D in Search for a B2B site. The gain is engagement on the page.

## 6. Recommended plan
1. **Ask the client for CAD/STEP drawings first.** This is the most accurate and cheapest route per model.
2. Otherwise, **sprayed turntable photogrammetry in RealityScan**. Use one master model per pump family, scaled for sizes only after checking the spec sheet.
3. Use an Ahmedabad blue-light scanning service for hard parts or for verification.
4. Use AI image-to-3D only as a temporary placeholder.

**Kit:** about ₹40k–60k (spray ×4, 2 LED panels + polarizers, turntable, tripod, markers, backdrop), plus a PC with an RTX GPU of 8 GB or more.

**Throughput:** 1–2 pumps/day while learning, then 3–4/day. Labour is about ₹2k–5k per pump (estimate).

**Could not verify:** exact library bundle sizes, Polycam 2026 prices, Meshy/Tripo free-tier commercial terms, Ahmedabad scanning rates, and whether Object Capture still appears in Reality Composer iOS.
