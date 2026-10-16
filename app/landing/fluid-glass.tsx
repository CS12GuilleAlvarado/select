"use client";

import * as THREE from "three";
import { Canvas, createPortal, useFrame, useThree, ThreeElements } from "@react-three/fiber";

import { useFBO, useScroll, Scroll, ScrollControls, Preload, useTexture, MeshTransmissionMaterial, Text } from "@react-three/drei";

import { easing } from "maath";

import { memo, useEffect, useMemo, useRef, useState, ReactNode } from "react";

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

/** Layout de cards relativo al viewport: padding exterior simétrico,
 *  gap central pequeño, izquierda un poco arriba y derecha un poco abajo. */
function useCardLayout() {
  const { height, width } = useThree((s) => s.viewport);
  const pixelHeight = useThree((s) => s.size.height);
  const pad = 0.35;
  const gap = 0.3;
  const cardW = (width - pad * 2 - gap) / 2;
  // h-full: alto exacto del viewport.
  const cardH = height;
  // pt-40px en la imagen derecha: 40px CSS convertidos a unidades 3D.
  const pt40 = (height / pixelHeight) * 40;
  const leftX = -width / 2 + pad + cardW / 2;
  const rightX = width / 2 - pad - cardW / 2;
  const leftY = 0.75 - (300 * height) / pixelHeight;
const rightY = 0.75 - 1.65;
  return { cardW, cardH, halfH: height / 2, leftX, rightX, leftY, rightY };
}

/** Rectángulo redondeado centrado en el origen. */
function roundedRectShape(w: number, h: number, r: number) {
  const s = new THREE.Shape();
  const x = -w / 2;
  const y = -h / 2;
  s.moveTo(x + r, y);
  s.lineTo(x + w - r, y);
  s.quadraticCurveTo(x + w, y, x + w, y + r);
  s.lineTo(x + w, y + h - r);
  s.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  s.lineTo(x + r, y + h);
  s.quadraticCurveTo(x, y + h, x, y + h - r);
  s.lineTo(x, y + r);
  s.quadraticCurveTo(x, y, x + r, y);
  return s;
}

/** Geometría de card con esquinas redondeadas y UVs normalizados 0..1. */
function useRoundedCardGeometry(w: number, h: number, r: number) {
  const geo = useMemo(() => {
    const g = new THREE.ShapeGeometry(roundedRectShape(w, h, r), 12);
    const pos = g.attributes.position as THREE.BufferAttribute;
    const uv = g.attributes.uv as THREE.BufferAttribute;
    for (let i = 0; i < uv.count; i++) {
      uv.setXY(i, (pos.getX(i) + w / 2) / w, (pos.getY(i) + h / 2) / h);
    }
    uv.needsUpdate = true;
    return g;
  }, [w, h, r]);

  useEffect(() => () => geo.dispose(), [geo]);

  return geo;
}

function Images() {
  const data = useScroll();

  const { cardW, cardH, leftX, rightX, leftY, rightY } = useCardLayout();
  const geo = useRoundedCardGeometry(cardW, cardH * 1.5, 0.28);
  const [texL, texR] = useTexture(["/img/glass1.png", "/img/glass2.png"]);

  useEffect(() => {
    [texL, texR].forEach((t) => {
      t.colorSpace = THREE.SRGBColorSpace;
    });
  }, [texL, texR]);

  useFrame(() => {
    // Zoom con el scroll (equivale al zoom del Image anterior).
    const r = 1 / (1 + data.offset * 0.25);
    [texL, texR].forEach((t) => {
      t.repeat.set(r, r);
      t.offset.set((1 - r) / 2, (1 - r) / 2);
    });
  });

  return (
    <group>
      <mesh geometry={geo} position={[leftX, leftY, 0]}>
        <meshBasicMaterial map={texL} />
      </mesh>
      <mesh geometry={geo} position={[rightX, rightY, 0]}>
        <meshBasicMaterial map={texR} />
      </mesh>
    </group>
  );
}

