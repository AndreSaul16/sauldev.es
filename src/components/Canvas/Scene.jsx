import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Stars, Float } from '@react-three/drei';

const Scene = () => {
    const groupRef = useRef();

    useFrame((state) => {
        const t = state.clock.getElapsedTime();
        // Gentle rotation
        groupRef.current.rotation.y = t * 0.05;
    });

    return (
        <group ref={groupRef}>
            <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />

            <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
                <mesh position={[2, 2, -5]}>
                    <icosahedronGeometry args={[1, 0]} />
                    <meshStandardMaterial color="#00f3ff" wireframe transparent opacity={0.3} />
                </mesh>
            </Float>

            <Float speed={3} rotationIntensity={1} floatIntensity={0.5}>
                <mesh position={[-3, -2, -4]}>
                    <octahedronGeometry args={[1, 0]} />
                    <meshStandardMaterial color="#bd00ff" wireframe transparent opacity={0.3} />
                </mesh>
            </Float>
        </group>
    );
};

export default Scene;
