import { requireUser } from "@/lib/tenant";
import { prisma } from "@/lib/prisma";
import CoursePlayer from "@/components/CoursePlayer";
import { redirect } from "next/navigation";

export default async function CoursePage({
  params,
}: {
  params: { courseId: string };
}) {
  const session = await requireUser();
  const userId = (session.user as any).id;

  // Make sure this course is actually assigned to this user.
  const assignment = await prisma.courseAssignment.findUnique({
    where: { userId_courseId: { userId, courseId: params.courseId } },
  });
  if (!assignment) redirect("/learn");

  const course = await prisma.course.findUnique({
    where: { id: params.courseId },
    include: { modules: { orderBy: { order: "asc" }, include: { lessons: { orderBy: { order: "asc" } } } } },
  });
  if (!course) redirect("/learn");

  const progress = await prisma.lessonProgress.findMany({
    where: { userId },
  });
  const completedLessonIds = progress.filter((p: any) => p.completed).map((p: any) => p.lessonId);

  return (
    <CoursePlayer
      course={JSON.parse(JSON.stringify(course))}
      completedLessonIds={completedLessonIds}
    />
  );
}
