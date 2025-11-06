import AdminNav from "./components/admin-nav";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-[calc(100vh-4rem)]">
      <aside className="fixed inset-y-0 left-0 z-10 hidden w-64 flex-col border-r bg-card md:flex mt-16">
        <AdminNav />
      </aside>
      <main className="flex-1 md:pl-64 pt-16">
        <div className="p-4 sm:p-6 lg:p-8">
            {children}
        </div>
      </main>
    </div>
  );
}
