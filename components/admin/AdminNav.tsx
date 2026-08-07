"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

const LINKS = [
  { href: "/admin", label: "Inicio" },
  { href: "/admin/drinks", label: "Bebidas" },
  { href: "/admin/toppings", label: "Toppings" },
  { href: "/admin/orders", label: "Pedidos" },
];

export function AdminNav() {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <nav className="flex h-full flex-col justify-between border-r border-neutral-200 bg-white p-4">
      <div>
        <Link
          href="/"
          className="mb-6 flex flex-col items-center rounded-2xl bg-accent-500 px-3 py-4 transition hover:opacity-95"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/brand/logo-mascot.png"
            alt=""
            className="h-14 w-auto object-contain drop-shadow-[0_6px_14px_rgba(0,0,0,0.2)]"
          />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/brand/wordmark.png"
            alt="Mundo Bubble Tea"
            className="mt-1.5 h-8 w-auto max-w-full object-contain"
          />
          <span className="mt-1.5 rounded-full bg-white px-2.5 py-0.5 font-display text-[10px] font-bold uppercase tracking-[0.14em] text-ink">
            Admin
          </span>
        </Link>
        <ul className="space-y-1">
          {LINKS.map((link) => {
            const active =
              link.href === "/admin"
                ? pathname === "/admin"
                : pathname.startsWith(link.href);
            return (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={`block rounded-lg px-3 py-2 text-sm font-medium transition ${
                    active
                      ? "bg-brand-50 text-brand-700"
                      : "text-neutral-600 hover:bg-neutral-50"
                  }`}
                >
                  {link.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
      <button
        type="button"
        onClick={handleLogout}
        className="rounded-lg px-3 py-2 text-left text-sm font-medium text-neutral-500 transition hover:bg-neutral-50"
      >
        Cerrar sesión
      </button>
    </nav>
  );
}
