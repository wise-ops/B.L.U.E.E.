"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import LessonBlocks from "@/components/LessonBlocks";

export default function CoursePlayer({
  course,
  completedLessonIds,
}: {
  course: any;
  completedLessonIds: string[];
}) {
  const router = useRouter();
  // Flatten all lessons across modules into one ordered list.
  const lessons: any[] = course.modules.flatMap((m: any) =>
    m.lessons.map((l: any) => ({ ...l, moduleTitle: m.title }))
  );

  const [index, setIndex] = useState(0);
  const [completed, setCompleted] = useState<string[]>(completedLessonIds);
  const [saving, setSaving] = useState(false);

  const lesson = lessons[index];
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
    return <div>This course has no lessons yet.</div>;
  }

  return (
    <div className="max-w-3xl mx-auto">
      <button
        onClick={() => router.push("/learn")}
        className="text-sm text-gray-500 hover:text-bluee-navy mb-4"
      >
        ← Back to My Training
      </button>

      <div className="mb-4">
        <div className="text-xs text-gray-400">{lesson.moduleTitle}</div>
        <h1 className="text-2xl font-bold text-bluee-navy">{lesson.title}</h1>
        <div className="text-sm text-gray-500 mt-1">
          Lesson {index + 1} of {lessons.length}
        </div>
      </div>

      {/* progress bar */}
      <div className="h-1.5 bg-gray-200 rounded-full mb-6 overflow-hidden">
        <div
          className="h-full bg-bluee-steel transition-all"
          style={{ width: `${((index + 1) / lessons.length) * 100}%` }}
        />
      </div>

      <div className="bg-white rounded-xl p-6 shadow-sm">
        <LessonBlocks blocks={lesson.blocks || []} />
      </div>

      <div className="flex items-center justify-between mt-6">
        <button
          onClick={() => setIndex(Math.max(0, index - 1))}
          disabled={index === 0}
          className="text-sm px-4 py-2 rounded-lg bg-gray-100 text-gray-700 disabled:opacity-40"
        >
          Previous
        </button>
        <button
          onClick={markComplete}
          disabled={saving}
          className="text-sm px-5 py-2.5 rounded-lg bg-bluee-orange text-white font-medium hover:opacity-90 disabled:opacity-50"
        >
          {saving
            ? "Saving…"
            : index < lessons.length - 1
            ? isDone ? "Next lesson →" : "Complete & continue →"
            : isDone ? "Finish" : "Complete course ✓"}
        </button>
      </div>
    </div>
  );
}
