/* The hero sheet: an isometric drawing of one 1220 x 2440 mm PVC sheet whose edge thickens with the chosen
   thickness. One file, two users: build/pages/home.js calls it in Node so the page already shows a sheet
   without JavaScript, and script.js calls it in the browser to redraw it while the gauge moves. */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.EIISheet = factory();
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  var STD = [1, 2, 3, 4, 5, 6, 8, 10, 12, 15, 20];   // thicknesses we stock, in mm
  var SHEET_L = 2440, SHEET_W = 1220;                  // mm
  var DENSITY = 1.35;                                  // g/cm3, same figure the calculator and guides use
  var S = 0.139;                                       // drawing scale: px per mm of sheet length
  var K = 2.8;                                         // edge height: px per mm of thickness (exaggerated on purpose)
  var C = 0.866, H = 0.5;                              // 30 degree isometric axes

  function kg(t) { return SHEET_L / 1000 * SHEET_W / 1000 * t * DENSITY; }
  function r1(n) { return Math.round(n * 10) / 10; }
  function pt(p) { return r1(p[0]) + ',' + r1(p[1]); }

  /* t: thickness in mm (may be fractional while animating). Returns an SVG string, viewBox 56 44 556 384. */
  function draw(t, labelMm) {
    var L = SHEET_L * S, W = SHEET_W * S, h = t * K;
    var base = 372;                                    // the sheet stands on this line; a thicker sheet grows upward
    var x0 = 320 - C * (L - W) / 2;
    var y0 = base - H * (L + W) - h;
    // top face corners: P0 back, P1 right, P2 front, P3 left
    var P0 = [x0, y0], P1 = [x0 + C * L, y0 + H * L], P3 = [x0 - C * W, y0 + H * W], P2 = [P1[0] - C * W, P1[1] + H * W];
    var down = function (p) { return [p[0], p[1] + h]; };
    var map = function (u, v) { return [x0 + (u * C - v * C) * S, y0 + (u * H + v * H) * S]; };

    // 4 x 3 panels of 580 x 390 mm. The gap is drawn wider than a real saw cut so it reads at this size.
    var cols = 4, rows = 3, pw = 580, ph = 390, gap = 22;
    var ox = (SHEET_L - (cols * pw + (cols - 1) * gap)) / 2, oy = (SHEET_W - (rows * ph + (rows - 1) * gap)) / 2;
    var panels = '', n = 0;
    for (var r = 0; r < rows; r++) for (var c = 0; c < cols; c++) {
      var u = ox + c * (pw + gap), v = oy + r * (ph + gap);
      var q = [map(u, v), map(u + pw, v), map(u + pw, v + ph), map(u, v + ph)];
      panels += '<polygon class="sh-p' + (r === 1 && c === 2 ? ' sh-p--mark' : '') + '" style="--n:' + (n++) + '" points="' + q.map(pt).join(' ') + '"/>';
    }

    // dimension lines, offset outward from the two front edges
    var off = 20;
    var a1 = [P3[0] - C * off * 0.0 - off * C, P3[1] + h + off * H], b1 = [P2[0] - off * C, P2[1] + h + off * H];     // long edge, lower left
    var a2 = [P2[0] + off * C, P2[1] + h + off * H], b2 = [P1[0] + off * C, P1[1] + h + off * H];                        // short edge, lower right
    var mid = function (a, b) { return [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2]; };
    var m1 = mid(a1, b1), m2 = mid(a2, b2);
    var tx = P1[0] + 22, ty1 = P1[1], ty2 = P1[1] + h;   // thickness bracket at the right-hand corner
    var dim = function (a, b) { return '<path d="M' + pt(a) + 'L' + pt(b) + '"/>'; };

    return '' +
      '<g class="sh-shadow"><polygon points="' + [P3, P2, P1, P0].map(function (p) { return pt([p[0] - 8, p[1] + h + 10]); }).join(' ') + '"/></g>' +
      '<g class="sh-body">' +
        '<polygon class="sh-l" points="' + [P3, P2, down(P2), down(P3)].map(pt).join(' ') + '"/>' +
        '<polygon class="sh-r" points="' + [P2, P1, down(P1), down(P2)].map(pt).join(' ') + '"/>' +
        '<polygon class="sh-t" points="' + [P0, P1, P2, P3].map(pt).join(' ') + '"/>' +
        '<g class="sh-cuts">' + panels + '</g>' +
        '<path class="sh-hi" d="M' + pt(P3) + 'L' + pt(P2) + 'L' + pt(P1) + '"/>' +
      '</g>' +
      '<g class="sh-dim">' +
        dim(a1, b1) + dim([a1[0] + 4 * C, a1[1] - 4 * H], [a1[0] - 4 * C, a1[1] + 4 * H]) + dim([b1[0] + 4 * C, b1[1] - 4 * H], [b1[0] - 4 * C, b1[1] + 4 * H]) +
        dim(a2, b2) + dim([a2[0] + 4 * C, a2[1] + 4 * H], [a2[0] - 4 * C, a2[1] - 4 * H]) + dim([b2[0] + 4 * C, b2[1] + 4 * H], [b2[0] - 4 * C, b2[1] - 4 * H]) +
        '<path d="M' + r1(tx) + ',' + r1(ty1) + 'V' + r1(ty2) + 'M' + r1(tx - 4) + ',' + r1(ty1) + 'H' + r1(tx + 4) + 'M' + r1(tx - 4) + ',' + r1(ty2) + 'H' + r1(tx + 4) + '"/>' +
        '<text class="sh-len" transform="translate(' + pt([m1[0] - 6 * C - 6, m1[1] + 14]) + ') rotate(30)" text-anchor="middle">' + SHEET_L + ' mm</text>' +
        '<text class="sh-len" transform="translate(' + pt([m2[0] + 6 * C + 6, m2[1] + 14]) + ') rotate(-30)" text-anchor="middle">' + SHEET_W + ' mm</text>' +
        '<text class="sh-thk" x="' + r1(tx + 11) + '" y="' + r1((ty1 + ty2) / 2 + 4.5) + '">' + (labelMm != null ? labelMm : Math.round(t * 10) / 10) + ' mm</text>' +
      '</g>';
  }

  function svg(t, label, labelMm) {
    return '<svg class="sheet-art" viewBox="56 44 556 384" role="img" aria-label="' + String(label || '').replace(/"/g, '&quot;') + '" focusable="false">' + draw(t, labelMm) + '</svg>';
  }

  return { STD: STD, kg: kg, draw: draw, svg: svg, DENSITY: DENSITY, L: SHEET_L, W: SHEET_W };
});
