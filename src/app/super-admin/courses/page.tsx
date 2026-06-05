import { prisma } from "@/lib/prisma";
import PublishButton from "@/components/PublishButton";

export default async function CourseLibrary() {
  const courses = await prisma.course.findMany({
    orderBy: { createdAt: "desc" },
    include: { modules: { include: { lessons: true } } },
  });

  return (
    <div>
      <h1 className="text-2xl font-bold text-bluee-navy mb-1">Course Library</h1>
      <p className="text-gray-500 mb-6">
        All courses across the platform. Drafts are only visible here until published.
      </p>

      {courses.length === 0 ? (
        <div className="bg-white rounded-xl p-8 text-center text-gray-500 shadow-sm">
          No courses yet. Use the AI Course Builder to create your first one.
        </div>
      ) : (
        <div className="space-y-3">
          {courses.map((c: any) => {
            const lessonCount = c.modules.reduce(
              (n: number, m: any) => n + m.lessons.length,
              0
            );
            return (
              <div
                key={c.id}
                className="bg-white rounded-xl p-5 shadow-sm flex items-center justify-between"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-bluee-navy">{c.title}</h3>
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full ${
                        c.status === "PUBLISHED"
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {c.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">
                    {c.category} · {c.modules.length} modules · {lessonCount} lessons
                  </p>
                </div>
                <PublishButton courseId={c.id} status={c.status} />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
