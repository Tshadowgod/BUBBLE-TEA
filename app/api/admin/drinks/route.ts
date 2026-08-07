import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { serializeDrink } from "@/lib/serialize";

export async function GET() {
  const drinks = await prisma.drink.findMany({ orderBy: { sortOrder: "asc" } });
  return NextResponse.json({ drinks: drinks.map(serializeDrink) });
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  if (!body || typeof body.name !== "string" || body.name.trim().length === 0) {
    return NextResponse.json({ error: "Name is required." }, { status: 400 });
  }
  if (typeof body.category !== "string" || body.category.trim().length === 0) {
    return NextResponse.json({ error: "Category is required." }, { status: 400 });
  }
  const price = Number(body.price);
  if (!Number.isFinite(price) || price < 0) {
    return NextResponse.json({ error: "Invalid price." }, { status: 400 });
  }
  const originalPrice =
    body.originalPrice !== undefined &&
    body.originalPrice !== null &&
    body.originalPrice !== ""
      ? Number(body.originalPrice)
      : null;
  if (originalPrice !== null && !Number.isFinite(originalPrice)) {
    return NextResponse.json({ error: "Invalid original price." }, { status: 400 });
  }
  const priceLarge =
    body.priceLarge !== undefined && body.priceLarge !== null && body.priceLarge !== ""
      ? Number(body.priceLarge)
      : null;
  if (priceLarge !== null && !Number.isFinite(priceLarge)) {
    return NextResponse.json({ error: "Invalid 700ml price." }, { status: 400 });
  }

  const drink = await prisma.drink.create({
    data: {
      name: body.name.trim(),
      category: body.category.trim(),
      tag: typeof body.tag === "string" && body.tag.trim() ? body.tag.trim() : null,
      description:
        typeof body.description === "string" && body.description.trim()
          ? body.description.trim()
          : null,
      price,
      priceLarge,
      originalPrice,
      colorway:
        typeof body.colorway === "string" && body.colorway.trim()
          ? body.colorway.trim()
          : "honey",
      imageUrl:
        typeof body.imageUrl === "string" && body.imageUrl.trim()
          ? body.imageUrl.trim()
          : null,
      isNew: Boolean(body.isNew),
      active: body.active === undefined ? true : Boolean(body.active),
      sortOrder: Number.isFinite(Number(body.sortOrder)) ? Number(body.sortOrder) : 0,
    },
  });

  return NextResponse.json({ drink: serializeDrink(drink) }, { status: 201 });
}
