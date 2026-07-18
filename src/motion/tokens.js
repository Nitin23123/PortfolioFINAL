/**
 * Motion tokens — the single source of truth for the film's tempo.
 *
 * The motion language has exactly three verbs:
 *   PAPER is placed  → the Settle easing, one of five durations
 *   INK   flows      → simulation output only, never keyframed
 *   MACHINE snaps    → zero duration, state changes instantly
 *
 * No component may declare a raw duration or easing. Changing the
 * film's tempo is an edit to this file and nowhere else.
 */

/** The only five durations in the film (seconds, for Framer Motion). */
export const DUR = {
    /** Micro feedback: label swaps, hairline draws */
    micro: 0.15,
    /** Small object feedback: dims, border shifts, menu exit */
    small: 0.25,
    /** Standard object entrance */
    object: 0.4,
    /** Plate entrance: rows, statements, menu entrance */
    plate: 0.6,
    /** Scene-scale gesture: reserved for the two thesis moments
     *  (hero name, closing imperative) and the loader drain */
    scene: 0.8,
};

/**
 * The Settle — a press plate lowered onto stock.
 * Fast arrival, long deceleration, dead stop. The only easing curve
 * for placed objects. Nothing bounces; nothing eases in-and-out.
 */
export const SETTLE = [0.22, 1, 0.36, 1];

/**
 * The Snap — the Machine voice. Not an easing: the absence of one.
 * Use as a transition of zero duration for log-style state changes.
 */
export const SNAP = { duration: 0 };

/** Fixed stagger intervals (seconds). Never randomized. */
export const STAGGER = {
    /** Menu rows — drumroll, utility tempo */
    drumroll: 0.06,
    /** Unmasking lines of a statement — reading tempo */
    reading: 0.08,
    /** Evidence rows — gallery tempo */
    gallery: 0.1,
};

/** Standard entrance travel distance (px). */
export const RISE = 24;

/** Viewport visibility ratio that triggers a reveal. */
export const REVEAL_AT = 0.2;
