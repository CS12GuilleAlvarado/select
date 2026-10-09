"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import {
  ChevronDown,
  ShieldCheck,
  FileSearch,
  Building2,
  Award,
  HelpCircle,
} from "lucide-react";

const faqs = [
  {
    icon: ShieldCheck,
    question: "¿Qué es una auditoría SSMA y por qué es importante?",
    answer:
      "Una auditoría SSMA permite identificar brechas, riesgos y oportunidades de mejora en Seguridad, Salud Ocupacional, Medio Ambiente y Responsabilidad Social. Es el punto de partida para construir una cultura preventiva sólida y sostenible.",
  },
  {
    icon: Building2,
    question: "¿Trabajan únicamente con empresas mineras?",
    answer:
      "No. Nuestra metodología es aplicable a minería, energía, construcción, industria, manufactura, transporte y cualquier organización que busque fortalecer sus estándares de gestión y cumplimiento.",
  },
  {
    icon: FileSearch,
    question: "¿Cómo determinan el nivel de madurez SSMA?",
    answer:
      "Utilizamos una metodología basada en indicadores, observaciones de campo, entrevistas, documentación y benchmarking internacional para ubicar a la organización dentro de una escala de madurez claramente definida.",
  },
  {
    icon: Award,
    question: "¿Qué beneficios obtiene la organización?",
    answer:
      "Mayor cumplimiento normativo, reducción de incidentes, fortalecimiento de la cultura preventiva, mejor desempeño operacional y una hoja de ruta clara hacia estándares de clase mundial.",
  },
  {
    icon: HelpCircle,
    question: "¿La implementación puede realizarse por etapas?",
    answer:
      "Sí. Diseñamos planes flexibles que pueden ejecutarse de manera integral o progresiva según las necesidades, recursos y objetivos estratégicos de cada organización.",
  },
];

function FAQItem({
  faq,
  isOpen,
  onClick,
}: {
  faq: (typeof faqs)[0];
  isOpen: boolean;
  onClick: () => void;
}) {
  const Icon = faq.icon;

  return (
    <motion.div
      layout
      className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-xl"
    >
      <button
        onClick={onClick}
        className="group flex w-full items-center justify-between p-6 text-left"
      >
        <div className="flex items-center gap-4">
          <div className="rounded-xl bg-cyan-500/10 p-3">
            <Icon className="h-6 w-6 text-cyan-300" />
          </div>

          <h3 className="text-lg font-semibold text-white transition-colors group-hover:text-cyan-300">
            {faq.question}
          </h3>
        </div>

        <motion.div
          animate={{
            rotate: isOpen ? 180 : 0,
          }}
          transition={{
            duration: 0.25,
          }}
        >
          <ChevronDown className="h-5 w-5 text-cyan-300" />
        </motion.div>
      </button>

      <motion.div
        initial={false}
        animate={{
          height: isOpen ? "auto" : 0,
          opacity: isOpen ? 1 : 0,
        }}
        transition={{
          duration: 0.3,
        }}
        className="overflow-hidden"
      >
        <div className="border-t border-white/10 px-6 py-5">
          <p className="leading-relaxed text-slate-400">
            {faq.answer}
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="relative overflow-hidden bg-slate-950 py-28">
      {/* Glow Effects */}
      <div className="absolute left-0 top-0 h-[500px] w-[500px] rounded-full bg-cyan-500/10 blur-[180px]" />

      <div className="absolute right-0 bottom-0 h-[500px] w-[500px] rounded-full bg-blue-600/10 blur-[180px]" />

      <div className="relative mx-auto max-w-6xl px-6">
        {/* Header */}
        <motion.div
          initial={{
            opacity: 0,
            y: 40,
          }}
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mb-20 text-center"
        >
          <span className="mb-5 inline-flex rounded-full border border-cyan-400/30 bg-cyan-500/10 px-4 py-2 text-sm font-medium tracking-wide text-cyan-300">
            Preguntas Frecuentes
          </span>

          <h2 className="mb-6 text-5xl font-bold text-white">
            Resolvemos sus
            <span className="block bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              principales consultas
            </span>
          </h2>

          <p className="mx-auto max-w-3xl text-lg leading-relaxed text-slate-400">
            Conozca cómo nuestras metodologías, auditorías y programas
            de implementación ayudan a las organizaciones a fortalecer
            su desempeño en Seguridad, Salud Ocupacional, Medio Ambiente
            y Responsabilidad Social.
          </p>
        </motion.div>

        {/* FAQ Grid */}
        <div className="space-y-5">
          {faqs.map((faq, index) => (
            <FAQItem
              key={faq.question}
              faq={faq}
              isOpen={openIndex === index}
              onClick={() =>
                setOpenIndex(openIndex === index ? null : index)
              }
            />
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{
            opacity: 0,
            y: 40,
          }}
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          viewport={{ once: true }}
          transition={{
            duration: 0.8,
            delay: 0.2,
          }}
          className="mt-20"
        >
          <div className="rounded-3xl border border-cyan-500/20 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 p-10 text-center backdrop-blur-xl">
            <h3 className="mb-4 text-3xl font-bold text-white">
              ¿Necesita una evaluación personalizada?
            </h3>

            <p className="mx-auto mb-8 max-w-2xl text-slate-400">
              Nuestro equipo puede analizar la situación actual de su
              organización y diseñar una hoja de ruta hacia estándares
              de desempeño de clase mundial.
            </p>

            <button className="rounded-xl bg-cyan-500 px-8 py-4 font-semibold text-white transition-all duration-300 hover:bg-cyan-400 hover:shadow-[0_0_40px_rgba(34,211,238,0.4)]">
              Solicitar Diagnóstico
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}