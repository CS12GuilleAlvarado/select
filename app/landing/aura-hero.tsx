"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronRight } from "lucide-react";
import { Renderer, Program, Mesh, Triangle } from "ogl";

interface SoftAuroraProps {
  speed?: number;
  scale?: number;
  brightness?: number;
  color1?: string;
  color2?: string;
  noiseFrequency?: number;
  noiseAmplitude?: number;
  bandHeight?: number;
  bandSpread?: number;
  octaveDecay?: number;
  layerOffset?: number;
  colorSpeed?: number;
  enableMouseInteraction?: boolean;
  mouseInfluence?: number;
}

function hexToVec3(hex: string): [number, number, number] {
  const h = hex.replace("#", "");

  return [
    parseInt(h.slice(0, 2), 16) / 255,
    parseInt(h.slice(2, 4), 16) / 255,
    parseInt(h.slice(4, 6), 16) / 255,
  ];
}

const vertexShader = `
attribute vec2 uv;
attribute vec2 position;

varying vec2 vUv;

void main() {
  vUv = uv;
  gl_Position = vec4(position, 0, 1);
}
`;

const fragmentShader = `
precision highp float;

uniform float uTime;
uniform vec3 uResolution;
uniform float uSpeed;
uniform float uScale;
uniform float uBrightness;
uniform vec3 uColor1;
uniform vec3 uColor2;
uniform float uNoiseFreq;
uniform float uNoiseAmp;
uniform float uBandHeight;
uniform float uBandSpread;
uniform float uOctaveDecay;
uniform float uLayerOffset;
uniform float uColorSpeed;
uniform vec2 uMouse;
uniform float uMouseInfluence;
uniform bool uEnableMouse;

#define TAU 6.28318

vec3 gradientHash(vec3 p) {
  p = vec3(
    dot(p, vec3(127.1, 311.7, 234.6)),
    dot(p, vec3(269.5, 183.3, 198.3)),
    dot(p, vec3(169.5, 283.3, 156.9))
  );

  vec3 h = fract(sin(p) * 43758.5453123);

  float phi = acos(2.0 * h.x - 1.0);
  float theta = TAU * h.y;

  return vec3(
    cos(theta) * sin(phi),
    sin(theta) * cos(phi),
    cos(phi)
  );
}

float quinticSmooth(float t) {
  float t2 = t * t;
  float t3 = t * t2;

  return 6.0 * t3 * t2 - 15.0 * t2 * t2 + 10.0 * t3;
}

vec3 cosineGradient(float t, vec3 a, vec3 b, vec3 c, vec3 d) {
  return a + b * cos(TAU * (c * t + d));
}

float perlin3D(
  float amplitude,
  float frequency,
  float px,
  float py,
  float pz
) {
  float x = px * frequency;
  float y = py * frequency;

  float fx = floor(x);
  float fy = floor(y);
  float fz = floor(pz);

  float cx = ceil(x);
  float cy = ceil(y);
  float cz = ceil(pz);

  vec3 g000 = gradientHash(vec3(fx, fy, fz));
  vec3 g100 = gradientHash(vec3(cx, fy, fz));
  vec3 g010 = gradientHash(vec3(fx, cy, fz));
  vec3 g110 = gradientHash(vec3(cx, cy, fz));

  vec3 g001 = gradientHash(vec3(fx, fy, cz));
  vec3 g101 = gradientHash(vec3(cx, fy, cz));
  vec3 g011 = gradientHash(vec3(fx, cy, cz));
  vec3 g111 = gradientHash(vec3(cx, cy, cz));

  float d000 = dot(g000, vec3(x - fx, y - fy, pz - fz));
  float d100 = dot(g100, vec3(x - cx, y - fy, pz - fz));
  float d010 = dot(g010, vec3(x - fx, y - cy, pz - fz));
  float d110 = dot(g110, vec3(x - cx, y - cy, pz - fz));

  float d001 = dot(g001, vec3(x - fx, y - fy, pz - cz));
  float d101 = dot(g101, vec3(x - cx, y - fy, pz - cz));
  float d011 = dot(g011, vec3(x - fx, y - cy, pz - cz));
  float d111 = dot(g111, vec3(x - cx, y - cy, pz - cz));

  float sx = quinticSmooth(x - fx);
  float sy = quinticSmooth(y - fy);
  float sz = quinticSmooth(pz - fz);

  float lx00 = mix(d000, d100, sx);
  float lx10 = mix(d010, d110, sx);
  float lx01 = mix(d001, d101, sx);
  float lx11 = mix(d011, d111, sx);

  float ly0 = mix(lx00, lx10, sy);
  float ly1 = mix(lx01, lx11, sy);

  return amplitude * mix(ly0, ly1, sz);
}

float auroraGlow(float t, vec2 shift) {
  vec2 uv = gl_FragCoord.xy / uResolution.y;

  uv += shift;

  float noiseVal = 0.0;
  float freq = uNoiseFreq;
  float amp = uNoiseAmp;

  vec2 samplePos = uv * uScale;

  for (float i = 0.0; i < 3.0; i += 1.0) {
    noiseVal += perlin3D(
      amp,
      freq,
      samplePos.x,
      samplePos.y,
      t
    );

    amp *= uOctaveDecay;
    freq *= 2.0;
  }

  float yBand = uv.y * 10.0 - uBandHeight * 10.0;

  return 0.3 * max(
    exp(uBandSpread * (1.0 - 1.1 * abs(noiseVal + yBand))),
    0.0
  );
}

void main() {
  vec2 uv = gl_FragCoord.xy / uResolution.xy;

  float t = uSpeed * 0.4 * uTime;

  vec2 shift = vec2(0.0);

  if (uEnableMouse) {
    shift.x = (uMouse.x - 0.5) * uMouseInfluence;

    // AQUÍ ESTÁ EL EFECTO:
    // mouse arriba => aurora baja
    // mouse abajo => aurora sube
    shift.y = -(uMouse.y - 0.5) * uMouseInfluence;
  }

  vec3 col = vec3(0.0);

  col += 0.99 *
    auroraGlow(t, shift) *
    cosineGradient(
      uv.x + uTime * uSpeed * 0.2 * uColorSpeed,
      vec3(0.5),
      vec3(0.5),
      vec3(1.0),
      vec3(0.3, 0.20, 0.20)
    ) *
    uColor1;

  col += 0.99 *
    auroraGlow(t + uLayerOffset, shift) *
    cosineGradient(
      uv.x + uTime * uSpeed * 0.1 * uColorSpeed,
      vec3(0.5),
      vec3(0.5),
      vec3(2.0, 1.0, 0.0),
      vec3(0.5, 0.20, 0.25)
    ) *
    uColor2;

  col *= uBrightness;

  float alpha = clamp(length(col), 0.0, 1.0);

  gl_FragColor = vec4(col, alpha);
}
`;

