import { prisma } from "@/lib/prisma";
import { serializeOrder } from "@/lib/serialize";
import { OrdersManager } from "@/components/admin/OrdersManager";

export const revalidate = 0;

export default async function AdminOrdersPage() {
  const orders = await prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    include: { items: { include: { toppings: true } } },
    take: 200,
  });
  return <OrdersManager orders={orders.map(serializeOrder)} />;
}
