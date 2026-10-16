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
  ArrowRight,
} from "lucide-react";
import BubbleFillButton from "./bubblefill";

const faqs = [
  {
    icon: ShieldCheck,
    question: "¿Es seguro utilizar Selectia para gestionar los procesos de selección de mi empresa?",
    answer:
      "La seguridad y la confidencialidad de la información son aspectos fundamentales en cualquier proceso de selección, especialmente cuando se gestionan currículums, datos de contacto, experiencia laboral y otra información personal de los candidatos. Selectia está concebida para centralizar la gestión de los perfiles profesionales en un entorno de trabajo organizado, reduciendo la dispersión de documentos y facilitando un manejo más controlado de la información.",
  },
  {
    icon: Building2,
    question: "¿Qué beneficios obtiene mi empresa al implementar Selectia?",
    answer:
      "Selectia permite organizar la información de los candidatos y analizarla en función de los requisitos definidos para cada puesto. De esta manera, los reclutadores pueden identificar con mayor facilidad los perfiles que merecen una evaluación prioritaria, visualizar la información relevante de cada postulación y dedicar más tiempo a las actividades que requieren criterio humano, como las entrevistas, la validación de competencias y la evaluación cultural.",
  },
  {
    icon: FileSearch,
    question: "¿Cómo determina Selectia si un candidato cumple con los requisitos del puesto?",
    answer:
      "El proceso comienza con la definición de los criterios del puesto, que pueden incluir formación académica, experiencia laboral, conocimientos técnicos, competencias, certificaciones y otros requisitos relevantes. A partir de esta información, la plataforma puede ayudar a organizar y analizar los currículums recibidos, identificando evidencias de correspondencia entre la experiencia declarada por cada candidato y los criterios establecidos.",
  },
  {
    icon: Award,
    question: "¿Qué valor diferencial aporta Selectia frente a otras soluciones de reclutamiento?",
    answer:
      "En un mercado donde las empresas necesitan contratar con agilidad sin renunciar a la calidad, esta combinación resulta especialmente relevante. La ventaja competitiva no consiste simplemente en procesar más currículums, sino en ayudar a identificar mejor qué perfiles conviene evaluar y por qué. Selectia busca aportar una selección más ágil, organizada y fundamentada, conectando la eficiencia tecnológica con la experiencia humana para mejorar la calidad de las decisiones de contratación.",
  },
  {
    icon: HelpCircle,
    question: "¿Por qué debería implementar Selectia en los procesos de selección de mi empresa?",
    answer:
      "La adopción de una herramienta de este tipo debe acompañarse de una definición clara de los criterios de selección, capacitación del equipo y seguimiento de indicadores como el tiempo de revisión, la duración de las vacantes, la conversión de postulantes a entrevistas y la calidad de las contrataciones. Medir estos resultados permitirá determinar el impacto real de Selectia en la operación de cada organización.",
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
      className={`overflow-hidden rounded-2xl border backdrop-blur-xl transition-shadow duration-300 ${
        isOpen
          ? "border-[#f3761c]/40 bg-white/[0.05] shadow-[0_0_35px_rgba(243,118,28,0.20)]"
          : "border-white/10 bg-white/[0.03] hover:border-[#f3761c]/30 hover:shadow-[0_0_35px_rgba(243,118,28,0.15)]"
      }`}
    >
      <button
        onClick={onClick}
        className="group flex w-full items-center justify-between p-6 text-left"
      >
        <div className="flex items-center gap-4">
          <div className="rounded-xl bg-[#f3761c]/15 p-3 shadow-[0_0_20px_rgba(243,118,28,0.25)]">
            <Icon className="h-6 w-6 text-orange-300" />
          </div>

          <h3 className="text-lg font-semibold text-white transition-colors group-hover:text-orange-200">
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
          <ChevronDown className="h-5 w-5 text-[#f3761c]" />
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
          <p className="leading-relaxed text-white/60">
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
    <section className="relative overflow-hidden bg-[#14373F] py-28">
    

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

          <h2 className="mb-6 mt-20 text-6xl font-bold text-white">
            Resolvemos sus
            <span className="block bg-gradient-to-r from-[#f3761c] to-amber-300 bg-clip-text text-transparent drop-shadow-[0_0_25px_rgba(243,118,28,0.35)]">
              principales consultas
            </span>
          </h2>

          <p className="mx-auto max-w-4xl text-lg leading-relaxed text-white/60">
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
          <div className="rounded-3xl border border-[#f3761c]/30 bg-gradient-to-r from-[#f3761c]/15 to-amber-400/10 p-10 text-center shadow-[0_0_60px_rgba(243,118,28,0.15)] backdrop-blur-xl">
            <h3 className="mb-4 text-3xl font-bold text-white">
              ¿Necesita una evaluación personalizada?
            </h3>

            <p className="mx-auto mb-8 max-w-2xl text-white/60">
              Nuestro equipo puede analizar la situación actual de su
              organización y diseñar una hoja de ruta hacia estándares
              de desempeño de clase mundial.
            </p>

            <BubbleFillButton
              text="Solicitar Diagnóstico"
              icon={<ArrowRight size={18} />}
              borderColor="#f3761c"
              fillColor="#f3761c"
              textColor="#ffffff"
              className="px-8 py-4 shadow-[0_0_40px_rgba(243,118,28,0.35)] hover:shadow-[0_0_40px_rgba(243,118,28,0.55)]"
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}