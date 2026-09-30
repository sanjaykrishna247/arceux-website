import { useRef } from 'react';
import { useInView, useReducedMotion } from 'framer-motion';
import { software } from '../content.js';
import { useMedia } from '../hooks/useMedia.js';
import SectionLabel from './ui/SectionLabel.jsx';
import { Reveal, RevealItem } from './ui/Reveal.jsx';
import './NodeGraph.css';

// Mirrors the methodology diagram in the design report (Fig 5.3.1).
// d = desktop position, m = phone position (viewBox units).
const NODES = {
  lidar: { label: 'RPLiDAR A1', short: 'RPLiDAR A1', kind: 'sensor', d: [100, 70], m: [70, 50] },
  depth: { label: 'HP60C depth camera', short: 'HP60C depth', kind: 'sensor', d: [100, 150], m: [200, 50] },
  ultra: { label: 'Ultrasonic node', short: 'Ultrasonic', kind: 'sensor', d: [100, 230], m: [330, 170] },
  map: { label: 'Map', short: 'Map', kind: 'data', d: [365, 60], m: [330, 50] },
  slam: { label: 'SLAM node', short: 'SLAM node', kind: 'core', d: [365, 150], m: [200, 170] },
  nav2: { label: 'Nav2 node', short: 'Nav2 node', kind: 'core', d: [630, 150], m: [265, 280] },
  hmi: { label: 'HMI node', short: 'HMI node', d: [365, 310], m: [70, 280] },
  battery: { label: 'Battery status node', short: 'Battery status', d: [100, 430], m: [70, 390] },
  goals: { label: 'Nav goals controller', short: 'Goals ctrl', d: [630, 400], m: [265, 390] },
  low: { label: 'Low-level HW control', short: 'Low-level HW', kind: 'hw', d: [630, 520], m: [265, 500] },
  teleop: { label: 'Teleop node', short: 'Teleop node', d: [895, 310], m: [70, 500] },
  diff: { label: 'Diff-drive control', short: 'Diff drive', d: [895, 150], m: [70, 610] },
  wifi: { label: 'Wi-Fi / Ethernet', short: 'Wi-Fi / Eth', kind: 'net', d: [895, 60], m: [70, 720] },
  arm: { label: 'Arm ctrl + streaming', short: 'Arm + stream', d: [895, 430], m: [265, 610] },
  cam: { label: 'Inspection camera', short: 'Inspect cam', kind: 'sensor', d: [895, 530], m: [265, 720] },
};

// [from, to, topic label (desktop only), desktopOnly]
const EDGES = [
  ['lidar', 'slam', '/scan'],
  ['depth', 'slam', '/depth'],
  ['map', 'slam', ''],
  ['ultra', 'nav2', '/range', false, 10],
  ['slam', 'nav2', '/map · /tf', false, -8],
  ['hmi', 'nav2', '/goal_pose', false, 18],
  ['nav2', 'goals', ''],
  ['goals', 'low', ''],
  ['battery', 'goals', '/battery'],
  ['teleop', 'goals', ''],
  ['diff', 'teleop', ''],
  ['wifi', 'diff', ''],
  ['cam', 'arm', ''],
  ['arm', 'teleop', ''],
  ['hmi', 'teleop', 'manual override', true],
];

function edgePath(a, b, w, h, endOff = 0) {
  const [x1, y1] = a;
  const [x2, y2] = b;
  const dx = x2 - x1;
  const dy = y2 - y1;
  if (Math.abs(dx) > Math.abs(dy) * 1.1) {
    const s = Math.sign(dx);
    const sx = x1 + (s * w) / 2;
    const ex = x2 - (s * w) / 2;
    const mx = (sx + ex) / 2;
    const ey2 = y2 + endOff; // separates edges that share a target
    return `M ${sx} ${y1} C ${mx} ${y1}, ${mx} ${ey2}, ${ex} ${ey2}`;
  }
  const s = Math.sign(dy) || 1;
  const sy = y1 + (s * h) / 2;
  const ey = y2 - (s * h) / 2;
  const my = (sy + ey) / 2;
  return `M ${x1} ${sy} C ${x1} ${my}, ${x2} ${my}, ${x2} ${ey}`;
}

