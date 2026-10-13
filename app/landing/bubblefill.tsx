"use client";

import { ReactNode } from "react";

interface BubbleFillButtonProps {
  text: string;
  icon?: ReactNode;
  onClick?: () => void;
  borderColor?: string;
  fillColor?: string;
  textColor?: string;
  className?: string;
}

export default function BubbleFillButton({
  text,
  icon,
  onClick,
  borderColor = "#2890F1",
  fillColor = "#2890F1",
  textColor = "#2890F1",
  className = "",
}: BubbleFillButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`
        group
        relative
        isolate
        overflow-hidden
        rounded-full
        border
        px-5
        py-3
        inline-flex
        items-center
        gap-2
        font-semibold
        transition-colors
        duration-300
        hover:text-white
        ${className}
      `}
      style={{
        borderColor,
        color: textColor,
      }}
    >
      {/* Burbuja */}
      <span
        className="
          absolute
          left-1/2
          top-1/2
          z-0
          h-[350px]
          w-[350px]
          -translate-x-1/2
          -translate-y-1/2
          rounded-full
          scale-0
          transition-transform
          duration-500
          ease-out
          group-hover:scale-100
        "
        style={{
          background: fillColor,
        }}
      />

      <span className="relative z-10 flex items-center gap-2">
        {icon}
        {text}
      </span>
    </button>
  );
}
