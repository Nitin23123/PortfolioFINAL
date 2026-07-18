import { motion } from 'framer-motion';

const About = () => {
    return (
        <section id="about" className="relative bg-ink text-paper py-24 md:py-40 overflow-hidden">
            <div className="max-w-[1920px] mx-auto px-6 md:px-12">

                {/* Section index */}
                <motion.p
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="label-dark mb-16 md:mb-24 flex items-center justify-between"
                >
                    <span>( 01 ) — About</span>
                    <span className="hidden md:block">The short version</span>
                </motion.p>

                <div className="grid grid-cols-1 md:grid-cols-[0.75fr_1fr] gap-12 md:gap-24">

                    {/* Left column — mono facts */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.7, delay: 0.15 }}
                        className="order-2 md:order-1 flex flex-col gap-8 self-end"
                    >
                        {[
                            { label: 'Role', value: 'Full Stack Engineer' },
                            { label: 'Company', value: 'Novus Aegis AI — Texas, US' },
                            { label: 'Based in', value: 'Noida, UP — India' },
                            { label: 'Status', value: 'Open to work', dot: true },
                        ].map(({ label, value, dot }) => (
                            <div key={label} className="border-t border-white/15 pt-3">
                                <p className="label-dark mb-1">{label}</p>
                                <p className="text-sm text-paper flex items-center gap-2">
                                    {dot && <span className="w-1.5 h-1.5 rounded-full bg-go" aria-hidden="true" />}
                                    {value}
                                </p>
                            </div>
                        ))}

                        {/* Resume pill */}
                        <a
                            href="https://drive.google.com/file/d/1yHU8HvPrOW0-2AGfFsen8m5jeQWBJR0y/view"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn-pill-dark self-start mt-2"
                        >
                            Download CV
                            <span aria-hidden="true">↓</span>
                        </a>
                    </motion.div>

                    {/* Right column — statement */}
                    <div className="order-1 md:order-2">
                        <motion.h2
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                            className="text-display-sm font-bold tracking-display leading-[1.02] mb-10 text-balance"
                        >
                            Full-stack developer building high-performance, accessible UIs — and the APIs that power them.
                        </motion.h2>

                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.7, delay: 0.15 }}
                            className="text-base md:text-lg leading-relaxed text-paper/70 max-w-2xl"
                        >
                            Currently a Full Stack Engineer at{' '}
                            <span className="text-paper">Novus Aegis AI</span>{' '}
                            (Texas, US), where I build React-based frontends with Tailwind &amp; Framer Motion,
                            and secure REST APIs with Node.js, Express, and PostgreSQL. I care about performance,
                            clean architecture, and shipping things that actually work in production.
                        </motion.p>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default About;
