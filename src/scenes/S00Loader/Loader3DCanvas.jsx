import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/**
 * Parametric 3D Heart geometry with smooth extrude curves.
 */
function createHeartGeometry() {
    const shape = new THREE.Shape();
    const x = 0, y = 0;
    shape.moveTo(x + 0.25, y + 0.25);
    shape.bezierCurveTo(x + 0.25, y + 0.25, x + 0.2, y, x, y);
    shape.bezierCurveTo(x - 0.3, y, x - 0.3, y + 0.35, x - 0.3, y + 0.35);
    shape.bezierCurveTo(x - 0.3, y + 0.55, x - 0.1, y + 0.77, x + 0.25, y + 0.95);
    shape.bezierCurveTo(x + 0.6, y + 0.77, x + 0.8, y + 0.55, x + 0.8, y + 0.35);
    shape.bezierCurveTo(x + 0.8, y + 0.35, x + 0.8, y, x + 0.5, y);
    shape.bezierCurveTo(x + 0.35, y, x + 0.25, y + 0.25, x + 0.25, y + 0.25);

    const extrudeSettings = {
        depth: 0.38,
        bevelEnabled: true,
        bevelSegments: 12,
        steps: 3,
        bevelSize: 0.18,
        bevelThickness: 0.18,
    };
    const geom = new THREE.ExtrudeGeometry(shape, extrudeSettings);
    geom.center();
    return geom;
}

const SingleMesh = ({ activeIndex }) => {
    const meshRef = useRef();

    const heartGeom = useMemo(() => createHeartGeometry(), []);
    const starburstGeom = useMemo(() => new THREE.IcosahedronGeometry(1.05, 2), []);
    const torusKnotGeom = useMemo(() => new THREE.TorusKnotGeometry(0.7, 0.26, 160, 32, 2, 3), []);
    const candyGeom = useMemo(() => new THREE.OctahedronGeometry(1.1, 0), []);
    const cubeGeom = useMemo(() => new THREE.BoxGeometry(1.15, 1.15, 1.15), []);
    const crystalGeom = useMemo(() => new THREE.DodecahedronGeometry(1.05, 0), []);

    useFrame((_, delta) => {
        if (meshRef.current) {
            meshRef.current.rotation.x += delta * 4.2;
            meshRef.current.rotation.y += delta * 5.4;
        }
    });

    const items = useMemo(
        () => [
            {
                geom: heartGeom,
                material: new THREE.MeshPhysicalMaterial({
                    color: '#ff1e56',
                    emissive: '#4a0014',
                    emissiveIntensity: 0.15,
                    metalness: 0.9,
                    roughness: 0.1,
                    clearcoat: 0.95,
                    clearcoatRoughness: 0.04,
                    reflectivity: 1.0,
                }),
                scale: [1.35, 1.35, 1.35],
            },
            {
                geom: starburstGeom,
                material: new THREE.MeshPhysicalMaterial({
                    color: '#ffffff',
                    emissive: '#1e293b',
                    emissiveIntensity: 0.1,
                    metalness: 1.0,
                    roughness: 0.03,
                    clearcoat: 1.0,
                    clearcoatRoughness: 0.02,
                    reflectivity: 1.0,
                }),
                scale: [1.3, 1.3, 1.3],
            },
            {
                geom: torusKnotGeom,
                material: new THREE.MeshPhysicalMaterial({
                    color: '#ff007f',
                    emissive: '#3b001e',
                    emissiveIntensity: 0.2,
                    metalness: 0.88,
                    roughness: 0.08,
                    clearcoat: 0.9,
                    clearcoatRoughness: 0.05,
                }),
                scale: [1.25, 1.25, 1.25],
            },
            {
                geom: candyGeom,
                material: new THREE.MeshPhysicalMaterial({
                    color: '#e2e8f0',
                    emissive: '#0f172a',
                    emissiveIntensity: 0.12,
                    metalness: 1.0,
                    roughness: 0.02,
                    clearcoat: 1.0,
                    clearcoatRoughness: 0.01,
                }),
                scale: [1.15, 1.6, 1.15],
            },
            {
                geom: cubeGeom,
                material: new THREE.MeshPhysicalMaterial({
                    color: '#0055ff',
                    emissive: '#001144',
                    emissiveIntensity: 0.2,
                    metalness: 0.92,
                    roughness: 0.07,
                    clearcoat: 0.9,
                    clearcoatRoughness: 0.04,
                }),
                scale: [1.3, 1.3, 1.3],
            },
            {
                geom: crystalGeom,
                material: new THREE.MeshPhysicalMaterial({
                    color: '#00f0ff',
                    emissive: '#003344',
                    emissiveIntensity: 0.2,
                    metalness: 0.95,
                    roughness: 0.03,
                    clearcoat: 1.0,
                    clearcoatRoughness: 0.02,
                }),
                scale: [1.35, 1.35, 1.35],
            },
        ],
        [heartGeom, starburstGeom, torusKnotGeom, candyGeom, cubeGeom, crystalGeom],
    );

    const current = items[activeIndex % items.length];

    return (
        <mesh
            ref={meshRef}
            geometry={current.geom}
            material={current.material}
            scale={current.scale}
        />
    );
};

const Loader3DCanvas = ({ activeIndex }) => {
    return (
        <div className="w-full h-full relative flex items-center justify-center">
            <Canvas
                camera={{ position: [0, 0, 3.4], fov: 38 }}
                gl={{
                    antialias: true,
                    alpha: true,
                    toneMapping: THREE.ACESFilmicToneMapping,
                    toneMappingExposure: 1.25,
                }}
                style={{ background: 'transparent' }}
            >
                {/* General Ambient Light */}
                <ambientLight intensity={0.75} />

                {/* Key Studio Light */}
                <directionalLight position={[4, 6, 4]} intensity={2.8} />

                {/* Warm Fill Light */}
                <directionalLight position={[-4, -3, 2]} intensity={1.2} color="#ffd1a9" />

                {/* Cyan Rim Light (Left Back Kicker) */}
                <directionalLight position={[-5, 5, -4]} intensity={4.5} color="#00f0ff" />

                {/* Magenta/Gold Rim Light (Right Back Kicker) */}
                <directionalLight position={[5, -4, -3]} intensity={3.5} color="#ff007f" />

                {/* Center Specular Glint Point Light */}
                <pointLight position={[0, 0, 3.5]} intensity={2.0} color="#ffffff" />

                <SingleMesh activeIndex={activeIndex} />
            </Canvas>
        </div>
    );
};

export default Loader3DCanvas;
