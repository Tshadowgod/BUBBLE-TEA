import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { serializeOrder } from "@/lib/serialize";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const order = await prisma.order.findUnique({
    where: { id },
    include: { items: { include: { toppings: true } } },
  });

  if (!order) {
    return NextResponse.json({ error: "Order not found." }, { status: 404 });
  }

  return NextResponse.json({ order: serializeOrder(order) });
}
