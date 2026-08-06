"use client";

import { useCart } from "@/context/CartContext";

export function Header({
  storeName,
  compact = false,
}: {
  storeName: string;
  storeLocation?: string;
  compact?: boolean;
}) {
  const { count, openCart } = useCart();

  return (
    <header
      className={`relative text-ink ${
        compact ? "px-5 pb-5 pt-5" : "px-5 pb-7 pt-5"
      }`}
    >
      <div className="absolute right-5 top-5 z-20 flex items-center gap-2">
        {!compact && (
          <div className="brand-chip rounded-full px-3 py-1.5 text-center">
            <p className="font-display text-sm font-semibold leading-none text-ink">
              ~20
            </p>
            <p className="mt-0.5 text-[9px] font-bold uppercase tracking-wider text-ink/60">
              min
            </p>
          </div>
        )}
        <button
          type="button"
          onClick={openCart}
          aria-label="Abrir carrito"
          className="brand-ink relative flex h-11 w-11 items-center justify-center rounded-full text-white transition hover:opacity-90 active:scale-95"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path
              d="M6 8h12l-1 12H7L6 8Z"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinejoin="round"
            />
            <path
              d="M9 8V6a3 3 0 0 1 6 0v2"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
          {count > 0 && (
            <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-white px-1 font-display text-[11px] font-bold text-ink shadow ring-2 ring-accent-500">
              {count}
            </span>
          )}
        </button>
      </div>

      <div
        className={`animate-rise relative mx-auto flex flex-col items-center text-center ${
          compact ? "pt-1" : "pt-2"
        }`}
      >
        <h1 className="sr-only">{storeName}</h1>

        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/brand/logo-mascot.png"
          alt=""
          className={`mx-auto w-auto object-contain drop-shadow-[0_8px_20px_rgba(0,0,0,0.18)] ${
            compact ? "h-16" : "h-24 sm:h-28"
          }`}
        />

        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/brand/wordmark.png"
          alt={storeName}
          className={`mx-auto mt-2 w-auto object-contain ${
            compact ? "h-12 max-w-[14rem]" : "h-16 max-w-[18rem] sm:h-[4.5rem] sm:max-w-[20rem]"
          }`}
        />

        {!compact && (
          <p className="animate-rise-delay-1 mt-3 max-w-[20rem] px-2 text-[13px] font-bold leading-snug text-ink/85">
            Refrescante bubble tea, dará una explosión de sabores a tu paladar
          </p>
        )}
      </div>
    </header>
  );
}
