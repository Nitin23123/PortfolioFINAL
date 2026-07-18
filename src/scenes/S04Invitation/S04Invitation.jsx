import { useRef, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import PlateIndex from '../../components/ui/PlateIndex';
import Reveal from '../../motion/Reveal';
import { DUR, REVEAL_AT } from '../../motion/tokens';
import { sceneGesture } from '../../motion/variants';
import { SITE } from '../../content/site';
import { events } from '../../state/events';

/**
 * Scene 04 — "The Invitation".
 *
 * The film's momentum lands on one imperative in poster type and
 * three doors: email, copy, LinkedIn. Fills exactly one viewport —
 * composition, not pinning, creates the held ending. The copy action
 * confirms inline in Machine voice and emits the stamp event for the
 * ink layer to sign.
 */

const S04Invitation = () => {
    const reducedMotion = useReducedMotion();
    const [copied, setCopied] = useState(false);
    const copiedTimer = useRef(null);

    const handleCopy = (e) => {
        navigator.clipboard?.writeText(SITE.email).then(() => {
            setCopied(true);
            clearTimeout(copiedTimer.current);
            copiedTimer.current = setTimeout(() => setCopied(false), 2000);
            // The page signs for it — the apostrophe stamp, when the
            // ink layer is listening on this scene.
            events.emit('ink:stamp', { x: e.clientX, y: e.clientY });
        });
    };

    const headline = (
        <>
            Let&rsquo;s make<br />Everythin&rsquo;<br />together
        </>
    );

    return (
        <section
            id="invitation"
            className="bg-ink text-paper min-h-screen flex flex-col relative overflow-hidden pt-24 md:pt-40 pb-10 md:pb-14 [content-visibility:auto] [contain-intrinsic-size:auto_900px]"
        >
            <div className="max-w-[1920px] mx-auto px-6 md:px-12 w-full flex-1 flex flex-col">
                <PlateIndex id="invitation" note="Ready when you are" dark />

                <div className="flex-1 flex flex-col justify-center">
                    {/* The imperative — the Scene 01 gesture returns: the film's rhyme */}
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

                    {/* Three doors, ranked by conversion value */}
                    <Reveal
                        as="div"
                        delay={0.2}
                        duration={DUR.plate}
                        className="mt-14 md:mt-20 flex flex-col sm:flex-row sm:items-center gap-4"
                    >
                        <a href={`mailto:${SITE.email}`} className="btn-pill-dark">
                            drop me an email <span aria-hidden="true">@</span>
                        </a>
                        <button
                            onClick={handleCopy}
                            className="btn-pill-dark min-w-[130px] justify-center"
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
                    </Reveal>
                </div>
            </div>
        </section>
    );
};

export default S04Invitation;
