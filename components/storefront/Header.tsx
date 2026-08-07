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
      className={`relative text-white ${
        compact
          ? "px-5 pb-4 pt-5"
          : "px-5 pb-6 pt-5 lg:px-8 lg:pb-8 lg:pt-7"
      }`}
    >
      {/* Mobile / compact: cart top-right */}
      <div className="absolute right-5 top-5 z-20 flex items-center gap-2 lg:right-8 lg:top-7">
        {!compact && (
          <div className="rounded-full bg-white/95 px-3 py-1.5 text-center shadow-sm lg:hidden">
            <p className="font-display text-sm font-semibold leading-none text-ink">
              ~20
            </p>
            <p className="mt-0.5 text-[9px] font-bold uppercase tracking-wider text-ink/55">
              min
            </p>
          </div>
        )}
        <button
          type="button"
          onClick={openCart}
          aria-label="Abrir carrito"
          className="relative flex h-11 w-11 items-center justify-center rounded-full bg-ink text-white shadow-sm transition hover:opacity-90 active:scale-95 lg:h-12 lg:w-12"
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
            <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-white px-1 font-display text-[11px] font-bold text-ink shadow ring-2 ring-[#ff7800]">
              {count}
            </span>
          )}
        </button>
      </div>

      <h1 className="sr-only">{storeName}</h1>

      {/* Mobile brand (centered) */}
      <div
        className={`animate-rise relative mx-auto flex flex-col items-center text-center lg:hidden ${
          compact ? "pt-1" : "pt-2"
        }`}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/brand/logo-mascot.png"
          alt=""
          className={`mx-auto w-auto object-contain drop-shadow-[0_10px_24px_rgba(0,0,0,0.22)] ${
            compact ? "h-14" : "h-[6.5rem]"
          }`}
        />

        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/brand/wordmark.png"
          alt={storeName}
          className={`mx-auto mt-1.5 w-auto object-contain drop-shadow-sm ${
            compact
              ? "h-10 max-w-[12rem]"
              : "h-[3.75rem] max-w-[17rem]"
          }`}
        />

        {!compact && (
          <p className="animate-rise-delay-1 mt-3 max-w-[19rem] px-2 text-[13px] font-bold leading-snug text-white/95">
            Refrescante bubble tea, dará una explosión de sabores a tu paladar
          </p>
        )}
      </div>

      {/* Desktop brand (horizontal) */}
      {!compact && (
        <div className="animate-rise relative hidden items-center gap-6 pr-16 lg:flex">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/brand/logo-mascot.png"
            alt=""
            className="h-24 w-auto shrink-0 object-contain drop-shadow-[0_10px_24px_rgba(0,0,0,0.22)]"
          />
          <div className="min-w-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/brand/wordmark.png"
              alt=""
              className="h-16 w-auto max-w-[22rem] object-contain object-left drop-shadow-sm"
            />
            <p className="mt-2 max-w-md text-[15px] font-bold leading-snug text-white/95">
              Refrescante bubble tea, dará una explosión de sabores a tu paladar
            </p>
            <div className="mt-3 inline-flex items-center gap-2 rounded-full bg-white/95 px-3.5 py-1.5 text-ink shadow-sm">
              <span className="font-display text-sm font-bold">~20 min</span>
              <span className="text-xs font-semibold text-ink/50">retiro estimado</span>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
