"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

// Admin course viewer + editor.
// Shows the whole course. Lets you edit course title/description, edit each
// lesson's blocks (text, callouts, quizzes, flashcards, scenarios), and save.
export default function CourseEditor({ course }: { course: any }) {
  const router = useRouter();
  const [data, setData] = useState(course);
  const [saving, setSaving] = useState(false);
  const [savedMsg, setSavedMsg] = useState("");
  const [openLesson, setOpenLesson] = useState<string | null>(null);

  function updateCourseField(field: string, value: string) {
    setData({ ...data, [field]: value });
  }

  function updateBlock(lessonId: string, blockIdx: number, newBlock: any) {
    setData({
      ...data,
      modules: data.modules.map((m: any) => ({
        ...m,
        lessons: m.lessons.map((l: any) =>
          l.id === lessonId
            ? { ...l, blocks: l.blocks.map((b: any, i: number) => (i === blockIdx ? newBlock : b)) }
            : l
        ),
      })),
    });
  }

  function deleteBlock(lessonId: string, blockIdx: number) {
    setData({
      ...data,
      modules: data.modules.map((m: any) => ({
        ...m,
        lessons: m.lessons.map((l: any) =>
          l.id === lessonId
            ? { ...l, blocks: l.blocks.filter((_: any, i: number) => i !== blockIdx) }
            : l
        ),
      })),
    });
  }

  async function save() {
    setSaving(true);
    setSavedMsg("");
    const res = await fetch(`/api/courses/${data.id}/update`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: data.title,
        description: data.description,
        category: data.category,
        modules: data.modules,
      }),
    });
    setSaving(false);
    if (res.ok) {
      setSavedMsg("Saved!");
      setTimeout(() => setSavedMsg(""), 2500);
      router.refresh();
    } else {
      setSavedMsg("Save failed — try again.");
    }
  }

  async function deleteCourse() {
    if (!confirm("Delete this entire course? This cannot be undone.")) return;
    await fetch(`/api/courses/${data.id}/delete`, { method: "POST" });
    router.push("/super-admin/courses");
  }

  return (
    <div className="max-w-4xl">
      <Link href="/super-admin/courses" className="text-sm text-gray-500 hover:text-bluee-navy">
        ← Back to Course Library
      </Link>

      {/* Course header — editable */}
      <div className="bg-white rounded-xl p-6 shadow-sm mt-4">
        <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Course Title</label>
        <input
          value={data.title}
          onChange={(e) => updateCourseField("title", e.target.value)}
          className="w-full text-xl font-bold text-bluee-navy border border-gray-200 rounded-lg px-3 py-2 mb-3"
        />
        <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Description</label>
        <textarea
          value={data.description}
          onChange={(e) => updateCourseField("description", e.target.value)}
          rows={2}
          className="w-full text-sm text-gray-700 border border-gray-200 rounded-lg px-3 py-2 mb-3"
        />
        <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Category (Role)</label>
        <input
          value={data.category}
          onChange={(e) => updateCourseField("category", e.target.value)}
          className="w-full text-sm text-gray-700 border border-gray-200 rounded-lg px-3 py-2"
        />
      </div>

      {/* Modules and lessons */}
      <div className="mt-6 space-y-4">
        {data.modules.map((m: any) => (
          <div key={m.id} className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="bg-bluee-navy text-white px-5 py-3 font-semibold">{m.title}</div>
            <div className="divide-y divide-gray-100">
              {m.lessons.map((l: any) => (
                <div key={l.id}>
                  <button
                    onClick={() => setOpenLesson(openLesson === l.id ? null : l.id)}
                    className="w-full text-left px-5 py-3 flex items-center justify-between hover:bg-gray-50"
                  >
                    <span className="font-medium text-bluee-navy">{l.title}</span>
                    <span className="text-xs text-gray-400">
                      {l.blocks.length} blocks · {openLesson === l.id ? "hide" : "view / edit"}
                    </span>
                  </button>
                  {openLesson === l.id && (
                    <div className="px-5 pb-5 space-y-4 bg-gray-50">
                      {l.blocks.map((b: any, i: number) => (
                        <BlockEditor
                          key={i}
                          block={b}
                          onChange={(nb: any) => updateBlock(l.id, i, nb)}
                          onDelete={() => deleteBlock(l.id, i)}
                        />
                      ))}
                      {l.blocks.length === 0 && (
                        <p className="text-sm text-gray-400 py-2">No content blocks in this lesson.</p>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Save / delete bar */}
      <div className="sticky bottom-4 mt-6 bg-white rounded-xl shadow-lg p-4 flex items-center justify-between border border-gray-200">
        <button
          onClick={deleteCourse}
          className="text-sm text-red-600 hover:text-red-700 font-medium"
        >
          Delete course
        </button>
        <div className="flex items-center gap-3">
          {savedMsg && <span className="text-sm text-green-600">{savedMsg}</span>}
          <button
            onClick={save}
            disabled={saving}
            className="bg-bluee-orange text-white rounded-lg px-6 py-2.5 font-medium hover:opacity-90 disabled:opacity-50"
          >
            {saving ? "Saving…" : "Save changes"}
          </button>
        </div>
      </div>
    </div>
  );
}

// Editor for a single content block. Adapts fields to the block type.
function BlockEditor({ block, onChange, onDelete }: any) {
  const type = block.type;

  const Label = ({ children }: any) => (
    <div className="flex items-center justify-between mb-1">
      <span className="text-xs font-semibold text-bluee-steel uppercase">{children}</span>
      <button onClick={onDelete} className="text-xs text-red-500 hover:text-red-600">remove</button>
    </div>
  );

  if (type === "text") {
    return (
      <div className="bg-white rounded-lg p-3 border border-gray-200">
        <Label>Text</Label>
        <textarea
          value={block.content}
          onChange={(e) => onChange({ ...block, content: e.target.value })}
          rows={4}
          className="w-full text-sm border border-gray-200 rounded px-2 py-1"
        />
      </div>
    );
  }

  if (type === "callout") {
    return (
      <div className="bg-white rounded-lg p-3 border border-gray-200">
        <Label>Callout ({block.variant})</Label>
        <select
          value={block.variant}
          onChange={(e) => onChange({ ...block, variant: e.target.value })}
          className="text-sm border border-gray-200 rounded px-2 py-1 mb-2"
        >
          <option value="tip">tip</option>
          <option value="warning">warning</option>
          <option value="info">info</option>
          <option value="success">success</option>
        </select>
        <textarea
          value={block.content}
          onChange={(e) => onChange({ ...block, content: e.target.value })}
          rows={2}
          className="w-full text-sm border border-gray-200 rounded px-2 py-1"
        />
      </div>
    );
  }

  if (type === "flashcard") {
    return (
      <div className="bg-white rounded-lg p-3 border border-gray-200">
        <Label>Flashcard</Label>
        <input
          value={block.front}
          onChange={(e) => onChange({ ...block, front: e.target.value })}
          placeholder="Front"
          className="w-full text-sm border border-gray-200 rounded px-2 py-1 mb-1"
        />
        <input
          value={block.back}
          onChange={(e) => onChange({ ...block, back: e.target.value })}
          placeholder="Back"
          className="w-full text-sm border border-gray-200 rounded px-2 py-1"
        />
      </div>
    );
  }

  if (type === "quiz" || type === "scenario") {
    const qField = type === "quiz" ? "question" : "prompt";
    return (
      <div className="bg-white rounded-lg p-3 border border-gray-200">
        <Label>{type === "quiz" ? "Quiz" : "Scenario"}</Label>
        <textarea
          value={block[qField]}
          onChange={(e) => onChange({ ...block, [qField]: e.target.value })}
          rows={2}
          placeholder={type === "quiz" ? "Question" : "Scenario prompt"}
          className="w-full text-sm border border-gray-200 rounded px-2 py-1 mb-2"
        />
        <div className="space-y-2">
          {block.options.map((o: any, oi: number) => (
            <div key={oi} className="flex items-start gap-2">
              <input
                type="checkbox"
                checked={o.isCorrect}
                onChange={(e) => {
                  const opts = block.options.map((x: any, xi: number) =>
                    xi === oi ? { ...x, isCorrect: e.target.checked } : x
                  );
                  onChange({ ...block, options: opts });
                }}
                className="mt-1"
                title="Correct answer?"
              />
              <div className="flex-1">
                <input
                  value={o.text}
                  onChange={(e) => {
                    const opts = block.options.map((x: any, xi: number) =>
                      xi === oi ? { ...x, text: e.target.value } : x
                    );
                    onChange({ ...block, options: opts });
                  }}
                  placeholder="Answer choice"
                  className={`w-full text-sm border rounded px-2 py-1 ${o.isCorrect ? "border-green-400 bg-green-50" : "border-gray-200"}`}
                />
                <input
                  value={o.feedback}
                  onChange={(e) => {
                    const opts = block.options.map((x: any, xi: number) =>
                      xi === oi ? { ...x, feedback: e.target.value } : x
                    );
                    onChange({ ...block, options: opts });
                  }}
                  placeholder="Feedback for this choice"
                  className="w-full text-xs border border-gray-100 rounded px-2 py-1 mt-1 text-gray-500"
                />
              </div>
            </div>
          ))}
        </div>
        <p className="text-xs text-gray-400 mt-2">Check the box next to the correct answer(s).</p>
      </div>
    );
  }

  // Unknown / image / video — show read-only note
  return (
    <div className="bg-white rounded-lg p-3 border border-gray-200">
      <Label>{type}</Label>
      <p className="text-xs text-gray-500">This block type ({type}) is shown in the learner view.</p>
    </div>
  );
}
