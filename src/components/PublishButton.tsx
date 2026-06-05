"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function PublishButton({
  courseId,
  status,
}: {
  courseId: string;
  status: string;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function toggle() {
    setLoading(true);
    await fetch(`/api/courses/${courseId}/publish`, { method: "POST" });
    setLoading(false);
    router.refresh();
  }

  return (
    <button
      onClick={toggle}
      disabled={loading}
      className={`text-sm rounded-lg px-4 py-2 font-medium transition disabled:opacity-50 ${
        status === "PUBLISHED"
          ? "bg-gray-100 text-gray-700 hover:bg-gray-200"
          : "bg-bluee-steel text-white hover:opacity-90"
      }`}
    >
      {loading
        ? "..."
        : status === "PUBLISHED"
        ? "Unpublish"
        : "Publish"}
    </button>
  );
}
