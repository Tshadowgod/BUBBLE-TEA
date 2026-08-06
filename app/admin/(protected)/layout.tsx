import { AdminNav } from "@/components/admin/AdminNav";

export default function AdminProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-neutral-50">
      <div className="w-56 shrink-0">
        <AdminNav />
      </div>
      <main className="flex-1 p-8">{children}</main>
    </div>
  );
}
