// ─────────────────────────────────────────────────────────────
// BLUEE Course Importer
// ─────────────────────────────────────────────────────────────
// This loads a course from a JSON file into your database as a
// PUBLISHED course, ready to assign to staff.
//
// HOW TO USE (from your bluee-repo folder in Command Prompt):
//   1. Make sure DATABASE_URL is set (same as when you seeded).
//   2. Run:  npx tsx import-course.ts courses/parasitology.json
//
// Repeat for each course file. If you run the same file twice, it
// updates the existing course instead of making a duplicate.
// ─────────────────────────────────────────────────────────────

import { PrismaClient } from "@prisma/client";
import { readFileSync } from "fs";

const prisma = new PrismaClient();

interface CourseFile {
  title: string;
  description: string;
  category: string;
  modules: {
    title: string;
    lessons: { title: string; blocks: any[] }[];
  }[];
}

async function main() {
  const filePath = process.argv[2];
  if (!filePath) {
    console.error("❌ Please provide a course file, e.g.:");
    console.error("   npx tsx import-course.ts courses/parasitology.json");
    process.exit(1);
  }

  const data: CourseFile = JSON.parse(readFileSync(filePath, "utf-8"));
  console.log(`\nImporting: ${data.title}`);

  // If a course with this title already exists, remove it first so we
  // cleanly replace it (avoids duplicates if you re-run).
  const existing = await prisma.course.findFirst({
    where: { title: data.title },
  });
  if (existing) {
    await prisma.course.delete({ where: { id: existing.id } });
    console.log("  (replaced existing course of the same name)");
  }

  const course = await prisma.course.create({
    data: {
      title: data.title,
      description: data.description,
      category: data.category,
      status: "PUBLISHED",
      modules: {
        create: data.modules.map((m, mi) => ({
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

  const lessonCount = course.modules.reduce(
    (n, m) => n + m.lessons.length,
    0
  );
  console.log(
    `✅ Done — ${course.modules.length} modules, ${lessonCount} lessons. Published.\n`
  );
}

main()
  .catch((e) => {
    console.error("Import failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
