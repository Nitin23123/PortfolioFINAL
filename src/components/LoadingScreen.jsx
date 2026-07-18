import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

/**
 * LoadingScreen — noth.in-style preloader.
 * Black screen, mono labels in the corners, a big count-up number bottom-right.
 */
const LoadingScreen = ({ onComplete }) => {
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setProgress((prev) => {
                if (prev >= 100) {
                    clearInterval(interval);
                    setTimeout(onComplete, 500);
                    return 100;
                }
                const increment = Math.floor(Math.random() * 6) + 3;
                return Math.min(prev + increment, 100);
            });
        }, 80);

        return () => clearInterval(interval);
    }, [onComplete]);

    return (
        <motion.div
            className="fixed inset-0 z-[9999] bg-ink text-paper flex flex-col justify-between p-6 md:p-10"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.5, ease: "easeInOut" } }}
            aria-label="Loading"
        >
            {/* Top row */}
            <div className="flex items-start justify-between font-mono text-xs uppercase tracking-[0.08em]">
                <motion.span
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    nitin&rsquo; — portfolio
                </motion.span>
                <motion.span
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                    className="text-meta-dark"
                >
                    ( loading )
                </motion.span>
            </div>

            {/* Bottom row — hairline + big number */}
            <div>
                <div className="w-full h-px bg-white/15 relative overflow-hidden mb-6" role="progressbar" aria-valuenow={progress} aria-valuemin={0} aria-valuemax={100}>
                    <motion.div
                        className="h-full bg-paper absolute left-0 top-0"
                        initial={{ width: "0%" }}
                        animate={{ width: `${progress}%` }}
                        transition={{ ease: "linear", duration: 0.08 }}
                    />
                </div>
                <div className="flex items-end justify-between">
                    <span className="font-mono text-xs uppercase tracking-[0.08em] text-meta-dark">
                        not a style, a perspective
                    </span>
                    <span className="font-sans font-bold leading-none tracking-display text-[clamp(4rem,12vw,10rem)] tabular-nums">
                        {progress}
                    </span>
                </div>
            </div>
        </motion.div>
    );
};

export default LoadingScreen;
