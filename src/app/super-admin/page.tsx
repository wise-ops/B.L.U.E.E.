import { prisma } from "@/lib/prisma";

export default async function SuperAdminHome() {
  const [orgCount, userCount, courseCount, publishedCount] = await Promise.all([
    prisma.organization.count(),
    prisma.user.count(),
    prisma.course.count(),
    prisma.course.count({ where: { status: "PUBLISHED" } }),
  ]);

  const stats = [
    { label: "Clinics", value: orgCount },
    { label: "Total Users", value: userCount },
    { label: "Courses", value: courseCount },
    { label: "Published", value: publishedCount },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-bluee-navy mb-1">Platform Overview</h1>
      <p className="text-gray-500 mb-6">Everything across BLUEE at a glance.</p>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => (
          <div key={s.label} className="bg-white rounded-xl p-5 shadow-sm">
            <div className="text-3xl font-bold text-bluee-steel">{s.value}</div>
            <div className="text-sm text-gray-500 mt-1">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="mt-8 bg-white rounded-xl p-6 shadow-sm">
        <h2 className="font-semibold text-bluee-navy mb-2">Quick start</h2>
        <p className="text-sm text-gray-600 mb-4">
          Use the AI Course Builder to generate a full veterinary course from a
          topic and your own notes. Generated courses are saved as drafts you can
          review before publishing.
        </p>
        <a
          href="/super-admin/course-builder"
          className="inline-block bg-bluee-orange text-white rounded-lg px-4 py-2 text-sm font-medium hover:opacity-90"
        >
          Open AI Course Builder →
        </a>
      </div>
    </div>
  );
}
