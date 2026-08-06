import { prisma } from "@/lib/prisma";
import { serializeDrink, serializeTopping } from "@/lib/serialize";
import { MenuApp } from "@/components/storefront/MenuApp";

export const revalidate = 0;

export default async function Home() {
  const [drinks, toppings] = await Promise.all([
    prisma.drink.findMany({
      where: { active: true },
      orderBy: { sortOrder: "asc" },
    }),
    prisma.topping.findMany({
      where: { active: true },
      orderBy: { sortOrder: "asc" },
    }),
  ]);

  return (
    <MenuApp
      drinks={drinks.map(serializeDrink)}
      toppings={toppings.map(serializeTopping)}
      storeName={process.env.NEXT_PUBLIC_STORE_NAME ?? "Mundo Bubble Tea"}
      storeLocation={process.env.NEXT_PUBLIC_STORE_LOCATION ?? "Northpoint City"}
    />
  );
}
