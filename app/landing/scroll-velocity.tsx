"use client";

import React, { useRef, useLayoutEffect, useState } from "react";
import { motion, useScroll, useSpring, useTransform, useMotionValue, useVelocity, useAnimationFrame } from "motion/react";

interface ScrollVelocityProps {
  texts: React.ReactNode[];
  velocity?: number;
  className?: string;
  damping?: number;
  stiffness?: number;
  numCopies?: number;
  scrollContainerRef?: React.RefObject<HTMLElement>;
  velocityMapping?: {
    input: [number, number];
    output: [number, number];
  };
  parallaxClassName?: string;
  scrollerClassName?: string;
  parallaxStyle?: React.CSSProperties;
  scrollerStyle?: React.CSSProperties;
}

export default function ScrollVelocity({ texts, velocity = 100, className = "", damping = 50, stiffness = 400, numCopies = 6, scrollContainerRef, velocityMapping = { input: [0, 1000], output: [0, 5] }, parallaxClassName = "", scrollerClassName = "", parallaxStyle, scrollerStyle }: ScrollVelocityProps) {
  const Row = ({ children, baseVelocity }: { children: React.ReactNode; baseVelocity: number }) => {
    const baseX = useMotionValue(0);

    const scrollOptions = scrollContainerRef ? { container: scrollContainerRef } : {};

    const { scrollY } = useScroll(scrollOptions);

    const scrollVelocity = useVelocity(scrollY);

    const smoothVelocity = useSpring(scrollVelocity, {
      damping,
      stiffness,
    });

    const velocityFactor = useTransform(smoothVelocity, velocityMapping.input, velocityMapping.output, { clamp: false });

    const copyRef = useRef<HTMLSpanElement>(null);

    const [copyWidth, setCopyWidth] = useState(0);

    useLayoutEffect(() => {
      const update = () => {
        if (copyRef.current) {
          setCopyWidth(copyRef.current.offsetWidth);
        }
      };

      update();

      const resizeObserver = new ResizeObserver(update);

      if (copyRef.current) {
        resizeObserver.observe(copyRef.current);
      }

      window.addEventListener("resize", update);

      return () => {
        resizeObserver.disconnect();
        window.removeEventListener("resize", update);
      };
    }, []);

    const wrap = (min: number, max: number, v: number) => {
      const range = max - min;
      const mod = (((v - min) % range) + range) % range;
      return mod + min;
    };

    const x = useTransform(baseX, (v) => {
      if (!copyWidth) return "0px";
      return `${wrap(-copyWidth, 0, v)}px`;
    });

    const directionFactor = useRef(1);

    useAnimationFrame((_, delta) => {
      let moveBy = directionFactor.current * baseVelocity * (delta / 1000);

      if (velocityFactor.get() < 0) {
        directionFactor.current = -1;
      } else if (velocityFactor.get() > 0) {
        directionFactor.current = 1;
      }

      moveBy += directionFactor.current * moveBy * velocityFactor.get();

      baseX.set(baseX.get() + moveBy);
    });

    return (
      <div
        className={`relative overflow-hidden ${parallaxClassName}`}
        style={{
          maskImage: "linear-gradient(to right,transparent,white 20%,white 80%,transparent)",
          WebkitMaskImage: "linear-gradient(to right,transparent,white 20%,white 80%,transparent)",
          ...parallaxStyle,
        }}>
        <motion.div
          className={`flex whitespace-nowrap ${scrollerClassName}`}
          style={{
            x,
            ...scrollerStyle,
          }}>
          {Array.from({ length: numCopies }).map((_, i) => (
            <span key={i} ref={i === 0 ? copyRef : null} className={`flex-shrink-0 ${className}`}>
              {children}&nbsp;
            </span>
          ))}
        </motion.div>
      </div>
    );
  };

  return (
    <section className="w-full">
      {texts.map((text, index) => (
        <Row key={index} baseVelocity={index % 2 === 0 ? velocity : -velocity}>
          {text}
        </Row>
      ))}
    </section>
  );
}
