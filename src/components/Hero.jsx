import { Suspense, lazy, useEffect, useRef, useState } from 'react';
import { animate, motion, useReducedMotion } from 'framer-motion';
import { hero, links, linkProps } from '../content.js';
import { hasWebGL, useMedia, useNearViewport } from '../hooks/useMedia.js';
import RobotSVG from './RobotSVG.jsx';
import './Hero.css';

// Start fetching the 3D scene immediately, in parallel with the first paint.
const heroScene = import('../three/HeroScene.jsx');
const HeroScene = lazy(() => heroScene);
const EASE = [0.2, 0.7, 0.2, 1];

function LiveNumber({ value, decimals, jitter, reduce }) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || reduce || !jitter) return;
    let current = value;
    let ctl;
    const id = setInterval(() => {
      const next = value + (Math.random() - 0.5) * 2 * jitter;
      ctl = animate(current, next, {
        duration: 0.8,
        ease: 'easeInOut',
        onUpdate: (v) => {
          current = v;
          el.textContent = v.toFixed(decimals);
        },
      });
    }, 1700 + Math.random() * 900);
    return () => {
      clearInterval(id);
      ctl?.stop();
    };
  }, [value, decimals, jitter, reduce]);
  return (
    <span ref={ref} className="tnum">
      {value.toFixed(decimals)}
    </span>
  );
}

function Chip({ chip, reduce, delay, className }) {
  return (
    <motion.div
      className={`chip hero__chip ${className}`}
      initial={reduce ? false : { opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay, ease: EASE }}
    >
      <span className={`chip__dot ${chip.status === 'ok' ? 'chip__dot--ok' : ''}`} />
      <span className="chip__label">{chip.label}</span>
      {chip.text ? (
        <span>· {chip.text}</span>
      ) : (
        <span>
          <LiveNumber value={chip.value} decimals={chip.decimals} jitter={chip.jitter} reduce={reduce} /> {chip.unit}
        </span>
      )}
    </motion.div>
  );
}

export default function Hero() {
  const reduce = useReducedMotion();
  const stage = useRef(null);
  const near = useNearViewport(stage, '0px');
  const finePointer = useMedia('(hover: hover) and (pointer: fine)');
  const [gl, setGl] = useState(null);
  useEffect(() => setGl(hasWebGL()), []);

  const item = (i) => ({
    initial: reduce ? false : { opacity: 0, y: 16 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, delay: 0.1 + i * 0.07, ease: EASE },
  });

  return (
    <section className="hero" id="top" aria-labelledby="hero-title">
      <div className="container hero__grid">
        <div className="hero__copy">
          <motion.p className="mono hero__kicker" {...item(0)}>
            <span className="hero__kicker-dot" aria-hidden="true" />
            {hero.kicker}
          </motion.p>
          <motion.h1 id="hero-title" className="display hero__title" {...item(1)}>
            {hero.title[0]}
            <br />
            <em>{hero.title[1]}</em>
          </motion.h1>
          <motion.p className="lead hero__sub" {...item(2)}>
            {hero.subtitle}
          </motion.p>
          <motion.div className="hero__ctas" {...item(3)}>
            <a href="#product" className="btn btn--primary">
              {hero.ctaPrimary} <span className="btn__arrow">↓</span>
            </a>
            <a {...linkProps(links.console)} className="btn btn--ghost">
              {hero.ctaSecondary} <span className="btn__arrow">↗</span>
            </a>
          </motion.div>
          <motion.dl className="hero__facts" {...item(4)}>
            {[
              ['150 kg', 'tow load'],
              ['0.5 m/s', 'cruise'],
              ['4-DOF', 'camera arm'],
            ].map(([v, k]) => (
              <div key={k}>
                <dt className="mono muted">{k}</dt>
                <dd>{v}</dd>
              </div>
            ))}
          </motion.dl>
        </div>

        <div className="hero__stage" ref={stage}>
          <div className="hero__canvas">
            {gl === false ? (
              <RobotSVG className="hero__fallback" />
            ) : gl ? (
              <Suspense fallback={null}>
                <HeroScene active={near} reduce={!!reduce} interactive={finePointer && !reduce} />
              </Suspense>
            ) : null}
          </div>
          <div className="hero__chips" aria-label="Live telemetry (simulated)">
            {hero.chips.map((c, i) => (
              <Chip key={c.key} chip={c} reduce={reduce} delay={reduce ? 0 : 1.6 + i * 0.12} className={`hero__chip--${i}`} />
            ))}
          </div>
          <div className="hero__dim" aria-hidden="true">
            <span className="hero__dim-line" />
            <span className="mono">1 060 mm</span>
            <span className="hero__dim-line" />
          </div>
          {finePointer && <p className="hero__hint mono muted">Drag to orbit</p>}
        </div>
      </div>
      <a href="#product" className="hero__scroll mono" aria-label="Scroll to Meet the Robot">
        <span>Scroll</span>
        <span className="hero__scroll-line" aria-hidden="true" />
      </a>
    </section>
  );
}
