import { motion, useSpring } from 'framer-motion';
import { useState } from 'react';

// Selected works — one poetic line each, noth.in style
const projects = [
    {
        title: "ReconPro",
        line: "Recon without the grunt work.",
        category: "SaaS Landing + Auth API",
        year: "2026",
        link: "https://reconpro.info",
        image: "/previews/reconpro.png",
    },
    {
        title: "DevTrace",
        line: "A dev's day, traced end to end.",
        category: "Developer Productivity Dashboard",
        year: "2025",
        link: "https://devtracedash.netlify.app",
        image: "/previews/devTrace.png",
    },
];

const Projects = () => {
    const [hoveredProject, setHoveredProject] = useState(null);

    // Spring physics for the floating preview + cursor chip
    const springConfig = { stiffness: 150, damping: 15, mass: 0.1 };
    const mouseX = useSpring(0, springConfig);
    const mouseY = useSpring(0, springConfig);

    const handleMouseMove = (e) => {
        mouseX.set(e.clientX - 190);
        mouseY.set(e.clientY - 120);
    };

    return (
        <section id="projects" className="bg-ink text-paper py-24 md:py-40 relative z-10" onMouseMove={handleMouseMove}>
            <div className="max-w-[1920px] mx-auto px-6 md:px-12">

                {/* Section index — sticky, rides the scroll */}
                <motion.p
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="label-dark sticky top-8 z-20 mb-16 md:mb-24 flex items-center justify-between"
                >
                    <span>( 03 ) — Works</span>
                    <span className="hidden md:block">Good brands ship. Great ones surprise.</span>
                </motion.p>

                {/* Works list */}
                <div className="flex flex-col" onMouseLeave={() => setHoveredProject(null)}>
                    {projects.map((project, index) => (
                        <motion.a
                            key={project.title}
                            href={project.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            onMouseEnter={() => window.matchMedia('(hover: hover)').matches && setHoveredProject(index)}
                            className={`group border-t border-white/15 py-12 md:py-20 grid grid-cols-1 md:grid-cols-[auto_1fr_auto] md:items-baseline gap-4 md:gap-16 transition-opacity duration-500
                                ${hoveredProject !== null && hoveredProject !== index ? 'opacity-30' : 'opacity-100'}`}
                        >
                            {/* Index */}
                            <span className="label-dark">( 0{index + 1} )</span>

                            {/* Title + poetic line */}
                            <div>
                                <h3 className="text-4xl md:text-7xl font-bold tracking-display uppercase leading-none">
                                    {project.title}
                                </h3>
                                <p className="text-paper/70 text-base md:text-xl mt-3 md:mt-4">
                                    {project.line}
                                </p>
                            </div>

                            {/* Meta */}
                            <div className="md:text-right">
                                <p className="label-dark">{project.category}</p>
                                <p className="label-dark mt-1">© {project.year.slice(2)}</p>
                                <p className="label-dark mt-3 md:hidden underline underline-offset-4">explore ↗</p>
                            </div>
                        </motion.a>
                    ))}
                    <div className="border-t border-white/15" />
                </div>

                {/* Section footer meta */}
                <p className="label-dark mt-10 flex items-center justify-between">
                    <span>( 0{projects.length} )</span>
                    <span>© 25 . 26</span>
                </p>
            </div>

            {/* Floating preview + cursor chip — desktop only */}
            <motion.div
                className="fixed top-0 left-0 pointer-events-none z-50 hidden md:block"
                style={{ x: mouseX, y: mouseY }}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{
                    opacity: hoveredProject !== null ? 1 : 0,
                    scale: hoveredProject !== null ? 1 : 0.9,
                }}
                transition={{ type: "spring", stiffness: 150, damping: 20 }}
            >
                <div className="w-[380px] h-[240px] overflow-hidden rounded-sm">
                    {hoveredProject !== null && projects[hoveredProject]?.image ? (
                        <img
                            src={projects[hoveredProject].image}
                            alt=""
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center bg-greige">
                            <span className="label-light">Preview unavailable</span>
                        </div>
                    )}
                </div>
                {/* the "explore" chip, riding just below the preview */}
                <span className="cursor-chip absolute -bottom-3 left-4">
                    explore <span aria-hidden="true">↗</span>
                </span>
            </motion.div>
        </section>
    );
};

export default Projects;
