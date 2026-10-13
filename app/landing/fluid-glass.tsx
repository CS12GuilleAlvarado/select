"use client";

import * as THREE from "three";
import { Canvas, createPortal, useFrame, useThree, ThreeElements } from "@react-three/fiber";

import { useFBO, useScroll, Image, Scroll, Preload, ScrollControls, MeshTransmissionMaterial, Text } from "@react-three/drei";

import { easing } from "maath";

import { memo, useEffect, useRef, useState, ReactNode } from "react";

type MeshProps = ThreeElements["mesh"];

type ZoomMaterial = THREE.Material & {
  zoom: number;
};

type ZoomMesh = THREE.Mesh<THREE.BufferGeometry, ZoomMaterial>;

type ZoomGroup = Omit<THREE.Group, "children"> & {
  children: ZoomMesh[];
};

function FluidGlassLens({ children }: { children?: ReactNode }) {
  const ref = useRef<THREE.Mesh>(null!);

  const buffer = useFBO();

  const { viewport } = useThree();

  const [scene] = useState(() => new THREE.Scene());

  useFrame((state, delta) => {
    const { gl, pointer, camera } = state;

    const v = viewport.getCurrentViewport(camera, [0, 0, 15]);

    const destX = (pointer.x * v.width) / 2;

    const destY = (pointer.y * v.height) / 2;

    easing.damp3(ref.current.position, [destX, destY, 15], 0.12, delta);

    gl.setRenderTarget(buffer);

    gl.render(scene, camera);

    gl.setRenderTarget(null);
  });

  return (
    <>
      {createPortal(children, scene)}

      <mesh scale={[viewport.width, viewport.height, 1]}>
        <planeGeometry />

        <meshBasicMaterial map={buffer.texture} transparent />
      </mesh>

      <mesh ref={ref} scale={0.08} rotation-x={Math.PI / 2}>
        <sphereGeometry args={[1, 128, 128]} />

        <MeshTransmissionMaterial buffer={buffer.texture} transmission={1} roughness={0} thickness={2} ior={1.12} chromaticAberration={0.035} anisotropy={0.008} />
      </mesh>
    </>
  );
}

function Images() {
  const group = useRef<ZoomGroup>(null!);

  const data = useScroll();

  const { height } = useThree((s) => s.viewport);

  useFrame(() => {
    if (!group.current) return;

    group.current.children.forEach((child) => {
      child.material.zoom = 1 + data.offset * 0.25;
    });
  });

  return (
    <group ref={group}>
      <Image position={[-2, 0, 0]} scale={[3, height / 1.1]} url="/img/sele11.jpg" transparent />

      <Image position={[2, 0, 2]} scale={3} url="/img/sele10.jpg" transparent />

      <Image position={[-1.5, -height, 5]} scale={[1.5, 3]} url="/img/sele9.jpg" transparent />
    </group>
  );
}

function Typography() {
  return (
    <Text position={[0, 0, 12]} fontSize={0.55} letterSpacing={-0.05} color="white" anchorX="center" anchorY="middle">
      FLUID GLASS
    </Text>
  );
}

export default function FluidGlassDemo() {
  return (
    <div
      className="
relative
w-full
h-screen
overflow-hidden
bg-[#09090f]
"
    >
      <Canvas
        camera={{
          position: [0, 0, 20],

          fov: 10,
        }}
        gl={{
          alpha: true,
          antialias: true,
        }}
      >
        <ScrollControls pages={3} distance={0.4} damping={0.15}>
          <FluidGlassLens>
            <Scroll>
              <Typography />

              <Images />
            </Scroll>

            <Preload />
          </FluidGlassLens>
        </ScrollControls>
      </Canvas>
    </div>
  );
}
