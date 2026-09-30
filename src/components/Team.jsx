import { team } from '../content.js';
import Icon from './ui/Icons.jsx';
import SectionLabel from './ui/SectionLabel.jsx';
import { Reveal, RevealItem } from './ui/Reveal.jsx';
import './sections.css';

const initials = (name) =>
  name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase();

export default function Team() {
  return (
    <section className="section section--paper" id="team" aria-labelledby="team-title">
      <div className="container">
        <Reveal className="section-head section-head--split">
          <RevealItem>
            <SectionLabel index={team.index}>{team.label}</SectionLabel>
            <h2 id="team-title" className="h2">
              {team.title}
            </h2>
          </RevealItem>
          <RevealItem as="p" className="lead">
            {team.lead}
          </RevealItem>
        </Reveal>
        <Reveal as="ul" className="team" amount={0.1}>
          {team.members.map((m, i) => (
            <RevealItem as="li" key={m.name} className="member">
              <div className="member__top">
                <div className="member__avatar" aria-hidden={!m.photo}>
                  {m.photo ? <img src={m.photo} alt={`Portrait of ${m.name}`} loading="lazy" /> : <span>{initials(m.name)}</span>}
                </div>
                <span className="mono member__n">{String(i + 1).padStart(2, '0')}</span>
              </div>
              <h3 className="member__name">{m.name}</h3>
              <p className="member__role">{m.role}</p>
              <p className="member__line muted">{m.line}</p>
              {(m.linkedin || m.github) && (
                <div className="member__links">
                  {m.linkedin && (
                    <a href={m.linkedin} target="_blank" rel="noreferrer" aria-label={`${m.name} on LinkedIn`}>
                      <Icon name="linkedin" size={20} />
                    </a>
                  )}
                  {m.github && (
                    <a href={m.github} target="_blank" rel="noreferrer" aria-label={`${m.name} on GitHub`}>
                      <Icon name="github" size={20} />
                    </a>
                  )}
                </div>
              )}
            </RevealItem>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
