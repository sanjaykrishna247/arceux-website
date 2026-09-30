import { useId } from 'react';

// Side elevation of the robot, drawn in millimetres. Ground is y = 0, up is −y, front is +x.
export const SHOULDER = [380, -680];
export const LINKS = [250, 150, 50];
export const DEFAULT_POSE = { yaw: 0, sh: 105, el: -115, tilt: -15 };

const rad = (d) => (d * Math.PI) / 180;

/** Planar forward kinematics, projected onto the side view (yaw foreshortens x). */
export function armJoints(pose, origin = SHOULDER) {
  const c = Math.cos(rad(pose.yaw));
  const f1 = rad(pose.sh);
  const f2 = f1 + rad(pose.el);
  const f3 = f2 + rad(pose.tilt);
  const step = ([x, y], f, L) => [x + L * Math.cos(f) * c, y - L * Math.sin(f)];
  const p0 = origin;
  const p1 = step(p0, f1, LINKS[0]);
  const p2 = step(p1, f2, LINKS[1]);
  const p3 = step(p2, f3, LINKS[2]);
  const camAngle = Math.atan2(-Math.sin(f3), Math.cos(f3) * c); // SVG angle of the camera axis
  return { p0, p1, p2, p3, camAngle, c, f3 };
}

function Arm({ pose, ids }) {
  const { p0, p1, p2, camAngle } = armJoints(pose);
  const deg = (camAngle * 180) / Math.PI;
  return (
    <g data-part="arm">
      {/* turntable + housing */}
      <rect x="312" y="-584" width="136" height="24" rx="4" fill="#3a3e45" />
      <rect x="310" y="-588" width="140" height="6" rx="3" fill="#e8622c" />
      <rect x="324" y="-618" width="112" height="32" rx="6" fill={`url(#${ids.arm})`} />
      <rect x="352" y="-700" width="56" height="86" rx="8" fill={`url(#${ids.arm})`} stroke="#6f757c" strokeWidth="2" />
      {/* link 1 */}
      <line x1={p0[0]} y1={p0[1]} x2={p1[0]} y2={p1[1]} stroke="#8f959c" strokeWidth="44" strokeLinecap="round" />
      <line x1={p0[0]} y1={p0[1]} x2={p1[0]} y2={p1[1]} stroke="#3a3e45" strokeWidth="18" strokeLinecap="round" />
      {/* link 2 */}
      <line x1={p1[0]} y1={p1[1]} x2={p2[0]} y2={p2[1]} stroke="#9aa0a6" strokeWidth="36" strokeLinecap="round" />
      <line x1={p1[0]} y1={p1[1]} x2={p2[0]} y2={p2[1]} stroke="#3a3e45" strokeWidth="14" strokeLinecap="round" />
      {/* camera end-effector */}
      <g transform={`translate(${p2[0]} ${p2[1]}) rotate(${deg})`}>
        <rect x="6" y="-36" width="64" height="72" rx="10" fill="#1c1e22" />
        <rect x="68" y="-24" width="10" height="48" rx="3" fill="#e8622c" />
        <rect x="76" y="-18" width="8" height="36" rx="3" fill="#1a2b4a" />
        <circle cx="22" cy="-22" r="4" fill="#d0142c" />
      </g>
      {/* joints */}
      {[
        [p0, 28],
        [p1, 25],
        [p2, 21],
      ].map(([p, r], i) => (
        <g key={i}>
          <circle cx={p[0]} cy={p[1]} r={r} fill="#e8622c" />
          <circle cx={p[0]} cy={p[1]} r={r * 0.45} fill="#e6e8ea" stroke="#9aa0a6" strokeWidth="2" />
        </g>
      ))}
    </g>
  );
}

