import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const RAWG_BASE = "https://api.rawg.io/api";

type JsonObject = Record<string, unknown>;

function asObject(value: unknown): JsonObject {
  return value && typeof value === "object" ? (value as JsonObject) : {};
}

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

export async function GET(
  _req: NextRequest,
  { params }: { params: { slug: string } }
) {
  const key = process.env.RAWG_API_KEY;
  if (!key) {
    return NextResponse.json(
      { error: "Missing RAWG_API_KEY in .env.local" },
      { status: 500 }
    );
  }

  const { slug: requestedSlug } = params;

  // 1) Fetch juego
  const gameUrl = `${RAWG_BASE}/games/${encodeURIComponent(requestedSlug)}?key=${key}`;
  const gameFetch = await fetchJson(gameUrl);


  if (!gameFetch.res.ok) {
    // Si RAWG falla, devolvemos una respuesta vacía pero válida
    return NextResponse.json({
      game: {
        id: 0,
        slug: requestedSlug,
        name: "UNDEFINED",
        background_image: null,
        background_image_additional: null,
      },
      screenshots: [],
      error: {
        message: `RAWG game fetch failed: ${gameFetch.res.status}`,
        details: gameFetch.data,
      },
    });
  }

  let game = asObject(gameFetch.data);

  // 2) Redirect seguro
  if (game.redirect === true) {
    const redirectedSlug = String(game.slug ?? "").trim();

    if (!redirectedSlug || redirectedSlug === "undefined") {
      return NextResponse.json({
        game: {
          id: 0,
          slug: requestedSlug,
          name: "UNDEFINED",
          background_image: null,
          background_image_additional: null,
        },
        screenshots: [],
        error: {
          message: "RAWG redirect target invalid",
          requested: requestedSlug,
          game,
        },
      });
    }

    if (redirectedSlug !== requestedSlug) {
      const redirectedUrl = `${RAWG_BASE}/games/${encodeURIComponent(redirectedSlug)}?key=${key}`;
      const redirected = await fetchJson(redirectedUrl);
      if (redirected.res.ok) game = asObject(redirected.data);
    }
  }

  // 3) Validación final
  const gameName = String(game.name ?? "");
  const gameSlug = String(game.slug ?? "");
  if (gameName === "UNDEFINED" || gameSlug === "undefined") {
    return NextResponse.json({
      game: {
        id: 0,
        slug: requestedSlug,
        name: "UNDEFINED",
        background_image: null,
        background_image_additional: null,
      },
      screenshots: [],
      error: {
        message: "Invalid RAWG game returned",
        requested: requestedSlug,
        game,
      },
    });
  }

  // 4) Screenshots del slug final
  const finalSlug = String(game.slug ?? requestedSlug).trim();
  const shotsUrl = `${RAWG_BASE}/games/${encodeURIComponent(finalSlug)}/screenshots?key=${key}`;
  const shotsFetch = await fetchJson(shotsUrl);

  const shotsData = asObject(shotsFetch.data);
  const screenshots = shotsFetch.res.ok && Array.isArray(shotsData.results)
    ? shotsData.results
    : [];

  return NextResponse.json({ game, screenshots });
}
