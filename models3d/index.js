/* Shows the 3D product models. Loaded on demand by script.js (assets/models3d.js, built from this folder).
   One WebGL renderer serves every model on the page: it draws a model, copies the picture into that
   model's own canvas, and moves on. Only models that are on screen are drawn. The original illustration
   stays underneath as the fallback and is faded out once the first 3D frame is ready. */
import * as T from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { MODELS } from './models.js';

const RM = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const viewers = new Map();            // element -> viewer
let renderer = null, glCanvas = null, env = null, GW = 0, GH = 0, io = null, ro = null, raf = 0, last = 0, lastDraw = 0, dead = false;
let dprCap = 1.75, quality = 2, samples = 0, acc = 0, prevNow = 0, frames = 0, workAcc = 0, workN = 0;

function boot() {
  if (dead) return false;
  if (renderer) return true;
  try {
    glCanvas = document.createElement('canvas');
    renderer = new T.WebGLRenderer({ canvas: glCanvas, antialias: true, alpha: true, powerPreference: 'low-power' });
    // No GPU (a software renderer) would run the page's main thread flat out: keep the illustrations instead.
    const gl = renderer.getContext(), info = gl.getExtension('WEBGL_debug_renderer_info');
    const gpu = info ? String(gl.getParameter(info.UNMASKED_RENDERER_WEBGL)) : '';
    if (!window.EII3D_FORCE && /swiftshader|llvmpipe|softpipe|software|basic render/i.test(gpu)) { renderer.dispose(); renderer = null; dead = true; return false; }
    renderer.setClearColor(0x000000, 0);
    renderer.outputColorSpace = T.SRGBColorSpace;
    renderer.toneMapping = T.ACESFilmicToneMapping;
    renderer.toneMappingExposure = .78;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = T.PCFShadowMap;
    renderer.setScissorTest(true);
    const pm = new T.PMREMGenerator(renderer);
    env = pm.fromScene(new RoomEnvironment(), .04).texture;
    pm.dispose();
    glCanvas.addEventListener('webglcontextlost', (e) => { e.preventDefault(); fail(); });
    io = new IntersectionObserver((list) => {
      list.forEach((en) => { const v = viewers.get(en.target); if (v) { v.visible = en.isIntersecting; if (v.visible) kick(); } });
    }, { rootMargin: '120px' });
    ro = new ResizeObserver((list) => list.forEach((en) => { const v = viewers.get(en.target); if (v) { v.dirty = true; kick(); } }));
    return true;
  } catch (e) { dead = true; renderer = null; return false; }
}

function fail() {              // WebGL went away: put the illustrations back
  dead = true;
  viewers.forEach((v) => { v.el.classList.remove('is-3d'); v.canvas.remove(); });
  viewers.clear();
}

/* If frames are slow (weak GPU, software rendering), first draw lighter, then give up and show the illustrations,
   so the page never gets sluggish because of the models. window.EII3D_FORCE turns this off (used for testing). */
function worse() {
  samples = 0; acc = 0; frames = 0; workAcc = 0; workN = 0;
  if (quality === 2) {
    quality = 1; dprCap = 1; renderer.shadowMap.enabled = false;
    viewers.forEach((v) => { v.dirty = true; v.scene.traverse((o) => { if (o.material) (Array.isArray(o.material) ? o.material : [o.material]).forEach((m) => { m.needsUpdate = true; }); }); });
  } else fail();
}
function adapt(now, work) {
  if (window.EII3D_FORCE) return;
  // time the page's own thread spends drawing: a few slow frames are enough to know
  if (++frames > 3) {
    workAcc += work;
    if (++workN === 6) { const avg = workAcc / 6; workAcc = 0; workN = 0; if (avg > 45) { worse(); return; } }
  }
  const d = now - prevNow; prevNow = now;
  if (d > 1000) { samples = 0; acc = 0; return; }           // tab was in the background
  if (++samples <= 15) return;                              // ignore shader compilation at the start
  acc += d;
  if (samples < 15 + 30) return;
  const avg = acc / 30; samples = 0; acc = 0;
  if (avg > 55) worse();
}

