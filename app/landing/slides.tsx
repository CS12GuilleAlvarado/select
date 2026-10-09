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
    color: "#34206b",
    image1: "/img/sele4.jpg",
    image2: "/img/sele5.jpg",
  },
  {
    id: 2,
    super: "Capacitación",
    title: "Capacitaciones",
    blurb: "...",
    link: "Desarrollo de Competencias",
    color: "#19c5c1",
    image1: "/img/sele6.jpg",
    image2: "/img/sele7.jpg",
  },
  {
    id: 3,
    super: "Implementación",
    title: "Implementaciones",
    blurb: "...",
    link: "Transformación Operativa",
    color: "#3f88c5",
    image1: "/img/sele8.jpg",
    image2: "/img/sele9.jpg",
  },
  {
    id: 4,
    super: "Certificaciones",
    title: "Certificaciones",
    blurb: "...",
    link: "Estándares Internacionales",
    color: "#14373F",
    image1: "/img/sele10.jpg",
    image2: "/img/sele11.jpg",
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
    <section className="relative flex min-h-screen flex-col justify-center overflow-hidden bg-[#f3e7e2] py-6 text-black md:py-8">
      <nav className={`mx-auto flex w-[80vw] max-w-[1200px] items-center justify-between py-4 transition-all duration-1000 md:py-6 ${loaded ? "translate-y-0 opacity-100" : "-translate-y-8 opacity-0"}`}>
        <div className="text-xl font-black tracking-wide">Lider en Gestión Integral de Riesgos</div>

        <ul className="hidden items-center gap-10 text-xs font-medium uppercase tracking-[0.25em] text-neutral-500 md:flex">
          {["Gestión & Control", "Capacitación", "Implementación", "Certificaciones"].map(item => (
            <li key={item} className=" hover:text-black">{item}</li>
          ))}
        </ul>
      </nav>

      <div className="mx-auto flex w-[80vw] max-w-[1200px] flex-col gap-6 pb-6 lg:h-[34rem] lg:flex-row xl:h-[36rem]">
        <div className="relative z-20 w-full lg:w-[380px]">
          <div className="absolute top-0 right-0 left-0 flex items-start justify-between">
            <div className="relative h-20 w-20 shrink-0 md:h-36 md:w-36">
              <Image
                src="/img/new-icon.png"
                alt="Logo SELE"
                fill
                priority
                className="object-contain"
              />
            </div>
            <div className="flex h-20 w-20 items-center justify-center text-4xl font-black text-white transition-all duration-700 md:h-36 md:w-36 md:text-6xl" style={{ backgroundColor: slides[active].color }}>
              0{active + 1}
            </div>
          </div>

          <div className="relative mt-24 md:mt-40">
            <div className={`relative overflow-hidden flex text-center justify-center mx-auto py-6 text-white transition-all duration-1000 ${loaded ? "scale-y-100 opacity-100" : "scale-y-0 opacity-0"}`} style={{ backgroundColor: "#f3761c", transformOrigin: "top" }}>
            

              <h1 className="mt-2 flex flex-wrap py-6 text-3xl font-black leading-none md:text-3xl">
                {slides[active].title.split("").map((letter, index) => (
                  <span key={`${slides[active].id}-${index}`} className="animate-letter inline-block" style={{ animationDelay: `${index * .05}s` }}>
                    {letter === " " ? "\u00A0" : letter}
                  </span>
                ))}
              </h1>
            </div>
          </div>

          <div className={`mt-6 max-w-xl transition-all duration-1000 ${loaded ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"}`}>
            <p key={slides[active].blurb} className="animate-fadeUp text-sm leading-7 text-neutral-700">
              {slides[active].blurb}
            </p>

            <button className="group relative mt-6 flex items-center gap-4 text-base font-bold" style={{ color: slides[active].color }}>
              <span className="flex h-12 w-12 items-center justify-center rounded-full text-white transition-transform duration-300 group-hover:translate-x-1" style={{ backgroundColor: slides[active].color }}>
                →
              </span>

              <span className="text-black"><span className="font-black">{slides[active].link}</span></span>
            </button>
          </div>
        </div>

        <div className="relative flex-1 overflow-hidden">
      <div className="grid h-full grid-cols-1 gap-3 md:grid-cols-2">
  {[0, 1].map((col) => (
    <div
      key={col}
      className="relative h-[280px] overflow-hidden rounded-2xl md:h-[320px] lg:h-full"
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

          <div className={`absolute right-0 bottom-0 flex h-16 w-full items-center justify-between bg-white px-4 shadow-2xl transition-all duration-1000 md:h-20 md:w-[50%] ${loaded ? "opacity-100" : "opacity-0"}`}>
            <button onClick={prevSlide} className="flex h-12 w-12 items-center justify-center rounded-full border border-neutral-200 transition hover:scale-105">
              <ChevronLeft />
            </button>

            <div className="text-sm font-semibold tracking-[0.3em] text-neutral-500">
              <span className="text-black">0{active+1}</span> / 04
            </div>

            <button onClick={nextSlide} className="flex h-12 w-12 items-center justify-center rounded-full border border-neutral-200 transition hover:scale-105">
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