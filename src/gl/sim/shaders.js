/**
 * GLSL shader library — the ink's physics and its skin.
 *
 * A standard GPU Navier-Stokes solver (advection / divergence /
 * pressure / vorticity) plus two shaders original to this film:
 *
 *   display  — "Wet Edge / Dry Edge": dye density is thresholded into
 *              solid ink with an edge whose softness follows local
 *              velocity. Moving ink bleeds like a wet stroke; settled
 *              ink dries to a hard boundary. Replaces the CSS
 *              blur+contrast chain entirely (the pre-mortem P0).
 *
 *   force    — "Press Roll": scroll velocity enters the fluid as a
 *              uniform vertical force, so the page being pulled drags
 *              wet ink with it.
 *
 * All passes render onto a single fullscreen triangle. Velocity is
 * stored in grid units/second; dye density lives in the red channel.
 */

export const baseVertex = /* glsl */ `
    precision highp float;

    attribute vec3 position;
    varying vec2 vUv;

    void main () {
        vUv = position.xy * 0.5 + 0.5;
        gl_Position = vec4(position.xy, 0.0, 1.0);
    }
`;

/** Gaussian splat of color into a target — pointer input for dye and velocity. */
export const splatFragment = /* glsl */ `
    precision highp float;

    varying vec2 vUv;
    uniform sampler2D uTarget;
    uniform float uAspect;
    uniform vec2 uPoint;
    uniform vec3 uColor;
    uniform float uRadius;

    void main () {
        vec2 p = vUv - uPoint;
        p.x *= uAspect;
        float gauss = exp(-dot(p, p) / uRadius);
        vec3 base = texture2D(uTarget, vUv).xyz;
        gl_FragColor = vec4(base + gauss * uColor, 1.0);
    }
`;

/** Semi-Lagrangian advection with exponential dissipation. */
export const advectionFragment = /* glsl */ `
    precision highp float;

    varying vec2 vUv;
    uniform sampler2D uVelocity;
    uniform sampler2D uSource;
    uniform vec2 uTexelSize;
    uniform float uDt;
    uniform float uDissipation;

    void main () {
        vec2 coord = vUv - uDt * texture2D(uVelocity, vUv).xy * uTexelSize;
        vec3 result = texture2D(uSource, coord).xyz;
        float decay = exp(-uDissipation * uDt);
        gl_FragColor = vec4(result * decay, 1.0);
    }
`;

export const divergenceFragment = /* glsl */ `
    precision highp float;

    varying vec2 vUv;
    uniform sampler2D uVelocity;
    uniform vec2 uTexelSize;

    void main () {
        float L = texture2D(uVelocity, vUv - vec2(uTexelSize.x, 0.0)).x;
        float R = texture2D(uVelocity, vUv + vec2(uTexelSize.x, 0.0)).x;
        float B = texture2D(uVelocity, vUv - vec2(0.0, uTexelSize.y)).y;
        float T = texture2D(uVelocity, vUv + vec2(0.0, uTexelSize.y)).y;
        float div = 0.5 * (R - L + T - B);
        gl_FragColor = vec4(div, 0.0, 0.0, 1.0);
    }
`;

/** Jacobi iteration for the pressure field. */
export const pressureFragment = /* glsl */ `
    precision highp float;

    varying vec2 vUv;
    uniform sampler2D uPressure;
    uniform sampler2D uDivergence;
    uniform vec2 uTexelSize;

    void main () {
        float L = texture2D(uPressure, vUv - vec2(uTexelSize.x, 0.0)).x;
        float R = texture2D(uPressure, vUv + vec2(uTexelSize.x, 0.0)).x;
        float B = texture2D(uPressure, vUv - vec2(0.0, uTexelSize.y)).x;
        float T = texture2D(uPressure, vUv + vec2(0.0, uTexelSize.y)).x;
        float div = texture2D(uDivergence, vUv).x;
        float pressure = (L + R + B + T - div) * 0.25;
        gl_FragColor = vec4(pressure, 0.0, 0.0, 1.0);
    }
`;

