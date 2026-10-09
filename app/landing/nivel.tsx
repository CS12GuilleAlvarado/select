"use client";

import { motion, useScroll } from "framer-motion";
import { useRef } from "react";
import {
  ShieldCheck,
  TrendingUp,
  Award,
  Building2,
  Factory,
  ArrowRight,
} from "lucide-react";

const niveles = [
  {
    nivel: 0,
    titulo: "Inicial",
    descripcion: "Procesos reactivos y sin estandarización.",
    icon: Building2,
  },
  {
    nivel: 1,
    titulo: "Regular",
    descripcion: "Controles básicos implementados.",
    icon: Factory,
  },
  {
    nivel: 2,
    titulo: "Promedio",
    descripcion: "Gestión preventiva parcial.",
    icon: ShieldCheck,
  },
  {
    nivel: 3,
    titulo: "Bueno",
    descripcion: "Indicadores y seguimiento continuo.",
    icon: TrendingUp,
  },
  {
    nivel: 4,
    titulo: "Muy Bueno",
    descripcion: "Cultura preventiva consolidada.",
    icon: Award,
  },
  {
    nivel: 5,
    titulo: "Excelente",
    descripcion: "Benchmark nacional.",
    icon: Award,
  },
  {
    nivel: 6,
    titulo: "Mejores Prácticas Mundiales",
    descripcion:
      "BHP, Rio Tinto, Barrick, Dupont, Alcoa y organizaciones líderes.",
    icon: ShieldCheck,
    destacado: true,
  },
];

export default function NivelSSMA() {
  const timelineRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: timelineRef,
    offset: ["start 75%", "end 25%"],
  });

  return (
    <section className="relative overflow-hidden rounded-3xl bg-slate-950 px-8 py-20">
      <div className="absolute left-1/2 top-0 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-cyan-500/20 blur-[150px]" />

      <div className="relative mx-auto max-w-7xl">
        <div className="grid gap-16 lg:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="flex flex-col justify-center"
          >
            <span className="mb-4 inline-flex w-fit rounded-full border border-cyan-400/30 bg-cyan-500/10 px-4 py-2 text-sm font-medium text-cyan-300">
              Diagnóstico Organizacional
            </span>

            <h2 className="mb-6 text-5xl font-bold leading-tight text-white">
              ¿En qué nivel de
              <span className="block bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                madurez SSMA
              </span>
              se encuentra su empresa?
            </h2>

            <p className="mb-8 max-w-xl text-lg leading-relaxed text-slate-300">
              Identificamos el nivel real de desempeño en Seguridad, Salud
              Ocupacional y Medio Ambiente mediante auditorías, indicadores y
              benchmarking internacional.
            </p>

            <div className="flex flex-wrap gap-4">
              <button className="group flex items-center gap-2 rounded-xl bg-cyan-500 px-6 py-4 font-semibold text-white transition hover:bg-cyan-400">
                Solicitar Diagnóstico
                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              </button>

              <button className="rounded-xl border border-slate-700 px-6 py-4 font-semibold text-slate-300 transition hover:border-cyan-400 hover:text-white">
                Ver Metodología
              </button>
            </div>
          </motion.div>

          <div ref={timelineRef} className="relative">
            <div className="absolute left-[24px] top-0 bottom-0 w-[3px] rounded-full bg-slate-800" />

            <motion.div
              style={{
                scaleY: scrollYProgress,
                transformOrigin: "top",
              }}
              className="absolute left-[24px] top-0 bottom-0 w-[4px] rounded-full bg-gradient-to-b from-cyan-300 via-cyan-400 to-blue-500 shadow-[0_0_25px_rgba(34,211,238,0.8)]"
            />

            <div className="space-y-5">
              {niveles.map((item, index) => {
                const Icon = item.icon;

                return (
                  <motion.div
                    key={item.nivel}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.08, duration: 0.5 }}
                    className={`group relative ml-14 rounded-2xl border backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl ${
                      item.destacado
                        ? "border-cyan-400/40 bg-cyan-500/10"
                        : "border-slate-800 bg-white/5"
                    }`}
                  >
                    <div
                      className={`absolute -left-[48px] top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full border font-semibold ${
                        item.destacado
                          ? "border-cyan-400 bg-cyan-500 text-white shadow-[0_0_20px_rgba(34,211,238,0.6)]"
                          : "border-slate-600 bg-slate-900 text-slate-300"
                      }`}
                    >
                      {item.nivel}
                    </div>

                    <div className="flex items-start gap-4 p-5">
                      <div
                        className={`rounded-xl p-3 ${
                          item.destacado
                            ? "bg-cyan-500/20 text-cyan-300"
                            : "bg-slate-800 text-slate-300"
                        }`}
                      >
                        <Icon className="h-6 w-6" />
                      </div>

                      <div>
                        <h3
                          className={`mb-1 text-xl font-bold ${
                            item.destacado
                              ? "text-cyan-300"
                              : "text-white"
                          }`}
                        >
                          Nivel {item.nivel} · {item.titulo}
                        </h3>

                        <p className="text-slate-400">
                          {item.descripcion}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}