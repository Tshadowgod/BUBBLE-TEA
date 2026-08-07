"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { DrinkArt } from "@/components/DrinkArt";
import { formatMoney } from "@/lib/format";
import type { PlainDrink } from "@/lib/types";

const COLORWAYS = [
  "taro",
  "matcha",
  "honey",
  "blacktea",
  "icecream",
  "brownsugar",
  "wintermelon",
  "pearl",
  "cream",
  "jelly",
  "redbean",
  "pudding",
];

type FormState = {
  id: string | null;
  name: string;
  category: string;
  tag: string;
  description: string;
  price: string;
  priceLarge: string;
  originalPrice: string;
  colorway: string;
  imageUrl: string;
  isNew: boolean;
  active: boolean;
  sortOrder: string;
};

const EMPTY_FORM: FormState = {
  id: null,
  name: "",
  category: "Bubble Tea",
  tag: "",
  description: "",
  price: "",
  priceLarge: "",
  originalPrice: "",
  colorway: "honey",
  imageUrl: "",
  isNew: false,
  active: true,
  sortOrder: "0",
};

export function DrinksManager({ drinks }: { drinks: PlainDrink[] }) {
  const router = useRouter();
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function startEdit(drink: PlainDrink) {
    setForm({
      id: drink.id,
      name: drink.name,
      category: drink.category,
      tag: drink.tag ?? "",
      description: drink.description ?? "",
      price: String(drink.price),
      priceLarge: drink.priceLarge !== null ? String(drink.priceLarge) : "",
      originalPrice: drink.originalPrice !== null ? String(drink.originalPrice) : "",
      colorway: drink.colorway,
      imageUrl: drink.imageUrl ?? "",
      isNew: drink.isNew,
      active: drink.active,
      sortOrder: String(drink.sortOrder),
    });
    setError(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);

    const payload = {
      name: form.name,
      category: form.category,
      tag: form.tag || null,
      description: form.description || null,
      price: form.price,
      priceLarge: form.priceLarge || null,
      originalPrice: form.originalPrice || null,
      colorway: form.colorway,
      imageUrl: form.imageUrl || null,
      isNew: form.isNew,
      active: form.active,
      sortOrder: form.sortOrder,
    };

    try {
      const res = await fetch(
        form.id ? `/api/admin/drinks/${form.id}` : "/api/admin/drinks",
        {
          method: form.id ? "PATCH" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? "No se pudo guardar la bebida.");
      }
      setForm(EMPTY_FORM);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Algo salió mal.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("¿Eliminar esta bebida? No se puede deshacer.")) return;
    const res = await fetch(`/api/admin/drinks/${id}`, { method: "DELETE" });
    if (res.ok) router.refresh();
  }

  return (
    <div>
      <h1 className="mb-6 text-2xl font-extrabold text-neutral-800">Bebidas</h1>

      <form
        onSubmit={handleSubmit}
        className="mb-8 grid grid-cols-1 gap-4 rounded-2xl bg-white p-6 shadow-sm sm:grid-cols-2"
      >
        <h2 className="col-span-full text-sm font-bold uppercase tracking-wide text-neutral-500">
          {form.id ? "Editar bebida" : "Agregar una bebida"}
        </h2>

        <label className="text-sm">
          <span className="mb-1 block font-semibold text-neutral-700">Nombre</span>
          <input
            required
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full rounded-xl border border-neutral-200 px-3 py-2 text-sm outline-none focus:border-brand-500"
          />
        </label>

        <label className="text-sm">
          <span className="mb-1 block font-semibold text-neutral-700">Categoría</span>
          <input
            required
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
            placeholder="Jugos con leche, Frappés…"
            className="w-full rounded-xl border border-neutral-200 px-3 py-2 text-sm outline-none focus:border-brand-500"
          />
        </label>

        <label className="text-sm">
          <span className="mb-1 block font-semibold text-neutral-700">Etiqueta</span>
          <input
            value={form.tag}
            onChange={(e) => setForm({ ...form, tag: e.target.value })}
            placeholder="500 / 700 ml"
            className="w-full rounded-xl border border-neutral-200 px-3 py-2 text-sm outline-none focus:border-brand-500"
          />
        </label>

        <label className="text-sm">
          <span className="mb-1 block font-semibold text-neutral-700">Color de relleno</span>
          <select
            value={form.colorway}
            onChange={(e) => setForm({ ...form, colorway: e.target.value })}
            className="w-full rounded-xl border border-neutral-200 px-3 py-2 text-sm outline-none focus:border-brand-500"
          >
            {COLORWAYS.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </label>

        <label className="text-sm">
          <span className="mb-1 block font-semibold text-neutral-700">Precio 500 ml</span>
          <input
            required
            type="number"
            step="0.01"
            min="0"
            value={form.price}
            onChange={(e) => setForm({ ...form, price: e.target.value })}
            className="w-full rounded-xl border border-neutral-200 px-3 py-2 text-sm outline-none focus:border-brand-500"
          />
        </label>

        <label className="text-sm">
          <span className="mb-1 block font-semibold text-neutral-700">
            Precio 700 ml (opcional — dejar vacío si es de tamaño único)
          </span>
          <input
            type="number"
            step="0.01"
            min="0"
            value={form.priceLarge}
            onChange={(e) => setForm({ ...form, priceLarge: e.target.value })}
            className="w-full rounded-xl border border-neutral-200 px-3 py-2 text-sm outline-none focus:border-brand-500"
          />
        </label>

        <label className="text-sm">
          <span className="mb-1 block font-semibold text-neutral-700">
            Precio anterior (opcional, para descuentos)
          </span>
          <input
            type="number"
            step="0.01"
            min="0"
            value={form.originalPrice}
            onChange={(e) => setForm({ ...form, originalPrice: e.target.value })}
            className="w-full rounded-xl border border-neutral-200 px-3 py-2 text-sm outline-none focus:border-brand-500"
          />
        </label>

        <label className="text-sm sm:col-span-2">
          <span className="mb-1 block font-semibold text-neutral-700">Descripción</span>
          <textarea
            rows={2}
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="w-full resize-none rounded-xl border border-neutral-200 px-3 py-2 text-sm outline-none focus:border-brand-500"
          />
        </label>

        <label className="text-sm sm:col-span-2">
          <span className="mb-1 block font-semibold text-neutral-700">
            URL de la imagen (opcional — vacío usa la ilustración por defecto)
          </span>
          <input
            value={form.imageUrl}
            onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
            placeholder="https://…"
            className="w-full rounded-xl border border-neutral-200 px-3 py-2 text-sm outline-none focus:border-brand-500"
          />
        </label>

        <label className="text-sm">
          <span className="mb-1 block font-semibold text-neutral-700">Orden</span>
          <input
            type="number"
            value={form.sortOrder}
            onChange={(e) => setForm({ ...form, sortOrder: e.target.value })}
            className="w-full rounded-xl border border-neutral-200 px-3 py-2 text-sm outline-none focus:border-brand-500"
          />
        </label>

        <div className="flex items-center gap-6 text-sm">
          <label className="flex items-center gap-2 font-semibold text-neutral-700">
            <input
              type="checkbox"
              checked={form.isNew}
              onChange={(e) => setForm({ ...form, isNew: e.target.checked })}
            />
            Mostrar en Novedades
          </label>
          <label className="flex items-center gap-2 font-semibold text-neutral-700">
            <input
              type="checkbox"
              checked={form.active}
              onChange={(e) => setForm({ ...form, active: e.target.checked })}
            />
            Activa
          </label>
        </div>

        {error && (
          <p className="col-span-full rounded-xl bg-red-50 px-3 py-2 text-xs font-medium text-accent-600">
            {error}
          </p>
        )}

        <div className="col-span-full flex gap-3">
          <button
            type="submit"
            disabled={saving}
            className="rounded-full bg-brand-600 px-6 py-2.5 text-sm font-bold text-white transition hover:bg-brand-700 disabled:opacity-60"
          >
            {saving ? "Guardando…" : form.id ? "Guardar cambios" : "Agregar bebida"}
          </button>
          {form.id && (
            <button
              type="button"
              onClick={() => setForm(EMPTY_FORM)}
              className="rounded-full bg-neutral-100 px-6 py-2.5 text-sm font-bold text-neutral-600 transition hover:bg-neutral-200"
            >
              Cancelar
            </button>
          )}
        </div>
      </form>

      <div className="overflow-hidden rounded-2xl bg-white shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-neutral-100 text-xs font-semibold uppercase text-neutral-400">
            <tr>
              <th className="px-5 py-3">Bebida</th>
              <th className="px-5 py-3">Categoría</th>
              <th className="px-5 py-3">Precio</th>
              <th className="px-5 py-3">Estado</th>
              <th className="px-5 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100">
            {drinks.map((drink) => (
              <tr key={drink.id}>
                <td className="flex items-center gap-3 px-5 py-3">
                  <DrinkArt
                    colorway={drink.colorway}
                    imageUrl={drink.imageUrl}
                    alt={drink.name}
                    size="sm"
                    backdrop
                    className="!h-9 !w-9"
                  />
                  <span className="font-semibold text-neutral-800">{drink.name}</span>
                  {drink.isNew && (
                    <span className="rounded-full bg-accent-500/10 px-2 py-0.5 text-[10px] font-bold text-accent-600">
                      NUEVA
                    </span>
                  )}
                </td>
                <td className="px-5 py-3 text-neutral-500">{drink.category}</td>
                <td className="px-5 py-3 font-semibold text-brand-600">
                  {formatMoney(drink.price)}
                  {drink.priceLarge !== null && (
                    <span className="text-neutral-400"> / {formatMoney(drink.priceLarge)}</span>
                  )}
                </td>
                <td className="px-5 py-3">
                  <span
                    className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                      drink.active
                        ? "bg-brand-50 text-brand-700"
                        : "bg-neutral-100 text-neutral-500"
                    }`}
                  >
                    {drink.active ? "Activa" : "Oculta"}
                  </span>
                </td>
                <td className="px-5 py-3 text-right">
                  <button
                    type="button"
                    onClick={() => startEdit(drink)}
                    className="mr-3 text-xs font-semibold text-brand-600"
                  >
                    Editar
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(drink.id)}
                    className="text-xs font-semibold text-accent-600"
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
            {drinks.length === 0 && (
              <tr>
                <td colSpan={5} className="px-5 py-8 text-center text-neutral-400">
                  Todavía no hay bebidas — agregá la primera arriba.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
