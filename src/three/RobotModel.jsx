import { RoundedBox } from '@react-three/drei';
import { getMaterials } from './materials.js';

// Units are metres. Ground is y = 0 and the robot drives towards +x.
// Left of travel is -z. The arm and control block sit at the front,
// the tow hook at the rear, matching the CAD renders.

const PI = Math.PI;
const AX_Z = [PI / 2, 0, 0]; // cylinder axis → z
const AX_X = [0, 0, PI / 2]; // cylinder axis → x

export const ARM = { L1: 0.3, L2: 0.22, base: [0.38, 0.56, -0.16] };

/** Poses in radians. sh/el/tilt rotate about z; positive leans towards the rear (-x). */
export const POSES = {
  stow: { yaw: 0, sh: 1.0, el: -2.6, tilt: 1.0 },
  active: { yaw: 0.35, sh: 0.15, el: -1.3, tilt: -0.5 },
};

const put = (rig, key, i) => (el) => {
  if (!rig || !el) return;
  if (i === undefined) rig.current[key] = el;
  else (rig.current[key] ||= [])[i] = el;
};

function Box({ s, p, r, m }) {
  return (
    <mesh position={p} rotation={r} material={m}>
      <boxGeometry args={s} />
    </mesh>
  );
}

function Cyl({ r, r2, h, p, rot, m, seg = 40, open }) {
  return (
    <mesh position={p} rotation={rot} material={m}>
      <cylinderGeometry args={[r, r2 ?? r, h, seg, 1, open]} />
    </mesh>
  );
}

function RBox({ s, p, r = 0.02, m }) {
  return <RoundedBox args={s} radius={r} smoothness={4} position={p} material={m} />;
}

/* ───────────── Layer 0 · Chassis base ───────────── */
function ChassisBase({ rig, M }) {
  const castors = [
    [0.4, 0.24],
    [0.4, -0.24],
    [-0.4, 0.24],
    [-0.4, -0.24],
  ];
  return (
    <group>
      {/* brushed shell */}
      <RBox s={[1.0, 0.18, 0.62]} p={[0, 0.2, 0]} r={0.03} m={M.steel} />
      {/* dark skirt */}
      <Box s={[0.95, 0.03, 0.57]} p={[0, 0.112, 0]} m={M.black} />
      {/* shoulder trim lines */}
      {[0.311, -0.311].map((z) => (
        <Box key={z} s={[0.9, 0.008, 0.004]} p={[0, 0.268, z]} m={M.black} />
      ))}
      {/* side vents near the front */}
      {[0.312, -0.312].map((z) =>
        Array.from({ length: 7 }).map((_, i) => (
          <Box key={`${z}-${i}`} s={[0.15, 0.005, 0.004]} p={[0.3 - i * 0.008, 0.145 + i * 0.013, z]} m={M.black} />
        ))
      )}
      {/* status display + charging port (right flank) */}
      <Box s={[0.1, 0.066, 0.006]} p={[-0.06, 0.205, 0.312]} m={M.black} />
      <Box s={[0.084, 0.05, 0.004]} p={[-0.06, 0.205, 0.3155]} m={M.sideScreen} />
      <Box s={[0.04, 0.03, 0.008]} p={[0.05, 0.19, 0.313]} m={M.greenPort} />
      <Cyl r={0.006} h={0.004} p={[0.042, 0.19, 0.318]} rot={AX_Z} m={M.black} seg={12} />
      <Cyl r={0.006} h={0.004} p={[0.058, 0.19, 0.318]} rot={AX_Z} m={M.black} seg={12} />
      {/* flank E-stop */}
      <group position={[-0.39, 0.205, 0.31]}>
        <Cyl r={0.034} h={0.012} p={[0, 0, 0.006]} rot={AX_Z} m={M.steelDark} />
        <Cyl r={0.014} h={0.02} p={[0, 0, 0.02]} rot={AX_Z} m={M.red} />
        <Cyl r={0.03} r2={0.03} h={0.016} p={[0, 0, 0.036]} rot={AX_Z} m={M.red} />
      </group>
      {/* castors */}
      {castors.map(([x, z], i) => (
        <group key={i} position={[x, 0.11, z]}>
          <Box s={[0.056, 0.01, 0.056]} p={[0, -0.005, 0]} m={M.black} />
          <group ref={put(rig, 'castorSwivel', i)}>
            <Cyl r={0.009} h={0.03} p={[0, -0.022, 0]} m={M.chrome} seg={16} />
            <Box s={[0.036, 0.055, 0.005]} p={[-0.014, -0.058, 0.016]} m={M.chrome} />
            <Box s={[0.036, 0.055, 0.005]} p={[-0.014, -0.058, -0.016]} m={M.chrome} />
            <group position={[-0.022, -0.075, 0]} ref={put(rig, 'castorWheels', i)}>
              <Cyl r={0.035} h={0.024} rot={AX_Z} m={M.rubber} seg={28} />
              <Cyl r={0.018} h={0.026} rot={AX_Z} m={M.steelDark} seg={20} />
              <Box s={[0.03, 0.006, 0.027]} p={[0, 0, 0]} m={M.steel} />
            </group>
          </group>
        </group>
      ))}
      {/* standoffs between the tiers */}
      {[
        [0.45, 0.265],
        [0.45, -0.265],
        [-0.45, 0.265],
        [-0.45, -0.265],
        [0, 0.265],
        [0, -0.265],
      ].map(([x, z], i) => (
        <Box key={i} s={[0.06, 0.1, 0.06]} p={[x, 0.34, z]} m={M.black} />
      ))}
      {/* tow hook */}
      <group position={[-0.5, 0.19, 0]}>
        <Box s={[0.02, 0.07, 0.12]} p={[-0.006, 0, 0]} m={M.steelDark} />
        <Box s={[0.07, 0.022, 0.034]} p={[-0.045, 0, 0]} m={M.red} />
        <mesh position={[-0.1, 0, 0]} rotation={[PI / 2, 0, PI * 0.35]} material={M.red}>
          <torusGeometry args={[0.03, 0.011, 16, 40, PI * 1.45]} />
        </mesh>
        <Cyl r={0.006} h={0.06} p={[-0.1, 0, 0]} m={M.chrome} seg={12} />
      </group>
    </group>
  );
}

