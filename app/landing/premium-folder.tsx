"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { motion, useMotionValueEvent, useScroll, useTransform } from "framer-motion";
import VariableProximityText from "./variable-proxi";

const darken = (hex: string, p: number) => {
  let c = hex.replace("#", "");
  if (c.length === 3)
    c = c
      .split("")
      .map((x) => x + x)
      .join("");
  const n = parseInt(c, 16);
  const rgb = [16, 8, 0].map((s) =>
    Math.max(0, Math.min(255, Math.floor(((n >> s) & 255) * (1 - p)))),
  );
  return `#${((1 << 24) + (rgb[0] << 16) + (rgb[1] << 8) + rgb[2]).toString(16).slice(1).toUpperCase()}`;
};

export function PremiumFolderArt({
  scale = 3,
  open: controlledOpen,
  hovered: controlledHovered,
  slow = false,
}: {
  scale?: number;
  open?: boolean;
  hovered?: boolean;
  /** Transiciones largas (700ms) para la versión manejada por scroll. */
  slow?: boolean;
}) {
  const color = "#f3761c",
    flaps = ["skew(15deg) scaleY(.6)", "skew(-15deg) scaleY(.6)"],
    transforms = [
      "translate(-164%,-75%) rotate(-18deg)",
      "translate(60%,-75%) rotate(18deg)",
      "translate(-50%,-120%) rotate(0deg)",
    ],
    // Orden por índice: i=0 izq, i=1 der, i=2 centro. Visualmente se lee
    // Recibe (izq) → Conoce (centro) → Posiciona (der).
    words = ["Recibe", "Posiciona", "Conoce"];

  const [internalOpen, setInternalOpen] = useState(false);
  const [internalHovered, setInternalHovered] = useState(false);

  // Modo controlado (scroll) o interactivo (click/hover). El click siempre
  // funciona como respaldo aunque venga controlado por scroll.
  const open = controlledOpen ?? internalOpen;
  const hovered = controlledHovered ?? internalHovered;
  const anim = slow ? "duration-700 ease-out" : "duration-300";

  return (
      <div style={{ transform: `scale(${scale})` }} className="overflow-visible">
        <div
          onClick={() => {
            setInternalOpen((v) => !v);
          }}
          onMouseEnter={() => setInternalHovered(true)}
          onMouseLeave={() => setInternalHovered(false)}
          className={`relative py-10 cursor-pointer select-none overflow-visible transition-all duration-300 ${!open && hovered ? "-translate-y-2" : ""}`}
          style={{ transform: open ? "translateY(-8px)" : undefined }}
        >
          <div
            className="relative h-[80px] w-[100px] rounded-[0_10px_10px_10px] shadow-[0_20px_50px_rgba(243,118,28,0.40)]"
            style={{ background: darken(color, 0.08) }}
          >
            <span
              className="absolute bottom-[98%] left-0 h-[10px] w-[30px] rounded-t-[5px]"
              style={{ background: darken(color, 0.08) }}
            />

            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className={`absolute bottom-[10%] left-1/2 z-20 border border-black/5 shadow-lg backdrop-blur-xl transition-all ${anim} ${
                  !open
                    ? `-translate-x-1/2 ${hovered ? "translate-y-0" : "translate-y-[10%]"}`
                    : ""
                } ${i === 0 ? "h-[80%] w-[76%]" : i === 1 ? `w-[80%] ${open ? "h-[80%]" : "h-[70%]"}` : `w-[90%] ${open ? "h-[80%]" : "h-[60%]"}`}`}
                style={{
                  borderRadius: 10,
                  background:
                    i === 0
                      ? darken("#fff", 0.1)
                      : i === 1
                        ? darken("#fff", 0.05)
                        : "#fff",
                  transform: open ? transforms[i] : undefined,
                }}
              >
                <div className="flex flex-col gap-1 p-2">
                  <div className="h-1 w-[90%] rounded-full bg-black/10" />
                  <div className="h-1 w-[70%] rounded-full bg-black/10" />
                  <div className="h-1 w-[78%] rounded-full bg-black/10" />
                  <p
                    className="mt-0.5 w-full text-center text-[10px] font-bold uppercase leading-none tracking-wide"
                    style={{ color: "#f3761c" }}>
                    {words[i]}
                  </p>
                </div>
              </div>
            ))}

            {flaps.map((t, i) => (
              <div
                key={i}
                className={`absolute z-30 h-full w-full origin-bottom transition-all ${anim}`}
                style={{
                  background: color,
                  borderRadius: "5px 10px 10px 10px",
                  transform: open || hovered ? t : undefined,
                }}
              />
            ))}

            {/* Logo siempre visible sobre el fichero */}
            <div className="absolute left-1/2 top-1/2 z-40 flex h-11 w-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white/95 shadow-[0_4px_16px_rgba(0,0,0,0.30)] ring-2 ring-white/60">
              <Image
                src="/img/new-icon.png"
                alt="Selectia"
                width={32}
                height={32}
                className="h-8 w-8 object-contain"
              />
            </div>

            <div
              className="absolute inset-0 -z-10 scale-125 blur-2xl opacity-40"
              style={{
                background:
                  "radial-gradient(circle,rgba(248, 140, 64, 0.76) 0%,transparent 40%)",
              }}
            />
          </div>
        </div>
      </div>
  );
}

