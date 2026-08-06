import { prisma } from "@/lib/prisma";
import { serializeTopping } from "@/lib/serialize";
import { ToppingsManager } from "@/components/admin/ToppingsManager";

export const revalidate = 0;

export default async function AdminToppingsPage() {
  const toppings = await prisma.topping.findMany({ orderBy: { sortOrder: "asc" } });
  return <ToppingsManager toppings={toppings.map(serializeTopping)} />;
}