/* ───────────── Layer 1 · Drive ───────────── */
function Wheel({ rig, i, z, M }) {
  const side = Math.sign(z);
  return (
    <group position={[0, 0.085, z]}>
      <group ref={put(rig, 'wheels', i)}>
        <Cyl r={0.085} h={0.05} rot={AX_Z} m={M.tyre} seg={48} />
        <Cyl r={0.068} h={0.052} rot={AX_Z} m={M.tyreSide} seg={48} />
        <Cyl r={0.046} h={0.054} rot={AX_Z} m={M.steelDark} seg={32} />
        {Array.from({ length: 5 }).map((_, k) => (
          <Box key={k} s={[0.012, 0.07, 0.004]} p={[0, 0, side * 0.028]} r={[0, 0, (k * 2 * PI) / 5]} m={M.chrome} />
        ))}
        <Cyl r={0.014} h={0.06} rot={AX_Z} m={M.orange} seg={20} />
      </group>
    </group>
  );
}

function Drive({ rig, M }) {
  return (
    <group>
      <Wheel rig={rig} i={0} z={0.25} M={M} />
      <Wheel rig={rig} i={1} z={-0.25} M={M} />
      {[1, -1].map((s) => (
        <group key={s}>
          <Cyl r={0.04} h={0.04} p={[0, 0.085, s * 0.2]} rot={AX_Z} m={M.steel} />
          <Cyl r={0.036} h={0.1} p={[0, 0.085, s * 0.13]} rot={AX_Z} m={M.black} />
          <Cyl r={0.03} h={0.02} p={[0, 0.085, s * 0.07]} rot={AX_Z} m={M.steelDark} />
        </group>
      ))}
      {/* Cytron driver */}
      <group position={[0.16, 0.15, 0]}>
        <Box s={[0.1, 0.006, 0.08]} m={M.pcbRed} />
        <Box s={[0.05, 0.03, 0.05]} p={[0.01, 0.018, 0]} m={M.steelDark} />
        {Array.from({ length: 6 }).map((_, k) => (
          <Box key={k} s={[0.05, 0.03, 0.002]} p={[0.01, 0.03, -0.022 + k * 0.009]} m={M.steel} />
        ))}
      </group>
    </group>
  );
}

/* ───────────── Layer 2 · Power ───────────── */
function Power({ M }) {
  return (
    <group>
      <RBox s={[0.34, 0.11, 0.24]} p={[-0.22, 0.175, 0]} r={0.01} m={M.battery} />
      <Box s={[0.342, 0.03, 0.242]} p={[-0.22, 0.2, 0]} m={M.orange} />
      <Cyl r={0.012} h={0.02} p={[-0.34, 0.24, 0.07]} m={M.red} seg={16} />
      <Cyl r={0.012} h={0.02} p={[-0.34, 0.24, -0.07]} m={M.black} seg={16} />
      {/* buck converter */}
      <group position={[-0.02, 0.15, 0.16]}>
        <Box s={[0.07, 0.005, 0.045]} m={M.pcbBlue} />
        <Cyl r={0.011} h={0.014} p={[0.015, 0.01, 0]} m={M.black} seg={16} />
        <Box s={[0.014, 0.012, 0.014]} p={[-0.02, 0.008, 0.008]} m={M.copper} />
      </group>
    </group>
  );
}

