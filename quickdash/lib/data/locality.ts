import { getProductById, type Product } from "./products";

export interface ZoneTrend {
  id: string;
  zoneId: string; // e.g. "Sector 62, Noida"
  productId: string;
  rolling14dUniqueBuyers: number;
  priorPeriod14dUniqueBuyers: number;
  rateOfChangePercent: number; // e.g. +240% surge
  isPromoDriven: boolean; // Must be false to qualify as organic trend!
  trendScore: number;
  lastUpdated: string;
}

export const ZONES = [
  { id: "z1", name: "Sector 62, Noida", city: "Noida", sampleSize: 1420 },
  { id: "z2", name: "Indiranagar, Bengaluru", city: "Bengaluru", sampleSize: 2890 },
  { id: "z3", name: "Bandra West, Mumbai", city: "Mumbai", sampleSize: 3100 },
];

export const MIN_ZONE_SAMPLE_THRESHOLD = 500;

export const localityTrends: ZoneTrend[] = [
  { id: "lt1", zoneId: "z1", productId: "p15", rolling14dUniqueBuyers: 284, priorPeriod14dUniqueBuyers: 80, rateOfChangePercent: 255, isPromoDriven: false, trendScore: 9.8, lastUpdated: "2026-08-01T10:00:00Z" },
  { id: "lt2", zoneId: "z1", productId: "p9", rolling14dUniqueBuyers: 340, priorPeriod14dUniqueBuyers: 110, rateOfChangePercent: 209, isPromoDriven: false, trendScore: 9.4, lastUpdated: "2026-08-01T10:00:00Z" },
  { id: "lt3", zoneId: "z1", productId: "p28", rolling14dUniqueBuyers: 490, priorPeriod14dUniqueBuyers: 160, rateOfChangePercent: 206, isPromoDriven: false, trendScore: 9.3, lastUpdated: "2026-08-01T10:00:00Z" },
  { id: "lt4", zoneId: "z1", productId: "p13", rolling14dUniqueBuyers: 215, priorPeriod14dUniqueBuyers: 75, rateOfChangePercent: 186, isPromoDriven: false, trendScore: 8.9, lastUpdated: "2026-08-01T10:00:00Z" },
  { id: "lt5", zoneId: "z1", productId: "p34", rolling14dUniqueBuyers: 195, priorPeriod14dUniqueBuyers: 70, rateOfChangePercent: 178, isPromoDriven: false, trendScore: 8.7, lastUpdated: "2026-08-01T10:00:00Z" },
  { id: "lt6", zoneId: "z1", productId: "p27", rolling14dUniqueBuyers: 180, priorPeriod14dUniqueBuyers: 65, rateOfChangePercent: 176, isPromoDriven: false, trendScore: 8.5, lastUpdated: "2026-08-01T10:00:00Z" },
  { id: "lt7", zoneId: "z1", productId: "p30", rolling14dUniqueBuyers: 165, priorPeriod14dUniqueBuyers: 60, rateOfChangePercent: 175, isPromoDriven: false, trendScore: 8.4, lastUpdated: "2026-08-01T10:00:00Z" },
  { id: "lt8", zoneId: "z1", productId: "p31", rolling14dUniqueBuyers: 150, priorPeriod14dUniqueBuyers: 58, rateOfChangePercent: 158, isPromoDriven: false, trendScore: 8.2, lastUpdated: "2026-08-01T10:00:00Z" },
  { id: "lt9", zoneId: "z1", productId: "p33", rolling14dUniqueBuyers: 310, priorPeriod14dUniqueBuyers: 125, rateOfChangePercent: 148, isPromoDriven: false, trendScore: 8.0, lastUpdated: "2026-08-01T10:00:00Z" },
  { id: "lt10", zoneId: "z1", productId: "p35", rolling14dUniqueBuyers: 220, priorPeriod14dUniqueBuyers: 90, rateOfChangePercent: 144, isPromoDriven: false, trendScore: 7.9, lastUpdated: "2026-08-01T10:00:00Z" },
  { id: "lt11", zoneId: "z1", productId: "p40", rolling14dUniqueBuyers: 115, priorPeriod14dUniqueBuyers: 48, rateOfChangePercent: 139, isPromoDriven: false, trendScore: 7.8, lastUpdated: "2026-08-01T10:00:00Z" },
  { id: "lt12", zoneId: "z1", productId: "p42", rolling14dUniqueBuyers: 275, priorPeriod14dUniqueBuyers: 120, rateOfChangePercent: 129, isPromoDriven: false, trendScore: 7.6, lastUpdated: "2026-08-01T10:00:00Z" },
  // Promo driven items (EXCLUDED)
  { id: "lt13", zoneId: "z1", productId: "p12", rolling14dUniqueBuyers: 890, priorPeriod14dUniqueBuyers: 400, rateOfChangePercent: 122, isPromoDriven: true, trendScore: 4.2, lastUpdated: "2026-08-01T10:00:00Z" },
];

export interface ProcessedTrendItem {
  product: Product;
  trend: ZoneTrend;
  growthTag: string;
  buyerCountText: string;
}

export function getHyperlocalDemandTrends(
  zoneId: string,
  userPurchasedCategoryNames: string[]
): ProcessedTrendItem[] {
  const zone = ZONES.find((z) => z.id === zoneId) || ZONES[0];
  const isThinVolume = zone.sampleSize < MIN_ZONE_SAMPLE_THRESHOLD;

  const purchasedSet = new Set(userPurchasedCategoryNames);

  return localityTrends
    .filter((t) => {
      const matchZone = isThinVolume ? true : t.zoneId === zone.id;
      if (t.isPromoDriven) return false; // Exclude promo!
      const product = getProductById(t.productId);
      if (!product || purchasedSet.has(product.category)) return false; // Discovery filter!
      return matchZone;
    })
    .sort((a, b) => b.rateOfChangePercent - a.rateOfChangePercent)
    .map((t) => {
      const product = getProductById(t.productId)!;
      return {
        product,
        trend: t,
        growthTag: `+${t.rateOfChangePercent}% surge in ${zone.name.split(",")[0]}`,
        buyerCountText: `${t.rolling14dUniqueBuyers} households near you`,
      };
    });
}
