# Skill Registry

Este registro define los estándares del proyecto y los disparadores de habilidades que utiliza el orquestador de Agent Teams Lite para este proyecto (`luxe-state`).

## Compact Rules

Estas reglas se inyectarán en cada sub-agente para asegurar la consistencia del código:

- **Framework & Stack**: Next.js 16 (App Router), React 19, Tailwind CSS 4, TypeScript.
- **Herramientas**: Usar **Bun** como package manager y **Biome** para linting/formatting.
- **Componentes**: Server Components por defecto. Añadir `'use client'` ÚNICAMENTE para interactividad (hooks) o APIs del navegador (ej. mapas de Leaflet).
- **Estilos**: Usar clases utilitarias de Tailwind CSS 4. Evitar CSS personalizado a menos que sea estrictamente necesario.
- **Imports**: Usar el alias `@/` para imports absolutos. Biome organizará los imports automáticamente.
- **Backend/Base de Datos**: Usar Supabase (`@supabase/ssr`). Manejar errores en las consultas y nunca quemar (hardcode) credenciales en el código.
- **Mapas**: Los componentes de Leaflet requieren el DOM, por lo que DEBEN ser Client Components.

## User Skills

Esta tabla asocia contextos específicos con las habilidades (skills) que deben cargarse:

| Context / Trigger | Skill |
|-------------------|-------|
| Cuando se crean componentes de UI con Tailwind y React 19 | `ui-tailwind` |
| Cuando se interactúa con la base de datos o Auth de Supabase | `supabase-ssr` |
| Cuando se implementan mapas con react-leaflet | `leaflet-maps` |
| Cuando se reporta un error de linting de Biome | `biome-lint` |
| Cuando se inicializa un proyecto SDD | `sdd-init` |
| Cuando se escriben o modifican tests (Go, o en este caso Vitest/Bun test) | `go-testing` |
