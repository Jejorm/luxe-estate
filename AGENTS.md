# Agent Instructions for luxe-state

Welcome, autonomous agent! This repository contains the `luxe-state` Next.js application. Please read these guidelines carefully before making modifications to ensure consistency with the existing codebase.

## 1. Tech Stack Overview

- **Framework:** Next.js 16 (App Router)
- **UI Library:** React 19
- **Styling:** Tailwind CSS 4
- **Language:** TypeScript
- **Backend/BaaS:** Supabase (`@supabase/ssr`, `@supabase/supabase-js`)
- **Maps:** Leaflet & React-Leaflet
- **Linter & Formatter:** Biome
- **Package Manager:** Bun

## 2. Commands (Build, Lint, Test)

This project uses **Bun** as the package manager. Always use `bun` instead of `npm`, `yarn`, or `pnpm`.

- **Install Dependencies:**
  ```bash
  bun install
  ```
- **Run Development Server:**
  ```bash
  bun run dev
  ```
- **Build for Production:**
  ```bash
  bun run build
  ```
- **Lint & Format (Biome):**
  ```bash
  bun run lint
  ```
  *Note: This runs `biome check --fix` which auto-formats and fixes linting issues.*

- **Testing:**

  *There is currently no formal test suite (Jest/Vitest) defined in `package.json`. If adding tests in the future, prefer Vitest and use `bun test`.*

## 3. Code Style & Formatting Guidelines

We use **Biome** for strict and fast formatting and linting. The agent must adhere to these rules:

### Formatting Rules (from `biome.json`)
- **Indentation:** Spaces
- **Quotes:** Single quotes (`'`) for JavaScript/TypeScript strings.
- **Semicolons:** As needed (`"semicolons": "asNeeded"`). Do NOT blindly add semicolons at the end of every statement.
- **Trailing Commas:** Always include trailing commas (`"trailingCommas": "all"`).
- **Arrow Functions:** Always include parentheses around arrow function parameters (`"arrowParentheses": "always"`).
- **JSON Formatting:** 2 spaces indentation, NO trailing commas in JSON files.
- **Imports:** Biome auto-organizes imports (`"organizeImports": "on"`). Group imports logically: React/Next first, external libraries second, internal aliases (`@/...`) third, relative imports last.

### TypeScript & React Guidelines
1.  **Strict Typing:** `tsconfig.json` has `"strict": true`. Avoid `any`. Use appropriate types or interfaces for all props, states, and function returns.
2.  **React 19 Patterns:** Use modern React hooks and functional components.
3.  **Next.js 16 App Router:** Follow App Router conventions.
    - Keep Server Components as the default.
    - Only add `'use client'` at the top of the file when interactivity (hooks, event listeners) or browser APIs (like Leaflet) are strictly required.
4.  **Tailwind CSS 4:** Use Tailwind utility classes for all styling. Avoid custom CSS unless absolutely necessary.

### Path Aliasing
- Use the `@/` prefix for absolute imports from the project root. (e.g., `import { Button } from '@/components/Button'`).

### Component Structure
- Export components as default or named exports consistently with the folder's existing style.
- Keep components small, modular, and focused on a single responsibility.
- Use the Container/Presentational pattern when dealing with complex state or Supabase data fetching.

### Error Handling
- Use try/catch blocks for async operations, particularly around Supabase data fetching.
- Log errors contextually, and provide user-friendly fallback UI or toast notifications rather than failing silently.

## 4. Specific Library Guidelines

### Supabase
- Use `@supabase/ssr` for server-side auth and data fetching.
- Ensure Row Level Security (RLS) policies are respected.
- Never hardcode Supabase credentials. Rely on environment variables (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`).

### Leaflet (Maps)
- Leaflet requires the `window` object and DOM manipulation, so map components MUST be Client Components (`'use client'`).
- Ensure Leaflet CSS is imported where the map is rendered to prevent rendering issues.

## 5. Agent Workflow Rules

1. **Verify Before Coding:** Always verify the existence and structure of files using `ls` or `read` tools before modifying them.
2. **Context First:** Read `package.json`, `tsconfig.json`, and relevant configurations if you encounter dependency or path issues.
3. **No Blind Overwrites:** When modifying files, prefer targeted editing (regex/replace tools) over overwriting entire files unless the file is small.
4. **Follow the Vibe:** Mimic the existing naming conventions (camelCase for variables, PascalCase for components, kebab-case for files if that is the dominant pattern in the `/app` and `/components` directories).
5. **No Hallucinations:** Do not invent non-existent internal libraries.
