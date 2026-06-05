import { NextResponse } from "next/server";
import { requireUser } from "@/lib/tenant";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const session = await requireUser();
  const userId = (session.user as any).id;
  const { lessonId, courseId } = await req.json();

  // Mark this lesson complete for this user.
  await prisma.lessonProgress.upsert({
    where: { userId_lessonId: { userId, lessonId } },
    update: { completed: true, completedAt: new Date() },
    create: { userId, lessonId, completed: true, completedAt: new Date() },
  });

  // Update the overall course assignment status.
  const course = await prisma.course.findUnique({
    where: { id: courseId },
    include: { modules: { include: { lessons: true } } },
  });
  if (course) {
    const allLessonIds = course.modules.flatMap((m: any) => m.lessons.map((l: any) => l.id));
    const doneCount = await prisma.lessonProgress.count({
      where: { userId, lessonId: { in: allLessonIds }, completed: true },
    });
    const status =
      doneCount >= allLessonIds.length ? "COMPLETED" : "IN_PROGRESS";
    await prisma.courseAssignment.updateMany({
      where: { userId, courseId },
      data: { status },
    });
  }

  return NextResponse.json({ ok: true });
}
