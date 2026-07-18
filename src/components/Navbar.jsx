import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';

const Navbar = () => {
    const [menuOpen, setMenuOpen] = useState(false);

    const links = [
        { name: 'ABOUT', id: 'about' },
        { name: 'EXPERIENCE', id: 'experience' },
        { name: 'WORKS', id: 'projects' },
        { name: 'STACK', id: 'tech-stack' },
        { name: 'CONTACT', id: 'contact' }
    ];

    const handleNavClick = (id) => {
        setMenuOpen(false);
        setTimeout(() => {
            document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
        }, 300);
    };

    return (
        <>
            {/* Fixed header — just the MENU toggle, inverts over dark sections */}
            <nav className="fixed inset-x-0 top-0 z-50 pointer-events-none mix-blend-difference text-paper">
                <div className="max-w-[1920px] mx-auto px-6 py-6 md:px-12 md:py-8 flex justify-end">
                    <button
                        onClick={() => setMenuOpen(!menuOpen)}
                        className="pointer-events-auto font-mono text-xs font-bold uppercase tracking-[0.08em] flex items-center gap-2"
                        aria-label="Toggle menu"
                        aria-expanded={menuOpen}
                    >
                        {menuOpen ? 'close' : 'menu'}
                        <span aria-hidden="true" className="text-sm leading-none">{menuOpen ? '✕' : '∷'}</span>
                    </button>
                </div>
            </nav>

            {/* Full-screen menu overlay — all breakpoints */}
            <AnimatePresence>
                {menuOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="fixed inset-0 z-40 bg-ink text-paper flex flex-col justify-between px-6 md:px-12 pt-28 pb-8 md:pb-10"
                        onClick={() => setMenuOpen(false)}
                    >
                        <div className="flex flex-col gap-1 md:gap-2" onClick={e => e.stopPropagation()}>
                            {links.map((item, index) => (
                                <motion.button
                                    key={item.id}
                                    initial={{ opacity: 0, y: 24 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: 12 }}
                                    transition={{ delay: index * 0.06, duration: 0.3 }}
                                    onClick={() => handleNavClick(item.id)}
                                    className="group flex items-baseline gap-4 md:gap-8 text-left py-1.5 md:py-2"
                                >
                                    <span className="font-mono text-[10px] md:text-xs text-meta-dark">( 0{index + 1} )</span>
                                    <span className="text-4xl md:text-7xl font-bold tracking-display uppercase leading-none group-hover:opacity-50 transition-opacity duration-300">
                                        {item.name}
                                    </span>
                                </motion.button>
                            ))}
                        </div>

                        <div className="label-dark flex items-center justify-between gap-4">
                            <span>Because Nitin&rsquo; is Everythin&rsquo;</span>
                            <span className="flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-go" aria-hidden="true" />
                                available for work
                            </span>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default Navbar;
