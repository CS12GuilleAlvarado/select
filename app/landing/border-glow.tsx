
"use client";
import React, { useRef, useEffect, useMemo } from "react";

const borderRadius = 28;
const edgeSensitivity = 30;
const glowRadius = 40;
const glowIntensity = 1;
const coneSpread = 25;
const fillOpacity = 0.5;

const backgroundColor = "#120F17";

const GRADIENT_POSITIONS = ["80% 55%", "69% 34%", "8% 6%", "41% 38%", "86% 85%", "82% 18%", "51% 4%"];

const COLOR_MAP = [0, 1, 2, 0, 1, 2, 1];

// =========================
// HELPERS
// =========================

const parseHSL = (hslStr: string) => {
  const match = hslStr.match(/([\d.]+)\s*([\d.]+)%?\s*([\d.]+)%?/);

  if (!match) {
    return { h: 40, s: 80, l: 80 };
  }

  return {
    h: parseFloat(match[1]),
    s: parseFloat(match[2]),
    l: parseFloat(match[3]),
  };
};

const buildBoxShadow = (glowColor: string, intensity: number) => {
  const { h, s, l } = parseHSL(glowColor);

  const base = `${h}deg ${s}% ${l}%`;

  const layers: [number, number, number, number, number, boolean][] = [
    [0, 0, 0, 1, 100, true],
    [0, 0, 1, 0, 60, true],
    [0, 0, 3, 0, 50, true],
    [0, 0, 6, 0, 40, true],
    [0, 0, 15, 0, 30, true],
    [0, 0, 25, 2, 20, true],
    [0, 0, 50, 2, 10, true],

    [0, 0, 1, 0, 60, false],
    [0, 0, 3, 0, 50, false],
    [0, 0, 6, 0, 40, false],
    [0, 0, 15, 0, 30, false],
    [0, 0, 25, 2, 20, false],
    [0, 0, 50, 2, 10, false],
  ];

  return layers
    .map(([x, y, blur, spread, alpha, inset]) => {
      const a = Math.min(alpha * intensity, 100);

      return `${inset ? "inset " : ""}${x}px ${y}px ${blur}px ${spread}px hsl(${base} / ${a}%)`;
    })
    .join(", ");
};

const buildMeshGradients = (colors: string[]) => {
  const gradients: string[] = [];

  for (let i = 0; i < 7; i++) {
    const c = colors[Math.min(COLOR_MAP[i], colors.length - 1)];

    gradients.push(`radial-gradient(at ${GRADIENT_POSITIONS[i]}, ${c} 0px, transparent 50%)`);
  }

  gradients.push(`linear-gradient(${colors[0]} 0 100%)`);

  return gradients;
};

// =========================
// REUSABLE INTERACTIVE CARD
// =========================

