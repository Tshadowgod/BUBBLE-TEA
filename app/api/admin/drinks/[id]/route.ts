import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { serializeDrink } from "@/lib/serialize";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await request.json().catch(() => null);
  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const data: Record<string, unknown> = {};
  if (typeof body.name === "string") data.name = body.name.trim();
  if (typeof body.category === "string") data.category = body.category.trim();
  if (typeof body.tag === "string" || body.tag === null) {
    data.tag = body.tag?.trim() || null;
  }
  if (typeof body.description === "string" || body.description === null) {
    data.description = body.description?.trim() || null;
  }
  if (body.price !== undefined) {
    const price = Number(body.price);
    if (!Number.isFinite(price) || price < 0) {
      return NextResponse.json({ error: "Invalid price." }, { status: 400 });
    }
    data.price = price;
  }
  if (body.originalPrice !== undefined) {
    data.originalPrice =
      body.originalPrice === null || body.originalPrice === ""
        ? null
        : Number(body.originalPrice);
  }
  if (body.priceLarge !== undefined) {
    data.priceLarge =
      body.priceLarge === null || body.priceLarge === "" ? null : Number(body.priceLarge);
  }
  if (typeof body.colorway === "string") data.colorway = body.colorway.trim();
  if (typeof body.imageUrl === "string" || body.imageUrl === null) {
    data.imageUrl = body.imageUrl?.trim() || null;
  }
  if (body.isNew !== undefined) data.isNew = Boolean(body.isNew);
  if (body.active !== undefined) data.active = Boolean(body.active);
  if (body.sortOrder !== undefined) data.sortOrder = Number(body.sortOrder) || 0;

  try {
    const drink = await prisma.drink.update({ where: { id }, data });
    return NextResponse.json({ drink: serializeDrink(drink) });
  } catch {
    return NextResponse.json({ error: "Drink not found." }, { status: 404 });
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    await prisma.drink.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Drink not found." }, { status: 404 });
  }
}
