"use client";

import { useEffect, useRef, useState } from "react";
import { Radar as RadarIcon } from "lucide-react";
import { Renderer, Program, Mesh, Triangle } from "ogl";

/* =========================
   RADAR SHADER
========================= */

interface RadarProps {
  speed?: number;
  scale?: number;
  ringCount?: number;
  spokeCount?: number;
  ringThickness?: number;
  spokeThickness?: number;
  sweepSpeed?: number;
  sweepWidth?: number;
  sweepLobes?: number;
  color?: string;
  backgroundColor?: string;
  falloff?: number;
  brightness?: number;
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
  gl_Position = vec4(position, 0.0, 1.0);
}
`;

const fragmentShader = `
precision highp float;

uniform float uTime;
uniform vec3 uResolution;

uniform float uSpeed;
uniform float uScale;

uniform float uRingCount;
uniform float uSpokeCount;

uniform float uRingThickness;
uniform float uSpokeThickness;

uniform float uSweepSpeed;
uniform float uSweepWidth;
uniform float uSweepLobes;

uniform vec3 uColor;
uniform vec3 uBgColor;

uniform float uFalloff;
uniform float uBrightness;

uniform vec2 uMouse;
uniform float uMouseInfluence;

uniform bool uEnableMouse;

#define TAU 6.28318530718

float random(vec2 st){
  return fract(
    sin(dot(st.xy, vec2(12.9898,78.233)))
    * 43758.5453123
  );
}

