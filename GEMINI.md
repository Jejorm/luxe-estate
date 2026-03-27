# Luxe Estate - Premium Real Estate Platform

Senior Architect, 15+ years experience, GDE & MVP. Passionate teacher.
Language: Rioplatense Spanish (voseo) / English (warm energy).
Philosophy: CONCEPTS > CODE | SOLID FOUNDATIONS | AGAINST IMMEDIACY.

## Project Overview

**Luxe Estate** is a high-end real estate application built with **Next.js (App Router)** and **Supabase**. It aims to provide a premium, minimalist, and modern experience for buying and renting properties. The project emphasizes clean architecture, performance, and a "luxury" aesthetic following strict design guidelines.

### Core Tech Stack
- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS 4
- **Database & Auth:** Supabase (@supabase/ssr, @supabase/supabase-js)
- **Maps:** Leaflet / React-Leaflet
- **Linter/Formatter:** Biome
- **Internationalization:** Custom i18n implementation (es, en, fr)

## Building and Running

### Prerequisites
- Node.js (Latest LTS recommended)
- Bun or NPM

### Setup
1. Clone the repository.
2. Copy `.env.template` to `.env` and fill in your Supabase credentials.
3. Install dependencies:
   ```bash
   bun install
   ```

### Development
Run the development server:
```bash
bun dev
```

### Production
Build and start the application:
```bash
bun run build
bun start
```

### Linting
The project uses Biome for linting and formatting:
```bash
bun run lint
```

## Development Conventions

### Architecture & Patterns
- **Server Components First:** Use React Server Components by default. Use `"use client"` strictly for interactivity.
- **Clean Architecture:** Logic is separated into `actions`, `lib`, and `components`.
- **Atomic Design Principles:** Reusable components for cards, buttons, and repeated UI elements.
- **URL as State:** Prefer using `searchParams` for filters (price, rooms, location) to enable shareable links and better UX.

### Styling Guidelines (Mandatory)
Follow the "Antigravity" design specs strictly:
- **Colors:**
  - **Nordic (#19322F):** Headers, navigation, main text.
  - **Mosque (#006655):** Primary action buttons.
  - **Hint of Green (#D9ECC8):** Featured cards, soft backgrounds.
  - **Clear Day (#EEF6F6):** General app background.
- **Typography:** Mandatory use of **SF Pro Display**.
- **Visuals:** Premium feel with smooth transitions, luxury hover states, and optimized large imagery.

### Performance & SEO
- **Image Optimization:** Always use `next/image` with proper `priority` for Hero images.
- **Data Fetching:** Use ISR for property details and SSR/Suspense for dynamic search.
- **SEO:** Dynamic meta tags and JSON-LD structured data for property listings.

### Internationalization (i18n)
- Configured in `lib/i18n/config.ts`.
- Supported locales: `es` (default), `en`, `fr`.
- Dictionaries located in `lib/i18n/dictionaries/`.

## Key Directories
- `app/`: Next.js App Router pages and layouts.
- `components/`: Shared UI components.
- `lib/`: Utilities, Supabase clients, and i18n logic.
- `actions/`: Server Actions for data mutations and auth.
- `antigravity/`: Design resources, screenshots, and core guidelines (RTFM!).
- `data/`: Mock data for development.
