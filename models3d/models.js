/* The product models. Every model is built from basic shapes and procedural textures, so there are no
   model files to download. Each builder returns { group, update(t) }: the group stands on y = 0 and is
   centred on x / z; update(t) moves it (t = seconds since it came into view). */
import * as T from 'three';
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';
import * as X from './textures.js';

const PI = Math.PI;
const std = (color, rough, metal, extra) => new T.MeshStandardMaterial(Object.assign({ color, roughness: rough, metalness: metal || 0 }, extra));
const phys = (color, rough, extra) => new T.MeshPhysicalMaterial(Object.assign({ color, roughness: rough }, extra));
const lit = (m) => { m.castShadow = m.receiveShadow = true; return m; };
const box = (w, h, d, r, mat) => lit(new T.Mesh(new RoundedBoxGeometry(w, h, d, 3, r), mat));
const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
const rng = (seed) => { let s = seed >>> 0; return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296); };

const KRAFT = '#b58b55';
const kraftIn = () => std('#ffffff', .9, 0, { side: T.BackSide, map: X.grain('#b58b55', '#6b4a22', 500, 2, [2, 1], 3) });

/* A roll with a hole through it: wound side, flat ends showing the layers, and a cardboard core. */
function hollowRoll(rOut, rIn, h, side, cap, coreOverhang) {
  const g = new T.Group();
  const o = lit(new T.Mesh(new T.CylinderGeometry(rOut, rOut, h, 80, 1, true), side)); o.position.y = h / 2; g.add(o);
  const i = new T.Mesh(new T.CylinderGeometry(rIn, rIn, h, 48, 1, true), kraftIn()); i.position.y = h / 2; g.add(i);
  const top = lit(new T.Mesh(new T.RingGeometry(rIn, rOut, 80), cap)); top.rotation.x = -PI / 2; top.position.y = h; g.add(top);
  const bot = lit(new T.Mesh(new T.RingGeometry(rIn, rOut, 80), cap)); bot.rotation.x = PI / 2; g.add(bot);
  if (coreOverhang) {
    const tube = lit(new T.Mesh(new T.CylinderGeometry(rIn + .025, rIn + .025, h + coreOverhang * 2, 48, 1, true), std('#ffffff', .85, 0, { side: T.DoubleSide, map: X.grain('#b58b55', '#6b4a22', 500, 2, [3, 1], 5) })));
    tube.position.y = h / 2; g.add(tube);
    for (const s of [1, -1]) {
      const r = lit(new T.Mesh(new T.RingGeometry(rIn - .005, rIn + .03, 48), std('#a97d49', .85)));
      r.rotation.x = -s * PI / 2; r.position.y = h / 2 + s * (h / 2 + coreOverhang); g.add(r);
    }
  }
  return g;
}

/* A loose strip of film or tape leaving a roll. path(u, t) gives the bulge of the strip (u = 0 at the roll). */
function ribbon(len, wid, mat, bulge) {
  const geo = new T.PlaneGeometry(len, wid, 36, 1);
  const base = geo.attributes.position.array.slice();
  const mesh = lit(new T.Mesh(geo, mat));
  mesh.material.side = T.DoubleSide;
  mesh.userData.update = (t) => {
    const p = geo.attributes.position;
    for (let k = 0; k < p.count; k++) {
      const u = base[k * 3] / len + .5;
      p.setXYZ(k, base[k * 3], base[k * 3 + 1], bulge(u, t));
    }
    p.needsUpdate = true; geo.computeVertexNormals();
  };
  mesh.userData.update(0);
  return mesh;
}

/* put a ribbon on the surface of a standing roll so it leaves tangentially */
function tail(rib, rOut, y, theta) {
  const a = new T.Group();
  a.position.set(rOut * Math.cos(theta), y, rOut * Math.sin(theta));
  a.rotation.y = -theta - PI / 2;
  rib.position.x = rib.geometry.parameters.width / 2;
  a.add(rib);
  return a;
}

/* Sheet colours the product page can switch between, and how thick a sheet is drawn (exaggerated, like the hero drawing). */
const PALETTE = { Grey: ['#7f8a96', '#99a3ae'], White: ['#cdd4da', '#e4e9ed'], Black: ['#262b32', '#39404a'] };
const thicknessH = (mm) => .05 + mm * .0125;

