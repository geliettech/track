// creates soft glowing particles that slowly float, giving a sense of depth.
"use client";
import { Canvas } from "@react-three/fiber";
import { Points, PointMaterial } from "@react-three/drei";
import { useRef, useMemo } from "react";

function FloatingParticles() {
  const ref = useRef();
  const count = 400;

  // Generate random positions once
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count * 3; i++) {
      arr[i] = (Math.random() - 0.5) * 10; // spread out particles
    }
    return arr;
  }, [count]);

  return (
    <group>
      <Points ref={ref} positions={positions} stride={3}>
        <PointMaterial
          transparent
          color="#ffffff"
          size={0.05}
          sizeAttenuation={true}
          depthWrite={false}
        />
      </Points>
    </group>
  );
}

export default function ThreeDBackground() {
  return (
    <div className="absolute inset-0 -z-10 pointer-events-none">
      <Canvas camera={{ position: [0, 0, 5] }} dpr={1} frameloop="demand">
        <FloatingParticles />
      </Canvas>
    </div>
  );
}
