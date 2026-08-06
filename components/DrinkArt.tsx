"use client";

import { useId } from "react";

const PALETTES: Record<string, { from: string; to: string; fleck: string; backdrop: string }> = {
  taro: { from: "#e0c6f0", to: "#8a5cb0", fleck: "#4a2f66", backdrop: "#f1e4fa" },
  matcha: { from: "#d4e8ac", to: "#6a9c3d", fleck: "#3f6b1f", backdrop: "#e9f3d8" },
  honey: { from: "#fbe4b0", to: "#d99a3d", fleck: "#a9701c", backdrop: "#fcf1dc" },
  blacktea: { from: "#dcb995", to: "#8a5a34", fleck: "#4a2e18", backdrop: "#f1e2d1" },
  icecream: { from: "#fdece6", to: "#eaad9c", fleck: "#c9836f", backdrop: "#fdf1ec" },
  brownsugar: { from: "#e7bd85", to: "#8a5822", fleck: "#4a2c0d", backdrop: "#f5e5cc" },
  wintermelon: { from: "#d3f0e0", to: "#4f9c78", fleck: "#2d6b4d", backdrop: "#e7f7ee" },
  pearl: { from: "#4a4a4a", to: "#1a1a1a", fleck: "#000000", backdrop: "#e8e6e3" },
  cream: { from: "#ffffff", to: "#f1e6d8", fleck: "#dcc7a3", backdrop: "#f8f2e8" },
  jelly: { from: "#b6d3c7", to: "#4c6d63", fleck: "#2e453d", backdrop: "#e5efe9" },
  redbean: { from: "#c98a83", to: "#6e2f2a", fleck: "#4a1c19", backdrop: "#f0dfdb" },
  pudding: { from: "#fdeeb8", to: "#e8c15c", fleck: "#c99a2e", backdrop: "#fcf5df" },
};

function paletteFor(colorway: string) {
  return PALETTES[colorway] ?? PALETTES.honey;
}

const SIZE_CLASSES = {
  sm: "h-14 w-14",
  md: "h-20 w-20",
  lg: "h-40 w-40",
};

function CupIllustration({
  gradId,
  from,
  to,
  fleck,
}: {
  gradId: string;
  from: string;
  to: string;
  fleck: string;
}) {
  return (
    <svg viewBox="0 0 64 64" className="h-full w-full" aria-hidden="true">
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={from} />
          <stop offset="100%" stopColor={to} />
        </linearGradient>
      </defs>
      <rect x="28" y="1" width="7" height="17" rx="3.5" fill="#ffffff" opacity="0.9" />
      <path
        d="M13 19 H51 L45.5 58 C45.2 61 42.8 63 39.8 63 H24.2 C21.2 63 18.8 61 18.5 58 Z"
        fill={`url(#${gradId})`}
        stroke="rgba(0,0,0,0.08)"
        strokeWidth="0.75"
      />
      <rect x="12" y="14.5" width="40" height="6.5" rx="3.25" fill="#ffffff" />
      <g fill={fleck} opacity="0.85">
        <circle cx="26" cy="52" r="2.6" />
        <circle cx="34.5" cy="54.5" r="2.6" />
        <circle cx="30" cy="47.5" r="2.2" />
        <circle cx="38" cy="49" r="2.2" />
        <circle cx="24" cy="46" r="1.9" />
      </g>
      <path
        d="M22 25 L20 50"
        stroke="#ffffff"
        strokeWidth="3.5"
        strokeLinecap="round"
        opacity="0.22"
      />
    </svg>
  );
}

function BowlIllustration({
  gradId,
  to,
  fleck,
}: {
  gradId: string;
  to: string;
  fleck: string;
}) {
  return (
    <svg viewBox="0 0 64 64" className="h-full w-full" aria-hidden="true">
      <defs>
        <radialGradient id={gradId} cx="35%" cy="30%" r="75%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="100%" stopColor="#f4f1ec" />
        </radialGradient>
      </defs>
      <path
        d="M9 25 H55 C55 42 52 54 32 54 C12 54 9 42 9 25 Z"
        fill={`url(#${gradId})`}
        stroke="rgba(0,0,0,0.08)"
        strokeWidth="0.75"
      />
      <ellipse cx="32" cy="25" rx="23" ry="6.5" fill={to} />
      <ellipse cx="32" cy="25" rx="23" ry="6.5" fill="none" stroke="rgba(0,0,0,0.08)" strokeWidth="0.75" />
      <g fill={fleck} opacity="0.85">
        <circle cx="24" cy="24" r="2.6" />
        <circle cx="32" cy="22.5" r="2.6" />
        <circle cx="40" cy="24" r="2.6" />
        <circle cx="28" cy="26.5" r="2.2" />
        <circle cx="36" cy="26.5" r="2.2" />
      </g>
    </svg>
  );
}

const ROUNDED_CLASSES = {
  xl: "rounded-2xl",
  full: "rounded-full",
};

export function DrinkArt({
  colorway,
  imageUrl,
  alt,
  size = "md",
  kind = "drink",
  backdrop = false,
  rounded = "xl",
  className = "",
}: {
  colorway: string;
  imageUrl?: string | null;
  alt: string;
  size?: keyof typeof SIZE_CLASSES;
  kind?: "drink" | "topping";
  backdrop?: boolean;
  rounded?: keyof typeof ROUNDED_CLASSES;
  className?: string;
}) {
  const sizeClass = SIZE_CLASSES[size];
  const roundedClass = ROUNDED_CLASSES[rounded];
  const gradId = useId();
  const palette = paletteFor(colorway);

  if (imageUrl) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={imageUrl}
        alt={alt}
        className={`${sizeClass} ${roundedClass} ${className} object-cover`}
      />
    );
  }

  const art =
    kind === "topping" ? (
      <BowlIllustration gradId={gradId} to={palette.to} fleck={palette.fleck} />
    ) : (
      <CupIllustration gradId={gradId} from={palette.from} to={palette.to} fleck={palette.fleck} />
    );

  if (backdrop) {
    return (
      <div
        className={`${sizeClass} ${roundedClass} ${className} relative flex items-center justify-center`}
        style={{ background: palette.backdrop }}
        role="img"
        aria-label={alt}
      >
        <div className="h-[85%] w-[85%]">{art}</div>
      </div>
    );
  }

  return (
    <div className={`${sizeClass} ${className}`} role="img" aria-label={alt}>
      {art}
    </div>
  );
}
