import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { FaGithub, FaLinkedin, FaInstagram, FaGlobe } from 'react-icons/fa';

/**
 * Hero Component
 * 
 * "Poster Style" Layout:
 * - Huge centered typography (Static)
 * - Corner metadata (Socials, Scroll Indicator)
 */
const Hero = () => {
    const containerRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end start"]
    });

    const y = useTransform(scrollYProgress, [0, 1], [0, 200]);
    const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

    return (
        <section ref={containerRef} className="h-screen w-full relative flex flex-col items-center justify-center overflow-hidden font-sans bg-black perspective-[1000px]">

            {/* Ambient Background Glow - REMOVED for True Black */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none" />

            {/* Main Typography - Centered & Balanced */}
            <div className="relative z-10 flex flex-col items-center justify-center text-center mix-blend-normal w-full max-w-[1920px]">
                {/* Top Label */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.8 }}
                    className="text-primary font-mono text-xs md:text-sm tracking-[0.5em] mb-4 uppercase"
                >
                    Nitin Tanwar
                </motion.div>

                {/* Static Headline */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
                    className="relative group cursor-default w-full"
                >
                    <div className="flex flex-col items-center leading-[0.8] font-black tracking-tighter w-full select-none">
                        <span className="text-[9vw] md:text-[8vw] text-[#EBEBEB]">MAKING</span>
                        <span className="text-[9vw] md:text-[8vw] text-primary">GOOD</span>
                        <span className="text-[9vw] md:text-[8vw] text-primary">SHIT</span>
                        <span className="text-[9vw] md:text-[8vw] text-[#EBEBEB]">SINCE</span>
                        <span className="text-[9vw] md:text-[8vw] text-[#EBEBEB]">2023</span>
                    </div>
                </motion.div>
            </div>

            {/* Bottom Left - Social Icons */}
            <div className="absolute bottom-8 left-8 md:bottom-12 md:left-12 flex flex-col gap-6 z-20">
                <a href="#" className="text-muted hover:text-white transition-colors text-xl"><FaGlobe /></a>
                <a href="#" className="text-muted hover:text-white transition-colors text-xl"><FaInstagram /></a>
                <a href="#" className="text-muted hover:text-white transition-colors text-xl"><FaGithub /></a>
                <a href="#" className="text-muted hover:text-white transition-colors text-xl"><FaLinkedin /></a>
            </div>

            {/* Bottom Right - Scroll Indicator */}
            <div className="absolute bottom-8 right-8 md:bottom-12 md:right-12 z-20">
                <div className="flex flex-col items-center gap-4">
                    <span className="text-xs font-mono text-muted tracking-[0.2em] [writing-mode:vertical-rl] uppercase">Scroll Down</span>
                    <div className="w-[1px] h-12 bg-white/20" />
                </div>
            </div>

            <style>{`
                .stroke-text {
                    -webkit-text-stroke: 2px #EBEBEB;
                    text-stroke: 2px #EBEBEB;
                }
            `}</style>
        </section>
    );
};

export default Hero;
