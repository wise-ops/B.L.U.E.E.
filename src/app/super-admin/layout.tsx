import { requireSuperAdmin } from "@/lib/tenant";
import Sidebar from "@/components/Sidebar";

export default async function SuperAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await requireSuperAdmin();
  return (
    <div className="flex">
      <Sidebar role="SUPER_ADMIN" userName={session.user.name} />
      <main className="flex-1 p-8">{children}</main>
    </div>
  );
}
