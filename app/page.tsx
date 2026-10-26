"use client";

import React from "react";
import dynamic from "next/dynamic";
import { Sparkles } from "lucide-react";
import BubbleMenuDemo from "./landing/bubble-menu";
import Footer from "./landing/footer";
import { LazyMount } from "./landing/visibility";
import { Button } from "@/components/ui/button";

// Secciones pesadas: se cargan en el cliente y solo se montan cerca del viewport.
// Los canvas WebGL (Aurora, Radar, FluidGlass, AnimatedGrid) además se desmontan
// fuera de pantalla para liberar GPU/VRAM.
const TextParallaxContentExample = dynamic(
  () => import("./landing/section").then((m) => m.TextParallaxContentExample),
  { ssr: false, loading: () => <div style={{ minHeight: 900 }} /> },
);
const PremiumCardSwapHero = dynamic(() => import("./landing/premium-card"), {
  ssr: false,
  loading: () => <div style={{ minHeight: 600 }} />,
});
const ScrollVelocity = dynamic(() => import("./landing/scroll-velocity"), {
  ssr: false,
  loading: () => <div style={{ minHeight: 320 }} />,
});
const Cinema = dynamic(() => import("./landing/slides"), {
  ssr: false,
  loading: () => <div style={{ minHeight: 600 }} />,
});
const NivelSSMA = dynamic(() => import("./landing/nivel"), {
  ssr: false,
  loading: () => <div style={{ minHeight: 600 }} />,
});
const FAQSection = dynamic(() => import("./landing/faqs"), {
  ssr: false,
  loading: () => <div style={{ minHeight: 600 }} />,
});
const AnimatedGridBackground = dynamic(
  () => import("./landing/animated-grid"),
  { ssr: false, loading: () => <div style={{ minHeight: 700 }} /> },
);
const AuroraHero = dynamic(() => import("./landing/aura-hero"), {
  ssr: false,
  loading: () => <div style={{ minHeight: 700 }} />,
});
const BorderGlow = dynamic(() => import("./landing/border-glow"), {
  ssr: false,
  loading: () => <div style={{ minHeight: 400 }} />,
});
const FluidGlassLens = dynamic(() => import("./landing/fluid-glass"), {
  ssr: false,
  loading: () => <div style={{ minHeight: 700 }} />,
});
const HoverDevCards = dynamic(() => import("./landing/hover-cards"), {
  ssr: false,
  loading: () => <div style={{ minHeight: 500 }} />,
});
const FolderShowcase = dynamic(() => import("./landing/folder-showcase"), {
  ssr: false,
  loading: () => <div style={{ minHeight: 700 }} />,
});
const RadarHero2 = dynamic(() => import("./landing/radar-hero2"), {
  ssr: false,
  loading: () => <div style={{ minHeight: 700 }} />,
});
const TemplateGrid = dynamic(() => import("./landing/template-grid"), {
  ssr: false,
  loading: () => <div style={{ minHeight: 500 }} />,
});
const TextRevealByWord = dynamic(() => import("./landing/text-change"), {
  ssr: false,
  loading: () => <div style={{ minHeight: 400 }} />,
});

