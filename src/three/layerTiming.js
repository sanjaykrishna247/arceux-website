// Layer timing for the exploded view. Kept free of three.js so pages can import it
// without pulling in the 3D bundle.

const clamp01 = (v) => Math.min(1, Math.max(0, v));
const smooth = (v) => v * v * (3 - 2 * v);

export function layerProgress(p, k) {
  const start = (7 - k) * 0.035;
  return smooth(clamp01((p - start) / 0.72));
}

/** Strictly one after another, arm first: each layer gets its own slice of the timeline. */
export function sequentialProgress(p, k) {
  const start = (7 - k) * 0.1;
  return smooth(clamp01((p - start) / 0.3));
}
