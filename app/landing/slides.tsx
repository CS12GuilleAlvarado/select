"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const slides = [
  {
    id: 1,
    super: "Control",
    title: "Gestión & Control",
    blurb: "...",
    link: "Control Estratégico",
    color: "#00D9B1",
    image1: "/img/orange.jpg",
    image2: "/img/slid1.jpg",
  },
  {
    id: 2,
    super: "Capacitación",
    title: "Capacitaciones",
    blurb: "...",
    link: "Desarrollo de Competencias",
    color: "#818CF8",
    image1: "/img/slid2.jpg",
    image2: "/img/slid3.jpg",
  },
  {
    id: 3,
    super: "Implementación",
    title: "Implementaciones",
    blurb: "...",
    link: "Transformación Operativa",
    color: "#F7CC20",
    image1: "/img/slid4.jpg",
    image2: "/img/slid5.jpg",
  },
  {
    id: 4,
    super: "Certificaciones",
    title: "Certificaciones",
    blurb: "...",
    link: "Estándares Internacionales",
    color: "#00D0FF",
    image1: "/img/slid6.jpg",
    image2: "/img/slid7.jpg",
  },
];

export default function Cinema() {
  const [active, setActive] = useState(0);
  const [loaded, setLoaded] = useState(false);



  useEffect(() => {
    const timer = setTimeout(() => setLoaded(true), 300);
    return () => clearTimeout(timer);
  }, []);


  useEffect(() => {
    const interval = setInterval(() => {
      setActive(prev => (prev + 1) % slides.length);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  const nextSlide = () => setActive(prev => (prev + 1) % slides.length);
  const prevSlide = () => setActive(prev => (prev - 1 + slides.length) % slides.length);

  return (
    <section className="relative min-h-screen overflow-hidden py-20 bg-white text-black">
      <nav className={`mx-auto flex w-[86vw] items-center justify-between py-10 transition-all duration-1000 ${loaded ? "translate-y-0 opacity-100" : "-translate-y-8 opacity-0"}`}>
        <div className="text-2xl font-black tracking-wide">Lider en Gestión Integral de Riesgos</div>

        <ul className="hidden items-center gap-10 text-xs font-medium uppercase tracking-[0.25em] text-neutral-500 md:flex">
          {["Gestión & Control", "Capacitación", "Implementación", "Certificaciones"].map(item => (
            <li key={item} className=" hover:text-black">{item}</li>
          ))}
        </ul>
      </nav>

      <div className="mx-auto flex w-[86vw] flex-col gap-10 pb-20 lg:h-[56rem] lg:flex-row">
        <div className="relative z-20 w-full lg:w-[420px]">
          <div className="absolute top-0 right-0 flex h-28 w-28 items-center justify-center text-5xl font-black text-white transition-all duration-700 md:h-60 md:w-60 md:text-7xl" style={{ backgroundColor: slides[active].color }}>
            0{active + 1}
          </div>

          <div className="relative mt-32 md:mt-60">
            <div className={`relative overflow-hidden flex text-center justify-center mx-auto py-12 text-white transition-all duration-1000 ${loaded ? "scale-y-100 opacity-100" : "scale-y-0 opacity-0"}`} style={{ backgroundColor: "#0020D6", transformOrigin: "top" }}>
            

              <h1 className="mt-4 py-10 flex flex-wrap text-5xl font-black leading-none md:text-4xl">
                {slides[active].title.split("").map((letter, index) => (
                  <span key={`${slides[active].id}-${index}`} className="animate-letter inline-block" style={{ animationDelay: `${index * .05}s` }}>
                    {letter === " " ? "\u00A0" : letter}
                  </span>
                ))}
              </h1>
            </div>
          </div>

          <div className={`mt-10 max-w-xl transition-all duration-1000 ${loaded ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"}`}>
            <p key={slides[active].blurb} className="animate-fadeUp text-base leading-8 text-neutral-700">
              {slides[active].blurb}
            </p>

            <button className="group relative mt-12 flex items-center gap-5 text-lg font-bold" style={{ color: slides[active].color }}>
              <span className="flex h-14 w-14 items-center justify-center rounded-full text-white transition-transform duration-300 group-hover:translate-x-1" style={{ backgroundColor: slides[active].color }}>
                →
              </span>

              <span className="text-black"><span className="font-black">{slides[active].link}</span></span>
            </button>
          </div>
        </div>

        <div className="relative flex-1 overflow-hidden">
      <div className="grid h-full grid-cols-1 gap-4 md:grid-cols-2">
  {[0, 1].map((col) => (
    <div
      key={col}
      className="relative h-[430px] overflow-hidden rounded-3xl md:h-full"
    >
      {slides.map((slide, index) => (
        <div
          key={`${slide.id}-${col}`}
          className={`absolute inset-0 transition-all duration-[1800ms] ${
            active === index
              ? "scale-100 opacity-100"
              : col === 0
              ? "-translate-y-full scale-125 opacity-0"
              : "translate-y-full scale-125 opacity-0"
          }`}
        >
          <Image
            src={col === 0 ? slide.image1 : slide.image2}
            alt={slide.title}
            fill
            priority={active === index}
            className="object-cover"
          />
        </div>
      ))}
    </div>
  ))}
</div>

          <div className={`absolute right-0 bottom-0 flex h-24 w-full items-center justify-between bg-white px-4 shadow-2xl transition-all duration-1000 md:w-[50%] ${loaded ? "opacity-100" : "opacity-0"}`}>
            <button onClick={prevSlide} className="flex h-16 w-16 items-center justify-center rounded-full border border-neutral-200 transition hover:scale-105">
              <ChevronLeft />
            </button>

            <div className="text-sm font-semibold tracking-[0.3em] text-neutral-500">
              <span className="text-black">0{active+1}</span> / 04
            </div>

            <button onClick={nextSlide} className="flex h-16 w-16 items-center justify-center rounded-full border border-neutral-200 transition hover:scale-105">
              <ChevronRight />
            </button>
          </div>
        </div>
      </div>

      <style jsx>{`
        .animate-letter{opacity:0;transform:translateY(-30px);animation:letterIn .7s forwards}
        .animate-fadeUp{animation:fadeUp .8s ease forwards}

        @keyframes letterIn{
          to{opacity:1;transform:translateY(0)}
        }

        @keyframes fadeUp{
          from{opacity:0;transform:translateY(20px)}
          to{opacity:1;transform:translateY(0)}
        }
      `}</style>
    </section>
  );
}