function SoftAurora({
  speed = 0.55,
  scale = 1.1,
  brightness = 1.2,
  color1 = "#f3761c",
  color2 = "#14373F",
  noiseFrequency = 2,
  noiseAmplitude = 1,
  bandHeight = 0.55,
  bandSpread = 1.4,
  octaveDecay = 0.5,
  layerOffset = 0.25,
  colorSpeed = 1.1,
  enableMouseInteraction = true,
  mouseInfluence = 0.45,
}: SoftAuroraProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const visibleRef = useRef(true);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const el = containerRef.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(
      ([entry]) => {
        visibleRef.current = entry.isIntersecting;
      },
      { rootMargin: "200px 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;

    // Sin WebGL disponible (límite de contextos del navegador/GPU):
    // fallback a gradiente CSS en vez de romper la página.
    let renderer: Renderer;
    try {
      renderer = new Renderer({
        alpha: true,
        premultipliedAlpha: false,
        dpr: Math.min(window.devicePixelRatio, 2),
        powerPreference: "low-power",
      });
      if (!renderer.gl) throw new Error("no-gl");
    } catch {
      setFailed(true);
      return;
    }

    const gl = renderer.gl;

    gl.clearColor(0, 0, 0, 0);

    const currentMouse = [0.5, 0.5];
    let targetMouse = [0.5, 0.5];

    const geometry = new Triangle(gl);

    const program = new Program(gl, {
      vertex: vertexShader,
      fragment: fragmentShader,

      uniforms: {
        uTime: { value: 0 },

        uResolution: {
          value: [
            gl.canvas.width,
            gl.canvas.height,
            gl.canvas.width / gl.canvas.height,
          ],
        },

        uSpeed: { value: speed },
        uScale: { value: scale },
        uBrightness: { value: brightness },

        uColor1: { value: hexToVec3(color1) },
        uColor2: { value: hexToVec3(color2) },

        uNoiseFreq: { value: noiseFrequency },
        uNoiseAmp: { value: noiseAmplitude },

        uBandHeight: { value: bandHeight },
        uBandSpread: { value: bandSpread },

        uOctaveDecay: { value: octaveDecay },

        uLayerOffset: { value: layerOffset },

        uColorSpeed: { value: colorSpeed },

        uMouse: {
          value: new Float32Array([0.5, 0.5]),
        },

        uMouseInfluence: { value: mouseInfluence },

        uEnableMouse: {
          value: enableMouseInteraction,
        },
      },
    });

    const mesh = new Mesh(gl, {
      geometry,
      program,
    });

    function handleMouseMove(e: MouseEvent) {
      const rect = container.getBoundingClientRect();

      targetMouse = [
        (e.clientX - rect.left) / rect.width,
        1 - (e.clientY - rect.top) / rect.height,
      ];
    }

    function resize() {
      renderer.setSize(container.offsetWidth, container.offsetHeight);

      program.uniforms.uResolution.value = [
        gl.canvas.width,
        gl.canvas.height,
        gl.canvas.width / gl.canvas.height,
      ];
    }

    resize();

    window.addEventListener("resize", resize);

    container.addEventListener("mousemove", handleMouseMove);

    container.appendChild(gl.canvas);

    let animationFrameId: number;

    function update(time: number) {
      animationFrameId = requestAnimationFrame(update);

      // Pausa GPU fuera de vista.
      if (!visibleRef.current) return;

      program.uniforms.uTime.value = time * 0.001;

      currentMouse[0] += (targetMouse[0] - currentMouse[0]) * 0.05;
      currentMouse[1] += (targetMouse[1] - currentMouse[1]) * 0.05;

      program.uniforms.uMouse.value[0] = currentMouse[0];
      program.uniforms.uMouse.value[1] = currentMouse[1];

      renderer.render({ scene: mesh });
    }

    animationFrameId = requestAnimationFrame(update);

    // Si el contexto se pierde en caliente, detén el loop sin errores.
    const handleContextLost = (e: Event) => {
      e.preventDefault();
      cancelAnimationFrame(animationFrameId);
    };
    gl.canvas.addEventListener("webglcontextlost", handleContextLost);

    return () => {
      cancelAnimationFrame(animationFrameId);

      gl.canvas.removeEventListener("webglcontextlost", handleContextLost);

      window.removeEventListener("resize", resize);

      container.removeEventListener("mousemove", handleMouseMove);

      if (container.contains(gl.canvas)) {
        container.removeChild(gl.canvas);
      }

      gl.getExtension("WEBGL_lose_context")?.loseContext();
    };
  }, [
    speed,
    scale,
    brightness,
    color1,
    color2,
    noiseFrequency,
    noiseAmplitude,
    bandHeight,
    bandSpread,
    octaveDecay,
    layerOffset,
    colorSpeed,
    enableMouseInteraction,
    mouseInfluence,
  ]);

  // IMPORTANTE:
  // pointer-events-auto para que detecte el mouse
  return (
    <div
      ref={containerRef}
      className="absolute inset-0 z-0 h-full w-full pointer-events-auto"
    >
      {failed && (
        <div
          aria-hidden
          className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_40%,rgba(243,118,28,0.32),transparent_70%),radial-gradient(ellipse_50%_40%_at_70%_60%,rgba(20,55,63,0.9),transparent_70%)]"
        />
      )}
    </div>
  );
}

