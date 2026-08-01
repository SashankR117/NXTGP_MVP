export interface FriendConnection {
  id: string;
  requesterId: string;
  addresseeId: string;
  status: "pending" | "mutual" | "blocked";
  hashedPhoneMatch: string; // Hashed phone lookup
  createdAt: string;
}

export interface CuratedShelfItem {
  id: string;
  userId: string;
  productId: string;
  type: "frequent" | "liked";
  cadenceLabel?: string; // e.g. "Buys monthly" (AGGREGATED CADENCE ONLY — NO TIMESTAMPS!)
  visibilityFlag: boolean;
  category: string;
  isDefaultHidden?: boolean; // Medical/Hygiene categories hidden by default
}

export const friendConnections: FriendConnection[] = [
  // Ananya (u1) and Priya (u3) are mutual friends
  { id: "fc1", requesterId: "u1", addresseeId: "u3", status: "mutual", hashedPhoneMatch: "a3b89f2d1e0c4a", createdAt: "2026-06-15" },
  // Rahul (u2) sent a request to Ananya (u1) — PENDING ACCEPTANCE (Double Opt-In requirement)
  { id: "fc2", requesterId: "u2", addresseeId: "u1", status: "pending", hashedPhoneMatch: "7c4e1a8b9f3d2e", createdAt: "2026-07-28" },
  // Arjun (u4) and Ananya (u1) are mutual friends
  { id: "fc3", requesterId: "u4", addresseeId: "u1", status: "mutual", hashedPhoneMatch: "9f2e7c4a1b8d3e", createdAt: "2026-07-01" },
];

export const initialShelfItems: CuratedShelfItem[] = [
  // Priya's (u3) Curated Shelf
  { id: "s1", userId: "u3", productId: "p15", type: "liked", visibilityFlag: true, category: "Bakery & Gourmet" },
  { id: "s2", userId: "u3", productId: "p9", type: "frequent", cadenceLabel: "Buys monthly", visibilityFlag: true, category: "Tea, Coffee & Drinks" },
  { id: "s3", userId: "u3", productId: "p16", type: "liked", visibilityFlag: true, category: "Bakery & Gourmet" },
  { id: "s4", userId: "u3", productId: "p19", type: "liked", visibilityFlag: false, category: "Personal Care & Hygiene", isDefaultHidden: true }, // Hygiene default hidden!

  // Rahul's (u3) Curated Shelf
  { id: "s5", userId: "u2", productId: "p9", type: "frequent", cadenceLabel: "Buys bi-weekly", visibilityFlag: true, category: "Tea, Coffee & Drinks" },
  { id: "s6", userId: "u2", productId: "p13", type: "liked", visibilityFlag: true, category: "Munchies & Snacks" },
  { id: "s7", userId: "u2", productId: "p15", type: "liked", visibilityFlag: true, category: "Bakery & Gourmet" },
  { id: "s8", userId: "u2", productId: "p20", type: "frequent", cadenceLabel: "Buys monthly", visibilityFlag: false, category: "Personal Care & Hygiene", isDefaultHidden: true },

  // Arjun's (u4) Curated Shelf
  { id: "s9", userId: "u4", productId: "p23", type: "frequent", cadenceLabel: "Buys monthly", visibilityFlag: true, category: "Pet Care & Supplies" },
  { id: "s10", userId: "u4", productId: "p24", type: "liked", visibilityFlag: true, category: "Pet Care & Supplies" },
  { id: "s11", userId: "u4", productId: "p27", type: "liked", visibilityFlag: true, category: "Home & Cleaning" },
];