/* ───────────── Layer 3 · Sensors ───────────── */
function Sensors({ rig, M }) {
  return (
    <group>
      {/* RPLiDAR A1 on the front of the lower deck */}
      <group position={[0.42, 0.29, 0]}>
        <Cyl r={0.038} h={0.028} p={[0, 0.014, 0]} m={M.black} />
        <group ref={put(rig, 'lidarHead')} position={[0, 0.043, 0]}>
          <Cyl r={0.034} h={0.03} m={M.armDark} />
          <Cyl r={0.0345} h={0.01} m={M.glass} />
          <Box s={[0.012, 0.012, 0.004]} p={[0.033, 0, 0]} r={[0, PI / 2, 0]} m={M.orange} />
        </group>
      </group>
      {/* depth camera */}
      <group position={[0.505, 0.215, 0]}>
        <RBox s={[0.022, 0.03, 0.13]} r={0.008} m={M.black} />
        {[-0.04, 0.04, 0].map((z, k) => (
          <Cyl key={k} r={k === 2 ? 0.006 : 0.009} h={0.006} p={[0.012, 0, z]} rot={AX_X} m={M.lens} seg={20} />
        ))}
      </group>
      {/* ultrasonic pairs */}
      {[0.2, -0.2].map((z) => (
        <group key={z} position={[0.502, 0.165, z]}>
          <Box s={[0.006, 0.024, 0.052]} m={M.pcbBlue} />
          {[-0.013, 0.013].map((dz) => (
            <group key={dz}>
              <Cyl r={0.009} h={0.012} p={[0.008, 0, dz]} rot={AX_X} m={M.chrome} seg={20} />
              <Cyl r={0.006} h={0.013} p={[0.009, 0, dz]} rot={AX_X} m={M.black} seg={16} />
            </group>
          ))}
        </group>
      ))}
      {/* IMU */}
      <group position={[0.02, 0.2, -0.12]}>
        <Box s={[0.032, 0.004, 0.026]} m={M.pcbPurple} />
        <Box s={[0.01, 0.004, 0.01]} p={[0, 0.004, 0]} m={M.black} />
      </group>
    </group>
  );
}

/* ───────────── Layer 4 · Compute ───────────── */
function Compute({ M }) {
  return (
    <group>
      {/* Raspberry Pi 4 B (scaled ×1.3 for legibility) */}
      <group position={[0.2, 0.225, -0.1]}>
        <Box s={[0.11, 0.006, 0.073]} m={M.pcbGreen} />
        <Box s={[0.02, 0.004, 0.02]} p={[-0.01, 0.005, 0]} m={M.steel} />
        <Box s={[0.022, 0.018, 0.018]} p={[0.046, 0.012, -0.022]} m={M.chrome} />
        <Box s={[0.022, 0.018, 0.018]} p={[0.046, 0.012, 0.002]} m={M.chrome} />
        <Box s={[0.022, 0.017, 0.02]} p={[0.046, 0.012, 0.026]} m={M.chrome} />
        <Box s={[0.07, 0.008, 0.006]} p={[-0.01, 0.007, -0.033]} m={M.black} />
      </group>
      {/* Arduino */}
      <group position={[0.2, 0.225, 0.1]}>
        <Box s={[0.09, 0.006, 0.069]} m={M.pcbTeal} />
        <Box s={[0.036, 0.006, 0.01]} p={[0, 0.006, 0.01]} m={M.black} />
        <Box s={[0.016, 0.014, 0.016]} p={[-0.04, 0.01, -0.02]} m={M.chrome} />
        <Box s={[0.07, 0.008, 0.005]} p={[0, 0.007, -0.03]} m={M.black} />
      </group>
      {/* Wi-Fi router */}
      <group position={[-0.02, 0.24, 0]}>
        <RBox s={[0.1, 0.022, 0.07]} r={0.006} m={M.white} />
        <Cyl r={0.004} h={0.06} p={[-0.045, 0.04, 0.03]} m={M.black} seg={8} />
        <Cyl r={0.004} h={0.06} p={[-0.045, 0.04, -0.03]} m={M.black} seg={8} />
      </group>
    </group>
  );
}