/** Etiquetas 3D que acompañan el scroll junto a las imágenes. */
function Labels() {
  const { cardW, cardH, halfH, leftX, rightX, leftY, rightY } = useCardLayout();

  const leftFontSize = Math.max(0.18, Math.min(0.48, cardW / 7.5));
  const rightFontSize = Math.max(0.18, Math.min(0.48, cardW / 7.5));

  // Sujetos al viewport: siempre visibles y sobre su imagen.
  // Ajuste fino: súbelo/bájalo tocando este número (unidades 3D; 0.1 ≈ 25px).
  const leftLabelLift = 0.12;
  const leftLabelY = Math.min(leftY + cardH / 2 + 0.3, halfH - 0.4) + leftLabelLift;
  const rightLabelY = Math.max(rightY - cardH / 2 + 0.6, -halfH + 0.4);
  // EMPRESAS no va centrado: alineado a la derecha, sobresaliendo un poco.
  const rightLabelX = rightX + cardW / 2 + 0.25;

  // Resplandor naranja sutil detrás de cada etiqueta (efecto tipo backdrop).
  const [glowTex, setGlowTex] = useState<THREE.Texture | null>(null);
  useEffect(() => {
    const c = document.createElement("canvas");
    c.width = c.height = 128;
    const ctx = c.getContext("2d");
    if (!ctx) return;
    const g = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
    g.addColorStop(0, "rgba(243,118,28,0.55)");
    g.addColorStop(0.5, "rgba(243,118,28,0.22)");
    g.addColorStop(1, "rgba(243,118,28,0)");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, 128, 128);
    const t = new THREE.CanvasTexture(c);
    setGlowTex(t);
    return () => {
      t.dispose();
    };
  }, []);

  const leftGlowW = leftFontSize * 12 * 0.7 + 0.6;
  const rightGlowW = rightFontSize * 8 * 0.7 + 0.6;

  return (
    <group>
      {glowTex && (
        <mesh position={[leftX, leftLabelY, 0.42]}>
          <planeGeometry args={[leftGlowW, leftFontSize * 2.8]} />
          <meshBasicMaterial map={glowTex} transparent depthWrite={false} />
        </mesh>
      )}
      <Text
        position={[leftX, leftLabelY, 0.5]}
        font="/fonts/nunito-extrabold.woff"
        fontSize={leftFontSize}
        letterSpacing={0.05}
        color="#ffe0bd"
        fillOpacity={0.92}
        anchorX="center"
        anchorY="middle"
      >
        RECLUTADORES
      </Text>
      {glowTex && (
        <mesh position={[rightLabelX - (rightFontSize * 8 * 0.62) / 2, rightLabelY, 0.42]}>
          <planeGeometry args={[rightGlowW, rightFontSize * 2.8]} />
          <meshBasicMaterial map={glowTex} transparent depthWrite={false} />
        </mesh>
      )}
      <Text
        position={[rightLabelX, rightLabelY, 0.5]}
        font="/fonts/nunito-extrabold.woff"
        fontSize={rightFontSize}
        letterSpacing={0.05}
        color="#ffe0bd"
        fillOpacity={0.92}
        anchorX="right"
        anchorY="middle"
      >
        EMPRESAS
      </Text>
    </group>
  );
}
<div className="pt-4 pointer-events-none absolute z-10 max-w-sm md:top-0">
  <h2 className="text-2xl font-extrabold text-white md:text-3xl">
    Reclutadores × Empresas
  </h2>
  <p className="mt-2 text-sm leading-relaxed text-white/70">
    La plataforma donde el talento y las compañías se encuentran en un
    mismo flujo.
  </p>
</div>


export default function FluidGlassDemo() {
  return (
    <div
      className="
relative
w-full
px-8
py-20
h-screen
overflow-hidden
bg-black
fluid-glass-no-bar
"
    >
      {/* Encabezado superior derecho: texto plano, sin contenedor */}
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
              <Images />

              <Labels />
            </Scroll>

            <Preload />
          </FluidGlassLens>
        </ScrollControls>
      </Canvas>
    </div>
  );
}
