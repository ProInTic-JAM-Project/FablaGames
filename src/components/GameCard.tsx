"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";

type SeedInfo = {
  rawgSlug: string;
  developerName: string;
  province?: string;
  steamUrl?: string;
  itchUrl?: string;
  websiteUrl?: string;
};

type RawgInfo = {
  id?: number;
  slug?: string;
  name?: string;
  released?: string | null;
  rating?: number;
  ratingsCount?: number;
  metacritic?: number | null;
  playtime?: number | null;
  description?: string | null;
  website?: string | null;
  genres?: string[];
  platforms?: string[];
  developers?: string[];
  publishers?: string[];
};

type Props = {
  title: string;
  developer: string;
  seed: string;
  province?: string;
  images?: string[];
  seedInfo: SeedInfo;
  rawgInfo?: RawgInfo | null;
};

export function GameCard({
  title,
  developer,
  seed,
  province,
  images,
  seedInfo,
  rawgInfo,
}: Props) {
  const safeImages = useMemo(
    () => (images && images.length > 0 ? images : []),
    [images]
  );
  const [idx, setIdx] = useState(0);
  const [isOpen, setIsOpen] = useState(false);

  const hasImages = safeImages.length > 0;

  const prev = () => setIdx((v) => (v - 1 + safeImages.length) % safeImages.length);
  const next = () => setIdx((v) => (v + 1) % safeImages.length);

  const provinceLabel = province?.trim() ? province.trim() : "Sin provincia";
  const provinceStyles =
    provinceLabel.toLowerCase() === "zaragoza"
      ? "bg-amber-100 text-amber-700"
      : provinceLabel.toLowerCase() === "teruel"
      ? "bg-fuchsia-100 text-fuchsia-700"
      : provinceLabel.toLowerCase() === "huesca"
      ? "bg-sky-100 text-sky-700"
      : "bg-emerald-100 text-emerald-700";

  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsOpen(false);
    };

    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const openDrawer = () => setIsOpen(true);

  return (
    <>
      <article
        role="button"
        tabIndex={0}
        onClick={openDrawer}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            openDrawer();
          }
        }}
        className="group w-full overflow-hidden rounded-2xl border border-white/40 bg-white/80 shadow-sm backdrop-blur transition hover:-translate-y-0.5 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400"
      >
        <div className="relative">
          <div className="relative aspect-video">
            {hasImages ? (
              <Image
                src={safeImages[idx]}
                alt={title}
                fill
                className="object-cover transition duration-500 group-hover:scale-[1.02]"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            ) : (
              <div className="grid h-full w-full place-items-center bg-neutral-100">
                <p className="text-center text-sm font-semibold text-neutral-500">
                  Sin imágenes
                </p>
              </div>
            )}
          </div>
          <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/60 to-transparent" />

          <div className="absolute left-3 top-3 rounded-full bg-black/70 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-white">
            {seed}
          </div>

          {hasImages && safeImages.length > 1 && (
            <>
              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                  prev();
                }}
                aria-label="Anterior"
                className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full border border-white/40 bg-black/60 px-2 py-1 text-sm font-semibold text-white transition hover:bg-black/80"
              >
                ‹
              </button>
              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                  next();
                }}
                aria-label="Siguiente"
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full border border-white/40 bg-black/60 px-2 py-1 text-sm font-semibold text-white transition hover:bg-black/80"
              >
                ›
              </button>
            </>
          )}
        </div>

        <div className="space-y-2 px-4 pb-4 pt-3">
          <h3 className="line-clamp-1 text-base font-semibold text-neutral-900">
            {title}
          </h3>
          <div className="flex items-center justify-between text-sm text-neutral-600">
            <span className="font-medium">{developer}</span>
            <span
              className={`rounded-full px-2 py-0.5 text-xs font-semibold ${provinceStyles}`}
            >
              {provinceLabel}
            </span>
          </div>
        </div>
      </article>

      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 p-4 sm:items-center"
          role="dialog"
          aria-modal="true"
          aria-label={`Detalles de ${title}`}
        >
          <button
            type="button"
            className="absolute inset-0 h-full w-full cursor-default"
            aria-label="Cerrar"
            onClick={() => setIsOpen(false)}
          />
          <div className="relative z-10 flex w-full max-w-5xl flex-col overflow-hidden rounded-2xl bg-white shadow-xl sm:max-h-[85vh]">
            <div className="flex items-start justify-between gap-4 border-b border-slate-100 px-5 py-4">
              <div> 
                {rawgInfo?.website ? (
                  <a
                    className="block text-xl font-semibold text-blue-900"
                    href={rawgInfo.website}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {title}
                  </a>
                ) : (
                  <h3 className="block text-xl font-semibold text-slate-900">
                    {title}
                  </h3>
                )}
                {seedInfo.websiteUrl ? (
                  <a
                    className="inline-flex items-center gap-2 text-sm text-slate-600"
                    href={seedInfo.websiteUrl}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <span>{seedInfo.developerName}</span>
                    <svg
                      className="h-4 w-4 rtl:rotate-[270deg]"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke="currentColor"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M18 14v4.833A1.166 1.166 0 0 1 16.833 20H5.167A1.167 1.167 0 0 1 4 18.833V7.167A1.166 1.166 0 0 1 5.167 6h4.618m4.447-2H20v5.768m-7.889 2.121 7.778-7.778"
                      />
                    </svg>
                  </a>
                ) : (
                  <p className="text-sm text-slate-600">{seedInfo.developerName}</p>
                )}
              </div>
              <span
              className={`rounded-full px-5 py-2 text-xl inset-ring font-semibold ${provinceStyles}`}
            >
              {provinceLabel}
            </span>
            </div>

            <div className="space-y-4 overflow-y-auto px-5 pb-6 pt-4">
              <div className="overflow-hidden rounded-xl border border-slate-100">
                <div className="relative aspect-video bg-slate-100">
                  {hasImages ? (
                    <Image
                      src={safeImages[idx]}
                      alt={title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 1200px) 100vw, 1200px"
                    />
                  ) : (
                    <div className="grid h-full w-full place-items-center text-sm text-slate-500">
                      Sin imágenes
                    </div>
                  )}
                </div>
              </div>

              <div className="flex flex-wrap gap-4 text-sm text-slate-700">
                <div className="min-w-[160px]">
                  <span className="font-semibold text-slate-900">Steam:</span>{" "}
                  {seedInfo.steamUrl ? (
                    <a
                      className="text-indigo-600 hover:underline"
                      href={seedInfo.steamUrl}
                      target="_blank"
                      rel="noreferrer"
                    >
                      Abrir
                    </a>
                  ) : (
                    "No disponible"
                  )}
                </div>
                <div className="min-w-[160px]">
                  <span className="font-semibold text-slate-900">Itch:</span>{" "}
                  {seedInfo.itchUrl ? (
                    <a
                      className="text-indigo-600 hover:underline"
                      href={seedInfo.itchUrl}
                      target="_blank"
                      rel="noreferrer"
                    >
                      Abrir
                    </a>
                  ) : (
                    "No disponible"
                  )}
                </div>
                <div className="min-w-[160px]">
                  <span className="font-semibold text-slate-900">Lanzamiento:</span>{" "}
                  {rawgInfo?.released ?? "Sin datos"}
                </div>
                <div className="min-w-[160px]">
                  <span className="font-semibold text-slate-900">Rating:</span>{" "}
                  {rawgInfo?.rating ? rawgInfo.rating.toFixed(1) : "Sin datos"}
                  {rawgInfo?.ratingsCount
                    ? ` (${rawgInfo.ratingsCount} votos)`
                    : ""}
                </div>
                <div className="min-w-[160px]">
                  <span className="font-semibold text-slate-900">Metacritic:</span>{" "}
                  {rawgInfo?.metacritic ?? "Sin datos"}
                </div>
                <div className="min-w-[160px]">
                  <span className="font-semibold text-slate-900">Playtime:</span>{" "}
                  {rawgInfo?.playtime ? `${rawgInfo.playtime}h` : "Sin datos"}
                </div>
                <div className="min-w-[240px]">
                  <span className="font-semibold text-slate-900">Géneros:</span>{" "}
                  {rawgInfo?.genres?.length ? rawgInfo.genres.join(", ") : "Sin datos"}
                </div>
                <div className="min-w-[240px]">
                  <span className="font-semibold text-slate-900">Plataformas:</span>{" "}
                  {rawgInfo?.platforms?.length
                    ? rawgInfo.platforms.join(", ")
                    : "Sin datos"}
                </div>
                <div className="min-w-[240px]">
                  <span className="font-semibold text-slate-900">
                    Developers RAWG:
                  </span>{" "}
                  {rawgInfo?.developers?.length
                    ? rawgInfo.developers.join(", ")
                    : "Sin datos"}
                </div>
                <div className="min-w-[240px]">
                  <span className="font-semibold text-slate-900">Publishers:</span>{" "}
                  {rawgInfo?.publishers?.length
                    ? rawgInfo.publishers.join(", ")
                    : "Sin datos"}
                </div>
              </div>

              {rawgInfo?.description && (
                <div className="text-sm leading-relaxed text-slate-700">
                  {rawgInfo.description}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
