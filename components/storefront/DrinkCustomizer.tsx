"use client";

import { useMemo, useState } from "react";
import { DrinkArt } from "@/components/DrinkArt";
import { formatMoney } from "@/lib/format";
import { useCart } from "@/context/CartContext";
import type { PlainDrink, PlainTopping } from "@/lib/types";

const SUGAR_LEVELS = [0, 25, 50, 75, 100];

export function DrinkCustomizer({
  drink,
  toppings,
  onClose,
}: {
  drink: PlainDrink;
  toppings: PlainTopping[];
  storeName: string;
  storeLocation: string;
  onClose: () => void;
}) {
  const { addItem, openCart, count } = useCart();
  const [sugarLevel, setSugarLevel] = useState(50);
  const [selectedToppingIds, setSelectedToppingIds] = useState<Set<string>>(
    new Set()
  );
  const [quantity, setQuantity] = useState(1);

  const selectedToppings = useMemo(
    () => toppings.filter((t) => selectedToppingIds.has(t.id)),
    [toppings, selectedToppingIds]
  );

  const toppingsTotal = selectedToppings.reduce((sum, t) => sum + t.price, 0);
  const unitTotal = drink.price + toppingsTotal;
  const subtotal = unitTotal * quantity;
  const [dollars, cents] = drink.price.toFixed(2).split(".");
  const sugarIndex = SUGAR_LEVELS.indexOf(sugarLevel);

  function toggleTopping(id: string) {
    setSelectedToppingIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function handleAddToCart() {
    addItem({
      drinkId: drink.id,
      name: drink.name,
      tag: drink.tag,
      colorway: drink.colorway,
      imageUrl: drink.imageUrl,
      unitPrice: drink.price,
      quantity,
      sugarLevel,
      toppings: selectedToppings.map((t) => ({
        toppingId: t.id,
        name: t.name,
        price: t.price,
      })),
      lineTotal: subtotal,
    });
    onClose();
  }

  return (
    <div className="brand-shell fixed inset-0 z-50 mx-auto flex w-full max-w-md flex-col overflow-hidden sm:my-6 sm:h-[calc(100vh-3rem)] sm:rounded-[2rem]">
      {/* Top bar */}
      <div className="brand-hero relative z-20 flex shrink-0 items-center justify-between bg-[#ff7800] px-4 pb-3 pt-4">
        <button
          type="button"
          onClick={onClose}
          aria-label="Volver al menú"
          className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-ink shadow-sm transition hover:bg-white/95 active:scale-95"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path
              d="M15 6 9 12l6 6"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>

        <p className="font-display text-base font-bold text-white">
          Personalizar
        </p>

        <button
          type="button"
          onClick={openCart}
          aria-label="Abrir carrito"
          className="relative flex h-11 w-11 items-center justify-center rounded-full bg-ink text-white shadow-sm transition hover:opacity-90 active:scale-95"
        >
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" aria-hidden="true">
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
            <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-white px-1 font-display text-[11px] font-bold text-ink ring-2 ring-[#ff7800]">
              {count}
            </span>
          )}
        </button>
      </div>

      <div className="flex-1 overflow-y-auto bg-milk">
        {/* Product hero */}
        <div className="brand-hero relative bg-[#ff7800] px-5 pb-10 pt-2">
          <div className="flex items-center gap-4">
            <div className="relative shrink-0">
              <DrinkArt
                colorway={drink.colorway}
                imageUrl={drink.imageUrl}
                alt={drink.name}
                size="lg"
                rounded="full"
                backdrop
                className="!h-[7.25rem] !w-[7.25rem] shadow-[0_12px_28px_rgba(0,0,0,0.22)]"
              />
              {drink.isNew && (
                <span className="absolute -left-1 -top-1 rounded-full bg-ink px-2 py-0.5 font-display text-[10px] font-bold uppercase tracking-wide text-white">
                  Nuevo
                </span>
              )}
            </div>
            <div className="min-w-0 text-white">
              {drink.tag && (
                <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-white/80">
                  {drink.tag}
                </p>
              )}
              <h2 className="mt-0.5 font-display text-[1.35rem] font-semibold leading-snug">
                {drink.name}
              </h2>
              <p className="mt-1 font-display text-[1.75rem] font-bold leading-none">
                Bs {dollars}
                <sup className="text-sm">{cents}</sup>
              </p>
            </div>
          </div>
        </div>

        {/* Controls card overlapping hero */}
        <div className="relative z-10 -mt-6 space-y-5 px-4 pb-6">
          <div className="rounded-[1.35rem] bg-white p-4 shadow-[0_10px_30px_rgba(120,70,20,0.12)] ring-1 ring-black/[0.04]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-neutral-500">
                  Cantidad
                </p>
                <p className="mt-0.5 text-xs font-semibold text-neutral-400">
                  {formatMoney(unitTotal)} c/u
                </p>
              </div>
              <div className="flex items-center gap-3 rounded-full bg-[#f7efe4] px-1.5 py-1.5">
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-ink text-lg font-bold text-white transition active:scale-95"
                  aria-label="Disminuir cantidad"
                >
                  −
                </button>
                <span className="w-6 text-center font-display text-xl font-bold text-ink">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity((q) => q + 1)}
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-accent-500 text-lg font-bold text-white transition active:scale-95"
                  aria-label="Aumentar cantidad"
                >
                  +
                </button>
              </div>
            </div>
          </div>

          <section className="rounded-[1.35rem] bg-white p-4 shadow-[0_8px_24px_rgba(120,70,20,0.08)] ring-1 ring-black/[0.04]">
            <div className="mb-4 flex items-end justify-between">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-neutral-500">
                  Nivel de azúcar
                </p>
                <p className="mt-0.5 text-xs font-semibold text-neutral-400">
                  Elige qué tan dulce lo quieres
                </p>
              </div>
              <span className="rounded-full bg-accent-500/10 px-2.5 py-1 font-display text-sm font-bold text-accent-500">
                {sugarLevel}%
              </span>
            </div>

            <div className="relative px-1">
              <div className="absolute left-1 right-1 top-[18px] h-1.5 rounded-full bg-black/[0.08]" />
              <div
                className="absolute left-1 top-[18px] h-1.5 rounded-full bg-accent-500 transition-all"
                style={{
                  width: `calc(${(sugarIndex / (SUGAR_LEVELS.length - 1)) * 100}% - 0px)`,
                }}
              />
              <div className="relative flex justify-between">
                {SUGAR_LEVELS.map((level, i) => {
                  const active = i === sugarIndex;
                  const filled = i <= sugarIndex;
                  return (
                    <button
                      type="button"
                      key={level}
                      onClick={() => setSugarLevel(level)}
                      aria-label={`Nivel de azúcar ${level}%`}
                      aria-pressed={active}
                      className="flex w-11 flex-col items-center gap-2"
                    >
                      <span
                        className={`rounded-full transition ${
                          active
                            ? "h-5 w-5 bg-accent-500 shadow-[0_0_0_5px_rgba(255,120,0,0.2)]"
                            : filled
                              ? "mt-1 h-3.5 w-3.5 bg-accent-500"
                              : "mt-1 h-3.5 w-3.5 bg-black/15"
                        }`}
                      />
                      <span
                        className={`text-xs font-bold ${
                          active
                            ? "font-display text-sm text-accent-500"
                            : "text-neutral-400"
                        }`}
                      >
                        {level}%
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </section>

          <section className="rounded-[1.35rem] bg-white p-4 shadow-[0_8px_24px_rgba(120,70,20,0.08)] ring-1 ring-black/[0.04]">
            <div className="mb-3.5 flex items-end justify-between">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-neutral-500">
                  Agregar toppings
                </p>
                <p className="mt-0.5 text-xs font-semibold text-neutral-400">
                  Opcional · toca para sumar
                </p>
              </div>
              {selectedToppings.length > 0 && (
                <span className="rounded-full bg-ink px-2.5 py-1 text-[11px] font-bold text-white">
                  {selectedToppings.length} elegidos
                </span>
              )}
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              {toppings.map((topping) => {
                const selected = selectedToppingIds.has(topping.id);
                return (
                  <button
                    type="button"
                    key={topping.id}
                    onClick={() => toggleTopping(topping.id)}
                    aria-pressed={selected}
                    className={`flex items-center gap-3 rounded-2xl p-2.5 text-left transition active:scale-[0.98] ${
                      selected
                        ? "bg-ink text-white shadow-md"
                        : "bg-[#f7efe4] text-ink hover:bg-[#f0e4d4]"
                    }`}
                  >
                    <DrinkArt
                      colorway={topping.colorway}
                      imageUrl={topping.imageUrl}
                      alt={topping.name}
                      kind="topping"
                      size="sm"
                      className="!h-12 !w-12 shrink-0"
                    />
                    <div className="min-w-0 flex-1">
                      <p
                        className={`line-clamp-2 text-[13px] font-bold leading-tight ${
                          selected ? "text-white" : "text-ink"
                        }`}
                      >
                        {topping.name}
                      </p>
                      <p
                        className={`mt-0.5 text-xs font-bold ${
                          selected ? "text-accent-500" : "text-accent-600"
                        }`}
                      >
                        +{formatMoney(topping.price)}
                      </p>
                    </div>
                    <span
                      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-white ${
                        selected ? "bg-accent-500" : "bg-ink"
                      }`}
                    >
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                        {selected ? (
                          <path
                            d="M6 6l12 12M18 6 6 18"
                            stroke="currentColor"
                            strokeWidth="3"
                            strokeLinecap="round"
                          />
                        ) : (
                          <path
                            d="M12 5v14M5 12h14"
                            stroke="currentColor"
                            strokeWidth="3"
                            strokeLinecap="round"
                          />
                        )}
                      </svg>
                    </span>
                  </button>
                );
              })}
            </div>
          </section>
        </div>
      </div>

      {/* Sticky footer */}
      <div className="shrink-0 border-t border-black/5 bg-white px-4 pb-4 pt-3 shadow-[0_-8px_24px_rgba(120,70,20,0.08)]">
        <div className="mb-3 flex items-center justify-between px-1">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-neutral-400">
              Total
            </p>
            <p className="font-display text-xl font-bold text-ink">
              {formatMoney(subtotal)}
            </p>
          </div>
          <p className="max-w-[10rem] text-right text-xs font-semibold text-neutral-500">
            {quantity}x {drink.name}
            {selectedToppings.length > 0 &&
              ` · ${selectedToppings.length} topping${selectedToppings.length > 1 ? "s" : ""}`}
            {" · "}
            azúcar {sugarLevel}%
          </p>
        </div>
        <button
          type="button"
          onClick={handleAddToCart}
          className="flex w-full items-center justify-center gap-2 rounded-full bg-accent-500 py-4 font-display text-sm font-bold uppercase tracking-wide text-white shadow-[0_8px_20px_rgba(255,120,0,0.35)] transition hover:bg-accent-600 active:scale-[0.99]"
        >
          Agregar al carrito
          <span className="rounded-full bg-white/20 px-2 py-0.5">
            {formatMoney(subtotal)}
          </span>
        </button>
      </div>
    </div>
  );
}
