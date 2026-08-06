import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { serializeDrink } from "@/lib/serialize";

export async function GET() {
  const drinks = await prisma.drink.findMany({
    where: { active: true },
    orderBy: { sortOrder: "asc" },
  });
  return NextResponse.json({ drinks: drinks.map(serializeDrink) });
}
