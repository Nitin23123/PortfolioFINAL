/**
 * Scene registry — the film's reel order.
 *
 * The single source of truth for scene identity: plate numbers, DOM
 * ids, menu labels, and hints. The Intermission menu, the plate
 * indices, active-scene tracking, and deep links all read from here.
 *
 * Titles are visitor-language (a menu is orientation, not poetry);
 * the film voice lives in each plate's annotation instead.
 *
 * Adding a scene to the film = adding a line to this array.
 */

export const SCENES = [
    {
        id: 'evidence',
        plate: '01',
        title: 'Work',
        hint: 'shipped projects, live',
        menu: true,
    },
    {
        id: 'author',
        plate: '02',
        title: 'About',
        hint: 'experience, bio, cv',
        menu: true,
    },
    {
        id: 'capabilities',
        plate: '03',
        title: 'Stack',
        hint: 'systems, tools, hardening',
        menu: true,
    },
    {
        id: 'invitation',
        plate: '04',
        title: 'Contact',
        hint: 'email, linkedin',
        menu: true,
    },
];

/** @param {string} id */
export const getScene = (id) => SCENES.find((s) => s.id === id) ?? null;

/** Machine-voice plate label, e.g. "( 01 ) — WORK". */
export const plateLabel = (id) => {
    const scene = getScene(id);
    return scene ? `( ${scene.plate} ) — ${scene.title}` : '';
};
