import { prisma } from "@/lib/prisma";

export default async function AdminCourses() {
  const courses = await prisma.course.findMany({
    where: { status: "PUBLISHED" },
    orderBy: { title: "asc" },
    include: { modules: { include: { lessons: true } } },
  });

  return (
    <div>
      <h1 className="text-2xl font-bold text-bluee-navy mb-1">Available Courses</h1>
      <p className="text-gray-500 mb-6">
        Published courses from the BLUEE library you can assign to your team.
      </p>
      {courses.length === 0 ? (
        <div className="bg-white rounded-xl p-8 text-center text-gray-500 shadow-sm">
          No published courses yet.
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {courses.map((c: any) => {
            const lessons = c.modules.reduce((n: number, m: any) => n + m.lessons.length, 0);
            return (
              <div key={c.id} className="bg-white rounded-xl p-5 shadow-sm">
                <h3 className="font-semibold text-bluee-navy">{c.title}</h3>
                <p className="text-sm text-gray-500 mt-1 line-clamp-2">{c.description}</p>
                <p className="text-xs text-gray-400 mt-2">
                  {c.category} · {lessons} lessons
                </p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
