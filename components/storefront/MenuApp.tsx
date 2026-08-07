"use client";

import { useEffect, useMemo, useState } from "react";
import { CartProvider, useCart } from "@/context/CartContext";
import { Header } from "@/components/storefront/Header";
import { NewDrinkCard } from "@/components/storefront/NewDrinkCard";
import { DrinkListRow } from "@/components/storefront/DrinkListRow";
import { DrinkCustomizer } from "@/components/storefront/DrinkCustomizer";
import { CartDrawer } from "@/components/storefront/CartDrawer";
import { formatMoney } from "@/lib/format";
import type { PlainDrink, PlainTopping } from "@/lib/types";

function slugify(text: string) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-");
}

function CartBar() {
  const { count, subtotal, openCart, isCartOpen } = useCart();
  if (count === 0 || isCartOpen) return null;

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-40 flex justify-center px-4 pb-5 lg:pb-8">
      <button
        type="button"
        onClick={openCart}
        className="pointer-events-auto brand-ink animate-rise flex w-full max-w-md items-center justify-between gap-3 rounded-full px-5 py-3.5 text-white shadow-[0_12px_40px_rgba(26,18,12,0.35)] transition hover:opacity-95 active:scale-[0.99] lg:max-w-lg"
      >
        <span className="flex items-center gap-2.5">
          <span className="brand-accent flex h-7 min-w-7 items-center justify-center rounded-full px-1.5 font-display text-sm font-bold">
            {count}
          </span>
          <span className="font-display text-sm font-bold">Ver carrito</span>
        </span>
        <span className="font-display text-sm font-bold">
          {formatMoney(subtotal)}
        </span>
      </button>
    </div>
  );
}

