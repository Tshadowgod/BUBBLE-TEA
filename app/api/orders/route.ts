import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { serializeOrder } from "@/lib/serialize";

const VALID_SUGAR_LEVELS = new Set([0, 25, 50, 75, 100]);
const VALID_SIZES = new Set(["500ML", "700ML"]);

type IncomingItem = {
  drinkId: string;
  size: string;
  quantity: number;
  sugarLevel: number;
  toppingIds: string[];
};

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);

  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "Pedido inválido." }, { status: 400 });
  }

  const { customerName, customerPhone, notes, items } = body as {
    customerName?: unknown;
    customerPhone?: unknown;
    notes?: unknown;
    items?: unknown;
  };

  if (typeof customerName !== "string" || customerName.trim().length === 0) {
    return NextResponse.json({ error: "El nombre es obligatorio." }, { status: 400 });
  }
  // Phone is optional — keep it only when the customer actually typed one.
  if (customerPhone !== undefined && customerPhone !== null && typeof customerPhone !== "string") {
    return NextResponse.json({ error: "Teléfono inválido." }, { status: 400 });
  }
  const phone =
    typeof customerPhone === "string" && customerPhone.trim() ? customerPhone.trim() : null;

  if (!Array.isArray(items) || items.length === 0) {
    return NextResponse.json({ error: "Tu carrito está vacío." }, { status: 400 });
  }

  const incomingItems = items as IncomingItem[];

  for (const item of incomingItems) {
    if (typeof item.drinkId !== "string") {
      return NextResponse.json({ error: "Hay un producto inválido en el carrito." }, { status: 400 });
    }
    if (!VALID_SIZES.has(item.size)) {
      return NextResponse.json({ error: "Tamaño inválido." }, { status: 400 });
    }
    if (!Number.isInteger(item.quantity) || item.quantity < 1 || item.quantity > 20) {
      return NextResponse.json({ error: "Cantidad inválida." }, { status: 400 });
    }
    if (!VALID_SUGAR_LEVELS.has(item.sugarLevel)) {
      return NextResponse.json({ error: "Nivel de azúcar inválido." }, { status: 400 });
    }
    if (
      !Array.isArray(item.toppingIds) ||
      item.toppingIds.some((id) => typeof id !== "string")
    ) {
      return NextResponse.json({ error: "Toppings inválidos." }, { status: 400 });
    }
  }

  const drinkIds = [...new Set(incomingItems.map((i) => i.drinkId))];
  const toppingIds = [...new Set(incomingItems.flatMap((i) => i.toppingIds))];

  const [drinks, toppings] = await Promise.all([
    prisma.drink.findMany({ where: { id: { in: drinkIds }, active: true } }),
    prisma.topping.findMany({ where: { id: { in: toppingIds }, active: true } }),
  ]);

  const drinkMap = new Map(drinks.map((d) => [d.id, d]));
  const toppingMap = new Map(toppings.map((t) => [t.id, t]));

  for (const item of incomingItems) {
    if (!drinkMap.has(item.drinkId)) {
      return NextResponse.json(
        { error: "Una de las bebidas de tu carrito ya no está disponible." },
        { status: 400 }
      );
    }
    for (const toppingId of item.toppingIds) {
      if (!toppingMap.has(toppingId)) {
        return NextResponse.json(
          { error: "Uno de los toppings de tu carrito ya no está disponible." },
          { status: 400 }
        );
      }
    }
  }

  // Recompute every price from the database — never trust client-sent amounts.
  let subtotal = 0;
  const itemsToCreate = incomingItems.map((item) => {
    const drink = drinkMap.get(item.drinkId)!;
    const drinkPrice =
      item.size === "700ML" && drink.priceLarge !== null
        ? Number(drink.priceLarge)
        : Number(drink.price);
    const toppingSelections = item.toppingIds.map((id) => {
      const topping = toppingMap.get(id)!;
      return { toppingId: id, name: topping.name, price: Number(topping.price) };
    });
    const toppingsTotal = toppingSelections.reduce((s, t) => s + t.price, 0);
    const lineTotal = (drinkPrice + toppingsTotal) * item.quantity;
    subtotal += lineTotal;

    return {
      drinkId: drink.id,
      drinkName: `${drink.name} (${item.size === "700ML" ? "700ml" : "500ml"})`,
      size: item.size,
      unitPrice: drinkPrice,
      quantity: item.quantity,
      sugarLevel: item.sugarLevel,
      lineTotal,
      toppings: {
        create: toppingSelections.map((t) => ({
          toppingId: t.toppingId,
          name: t.name,
          price: t.price,
        })),
      },
    };
  });

  const order = await prisma.order.create({
    data: {
      customerName: customerName.trim(),
      customerPhone: phone,
      notes: typeof notes === "string" && notes.trim() ? notes.trim() : null,
      subtotal,
      total: subtotal,
      items: { create: itemsToCreate },
    },
    include: { items: { include: { toppings: true } } },
  });

  return NextResponse.json({ order: serializeOrder(order) }, { status: 201 });
}
