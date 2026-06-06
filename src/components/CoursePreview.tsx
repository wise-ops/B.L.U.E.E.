"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import LessonBlocks from "@/components/LessonBlocks";
import LessonShell from "@/components/LessonShell";
import { paletteForIndex } from "@/lib/lessonPalettes";

// Read-only "preview as learner" — uses the designed LessonShell.
export default function CoursePreview({ course }: { course: any }) {
  const router = useRouter();
  const lessons: any[] = course.modules.flatMap((m: any) =>
    m.lessons.map((l: any) => ({ ...l, moduleTitle: m.title }))
  );
  const [index, setIndex] = useState(0);
  const lesson = lessons[index];
  const palette = paletteForIndex(index);

  if (!lesson) {
    return (
      <div style={{ maxWidth: "720px", margin: "0 auto" }}>
        <button onClick={() => router.back()} style={{ background: "none", border: "none", color: "#888", cursor: "pointer" }}>← Back</button>
        <div style={{ background: "#fff", borderRadius: "16px", padding: "40px", textAlign: "center", color: "#888", marginTop: "16px" }}>
          This course has no lessons yet.
        </div>
      </div>
    );
  }

  return (
    <LessonShell
      category={course.category}
      palette={palette}
      moduleTitle={lesson.moduleTitle}
      lessonTitle={lesson.title}
      index={index}
      total={lessons.length}
      onBack={() => router.back()}
      topRight={
        <span style={{ fontSize: "12px", background: "#4682b4", color: "#fff", padding: "5px 12px", borderRadius: "20px" }}>
          Preview mode (as a learner sees it)
        </span>
      }
    >
      <LessonBlocks blocks={lesson.blocks || []} category={course.category} palette={palette} />
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "28px" }}>
        <button
          onClick={() => setIndex(Math.max(0, index - 1))}
          disabled={index === 0}
          style={{ fontSize: "14px", padding: "10px 18px", borderRadius: "10px", background: "#ece8e0", color: "#555", border: "none", cursor: index === 0 ? "default" : "pointer", opacity: index === 0 ? 0.4 : 1 }}
        >
          Previous
        </button>
        <button
          onClick={() => (index < lessons.length - 1 ? setIndex(index + 1) : router.back())}
          style={{ fontSize: "14px", padding: "11px 22px", borderRadius: "10px", background: "linear-gradient(135deg,#e86100,#ff8a3d)", color: "#fff", border: "none", fontWeight: 600, cursor: "pointer", boxShadow: "0 8px 20px -8px rgba(232,97,0,0.6)" }}
        >
          {index < lessons.length - 1 ? "Next lesson →" : "Finish preview"}
        </button>
      </div>
    </LessonShell>
  );
}
