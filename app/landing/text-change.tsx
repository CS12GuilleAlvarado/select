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

  const words = text.split(" ");

  return (
    <div ref={ref} className={cn("relative z-0 h-[200vh]", className)}>
      <div className="sticky top-0 mx-auto flex h-[50%] max-w-4xl items-center bg-transparent px-4 py-20">
        <p className="flex flex-wrap p-5 text-2xl font-bold text-black/20 dark:text-white/20 md:p-8 md:text-3xl lg:p-10 lg:text-4xl xl:text-5xl">
          {words.map((word, i) => {
            const start = i / words.length;
            const end = start + 1 / words.length;

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
