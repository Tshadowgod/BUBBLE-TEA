import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { serializeOrder } from "@/lib/serialize";
import { OrderStatus } from "@/lib/generated/prisma/enums";

const VALID_STATUSES = new Set<string>(Object.values(OrderStatus));

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await request.json().catch(() => null);
  const status = body?.status;

  if (typeof status !== "string" || !VALID_STATUSES.has(status)) {
    return NextResponse.json({ error: "Invalid status." }, { status: 400 });
  }

  try {
    const order = await prisma.order.update({
      where: { id },
      data: { status: status as OrderStatus },
      include: { items: { include: { toppings: true } } },
    });
    return NextResponse.json({ order: serializeOrder(order) });
  } catch {
    return NextResponse.json({ error: "Order not found." }, { status: 404 });
  }
}
