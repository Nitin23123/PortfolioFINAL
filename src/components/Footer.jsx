/**
 * Footer Component
 * 
 * Simple black footer with copyright, social links, and email.
 */
const Footer = () => {
    return (
        <footer className="bg-black py-20 relative overflow-hidden border-t border-white/10">

            {/* Ambient Background */}
            <div className="absolute inset-0 bg-primary/5 pointer-events-none" />

            <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center relative z-10">
                {/* Copyright Section */}
                <div className="mb-8 md:mb-0 text-center md:text-left">
                    <h2 className="text-2xl font-bold tracking-tight mb-2 text-white">NITIN TANWAR</h2>
                    <p className="text-muted text-sm">© {new Date().getFullYear()} All rights reserved. <span className="text-white/20 ml-2">Built with React & Tailwind</span></p>
                </div>

                {/* Social Links */}
                <div className="flex gap-8">
                    <a href="mailto:nitin23123@gmail.com" className="text-muted hover:text-white transition-colors text-sm uppercase tracking-wider font-medium">Email</a>
                    <a href="https://www.linkedin.com/in/nitin-tanwar-535018303/" target="_blank" rel="noopener noreferrer" className="text-muted hover:text-white transition-colors text-sm uppercase tracking-wider font-medium">LinkedIn</a>
                    <a href="https://github.com/Nitin23123" target="_blank" rel="noopener noreferrer" className="text-muted hover:text-white transition-colors text-sm uppercase tracking-wider font-medium">GitHub</a>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
