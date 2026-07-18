import { useSyncExternalStore } from 'react';

/**
 * Experience store — the film's entire global state.
 *
 * Deliberately tiny: five values, all low-frequency (≤1Hz). Anything
 * per-frame (scroll velocity, ink data, pointer position) is banned
 * from this store and travels through refs or the event bus instead —
 * the architecture's cardinal rule against re-render storms.
 */

/**
 * @typedef {'loading'|'ready'} Phase
 * @typedef {object} ExperienceState
 * @property {Phase} phase       loader gate: 'loading' until Scene 00 exits
 * @property {string|null} activeScene  registry id of the scene in view
 * @property {boolean} menuOpen  the Intermission overlay
 */

/** @type {ExperienceState} */
let state = {
    phase: 'loading',
    activeScene: null,
    menuOpen: false,
};

const listeners = new Set();

const setState = (partial) => {
    const next = { ...state, ...partial };
    const changed = Object.keys(partial).some((k) => state[k] !== next[k]);
    if (!changed) return;
    state = next;
    listeners.forEach((fn) => fn());
};

const subscribe = (fn) => {
    listeners.add(fn);
    return () => listeners.delete(fn);
};

/** Actions — the only writers. Components never call setState directly. */
export const experienceActions = {
    ready: () => setState({ phase: 'ready' }),
    setActiveScene: (id) => setState({ activeScene: id }),
    openMenu: () => setState({ menuOpen: true }),
    closeMenu: () => setState({ menuOpen: false }),
    toggleMenu: () => setState({ menuOpen: !state.menuOpen }),
};

/**
 * Subscribe to a slice of experience state.
 * Selectors must return primitives so snapshot comparison stays cheap
 * and re-renders only fire when the selected value actually changes.
 *
 * @template T
 * @param {(s: ExperienceState) => T} selector
 * @returns {T}
 */
export const useExperience = (selector) =>
    useSyncExternalStore(subscribe, () => selector(state));

/** Non-reactive read for event handlers and effects. */
export const getExperience = () => state;
