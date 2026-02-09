import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * LoadingScreen Component
 * 
 * Displays a preloader with a "hacker terminal" aesthetic before the main site loads.
 * Features:
 * - Percentage counter
 * - Dynamic loading status text
 * - Typewriter effect for a "console.log" message
 * 
 * @param {Object} props
 * @param {Function} props.onComplete - Callback function when loading finishes
 */
const LoadingScreen = ({ onComplete }) => {
    const [progress, setProgress] = useState(0);

    // Counter logic: Increments from 0 to 100
    useEffect(() => {
        const interval = setInterval(() => {
            setProgress((prev) => {
                if (prev >= 100) {
                    clearInterval(interval);
                    setTimeout(onComplete, 600); // Slight delay for smoothness
                    return 100;
                }
                const increment = Math.floor(Math.random() * 5) + 2;
                return Math.min(prev + increment, 100);
            });
        }, 100);

        return () => clearInterval(interval);
    }, [onComplete]);

    return (
        <motion.div
            className="fixed inset-0 z-[9999] bg-black flex items-center justify-center font-sans"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.5, ease: "easeInOut" } }}
        >
            <div className="w-[200px] md:w-[300px] flex flex-col items-center gap-4">
                {/* Brand / Loading Text (Minimal) */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="text-white/50 text-xs font-mono tracking-[0.3em] uppercase"
                >
                    Loading
                </motion.div>

                {/* Progress Bar Container */}
                <div className="w-full h-[1px] bg-white/10 rounded-full overflow-hidden relative">
                    {/* Progress Bar Fill */}
                    <motion.div
                        className="h-full bg-primary absolute left-0 top-0"
                        initial={{ width: "0%" }}
                        animate={{ width: `${progress}%` }}
                        transition={{ ease: "linear", duration: 0.1 }}
                    />
                </div>
            </div>
        </motion.div>
    );
};

export default LoadingScreen;