export default function NodeGraph() {
  const mobile = useMedia('(max-width: 720px)');
  const reduce = useReducedMotion();
  const box = useRef(null);
  const inView = useInView(box, { once: true, amount: 0.3 });
  const L = mobile ? 'm' : 'd';
  const W = mobile ? 124 : 176;
  const H = mobile ? 36 : 44;
  const vb = mobile ? '0 0 400 760' : '0 0 1000 575';

  return (
    <section className="section section--dark section--navy" id="software" aria-labelledby="sw-title">
      <div className="container">
        <Reveal className="section-head section-head--split">
          <RevealItem>
            <SectionLabel index={software.index}>{software.label}</SectionLabel>
            <h2 id="sw-title" className="h2">
              {software.title}
            </h2>
          </RevealItem>
          <RevealItem as="p" className="lead">
            {software.lead}
          </RevealItem>
        </Reveal>

        <div className={`ng ${inView ? 'is-in' : ''}`} ref={box}>
          <svg viewBox={vb} className="ng__svg" role="img" aria-label="ROS 2 node graph. RPLiDAR, the depth camera and the map feed the SLAM node. SLAM, ultrasonic and the HMI feed Nav2. Nav2 and the battery status node feed the navigation goals controller, which drives low-level hardware control. Teleop, differential drive, Wi-Fi and the arm controller with the inspection camera connect for manual control.">
            <defs>
              <filter id="ngglow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="3" />
              </filter>
            </defs>
            {EDGES.filter((e) => !(mobile && e[3])).map(([a, b, topic, , off], i) => {
              const d = edgePath(NODES[a][L], NODES[b][L], W, H, mobile ? 0 : off);
              return (
                <g key={`${a}-${b}`}>
                  <path d={d} pathLength="1" className="ng__edge" style={{ transitionDelay: `${0.25 + i * 0.09}s` }} />
                  {!mobile && topic && (
                    <text className="ng__topic" style={{ transitionDelay: `${0.6 + i * 0.09}s` }}>
                      <textPath href={`#ngp-${i}`} startOffset="50%" textAnchor="middle">
                        {topic}
                      </textPath>
                    </text>
                  )}
                  <path id={`ngp-${i}`} d={d} fill="none" stroke="none" />
                  {inView && !reduce && (
                    <circle r={mobile ? 3 : 4} className="ng__packet">
                      <animateMotion dur={`${1.6 + (i % 4) * 0.35}s`} begin={`${1.2 + i * 0.15}s`} repeatCount="indefinite" path={d} />
                    </circle>
                  )}
                </g>
              );
            })}
            {Object.entries(NODES).map(([k, n], i) => {
              const [x, y] = n[L];
              return (
                <g key={k} className={`ng__node ng__node--${n.kind || 'std'}`} style={{ transitionDelay: `${i * 0.05}s` }} transform={`translate(${x} ${y})`}>
                  <rect x={-W / 2} y={-H / 2} width={W} height={H} rx="10" />
                  {n.kind === 'sensor' && <circle cx={-W / 2 + 14} cy="0" r="3.5" className="ng__dot" />}
                  <text x={n.kind === 'sensor' ? 6 : 0} y="4.5" textAnchor="middle">
                    {mobile ? n.short : n.label}
                  </text>
                </g>
              );
            })}
          </svg>
          <div className="ng__legend mono">
            <span>
              <i className="ng__lg ng__lg--sensor" /> Sensor
            </span>
            <span>
              <i className="ng__lg ng__lg--core" /> Core
            </span>
            <span>
              <i className="ng__lg ng__lg--hw" /> Hardware
            </span>
            <span>
              <i className="ng__lg ng__lg--pkt" /> Message
            </span>
          </div>
        </div>

        <Reveal as="ul" className="ng__stack" amount={0.2}>
          {software.stack.map((s) => (
            <RevealItem as="li" key={s} className="tag">
              {s}
            </RevealItem>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
