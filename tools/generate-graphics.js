/*
 * Generates the hand-drawn SVGs used on the project detail pages.
 *
 * Not part of the site build. The output is committed under
 * public/content/projects/images/, so this only needs running when a
 * graphic changes:
 *
 *   npm i --no-save roughjs && node tools/generate-graphics.js
 *
 * Seeds are fixed, so regenerating produces byte-identical output.
 */
const fs = require('fs');
const path = require('path');
const rough = require('roughjs');

const gen = rough.generator();

const INK = '#1a1a1a';
const MID = '#666';
const SOFT = '#b4b4b4';
const TINT = '#e6e6e6';
const PAPER = '#fcfcfc';

const OUT = path.join(__dirname, '..', 'public', 'content', 'projects', 'images');

// rough emits full float precision, which roughly doubles the file for no
// visible difference at these sizes.
const trim = d => d.replace(/-?\d+\.\d+/g, m => String(Math.round(m * 10) / 10));

// A rough drawable is a list of op-sets; each becomes one SVG path.
function ink(drawable) {
  const o = drawable.options;
  // rough only applies strokeLineDash in its own DOM renderer, so carry it over.
  const dash = o.strokeLineDash ? ` stroke-dasharray="${o.strokeLineDash.join(' ')}"` : '';
  return drawable.sets
    .map(set => {
      const d = trim(gen.opsToPath(set));
      if (set.type === 'path') {
        return `<path d="${d}" fill="none" stroke="${o.stroke}" stroke-width="${o.strokeWidth}"${dash} stroke-linecap="round" stroke-linejoin="round"/>`;
      }
      if (set.type === 'fillPath') {
        return `<path d="${d}" fill="${o.fill}" stroke="none"/>`;
      }
      if (set.type === 'fillSketch') {
        const w = o.fillWeight < 0 ? o.strokeWidth / 2 : o.fillWeight;
        return `<path d="${d}" fill="none" stroke="${o.fill}" stroke-width="${w}" stroke-linecap="round"/>`;
      }
      return '';
    })
    .join('');
}

const sketch = (stroke, strokeWidth, roughness, seed, extra = {}) => ({
  stroke, strokeWidth, roughness, seed, bowing: 1.4, ...extra,
});

const wrap = (w, h, label, body) =>
  `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" role="img" aria-label="${label}">\n${body}\n</svg>\n`;

// ---------------------------------------------------------------------------
// NAS — snapshots gathered into groups, one group per person
// ---------------------------------------------------------------------------

function photo(cx, cy, angle, seed, withFace) {
  const w = 44, h = 34;
  const x = cx - w / 2, y = cy - h / 2;
  let s = ink(gen.rectangle(x, y, w, h, sketch(INK, 1.2, 1.05, seed, { fill: PAPER, fillStyle: 'solid' })));
  if (withFace) {
    s += ink(gen.circle(cx, cy - 6, 14, sketch(MID, 0.95, 1.05, seed + 40)));
    // control point well above the endpoints so the arc meets the head and
    // reads as shoulders rather than as a mouth floating under it
    s += ink(gen.path(`M${cx - 16} ${cy + 14} Q${cx} ${cy - 12} ${cx + 16} ${cy + 14}`, sketch(MID, 0.95, 1.05, seed + 80)));
  } else {
    s += ink(gen.path(`M${x + 5} ${cy + 8} L${x + 17} ${cy - 3} L${x + 27} ${cy + 4} L${x + 39} ${cy - 7}`, sketch(SOFT, 0.9, 1.2, seed + 60)));
    s += ink(gen.circle(x + 12, cy - 8, 8, sketch(SOFT, 0.9, 1.2, seed + 61)));
  }
  return `<g transform="rotate(${angle} ${cx} ${cy})">${s}</g>`;
}

function clusters() {
  const groups = [
    {
      lasso: [132, 152, 196, 162], seed: 3,
      shots: [[92, 112, -8, 1, 1], [168, 138, 6, 2, 1], [120, 196, 4, 3, 1]],
    },
    {
      lasso: [352, 108, 176, 136], seed: 17,
      shots: [[312, 80, -7, 6, 1], [392, 96, 8, 7, 1], [344, 148, -4, 8, 0]],
    },
    {
      lasso: [508, 208, 196, 146], seed: 29,
      shots: [[462, 178, -6, 10, 1], [546, 186, 7, 11, 1], [496, 250, 5, 12, 0]],
    },
  ];

  const body = groups
    .map(g => {
      const [cx, cy, w, h] = g.lasso;
      const hull = ink(
        gen.ellipse(cx, cy, w, h,
          sketch('#cfcfcf', 1.05, 2.1, g.seed, { fill: '#ededed', fillStyle: 'hachure', hachureGap: 11, fillWeight: 0.5, hachureAngle: -41 }))
      );
      const shots = g.shots.map(([x, y, a, s, f]) => photo(x, y, a, s, f)).join('');
      return `  <g>${hull}${shots}</g>`;
    })
    .join('\n');

  return wrap(650, 300, 'Snapshots gathered into three loose groups, one group per person', body);
}

