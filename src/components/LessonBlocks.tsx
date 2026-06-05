"use client";
import { useState } from "react";

export default function LessonBlocks({ blocks }: { blocks: any[] }) {
  return (
    <div className="space-y-6">
      {blocks.map((block, i) => (
        <Block key={i} block={block} />
      ))}
    </div>
  );
}

function Block({ block }: { block: any }) {
  switch (block.type) {
    case "text":
      return (
        <div className="prose prose-sm max-w-none text-gray-700 whitespace-pre-wrap leading-relaxed">
          {block.content}
        </div>
      );
    case "callout":
      return <Callout variant={block.variant} content={block.content} />;
    case "image":
      // eslint-disable-next-line @next/next/no-img-element
      return block.url ? (
        <img src={block.url} alt={block.alt || ""} className="rounded-lg w-full" />
      ) : null;
    case "video":
      return block.url ? (
        <video src={block.url} controls className="rounded-lg w-full" />
      ) : null;
    case "quiz":
      return <Quiz block={block} />;
    case "scenario":
      return <Quiz block={block} scenario />;
    case "flashcard":
      return <Flashcard block={block} />;
    default:
      return null;
  }
}

function Callout({ variant, content }: { variant: string; content: string }) {
  const styles: Record<string, string> = {
    tip: "bg-green-50 border-green-300 text-green-900",
    warning: "bg-red-50 border-red-300 text-red-900",
    info: "bg-blue-50 border-blue-300 text-blue-900",
    success: "bg-emerald-50 border-emerald-300 text-emerald-900",
  };
  return (
    <div className={`border-l-4 rounded-r-lg p-4 ${styles[variant] || styles.info}`}>
      <div className="text-xs uppercase font-semibold tracking-wide mb-1 opacity-70">
        {variant}
      </div>
      <div className="text-sm whitespace-pre-wrap">{content}</div>
    </div>
  );
}

function Quiz({ block, scenario = false }: { block: any; scenario?: boolean }) {
  const [picked, setPicked] = useState<number | null>(null);
  const question = scenario ? block.prompt : block.question;
  const options = block.options || [];

  return (
    <div className="border border-gray-200 rounded-lg p-4">
      <div className="text-xs uppercase font-semibold tracking-wide mb-2 text-bluee-steel">
        {scenario ? "Scenario" : "Knowledge Check"}
      </div>
      <p className="font-medium text-bluee-navy mb-3">{question}</p>
      <div className="space-y-2">
        {options.map((opt: any, i: number) => {
          const isPicked = picked === i;
          const show = picked !== null;
          return (
            <button
              key={i}
              onClick={() => setPicked(i)}
              className={`w-full text-left px-3 py-2 rounded-lg border text-sm transition ${
                show && opt.isCorrect
                  ? "border-green-400 bg-green-50"
                  : isPicked
                  ? "border-red-400 bg-red-50"
                  : "border-gray-200 hover:border-bluee-steel"
              }`}
            >
              {opt.text}
              {isPicked && opt.feedback && (
                <div className="text-xs text-gray-600 mt-1">{opt.feedback}</div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function Flashcard({ block }: { block: any }) {
  const [flipped, setFlipped] = useState(false);
  return (
    <button
      onClick={() => setFlipped(!flipped)}
      className="w-full border border-gray-200 rounded-lg p-6 text-center hover:border-bluee-steel transition"
    >
      <div className="text-xs uppercase font-semibold tracking-wide mb-2 text-bluee-olive">
        Flashcard {flipped ? "(answer)" : "(tap to flip)"}
      </div>
      <div className="font-medium text-bluee-navy">
        {flipped ? block.back : block.front}
      </div>
    </button>
  );
}
