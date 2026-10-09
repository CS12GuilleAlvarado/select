"use client";

import React, { useEffect, useMemo, useRef } from "react";
import gsap from "gsap";
import Image from "next/image";
import sele1Img from "@/public/img/sele1.jpg";
import sele2Img from "@/public/img/sele2.jpg";
import sele3Img from "@/public/img/sele3.jpg";

const PremiumCardSwapHero = () => {
  const width = 400;
  const height = 530;
  const cardDistance = 70;
  const verticalDistance = 45;
  const delay = 4500;

  const cards = useMemo(
    () => [
      {
        image: sele1Img,
        title: "Hablidades técnicas",
        subtitle: "Impacto Digital Estratégico",
      },
      {
        image: sele2Img,
       title: "Afinidad de experiencia",
       subtitle: "Impacto Digital Estratégico",
      },
      {
        image: sele3Img,
        title: "Habilidades blandas",
         subtitle: "Impacto Digital Estratégico",
      },
    ],
    []
  );

  const containerRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);
  const intervalRef = useRef<number | null>(null);

  const cardRefs = useMemo(() => cards.map(() => React.createRef<HTMLDivElement>()), [cards]);

  const orderRef = useRef<number[]>(cards.map((_, i) => i));

  const makeSlot = (i: number, total: number) => ({
    x: i * cardDistance,
    y: -i * verticalDistance,
    z: -i * 120,
    rotationZ: i * 3,
    scale: 1 - i * 0.04,
    opacity: 1 - i * 0.06,
    zIndex: total - i,
  });

  useEffect(() => {
    const total = cardRefs.length;

    cardRefs.forEach((ref, i) => {
      const el = ref.current;
      if (!el) return;

      const slot = makeSlot(i, total);

      gsap.set(el, {
        x: slot.x,
        y: slot.y,
        z: slot.z,
        scale: slot.scale,
        opacity: slot.opacity,
        rotationZ: slot.rotationZ,
        rotationX: 6,
        xPercent: -50,
        yPercent: -50,
        zIndex: slot.zIndex,
        force3D: true,
      });
    });

    const swapCards = () => {
      const [front, ...rest] = orderRef.current;
      const frontEl = cardRefs[front].current;
      if (!frontEl) return;

      const tl = gsap.timeline();
      timelineRef.current = tl;

      tl.to(frontEl, {
        x: "+=140",
        y: "+=700",
        rotationZ: -12,
        opacity: 0.7,
        duration: 1.15,
        ease: "power3.in",
      });

      tl.addLabel("promote", "-=0.7");

      rest.forEach((idx, i) => {
        const el = cardRefs[idx].current;
        if (!el) return;

        const slot = makeSlot(i, total);

        tl.set(el, { zIndex: slot.zIndex }, "promote");

        tl.to(
          el,
          {
            x: slot.x,
            y: slot.y,
            z: slot.z,
            scale: slot.scale,
            opacity: slot.opacity,
            rotationZ: slot.rotationZ,
            duration: 1.4,
            ease: "elastic.out(0.7,0.9)",
          },
          `promote+=${i * 0.06}`
        );
      });

      const backSlot = makeSlot(total - 1, total);

      tl.addLabel("return", "promote+=0.2");

      tl.call(() => {
        gsap.set(frontEl, { zIndex: backSlot.zIndex });
      });

      tl.to(
        frontEl,
        {
          x: backSlot.x,
          y: backSlot.y,
          z: backSlot.z,
          scale: backSlot.scale,
          opacity: backSlot.opacity,
          rotationZ: backSlot.rotationZ,
          rotationX: 6,
          duration: 1.5,
          ease: "elastic.out(0.6,0.8)",
        },
        "return"
      );

      tl.call(() => {
        orderRef.current = [...rest, front];
      });
    };

    swapCards();
    intervalRef.current = window.setInterval(swapCards, delay);

    return () => {
      timelineRef.current?.kill();
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [cardRefs]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const move = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;

      gsap.to(container, {
        rotationY: (x - 0.5) * 10,
        rotationX: -(y - 0.5) * 8,
        duration: 1.2,
        ease: "power3.out",
      });
    };

    const reset = () => {
      gsap.to(container, {
        rotationY: 0,
        rotationX: 0,
        duration: 1.2,
        ease: "power3.out",
      });
    };

    container.addEventListener("mousemove", move);
    container.addEventListener("mouseleave", reset);

    return () => {
      container.removeEventListener("mousemove", move);
      container.removeEventListener("mouseleave", reset);
    };
  }, []);

  return (
    <section
      style={{
        width: "100%",
        minHeight: "112vh",
        overflow: "hidden",
        background: "#14373F",
        paddingBlock: "2.5rem",
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          width: "100%",
          minHeight: "calc(112vh - 5rem)",
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          alignItems: "center",
          padding: "0 12vw",
          position: "relative",
        }}
      >
        {/* LEFT */}

        <div style={{ maxWidth: 580, zIndex: 2 }}>
         

          <h1
            style={{
              color: "#fff",
              fontSize: "clamp(2rem,4vw,7rem)",
              lineHeight: 1.02,
              fontWeight: 800,
              marginBottom: "1.5rem",
            }}
          >
           De la bandeja
            <br />
            a la preselección
            <br />
            en tres pasos
          </h1>
          <p
            style={{
              color: "rgba(255,255,255,0.68)",
              fontSize: "1.4rem",
              lineHeight: 1.8,
              maxWidth: 520,
              marginBottom: "2.5rem",
            }}
          >
            Porque cuando la empresa está en equilibrio, trabajar con ilusión y sin cargar el peso del estrés resulta mucho más fácil.
          </p>

          <div style={{ display: "flex", gap: "1rem" }}>
            <button
              style={{
                height: 56,
                padding: "0 1.5rem",
                borderRadius: 18,
                border: "none",
                background: "#4AA47A",
                color: "#fff",
                fontWeight: 600,
                cursor: "pointer",
                boxShadow: "0 10px 40px rgba(168,85,247,.35)",
              }}
            >
              !Empecemos!
            </button>

            <button
              style={{
                height: 56,
                padding: "0 1.5rem",
                borderRadius: 18,
                background: "#f3761c",
                border: "1px solid rgba(255,255,255,0.08)",
                color: "#fff",
                fontWeight: 600,
                cursor: "pointer",
                backdropFilter: "blur(10px)",
              }}
            >
              Video de presentación
            </button>
          </div>
        </div>

        {/* RIGHT */}

        <div
          style={{
            position: "relative",
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            perspective: 2200,
          }}
        >
          <div
            ref={containerRef}
            style={{
              position: "relative",
              width,
              height,
              transformStyle: "preserve-3d",
            }}
          >
            {cards.map((card, i) => (
              <div
                key={i}
                ref={cardRefs[i]}
                style={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  width,
                  height,
                  overflow: "hidden",
                  borderRadius: 28,
                  background: "#111",
                  border: "1px solid rgba(255,255,255,0.08)",
                  boxShadow: `
                    0 30px 80px rgba(0,0,0,.45),
                    0 60px 140px rgba(0,0,0,.55),
                    inset 0 1px 0 rgba(255,255,255,.08)
                  `,
                  backfaceVisibility: "hidden",
                  transformStyle: "preserve-3d",
                }}
              >
                <Image
                  src={card.image}
                  alt={card.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 400px"
                  priority={i === 0}
                  style={{
                    position: "absolute",
                    inset: 0,
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    transform: "scale(1.04)",
                    filter: "brightness(1.05) saturate(1.15) contrast(1.05)",
                  }}
                />

                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    background: `
                      linear-gradient(
                        to top,
                        rgba(0,0,0,.68) 0%,
                        rgba(0,0,0,.32) 38%,
                        rgba(0,0,0,.08) 65%,
                        transparent 82%
                      )
                    `,
                  }}
                />

                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    background: `
                      radial-gradient(
                        circle at top left,
                        rgba(255,255,255,.18),
                        transparent 38%
                      )
                    `,
                    mixBlendMode: "screen",
                  }}
                />

                <div
                  style={{
                    position: "absolute",
                    left: 26,
                    right: 26,
                    bottom: 26,
                    zIndex: 2,
                  }}
                >
                  <h2
                    style={{
                      color: "#fff",
                      fontSize: "2rem",
                      lineHeight: 1.05,
                      fontWeight: 700,
                      marginBottom: ".6rem",
                    }}
                  >
                    {card.title}
                  </h2>

                  <p
                    style={{
                      color: "rgba(255,255,255,.72)",
                      fontSize: "1rem",
                      lineHeight: 1.7,
                    }}
                  >
                    {card.subtitle}
                  </p>
                </div>
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    borderRadius: "inherit",
                    border: "1px solid rgba(255,255,255,.08)",
                    boxShadow: `
                      inset 0 1px 0 rgba(255,255,255,.12),
                      inset 0 -1px 0 rgba(255,255,255,.04)
                    `,
                  }}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default PremiumCardSwapHero;
