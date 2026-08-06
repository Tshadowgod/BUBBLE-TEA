"use client";

import { useMemo, useState } from "react";
import { CartProvider } from "@/context/CartContext";
import { Header } from "@/components/storefront/Header";
import { NewDrinkCard } from "@/components/storefront/NewDrinkCard";
import { DrinkListRow } from "@/components/storefront/DrinkListRow";
import { DrinkCustomizer } from "@/components/storefront/DrinkCustomizer";
import { CartDrawer } from "@/components/storefront/CartDrawer";
import type { PlainDrink, PlainTopping } from "@/lib/types";

function slugify(text: string) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-");
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

  return (
    <div className="brand-shell mx-auto flex min-h-screen w-full max-w-md flex-col overflow-clip pb-14 sm:my-6 sm:min-h-0 sm:rounded-[2rem]">
      <div
        className={`brand-hero bg-[#ff7800] ${
          newDrinks.length > 0 ? "rounded-b-[2rem] pb-6" : "rounded-b-[2rem] pb-2"
        }`}
      >
        <Header storeName={storeName} storeLocation={storeLocation} />

        {newDrinks.length > 0 && (
          <section className="relative z-10 pt-1">
            <div className="mb-3 flex items-end justify-between px-5">
              <h2 className="font-display text-base font-semibold tracking-wide text-ink">
                Novedades
              </h2>
              <span className="brand-ink rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-white">
                Recién salidas
              </span>
            </div>
            <div className="no-scrollbar flex snap-x snap-mandatory gap-3.5 overflow-x-auto scroll-px-5 px-5 pb-1.5">
              {newDrinks.map((drink) => (
                <div key={drink.id} className="snap-start">
                  <NewDrinkCard drink={drink} onSelect={setSelectedDrink} />
                </div>
              ))}
            </div>
          </section>
        )}
      </div>

      {categories.length > 1 && (
        <nav
          aria-label="Categorías"
          className="no-scrollbar sticky top-0 z-20 flex gap-2 overflow-x-auto bg-milk/95 px-5 py-3 backdrop-blur-sm"
        >
          {categories.map(({ category, items }) => (
            <a
              key={category}
              href={`#cat-${slugify(category)}`}
              className="brand-card shrink-0 rounded-full px-3.5 py-1.5 font-display text-xs font-semibold text-ink transition hover:bg-accent-500 hover:text-white"
            >
              {category}
              <span className="ml-1.5 text-[10px] font-bold text-neutral-400">
                {items.length}
              </span>
            </a>
          ))}
        </nav>
      )}

      <div className="flex-1 bg-milk px-1">
        {drinks.length === 0 ? (
          <p className="px-5 py-10 text-center text-sm text-neutral-600">
            Aún no hay bebidas en el menú — vuelve pronto.
          </p>
        ) : (
          categories.map(({ category, items }) => (
            <section
              key={category}
              id={`cat-${slugify(category)}`}
              className="scroll-mt-16 px-4 pt-6"
            >
              <div className="mb-3 flex items-center gap-2.5 px-1">
                <span className="h-5 w-1.5 rounded-full bg-accent-500" aria-hidden="true" />
                <h2 className="font-display text-lg font-semibold text-ink">
                  {category}
                </h2>
                <span className="text-xs font-bold text-neutral-400">
                  {items.length} {items.length === 1 ? "bebida" : "bebidas"}
                </span>
              </div>
              <ul className="space-y-2.5">
                {items.map((drink) => (
                  <li key={drink.id}>
                    <DrinkListRow drink={drink} onSelect={setSelectedDrink} />
                  </li>
                ))}
              </ul>
            </section>
          ))
        )}

        <footer className="mt-10 flex flex-col items-center gap-2 px-5 pb-2 text-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/brand/logo-mascot.png"
            alt=""
            className="h-12 w-auto object-contain opacity-90"
          />
          <p className="font-display text-sm font-semibold text-ink">
            {storeName}
          </p>
          <p className="text-xs font-semibold text-neutral-400">
            Hecho con perlas y mucho cariño
          </p>
        </footer>
      </div>

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
