import { useRef, useState } from 'react';
import { animate, useReducedMotion } from 'framer-motion';
import { arm } from '../content.js';
import RobotSVG, { SHOULDER, armJoints } from './RobotSVG.jsx';
import SectionLabel from './ui/SectionLabel.jsx';
import { Reveal, RevealItem } from './ui/Reveal.jsx';
import './ArmPlayground.css';

const FOV = 28; // half-angle, degrees
const LABEL = [862, -600];
const REACH = 450;

function Overlays({ pose }) {
  const { p3, camAngle } = armJoints(pose);
  const a1 = camAngle - (FOV * Math.PI) / 180;
  const a2 = camAngle + (FOV * Math.PI) / 180;
  const L = 560;
  const cone = `M ${p3[0]} ${p3[1]} L ${p3[0] + L * Math.cos(a1)} ${p3[1] + L * Math.sin(a1)} L ${p3[0] + L * Math.cos(a2)} ${p3[1] + L * Math.sin(a2)} Z`;
  return (
    <g>
      {/* pallet-label height, drawn over the robot so it stays readable */}
      <line x1="-600" x2="1100" y1="-600" y2="-600" stroke="#E8622C" strokeWidth="2.5" strokeDasharray="14 10" />
      <rect x="-470" y="-646" width="430" height="40" rx="6" fill="#fff" stroke="#E8622C" strokeWidth="2" />
      <text x="-452" y="-616" className="arm__svgtxt arm__svgtxt--accent">
        PALLET LABEL · 60 cm
      </text>
      <path d={cone} fill="#E8622C" fillOpacity="0.13" stroke="#E8622C" strokeOpacity="0.6" strokeWidth="2" strokeDasharray="8 6" />
    </g>
  );
}

function Under() {
  const [sx, sy] = SHOULDER;
  return (
    <g>
      {/* ruler */}
      {Array.from({ length: 12 }).map((_, i) => (
        <g key={i}>
          <line x1="-690" x2={i % 5 === 0 ? -655 : -670} y1={-i * 100} y2={-i * 100} stroke="#14161A" strokeOpacity="0.4" strokeWidth="2" />
          {i % 2 === 0 && (
            <text x="-645" y={-i * 100 + 8} className="arm__svgtxt">
              {i * 10}
            </text>
          )}
        </g>
      ))}
      <text x="-690" y="-1140" className="arm__svgtxt">
        cm
      </text>
      {/* reach envelope */}
      <circle cx={sx} cy={sy} r={REACH} fill="none" stroke="#14161A" strokeOpacity="0.28" strokeWidth="2" strokeDasharray="4 10" />
      <line x1={sx} y1={sy} x2={sx + REACH * Math.cos(-0.9)} y2={sy + REACH * Math.sin(-0.9)} stroke="#14161A" strokeOpacity="0.3" strokeWidth="2" />
      <text x={sx + 170} y={sy - 280} className="arm__svgtxt">
        R 45 cm
      </text>
      {/* rack */}
      <g opacity="0.9">
        <rect x="860" y="-1060" width="14" height="1060" fill="#9aa0a6" />
        <rect x="1060" y="-1060" width="14" height="1060" fill="#9aa0a6" />
        {[-300, -580, -860].map((y) => (
          <rect key={y} x="850" y={y} width="234" height="14" fill="#7c838c" />
        ))}
        <rect x="890" y="-700" width="150" height="120" rx="6" fill="#2F7FD6" opacity="0.55" />
        <rect x="890" y="-420" width="150" height="120" rx="6" fill="#2F7FD6" opacity="0.35" />
        <rect x="890" y="-980" width="150" height="120" rx="6" fill="#2F7FD6" opacity="0.35" />
      </g>
      <line x1="-700" x2="1100" y1="0" y2="0" stroke="#14161A" strokeWidth="2" />
    </g>
  );
}

function Label({ read }) {
  return (
    <g>
      <rect x={LABEL[0] - 4} y={LABEL[1] - 26} width="34" height="22" rx="3" fill={read ? '#1F9D6B' : '#fff'} stroke={read ? '#1F9D6B' : '#E8622C'} strokeWidth="3" />
      <path d={`M ${LABEL[0] + 2} ${LABEL[1] - 19}h20M${LABEL[0] + 2} ${LABEL[1] - 12}h14`} stroke={read ? '#fff' : '#14161A'} strokeWidth="2" />
    </g>
  );
}

