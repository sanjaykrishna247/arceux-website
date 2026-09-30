import { footer, links, linkProps, nav } from '../content.js';
import { Logo } from './Nav.jsx';
import Icon from './ui/Icons.jsx';
import './sections.css';

/** `base` prefixes in-page anchors, e.g. "/" when the footer is used on /hardware. */
export default function Footer({ base = '' }) {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer__top">
          <div className="footer__brand">
            <Logo href={base ? base : '#top'} />
            <p>{footer.blurb}</p>
          </div>
          <nav className="footer__cols" aria-label="Footer">
            <div>
              <h2 className="mono">Explore</h2>
              <ul>
                {nav.map((n) => (
                  <li key={n.id}>
                    <a href={`${base}#${n.id}`}>{n.label}</a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h2 className="mono">Project</h2>
              <ul>
                <li>
                  <a href={`${base}#team`}>Team</a>
                </li>
                <li>
                  <a href="/hardware">Hardware part details</a>
                </li>
                <li>
                  <a {...linkProps(links.console)}>Platform{links.console.startsWith('http') ? ' ↗' : ''}</a>
                </li>
                {links.repo && (
                  <li>
                    <a {...linkProps(links.repo)}>GitHub ↗</a>
                  </li>
                )}
              </ul>
            </div>
            <div>
              <h2 className="mono">Contact</h2>
              <ul>
                <li>
                  <a href={`mailto:${links.email}`} className="footer__mail">
                    <Icon name="mail" size={18} />
                    {links.email}
                  </a>
                </li>
              </ul>
            </div>
          </nav>
        </div>
        <p className="footer__bottom mono">{footer.bottom}</p>
      </div>
    </footer>
  );
}
