import { motion } from 'framer-motion';

/**
 * Contact Component
 * 
 * The final call-to-action section.
 * Features a large typography layout that animates in when scrolled into view.
 */
const Contact = () => {
    return (
        <section id="contact" className="py-32 md:py-48 bg-transparent text-white relative overflow-hidden">

            {/* Background Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/[0.02] rounded-full blur-[120px] pointer-events-none" />

            <div className="max-w-5xl mx-auto px-4 text-center relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                >
                    <p className="text-accent font-mono font-bold tracking-[0.2em] uppercase mb-6">What's Next?</p>
                    <h2 className="text-6xl sm:text-7xl md:text-9xl font-black mb-12 tracking-tighter text-white leading-[0.9]">
                        LET'S WORK<br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-orange-600">TOGETHER</span>
                    </h2>

                    <div className="flex justify-center">
                        <a
                            href="https://www.linkedin.com/in/nitin-tanwar-535018303/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group relative inline-flex items-center justify-center px-12 py-5 overflow-hidden font-bold text-white rounded-full bg-white/5 border border-white/10 hover:border-white/30 transition-all duration-300"
                        >
                            <span className="absolute w-0 h-0 transition-all duration-500 ease-out bg-primary rounded-full group-hover:w-80 group-hover:h-80 opacity-20"></span>
                            <span className="relative text-lg md:text-xl tracking-wider uppercase">Say Hello</span>
                        </a>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default Contact;