void main() {

  vec2 st = gl_FragCoord.xy / uResolution.xy;

  st = st * 2.0 - 1.0;

  st.x *= uResolution.x / uResolution.y;

  /* Mouse movement */

  if(uEnableMouse){

    vec2 mShift = (uMouse * 2.0 - 1.0);

    mShift.x *= uResolution.x / uResolution.y;

    st -= mShift * uMouseInfluence;
  }

  st *= uScale;

  float dist = length(st);

  float theta = atan(st.y, st.x);

  float t = uTime * uSpeed;

  /* Rings */

  float ringPhase = dist * uRingCount - t;

  float ringDist = abs(fract(ringPhase) - 0.5);

  float ringGlow =
    1.0 -
    smoothstep(
      0.0,
      uRingThickness,
      ringDist
    );

  /* Spokes */

  float spokeAngle =
    abs(
      fract(theta * uSpokeCount / TAU + 0.5)
      - 0.5
    )
    * TAU
    / uSpokeCount;

  float arcDist = spokeAngle * dist;

  float spokeGlow =
    (
      1.0 -
      smoothstep(
        0.0,
        uSpokeThickness,
        arcDist
      )
    )
    * smoothstep(0.0, 0.08, dist);

  /* Mouse directed sweep */

  vec2 mousePos = (uMouse * 2.0 - 1.0);

  mousePos.x *= uResolution.x / uResolution.y;

  float mouseAngle = atan(mousePos.y, mousePos.x);

  float sweepPhase =
    mouseAngle
    + t * 0.15;

  float sweep =
    cos(theta - sweepPhase);

  float sweepBeam =
    pow(
      max(sweep, 0.0),
      uSweepWidth
    );

  /* Outer fade */

  float fade =
    smoothstep(1.1, 0.82, dist)
    * pow(
      max(1.0 - dist, 0.0),
      uFalloff
    );

  /* =========================
     RADAR POINTS
  ========================= */

  vec2 p1 = vec2(0.28, 0.12);
  vec2 p2 = vec2(-0.22, 0.34);
  vec2 p3 = vec2(-0.38, -0.16);
  vec2 p4 = vec2(0.14, -0.28);

  float blink1 = 0.5 + 0.5 * sin(t * 2.8);
  float blink2 = 0.5 + 0.5 * sin(t * 3.7 + 1.5);
  float blink3 = 0.5 + 0.5 * sin(t * 2.2 + 2.2);
  float blink4 = 0.5 + 0.5 * sin(t * 4.1 + 0.8);

  float point1 =
    0.025 / length(st - p1)
    * blink1;

  float point2 =
    0.025 / length(st - p2)
    * blink2;

  float point3 =
    0.025 / length(st - p3)
    * blink3;

  float point4 =
    0.025 / length(st - p4)
    * blink4;

  float points =
    point1
    + point2
    + point3
    + point4;

  /* Final */

  float intensity =
    max(
      (
        ringGlow
        + spokeGlow
        + sweepBeam
        + points
      )
      * fade
      * uBrightness,
      0.0
    );

  /* Electric bloom */

  intensity += sweepBeam * 0.12;

  vec3 radarCol =
  uColor * (ringGlow + spokeGlow + sweepBeam) * fade * uBrightness;

vec3 pointColor =
 vec3(0.953, 0.463, 0.110) * points * 0.8;

vec3 col =
  radarCol
  + pointColor
  + uBgColor;
  float alpha =
    clamp(length(col), 0.0, 1.0);

  gl_FragColor = vec4(col, alpha);
}
`;

function Radar({
  speed = 0.7,
  scale = 0.72,
  ringCount = 18,
  spokeCount = 18,
  ringThickness = 0.03,
  spokeThickness = 0.008,
  sweepSpeed = 1.2,
  sweepWidth = 8,
  sweepLobes = 1,
  color = "#f3761c",
  backgroundColor = "#000000",
  falloff = 3,
  brightness = 0.9,
  enableMouseInteraction = true,
  mouseInfluence = 0.22,
}: RadarProps) {
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

    // Sin WebGL disponible: fallback a gradiente CSS en vez de romper la página.
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

    function handleMouseMove(e: MouseEvent) {
      const rect = gl.canvas.getBoundingClientRect();

      targetMouse = [
        (e.clientX - rect.left) / rect.width,
        1.0 - (e.clientY - rect.top) / rect.height,
      ];
    }

    function handleMouseLeave() {
      targetMouse = [0.5, 0.5];
    }

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

        uRingCount: { value: ringCount },

        uSpokeCount: { value: spokeCount },

        uRingThickness: {
          value: ringThickness,
        },

        uSpokeThickness: {
          value: spokeThickness,
        },

        uSweepSpeed: {
          value: sweepSpeed,
        },

        uSweepWidth: {
          value: sweepWidth,
        },

        uSweepLobes: {
          value: sweepLobes,
        },

        uColor: {
          value: hexToVec3(color),
        },

        uBgColor: {
          value: hexToVec3(backgroundColor),
        },

        uFalloff: {
          value: falloff,
        },

        uBrightness: {
          value: brightness,
        },

        uMouse: {
          value: new Float32Array([0.5, 0.5]),
        },

        uMouseInfluence: {
          value: mouseInfluence,
        },

        uEnableMouse: {
          value: enableMouseInteraction,
        },
      },
    });

    function resize() {
      renderer.setSize(container.offsetWidth, container.offsetHeight);

      program.uniforms.uResolution.value = [
        gl.canvas.width,
        gl.canvas.height,
        gl.canvas.width / gl.canvas.height,
      ];
    }

    window.addEventListener("resize", resize);

    resize();

    const mesh = new Mesh(gl, {
      geometry,
      program,
    });

    container.appendChild(gl.canvas);

    if (enableMouseInteraction) {
      gl.canvas.addEventListener("mousemove", handleMouseMove);

      gl.canvas.addEventListener("mouseleave", handleMouseLeave);
    }

    let animationFrameId: number;

    function update(time: number) {
      animationFrameId = requestAnimationFrame(update);

      // Pausa GPU fuera de vista.
      if (!visibleRef.current) return;

      program.uniforms.uTime.value = time * 0.001;

      currentMouse[0] += 0.05 * (targetMouse[0] - currentMouse[0]);

      currentMouse[1] += 0.05 * (targetMouse[1] - currentMouse[1]);

      program.uniforms.uMouse.value[0] = currentMouse[0];

      program.uniforms.uMouse.value[1] = currentMouse[1];

      renderer.render({
        scene: mesh,
      });
    }

    animationFrameId = requestAnimationFrame(update);

    const handleContextLost = (e: Event) => {
      e.preventDefault();
      cancelAnimationFrame(animationFrameId);
    };
    gl.canvas.addEventListener("webglcontextlost", handleContextLost);

    return () => {
      cancelAnimationFrame(animationFrameId);

      gl.canvas.removeEventListener("webglcontextlost", handleContextLost);

      window.removeEventListener("resize", resize);

      if (enableMouseInteraction) {
        gl.canvas.removeEventListener("mousemove", handleMouseMove);

        gl.canvas.removeEventListener("mouseleave", handleMouseLeave);
      }

      container.removeChild(gl.canvas);

      gl.getExtension("WEBGL_lose_context")?.loseContext();
    };
  }, [
    speed,
    scale,
    ringCount,
    spokeCount,
    ringThickness,
    spokeThickness,
    sweepSpeed,
    sweepWidth,
    sweepLobes,
    color,
    backgroundColor,
    falloff,
    brightness,
    enableMouseInteraction,
    mouseInfluence,
  ]);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 h-full w-full scale-[1.15] translate-x-[18%]"
    >
      {failed && (
        <div
          aria-hidden
          className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(243,118,28,0.25),transparent_70%)]"
        />
      )}
    </div>
  );
}

/* =========================
   HERO SECTION
========================= */

export default function RadarHero2() {
  return (
    <section className="relative min-h-screen overflow-hidden bg-black text-white">
      {/* Background */}
      <Radar />

      {/* Ambient glow */}
      <div className="pointer-events-none absolute right-[-10%] top-1/2 h-[700px] w-[700px] -translate-y-1/2 rounded-full bg-[#f3761c]/10 blur-[160px]" />

      {/* Content */}
      <div className="relative z-20 flex min-h-screen items-center px-6 py-20">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between">
          <div className="max-w-3xl">
            {/* Badge */}
            <div className="mb-8 inline-flex items-center gap-3 rounded-full border border-[#f3761c]/30 bg-[#f3761c]/10 px-5 py-2 backdrop-blur-2xl">
              <RadarIcon className="h-4 w-4 text-[#f6a05c]" />

              <span className="text-lg font-medium text-orange-100">
                Los mejores candidatos
              </span>
            </div>

            {/* Title */}
            <h1 className="text-5xl font-black leading-[0.88] tracking-[-0.06em] md:text-7xl">
              Confía en el
              <span className="mt-2 block bg-gradient-to-r from-[#f3761c] via-[#f6b26b] to-amber-300 bg-clip-text text-transparent">
                Análisis de Selectia
              </span>
            </h1>

            {/* Description */}
            <p className="mt-8 max-w-md text-lg leading-relaxed text-orange-100/70 md:text-xl">
              Selecciona al mejor talento dentro de tu base de datos para cubrir los puestos, los que tengan más afinidad a tus requerimientos pasarán a la siguiente fase.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
