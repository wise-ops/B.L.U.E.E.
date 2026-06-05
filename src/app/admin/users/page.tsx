import { requireAdmin, getOrgId } from "@/lib/tenant";
import { prisma } from "@/lib/prisma";

export default async function AdminUsers() {
  const session = await requireAdmin();
  const orgId = getOrgId(session);
  const users = await prisma.user.findMany({
    where: { organizationId: orgId! },
    orderBy: { name: "asc" },
    include: { jobRole: true },
  });

  return (
    <div>
      <h1 className="text-2xl font-bold text-bluee-navy mb-1">Staff</h1>
      <p className="text-gray-500 mb-6">Everyone in your clinic.</p>
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-500 text-left">
            <tr>
              <th className="px-5 py-3">Name</th>
              <th className="px-5 py-3">Email</th>
              <th className="px-5 py-3">Role</th>
              <th className="px-5 py-3">Job</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u: any) => (
              <tr key={u.id} className="border-t border-gray-100">
                <td className="px-5 py-3 font-medium text-bluee-navy">{u.name}</td>
                <td className="px-5 py-3 text-gray-600">{u.email}</td>
                <td className="px-5 py-3 text-gray-600">{u.role}</td>
                <td className="px-5 py-3 text-gray-600">{u.jobRole?.name ?? "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
