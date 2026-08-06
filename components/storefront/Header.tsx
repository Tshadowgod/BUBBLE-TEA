"use client";

import { useCart } from "@/context/CartContext";

export function Header({
  storeName,
  storeLocation,
}: {
  storeName: string;
  storeLocation: string;
}) {
  const { count, openCart } = useCart();

  return (
    <header className="flex items-center justify-between px-5 pt-6 pb-5">
      <div className="flex items-center gap-2.5">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/brand/logo-256.png"
          alt=""
          className="h-9 w-9 shrink-0 rounded-full bg-white/15 object-contain p-1"
        />
        <div>
          <h1 className="text-lg font-extrabold leading-tight tracking-tight text-white">
            {storeName}
          </h1>
          <p className="text-xs text-white/70">{storeLocation}</p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="text-center text-xs font-semibold leading-tight text-white">
          <p className="text-base font-bold">20</p>
          <p className="text-[10px] text-white/70">mins</p>
        </div>

        <button
          type="button"
          onClick={openCart}
          aria-label="Open cart"
          className="relative flex h-10 w-10 items-center justify-center rounded-full border border-white/70 bg-white/70 text-brand-700 shadow-sm backdrop-blur-md"
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            aria-hidden="true"
          >
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
            <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-accent-500 px-1 text-[10px] font-bold text-white ring-2 ring-brand-500">
              {count}
            </span>
          )}
        </button>
      </div>
    </header>
  );
}
