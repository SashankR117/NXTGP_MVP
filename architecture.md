# QuickDash MVP — Architecture & Deployment Specification

> **Project Name:** QuickDash MVP  
> **Target Audience:** Review Graders & Evaluators  
> **Core Objective:** Demonstrate an AI-native quick-commerce platform driving cross-category discovery through 4 core features, deployed on modern serverless cloud infrastructure without real-world logistics or payment processing.

---

## 1. System Scope & Boundary

To ensure a bug-free, zero-latency experience for reviewers, the MVP operates on a **Functional Simulation Scope**:

| In-Scope (Interactive & Functional) | Out-of-Scope (Mocked/Disabled) |
| :--- | :--- |
| ✅ User Authentication & Demo Persona Switching | ❌ Real Payment Gateway Integration (Stripe/Razorpay) |
| ✅ Monthly Subscription Review Modal & Approval Flow | ❌ Real dark store inventory allocation |
| ✅ AI-Powered Tightly Complementary Add-On Engine | ❌ Real-time driver GPS tracking |
| ✅ Hyperlocal Neighborhood Buzz Carousel with real filters | ❌ External web tracking/cookie scraping |
| ✅ Mutual Opt-In Friends Circle Feed & Permission Controls | ❌ Actual physical fulfillment/delivery |

---

## 2. System Architecture Diagram

```
                           ┌──────────────────────────────────────────┐
                           │             REVIEW GRADER                │
                           │  (Mobile Viewport / Desktop Browser)     │
                           └────────────────────┬─────────────────────┘
                                                │ HTTPS / Web
                                                ▼
┌─────────────────────────────────────────────────────────────────────────────────────────────────┐
│                                 FRONTEND & HOSTING (Vercel)                                     │
│  Next.js 14+ (App Router) + Tailwind CSS + Framer Motion + Shadcn UI                            │
│                                                                                                 │
│  ┌───────────────────────┐  ┌───────────────────────┐  ┌─────────────────────────────────────┐  │
│  │ Screen 1: Sub Review  │  │ Screen 2: Home Feed   │  │ Screen 3: Friends Circle            │  │
│  └───────────────────────┘  └───────────────────────┘  └─────────────────────────────────────┘  │
└──────────────────────────────────────────┬──────────────────────────────────────────────────────┘
                                           │
┌──────────────────┴──────────────────┐
│ Server Actions / API Routes         │
└─────────┬──────────────────┬────────┘
          │                  │
          ▼                  ▼
┌──────────────────────────────────────────┐   ┌──────────────────────────────────────────────────┐
│          AI LAYER (Vercel AI SDK)        │   │           DATABASE & AUTH (Supabase)             │
│  LLM: Gemini / OpenAI API                │   │  PostgreSQL + Row-Level Security (RLS)           │
│                                          │   │                                                  │
│  • Category-Adjacent Rule Engine         │   │  • Users & Mutual Friends Graph                  │
│  • Complementary Item Pitch Generator    │   │  • Subscriptions & Product Catalog               │
│  • Social Activity Synthesizer           │   │  • Neighborhood Aggregated Purchase Events       │
└──────────────────────────────────────────┘   └──────────────────────────────────────────────────┘
```

---

## 3. Technology Stack

| Layer | Technology |
|-------|------------|
| **Frontend Framework** | Next.js 14+ (React, App Router, TypeScript) |
| **Styling & Components** | Tailwind CSS, Shadcn UI, Lucide React Icons |
| **Animations** | Framer Motion (modal transitions, toast notifications) |
| **Backend & API** | Next.js Server Actions & API Routes |
| **Database & Auth** | Supabase (Hosted PostgreSQL, Auth, Row-Level Security) |
| **AI Engine** | Vercel AI SDK + OpenAI / Gemini API (Structured JSON schema outputs) |
| **Deployment & Hosting** | Vercel (Automated CI/CD, Edge Network, Global SSL) |

---

## 4. Database Schema (PostgreSQL / Supabase)

### 4.1 Users & Personas

```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  avatar_url TEXT,
  locality TEXT DEFAULT 'Green Valley',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 4.2 Product Catalog

```sql
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  category TEXT NOT NULL, -- 'Groceries', 'Breakfast', 'Health', 'Pet Supplies', 'Personal Care'
  price DECIMAL(10, 2) NOT NULL,
  trial_price DECIMAL(10, 2),
  image_url TEXT NOT NULL,
  rating DECIMAL(3, 2) DEFAULT 4.8,
  review_count INT DEFAULT 120,
  is_trial_eligible BOOLEAN DEFAULT FALSE
);
```

### 4.3 User Subscriptions

```sql
CREATE TABLE subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  scheduled_date DATE NOT NULL,
  status TEXT DEFAULT 'pending_approval', -- 'pending_approval', 'approved', 'delivered'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE subscription_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  subscription_id UUID REFERENCES subscriptions(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id),
  quantity INT DEFAULT 1
);
```

### 4.4 Mutual Friends Graph

```sql
CREATE TABLE friend_connections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  requester_id UUID REFERENCES users(id),
  addressee_id UUID REFERENCES users(id),
  status TEXT DEFAULT 'accepted', -- 'pending', 'accepted', 'blocked'
  UNIQUE(requester_id, addressee_id)
);
```

### 4.5 Friends Activity & Likes

```sql
CREATE TABLE user_product_activities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  product_id UUID REFERENCES products(id),
  activity_type TEXT NOT NULL, -- 'liked', 'frequently_bought', 'recently_bought'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 4.6 Hyperlocal Aggregate Stats

