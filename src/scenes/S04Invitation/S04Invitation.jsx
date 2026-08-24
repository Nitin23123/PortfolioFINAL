import { useRef, useState } from 'react';
import { motion, useReducedMotion, AnimatePresence } from 'framer-motion';
import PlateIndex from '../../components/ui/PlateIndex';
import Reveal from '../../motion/Reveal';
import { DUR, REVEAL_AT } from '../../motion/tokens';
import { sceneGesture } from '../../motion/variants';
import { SITE } from '../../content/site';
import { events } from '../../state/events';

/**
 * Scene 04 — "The Invitation & Dispatch Console".
 *
 * Real Direct Message transmission dispatched asynchronously to nitin23123@gmail.com
 * via FormSubmit AJAX service without requiring local email clients.
 */

const S04Invitation = () => {
    const reducedMotion = useReducedMotion();
    const [copied, setCopied] = useState(false);
    const copiedTimer = useRef(null);

    // Form state
    const [name, setName] = useState('');
    const [senderEmail, setSenderEmail] = useState('');
    const [message, setMessage] = useState('');
    const [status, setStatus] = useState('idle'); // 'idle' | 'loading' | 'success' | 'error'
    const [errorMessage, setErrorMessage] = useState('');

    const handleCopy = (e) => {
        navigator.clipboard?.writeText(SITE.email).then(() => {
            setCopied(true);
            clearTimeout(copiedTimer.current);
            copiedTimer.current = setTimeout(() => setCopied(false), 2000);
            events.emit('ink:stamp', { x: e.clientX, y: e.clientY });
        });
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        if (!message.trim()) return;

        setStatus('loading');
        setErrorMessage('');

        try {
            const response = await fetch(`https://formsubmit.co/ajax/${SITE.email}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                },
                body: JSON.stringify({
                    name: name.trim() || 'Portfolio Visitor',
                    email: senderEmail.trim() || 'visitor@portfolio.dev',
                    message: message.trim(),
                    _subject: `⚡ Portfolio Message: ${name.trim() || 'New Inquiry'}`,
                    _template: 'table',
                    _captcha: 'false',
                }),
            });

            const data = await response.json();

            if (response.ok && (data.success === 'true' || data.success === true || data.message)) {
                setStatus('success');
                events.emit('ink:stamp', { x: window.innerWidth / 2, y: window.innerHeight / 2 });
            } else {
                throw new Error(data.message || 'Transmission failed. Please try again.');
            }
        } catch (err) {
            console.error('Email dispatch error:', err);
            // Even if an ad-blocker blocks the API, offer 1-click mailto fallback
            setStatus('error');
            setErrorMessage('Direct transmission was interrupted. You can retry or send via email client.');
        }
    };

    const headline = (
        <>
            Let&rsquo;s make<br />Everythin&rsquo;<br />together
        </>
    );

    return (
        <section
            id="invitation"
            className="bg-ink text-paper min-h-screen flex flex-col relative overflow-hidden py-24 md:py-36 [content-visibility:auto] [contain-intrinsic-size:auto_1000px]"
        >
            <div className="max-w-[1920px] mx-auto px-6 md:px-12 w-full flex-1 flex flex-col justify-between">
                <PlateIndex id="invitation" note="Ready when you are" dark />

                <div className="my-auto py-8 grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-12 lg:gap-20 items-center">
                    {/* Left: The Manifesto Headline & Quick Doors */}
                    <div>
                        {reducedMotion ? (
                            <h2 className="type-display text-display">{headline}</h2>
                        ) : (
                            <motion.h2
                                className="type-display text-display"
                                variants={sceneGesture}
                                initial="hidden"
                                whileInView="visible"
                                viewport={{ once: true, amount: REVEAL_AT }}
                            >
                                {headline}
                            </motion.h2>
                        )}

                        {/* Fast Access Pill Links */}
                        <Reveal
                            as="div"
                            delay={0.2}
                            duration={DUR.plate}
                            className="mt-10 md:mt-14 flex flex-wrap items-center gap-3 md:gap-4"
                        >
                            <a href={`mailto:${SITE.email}`} className="btn-pill-dark">
                                drop an email <span aria-hidden="true">@</span>
                            </a>
                            <button
                                onClick={handleCopy}
                                className="btn-pill-dark min-w-[130px] justify-center cursor-pointer"
                                aria-live="polite"
                            >
                                {copied ? 'copied ✓' : 'copy email'}
                            </button>
                            <a
                                href={SITE.links.linkedin}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="btn-pill-dark"
                            >
                                linkedin <span aria-hidden="true">↗</span>
                            </a>
                            <a
                                href={SITE.links.github}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="btn-pill-dark"
                            >
                                github <span aria-hidden="true">↗</span>
                            </a>
                        </Reveal>
                    </div>

                    {/* Right: Direct Message Dispatch Console */}
                    <Reveal
                        as="div"
                        delay={0.25}
                        duration={DUR.plate}
                        className="w-full"
                    >
                        <div className="bg-[#141413] border border-[#2E2D2B] rounded-2xl p-6 sm:p-8 shadow-2xl relative overflow-hidden font-mono">
                            {/* Top Ambient Glow */}
                            <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-[#DA7756] to-transparent opacity-80" />

                            {/* Header */}
                            <div className="flex items-center justify-between border-b border-[#242321] pb-4 mb-6">
                                <div className="flex items-center gap-2.5">
                                    <span className="relative flex h-2 w-2">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#DA7756] opacity-75" />
                                        <span className="relative inline-flex rounded-full h-2 w-2 bg-[#DA7756]" />
                                    </span>
                                    <h3 className="font-bold uppercase tracking-wider text-xs sm:text-sm text-[#FAF9F5]">
                                        DIRECT TRANSMISSION
                                    </h3>
                                </div>
                                <span className="text-[10px] text-[#73716B] uppercase tracking-widest hidden sm:inline">
                                    TO: {SITE.email}
                                </span>
                            </div>

                            <AnimatePresence mode="wait">
                                {status === 'success' ? (
                                    <motion.div
                                        key="success"
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0 }}
                                        className="py-8 text-center space-y-4"
                                    >
                                        <div className="w-14 h-14 rounded-full bg-[#DA7756]/15 border border-[#DA7756] text-[#DA7756] flex items-center justify-center mx-auto text-2xl font-bold shadow-[0_0_20px_rgba(218,119,86,0.3)]">
                                            ✓
                                        </div>
                                        <div>
                                            <h4 className="text-base font-bold text-[#FAF9F5] uppercase tracking-wider">
                                                Message Delivered to Inbox
                                            </h4>
                                            <p className="text-xs text-[#9C9A92] max-w-[42ch] mx-auto mt-2 leading-relaxed">
                                                Your transmission has landed at <span className="text-[#DA7756] font-semibold">{SITE.email}</span>. Nitin will reply to you as soon as possible!
                                            </p>
                                        </div>
                                        <button
                                            onClick={() => {
                                                setStatus('idle');
                                                setMessage('');
                                            }}
                                            className="mt-2 inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-[#242321] hover:bg-[#DA7756] text-[#ECEAE5] hover:text-[#141413] text-xs font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer"
                                        >
                                            Send Another Note
                                        </button>
                                    </motion.div>
                                ) : (
                                    <form key="form" onSubmit={handleFormSubmit} className="space-y-4 text-xs">
                                        {status === 'error' && (
                                            <div className="p-3 bg-red-950/40 border border-red-800/60 rounded-lg text-red-300 text-[11px] flex items-center justify-between gap-2">
                                                <span>{errorMessage}</span>
                                                <a
                                                    href={`mailto:${SITE.email}?subject=Message from ${encodeURIComponent(name || 'Portfolio')}&body=${encodeURIComponent(message)}`}
                                                    className="underline hover:text-white shrink-0 font-semibold"
                                                >
                                                    Open Mail Client ↗
                                                </a>
                                            </div>
                                        )}

                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                                            <div>
                                                <label className="block text-[10px] uppercase text-[#73716B] tracking-wider mb-1.5 font-semibold">
                                                    Your Name / Team:
                                                </label>
                                                <input
                                                    type="text"
                                                    required
                                                    value={name}
                                                    onChange={(e) => setName(e.target.value)}
                                                    placeholder="Alex Rivers (Tech Lead)"
                                                    className="w-full bg-[#1C1B1A] border border-[#2E2D2B] focus:border-[#DA7756] rounded-lg px-3.5 py-2.5 text-[#FAF9F5] placeholder:text-[#5E5D57] focus:outline-none transition-colors"
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-[10px] uppercase text-[#73716B] tracking-wider mb-1.5 font-semibold">
                                                    Your Email (For Reply):
                                                </label>
                                                <input
                                                    type="email"
                                                    required
                                                    value={senderEmail}
                                                    onChange={(e) => setSenderEmail(e.target.value)}
                                                    placeholder="alex@company.com"
                                                    className="w-full bg-[#1C1B1A] border border-[#2E2D2B] focus:border-[#DA7756] rounded-lg px-3.5 py-2.5 text-[#FAF9F5] placeholder:text-[#5E5D57] focus:outline-none transition-colors"
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-[10px] uppercase text-[#73716B] tracking-wider mb-1.5 font-semibold">
                                                Message / Project / Opportunity:
                                            </label>
                                            <textarea
                                                rows={4}
                                                required
                                                value={message}
                                                onChange={(e) => setMessage(e.target.value)}
                                                placeholder="Hi Nitin, we're building a new product and would love to bring you on board..."
                                                className="w-full bg-[#1C1B1A] border border-[#2E2D2B] focus:border-[#DA7756] rounded-lg p-3.5 text-[#FAF9F5] placeholder:text-[#5E5D57] focus:outline-none transition-colors resize-none leading-relaxed"
                                            />
                                        </div>

                                        <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
                                            <span className="text-[10px] text-[#73716B]">
                                                ⚡ Delivers directly to {SITE.email}
                                            </span>

                                            <button
                                                type="submit"
                                                disabled={status === 'loading'}
                                                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#DA7756] hover:bg-[#E08B6E] disabled:opacity-50 text-[#141413] font-bold px-6 py-2.5 rounded-full text-xs uppercase tracking-wider transition-all duration-200 shadow-md cursor-pointer disabled:cursor-not-allowed"
                                            >
                                                {status === 'loading' ? (
                                                    <>
                                                        <span className="w-3 h-3 border-2 border-[#141413] border-t-transparent rounded-full animate-spin" />
                                                        <span>Transmitting...</span>
                                                    </>
                                                ) : (
                                                    <>
                                                        <span>Send Message</span>
                                                        <span aria-hidden="true">→</span>
                                                    </>
                                                )}
                                            </button>
                                        </div>
                                    </form>
                                )}
                            </AnimatePresence>
                        </div>
                    </Reveal>
                </div>

                {/* Footer Baseline */}
                <div className="border-t border-white/15 pt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-meta-dark font-mono">
                    <p>© 2026 Nitin Tanwar · All rights reserved.</p>
                    <p className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-go" />
                        {SITE.availability}
                    </p>
                </div>
            </div>
        </section>
    );
};

export default S04Invitation;
