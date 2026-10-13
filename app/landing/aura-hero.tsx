"use client";

import { useEffect, useRef } from "react";
import { ArrowRight, Sparkles } from "lucide-react";
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
  color1 = "#4F46E5",
  color2 = "#7C3AED",
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

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;

    const renderer = new Renderer({
      alpha: true,
      premultipliedAlpha: false,
      dpr: Math.min(window.devicePixelRatio, 2),
    });

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

      program.uniforms.uTime.value = time * 0.001;

      currentMouse[0] += (targetMouse[0] - currentMouse[0]) * 0.05;
      currentMouse[1] += (targetMouse[1] - currentMouse[1]) * 0.05;

      program.uniforms.uMouse.value[0] = currentMouse[0];
      program.uniforms.uMouse.value[1] = currentMouse[1];

      renderer.render({ scene: mesh });
    }

    animationFrameId = requestAnimationFrame(update);

    return () => {
      cancelAnimationFrame(animationFrameId);

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
    />
  );
}

export default function AuroraHero() {
  return (
    <section className="relative min-h-screen overflow-hidden bg-[#050816] text-white">
      {/* BACKGROUND */}

      <SoftAurora />

      {/* CONTENT */}

      <div className="max-w-3xl pt-60 px-6 md:ml-20">
        <div className="mb-20 inline-flex items-center gap-3 absolute rounded-full border border-indigo-400/20 bg-indigo-500/10 px-5 py-2 backdrop-blur-2xl">
          <Sparkles className="h-4 w-4 text-indigo-300" />

          <span className="text-sm font-medium text-indigo-100">
            Interactive Aurora Experience
          </span>
        </div>
        <div className="absolute top-80 left-20">
          <h1 className="text-5xl font-black leading-[0.9] tracking-[-0.05em] md:text-7xl">
            Dynamic
            <span className="mt-2 block bg-gradient-to-r from-indigo-300 via-violet-200 to-indigo-500 bg-clip-text text-transparent">
              Cursor Motion
            </span>
          </h1>
          <p className="mt-8 max-w-2xl text-lg leading-relaxed text-indigo-100/75 md:text-xl">
            Move your cursor vertically and watch the aurora react naturally in
            real time with cinematic smoothness and futuristic motion shaders.
          </p>
        </div>

        <div className="mt-90 flex flex-col gap-5 sm:flex-row">
          <button className="group relative overflow-hidden rounded-[2rem] border border-indigo-300/20 bg-gradient-to-br from-indigo-500 to-violet-600 px-8 py-5 font-semibold text-white shadow-[0_0_80px_rgba(99,102,241,0.55)] transition-all duration-500 hover:scale-[1.03]">
            <span className="absolute inset-0 bg-white/10 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

            <span className="relative z-10 flex items-center gap-3">
              Launch Experience
              <ArrowRight className="h-5 w-5 transition-transform duration-500 group-hover:translate-x-1" />
            </span>
          </button>

          <button className="group relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/5 px-8 py-5 backdrop-blur-2xl transition-all duration-500 hover:border-indigo-400/50 hover:bg-indigo-500/10 hover:shadow-[0_0_50px_rgba(99,102,241,0.25)]">
            <span className="absolute inset-[1px] rounded-[1.9rem] border border-white/5" />

            <span className="relative z-10 text-white">Explore Technology</span>
          </button>
        </div>
      </div>
    </section>
  );
}
