/**
 * The before/after fibre: one strand of the collagen helix, alone, crossing the photo.
 * Coordinates are % of the frame (0–100). Pure math so the page and the tests share it.
 *
 * Everything left of the fibre shows "after"; right of it, "before". `p` goes 0 → 1 as the
 * visitor scrolls (or drags): the fibre rests on the left edge, sweeps across, and ends as
 * the right edge of the frame. The wave is small at the edges so no sliver of the other photo
 * shows outside the fibre's own body.
 */
export const FIBER = { amplitude: 3, edgeAmplitude: 0.5, waves: 1.15, samples: 32, overshoot: 4 };

const clamp = (v) => Math.min(1, Math.max(0, v));

/** Centre line x for progress p, kept just inside the frame so the whole tube shows at both ends. */
export const fiberX = (p) => 1.2 + 97.6 * clamp(p);

/** Wave height for progress p: calm at the edges, fullest mid-sweep. */
export const fiberAmplitude = (p) =>
  FIBER.edgeAmplitude + (FIBER.amplitude - FIBER.edgeAmplitude) * Math.sin(Math.PI * clamp(p));

/** Points from top to bottom, a little past both edges. `phase` makes the wave travel while it moves. */
export function fiberPoints(p, phase = 0, samples = FIBER.samples) {
  const x = fiberX(p);
  const a = fiberAmplitude(p);
  const pts = [];
  for (let i = 0; i <= samples; i++) {
    const y = -FIBER.overshoot + ((100 + 2 * FIBER.overshoot) * i) / samples;
    pts.push([x + a * Math.sin(2 * Math.PI * (FIBER.waves * (y / 100) + phase)), y]);
  }
  return pts;
}

const f = (n) => Number(n.toFixed(2));

/** Smooth SVG path (viewBox 0 0 100 100) through the points, using midpoints as curve ends. */
export function fiberPath(pts) {
  let d = `M${f(pts[0][0])} ${f(pts[0][1])}`;
  for (let i = 1; i < pts.length - 1; i++) {
    const mx = (pts[i][0] + pts[i + 1][0]) / 2;
    const my = (pts[i][1] + pts[i + 1][1]) / 2;
    d += `Q${f(pts[i][0])} ${f(pts[i][1])} ${f(mx)} ${f(my)}`;
  }
  const last = pts[pts.length - 1];
  return `${d}L${f(last[0])} ${f(last[1])}`;
}

/** CSS clip-path for the "after" photo: everything left of the fibre. */
export function afterClip(pts) {
  return `polygon(-10% -10%, ${pts.map(([x, y]) => `${f(x)}% ${f(y)}%`).join(", ")}, -10% 110%)`;
}

/**
 * Scroll choreography for n cases in a row, one stretch of the scroll each. Within a case the fibre
 * first draws down the left edge (it "arrives" from the helix above), then sweeps across and holds the
 * full "after"; before the next case it retracts up the right edge, so every case gets its own pass
 * without scrolling back. The last case keeps the fibre resting as the frame's right edge.
 */
export function sequenceOf(scroll, n = 1) {
  const s = clamp(scroll) * n;
  const index = Math.min(n - 1, Math.floor(s));
  const local = s - index;
  const last = index === n - 1;
  const draw = local < 0.1 ? local / 0.1 : !last && local > 0.9 ? (1 - local) / 0.1 : 1;
  return { index, draw: clamp(draw), p: clamp((local - 0.1) / 0.68) };
}

/** Scroll position (0–1 of the track) where case i starts sweeping, for the case buttons. */
export const caseStart = (i, n) => (i + 0.1) / n;
