"use client";

import React, { useEffect, useRef } from "react";
import Image from "next/image";
import { LazyMount } from "./visibility";
import { BorderGlowCard } from "./border-glow";

const RANKING = [
  { name: "Mariana G. — Backend Sr", pct: 94 },
  { name: "Diego R. — Data Analyst", pct: 89 },
  { name: "Lucía F. — QA Engineer", pct: 86 },
];

interface AnimatedGridBackgroundProps {
  className?: string;
}

const AnimatedGridBackground: React.FC<AnimatedGridBackgroundProps> = ({
  className = "",
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const visibleRef = useRef(true);

  // Pausa el loop pesado cuando el canvas está fuera de vista.
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(
      ([entry]) => {
        visibleRef.current = entry.isIntersecting;
      },
      { rootMargin: "200px 0px" },
    );
    io.observe(canvas);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;

    if (!canvas) return;

    const ctx = canvas.getContext("2d");

    if (!ctx) return;

    let animationFrameId: number;

    const gridSize = 32;
    const speed = 0.18;

    let offsetX = 0;
    let offsetY = 0;

    const mouse = {
      x: -9999,
      y: -9999,
    };

    const hoverMap = new Map<string, number>();

    const resizeCanvas = () => {
      const dpr = window.devicePixelRatio || 1;

      canvas.width = canvas.offsetWidth * dpr;
      canvas.height = canvas.offsetHeight * dpr;

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    resizeCanvas();

    window.addEventListener("resize", resizeCanvas);

    const draw = () => {
      // Fuera de vista: no dibujar, solo mantener el RAF barato.
      if (!visibleRef.current) {
        animationFrameId = requestAnimationFrame(draw);
        return;
      }

      const width = canvas.offsetWidth;
      const height = canvas.offsetHeight;

      ctx.clearRect(0, 0, width, height);

      offsetX -= speed;
      offsetY -= speed;

      if (Math.abs(offsetX) >= gridSize) offsetX = 0;
      if (Math.abs(offsetY) >= gridSize) offsetY = 0;

      const cols = Math.ceil(width / gridSize) + 2;
      const rows = Math.ceil(height / gridSize) + 2;

      const canvasRect = canvas.getBoundingClientRect();

      for (let col = -1; col < cols; col++) {
        for (let row = -1; row < rows; row++) {
          const x = col * gridSize + offsetX;
          const y = row * gridSize + offsetY;

          const centerX =
            canvasRect.left +
            x +
            gridSize / 2;

          const centerY =
            canvasRect.top +
            y +
            gridSize / 2;

          const distance = Math.sqrt(
            (mouse.x - centerX) ** 2 +
            (mouse.y - centerY) ** 2
          );

          const isHovered = distance < 20;

          const key = `${col}-${row}`;

          const current =
            hoverMap.get(key) || 0;

          const target =
            isHovered ? 1 : 0;

          const next =
            current +
            (target - current) *
              0.12;

          hoverMap.set(key, next);

          ctx.strokeStyle = `rgba(
            255,
            255,
            255,
            ${0.05 + next * 0.12}
          )`;

          ctx.lineWidth = 1;

          ctx.strokeRect(
            x,
            y,
            gridSize,
            gridSize
          );

          if (next > 0.01) {
            const glowSize =
              gridSize *
              (1.2 + next);

            const glowGradient =
              ctx.createRadialGradient(
                x + gridSize / 2,
                y + gridSize / 2,
                0,
                x + gridSize / 2,
                y + gridSize / 2,
                glowSize
              );

            glowGradient.addColorStop(
              0,
              `rgba(246,155,94,${
                0.45 * next
              })`
            );

            glowGradient.addColorStop(
              0.4,
              `rgba(246,155,94,${
                0.15 * next
              })`
            );

            glowGradient.addColorStop(
              1,
              "rgba(246,155,94,0)"
            );

            ctx.fillStyle =
              glowGradient;

            ctx.beginPath();

            ctx.arc(
              x + gridSize / 2,
              y + gridSize / 2,
              glowSize,
              0,
              Math.PI * 2
            );

            ctx.fill();

            ctx.shadowColor = `rgba(
              246,
              155,
              94,
              ${next}
            )`;

            ctx.shadowBlur = 40;

            ctx.fillStyle = `rgba(
              234,
              139,
              62,
              ${0.25 * next}
            )`;

            ctx.fillRect(
              x,
              y,
              gridSize,
              gridSize
            );

            ctx.fillStyle = `rgba(
              251,
              194,
              140,
              ${0.20 * next}
            )`;

            ctx.fillRect(
              x + 4,
              y + 4,
              gridSize - 8,
              gridSize - 8
            );

            ctx.strokeStyle = `rgba(
              246,
              155,
              94,
              ${next}
            )`;

            ctx.lineWidth = 1.2;

            ctx.strokeRect(
              x + 0.5,
              y + 0.5,
              gridSize - 1,
              gridSize - 1
            );

            ctx.shadowBlur = 0;
          }
        }
      }

      const gradient =
        ctx.createRadialGradient(
          width / 2,
          height / 2,
          0,
          width / 2,
          height / 2,
          width * 0.75
        );

      gradient.addColorStop(
        0,
        "rgba(0,0,0,0)"
      );

      gradient.addColorStop(
        1,
        "rgba(8,26,30,0.85)"
      );

      ctx.fillStyle = gradient;

      ctx.fillRect(
        0,
        0,
        width,
        height
      );

      animationFrameId =
        requestAnimationFrame(draw);
    };

    draw();

    const handleMouseMove = (
      e: MouseEvent
    ) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };

    const handleMouseLeave =
      () => {
        mouse.x = -9999;
        mouse.y = -9999;
      };

    window.addEventListener(
      "mousemove",
      handleMouseMove
    );

    window.addEventListener(
      "mouseleave",
      handleMouseLeave
    );

    return () => {
      cancelAnimationFrame(
        animationFrameId
      );

      window.removeEventListener(
        "resize",
        resizeCanvas
      );

      window.removeEventListener(
        "mousemove",
        handleMouseMove
      );

      window.removeEventListener(
        "mouseleave",
        handleMouseLeave
      );
    };
  }, []);

  return (
    <section className="relative isolate min-h-screen overflow-hidden bg-[#14373F]">
      <canvas
        ref={canvasRef}
        className="absolute inset-0 h-full w-full pointer-events-none"
      />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#14373F]/40 via-transparent to-[#0a1e23]/70" />
      <div className="relative z-20 mx-auto flex w-full max-w-6xl flex-col justify-center gap-12 px-6 py-24 lg:py-28">
        <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_center,rgba(246,155,94,0.10),transparent_60%)] blur-3xl" />

        <div className="grid w-full items-center gap-10 lg:grid-cols-2 lg:gap-14">
          {/* Izquierda: título, descripción y captura de email */}
          <div className="w-full text-center lg:text-left">
            <h2 className="text-4xl font-black leading-[1.05] text-white md:text-5xl">
              Filtra cada CV en{" "}
              <span className="bg-gradient-to-r from-[#f3761c] to-amber-300 bg-clip-text text-transparent">
                segundos
              </span>
              , no en semanas
            </h2>

            <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-white/70 lg:mx-0">
              Selectia lee, puntúa y clasifica a los candidatos según tu
              vacante, con un desglose transparente detrás de cada decisión.
            </p>

            <form
              className="mx-auto mt-8 flex w-full max-w-xs flex-col gap-3 lg:mx-0"
              onSubmit={(e) => e.preventDefault()}>
              <input
                type="email"
                required
                placeholder="aquicolocaelnombredetu@empresa.com"
                aria-label="Correo para una demo"
                className="h-14 w-full placeholder:text-center rounded-full border-2 border-[#f3761c] bg-white/10 px-6 text-white shadow-[0_0_25px_rgba(243,118,28,0.35)] backdrop-blur-md transition-shadow placeholder:text-white/40 focus:shadow-[0_0_40px_rgba(243,118,28,0.55)] focus:outline-none"
              />
              <button
                type="submit"
                className="h-14 w-full rounded-full bg-[#f3761c] px-8 font-semibold text-white shadow-[0_0_30px_rgba(243,118,28,0.45)] transition-all hover:bg-[#d9650f] hover:shadow-[0_0_45px_rgba(243,118,28,0.6)]">
                Únete para una demo
              </button>
            </form>
          </div>

          {/* Derecha: tarjeta interactiva */}
          <div className="flex w-full py-14 justify-center lg:justify-end">
            <LazyMount minHeight={400}>
              <BorderGlowCard colors={["#f3761c", "#fbbf24", "#ef8a3c"]} width="100%">
                <div
                  style={{
                    display: "inline-flex",
                    padding: "0.4rem 0.8rem",
                    marginTop: "1.2rem",
                    borderRadius: "999px",
                    background: "rgba(243,118,28,0.12)",
                    border: "1px solid rgba(243,118,28,0.35)",
                    marginBottom: "2.8rem",
                    fontSize: "0.8rem",
                    color: "#fdba74",
                  }}>
                  Ranking IA · Demo
                </div>

                <h3
                  style={{
                    fontSize: "1.6rem",
                    fontWeight: 800,
                    marginBottom: "1.25rem",
                    lineHeight: 1.15,
                  }}>
                  Top candidatos para tu vacante
                </h3>

                <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                  {RANKING.map((row) => (
                    <div key={row.name}>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          fontSize: "0.9rem",
                          marginBottom: "0.4rem",
                        }}>
                        <span style={{ opacity: 0.85 }}>{row.name}</span>
                        <span style={{ color: "#fdba74", fontWeight: 700 }}>{row.pct}%</span>
                      </div>
                      <div
                        style={{
                          height: "8px",
                          borderRadius: "999px",
                          background: "rgba(255,255,255,0.10)",
                          overflow: "hidden",
                        }}>
                        <div
                          style={{
                            height: "100%",
                            width: `${row.pct}%`,
                            borderRadius: "999px",
                            background: "linear-gradient(90deg,#f3761c,#fbbf24)",
                            boxShadow: "0 0 12px rgba(243,118,28,0.7)",
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </BorderGlowCard>
            </LazyMount>
          </div>
        </div>

        {/* Debajo: imagen grande */}
        <div className="w-full">
          <div className="relative overflow-hidden rounded-3xl border border-white/10 shadow-[0_0_80px_rgba(243,118,28,0.30)]">
            <Image
              src="/img/hero/panel.png"
              alt="Panel de Selectia"
              width={1600}
              height={900}
              className="h-auto w-full object-cover"
              priority
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default AnimatedGridBackground;