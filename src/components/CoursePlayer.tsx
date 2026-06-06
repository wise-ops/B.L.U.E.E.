"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import LessonBlocks from "@/components/LessonBlocks";
import LessonShell from "@/components/LessonShell";
import { paletteForIndex } from "@/lib/lessonPalettes";

export default function CoursePlayer({
  course,
  completedLessonIds,
}: {
  course: any;
  completedLessonIds: string[];
}) {
  const router = useRouter();
  const lessons: any[] = course.modules.flatMap((m: any) =>
    m.lessons.map((l: any) => ({ ...l, moduleTitle: m.title }))
  );

  const [index, setIndex] = useState(0);
  const [completed, setCompleted] = useState<string[]>(completedLessonIds);
  const [saving, setSaving] = useState(false);

  const lesson = lessons[index];
  const palette = paletteForIndex(index);
  const isDone = lesson && completed.includes(lesson.id);

  async function markComplete() {
    if (!lesson) return;
    setSaving(true);
    await fetch("/api/progress", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ lessonId: lesson.id, courseId: course.id }),
    });
    setSaving(false);
    setCompleted((c) => [...c, lesson.id]);
    if (index < lessons.length - 1) setIndex(index + 1);
    else router.push("/learn");
  }

  if (!lesson) {
    return (
      <div style={{ maxWidth: "720px", margin: "0 auto" }}>
        <button onClick={() => router.push("/learn")} style={{ background: "none", border: "none", color: "#888", cursor: "pointer" }}>← Back to My Training</button>
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
      onBack={() => router.push("/learn")}
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
          onClick={markComplete}
          disabled={saving}
          style={{ fontSize: "14px", padding: "11px 22px", borderRadius: "10px", background: "linear-gradient(135deg,#e86100,#ff8a3d)", color: "#fff", border: "none", fontWeight: 600, cursor: "pointer", boxShadow: "0 8px 20px -8px rgba(232,97,0,0.6)", opacity: saving ? 0.6 : 1 }}
        >
          {saving ? "Saving…" : index < lessons.length - 1 ? (isDone ? "Next lesson →" : "Complete & continue →") : isDone ? "Finish" : "Complete course ✓"}
        </button>
      </div>
    </LessonShell>
  );
}
