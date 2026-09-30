import { useEffect, useRef } from 'react';
import { useReducedMotion } from 'framer-motion';
import { engineering } from '../content.js';
import { useNearViewport } from '../hooks/useMedia.js';
import SectionLabel from './ui/SectionLabel.jsx';
import Counter from './ui/Counter.jsx';
import { Reveal, RevealItem } from './ui/Reveal.jsx';
import './Engineering.css';

const W_M = 0.5; // wheel separation used in the diagram (m)
const PX_PER_M = 280;
const V = 0.5;

function DiffDrive() {
  const reduce = useReducedMotion();
  const box = useRef(null);
  const near = useNearViewport(box);
  const r = useRef({});
  const ref = (k) => (el) => (r.current[k] = el);

  useEffect(() => {
    const e = r.current;
    const draw = (t) => {
      const omega = reduce ? 0.45 : Math.sin(t * 0.55) * 0.9;
      const heading = reduce ? 10 : Math.sin(t * 0.55 - Math.PI / 2) * -28;
      const vr = V + (omega * W_M) / 2;
      const vl = V - (omega * W_M) / 2;
      e.body.setAttribute('transform', `translate(210 180) rotate(${heading})`);
      const L = (v) => Math.max(8, v * 170);
      e.al.setAttribute('d', `M -70 -10 V ${-10 - L(vl)}`);
      e.ar.setAttribute('d', `M 70 -10 V ${-10 - L(vr)}`);
      e.hl.setAttribute('transform', `translate(-70 ${-10 - L(vl)})`);
      e.hr.setAttribute('transform', `translate(70 ${-10 - L(vr)})`);
      e.tl.setAttribute('y', -18 - L(vl));
      e.tr.setAttribute('y', -18 - L(vr));
      const R = Math.abs(omega) > 0.08 ? (V / omega) * PX_PER_M : null;
      // positive omega turns left → ICC on the left (negative x in robot frame)
      if (R !== null && Math.abs(R) < 900) {
        e.icc.style.opacity = 1;
        e.icc.setAttribute('transform', `translate(${-R} 0)`);
        e.axle.setAttribute('x2', -R);
      } else {
        e.icc.style.opacity = 0;
        e.axle.setAttribute('x2', 0);
      }
      e.vl.textContent = vl.toFixed(2);
      e.vr.textContent = vr.toFixed(2);
      e.om.textContent = (omega >= 0 ? '+' : '−') + Math.abs(omega).toFixed(2);
    };
    if (reduce || !near) {
      draw(0);
      return;
    }
    let raf;
    const t0 = performance.now();
    const loop = (now) => {
      draw((now - t0) / 1000);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [near, reduce]);

  const k = engineering.kinematics;
  return (
    <div className="dd card" ref={box}>
      <div className="dd__text">
        <p className="mono dd__kicker">Fig. 04.1</p>
        <h3 className="h3">{k.title}</h3>
        <p className="muted">{k.body}</p>
        <ul className="dd__f mono">
          {k.formulas.map((f) => (
            <li key={f}>{f}</li>
          ))}
        </ul>
        <dl className="dd__live mono">
          <div>
            <dt>V_L</dt>
            <dd>
              <span ref={ref('vl')} className="tnum">
                0.50
              </span>{' '}
              m/s
            </dd>
          </div>
          <div>
            <dt>V_R</dt>
            <dd>
              <span ref={ref('vr')} className="tnum">
                0.50
              </span>{' '}
              m/s
            </dd>
          </div>
          <div>
            <dt>ω</dt>
            <dd>
              <span ref={ref('om')} className="tnum">
                +0.00
              </span>{' '}
              rad/s
            </dd>
          </div>
        </dl>
      </div>
      <svg viewBox="0 0 420 330" className="dd__svg" role="img" aria-label="Differential drive diagram: two wheels separated by w, with left and right wheel velocity arrows changing as the robot turns">
        <defs>
          <marker id="ddarrow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
            <path d="M0 0L10 5L0 10z" fill="currentColor" />
          </marker>
        </defs>
        <g ref={ref('body')} transform="translate(210 180)">
          <line ref={ref('axle')} x1="0" y1="0" x2="0" y2="0" stroke="#E8622C" strokeDasharray="3 4" />
          <g ref={ref('icc')}>
            <circle r="5" fill="none" stroke="#E8622C" />
            <text y="-10" textAnchor="middle" className="dd__lbl">
              ICC
            </text>
          </g>
          <rect x="-58" y="-78" width="116" height="150" rx="12" fill="#fff" stroke="#14161A" strokeWidth="1.5" />
          <rect x="-44" y="-36" width="88" height="96" rx="4" fill="#2F7FD6" opacity="0.2" />
          <rect x="-78" y="-26" width="16" height="52" rx="4" fill="#14161A" />
          <rect x="62" y="-26" width="16" height="52" rx="4" fill="#14161A" />
          <circle r="3" fill="#14161A" />
          {/* w dimension */}
          <path d="M-70 92 V 102 M70 92 V 102 M-70 97 H 70" stroke="#14161A" strokeOpacity="0.5" fill="none" />
          <text y="116" textAnchor="middle" className="dd__lbl">
            w
          </text>
          {/* velocity arrows */}
          <path ref={ref('al')} stroke="#1F9D6B" strokeWidth="3" fill="none" />
          <path ref={ref('ar')} stroke="#1F9D6B" strokeWidth="3" fill="none" />
          <path ref={ref('hl')} d="M-7 8 L0 -4 L7 8" fill="#1F9D6B" />
          <path ref={ref('hr')} d="M-7 8 L0 -4 L7 8" fill="#1F9D6B" />
          <text ref={ref('tl')} x="-70" textAnchor="middle" className="dd__lbl dd__lbl--v">
            V_L
          </text>
          <text ref={ref('tr')} x="70" textAnchor="middle" className="dd__lbl dd__lbl--v">
            V_R
          </text>
        </g>
      </svg>
    </div>
  );
}

export default function Engineering() {
  return (
    <section className="section" id="engineering" aria-labelledby="eng-title">
      <div className="container">
        <Reveal className="section-head section-head--split">
          <RevealItem>
            <SectionLabel index={engineering.index}>{engineering.label}</SectionLabel>
            <h2 id="eng-title" className="h2">
              {engineering.title}
            </h2>
          </RevealItem>
          <RevealItem as="p" className="lead">
            {engineering.lead}
          </RevealItem>
        </Reveal>

        <Reveal as="ul" className="stats" amount={0.1}>
          {engineering.stats.map((s) => (
            <RevealItem as="li" key={s.label} className="stat">
              <p className="stat__label">{s.label}</p>
              <p className="stat__value">
                <Counter value={s.value} decimals={s.decimals} prefix={s.prefix} />
                <span className="stat__unit">{s.unit}</span>
              </p>
              <p className="mono stat__f">{s.formula}</p>
            </RevealItem>
          ))}
        </Reveal>

        <DiffDrive />
      </div>
    </section>
  );
}
