import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SITE } from '../content/site';

/**
 * NpxCardWidget — An elite, tactile Developer Pass & NPX CLI Badge.
 *
 * Designed with Claude-inspired warm obsidian tones, precision monospaced
 * grid, interactive 1-click copy, and an architectural developer pass popover.
 */
const NpxCardWidget = ({ className = '' }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [copied, setCopied] = useState(false);
    const timeoutRef = useRef(null);

    const handleCopy = (e) => {
        e?.stopPropagation?.();
        navigator.clipboard?.writeText('npx nitin-tanwar').then(() => {
            setCopied(true);
            clearTimeout(timeoutRef.current);
            timeoutRef.current = setTimeout(() => setCopied(false), 2400);
        });
    };

    return (
        <div className={`relative inline-flex items-center ${className}`}>
            {/* The Tactile Pill Trigger */}
            <div className="group relative inline-flex items-center rounded-full p-[1px] bg-gradient-to-r from-black/20 via-black/10 to-black/20 dark:from-white/20 dark:via-[#DA7756]/40 dark:to-white/20 shadow-sm transition-all duration-300 hover:shadow-md">
                <div className="flex items-center bg-[#141413] text-[#FAF9F5] rounded-full px-1.5 py-1 text-xs font-mono">
                    {/* Copy NPX command trigger */}
                    <button
                        onClick={handleCopy}
                        className="flex items-center gap-2 px-3 py-1 rounded-full hover:bg-white/10 transition-all text-[11px] md:text-xs tracking-tight"
                        title="Click to copy npx command"
                    >
                        <span className="text-[#DA7756] font-bold select-none">$</span>
                        <span className="font-medium text-[#ECEAE5] group-hover:text-white transition-colors">
                            npx nitin-tanwar
                        </span>
                        <motion.span
                            key={copied ? 'copied' : 'idle'}
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className={`text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded-full ${
                                copied
                                    ? 'bg-[#DA7756] text-[#141413]'
                                    : 'bg-white/10 text-[#9C9A92] group-hover:text-white'
                            }`}
                        >
                            {copied ? 'copied ✓' : 'copy'}
                        </motion.span>
                    </button>

                    {/* Divider */}
                    <span className="w-px h-3.5 bg-[#2E2D2B] mx-0.5" aria-hidden="true" />

                    {/* View Card Popover Toggle */}
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className={`px-2.5 py-1 rounded-full text-[10px] uppercase tracking-wider font-semibold transition-all flex items-center gap-1 ${
                            isOpen
                                ? 'bg-[#DA7756] text-[#141413]'
                                : 'text-[#9C9A92] hover:text-[#FAF9F5] hover:bg-white/10'
                        }`}
                        aria-label="Toggle developer card preview"
                        aria-expanded={isOpen}
                    >
                        <span>pass</span>
                        <span className="text-[8px] transition-transform duration-200" style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}>
                            ▼
                        </span>
                    </button>
                </div>
            </div>

            {/* Architectural Developer Pass Popover */}
            <AnimatePresence>
                {isOpen && (
                    <>
                        {/* Tap outside backdrop */}
                        <div
                            className="fixed inset-0 z-40"
                            onClick={() => setIsOpen(false)}
                        />

                        <motion.div
                            initial={{ opacity: 0, y: 12, scale: 0.94 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 12, scale: 0.94 }}
                            transition={{ type: 'spring', damping: 24, stiffness: 320 }}
                            className="absolute bottom-full left-0 sm:left-auto sm:right-0 mb-3.5 z-50 w-[calc(100vw-2.5rem)] max-w-[360px] bg-[#141413] text-[#ECEAE5] border border-[#2E2D2B] rounded-2xl p-4 sm:p-5 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.85)] font-mono text-xs select-text overflow-hidden"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Ambient Top Glow Line */}
                            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#DA7756] to-transparent opacity-80" />

                            {/* Header / Meta */}
                            <div className="flex items-center justify-between border-b border-[#242321] pb-3 mb-3.5">
                                <div className="flex items-center gap-2">
                                    <span className="relative flex h-2 w-2">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#DA7756] opacity-75" />
                                        <span className="relative inline-flex rounded-full h-2 w-2 bg-[#DA7756]" />
                                    </span>
                                    <span className="font-bold uppercase tracking-widest text-xs text-[#FAF9F5]">
                                        DEV PASSPORT
                                    </span>
                                </div>
                                <span className="text-[10px] text-[#73716B] tracking-widest">
                                    #NT-2026
                                </span>
                            </div>

                            {/* Main Identity */}
                            <div className="flex items-start justify-between gap-3 mb-4">
                                <div>
                                    <h4 className="text-base font-bold tracking-tight text-[#FAF9F5] uppercase">
                                        Nitin Tanwar
                                    </h4>
                                    <p className="text-xs text-[#DA7756] font-semibold mt-0.5">
                                        Full Stack Engineer
                                    </p>
                                    <p className="text-[11px] text-[#9C9A92] mt-0.5">
                                        Novus Aegis AI — Texas, US
                                    </p>
                                </div>

                                {/* Micro Barcode / Spec Stamp */}
                                <div className="text-right shrink-0">
                                    <span className="inline-block border border-[#2E2D2B] bg-[#1C1B1A] px-2 py-1 rounded text-[9px] text-[#9C9A92] uppercase tracking-wider">
                                        PROD READY
                                    </span>
                                </div>
                            </div>

                            {/* Spec Ledger */}
                            <div className="space-y-2 bg-[#1C1B1A] border border-[#242321] p-3 rounded-xl mb-4 text-[11px]">
                                <div className="flex justify-between border-b border-[#2E2D2B]/50 pb-1.5">
                                    <span className="text-[#73716B] uppercase text-[10px]">Stack:</span>
                                    <span className="text-[#ECEAE5] font-medium text-right">React · Node · PostgreSQL</span>
                                </div>
                                <div className="flex justify-between border-b border-[#2E2D2B]/50 pb-1.5">
                                    <span className="text-[#73716B] uppercase text-[10px]">Specialty:</span>
                                    <span className="text-[#ECEAE5] font-medium text-right">Distributed Architecture & R3F</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-[#73716B] uppercase text-[10px]">Status:</span>
                                    <span className="text-[#DA7756] font-semibold text-right">Available for Work</span>
                                </div>
                            </div>

                            {/* Direct Connect Grid */}
                            <div className="grid grid-cols-3 gap-1.5 mb-4 text-center text-[10px] font-semibold">
                                <a
                                    href={SITE.links.github}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="bg-[#242321] hover:bg-[#DA7756] hover:text-[#141413] border border-[#2E2D2B] rounded-lg py-1.5 transition-all text-[#ECEAE5]"
                                >
                                    GitHub ↗
                                </a>
                                <a
                                    href={SITE.links.linkedin}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="bg-[#242321] hover:bg-[#DA7756] hover:text-[#141413] border border-[#2E2D2B] rounded-lg py-1.5 transition-all text-[#ECEAE5]"
                                >
                                    LinkedIn ↗
                                </a>
                                <a
                                    href={`mailto:${SITE.email}`}
                                    className="bg-[#242321] hover:bg-[#DA7756] hover:text-[#141413] border border-[#2E2D2B] rounded-lg py-1.5 transition-all text-[#ECEAE5]"
                                >
                                    Email @
                                </a>
                            </div>

                            {/* Run in Terminal Footer */}
                            <div className="flex items-center justify-between pt-3 border-t border-[#242321] bg-[#141413]">
                                <div className="flex items-center gap-1.5 text-[10px] text-[#73716B]">
                                    <span className="text-[#DA7756]">$</span>
                                    <span>terminal card</span>
                                </div>

                                <button
                                    onClick={handleCopy}
                                    className="inline-flex items-center gap-1 bg-[#242321] hover:bg-[#DA7756] hover:text-[#141413] text-[#FAF9F5] border border-[#2E2D2B] hover:border-[#DA7756] text-[10px] font-bold px-3 py-1 rounded-full transition-all"
                                >
                                    <span>{copied ? 'Copied ✓' : 'Copy NPX Command'}</span>
                                </button>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
};

export default NpxCardWidget;