function create(el, name) {
  const spec = MODELS[name];
  if (!spec) return;
  const canvas = document.createElement('canvas');
  canvas.className = 'm3d__c';
  canvas.setAttribute('aria-hidden', 'true');
  el.classList.add('m3d');
  el.appendChild(canvas);

  const scene = new T.Scene();
  scene.environment = env;
  scene.environmentIntensity = .5;
  const key = new T.DirectionalLight(0xfff4e6, 1.9);
  key.position.set(3.5, 5.5, 3);
  key.castShadow = true;
  const big = el.clientWidth > 420;
  key.shadow.mapSize.set(big ? 1024 : 512, big ? 1024 : 512);
  Object.assign(key.shadow.camera, { left: -3.6, right: 3.6, top: 3.6, bottom: -3.6, near: .5, far: 14 });
  key.shadow.bias = -.0006; key.shadow.normalBias = .02; key.shadow.radius = 5;
  scene.add(key);
  const hemi = new T.HemisphereLight(0xdfeaff, 0x6b6558, .22);
  scene.add(hemi);
  const rim = new T.DirectionalLight(0x6fa8ff, 0);       // a cool edge light, only used on dark backgrounds
  rim.position.set(-4, 3, -3);
  scene.add(rim);
  const ground = new T.Mesh(new T.PlaneGeometry(18, 18), new T.ShadowMaterial({ opacity: spec.shadow || .3 }));
  ground.rotation.x = -Math.PI / 2; ground.receiveShadow = true;
  scene.add(ground);

  const built = spec.build();
  if (el.__eiiOpts && built.set) built.set(el.__eiiOpts);     // thickness / colour chosen before the model was ready
  const pivot = new T.Group();
  pivot.add(built.group);
  scene.add(pivot);
  const box = new T.Box3().setFromObject(built.group);
  // widest reach from the turning axis, and height: enough to keep the model in frame at every angle
  const rho = Math.hypot(Math.max(-box.min.x, box.max.x), Math.max(-box.min.z, box.max.z)), top = box.max.y + .15;
  const v = {
    el, canvas, ctx: canvas.getContext('2d'), scene, key, hemi, rim, ground, hover: el.getAttribute('data-motion') === 'hover', hot: false, clock: 2.6, darkFixed: !!el.closest('.hero'), pivot, built, spec, cam: new T.PerspectiveCamera(30, 1, .1, 60),
    rho, top, yaw: spec.yaw || .5, vel: 0, pitch: 0, pitchTarget: 0,
    visible: false, dirty: true, drag: false, t0: null, first: true, w: 0, h: 0
  };
  viewers.set(el, v);
  look(v);
  io.observe(el); ro.observe(el);
  if (v.hover) {                  // product cards move only while they are pointed at or focused
    const host = el.closest('.pcard') || el;
    const on = () => { v.hot = true; kick(); }, off = () => { v.hot = false; };
    host.addEventListener('pointerenter', on); host.addEventListener('pointerleave', off);
    host.addEventListener('focusin', on); host.addEventListener('focusout', off);
  }

  // drag to turn the model; moving over it tilts the view a little
  let lastX = 0, lastT = 0;
  canvas.addEventListener('pointerdown', (e) => { v.drag = true; lastX = e.clientX; lastT = e.timeStamp; v.vel = 0; canvas.setPointerCapture(e.pointerId); el.classList.add('is-grabbing'); });
  canvas.addEventListener('pointermove', (e) => {
    const r = canvas.getBoundingClientRect();
    v.pitchTarget = (.5 - (e.clientY - r.top) / r.height) * .22;
    if (!v.drag) { if (RM) { v.dirty = true; kick(); } return; }
    const dx = e.clientX - lastX, dt = Math.max(1, e.timeStamp - lastT) / 1000;
    v.yaw += dx * .011; v.vel = (dx * .011) / dt * .6;
    lastX = e.clientX; lastT = e.timeStamp; v.dirty = true; kick();
  });
  const up = () => { v.drag = false; el.classList.remove('is-grabbing'); v.vel = Math.max(-5, Math.min(5, v.vel)); kick(); };
  canvas.addEventListener('pointerup', up);
  canvas.addEventListener('pointercancel', up);
  canvas.addEventListener('pointerleave', () => { v.pitchTarget = 0; if (RM) { v.dirty = true; kick(); } });
}

/* Light and dark pages need different light: a cooler key and an edge light on dark, softer on light. */
function look(v) {
  const dark = v.darkFixed || document.documentElement.getAttribute('data-theme') === 'dark';
  v.exposure = dark ? .95 : .78;
  v.key.color.set(dark ? 0xdbe8ff : 0xfff4e6); v.key.intensity = dark ? 2.1 : 1.9;
  v.hemi.intensity = dark ? .3 : .22;
  v.rim.intensity = dark ? .9 : 0;
  v.scene.environmentIntensity = dark ? .6 : .5;
  v.ground.material.opacity = (v.spec.shadow || .3) * (dark ? 1.35 : 1);
  v.dirty = true;
}

function place(v) {
  const aspect = v.w / v.h, vf = v.cam.fov * Math.PI / 180, hf = 2 * Math.atan(Math.tan(vf / 2) * aspect);
  const elev = .46 + v.pitch;
  const seenH = v.top * Math.cos(elev) + 2 * v.rho * Math.sin(elev);          // height of the model plus its ground footprint, as seen from above
  const dist = Math.max(seenH / 2 / Math.tan(vf / 2), v.rho / Math.tan(hf / 2)) * (v.spec.pad || .96) + v.rho * .3;
  const cy = v.top * .42;
  v.cam.aspect = aspect; v.cam.updateProjectionMatrix();
  v.cam.position.set(0, cy + Math.sin(elev) * dist, Math.cos(elev) * dist);
  v.cam.lookAt(0, cy, 0);
}

