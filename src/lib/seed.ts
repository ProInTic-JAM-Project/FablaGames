import rawSeed from "@/data/games.seed.json";

export type SeedItem = {
  rawgSlug: string;
  developerName: string;
  province?: string;
  steamUrl?: string;
  itchUrl?: string;
  websiteUrl?: string;
};

type RawSeedItem = Partial<SeedItem> & Record<string, unknown>;

export function getSeed(): SeedItem[] {
  if (!Array.isArray(rawSeed)) throw new Error("Seed JSON must be an array");

  return rawSeed.map((x: RawSeedItem, i: number) => {
    const rawgSlug = String(x.rawgSlug ?? "").trim();
    const developerName = String(x.developerName ?? "").trim();

    if (!rawgSlug) throw new Error(`Seed item #${i} missing rawgSlug`);
    if (!developerName) throw new Error(`Seed item #${i} missing developerName`);

    return {
      rawgSlug,
      developerName,
      province: x.province,
      steamUrl: x.steamUrl,
      itchUrl: x.itchUrl,
      websiteUrl: x.websiteUrl,
    };
  });
}
