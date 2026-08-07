import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { ORDER_STATUS_LABELS } from "@/lib/orderStatus";
import type { OrderStatus } from "@/lib/types";

export const revalidate = 0;

export default async function AdminDashboardPage() {
  const [drinkCount, toppingCount, orderCount, pendingCount, recentOrders] =
    await Promise.all([
      prisma.drink.count(),
      prisma.topping.count(),
      prisma.order.count(),
      prisma.order.count({ where: { status: { in: ["PENDING", "PREPARING"] } } }),
      prisma.order.findMany({
        orderBy: { createdAt: "desc" },
        take: 5,
      }),
    ]);

  const stats = [
    { label: "Bebidas en el menú", value: drinkCount, href: "/admin/drinks" },
    { label: "Toppings", value: toppingCount, href: "/admin/toppings" },
    { label: "Pedidos totales", value: orderCount, href: "/admin/orders" },
    { label: "Por atender", value: pendingCount, href: "/admin/orders" },
  ];

  return (
    <div>
      <h1 className="mb-6 text-2xl font-extrabold text-neutral-800">Inicio</h1>

      <div className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
        {stats.map((stat) => (
          <Link
            key={stat.label}
            href={stat.href}
            className="rounded-2xl bg-white p-5 shadow-sm transition hover:shadow-md"
          >
            <p className="text-2xl font-extrabold text-brand-600">{stat.value}</p>
            <p className="text-xs font-medium text-neutral-500">{stat.label}</p>
          </Link>
        ))}
      </div>

      <div className="rounded-2xl bg-white p-5 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-sm font-bold uppercase tracking-wide text-neutral-500">
            Pedidos recientes
          </h2>
          <Link href="/admin/orders" className="text-xs font-semibold text-brand-600">
            Ver todos
          </Link>
        </div>
        {recentOrders.length === 0 ? (
          <p className="text-sm text-neutral-400">Todavía no hay pedidos.</p>
        ) : (
          <ul className="divide-y divide-neutral-100">
            {recentOrders.map((order) => (
              <li key={order.id} className="flex items-center justify-between py-3">
                <div>
                  <p className="text-sm font-semibold text-neutral-800">
                    {order.customerName}
                  </p>
                  <p className="text-xs text-neutral-400">
                    {order.createdAt.toLocaleString()}
                  </p>
                </div>
                <span className="rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-700">
                  {ORDER_STATUS_LABELS[order.status as OrderStatus]}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