function draw(v) {
  const dpr = Math.min(window.devicePixelRatio || 1, dprCap);
  const cw = v.el.clientWidth, ch = v.el.clientHeight;
  const w = Math.max(2, Math.round(cw * dpr)), h = Math.max(2, Math.round(ch * dpr));
  if (v.canvas.width !== w || v.canvas.height !== h) { v.canvas.width = w; v.canvas.height = h; }
  v.w = w; v.h = h;
  if (w > GW || h > GH) { GW = Math.max(GW, w); GH = Math.max(GH, h); renderer.setPixelRatio(1); renderer.setSize(GW, GH, false); }
  place(v);
  renderer.toneMappingExposure = v.exposure;
  renderer.setViewport(0, 0, w, h);
  renderer.setScissor(0, 0, w, h);
  renderer.render(v.scene, v.cam);
  v.ctx.clearRect(0, 0, w, h);
  v.ctx.drawImage(glCanvas, 0, GH - h, w, h, 0, 0, w, h);
  if (v.first) { v.first = false; v.el.classList.add('is-3d'); }
}

function frame(now) {
  raf = 0;
  const t = now / 1000, dt = Math.min(.1, t - (last || t));
  let again = false, live = 0;
  viewers.forEach((v) => { if (v.visible) live++; });
  // several models on screen: cap the frame rate so weaker phones and laptops keep scrolling smoothly
  const gap = live > 4 ? 1000 / 30 : live > 2 ? 1000 / 45 : 0;
  if (gap && now - lastDraw < gap - 2) { raf = window.requestAnimationFrame(frame); return; }
  lastDraw = now; last = t;
  const w0 = performance.now();
  viewers.forEach((v) => {
    if (!v.visible) return;
    if (v.t0 === null) v.t0 = t;
    const auto = !RM && (!v.hover || v.hot);
    const moving = auto || v.drag || Math.abs(v.vel) > .02 || Math.abs(v.pitch - v.pitchTarget) > .002;
    if (!moving && !v.dirty) return;
    if (auto && !v.drag) { v.yaw += (v.spec.spin || .3) * dt; v.clock += dt; }
    v.yaw += v.vel * dt; v.vel *= Math.pow(.04, dt);
    v.pitch += (v.pitchTarget - v.pitch) * Math.min(1, dt * 6);
    v.pivot.rotation.y = v.yaw;
    v.built.update(RM ? 2.6 : v.hover ? v.clock : t - v.t0, dt);
    draw(v);
    v.dirty = false;
    again = again || auto || v.drag || Math.abs(v.vel) > .02 || Math.abs(v.pitch - v.pitchTarget) > .002;
  });
  adapt(now, performance.now() - w0);
  if (dead) return;
  if (again) raf = window.requestAnimationFrame(frame);
}
function kick() { if (!raf && !dead) { last = 0; raf = window.requestAnimationFrame(frame); } }

function dispose(v) {
  io.unobserve(v.el); ro.unobserve(v.el);
  v.scene.traverse((o) => {
    if (o.geometry) o.geometry.dispose();
    if (o.material) (Array.isArray(o.material) ? o.material : [o.material]).forEach((m) => { Object.values(m).forEach((x) => { if (x && x.isTexture) x.dispose(); }); m.dispose(); });
  });
  v.key.shadow.map && v.key.shadow.map.dispose();
  v.canvas.remove(); v.el.classList.remove('m3d', 'is-3d', 'is-grabbing');
}

// the light/dark switch changes the light
new MutationObserver(() => { viewers.forEach(look); kick(); }).observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });

window.EII3D = {
  // the product page's thickness slider and colour chips drive the model through this
  setOptions(el, opts) {
    el.__eiiOpts = Object.assign({}, el.__eiiOpts, opts);
    const v = viewers.get(el);
    if (v && v.built.set) { const top = v.built.set(opts); if (top) v.top = top + .15; v.dirty = true; kick(); }
  },
  mount(els) {
    if (!boot()) return false;
    viewers.forEach((v, el) => { if (!el.isConnected) { dispose(v); viewers.delete(el); } });   // the single-page build swaps views
    els.forEach((el) => {
      if (viewers.has(el)) return;
      try { create(el, el.getAttribute('data-model')); } catch (e) { if (window.console) console.error('3D model failed', e); }
    });
    kick();
    return true;
  },
  names: Object.keys(MODELS)
};
