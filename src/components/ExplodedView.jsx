import { Suspense, lazy, useEffect, useRef, useState } from 'react';
import { useScroll, useTransform } from 'framer-motion';
import { hardware } from '../content.js';
import { hasWebGL, useMedia, useNearViewport } from '../hooks/useMedia.js';
import SectionLabel from './ui/SectionLabel.jsx';
import { Reveal, RevealItem } from './ui/Reveal.jsx';
import './ExplodedView.css';

const ExplodedScene = lazy(() => import('../three/ExplodedScene.jsx'));

function Head() {
  return (
    <>
      <SectionLabel index={hardware.index}>{hardware.label}</SectionLabel>
      <h2 id="hardware-title" className="h2">
        {hardware.title}
      </h2>
      <p className="lead xv__lead">{hardware.lead}</p>
    </>
  );
}

function Pinned({ gl }) {
  const track = useRef(null);
  const overlay = useRef({ labels: [], lines: [], dots: [], counter: null });
  const near = useNearViewport(track, '0px');
  const { scrollYProgress } = useScroll({ target: track, offset: ['start start', 'end end'] });
  const progress = useTransform(scrollYProgress, [0.06, 0.86], [0, 1], { clamp: true });
  const o = overlay.current;

  return (
    <div className="xv__track" ref={track}>
      <div className="xv__sticky">
        <div className="container xv__head">
          <Head />
          <p className="mono xv__count">
            Layers separated <span ref={(el) => (o.counter = el)}>00</span> / 08
          </p>
        </div>
        <div className="xv__stage">
          {gl && (
            <Suspense fallback={null}>
              <ExplodedScene progress={progress} overlay={overlay} active={near} />
            </Suspense>
          )}
          <svg className="xv__lines" aria-hidden="true">
            {hardware.layers.map((_, i) => {
              const k = 7 - i;
              return (
                <g key={k}>
                  <line ref={(el) => (o.lines[k] = el)} style={{ opacity: 0 }} />
                  <circle ref={(el) => (o.dots[k] = el)} r="3.5" style={{ opacity: 0 }} />
                </g>
              );
            })}
          </svg>
          <ol className="xv__labels">
            {hardware.layers.map((l, i) => {
              const k = 7 - i;
              return (
                <li key={l.name} ref={(el) => (o.labels[k] = el)} className="xv__label" style={{ opacity: 0 }}>
                  <span className="mono xv__lidx">L{String(i + 1).padStart(2, '0')}</span>
                  <span className="xv__lname">{l.name}</span>
                  <span className="mono xv__lspec">{l.spec}</span>
                </li>
              );
            })}
          </ol>
        </div>
        <p className="mono xv__scroll">Scroll to explode · scroll back to reassemble</p>
      </div>
    </div>
  );
}

function Stacked({ gl }) {
  const stage = useRef(null);
  const near = useNearViewport(stage);
  return (
    <div className="container xv__mobile">
      <Head />
      <div className="xv__mstage" ref={stage}>
        {gl && (
          <Suspense fallback={null}>
            <ExplodedScene progress={1} labelled={false} active={near} />
          </Suspense>
        )}
      </div>
      <Reveal as="ol" className="xv__mlist" amount={0.1}>
        {hardware.layers.map((l, i) => (
          <RevealItem as="li" key={l.name} className="xv__mitem">
            <span className="mono xv__lidx">L{String(i + 1).padStart(2, '0')}</span>
            <div>
              <span className="xv__lname">{l.name}</span>
              <span className="mono xv__lspec">{l.spec}</span>
            </div>
          </RevealItem>
        ))}
      </Reveal>
    </div>
  );
}

export default function ExplodedView() {
  const mobile = useMedia('(max-width: 900px)');
  const [gl, setGl] = useState(false);
  useEffect(() => setGl(hasWebGL()), []);
  return <div className="section--dark xv">{mobile ? <Stacked gl={gl} /> : <Pinned gl={gl} />}</div>;
}