export const gradientSubtractFragment = /* glsl */ `
    precision highp float;

    varying vec2 vUv;
    uniform sampler2D uPressure;
    uniform sampler2D uVelocity;
    uniform vec2 uTexelSize;

    void main () {
        float L = texture2D(uPressure, vUv - vec2(uTexelSize.x, 0.0)).x;
        float R = texture2D(uPressure, vUv + vec2(uTexelSize.x, 0.0)).x;
        float B = texture2D(uPressure, vUv - vec2(0.0, uTexelSize.y)).x;
        float T = texture2D(uPressure, vUv + vec2(0.0, uTexelSize.y)).x;
        vec2 velocity = texture2D(uVelocity, vUv).xy;
        velocity -= 0.5 * vec2(R - L, T - B);
        gl_FragColor = vec4(velocity, 0.0, 1.0);
    }
`;

export const curlFragment = /* glsl */ `
    precision highp float;

    varying vec2 vUv;
    uniform sampler2D uVelocity;
    uniform vec2 uTexelSize;

    void main () {
        float L = texture2D(uVelocity, vUv - vec2(uTexelSize.x, 0.0)).y;
        float R = texture2D(uVelocity, vUv + vec2(uTexelSize.x, 0.0)).y;
        float B = texture2D(uVelocity, vUv - vec2(0.0, uTexelSize.y)).x;
        float T = texture2D(uVelocity, vUv + vec2(0.0, uTexelSize.y)).x;
        float curl = 0.5 * (R - L - T + B);
        gl_FragColor = vec4(curl, 0.0, 0.0, 1.0);
    }
`;

/** Vorticity confinement — restores the small swirls advection smears away. */
export const vorticityFragment = /* glsl */ `
    precision highp float;

    varying vec2 vUv;
    uniform sampler2D uVelocity;
    uniform sampler2D uCurl;
    uniform vec2 uTexelSize;
    uniform float uCurlStrength;
    uniform float uDt;

    void main () {
        float L = texture2D(uCurl, vUv - vec2(uTexelSize.x, 0.0)).x;
        float R = texture2D(uCurl, vUv + vec2(uTexelSize.x, 0.0)).x;
        float B = texture2D(uCurl, vUv - vec2(0.0, uTexelSize.y)).x;
        float T = texture2D(uCurl, vUv + vec2(0.0, uTexelSize.y)).x;
        float C = texture2D(uCurl, vUv).x;

        vec2 force = 0.5 * vec2(abs(T) - abs(B), abs(R) - abs(L));
        force /= length(force) + 0.0001;
        force *= uCurlStrength * C;
        force.y *= -1.0;

        vec2 velocity = texture2D(uVelocity, vUv).xy;
        velocity += force * uDt;
        velocity = clamp(velocity, -1000.0, 1000.0);
        gl_FragColor = vec4(velocity, 0.0, 1.0);
    }
`;

/** Press Roll — scroll velocity as a uniform vertical force on the field. */
export const forceFragment = /* glsl */ `
    precision highp float;

    varying vec2 vUv;
    uniform sampler2D uVelocity;
    uniform float uForceY;
    uniform float uDt;

    void main () {
        vec2 velocity = texture2D(uVelocity, vUv).xy;
        velocity.y += uForceY * uDt;
        gl_FragColor = vec4(velocity, 0.0, 1.0);
    }
`;

/**
 * Wet Edge / Dry Edge display.
 *
 * Paper is white; ink is thresholded dye. Edge softness follows local
 * velocity: moving ink gets a wide soft edge plus a faint wicking halo
 * (a wet stroke bleeding into fiber), still ink tightens to a razor
 * boundary (the decision has dried). The threshold IS the reveal mask —
 * no CSS filters, no blend modes, one opaque pass.
 */
export const displayFragment = /* glsl */ `
    precision highp float;

    varying vec2 vUv;
    uniform sampler2D uDye;
    uniform sampler2D uVelocity;
    uniform float uThreshold;

    void main () {
        float density = texture2D(uDye, vUv).r;
        float speed = length(texture2D(uVelocity, vUv).xy);

        // 0 = dry (settled), 1 = wet (moving)
        float wet = clamp(speed * 0.012, 0.0, 1.0);
        float edge = mix(0.015, 0.14, wet);

        float ink = smoothstep(uThreshold - edge, uThreshold + edge, density);

        // Wicking halo: only while wet, only just outside the boundary.
        float halo = wet
            * smoothstep(uThreshold * 0.3, uThreshold, density)
            * (1.0 - ink) * 0.28;

        float paper = 1.0 - ink - halo;
        gl_FragColor = vec4(vec3(paper), 1.0);
    }
`;
