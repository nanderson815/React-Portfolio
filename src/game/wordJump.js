/*
 * The words of a project page, briefly borrowed as a climbing course.
 *
 * Lifecycle: the captured words fly from where they sit in the article to
 * their place in the course, you bounce up it, and when you fall past the
 * bottom they fly back. The caller hides the real article for the duration
 * and shows it again from onExit.
 *
 * Everything renders to one canvas. Two hundred absolutely positioned spans
 * animating at once is not something a phone enjoys.
 */

const GRAVITY = 0.62;
const BOUNCE = 14.4;      // apex is BOUNCE^2 / 2*GRAVITY, about 167px
const MOVE = 5.2;
const PLAYER = 13;
const STEP = 1000 / 60;
const MAX_FRAME = 100;    // don't simulate a backgrounded tab all at once

const ROW_GAP_MIN = 84;
const ROW_GAP_MAX = 114;  // has to stay under the jump apex
const MIN_ROWS = 22;      // a short viewport still gets a real climb
const MIN_PLATFORM = 36;
// A bounce lasts about 2 * BOUNCE / GRAVITY frames and carries MOVE per frame,
// so this is roughly how far sideways one jump can reach. Rows are placed
// within it of each other, otherwise the course is impossible rather than hard.
const REACH = 190;
const ROW_PADDING = 26;  // clear space between two platforms sharing a row

// The climber, built out of type like everything else on the page. Arms go up
// on the way up and down on the way down, which is the whole animation.
// Rows are centred individually, so a two-character row of tucked legs still
// lines up under the body.
const FIGURE = {
  rise: ['\\o/', ' | ', '/\\'],
  apex: [' o ', '/|\\', '/ \\'],
  fall: ['/o\\', ' | ', '/ \\'],
};
const FIGURE_SIZE = 13;
const FIGURE_LINE = 10;  // tighter than the font's own leading
const LEAN = 0.1;

const SCATTER_MS = 760;
const HOLD_MS = 950;
const RETURN_MS = 900;

const easeOut = t => 1 - Math.pow(1 - t, 3);
const easeInOut = t => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const clamp01 = t => (t < 0 ? 0 : t > 1 ? 1 : t);

export function buildCourse(words, viewWidth, groundY) {
  const platforms = [];
  // Repeat the pool if there was little text on screen, so the climb is
  // always worth starting.
  const rows = Math.max(MIN_ROWS, Math.ceil(words.length / 1.6));
  let y = groundY - 92;
  let i = 0;
  let anchor = viewWidth / 2;

  for (let row = 0; row < rows; row++) {
    // The platform that carries the route stays within reach of the row below.
    const word = words[i % words.length];
    i++;
    const width = Math.max(word.w, MIN_PLATFORM);
    const limit = Math.max(0, viewWidth - width - 20);
    const wanted = anchor - width / 2 + (Math.random() * 2 - 1) * REACH;
    const x = Math.max(10, Math.min(limit, wanted));
    const primary = { word, x, y, width, height: Math.max(word.h, 10) };
    platforms.push(primary);
    anchor = x + width / 2;

    // Some rows get a second platform as an alternative route. It has to
    // clear the first, or the two words render on top of each other.
    if (Math.random() < 0.42) {
      const extra = words[i % words.length];
      const extraWidth = Math.max(extra.w, MIN_PLATFORM);
      const extraLimit = Math.max(0, viewWidth - extraWidth - 20);
      const leftMax = Math.min(primary.x - ROW_PADDING - extraWidth, extraLimit);
      const rightMin = primary.x + primary.width + ROW_PADDING;
      const slots = [];
      if (leftMax >= 10) slots.push([10, leftMax]);
      if (rightMin <= extraLimit) slots.push([rightMin, extraLimit]);
      if (slots.length > 0) {
        const slot = slots[Math.floor(Math.random() * slots.length)];
        platforms.push({
          word: extra,
          x: slot[0] + Math.random() * Math.max(0, slot[1] - slot[0]),
          y,
          width: extraWidth,
          height: Math.max(extra.h, 10),
        });
        i++;
      }
    }

    y -= ROW_GAP_MIN + Math.random() * (ROW_GAP_MAX - ROW_GAP_MIN);
  }

  return { platforms, topY: y };
}

