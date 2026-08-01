"use client";

import React, { createContext, useContext, useReducer, type ReactNode } from "react";
import { personas, type UserPersona } from "./data/users";
import { subscriptions, type Subscription, type SubscriptionItem } from "./data/subscriptions";
import { friendConnections, initialShelfItems, type FriendConnection, type CuratedShelfItem } from "./data/friends";
import { getProductById } from "./data/products";

export interface AppState {
  currentPersona: UserPersona;
  subscription: Subscription;
  friendConnectionsList: FriendConnection[];
  shelfItemsList: CuratedShelfItem[];
  cart: { productId: string; quantity: number }[];
  toasts: { id: string; message: string; type: "success" | "info" }[];
  graderGuideOpen: boolean;
}

type Action =
  | { type: "SWITCH_PERSONA"; personaId: string }
  // Module 1: Subscriptions
  | { type: "UPDATE_SUBSCRIPTION_DAY"; dayOfMonth: number }
  | { type: "SKIP_NEXT_CYCLE" }
  | { type: "TOGGLE_SUBSCRIPTION_STATUS" }
  | { type: "ADD_TO_SUBSCRIPTION"; productId: string; quantity?: number }
  | { type: "UPDATE_SUBSCRIPTION_ITEM_QUANTITY"; productId: string; quantity: number }
  | { type: "REMOVE_FROM_SUBSCRIPTION"; productId: string }
  // Module 3: Circle - Friends Connect
  | { type: "ACCEPT_FRIEND_REQUEST"; connectionId: string }
  | { type: "REJECT_FRIEND_REQUEST"; connectionId: string }
  | { type: "DISCONNECT_FRIEND"; connectionId: string }
  | { type: "SEND_FRIEND_REQUEST_BY_PHONE"; phone: string }
  | { type: "TOGGLE_SHELF_ITEM_VISIBILITY"; itemId: string }
  | { type: "TOGGLE_CATEGORY_VISIBILITY"; category: string; visible: boolean }
  | { type: "ADD_SHELF_ITEM"; productId: string; itemType: "frequent" | "liked" }
  // General Cart & Utilities
  | { type: "ADD_TO_CART"; productId: string }
  | { type: "DECREMENT_CART"; productId: string }
  | { type: "SHOW_TOAST"; message: string; toastType?: "success" | "info" }
  | { type: "DISMISS_TOAST"; id: string }
  | { type: "TOGGLE_GRADER_GUIDE" }
  | { type: "RESET" };

function buildInitialState(personaId: string = "u1"): AppState {
  const persona = personas.find((p) => p.id === personaId) || personas[0];
  const sub = subscriptions[persona.id] || subscriptions["u1"];

  return {
    currentPersona: persona,
    subscription: { ...sub, items: sub.items.map((i) => ({ ...i })) },
    friendConnectionsList: friendConnections.map((fc) => ({ ...fc })),
    shelfItemsList: initialShelfItems.map((si) => ({ ...si })),
    cart: [],
    toasts: [],
    graderGuideOpen: false,
  };
}

function appReducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case "SWITCH_PERSONA":
      return buildInitialState(action.personaId);

    // Module 1 Actions
    case "UPDATE_SUBSCRIPTION_DAY":
      return {
        ...state,
        subscription: { ...state.subscription, dayOfMonth: action.dayOfMonth },
      };

    case "SKIP_NEXT_CYCLE":
      return {
        ...state,
        subscription: {
          ...state.subscription,
          nextExecutionDate: "Sep " + state.subscription.dayOfMonth + ", 2026",
        },
      };

    case "TOGGLE_SUBSCRIPTION_STATUS":
      return {
        ...state,
        subscription: {
          ...state.subscription,
          status: state.subscription.status === "active" ? "paused" : "active",
        },
      };

    case "ADD_TO_SUBSCRIPTION": {
      const exists = state.subscription.items.find(
        (i) => i.productId === action.productId
      );
      let updatedItems = [...state.subscription.items];
      if (exists) {
        updatedItems = updatedItems.map((i) =>
          i.productId === action.productId
            ? { ...i, quantity: i.quantity + (action.quantity || 1) }
            : i
        );
      } else {
        updatedItems.push({ productId: action.productId, quantity: action.quantity || 1 });
      }
      return {
        ...state,
        subscription: { ...state.subscription, items: updatedItems },
      };
    }

    case "UPDATE_SUBSCRIPTION_ITEM_QUANTITY": {
      if (action.quantity <= 0) {
        return {
          ...state,
          subscription: {
            ...state.subscription,
            items: state.subscription.items.filter((i) => i.productId !== action.productId),
          },
        };
      }
      return {
        ...state,
        subscription: {
          ...state.subscription,
          items: state.subscription.items.map((i) =>
            i.productId === action.productId ? { ...i, quantity: action.quantity } : i
          ),
        },
      };
    }

    case "REMOVE_FROM_SUBSCRIPTION":
      return {
        ...state,
        subscription: {
          ...state.subscription,
          items: state.subscription.items.filter((i) => i.productId !== action.productId),
        },
      };

    // Module 3 Circle Actions
    case "ACCEPT_FRIEND_REQUEST":
      return {
        ...state,
        friendConnectionsList: state.friendConnectionsList.map((fc) =>
          fc.id === action.connectionId ? { ...fc, status: "mutual" as const } : fc
        ),
      };

    case "REJECT_FRIEND_REQUEST":
      return {
        ...state,
        friendConnectionsList: state.friendConnectionsList.filter(
          (fc) => fc.id !== action.connectionId
        ),
      };

    case "DISCONNECT_FRIEND":
      return {
        ...state,
        friendConnectionsList: state.friendConnectionsList.filter(
          (fc) => fc.id !== action.connectionId
        ),
      };

    case "SEND_FRIEND_REQUEST_BY_PHONE": {
      const cleanPhone = action.phone.trim();
      const hash = "hash_" + cleanPhone.slice(-4) + "_" + Date.now().toString().slice(-4);

      const matchedUser = personas.find(
        (p) => p.phone.includes(cleanPhone) || p.id !== state.currentPersona.id
      );

      const newConnection: FriendConnection = {
        id: "fc_" + Date.now(),
        requesterId: state.currentPersona.id,
        addresseeId: matchedUser ? matchedUser.id : "u2",
        status: "pending",
        hashedPhoneMatch: hash,
        createdAt: new Date().toISOString().split("T")[0],
      };

      return {
        ...state,
        friendConnectionsList: [...state.friendConnectionsList, newConnection],
      };
    }

    case "TOGGLE_SHELF_ITEM_VISIBILITY":
      return {
        ...state,
        shelfItemsList: state.shelfItemsList.map((item) =>
          item.id === action.itemId
            ? { ...item, visibilityFlag: !item.visibilityFlag }
            : item
        ),
      };

    case "TOGGLE_CATEGORY_VISIBILITY":
      return {
        ...state,
        shelfItemsList: state.shelfItemsList.map((item) =>
          item.userId === state.currentPersona.id && item.category === action.category
            ? { ...item, visibilityFlag: action.visible }
            : item
        ),
      };

    case "ADD_SHELF_ITEM": {
      const product = getProductById(action.productId);
      if (!product) return state;
      const newItem: CuratedShelfItem = {
        id: "s_" + Date.now(),
        userId: state.currentPersona.id,
        productId: action.productId,
        type: action.itemType,
        cadenceLabel: action.itemType === "frequent" ? "Buys monthly" : undefined,
        visibilityFlag: !product.isSensitive,
        category: product.category,
        isDefaultHidden: product.isSensitive,
      };
      return {
        ...state,
        shelfItemsList: [...state.shelfItemsList, newItem],
      };
    }

    // Cart Actions
    case "ADD_TO_CART": {
      const existing = state.cart.find((c) => c.productId === action.productId);
      if (existing) {
        return {
          ...state,
          cart: state.cart.map((c) =>
            c.productId === action.productId ? { ...c, quantity: c.quantity + 1 } : c
          ),
        };
      }
      return {
        ...state,
        cart: [...state.cart, { productId: action.productId, quantity: 1 }],
      };
    }

    case "DECREMENT_CART": {
      const existing = state.cart.find((c) => c.productId === action.productId);
      if (!existing) return state;
      if (existing.quantity <= 1) {
        return {
          ...state,
          cart: state.cart.filter((c) => c.productId !== action.productId),
        };
      }
      return {
        ...state,
        cart: state.cart.map((c) =>
          c.productId === action.productId ? { ...c, quantity: c.quantity - 1 } : c
        ),
      };
    }

    case "SHOW_TOAST":
      return {
        ...state,
        toasts: [
          ...state.toasts,
          { id: Date.now().toString(), message: action.message, type: action.toastType || "success" },
        ],
      };

    case "DISMISS_TOAST":
      return {
        ...state,
        toasts: state.toasts.filter((t) => t.id !== action.id),
      };

    case "TOGGLE_GRADER_GUIDE":
      return { ...state, graderGuideOpen: !state.graderGuideOpen };

    case "RESET":
      return buildInitialState(state.currentPersona.id);

    default:
      return state;
  }
}

const AppContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<Action>;
} | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, "u1", buildInitialState);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