export default function AuroraHero() {
  return (
    <section className="relative min-h-screen overflow-hidden bg-black text-white">
      {/* BACKGROUND */}

      <SoftAurora />

      {/* Velo verde faqs para completar el trío naranja / violeta / verde */}
      <div className="pointer-events-none absolute -left-[10%] bottom-[-10%] z-0 h-[500px] w-[500px] rounded-full bg-[#14373F]/60 blur-[160px]" />

      {/* CONTENT */}

      <div className="relative z-10 max-w-3xl px-6 pt-60 md:ml-20">
     
        <div className="absolute top-40 left-20">
          <h1 className="text-5xl font-black leading-[0.9] tracking-[-0.05em] md:text-7xl">
            Selectia
            <span className="mt-2 block bg-gradient-to-r from-[#f3761c] via-[#f6a05c] to-[#6ee7b7] bg-clip-text text-transparent">
              es Antiestrés
            </span>
          </h1>
          <p className="mt-8 max-w-2xl text-lg leading-relaxed text-white/70 md:text-xl">
            Los procesos de selección no deberían ser un dolor de cabeza, ni pérdida de tiempo.
            Analiza a los caandidatos y vacantes de manera automática, y encuentra a los mejores talentos para tu empresa.
          </p>
        </div>

        <div className="mt-60 flex flex-col items-center gap-20 sm:flex-row">
      <div className="my-10 flex justify-center">
        <div className="relative flex items-center justify-center">
          <>
            <div className="absolute inset-0 scale-150 animate-ping rounded-full bg-[#f3761c]/40" />
            <div className="absolute inset-0 scale-125 animate-ping rounded-full bg-[#f6b26b]/30 [animation-delay:0.5s]" />
          </>
          <div className="relative flex size-12 items-center justify-center rounded-full border border-[#f3761c]/40 bg-gradient-to-br from-[#f3761c] to-[#d9650f] text-white shadow-[0_0_30px_rgba(243,118,28,0.45)] transition-transform hover:scale-110">
            <ChevronRight className="h-5 w-5" />
          </div>
        </div>
      </div>
         
  <button className="group h-fit cursor-pointer self-center bg-gradient-to-b from-[#f3761c] to-[#d9650f] shadow-[0px_4px_32px_0_rgba(243,118,28,.50)] px-10 py-3 rounded-xl border-[1px] border-[#f3761c]/50 text-white text-2xl font-medium">
        <div className="grid overflow-hidden text-center">
          <p className="col-start-1 row-start-1 whitespace-nowrap transition-transform duration-[1.125s] ease-[cubic-bezier(0.19,1,0.22,1)] group-hover:-translate-y-full">
            Selectia es
          </p>
          <p className="col-start-1 row-start-1 whitespace-nowrap transition-transform duration-[1.125s] ease-[cubic-bezier(0.19,1,0.22,1)] translate-y-full group-hover:translate-y-0">
            Automática
          </p>
        </div>
      </button>
         
        </div>
      </div>
    </section>
  );
}
