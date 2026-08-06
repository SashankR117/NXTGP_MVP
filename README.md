# ⚡ QuickDash MVP — AI-Powered Quick-Commerce Platform

> An AI-native quick-commerce platform driving cross-category discovery through intelligent subscription reviews, hyperlocal neighborhood trending engines, cross-category recommendations, and a privacy-first mutual friends graph.

---

## 🚀 Quick Links & Badges

![Next.js](https://img.shields.io/badge/Next.js-16.2.12-black?style=for-the-badge&logo=next.js)
![React](https://img.shields.io/badge/React-19.2.4-blue?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4.0-38B2AC?style=for-the-badge&logo=tailwind-css)
![Framer Motion](https://img.shields.io/badge/Framer_Motion-12.43-black?style=for-the-badge&logo=framer)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)

---

## 📖 Overview

**QuickDash MVP** is designed to demonstrate how AI and social discovery can unlock cross-category growth in quick-commerce platforms. Rather than relying solely on single-item emergency reorders, QuickDash leverages 4 core features to introduce users to adjacent product categories seamlessly.

---

## 🔥 Key Features

### 1. 📦 Monthly Subscription Review & AI Pitch Engine
- **Sticky Review Modal:** Displays pending monthly recurring essential boxes.
- **AI-Powered Complementary Recommendations:** Suggests high-affinity items from unpurchased categories (e.g., suggesting a French Press for Coffee Bean subscribers) with trial discount pricing.
- **1-Tap Approval:** Users can add trial items to their box and approve delivery with a single tap.

### 2. 🏘️ Hyperlocal Neighborhood Buzz Carousel
- **Local Social Proof:** Highlights trending items in the user's specific locality (e.g., *"#1 in Green Valley - 120+ households bought this for the first time"*).
- **Deduplication Filter:** Automatically filters out categories the user already buys frequently to optimize discovery.

### 3. 🎯 Category-Adjacent Mining Engine
- **Dynamic Banners:** Rule and vector-based engines evaluate historical category purchases to present adjacent hero recommendations (e.g., Granola & Gourmet Bakery for Coffee subscribers).

### 4. 👥 Mutual Opt-In Friends Circle Feed
- **Privacy-First Social Graph:** Enforces strict double-opt-in permissions.
- **Friend Activity Feed:** Shows curated, non-sensitive activities (liked items, frequent buys) from verified mutual connections.
- **Persona & Privacy Controls:** Live toggle for pending requests, relationship statuses, and persona switching for evaluation.

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | Next.js (App Router, React 19, TypeScript) |
| **Styling & UI** | Tailwind CSS v4, Lucide React Icons |
| **Animations** | Framer Motion (Modals, Toasts, Dynamic Transitions) |
| **Database & Auth** | Supabase (PostgreSQL with RLS) / Internal Data Engine |
| **AI Layer** | Vercel AI SDK (Gemini / OpenAI API with Structured JSON Schema) |
| **Hosting & Deployment** | Vercel Serverless & Edge Network |

---

## ⚡ Getting Started

### Prerequisites

- **Node.js**: v18.0.0 or higher
- **npm** / **yarn** / **pnpm** / **bun**

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/YOUR_USERNAME/YOUR_REPOSITORY.git
   cd NXTGP_MVP/quickdash
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables (Optional / Mock default included):**
   Copy `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```
   Provide your Supabase URL & API keys if connecting to a live backend:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
   OPENAI_API_KEY=your-openai-api-key
   ```

4. **Run the development server:**
   ```bash
   npm run dev
   ```

5. **Open the app:**
   Navigate to [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📂 Project Architecture

```
NXTGP_MVP/
├── architecture.md           # Detailed architecture & technical specification
├── README.md                 # Project documentation (this file)
└── quickdash/                # Next.js Application Root
    ├── app/                  # Next.js App Router (Pages, Layouts, API Routes)
    │   ├── page.tsx          # Home Feed & Core MVP View
    │   └── layout.tsx        # Global Layout & Providers
    ├── components/           # UI & Feature Components
    │   ├── ui/               # PersonaSwitcher, Toast, Common UI
    │   └── subscriptions/    # Subscription Review & AI Pitch Modal
    ├── lib/                  # Data models, mock DB, API clients
    │   └── data/             # Products, Subscriptions, Friends activity mock data
    ├── public/               # Static assets & media
    └── package.json          # Project dependencies & scripts
```

---

## 🧪 Evaluator & Grader Walkthrough

To review the interactive functional simulation:

1. **Test AI Subscription Pitch:**
   - Look at the top sticky card: *"Your Monthly Essentials Box is Ready for Review"*.
   - View the AI complementary item recommendation (e.g., French Press).
   - Tap **"+ Add to Subscription Box"** and click **"Approve & Schedule"**.

2. **Explore Neighborhood Buzz:**
   - Scroll to **Neighborhood Buzz**.
   - Note the hyperlocal proof badges (e.g., *120+ households near you*).
   - Test 1-Tap Add to Cart.

3. **Check Friends Circle:**
   - Switch to the **Friends Circle** tab or persona overlay.
   - Accept a pending request and verify that the feed dynamically updates with mutual friend activities.

4. **Reset Demo Data:**
   - Click the floating **"🔄 Reset Demo Data"** button at the bottom-right to reset to initial benchmark state.

---

## 📄 License

This project is open-source and available under the [MIT License](LICENSE).
