import { prisma } from "@/lib/prisma";
import { serializeDrink } from "@/lib/serialize";
import { DrinksManager } from "@/components/admin/DrinksManager";

export const revalidate = 0;

export default async function AdminDrinksPage() {
  const drinks = await prisma.drink.findMany({ orderBy: { sortOrder: "asc" } });
  return <DrinksManager drinks={drinks.map(serializeDrink)} />;
}
