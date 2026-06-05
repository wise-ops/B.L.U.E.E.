import { requireAdmin, getOrgId } from "@/lib/tenant";
import { prisma } from "@/lib/prisma";

export default async function AdminAssignments() {
  const session = await requireAdmin();
  const orgId = getOrgId(session);
  const assignments = await prisma.courseAssignment.findMany({
    where: { organizationId: orgId! },
    orderBy: { createdAt: "desc" },
    include: { course: true, user: true },
  });

  return (
    <div>
      <h1 className="text-2xl font-bold text-bluee-navy mb-1">Assignments</h1>
      <p className="text-gray-500 mb-6">Training assigned to your team.</p>
      {assignments.length === 0 ? (
        <div className="bg-white rounded-xl p-8 text-center text-gray-500 shadow-sm">
          No assignments yet.
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-500 text-left">
              <tr>
                <th className="px-5 py-3">Staff</th>
                <th className="px-5 py-3">Course</th>
                <th className="px-5 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {assignments.map((a: any) => (
                <tr key={a.id} className="border-t border-gray-100">
                  <td className="px-5 py-3 font-medium text-bluee-navy">{a.user.name}</td>
                  <td className="px-5 py-3 text-gray-600">{a.course.title}</td>
                  <td className="px-5 py-3 text-gray-600">{a.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