export function startWordJump(words, options) {
  const opts = options || {};
  const onExit = opts.onExit || function () {};
  const background = opts.background || '#fafafa';
  const ink = opts.ink || '#1a1a1a';

  let viewWidth = window.innerWidth;
  let viewHeight = window.innerHeight;

  const canvas = document.createElement('canvas');
  canvas.className = 'wordjump';
  canvas.setAttribute('role', 'application');
  canvas.setAttribute('aria-label', 'Climb the words. Steer left and right. Escape to leave.');
  document.body.appendChild(canvas);
  const ctx = canvas.getContext('2d');

  function resize() {
    viewWidth = window.innerWidth;
    viewHeight = window.innerHeight;
    const dpr = window.devicePixelRatio || 1;
    canvas.width = Math.round(viewWidth * dpr);
    canvas.height = Math.round(viewHeight * dpr);
    canvas.style.width = viewWidth + 'px';
    canvas.style.height = viewHeight + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  resize();

  const previousOverflow = document.body.style.overflow;
  document.body.style.overflow = 'hidden';

  const groundY = viewHeight - 96;
  const course = buildCourse(words, viewWidth, groundY);
  const platforms = course.platforms;
  // Full width: the opening bounces should be survivable while you get your
  // bearings. Once the camera has climbed past it, it is gone for good.
  const ground = { x: 0, y: groundY, width: viewWidth };

  const player = { x: viewWidth / 2 - PLAYER / 2, y: groundY - PLAYER, vx: 0, vy: 0 };
  let camera = 0;
  let highest = groundY;
  let phase = 'scatter';
  let phaseStart = performance.now();
  let reachedTop = false;

  const held = { left: false, right: false };
  let raf = 0;
  let last = performance.now();
  let accumulator = 0;
  let stopped = false;

  function height() {
    return Math.max(0, Math.round((groundY - highest) / 10));
  }

  function onKey(event) {
    if (event.key === 'Escape') {
      if (phase !== 'return') beginReturn();
      return;
    }
    const down = event.type === 'keydown';
    const key = event.key;
    if (key === 'ArrowLeft' || key === 'a' || key === 'A') held.left = down;
    if (key === 'ArrowRight' || key === 'd' || key === 'D') held.right = down;
    if (key === 'ArrowLeft' || key === 'ArrowRight' || key === 'ArrowUp' || key === 'ArrowDown' || key === ' ') {
      event.preventDefault();
    }
  }

  function steerFrom(clientX) {
    held.left = clientX < viewWidth / 2;
    held.right = !held.left;
  }
  function onPointerDown(event) {
    event.preventDefault();
    steerFrom(event.clientX);
  }
  function onPointerMove(event) {
    if (held.left || held.right) steerFrom(event.clientX);
  }
  function onPointerUp() {
    held.left = false;
    held.right = false;
  }

  window.addEventListener('keydown', onKey);
  window.addEventListener('keyup', onKey);
  window.addEventListener('resize', resize);
  canvas.addEventListener('pointerdown', onPointerDown);
  canvas.addEventListener('pointermove', onPointerMove);
  window.addEventListener('pointerup', onPointerUp);
  window.addEventListener('pointercancel', onPointerUp);

  function beginReturn() {
    // Freeze where every word ended up, so it can fly home from there.
    for (let i = 0; i < platforms.length; i++) {
      platforms[i].fromX = platforms[i].x + (platforms[i].width - platforms[i].word.w) / 2;
      platforms[i].fromY = platforms[i].y - camera;
    }
    phase = 'return';
    phaseStart = performance.now();
  }

  function simulate() {
    player.vx = 0;
    if (held.left) player.vx -= MOVE;
    if (held.right) player.vx += MOVE;

    player.x += player.vx;
    if (player.x + PLAYER < 0) player.x = viewWidth;
    else if (player.x > viewWidth) player.x = -PLAYER;

    const previousBottom = player.y + PLAYER;
    player.vy += GRAVITY;
    player.y += player.vy;
    const bottom = player.y + PLAYER;

    if (player.vy > 0) {
      // One-way: only land when falling through the top edge this frame.
      if (previousBottom <= ground.y && bottom >= ground.y &&
          player.x + PLAYER > ground.x && player.x < ground.x + ground.width) {
        player.y = ground.y - PLAYER;
        player.vy = -BOUNCE;
      } else {
        for (let i = 0; i < platforms.length; i++) {
          const p = platforms[i];
          if (previousBottom <= p.y && bottom >= p.y &&
              player.x + PLAYER > p.x && player.x < p.x + p.width) {
            player.y = p.y - PLAYER;
            player.vy = -BOUNCE;
            break;
          }
        }
      }
    }

    if (player.y < highest) highest = player.y;
    const target = player.y - viewHeight * 0.56;
    if (target < camera) camera = target;

    if (!reachedTop && player.y < course.topY) reachedTop = true;
    if (player.y - camera > viewHeight + 80) {
      phase = 'hold';
      phaseStart = performance.now();
    }
  }

  function drawWord(word, x, y, alpha) {
    ctx.globalAlpha = alpha;
    ctx.font = word.font;
    ctx.fillStyle = word.color;
    ctx.fillText(word.text, x, y);
    ctx.globalAlpha = 1;
  }

  function drawPlatforms() {
    for (let i = 0; i < platforms.length; i++) {
      const p = platforms[i];
      const y = p.y - camera;
      if (y < -80 || y > viewHeight + 80) continue;
      ctx.fillStyle = '#dcdcdc';
      ctx.fillRect(p.x, y - 1, p.width, 1);
      drawWord(p.word, p.x + (p.width - p.word.w) / 2, y, 1);
    }
    const gy = ground.y - camera;
    if (gy > -20 && gy < viewHeight + 20) {
      ctx.fillStyle = '#c9c9c9';
      ctx.fillRect(ground.x, gy - 1, ground.width, 1);
    }
  }

  function drawPlayer() {
    // He is drawn a little larger than the box he collides with, which is
    // both easier to see and more forgiving to land.
    const frame = player.vy < -1.5 ? FIGURE.rise
      : player.vy > 1.5 ? FIGURE.fall
        : FIGURE.apex;
    const squash = Math.max(-0.14, Math.min(0.14, player.vy / 90));
    const lean = player.vx === 0 ? 0 : (player.vx > 0 ? LEAN : -LEAN);

    ctx.save();
    ctx.translate(player.x + PLAYER / 2, player.y - camera + PLAYER);
    ctx.rotate(lean);
    ctx.scale(1 - squash, 1 + squash);
    ctx.font = `600 ${FIGURE_SIZE}px "JetBrains Mono", monospace`;
    ctx.fillStyle = ink;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'bottom';
    for (let i = 0; i < frame.length; i++) {
      ctx.fillText(frame[i], 0, -(frame.length - 1 - i) * FIGURE_LINE);
    }
    ctx.restore();
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';
  }

  function drawHud() {
    ctx.font = '400 12px "JetBrains Mono", monospace';
    ctx.fillStyle = '#999';
    ctx.textBaseline = 'top';
    ctx.fillText(height() + 'm', 16, 16);
    const hint = 'esc to leave';
    ctx.fillText(hint, viewWidth - ctx.measureText(hint).width - 16, 16);
  }

  function drawCentred(lines) {
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = ink;
    ctx.font = '500 18px "JetBrains Mono", monospace';
    ctx.fillText(lines[0], viewWidth / 2, viewHeight / 2 - 12);
    ctx.font = '400 12px "JetBrains Mono", monospace';
    ctx.fillStyle = '#999';
    ctx.fillText(lines[1], viewWidth / 2, viewHeight / 2 + 14);
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';
  }

  function frame(now) {
    if (stopped) return;
    const elapsed = now - phaseStart;
    ctx.fillStyle = background;
    ctx.fillRect(0, 0, viewWidth, viewHeight);
    ctx.textBaseline = 'top';

    if (phase === 'scatter') {
      const base = clamp01(elapsed / SCATTER_MS);
      for (let i = 0; i < platforms.length; i++) {
        const p = platforms[i];
        const stagger = (i / platforms.length) * 0.22;
        const t = easeOut(clamp01((base - stagger) / (1 - stagger)));
        const px = p.x + (p.width - p.word.w) / 2;
        const x = p.word.x + (px - p.word.x) * t;
        const y = p.word.y + (p.y - p.word.y) * t;
        drawWord(p.word, x, y, 1);
      }
      drawPlayer();
      if (base >= 1) {
        phase = 'play';
        last = now;
        accumulator = 0;
      }
    } else if (phase === 'play') {
      accumulator += Math.min(MAX_FRAME, now - last);
      last = now;
      while (accumulator >= STEP) {
        simulate();
        accumulator -= STEP;
        if (phase !== 'play') break;
      }
      drawPlatforms();
      drawPlayer();
      drawHud();
    } else if (phase === 'hold') {
      drawPlatforms();
      drawCentred([
        reachedTop ? 'top of the page' : height() + 'm',
        reachedTop ? 'nothing above this' : 'tap three times to climb again',
      ]);
      if (elapsed > HOLD_MS) beginReturn();
    } else if (phase === 'return') {
      const t = easeInOut(clamp01(elapsed / RETURN_MS));
      for (let i = 0; i < platforms.length; i++) {
        const p = platforms[i];
        const fromX = p.fromX === undefined ? p.x : p.fromX;
        const fromY = p.fromY === undefined ? p.y - camera : p.fromY;
        drawWord(p.word, fromX + (p.word.x - fromX) * t, fromY + (p.word.y - fromY) * t, 1);
      }
      if (t >= 1) {
        stop();
        return;
      }
    }

    raf = window.requestAnimationFrame(frame);
  }

  function stop() {
    if (stopped) return;
    stopped = true;
    window.cancelAnimationFrame(raf);
    window.removeEventListener('keydown', onKey);
    window.removeEventListener('keyup', onKey);
    window.removeEventListener('resize', resize);
    window.removeEventListener('pointerup', onPointerUp);
    window.removeEventListener('pointercancel', onPointerUp);
    canvas.removeEventListener('pointerdown', onPointerDown);
    canvas.removeEventListener('pointermove', onPointerMove);
    document.body.style.overflow = previousOverflow;
    if (canvas.parentNode) canvas.parentNode.removeChild(canvas);
    onExit();
  }

  raf = window.requestAnimationFrame(frame);
  return { stop };
}
