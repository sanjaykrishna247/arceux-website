import { useReducedMotion } from 'framer-motion';
import { consoleApp, links, linkProps } from '../content.js';
import SectionLabel from './ui/SectionLabel.jsx';
import { Reveal, RevealItem } from './ui/Reveal.jsx';
import './OperatorConsole.css';

const ROUTE = 'M 30 170 V 92 H 220 Q 262 92 262 130 V 160';

function MiniMap() {
  const reduce = useReducedMotion();
  return (
    <svg viewBox="0 0 300 200" className="ui__map" aria-hidden="true">
      <rect x="6" y="6" width="288" height="188" rx="6" fill="#0c1628" stroke="#24375a" />
      {[0, 1, 2, 3].map((i) => (
        <rect key={i} x={60 + i * 52} y="30" width="40" height="22" fill="#1b3358" />
      ))}
      {[0, 1, 2].map((i) => (
        <rect key={i} x={60 + i * 60} y="130" width="48" height="22" fill="#1b3358" />
      ))}
      <path d={ROUTE} fill="none" stroke="#E8622C" strokeWidth="2" strokeDasharray="5 4" className="ui__route" />
      <circle cx="262" cy="160" r="9" fill="none" stroke="#E8622C" />
      <circle cx="262" cy="160" r="3" fill="#E8622C" />
      <g transform={reduce ? 'translate(220 92)' : undefined}>
        <circle r="14" fill="#1F9D6B" opacity="0.2" />
        <rect x="-8" y="-5.5" width="16" height="11" rx="2" fill="#e9edf5" />
        {!reduce && (
          <animateMotion dur="9s" repeatCount="indefinite" rotate="auto" keyPoints="0;1;1" keyTimes="0;0.8;1" calcMode="linear" path={ROUTE} />
        )}
      </g>
    </svg>
  );
}

function Joystick({ small }) {
  return (
    <span className={`ui__joy ${small ? 'ui__joy--sm' : ''}`} aria-hidden="true">
      <span />
    </span>
  );
}

function Camera({ children }) {
  return (
    <div className="ui__cam" aria-hidden="true">
      <div className="ui__cam-rack">
        <span />
        <span />
        <span className="ui__cam-label">A-12</span>
      </div>
      <span className="ui__cam-rec mono">● REC · CAM 01</span>
      <span className="ui__cross" />
      {children}
    </div>
  );
}

function LaptopUI() {
  return (
    <div className="ui">
      <div className="ui__bar mono">
        <span>
          <b>ARCEUX-01</b> · CONNECTED
        </span>
        <span className="ui__ok">● NAV2 OK</span>
        <span className="ui__estop">E-STOP</span>
      </div>
      <div className="ui__grid">
        <div className="ui__panel ui__panel--map">
          <p className="ui__h mono">SLAM map · tap to navigate</p>
          <MiniMap />
        </div>
        <div className="ui__panel">
          <p className="ui__h mono">Inspection camera</p>
          <Camera>
            <Joystick small />
          </Camera>
        </div>
        <div className="ui__panel">
          <p className="ui__h mono">Mission queue</p>
          <ul className="ui__queue mono">
            <li className="on">#042 TOW T-07 → DROP B</li>
            <li>#043 INSPECT ROW B</li>
            <li>#044 RETURN TO DOCK</li>
          </ul>
        </div>
        <div className="ui__panel">
          <p className="ui__h mono">System health</p>
          {[
            ['BATT', 86],
            ['CPU', 42],
            ['TEMP', 55],
            ['WIFI', 78],
          ].map(([k, v]) => (
            <div className="ui__meter mono" key={k}>
              <span>{k}</span>
              <span className="ui__meter-bar">
                <i style={{ transform: `scaleX(${v / 100})` }} />
              </span>
              <span>{v}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function PhoneUI() {
  return (
    <div className="ui ui--phone">
      <div className="ui__bar mono">
        <b>ARCEUX-01</b>
        <span className="ui__ok">● 86%</span>
      </div>
      <Camera />
      <div className="ui__macros mono">
        <span>STOW</span>
        <span className="on">RACK</span>
        <span>SWEEP</span>
      </div>
      <div className="ui__joys">
        <Joystick />
        <span className="ui__estop ui__estop--big">STOP</span>
        <Joystick />
      </div>
    </div>
  );
}

export default function OperatorConsole() {
  const shots = consoleApp.screenshots;
  return (
    <section className="section" id="console" aria-labelledby="console-title">
      <div className="container oc">
        <Reveal className="oc__copy">
          <RevealItem>
            <SectionLabel index={consoleApp.index}>{consoleApp.label}</SectionLabel>
            <h2 id="console-title" className="h2">
              {consoleApp.title}
            </h2>
          </RevealItem>
          <RevealItem as="p" className="lead">
            {consoleApp.lead}
          </RevealItem>
          <RevealItem as="ul" className="oc__list">
            {consoleApp.features.map((f, i) => (
              <li key={f}>
                <span className="mono">{String(i + 1).padStart(2, '0')}</span>
                {f}
              </li>
            ))}
          </RevealItem>
          <RevealItem>
            <a className="btn btn--accent" {...linkProps(links.console)}>
              {consoleApp.cta} <span className="btn__arrow">↗</span>
            </a>
          </RevealItem>
        </Reveal>

        <Reveal className="oc__devices" amount={0.2}>
          <RevealItem className="laptop">
            <div className="laptop__screen">
              {shots.laptop ? <img src={shots.laptop} alt="Operator console on a laptop: live map, camera, mission queue and system health" loading="lazy" /> : <LaptopUI />}
            </div>
            <div className="laptop__base" aria-hidden="true" />
          </RevealItem>
          <RevealItem className="phone">
            <div className="phone__screen">
              {shots.phone ? <img src={shots.phone} alt="Operator console on a phone: camera view with dual joysticks and emergency stop" loading="lazy" /> : <PhoneUI />}
            </div>
          </RevealItem>
        </Reveal>
      </div>
    </section>
  );
}
