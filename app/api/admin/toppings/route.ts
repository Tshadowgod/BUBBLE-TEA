import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { serializeTopping } from "@/lib/serialize";

export async function GET() {
  const toppings = await prisma.topping.findMany({ orderBy: { sortOrder: "asc" } });
  return NextResponse.json({ toppings: toppings.map(serializeTopping) });
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  if (!body || typeof body.name !== "string" || body.name.trim().length === 0) {
    return NextResponse.json({ error: "Name is required." }, { status: 400 });
  }
  const price = Number(body.price);
  if (!Number.isFinite(price) || price < 0) {
    return NextResponse.json({ error: "Invalid price." }, { status: 400 });
  }

  const topping = await prisma.topping.create({
    data: {
      name: body.name.trim(),
      price,
      colorway:
        typeof body.colorway === "string" && body.colorway.trim()
          ? body.colorway.trim()
          : "pearl",
      imageUrl:
        typeof body.imageUrl === "string" && body.imageUrl.trim()
          ? body.imageUrl.trim()
          : null,
      active: body.active === undefined ? true : Boolean(body.active),
      sortOrder: Number.isFinite(Number(body.sortOrder)) ? Number(body.sortOrder) : 0,
    },
  });

  return NextResponse.json({ topping: serializeTopping(topping) }, { status: 201 });
}
