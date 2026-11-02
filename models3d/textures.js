/* Procedural textures, drawn on a canvas so the 3D models need no image files. */
import * as T from 'three';

function make(size, draw, opts) {
  opts = opts || {};
  const c = document.createElement('canvas');
  c.width = c.height = size;
  const g = c.getContext('2d');
  draw(g, size);
  const t = new T.CanvasTexture(c);
  t.colorSpace = opts.color === false ? T.NoColorSpace : T.SRGBColorSpace;
  t.wrapS = t.wrapT = T.RepeatWrapping;
  if (opts.repeat) t.repeat.set(opts.repeat[0], opts.repeat[1]);
  t.anisotropy = 4;
  return t;
}

// seeded random so every visit draws the same texture
function rng(seed) { let s = seed >>> 0; return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296); }

/* Hexagonally packed air bubbles. kind: 'color' (light blue with highlights) or 'bump' (white domes on black). */
export function bubbles(kind, repeat) {
  return make(256, (g, S) => {
    g.fillStyle = kind === 'bump' ? '#000' : '#b9d3e2';
    g.fillRect(0, 0, S, S);
    const n = 8, r = S / n / 2 - 1.2;
    for (let row = 0; row < n; row++) for (let col = 0; col < n; col++) {
      const x = (col + (row % 2 ? 1 : .5)) * (S / n), y = (row + .5) * (S / n);
      const gr = g.createRadialGradient(x - r * .3, y - r * .35, r * .08, x, y, r);
      if (kind === 'bump') { gr.addColorStop(0, '#fff'); gr.addColorStop(1, '#222'); }
      else { gr.addColorStop(0, '#ffffff'); gr.addColorStop(.35, '#e4f1f8'); gr.addColorStop(1, '#8fb4c9'); }
      g.fillStyle = gr;
      for (const dx of [0, -S, S]) { g.beginPath(); g.arc(x + dx, y, r, 0, 6.2832); g.fill(); }
    }
  }, { repeat, color: kind !== 'bump' });
}

/* Concentric layers, for the flat ends of a roll (wound film, tape, foam or strap). */
export function layers(base, lines, step) {
  return make(512, (g, S) => {
    g.fillStyle = base; g.fillRect(0, 0, S, S);
    g.lineWidth = 2; g.strokeStyle = lines;
    for (let r = 20; r < S / 2; r += step) { g.globalAlpha = .7; g.beginPath(); g.arc(S / 2, S / 2, r, 0, 6.2832); g.stroke(); }
  });
}

/* Fine horizontal lines, like the stretch marks on wound film or the wraps of tape. */
export function grooves(base, lines, spacing, repeat) {
  return make(128, (g, S) => {
    g.fillStyle = base; g.fillRect(0, 0, S, S);
    g.strokeStyle = lines; g.lineWidth = 1;
    for (let y = 0; y < S; y += spacing) { g.globalAlpha = .45; g.beginPath(); g.moveTo(0, y + .5); g.lineTo(S, y + .5); g.stroke(); }
  }, { repeat });
}

/* Soft grain: foam cells and cardboard fibre. */
export function grain(base, speck, count, size, repeat, seed) {
  const R = rng(seed || 7);
  return make(256, (g, S) => {
    g.fillStyle = base; g.fillRect(0, 0, S, S);
    for (let i = 0; i < count; i++) {
      g.globalAlpha = .08 + R() * .22; g.fillStyle = speck;
      const w = size * (.5 + R()), h = size * (.5 + R());
      g.fillRect(R() * S, R() * S, w, h);
    }
  }, { repeat });
}

/* Raised ribs running around a strap coil. */
export function ribs(repeat) {
  return make(128, (g, S) => {
    g.fillStyle = '#7a7a7a'; g.fillRect(0, 0, S, S);
    for (let x = 0; x < S; x += 8) { g.fillStyle = '#ddd'; g.fillRect(x, 0, 3, S); }
  }, { repeat, color: false });
}
