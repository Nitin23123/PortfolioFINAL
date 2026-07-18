/**
 * Event bus — the high-frequency channel between worlds.
 *
 * GL ↔ DOM messages (splat requests, erosion frames, scroll velocity)
 * travel here as fire-and-forget events. Nothing on this bus touches
 * React state, so nothing on this bus can cause a render.
 *
 * Known channels (documented, not enforced):
 *   'ink:splat'    {x, y, dx, dy}   pointer poured ink
 *   'ink:stamp'    {x, y}           the apostrophe seal (copy-email)
 *   'scroll:velocity' {v}           low-pass filtered, from MotionProvider
 */

const channels = new Map();

export const events = {
    /**
     * @param {string} channel
     * @param {(payload: any) => void} handler
     * @returns {() => void} unsubscribe
     */
    on(channel, handler) {
        if (!channels.has(channel)) channels.set(channel, new Set());
        channels.get(channel).add(handler);
        return () => channels.get(channel)?.delete(handler);
    },

    /**
     * @param {string} channel
     * @param {any} [payload]
     */
    emit(channel, payload) {
        channels.get(channel)?.forEach((fn) => fn(payload));
    },
};
