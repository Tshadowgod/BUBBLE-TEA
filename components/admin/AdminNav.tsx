"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

const LINKS = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/drinks", label: "Drinks" },
  { href: "/admin/toppings", label: "Toppings" },
  { href: "/admin/orders", label: "Orders" },
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
        <p className="mb-6 px-2 font-display text-lg font-semibold text-ink">
          Mundo Bubble Tea Admin
        </p>
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
        Log out
      </button>
    </nav>
  );
}
