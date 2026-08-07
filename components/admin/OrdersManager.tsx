"use client";

import { Fragment, useState } from "react";
import { useRouter } from "next/navigation";
import { formatMoney } from "@/lib/format";
import type { OrderStatus, PlainOrder } from "@/lib/types";
import { ORDER_STATUSES, ORDER_STATUS_LABELS } from "@/lib/orderStatus";

const STATUS_STYLES: Record<OrderStatus, string> = {
  PENDING: "bg-amber-50 text-amber-700",
  PREPARING: "bg-blue-50 text-blue-700",
  READY: "bg-brand-50 text-brand-700",
  COMPLETED: "bg-neutral-100 text-neutral-500",
  CANCELLED: "bg-red-50 text-accent-600",
};

export function OrdersManager({ orders }: { orders: PlainOrder[] }) {
  const router = useRouter();
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  async function handleStatusChange(id: string, status: OrderStatus) {
    setUpdatingId(id);
    try {
      await fetch(`/api/admin/orders/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      router.refresh();
    } finally {
      setUpdatingId(null);
    }
  }

  return (
    <div>
      <h1 className="mb-6 text-2xl font-extrabold text-neutral-800">Pedidos</h1>

      <div className="overflow-hidden rounded-2xl bg-white shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-neutral-100 text-xs font-semibold uppercase text-neutral-400">
            <tr>
              <th className="px-5 py-3">Pedido</th>
              <th className="px-5 py-3">Cliente</th>
              <th className="px-5 py-3">Fecha</th>
              <th className="px-5 py-3">Total</th>
              <th className="px-5 py-3">Estado</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100">
            {orders.map((order) => (
              <Fragment key={order.id}>
                <tr
                  className="cursor-pointer hover:bg-neutral-50"
                  onClick={() =>
                    setExpandedId(expandedId === order.id ? null : order.id)
                  }
                >
                  <td className="px-5 py-3 font-mono text-xs text-neutral-500">
                    #{order.id.slice(-8)}
                  </td>
                  <td className="px-5 py-3">
                    <p className="font-semibold text-neutral-800">
                      {order.customerName}
                    </p>
                    <p className="text-xs text-neutral-400">{order.customerPhone}</p>
                  </td>
                  <td className="px-5 py-3 text-neutral-500">
                    {new Date(order.createdAt).toLocaleString()}
                  </td>
                  <td className="px-5 py-3 font-semibold text-brand-600">
                    {formatMoney(order.total)}
                  </td>
                  <td className="px-5 py-3" onClick={(e) => e.stopPropagation()}>
                    <select
                      value={order.status}
                      disabled={updatingId === order.id}
                      onChange={(e) =>
                        handleStatusChange(order.id, e.target.value as OrderStatus)
                      }
                      className={`rounded-full border-0 px-2.5 py-1 text-xs font-semibold outline-none ${STATUS_STYLES[order.status]}`}
                    >
                      {ORDER_STATUSES.map((s) => (
                        <option key={s} value={s}>
                          {ORDER_STATUS_LABELS[s]}
                        </option>
                      ))}
                    </select>
                  </td>
                </tr>
                {expandedId === order.id && (
                  <tr>
                    <td colSpan={5} className="bg-neutral-50 px-5 py-4">
                      <ul className="space-y-1 text-sm text-neutral-600">
                        {order.items.map((item) => (
                          <li key={item.id} className="flex justify-between">
                            <span>
                              {item.quantity}x {item.drinkName}
                              {item.toppings.length > 0 &&
                                ` (${item.toppings.map((t) => t.name).join(", ")})`}
                              {" · Azúcar "}
                              {item.sugarLevel}%
                            </span>
                            <span>{formatMoney(item.lineTotal)}</span>
                          </li>
                        ))}
                      </ul>
                      {order.notes && (
                        <p className="mt-2 text-xs text-neutral-400">
                          Notas: {order.notes}
                        </p>
                      )}
                    </td>
                  </tr>
                )}
              </Fragment>
            ))}
            {orders.length === 0 && (
              <tr>
                <td colSpan={5} className="px-5 py-8 text-center text-neutral-400">
                  Todavía no hay pedidos.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
