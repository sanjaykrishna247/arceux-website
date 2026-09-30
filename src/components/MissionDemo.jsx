import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useReducedMotion } from 'framer-motion';
import { mission } from '../content.js';
import { useMedia, useNearViewport } from '../hooks/useMedia.js';
import SectionLabel from './ui/SectionLabel.jsx';
import { Reveal, RevealItem } from './ui/Reveal.jsx';
import './MissionDemo.css';

const PATH_D = 'M 90 450 L 90 250 L 600 250 C 700 250 790 280 790 360 L 790 430 C 790 478 760 470 700 470 L 480 470 L 140 470 C 105 470 90 465 90 450';
// The last leg returns to the dock and ends facing the same way it started, so the loop is seamless.
const STEPS = [
  [0, 2.5],
  [2.5, 5],
  [5, 8.5],
  [8.5, 11.5],
  [11.5, 17.5],
  [17.5, 22],
  [22, 27.5],
];
const T_END = 27.5;
const STATES = ['IDLE · TASK RECEIVED', 'PLANNING', 'NAVIGATING', 'YIELDING · PERSON', 'TOWING · T-07', 'INSPECTING · A-12', 'RETURNING · DOCK'];
const PARKED = { x: 370, y: 200, a: 0 };
const HITCH = 34;
const TOW_L = 74;

const clamp01 = (v) => Math.min(1, Math.max(0, v));
const ease = (v) => (v < 0.5 ? 4 * v * v * v : 1 - Math.pow(-2 * v + 2, 3) / 2);
const span = (t, a, b) => ease(clamp01((t - a) / (b - a)));
const lerp = (a, b, k) => a + (b - a) * k;
const lerpAngle = (a, b, k) => a + (((((b - a) % 360) + 540) % 360) - 180) * k;
const deg = (r) => (r * 180) / Math.PI;

function stepAt(t) {
  return Math.max(0, STEPS.findIndex(([a, b]) => t >= a && t < b));
}