export function BorderGlowCard({
  children,
  colors = ["#c084fc", "#f472b6", "#38bdf8"],
  width = 420,
}: {
  children: React.ReactNode;
  colors?: string[];
  width?: number | string;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<number | null>(null);

  const meshGradients = useMemo(() => buildMeshGradients(colors), [colors]);

  // =========================
  // POINTER HANDLING
  // =========================

  useEffect(() => {
    const card = cardRef.current;

    if (!card) return;

    const updatePointer = (e: PointerEvent) => {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }

      frameRef.current = requestAnimationFrame(() => {
        const rect = card.getBoundingClientRect();

        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const cx = rect.width / 2;
        const cy = rect.height / 2;

        const dx = x - cx;
        const dy = y - cy;

        // =========================
        // ANGLE
        // =========================

        const radians = Math.atan2(dy, dx);

        let degrees = radians * (180 / Math.PI) + 90;

        if (degrees < 0) {
          degrees += 360;
        }

        // =========================
        // EDGE PROXIMITY
        // =========================

        let kx = Infinity;
        let ky = Infinity;

        if (dx !== 0) {
          kx = cx / Math.abs(dx);
        }

        if (dy !== 0) {
          ky = cy / Math.abs(dy);
        }

        const proximity = Math.min(Math.max(1 / Math.min(kx, ky), 0), 1);

        const colorSensitivity = edgeSensitivity + 20;

        const borderOpacity = Math.max(0, (proximity * 100 - colorSensitivity) / (100 - colorSensitivity));

        const glowOpacity = Math.max(0, (proximity * 100 - edgeSensitivity) / (100 - edgeSensitivity));

        // =========================
        // CSS VARIABLES
        // =========================

        card.style.setProperty("--cursor-angle", `${degrees}deg`);

        card.style.setProperty("--border-opacity", borderOpacity.toString());

        card.style.setProperty("--glow-opacity", glowOpacity.toString());
      });
    };

    const handleLeave = () => {
      card.style.setProperty("--border-opacity", "0");
      card.style.setProperty("--glow-opacity", "0");
    };

    card.addEventListener("pointermove", updatePointer);
    card.addEventListener("pointerleave", handleLeave);

    return () => {
      card.removeEventListener("pointermove", updatePointer);
      card.removeEventListener("pointerleave", handleLeave);

      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
    };
  }, []);

  // =========================
  // BACKGROUNDS
  // =========================

  const borderBg = meshGradients.map((g) => `${g} border-box`);

  const fillBg = meshGradients.map((g) => `${g} padding-box`);

  // =========================
  // RENDER
  // =========================

  return (
    <div
      ref={cardRef}
      style={
        {
          "--cursor-angle": "45deg",
          "--border-opacity": 0,
          "--glow-opacity": 0,
          position: "relative",
          width,
          maxWidth: "100%",
          minHeight: 400,
          overflow: "visible",
          borderRadius: `${borderRadius}px`,
          background: backgroundColor,
          border: "1px solid rgba(255,255,255,0.08)",
          isolation: "isolate",
          transform: "translate3d(0,0,0.01px)",
          boxShadow: "rgba(0,0,0,0.1) 0 1px 2px, rgba(0,0,0,0.1) 0 2px 4px, rgba(0,0,0,0.1) 0 4px 8px, rgba(0,0,0,0.1) 0 8px 16px, rgba(0,0,0,0.1) 0 16px 32px",
        } as React.CSSProperties
      }>
      {/* ========================= */}
      {/* BORDER */}
      {/* ========================= */}

      <div
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: "inherit",
          zIndex: -1,
          border: "1px solid transparent",

          background: [`linear-gradient(${backgroundColor} 0 100%) padding-box`, "linear-gradient(rgb(255 255 255 / 0%) 0% 100%) border-box", ...borderBg].join(", "),

          opacity: "var(--border-opacity)",

          maskImage: `
              conic-gradient(
                from var(--cursor-angle) at center,
                black ${coneSpread}%,
                transparent ${coneSpread + 15}%,
                transparent ${100 - coneSpread - 15}%,
                black ${100 - coneSpread}%
              )
            `,

          WebkitMaskImage: `
              conic-gradient(
                from var(--cursor-angle) at center,
                black ${coneSpread}%,
                transparent ${coneSpread + 15}%,
                transparent ${100 - coneSpread - 15}%,
                black ${100 - coneSpread}%
              )
            `,

          transition: "opacity 200ms ease",
        }}
      />

      {/* ========================= */}
      {/* FILL */}
      {/* ========================= */}

      <div
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: "inherit",
          zIndex: -1,
          border: "1px solid transparent",

          background: fillBg.join(","),

          opacity: `calc(var(--border-opacity) * ${fillOpacity})`,

          mixBlendMode: "soft-light",

          maskImage: ["linear-gradient(to bottom, black, black)", "radial-gradient(ellipse at 50% 50%, black 40%, transparent 65%)", `conic-gradient(from var(--cursor-angle) at center, transparent 5%, black 15%, black 85%, transparent 95%)`].join(","),

          WebkitMaskImage: ["linear-gradient(to bottom, black, black)", "radial-gradient(ellipse at 50% 50%, black 40%, transparent 65%)", `conic-gradient(from var(--cursor-angle) at center, transparent 5%, black 15%, black 85%, transparent 95%)`].join(","),

          transition: "opacity 200ms ease",
        }}
      />

      {/* ========================= */}
      {/* OUTER GLOW */}
      {/* ========================= */}

      <div
        style={{
          position: "absolute",
          inset: `${-glowRadius}px`,
          pointerEvents: "none",
          borderRadius: "inherit",
          zIndex: 1,

          opacity: "var(--glow-opacity)",

          mixBlendMode: "plus-lighter",

          maskImage: `
              conic-gradient(
                from var(--cursor-angle) at center,
                black 2.5%,
                transparent 10%,
                transparent 90%,
                black 97.5%
              )
            `,

          WebkitMaskImage: `
              conic-gradient(
                from var(--cursor-angle) at center,
                black 2.5%,
                transparent 10%,
                transparent 90%,
                black 97.5%
              )
            `,

          transition: "opacity 200ms ease",
        }}>
        <div
          style={{
            position: "absolute",
            inset: `${glowRadius}px`,
            borderRadius: "inherit",

            boxShadow: buildBoxShadow("40 80 80", glowIntensity),
          }}
        />
      </div>

      {/* ========================= */}
      {/* CONTENT */}
      {/* ========================= */}

      <div
        style={{
          position: "relative",
          zIndex: 2,
          padding: "2rem",
          color: "white",
        }}>
        {children}
      </div>
    </div>
  );
}

const BorderGlowDemo = () => {
  const colors = useMemo(() => ["#c084fc", "#f472b6", "#38bdf8"], []);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0A0A0A",
        display: "grid",
        placeItems: "center",
        padding: "4rem",
      }}>
      <BorderGlowCard colors={colors}>
        <div
          style={{
            display: "inline-flex",
            padding: "0.4rem 0.8rem",
            borderRadius: "999px",
            background: "rgba(255,255,255,0.06)",
            border: "1px solid rgba(255,255,255,0.08)",
            marginBottom: "1rem",
            fontSize: "0.8rem",
            backdropFilter: "blur(10px)",
          }}>
          BorderGlow Experimental
        </div>

        <h1
          style={{
            fontSize: "2rem",
            fontWeight: 700,
            marginBottom: "1rem",
            lineHeight: 1.1,
          }}>
          Advanced Interactive Border
        </h1>

        <p
          style={{
            opacity: 0.7,
            lineHeight: 1.7,
            marginBottom: "2rem",
          }}>
          Move the cursor near the edges to test the dynamic glow behavior, conic masking, mesh gradients and GPU accelerated lighting effect.
        </p>

        <button
          style={{
            padding: "0.9rem 1.2rem",
            borderRadius: "14px",
            border: "1px solid rgba(255,255,255,0.1)",
            background: "rgba(255,255,255,0.05)",
            color: "white",
            cursor: "pointer",
            fontWeight: 600,
          }}>
          Test Interaction
        </button>
      </BorderGlowCard>
    </div>
  );
};

export default BorderGlowDemo;
