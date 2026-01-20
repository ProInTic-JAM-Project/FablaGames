"use client";

import Image from "next/image";
import { useMemo, useState } from "react";

type Props = {
  title: string;
  developer: string;
  images: string[];
};

export function GameCard({ title, developer, images }: Props) {
  const safeImages = useMemo(() => (images?.length ? images : ["/placeholder.png"]), [images]);
  const [idx, setIdx] = useState(0);

  const prev = () => setIdx((v) => (v - 1 + safeImages.length) % safeImages.length);
  const next = () => setIdx((v) => (v + 1) % safeImages.length);

  return (
    <article className="w-full rounded-md border-4 border-blue-600 p-5">
      {/* “Carrusel” */}
      <div className="relative overflow-hidden rounded-md border-4 border-neutral-500 bg-neutral-50">
        <div className="relative aspect-[16/7]">
          <Image
            src={safeImages[idx]}
            alt={title}
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 33vw"
            priority={false}
          />
        </div>

        {/* Flechas */}
        <button
          type="button"
          onClick={prev}
          aria-label="Anterior"
          className="absolute left-2 top-1/2 -translate-y-1/2 rounded-sm border-2 border-neutral-500 bg-white/80 px-2 py-1 text-xl font-bold text-neutral-700 hover:bg-white"
        >
          ‹
        </button>
        <button
          type="button"
          onClick={next}
          aria-label="Siguiente"
          className="absolute right-2 top-1/2 -translate-y-1/2 rounded-sm border-2 border-neutral-500 bg-white/80 px-2 py-1 text-xl font-bold text-neutral-700 hover:bg-white"
        >
          ›
        </button>

        {/* Texto centro como en maqueta */}
        <div className="pointer-events-none absolute inset-0 grid place-items-center">
          <p className="text-center text-sm font-semibold text-neutral-500">
            Carrusel de imágenes
            <br />
            del juego
          </p>
        </div>
      </div>

      {/* Pills inferiores */}
      <div className="mt-5 flex gap-4">
        <div className="flex-1 rounded-full border-4 border-green-600 px-4 py-2 text-center font-semibold text-green-700">
          {title}
        </div>
        <div className="w-[42%] rounded-full border-4 border-red-600 px-4 py-2 text-center font-semibold text-red-600">
          {developer}
        </div>
      </div>
    </article>
  );
}
