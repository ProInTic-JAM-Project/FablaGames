import { getSeed } from "@/lib/seed";

import { GameCard } from "@/components/GameCard";
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
        };
      }
    })
  );

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50">
      <div className="mx-auto max-w-6xl px-4 py-8">
        <header className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight text-slate-900">
              FablaGames
            </h1>
            <p className="text-sm text-slate-600">
              Videojuegos y creadores locales de Aragón.
            </p>
          </div>
          <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/70 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-slate-600">
            RAWG + Seed local
          </div>
        </header>

        <section className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {enriched.map((g) => (
            <GameCard
              key={g.key}
              title={g.title}
              seed={g.seed}
              developer={g.developer}
              province={g.province}
              images={g.images}
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
