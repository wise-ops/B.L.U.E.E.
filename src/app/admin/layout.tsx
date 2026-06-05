import { requireAdmin } from "@/lib/tenant";
import Sidebar from "@/components/Sidebar";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await requireAdmin();
  return (
    <div className="flex">
      <Sidebar role="ORG_ADMIN" userName={session.user.name} />
      <main className="flex-1 p-8">{children}</main>
    </div>
  );
}