/* ───────────── Layer 5 · Top frame & control panel ───────────── */
function TopFrame({ rig, M }) {
  return (
    <group>
      <RBox s={[1.06, 0.045, 0.68]} p={[0, 0.4175, 0]} r={0.015} m={M.steelLight} />
      <Box s={[1.064, 0.012, 0.684]} p={[0, 0.398, 0]} m={M.white} />
      {/* raised block carrying the arm and panel */}
      <RBox s={[0.27, 0.12, 0.64]} p={[0.385, 0.5, 0]} r={0.02} m={M.steel} />
      <Box s={[0.004, 0.012, 0.6]} p={[0.252, 0.53, 0]} m={M.black} />
      {/* 7" HMI flush on the front face */}
      <Box s={[0.006, 0.1, 0.18]} p={[0.521, 0.5, 0.1]} m={M.black} />
      <mesh position={[0.5245, 0.5, 0.1]} rotation={[0, PI / 2, 0]} material={M.screen}>
        <planeGeometry args={[0.165, 0.09]} />
      </mesh>
      {/* panel: E-stop, green + red mode buttons, status LED */}
      <group position={[0.43, 0.56, 0.2]}>
        <Cyl r={0.04} h={0.01} p={[0, 0.005, 0]} m={M.black} />
        <Cyl r={0.015} h={0.024} p={[0, 0.02, 0]} m={M.red} />
        <mesh position={[0, 0.034, 0]} material={M.red} scale={[1, 0.45, 1]}>
          <sphereGeometry args={[0.036, 32, 16, 0, PI * 2, 0, PI / 2]} />
        </mesh>
        <Cyl r={0.036} h={0.008} p={[0, 0.034, 0]} m={M.red} />
      </group>
      {[
        [0.32, 0.24, M.green],
        [0.32, 0.15, M.red],
      ].map(([x, z, m], i) => (
        <group key={i} position={[x, 0.56, z]}>
          <Cyl r={0.019} h={0.008} p={[0, 0.004, 0]} m={M.chrome} />
          <Cyl r={0.014} h={0.014} p={[0, 0.01, 0]} m={m} />
        </group>
      ))}
      <mesh ref={put(rig, 'led')} position={[0.32, 0.565, 0.06]} material={M.led}>
        <sphereGeometry args={[0.008, 16, 8]} />
      </mesh>
    </group>
  );
}

/* ───────────── Layer 6 · Tote ───────────── */
function Tote({ M }) {
  const L = 0.7;
  const W = 0.6;
  const H = 0.3;
  const t = 0.012;
  return (
    <group position={[-0.15, 0.44, 0]}>
      <Box s={[L - 0.04, t, W - 0.04]} p={[0, t / 2, 0]} m={M.toteDeep} />
      <Box s={[t, H, W]} p={[L / 2 - t / 2, H / 2, 0]} m={M.tote} />
      <Box s={[t, H, W]} p={[-L / 2 + t / 2, H / 2, 0]} m={M.tote} />
      <Box s={[L, H, t]} p={[0, H / 2, W / 2 - t / 2]} m={M.tote} />
      <Box s={[L, H, t]} p={[0, H / 2, -W / 2 + t / 2]} m={M.tote} />
      {/* rolled rim */}
      <Box s={[L + 0.03, 0.022, 0.03]} p={[0, H - 0.011, W / 2]} m={M.tote} />
      <Box s={[L + 0.03, 0.022, 0.03]} p={[0, H - 0.011, -W / 2]} m={M.tote} />
      <Box s={[0.03, 0.022, W + 0.03]} p={[L / 2, H - 0.011, 0]} m={M.tote} />
      <Box s={[0.03, 0.022, W + 0.03]} p={[-L / 2, H - 0.011, 0]} m={M.tote} />
      {/* ribs and band */}
      {[W / 2 + 0.004, -W / 2 - 0.004].map((z) => (
        <group key={z}>
          {Array.from({ length: 6 }).map((_, i) => (
            <Box key={i} s={[0.014, H - 0.06, 0.012]} p={[-L / 2 + 0.06 + i * 0.116, H / 2 - 0.01, z]} m={M.toteRib} />
          ))}
          <Box s={[L - 0.02, 0.022, 0.012]} p={[0, H - 0.07, z]} m={M.toteRib} />
          <Box s={[L - 0.02, 0.016, 0.01]} p={[0, 0.03, z]} m={M.toteRib} />
        </group>
      ))}
      {/* handle slots */}
      {[L / 2 + 0.001, -L / 2 - 0.001].map((x) => (
        <Box key={x} s={[0.004, 0.036, 0.15]} p={[x, H - 0.06, 0]} m={M.toteDeep} />
      ))}
    </group>
  );
}