// ---------------------------------------------------------------------------
// Frame Art — a framed picture on a wall, fed from a phone and a stack of works
// ---------------------------------------------------------------------------

function frameArt() {
  const fx = 196, fy = 44, fw = 292, fh = 196;
  const mx = fx + 19, my = fy + 19, mw = fw - 38, mh = fh - 38;

  const frame =
    ink(gen.rectangle(fx, fy, fw, fh, sketch(INK, 1.5, 1.1, 101))) +
    ink(gen.rectangle(mx, my, mw, mh, sketch(SOFT, 1, 1.4, 102)));

  // the picture inside: hills, a sun, a horizon
  const horizon = my + mh * 0.62;
  const art =
    ink(gen.polygon(
      [[mx + 2, horizon], [mx + 54, horizon - 46], [mx + 104, horizon - 16], [mx + 158, horizon - 60], [mx + 214, horizon - 8], [mx + mw - 2, horizon]],
      sketch(SOFT, 1.1, 1.8, 103, { fill: TINT, fillStyle: 'hachure', hachureGap: 6, fillWeight: 0.55, hachureAngle: 52 })
    )) +
    ink(gen.circle(mx + mw - 62, my + 44, 44, sketch(MID, 1.1, 1.5, 104))) +
    ink(gen.line(mx + 2, horizon, mx + mw - 2, horizon, sketch(SOFT, 1, 2, 105))) +
    ink(gen.line(mx + 16, horizon + 22, mx + 96, horizon + 22, sketch(SOFT, 0.85, 2.4, 106))) +
    ink(gen.line(mx + 30, horizon + 38, mx + 78, horizon + 38, sketch(SOFT, 0.85, 2.4, 107)));

  // phone
  const px = 44, py = 128, pw = 78, ph = 132;
  const phone =
    ink(gen.rectangle(px, py, pw, ph, sketch(INK, 1.35, 1.2, 110))) +
    ink(gen.rectangle(px + 10, py + 16, pw - 20, ph - 52, sketch('#cfcfcf', 1, 1.4, 111, { fill: '#ededed', fillStyle: 'hachure', hachureGap: 10, fillWeight: 0.45, hachureAngle: 38 }))) +
    ink(gen.circle(px + pw / 2, py + ph - 20, 13, sketch(MID, 1, 1.4, 112)));

  // a fanned stack of candidate works, the front one picked
  const stack = [0, 1, 2]
    .map(i => {
      const front = i === 2;
      return ink(gen.rectangle(536 + i * 11, 118 + i * 12, 64, 48,
        sketch(front ? INK : '#c4c4c4', front ? 1.3 : 1, 1.2, 120 + i,
          front ? { fill: PAPER, fillStyle: 'solid' } : {})));
    })
    .join('');

  // loose connections
  const wires =
    ink(gen.path(`M${px + pw + 8} 186 C 152 180, 172 156, ${fx - 10} 146`, sketch('#c4c4c4', 1.1, 1.6, 130, { strokeLineDash: [5, 7] }))) +
    ink(gen.path(`M530 158 C 518 154, 506 150, ${fx + fw + 10} 146`, sketch('#c4c4c4', 1.1, 1.6, 131, { strokeLineDash: [5, 7] })));

  // wall line
  const wall = ink(gen.line(24, 292, 626, 292, sketch(SOFT, 1.1, 2.6, 140)));

  return wrap(650, 320, 'A framed picture on a wall, fed from a phone and a stack of candidate works',
    `  <g>${wall}${wires}${frame}${art}${phone}${stack}</g>`);
}

fs.mkdirSync(OUT, { recursive: true });
fs.writeFileSync(path.join(OUT, 'nas-clusters.svg'), clusters());
fs.writeFileSync(path.join(OUT, 'frame-wall.svg'), frameArt());
console.log('wrote nas-clusters.svg and frame-wall.svg');