export default function ArmPlayground() {
  const reduce = useReducedMotion();
  const [pose, setPose] = useState(arm.presets[2].pose);
  const [preset, setPreset] = useState(arm.presets[2].name);
  const ctl = useRef(null);

  const { p0, p3, camAngle, c } = armJoints(pose);
  const dx = LABEL[0] - p3[0];
  const dy = LABEL[1] - 13 - p3[1];
  const off = Math.abs(((Math.atan2(dy, dx) - camAngle + Math.PI * 3) % (Math.PI * 2)) - Math.PI);
  const labelRead = off < (FOV * Math.PI) / 180 && Math.hypot(dx, dy) < 600 && Math.abs(pose.yaw) < 35;
  const camH = (-p3[1] / 10).toFixed(1);
  const reach = (Math.hypot((p3[0] - p0[0]) / (c || 1), p3[1] - p0[1]) / 10).toFixed(1);

  const setJoint = (k, v) => {
    ctl.current?.stop();
    setPreset(null);
    setPose((p) => ({ ...p, [k]: v }));
  };

  const goPreset = (pr) => {
    ctl.current?.stop();
    setPreset(pr.name);
    if (reduce) return setPose(pr.pose);
    const from = { ...pose };
    ctl.current = animate(0, 1, {
      duration: 0.9,
      ease: [0.2, 0.7, 0.2, 1],
      onUpdate: (k) => {
        const next = {};
        for (const key of Object.keys(from)) next[key] = from[key] + (pr.pose[key] - from[key]) * k;
        setPose(next);
      },
    });
  };

  return (
    <section className="section section--paper" id="arm" aria-labelledby="arm-title">
      <div className="container">
        <Reveal className="section-head section-head--split">
          <RevealItem>
            <SectionLabel index={arm.index}>{arm.label}</SectionLabel>
            <h2 id="arm-title" className="h2">
              {arm.title}
            </h2>
          </RevealItem>
          <RevealItem as="p" className="lead">
            {arm.lead}
          </RevealItem>
        </Reveal>

        <div className="armx">
          <div className="armx__play card">
            <div className="armx__readout">
              <span className="chip">
                <span className="chip__label">CAM HEIGHT</span>
                <span className="tnum">{camH}</span> cm
              </span>
              <span className="chip">
                <span className="chip__label">REACH</span>
                <span className="tnum">{reach}</span> cm
              </span>
              <span className="chip" aria-live="polite">
                <span className={`chip__dot ${labelRead ? 'chip__dot--ok' : ''}`} />
                {labelRead ? 'LABEL READ · BIN A-12' : 'SEARCHING FOR LABEL'}
              </span>
            </div>
            <RobotSVG
              pose={pose}
              viewBox="-710 -1190 1810 1240"
              className="armx__svg"
              title={`Arm side view. Base yaw ${Math.round(pose.yaw)}°, shoulder ${Math.round(pose.sh)}°, elbow ${Math.round(pose.el)}°, camera tilt ${Math.round(pose.tilt)}°.`}
              under={<Under />}
            >
              <Overlays pose={pose} />
              <Label read={labelRead} />
            </RobotSVG>

            <div className="armx__controls">
              <div className="armx__presets" role="group" aria-label="Arm presets">
                {arm.presets.map((p) => (
                  <button key={p.name} type="button" className={`armx__preset ${preset === p.name ? 'is-on' : ''}`} aria-pressed={preset === p.name} onClick={() => goPreset(p)}>
                    {p.name}
                  </button>
                ))}
              </div>
              <div className="armx__sliders">
                {arm.joints.map((j) => (
                  <label key={j.key} className="armx__slider">
                    <span className="armx__sl-head">
                      <span className="mono">{j.label}</span>
                      <output className="mono tnum">{Math.round(pose[j.key])}°</output>
                    </span>
                    <input
                      type="range"
                      min={j.min}
                      max={j.max}
                      step="1"
                      value={Math.round(pose[j.key])}
                      onChange={(e) => setJoint(j.key, Number(e.target.value))}
                      style={{ '--pct': `${((pose[j.key] - j.min) / (j.max - j.min)) * 100}%` }}
                    />
                  </label>
                ))}
              </div>
            </div>
          </div>

          <Reveal className="armx__specs" amount={0.1}>
            <RevealItem>
              <h3 className="mono armx__h">Geometry</h3>
              <dl className="armx__dl">
                {arm.specs.map(([k, v]) => (
                  <div key={k}>
                    <dt>{k}</dt>
                    <dd className="mono">{v}</dd>
                  </div>
                ))}
              </dl>
            </RevealItem>
            <RevealItem>
              <h3 className="mono armx__h">Actuators · required → selected (FOS 2)</h3>
              <dl className="armx__dl">
                {arm.motors.map(([k, need, motor]) => (
                  <div key={k}>
                    <dt>{k}</dt>
                    <dd className="mono">
                      <span className="armx__need">{need}</span> → {motor}
                    </dd>
                  </div>
                ))}
              </dl>
            </RevealItem>
            <RevealItem>
              <h3 className="mono armx__h">D-H parameters</h3>
              <div className="armx__tablewrap">
                <table className="armx__dh mono">
                  <thead>
                    <tr>
                      {arm.dh.head.map((h) => (
                        <th key={h} scope="col">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {arm.dh.rows.map((r) => (
                      <tr key={r[0]}>
                        {r.map((c, i) => (i === 0 ? <th key={i} scope="row">{c}</th> : <td key={i}>{c}</td>))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="armx__note">{arm.dh.note}</p>
            </RevealItem>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
