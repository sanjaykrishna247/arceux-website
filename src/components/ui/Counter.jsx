import { useEffect, useRef } from 'react';
import { animate, useInView, useReducedMotion } from 'framer-motion';

/** Counts up to `value` the first time it scrolls into view. Tabular figures keep digits still. */
export default function Counter({ value, decimals = 0, duration = 1.6, prefix = '', className }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const reduce = useReducedMotion();
  const fmt = (v) => prefix + v.toLocaleString('en-IN', { minimumFractionDigits: decimals, maximumFractionDigits: decimals });

  useEffect(() => {
    const el = ref.current;
    if (!el || !inView) return;
    if (reduce) {
      el.textContent = fmt(value);
      return;
    }
    const c = animate(0, value, {
      duration,
      ease: [0.2, 0.7, 0.2, 1],
      onUpdate: (v) => (el.textContent = fmt(v)),
    });
    return () => c.stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView, value]);

  return (
    <span ref={ref} className={`tnum ${className || ''}`}>
      {fmt(reduce ? value : 0)}
    </span>
  );
}
