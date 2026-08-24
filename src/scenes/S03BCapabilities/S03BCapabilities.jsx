import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import PlateIndex from '../../components/ui/PlateIndex';
import Reveal from '../../motion/Reveal';
import { DUR, STAGGER } from '../../motion/tokens';
import { CAPABILITIES, CAPABILITIES_STATEMENT } from '../../content/capabilities';

/**
 * Scene 03B / Plate 03 — "Capabilities & Architecture".
 *
 * Full engineering matrix: Languages, Frontend, Backend, Infra,
 * System Design distributed patterns, Security Hardening, and Testing.
 * High-density machine ledger with interactive domain spotlighting.
 */

const FILTER_TABS = [
    { id: 'all', label: 'All Disciplines' },
    { id: 'core', label: 'Core Stack' },
    { id: 'architecture', label: 'System Design' },
    { id: 'security', label: 'Hardening & QA' },
];

const S03BCapabilities = () => {
    const [activeFilter, setActiveFilter] = useState('all');
    const [hoveredItem, setHoveredItem] = useState(null);

    const filteredCapabilities = CAPABILITIES.filter((cap) => {
        if (activeFilter === 'all') return true;
        if (activeFilter === 'core') return ['languages', 'frontend', 'backend', 'infra'].includes(cap.id);
        if (activeFilter === 'architecture') return cap.id === 'system-design';
        if (activeFilter === 'security') return ['hardening', 'testing-tools'].includes(cap.id);
        return true;
    });

    return (
        <section
            id="capabilities"
            className="bg-ink text-paper py-24 md:py-40 relative z-10 [content-visibility:auto] [contain-intrinsic-size:auto_1400px]"
        >
            <div className="max-w-[1920px] mx-auto px-6 md:px-12">
                <PlateIndex id="capabilities" note="Engineering matrix & architecture" dark />

                {/* Section Header */}
                <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-8 md:gap-16 items-end mb-14 md:mb-20">
                    <Reveal as="div" duration={DUR.plate}>
                        <h2 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-display uppercase leading-[0.95] text-balance">
                            Hardened for production.<br />
                            <span className="text-paper/60">Engineered to scale.</span>
                        </h2>
                    </Reveal>

                    <Reveal as="div" delay={0.15} duration={DUR.plate} className="flex flex-col gap-6">
                        <p className="text-paper/75 text-base md:text-lg leading-relaxed max-w-[55ch]">
                            {CAPABILITIES_STATEMENT}
                        </p>

                        {/* Interactive Filter Pills */}
                        <div className="flex flex-wrap items-center gap-2 pt-2">
                            {FILTER_TABS.map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveFilter(tab.id)}
                                    className={`font-mono text-xs uppercase tracking-[0.06em] px-4 py-2 rounded-pill transition-all duration-300 ${
                                        activeFilter === tab.id
                                            ? 'bg-paper text-ink font-semibold'
                                            : 'bg-white/5 text-paper/70 hover:text-paper hover:bg-white/10 border border-white/10'
                                    }`}
                                >
                                    {tab.label}
                                </button>
                            ))}
                        </div>
                    </Reveal>
                </div>

                {/* Capabilities Ledger / Grid */}
                <div className="flex flex-col border-t border-white/15">
                    <AnimatePresence mode="popLayout">
                        {filteredCapabilities.map((group, idx) => (
                            <motion.div
                                key={group.id}
                                layout
                                initial={{ opacity: 0, y: 15 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.35, delay: idx * 0.05 }}
                                className={`border-b border-white/15 py-6 sm:py-8 md:py-12 transition-colors duration-300 ${
                                    group.isArchitecture ? 'bg-white/[0.02] -mx-2 px-2 sm:-mx-6 sm:px-6 md:-mx-8 md:px-8 rounded-lg my-2 border border-white/20' : ''
                                }`}
                            >
                                <div className="grid grid-cols-1 lg:grid-cols-[14rem_1fr] gap-3 sm:gap-4 lg:gap-12 items-start">
                                    {/* Left: Code & Category */}
                                    <div>
                                        <div className="flex items-center gap-2.5">
                                            <span className="font-mono text-xs text-meta-dark">
                                                ( {group.code} )
                                            </span>
                                            {group.isSecurity && (
                                                <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-go/10 text-go border border-go/30 font-mono text-[9px] sm:text-[10px] uppercase tracking-wider">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-go animate-pulse" />
                                                    Defensive
                                                </span>
                                            )}
                                            {group.isArchitecture && (
                                                <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-paper/10 text-paper/90 border border-white/20 font-mono text-[9px] sm:text-[10px] uppercase tracking-wider">
                                                    Systems Core
                                                </span>
                                            )}
                                        </div>
                                        <h3 className="text-lg sm:text-xl md:text-2xl font-bold tracking-display uppercase text-paper mt-1.5">
                                            {group.category}
                                        </h3>
                                        <p className="font-mono text-xs text-paper/50 mt-1 hidden lg:block">
                                            {group.tagline}
                                        </p>
                                    </div>

                                    {/* Right: Items / Badges */}
                                    <div className="flex flex-wrap gap-2 sm:gap-2.5 md:gap-3 items-center">
                                        {group.items.map((item) => {
                                            const isHovered = hoveredItem === item;
                                            return (
                                                <span
                                                    key={item}
                                                    onMouseEnter={() => setHoveredItem(item)}
                                                    onMouseLeave={() => setHoveredItem(null)}
                                                    className={`group relative inline-flex items-center gap-1.5 sm:gap-2 rounded-md font-mono text-[11px] sm:text-xs md:text-sm px-2.5 sm:px-3.5 py-1.5 sm:py-2 transition-all duration-200 cursor-default ${
                                                        group.isArchitecture
                                                            ? 'bg-white/10 hover:bg-white text-paper hover:text-ink border border-white/20'
                                                            : group.isSecurity
                                                            ? 'bg-white/5 hover:bg-paper hover:text-ink text-paper/90 border border-white/10 hover:border-white'
                                                            : 'bg-white/5 hover:bg-paper hover:text-ink text-paper/90 border border-white/10 hover:border-white'
                                                    }`}
                                                >
                                                    <span className="w-1 h-1 rounded-full bg-paper/40 group-hover:bg-ink transition-colors" />
                                                    <span className="tracking-wide">{item}</span>
                                                </span>
                                            );
                                        })}
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>

                {/* Ledger Footnote / System Verification */}
                <Reveal as="div" className="mt-12 md:mt-16 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 font-mono text-xs text-meta-dark">
                    <div className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-go" aria-hidden="true" />
                        <span>07 / 07 disciplines verified in active production environments</span>
                    </div>
                    <span>ISO / REST / ACID / OWASP compliant patterns</span>
                </Reveal>
            </div>
        </section>
    );
};

export default S03BCapabilities;
