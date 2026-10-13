"use client";

import { useState } from "react";

const darken = (hex: string, p: number) => {
  let c = hex.replace("#", "");
  if (c.length === 3)
    c = c
      .split("")
      .map((x) => x + x)
      .join("");
  const n = parseInt(c, 16);
  const rgb = [16, 8, 0].map((s) =>
    Math.max(0, Math.min(255, Math.floor(((n >> s) & 255) * (1 - p)))),
  );
  return `#${((1 << 24) + (rgb[0] << 16) + (rgb[1] << 8) + rgb[2]).toString(16).slice(1).toUpperCase()}`;
};

export default function PremiumFolder() {
  const color = "#5227FF",
    size = 2,
    max = 3,
    transforms = [
      "translate(-120%,-70%) rotate(-15deg)",
      "translate(10%,-70%) rotate(15deg)",
      "translate(-50%,-100%) rotate(5deg)",
    ];

  const [open, setOpen] = useState(false);
  const [offsets, setOffsets] = useState(
    Array.from({ length: max }, () => ({ x: 0, y: 0 })),
  );

  const reset = () =>
    setOffsets(Array.from({ length: max }, () => ({ x: 0, y: 0 })));

  return (
    <div className="flex min-h-screen items-center justify-center overflow-hidden bg-[#070B14]">
      <div style={{ transform: `scale(${size})` }}>
        <div
          onClick={() => {
            setOpen((v) => !v);
            if (open) reset();
          }}
          className={`group relative cursor-pointer select-none transition-all duration-300 ${!open ? "hover:-translate-y-2" : ""}`}
          style={{ transform: open ? "translateY(-8px)" : undefined }}
        >
          <div
            className="relative h-[80px] w-[100px] rounded-[0_10px_10px_10px] shadow-[0_20px_50px_rgba(82,39,255,0.35)]"
            style={{ background: darken(color, 0.08) }}
          >
            <span
              className="absolute bottom-[98%] left-0 h-[10px] w-[30px] rounded-t-[5px]"
              style={{ background: darken(color, 0.08) }}
            />

            {[0, 1, 2].map((i) => (
              <div
                key={i}
                onMouseMove={(e) => {
                  if (!open) return;
                  const r = e.currentTarget.getBoundingClientRect();
                  setOffsets((p) => {
                    const n = [...p];
                    n[i] = {
                      x: (e.clientX - (r.left + r.width / 2)) * 0.15,
                      y: (e.clientY - (r.top + r.height / 2)) * 0.15,
                    };
                    return n;
                  });
                }}
                onMouseLeave={() =>
                  setOffsets((p) => {
                    const n = [...p];
                    n[i] = { x: 0, y: 0 };
                    return n;
                  })
                }
                className={`absolute bottom-[10%] left-1/2 z-20 border border-black/5 shadow-lg backdrop-blur-xl transition-all duration-300 ${
                  !open
                    ? "-translate-x-1/2 translate-y-[10%] group-hover:translate-y-0"
                    : "hover:scale-110"
                } ${i === 0 ? "h-[80%] w-[70%]" : i === 1 ? `w-[80%] ${open ? "h-[80%]" : "h-[70%]"}` : `w-[90%] ${open ? "h-[80%]" : "h-[60%]"}`}`}
                style={{
                  borderRadius: 10,
                  background:
                    i === 0
                      ? darken("#fff", 0.1)
                      : i === 1
                        ? darken("#fff", 0.05)
                        : "#fff",
                  transform: open
                    ? `${transforms[i]} translate(${offsets[i].x}px,${offsets[i].y}px)`
                    : undefined,
                }}
              >
                <div className="flex flex-col gap-1 p-2">
                  <div className="h-1 w-[80%] rounded-full bg-black/10" />
                  <div className="h-1 w-[60%] rounded-full bg-black/10" />
                  <div className="h-1 w-[70%] rounded-full bg-black/10" />
                </div>
              </div>
            ))}

            {["skew(15deg) scaleY(.6)", "skew(-15deg) scaleY(.6)"].map(
              (t, i) => (
                <div
                  key={i}
                  className={`absolute z-30 h-full w-full origin-bottom transition-all duration-300 ${!open ? `group-hover:[transform:${t.replaceAll(" ", "_")}]` : ""}`}
                  style={{
                    background: color,
                    borderRadius: "5px 10px 10px 10px",
                    ...(open && { transform: t }),
                  }}
                />
              ),
            )}

            <div
              className="absolute inset-0 -z-10 scale-125 blur-2xl opacity-40"
              style={{
                background:
                  "radial-gradient(circle,rgba(82,39,255,.6) 0%,transparent 70%)",
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
