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
    <div className="brand-shell fixed inset-0 z-50 mx-auto flex w-full max-w-md flex-col overflow-hidden sm:my-6 sm:h-[calc(100vh-3rem)] sm:rounded-[2rem]">
      <div className="brand-hero rounded-b-[2rem]">
        <Header storeName={storeName} storeLocation={storeLocation} compact />
      </div>

      <div className="flex-1 overflow-y-auto bg-milk">
        <div className="px-5 pb-5 pt-4">
          <div className="mb-4 flex justify-end">
            <button
              type="button"
              onClick={onClose}
              aria-label="Cerrar"
              className="flex h-9 w-9 items-center justify-center rounded-full bg-black/5 text-neutral-600 transition hover:bg-black/10 hover:text-ink"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path
                  d="M6 6l12 12M18 6 6 18"
                  stroke="currentColor"
                  strokeWidth="2.5"
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
              className="!h-28 !w-28 shrink-0 shadow-md"
            />
            <div>
              {drink.isNew && (
                <span className="mb-1 inline-block rounded-full bg-accent-500 px-2 py-0.5 font-display text-[10px] font-semibold uppercase tracking-wide text-white">
                  Nuevo
                </span>
              )}
              {drink.tag && (
                <p className="text-xs font-bold uppercase tracking-[0.12em] text-neutral-400">
                  {drink.tag}
                </p>
              )}
              <h2 className="font-display text-xl font-semibold leading-snug text-ink">
                {drink.name}
              </h2>
              <p className="font-display text-2xl font-bold text-ink">
                ${dollars}
                <sup className="text-sm">{cents}</sup>
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between rounded-2xl bg-black/[0.04] px-4 py-3">
            <span className="text-xs font-bold uppercase tracking-[0.12em] text-neutral-500">
              Cantidad
            </span>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="brand-ink flex h-8 w-8 items-center justify-center rounded-full text-white"
                aria-label="Disminuir cantidad"
              >
                −
              </button>
              <span className="w-5 text-center font-display text-base font-bold text-ink">
                {quantity}
              </span>
              <button
                type="button"
                onClick={() => setQuantity((q) => q + 1)}
                className="brand-accent flex h-8 w-8 items-center justify-center rounded-full text-white"
                aria-label="Aumentar cantidad"
              >
                +
              </button>
            </div>
          </div>
        </div>

        <div className="px-5 py-5">
          <div className="mb-7">
            <span className="mb-4 block text-xs font-bold uppercase tracking-[0.12em] text-neutral-500">
              Nivel de azúcar
            </span>
            <div className="relative">
              <div className="absolute left-0 right-0 top-1/2 h-1 -translate-y-1/2 rounded-full bg-black/10" />
              <div
                className="absolute left-0 top-1/2 h-1 -translate-y-1/2 rounded-full bg-accent-500 transition-all"
                style={{
                  width: `${(sugarIndex / (SUGAR_LEVELS.length - 1)) * 100}%`,
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
                      className={`flex items-center justify-center rounded-full transition ${
                        active
                          ? "h-4 w-4 bg-accent-500 shadow-[0_0_0_4px_rgba(255,120,0,0.2)]"
                          : filled
                            ? "h-2.5 w-2.5 bg-accent-500"
                            : "h-2.5 w-2.5 bg-black/15"
                      }`}
                    />
                  );
                })}
              </div>
            </div>
            <div className="mt-2.5 flex justify-between text-[11px] font-semibold text-neutral-400">
              {SUGAR_LEVELS.map((level) => (
                <span
                  key={level}
                  className={
                    level === sugarLevel
                      ? "font-display text-sm font-bold text-accent-500"
                      : ""
                  }
                >
                  {level}%
                </span>
              ))}
            </div>
          </div>

          <div>
            <span className="mb-3 block text-xs font-bold uppercase tracking-[0.12em] text-neutral-500">
              Agregar toppings
            </span>
            <div className="grid grid-cols-3 gap-2.5">
              {toppings.map((topping) => {
                const selected = selectedToppingIds.has(topping.id);
                return (
                  <button
                    type="button"
                    key={topping.id}
                    onClick={() => toggleTopping(topping.id)}
                    className={`relative flex flex-col items-center gap-1.5 rounded-2xl px-2 pb-3 pt-2.5 text-center transition ${
                      selected
                        ? "brand-ink text-white"
                        : "bg-black/[0.04] text-ink hover:bg-black/[0.07]"
                    }`}
                  >
                    <DrinkArt
                      colorway={topping.colorway}
                      imageUrl={topping.imageUrl}
                      alt={topping.name}
                      kind="topping"
                      size="sm"
                      className="!h-12 !w-12"
                    />
                    <span
                      className={`text-[11px] font-bold leading-tight ${
                        selected ? "text-white" : "text-neutral-700"
                      }`}
                    >
                      {topping.name}
                    </span>
                    <span
                      className={`text-[10px] font-semibold ${
                        selected ? "text-accent-500" : "text-neutral-400"
                      }`}
                    >
                      +{formatMoney(topping.price)}
                    </span>
                    <span
                      className={`absolute -bottom-1.5 -right-1 flex h-6 w-6 items-center justify-center rounded-full text-white ${
                        selected ? "brand-accent" : "brand-ink"
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
        <div className="brand-ink px-6 pb-3 pt-4 text-white">
          <div className="space-y-1.5 text-sm">
            <div className="flex justify-between">
              <span>
                {quantity}x {drink.name}
              </span>
              <span>{formatMoney(drink.price * quantity)}</span>
            </div>
            {selectedToppings.map((t) => (
              <div key={t.id} className="flex justify-between text-white/55">
                <span>{t.name}</span>
                <span>{formatMoney(t.price * quantity)}</span>
              </div>
            ))}
            <div className="flex justify-between border-t border-white/15 pt-2 font-display text-base font-bold">
              <span>Subtotal</span>
              <span>{formatMoney(subtotal)}</span>
            </div>
          </div>
        </div>
        <button
          type="button"
          onClick={handleAddToCart}
          className="brand-accent w-full py-4 font-display text-sm font-bold uppercase tracking-wide text-white transition hover:bg-accent-600 active:scale-[0.99]"
        >
          Agregar al carrito
        </button>
      </div>
    </div>
  );
}
