import { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react';
import Lenis from 'lenis';
import { events } from '../state/events';

/* ------------------------------------------------------------------ */
/* Capabilities — device truth, resolved once at boot                  */
/* ------------------------------------------------------------------ */

/**
 * @typedef {object} Capabilities
 * @property {boolean} reducedMotion  prefers-reduced-motion: reduce
 * @property {boolean} coarsePointer  touch-primary device
 * @property {boolean} webgl2         WebGL2 available (enhanced ink tier)
 * @property {number}  dpr            device pixel ratio, capped at 1.5
 * @property {boolean} loaderSeen     Scene 00 already played this session
 */

const LOADER_SESSION_KEY = 'nitin:loader-played';

/** @returns {Capabilities} */
const detectCapabilities = () => {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const coarsePointer =
        window.matchMedia('(pointer: coarse)').matches ||
        window.matchMedia('(hover: none)').matches;

    let webgl2 = false;
    try {
        const probe = document.createElement('canvas');
        webgl2 = probe.getContext('webgl2') !== null;
    } catch {
        webgl2 = false;
    }

    let loaderSeen = false;

    return {
        reducedMotion,
        coarsePointer,
        webgl2,
        dpr: Math.min(window.devicePixelRatio || 1, 1.5),
        loaderSeen: false,
    };
};

/** Persist that Scene 00 has played, so returning visitors skip it. */
export const markLoaderSeen = () => {
    try {
        sessionStorage.setItem(LOADER_SESSION_KEY, '1');
    } catch {
        /* private mode — the count simply plays again next visit */
    }
};

const CapabilitiesContext = createContext(null);

/** Device truth for every conditional in the app — nothing else may
 *  query matchMedia directly. */
export const useCapabilities = () => {
    const caps = useContext(CapabilitiesContext);
    if (!caps) throw new Error('useCapabilities requires <Providers>');
    return caps;
};

/* ------------------------------------------------------------------ */
/* Motion — owns Lenis and the master ticker                           */
/* ------------------------------------------------------------------ */

const MotionContext = createContext({ scrollTo: () => {} });

/** Programmatic scroll (menu cuts, back-to-top). The only Lenis API
 *  the rest of the app is allowed to touch. */
export const useSceneScroll = () => useContext(MotionContext);

const MotionProvider = ({ children }) => {
    const { reducedMotion } = useCapabilities();
    const lenisRef = useRef(null);

    useEffect(() => {
        // Reduced motion: native scroll, no smoothing, no ticker.
        if (reducedMotion) return undefined;

        const lenis = new Lenis({
            duration: 1.2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            smoothWheel: true,
            syncTouch: false,
        });
        lenisRef.current = lenis;

        // Master ticker: one rAF for the whole film. The sim and any
        // scroll-coupled systems subscribe via the event bus.
        let raf;
        let lastScroll = window.scrollY;
        let smoothedVelocity = 0;

        const tick = (time) => {
            lenis.raf(time);

            // Low-pass filtered scroll velocity for the Press Roll force.
            const current = window.scrollY;
            smoothedVelocity = smoothedVelocity * 0.85 + (current - lastScroll) * 0.15;
            lastScroll = current;
            events.emit('scroll:velocity', { v: smoothedVelocity });

            raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);

        return () => {
            cancelAnimationFrame(raf);
            lenis.destroy();
            lenisRef.current = null;
        };
    }, [reducedMotion]);

    const api = useMemo(
        () => ({
            /**
             * @param {string|number|HTMLElement} target
             * @param {object} [options] Lenis scrollTo options
             */
            scrollTo: (target, options) => {
                if (lenisRef.current) lenisRef.current.scrollTo(target, options);
                else {
                    // Reduced-motion path: instant native jump.
                    const el =
                        typeof target === 'string' ? document.querySelector(target) : target;
                    if (typeof el === 'number') window.scrollTo(0, el);
                    else el?.scrollIntoView();
                }
            },
        }),
        [],
    );

    return <MotionContext.Provider value={api}>{children}</MotionContext.Provider>;
};

/* ------------------------------------------------------------------ */
/* Composition root                                                    */
/* ------------------------------------------------------------------ */

/** Provider nesting for the whole film, outermost first:
 *  Capabilities → Motion. Each layer is strippable from the outside in. */
const Providers = ({ children }) => {
    const [caps] = useState(detectCapabilities);

    return (
        <CapabilitiesContext.Provider value={caps}>
            <MotionProvider>{children}</MotionProvider>
        </CapabilitiesContext.Provider>
    );
};

export default Providers;
