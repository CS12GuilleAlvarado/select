"use client";

import {
  useEffect,
  useRef,
  useState,
  type ReactNode,
  type CSSProperties,
} from "react";

/**
 * Hook compartido: observa visibilidad con IntersectionObserver.
 * Devuelve [ref, visible]. Barato: un observer por instancia,
 * se desconecta al desmontar.
 */
export function useInView<T extends HTMLElement = HTMLDivElement>(
  rootMargin = "400px 0px",
  threshold = 0,
) {
  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") {
      setInView(true);
      return;
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        setInView(entry.isIntersecting);
      },
      { rootMargin, threshold },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [rootMargin, threshold]);

  return [ref, inView] as const;
}

type LazyMountProps = {
  children: ReactNode;
  /** Altura reservada para evitar layout shift antes de montar. */
  minHeight?: number | string;
  /** Pre-carga antes de entrar a viewport. */
  rootMargin?: string;
  className?: string;
  style?: CSSProperties;
  /** Si true, desmonta al salir de vista (ahorra GPU pero remonta al volver). */
  unmountOnHide?: boolean;
};

/**
 * Monta los hijos solo cuando están cerca del viewport.
 * Por defecto: mount-once (no desmonta para evitar thrash).
 * Con unmountOnHide=true: desmonta fuera de pantalla (máximo ahorro).
 */
export function LazyMount({
  children,
  minHeight = 480,
  rootMargin = "500px 0px",
  className,
  style,
  unmountOnHide = false,
}: LazyMountProps) {
  const [ref, inView] = useInView<HTMLDivElement>(rootMargin);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (inView) setMounted(true);
    else if (unmountOnHide) {
      // Pequeño debounce implícito: solo desmonta si lleva fuera un frame.
      // Para secciones pesadas con canvas es donde más se ahorra.
      setMounted(false);
    }
  }, [inView, unmountOnHide]);

  const show = unmountOnHide ? inView && mounted : mounted;

  return (
    <div
      ref={ref}
      className={className}
      style={{
        contentVisibility: "auto",
        containIntrinsicSize: `auto ${typeof minHeight === "number" ? `${minHeight}px` : minHeight}`,
        minHeight: show ? undefined : minHeight,
        ...style,
      }}>
      {show ? (
        children
      ) : (
        <div
          aria-hidden
          style={{
            minHeight,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        />
      )}
    </div>
  );
}
