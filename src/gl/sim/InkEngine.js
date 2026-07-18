import {
    BufferAttribute,
    BufferGeometry,
    Camera,
    ClampToEdgeWrapping,
    HalfFloatType,
    LinearFilter,
    Mesh,
    NearestFilter,
    RawShaderMaterial,
    RGBAFormat,
    Scene,
    UnsignedByteType,
    Vector2,
    Vector3,
    WebGLRenderTarget,
} from 'three';
import {
    baseVertex,
    splatFragment,
    advectionFragment,
    divergenceFragment,
    pressureFragment,
    gradientSubtractFragment,
    curlFragment,
    vorticityFragment,
    forceFragment,
    displayFragment,
} from './shaders';

/**
 * InkEngine — the fluid solver, framework-free.
 *
 * Owns the ping-pong render targets and the pass pipeline; R3F owns
 * the context and the frame loop. One fullscreen triangle serves every
 * pass (no quad — the diagonal seam of two triangles double-shades).
 *
 * Per frame: queued splats → press-roll force → vorticity → pressure
 * projection → advection. The display material (exposed, not rendered
 * here) then skins the dye through the wet-edge threshold.
 */

const SIM_PARAMS = {
    /** Velocity/pressure grid — 128 is invisible under the threshold. */
    simResolution: 128,
    /** Dye field — the visible resolution of the liquid's edges. */
    dyeResolution: 1024,
    /** Exponential decay: ~4–6s of visible life for a stroke. */
    densityDissipation: 0.55,
    velocityDissipation: 0.28,
    pressureIterations: 20,
    curlStrength: 24,
    /** Splat footprint in aspect-corrected UV². */
    splatRadius: 0.0032,
    /** Pointer delta → grid velocity multiplier. */
    splatForce: 4200,
    /** Press-roll: scroll px/frame → vertical grid force. */
    scrollForceScale: 9,
    scrollForceMax: 220,
    /** Dye density where paper becomes ink. */
    inkThreshold: 0.36,
};

const createFullscreenTriangle = () => {
    const geometry = new BufferGeometry();
    geometry.setAttribute(
        'position',
        new BufferAttribute(new Float32Array([-1, -1, 0, 3, -1, 0, -1, 3, 0]), 3),
    );
    return geometry;
};

class InkEngine {
    /**
     * @param {import('three').WebGLRenderer} renderer
     * @param {number} width  canvas CSS width
     * @param {number} height canvas CSS height
     */
    constructor(renderer, width, height) {
        this.renderer = renderer;
        this.aspect = width / height;
        this.splatQueue = [];
        this.scrollForce = 0;

        // Half-float targets need EXT_color_buffer_float to be renderable
        // on WebGL2; fall back to bytes (softer sim, still correct).
        const gl = renderer.getContext();
        const floatRenderable = Boolean(gl.getExtension('EXT_color_buffer_float'));
        this.targetType = floatRenderable ? HalfFloatType : UnsignedByteType;

        this.scene = new Scene();
        this.camera = new Camera();
        this.geometry = createFullscreenTriangle();
        this.mesh = new Mesh(this.geometry, null);
        this.mesh.frustumCulled = false;
        this.scene.add(this.mesh);

        this.#createTargets(width, height);
        this.#createMaterials();
    }

