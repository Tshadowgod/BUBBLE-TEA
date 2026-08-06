"use client";

import { useMemo, useState } from "react";
import { DrinkArt } from "@/components/DrinkArt";
import { Header } from "@/components/storefront/Header";
import { formatMoney } from "@/lib/format";
import { useCart } from "@/context/CartContext";
import type { PlainDrink, PlainTopping } from "@/lib/types";

const SUGAR_LEVELS = [0, 25, 50, 75, 100];

export function DrinkCustomizer({
  drink,
  toppings,
  storeName,
  storeLocation,
  onClose,
}: {
  drink: PlainDrink;
  toppings: PlainTopping[];
  storeName: string;
  storeLocation: string;
  onClose: () => void;
}) {
  const { addItem } = useCart();
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
  const subtotal = (drink.price + toppingsTotal) * quantity;
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
    <div className="fixed inset-0 z-50 mx-auto flex w-full max-w-md flex-col overflow-hidden border border-white/60 bg-white/50 shadow-xl shadow-brand-900/10 backdrop-blur-2xl sm:my-6 sm:h-[calc(100vh-3rem)] sm:rounded-3xl">
      <div className="shrink-0 rounded-b-3xl border-b border-white/20 bg-gradient-to-br from-brand-400/90 to-brand-900/90 shadow-lg shadow-brand-900/20 backdrop-blur-xl">
        <Header storeName={storeName} storeLocation={storeLocation} />
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="bg-white/30 px-5 pb-5 pt-3 backdrop-blur-md">
          <div className="mb-4 flex justify-end">
            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="text-neutral-400 transition hover:text-neutral-600"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path
                  d="M6 6l12 12M18 6 6 18"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </button>
          </div>

          <div className="mb-5 flex items-center gap-4">
            <DrinkArt
              colorway={drink.colorway}
              imageUrl={drink.imageUrl}
              alt={drink.name}
              size="lg"
              rounded="full"
              backdrop
              className="!h-28 !w-28 shrink-0"
            />
            <div>
              {drink.isNew && (
                <span className="mb-1 inline-block rounded-full bg-accent-500 px-2 py-0.5 text-[10px] font-bold text-white">
                  NEW!
                </span>
              )}
              {drink.tag && (
                <p className="text-xs font-semibold uppercase tracking-wide text-neutral-400">
                  {drink.tag}
                </p>
              )}
              <h2 className="text-lg font-bold leading-snug text-neutral-800">
                {drink.name}
              </h2>
              <p className="text-2xl font-extrabold text-neutral-800">
                ${dollars}
                <sup className="text-sm">{cents}</sup>
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between rounded-2xl border border-white/50 bg-brand-100/40 px-4 py-3 backdrop-blur-md">
            <span className="text-xs font-bold uppercase tracking-wide text-brand-700">
              Quantity
            </span>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="flex h-7 w-7 items-center justify-center rounded-full border border-white/60 bg-white/70 text-brand-700 shadow-sm backdrop-blur-md"
                aria-label="Decrease quantity"
              >
                −
              </button>
              <span className="w-4 text-center text-sm font-bold text-brand-700">
                {quantity}
              </span>
              <button
                type="button"
                onClick={() => setQuantity((q) => q + 1)}
                className="flex h-7 w-7 items-center justify-center rounded-full border border-white/60 bg-white/70 text-brand-700 shadow-sm backdrop-blur-md"
                aria-label="Increase quantity"
              >
                +
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white/15 px-5 py-5 backdrop-blur-md">
          <div className="mb-6">
            <span className="mb-4 block text-xs font-bold uppercase tracking-wide text-neutral-500">
              Sugar Level
            </span>
            <div className="relative">
              <div className="absolute left-0 right-0 top-1/2 h-[3px] -translate-y-1/2 rounded-full bg-brand-100" />
              <div className="relative flex justify-between">
                {SUGAR_LEVELS.map((level, i) => {
                  const active = i === sugarIndex;
                  return (
                    <button
                      type="button"
                      key={level}
                      onClick={() => setSugarLevel(level)}
                      aria-label={`Sugar level ${level}%`}
                      className={`flex items-center justify-center rounded-full transition ${
                        active ? "h-4 w-4 bg-brand-500" : "h-2.5 w-2.5 bg-brand-100"
                      }`}
                    />
                  );
                })}
              </div>
            </div>
            <div className="mt-2 flex justify-between text-[11px] font-medium text-neutral-400">
              {SUGAR_LEVELS.map((level) => (
                <span
                  key={level}
                  className={
                    level === sugarLevel ? "text-sm font-bold text-brand-500" : ""
                  }
                >
                  {level}%
                </span>
              ))}
            </div>
          </div>

          <div>
            <span className="mb-3 block text-xs font-bold uppercase tracking-wide text-neutral-500">
              Add Toppings
            </span>
            <div className="grid grid-cols-3 gap-3">
              {toppings.map((topping) => {
                const selected = selectedToppingIds.has(topping.id);
                return (
                  <button
                    type="button"
                    key={topping.id}
                    onClick={() => toggleTopping(topping.id)}
                    className={`relative flex flex-col items-center gap-1.5 overflow-visible rounded-2xl border border-white/60 bg-white/55 p-2.5 pb-3 pt-2 text-center shadow-sm backdrop-blur-md transition ${
                      selected ? "ring-2 ring-brand-500" : ""
                    }`}
                  >
                    {selected && (
                      <span className="absolute left-1.5 top-1.5 z-10 flex h-4 w-4 items-center justify-center rounded bg-brand-500 text-[9px] font-bold text-white">
                        1
                      </span>
                    )}
                    <DrinkArt
                      colorway={topping.colorway}
                      imageUrl={topping.imageUrl}
                      alt={topping.name}
                      kind="topping"
                      size="sm"
                      className="!h-12 !w-12"
                    />
                    <span className="text-[11px] font-semibold leading-tight text-neutral-700">
                      {topping.name}
                    </span>
                    <span
                      className={`absolute -bottom-1.5 -right-1.5 flex h-6 w-6 items-center justify-center rounded-full text-white shadow ${
                        selected ? "bg-accent-500" : "bg-brand-500"
                      }`}
                    >
                      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" aria-hidden="true">
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
          </div>
        </div>
      </div>

      <div className="shrink-0">
        <div className="border-t border-white/10 bg-brand-900/80 px-6 pb-3 pt-4 text-white backdrop-blur-xl">
          <div className="space-y-1.5 text-sm">
            <div className="flex justify-between">
              <span>
                {quantity}x {drink.name}
              </span>
              <span>{formatMoney(drink.price * quantity)}</span>
            </div>
            {selectedToppings.map((t) => (
              <div key={t.id} className="flex justify-between text-white/60">
                <span>{t.name}</span>
                <span>{formatMoney(t.price * quantity)}</span>
              </div>
            ))}
            <div className="flex justify-between border-t border-white/15 pt-2 text-base font-bold">
              <span>Subtotal</span>
              <span>{formatMoney(subtotal)}</span>
            </div>
          </div>
        </div>
        <button
          type="button"
          onClick={handleAddToCart}
          className="w-full bg-gradient-to-r from-brand-400/90 to-brand-600/90 py-4 text-sm font-bold text-white backdrop-blur-xl transition hover:from-brand-400 hover:to-brand-600"
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
}
