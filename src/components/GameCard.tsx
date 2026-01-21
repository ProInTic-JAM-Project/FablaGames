"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";

type SeedInfo = {
  rawgSlug: string;
  developerName: string;
  province?: string;
  steamUrl?: string;
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
      ? "bg-emerald-100 text-emerald-700"
      : provinceLabel.toLowerCase() === "teruel"
      ? "bg-fuchsia-100 text-fuchsia-700"
      : provinceLabel.toLowerCase() === "huesca"
      ? "bg-sky-100 text-sky-700"
      : "bg-amber-100 text-amber-700";

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

  const badgeClass =
    "rounded-full border border-slate-700 bg-slate-800 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-slate-100 dark:border-slate-500 dark:bg-slate-700";
  const badgeLinkClass =
    "rounded-full border border-indigo-500 bg-indigo-600 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-white shadow-sm transition hover:bg-indigo-500 dark:border-indigo-400 dark:bg-indigo-500 dark:hover:bg-indigo-400";
  const tooltipClass =
    "pointer-events-none absolute left-1/2 top-full z-10 mt-2 w-max max-w-xs -translate-x-1/2 rounded bg-slate-900 px-2 py-1 text-xs text-white opacity-0 shadow transition group-hover:opacity-100 break-words text-center dark:bg-black";

  const renderBadge = (
    label: string,
    value: string,
    href?: string,
    showTooltip = true,
    className?: string
  ) => (
    <span className="group relative inline-flex">
      {href ? (
        <a
          className={className ?? badgeClass}
          href={href}
          target="_blank"
          rel="noreferrer"
        >
          {label}
        </a>
      ) : (
        <span className={className ?? badgeClass}>{label}</span>
      )}
      {showTooltip && <span className={tooltipClass}>{value}</span>}
    </span>
  );

  const ratingValue = rawgInfo?.rating
    ? `${rawgInfo.rating.toFixed(1)}${
        rawgInfo.ratingsCount ? ` (${rawgInfo.ratingsCount} votos)` : ""
      }`
    : "Sin datos";
  const metacriticValue =
    rawgInfo?.metacritic !== null && rawgInfo?.metacritic !== undefined
      ? String(rawgInfo.metacritic)
      : "Sin datos";

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
        aria-label={`Abrir detalles de ${title} (${seed})`}
        className="group w-full overflow-hidden rounded-2xl border border-white/40 bg-white/80 shadow-sm backdrop-blur transition hover:-translate-y-0.5 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 dark:border-slate-800 dark:bg-slate-900/80 dark:ring-1 dark:ring-slate-800"
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
          <h3 className="line-clamp-1 text-base font-semibold text-neutral-900 dark:text-slate-100">
            {title}
          </h3>
          <div className="flex items-center justify-between text-sm text-neutral-600 dark:text-slate-300">
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
          <div className="relative z-10 flex w-full max-w-6xl flex-col overflow-hidden rounded-2xl bg-white shadow-xl sm:max-h-[92vh] dark:border dark:border-slate-800 dark:bg-slate-950">
            <div className="flex items-start justify-between gap-4 border-b border-slate-100 px-5 py-4 dark:border-slate-800">
              <div> 
                {rawgInfo?.website ? (
                  <a
                    className="block text-xl font-semibold text-blue-900 dark:text-blue-300"
                    href={rawgInfo.website}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {title}
                  </a>
                ) : (
                  <h3 className="block text-xl font-semibold text-slate-900 dark:text-slate-100">
                    {title}
                  </h3>
                )}
                {seedInfo.websiteUrl ? (
                  <a
                    className="inline-flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300"
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
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M18 14v4.833A1.166 1.166 0 0 1 16.833 20H5.167A1.167 1.167 0 0 1 4 18.833V7.167A1.166 1.166 0 0 1 5.167 6h4.618m4.447-2H20v5.768m-7.889 2.121 7.778-7.778"
                      />
                    </svg>
                  </a>
                ) : (
                  <p className="text-sm text-slate-600 dark:text-slate-300">
                    {seedInfo.developerName}
                  </p>
                )}
              </div>
              <span
              className={`rounded-full px-5 py-2 text-xl inset-ring font-semibold ${provinceStyles}`}
            >
              {provinceLabel}
            </span>
            </div>

            <div className="space-y-4 overflow-y-auto px-5 pb-6 pt-4">
              <div className="overflow-hidden rounded-xl border border-slate-100 dark:border-slate-800">
                <div className="relative aspect-[16/7] bg-slate-100 dark:bg-slate-900">
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
                  {hasImages && safeImages.length > 1 && (
                    <>
                      <button
                        type="button"
                        onClick={prev}
                        aria-label="Anterior"
                        className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full border border-white/60 bg-black/60 px-2 py-1 text-sm font-semibold text-white transition hover:bg-black/80"
                      >
                        ‹
                      </button>
                      <button
                        type="button"
                        onClick={next}
                        aria-label="Siguiente"
                        className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full border border-white/60 bg-black/60 px-2 py-1 text-sm font-semibold text-white transition hover:bg-black/80"
                      >
                        ›
                      </button>
                    </>
                  )}
                </div>
              </div>

              <div className="flex flex-wrap justify-center gap-3">
                {renderBadge(
                  "Steam",
                  seedInfo.steamUrl ?? "No disponible",
                  seedInfo.steamUrl,
                  false,
                  badgeLinkClass
                )}
                {renderBadge("Lanzamiento", rawgInfo?.released ?? "Sin datos")}
                {renderBadge("Rating", ratingValue)}
                {renderBadge("Metacritic", metacriticValue)}
                {renderBadge(
                  "Playtime",
                  rawgInfo?.playtime ? `${rawgInfo.playtime}h` : "Sin datos"
                )}
                {renderBadge(
                  "Géneros",
                  rawgInfo?.genres?.length ? rawgInfo.genres.join(", ") : "Sin datos"
                )}
                {renderBadge(
                  "Plataformas",
                  rawgInfo?.platforms?.length
                    ? rawgInfo.platforms.join(", ")
                    : "Sin datos"
                )}
                {renderBadge(
                  "Developers RAWG",
                  rawgInfo?.developers?.length
                    ? rawgInfo.developers.join(", ")
                    : "Sin datos"
                )}
                {renderBadge(
                  "Publishers",
                  rawgInfo?.publishers?.length
                    ? rawgInfo.publishers.join(", ")
                    : "Sin datos"
                )}
              </div>

              {rawgInfo?.description && (
                <>
                  <hr className="mx-4 border-slate-200 dark:border-slate-800" />
                  <div className="mx-4 text-justify text-sm leading-relaxed text-slate-700 dark:text-slate-300">
                    {rawgInfo.description}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