export default function MissionDemo() {
  const reduce = useReducedMotion();
  const mobile = useMedia('(max-width: 860px)');
  const wrap = useRef(null);
  const near = useNearViewport(wrap, '100px');
  const [step, setStep] = useState(0);
  const [done, setDone] = useState(false);

  const r = useRef({}); // element refs
  const geo = useRef(null); // path samples
  const tRef = useRef(0);
  const holdUntil = useRef(null); // stepper mode: pause at the end of a step

  const ref = (k) => (el) => (r.current[k] = el);

  // sample the path once
  useLayoutEffect(() => {
    const p = r.current.path;
    if (!p) return;
    const len = p.getTotalLength();
    const pts = [];
    for (let s = 0; s <= len; s += 2) {
      const q = p.getPointAtLength(s);
      pts.push({ s, x: q.x, y: q.y });
    }
    const nearest = (x, y) => pts.reduce((best, q) => ((q.x - x) ** 2 + (q.y - y) ** 2 < (best.x - x) ** 2 + (best.y - y) ** 2 ? q : best)).s;
    geo.current = {
      len,
      at: (s) => {
        const c = Math.min(len, Math.max(0, s));
        const a = p.getPointAtLength(c);
        const b = p.getPointAtLength(Math.min(len, c + 1.5));
        const z = p.getPointAtLength(Math.max(0, c - 1.5));
        return { x: a.x, y: a.y, a: deg(Math.atan2(b.y - z.y, b.x - z.x)) };
      },
      sWait: nearest(250, 250),
      sCouple: nearest(440, 250),
      sDrop: nearest(790, 430),
      sEnd: nearest(480, 470),
    };
    r.current.planned.style.strokeDasharray = `${len}`;
    r.current.travel.style.strokeDasharray = `${len}`;
  }, []);

  const render = useCallback((t) => {
    const g = geo.current;
    const e = r.current;
    if (!g) return;
    // robot progress along the path
    let s = 0;
    if (t >= 5 && t < 8.5) s = lerp(0, g.sWait, span(t, 5, 8.5));
    else if (t >= 8.5 && t < 11.5) s = g.sWait;
    else if (t >= 11.5 && t < 12.6) s = lerp(g.sWait, g.sCouple, span(t, 11.5, 12.6));
    else if (t >= 12.6 && t < 13.4) s = g.sCouple;
    else if (t >= 13.4 && t < 17.2) s = lerp(g.sCouple, g.sDrop, span(t, 13.4, 17.2));
    else if (t >= 17.2 && t < 17.5) s = g.sDrop;
    else if (t >= 17.5 && t < 22) s = lerp(g.sDrop, g.sEnd, span(t, 17.5, 19));
    else if (t >= 22) s = lerp(g.sEnd, g.len, span(t, 22, 26.8));
    const R = g.at(s);
    e.robot.setAttribute('transform', `translate(${R.x} ${R.y}) rotate(${R.a})`);

    // path planning + travelled trace
    const draw = span(t, 2.6, 4.6);
    e.planned.style.strokeDashoffset = `${g.len * (1 - draw)}`;
    e.travel.style.strokeDashoffset = `${g.len - s}`;

    // trolley: parked → hitched (articulated follower) → released at drop
    const follower = (rs) => {
      const rp = g.at(rs);
      const hx = rp.x - Math.cos((rp.a * Math.PI) / 180) * HITCH;
      const hy = rp.y - Math.sin((rp.a * Math.PI) / 180) * HITCH;
      const c = g.at(rs - TOW_L);
      return { x: c.x, y: c.y, a: deg(Math.atan2(hy - c.y, hx - c.x)), hx, hy };
    };
    let T = PARKED;
    let bar = null;
    if (t >= 12.6 && t < 13.4) {
      const f = follower(g.sCouple);
      const k = span(t, 12.6, 13.4);
      T = { x: lerp(PARKED.x, f.x, k), y: lerp(PARKED.y, f.y, k), a: lerpAngle(PARKED.a, f.a, k) };
      bar = k > 0.4 ? f : null;
    } else if (t >= 13.4 && t < 17.3) {
      T = follower(s);
      bar = T;
    } else if (t >= 17.3) {
      T = follower(g.sDrop);
    }
    e.trolley.setAttribute('transform', `translate(${T.x} ${T.y}) rotate(${T.a})`);
    // the delivered trolley fades out before the loop restarts; a fresh one waits at pickup
    e.trolley.style.opacity = t > T_END - 0.7 ? clamp01((T_END - t) / 0.7) : t < 0.5 ? clamp01(t / 0.5) : 1;
    if (bar) {
      const fx = T.x + Math.cos((T.a * Math.PI) / 180) * 30;
      const fy = T.y + Math.sin((T.a * Math.PI) / 180) * 30;
      e.bar.setAttribute('d', `M ${fx} ${fy} L ${bar.hx} ${bar.hy}`);
      e.bar.style.opacity = 1;
    } else e.bar.style.opacity = 0;

    // person crossing the aisle
    const pk = clamp01((t - 8.7) / 2.5);
    e.person.setAttribute('transform', `translate(322 ${lerp(128, 372, pk)})`);
    e.person.style.opacity = t > 8.5 && t < 11.6 ? 1 : 0;
    e.yieldZone.style.opacity = t > 8.5 && t < 11.5 ? 1 : 0;

    // costmap + scan pulses
    e.costmap.style.opacity = t > 4 ? 1 : 0;
    const pulse = (t * 0.9) % 1;
    e.scan.setAttribute('transform', `translate(${R.x} ${R.y}) scale(${0.3 + pulse * 1.4})`);
    e.scan.style.opacity = t > 2.5 && t < 19 ? (1 - pulse) * 0.6 : 0;

    // inspection
    const cone = span(t, 19, 19.8) * (t < 21.9 ? 1 : 0);
    e.cone.style.opacity = cone;
    const read = t > 20.3;
    e.label.setAttribute('fill', read ? '#1F9D6B' : '#E8622C');
    e.labelRing.style.opacity = read ? 1 : 0;

    // task toast
    e.toast.style.opacity = t < 5 ? 1 : 0;

    // readouts
    const moving = (t > 5 && t < 8.4) || (t > 11.5 && t < 12.6) || (t > 13.4 && t < 17.2) || (t > 17.5 && t < 19) || (t > 22 && t < 26.8);
    e.speed.textContent = moving ? '0.50' : '0.00';
  }, []);

  // animation loop
  useEffect(() => {
    if (reduce) return;
    if (!near) return;
    let raf;
    let last = performance.now();
    const loop = (now) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      let t = tRef.current;
      if (holdUntil.current === null || t < holdUntil.current) t += dt;
      if (holdUntil.current !== null && t >= holdUntil.current) {
        t = holdUntil.current;
        setDone(true);
      }
      if (t >= T_END) t = 0;
      tRef.current = t;
      render(t);
      const st = stepAt(t);
      setStep((prev) => (prev === st ? prev : st));
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [near, reduce, render]);

  // stepper mode on phones / reduced motion: play one step at a time
  useEffect(() => {
    if (mobile || reduce) {
      holdUntil.current = STEPS[0][1] - 0.01;
      tRef.current = reduce ? STEPS[0][1] - 0.01 : 0;
    } else holdUntil.current = null;
    render(tRef.current);
    setStep(stepAt(tRef.current));
  }, [mobile, reduce, render]);

  const goTo = (i) => {
    const [a, b] = STEPS[i];
    setDone(false);
    setStep(i);
    if (mobile || reduce) {
      holdUntil.current = b - 0.01;
      tRef.current = reduce ? b - 0.01 : a;
    } else tRef.current = a;
    render(tRef.current);
  };

  return (
    <section className="section section--paper" id="how" aria-labelledby="how-title">
      <div className="container">
        <Reveal className="section-head">
          <RevealItem>
            <SectionLabel index={mission.index}>{mission.label}</SectionLabel>
            <h2 id="how-title" className="h2">
              {mission.title}
            </h2>
          </RevealItem>
        </Reveal>

        <div className="mission" ref={wrap}>
          <div className="mission__map card">
            <div className="mission__hud">
              <span className="chip">
                <span className={`chip__dot ${step === 3 ? '' : 'chip__dot--ok'}`} />
                <span className="chip__label">STATE</span> {STATES[step]}
              </span>
              <span className="chip">
                <span className="chip__label">SPEED</span>
                <span className="tnum" ref={ref('speed')}>
                  0.00
                </span>{' '}
                m/s
              </span>
            </div>
            <svg viewBox="0 0 900 520" role="img" aria-label={`Factory floor map. Current step: ${mission.steps[step].title}`}>
              <defs>
                <pattern id="mgrid" width="30" height="30" patternUnits="userSpaceOnUse">
                  <path d="M30 0H0V30" fill="none" stroke="rgba(20,22,26,.06)" />
                </pattern>
                <radialGradient id="mscan">
                  <stop offset="0.6" stopColor="#1F9D6B" stopOpacity="0" />
                  <stop offset="1" stopColor="#1F9D6B" stopOpacity="0.5" />
                </radialGradient>
                <linearGradient id="mcone" x1="0" y1="1" x2="0" y2="0">
                  <stop offset="0" stopColor="#E8622C" stopOpacity="0.45" />
                  <stop offset="1" stopColor="#E8622C" stopOpacity="0.05" />
                </linearGradient>
              </defs>
              <rect x="20" y="20" width="860" height="480" rx="10" fill="url(#mgrid)" stroke="rgba(20,22,26,.25)" />

              {/* costmap inflation */}
              <g ref={ref('costmap')} className="mission__fade">
                <rect x="236" y="76" width="498" height="78" rx="18" fill="#2F7FD6" opacity="0.08" />
                <rect x="236" y="326" width="428" height="78" rx="18" fill="#2F7FD6" opacity="0.08" />
              </g>

              {/* racks */}
              {[0, 1, 2, 3].map((i) => (
                <g key={`t${i}`}>
                  <rect x={250 + i * 118} y="90" width="110" height="50" fill="#fff" stroke="#14161A" strokeOpacity="0.5" />
                  <path d={`M${250 + i * 118} 115h110M${305 + i * 118} 90v50`} stroke="#14161A" strokeOpacity="0.2" />
                </g>
              ))}
              {[0, 1, 2].map((i) => (
                <g key={`b${i}`}>
                  <rect x={250 + i * 134} y="340" width="126" height="50" fill="#fff" stroke="#14161A" strokeOpacity="0.5" />
                  <path d={`M${250 + i * 134} 365h126M${313 + i * 134} 340v50`} stroke="#14161A" strokeOpacity="0.2" />
                </g>
              ))}
              <text x="250" y="80" className="mission__txt">
                RACK ROW A
              </text>
              <text x="250" y="410" className="mission__txt">
                RACK ROW B
              </text>

              {/* bin label being inspected */}
              <circle ref={ref('labelRing')} cx="480" cy="384" r="14" fill="none" stroke="#1F9D6B" strokeWidth="2" className="mission__fade" />
              <rect ref={ref('label')} x="470" y="380" width="20" height="8" rx="2" fill="#E8622C" />

              {/* stations */}
              <rect x="56" y="420" width="68" height="60" rx="6" fill="none" stroke="#1F9D6B" strokeDasharray="4 4" />
              <text x="56" y="496" className="mission__txt">
                DOCK
              </text>
              <rect x="330" y="172" width="80" height="56" rx="6" fill="none" stroke="#14161A" strokeOpacity="0.4" strokeDasharray="4 4" />
              <text x="330" y="166" className="mission__txt">
                PICKUP
              </text>
              <rect x="752" y="360" width="76" height="76" rx="6" fill="none" stroke="#E8622C" strokeDasharray="4 4" />
              <text x="752" y="352" className="mission__txt">
                DROP B
              </text>

              {/* paths */}
              <path ref={ref('path')} d={PATH_D} fill="none" stroke="none" />
              <path ref={ref('planned')} d={PATH_D} fill="none" stroke="#E8622C" strokeWidth="2.5" strokeLinecap="round" className="mission__planned" />
              <path ref={ref('travel')} d={PATH_D} fill="none" stroke="#14161A" strokeOpacity="0.35" strokeWidth="6" strokeLinecap="round" />

              {/* yield zone */}
              <rect ref={ref('yieldZone')} x="290" y="222" width="64" height="56" rx="8" fill="#E8622C" fillOpacity="0.14" stroke="#E8622C" strokeOpacity="0.5" strokeDasharray="3 3" className="mission__fade" />

              {/* person */}
              <g ref={ref('person')} className="mission__fade">
                <circle r="16" fill="#E8622C" opacity="0.15" />
                <circle r="7" fill="#14161A" />
                <path d="M-9 4 L0 -2 L9 4" stroke="#14161A" strokeWidth="3" fill="none" strokeLinecap="round" />
              </g>

              {/* trolley */}
              <path ref={ref('bar')} stroke="#D0142C" strokeWidth="3" strokeLinecap="round" />
              <g ref={ref('trolley')}>
                <rect x="-30" y="-21" width="60" height="42" rx="4" fill="#fff" stroke="#14161A" strokeWidth="1.5" />
                <rect x="-24" y="-15" width="48" height="30" rx="2" fill="#2F7FD6" opacity="0.25" />
                {[
                  [-24, -23],
                  [24, -23],
                  [-24, 23],
                  [24, 23],
                ].map(([x, y], i) => (
                  <circle key={i} cx={x} cy={y} r="3" fill="#14161A" />
                ))}
                <text x="-12" y="4" className="mission__txt">
                  T-07
                </text>
              </g>

              {/* scan pulse */}
              <circle ref={ref('scan')} r="60" fill="url(#mscan)" />

              {/* robot (top-down) */}
              <g ref={ref('robot')}>
                <path ref={ref('cone')} d="M 22 12 L -30 132 L 74 132 Z" fill="url(#mcone)" className="mission__fade" />
                <rect x="-33" y="-21" width="66" height="42" rx="7" fill="#DDE0E4" stroke="#14161A" strokeWidth="1.5" />
                <rect x="-28" y="-16" width="40" height="32" rx="3" fill="#2F7FD6" />
                <rect x="14" y="-19" width="16" height="38" rx="3" fill="#C3C8CE" />
                <circle cx="22" cy="-10" r="5" fill="#E8622C" />
                <circle cx="22" cy="10" r="3.5" fill="#D0142C" />
                <circle cx="31" cy="0" r="3" fill="#14161A" />
                <rect x="-39" y="-3" width="6" height="6" rx="1" fill="#D0142C" />
              </g>

              {/* incoming task toast */}
              <g ref={ref('toast')} className="mission__fade">
                <rect x="140" y="420" width="220" height="56" rx="8" fill="#14161A" />
                <text x="156" y="444" className="mission__txt mission__txt--light">
                  TASK #042 · QUEUED
                </text>
                <text x="156" y="462" className="mission__txt mission__txt--muted">
                  TOW T-07 → DROP B
                </text>
              </g>
            </svg>
          </div>

          <div className="mission__steps">
            <ol>
              {mission.steps.map((s, i) => (
                <li key={s.title} className={i === step ? 'is-active' : i < step ? 'is-done' : ''}>
                  <button type="button" onClick={() => goTo(i)} aria-current={i === step ? 'step' : undefined}>
                    <span className="mono mission__num">{String(i + 1).padStart(2, '0')}</span>
                    <span className="mission__stext">
                      <span className="mission__stitle">{s.title}</span>
                      <span className="mission__sbody">{s.body}</span>
                    </span>
                  </button>
                  {i === step && !reduce && !mobile && (
                    <span className="mission__bar" style={{ animationDuration: `${STEPS[i][1] - STEPS[i][0]}s` }} key={`${i}-${step}`} />
                  )}
                </li>
              ))}
            </ol>
          </div>

          <div className="mission__stepper" aria-live="polite">
            <div className="mission__stepper-text">
              <span className="mono mission__num">
                {String(step + 1).padStart(2, '0')} / {String(STEPS.length).padStart(2, '0')}
              </span>
              <h3 className="h3">{mission.steps[step].title}</h3>
              <p className="muted">{mission.steps[step].body}</p>
            </div>
            <div className="mission__stepper-ctl">
              <button type="button" className="btn btn--ghost btn--sm" onClick={() => goTo(Math.max(0, step - 1))} disabled={step === 0}>
                ← Prev
              </button>
              <div className="mission__dots" aria-hidden="true">
                {STEPS.map((_, i) => (
                  <span key={i} className={i === step ? 'on' : ''} />
                ))}
              </div>
              <button type="button" className="btn btn--primary btn--sm" onClick={() => goTo((step + 1) % STEPS.length)}>
                {step === STEPS.length - 1 ? 'Replay' : done ? 'Next step →' : 'Next →'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
