/** All scroll choreography in one place, shared by the scene and tests. */
export const SCENE_STOPS = [0, 0.47, 0.86];
export const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
export const smooth = (a, b, x) => {
  const t = clamp((x - a) / (b - a));
  return t * t * (3 - 2 * t);
};
export function scenePose(progress, mobile = false) {
  const p = clamp(progress);
  const cross = smooth(0.5, 0.78, p);
  return {
    // Tilt is applied to the whole helix; spin turns it around its own axis.
    tilt: [
      -0.14 + Math.sin(p * Math.PI) * 0.1,
      mobile ? -0.4 : -0.42 + cross * 0.84,
    ],
    spin: -0.3 + p * 2.4,
    scale: mobile
      ? 0.36 + Math.sin(p * Math.PI) * 0.03
      : 0.72 + Math.sin(p * Math.PI) * 0.06,
    offsetX: mobile ? 0.2 : 0.21 - cross * 0.44,
    offsetY: mobile ? -0.92 : -0.04,
    cameraZ: mobile ? 6.4 : 6.6 - Math.sin(p * Math.PI) * 0.45,
    // 0: three loose fibres · 1: a tight triple helix.
    wind: smooth(0.06, 0.74, p),
    light: 1.1 + smooth(0, 0.16, p) * 0.45,
  };
}
