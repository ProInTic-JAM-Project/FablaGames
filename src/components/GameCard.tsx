"use client";

import Image from "next/image";
import { useMemo, useState } from "react";

type Props = {
  title: string;
  developer: string;
  seed: string;
  province?: string;
  images?: string[];
};

export function GameCard({ title, developer, seed, province, images }: Props) {
  const safeImages = useMemo(
    () => (images && images.length > 0 ? images : []),
    [images]
  );
  const [idx, setIdx] = useState(0);

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

  return (
    <article className="group w-full overflow-hidden rounded-2xl border border-white/40 bg-white/80 shadow-sm backdrop-blur transition hover:-translate-y-0.5 hover:shadow-lg">
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
              onClick={prev}
              aria-label="Anterior"
              className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full border border-white/40 bg-black/60 px-2 py-1 text-sm font-semibold text-white transition hover:bg-black/80"
            >
              ‹
            </button>
            <button
              type="button"
              onClick={next}
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
  );
}
