// Per-track visual identity. Each role/category gets its own accent so courses
// feel distinct rather than identical-recolored. Falls back to steel blue.
export interface TrackTheme {
  accent: string;       // primary accent
  accentDark: string;   // darker shade for gradients/text
  accentSoft: string;   // soft tint background
  name: string;
}

const THEMES: Record<string, TrackTheme> = {
  "Client Service Representative": { accent: "#4682b4", accentDark: "#2f5d82", accentSoft: "#e8f1f8", name: "CSR" },
  "Veterinary Assistant":          { accent: "#2f9e75", accentDark: "#1f6e52", accentSoft: "#e3f5ee", name: "Assistant" },
  "Veterinary Technician":         { accent: "#7a5cc4", accentDark: "#553a91", accentSoft: "#efeafa", name: "Technician" },
  "DVM":                           { accent: "#c0392b", accentDark: "#8e2a20", accentSoft: "#fbeceb", name: "DVM" },
  "Practice Manager":              { accent: "#e86100", accentDark: "#a8470a", accentSoft: "#fdeee2", name: "Manager" },
  "Owner":                         { accent: "#556b2f", accentDark: "#3d4f22", accentSoft: "#eef2e4", name: "Owner" },
};

export function getTrackTheme(category?: string): TrackTheme {
  if (category && THEMES[category]) return THEMES[category];
  return { accent: "#4682b4", accentDark: "#2f5d82", accentSoft: "#e8f1f8", name: "General" };
}
