import { SITE } from '../../content/site';

/**
 * Scene 05 — "End Credits".
 *
 * The colophon: copyright, every exit door, and the one element that
 * outlives the film — the green heartbeat. Pure Machine voice, no
 * performance. Continuous with the Invitation's ink field.
 */

const LINKS = [
    { label: 'Email', href: `mailto:${SITE.email}` },
    { label: 'LinkedIn', href: SITE.links.linkedin, external: true },
    { label: 'GitHub', href: SITE.links.github, external: true },
    { label: 'Resume', href: SITE.links.resume, external: true },
];

const S05Credits = () => (
    <footer className="bg-ink text-paper pb-10">
        <div className="max-w-[1920px] mx-auto px-6 md:px-12">
            <div className="border-t border-white/15 pt-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
                <p className="label-dark">
                    ©{SITE.year} — {SITE.name}
                </p>

                <nav className="flex items-center flex-wrap gap-6" aria-label="Footer">
                    {LINKS.map(({ label, href, external }) => (
                        <a
                            key={label}
                            href={href}
                            {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                            className="label-dark hover:text-paper transition-colors duration-300 py-2"
                        >
                            {label}
                        </a>
                    ))}
                </nav>

                {/* The last live element on the page */}
                <p className="label-dark flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-go" aria-hidden="true" />
                    {SITE.availability}
                </p>
            </div>
        </div>
    </footer>
);

export default S05Credits;
