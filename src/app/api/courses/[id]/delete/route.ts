import { NextResponse } from "next/server";
import { requireSuperAdmin } from "@/lib/tenant";
import { prisma } from "@/lib/prisma";

export async function POST(
  _req: Request,
  { params }: { params: { id: string } }
) {
  await requireSuperAdmin();
  await prisma.course.delete({ where: { id: params.id } });
  return NextResponse.json({ ok: true });
}
