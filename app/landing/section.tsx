"use client";

import React, { useRef, type ReactNode } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { FiArrowUpRight } from "react-icons/fi";

export const TextParallaxContentExample = () => {
  return (
    <div className="bg-[#f3e7e2] pt-28">
      <TextParallaxContent
        imgUrl="/img/hero/hero1.jpg"
        subheading="Análisis inteligente Selectia"
        heading="Talentosssss"
        >
        <ExampleContent />
      </TextParallaxContent>
      <TextParallaxContent
        imgUrl="/img/hero/hero2.jpg"
        subheading="Acelera el proceso"
        heading="Decisiones más rápidas y acertadas"
        >
        <ExampleContent />
      </TextParallaxContent>
      <TextParallaxContent
        imgUrl="/img/hero/hero3.jpg"
        subheading="Sube tus CV´s"
        heading="El mejor talento en menos tiempo"
        >
        <ExampleContent />
      </TextParallaxContent>
    </div>
  );
};

const IMG_PADDING = 12;

type TextParallaxContentProps = {
  imgUrl: string;
  subheading: string;
  heading: string;
  children: ReactNode;
};

const TextParallaxContent = ({ imgUrl, subheading, heading, children }: TextParallaxContentProps) => {
  return (
    <div
      style={{
        paddingLeft: IMG_PADDING,
        paddingRight: IMG_PADDING,
      }}
    >
      <div className="relative h-[150vh]">
        <StickyImage imgUrl={imgUrl} />
        <OverlayCopy heading={heading} subheading={subheading} />
      </div>
      {children}
    </div>
  );
};

type StickyImageProps = {
  imgUrl: string;
};

const StickyImage = ({ imgUrl }: StickyImageProps) => {
  const targetRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["end end", "end start"],
  });

  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.85]);
  const opacity = useTransform(scrollYProgress, [0, 1], [1, 0]);

  return (
    <motion.div
      style={{
        backgroundImage: `url(${imgUrl})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        height: `calc(100vh - ${IMG_PADDING * 2}px)`,
        top: IMG_PADDING,
        scale,
      }}
      ref={targetRef}
      className="sticky z-0 overflow-hidden rounded-3xl"
    >
      <motion.div
        className="absolute inset-0 bg-neutral-950/70"
        style={{
          opacity,
        }}
      />
    </motion.div>
  );
};

type OverlayCopyProps = {
  subheading: string;
  heading: string;
};

const OverlayCopy = ({ subheading, heading }: OverlayCopyProps) => {
  const targetRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start end", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [250, -250]);
  const opacity = useTransform(scrollYProgress, [0.25, 0.5, 0.75], [0, 1, 0]);

  return (
    <motion.div
      style={{
        y,
        opacity,
      }}
      ref={targetRef}
      className="absolute left-0 top-0 flex h-screen w-full flex-col items-center justify-center text-white"
    >
      <p className="mb-2 text-center text-xl md:mb-4 md:text-3xl">
        {subheading}
      </p>
      <p className="text-center text-4xl font-bold md:text-7xl">{heading}</p>
    </motion.div>
  );
};

const ExampleContent = () => (
  <div className="mx-auto grid max-w-5xl grid-cols-1 gap-8 px-4 pb-24 pt-12 md:grid-cols-12">
    <h2 className="col-span-1 text-3xl font-bold md:col-span-4">
     Todo tu talento en un solo lugar
    </h2>
    <div className="col-span-1 md:col-span-8">
      <p className="mb-4 text-xl text-neutral-600 md:text-2xl">
        Organiza los perfiles de tus candidatos y centraliza la información para gestionar tus procesos de selección de forma más sencilla y eficiente.
      </p>
      <p className="mb-8 text-xl text-neutral-600 md:text-2xl">
        Deja que la IA analice los CVs según los requisitos de cada vacante y descubre qué candidatos se ajustan mejor al perfil que buscas.
      </p>
      <button className="w-full rounded bg-neutral-900 px-9 py-4 text-xl text-white transition-colors hover:bg-neutral-700 md:w-fit">
        ¡Conoce más! <FiArrowUpRight className="inline" />
      </button>
    </div>
  </div>
);
