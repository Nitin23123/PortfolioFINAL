import { motion, useReducedMotion } from 'framer-motion';
import { SITE } from '../../content/site';

/**
 * Wordmark — the giant NITIN', always solid, always readable.
 *
 * The name is white type under mix-blend-difference: over the paper
 * it renders black; wherever the ink flows across it, the covered
 * part flips to white and cuts through the liquid. The letters never
 * fade, hollow, or hide — the inversion is pure compositing, the
 * same trick the MENU toggle uses at scene seams. No hover logic,
 * no listeners, no per-frame work.
 *
 * Entrance: the letters rise one by one from behind a masked
 * baseline — the staggered reveal that answers the loader's drain.
 *
 * pointer-events-none keeps the cursor pouring ink straight through
 * the letterforms.
 */

const letterContainer = {
    hidden: {},
    visible: {
        transition: {
            staggerChildren: 0.07,
            delayChildren: 0.2,
        },
    },
};

const letterVariant = {
    hidden: {
        y: '105%',
        opacity: 0,
    },
    visible: {
        y: '0%',
        opacity: 1,
        transition: {
            duration: 0.95,
            ease: [0.22, 1, 0.36, 1],
        },
    },
};

const Wordmark = () => {
    const reducedMotion = useReducedMotion();

    const className =
        'relative z-10 pointer-events-none text-center font-black uppercase ' +
        'leading-[0.8] tracking-[-0.03em] text-[26vw] md:text-[28vw] select-none whitespace-nowrap ' +
        'text-paper mix-blend-difference overflow-hidden';

    if (reducedMotion) {
        return <h1 className={className}>{SITE.wordmark.join('')}</h1>;
    }

    return (
        <motion.h1
            className={className}
            variants={letterContainer}
            initial="hidden"
            animate="visible"
        >
            {SITE.wordmark.map((char, i) => (
                <span
                    key={`${char}-${i}`}
                    className="inline-block overflow-hidden align-bottom"
                >
                    <motion.span variants={letterVariant} className="inline-block">
                        {char}
                    </motion.span>
                </span>
            ))}
        </motion.h1>
    );
};

export default Wordmark;
