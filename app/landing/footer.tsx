"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";

function LinkedInIcon({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M20.45 20.45h-3.55v-5.57c0-1.33-.03-3.04-1.85-3.04-1.86 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.47-.9 1.63-1.85 3.36-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12zM7.12 20.45H3.55V9h3.57v11.45z" />
    </svg>
  );
}

function XIcon({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M18.9 1.15h3.68l-8.04 9.19L24 22.85h-7.41l-5.8-7.58-6.64 7.58H.47l8.6-9.83L0 1.15h7.59l5.24 6.93 6.07-6.93zm-1.29 19.5h2.04L6.49 3.24H4.3l13.31 17.41z" />
    </svg>
  );
}

function InstagramIcon({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.2" cy="6.8" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

const productLinks = [
  { label: "Cómo funciona", href: "#" },
  { label: "Ranking IA", href: "#" },
  { label: "Shortlists", href: "#" },
  { label: "Precios", href: "#" },
];

const companyLinks = [
  { label: "Nosotros", href: "#" },
  { label: "Blog", href: "#" },
  { label: "Contacto", href: "#" },
  { label: "Únete para una demo", href: "#" },
];

const legalLinks = [
  { label: "PRIVACIDAD", href: "#" },
  { label: "TÉRMINOS", href: "#" },
  { label: "COOKIES", href: "#" },
];

function FooterColumn({
  title,
  links,
}: {
  title: string;
  links: { label: string; href: string }[];
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="flex flex-col items-start"
    >
      <h3 className="mb-5 text-[11px] font-semibold uppercase tracking-[0.18em] text-white/40">
        {title}
      </h3>
      <nav aria-label={title} className="flex flex-col items-start gap-[14px]">
        {links.map((link) => (
          <a
            key={link.label}
            href={link.href}
            className="text-[15px] font-medium leading-6 tracking-[-0.01em] text-white/75 transition-all duration-200 hover:translate-x-1 hover:text-[#f6a05c]"
          >
            {link.label}
          </a>
        ))}
      </nav>
    </motion.div>
  );
}

export default function Footer() {
  return (
      <div id="contact" className="scroll-mt-20">
    <footer className="relative isolate overflow-hidden bg-black text-white">
      {/* Hairline superior + glows Selectia */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#f3761c]/50 to-transparent"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_55%_40%_at_50%_0%,rgba(243,118,28,0.12),transparent_70%)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -left-[10%] bottom-[-20%] h-[420px] w-[420px] rounded-full bg-[#14373F]/60 blur-[160px]"
      />

      <div className="relative z-10 mx-auto w-full max-w-7xl px-6 pt-16 md:px-10 md:pt-20">
        {/* Contenido superior */}
        <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-[minmax(0,2.2fr)_minmax(0,0.8fr)_minmax(0,0.8fr)_minmax(0,1fr)] lg:gap-10">
          {/* Marca */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.65 }}
            className="flex flex-col items-start"
          >
            <div className="flex items-center gap-5 sm:gap-7">
              <a href="#" aria-label="Selectia home" className="inline-block shrink-0">
                <Image
                  src="/img/new-icon.png"
                  alt="Selectia"
                  width={200}
                  height={64}
                  className="h-20 w-auto object-contain drop-shadow-[0_0_20px_rgba(243,118,28,0.45)] sm:h-24"
                  priority
                />
              </a>

              <p className="flex flex-col gap-1 border-l border-white/10 pl-5 sm:pl-7">
                <span className="text-lg font-bold leading-tight tracking-[-0.02em] text-white/90 sm:text-xl">
                  Más vacantes.
                </span>
                <span className="text-lg font-bold leading-tight tracking-[-0.02em] text-white/90 sm:text-xl">
                  Mejores shortlists.
                </span>
                <span className="bg-gradient-to-r from-[#f3761c] via-[#f6b26b] to-amber-300 bg-clip-text text-lg font-bold leading-tight tracking-[-0.02em] text-transparent sm:text-xl">
                  Menos trabajo manual.
                </span>
              </p>
            </div>

            <p className="mt-6 font-mono text-[11px] leading-5 tracking-[0.05em] text-white/35">
              COPYRIGHT © 2026 SELECTIA · LPS-GRUPO.
              <br />
              TODOS LOS DERECHOS RESERVADOS.
            </p>

            <nav aria-label="Legal" className="mt-5 flex flex-wrap gap-x-6 gap-y-3">
              {legalLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="font-mono text-[11px] font-medium tracking-wide text-white/50 underline underline-offset-[3px] decoration-white/20 transition-colors hover:text-[#f6a05c]"
                >
                  {link.label}
                </a>
              ))}
            </nav>
          </motion.div>

          <FooterColumn title="Producto" links={productLinks} />
          <FooterColumn title="Empresa" links={companyLinks} />

          {/* Socials */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.65, delay: 0.15 }}
            className="flex flex-col items-start"
          >
            <h3 className="mb-5 text-[11px] font-semibold uppercase tracking-[0.18em] text-white/40">
              Social
            </h3>
            <div className="flex flex-col gap-3">
              {[
                { href: "https://www.linkedin.com/", label: "LinkedIn", Icon: LinkedInIcon },
                { href: "https://x.com/", label: "X", Icon: XIcon },
                { href: "https://www.instagram.com/", label: "Instagram", Icon: InstagramIcon },
              ].map(({ href, label, Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="group flex items-center gap-3 rounded-full border border-white/10 bg-white/[0.04] py-2 pl-3 pr-4 text-white/75 backdrop-blur-sm transition-all duration-300 hover:border-[#f3761c]/50 hover:text-white hover:shadow-[0_0_25px_rgba(243,118,28,0.25)]"
                >
                  <Icon size={18} />
                  <span className="text-sm font-medium">{label}</span>
                  <ArrowUpRight
                    size={14}
                    className="opacity-0 transition-all duration-300 group-hover:translate-x-0.5 group-hover:opacity-100"
                  />
                </a>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Logotipo gigante inferior — naranja atenuado, glow sutil, S reemplazada por logo */}
        <div className="pointer-events-none relative mt-14 h-[150px] w-full overflow-hidden sm:h-[210px] md:h-[260px] lg:h-[min(30vw,320px)]">
          {/* Halo glow central sutil */}
          <div
            aria-hidden
            className="absolute left-1/2 top-[68%] h-[40%] w-[70%] -translate-x-1/2 -translate-y-1/2 rounded-[100%] bg-[#f3761c]/10 blur-[80px]"
          />
          <div
            aria-hidden
            className="absolute left-1/2 top-[68%] h-[20%] w-[44%] -translate-x-1/2 -translate-y-1/2 rounded-[100%] bg-[#f3761c]/10 blur-[40px]"
          />
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-x-0 bottom-[-1px] flex h-full items-end justify-center text-[clamp(72px,17vw,280px)] font-black leading-[0.82] tracking-[-0.06em]"
            aria-hidden
          >
            <Image
              src="/img/new-icon.png"
              alt=""
              width={280}
              height={280}
              className="mb-[0.08em] h-[0.70em] w-auto self-end object-contain opacity-90 saturate-[0.8] brightness-[0.92] [filter:drop-shadow(0_0_18px_rgba(243,118,28,0.25))]"
            />
            <span className="bg-[linear-gradient(to_bottom,#000000_0%,#17100a_10%,#6b3a1c_42%,#d97a3a_52%,#e8b183_56%,#c97a3f_62%,#3a2113_78%,#000000_100%)] bg-clip-text text-transparent drop-shadow-[0_0_18px_rgba(217,122,58,0.28)]">
              ELECTIA
            </span>
          </motion.div>
        </div>
      </div>
    </footer>
    </div>
  );
}
