"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { DrinkArt } from "@/components/DrinkArt";
import { formatMoney } from "@/lib/format";
import type { PlainTopping } from "@/lib/types";

const COLORWAYS = [
  "pearl",
  "cream",
  "jelly",
  "redbean",
  "pudding",
  "taro",
  "matcha",
  "honey",
];

type FormState = {
  id: string | null;
  name: string;
  price: string;
  colorway: string;
  imageUrl: string;
  active: boolean;
  sortOrder: string;
};

const EMPTY_FORM: FormState = {
  id: null,
  name: "",
  price: "",
  colorway: "pearl",
  imageUrl: "",
  active: true,
  sortOrder: "0",
};

export function ToppingsManager({ toppings }: { toppings: PlainTopping[] }) {
  const router = useRouter();
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function startEdit(topping: PlainTopping) {
    setForm({
      id: topping.id,
      name: topping.name,
      price: String(topping.price),
      colorway: topping.colorway,
      imageUrl: topping.imageUrl ?? "",
      active: topping.active,
      sortOrder: String(topping.sortOrder),
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
      price: form.price,
      colorway: form.colorway,
      imageUrl: form.imageUrl || null,
      active: form.active,
      sortOrder: form.sortOrder,
    };

    try {
      const res = await fetch(
        form.id ? `/api/admin/toppings/${form.id}` : "/api/admin/toppings",
        {
          method: form.id ? "PATCH" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? "No se pudo guardar el topping.");
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
    if (!confirm("¿Eliminar este topping? No se puede deshacer.")) return;
    const res = await fetch(`/api/admin/toppings/${id}`, { method: "DELETE" });
    if (res.ok) router.refresh();
  }

  return (
    <div>
      <h1 className="mb-6 text-2xl font-extrabold text-neutral-800">Toppings</h1>

      <form
        onSubmit={handleSubmit}
        className="mb-8 grid grid-cols-1 gap-4 rounded-2xl bg-white p-6 shadow-sm sm:grid-cols-2"
      >
        <h2 className="col-span-full text-sm font-bold uppercase tracking-wide text-neutral-500">
          {form.id ? "Editar topping" : "Agregar un topping"}
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
          <span className="mb-1 block font-semibold text-neutral-700">Precio</span>
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
          <span className="mb-1 block font-semibold text-neutral-700">Orden</span>
          <input
            type="number"
            value={form.sortOrder}
            onChange={(e) => setForm({ ...form, sortOrder: e.target.value })}
            className="w-full rounded-xl border border-neutral-200 px-3 py-2 text-sm outline-none focus:border-brand-500"
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

        <label className="flex items-center gap-2 text-sm font-semibold text-neutral-700">
          <input
            type="checkbox"
            checked={form.active}
            onChange={(e) => setForm({ ...form, active: e.target.checked })}
          />
          Activo
        </label>

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
            {saving ? "Guardando…" : form.id ? "Guardar cambios" : "Agregar topping"}
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
              <th className="px-5 py-3">Topping</th>
              <th className="px-5 py-3">Precio</th>
              <th className="px-5 py-3">Estado</th>
              <th className="px-5 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100">
            {toppings.map((topping) => (
              <tr key={topping.id}>
                <td className="flex items-center gap-3 px-5 py-3">
                  <DrinkArt
                    colorway={topping.colorway}
                    imageUrl={topping.imageUrl}
                    alt={topping.name}
                    kind="topping"
                    size="sm"
                    backdrop
                    className="!h-9 !w-9"
                  />
                  <span className="font-semibold text-neutral-800">{topping.name}</span>
                </td>
                <td className="px-5 py-3 font-semibold text-brand-600">
                  {formatMoney(topping.price)}
                </td>
                <td className="px-5 py-3">
                  <span
                    className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                      topping.active
                        ? "bg-brand-50 text-brand-700"
                        : "bg-neutral-100 text-neutral-500"
                    }`}
                  >
                    {topping.active ? "Activo" : "Oculto"}
                  </span>
                </td>
                <td className="px-5 py-3 text-right">
                  <button
                    type="button"
                    onClick={() => startEdit(topping)}
                    className="mr-3 text-xs font-semibold text-brand-600"
                  >
                    Editar
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(topping.id)}
                    className="text-xs font-semibold text-accent-600"
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
            {toppings.length === 0 && (
              <tr>
                <td colSpan={4} className="px-5 py-8 text-center text-neutral-400">
                  Todavía no hay toppings — agregá el primero arriba.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
