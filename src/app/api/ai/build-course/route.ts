import { NextResponse } from "next/server";
import { requireSuperAdmin } from "@/lib/tenant";
import { generateCourse } from "@/lib/ai";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  // Only the platform owner can generate courses.
  await requireSuperAdmin();

  try {
    const { topic, jobRole, notes } = await req.json();
    if (!topic) {
      return NextResponse.json({ error: "Topic is required" }, { status: 400 });
    }

    // 1. Ask Claude to generate the full course as structured JSON.
    const generated = await generateCourse(topic, jobRole, notes || "");

    // 2. Save it to the database as a DRAFT course with all modules + lessons.
    const course = await prisma.course.create({
      data: {
        title: generated.title,
        description: generated.description,
        category: generated.category || jobRole,
        status: "DRAFT",
        modules: {
          create: generated.modules.map((m, mi) => ({
            title: m.title,
            order: mi,
            lessons: {
              create: m.lessons.map((l, li) => ({
                title: l.title,
                order: li,
                blocks: l.blocks ?? [],
              })),
            },
          })),
        },
      },
      include: { modules: { include: { lessons: true } } },
    });

    return NextResponse.json(course);
  } catch (e: any) {
    console.error("build-course error:", e);
    return NextResponse.json(
      { error: e.message || "Failed to generate course" },
      { status: 500 }
    );
  }
}