export default function RobotSVG({
  pose = DEFAULT_POSE,
  viewBox = '-700 -1180 1290 1230',
  title = 'Side view illustration of the autonomous mobile robot',
  className,
  preserveAspectRatio = 'xMidYMid meet',
  children,
  showArm = true,
  under,
}) {
  const uid = useId().replace(/:/g, '');
  const ids = { steel: `st${uid}`, steelL: `sl${uid}`, tote: `to${uid}`, arm: `ar${uid}`, shade: `sh${uid}`, brush: `br${uid}` };
  const vents = Array.from({ length: 7 });
  return (
    <svg viewBox={viewBox} className={className} role="img" aria-label={title} preserveAspectRatio={preserveAspectRatio}>
      <defs>
        <linearGradient id={ids.steel} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="#f1f2f4" />
          <stop offset="0.35" stopColor="#c9cdd2" />
          <stop offset="0.7" stopColor="#dde0e4" />
          <stop offset="1" stopColor="#a9aeb5" />
        </linearGradient>
        <linearGradient id={ids.steelL} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="#fafbfc" />
          <stop offset="1" stopColor="#c5c9ce" />
        </linearGradient>
        <linearGradient id={ids.tote} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="#4a97e6" />
          <stop offset="1" stopColor="#1f63b4" />
        </linearGradient>
        <linearGradient id={ids.arm} x1="0" x2="1" y1="0" y2="0">
          <stop offset="0" stopColor="#7d838a" />
          <stop offset="0.5" stopColor="#b4b9be" />
          <stop offset="1" stopColor="#7d838a" />
        </linearGradient>
        <radialGradient id={ids.shade}>
          <stop offset="0" stopColor="#14161a" stopOpacity="0.35" />
          <stop offset="1" stopColor="#14161a" stopOpacity="0" />
        </radialGradient>
        <pattern id={ids.brush} width="40" height="6" patternUnits="userSpaceOnUse">
          <line x1="0" y1="2" x2="40" y2="2" stroke="#fff" strokeOpacity="0.25" strokeWidth="1" />
          <line x1="0" y1="5" x2="26" y2="5" stroke="#000" strokeOpacity="0.05" strokeWidth="1" />
        </pattern>
      </defs>

      {under}
      <ellipse cx="0" cy="0" rx="640" ry="26" fill={`url(#${ids.shade})`} />

      {/* castors */}
      {[400, -400].map((x) => (
        <g key={x} data-part="castor">
          <rect x={x - 28} y="-112" width="56" height="10" fill="#1c1e22" />
          <rect x={x - 34} y="-102" width="30" height="58" rx="4" fill="#d9dcdf" stroke="#9aa0a6" strokeWidth="2" />
          <circle cx={x - 22} cy="-35" r="35" fill="#222429" />
          <circle cx={x - 22} cy="-35" r="16" fill="#7c838c" />
        </g>
      ))}

      {/* drive wheel */}
      <g data-part="wheel">
        <circle cx="0" cy="-85" r="85" fill="#b39472" />
        <circle cx="0" cy="-85" r="80" fill="none" stroke="#8d7152" strokeWidth="10" strokeDasharray="6 9" />
        <circle cx="0" cy="-85" r="66" fill="#a88a68" />
        <circle cx="0" cy="-85" r="46" fill="#7c838c" />
        {[0, 72, 144, 216, 288].map((a) => (
          <rect key={a} x="-5" y="-120" width="10" height="70" rx="3" fill="#e6e8ea" transform={`rotate(${a} 0 -85)`} />
        ))}
        <circle cx="0" cy="-85" r="14" fill="#e8622c" />
      </g>

      {/* lower drive base */}
      <g data-part="base">
        <rect x="-500" y="-290" width="1000" height="180" rx="30" fill={`url(#${ids.steel})`} />
        <rect x="-500" y="-290" width="1000" height="180" rx="30" fill={`url(#${ids.brush})`} />
        <rect x="-476" y="-128" width="952" height="26" rx="6" fill="#1c1e22" />
        <line x1="-450" y1="-268" x2="450" y2="-268" stroke="#1c1e22" strokeWidth="6" />
        {vents.map((_, i) => (
          <line key={i} x1={160 + i * 20} y1="-150" x2={230 + i * 20} y2="-240" stroke="#2a2d33" strokeWidth="5" strokeLinecap="round" />
        ))}
        {/* status display */}
        <rect x="-110" y="-238" width="100" height="66" rx="5" fill="#1c1e22" />
        <rect x="-102" y="-230" width="84" height="50" rx="3" fill="#0d2138" />
        <rect x="-94" y="-216" width="50" height="6" rx="2" fill="#2f7fd6" />
        <rect x="-94" y="-202" width="36" height="6" rx="2" fill="#1f9d6b" />
        {/* charging port */}
        <rect x="30" y="-206" width="40" height="30" rx="4" fill="#2c9a54" />
        <circle cx="42" cy="-191" r="5" fill="#1c1e22" />
        <circle cx="58" cy="-191" r="5" fill="#1c1e22" />
        {/* flank E-stop */}
        <circle cx="-390" cy="-205" r="36" fill="#7c838c" />
        <circle cx="-390" cy="-205" r="29" fill="#d0142c" />
        <ellipse cx="-398" cy="-214" rx="12" ry="7" fill="#fff" opacity="0.35" />
      </g>

      {/* standoffs */}
      {[-450, 0, 450].map((x) => (
        <rect key={x} x={x - 30} y="-392" width="60" height="102" fill="#1c1e22" />
      ))}

      {/* sensors at the front */}
      <g data-part="lidar">
        <rect x="382" y="-318" width="76" height="28" rx="4" fill="#1c1e22" />
        <rect x="386" y="-352" width="68" height="34" rx="6" fill="#3a3e45" />
        <rect x="386" y="-341" width="68" height="10" fill="#05070a" />
        <rect x="452" y="-342" width="6" height="12" fill="#e8622c" />
        <rect x="494" y="-230" width="22" height="30" rx="6" fill="#1c1e22" />
        <circle cx="505" cy="-165" r="9" fill="#c9cdd2" stroke="#7c838c" strokeWidth="2" />
      </g>

      {/* tow hook */}
      <g data-part="hook">
        <rect x="-522" y="-225" width="22" height="70" rx="3" fill="#7c838c" />
        <rect x="-568" y="-201" width="50" height="22" rx="4" fill="#d0142c" />
        <rect x="-642" y="-204" width="84" height="28" rx="14" fill="#d0142c" />
        <rect x="-608" y="-222" width="10" height="64" rx="4" fill="#e6e8ea" />
      </g>

      {/* upper deck */}
      <g data-part="deck">
        <rect x="-532" y="-404" width="1064" height="14" rx="4" fill="#f2f1ec" />
        <rect x="-530" y="-440" width="1060" height="42" rx="12" fill={`url(#${ids.steelL})`} />
        <rect x="250" y="-560" width="272" height="122" rx="18" fill={`url(#${ids.steel})`} />
        <rect x="250" y="-560" width="272" height="122" rx="18" fill={`url(#${ids.brush})`} />
        <rect x="516" y="-550" width="8" height="100" rx="2" fill="#1c1e22" />
        {/* panel: E-stop and mode button */}
        <rect x="392" y="-570" width="76" height="10" rx="3" fill="#1c1e22" />
        <rect x="416" y="-592" width="28" height="24" fill="#d0142c" />
        <path d="M394 -592 Q430 -626 466 -592 Z" fill="#d0142c" />
        <rect x="306" y="-574" width="28" height="14" rx="3" fill="#1f9d6b" />
      </g>

      {/* tote */}
      <g data-part="tote">
        <rect x="-500" y="-740" width="700" height="300" rx="6" fill={`url(#${ids.tote})`} />
        <rect x="-514" y="-742" width="728" height="24" rx="6" fill="#3f8fe0" />
        <line x1="-512" y1="-722" x2="212" y2="-722" stroke="#1f5eaa" strokeWidth="3" />
        <rect x="-490" y="-682" width="680" height="18" rx="3" fill="#2a74c6" />
        {Array.from({ length: 6 }).map((_, i) => (
          <rect key={i} x={-446 + i * 116} y="-700" width="14" height="236" rx="3" fill="#2a74c6" />
        ))}
        <rect x="-500" y="-470" width="700" height="30" fill="#1f5eaa" opacity="0.5" />
      </g>

      {showArm && <Arm pose={pose} ids={ids} />}
      {children}
    </svg>
  );
}
