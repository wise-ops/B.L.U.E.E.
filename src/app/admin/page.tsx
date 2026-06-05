import { requireAdmin, getOrgId } from "@/lib/tenant";
import { prisma } from "@/lib/prisma";

export default async function AdminDashboard() {
  const session = await requireAdmin();
  const orgId = getOrgId(session);
  if (!orgId) return <div>No clinic linked to this account.</div>;

  const [staff, assignments, completed] = await Promise.all([
    prisma.user.count({ where: { organizationId: orgId, role: "EMPLOYEE" } }),
    prisma.courseAssignment.count({ where: { organizationId: orgId } }),
    prisma.courseAssignment.count({
      where: { organizationId: orgId, status: "COMPLETED" },
    }),
  ]);

  const rate = assignments > 0 ? Math.round((completed / assignments) * 100) : 0;
  const stats = [
    { label: "Staff", value: staff },
    { label: "Assignments", value: assignments },
    { label: "Completed", value: completed },
    { label: "Completion %", value: `${rate}%` },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-bluee-navy mb-1">Clinic Dashboard</h1>
      <p className="text-gray-500 mb-6">Your team's training at a glance.</p>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => (
          <div key={s.label} className="bg-white rounded-xl p-5 shadow-sm">
            <div className="text-3xl font-bold text-bluee-steel">{s.value}</div>
            <div className="text-sm text-gray-500 mt-1">{s.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
