import { GameCard } from "../components/GameCard";

const MOCK = Array.from({ length: 6 }).map((_, i) => ({
  id: String(i + 1),
  title: "Título del juego",
  developer: "Desarrollador/a",
  images: ["/placeholder.png", "/placeholder.png", "/placeholder.png"],
}));

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      <div className="mx-auto max-w-6xl px-4 py-10">
        <header className="mb-8">
          <h1 className="text-3xl font-semibold tracking-tight">FablaGames</h1>
          <p className="mt-2 text-sm text-neutral-600">
            Videojuegos y creadores locales de Aragón.
          </p>
        </header>

        <section className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {MOCK.map((g) => (
            <GameCard
              key={g.id}
              title={g.title}
              developer={g.developer}
              images={g.images}
            />
          ))}
        </section>
      </div>
    </main>
  );
}