export default function Page() {
  return (
    <>
      {/* Navbar: carga inmediata, siempre montada */}
      <BubbleMenuDemo />

     <LazyMount minHeight={900}>
        <TextParallaxContentExample />
      </LazyMount>
      <LazyMount minHeight={400}>
        <TextRevealByWord text="No es otra búsqueda por palabras clave. br Selectia entiende cada candidato y cada vacante. br Saca a la luz candidatos de otros puestos, países y departamentos que encajan con un porcentaje de afinidad, no una corazonada." />
      </LazyMount>
<div id="selecciona" className="scroll-mt-20">
  <LazyMount minHeight={600}>
    <Cinema />
  </LazyMount>
</div>
      <LazyMount minHeight={320}>
        <main className="bg-gradient-to-b from-[#f3e7e2] to-[#14373F] py-32">
          <ScrollVelocity
            texts={[
              "SELECTIA • LPS-GRUPO • PERÚ • ESPAÑA • ALEMANIA",
              "ESPAÑA • MARRUECOS • COLOMBIA • MARRUECOS",
            ]}
            velocity={120}
            numCopies={8}
            className="px-4 text-7xl font-black uppercase text-white"
          />
        </main>
      </LazyMount> 


<div id="funciona" className="scroll-mt-20">
       <LazyMount minHeight={600}>
        <PremiumCardSwapHero />
      </LazyMount>
</div>

      <LazyMount minHeight={500}>
        <TemplateGrid />
      </LazyMount>

<div id="faqs" className="scroll-mt-20">
      <LazyMount minHeight={600}>
        <FAQSection />
      </LazyMount> 
</div>

    <div id="demo" className="scroll-mt-20">
      <LazyMount minHeight={700} unmountOnHide>
        <AnimatedGridBackground />
      </LazyMount>
    </div>

      <LazyMount minHeight={500}>
        <HoverDevCards />
      </LazyMount>

      <LazyMount minHeight={700}>
        <FolderShowcase />
      </LazyMount>
      <LazyMount minHeight={700} unmountOnHide>
        <RadarHero2 />
      </LazyMount>

      {/* WebGL: desmontan fuera de pantalla (liberan contexto GPU) */}
      <LazyMount minHeight={700} unmountOnHide>
        <AuroraHero />
      </LazyMount>

      {/* <LazyMount minHeight={400}>
        <BorderGlow />
      </LazyMount> */}

<section className="relative overflow-hidden bg-black">
  {/* Glows ambientales Selectia — naranja + verde profundo */}
  <div
    aria-hidden
    className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_45%_at_50%_0%,rgba(243,118,28,0.14),transparent_70%)]"
  />
  <div
    aria-hidden
    className="pointer-events-none absolute -right-[10%] top-[20%] h-[480px] w-[480px] rounded-full bg-[#f3761c]/10 blur-[160px]"
  />
  <div
    aria-hidden
    className="pointer-events-none absolute -left-[10%] bottom-[-20%] h-[420px] w-[420px] rounded-full bg-[#14373F]/70 blur-[160px]"
  />
  {/* Línea superior sutil */}
  <div
    aria-hidden
    className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#f3761c]/40 to-transparent"
  />

  <div className="relative z-10 mx-auto w-full max-w-7xl px-6 pt-10 md:px-10 md:pt-28">
    {/* Eyebrow badge */}
    <div className="mb-7 inline-flex items-center gap-2.5 rounded-full border border-[#f3761c]/30 bg-[#f3761c]/10 py-1.5 pl-2 pr-5 backdrop-blur-2xl">
      <span className="flex size-6 items-center justify-center rounded-full bg-gradient-to-br from-[#f3761c] to-[#d9650f] shadow-[0_0_20px_rgba(243,118,28,0.5)]">
        <Sparkles className="size-3.5 text-white" />
      </span>
      <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-orange-100/90">
        Para reclutadores y empresas
      </span>
    </div>

    <h2 className="max-w-4xl text-4xl font-black leading-[1.02] tracking-[-0.04em] text-white md:text-6xl">
      Más vacantes. Mejores shortlists.
      <span className="mt-2 block pb-4 bg-gradient-to-r from-[#f3761c] via-[#f6b26b] to-amber-300 bg-clip-text text-transparent">
        Menos trabajo manual.
      </span>
    </h2>

    {/* Acento + copy en dos columnas en desktop */}
    <div className="mt-8 grid gap-8 md:grid-cols-[auto_1fr] md:gap-10">
      <div
        aria-hidden
        className="hidden h-full w-px bg-gradient-to-b from-[#f3761c] via-[#f3761c]/40 to-transparent md:block"
      />
      <div className="max-w-6xl">
        <p className="text-base leading-relaxed text-white/75 md:text-lg">
          Diseñado para reclutadores y empresas enfocado a gestionar mayores
          volúmenes de candidatos sin multiplicar el esfuerzo operativo. <br />
          Analiza cientos de CVs por vacante, compara perfiles según criterios
          definidos y genera shortlists estructuradas que facilitan la
          identificación de los candidatos más alineados con cada posición.
        </p>
        <p className="mt-4 text-base leading-relaxed text-white/50 md:text-lg">
          Aumenta tu capacidad de gestión, mejora la consistencia de tus
          entregables y dedica más tiempo a asesorar, conectar talento y
          cerrar procesos.
        </p>
      </div>
    </div>
  </div>
</section>
      <LazyMount minHeight={700} unmountOnHide>
        <FluidGlassLens />
      </LazyMount>
      <Footer />
    </>
  );
}
