import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { serializeTopping } from "@/lib/serialize";

export async function GET() {
  const toppings = await prisma.topping.findMany({
    where: { active: true },
    orderBy: { sortOrder: "asc" },
  });
  return NextResponse.json({ toppings: toppings.map(serializeTopping) });
}
