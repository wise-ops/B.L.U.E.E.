import { NextResponse } from "next/server";
import { requireSuperAdmin } from "@/lib/tenant";
import { prisma } from "@/lib/prisma";

// Saves edits to a course: its fields, and the blocks of each lesson.
export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  await requireSuperAdmin();
  const body = await req.json();

  // Update course-level fields.
  await prisma.course.update({
    where: { id: params.id },
    data: {
      title: body.title,
      description: body.description,
      category: body.category,
    },
  });

  // Update each lesson's blocks (and titles, in case they were changed).
  for (const m of body.modules ?? []) {
    for (const l of m.lessons ?? []) {
      await prisma.lesson.update({
        where: { id: l.id },
        data: { title: l.title, blocks: l.blocks ?? [] },
      });
    }
  }

  return NextResponse.json({ ok: true });
}