/* ───────────── Layer 7 · Arm ───────────── */
function Arm({ rig, M }) {
  const { L1, L2 } = ARM;
  return (
    <group position={ARM.base}>
      <Cyl r={0.068} h={0.024} p={[0, 0.012, 0]} m={M.armDark} />
      <Cyl r={0.07} h={0.006} p={[0, 0.026, 0]} m={M.orange} />
      <group ref={put(rig, 'yaw')} position={[0, 0.029, 0]}>
        <Cyl r={0.056} h={0.03} p={[0, 0.015, 0]} m={M.arm} />
        <Box s={[0.064, 0.042, 0.042]} p={[0, 0.05, 0]} m={M.armDark} />
        <Box s={[0.05, 0.075, 0.01]} p={[0, 0.07, 0.036]} m={M.arm} />
        <Box s={[0.05, 0.075, 0.01]} p={[0, 0.07, -0.036]} m={M.arm} />
        <group ref={put(rig, 'sh')} position={[0, 0.09, 0]}>
          <Cyl r={0.027} h={0.084} rot={AX_Z} m={M.orange} />
          <Cyl r={0.015} h={0.088} rot={AX_Z} m={M.chrome} seg={20} />
          <RBox s={[0.044, L1, 0.04]} p={[0, L1 / 2, 0]} r={0.01} m={M.arm} />
          <Box s={[0.03, L1 - 0.08, 0.042]} p={[0, L1 / 2, 0]} m={M.armDark} />
          <group ref={put(rig, 'el')} position={[0, L1, 0]}>
            <Cyl r={0.024} h={0.07} rot={AX_Z} m={M.orange} />
            <Cyl r={0.013} h={0.074} rot={AX_Z} m={M.chrome} seg={20} />
            <RBox s={[0.036, L2, 0.032]} p={[0, L2 / 2, 0]} r={0.008} m={M.arm} />
            <Box s={[0.024, L2 - 0.07, 0.034]} p={[0, L2 / 2, 0]} m={M.armDark} />
            <group ref={put(rig, 'tilt')} position={[0, L2, 0]}>
              <Cyl r={0.02} h={0.056} rot={AX_Z} m={M.orange} />
              <Box s={[0.026, 0.04, 0.03]} p={[0, 0.022, 0]} m={M.armDark} />
              {/* camera head, looking along local +y */}
              <RBox s={[0.05, 0.06, 0.08]} p={[0, 0.068, 0]} r={0.01} m={M.black} />
              <Cyl r={0.02} h={0.014} p={[0, 0.103, 0]} m={M.armDark} />
              <Cyl r={0.015} h={0.006} p={[0, 0.111, 0]} m={M.lens} />
              <Cyl r={0.021} h={0.003} p={[0, 0.098, 0]} m={M.orange} />
              <Cyl r={0.004} h={0.004} p={[0.012, 0.1, 0.03]} m={M.red} seg={10} />
            </group>
          </group>
        </group>
      </group>
    </group>
  );
}

const LAYERS = [ChassisBase, Drive, Power, Sensors, Compute, TopFrame, Tote, Arm];

/**
 * The full robot. `rig` is a ref that gets populated with handles to
 * animatable parts: wheels, castorSwivel, castorWheels, lidarHead,
 * yaw/sh/el/tilt (arm joints), led and layers[0..7] (bottom → top).
 */
export default function RobotModel({ rig, pose = POSES.active }) {
  const M = getMaterials();
  return (
    <group>
      {LAYERS.map((L, k) => (
        <group key={k} ref={put(rig, 'layers', k)}>
          <L rig={rig} M={M} />
        </group>
      ))}
      <PoseInit rig={rig} pose={pose} />
    </group>
  );
}

function PoseInit({ rig, pose }) {
  // Apply the initial pose synchronously on first render via ref callback.
  return (
    <group
      ref={() => {
        const r = rig?.current;
        if (!r || r._posed) return;
        r._posed = true;
        applyPose(r, pose);
      }}
    />
  );
}

export function applyPose(r, p) {
  if (r.yaw) r.yaw.rotation.y = p.yaw;
  if (r.sh) r.sh.rotation.z = p.sh;
  if (r.el) r.el.rotation.z = p.el;
  if (r.tilt) r.tilt.rotation.z = p.tilt;
}
