import { motion, useReducedMotion } from 'framer-motion';
import { SITE } from '../../content/site';

/**
 * Wordmark — the giant NITIN', solid black with pure borderless white hover effect.
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
        'relative z-10 pointer-events-auto text-center font-black uppercase ' +
        'leading-[0.8] tracking-[-0.03em] text-[26vw] md:text-[28vw] select-none whitespace-nowrap ' +
        'text-black overflow-hidden cursor-pointer';

    if (reducedMotion) {
        return (
            <h1 className={className}>
                {SITE.wordmark.map((char, i) => (
                    <span
                        key={`${char}-${i}`}
                        className="inline-block text-black transition-colors duration-300 hover:text-white"
                    >
                        {char}
                    </span>
                ))}
            </h1>
        );
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
                    <motion.span
                        variants={letterVariant}
                        className="inline-block text-black transition-colors duration-300 hover:text-white"
                    >
                        {char}
                    </motion.span>
                </span>
            ))}
        </motion.h1>
    );
};

export default Wordmark;
