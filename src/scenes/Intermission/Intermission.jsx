
import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DUR, SETTLE, STAGGER } from '../../motion/tokens';
import { SCENES } from '../registry';
import { SITE } from '../../content/site';
import { useExperience, experienceActions } from '../../state/experienceStore';
import { useSceneScroll } from '../../app/providers';
import NpxCardWidget from '../../components/NpxCardWidget';

/**
 * The Intermission — the film's index, reachable from every frame.
 *
 * A fixed MENU toggle (blend-difference, so it inverts over every
 * seam) drops an ink slate listing the scenes as numbered plates.
 * Clicking a row cuts straight to that scene. While the slate is
 * down, the ink simulation parks itself (it reads menuOpen).
 */

const rowVariants = {
    hidden: { opacity: 0, y: 24 },
    visible: { opacity: 1, y: 0, transition: { duration: DUR.small, ease: SETTLE } },
    exit: { opacity: 0, y: 12, transition: { duration: DUR.micro } },
};

const Intermission = () => {
    const menuOpen = useExperience((s) => s.menuOpen);
    const terminalOpen = useExperience((s) => s.terminalOpen);
    const activeScene = useExperience((s) => s.activeScene);
    const { scrollTo } = useSceneScroll();

    const handleNavClick = (id) => {
        experienceActions.closeMenu();
        // Let the slate lift before the cut lands.
        setTimeout(() => scrollTo(`#${id}`), 300);
    };

    // The one keyboard shortcut utility owes: Escape closes.
    useEffect(() => {
        if (!menuOpen) return undefined;
        const onKey = (e) => {
            if (e.key === 'Escape') experienceActions.closeMenu();
        };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, [menuOpen]);

    return (
        <>
            {/* Fixed top bar — outside the story, always in reach */}
            <nav className="fixed inset-x-0 top-0 z-50 pointer-events-none mix-blend-difference text-paper">
                <div className="max-w-[1920px] mx-auto px-4 py-5 sm:px-6 sm:py-6 md:px-12 md:py-8 flex items-center justify-end">
                    <button
                        onClick={experienceActions.toggleMenu}
                        className="pointer-events-auto font-mono text-[11px] sm:text-xs font-bold uppercase tracking-[0.06em] sm:tracking-[0.08em] flex items-center gap-1.5 sm:gap-2 hover:opacity-70 transition-opacity"
                        aria-label="Toggle menu"
                        aria-expanded={menuOpen}
                    >
                        {menuOpen ? 'close' : 'menu'}
                        <span aria-hidden="true" className="text-xs sm:text-sm leading-none">
                            {menuOpen ? '✕' : '∷'}
                        </span>
                    </button>
                </div>
            </nav>

            {/* The slate */}
            <AnimatePresence>
                {menuOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1, transition: { duration: DUR.small } }}
                        exit={{ opacity: 0, transition: { duration: DUR.micro } }}
                        className="fixed inset-0 z-40 bg-ink text-paper flex flex-col justify-between px-6 md:px-12 pt-28 pb-8 md:pb-10"
                        onClick={experienceActions.closeMenu}
                    >
                        <motion.div
                            className="flex flex-col gap-1 md:gap-2"
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                            variants={{ visible: { transition: { staggerChildren: STAGGER.drumroll } } }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            {SCENES.filter((s) => s.menu).map((scene) => (
                                <motion.button
                                    key={scene.id}
                                    variants={rowVariants}
                                    onClick={() => handleNavClick(scene.id)}
                                    aria-current={activeScene === scene.id ? 'true' : undefined}
                                    className="group flex items-baseline gap-4 md:gap-8 text-left py-1.5 md:py-2"
                                >
                                    <span className="font-mono text-[10px] md:text-xs text-meta-dark">
                                        ( {scene.plate} )
                                    </span>
                                    <span className="text-4xl md:text-7xl font-bold tracking-display uppercase leading-none group-hover:opacity-50 transition-opacity duration-300">
                                        {scene.title}
                                    </span>
                                    {activeScene === scene.id && (
                                        <span
                                            aria-hidden="true"
                                            className="w-1.5 h-1.5 rounded-full bg-go self-center shrink-0"
                                        />
                                    )}
                                    {/* what's inside — the reason to click */}
                                    <span className="label-dark hidden md:inline">
                                        ( {scene.hint} )
                                    </span>
                                </motion.button>
                            ))}
                        </motion.div>

                        {/* Direct lines — every exit a visitor might want, one tap away */}
                        <div className="flex flex-col gap-6" onClick={(e) => e.stopPropagation()}>
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                <NpxCardWidget />
                                <span className="label-dark flex items-center gap-2">
                                    <span className="w-1.5 h-1.5 rounded-full bg-go" aria-hidden="true" />
                                    {SITE.availability}
                                </span>
                            </div>

                            <div className="border-t border-white/15 pt-6 flex flex-wrap items-center gap-x-8 gap-y-3">
                                <a href={`mailto:${SITE.email}`}
                                    className="label-dark hover:text-paper transition-colors duration-300 py-1">
                                    Email
                                </a>
                                <a href={SITE.links.linkedin} target="_blank" rel="noopener noreferrer"
                                    className="label-dark hover:text-paper transition-colors duration-300 py-1">
                                    LinkedIn
                                </a>
                                <a href={SITE.links.github} target="_blank" rel="noopener noreferrer"
                                    className="label-dark hover:text-paper transition-colors duration-300 py-1">
                                    GitHub
                                </a>
                                <a href={SITE.links.resume} target="_blank" rel="noopener noreferrer"
                                    className="label-dark hover:text-paper transition-colors duration-300 py-1">
                                    Resume ↓
                                </a>
                                <button
                                    onClick={() => {
                                        experienceActions.closeMenu();
                                        setTimeout(() => experienceActions.openTerminal(), 250);
                                    }}
                                    className="label-dark hover:text-paper transition-colors duration-300 py-1 flex items-center gap-1.5 text-[#DA7756]"
                                >
                                    <span className="w-1.5 h-1.5 rounded-full bg-[#DA7756]" />
                                    Terminal HUD ( ⌘K )
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default Intermission;
