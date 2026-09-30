import { motion } from 'framer-motion';

const EASE = [0.2, 0.7, 0.2, 1];

const parent = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
};

export const revealItem = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE } },
};

/** Wraps a group; direct <RevealItem> children rise + fade in with a 60ms stagger. */
export function Reveal({ as = 'div', children, className, amount = 0.2, ...rest }) {
  const Tag = motion[as];
  return (
    <Tag className={className} variants={parent} initial="hidden" whileInView="show" viewport={{ once: true, amount }} {...rest}>
      {children}
    </Tag>
  );
}

export function RevealItem({ as = 'div', children, className, ...rest }) {
  const Tag = motion[as];
  return (
    <Tag className={className} variants={revealItem} {...rest}>
      {children}
    </Tag>
  );
}