    #createTarget(w, h, filter) {
        const target = new WebGLRenderTarget(w, h, {
            type: this.targetType,
            format: RGBAFormat,
            minFilter: filter,
            magFilter: filter,
            wrapS: ClampToEdgeWrapping,
            wrapT: ClampToEdgeWrapping,
            depthBuffer: false,
            stencilBuffer: false,
        });
        return target;
    }

    #createPair(w, h, filter) {
        return {
            read: this.#createTarget(w, h, filter),
            write: this.#createTarget(w, h, filter),
            swap() {
                const t = this.read;
                this.read = this.write;
                this.write = t;
            },
        };
    }

    #createTargets(width, height) {
        const sim = SIM_PARAMS.simResolution;
        const simW = Math.round(sim * Math.max(1, this.aspect));
        const simH = sim;
        const dyeH = Math.min(SIM_PARAMS.dyeResolution, height);
        const dyeW = Math.round(dyeH * this.aspect);

        this.simTexel = new Vector2(1 / simW, 1 / simH);
        this.velocity = this.#createPair(simW, simH, LinearFilter);
        this.pressure = this.#createPair(simW, simH, NearestFilter);
        this.divergence = this.#createTarget(simW, simH, NearestFilter);
        this.curl = this.#createTarget(simW, simH, NearestFilter);
        this.dye = this.#createPair(dyeW, dyeH, LinearFilter);
    }

    #material(fragmentShader, uniforms) {
        return new RawShaderMaterial({
            vertexShader: baseVertex,
            fragmentShader,
            uniforms,
            depthTest: false,
            depthWrite: false,
        });
    }

    #createMaterials() {
        const texel = { value: this.simTexel };

        this.splatMat = this.#material(splatFragment, {
            uTarget: { value: null },
            uAspect: { value: this.aspect },
            uPoint: { value: new Vector2() },
            uColor: { value: new Vector3() },
            uRadius: { value: SIM_PARAMS.splatRadius },
        });

        this.advectionMat = this.#material(advectionFragment, {
            uVelocity: { value: null },
            uSource: { value: null },
            uTexelSize: texel,
            uDt: { value: 0 },
            uDissipation: { value: 0 },
        });

        this.divergenceMat = this.#material(divergenceFragment, {
            uVelocity: { value: null },
            uTexelSize: texel,
        });

        this.pressureMat = this.#material(pressureFragment, {
            uPressure: { value: null },
            uDivergence: { value: null },
            uTexelSize: texel,
        });

        this.gradientMat = this.#material(gradientSubtractFragment, {
            uPressure: { value: null },
            uVelocity: { value: null },
            uTexelSize: texel,
        });

        this.curlMat = this.#material(curlFragment, {
            uVelocity: { value: null },
            uTexelSize: texel,
        });

        this.vorticityMat = this.#material(vorticityFragment, {
            uVelocity: { value: null },
            uCurl: { value: null },
            uTexelSize: texel,
            uCurlStrength: { value: SIM_PARAMS.curlStrength },
            uDt: { value: 0 },
        });

        this.forceMat = this.#material(forceFragment, {
            uVelocity: { value: null },
            uForceY: { value: 0 },
            uDt: { value: 0 },
        });

        /** Public: the wet-edge skin, rendered by the host scene. */
        this.displayMaterial = this.#material(displayFragment, {
            uDye: { value: null },
            uVelocity: { value: null },
            uThreshold: { value: SIM_PARAMS.inkThreshold },
        });
    }

    #blit(material, target) {
        this.mesh.material = material;
        this.renderer.setRenderTarget(target);
        this.renderer.render(this.scene, this.camera);
    }

    /**
     * Queue a pointer splat. Coordinates in UV space (y up), deltas as
     * fractions of the canvas per event.
     */
    addSplat(x, y, dx, dy) {
        this.splatQueue.push({ x, y, dx, dy });
        if (this.splatQueue.length > 24) this.splatQueue.shift();
    }

    /** Press-roll input: raw scroll velocity (px/frame, low-passed). */
    setScrollForce(v) {
        const f = v * SIM_PARAMS.scrollForceScale;
        this.scrollForce = Math.max(-SIM_PARAMS.scrollForceMax, Math.min(SIM_PARAMS.scrollForceMax, f));
    }

    #applySplats() {
        const { splatMat } = this;
        for (const s of this.splatQueue) {
            splatMat.uniforms.uPoint.value.set(s.x, s.y);

            // Velocity: pointer delta scaled into grid units.
            splatMat.uniforms.uTarget.value = this.velocity.read.texture;
            splatMat.uniforms.uColor.value.set(
                s.dx * SIM_PARAMS.splatForce,
                s.dy * SIM_PARAMS.splatForce,
                0,
            );
            this.#blit(splatMat, this.velocity.write);
            this.velocity.swap();

            // Dye: white density into the red channel.
            splatMat.uniforms.uTarget.value = this.dye.read.texture;
            splatMat.uniforms.uColor.value.set(0.75, 0, 0);
            this.#blit(splatMat, this.dye.write);
            this.dye.swap();
        }
        this.splatQueue.length = 0;
    }

    /**
     * One simulation step. Call once per rAF while active.
     * @param {number} dt seconds, caller-clamped
     */
    update(dt) {
        const prevTarget = this.renderer.getRenderTarget();
        const prevAutoClear = this.renderer.autoClear;
        this.renderer.autoClear = false;

        this.#applySplats();

        // Press Roll — the page dragging wet ink.
        if (Math.abs(this.scrollForce) > 0.5) {
            this.forceMat.uniforms.uVelocity.value = this.velocity.read.texture;
            this.forceMat.uniforms.uForceY.value = this.scrollForce;
            this.forceMat.uniforms.uDt.value = dt;
            this.#blit(this.forceMat, this.velocity.write);
            this.velocity.swap();
        }

        // Vorticity confinement.
        this.curlMat.uniforms.uVelocity.value = this.velocity.read.texture;
        this.#blit(this.curlMat, this.curl);

        this.vorticityMat.uniforms.uVelocity.value = this.velocity.read.texture;
        this.vorticityMat.uniforms.uCurl.value = this.curl.texture;
        this.vorticityMat.uniforms.uDt.value = dt;
        this.#blit(this.vorticityMat, this.velocity.write);
        this.velocity.swap();

        // Pressure projection.
        this.divergenceMat.uniforms.uVelocity.value = this.velocity.read.texture;
        this.#blit(this.divergenceMat, this.divergence);

        for (let i = 0; i < SIM_PARAMS.pressureIterations; i += 1) {
            this.pressureMat.uniforms.uPressure.value = this.pressure.read.texture;
            this.pressureMat.uniforms.uDivergence.value = this.divergence.texture;
            this.#blit(this.pressureMat, this.pressure.write);
            this.pressure.swap();
        }

        this.gradientMat.uniforms.uPressure.value = this.pressure.read.texture;
        this.gradientMat.uniforms.uVelocity.value = this.velocity.read.texture;
        this.#blit(this.gradientMat, this.velocity.write);
        this.velocity.swap();

        // Advect velocity, then dye.
        this.advectionMat.uniforms.uVelocity.value = this.velocity.read.texture;
        this.advectionMat.uniforms.uSource.value = this.velocity.read.texture;
        this.advectionMat.uniforms.uDt.value = dt;
        this.advectionMat.uniforms.uDissipation.value = SIM_PARAMS.velocityDissipation;
        this.#blit(this.advectionMat, this.velocity.write);
        this.velocity.swap();

        this.advectionMat.uniforms.uVelocity.value = this.velocity.read.texture;
        this.advectionMat.uniforms.uSource.value = this.dye.read.texture;
        this.advectionMat.uniforms.uDissipation.value = SIM_PARAMS.densityDissipation;
        this.#blit(this.advectionMat, this.dye.write);
        this.dye.swap();

        // Hand the fresh fields to the display skin.
        this.displayMaterial.uniforms.uDye.value = this.dye.read.texture;
        this.displayMaterial.uniforms.uVelocity.value = this.velocity.read.texture;

        this.renderer.setRenderTarget(prevTarget);
        this.renderer.autoClear = prevAutoClear;
    }

    /** Rebuild resolution-dependent targets on container resize. */
    resize(width, height) {
        if (width === 0 || height === 0) return;
        this.aspect = width / height;
        this.splatMat.uniforms.uAspect.value = this.aspect;
        [this.velocity, this.pressure, this.dye].forEach((pair) => {
            pair.read.dispose();
            pair.write.dispose();
        });
        this.divergence.dispose();
        this.curl.dispose();
        this.#createTargets(width, height);
    }

    dispose() {
        [this.velocity, this.pressure, this.dye].forEach((pair) => {
            pair.read.dispose();
            pair.write.dispose();
        });
        this.divergence.dispose();
        this.curl.dispose();
        this.geometry.dispose();
        [
            this.splatMat, this.advectionMat, this.divergenceMat, this.pressureMat,
            this.gradientMat, this.curlMat, this.vorticityMat, this.forceMat,
            this.displayMaterial,
        ].forEach((m) => m.dispose());
    }
}

export default InkEngine;
