import { meet } from '../content.js';
import SectionLabel from './ui/SectionLabel.jsx';
import { Reveal, RevealItem } from './ui/Reveal.jsx';
import RobotSVG from './RobotSVG.jsx';
import './MeetRobot.css';

const CROPS = {
  arm: [{ viewBox: '200 -1010 420 315', label: 'Arm and camera end-effector, close up' }],
  panel: [{ viewBox: '-470 -420 620 465', label: 'Flank E-stop, status display and charging port, close up' }],
  lidar: [
    { viewBox: '300 -470 260 390', label: 'LiDAR puck and front sensors, close up' },
    { viewBox: '-700 -390 260 390', label: 'Red rear tow hook, close up' },
  ],
};

function Callout({ c, i }) {
  const crops = CROPS[c.crop];
  return (
    <RevealItem as="article" className="card callout">
      <div className={`callout__fig ${crops.length > 1 ? 'callout__fig--split' : ''}`}>
        {crops.map((cr, k) => (
          <RobotSVG key={k} viewBox={cr.viewBox} title={cr.label} preserveAspectRatio="xMidYMid slice" className="callout__svg" />
        ))}
        <span className="callout__tag mono">DETAIL {String.fromCharCode(65 + i)}</span>
        <span className="callout__zoom mono" aria-hidden="true">
          ×{c.crop === 'arm' ? '3.1' : c.crop === 'panel' ? '2.1' : '3.6'}
        </span>
      </div>
      <div className="callout__body">
        <h3 className="h3">{c.title}</h3>
        <p className="muted">{c.body}</p>
      </div>
    </RevealItem>
  );
}

export default function MeetRobot() {
  return (
    <section className="section" id="product" aria-labelledby="meet-title">
      <div className="container">
        <Reveal className="section-head section-head--split">
          <RevealItem>
            <SectionLabel index={meet.index}>{meet.label}</SectionLabel>
            <h2 id="meet-title" className="h2">
              {meet.title}
            </h2>
          </RevealItem>
          <RevealItem as="p" className="lead">
            {meet.lead}
          </RevealItem>
        </Reveal>

        <Reveal className="meet__cols">
          {meet.columns.map((col, i) => (
            <RevealItem key={col.title} className="meet__col">
              <div className="meet__col-head">
                <span className="mono meet__col-tag">
                  {String(i + 1).padStart(2, '0')} / {col.tag}
                </span>
                <h3 className="meet__col-title">{col.title}</h3>
              </div>
              <ul>
                {col.items.map((it) => (
                  <li key={it}>
                    <span className="meet__tick" aria-hidden="true" />
                    {it}
                  </li>
                ))}
              </ul>
            </RevealItem>
          ))}
        </Reveal>

        <Reveal className="callouts" amount={0.15}>
          {meet.callouts.map((c, i) => (
            <Callout key={c.title} c={c} i={i} />
          ))}
        </Reveal>
      </div>
    </section>
  );
}
