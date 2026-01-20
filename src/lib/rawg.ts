export type RawgScreenshot = {
    id: number;
    image: string;
    width?: number;
    height?: number;
  };
  
  export type RawgGame = {
    id: number;
    slug: string;
    name: string;
    background_image?: string | null;
  background_image_additional?: string | null;
  };
  
  const RAWG_BASE = "https://api.rawg.io/api";
  
  function getKey() {
    const key = process.env.RAWG_API_KEY;
    if (!key) throw new Error("Missing RAWG_API_KEY in .env.local");
    return key;
  }
  
  export async function getGameWithScreenshots(slug: string) {
    const key = getKey();
  
    const gameUrl = `${RAWG_BASE}/games/${encodeURIComponent(slug)}?key=${key}`;
    const shotsUrl = `${RAWG_BASE}/games/${encodeURIComponent(slug)}/screenshots?key=${key}`;
  
  const headers = {
    "Accept": "application/json",
    "User-Agent": "FablaGames/1.0",
  };

  const [gameRes, shotsRes] = await Promise.all([
    fetch(gameUrl, { headers, next: { revalidate: 60 * 60 * 24 } }),
    fetch(shotsUrl, { headers, next: { revalidate: 60 * 60 * 24 } }),
  ]);
  
    if (!gameRes.ok) throw new Error(`RAWG game fetch failed (${gameRes.status})`);
  
    const game = (await gameRes.json()) as RawgGame;
    const shotsJson = shotsRes.ok ? await shotsRes.json() : { results: [] };
  
    const screenshots = (shotsJson?.results ?? []) as RawgScreenshot[];
  
    return { game, screenshots };
  }
  