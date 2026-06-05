"use client";
import { useState } from "react";
import { getTrackTheme } from "@/lib/trackTheme";

// Redesigned, engaging lesson block renderer.
// Accepts an optional `category` so each track gets its own accent identity.
export default function LessonBlocks({
  blocks,
  category,
}: {
  blocks: any[];
  category?: string;
}) {
  const theme = getTrackTheme(category);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "28px" }}>
      {blocks.map((block, i) => (
        <Block key={i} block={block} theme={theme} />
      ))}
    </div>
  );
}

function Block({ block, theme }: { block: any; theme: any }) {
  switch (block.type) {
    case "text":
      return <TextBlock content={block.content} />;
    case "callout":
      return <Callout variant={block.variant} content={block.content} />;
    case "image":
      return <ImageBlock block={block} />;
    case "video":
      return <VideoBlock block={block} />;
    case "quiz":
      return <Quiz block={block} theme={theme} />;
    case "scenario":
      return <Quiz block={block} theme={theme} scenario />;
    case "flashcard":
      return <Flashcard block={block} theme={theme} />;
    case "hotspot":
      return <Hotspot block={block} theme={theme} />;
    case "matching":
      return <Matching block={block} theme={theme} />;
    default:
      return null;
  }
}

function TextBlock({ content }: { content: string }) {
  // First paragraph gets a larger lead style; rest is body.
  const paras = (content || "").split("\n").filter((p) => p.trim());
  return (
    <div>
      {paras.map((p, i) => (
        <p
          key={i}
          style={{
            fontSize: i === 0 ? "17px" : "16px",
            lineHeight: 1.75,
            color: "#3a3a36",
            margin: "0 0 14px",
          }}
        >
          {p}
        </p>
      ))}
    </div>
  );
}

function Callout({ variant, content }: { variant: string; content: string }) {
  const styles: Record<string, any> = {
    tip: { bar: "#2f9e75", soft: "#e3f5ee", text: "#1f6e52", icon: "💡", label: "Tip" },
    warning: { bar: "#e86100", soft: "#fdeee2", text: "#993c1d", icon: "⚠", label: "Important" },
    info: { bar: "#4682b4", soft: "#e8f1f8", text: "#2f5d82", icon: "ℹ", label: "Note" },
    success: { bar: "#556b2f", soft: "#eef2e4", text: "#3d4f22", icon: "✓", label: "Key point" },
  };
  const s = styles[variant] || styles.info;
  return (
    <div
      style={{
        position: "relative",
        background: s.soft,
        borderRadius: "14px",
        padding: "16px 18px 16px 22px",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          bottom: 0,
          width: "5px",
          background: s.bar,
        }}
      />
      <div
        style={{
          fontSize: "12px",
          fontWeight: 700,
          letterSpacing: "0.07em",
          textTransform: "uppercase",
          color: s.text,
          marginBottom: "5px",
        }}
      >
        {s.label}
      </div>
      <div style={{ fontSize: "15px", lineHeight: 1.6, color: "#3a3a36", whiteSpace: "pre-wrap" }}>
        {content}
      </div>
    </div>
  );
}

function ImageBlock({ block }: { block: any }) {
  if (!block.url) return null;
  return (
    <figure style={{ margin: 0 }}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={block.url}
        alt={block.alt || ""}
        style={{ width: "100%", borderRadius: "14px", display: "block" }}
      />
      {block.credit && (
        <figcaption style={{ fontSize: "12px", color: "#999", marginTop: "6px", textAlign: "right" }}>
          {block.credit}
        </figcaption>
      )}
    </figure>
  );
}

function VideoBlock({ block }: { block: any }) {
  if (!block.url) return null;
  // Support YouTube embeds and direct video files.
  const yt = block.url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w-]+)/);
  if (yt) {
    return (
      <div style={{ position: "relative", paddingBottom: "56.25%", height: 0, borderRadius: "14px", overflow: "hidden" }}>
        <iframe
          src={`https://www.youtube.com/embed/${yt[1]}`}
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", border: 0 }}
          allowFullScreen
          title="Lesson video"
        />
      </div>
    );
  }
  return <video src={block.url} controls style={{ width: "100%", borderRadius: "14px" }} />;
}

