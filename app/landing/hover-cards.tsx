import React from "react";
import { FiCreditCard, FiMail, FiUser, FiUsers } from "react-icons/fi";
import type { IconType } from "react-icons";

type CardProps = {
  title: string;
  subtitle: string;
  href: string;
  Icon: IconType;
};

const HoverDevCards = () => {
  return (
    <section className="relative w-full overflow-hidden bg-[#14373F]">
      {/* Glow ambiental naranja para enlazar con el folder */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_40%,rgba(243,118,28,0.10),transparent_70%)]" />
      <div className="relative mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <p className="mb-6 text-3xl font-semibold text-white">Confía en nuestra análisis de preselección</p>
        <div className="grid grid-cols-2 gap-4 pt-8 lg:grid-cols-4">
          <Card
            title="Recibe"
            subtitle="CV´s de muchos candidatos"
            href="#"
            Icon={FiUser}
          />
          <Card title="Carga" subtitle="Muchos CV´s al mismo tiempo" href="#" Icon={FiMail} />
          <Card title="Selecciona" subtitle="Al mejor talento según el requerimiento" href="#" Icon={FiUsers} />
          <Card
            title="Contrata"
            subtitle="Cubre la vacante en corto tiempo"
            href="#"
            Icon={FiCreditCard}
          />
        </div>
      </div>
    </section>
  );
};

const Card = ({ title, subtitle, Icon, href }: CardProps) => {
  return (
    <a
      href={href}
      className="group relative w-full overflow-hidden rounded-2xl border-[1px] border-white/10 bg-white/[0.04] p-4 backdrop-blur-sm transition-all duration-300 hover:border-[#f3761c]/50 hover:shadow-[0_0_40px_rgba(243,118,28,0.25)]"
    >
      <div className="absolute inset-0 translate-y-[100%] bg-gradient-to-r from-[#f3761c] via-[#ef8a3c] to-[#f6b26b] transition-transform duration-300 group-hover:translate-y-[0%]" />

      <Icon className="absolute -right-12 -top-12 z-10 text-9xl text-white/[0.06] transition-all duration-300 group-hover:rotate-12 group-hover:text-white/25" />
      <Icon className="relative z-10 mb-2 text-2xl text-[#f6a05c] transition-colors duration-300 group-hover:text-white" />
      <h3 className="relative z-10 text-2xl font-medium text-white transition-colors duration-300 group-hover:text-white">
        {title}
      </h3>
      <p className="relative z-10 text-white/60 transition-colors duration-300 group-hover:text-white/90">
        {subtitle}
      </p>
    </a>
  );
};

export default HoverDevCards;
