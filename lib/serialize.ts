import type { PlainDrink, PlainOrder, PlainTopping } from "@/lib/types";

type DecimalLike = { toNumber(): number } | number | string;

function toNum(value: DecimalLike | null | undefined): number {
  if (value === null || value === undefined) return 0;
  if (typeof value === "number") return value;
  if (typeof value === "string") return Number(value);
  return value.toNumber();
}

export function serializeDrink(drink: {
  id: string;
  name: string;
  category: string;
  tag: string | null;
  description: string | null;
  price: DecimalLike;
  priceLarge: DecimalLike | null;
  originalPrice: DecimalLike | null;
  colorway: string;
  imageUrl: string | null;
  isNew: boolean;
  active: boolean;
  sortOrder: number;
}): PlainDrink {
  return {
    ...drink,
    price: toNum(drink.price),
    priceLarge: drink.priceLarge ? toNum(drink.priceLarge) : null,
    originalPrice: drink.originalPrice ? toNum(drink.originalPrice) : null,
  };
}

export function serializeTopping(topping: {
  id: string;
  name: string;
  price: DecimalLike;
  colorway: string;
  imageUrl: string | null;
  active: boolean;
  sortOrder: number;
}): PlainTopping {
  return { ...topping, price: toNum(topping.price) };
}

export function serializeOrder(order: {
  id: string;
  customerName: string;
  customerPhone: string;
  notes: string | null;
  status: string;
  subtotal: DecimalLike;
  total: DecimalLike;
  createdAt: Date;
  items: {
    id: string;
    drinkName: string;
    size: string;
    unitPrice: DecimalLike;
    quantity: number;
    sugarLevel: number;
    lineTotal: DecimalLike;
    toppings: { name: string; price: DecimalLike }[];
  }[];
}): PlainOrder {
  return {
    id: order.id,
    customerName: order.customerName,
    customerPhone: order.customerPhone,
    notes: order.notes,
    status: order.status as PlainOrder["status"],
    subtotal: toNum(order.subtotal),
    total: toNum(order.total),
    createdAt: order.createdAt.toISOString(),
    items: order.items.map((item) => ({
      id: item.id,
      drinkName: item.drinkName,
      size: item.size,
      unitPrice: toNum(item.unitPrice),
      quantity: item.quantity,
      sugarLevel: item.sugarLevel,
      lineTotal: toNum(item.lineTotal),
      toppings: item.toppings.map((t) => ({
        name: t.name,
        price: toNum(t.price),
      })),
    })),
  };
}
