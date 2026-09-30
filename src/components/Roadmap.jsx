import { roadmap } from '../content.js';
import SectionLabel from './ui/SectionLabel.jsx';
import { Reveal, RevealItem } from './ui/Reveal.jsx';
import './sections.css';

export default function Roadmap() {
  return (
    <section className="section" id="roadmap" aria-labelledby="road-title">
      <div className="container">
        <Reveal className="section-head">
          <RevealItem>
            <SectionLabel index={roadmap.index}>{roadmap.label}</SectionLabel>
            <h2 id="road-title" className="h2">
              {roadmap.title}
            </h2>
          </RevealItem>
        </Reveal>
        <Reveal as="ol" className="road" amount={0.15}>
          <li className="road__now" aria-hidden="true">
            <span className="mono">NOW · PROTOTYPE</span>
          </li>
          {roadmap.items.map((r, i) => (
            <RevealItem as="li" key={r.title} className="road__item">
              <span className="road__node" aria-hidden="true" />
              <span className="mono road__phase">PHASE {String(i + 1).padStart(2, '0')}</span>
              <h3 className="road__t">{r.title}</h3>
              <p className="muted">{r.body}</p>
            </RevealItem>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
