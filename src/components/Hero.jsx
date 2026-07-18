import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';
import FluidInk from './FluidInk';

const WORD = ['N', 'I', 'T', 'I', 'N', '’'];

const Hero = () => {

    const [showInstaPopup, setShowInstaPopup] = useState(false);
    const triggerPopup = (setter) => {
        setter(true);
        setTimeout(() => setter(false), 2500);
    };

    // Per-character hover: the h1 is pointer-events-none (so the fluid keeps
    // receiving the cursor), so hover is detected by hit-testing the mouse
    // against each letter's rect. A hovered letter fades out, letting the
    // liquid reveal the video's styled version of it underneath.
    const charRefs = useRef([]);
    const [hiddenChars, setHiddenChars] = useState(() => WORD.map(() => false));

    useEffect(() => {
        if (!window.matchMedia('(hover: hover)').matches) return;
        let raf = 0;
        const onMove = (e) => {
            if (raf) return;
            raf = requestAnimationFrame(() => {
                raf = 0;
                setHiddenChars((prev) => {
                    const next = charRefs.current.map((el) => {
                        if (!el) return false;
                        const r = el.getBoundingClientRect();
                        return e.clientX >= r.left && e.clientX <= r.right &&
                               e.clientY >= r.top && e.clientY <= r.bottom;
                    });
                    return next.some((v, i) => v !== prev[i]) ? next : prev;
                });
            });
        };
        window.addEventListener('mousemove', onMove);
        return () => {
            window.removeEventListener('mousemove', onMove);
            if (raf) cancelAnimationFrame(raf);
        };
    }, []);

    return (
        <section className="h-screen w-full relative flex flex-col justify-between overflow-hidden text-ink px-6 md:px-12 pt-6 md:pt-8 pb-6 md:pb-10">

            {/* Layer 0: solid black base — revealed by the liquid */}
            <div aria-hidden="true" className="absolute inset-0 z-0 bg-ink" />

            {/* Layer 2: the fluid canvas IS the white cover — its black liquid
                screen-blends into transparency, revealing the video below */}
            <FluidInk />

            {/* Top left — tagline + CTA (noth.in hero layout) */}
            <motion.div
                initial={{ opacity: 0, y: -12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="relative z-10"
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

            {/* Center — the giant wordmark */}
            <motion.h1
                initial={{ opacity: 0, y: 80 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: 0.15 }}
                className="relative z-10 pointer-events-none text-center font-black uppercase leading-[0.8] tracking-[-0.03em] text-[26vw] md:text-[28vw] select-none whitespace-nowrap"
            >
                {WORD.map((c, i) => (
                    <span
                        key={i}
                        ref={(el) => { charRefs.current[i] = el; }}
                        className="inline-block transition-opacity duration-300"
                        style={{ opacity: hiddenChars[i] ? 0 : 1 }}
                    >
                        {c}
                    </span>
                ))}
            </motion.h1>

            {/* Bottom bar — descriptor left, socials + CV badge right */}
            <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.6 }}
                className="relative z-10 flex flex-col md:flex-row md:items-end md:justify-between gap-4"
            >
                <p className="text-sm md:text-base font-medium flex items-center gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-go shrink-0" aria-hidden="true" />
                    Based in India, shipping worldwide
                </p>

                <div className="flex items-center flex-wrap gap-3 md:gap-5 text-xs font-bold uppercase tracking-[0.05em]">
                    <a href="https://www.linkedin.com/in/nitin-tanwar-535018303/" target="_blank" rel="noopener noreferrer"
                        className="hover:opacity-50 transition-opacity duration-300">LinkedIn</a>
                    <span aria-hidden="true" className="font-normal text-meta">/</span>
                    <a href="https://github.com/Nitin23123" target="_blank" rel="noopener noreferrer"
                        className="hover:opacity-50 transition-opacity duration-300">GitHub</a>
                    <span aria-hidden="true" className="font-normal text-meta">/</span>
                    <a href="#" onClick={(e) => { e.preventDefault(); triggerPopup(setShowInstaPopup); }}
                        className="hover:opacity-50 transition-opacity duration-300">Instagram</a>
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

            {/* Instagram popup gag */}
            <AnimatePresence>
                {showInstaPopup && (
                    <motion.div
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 12 }}
                        transition={{ type: 'spring', stiffness: 400, damping: 24 }}
                        className="absolute bottom-20 md:bottom-24 right-6 md:right-12 z-50 bg-ink text-paper font-mono text-xs rounded-md overflow-hidden max-w-[calc(100vw-4rem)]"
                    >
                        <div className="px-4 py-3 flex items-center gap-3">
                            <span>🙃</span>
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

export default Hero;
