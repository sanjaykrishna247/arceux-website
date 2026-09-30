import { useEffect, useState } from 'react';
import { nav, links, linkProps } from '../content.js';
import './Nav.css';

export function Logo() {
  return (
    <a href="#top" className="logo" aria-label="ARCEUX home">
      <svg viewBox="0 0 28 28" width="28" height="28" aria-hidden="true">
        <rect x="1" y="1" width="26" height="26" rx="7" fill="currentColor" />
        <rect x="6" y="14" width="16" height="5" rx="1.5" fill="var(--bg)" />
        <rect x="7.5" y="9" width="9" height="5" rx="1" fill="#2f7fd6" />
        <circle cx="20" cy="9.5" r="2.2" fill="#e8622c" />
      </svg>
      <span>ARCEUX</span>
    </a>
  );
}

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState('');
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const els = nav.map((n) => document.getElementById(n.id)).filter(Boolean);
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => e.isIntersecting && setActive(e.target.id));
      },
      { rootMargin: '-45% 0px -50% 0px' }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
  }, [open]);

  return (
    <header className={`nav ${scrolled ? 'nav--scrolled' : ''} ${open ? 'nav--open' : ''}`}>
      <div className="nav__pill">
        <Logo />
        <nav aria-label="Primary" className="nav__links">
          <ul>
            {nav.map((n) => (
              <li key={n.id}>
                <a href={`#${n.id}`} className={active === n.id ? 'is-active' : ''} aria-current={active === n.id ? 'true' : undefined} onClick={() => setOpen(false)}>
                  {n.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <a className="btn btn--primary btn--sm nav__cta" {...linkProps(links.console)}>
          Platform
        </a>
        <button className="nav__toggle" aria-expanded={open} aria-controls="mobile-menu" onClick={() => setOpen((o) => !o)}>
          <span className="visually-hidden">{open ? 'Close menu' : 'Open menu'}</span>
          <span aria-hidden="true" />
          <span aria-hidden="true" />
        </button>
      </div>
      <div id="mobile-menu" className="nav__sheet" hidden={!open}>
        <ul>
          {nav.map((n, i) => (
            <li key={n.id}>
              <a href={`#${n.id}`} onClick={() => setOpen(false)}>
                <span className="mono">{String(i + 1).padStart(2, '0')}</span>
                {n.label}
              </a>
            </li>
          ))}
        </ul>
        <a className="btn btn--accent" {...linkProps(links.console)}>
          Open the platform <span className="btn__arrow">↗</span>
        </a>
      </div>
    </header>
  );
}
