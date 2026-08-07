"use client";

import { useState } from "react";
import { DrinkArt } from "@/components/DrinkArt";
import { formatMoney } from "@/lib/format";
import { useCart } from "@/context/CartContext";
import type { PlainOrder } from "@/lib/types";

type Step = "cart" | "checkout" | "confirmation";

export function CartDrawer() {
  const { items, subtotal, isCartOpen, closeCart, removeItem, setQuantity, clear } =
    useCart();
  const [step, setStep] = useState<Step>("cart");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [order, setOrder] = useState<PlainOrder | null>(null);

  if (!isCartOpen) return null;

  function handleClose() {
    closeCart();
    setStep("cart");
    setError(null);
  }

  async function handlePlaceOrder(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName: name,
          customerPhone: phone,
          notes: notes || undefined,
          items: items.map((i) => ({
            drinkId: i.drinkId,
            quantity: i.quantity,
            sugarLevel: i.sugarLevel,
            toppingIds: i.toppings.map((t) => t.toppingId),
          })),
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error ?? "Hubo un problema al hacer el pedido.");
      }
      setOrder(data.order as PlainOrder);
      clear();
      setStep("confirmation");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Algo salió mal.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/45 sm:items-center">
      <button
        type="button"
        aria-label="Cerrar"
        className="absolute inset-0 cursor-default"
        onClick={handleClose}
      />
      <div className="brand-shell animate-rise relative flex max-h-[92vh] w-full max-w-md flex-col overflow-hidden rounded-t-[2rem] sm:rounded-[2rem]">
        <div className="flex shrink-0 items-center justify-between bg-ink px-6 py-5 text-white">
          <div>
            <h2 className="font-display text-xl font-semibold">
              {step === "cart" && "Tu carrito"}
              {step === "checkout" && "Pago"}
              {step === "confirmation" && "Pedido listo"}
            </h2>
            {step === "cart" && items.length > 0 && (
              <p className="mt-0.5 text-xs font-semibold text-white/55">
                {items.reduce((s, i) => s + i.quantity, 0)} productos
              </p>
            )}
          </div>
          <button
            type="button"
            onClick={handleClose}
            aria-label="Cerrar carrito"
            className="flex h-9 w-9 items-center justify-center rounded-full bg-white/15 transition hover:bg-white/25"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path
                d="M6 6l12 12M18 6 6 18"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>

        {step === "cart" && (
          <>
            <div className="flex-1 overflow-y-auto bg-milk px-6 py-5">
              {items.length === 0 ? (
                <div className="flex flex-col items-center py-12 text-center">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/brand/logo-mascot.png"
                    alt=""
                    className="mb-4 h-16 w-auto object-contain opacity-80"
                  />
                  <p className="font-display text-base font-semibold text-ink">
                    El carrito está vacío
                  </p>
                  <p className="mt-1 text-sm text-neutral-500">
                    ¡Agrega algo rico!
                  </p>
                </div>
              ) : (
                <ul className="divide-y divide-black/[0.06]">
                  {items.map((item) => (
                    <li key={item.lineId} className="flex gap-3 py-3.5">
                      <DrinkArt
                        colorway={item.colorway}
                        imageUrl={item.imageUrl}
                        alt={item.name}
                        size="sm"
                        backdrop
                        className="!h-14 !w-14 shrink-0"
                      />
                      <div className="flex-1">
                        <p className="font-display text-sm font-semibold text-ink">
                          {item.name}
                        </p>
                        <p className="text-xs text-neutral-500">
                          Azúcar {item.sugarLevel}%
                          {item.toppings.length > 0 &&
                            ` · ${item.toppings.map((t) => t.name).join(", ")}`}
                        </p>
                        <div className="mt-2 flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() =>
                                setQuantity(item.lineId, item.quantity - 1)
                              }
                              className="flex h-7 w-7 items-center justify-center rounded-full bg-black/[0.06] text-ink"
                              aria-label="Disminuir cantidad"
                            >
                              −
                            </button>
                            <span className="w-4 text-center font-display text-xs font-bold">
                              {item.quantity}
                            </span>
                            <button
                              type="button"
                              onClick={() =>
                                setQuantity(item.lineId, item.quantity + 1)
                              }
                              className="brand-accent flex h-7 w-7 items-center justify-center rounded-full text-white"
                              aria-label="Aumentar cantidad"
                            >
                              +
                            </button>
                          </div>
                          <span className="font-display text-sm font-bold text-ink">
                            {formatMoney(item.lineTotal)}
                          </span>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeItem(item.lineId)}
                        aria-label="Quitar producto"
                        className="self-start text-neutral-300 transition hover:text-accent-500"
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                          <path
                            d="M6 6l12 12M18 6 6 18"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                          />
                        </svg>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            {items.length > 0 && (
              <div className="brand-ink shrink-0 px-6 pb-6 pt-4 text-white">
                <div className="mb-3 flex justify-between font-display text-base font-bold">
                  <span>Subtotal</span>
                  <span>{formatMoney(subtotal)}</span>
                </div>
                <button
                  type="button"
                  onClick={() => setStep("checkout")}
                  className="brand-accent w-full rounded-full py-3.5 font-display text-sm font-bold uppercase tracking-wide text-white transition hover:bg-accent-600"
                >
                  Continuar
                </button>
              </div>
            )}
          </>
        )}

        {step === "checkout" && (
          <form onSubmit={handlePlaceOrder} className="flex flex-1 flex-col overflow-hidden">
            <div className="flex-1 overflow-y-auto bg-milk px-6 py-5">
              <div className="mb-4 flex justify-between rounded-2xl bg-black/[0.04] px-4 py-3 font-display text-sm font-bold text-ink">
                <span>
                  {items.reduce((s, i) => s + i.quantity, 0)} productos
                </span>
                <span>{formatMoney(subtotal)}</span>
              </div>

              <label className="mb-3 block text-sm">
                <span className="mb-1 block font-bold text-ink">Nombre</span>
                <input
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Tu nombre"
                  className="w-full rounded-xl border border-black/10 bg-white px-4 py-2.5 text-sm outline-none transition focus:border-accent-500 focus:ring-2 focus:ring-accent-500/20"
                />
              </label>

              <label className="mb-3 block text-sm">
                <span className="mb-1 block font-bold text-ink">Teléfono</span>
                <input
                  required
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Para avisarte del pedido"
                  className="w-full rounded-xl border border-black/10 bg-white px-4 py-2.5 text-sm outline-none transition focus:border-accent-500 focus:ring-2 focus:ring-accent-500/20"
                />
              </label>

              <label className="mb-3 block text-sm">
                <span className="mb-1 block font-bold text-ink">
                  Notas (opcional)
                </span>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Alergias, notas de retiro, etc."
                  rows={2}
                  className="w-full resize-none rounded-xl border border-black/10 bg-white px-4 py-2.5 text-sm outline-none transition focus:border-accent-500 focus:ring-2 focus:ring-accent-500/20"
                />
              </label>

              {error && (
                <p className="rounded-xl bg-red-50 px-3 py-2 text-xs font-medium text-red-600">
                  {error}
                </p>
              )}
            </div>
            <div className="brand-ink shrink-0 px-6 pb-6 pt-4 text-white">
              <div className="mb-3 flex justify-between font-display text-base font-bold">
                <span>Total</span>
                <span>{formatMoney(subtotal)}</span>
              </div>
              <button
                type="submit"
                disabled={submitting}
                className="brand-accent w-full rounded-full py-3.5 font-display text-sm font-bold uppercase tracking-wide text-white transition hover:bg-accent-600 disabled:opacity-60"
              >
                {submitting ? "Enviando pedido…" : "Hacer pedido"}
              </button>
            </div>
          </form>
        )}

        {step === "confirmation" && order && (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 bg-milk px-6 py-10 text-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/brand/logo-mascot.png"
              alt=""
              className="h-20 w-auto object-contain"
            />
            <div className="brand-accent flex h-10 w-10 items-center justify-center rounded-full text-white">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path
                  d="M5 13l4 4L19 7"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <h3 className="font-display text-xl font-semibold text-ink">
              ¡Gracias, {order.customerName}!
            </h3>
            <p className="text-sm text-neutral-500">
              Recibimos tu pedido y ya lo estamos preparando.
            </p>
            <div className="brand-card w-full rounded-2xl p-4 text-left">
              <p className="mb-2 text-xs font-bold uppercase tracking-[0.12em] text-neutral-400">
                Pedido #{order.id.slice(-8)}
              </p>
              <ul className="space-y-1 text-sm text-neutral-700">
                {order.items.map((item) => (
                  <li key={item.id} className="flex justify-between">
                    <span>
                      {item.quantity}x {item.drinkName}
                    </span>
                    <span>{formatMoney(item.lineTotal)}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-2 flex justify-between border-t border-black/10 pt-2 font-display text-sm font-bold text-ink">
                <span>Total</span>
                <span>{formatMoney(order.total)}</span>
              </div>
            </div>
            <button
              type="button"
              onClick={handleClose}
              className="brand-ink w-full rounded-full py-3.5 font-display text-sm font-bold uppercase tracking-wide text-white transition hover:opacity-90"
            >
              Volver al menú
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
