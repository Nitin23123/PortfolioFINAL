import { Suspense, lazy, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DUR } from '../../motion/tokens';
import { settleIn } from '../../motion/variants';
import { useCapabilities } from '../../app/providers';
import Wordmark from './Wordmark';

/**
 * Scene 01 — "The Charged Page".
 *
 * An apparently blank white sheet: the tagline top-left, the giant
 * name center, status and exits along the baseline. The cursor is a
 * loaded pen — the lazily-loaded InkLayer pours black ink with real
 * physics. On devices that don't qualify (touch, reduced motion, no
 * WebGL2) a plain white cover renders and the scene is complete
 * without the simulation.
 */

// The GL world is its own chunk; touch users never download a byte of it.
const InkLayer = lazy(() => import('../../gl/InkLayer'));

const WhiteCover = () => (
    <div aria-hidden="true" className="absolute inset-0 bg-paper" />
);

const S01Hero = () => {
    const sectionRef = useRef(null);
    const { webgl2, coarsePointer, reducedMotion } = useCapabilities();
    const inkEnabled = webgl2 && !coarsePointer && !reducedMotion;

    const [showInstaPopup, setShowInstaPopup] = useState(false);
    const popupTimer = useRef(null);
    const triggerInstaPopup = () => {
        clearTimeout(popupTimer.current);
        setShowInstaPopup(true);
        popupTimer.current = setTimeout(() => setShowInstaPopup(false), 2500);
    };

    return (
        <section
            ref={sectionRef}
            className="h-screen w-full relative flex flex-col justify-between overflow-hidden bg-paper text-ink px-6 md:px-12 pt-6 md:pt-8 pb-6 md:pb-10"
        >
            {/* The ink surface — or the plain page where it can't run */}
            <div aria-hidden="true" className="absolute inset-0 z-0">
                {inkEnabled ? (
                    <Suspense fallback={<WhiteCover />}>
                        <InkLayer hostRef={sectionRef} />
                    </Suspense>
                ) : (
                    <WhiteCover />
                )}
            </div>

            {/* Top left — tagline + CTA */}
            <motion.div
                className="relative z-10"
                variants={settleIn(DUR.plate)}
                initial="hidden"
                animate="visible"
            >
                <p className="text-xl md:text-[1.8vw] font-semibold leading-[1.15] tracking-[-0.01em] pr-20 md:pr-0">
                    Not a style, a perspective.<br />
                    Because Nitin&rsquo; is Everythin&rsquo;.
                </p>
                <a
                    href="mailto:nitin23123@gmail.com"
                    className="group mt-6 inline-flex items-center gap-3 bg-ink text-paper rounded-pill px-6 py-3 font-mono text-xs uppercase tracking-[0.08em]"
                >
                    let&rsquo;s talk
                    <span aria-hidden="true" className="transition-transform duration-300 ease-out-expo group-hover:translate-x-1">→</span>
                </a>
            </motion.div>

            {/* Center — the name */}
            <Wordmark />

            {/* Baseline — descriptor left, socials + CV right */}
            <motion.div
                className="relative z-10 flex flex-col md:flex-row md:items-end md:justify-between gap-4"
                variants={settleIn(DUR.object, 0.6)}
                initial="hidden"
                animate="visible"
            >
                <p className="text-sm md:text-base font-medium flex items-center gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-go shrink-0" aria-hidden="true" />
                    Based in India, shipping worldwide
                </p>

                <div className="flex items-center flex-wrap gap-3 md:gap-5 text-xs font-bold uppercase tracking-[0.05em]">
                    <a
                        href="https://www.linkedin.com/in/nitin-tanwar-535018303/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:opacity-50 transition-opacity duration-300"
                    >
                        LinkedIn
                    </a>
                    <span aria-hidden="true" className="font-normal text-meta">/</span>
                    <a
                        href="https://github.com/Nitin23123"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:opacity-50 transition-opacity duration-300"
                    >
                        GitHub
                    </a>
                    <span aria-hidden="true" className="font-normal text-meta">/</span>
                    <a
                        href="#"
                        onClick={(e) => {
                            e.preventDefault();
                            triggerInstaPopup();
                        }}
                        className="hover:opacity-50 transition-opacity duration-300"
                    >
                        Instagram
                    </a>
                    <a
                        href="https://drive.google.com/file/d/1yHU8HvPrOW0-2AGfFsen8m5jeQWBJR0y/view"
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="Resume"
                        className="ml-1 md:ml-2 w-8 h-8 bg-ink text-paper flex items-center justify-center font-mono text-[10px] hover:bg-ink/80 transition-colors duration-300"
                    >
                        CV
                    </a>
                </div>
            </motion.div>

            {/* The one margin-note joke this scene is allowed */}
            <AnimatePresence>
                {showInstaPopup && (
                    <motion.div
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 12 }}
                        transition={{ duration: DUR.small }}
                        className="absolute bottom-20 md:bottom-24 right-6 md:right-12 z-50 bg-ink text-paper font-mono text-xs rounded-md overflow-hidden max-w-[calc(100vw-4rem)]"
                    >
                        <div className="px-4 py-3 flex items-center gap-3">
                            <span aria-hidden="true">🙃</span>
                            <span>sorry for being antisocial</span>
                        </div>
                        <motion.div
                            initial={{ scaleX: 1 }}
                            animate={{ scaleX: 0 }}
                            transition={{ duration: 2.5, ease: 'linear' }}
                            style={{ originX: 0 }}
                            className="h-px bg-paper/60 w-full"
                        />
                    </motion.div>
                )}
            </AnimatePresence>
        </section>
    );
};

export default S01Hero;
