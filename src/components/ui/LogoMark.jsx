// ARCEUX mark: the robot-arm emblem inside a circular badge.
// Drawn in a 64-unit box so it stays crisp from favicon size up.
// Keep public/favicon.svg in sync if you change the geometry.

const INK = '#14161A';
const LIGHT = '#EEEEEC';

const JOINTS = {
  base: [36.3, 40.9],
  top: [35.8, 19.1],
  right: [49.2, 28],
  elbow: [27.8, 35.1],
  tool: [13.5, 19.1],
};
const LINKS = [
  ['base', 'top'],
  ['top', 'right'],
  ['right', 'base'],
  ['top', 'elbow'],
  ['elbow', 'tool'],
];

export default function LogoMark({ size = 28, className, title }) {
  const line = ([a, b], props) => {
    const [x1, y1] = JOINTS[a];
    const [x2, y2] = JOINTS[b];
    return <line key={a + b} x1={x1} y1={y1} x2={x2} y2={y2} strokeLinecap="round" {...props} />;
  };
  const [tx, ty] = JOINTS.tool;
  return (
    <svg
      viewBox="0 0 64 64"
      width={size}
      height={size}
      className={className}
      role={title ? 'img' : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : true}
    >
      <circle cx="32" cy="32" r="32" fill={INK} />
      <circle cx="32" cy="32" r="29.5" fill="none" stroke={LIGHT} strokeOpacity="0.22" strokeWidth="0.8" />
      <g transform="translate(32 32) scale(0.8) translate(-32 -32)">
        {/* disc behind the arm */}
        <circle cx="20" cy="33.3" r="12" fill={LIGHT} />

        {/* dark halo so the arm reads as a cut-out, like the source artwork */}
        {LINKS.map((l) => line(l, { stroke: INK, strokeWidth: 8 }))}
        {Object.values(JOINTS).map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r={i === 4 ? 6 : 5.8} fill={INK} />
        ))}
        <rect x="28.3" y="39.9" width="17.4" height="8.5" rx="1.5" fill={INK} />
        <path d="M21 54.6 Q21.6 45.4 27.6 45.4 H45.9 Q51.9 45.4 52.5 54.6 Z" fill={INK} />

        {/* base */}
        <path d="M22.6 53 Q23.2 47 28 47 H45.5 Q50.3 47 50.9 53 Z" fill={LIGHT} />
        <rect x="23.6" y="50" width="26.3" height="1" fill={INK} />
        <rect x="29.8" y="41.4" width="14.4" height="5.6" rx="0.8" fill={LIGHT} />
        <rect x="32" y="43.3" width="7" height="1.6" fill={INK} />
        <rect x="40" y="43.3" width="2.2" height="1.6" fill={INK} />

        {/* links: light bar with a dark centre stripe */}
        {LINKS.map((l) => line(l, { stroke: LIGHT, strokeWidth: 4.8 }))}
        {LINKS.map((l) => line(l, { stroke: INK, strokeWidth: 1.1 }))}

        {/* wrench end-effector */}
        <circle cx={tx} cy={ty} r="4.6" fill={LIGHT} />
        <g transform={`translate(${tx} ${ty}) rotate(-131.8)`}>
          <rect x="1" y="-1.5" width="4.4" height="3" fill={INK} />
        </g>

        {/* joints */}
        {Object.entries(JOINTS)
          .filter(([k]) => k !== 'tool')
          .map(([k, [x, y]]) => (
            <g key={k}>
              <circle cx={x} cy={y} r="4.4" fill={LIGHT} />
              <circle cx={x} cy={y} r="2.8" fill="none" stroke={INK} strokeWidth="1.3" />
            </g>
          ))}
      </g>
    </svg>
  );
}
