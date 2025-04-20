import AdminSidebar from "@/components/Common/AdminSidebar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      <main className="flex-1 p-4 bg-gray-800 dark:bg-gray-800">
        {children}
      </main>
    </div>
  );
}
