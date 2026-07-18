import PlateIndex from '../../components/ui/PlateIndex';
import Reveal from '../../motion/Reveal';
import { DUR } from '../../motion/tokens';
import { SITE } from '../../content/site';
import { STATEMENT, BIO, FACTS, ROLES, INSTRUMENT_GROUPS, AUTHOR_EXIT } from '../../content/roles';

/**
 * Scene 03 — "The Author".
 *
 * The person as the conclusion of the evidence: one statement in the
 * Voice, the record in Machine — facts rail, two roles with real
 * dates, a single line of instruments where a whole icon-pill section
 * used to live. The brightest, calmest plate in the film; restraint
 * is the characterization.
 */

/**
 * The statement, placed as one plate. A single settle keeps line
 * wrapping correct at every viewport — per-line masks only survive
 * hand-tuned widths, and a statement that wraps wrong reads as a
 * typo in the film's loudest voice.
 */
const Statement = () => (
    <Reveal as="h2" duration={DUR.plate} className="text-display-sm font-bold tracking-display leading-[1.02] text-balance">
        {STATEMENT}
    </Reveal>
);

const S03Author = () => (
    <section
        id="author"
        className="bg-paper text-ink py-24 md:py-40 relative [content-visibility:auto] [contain-intrinsic-size:auto_1400px]"
    >
        <div className="max-w-[1920px] mx-auto px-6 md:px-12">
            <PlateIndex id="author" note="The short version" />

            <div className="grid grid-cols-1 md:grid-cols-[0.75fr_1fr] gap-12 md:gap-24">

                {/* The record rail — pinned briefly on desktop: the film's held frame */}
                <Reveal
                    as="div"
                    duration={DUR.plate}
                    delay={0.15}
                    className="order-2 md:order-1 md:self-start md:sticky md:top-28 flex flex-col gap-6"
                >
                    {FACTS.map(({ label, value, live }) => (
                        <div key={label} className="border-t border-black/15 pt-3">
                            <p className="label-light mb-1">{label}</p>
                            <p className="text-sm flex items-center gap-2">
                                {live && <span className="w-1.5 h-1.5 rounded-full bg-go" aria-hidden="true" />}
                                {value}
                            </p>
                        </div>
                    ))}
                    <a
                        href={SITE.links.resume}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-pill-light self-start mt-2"
                    >
                        Download CV <span aria-hidden="true">↓</span>
                    </a>
                </Reveal>

                {/* The monologue + the record */}
                <div className="order-1 md:order-2">
                    <Statement />

                    <Reveal as="p" delay={0.2} className="mt-10 text-base md:text-lg leading-relaxed text-ink/70 max-w-[65ch]">
                        {BIO}
                    </Reveal>

                    {/* Roles — the timeline, two entries, real dates */}
                    <div className="mt-16 md:mt-20 flex flex-col">
                        {ROLES.map((role) => (
                            <Reveal
                                key={role.company}
                                as="div"
                                className="border-t border-black/15 py-8 md:py-10 grid grid-cols-1 md:grid-cols-[1fr_auto] gap-2 md:gap-8 md:items-baseline"
                            >
                                <div>
                                    <h3 className="text-2xl md:text-4xl font-bold tracking-display uppercase leading-none">
                                        {role.url ? (
                                            <a
                                                href={role.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="relative inline-block group"
                                            >
                                                {role.company}
                                                {/* hairline draws left→right — a pen stroke */}
                                                <span className="absolute left-0 -bottom-1 h-px w-full bg-ink origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-200 ease-out-expo" />
                                            </a>
                                        ) : (
                                            role.company
                                        )}
                                    </h3>
                                    <p className="label-light mt-3">{role.role}</p>
                                </div>
                                <div className="md:text-right">
                                    <p className="label-light">{role.period}</p>
                                    <p className="label-light mt-1">{role.location}</p>
                                </div>
                            </Reveal>
                        ))}

                        {/* Instruments — the full kit as ledger rows, Machine voice.
                            Categories in print order: what he writes, what he
                            builds with, what it runs on, what keeps it honest. */}
                        {INSTRUMENT_GROUPS.map((group) => (
                            <Reveal
                                key={group.label}
                                as="div"
                                className="border-t border-black/15 py-5 md:py-6 grid grid-cols-1 md:grid-cols-[minmax(10rem,auto)_1fr] gap-2 md:gap-12"
                            >
                                <p className="label-light">{group.label}</p>
                                <p className="label-light md:text-right text-ink/80">
                                    {group.items.join(' / ')}
                                </p>
                            </Reveal>
                        ))}
                        <div className="border-t border-black/15" />
                    </div>

                    {/* The handoff — small Voice, mid-sentence into Scene 04 */}
                    <Reveal as="p" className="mt-16 md:mt-24 text-2xl md:text-4xl font-bold tracking-display">
                        {AUTHOR_EXIT}
                    </Reveal>
                </div>
            </div>
        </div>
    </section>
);

export default S03Author;
