/**
 * Variant factories — every Framer Motion variant in the film is
 * generated here from motion tokens. Components import variants;
 * they never write durations, easings, or distances of their own.
 */
import { DUR, SETTLE, STAGGER, RISE } from './tokens';

/**
 * A placed object: rises RISE px and settles. The standard entrance.
 * @param {number} [duration] one of the DUR values
 * @param {number} [delay] seconds
 */
export const settleIn = (duration = DUR.object, delay = 0) => ({
    hidden: { opacity: 0, y: RISE },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration, delay, ease: SETTLE },
    },
});

/**
 * A parent that staggers its settled children at a fixed interval.
 * @param {number} [interval] one of the STAGGER values
 */
export const staggerParent = (interval = STAGGER.gallery) => ({
    hidden: {},
    visible: { transition: { staggerChildren: interval } },
});

/**
 * A line of a statement unmasking upward from behind a clean edge —
 * a sheet lifted off a print. Children of a staggerParent(reading).
 */
export const unmaskLine = {
    hidden: { y: '110%' },
    visible: {
        y: '0%',
        transition: { duration: DUR.plate, ease: SETTLE },
    },
};

/**
 * The scene-scale gesture. Reserved: hero name, closing imperative,
 * loader drain. Using it elsewhere dilutes the film's two bookends.
 */
export const sceneGesture = {
    hidden: { opacity: 0, y: RISE * 2 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: DUR.scene, ease: SETTLE },
    },
};

/** Full-viewport sheet exit: the loader draining upward off the page. */
export const sheetDrainUp = {
    exit: {
        y: '-100%',
        transition: { duration: DUR.scene * 0.75, ease: SETTLE },
    },
};
