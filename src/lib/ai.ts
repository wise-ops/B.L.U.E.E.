// Wrapper around the Anthropic Claude API used by the AI Course Builder.
// This is what turns a topic + your notes into a full structured course.
import Anthropic from "@anthropic-ai/sdk";

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

// The model used for generation. Sonnet is a good balance of quality and cost.
const MODEL = "claude-sonnet-4-20250514";

export interface GeneratedCourse {
  title: string;
  description: string;
  category: string;
  modules: {
    title: string;
    lessons: {
      title: string;
      blocks: any[];
    }[];
  }[];
}

// Generates a complete course as structured JSON.
// All content is original — the prompt forbids reproducing copyrighted text.
export async function generateCourse(
  topic: string,
  jobRole: string,
  sourceNotes: string
): Promise<GeneratedCourse> {
  const system = `You are an expert veterinary educator creating training for veterinary clinic staff.
You write clear, accurate, original educational content. You NEVER reproduce copyrighted text
from textbooks or websites — everything you write is in your own words.

You return ONLY valid JSON, no markdown, no preamble. The JSON must match this exact shape:
{
  "title": string,
  "description": string,
  "category": string,
  "modules": [
    {
      "title": string,
      "lessons": [
        {
          "title": string,
          "blocks": [ <content blocks, see below> ]
        }
      ]
    }
  ]
}

Each lesson's "blocks" array can contain these block types:
- { "type": "text", "content": "markdown text" }
- { "type": "callout", "variant": "tip|warning|info|success", "content": "text" }
- { "type": "quiz", "question": "string", "options": [ { "text": "string", "isCorrect": bool, "feedback": "string" } ] }
- { "type": "flashcard", "front": "string", "back": "string" }
- { "type": "scenario", "prompt": "string", "options": [ { "text": "string", "isCorrect": bool, "feedback": "string" } ] }

Make lessons genuinely useful for the "${jobRole}" role. Include a mix of teaching text,
at least one quiz or scenario per lesson, and flashcards where helpful. Keep it practical
and tied to real veterinary clinic workflow.`;

  const user = `Create a complete training course on this topic: "${topic}"
Target job role: ${jobRole}

Use these reference notes the clinic provided (rewrite everything in your own words, do not copy):
---
${sourceNotes || "(no extra notes provided — use standard veterinary best practices)"}
---

Return the full course as JSON now.`;

  const resp = await anthropic.messages.create({
    model: MODEL,
    max_tokens: 8000,
    system,
    messages: [{ role: "user", content: user }],
  });

  const text = resp.content
    .filter((b) => b.type === "text")
    .map((b: any) => b.text)
    .join("");

  // Strip any accidental markdown fences before parsing.
  const clean = text.replace(/```json/gi, "").replace(/```/g, "").trim();
  return JSON.parse(clean) as GeneratedCourse;
}
