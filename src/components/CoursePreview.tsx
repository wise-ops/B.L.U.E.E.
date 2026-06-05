"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import LessonBlocks from "@/components/LessonBlocks";

// A read-only "preview as learner" player. Same beautiful lesson rendering
// as the real learner view (flashcards, quizzes, scenarios), but no progress
// saving — it's just for admins to experience the course.
export default function CoursePreview({ course }: { course: any }) {
  const router = useRouter();
  const lessons: any[] = course.modules.flatMap((m: any) =>
    m.lessons.map((l: any) => ({ ...l, moduleTitle: m.title }))
  );
  const [index, setIndex] = useState(0);
  const lesson = lessons[index];

  if (!lesson) {
    return (
      <div className="max-w-3xl mx-auto">
        <button onClick={() => router.back()} className="text-sm text-gray-500 hover:text-bluee-navy mb-4">← Back</button>
        <div className="bg-white rounded-xl p-8 text-center text-gray-500">This course has no lessons yet.</div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-4">
        <button onClick={() => router.back()} className="text-sm text-gray-500 hover:text-bluee-navy">← Back</button>
        <span className="text-xs bg-bluee-steel text-white px-3 py-1 rounded-full">Preview mode (as a learner sees it)</span>
      </div>

      <div className="mb-4">
        <div className="text-xs text-gray-400">{lesson.moduleTitle}</div>
        <h1 className="text-2xl font-bold text-bluee-navy">{lesson.title}</h1>
        <div className="text-sm text-gray-500 mt-1">Lesson {index + 1} of {lessons.length}</div>
      </div>

      <div className="h-1.5 bg-gray-200 rounded-full mb-6 overflow-hidden">
        <div className="h-full bg-bluee-steel transition-all" style={{ width: `${((index + 1) / lessons.length) * 100}%` }} />
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
          onClick={() => index < lessons.length - 1 ? setIndex(index + 1) : router.back()}
          className="text-sm px-5 py-2.5 rounded-lg bg-bluee-orange text-white font-medium hover:opacity-90"
        >
          {index < lessons.length - 1 ? "Next lesson →" : "Finish preview"}
        </button>
      </div>
    </div>
  );
}
