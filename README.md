# 🍔 Food-D

Food-D is an enterprise-grade, full-stack food ordering platform with isolated multi-admin restaurant partitioning and a real-time AI-powered "Cravings Assistant" that recommends meal combos based on natural language prompts. Built serverless-first for Vercel + MongoDB Atlas.

**Live Demo:** https://food-done.vercel.app/
**Repo:** https://github.com/ankitwjha/Food-D

---

## Features

- 🏪 Multi-admin architecture — multiple restaurants operate independently on one platform, each with isolated menu data
- 🤖 AI Cravings Assistant — describe what you want (e.g. *"Spicy noodle combo under ₹300"*) and get an AI-curated meal set from the live menu
- 🛒 One-click "Add Combo to Cart" — adds all AI-recommended items in a single tap
- 💳 Stripe payment integration with order verification
- 🔐 JWT + Bcrypt authentication for both customers and restaurant admins
- 🖼️ Serverless-safe image uploads (works on Vercel's read-only filesystem)
- ✨ Animated soft-delete for order removal — smooth CSS-driven exit instead of an abrupt disappearance
- 🌗 Dark-mode-first glassmorphic UI

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend (Customer) | React.js (Vite SPA), React Router DOM v6, Context API |
| Admin Console | React.js (separate protected SPA) |
| Styling | CSS3 (HSL, keyframe animations, glassmorphism) |
| HTTP | Axios + Interceptors |
| Notifications | React Toastify |
| Backend | Node.js, Express.js (Vercel serverless functions) |
| Database | MongoDB Atlas + Mongoose |
| Auth | JWT, Bcrypt password hashing |
| File Uploads | Multer (local) / Base64 client-side serialization (serverless) |
| AI | Google Gen AI SDK — Gemini 2.5 Flash |
| Payments | Stripe API |
| Hosting | Vercel |

---

## System Architecture

```
Customer / Admin → HTTPS Request
        ↓
React SPA (frontend / admin) → Axios → Express API (Vercel serverless)
        ↓
Controllers → Mongoose → MongoDB Atlas
        ↓
AI Controller → Gemini 2.5 Flash → Structured JSON → React (cart injection)
        ↓
Stripe Checkout → Payment verification → Order status update
```

---

## AI Cravings Assistant — How It Works

1. **User Input** — customer submits a natural-language prompt (e.g. *"Spicy noodle combo under ₹300"*)
2. **Context Retrieval** — backend fetches active menu items from MongoDB, stripped down to only `_id`, `name`, `price`, `description` (~80% smaller payload than sending full records with images)
3. **Prompt Injection** — the trimmed menu is injected into a system prompt for Gemini 2.5 Flash
4. **Structured Generation** — Gemini returns strict JSON: a `reason` (chef rationale) and `recommendedItemIds` (real MongoDB IDs only)
5. **One-Click Cart Injection** — the UI parses the response and lets the user add the entire recommended combo to their cart in a single tap

```js
const systemPrompt = `
You are an expert chef assistant for "food-D". Given a user prompt and menu list:
1. Recommend a meal set of 1 to 4 items strictly matching the menu.
2. Return strictly JSON with:
   - reason: Explanation of the chef pairing.
   - recommendedItemIds: Array of matching MongoDB string IDs.
`;
```

Enforcing a strict output schema guarantees every AI-recommended dish actually exists in the live database — no hallucinated items ever reach the cart.

---

## Key Engineering Highlights

**1. Serverless-Safe Image Pipeline**
Vercel's read-only filesystem breaks traditional Multer disk uploads. Food-D detects the environment and automatically switches between disk storage (local dev) and Base64 client-side serialization (serverless), so image uploads never crash regardless of where it's deployed.

**2. Boot-Time Self-Healing Schema Sync**
On every backend boot, the app scans for legacy records missing `owner` or `restaurantName` fields (left over from single-tenant → multi-tenant migration) and repairs them automatically — no manual data migration scripts needed.

**3. Animated Soft-Delete**
Removing a delivered order doesn't just vanish — a CSS keyframe animation (500ms shrink/fade/slide) plays first, synced with a `setTimeout` before the state update and an async MongoDB write (`hiddenByUser: true`).

**4. Token-Optimized AI Context**
Only essential fields are sent to Gemini (no Base64 images), cutting API token usage by ~80% and keeping AI responses fast and predictable.

**5. Isolated Multi-Admin Partitioning**
Each restaurant admin's dishes are tagged with their identity on creation. Admin queries are scoped so owners only ever see and manage their own catalog, while customers see the correct restaurant name on every dish.

---

## Getting Started

### Prerequisites
- Node.js 18+
- A MongoDB Atlas connection string
- A Google Gemini API key
- A Stripe account (test keys are fine for development)

### Installation

```bash
git clone https://github.com/ankitwjha/Food-D.git
cd Food-D

# Install dependencies for all three apps
cd frontend && npm install
cd ../admin && npm install
cd ../backend && npm install
```

### Environment Variables

Create a `.env` file inside `backend/`:

```env
MONGODB_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_jwt_secret
GEMINI_API_KEY=your_google_gemini_api_key
STRIPE_SECRET_KEY=your_stripe_secret_key
```

### Run locally

```bash
# Backend
cd backend && npm run server

# Frontend (customer app)
cd frontend && npm run dev

# Admin console
cd admin && npm run dev
```

---

## Project Structure

```
Food-D/
├── frontend/               # Customer Web Application
│   └── src/
│       ├── components/      # Navbar, AIPlateBuilder, FoodCard
│       ├── context/         # StoreContext (Cart, Auth, API state)
│       └── pages/           # Home, Cart, PlaceOrder, Verify
├── admin/                   # Restaurant Admin Console
│   └── src/
│       └── pages/            # Add, ListItems, Orders, AdminAuth
└── backend/                 # Express API (Vercel serverless)
    ├── api/index.js          # Serverless entrypoint
    ├── controllers/           # foodController, orderController, aiController
    ├── models/                 # Food, User, Admin, Order (Mongoose)
    └── routes/                 # Express endpoint routers
```

---

## Deployment

Deployed on [Vercel](https://vercel.com) across three separate apps (frontend, admin, backend), each with its own `vercel.json` for routing/rewrites. To deploy your own instance, import each folder as a separate Vercel project and configure the environment variables above in the backend project's settings.

---

## License

This project is open source and available under the [MIT License](./LICENSE).

---

## Contact

**Ankit Kumar**
📧 ajha76912@gmail.com
🔗 [GitHub](https://github.com/ankitwjha) · [LinkedIn](https://www.linkedin.com/in/ankit-jha-55b07737b)
