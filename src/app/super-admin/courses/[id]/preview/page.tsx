import { prisma } from "@/lib/prisma";
import { requireSuperAdmin } from "@/lib/tenant";
import { redirect } from "next/navigation";
import CoursePreview from "@/components/CoursePreview";

export default async function PreviewPage({
  params,
}: {
  params: { id: string };
}) {
  await requireSuperAdmin();
  const course = await prisma.course.findUnique({
    where: { id: params.id },
    include: {
      modules: {
        orderBy: { order: "asc" },
        include: { lessons: { orderBy: { order: "asc" } } },
      },
    },
  });
  if (!course) redirect("/super-admin/courses");
  return <CoursePreview course={JSON.parse(JSON.stringify(course))} />;
}
