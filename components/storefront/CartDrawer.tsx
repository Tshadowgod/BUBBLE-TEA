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
        throw new Error(data.error ?? "Something went wrong placing your order.");
      }
      setOrder(data.order as PlainOrder);
      clear();
      setStep("confirmation");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 sm:items-center">
      <div className="flex max-h-[92vh] w-full max-w-md flex-col overflow-hidden rounded-t-3xl border border-white/60 bg-white/60 shadow-xl shadow-brand-900/10 backdrop-blur-2xl sm:rounded-3xl">
        <div className="flex shrink-0 items-center justify-between border-b border-white/20 bg-gradient-to-br from-brand-400/90 to-brand-900/90 px-6 py-5 text-white shadow-lg shadow-brand-900/20 backdrop-blur-xl">
          <h2 className="text-lg font-bold">
            {step === "cart" && "Your Cart"}
            {step === "checkout" && "Checkout"}
            {step === "confirmation" && "Order Placed"}
          </h2>
          <button
            type="button"
            onClick={handleClose}
            aria-label="Close cart"
            className="flex h-8 w-8 items-center justify-center rounded-full bg-white/15 transition hover:bg-white/25"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path
                d="M6 6l12 12M18 6 6 18"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>

        {step === "cart" && (
          <>
            <div className="flex-1 overflow-y-auto px-6 py-5">
              {items.length === 0 ? (
                <p className="py-10 text-center text-sm text-neutral-500">
                  Your cart is empty. Go add something tasty!
                </p>
              ) : (
                <ul className="space-y-3">
                  {items.map((item) => (
                    <li
                      key={item.lineId}
                      className="flex gap-3 rounded-2xl border border-white/60 bg-white/60 p-3 shadow-sm backdrop-blur-md"
                    >
                      <DrinkArt
                        colorway={item.colorway}
                        imageUrl={item.imageUrl}
                        alt={item.name}
                        size="sm"
                        backdrop
                      />
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-neutral-800">
                          {item.name}
                        </p>
                        <p className="text-xs text-neutral-500">
                          Sugar {item.sugarLevel}%
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
                              className="flex h-6 w-6 items-center justify-center rounded-full bg-brand-50 text-brand-700"
                              aria-label="Decrease quantity"
                            >
                              −
                            </button>
                            <span className="w-4 text-center text-xs font-bold">
                              {item.quantity}
                            </span>
                            <button
                              type="button"
                              onClick={() =>
                                setQuantity(item.lineId, item.quantity + 1)
                              }
                              className="flex h-6 w-6 items-center justify-center rounded-full bg-brand-50 text-brand-700"
                              aria-label="Increase quantity"
                            >
                              +
                            </button>
                          </div>
                          <span className="text-sm font-bold text-brand-600">
                            {formatMoney(item.lineTotal)}
                          </span>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeItem(item.lineId)}
                        aria-label="Remove item"
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
              <div className="shrink-0 border-t border-white/10 bg-brand-900/80 px-6 pb-6 pt-4 text-white backdrop-blur-xl">
                <div className="mb-3 flex justify-between text-base font-bold">
                  <span>Subtotal</span>
                  <span>{formatMoney(subtotal)}</span>
                </div>
                <button
                  type="button"
                  onClick={() => setStep("checkout")}
                  className="w-full rounded-full bg-white py-3 text-sm font-bold text-brand-700 transition hover:bg-brand-50"
                >
                  Checkout
                </button>
              </div>
            )}
          </>
        )}

        {step === "checkout" && (
          <form onSubmit={handlePlaceOrder} className="flex flex-1 flex-col overflow-hidden">
            <div className="flex-1 overflow-y-auto px-6 py-5">
              <div className="mb-4 rounded-2xl border border-white/60 bg-white/60 p-4 shadow-sm backdrop-blur-md">
                <div className="flex justify-between text-sm font-bold text-neutral-700">
                  <span>{items.reduce((s, i) => s + i.quantity, 0)} items</span>
                  <span>{formatMoney(subtotal)}</span>
                </div>
              </div>

              <label className="mb-3 block text-sm">
                <span className="mb-1 block font-semibold text-neutral-700">Name</span>
                <input
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your name"
                  className="w-full rounded-xl border border-neutral-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-brand-500"
                />
              </label>

              <label className="mb-3 block text-sm">
                <span className="mb-1 block font-semibold text-neutral-700">Phone</span>
                <input
                  required
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="For order updates"
                  className="w-full rounded-xl border border-neutral-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-brand-500"
                />
              </label>

              <label className="mb-3 block text-sm">
                <span className="mb-1 block font-semibold text-neutral-700">
                  Notes (optional)
                </span>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Allergies, delivery instructions, etc."
                  rows={2}
                  className="w-full resize-none rounded-xl border border-neutral-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-brand-500"
                />
              </label>

              {error && (
                <p className="rounded-xl bg-red-50 px-3 py-2 text-xs font-medium text-accent-600">
                  {error}
                </p>
              )}
            </div>
            <div className="shrink-0 border-t border-white/10 bg-brand-900/80 px-6 pb-6 pt-4 text-white backdrop-blur-xl">
              <div className="mb-3 flex justify-between text-base font-bold">
                <span>Total</span>
                <span>{formatMoney(subtotal)}</span>
              </div>
              <button
                type="submit"
                disabled={submitting}
                className="w-full rounded-full bg-white py-3 text-sm font-bold text-brand-700 transition hover:bg-brand-50 disabled:opacity-60"
              >
                {submitting ? "Placing order…" : "Place Order"}
              </button>
            </div>
          </form>
        )}

        {step === "confirmation" && order && (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 py-10 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-brand-50 text-brand-600">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path
                  d="M5 13l4 4L19 7"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-neutral-800">Thanks, {order.customerName}!</h3>
            <p className="text-sm text-neutral-500">
              Your order has been received and is being prepared.
            </p>
            <div className="w-full rounded-2xl border border-white/60 bg-white/60 p-4 text-left shadow-sm backdrop-blur-md">
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-neutral-400">
                Order #{order.id.slice(-8)}
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
              <div className="mt-2 flex justify-between border-t border-neutral-100 pt-2 text-sm font-bold text-brand-600">
                <span>Total</span>
                <span>{formatMoney(order.total)}</span>
              </div>
            </div>
            <button
              type="button"
              onClick={handleClose}
              className="w-full rounded-full bg-brand-600 py-3 text-sm font-bold text-white transition hover:bg-brand-700"
            >
              Back to Menu
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
