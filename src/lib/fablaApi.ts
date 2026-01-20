import { getOrigin } from "@/lib/getOrigin";

export type ApiScreenshot = { id: number; image: string };

export type ApiGameResponse = {
  game: {
    id: number;
    slug: string;
    name: string;
    background_image?: string | null;
    background_image_additional?: string | null;
  };
  screenshots: ApiScreenshot[];
};

export async function getFablaGame(slug: string) {
  const origin = await getOrigin();

  const res = await fetch(
    `${origin}/api/rawg/game/${encodeURIComponent(slug)}`,
    { next: { revalidate: 60 * 60 * 24 } } // cache 24h
  );

  // La API interna siempre devuelve 200, pero por si acaso:
  if (!res.ok) {
    console.warn("Fabla API no OK, usando datos vacíos:", slug, res.status);

    return {
      game: {
        id: 0,
        slug,
        name: "UNDEFINED",
        background_image: null,
        background_image_additional: null,
      },
      screenshots: [],
    };
  }

  return (await res.json()) as ApiGameResponse;
}