```sql
CREATE TABLE locality_trending_stats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  locality TEXT NOT NULL,
  product_id UUID REFERENCES products(id),
  first_time_purchases_count INT DEFAULT 0,
  time_window TEXT DEFAULT 'past_14_days'
);
```

---

## 5. Feature Execution Architecture

### Feature 1: Subscription Review & AI Complementary Pitch Engine

**Trigger:**  
Upon opening the app, if a `pending_approval` subscription exists for the user, display a sticky review card: *"Your Monthly Essentials Box is Ready for Review"*.

**AI Logic:**  
The system sends current `subscription_items` to the LLM via Vercel AI SDK with a structured schema constraint.

**Structured Prompt Specification:**

> "Given subscription items: [Whole Milk, Arabica Coffee Beans, Brown Bread], identify ONE highly complementary product from an unpurchased category (e.g., French Press, Flavored Syrup). Return JSON with `productId`, `pitchHeadline`, `strikethroughPrice`, and `trialDiscountPrice`."

**State Transition:**  
- Tapping **"+ Add to Subscription Box"** attaches the trial product to `subscription_items`, updates total price.
- **"Approve & Schedule"** updates status to `approved`.

---

### Feature 2: Hyperlocal Neighborhood Buzz Engine

**Data Source:**  
Query `locality_trending_stats` where `locality = user.locality`.

**Deduplication Filtering:**
1. Query user's 60-day transaction history.
2. Strip out products matching categories already purchased by the user.

**UI Rendering:**  
Render a horizontal swipeable row displaying:
- **Social Tag:** `#1 in Green Valley`
- **Proof Badge:** `🔥 120+ households near you bought this for the first time`
- **Action:** 1-Tap **+ Add** button triggering immediate feedback toast.

---

### Feature 3: Category-Adjacent Mining Engine

**Rule Engine & Vector Adjacency:**

```typescript
const ADJACENCY_MAP: Record<string, string> = {
  "Coffee & Tea": "Bakery & Gourmet",
  "Fitness & Protein": "Personal Care & Supplements",
  "Baby Wipes": "Infant Nutrition",
  "Pet Food": "Pet Grooming & Toys"
};
```

**Execution:**  
The home screen hero surface evaluates the user's primary historical category and dynamically injects the adjacent hero banner (e.g., *"Up Your Breakfast Game"* featuring Gourmet Granola for Coffee subscribers).

---

### Feature 4: Mutual Opt-In Friends Circle

**Security & Privacy Enforcement:**  
Database queries for social feeds enforce double-opt-in permissions via SQL joins:

```sql
SELECT * FROM user_product_activities
WHERE user_id IN (
  SELECT addressee_id FROM friend_connections
  WHERE requester_id = auth.uid() AND status = 'accepted'
  UNION
  SELECT requester_id FROM friend_connections
  WHERE addressee_id = auth.uid() AND status = 'accepted'
)
ORDER BY created_at DESC;
```

**Feed Render:**  
Displays friend activity cards explicitly scoped to mutual connections:

- `Priya S. ❤️ Liked an item from Personal Care`
- `Rahul M. 🔁 Frequently Buys from Health & Fitness`

**Interactive Demo Controls:**  
Includes a privacy status bar enabling reviewers to toggle connection states (Accept Request, Manage Visibility) live during evaluation.

---

## 6. Hosting, Security & Deployment Pipeline

```
GitHub Repository (main branch)
       │
       │ Automated Git Push Trigger
       ▼
Vercel Deployment Pipeline
       ├── 1. Build Next.js App & Typecheck
       ├── 2. Inject Environment Variables (NEXT_PUBLIC_SUPABASE_URL, OPENAI_API_KEY)
       └── 3. Deploy to Global Edge CDN
               │
               └──► Hosted URL: https://quickdash-mvp.vercel.app
```

### Security & Demo Integrity Measures

| Measure | Description |
|---------|-------------|
| **API Key Security** | All LLM API keys are isolated server-side within Next.js Server Actions. |
| **Row-Level Security (RLS)** | Database policy permits read access to seed catalogs while restricting write access to authenticated demo session tokens. |
| **Reset State Utility** | A persistent floating button labeled **"🔄 Reset Demo Data"** restores all database entries to their initial benchmark state in one tap. |

---

## 7. Grader Verification Script

Embed this guide directly inside a built-in **"Grader Guide"** overlay within the application UI:

```
┌────────────────────────────────────────────────────────────────────────┐
│ 🧪 QUICKDASH MVP EVALUATION SCRIPT                                     │
├────────────────────────────────────────────────────────────────────────┤
│ Step 1: Open the Subscription Review Card at the top of the app.       │
│         -> Verify the AI-recommended complementary item (French Press).│
│         -> Tap "+ Add to Box" and click "Approve & Schedule".        │
│                                                                        │
│ Step 2: Scroll down to "Neighborhood Buzz".                            │
│         -> Observe hyperlocal proof (120+ households in Green Valley).│
│         -> Confirm filtering of unpurchased categories.                │
│                                                                        │
│ Step 3: Tap the "Friends Circle" navigation tab.                      │
│         -> Accept the pending mutual connection request from "Rahul M."│
│         -> Verify Rahul's liked and frequent buys populate the feed.   │
│                                                                        │
│ Step 4: Click "🔄 Reset Demo Data" (bottom right) to restart test.    │
└────────────────────────────────────────────────────────────────────────┘
```

---

*Document Version: MVP v1.0*  
*Last Updated: August 2026*
