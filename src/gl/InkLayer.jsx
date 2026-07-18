import { useEffect, useMemo, useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import InkEngine from './sim/InkEngine';
import { events } from '../state/events';
import { getExperience } from '../state/experienceStore';
import { useCapabilities } from '../app/providers';

/**
 * InkLayer — the film's single WebGL surface, hosted by R3F.
 *
 * Renders the wet-edge display material on one fullscreen triangle;
 * the InkEngine runs the fluid passes each frame before R3F draws.
 * The whole layer is an enhancement tier: it mounts only when the
 * host scene decides the device qualifies, and the page is complete
 * without it.
 *
 * Work is gated hard: the sim ticks only while the layer is on
 * screen, the tab is visible, and the menu is closed. Parked means
 * parked — zero GPU submissions.
 */

/** Max sim step: two 60Hz frames. Tab-switch deltas never explode the field. */
const MAX_DT = 1 / 30;

const InkSimulation = ({ hostRef }) => {
    const { gl, size } = useThree();
    const engineRef = useRef(null);
    const gateRef = useRef({ onScreen: true, tabVisible: true });
    const scrollForceRef = useRef(0);
    const meshRef = useRef(null);

    // Engine lifecycle — created once per GL context.
    const engine = useMemo(
        () => new InkEngine(gl, size.width || 1, size.height || 1),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [gl],
    );
    engineRef.current = engine;

    useEffect(() => () => engine.dispose(), [engine]);

    useEffect(() => {
        engine.resize(size.width, size.height);
    }, [engine, size.width, size.height]);

    // Visibility gates: viewport intersection + tab visibility.
    useEffect(() => {
        const gate = gateRef.current;
        const host = hostRef.current;

        const io = new IntersectionObserver(
            ([entry]) => {
                gate.onScreen = entry.isIntersecting;
            },
            { threshold: 0.05 },
        );
        if (host) io.observe(host);

        const onVisibility = () => {
            gate.tabVisible = !document.hidden;
        };
        document.addEventListener('visibilitychange', onVisibility);

        return () => {
            io.disconnect();
            document.removeEventListener('visibilitychange', onVisibility);
        };
    }, [hostRef]);

    // Press Roll input from the master ticker.
    useEffect(
        () =>
            events.on('scroll:velocity', ({ v }) => {
                scrollForceRef.current = v;
            }),
        [],
    );

    // Pointer input — page-coordinate cached rect, no layout reads per move.
    useEffect(() => {
        const host = hostRef.current;
        if (!host) return undefined;

        const rect = { left: 0, top: 0, width: 1, height: 1 };
        const cacheRect = () => {
            const r = host.getBoundingClientRect();
            rect.left = r.left + window.scrollX;
            rect.top = r.top + window.scrollY;
            rect.width = r.width;
            rect.height = r.height;
        };
        cacheRect();

        let last = null;
        const onPointerMove = (e) => {
            const x = e.pageX;
            const y = e.pageY;
            if (last) {
                const dx = (x - last.x) / rect.width;
                const dy = -(y - last.y) / rect.height;
                if (dx !== 0 || dy !== 0) {
                    engineRef.current?.addSplat(
                        (x - rect.left) / rect.width,
                        1 - (y - rect.top) / rect.height,
                        dx,
                        dy,
                    );
                }
            }
            last = { x, y };
        };
        const onPointerLeave = () => {
            last = null;
        };

        window.addEventListener('resize', cacheRect);
        host.addEventListener('pointermove', onPointerMove, { passive: true });
        host.addEventListener('pointerleave', onPointerLeave, { passive: true });
        return () => {
            window.removeEventListener('resize', cacheRect);
            host.removeEventListener('pointermove', onPointerMove);
            host.removeEventListener('pointerleave', onPointerLeave);
        };
    }, [hostRef]);

    useFrame((_, delta) => {
        const gate = gateRef.current;
        if (!gate.onScreen || !gate.tabVisible || getExperience().menuOpen) return;
        engine.setScrollForce(scrollForceRef.current);
        engine.update(Math.min(delta, MAX_DT));
    });

    return (
        <mesh ref={meshRef} geometry={engine.geometry} material={engine.displayMaterial} frustumCulled={false} />
    );
};

/**
 * @param {object} props
 * @param {import('react').RefObject<HTMLElement>} props.hostRef
 *        the scene section that owns pointer input for the ink
 */
const InkLayer = ({ hostRef }) => {
    const { dpr } = useCapabilities();

    return (
        <Canvas
            dpr={dpr}
            flat
            linear
            gl={{
                antialias: false,
                alpha: false,
                depth: false,
                stencil: false,
                powerPreference: 'high-performance',
                preserveDrawingBuffer: false,
            }}
            style={{ position: 'absolute', inset: 0 }}
        >
            <InkSimulation hostRef={hostRef} />
        </Canvas>
    );
};

export default InkLayer;
