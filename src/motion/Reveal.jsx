import { motion, useReducedMotion } from 'framer-motion';
import { DUR, REVEAL_AT } from './tokens';
import { settleIn } from './variants';

/**
 * Reveal — the "Once law" as infrastructure.
 *
 * Wraps content in the standard placed-object entrance, triggered a
 * single time at 20% viewport visibility. Never replays on re-scroll:
 * narrative reveals that loop turn story into screensaver.
 *
 * Under prefers-reduced-motion the content renders in place with no
 * travel — the story survives in stillness.
 *
 * @param {object} props
 * @param {import('react').ElementType} [props.as] motion element tag
 * @param {number} [props.duration] one of the DUR values
 * @param {number} [props.delay] seconds
 * @param {string} [props.className]
 * @param {import('react').ReactNode} props.children
 */
const Reveal = ({ as = 'div', duration = DUR.object, delay = 0, className, children, ...rest }) => {
    const reducedMotion = useReducedMotion();
    const Tag = motion[as] ?? motion.div;

    if (reducedMotion) {
        const Static = as;
        return <Static className={className} {...rest}>{children}</Static>;
    }

    return (
        <Tag
            className={className}
            variants={settleIn(duration, delay)}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: REVEAL_AT }}
            {...rest}
        >
            {children}
        </Tag>
    );
};

export default Reveal;