/* ---------------------------------------------------------------- PVC sheets */
function pvcStack(n, hero) {
  const g = new T.Group(), W = 3.2, D = 1.7, H = .14, GAP = .006;
  const geo = new RoundedBoxGeometry(W, H, D, 3, .03);
  const mat = std('#7f8a96', .42, 0, { envMapIntensity: 1.1 });
  const topMat = std('#99a3ae', .34, 0, { envMapIntensity: 1.2 });
  const sheets = [];
  for (let i = 0; i < n; i++) {
    const m = lit(new T.Mesh(geo, i === n - 1 ? topMat : mat));
    const by = H / 2 + i * (H + GAP);
    m.userData.y = by;
    m.position.set((((i * 37) % 7) - 3) * .02, by, (((i * 53) % 7) - 3) * .016);
    m.rotation.y = (((i * 29) % 9) - 4) * .007;
    g.add(m); sheets.push(m);
  }
  const topY = n * (H + GAP);
  let height = topY;

  let spark = null;
  if (hero) {
    const R = rng(11), target = new T.Vector3(.5, topY + .01, .15);
    const mat2 = new T.MeshBasicMaterial({ color: 0xffe27a, transparent: true, blending: T.AdditiveBlending, depthWrite: false });
    const bolt = new T.Mesh(new T.BufferGeometry(), mat2); bolt.visible = false; bolt.frustumCulled = false; g.add(bolt);
    const ring = new T.Mesh(new T.RingGeometry(.11, .15, 48), new T.MeshBasicMaterial({ color: 0xffc247, transparent: true, opacity: 0, side: T.DoubleSide, depthWrite: false, blending: T.AdditiveBlending }));
    ring.rotation.x = -PI / 2; ring.position.copy(target); g.add(ring);
    const glow = new T.PointLight(0xffd24a, 0, 5); glow.position.set(target.x, topY + .5, target.z); g.add(glow);
    let last = -1;
    const rebuild = () => {
      const pts = [], from = new T.Vector3(target.x - 1.5, topY + 3.4, target.z - .6);
      for (let k = 0; k <= 14; k++) {
        const u = k / 14, p = from.clone().lerp(target, u), j = .17 * (1 - u * .85) * (k === 14 ? 0 : 1);
        p.x += (R() - .5) * 2 * j; p.z += (R() - .5) * 2 * j; pts.push(p);
      }
      bolt.geometry.dispose();
      bolt.geometry = new T.TubeGeometry(new T.CatmullRomCurve3(pts, false, 'catmullrom', .2), 44, .022, 5, false);
    };
    spark = (t) => {
      const c = (t - 1.8) % 3.8, on = t > 1.8 && c < .5;
      bolt.visible = on;
      if (on) {
        if (t - last > .06) { rebuild(); last = t; }
        const k = 1 - c / .5, f = .55 + .45 * R();
        mat2.opacity = f; ring.material.opacity = k * .9; ring.scale.setScalar(1 + c * 5); glow.intensity = k * 7 * f;
      } else { ring.material.opacity = 0; glow.intensity = 0; }
    };
  }

  return {
    group: g,
    // the product page's thickness slider and colour chips: { thickness: mm, color: 'Grey' | 'White' | 'Black' }
    set(o) {
      if (o.thickness) { const Hc = thicknessH(o.thickness); sheets.forEach((m, i) => { m.scale.y = Hc / H; m.userData.y = Hc / 2 + i * (Hc + GAP); }); height = n * (Hc + GAP); }
      if (o.color && PALETTE[o.color]) { mat.color.set(PALETTE[o.color][0]); topMat.color.set(PALETTE[o.color][1]); }
      return height;
    },
    update(t) {
      for (let i = 0; i < n; i++) {
        const k = clamp((t - .1 - i * .1) / .8, 0, 1), drop = Math.pow(1 - k, 3) * 3.2;
        const lift = Math.pow(Math.max(0, Math.sin(t * 1.3 - i * .55)), 2) * .05 * (i / (n - 1));
        sheets[i].position.y = sheets[i].userData.y + drop + (t > 1.6 ? lift : 0);
      }
      if (spark) spark(t);
    }
  };
}

