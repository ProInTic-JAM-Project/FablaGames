import { NextRequest, NextResponse } from "next/server";

const RAWG_BASE = "https://api.rawg.io/api";

type RawgGameListItem = {
  id: number;
  name: string;
  slug: string;
  released: string | null;
};

type RawgSearchResponse = {
  results: RawgGameListItem[];
};

async function fetchJson(url: string) {
  const res = await fetch(url, { cache: "no-store" });
  const text = await res.text();

  let data: unknown;
  try {
    data = JSON.parse(text);
  } catch {
    data = { raw: text.slice(0, 300) };
  }

  return { res, data };
}

export async function GET(req: NextRequest) {
  const key = process.env.RAWG_API_KEY;
  if (!key) {
    return NextResponse.json({ error: "Missing RAWG_API_KEY" }, { status: 500 });
  }

  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q")?.trim();

  if (!q) {
    return NextResponse.json({ error: "Missing q param" }, { status: 400 });
  }

  const url = `${RAWG_BASE}/games?key=${key}&search=${encodeURIComponent(
    q
  )}&page_size=10`;

  const { res, data } = await fetchJson(url);

  if (!res.ok) {
    return NextResponse.json(
      { error: `RAWG search failed: ${res.status}`, details: data },
      { status: res.status }
    );
  }

  const json = (data ?? {}) as RawgSearchResponse;

  // devolvemos solo lo útil
  const results = (json.results ?? []).map((g: RawgGameListItem) => ({
    id: g.id,
    name: g.name,
    slug: g.slug,
    released: g.released,
  }));

  return NextResponse.json({ results });
}
