import { useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { ContactShadows } from '@react-three/drei';
import RobotModel, { POSES } from './RobotModel.jsx';
import Studio from './Studio.jsx';

export const GAP = 0.4;
const NAV_SPACE = 96; // px kept clear under the floating header
const clamp01 = (v) => Math.min(1, Math.max(0, v));
const smooth = (v) => v * v * (3 - 2 * v);

// Label anchor per layer (bottom → top), in the layer's local space.
const ANCHORS = [
  [0.5, 0.18, 0.3],
  [0.02, 0.15, 0.28],
  [-0.05, 0.22, 0.12],
  [0.45, 0.33, 0.02],
  [0.26, 0.23, -0.08],
  [0.53, 0.52, 0.22],
  [0.2, 0.74, 0.3],
  null, // arm: follows the orange elbow joint (the black camera head is invisible on the dark stage)
];

export function layerProgress(p, k) {
  const start = (7 - k) * 0.035;
  return smooth(clamp01((p - start) / 0.72));
}

function Scene({ progress, overlay, labelled }) {
  const rig = useRef({});
  const spin = useRef();
  const { camera, size } = useThree();
  const v = useMemo(() => new THREE.Vector3(), []);
  const target = useMemo(() => new THREE.Vector3(), []);

  useEffect(() => {
    const { width: w, height: h } = size;
    // shift the picture down by half the header band so the stack is centred in the free space
    if (labelled) camera.setViewOffset(w, h, w * 0.02, -NAV_SPACE / 2, w, h);
    // phones with number tags: nudge the stack left to leave a column for the tags
    // and drop it a little so the arm (L01) has clear space under the top edge
    else if (overlay) camera.setViewOffset(w, h, w * 0.12, -h * 0.05, w, h);
    else camera.clearViewOffset();
    camera.updateProjectionMatrix();
  }, [camera, size, labelled, overlay]);

  useFrame((state) => {
    const p = typeof progress === 'number' ? progress : progress.get();
    const r = rig.current;
    if (!r.layers) return;

    r.layers.forEach((g, k) => (g.position.y = layerProgress(p, k) * k * GAP));
    if (r.lidarHead) r.lidarHead.rotation.y = state.clock.elapsedTime * 3;
    if (!labelled) spin.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.25) * 0.25;

    // camera pulls back and rises as the stack grows
    const pe = smooth(clamp01(p));
    const az = 0.55 + 0.35 * pe;
    const el = 0.34 - 0.16 * pe;
    // fit the growing stack into the height left below the header (with a margin)
    // phones: pull back ~15% so the whole stack, arm included, sits inside the stage
    const fit = labelled ? size.height / Math.max(200, size.height - NAV_SPACE - 40) : overlay ? 1.15 : 1;
    const d = ((labelled ? 4.8 : 4.0) + (labelled ? 5.6 : 3.6) * pe) * fit;
    target.set(0.02, 0.45 + 1.35 * pe, 0);
    camera.position.set(
      target.x + d * Math.cos(el) * Math.sin(az),
      target.y + d * Math.sin(el),
      target.z + d * Math.cos(el) * Math.cos(az)
    );
    camera.lookAt(target);

    // project anchors → move labels and leader lines
    const o = overlay?.current;
    if (!o) return;
    const { width: w, height: h } = size;
    // desktop: full labels at 63% width; phones: compact number tags near the right edge
    const labelX = labelled ? w * 0.63 : w - 58;
    const GAP_PX = labelled ? 58 : 30; // minimum vertical spacing between labels
    const top = labelled ? NAV_SPACE + 12 : 16;

    // pass 1: project every layer's anchor to screen space
    const items = [];
    for (let k = 7; k >= 0; k--) {
      if (ANCHORS[k]) v.set(...ANCHORS[k]).add(r.layers[k].position);
      else {
        r.el.updateWorldMatrix(true, false);
        r.el.getWorldPosition(v);
      }
      v.project(camera);
      const sx = (v.x * 0.5 + 0.5) * w;
      const sy = (-v.y * 0.5 + 0.5) * h;
      items.push({ k, sx, sy, ly: sy, vis: clamp01((layerProgress(p, k) - 0.25) / 0.35) });
    }

    // pass 2: top → bottom, push labels apart so they never overlap or sit under the header
    let prev = top - GAP_PX;
    for (const it of items) {
      if (it.vis < 0.02) continue;
      it.ly = Math.max(it.sy, prev + GAP_PX);
      prev = it.ly;
    }
    const overflow = prev - (h - (labelled ? 48 : 16));
    if (overflow > 0) {
      // too tall: pull the whole column up again, keeping the spacing
      for (const it of items) if (it.vis >= 0.02) it.ly -= overflow;
    }

    // pass 3: write to the DOM
    for (const { k, sx, sy, ly, vis } of items) {
      const lab = o.labels[k];
      const line = o.lines[k];
      const dot = o.dots[k];
      if (lab) {
        lab.style.transform = `translate3d(${labelX + (labelled ? 18 : 6)}px, ${ly}px, 0) translateY(-50%)`;
        lab.style.opacity = vis;
      }
      if (line) {
        line.setAttribute('x1', sx);
        line.setAttribute('y1', sy);
        line.setAttribute('x2', labelX);
        line.setAttribute('y2', ly);
        line.style.opacity = vis;
      }
      if (dot) {
        dot.setAttribute('cx', sx);
        dot.setAttribute('cy', sy);
        dot.style.opacity = vis;
      }
    }
    if (o.counter) {
      const n = [0, 1, 2, 3, 4, 5, 6, 7].filter((k) => k > 0 && layerProgress(p, k) > 0.6).length;
      o.counter.textContent = String(n === 7 ? 8 : n).padStart(2, '0');
    }
  });

  return (
    <group ref={spin} rotation-y={0}>
      <RobotModel rig={rig} pose={POSES.active} />
    </group>
  );
}

export default function ExplodedScene({ progress, overlay, labelled = true, active = true }) {
  return (
    <Canvas
      dpr={[1, 1.75]}
      camera={{ fov: 30, near: 0.1, far: 60, position: [3, 2, 4] }}
      gl={{ antialias: true, alpha: true }}
      frameloop={active ? 'always' : 'never'}
      aria-hidden="true"
    >
      <Studio dark />
      <Scene progress={progress} overlay={overlay} labelled={labelled} />
      <ContactShadows position={[0, 0.001, 0]} scale={8} blur={2.6} far={1.2} opacity={0.7} resolution={256} color="#000" />
    </Canvas>
  );
}
