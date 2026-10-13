"use client";
import { useEffect, useMemo, useRef, HTMLAttributes, CSSProperties } from "react";

interface VariableProximityTextProps extends HTMLAttributes<HTMLSpanElement> {
  text: string;
  radius?: number;
  falloff?: "linear" | "exponential" | "gaussian";
  fromFontVariationSettings?: string;
  toFontVariationSettings?: string;
  className?: string;
  style?: CSSProperties;
}

export default function VariableProximityText({ text, radius = 180, falloff = "gaussian", fromFontVariationSettings = "'wght' 400,'opsz' 14", toFontVariationSettings = "'wght' 1000,'opsz' 40", className = "", style, ...props }: VariableProximityTextProps) {
  const containerRef = useRef<HTMLSpanElement>(null);
  const letterRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const positionsRef = useRef<{ x: number; y: number }[]>([]);
  const mouseRef = useRef({ x: -9999, y: -9999 });
  const rafRef = useRef<number | null>(null);

  const parsedSettings = useMemo(() => {
    const parse = (input: string) =>
      new Map(
        input
          .split(",")
          .map((v) => v.trim())
          .map((v) => {
            const [axis, value] = v.split(" ");
            return [axis.replace(/['"]/g, ""), parseFloat(value)];
          }),
      );

    const from = parse(fromFontVariationSettings);
    const to = parse(toFontVariationSettings);

    return Array.from(from.entries()).map(([axis, fromValue]) => ({
      axis,
      fromValue,
      toValue: to.get(axis) ?? fromValue,
    }));
  }, [fromFontVariationSettings, toFontVariationSettings]);

  useEffect(() => {
    const updatePositions = () => {
      const container = containerRef.current;
      if (!container) return;

      const containerRect = container.getBoundingClientRect();

      positionsRef.current = letterRefs.current.map((el) => {
        if (!el) return { x: 0, y: 0 };

        const rect = el.getBoundingClientRect();

        return {
          x: rect.left + rect.width / 2 - containerRect.left,
          y: rect.top + rect.height / 2 - containerRect.top,
        };
      });
    };

    updatePositions();

    const resizeObserver = new ResizeObserver(updatePositions);

    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    window.addEventListener("resize", updatePositions);

    if (document.fonts) {
      document.fonts.ready.then(updatePositions);
    }

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("resize", updatePositions);
    };
  }, []);

  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      const container = containerRef.current;
      if (!container) return;

      const rect = container.getBoundingClientRect();

      mouseRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
    };

    const handleLeave = () => {
      mouseRef.current = {
        x: -9999,
        y: -9999,
      };
    };

    window.addEventListener("mousemove", handleMove);
    window.addEventListener("mouseleave", handleLeave);

    return () => {
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("mouseleave", handleLeave);
    };
  }, []);

  useEffect(() => {
    const calculateFalloff = (distance: number) => {
      const norm = Math.max(0, Math.min(1, 1 - distance / radius));

      switch (falloff) {
        case "exponential":
          return norm * norm;
        case "gaussian":
          return Math.exp(-Math.pow(distance / (radius / 2), 2) / 2);
        default:
          return norm;
      }
    };

    const animate = () => {
      const mouse = mouseRef.current;

      letterRefs.current.forEach((letter, index) => {
        if (!letter) return;

        const pos = positionsRef.current[index];
        if (!pos) return;

        const dx = mouse.x - pos.x;
        const dy = mouse.y - pos.y;

        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance >= radius) {
          letter.style.fontVariationSettings = fromFontVariationSettings;
          return;
        }

        const influence = calculateFalloff(distance);

        const settings = parsedSettings
          .map(({ axis, fromValue, toValue }) => {
            const value = fromValue + (toValue - fromValue) * influence;
            return `'${axis}' ${value}`;
          })
          .join(",");

        letter.style.fontVariationSettings = settings;
      });

      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);

    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [radius, falloff, parsedSettings, fromFontVariationSettings]);

  let index = 0;

  return (
    <span
      ref={containerRef}
      className={className}
      style={{
        display: "inline-block",
        fontFamily: "var(--font-geist-sans),sans-serif",
        cursor: "default",
        ...style,
      }}
      {...props}>
      {text.split(" ").map((word, wordIndex) => (
        <span
          key={wordIndex}
          style={{
            display: "inline-block",
            whiteSpace: "nowrap",
          }}>
          {word.split("").map((char) => {
            const current = index++;

            return (
              <span
                key={current}
                ref={(el) => {
                  letterRefs.current[current] = el;
                }}
                style={{
                  display: "inline-block",
                  fontVariationSettings: fromFontVariationSettings,
                  willChange: "font-variation-settings",
                }}>
                {char}
              </span>
            );
          })}
          {wordIndex < text.split(" ").length - 1 && <span>&nbsp;</span>}
        </span>
      ))}
    </span>
  );
}
