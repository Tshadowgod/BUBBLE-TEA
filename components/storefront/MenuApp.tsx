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
    <div className="mx-auto flex min-h-screen w-full max-w-md flex-col overflow-hidden border border-white/60 bg-white/50 pb-10 shadow-xl shadow-brand-900/10 backdrop-blur-2xl sm:my-6 sm:min-h-0 sm:rounded-3xl">
      <div
        className={`rounded-b-[2rem] border-b border-white/20 bg-gradient-to-br from-brand-400/90 to-brand-900/90 shadow-lg shadow-brand-900/20 backdrop-blur-xl ${newDrinks.length > 0 ? "pb-14" : "pb-4"}`}
      >
        <Header storeName={storeName} storeLocation={storeLocation} />
        {newDrinks.length > 0 && (
          <h2 className="px-5 text-xs font-bold uppercase tracking-wide text-white/80">
            New Drinks
          </h2>
        )}
      </div>

      {newDrinks.length > 0 && (
        <section className="-mt-10 mb-6">
          <div className="no-scrollbar flex gap-3 overflow-x-auto px-5 pb-1">
            {newDrinks.map((drink) => (
              <NewDrinkCard key={drink.id} drink={drink} onSelect={setSelectedDrink} />
            ))}
          </div>
        </section>
      )}

      {drinks.length === 0 ? (
        <p className="px-5 text-sm text-neutral-500">
          No drinks on the menu yet — check back soon.
        </p>
      ) : (
        categories.map(({ category, items }) => (
          <section key={category} className="mb-6 px-5">
            <h2 className="mb-3 text-xs font-bold uppercase tracking-wide text-neutral-400">
              {category}
            </h2>
            <div className="space-y-2.5">
              {items.map((drink) => (
                <DrinkListRow key={drink.id} drink={drink} onSelect={setSelectedDrink} />
              ))}
            </div>
          </section>
        ))
      )}

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
