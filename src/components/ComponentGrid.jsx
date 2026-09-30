import { hardware } from '../content.js';
import Icon from './ui/Icons.jsx';
import { Reveal, RevealItem } from './ui/Reveal.jsx';
import './ComponentGrid.css';

export default function ComponentGrid() {
  return (
    <div className="section section--dark cgrid">
      <div className="container">
        <Reveal className="cgrid__head">
          <RevealItem as="h3" className="cgrid__title">
            Bill of components
          </RevealItem>
          <RevealItem as="p" className="mono cgrid__meta">
            10 core parts · off-the-shelf
          </RevealItem>
        </Reveal>
        <Reveal as="ul" className="cgrid__list" amount={0.1}>
          {hardware.components.map((c, i) => (
            <RevealItem as="li" key={c.name} className="cgrid__item">
              <div className="cgrid__top">
                <Icon name={c.icon} size={28} className="cgrid__icon" />
                <span className="mono cgrid__n">{String(i + 1).padStart(2, '0')}</span>
              </div>
              <h4 className="cgrid__name">{c.name}</h4>
              <p className="mono cgrid__spec">{c.spec}</p>
              <p className="cgrid__role">{c.role}</p>
            </RevealItem>
          ))}
        </Reveal>
      </div>
    </div>
  );
}
