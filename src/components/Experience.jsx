import { motion } from 'framer-motion';

const experiences = [
    {
        company: "Novus Aegis AI",
        role: "Full Stack Engineer",
        period: "Jan 2026 — Present",
        location: "Remote · Texas, US",
        description: "Building responsive UIs with React 19, Tailwind CSS & Framer Motion, converting Figma designs into pixel-perfect components. Developing secure REST APIs with Node.js, Express & PostgreSQL (Prisma ORM). Implemented JWT, bcrypt, Passport.js, OAuth 2.0 and built Chart.js dashboards within a full-stack monorepo for real-time analytics.",
        tech: ["React", "Node.js", "Express", "PostgreSQL", "Tailwind", "Framer Motion", "JWT", "OAuth 2.0"],
    },
    {
        company: "Academic Avenger",
        role: "Frontend Intern",
        period: "Jul 2024 — Aug 2024",
        location: "Remote · Mohali, PB",
        description: "Built an interactive portal using React.js, Tailwind CSS, HTML5, CSS3 & JavaScript. Translated Figma designs into responsive, reusable components with consistent styling.",
        mainUrl: "https://academicavengers.com/",
        tech: ["React", "Tailwind", "HTML5", "CSS3", "JavaScript"],
    },
];

const Experience = () => {
    return (
        <section id="experience" className="bg-paper text-ink py-24 md:py-40 relative">
            <div className="max-w-[1920px] mx-auto px-6 md:px-12">

                {/* Section index */}
                <motion.p
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="label-light mb-16 md:mb-24 flex items-center justify-between"
                >
                    <span>( 02 ) — Experience</span>
                    <span className="hidden md:block">( 0{experiences.length} )</span>
                </motion.p>

                {/* Editorial rows */}
                <div className="flex flex-col">
                    {experiences.map((exp, index) => (
                        <motion.article
                            key={exp.company}
                            initial={{ opacity: 0, y: 24 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: index * 0.1 }}
                            className="border-t border-black/15 py-12 md:py-16 grid grid-cols-1 md:grid-cols-[0.75fr_1fr] gap-6 md:gap-24"
                        >
                            {/* Left — company + meta */}
                            <div>
                                <h3 className="text-3xl md:text-5xl font-bold tracking-display uppercase leading-none">
                                    {exp.mainUrl ? (
                                        <a href={exp.mainUrl} target="_blank" rel="noopener noreferrer"
                                            className="hover:opacity-60 transition-opacity duration-300">
                                            {exp.company}
                                        </a>
                                    ) : exp.company}
                                </h3>
                                <p className="label-light mt-4">{exp.role}</p>
                                <p className="label-light mt-1">{exp.period} · {exp.location}</p>
                            </div>

                            {/* Right — description + tech */}
                            <div className="self-end">
                                <p className="text-base md:text-lg leading-relaxed text-ink/70 max-w-2xl">
                                    {exp.description}
                                </p>
                                <p className="label-light mt-6">
                                    {exp.tech.join(' / ')}
                                </p>
                            </div>
                        </motion.article>
                    ))}
                    <div className="border-t border-black/15" />
                </div>
            </div>
        </section>
    );
};

export default Experience;
