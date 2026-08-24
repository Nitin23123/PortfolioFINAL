import { Suspense, lazy, useRef } from 'react';
import { motion } from 'framer-motion';
import { DUR } from '../../motion/tokens';
import { settleIn } from '../../motion/variants';
import { useCapabilities } from '../../app/providers';
import { experienceActions } from '../../state/experienceStore';
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

            {/* Top left — tagline */}
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
            </motion.div>

            {/* Center — the name + HUD button */}
            <div className="relative z-10 flex flex-col items-center justify-center my-auto">
                <Wordmark />
                <motion.button
                    variants={settleIn(DUR.object, 0.4)}
                    initial="hidden"
                    animate="visible"
                    onClick={experienceActions.toggleTerminal}
                    className="mt-3 sm:mt-5 md:mt-8 inline-flex items-center gap-2 sm:gap-2.5 px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-full bg-[#141413] hover:bg-[#1C1B1A] text-[#FAF9F5] border border-[#2E2D2B] hover:border-[#DA7756] shadow-[0_4px_20px_rgba(0,0,0,0.12)] transition-all duration-300 font-mono text-xs cursor-pointer group select-none"
                    aria-label="Open Developer HUD Terminal"
                >
                    <span className="w-2 h-2 rounded-full bg-[#DA7756] animate-pulse" />
                    <span className="font-semibold uppercase tracking-wider text-[11px] sm:text-xs text-[#FAF9F5] group-hover:text-white">
                        DEVELOPER HUD
                    </span>
                    <span className="text-[10px] text-[#9C9A92] group-hover:text-[#DA7756] bg-[#242321] px-1.5 py-0.5 rounded border border-[#33322E] transition-colors">
                        ⌘K
                    </span>
                </motion.button>
            </div>

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
        </section>
    );
};

export default S01Hero;
