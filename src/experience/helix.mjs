/**
 * Collagen triple helix: three fibres that wind together as `wind` goes 0 → 1.
 * Pure math over typed arrays so the scene, the asset renderer and the tests share it.
 */
export const HELIX = {
  height: 3.4,
  tube: 0.12,
  looseRadius: 0.62,
  tightRadius: 0.21,
  looseTurns: 0.15,
  tightTurns: 2.8,
  cap: 0.04,
};
const TAU = Math.PI * 2;
const mix = (a, b, t) => a + (b - a) * t;

export function strandPoint(t, strand, wind, out = [0, 0, 0]) {
  const e = wind * wind * (3 - 2 * wind);
  const loose = 1 - e;
  const radius =
    mix(HELIX.looseRadius, HELIX.tightRadius, e) +
    loose * 0.18 * Math.sin(TAU * (t + strand / 3));
  // Twist around the middle so both ends wind in, like a fibre being wrung.
  const theta =
    TAU * mix(HELIX.looseTurns, HELIX.tightTurns, e) * (t - 0.5) +
    (strand * TAU) / 3;
  out[0] = radius * Math.cos(theta);
  out[1] = (t - 0.5) * HELIX.height + loose * (strand - 1) * 0.18;
  out[2] = radius * Math.sin(theta);
  return out;
}

/** Bounding length (along the axis) and diameter of the whole helix, for fitting it on screen. */
export function helixExtent(wind) {
  const e = wind * wind * (3 - 2 * wind);
  const radius = mix(HELIX.looseRadius + 0.18, HELIX.tightRadius, e);
  return {
    length: HELIX.height + (1 - e) * 0.36 + HELIX.tube * 2,
    diameter: 2 * (radius + HELIX.tube),
  };
}

/** One fibre as an indexed tube with rounded, tapered ends. */
export function createStrand(strand, segments = 220, radial = 18) {
  const rings = segments + 1;
  const positions = new Float32Array(rings * radial * 3);
  const normals = new Float32Array(rings * radial * 3);
  const indices = new Uint16Array(segments * radial * 6);
  for (let i = 0, k = 0; i < segments; i++) {
    for (let j = 0; j < radial; j++) {
      const a = i * radial + j;
      const b = i * radial + ((j + 1) % radial);
      indices.set([a, b, a + radial, b, b + radial, a + radial], k);
      k += 6;
    }
  }
  const points = new Float32Array(rings * 3);
  const p = [0, 0, 0];
  const n = [0, 0, 0];
  function update(wind) {
    for (let i = 0; i < rings; i++) {
      strandPoint(i / segments, strand, wind, p);
      points.set(p, i * 3);
    }
    for (let i = 0; i < rings; i++) {
      const a = Math.max(0, i - 1) * 3;
      const b = Math.min(segments, i + 1) * 3;
      let tx = points[b] - points[a];
      let ty = points[b + 1] - points[a + 1];
      let tz = points[b + 2] - points[a + 2];
      const tl = Math.hypot(tx, ty, tz) || 1;
      tx /= tl;
      ty /= tl;
      tz /= tl;
      // Parallel transport keeps the ring orientation from flipping.
      if (i === 0) {
        const ax = Math.abs(tx) < 0.9 ? [1, 0, 0] : [0, 1, 0];
        const d = ax[0] * tx + ax[1] * ty + ax[2] * tz;
        n[0] = ax[0] - d * tx;
        n[1] = ax[1] - d * ty;
        n[2] = ax[2] - d * tz;
      } else {
        const d = n[0] * tx + n[1] * ty + n[2] * tz;
        n[0] -= d * tx;
        n[1] -= d * ty;
        n[2] -= d * tz;
      }
      const nl = Math.hypot(n[0], n[1], n[2]) || 1;
      n[0] /= nl;
      n[1] /= nl;
      n[2] /= nl;
      const bx = ty * n[2] - tz * n[1];
      const by = tz * n[0] - tx * n[2];
      const bz = tx * n[1] - ty * n[0];
      const t = i / segments;
      const u = Math.min(t, 1 - t) / HELIX.cap;
      const sin = u >= 1 ? 1 : Math.sqrt(1 - (1 - u) ** 2);
      const cos = u >= 1 ? 0 : (1 - u) * (t < 0.5 ? -1 : 1);
      const r = HELIX.tube * sin;
      for (let j = 0; j < radial; j++) {
        const angle = (j / radial) * TAU;
        const c = Math.cos(angle);
        const s = Math.sin(angle);
        const ox = c * n[0] + s * bx;
        const oy = c * n[1] + s * by;
        const oz = c * n[2] + s * bz;
        const v = (i * radial + j) * 3;
        positions[v] = points[i * 3] + ox * r;
        positions[v + 1] = points[i * 3 + 1] + oy * r;
        positions[v + 2] = points[i * 3 + 2] + oz * r;
        normals[v] = ox * sin + tx * cos;
        normals[v + 1] = oy * sin + ty * cos;
        normals[v + 2] = oz * sin + tz * cos;
      }
    }
  }
  return { positions, normals, indices, update };
}
