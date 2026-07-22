import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { sheetDrainUp } from '../../motion/variants';
import Loader3DCanvas from './Loader3DCanvas';

/**
 * Scene 00 — "The Count".
 *
 * A black sheet over the film while Tier-0 assets (fonts) genuinely
 * load. The count's progress is real: time carries it to 88, asset
 * completion releases the last twelve. Displays a central N [3D Asset] '
 * composition while cycling 3D objects.
 *
 * @param {object} props
 * @param {() => void} props.onComplete fired after the 100 hold;
 *        the parent flips phase → 'ready' and the drain plays.
 */

const INITIAL_PAUSE = 3000; // 3 seconds initial pause
const MIN_RUNTIME = 3200;    // Fast 3.2-second countdown duration from 100 -> 0
const ASSET_TIMEOUT = 7000;
const TICK = 30;
const HOLD_AT_ZERO = 200;
const TOTAL_3D_OBJECTS = 6;

const S00Loader = ({ onComplete }) => {
    const [count, setCount] = useState(100);
    const [isStarted, setIsStarted] = useState(false);
    const completedRef = useRef(false);

    useEffect(() => {
        const startedAt = performance.now();
        let assetsReady = false;
        let interval;
        let holdTimer;
        let startPauseTimer;

        const fontsSettled =
            'fonts' in document ? document.fonts.ready : Promise.resolve();
        const timeout = new Promise((resolve) => setTimeout(resolve, ASSET_TIMEOUT));
        Promise.race([fontsSettled, timeout]).then(() => {
            assetsReady = true;
        });

        // Pause for 3 seconds before starting the countdown & 3D object cycle
        startPauseTimer = setTimeout(() => {
            setIsStarted(true);
            const countdownStart = performance.now();

            interval = setInterval(() => {
                setCount((current) => {
                    const elapsed = performance.now() - countdownStart;

                    const rawProgress = Math.min(1, elapsed / MIN_RUNTIME);
                    // Sharp exponential acceleration: fast & snappy transition toward 0
                    const expProgress = Math.pow(rawProgress, 3.2);
                    const targetCount = assetsReady
                        ? Math.max(0, Math.round(100 * (1 - expProgress)))
                        : Math.max(12, Math.round(100 * (1 - expProgress)));

                    if (current <= 0) return 0;

                    const jump = Math.max(1, Math.round((100 - targetCount) / 10));
                    const next = Math.min(current - 1, Math.max(current - jump, targetCount));

                    if (next <= 0 && !completedRef.current) {
                        completedRef.current = true;
                        clearInterval(interval);
                        holdTimer = setTimeout(onComplete, HOLD_AT_ZERO);
                    }
                    return next;
                });
            }, TICK);
        }, INITIAL_PAUSE);

        return () => {
            clearTimeout(startPauseTimer);
            if (interval) clearInterval(interval);
            if (holdTimer) clearTimeout(holdTimer);
        };
    }, [onComplete]);

    const progress = (100 - count) / 100;
    const activeIndex = Math.floor(progress * TOTAL_3D_OBJECTS * 2.5) % TOTAL_3D_OBJECTS;
    const formattedCount = String(count).padStart(3, '0');

    return (
        <motion.div
            className="fixed inset-0 z-[9999] bg-ink text-paper flex flex-col justify-between p-6 md:p-10 select-none overflow-hidden"
            variants={sheetDrainUp}
            exit="exit"
            aria-label="Loading"
        >
            {/* Center Stage — N [3D Object] ' */}
            <div className="flex-1 flex items-center justify-center relative z-10 my-auto">
                <div className="flex items-center justify-center font-black uppercase leading-none tracking-tighter text-[18vw] md:text-[12vw] text-paper">
                    <span>N</span>
                    <AnimatePresence>
                        {isStarted && (
                            <motion.div
                                key="loader-3d-container"
                                initial={{ width: 0, opacity: 0, scale: 0 }}
                                animate={{ width: 'auto', opacity: 1, scale: 1 }}
                                exit={{ width: 0, opacity: 0, scale: 0 }}
                                transition={{ type: 'spring', stiffness: 280, damping: 20 }}
                                className="w-[18vw] h-[18vw] md:w-[12vw] md:h-[12vw] relative flex items-center justify-center shrink-0 mx-[0.5vw]"
                            >
                                <Loader3DCanvas activeIndex={activeIndex} />
                            </motion.div>
                        )}
                    </AnimatePresence>
                    <span>&rsquo;</span>
                </div>
            </div>

            {/* Bottom block — centered 000 counter */}
            <div className="relative z-10 pb-4">
                <div className="flex items-center justify-center">
                    <span className="font-mono font-bold leading-none tracking-widest text-xl md:text-3xl text-paper/90 tabular-nums">
                        {formattedCount}
                    </span>
                </div>
            </div>
        </motion.div>
    );
};

export default S00Loader;

