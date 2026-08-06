"use client";

import { useMemo, useState } from "react";
import { CartProvider } from "@/context/CartContext";
import { Header } from "@/components/storefront/Header";
import { NewDrinkCard } from "@/components/storefront/NewDrinkCard";
import { DrinkListRow } from "@/components/storefront/DrinkListRow";
import { DrinkCustomizer } from "@/components/storefront/DrinkCustomizer";
import { CartDrawer } from "@/components/storefront/CartDrawer";
import type { PlainDrink, PlainTopping } from "@/lib/types";

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
    <div className="brand-shell mx-auto flex min-h-screen w-full max-w-md flex-col overflow-hidden pb-14 sm:my-6 sm:min-h-0 sm:rounded-[2rem]">
      <div
        className={`brand-hero ${
          newDrinks.length > 0 ? "rounded-b-[2rem] pb-5" : "rounded-b-[2rem]"
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
            <div className="no-scrollbar flex gap-3.5 overflow-x-auto px-5 pb-1">
              {newDrinks.map((drink) => (
                <NewDrinkCard
                  key={drink.id}
                  drink={drink}
                  onSelect={setSelectedDrink}
                />
              ))}
            </div>
          </section>
        )}
      </div>

      <div className="flex-1 bg-milk px-1">
        {drinks.length === 0 ? (
          <p className="px-5 py-10 text-center text-sm text-neutral-600">
            Aún no hay bebidas en el menú — vuelve pronto.
          </p>
        ) : (
          categories.map(({ category, items }) => (
            <section key={category} className="px-4 pt-7">
              <h2 className="mb-3 px-1 font-display text-lg font-semibold text-ink">
                {category}
              </h2>
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
