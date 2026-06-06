"use client";
import { useState } from "react";
import { getTrackTheme } from "@/lib/trackTheme";
import { Palette, PALETTES } from "@/lib/lessonPalettes";

// Redesigned, engaging lesson block renderer.
// Accepts a `category` for track accent and a `palette` so text/cards adapt
// to the lesson's background (including dark palettes).
export default function LessonBlocks({
  blocks,
  category,
  palette,
}: {
  blocks: any[];
  category?: string;
  palette?: Palette;
}) {
  const theme = getTrackTheme(category);
  const pal = palette || PALETTES[0];
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "28px" }}>
      {blocks.map((block, i) => (
        <Block key={i} block={block} theme={theme} pal={pal} />
      ))}
    </div>
  );
}

function Block({ block, theme, pal }: { block: any; theme: any; pal: Palette }) {
  switch (block.type) {
    case "text":
      return <TextBlock content={block.content} pal={pal} />;
    case "callout":
      return <Callout variant={block.variant} content={block.content} pal={pal} />;
    case "image":
      return <ImageBlock block={block} />;
    case "video":
      return <VideoBlock block={block} />;
    case "quiz":
      return <Quiz block={block} theme={theme} pal={pal} />;
    case "scenario":
      return <Quiz block={block} theme={theme} pal={pal} scenario />;
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

function TextBlock({ content, pal }: { content: string; pal: Palette }) {
  const paras = (content || "").split("\n").filter((p) => p.trim());
  return (
    <div>
      {paras.map((p, i) => (
        <p
          key={i}
          style={
            i === 0
              ? { fontFamily: "'Fraunces', serif", fontSize: "20px", lineHeight: 1.5, color: pal.leadText, fontWeight: 400, margin: "0 0 16px", letterSpacing: "-0.01em" }
              : { fontSize: "16px", lineHeight: 1.78, color: pal.bodyText, margin: "0 0 14px" }
          }
        >
          {p}
        </p>
      ))}
    </div>
  );
}

function Callout({ variant, content, pal }: { variant: string; content: string; pal: Palette }) {
  const styles: Record<string, any> = {
    tip: { bar: "#2f9e75", text: pal.dark ? "#7fd4b3" : "#1f6e52", label: "Tip" },
    warning: { bar: "#e86100", text: pal.dark ? "#f0a060" : "#993c1d", label: "Important" },
    info: { bar: "#4682b4", text: pal.dark ? "#7fb3d0" : "#2f5d82", label: "Note" },
    success: { bar: "#556b2f", text: pal.dark ? "#a3bd84" : "#3d4f22", label: "Key point" },
  };
  const s = styles[variant] || styles.info;
  return (
    <div
      style={{
        position: "relative",
        background: pal.cardBg,
        borderRadius: "16px",
        padding: "18px 20px 18px 24px",
        overflow: "hidden",
        boxShadow: `0 6px 24px -10px ${s.bar}66`,
        border: `1px solid ${s.bar}22`,
      }}
    >
      <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: "5px", background: s.bar }} />
      <div style={{ fontSize: "12px", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: s.text, marginBottom: "6px" }}>
        {s.label}
      </div>
      <div style={{ fontSize: "15px", lineHeight: 1.65, color: pal.cardText, whiteSpace: "pre-wrap" }}>
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
              borderRadius: "18px",
              background: `linear-gradient(140deg, ${theme.accent}, ${theme.accentDark})`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "26px",
              textAlign: "center",
              boxShadow: `0 18px 40px -12px ${theme.accent}99`,
            }}
          >
            <div>
              <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.7)", textTransform: "uppercase", letterSpacing: "0.14em", marginBottom: "12px", fontWeight: 600 }}>
                Question
              </div>
              <div style={{ fontFamily: "'Fraunces', serif", fontSize: "21px", fontWeight: 500, color: "#fff", lineHeight: 1.35 }}>
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
              borderRadius: "18px",
              background: "linear-gradient(140deg, #6f8a3d, #42531f)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "26px",
              textAlign: "center",
              boxShadow: "0 18px 40px -12px rgba(85,107,47,0.6)",
            }}
          >
            <div style={{ fontSize: "16px", color: "#fff", lineHeight: 1.55 }}>{block.back}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Quiz({ block, theme, pal, scenario = false }: { block: any; theme: any; pal: Palette; scenario?: boolean }) {
  const [picked, setPicked] = useState<number | null>(null);
  const question = scenario ? block.prompt : block.question;
  const options = block.options || [];
  const answered = picked !== null;

  return (
    <div>
      <Label icon={scenario ? "bulb" : "check"} text={scenario ? "Scenario" : "Knowledge check"} theme={theme} />
      <div
        style={{
          background: pal.cardBg,
          borderRadius: "16px",
          padding: "22px",
          border: pal.dark ? "1px solid rgba(255,255,255,0.08)" : "1px solid rgba(26,31,46,0.07)",
          boxShadow: "0 4px 20px -12px rgba(26,31,46,0.2)",
        }}
      >
        <p style={{ fontFamily: "'Fraunces', serif", fontSize: "18px", fontWeight: 500, color: pal.dark ? "#fff" : "#1a1f2e", margin: "0 0 16px", lineHeight: 1.4 }}>
          {question}
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {options.map((opt: any, i: number) => {
            const isPicked = picked === i;
            let bg = pal.dark ? "#1a2433" : "#faf8f4",
              border = pal.dark ? "rgba(255,255,255,0.12)" : "#e8e3da",
              color = pal.dark ? "#cdd6e0" : "#3a3a36",
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
