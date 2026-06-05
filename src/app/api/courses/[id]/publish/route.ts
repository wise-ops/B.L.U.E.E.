import { NextResponse } from "next/server";
import { requireSuperAdmin } from "@/lib/tenant";
import { prisma } from "@/lib/prisma";

export async function POST(
  _req: Request,
  { params }: { params: { id: string } }
) {
  await requireSuperAdmin();
  const course = await prisma.course.findUnique({ where: { id: params.id } });
  if (!course)
    return NextResponse.json({ error: "Not found" }, { status: 404 });

  const updated = await prisma.course.update({
    where: { id: params.id },
    data: { status: course.status === "PUBLISHED" ? "DRAFT" : "PUBLISHED" },
  });
  return NextResponse.json(updated);
}
