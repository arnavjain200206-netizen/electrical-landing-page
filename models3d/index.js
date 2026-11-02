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

function boot() {
  if (dead) return false;
  if (renderer) return true;
  try {
    glCanvas = document.createElement('canvas');
    renderer = new T.WebGLRenderer({ canvas: glCanvas, antialias: true, alpha: true, powerPreference: 'low-power' });
    renderer.setClearColor(0x000000, 0);
    renderer.outputColorSpace = T.SRGBColorSpace;
    renderer.toneMapping = T.ACESFilmicToneMapping;
    renderer.toneMappingExposure = .78;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = T.PCFSoftShadowMap;
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
  scene.add(new T.HemisphereLight(0xdfeaff, 0x6b6558, .22));
  const ground = new T.Mesh(new T.PlaneGeometry(18, 18), new T.ShadowMaterial({ opacity: spec.shadow || .3 }));
  ground.rotation.x = -Math.PI / 2; ground.receiveShadow = true;
  scene.add(ground);

  const built = spec.build();
  const pivot = new T.Group();
  pivot.add(built.group);
  scene.add(pivot);
  const box = new T.Box3().setFromObject(built.group);
  // widest reach from the turning axis, and height: enough to keep the model in frame at every angle
  const rho = Math.hypot(Math.max(-box.min.x, box.max.x), Math.max(-box.min.z, box.max.z)), top = box.max.y + .15;
  const v = {
    el, canvas, ctx: canvas.getContext('2d'), scene, key, pivot, built, spec, cam: new T.PerspectiveCamera(30, 1, .1, 60),
    rho, top, yaw: spec.yaw || .5, vel: 0, pitch: 0, pitchTarget: 0,
    visible: false, dirty: true, drag: false, t0: null, first: true, w: 0, h: 0
  };
  viewers.set(el, v);
  io.observe(el); ro.observe(el);

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
  const dpr = Math.min(window.devicePixelRatio || 1, 1.75);
  const cw = v.el.clientWidth, ch = v.el.clientHeight;
  const w = Math.max(2, Math.round(cw * dpr)), h = Math.max(2, Math.round(ch * dpr));
  if (v.canvas.width !== w || v.canvas.height !== h) { v.canvas.width = w; v.canvas.height = h; }
  v.w = w; v.h = h;
  if (w > GW || h > GH) { GW = Math.max(GW, w); GH = Math.max(GH, h); renderer.setPixelRatio(1); renderer.setSize(GW, GH, false); }
  place(v);
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
  viewers.forEach((v) => {
    if (!v.visible) return;
    if (v.t0 === null) v.t0 = t;
    const moving = !RM || v.drag || Math.abs(v.vel) > .02 || Math.abs(v.pitch - v.pitchTarget) > .002;
    if (!moving && !v.dirty) return;
    if (!RM && !v.drag) v.yaw += (v.spec.spin || .3) * dt;
    v.yaw += v.vel * dt; v.vel *= Math.pow(.04, dt);
    v.pitch += (v.pitchTarget - v.pitch) * Math.min(1, dt * 6);
    v.pivot.rotation.y = v.yaw;
    v.built.update(RM ? 2.6 : t - v.t0, dt);
    draw(v);
    v.dirty = false;
    again = again || !RM || v.drag || Math.abs(v.vel) > .02 || Math.abs(v.pitch - v.pitchTarget) > .002;
  });
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

window.EII3D = {
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
