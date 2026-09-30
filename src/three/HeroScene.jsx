import { useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { ContactShadows, Grid, OrbitControls } from '@react-three/drei';
import RobotModel, { POSES, applyPose } from './RobotModel.jsx';
import { getMaterials } from './materials.js';
import Studio from './Studio.jsx';

const LIDAR = new THREE.Vector3(0.42, 0.3, 0);
const SCAN_R = 3.4;

const clamp01 = (v) => Math.min(1, Math.max(0, v));
const smooth = (v) => v * v * (3 - 2 * v);
const seg = (t, a, b) => smooth(clamp01((t - a) / (b - a)));
const lerp = (a, b, k) => a + (b - a) * k;

/** A soft wedge that fades from its leading edge — the LiDAR scan cone. */
function useScanTexture() {
  return useMemo(() => {
    const s = 512;
    const c = document.createElement('canvas');
    c.width = c.height = s;
    const g = c.getContext('2d');
    const cx = s / 2;
    const N = 70;
    const span = 1.0;
    for (let i = 0; i < N; i++) {
      const f = Math.pow(1 - i / N, 2.2);
      const grad = g.createRadialGradient(cx, cx, 0, cx, cx, cx);
      grad.addColorStop(0, `rgba(31,157,107,${0.42 * f})`);
      grad.addColorStop(0.7, `rgba(31,157,107,${0.16 * f})`);
      grad.addColorStop(1, 'rgba(31,157,107,0)');
      g.fillStyle = grad;
      g.beginPath();
      g.moveTo(cx, cx);
      g.arc(cx, cx, cx, (i * span) / N, ((i + 1.2) * span) / N);
      g.closePath();
      g.fill();
    }
    g.strokeStyle = 'rgba(31,157,107,0.8)';
    g.lineWidth = 2;
    g.beginPath();
    g.moveTo(cx, cx);
    g.lineTo(s, cx);
    g.stroke();
    const t = new THREE.CanvasTexture(c);
    t.colorSpace = THREE.SRGBColorSpace;
    return t;
  }, []);
}

/** Ghosted racks and pallets the LiDAR "sees", plus the points it returns on them. */
function useEnvironmentPoints() {
  return useMemo(() => {
    const pts = [];
    const add = (x, z) => pts.push(new THREE.Vector3(x + (Math.random() - 0.5) * 0.03, 0.3, z + (Math.random() - 0.5) * 0.03));
    for (let x = -1.7; x <= 2.7; x += 0.11) add(x, -1.9);
    for (let z = -1.6; z <= 1.0; z += 0.11) add(2.7, z);
    for (let x = -2.1; x <= -1.5; x += 0.09) add(x, -0.7);
    for (let z = -1.3; z <= -0.7; z += 0.09) add(-1.5, z);
    return pts
      .map((p) => {
        const dx = p.x - LIDAR.x;
        const dz = p.z - LIDAR.z;
        return { p, a: Math.atan2(-dz, dx), d: Math.hypot(dx, dz) };
      })
      .filter((o) => o.d < SCAN_R);
  }, []);
}

function Ghosts() {
  const mat = useMemo(() => new THREE.LineBasicMaterial({ color: '#a9b4c4', transparent: true, opacity: 0.38 }), []);
  const boxes = [
    [0.5, 0.55, -2.1, 4.6, 1.1, 0.4],
    [0.5, 0.2, -2.1, 4.6, 0.02, 0.4],
    [0.5, 0.75, -2.1, 4.6, 0.02, 0.4],
    [2.95, 0.35, -0.3, 0.5, 0.7, 2.6],
    [-1.8, 0.28, -1.0, 0.6, 0.56, 0.6],
  ];
  return boxes.map(([x, y, z, w, h, d], i) => (
    <lineSegments key={i} position={[x, y, z]} material={mat}>
      <edgesGeometry args={[new THREE.BoxGeometry(w, h, d)]} />
    </lineSegments>
  ));
}

function HeroRobot({ reduce, interactive, onReady }) {
  const rig = useRef({});
  const root = useRef();
  const body = useRef();
  const scan = useRef();
  const scanMesh = useRef();
  const rings = useRef();
  const dots = useRef();
  const t0 = useRef(null);
  const scanTex = useScanTexture();
  const points = useEnvironmentPoints();
  const M = getMaterials();
  const tmp = useMemo(() => new THREE.Object3D(), []);
  const readyFired = useRef(false);

  useFrame((state) => {
    const r = rig.current;
    if (t0.current === null) t0.current = state.clock.elapsedTime;
    const t = reduce ? 9 : state.clock.elapsedTime - t0.current;

    // the robot is parked in place from the first frame (no drive-in)
    if (onReady && !readyFired.current) {
      readyFired.current = true;
      requestAnimationFrame(() => onReady());
    }

    // 1 · arm unfolds joint by joint straight away, then the camera pans
    const S = POSES.stow;
    const A = POSES.active;
    const tp = Math.max(0, t - 2.6);
    const pan = reduce ? 0 : 0.45 * Math.sin(0.42 * tp) * seg(t, 2.6, 3.6);
    const glance = reduce ? 0 : 0.3 * Math.pow(Math.max(0, Math.sin(tp * 0.8 - 1.2)), 10);
    applyPose(r, {
      yaw: lerp(S.yaw, A.yaw, seg(t, 0.3, 0.9)) + pan,
      sh: lerp(S.sh, A.sh, seg(t, 0.7, 1.5)),
      el: lerp(S.el, A.el, seg(t, 1.2, 2.0)),
      tilt: lerp(S.tilt, A.tilt, seg(t, 1.7, 2.3)) - glance,
    });

    // 2 · idle loops: LiDAR, LED, scan cone, return dots
    const on = seg(t, 0, 0.6);
    if (r.lidarHead) r.lidarHead.rotation.y = t * 6;
    M.led.emissiveIntensity = reduce ? 1.2 : 0.4 + 1.2 * (0.5 + 0.5 * Math.sin(t * 2.2));
    const sweep = reduce ? 0.9 : t * 1.7;
    scan.current.rotation.y = sweep;
    scanMesh.current.material.opacity = on;
    rings.current.material.opacity = on * 0.35;
    const TAU = Math.PI * 2;
    points.forEach((o, i) => {
      const diff = (((sweep - o.a) % TAU) + TAU) % TAU;
      const life = diff < 3.2 ? Math.exp(-diff * 1.1) : 0;
      const s = on * life;
      tmp.position.copy(o.p);
      tmp.scale.setScalar(Math.max(0.0001, s));
      tmp.updateMatrix();
      dots.current.setMatrixAt(i, tmp.matrix);
    });
    dots.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <>
      <group ref={root}>
        <group ref={body}>
          <RobotModel rig={rig} pose={reduce ? POSES.active : POSES.stow} />
        </group>
      </group>
      <group position={[LIDAR.x, 0.004, 0]}>
        <group ref={scan}>
          <mesh ref={scanMesh} rotation-x={-Math.PI / 2}>
            <planeGeometry args={[SCAN_R * 2, SCAN_R * 2]} />
            <meshBasicMaterial map={scanTex} transparent depthWrite={false} opacity={0} />
          </mesh>
        </group>
        <mesh ref={rings} rotation-x={-Math.PI / 2}>
          <ringGeometry args={[1.49, 1.5, 96]} />
          <meshBasicMaterial color="#1f9d6b" transparent opacity={0} depthWrite={false} />
        </mesh>
      </group>
      <instancedMesh ref={dots} args={[null, null, points.length]} frustumCulled={false}>
        <sphereGeometry args={[0.016, 10, 6]} />
        <meshBasicMaterial color="#e8622c" toneMapped={false} />
      </instancedMesh>
      <Ghosts />
      {interactive && (
        <OrbitControls
          target={[0.05, 0.45, 0]}
          enablePan={false}
          enableZoom={false}
          minPolarAngle={Math.PI * 0.22}
          maxPolarAngle={Math.PI * 0.47}
          minAzimuthAngle={-0.4}
          maxAzimuthAngle={1.4}
          rotateSpeed={0.5}
          enableDamping
        />
      )}
    </>
  );
}

function Framing() {
  const { camera, size } = useThree();
  useEffect(() => {
    const a = size.width / size.height;
    const k = a < 1.05 ? 1 + (1.05 - a) * 1.25 : 1;
    camera.position.set(1.85 * k, 1.2 * k, 3.15 * k);
    camera.lookAt(0.05, 0.45, 0);
    camera.updateProjectionMatrix();
  }, [camera, size]);
  return null;
}

export default function HeroScene({ active = true, reduce = false, interactive = false, onReady }) {
  return (
    <Canvas
      dpr={[1, 1.75]}
      camera={{ fov: 30, near: 0.1, far: 60, position: [2, 1.3, 3.4] }}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      frameloop={active ? (reduce ? 'demand' : 'always') : 'never'}
      aria-hidden="true"
    >
      <Framing />
      <Studio />
      <HeroRobot reduce={reduce} interactive={interactive} onReady={onReady} />
      <Grid
        position={[0, 0.001, 0]}
        args={[30, 30]}
        cellSize={0.25}
        cellThickness={0.6}
        cellColor="#cfd6e0"
        sectionSize={1}
        sectionThickness={1}
        sectionColor="#b9c3d1"
        fadeDistance={11}
        fadeStrength={1.6}
        infiniteGrid
      />
      <ContactShadows position={[0, 0.002, 0]} scale={14} blur={2.4} far={1.4} opacity={0.6} resolution={512} color="#1a1c20" />
    </Canvas>
  );
}
