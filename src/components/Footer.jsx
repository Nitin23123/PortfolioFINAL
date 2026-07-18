/**
 * Footer — mono metadata credits, continues the black contact block.
 */
const Footer = () => {
    return (
        <footer className="bg-ink text-paper pb-10">
            <div className="max-w-[1920px] mx-auto px-6 md:px-12">
                <div className="border-t border-white/15 pt-8 flex flex-col md:flex-row md:items-center justify-between gap-6">

                    {/* Credits */}
                    <p className="label-dark">
                        ©{new Date().getFullYear()} — Nitin Tanwar
                    </p>

                    {/* Links */}
                    <nav className="flex items-center gap-6" aria-label="Footer">
                        <a href="mailto:nitin23123@gmail.com"
                            className="label-dark hover:text-paper transition-colors duration-300">Email</a>
                        <a href="https://www.linkedin.com/in/nitin-tanwar-535018303/" target="_blank" rel="noopener noreferrer"
                            className="label-dark hover:text-paper transition-colors duration-300">LinkedIn</a>
                        <a href="https://github.com/Nitin23123" target="_blank" rel="noopener noreferrer"
                            className="label-dark hover:text-paper transition-colors duration-300">GitHub</a>
                        <a href="https://drive.google.com/file/d/1yHU8HvPrOW0-2AGfFsen8m5jeQWBJR0y/view" target="_blank" rel="noopener noreferrer"
                            className="label-dark hover:text-paper transition-colors duration-300">Resume</a>
                    </nav>

                    {/* Status */}
                    <p className="label-dark flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-go" aria-hidden="true" />
                        available for work
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
