"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ArrowUpRight } from "lucide-react";

export default function BubbleMenuDemo() {
  const [open, setOpen] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [visible, setVisible] = useState(true);
  const [scrolled, setScrolled] = useState(false);

  const panelRef = useRef<HTMLDivElement>(null);
  const bubbleRefs = useRef<HTMLAnchorElement[]>([]);
  const labelRefs = useRef<HTMLSpanElement[]>([]);
  const lastScrollY = useRef(0);

  const items = [
    { label: "Selecciona", href: "#selecciona", bg: "#3b82f6", rotation: -6, offset: 8 },
    { label: "¿Cómo funciona?", href: "#funciona", bg: "#10b981", rotation: 5, offset: -6 },
    { label: "FAQ´S", href: "#faqs", bg: "#f59e0b", rotation: -3, offset: 6 },
    { label: "Demo", href: "#demo", bg: "#ef4444", rotation: 4, offset: -8 },
    { label: "Contacto", href: "#contact", bg: "#8b5cf6", rotation: -6, offset: 8 },
  ];

  const toggle = () => {
    const next = !open;
    if (next) {
      setVisible(true);
      setShowDropdown(true);
    }
    setOpen(next);
  };

  const close = () => setOpen(false);

  // Hide on scroll down / show on scroll up. Keep visible while menu is open.
  useEffect(() => {
    lastScrollY.current = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 24);
      if (open) {
        setVisible(true);
        lastScrollY.current = y;
        return;
      }
      const dy = y - lastScrollY.current;
      if (y < 80) {
        setVisible(true);
      } else if (dy > 6) {
        setVisible(false);
      } else if (dy < -6) {
        setVisible(true);
      }
      lastScrollY.current = y;
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [open ]);

  // Close on Escape
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // Dropdown animation
  useEffect(() => {
    const panel = panelRef.current;
    const bubbles = bubbleRefs.current.filter(Boolean);
    const labels = labelRefs.current.filter(Boolean);
    if (!panel || !bubbles.length) return;

    if (open) {
      gsap.set(panel, { display: "block", y: -12, opacity: 0 });
      gsap.set(bubbles, { scale: 0.9, y: -8, opacity: 0 });
      gsap.set(labels, { y: 8, opacity: 0 });

      gsap.to(panel, { y: 0, opacity: 1, duration: 0.3, ease: "power3.out" });
      bubbles.forEach((bubble, i) => {
        const tl = gsap.timeline({ delay: 0.05 + i * 0.06 });
        tl.to(bubble, {
          scale: 1,
          y: 0,
          opacity: 1,
          duration: 0.35,
          ease: "back.out(1.6)",
        });
        tl.to(
          labels[i],
          { y: 0, opacity: 1, duration: 0.25, ease: "power2.out" },
          "-=0.25",
        );
      });
    } else if (showDropdown) {
      gsap.to(labels, { opacity: 0, y: 8, duration: 0.15 });
      gsap.to(bubbles, {
        scale: 0.9,
        y: -8,
        opacity: 0,
        duration: 0.18,
        ease: "power2.in",
      });
      gsap.to(panel, {
        y: -12,
        opacity: 0,
        duration: 0.22,
        ease: "power2.in",
        onComplete: () => {
          gsap.set(panel, { display: "none" });
          setShowDropdown(false);
        },
      });
    }
  }, [open, showDropdown]);

  return (
    <>
      <style>{`
      .bubble-pill{
      transform:rotate(var(--rot)) translateY(var(--offset,0px));
      transition:background .25s ease, color .25s ease, transform .25s ease, box-shadow .25s ease, border-color .25s ease;
      }
      .bubble-pill:hover{
      background:var(--hover);
      border-color:transparent;
      color:white;
      transform:rotate(var(--rot)) translateY(var(--offset,0px)) scale(1.05);
      box-shadow:0 12px 28px -10px var(--hover);
      }
      .bubble-pill:hover .bubble-arrow{
      transform:translate(2px,-2px);
      }
      .bubble-arrow{
      transition:transform .25s ease;
      }
      `}</style>

      <header
        className={`fixed inset-x-0 top-0 z-[1001] transition-transform duration-300 ease-out ${
          visible ? "translate-y-0" : "-translate-y-[130%]"
        }`}>
        {/* Navbar bar — ancho completo */}
        <nav
          className={`flex h-16 w-full items-center justify-between border-b border-white/30 bg-gradient-to-r from-[#f3761c] via-[#ef8a3c]/85 to-[#f6b26b]/40 pl-8 pr-6 backdrop-blur-xl backdrop-saturate-150 transition-all duration-300 ${
            scrolled || open
              ? "shadow-[0_8px_32px_rgba(230,124,46,0.35)]"
              : "shadow-[0_4px_20px_rgba(230,124,46,0.20)]"
          }`}>
          <a href="#" className="flex items-center gap-2.5" aria-label="Selectia inicio">
            <span className="flex h-11 w-11 items-center justify-center overflow-hidden rounded-full bg-white shadow-sm ring-1 ring-zinc-950/5">
              <Image
                src="/img/new-icon.png"
                alt="Selectia"
                width={36}
                height={36}
                className="h-9 w-9 object-contain"
                priority
              />
            </span>
            <span className="text-[38px] font-semibold tracking-tight text-white">
              Selectia
            </span>
          </a>

          <button
            onClick={toggle}
            aria-expanded={open}
            aria-label={open ? "Cerrar menú" : "Abrir menú"}
            className="flex h-11 w-11 flex-col items-center justify-center rounded-full bg-[#14373F] text-white shadow-md transition-colors hover:bg-[#0e2830]">
            <span
              className="h-[2px] w-5 bg-current transition-all duration-300"
              style={{
                transform: open ? "translateY(4px) rotate(45deg)" : "none",
              }}
            />
            <span
              className="mt-1.5 h-[2px] w-5 bg-current transition-all duration-300"
              style={{
                transform: open ? "translateY(-4px) rotate(-45deg)" : "none",
              }}
            />
          </button>
        </nav>

        {/* Dropdown con las pills — debajo de la navbar, una sola fila en desktop, sin panel con blur */}
        {showDropdown && (
          <div ref={panelRef} className="mx-auto mt-3 w-full max-w-[1200px] bg-transparent px-1">
            {/* Desktop: una sola fila, pills sólidas desalineadas y solapadas */}
            <div className="hidden items-start md:flex">
              {items.map((item, i) => (
                <a
                  key={item.label}
                  href={item.href}
                  onClick={close}
                  ref={(el) => {
                    if (el) bubbleRefs.current[i] = el;
                  }}
                  className={`bubble-pill flex min-w-0 flex-1 items-center justify-center whitespace-nowrap rounded-full border border-zinc-950/5 bg-white px-4 py-5 text-[18px] font-semibold text-zinc-800 shadow-[0_16px_40px_-12px_rgba(0,0,0,0.25)] lg:text-[28px] ${
                    i > 0 ? "-ml-5 lg:-ml-7" : ""
                  }`}
                  style={
                    {
                      "--hover": item.bg,
                      "--rot": `${item.rotation}deg`,
                      "--offset": `${item.offset}px`,
                    } as CSSProperties
                  }>
                  <span
                    ref={(el) => {
                      if (el) labelRefs.current[i] = el;
                    }}
                    className="truncate px-1">
                    {item.label}
                  </span>
                </a>
              ))}
            </div>

            {/* Mobile: stack solapado con leve rotación, pills sólidas */}
            <div className="flex flex-col items-stretch md:hidden">
              {items.map((item, i) => (
                <a
                  key={item.label}
                  href={item.href}
                  onClick={close}
                  ref={(el) => {
                    if (el) bubbleRefs.current[i + items.length] = el;
                  }}
                  className={`bubble-pill group flex min-h-[64px] items-center justify-between rounded-full border border-zinc-950/5 bg-white px-6 py-4 text-[17px] font-semibold text-zinc-900 shadow-[0_14px_32px_-12px_rgba(0,0,0,0.25)] ${
                    i > 0 ? "-mt-3" : ""
                  }`}
                  style={
                    {
                      "--hover": item.bg,
                      "--rot": `${i % 2 === 0 ? -2 : 2}deg`,
                      "--offset": "0px",
                    } as CSSProperties
                  }>
                  <span
                    ref={(el) => {
                      if (el) labelRefs.current[i + items.length] = el;
                    }}>
                    {item.label}
                  </span>
                  <ArrowUpRight className="bubble-arrow h-[18px] w-[18px] opacity-40 group-hover:opacity-100" />
                </a>
              ))}
            </div>
          </div>
        )}
      </header>
    </>
  );
}
