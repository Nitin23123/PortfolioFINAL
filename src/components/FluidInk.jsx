import { useEffect, useRef, useState } from 'react';
import WebGLFluidEnhanced from 'webgl-fluid-enhanced';

/**
 * FluidInk — the hero's white cover with a liquid cursor cut through it.
 *
 * The GPU fluid sim renders an opaque canvas: white surface, solid black
 * liquid where the cursor flows (blur+contrast threshold = gooey edges).
 * The wrapper's mix-blend-mode: screen turns those black liquid areas into
 * transparent windows, revealing the layer beneath (the NITIN' materials
 * video). Where the sim can't run (touch / reduced-motion / no WebGL) a
 * plain white cover renders instead, hiding the video entirely.
 */
const FluidInk = () => {
    const containerRef = useRef(null);
    const [active, setActive] = useState(false);

    useEffect(() => {
        const isTouch = window.matchMedia('(pointer: coarse)').matches;
        const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (isTouch || reducedMotion || !containerRef.current) return;

        let sim;
        try {
            sim = new WebGLFluidEnhanced(containerRef.current);
            sim.setConfig({
                // white dye on black, inverted → white cover, black liquid
                colorPalette: ['#FFFFFF'],
                inverted: true,
                transparent: false,
                backgroundColor: '#000000',
                colorful: false,
                bloom: false,
                sunrays: false,
                shading: false,              // flat ink, no faux-3D lighting
                hover: true,                 // emit on move, no click needed
                brightness: 1,
                densityDissipation: 0.68,    // liquid lingers much longer before healing
                velocityDissipation: 0.9,    // flow keeps traveling after the cursor stops
                curl: 32,                    // swirl amount
                splatRadius: 0.45,           // broad, wide strokes
                splatForce: 6500,
                pressure: 0.8,
                simResolution: 128,
                dyeResolution: 1024,
            });
            sim.start();

            // noth.in-style reveal mask: blur smooths the dye field, then a
            // hard contrast thresholds it — fully black inside the liquid,
            // white outside, thin soft edge (their uEdgeWidth/uEdgeSoftness
            // smoothstep, approximated in CSS)
            const canvas = containerRef.current.querySelector('canvas');
            if (canvas) canvas.style.filter = 'blur(6px) invert(1) contrast(14)';

            setActive(true); // canvas takes over as the cover
        } catch {
            return; // no WebGL — the fallback white cover stays
        }

        return () => {
            try { sim.stop(); } catch { /* already stopped */ }
        };
    }, []);

    return (
        <>
            {/* outer div keeps the effect out of the flex flow — the library
                rewrites inline styles on whatever element it's given, so it
                gets a sacrificial inner div instead.
                -inset hides the blur's edge halo outside the visible area.
                mix-blend-screen: white covers, black reveals the video below */}
            <div aria-hidden="true" className="absolute -inset-6 z-[2] overflow-hidden mix-blend-screen">
                <div ref={containerRef} className="w-full h-full" />
            </div>

            {/* fallback white cover until (or unless) the sim is running */}
            {!active && <div aria-hidden="true" className="absolute inset-0 z-[3] bg-paper" />}
        </>
    );
};

export default FluidInk;