/* ---------------------------------------------------------------- Cut-to-size panels */
function cutToSize() {
  const g = new T.Group(), H = .13, GAP = .06;
  const mat = std('#7f8a96', .42, 0, { envMapIntensity: 1.1 });
  const holeMat = std('#1a1e23', .6);
  const rows = [{ d: .94, w: [1.25, .85, 1.0] }, { d: .98, w: [.8, 1.4, .95] }];
  const totalD = rows[0].d + rows[1].d + GAP;
  const panels = [];
  let z = -totalD / 2, n = 0;
  rows.forEach((row) => {
    const rowW = row.w.reduce((a, b) => a + b, 0) + GAP * (row.w.length - 1);
    let x = -rowW / 2;
    row.w.forEach((w) => {
      const p = box(w, H, row.d, .02, mat);
      p.userData = { x: x + w / 2, z: z + row.d / 2, i: n };
      p.position.set(p.userData.x, H / 2, p.userData.z);
      if (n % 2 === 0) for (const [sx, sz] of [[-1, -1], [1, 1]]) {
        const hole = new T.Mesh(new T.CircleGeometry(.05, 24), holeMat);
        hole.rotation.x = -PI / 2; hole.position.set(sx * (w / 2 - .14), H / 2 + .002, sz * (row.d / 2 - .14)); p.add(hole);
      }
      g.add(p); panels.push(p); x += w + GAP; n++;
    });
    z += row.d + GAP;
  });
  const saw = new T.Mesh(new T.BoxGeometry(.035, .012, 2.25), new T.MeshBasicMaterial({ color: 0xf2b300 }));
  saw.position.y = H + .03; g.add(saw);
  let Hc = H;
  return {
    group: g,
    set(o) {
      if (o.thickness) { Hc = thicknessH(o.thickness); panels.forEach((p) => { p.scale.y = Hc / H; }); }
      if (o.color && PALETTE[o.color]) mat.color.set(PALETTE[o.color][0]);
      return Hc + .12;
    },
    update(t) {
      panels.forEach((p) => {
        const s = Math.pow(Math.max(0, Math.sin(t * 1.1 + p.userData.i * .7)), 2);
        p.position.y = Hc / 2 + s * .11;
        p.position.x = p.userData.x * (1 + s * .035);
        p.position.z = p.userData.z * (1 + s * .045);
      });
      saw.position.x = (((t * .45) % 1) - .5) * 3.5;
      saw.position.y = Hc + .03;
    }
  };
}

/* ---------------------------------------------------------------- Stretch film */
function stretchFilm() {
  const g = new T.Group();
  const clearSide = phys('#c4d4e2', .12, { transparent: true, opacity: .93, clearcoat: 1, clearcoatRoughness: .08, envMapIntensity: 1.4, bumpMap: X.grooves('#808080', '#ffffff', 5, [1, 8]), bumpScale: .25 });
  const clearCap = std('#ffffff', .3, 0, { map: X.layers('#e3edf5', '#9fb6c8', 7) });
  const a = hollowRoll(.62, .26, 1.2, clearSide, clearCap, .07); a.position.set(-.62, 0, .1); g.add(a);
  const blackSide = phys('#0f1318', .2, { clearcoat: 1, clearcoatRoughness: .1, bumpMap: X.grooves('#808080', '#ffffff', 5, [1, 8]), bumpScale: .2 });
  const blackCap = std('#ffffff', .35, 0, { map: X.layers('#222831', '#4b5563', 7) });
  const b = hollowRoll(.5, .24, .86, blackSide, blackCap, .07); b.position.set(.75, 0, -.28); g.add(b);
  const film = ribbon(1.15, .6, phys('#1d232b', .2, { clearcoat: 1, transparent: true, opacity: .92 }), (u, t) => Math.sin(u * 5 - t * 1.6) * .1 * u);
  const tl = tail(film, .5, .13, 1.1); tl.position.add(b.position); g.add(tl);
  return { group: g, update(t) { film.userData.update(t); } };
}

