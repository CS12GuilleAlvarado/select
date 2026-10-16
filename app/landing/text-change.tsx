"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, type MotionValue } from "framer-motion";
import { cn } from "@/lib/utils";

interface TextRevealByWordProps {
  text: string;
  className?: string;
}

function Word({
  progress,
  start,
  end,
  word,
}: {
  progress: MotionValue<number>;
  start: number;
  end: number;
  word: string;
}) {
  const opacity = useTransform(progress, [start, end], [0, 1]);

  return (
    <span className="relative mx-1 lg:mx-2.5">
      <span className="absolute opacity-30">{word}</span>

      <motion.span
        style={{ opacity }}
        className="text-black dark:text-white"
      >
        {word}
      </motion.span>
    </span>
  );
}

export default function TextRevealByWord({
  text,
  className,
}: TextRevealByWordProps) {
  const ref = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
  });

  // "br" (o saltos \n) actúan como salto de línea, no como palabra animada.
  const tokens = text.replace(/\n/g, " br ").split(" ");
  const totalWords = tokens.filter((t) => t !== "br" && t !== "").length;

  let wordIndex = 0;

  return (
    <div ref={ref} className={cn("relative z-0 h-[200vh] bg-[#f3e7e2]", className)}>
      <div className="sticky top-0 mx-auto flex h-[50%] w-full items-center justify-center bg-[#f3e7e2] px-6 py-20 md:px-12 lg:px-20">
        <p className="mx-auto flex w-full max-w-6xl flex-wrap justify-center p-5 text-center text-2xl font-bold text-black/20 dark:text-white/20 md:p-8 md:text-3xl lg:p-10 lg:text-4xl xl:text-5xl">
          {tokens.map((word, i) => {
            if (word === "") return null;
            if (word === "br") {
              return <span key={i} aria-hidden className="basis-full" />;
            }
            const start = wordIndex / totalWords;
            const end = start + 1 / totalWords;
            wordIndex += 1;

            return (
              <Word
                key={i}
                progress={scrollYProgress}
                start={start}
                end={end}
                word={word}
              />
            );
          })}
        </p>
      </div>
    </div>
  );
}
