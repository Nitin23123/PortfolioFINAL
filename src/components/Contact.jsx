import { motion } from 'framer-motion';
import { useState } from 'react';

const Contact = () => {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText('nitin23123@gmail.com');
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <section id="contact" className="bg-ink text-paper pt-24 md:pt-40 pb-16 md:pb-24 relative overflow-hidden">
            <div className="max-w-[1920px] mx-auto px-6 md:px-12">

                {/* Section index */}
                <motion.p
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="label-dark mb-16 md:mb-24 flex items-center justify-between"
                >
                    <span>( 05 ) — Contact</span>
                    <span className="hidden md:block flex-none">Ready when you are</span>
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                >
                    {/* Big type */}
                    <h2 className="type-display text-display text-balance">
                        Let&rsquo;s make<br />Everythin&rsquo;<br />together
                    </h2>

                    {/* Actions */}
                    <div className="mt-14 md:mt-20 flex flex-col sm:flex-row sm:items-center gap-4">
                        <a href="mailto:nitin23123@gmail.com" className="btn-pill-dark">
                            drop me an email <span aria-hidden="true">@</span>
                        </a>
                        <button
                            onClick={handleCopy}
                            className="btn-pill-dark min-w-[120px] justify-center"
                            aria-live="polite"
                        >
                            {copied ? '✓ copied' : 'copy email'}
                        </button>
                        <a
                            href="https://www.linkedin.com/in/nitin-tanwar-535018303/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn-pill-dark"
                        >
                            linkedin <span aria-hidden="true">↗</span>
                        </a>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default Contact;
