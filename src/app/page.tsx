import { getSeed } from "@/lib/seed";

import { GameCard } from "@/components/GameCard";
import { ThemeToggle } from "@/components/ThemeToggle";
import { getGameWithScreenshots } from "@/lib/rawg";

export default async function Home() {
  const items = getSeed();

  const enriched = await Promise.all(
    items.map(async (it) => {
      try {
        const { game, screenshots } = await getGameWithScreenshots(
          it.rawgSlug
        );

        const images = [
          ...(screenshots?.map((s) => s.image) ?? []),
          game?.background_image_additional,
          game?.background_image,
        ].filter(Boolean) as string[];

        return {
          key: it.rawgSlug ?? crypto.randomUUID(),
          title: String(game?.name ?? it.rawgSlug ?? "SIN DATOS"),
          seed: String(it.rawgSlug),
          developer: it.developerName,
          province: it.province,
          images,
          seedInfo: {
            rawgSlug: String(it.rawgSlug ?? ""),
            developerName: it.developerName,
            province: it.province,
            steamUrl: it.steamUrl,
            websiteUrl: it.websiteUrl,
          },
          rawgInfo: {
            id: game?.id,
            slug: game?.slug,
            name: game?.name,
            released: game?.released ?? null,
            rating: game?.rating,
            ratingsCount: game?.ratings_count,
            metacritic: game?.metacritic ?? null,
            playtime: game?.playtime ?? null,
            description: game?.description_raw ?? null,
            website: game?.website ?? null,
            genres: game?.genres?.map((g) => g.name) ?? [],
            platforms:
              game?.platforms
                ?.map((p) => p.platform?.name)
                .filter((name): name is string => Boolean(name)) ?? [],
            developers: game?.developers?.map((d) => d.name) ?? [],
            publishers: game?.publishers?.map((p) => p.name) ?? [],
          },
        };
      } catch (err) {
        console.warn("Error cargando juego desde RAWG:", it.rawgSlug, err);

        return {
          key: it.rawgSlug ?? crypto.randomUUID(),
          title: String(it.rawgSlug ?? "SIN DATOS"),
          seed: String(it.rawgSlug ?? "SIN DATOS"),
          developer: it.developerName,
          province: it.province,
          images: [],
          seedInfo: {
            rawgSlug: String(it.rawgSlug ?? ""),
            developerName: it.developerName,
            province: it.province,
            steamUrl: it.steamUrl,
            websiteUrl: it.websiteUrl,
          },
          rawgInfo: null,
        };
      }
    })
  );

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <div className="mx-auto max-w-8xl px-10 py-8">
        <header className="mb-6 grid gap-3 text-center sm:grid-cols-[1fr_auto_1fr] sm:items-center">
          <div className="hidden sm:block" />
          <div>
            <h1 className="text-4xl font-bold tracking-tight text-slate-900 dark:text-slate-100 sm:text-5xl">
              FablaGames
            </h1>
            <p className="text-sm text-slate-600 dark:text-slate-300">
              Videojuegos y creadores locales de Aragón.
            </p>
          </div>
          <div className="flex justify-center sm:justify-end">
            <ThemeToggle />
          </div>
        </header>

        <section className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:gap-10">
          {enriched.map((g) => (
            <GameCard
              key={g.key}
              title={g.title}
              seed={g.seed}
              developer={g.developer}
              province={g.province}
              images={g.images}
              seedInfo={g.seedInfo}
              rawgInfo={g.rawgInfo}
            />
          ))}
        </section>

        <footer className="mt-8 text-xs text-slate-500">
          Datos e imágenes: RAWG
        </footer>
      </div>
    </main>
  );
}
