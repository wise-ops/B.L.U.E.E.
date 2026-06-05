import { requireUser } from "@/lib/tenant";
import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function MyTraining() {
  const session = await requireUser();
  const userId = (session.user as any).id;

  const assignments = await prisma.courseAssignment.findMany({
    where: { userId },
    include: { course: { include: { modules: { include: { lessons: true } } } } },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <h1 className="text-2xl font-bold text-bluee-navy mb-1">My Training</h1>
      <p className="text-gray-500 mb-6">Courses assigned to you.</p>
      {assignments.length === 0 ? (
        <div className="bg-white rounded-xl p-8 text-center text-gray-500 shadow-sm">
          You have no assigned training yet.
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {assignments.map((a: any) => {
            const lessons = a.course.modules.reduce((n: number, m: any) => n + m.lessons.length, 0);
            return (
              <Link
                key={a.id}
                href={`/learn/courses/${a.course.id}`}
                className="bg-white rounded-xl p-5 shadow-sm hover:shadow-md transition block"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                    a.status === "COMPLETED" ? "bg-green-100 text-green-700"
                    : a.status === "IN_PROGRESS" ? "bg-blue-100 text-blue-700"
                    : "bg-gray-100 text-gray-600"
                  }`}>
                    {a.status.replace("_", " ")}
                  </span>
                </div>
                <h3 className="font-semibold text-bluee-navy">{a.course.title}</h3>
                <p className="text-sm text-gray-500 mt-1 line-clamp-2">{a.course.description}</p>
                <p className="text-xs text-gray-400 mt-2">{lessons} lessons</p>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
