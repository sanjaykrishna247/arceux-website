import { why } from '../content.js';
import SectionLabel from './ui/SectionLabel.jsx';
import { Reveal, RevealItem } from './ui/Reveal.jsx';
import './sections.css';

export default function WhyItMatters() {
  return (
    <section className="section" id="why" aria-labelledby="why-title">
      <div className="container">
        <Reveal className="section-head">
          <RevealItem>
            <SectionLabel index={why.index}>{why.label}</SectionLabel>
            <h2 id="why-title" className="h2">
              {why.title}
            </h2>
          </RevealItem>
        </Reveal>
        <Reveal as="ol" className="why" amount={0.1}>
          {why.cards.map((c, i) => (
            <RevealItem as="li" key={c.title} className="why__card">
              <span className="why__n mono">{String(i + 1).padStart(2, '0')}</span>
              <h3 className="why__t">{c.title}</h3>
              <p className="muted">{c.body}</p>
            </RevealItem>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
