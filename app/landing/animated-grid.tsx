"use client";

import React, { useEffect, useRef } from "react";
import Image from "next/image";

interface AnimatedGridBackgroundProps {
  className?: string;
}

const AnimatedGridBackground: React.FC<AnimatedGridBackgroundProps> = ({
  className = "",
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

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
              `rgba(59,130,246,${
                0.55 * next
              })`
            );

            glowGradient.addColorStop(
              0.4,
              `rgba(59,130,246,${
                0.18 * next
              })`
            );

            glowGradient.addColorStop(
              1,
              "rgba(59,130,246,0)"
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
              59,
              130,
              246,
              ${next}
            )`;

            ctx.shadowBlur = 40;

            ctx.fillStyle = `rgba(
              37,
              99,
              235,
              ${0.28 * next}
            )`;

            ctx.fillRect(
              x,
              y,
              gridSize,
              gridSize
            );

            ctx.fillStyle = `rgba(
              147,
              197,
              253,
              ${0.22 * next}
            )`;

            ctx.fillRect(
              x + 4,
              y + 4,
              gridSize - 8,
              gridSize - 8
            );

            ctx.strokeStyle = `rgba(
              96,
              165,
              250,
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
        "rgba(0,0,0,0.82)"
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
    <section className="relative isolate h-screen overflow-hidden bg-[#050816]">

      <canvas
        ref={canvasRef}
        className="absolute inset-0 h-full w-full pointer-events-none"
      />

      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/60" />

      <div className="relative z-20 flex h-full flex-col items-center justify-center px-6 text-center">

        <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.08),transparent_60%)] blur-3xl" />

        <Image
          src="/img/logolarge2.png"
          alt="Logo"
          width={1020}
          height={120}
          className="mb-6 pointer-events-none"
        />

     

        <div className="mt-6 flex flex-wrap gap-10">
            {/* BUTTON 1 */}
            <button
              className="group relative ml-6 md:ml-0 cursor-pointer transition duration-300 hover:scale-105 overflow-hidden px-8 py-6 text-sm font-semibold uppercase tracking-[0.2em] text-black"
              style={{
                clipPath: "polygon(12px 0%,100% 0%,100% calc(100% - 12px),calc(100% - 12px) 100%,0% 100%,0% 12px)",
              }}>
              <div className="absolute inset-0 bg-gradient-to-r from-sky-500 to-gray-200" />

              <div className="absolute inset-0 opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-400 bg-sky-600" />

              <span className="relative z-10">Nuestros servicios</span>
            </button>

            {/* BUTTON 2 */}
            <button
              className="group relative ml-8 md:ml-0 overflow-hidden cursor-pointer transition duration-300 hover:scale-105 border border-white/10 bg-blue-600 px-8 py-6 text-sm font-semibold uppercase tracking-[0.2em] text-white backdrop-blur-xl hover:border-sky-300/40"
              style={{
                clipPath: "polygon(16px 0%,100% 0%,100% calc(100% - 16px),calc(100% - 16px) 100%,0% 100%,0% 16px)",
              }}>
              {/* BORDER GLOW */}
              <div className="absolute inset-0 rounded-none opacity-0 transition-opacity duration-500 group-hover:opacity-100">
              </div>

              {/* BOTTOM GLOW */}
              <div className="absolute bottom-[-30px] left-1/2 h-16 w-3/4 -translate-x-1/2 rounded-full blur-2xl transition-all duration-500" />

              <span className="relative z-10">Reserva una cita</span>
            </button>
          </div>

      </div>

    </section>
  );
};

export default AnimatedGridBackground;