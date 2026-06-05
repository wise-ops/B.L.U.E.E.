import { requireUser } from "@/lib/tenant";
import Sidebar from "@/components/Sidebar";

export default async function LearnLayout({ children }: { children: React.ReactNode }) {
  const session = await requireUser();
  return (
    <div className="flex">
      <Sidebar role="EMPLOYEE" userName={session.user.name} />
      <main className="flex-1 p-8">{children}</main>
    </div>
  );
}
