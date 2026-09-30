import { useEffect, useRef, useState } from 'react';
import { animate, useMotionValue, useReducedMotion } from 'framer-motion';
import { hardware } from '../content.js';
import { hasWebGL, useMedia } from '../hooks/useMedia.js';
import ExplodedScene, { sequentialProgress } from '../three/ExplodedScene.jsx';
import ComponentGrid from '../components/ComponentGrid.jsx';
import Footer from '../components/Footer.jsx';
import { Logo } from '../components/Nav.jsx';
import '../components/Nav.css';
import '../components/ExplodedView.css';
import './HardwarePage.css';

const EASE = [0.45, 0, 0.2, 1];

/**
 * Stand-alone teardown at /hardware.
 * The robot separates layer by layer on its own (no scrolling). While the visitor
 * drags to rotate it, the layers glide back together; on release they separate again.
 */
export default function HardwarePage() {
  const reduce = useReducedMotion();
  const phone = useMedia('(max-width: 900px)');
  const [gl, setGl] = useState(false);
  const [state, setState] = useState('separating'); // separating | separated | joining | joined
  const progress = useMotionValue(reduce ? 1 : 0);
  const yaw = useRef(0);
  const ctl = useRef(null);
  const drag = useRef(null);
  const resumeTimer = useRef(null);
  const overlay = useRef({ labels: [], lines: [], dots: [], counter: null });
  const o = overlay.current;

  useEffect(() => setGl(hasWebGL()), []);

  const go = (to, duration) => {
    ctl.current?.stop();
    if (reduce) {
      progress.set(to);
      setState(to === 1 ? 'separated' : 'joined');
      return;
    }
    setState(to === 1 ? 'separating' : 'joining');
    ctl.current = animate(progress, to, {
      duration,
      ease: EASE,
      onComplete: () => setState(to === 1 ? 'separated' : 'joined'),
    });
  };
  const separate = () => go(1, 4.2 * (1 - progress.get()) + 0.4);
  const join = () => go(0, 1.6 * progress.get() + 0.3);
  const replay = () => {
    ctl.current?.stop();
    progress.set(0);
    separate();
  };

  // separate layer by layer as soon as the page opens
  useEffect(() => {
    const t = setTimeout(separate, 600);
    return () => {
      clearTimeout(t);
      clearTimeout(resumeTimer.current);
      ctl.current?.stop();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // drag to rotate: the stack rejoins while moving, separates again after release
  const onPointerDown = (e) => {
    if (e.button !== 0 && e.pointerType === 'mouse') return;
    drag.current = { x: e.clientX, y: e.clientY, moved: false, id: e.pointerId };
    clearTimeout(resumeTimer.current);
  };
  const onPointerMove = (e) => {
    const d = drag.current;
    if (!d || d.id !== e.pointerId) return;
    const dx = e.clientX - d.x;
    if (!d.moved) {
      // on touch, only treat clearly horizontal swipes as rotation so the page still scrolls
      if (Math.abs(dx) < 6 || (e.pointerType !== 'mouse' && Math.abs(e.clientY - d.y) > Math.abs(dx))) return;
      d.moved = true;
      e.currentTarget.setPointerCapture?.(e.pointerId);
      join();
    }
    yaw.current += (e.clientX - (d.lastX ?? d.x)) * 0.008;
    d.lastX = e.clientX;
  };
  const onPointerUp = () => {
    const d = drag.current;
    drag.current = null;
    if (d?.moved) resumeTimer.current = setTimeout(separate, 500);
  };

  const busy = state === 'separating' || state === 'joining';

  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <header className="nav nav--scrolled">
        <div className="nav__pill">
          <Logo href="/" />
          <a className="btn btn--primary btn--sm hw-explore" href="/">
            Explore the site <span className="btn__arrow">→</span>
          </a>
        </div>
      </header>

      <main id="main">
        <section className="hw section--dark" aria-labelledby="hw-title">
          <div className="container hw__head">
            <div className="section-label">
              <span className="section-label__index">03</span>
              <span className="section-label__rule" aria-hidden="true" />
              <span>Hardware · part details</span>
            </div>
            <h1 id="hw-title" className="h2 hw__title">
              Every layer, one by one.
            </h1>
            <p className="lead hw__lead">
              The robot separates into its eight hardware layers, from the inspection arm down to the chassis base. Drag to
              rotate it: the layers glide back together while you move, then separate again.
            </p>
            <p className="mono hw__count" aria-live="polite">
              {state === 'joining' || state === 'joined' ? 'Assembled' : 'Layers separated'}{' '}
              <span ref={(el) => (o.counter = el)}>00</span> / 08
            </p>
            <div className="hw__controls" role="group" aria-label="Teardown controls">
              <button type="button" className="btn btn--accent btn--sm" onClick={separate} disabled={state === 'separated'}>
                Separate
              </button>
              <button type="button" className="btn btn--ghost btn--sm" onClick={join} disabled={state === 'joined'}>
                Assemble
              </button>
              <button type="button" className="btn btn--ghost btn--sm" onClick={replay} disabled={busy}>
                Replay
              </button>
            </div>
          </div>

          <div
            className="hw__stage"
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerCancel={onPointerUp}
          >
            {gl && <ExplodedScene progress={progress} overlay={overlay} labelled={!phone} lp={sequentialProgress} yaw={yaw} />}
            {gl && (
              <>
                <svg className="xv__lines" aria-hidden="true">
                  {hardware.layers.map((_, i) => {
                    const k = 7 - i;
                    return (
                      <g key={k}>
                        <line ref={(el) => (o.lines[k] = el)} style={{ opacity: 0 }} />
                        <circle ref={(el) => (o.dots[k] = el)} r={phone ? 3 : 3.5} style={{ opacity: 0 }} />
                      </g>
                    );
                  })}
                </svg>
                <ol className="xv__labels" aria-hidden="true">
                  {hardware.layers.map((l, i) =>
                    phone ? (
                      <li key={l.name} ref={(el) => (o.labels[7 - i] = el)} className="xv__tag mono" style={{ opacity: 0 }}>
                        L{String(i + 1).padStart(2, '0')}
                      </li>
                    ) : (
                      <li key={l.name} ref={(el) => (o.labels[7 - i] = el)} className="xv__label" style={{ opacity: 0 }}>
                        <span className="mono xv__lidx">L{String(i + 1).padStart(2, '0')}</span>
                        <span className="xv__lname">{l.name}</span>
                        <span className="mono xv__lspec">{l.spec}</span>
                      </li>
                    )
                  )}
                </ol>
              </>
            )}
            {!gl && <p className="mono hw__nogl">3D view needs WebGL. The layers are listed below.</p>}
          </div>
          <p className="mono hw__hint" aria-hidden="true">
            {phone ? 'Swipe sideways to rotate' : 'Drag to rotate'} · layers rejoin while you move
          </p>

          {/* phones (and screen readers everywhere): the numbered layer list */}
          <div className={`container hw__list ${phone ? '' : 'visually-hidden'}`}>
            <ol className="xv__mlist">
              {hardware.layers.map((l, i) => (
                <li key={l.name} className="xv__mitem">
                  <span className="mono xv__lidx">L{String(i + 1).padStart(2, '0')}</span>
                  <div>
                    <span className="xv__lname">{l.name}</span>
                    <span className="mono xv__lspec">{l.spec}</span>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <ComponentGrid />
      </main>
      <Footer base="/" />
    </>
  );
}
