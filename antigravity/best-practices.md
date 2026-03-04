# Best Practices for Real Estate Next.js Apps

## 🚀 Performance & Data Fetching
*   **ISR for Properties:** Use Incremental Static Regeneration para las páginas de detalles de las propiedades para carga ultrarrápida y datos frescos.
*   **SSR for Search:** Usa Server-Side Rendering (o React Suspense) para los resultados de búsqueda dinámicos.
*   **Targeted Revalidation:** Revalida por etiquetas (`revalidateTag`) cuando una propiedad cambia de precio o se vende, en lugar de reconstruir todo.
*   **Image Optimization:** Usa el componente `<Image>` de Next.js. Asegura formatos WebP/AVIF y prevención de *Layout Shift* (CLS).
*   **Prioritize Hero Images:** Agrega `priority={true}` a la imagen principal de la propiedad para mejorar el LCP (Largest Contentful Paint).
*   **Lazy Load Maps:** Carga los mapas interactivos de forma diferida (lazy loading) o usa un placeholder estático inicial para no bloquear el hilo principal.
*   **Optimized Fonts:** Usa `next/font` para evitar el FOUT y acelerar la carga de la tipografía de la marca.

## 🔎 SEO & Searchability
*   **Dynamic Meta Tags:** Genera títulos y descripciones dinámicas basados en el precio, cuartos y ubicación de cada propiedad.
*   **Structured Data (JSON-LD):** Implementa schema markup de `RealEstateListing` o `SingleFamilyResidence` para aparecer con *Rich Snippets* en Google.
*   **Semantic Built URLs:** Diseña URLs descriptivas (ej. `/properties/modern-villa-miami-123`) en lugar de usar solamente UUIDs genéricos.
*   **Dynamic XML Sitemaps:** Genera sitemaps automáticamente para que los motores de búsqueda indexen tus nuevas propiedades al instante.
*   **Open Graph & Twitter Cards:** Asegúrate de agregar las metaetiquetas correctas con la imagen de la propiedad para cuando los usuarios compartan los enlaces por WhatsApp/Redes Sociales.

## 🧠 UX, UI & State Management
*   **URL as State (searchParams):** Guarda todos los filtros (precio, camas, ubicación) en la URL para permitir compartir enlaces, recargar la página y usar el botón de "atrás".
*   **Debounce Filters:** Agrega un retraso (debounce) en los inputs de búsqueda/filtros para evitar peticiones innecesarias a la base de datos (Supabase).
*   **Skeleton Loaders:** Usa `loading.tsx` y `<Suspense>` para mostrar *skeletons* elegantes antes de que lleguen los datos.
*   **Premium Visuals:** Usa transiciones suaves, hover states lujosos, carruseles optimizados e imágenes grandes para mantener la percepción de "Lujo".

## 🏗️ Architecture & Security
*   **Server Components First:** Mantén la mayoría de tus componentes (layouts, cards estáticas) como Server Components y usa `"use client"` estrictamente donde haya interactividad (carruseles, botones).
*   **Strict Typing:** Mantén tus tipos de TypeScript estrictamente sincronizados con la base de datos (Supabase) para evitar errores (ej. `PropertyTagType | null`).
*   **Route Handlers with Rate Limits:** Protege tus APIs de contacto o reservación de bots implementando Rate Limiting en los Route Handlers (`app/api/...`).
*   **Row Level Security (RLS):** Nunca envíes datos sensibles al cliente; asegura firmemente tus políticas RLS en Supabase (ej. ocultar datos del propietario).

## 💡 Conversion & Premium Features
*   **Local Wishlist:** Permite guardar propiedades como "Favoritos" en `localStorage` antes de obligar al usuario a hacer login.
*   **Side-by-side Comparison:** Integra una herramienta para comparar métricas de hasta 3 propiedades al mismo tiempo.
*   **Dynamic Mortgage Calculator:** Añade una pequeña calculadora interactiva de hipotecas en la página de propiedad usando el precio de lista.
*   **Video Autoplay (Muted):** Reemplaza algunas imágenes estáticas del header por videos en loop para generar una experiencia más inmersiva.
