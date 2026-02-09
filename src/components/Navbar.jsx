import { motion } from 'framer-motion';
import { FaStarOfLife } from 'react-icons/fa';
import MagneticWrapper from './MagneticWrapper';

/**
 * Navbar Component
 * 
 * Minimalist, corner-anchored navigation.
 * - Logo: Top Left (Fixed)
 * - Links: Top Right (Fixed, Vertical Stack)
 */
const Navbar = () => {
    const links = [
        { name: 'ABOUT', id: 'about' },
        { name: 'WORK', id: 'experience' },
        { name: 'CONTACT', id: 'contact' }
    ];

    return (
        <nav className="fixed inset-0 z-50 pointer-events-none px-6 py-6 md:px-12 md:py-8 max-w-[1920px] mx-auto">
            {/* Logo - Top Left */}
            <div className="absolute top-6 left-6 md:top-8 md:left-12 pointer-events-auto">
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="relative w-10 h-10 flex items-center justify-center cursor-pointer group"
                    onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                >
                    {/* Glow Effect */}
                    <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                    {/* Accent Layer */}
                    <motion.div
                        className="absolute inset-0 text-primary mix-blend-screen"
                        variants={{
                            initial: { opacity: 0.8, rotate: 0 },
                            hover: {
                                opacity: 1,
                                rotate: 180,
                                transition: { duration: 0.6, ease: "easeInOut" }
                            }
                        }}
                    >
                        <FaStarOfLife className="text-2xl" />
                    </motion.div>

                    {/* Main White Layer */}
                    <motion.div
                        className="relative z-10 text-white"
                        variants={{
                            initial: { scale: 1 },
                            hover: { scale: 1.1, transition: { duration: 0.2 } }
                        }}
                    >
                        <FaStarOfLife className="text-xl md:text-2xl" />
                    </motion.div>
                </motion.div>
            </div>

            {/* Navigation - Top Right (Vertical Stack) */}
            <div className="absolute top-6 right-6 md:top-8 md:right-12 flex flex-col items-end gap-2 pointer-events-auto">
                {links.map((item, index) => (
                    <MagneticWrapper key={index} strength={0.2}>
                        <a
                            href={`#${item.id}`}
                            className="group relative block px-2 py-1"
                        >
                            <span className="text-[10px] md:text-xs font-bold text-muted group-hover:text-white transition-colors duration-300 uppercase tracking-[0.15em]">
                                {item.name}
                            </span>
                        </a>
                    </MagneticWrapper>
                ))}
            </div>
        </nav>
    );
};

export default Navbar;
