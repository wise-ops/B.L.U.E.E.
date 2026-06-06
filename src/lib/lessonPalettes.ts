// Four lesson palettes that lessons rotate through, so a course stays visually
// fresh instead of every lesson looking identical. The palette is chosen by
// lesson index (stable — the same lesson always looks the same).

export interface Palette {
  name: string;
  headerBg: string;     // dark header background
  headerEyebrow: string;// small uppercase label color
  canvasBg: string;     // content area background (the colored part)
  leadText: string;     // serif lead paragraph color
  bodyText: string;     // body text color
  cardBg: string;       // callout/quiz card background
  cardText: string;     // text on cards
  accentBar: string;    // callout accent + glow color
  accentText: string;   // callout label color
  dark: boolean;        // is this a dark-mode palette?
}

export const PALETTES: Palette[] = [
  {
    name: "Soft blue",
    headerBg: "#1a3a52",
    headerEyebrow: "#7fb3d0",
    canvasBg: "#e8f0f7",
    leadText: "#1a3a52",
    bodyText: "#3d5266",
    cardBg: "#ffffff",
    cardText: "#3a3a36",
    accentBar: "#e86100",
    accentText: "#993c1d",
    dark: false,
  },
  {
    name: "Sage green",
    headerBg: "#2c3a26",
    headerEyebrow: "#a3bd84",
    canvasBg: "#eaf0e2",
    leadText: "#2c3a26",
    bodyText: "#4d5742",
    cardBg: "#ffffff",
    cardText: "#3a3a36",
    accentBar: "#e86100",
    accentText: "#993c1d",
    dark: false,
  },
  {
    name: "Warm clay",
    headerBg: "#3d2417",
    headerEyebrow: "#e0a07a",
    canvasBg: "#f4e7dd",
    leadText: "#3d2417",
    bodyText: "#5e483a",
    cardBg: "#ffffff",
    cardText: "#3a3a36",
    accentBar: "#4682b4",
    accentText: "#2f5d82",
    dark: false,
  },
  {
    name: "Deep navy",
    headerBg: "#0f1722",
    headerEyebrow: "#5b9bd5",
    canvasBg: "#1a2433",
    leadText: "#e8eef5",
    bodyText: "#a9b6c5",
    cardBg: "#243144",
    cardText: "#cdd6e0",
    accentBar: "#e86100",
    accentText: "#f0a060",
    dark: true,
  },
];

export function getPalette(index: number): Palette {
  return PALETTES[index % PALETTES.length];
}

// Alias used by the lesson players.
export const paletteForIndex = getPalette;
