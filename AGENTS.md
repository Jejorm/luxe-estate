# AGENTS.md

This document provides essential information for AI agents interacting with the `luxe-state` repository.

## Project Overview
`luxe-state` is a Next.js 16 application using React 19, TypeScript, Tailwind CSS 4, and Supabase.

## Build, Lint, and Test Commands

*   **Build:** `npm run build`
*   **Lint:** `npm run lint` (uses ESLint/Biome)
*   **Format/Fix:** `npx @biomejs/biome check --apply .`
*   **Testing:** This project does not currently have a standard test runner configured. If adding tests, prefer `vitest` or `jest` and update this document.

## Code Style Guidelines

### General
*   **Language:** TypeScript is required.
*   **Formatting:** Use `biome` for all formatting and linting.
*   **Indentation:** 2 spaces (configured in `biome.json`).

### JavaScript/TypeScript
*   **Quotes:** Single quotes.
*   **Semicolons:** As needed (no mandatory semicolons).
*   **Trailing Commas:** All (in objects, arrays, and function parameters).
*   **Arrow Functions:** Always use parentheses around arguments.

### Imports
*   `biome` is configured to automatically organize imports.
*   Use relative paths unless path aliases are explicitly defined in `tsconfig.json`.

### Types
*   Avoid `any`.
*   Favor interface declarations for objects, `type` for unions/intersections.

### Naming Conventions
*   **Components:** PascalCase (e.g., `HeaderComponent`).
*   **Variables/Functions:** camelCase.
*   **Constants:** UPPER_CASE.

### Error Handling
*   Use standard `try...catch` blocks for asynchronous operations, especially with Supabase client calls.
*   Avoid swallowing errors; log them to the console or handle them gracefully in the UI.

### Component Design
*   Functional components with hooks.
*   Use Tailwind CSS 4 for all styling (defined in CSS variables/Tailwind directives).
*   Keep logic in separate hooks (`/lib` or custom `use` hooks) when possible.

## Project Structure
*   `/app`: Next.js App Router.
*   `/components`: Reusable UI components.
*   `/lib`: Utility functions, API helpers, and shared state/context.
*   `/public`: Static assets.

## AI Agent Directives
*   **Safety:** Always verify dependencies before adding new ones.
*   **Minimalism:** Only modify existing files or create files when necessary to solve the current task.
*   **Context:** Read relevant files (`tsconfig.json`, `package.json`, target component) before implementing changes.
*   **Verification:** Run `npm run lint` after making changes to ensure code quality.