/* ---------------------------------------------------------------- BOPP tape */
function boppTape() {
  const g = new T.Group();
  const brownSide = phys('#9a6a32', .2, { clearcoat: 1, clearcoatRoughness: .12, bumpMap: X.grooves('#808080', '#ffffff', 6, [1, 4]), bumpScale: .15 });
  const brownCap = std('#ffffff', .3, 0, { map: X.layers('#a77842', '#6b4a22', 6) });
  const a = hollowRoll(.7, .4, .55, brownSide, brownCap, .05); a.position.set(-.5, 0, .05); g.add(a);
  const clearSide = phys('#d9cfae', .18, { clearcoat: 1, clearcoatRoughness: .1, transparent: true, opacity: .9 });
  const clearCap = std('#ffffff', .3, 0, { map: X.layers('#efe8d2', '#b9ae8a', 6) });
  const b = hollowRoll(.6, .36, .55, clearSide, clearCap, .05); b.position.set(.72, 0, -.4); g.add(b);
  const strip = ribbon(1.1, .5, phys('#9a6a32', .2, { clearcoat: 1, clearcoatRoughness: .12 }), (u, t) => Math.sin(u * 4.5 - t * 1.8) * .09 * u);
  const tl = tail(strip, .7, .275, -.55); tl.position.add(a.position); g.add(tl);
  return { group: g, update(t) { strip.userData.update(t); } };
}

/* ---------------------------------------------------------------- Bubble wrap */
function bubbleWrap() {
  const g = new T.Group(), R = .6, L = 1.3;
  const bump = X.bubbles('bump', [8, 4]);
  const side = std('#ffffff', .22, 0, { map: X.bubbles('color', [8, 4]), bumpMap: bump, bumpScale: 2.6, envMapIntensity: 1.2 });
  const cap = std('#ffffff', .4, 0, { map: X.layers('#d6e8f2', '#7da6bd', 8) });
  const roll = hollowRoll(R, .2, L, side, cap, .1);
  roll.rotation.z = PI / 2; roll.position.set(L / 2, R, -.25);
  g.add(roll);
  // the loose sheet running along the ground, with its far end lifting a little
  const sheetGeo = new T.PlaneGeometry(L, 1.7, 1, 36);
  sheetGeo.rotateX(-PI / 2);
  const base = sheetGeo.attributes.position.array.slice();
  const sheetMat = std('#ffffff', .22, 0, { map: X.bubbles('color', [6, 7]), bumpMap: X.bubbles('bump', [6, 7]), bumpScale: 2.4, side: T.DoubleSide, envMapIntensity: 1.2 });
  const sheet = lit(new T.Mesh(sheetGeo, sheetMat));
  sheet.position.set(0, 0, -.25 + R);
  g.add(sheet);
  const bend = (t) => {
    const p = sheetGeo.attributes.position;
    for (let k = 0; k < p.count; k++) {
      const u = (base[k * 3 + 2] + .85) / 1.7;
      p.setY(k, .022 + Math.pow(Math.max(0, u - .5), 2) * .5 * (.8 + .2 * Math.sin(t * 1.2)) + Math.sin(u * 7 - t * 1.4) * .012 * u);
    }
    p.needsUpdate = true; sheetGeo.computeVertexNormals();
  };
  bend(0);
  g.position.x = -L / 2;
  const wrap = new T.Group(); wrap.add(g);
  return { group: wrap, update: bend };
}

/* ---------------------------------------------------------------- EPE foam */
function foam() {
  const g = new T.Group();
  const bump = X.grain('#808080', '#ffffff', 900, 2.5, [3, 2], 21);
  const white = std('#dcdbd4', .96, 0, { bumpMap: bump, bumpScale: 1.2 });
  const cap = std('#ffffff', .95, 0, { map: X.layers('#f1f0ea', '#cfcdc2', 10), bumpMap: bump, bumpScale: .6 });
  const roll = hollowRoll(.55, .17, 1.35, white, cap, .0); roll.position.set(-.78, 0, -.15); g.add(roll);
  const slabMat = std('#e0dfd8', .96, 0, { bumpMap: bump, bumpScale: 1.0 });
  const slab = box(1.9, .15, 1.3, .06, slabMat); slab.position.set(.62, .075, .3); slab.rotation.y = -.35; g.add(slab);
  const slab2 = box(1.9, .1, 1.3, .05, slabMat); slab2.position.set(.62, .2, .3); slab2.rotation.y = -.2; g.add(slab2);
  return {
    group: g,
    update(t) {
      const s = 1 + Math.sin(t * 1.5) * .06;          // foam squashes a little
      slab2.scale.y = s; slab2.position.y = .15 + .05 * s;
    }
  };
}