function Flashcard({ block, theme }: { block: any; theme: any }) {
  const [flipped, setFlipped] = useState(false);
  return (
    <div>
      <Label icon="card" text="Flashcard — tap to flip" theme={theme} />
      <div style={{ perspective: "1400px", cursor: "pointer" }} onClick={() => setFlipped(!flipped)}>
        <div
          style={{
            position: "relative",
            width: "100%",
            minHeight: "150px",
            transition: "transform 0.7s cubic-bezier(0.4,0.2,0.2,1)",
            transformStyle: "preserve-3d",
            transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)",
          }}
        >
          <div
            style={{
              position: "absolute",
              inset: 0,
              backfaceVisibility: "hidden",
              borderRadius: "16px",
              background: `linear-gradient(140deg, ${theme.accent}, ${theme.accentDark})`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "24px",
              textAlign: "center",
              boxShadow: `0 12px 30px -10px ${theme.accent}80`,
            }}
          >
            <div>
              <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.65)", textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: "10px" }}>
                Question
              </div>
              <div style={{ fontSize: "19px", fontWeight: 600, color: "#fff", lineHeight: 1.4 }}>
                {block.front}
              </div>
            </div>
          </div>
          <div
            style={{
              position: "absolute",
              inset: 0,
              backfaceVisibility: "hidden",
              transform: "rotateY(180deg)",
              borderRadius: "16px",
              background: "linear-gradient(140deg, #556b2f, #42531f)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "24px",
              textAlign: "center",
              boxShadow: "0 12px 30px -10px rgba(85,107,47,0.5)",
            }}
          >
            <div style={{ fontSize: "16px", color: "#fff", lineHeight: 1.55 }}>{block.back}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Quiz({ block, theme, scenario = false }: { block: any; theme: any; scenario?: boolean }) {
  const [picked, setPicked] = useState<number | null>(null);
  const question = scenario ? block.prompt : block.question;
  const options = block.options || [];
  const answered = picked !== null;

  return (
    <div>
      <Label icon={scenario ? "bulb" : "check"} text={scenario ? "Scenario" : "Knowledge check"} theme={theme} />
      <div
        style={{
          background: "#fff",
          borderRadius: "16px",
          padding: "22px",
          border: "1px solid rgba(26,31,46,0.07)",
          boxShadow: "0 4px 20px -12px rgba(26,31,46,0.2)",
        }}
      >
        <p style={{ fontSize: "17px", fontWeight: 600, color: "#1a1f2e", margin: "0 0 16px", lineHeight: 1.4 }}>
          {question}
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {options.map((opt: any, i: number) => {
            const isPicked = picked === i;
            let bg = "#faf8f4",
              border = "#e8e3da",
              color = "#3a3a36",
              opacity = 1;
            if (answered) {
              if (opt.isCorrect) {
                bg = "linear-gradient(135deg,#556b2f,#42531f)";
                border = "#556b2f";
                color = "#fff";
              } else if (isPicked) {
                bg = "linear-gradient(135deg,#b5402f,#933324)";
                border = "#933324";
                color = "#fff";
              } else {
                opacity = 0.45;
              }
            }
            return (
              <button
                key={i}
                onClick={() => !answered && setPicked(i)}
                style={{
                  textAlign: "left",
                  padding: "14px 16px",
                  borderRadius: "12px",
                  border: `1.5px solid ${border}`,
                  background: bg,
                  fontSize: "14.5px",
                  cursor: answered ? "default" : "pointer",
                  width: "100%",
                  color,
                  fontWeight: 500,
                  opacity,
                  transition: "all 0.25s",
                }}
              >
                {opt.text}
                {isPicked && opt.feedback && (
                  <div style={{ fontSize: "13px", marginTop: "6px", opacity: 0.95, fontWeight: 400 }}>
                    {opt.feedback}
                  </div>
                )}
                {answered && opt.isCorrect && !isPicked && opt.feedback && (
                  <div style={{ fontSize: "13px", marginTop: "6px", opacity: 0.95, fontWeight: 400 }}>
                    {opt.feedback}
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function Hotspot({ block, theme }: { block: any; theme: any }) {
  const [active, setActive] = useState<number | null>(null);
  const spots = block.spots || [];
  return (
    <div>
      <Label icon="click" text="Interactive — tap the spots" theme={theme} />
      <div style={{ background: "#fff", borderRadius: "16px", padding: "18px", border: "1px solid rgba(26,31,46,0.07)" }}>
        <div style={{ position: "relative", width: "100%" }}>
          {block.image && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={block.image} alt="" style={{ width: "100%", borderRadius: "12px", display: "block" }} />
          )}
          {spots.map((s: any, i: number) => (
            <button
              key={i}
              onClick={() => setActive(active === i ? null : i)}
              style={{
                position: "absolute",
                left: `${s.x}%`,
                top: `${s.y}%`,
                transform: "translate(-50%,-50%)",
                width: "30px",
                height: "30px",
                borderRadius: "50%",
                border: "3px solid #fff",
                background: active === i ? theme.accentDark : theme.accent,
                color: "#fff",
                fontWeight: 700,
                fontSize: "14px",
                cursor: "pointer",
                boxShadow: "0 2px 8px rgba(0,0,0,0.3)",
              }}
            >
              {i + 1}
            </button>
          ))}
        </div>
        <div
          style={{
            marginTop: "14px",
            padding: "12px 16px",
            borderRadius: "12px",
            background: theme.accentSoft,
            fontSize: "14px",
            lineHeight: 1.6,
            color: "#3a3a36",
            minHeight: "20px",
          }}
        >
          {active !== null ? (
            <>
              <strong style={{ color: theme.accentDark }}>{spots[active].label}</strong>
              {spots[active].description ? ` — ${spots[active].description}` : ""}
            </>
          ) : (
            "Tap a numbered spot to learn more."
          )}
        </div>
      </div>
    </div>
  );
}

function Matching({ block, theme }: { block: any; theme: any }) {
  const pairs = block.pairs || [];
  const [matched, setMatched] = useState<string[]>([]);
  const [dragId, setDragId] = useState<string | null>(null);
  const [shuffled] = useState(() => [...pairs].sort(() => Math.random() - 0.5));
  const allDone = matched.length === pairs.length && pairs.length > 0;

  return (
    <div>
      <Label icon="drag" text="Drag &amp; drop — match them up" theme={theme} />
      <div style={{ background: "#fff", borderRadius: "16px", padding: "20px", border: "1px solid rgba(26,31,46,0.07)" }}>
        <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
          <div style={{ flex: "1 1 120px" }}>
            <p style={{ fontSize: "12px", color: "#888", margin: "0 0 8px" }}>Drag these:</p>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {shuffled.map((p: any) =>
                matched.includes(p.id) ? null : (
                  <div
                    key={p.id}
                    draggable
                    onDragStart={() => setDragId(p.id)}
                    style={{
                      padding: "10px 12px",
                      borderRadius: "10px",
                      background: theme.accentSoft,
                      border: `1px solid ${theme.accent}`,
                      color: theme.accentDark,
                      fontSize: "14px",
                      fontWeight: 600,
                      cursor: "grab",
                      textAlign: "center",
                    }}
                  >
                    {p.term}
                  </div>
                )
              )}
            </div>
          </div>
          <div style={{ flex: "1.4 1 170px" }}>
            <p style={{ fontSize: "12px", color: "#888", margin: "0 0 8px" }}>Onto the right meaning:</p>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {pairs.map((p: any) => {
                const done = matched.includes(p.id);
                return (
                  <div
                    key={p.id}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={() => {
                      if (dragId === p.id) setMatched((m) => [...m, p.id]);
                      setDragId(null);
                    }}
                    style={{
                      padding: "10px 12px",
                      borderRadius: "10px",
                      background: done ? "#eef2e4" : "#faf8f4",
                      border: done ? "1px solid #556b2f" : "1px dashed #ccc",
                      fontSize: "14px",
                      minHeight: "20px",
                      color: done ? "#3d4f22" : "#666",
                    }}
                  >
                    {done ? (
                      <span style={{ fontWeight: 600 }}>{p.term} — {p.meaning}</span>
                    ) : (
                      p.meaning
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
        {allDone && (
          <div style={{ marginTop: "14px", fontSize: "14px", fontWeight: 600, color: "#556b2f" }}>
            All matched — nicely done!
          </div>
        )}
      </div>
    </div>
  );
}

function Label({ icon, text, theme }: { icon: string; text: string; theme: any }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "7px", marginBottom: "11px" }}>
      <span style={{ color: theme.accent, fontSize: "15px" }}>●</span>
      <span style={{ fontSize: "12px", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "#999" }}>
        {text}
      </span>
    </div>
  );
}
