import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { serializeTopping } from "@/lib/serialize";

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
  if (body.price !== undefined) {
    const price = Number(body.price);
    if (!Number.isFinite(price) || price < 0) {
      return NextResponse.json({ error: "Invalid price." }, { status: 400 });
    }
    data.price = price;
  }
  if (typeof body.colorway === "string") data.colorway = body.colorway.trim();
  if (typeof body.imageUrl === "string" || body.imageUrl === null) {
    data.imageUrl = body.imageUrl?.trim() || null;
  }
  if (body.active !== undefined) data.active = Boolean(body.active);
  if (body.sortOrder !== undefined) data.sortOrder = Number(body.sortOrder) || 0;

  try {
    const topping = await prisma.topping.update({ where: { id }, data });
    return NextResponse.json({ topping: serializeTopping(topping) });
  } catch {
    return NextResponse.json({ error: "Topping not found." }, { status: 404 });
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    await prisma.topping.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Topping not found." }, { status: 404 });
  }
}
