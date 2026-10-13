"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { gsap } from "gsap";

export default function BubbleMenuDemo() {
  const [open, setOpen] = useState(false);
  const [showOverlay, setShowOverlay] = useState(false);

  const overlayRef = useRef<HTMLDivElement>(null);
  const bubbleRefs = useRef<HTMLAnchorElement[]>([]);
  const labelRefs = useRef<HTMLSpanElement[]>([]);

  const items = [
    { label: "Home", href: "#", rotation: -8, bg: "#3b82f6" },
    { label: "About", href: "#", rotation: 8, bg: "#10b981" },
    { label: "Projects", href: "#", rotation: 8, bg: "#f59e0b" },
    { label: "Blog", href: "#", rotation: 8, bg: "#ef4444" },
    { label: "Contact", href: "#", rotation: -8, bg: "#8b5cf6" },
  ];

  const toggle = () => {
    const next = !open;
    if (next) setShowOverlay(true);
    setOpen(next);
  };

  useEffect(() => {
    const overlay = overlayRef.current;
    const bubbles = bubbleRefs.current.filter(Boolean);
    const labels = labelRefs.current.filter(Boolean);

    if (!overlay || !bubbles.length) return;

    if (open) {
      gsap.set(overlay, { display: "flex" });
      gsap.set(bubbles, { scale: 0 });
      gsap.set(labels, { y: 20, opacity: 0 });

      bubbles.forEach((bubble, i) => {
        const tl = gsap.timeline({ delay: i * 0.1 });

        tl.to(bubble, {
          scale: 1,
          duration: 0.45,
          ease: "back.out(1.5)",
        });

        tl.to(
          labels[i],
          {
            y: 0,
            opacity: 1,
            duration: 0.35,
          },
          "-=0.35",
        );
      });
    } else if (showOverlay) {
      gsap.to(labels, {
        opacity: 0,
        y: 20,
        duration: 0.2,
      });

      gsap.to(bubbles, {
        scale: 0,
        duration: 0.2,
        onComplete: () => {
          gsap.set(overlay, { display: "none" });
          setShowOverlay(false);
        },
      });
    }
  }, [open, showOverlay]);

  return (
    <div className="relative min-h-screen bg-zinc-100 overflow-hidden">
      <style>{`
      @media(min-width:900px){
      .bubble-pill{
      transform:rotate(var(--rot));
      }
      .bubble-pill:hover{
      transform:rotate(var(--rot)) scale(1.05);
      background:var(--hover);
      color:white;
      }
      }

      @media(max-width:899px){

      .bubble-overlay{
      padding-top:120px;
      align-items:flex-start;
      }

      .bubble-col{
      flex:0 0 100%!important;
      }

      .bubble-pill{
      font-size:1.5rem;
      min-height:90px;
      }

      }
      `}</style>

      {/* top controls */}

      <nav className="absolute top-8 left-0 right-0 z-[1001] flex items-center justify-between px-6 pointer-events-none">
        <div className="pointer-events-auto h-14 px-8 rounded-full bg-white shadow flex items-center justify-center font-bold">RB</div>

        <button onClick={toggle} className="pointer-events-auto h-14 w-14 rounded-full bg-white shadow flex flex-col justify-center items-center">
          <span
            className="h-[2px] w-6 bg-black transition-all"
            style={{
              transform: open ? "translateY(4px) rotate(45deg)" : "none",
            }}
          />

          <span
            className="h-[2px] w-6 bg-black mt-1.5 transition-all"
            style={{
              transform: open ? "translateY(-4px) rotate(-45deg)" : "none",
            }}
          />
        </button>
      </nav>

      {showOverlay && (
        <div ref={overlayRef} className="bubble-overlay absolute inset-0 z-[1000] flex items-center justify-center">
          <div className="w-full max-w-[1500px] px-6 flex flex-wrap">
            {items.map((item, i) => (
              <div key={item.label} className="bubble-col flex-[0_0_calc(100%/3)] flex justify-center">
                <a
                  href={item.href}
                  ref={(el) => {
                    if (el) bubbleRefs.current[i] = el;
                  }}
                  className="bubble-pill w-full rounded-full bg-white shadow flex justify-center items-center whitespace-nowrap transition-all"
                  style={
                    {
                      minHeight: 160,
                      padding: "2rem 0",
                      fontSize: "clamp(1.5rem,4vw,4rem)",
                      "--rot": `${item.rotation}deg`,
                      "--hover": item.bg,
                    } as CSSProperties
                  }>
                  <span
                    ref={(el) => {
                      if (el) labelRefs.current[i] = el;
                    }}>
                    {item.label}
                  </span>
                </a>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
