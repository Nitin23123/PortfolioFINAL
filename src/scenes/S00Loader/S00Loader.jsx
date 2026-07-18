import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { sheetDrainUp } from '../../motion/variants';

/**
 * Scene 00 — "The Count".
 *
 * A black sheet over the film while Tier-0 assets (fonts) genuinely
 * load. The count's progress is real: time carries it to 88, asset
 * completion releases the last twelve. Numbers snap in irregular
 * integer jumps — machines under load don't count smoothly.
 *
 * Plays once per session (the gate lives in App, not here). Exit is
 * the sheet draining upward via AnimatePresence, teaching rule one:
 * black is a substance in this film, not a color.
 *
 * @param {object} props
 * @param {() => void} props.onComplete fired after the 100 hold;
 *        the parent flips phase → 'ready' and the drain plays.
 */

/** Minimum time the count must run, even on a warm cache (ms). */
const MIN_RUNTIME = 1400;
/** Hard ceiling on waiting for fonts before we ship anyway (ms). */
const ASSET_TIMEOUT = 3000;
/** Interval between count jumps (ms). */
const TICK = 70;
/** Where the count stalls until assets confirm (percent). */
const PRE_ASSET_CEILING = 88;
/** How long the finished count holds before the drain (ms). */
const HOLD_AT_100 = 200;

const S00Loader = ({ onComplete }) => {
    const [count, setCount] = useState(0);
    const completedRef = useRef(false);

    useEffect(() => {
        const startedAt = performance.now();
        let assetsReady = false;
        let interval;
        let holdTimer;

        // Tier 0 gate: fonts, with a hard timeout so a stalled CDN
        // can never hold the film hostage.
        const fontsSettled =
            'fonts' in document ? document.fonts.ready : Promise.resolve();
        const timeout = new Promise((resolve) => setTimeout(resolve, ASSET_TIMEOUT));
        Promise.race([fontsSettled, timeout]).then(() => {
            assetsReady = true;
        });

        interval = setInterval(() => {
            setCount((current) => {
                const elapsed = performance.now() - startedAt;

                // Time carries the target to the ceiling; assets + minimum
                // runtime release the last stretch to 100.
                const timeTarget = Math.min(
                    PRE_ASSET_CEILING,
                    Math.round((elapsed / MIN_RUNTIME) * PRE_ASSET_CEILING),
                );
                const target =
                    assetsReady && elapsed >= MIN_RUNTIME ? 100 : timeTarget;

                if (current >= 100) return current;

                // Irregular integer jump toward the target. Snap, no easing.
                const jump = 2 + Math.floor(Math.random() * 5);
                const next = Math.min(current + jump, target);

                if (next >= 100 && !completedRef.current) {
                    completedRef.current = true;
                    clearInterval(interval);
                    holdTimer = setTimeout(onComplete, HOLD_AT_100);
                }
                return next;
            });
        }, TICK);

        return () => {
            clearInterval(interval);
            clearTimeout(holdTimer);
        };
    }, [onComplete]);

    return (
        <motion.div
            className="fixed inset-0 z-[9999] bg-ink text-paper flex flex-col justify-between p-6 md:p-10"
            variants={sheetDrainUp}
            exit="exit"
            aria-label="Loading"
        >
            {/* Top rail — Machine voice in the corners */}
            <div className="flex items-start justify-between font-mono text-xs uppercase tracking-[0.08em]">
                <span>Nitin&rsquo; — Portfolio</span>
                <span className="text-meta-dark">( loading )</span>
            </div>

            {/* Bottom block — progress hairline, tagline, the count */}
            <div>
                <div
                    className="w-full h-px bg-white/15 relative overflow-hidden mb-6"
                    role="progressbar"
                    aria-valuenow={count}
                    aria-valuemin={0}
                    aria-valuemax={100}
                >
                    {/* Width snaps with the count — the bar is Machine, not Paper */}
                    <div
                        className="h-full bg-paper absolute left-0 top-0"
                        style={{ width: `${count}%` }}
                    />
                </div>

                <div className="flex items-end justify-between gap-6">
                    <span className="font-mono text-xs uppercase tracking-[0.08em] text-meta-dark pb-2">
                        not a style, a perspective
                    </span>
                    <span className="font-sans font-black leading-none tracking-display text-[clamp(4rem,12vw,10rem)] tabular-nums select-none">
                        {count}
                    </span>
                </div>
            </div>
        </motion.div>
    );
};

export default S00Loader;
