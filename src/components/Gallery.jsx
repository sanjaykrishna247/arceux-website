import { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { gallery } from '../content.js';
import SectionLabel from './ui/SectionLabel.jsx';
import { Reveal, RevealItem } from './ui/Reveal.jsx';
import './sections.css';

function Shot({ item, onOpen, i }) {
  const [broken, setBroken] = useState(false);
  return (
    <li className="gal__item">
      <button type="button" className="gal__btn" onClick={() => !broken && onOpen(i)} aria-label={`Open ${item.caption} in full screen`} disabled={broken}>
        <span className="gal__frame">
          {broken ? (
            <span className="gal__missing mono">Add {item.src.replace('/robot/', '')} to public/robot/</span>
          ) : (
            <img src={item.src} alt={item.alt} loading="lazy" decoding="async" onError={() => setBroken(true)} />
          )}
        </span>
        <span className="gal__cap">
          <span className="mono">FIG 10.{i + 1}</span>
          {item.caption}
        </span>
      </button>
    </li>
  );
}

export default function Gallery() {
  const [open, setOpen] = useState(null);
  const strip = useRef(null);
  const closeBtn = useRef(null);
  const n = gallery.items.length;

  const close = useCallback(() => setOpen(null), []);
  const step = useCallback((d) => setOpen((o) => (o === null ? o : (o + d + n) % n)), [n]);

  useEffect(() => {
    if (open === null) return;
    const onKey = (e) => {
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowRight') step(1);
      if (e.key === 'ArrowLeft') step(-1);
    };
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    closeBtn.current?.focus();
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open, close, step]);

  const scrollBy = (d) => strip.current?.scrollBy({ left: d * strip.current.clientWidth * 0.8, behavior: 'smooth' });

  return (
    <section className="section section--paper" id="gallery" aria-labelledby="gal-title">
      <div className="container">
        <Reveal className="section-head gal__head">
          <RevealItem>
            <SectionLabel index={gallery.index}>{gallery.label}</SectionLabel>
            <h2 id="gal-title" className="h2">
              {gallery.title}
            </h2>
          </RevealItem>
          <RevealItem className="gal__nav">
            <button type="button" className="btn btn--ghost btn--sm" onClick={() => scrollBy(-1)} aria-label="Scroll gallery left">
              ←
            </button>
            <button type="button" className="btn btn--ghost btn--sm" onClick={() => scrollBy(1)} aria-label="Scroll gallery right">
              →
            </button>
          </RevealItem>
        </Reveal>
      </div>
      <ul className="gal" ref={strip}>
        {gallery.items.map((it, i) => (
          <Shot key={it.src} item={it} i={i} onOpen={setOpen} />
        ))}
      </ul>

      <AnimatePresence>
        {open !== null && (
          <motion.div
            className="lightbox"
            role="dialog"
            aria-modal="true"
            aria-label={gallery.items[open].caption}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={close}
          >
            <motion.figure
              key={open}
              className="lightbox__fig"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: [0.2, 0.7, 0.2, 1] }}
              onClick={(e) => e.stopPropagation()}
            >
              <img src={gallery.items[open].src} alt={gallery.items[open].alt} />
              <figcaption className="mono">
                {String(open + 1).padStart(2, '0')} / {String(n).padStart(2, '0')} · {gallery.items[open].caption}
              </figcaption>
            </motion.figure>
            <div className="lightbox__ctl" onClick={(e) => e.stopPropagation()}>
              <button type="button" className="btn btn--ghost btn--sm" onClick={() => step(-1)} aria-label="Previous image">
                ←
              </button>
              <button type="button" className="btn btn--ghost btn--sm" onClick={() => step(1)} aria-label="Next image">
                →
              </button>
              <button type="button" ref={closeBtn} className="btn btn--primary btn--sm" onClick={close}>
                Close
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