export default function PremiumFolder() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center overflow-hidden bg-[#14373F] px-8 pt-8 py-20">
      <VariableProximityText
        text="Tu próximo fichaje ya se encuentra en tu base de datos"
        radius={220}
        falloff="gaussian"
        className="max-w-4xl pb-40 text-center text-3xl font-medium text-white md:text-5xl"
        fromFontVariationSettings="'wght' 300,'opsz' 14"
        toFontVariationSettings="'wght' 1000,'opsz' 48"
      />
      <PremiumFolderArt />
    </div>
  );
}

/**
 * Versión scrollytelling: la pantalla queda fija (pin) y el scroll maneja
 * la secuencia hover → despliegue → guardado → liberación.
 * El click sigue funcionando como respaldo.
 */
export function PremiumFolderScrollScene() {
  const trackRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: trackRef,
    offset: ["start start", "end end"],
  });

  const [hovered, setHovered] = useState(false);
  const [open, setOpen] = useState(false);

  // Parallax sutil en direcciones opuestas (se separan, nunca chocan).
  // Amplitud reducida para que el folder no se hunda y se corte abajo.
  const textY = useTransform(scrollYProgress, [0, 1], [24, -24]);
  const folderY = useTransform(scrollYProgress, [0, 1], [-8, 8]);

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    // Recorrido largo para que cada fase se aprecie:
    // 0-10% cerrado · 10-28% hover · 28-72% desplegado · 72%+ guardado.
    setHovered(v >= 0.1 && v < 0.85);
    setOpen(v >= 0.28 && v < 0.72);
  });

  return (
    <div ref={trackRef} className="relative h-[660vh] bg-gradient-to-b from-[#14373F] to-black py-20">
      <div className="sticky top-[15vh] flex h-[70vh] flex-col items-center justify-between overflow-x-clip overflow-y-visible px-8 pb-4 pt-8">
        <motion.div style={{ y: textY }} className="w-full max-w-4xl text-center">
          <VariableProximityText
            text="Tu próximo fichaje ya se encuentra en tu base de datos"
            radius={220}
            falloff="gaussian"
            className="text-center text-lg font-semibold text-white md:text-6xl"
            fromFontVariationSettings="'wght' 300,'opsz' 14"
            toFontVariationSettings="'wght' 1000,'opsz' 48"
          />
        </motion.div>
        <motion.div
          style={{ y: folderY }}
          className="flex w-full flex-1 items-center pt-40 justify-center overflow-visible px-8"
        >
          <PremiumFolderArt open={open} hovered={hovered} slow scale={1.6} />
        </motion.div>
    </div>
     </div>
  );
}

