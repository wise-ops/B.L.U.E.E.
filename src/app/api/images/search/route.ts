import { NextResponse } from "next/server";
import { requireSuperAdmin } from "@/lib/tenant";

// Searches Unsplash for photos to use in lessons.
// Requires UNSPLASH_ACCESS_KEY in the environment.
export async function GET(req: Request) {
  await requireSuperAdmin();
  const { searchParams } = new URL(req.url);
  const query = searchParams.get("q") || "veterinary";

  const key = process.env.UNSPLASH_ACCESS_KEY;
  if (!key) {
    return NextResponse.json(
      { error: "Image search is not configured. Add UNSPLASH_ACCESS_KEY in your environment." },
      { status: 500 }
    );
  }

  const url = `https://api.unsplash.com/search/photos?query=${encodeURIComponent(
    query
  )}&per_page=12&orientation=landscape`;

  const res = await fetch(url, {
    headers: { Authorization: `Client-ID ${key}` },
  });

  if (!res.ok) {
    return NextResponse.json({ error: "Image search failed." }, { status: 502 });
  }

  const data = await res.json();
  // Return only what we need, with photographer credit (Unsplash requirement).
  const results = (data.results || []).map((p: any) => ({
    thumb: p.urls.small,
    full: p.urls.regular,
    credit: `Photo by ${p.user.name} on Unsplash`,
    alt: p.alt_description || query,
  }));

  return NextResponse.json({ results });
}
