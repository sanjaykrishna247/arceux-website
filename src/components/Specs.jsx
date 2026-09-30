import { specs } from '../content.js';
import SectionLabel from './ui/SectionLabel.jsx';
import { Reveal, RevealItem } from './ui/Reveal.jsx';
import './sections.css';

export default function Specs() {
  const half = Math.ceil(specs.rows.length / 2);
  const cols = [specs.rows.slice(0, half), specs.rows.slice(half)];
  return (
    <section className="section section--paper" id="specs" aria-labelledby="specs-title">
      <div className="container">
        <Reveal className="section-head">
          <RevealItem>
            <SectionLabel index={specs.index}>{specs.label}</SectionLabel>
            <h2 id="specs-title" className="h2">
              {specs.title}
            </h2>
          </RevealItem>
        </Reveal>
        <div className="sheet">
          <div className="sheet__titleblock mono" aria-hidden="true">
            <span>DWG · ARCEUX-01</span>
            <span>REV C</span>
            <span>SCALE 1:10</span>
            <span>UNITS SI</span>
          </div>
          <Reveal className="sheet__cols" amount={0.1}>
            {cols.map((col, c) => (
              <dl key={c} className="sheet__col">
                {col.map(([k, v], i) => (
                  <RevealItem key={k} className="sheet__row">
                    <dt>
                      <span className="mono sheet__ref">{String(c * half + i + 1).padStart(2, '0')}</span>
                      {k}
                    </dt>
                    <dd className="mono">{v}</dd>
                  </RevealItem>
                ))}
              </dl>
            ))}
          </Reveal>
        </div>
      </div>
    </section>
  );
}
