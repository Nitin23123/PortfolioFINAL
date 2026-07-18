import { motion } from 'framer-motion';
import { FaHtml5, FaCss3Alt, FaReact, FaBootstrap, FaNodeJs, FaGitAlt, FaGithub, FaFigma, FaLinux, FaDocker } from 'react-icons/fa';
import { SiJavascript, SiTailwindcss, SiFramer, SiExpress, SiPostgresql, SiVite, SiVercel, SiRedux, SiPostman } from 'react-icons/si';

const categories = [
    {
        label: 'Frontend',
        items: [
            { name: 'HTML', icon: <FaHtml5 /> },
            { name: 'CSS', icon: <FaCss3Alt /> },
            { name: 'JavaScript', icon: <SiJavascript /> },
            { name: 'React', icon: <FaReact /> },
            { name: 'Redux Toolkit', icon: <SiRedux /> },
            { name: 'Tailwind', icon: <SiTailwindcss /> },
            { name: 'Framer Motion', icon: <SiFramer /> },
            { name: 'Bootstrap', icon: <FaBootstrap /> },
            { name: 'Vite', icon: <SiVite /> },
        ],
    },
    {
        label: 'Backend',
        items: [
            { name: 'Node.js', icon: <FaNodeJs /> },
            { name: 'Express', icon: <SiExpress /> },
            { name: 'PostgreSQL', icon: <SiPostgresql /> },
        ],
    },
    {
        label: 'Tools',
        items: [
            { name: 'Git', icon: <FaGitAlt /> },
            { name: 'GitHub', icon: <FaGithub /> },
            { name: 'Docker', icon: <FaDocker /> },
            { name: 'Postman', icon: <SiPostman /> },
            { name: 'Figma', icon: <FaFigma /> },
            { name: 'Vercel', icon: <SiVercel /> },
            { name: 'Linux', icon: <FaLinux /> },
        ],
    },
];

const learning = ['DevOps', 'System Design', 'DSA'];

const containerVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.05 } },
};

const itemVariants = {
    hidden: { opacity: 0, y: 16 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
};

const TechStack = () => {
    return (
        <section id="tech-stack" className="bg-paper text-ink py-24 md:py-40 relative">
            <div className="max-w-[1920px] mx-auto px-6 md:px-12">

                {/* Section index */}
                <motion.p
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="label-light mb-16 md:mb-24 flex items-center justify-between"
                >
                    <span>( 04 ) — Stack</span>
                    <span className="hidden md:block">Tools follow perspective</span>
                </motion.p>

                {/* Category rows */}
                <div className="flex flex-col">
                    {categories.map((cat) => (
                        <motion.div
                            key={cat.label}
                            variants={containerVariants}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true, margin: '-60px' }}
                            className="border-t border-black/15 py-10 md:py-14 grid grid-cols-1 md:grid-cols-[0.75fr_1fr] gap-6 md:gap-24"
                        >
                            <p className="label-light">{cat.label}</p>
                            <ul className="flex flex-wrap gap-2.5">
                                {cat.items.map((tech) => (
                                    <motion.li key={tech.name} variants={itemVariants}>
                                        <span className="inline-flex items-center gap-2.5 rounded-pill border border-black/20 hover:border-black px-4 py-2 font-mono text-xs uppercase tracking-[0.03em] transition-colors duration-300 ease-out-expo cursor-default">
                                            <span className="text-base opacity-60" aria-hidden="true">{tech.icon}</span>
                                            {tech.name}
                                        </span>
                                    </motion.li>
                                ))}
                            </ul>
                        </motion.div>
                    ))}

                    {/* Currently learning */}
                    <motion.div
                        initial={{ opacity: 0, y: 16 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: '-60px' }}
                        transition={{ duration: 0.6 }}
                        className="border-t border-black/15 py-10 md:py-14 grid grid-cols-1 md:grid-cols-[0.75fr_1fr] gap-6 md:gap-24"
                    >
                        <p className="label-light flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-go" aria-hidden="true" />
                            Currently learning
                        </p>
                        <p className="label-light self-center">{learning.join(' / ')}</p>
                    </motion.div>
                    <div className="border-t border-black/15" />
                </div>
            </div>
        </section>
    );
};

export default TechStack;
