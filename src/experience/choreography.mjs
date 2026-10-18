/** All scroll choreography in one place, shared by the scene and tests. */
export const SCENE_STOPS = [0, 0.47, 0.86];
export const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
export const smooth = (a, b, x) => {
  const t = clamp((x - a) / (b - a));
  return t * t * (3 - 2 * t);
};
export function scenePose(progress, mobile = false) {
  const p = clamp(progress);
  const turn = smooth(0.12, 0.55, p);
  const open = smooth(0.49, 0.71, p) * (1 - smooth(0.84, 1, p));
  const cross = smooth(0.5, 0.78, p);
  return {
    rotation: [
      -0.17 + Math.sin(p * Math.PI) * 0.14,
      -0.32 + turn * 1.2 + cross * 0.45,
      0.12 - turn * 0.2,
    ],
    scale: mobile
      ? 0.59 + Math.sin(p * Math.PI) * 0.045
      : 1.02 + Math.sin(p * Math.PI) * 0.15,
    offsetX: mobile ? 0.12 : 0.23 - cross * 0.46,
    offsetY: mobile ? -0.87 : -0.05,
    cameraZ: mobile ? 6.4 : 6.6 - Math.sin(p * Math.PI) * 0.45,
    explode: open,
    light: 1.1 + smooth(0, 0.16, p) * 0.45,
  };
}
