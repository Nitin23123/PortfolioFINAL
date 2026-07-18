import { useState } from 'react';
import { motion, useSpring } from 'framer-motion';
import PlateIndex from '../../components/ui/PlateIndex';
import Reveal from '../../motion/Reveal';
import { DUR, STAGGER } from '../../motion/tokens';
import { PROJECTS } from '../../content/projects';

/**
 * Scene 02 — "Evidence".
 *
 * Shipped things only, presented as exhibits in a ledger: index,
 * name, one sentence, and the facts in Machine voice. Hovering a row
 * spotlights it (siblings dim to 30%) and a preview rides the cursor
 * with an EXPLORE chip. On touch, the preview is inline and the
 * explore affordance is an explicit button — nothing implied that a
 * finger can't discover.
 *
 * The closing line states the inventory honestly: two exhibits,
 * more in production. Confidence, not apology.
 */

const S02Evidence = () => {
    const [hovered, setHovered] = useState(null);

    // The carried preview: critically damped, arrives without orbiting.
    const springConfig = { stiffness: 150, damping: 22, mass: 0.2 };
    const previewX = useSpring(0, springConfig);
    const previewY = useSpring(0, springConfig);

    const handleMouseMove = (e) => {
        previewX.set(e.clientX - 190);
        previewY.set(e.clientY - 130);
    };

    return (
        <section
            id="evidence"
            className="bg-ink text-paper py-24 md:py-40 relative z-10 [content-visibility:auto] [contain-intrinsic-size:auto_1200px]"
            onMouseMove={handleMouseMove}
        >
            <div className="max-w-[1920px] mx-auto px-6 md:px-12">
                <PlateIndex id="evidence" note="Shipped things only" dark />

                <div className="flex flex-col" onMouseLeave={() => setHovered(null)}>
                    {PROJECTS.map((project, index) => (
                        <Reveal
                            key={project.id}
                            as="div"
                            duration={DUR.plate}
                            delay={index * STAGGER.gallery}
                        >
                            <a
                                href={project.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                onMouseEnter={() =>
                                    window.matchMedia('(hover: hover)').matches && setHovered(index)
                                }
                                className={`group border-t border-white/15 py-12 md:py-20 grid grid-cols-1 md:grid-cols-[auto_1fr_auto] md:items-baseline gap-5 md:gap-16 transition-opacity duration-[400ms]
                                    ${hovered !== null && hovered !== index ? 'opacity-30' : 'opacity-100'}`}
                            >
                                {/* Index */}
                                <span className="label-dark">( 0{index + 1} )</span>

                                {/* Name + the one sentence */}
                                <div>
                                    <h3 className="text-4xl md:text-7xl font-bold tracking-display uppercase leading-none">
                                        {project.title}
                                    </h3>
                                    <p className="text-paper/70 text-base md:text-xl mt-3 md:mt-4">
                                        {project.line}
                                    </p>

                                    {/* Touch: the image is the seduction — inline, full color */}
                                    <div className="md:hidden mt-6 overflow-hidden rounded-sm bg-greige">
                                        <img
                                            src={project.image}
                                            alt={`${project.title} — preview`}
                                            loading="lazy"
                                            decoding="async"
                                            width="1200"
                                            height="750"
                                            className="w-full h-auto object-cover"
                                        />
                                    </div>
                                </div>

                                {/* The facts */}
                                <div className="md:text-right">
                                    <p className="label-dark">{project.category}</p>
                                    <p className="label-dark mt-1">© {project.year.slice(2)} · {project.status}</p>
                                    <p className="label-dark mt-4 md:hidden">
                                        <span className="inline-flex items-center gap-2 border border-white/30 rounded-pill px-4 py-2">
                                            explore <span aria-hidden="true">↗</span>
                                        </span>
                                    </p>
                                </div>
                            </a>
                        </Reveal>
                    ))}
                    <div className="border-t border-white/15" />
                </div>

                {/* Honest inventory, stated with confidence */}
                <Reveal as="p" className="label-dark mt-10 flex items-center justify-between gap-4">
                    <span>( 0{PROJECTS.length} ) exhibits · more in production</span>
                    <span>© 25 . 26</span>
                </Reveal>
            </div>

            {/* The carried preview + chip — desktop only */}
            <motion.div
                className="fixed top-0 left-0 pointer-events-none z-50 hidden md:block"
                style={{ x: previewX, y: previewY }}
                initial={false}
                animate={{
                    opacity: hovered !== null ? 1 : 0,
                    scale: hovered !== null ? 1 : 0.94,
                }}
                transition={{ duration: DUR.small }}
            >
                <div className="w-[380px] h-[240px] overflow-hidden rounded-sm bg-greige">
                    {hovered !== null && PROJECTS[hovered] && (
                        <img
                            src={PROJECTS[hovered].image}
                            alt=""
                            className="w-full h-full object-cover"
                        />
                    )}
                </div>
                <span className="cursor-chip absolute -bottom-3 left-4">
                    explore <span aria-hidden="true">↗</span>
                </span>
            </motion.div>
        </section>
    );
};

export default S02Evidence;
