import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { serializeOrder } from "@/lib/serialize";

export async function GET() {
  const orders = await prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    include: { items: { include: { toppings: true } } },
    take: 100,
  });
  return NextResponse.json({ orders: orders.map(serializeOrder) });
}
