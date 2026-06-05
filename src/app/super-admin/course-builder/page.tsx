"use client";
import { useState } from "react";

export default function CourseBuilder() {
  const [topic, setTopic] = useState("");
  const [jobRole, setJobRole] = useState("Veterinary Technician");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState("");

  async function generate() {
    setError("");
    setResult(null);
    setLoading(true);
    try {
      const res = await fetch("/api/ai/build-course", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic, jobRole, notes }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Generation failed");
      setResult(data);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-3xl">
      <h1 className="text-2xl font-bold text-bluee-navy mb-1">AI Course Builder</h1>
      <p className="text-gray-500 mb-6">
        Describe a topic and BLUEE will generate a complete course — modules,
        lessons, quizzes, flashcards, and scenarios. Saved as a draft for review.
      </p>

      <div className="bg-white rounded-xl p-6 shadow-sm space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Course topic
          </label>
          <input
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="e.g. Veterinary Parasitology Basics"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-bluee-steel"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Target job role
          </label>
          <select
            value={jobRole}
            onChange={(e) => setJobRole(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-bluee-steel"
          >
            <option>Client Service Representative</option>
            <option>Veterinary Assistant</option>
            <option>Veterinary Technician</option>
            <option>DVM</option>
            <option>Practice Manager</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Your notes / SOPs / source material (optional)
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={6}
            placeholder="Paste any protocols, SOPs, or notes you want the course based on. BLUEE rewrites everything in its own words."
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-bluee-steel"
          />
        </div>
        <button
          onClick={generate}
          disabled={loading || !topic}
          className="bg-bluee-orange text-white rounded-lg px-5 py-2.5 font-medium hover:opacity-90 disabled:opacity-50"
        >
          {loading ? "Generating course… (this can take a minute)" : "Generate Course"}
        </button>
        {error && <p className="text-sm text-red-600">{error}</p>}
      </div>

      {result && (
        <div className="mt-6 bg-white rounded-xl p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <span className="bg-green-100 text-green-700 text-xs px-2 py-0.5 rounded-full">
              Saved as draft
            </span>
          </div>
          <h2 className="text-xl font-bold text-bluee-navy">{result.title}</h2>
          <p className="text-gray-600 text-sm mt-1 mb-4">{result.description}</p>
          <div className="space-y-3">
            {result.modules?.map((m: any, i: number) => (
              <div key={i} className="border border-gray-200 rounded-lg p-3">
                <div className="font-medium text-bluee-navy">{m.title}</div>
                <ul className="mt-1 text-sm text-gray-600 list-disc list-inside">
                  {m.lessons?.map((l: any, j: number) => (
                    <li key={j}>{l.title}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <a
            href="/super-admin/courses"
            className="inline-block mt-4 text-sm text-bluee-steel hover:underline"
          >
            View it in the Course Library →
          </a>
        </div>
      )}
    </div>
  );
}