/* ---------------------------------------------------------------- PP strapping */
function strapping() {
  const g = new T.Group();
  const side = phys('#1b4a9a', .3, { clearcoat: .8, clearcoatRoughness: .2, bumpMap: X.grooves('#808080', '#ffffff', 4, [1, 1]), bumpScale: .1 });
  const cap = std('#ffffff', .35, 0, { map: X.layers('#2257ad', '#0a2557', 9) });
  const coil = hollowRoll(.98, .5, .34, side, cap, 0); coil.position.set(-.35, 0, 0); g.add(coil);
  const steel = std('#aab3bb', .32, .95);
  for (const [x, z, r] of [[1.15, .55, .3], [1.45, .25, -.4]]) {
    const clip = box(.4, .09, .22, .02, steel); clip.position.set(x, .045, z); clip.rotation.y = r; g.add(clip);
    const slot = new T.Mesh(new T.BoxGeometry(.28, .005, .05), std('#222a31', .5)); slot.position.y = .092; clip.add(slot);
  }
  const band = lit(new T.Mesh(new T.TorusGeometry(.34, .03, 8, 48), phys('#1b4a9a', .3, { clearcoat: .8 })));
  band.rotation.x = -PI / 2 + .25; band.scale.set(1, 1.35, 1.4); band.position.set(1.1, .06, -.55); g.add(band);
  return { group: g, update(t) { coil.rotation.y = t * .25; } };
}

/* ---------------------------------------------------------------- Edge / corner guards */
function edgeGuard() {
  const g = new T.Group();
  const A = .8, TH = .14, LEN = 2.2;
  const s = new T.Shape();
  s.moveTo(0, 0); s.lineTo(A, 0); s.lineTo(A, TH); s.lineTo(TH, TH); s.lineTo(TH, A); s.lineTo(0, A); s.closePath();
  const geo = new T.ExtrudeGeometry(s, { depth: LEN, bevelEnabled: true, bevelSize: .012, bevelThickness: .012, bevelSegments: 2 });
  geo.translate(-A / 2, 0, -LEN / 2);
  const mat = std('#ffffff', .82, 0, { map: X.grain('#c39a62', '#7a5428', 1100, 2, [2, 4], 13), bumpMap: X.grain('#808080', '#ffffff', 900, 2, [2, 4], 17), bumpScale: .8 });
  const make = (x, y, z, rx, ry, rz) => { const m = lit(new T.Mesh(geo, mat)); m.position.set(x, y, z); m.rotation.set(rx, ry, rz); g.add(m); return m; };
  make(0, 0, .72, 0, PI / 2, 0);
  make(.12, 0, 0, 0, PI / 2 + .1, 0);
  const top = make(-.06, 0, -.72, 0, PI / 2 - .12, 0);
  return { group: g, update(t) { top.position.y = Math.max(0, Math.sin(t * 1.5)) * .12; top.rotation.z = Math.max(0, Math.sin(t * 1.5)) * .1; } };
}

export const MODELS = {
  'pvc-sheets': { build: () => pvcStack(7), yaw: .5, spin: .3 },
  'pvc-stack': { build: () => pvcStack(9, true), yaw: .45, spin: .16, shadow: .5 },
  'cut-to-size': { build: cutToSize, yaw: .45, spin: .26 },
  'stretch-film': { build: stretchFilm, yaw: .6, spin: .3 },
  'bopp-tape': { build: boppTape, yaw: .5, spin: .3 },
  'bubble-wrap': { build: bubbleWrap, yaw: .7, spin: .28 },
  'foam': { build: foam, yaw: .55, spin: .28 },
  'strapping': { build: strapping, yaw: .5, spin: .3 },
  'edge-guard': { build: edgeGuard, yaw: .5, spin: .3 }
};
