"use client";
import { getTrackTheme } from "@/lib/trackTheme";
import { Palette } from "@/lib/lessonPalettes";

// Designed lesson shell with a rotating palette. The track accent still tints
// the eyebrow + progress bar so courses stay distinct across the shared palettes.
export default function LessonShell({
  category,
  palette,
  moduleTitle,
  lessonTitle,
  index,
  total,
  children,
  topRight,
  onBack,
}: {
  category?: string;
  palette: Palette;
  moduleTitle: string;
  lessonTitle: string;
  index: number;
  total: number;
  children: React.ReactNode;
  topRight?: React.ReactNode;
  onBack?: () => void;
}) {
  const theme = getTrackTheme(category);
  const pct = Math.round(((index + 1) / total) * 100);

  return (
    <div style={{ maxWidth: "720px", margin: "0 auto", fontFamily: "'Outfit', ui-sans-serif, system-ui, sans-serif" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
        {onBack ? (
          <button onClick={onBack} style={{ background: "none", border: "none", color: "#888", fontSize: "14px", cursor: "pointer" }}>
            ← Back
          </button>
        ) : <span />}
        {topRight}
      </div>

      <div style={{ position: "relative", padding: "40px 38px 34px", background: palette.headerBg, borderRadius: "22px 22px 0 0", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: "-70px", right: "-50px", width: "220px", height: "220px", borderRadius: "50%", background: `radial-gradient(circle, ${theme.accent}66, transparent 70%)` }} />
        <div style={{ position: "absolute", bottom: "-90px", left: "-40px", width: "240px", height: "240px", borderRadius: "50%", background: "radial-gradient(circle, rgba(232,97,0,0.28), transparent 70%)" }} />
        <div style={{ position: "relative" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px" }}>
            <span style={{ fontSize: "11px", letterSpacing: "0.18em", textTransform: "uppercase", color: palette.headerEyebrow, fontWeight: 700 }}>
              {theme.name}
            </span>
            <span style={{ width: "4px", height: "4px", borderRadius: "50%", background: "rgba(255,255,255,0.3)" }} />
            <span style={{ fontSize: "11px", letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(255,255,255,0.55)" }}>
              {moduleTitle}
            </span>
          </div>
          <h1 style={{ fontFamily: "'Fraunces', serif", fontSize: "32px", fontWeight: 500, lineHeight: 1.12, color: "#fff", margin: "0 0 22px", letterSpacing: "-0.01em" }}>
            {lessonTitle}
          </h1>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div style={{ flex: 1, height: "5px", background: "rgba(255,255,255,0.12)", borderRadius: "3px", overflow: "hidden" }}>
              <div style={{ width: `${pct}%`, height: "100%", background: theme.accent, borderRadius: "3px", transition: "width 0.4s" }} />
            </div>
            <span style={{ fontSize: "12px", color: "rgba(255,255,255,0.6)", fontWeight: 500 }}>
              {index + 1} / {total}
            </span>
          </div>
        </div>
      </div>

      <div style={{ background: palette.canvasBg, borderRadius: "0 0 22px 22px", padding: "32px 38px 38px", boxShadow: "0 20px 60px -20px rgba(26,31,46,0.25)" }}>
        {children}
      </div>
    </div>
  );
}
