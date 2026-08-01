export interface UserPersona {
  id: string;
  fullName: string;
  phone: string;
  email: string;
  avatarEmoji: string;
  locality: string;
  localityZoneId: string;
  primaryCategories: string[];
  purchaseHistory: string[]; // product IDs
  memberSince: string;
}

export const personas: UserPersona[] = [
  {
    id: "u1",
    fullName: "Ananya Sharma",
    phone: "+91 98765 43210",
    email: "ananya@blinkit.demo",
    avatarEmoji: "👩",
    locality: "Sector 62, Noida",
    localityZoneId: "z1",
    primaryCategories: ["Dairy, Bread & Eggs"],
    purchaseHistory: ["p1", "p2", "p3", "p4", "p5"],
    memberSince: "Jan 2025",
  },
  {
    id: "u2",
    fullName: "Rahul Verma",
    phone: "+91 98123 45678",
    email: "rahul@blinkit.demo",
    avatarEmoji: "👨",
    locality: "Sector 62, Noida",
    localityZoneId: "z1",
    primaryCategories: ["Tea, Coffee & Drinks"],
    purchaseHistory: ["p9", "p10", "p11", "p1"],
    memberSince: "Mar 2025",
  },
  {
    id: "u3",
    fullName: "Priya Sundaram",
    phone: "+91 99887 76655",
    email: "priya@blinkit.demo",
    avatarEmoji: "👩‍🦱",
    locality: "Sector 62, Noida",
    localityZoneId: "z1",
    primaryCategories: ["Baby & Infant Care"],
    purchaseHistory: ["p21", "p22", "p1", "p25"],
    memberSince: "Nov 2024",
  },
  {
    id: "u4",
    fullName: "Arjun Deshmukh",
    phone: "+91 97654 32109",
    email: "arjun@blinkit.demo",
    avatarEmoji: "🧑",
    locality: "Sector 62, Noida",
    localityZoneId: "z1",
    primaryCategories: ["Pet Care & Supplies"],
    purchaseHistory: ["p23", "p24", "p1", "p3"],
    memberSince: "Jun 2025",
  },
];

export function getPersonaById(id: string): UserPersona | undefined {
  return personas.find((p) => p.id === id);
}
