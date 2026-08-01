export interface SubscriptionItem {
  productId: string;
  quantity: number;
}

export interface Subscription {
  id: string;
  userId: string;
  status: "active" | "paused" | "cancelled";
  dayOfMonth: number; // e.g. 5th of every month
  nextExecutionDate: string; // e.g. "Aug 5, 2026"
  lastExecutionDate?: string;
  preChargeNotificationWindow: boolean; // Pre-charge notification touchpoint active!
  items: SubscriptionItem[];
}

export const subscriptions: Record<string, Subscription> = {
  u1: {
    id: "sub1",
    userId: "u1",
    status: "active",
    dayOfMonth: 5,
    nextExecutionDate: "Aug 5, 2026",
    lastExecutionDate: "Jul 5, 2026",
    preChargeNotificationWindow: true, // Pre-charge notification active!
    items: [
      { productId: "p1", quantity: 2 }, // Milk
      { productId: "p2", quantity: 1 }, // Bread
      { productId: "p3", quantity: 1 }, // Eggs
      { productId: "p4", quantity: 1 }, // Butter
    ],
  },
  u2: {
    id: "sub2",
    userId: "u2",
    status: "active",
    dayOfMonth: 10,
    nextExecutionDate: "Aug 10, 2026",
    lastExecutionDate: "Jul 10, 2026",
    preChargeNotificationWindow: true,
    items: [
      { productId: "p9", quantity: 1 }, // Coffee
      { productId: "p1", quantity: 2 }, // Milk
    ],
  },
  u3: {
    id: "sub3",
    userId: "u3",
    status: "active",
    dayOfMonth: 1,
    nextExecutionDate: "Aug 1, 2026",
    lastExecutionDate: "Jul 1, 2026",
    preChargeNotificationWindow: true,
    items: [
      { productId: "p21", quantity: 3 }, // Baby Wipes
      { productId: "p25", quantity: 1 }, // Dishwash Gel
      { productId: "p26", quantity: 1 }, // Detergent
    ],
  },
  u4: {
    id: "sub4",
    userId: "u4",
    status: "active",
    dayOfMonth: 15,
    nextExecutionDate: "Aug 15, 2026",
    lastExecutionDate: "Jul 15, 2026",
    preChargeNotificationWindow: true,
    items: [
      { productId: "p23", quantity: 1 }, // Pet Food
      { productId: "p1", quantity: 2 }, // Milk
    ],
  },
};
