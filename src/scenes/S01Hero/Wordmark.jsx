import { useEffect, useRef } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { sceneGesture } from '../../motion/variants';
import { useCapabilities } from '../../app/providers';

/**
 * Wordmark — the giant NITIN', six independent letters.
 *
 * The h1 stays pointer-events-none so the ink keeps receiving the
 * cursor; hover is resolved by hit-testing against letter rects that
 * are cached in page coordinates (recomputed only on resize and font
 * load — never a layout read inside pointermove). A hovered letter
 * melts out via a direct style write; React renders these letters
 * exactly once.
 */

const WORD = ['N', 'I', 'T', 'I', 'N', '’'];

const Wordmark = () => {
    const { coarsePointer } = useCapabilities();
    const reducedMotion = useReducedMotion();
    const letterRefs = useRef([]);

    useEffect(() => {
        // Touch devices have no hover; letters stay solid.
        if (coarsePointer) return undefined;

        const rects = new Array(WORD.length).fill(null);
        const hidden = new Array(WORD.length).fill(false);

        const cacheRects = () => {
            letterRefs.current.forEach((el, i) => {
                if (!el) return;
                const r = el.getBoundingClientRect();
                rects[i] = {
                    left: r.left + window.scrollX,
                    right: r.right + window.scrollX,
                    top: r.top + window.scrollY,
                    bottom: r.bottom + window.scrollY,
                };
            });
        };

        cacheRects();
        // Metrics shift when the display face lands.
        if ('fonts' in document) document.fonts.ready.then(cacheRects);

        let raf = 0;
        const onPointerMove = (e) => {
            if (raf) return;
            const { pageX, pageY } = e;
            raf = requestAnimationFrame(() => {
                raf = 0;
                for (let i = 0; i < rects.length; i += 1) {
                    const r = rects[i];
                    if (!r) continue;
                    const inside =
                        pageX >= r.left && pageX <= r.right &&
                        pageY >= r.top && pageY <= r.bottom;
                    if (inside !== hidden[i]) {
                        hidden[i] = inside;
                        const el = letterRefs.current[i];
                        if (el) el.style.opacity = inside ? '0' : '1';
                    }
                }
            });
        };

        window.addEventListener('resize', cacheRects);
        window.addEventListener('pointermove', onPointerMove, { passive: true });
        return () => {
            window.removeEventListener('resize', cacheRects);
            window.removeEventListener('pointermove', onPointerMove);
            if (raf) cancelAnimationFrame(raf);
        };
    }, [coarsePointer]);

    const content = WORD.map((char, i) => (
        <span
            key={`${char}-${i}`}
            ref={(el) => {
                letterRefs.current[i] = el;
            }}
            className="inline-block transition-opacity duration-300"
        >
            {char}
        </span>
    ));

    const className =
        'relative z-10 pointer-events-none text-center font-black uppercase ' +
        'leading-[0.8] tracking-[-0.03em] text-[26vw] md:text-[28vw] select-none whitespace-nowrap';

    if (reducedMotion) {
        return <h1 className={className}>{content}</h1>;
    }

    return (
        <motion.h1
            className={className}
            variants={sceneGesture}
            initial="hidden"
            animate="visible"
        >
            {content}
        </motion.h1>
    );
};

export default Wordmark;