function MenuAppInner({
  drinks,
  toppings,
  storeName,
  storeLocation,
}: {
  drinks: PlainDrink[];
  toppings: PlainTopping[];
  storeName: string;
  storeLocation: string;
}) {
  const [selectedDrink, setSelectedDrink] = useState<PlainDrink | null>(null);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const newDrinks = useMemo(() => drinks.filter((d) => d.isNew), [drinks]);

  const categories = useMemo(() => {
    const order: string[] = [];
    const map = new Map<string, PlainDrink[]>();
    for (const drink of drinks) {
      if (!map.has(drink.category)) {
        map.set(drink.category, []);
        order.push(drink.category);
      }
      map.get(drink.category)!.push(drink);
    }
    return order.map((category) => ({ category, items: map.get(category)! }));
  }, [drinks]);

  const currentCategory = activeCategory ?? categories[0]?.category ?? null;

  useEffect(() => {
    if (categories.length === 0) return;

    const observers: IntersectionObserver[] = [];
    for (const { category } of categories) {
      const el = document.getElementById(`cat-${slugify(category)}`);
      if (!el) continue;
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setActiveCategory(category);
        },
        { rootMargin: "-30% 0px -55% 0px", threshold: 0 }
      );
      observer.observe(el);
      observers.push(observer);
    }
    return () => observers.forEach((o) => o.disconnect());
  }, [categories]);

  return (
    <div className="mx-auto w-full max-w-md pb-20 lg:max-w-6xl lg:px-6 lg:pb-24 lg:pt-6">
      <div className="brand-shell flex min-h-screen w-full flex-col overflow-clip lg:min-h-0 lg:rounded-[2rem] lg:shadow-[0_24px_80px_rgba(120,70,20,0.14)]">
        <div
          className={`brand-hero bg-[#ff7800] ${
            newDrinks.length > 0
              ? "rounded-b-[2rem] pb-6 lg:pb-8"
              : "rounded-b-[2rem] pb-2 lg:pb-4"
          }`}
        >
          <Header storeName={storeName} storeLocation={storeLocation} />

          {newDrinks.length > 0 && (
            <section className="relative z-10 pt-1 lg:px-3">
              <div className="mb-3 flex items-end justify-between px-5 lg:mb-4 lg:px-5">
                <h2 className="font-display text-base font-semibold tracking-wide text-white lg:text-lg">
                  Novedades
                </h2>
                <span className="rounded-full bg-ink px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-white">
                  Recién salidas
                </span>
              </div>
              <div className="no-scrollbar flex snap-x snap-mandatory gap-3.5 overflow-x-auto scroll-px-5 px-5 pb-1.5 lg:grid lg:snap-none lg:grid-cols-2 lg:gap-4 lg:overflow-visible lg:px-5 xl:grid-cols-3">
                {newDrinks.map((drink) => (
                  <div key={drink.id} className="snap-start lg:min-w-0 lg:w-full">
                    <NewDrinkCard drink={drink} onSelect={setSelectedDrink} />
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        <div className="lg:flex lg:min-h-[28rem]">
          {categories.length > 1 && (
            <nav
              aria-label="Categorías"
              className="no-scrollbar sticky top-0 z-20 flex gap-2 overflow-x-auto border-b border-black/[0.04] bg-milk/95 px-5 py-3 backdrop-blur-sm lg:w-52 lg:shrink-0 lg:flex-col lg:overflow-y-auto lg:border-b-0 lg:border-r lg:border-black/[0.04] lg:bg-milk lg:px-4 lg:py-5"
            >
              <p className="mb-1 hidden px-1 text-[11px] font-bold uppercase tracking-[0.14em] text-neutral-400 lg:block">
                Categorías
              </p>
              {categories.map(({ category, items }) => {
                const active = currentCategory === category;
                return (
                  <a
                    key={category}
                    href={`#cat-${slugify(category)}`}
                    className={`shrink-0 rounded-full px-3.5 py-1.5 font-display text-xs font-semibold transition lg:rounded-xl lg:px-3 lg:py-2.5 lg:text-sm ${
                      active
                        ? "bg-accent-500 text-white shadow-sm"
                        : "bg-white text-ink shadow-sm ring-1 ring-black/[0.06] hover:bg-accent-500 hover:text-white lg:bg-transparent lg:shadow-none lg:ring-0 lg:hover:bg-accent-500/10 lg:hover:text-accent-600"
                    }`}
                  >
                    {category}
                    <span
                      className={`ml-1.5 text-[10px] font-bold lg:float-right lg:mt-0.5 lg:text-xs ${
                        active
                          ? "text-white/80"
                          : "text-neutral-400"
                      }`}
                    >
                      {items.length}
                    </span>
                  </a>
                );
              })}
            </nav>
          )}

          <div className="flex-1 bg-milk px-1 lg:px-2">
            {drinks.length === 0 ? (
              <p className="px-5 py-10 text-center text-sm text-neutral-600">
                Aún no hay bebidas en el menú — vuelve pronto.
              </p>
            ) : (
              categories.map(({ category, items }) => (
                <section
                  key={category}
                  id={`cat-${slugify(category)}`}
                  className="scroll-mt-16 px-4 pt-6 lg:scroll-mt-6 lg:px-5 lg:pt-7"
                >
                  <div className="mb-3.5 flex items-center gap-2.5 px-1">
                    <span
                      className="h-5 w-1.5 rounded-full bg-accent-500"
                      aria-hidden="true"
                    />
                    <h2 className="font-display text-lg font-semibold text-ink lg:text-xl">
                      {category}
                    </h2>
                    <span className="text-xs font-bold text-neutral-400">
                      {items.length} {items.length === 1 ? "bebida" : "bebidas"}
                    </span>
                  </div>
                  <ul className="grid gap-2.5 lg:grid-cols-2 lg:gap-3">
                    {items.map((drink) => (
                      <li key={drink.id}>
                        <DrinkListRow drink={drink} onSelect={setSelectedDrink} />
                      </li>
                    ))}
                  </ul>
                </section>
              ))
            )}

            <footer className="mt-12 flex flex-col items-center gap-2 px-5 pb-6 text-center lg:mt-16 lg:pb-10">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/brand/logo-mascot.png"
                alt=""
                className="h-11 w-auto object-contain opacity-85"
              />
              <p className="font-display text-sm font-semibold text-ink">
                {storeName}
              </p>
              <p className="text-xs font-semibold text-neutral-400">
                Hecho con perlas y mucho cariño
              </p>
            </footer>
          </div>
        </div>

        <CartBar />

        {selectedDrink && (
          <DrinkCustomizer
            drink={selectedDrink}
            toppings={toppings}
            storeName={storeName}
            storeLocation={storeLocation}
            onClose={() => setSelectedDrink(null)}
          />
        )}

        <CartDrawer />
      </div>
    </div>
  );
}

export function MenuApp(props: {
  drinks: PlainDrink[];
  toppings: PlainTopping[];
  storeName: string;
  storeLocation: string;
}) {
  return (
    <CartProvider>
      <MenuAppInner {...props} />
    </CartProvider>
  );
}
