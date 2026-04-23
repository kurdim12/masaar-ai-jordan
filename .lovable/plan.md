

## Phase 1 + 2 — Foundation Tokens & Mapbox GL Overhaul

A two-part visual rebuild. Part 1 locks the design system (4-size type scale, 6-stop spacing, primitive classes). Part 2 rips out Leaflet entirely and replaces it with Mapbox GL JS using a custom dark style for Investor/Business and a warm outdoors style for Traveller, with HTML markers tuned to the brand.

---

### What changes

**Part 1 — Foundation (no behavioral changes)**
- `index.html` → add Mapbox GL JS CDN script + CSS, keep existing Google Fonts
- `src/index.css` → full rewrite using the spec's token system (hex variables in addition to existing HSL shadcn vars), 4-size type scale, primitive component classes (`.kpi-giant`, `.card-el`, `.bubble-user`, `.rank-row`, `.pbar-fill`, `.chip-lt`, `.glass-header`, `.dest-card`, `.mbx-marker`, `.skeleton`, `.animate-fade-up`, etc.)
- `tailwind.config.ts` → confirm `fontFamily.display/body/arabic/mono` mappings
- `src/components/AppHeader.tsx` → swap `glass` for `glass-header` / `glass-header-cream` based on a new `lightMode` prop, use `.wordmark` + `.wordmark-sub` classes
- `src/components/AppShell.tsx` → already accepts `lightMode`; pass through to `AppHeader`
- `src/components/BottomNav.tsx` → rewrite to use `.bottom-nav` + `.nav-item` classes with gold top-pip indicator
- `src/components/Skeletons.tsx` → add `SkeletonCard`, `SkeletonText`, `SkeletonDestCard` exports

**Part 2 — Maps (Mapbox GL)**
- Add `VITE_MAPBOX_TOKEN` placeholder to `.env.example` (note: `.env` is auto-managed and cannot be edited; the user will need to add the real token via Cloud secrets or manually paste it)
- New `src/lib/mapbox.ts` → exports `MAPBOX_TOKEN`, `DARK_STYLE`, `WARM_STYLE`, `JORDAN_CENTER`, `createInvestorMarker(score, opp)`, `createTravellerMarker(crowd, rating, name)`
- `npm` install `mapbox-gl` (we'll use the npm package, not the CDN script — cleaner with Vite/TS)
- Rewrite map block in `src/pages/investor/InvestorMap.tsx` → Mapbox dark-v11, custom HTML markers sized by `priorityScore * 5`, click flies-to + navigates to opportunity detail
- Rewrite map block in `src/pages/traveller/TravellerDiscover.tsx` → Mapbox outdoors-v12 (warm), custom dot markers with floating name+rating label
- Rewrite `src/pages/traveller/TravellerMap.tsx` similarly
- Both maps: graceful fallback panel when `!MAPBOX_TOKEN` ("Map requires Mapbox token — add VITE_MAPBOX_TOKEN")
- Remove now-unused Leaflet imports per file (keep `leafletSetup.ts` and `MapMount.tsx` for now in case other screens use them — verified only the three above import Leaflet)

**Part 3 — Screen restyling polish (in this same pass)**
- `Splash.tsx` → 70 random star-particle divs in a `useEffect`, MASAAR in DM Serif Display 52px, gold subtitle in JetBrains Mono, `btn-gold`/`btn-ghost` CTAs
- `InvestorMap.tsx` → Stability Index uses `.kpi-giant`; ranking rows use `.rank-row` primitives; top-opportunity card uses `--grad-rose` background
- `BusinessDashboard.tsx` → occupancy as `.kpi-giant` (gold), empty rooms as `.kpi-large` (serif); demand chart strips grid + axis lines, gold stroke + gradient fill
- `ChatScreen.tsx` → `.bubble-user` / `.bubble-ai` classes, blinking `.stream-cursor` appended to streaming text, `.chat-tag` for suggestions, jade "Online · Gemini 2.5 Flash" status line in header

**Part 4 — Data**
- `src/data/jordan.ts` → already has 2026 tender deadlines (verified — no change needed)

---

### What stays untouched

`AppContext.tsx`, `App.tsx` routing, `RoleGuard`, `ErrorBoundary`, all Supabase code, `aiChat.ts`, `gemini.ts`, all `/ui/` shadcn components, `jordan.ts` (data unchanged), all migrations and edge functions.

---

### Technical notes

- **Mapbox token**: `.env` is auto-managed by Lovable Cloud and shouldn't be hand-edited. I'll add the placeholder to `.env.example` and read `import.meta.env.VITE_MAPBOX_TOKEN` in code. To make the maps actually render, the token must be added — either via the Cloud secrets UI for build-time vars, or you provide it and I'll wire it in.
- **mapbox-gl install**: I'll add the npm package (`mapbox-gl` + `@types/mapbox-gl`) instead of CDN — works better with the Vite build.
- **Leaflet stays installed** so `MapMount.tsx` doesn't break; the three map screens just stop importing it. We can remove it in a later cleanup pass.
- **CSS variables coexist**: the new spec uses raw hex values (`--gold: #EEC058`), but shadcn requires HSL. I'll keep both — the HSL block for shadcn compatibility, and add hex tokens for the new primitive classes.
- **HTML structure changes are minimal**: most restyling is class swaps. The header/nav/chat components get small JSX tweaks for new class names and the streaming cursor span.

---

### Files touched

```text
index.html                                  (add Mapbox CSS)
src/index.css                               (full rewrite)
tailwind.config.ts                          (verify fontFamily)
.env.example                                (add VITE_MAPBOX_TOKEN)
src/lib/mapbox.ts                           (new)
src/components/AppHeader.tsx                (lightMode prop, new classes)
src/components/AppShell.tsx                 (pass lightMode through)
src/components/BottomNav.tsx                (rewrite with .bottom-nav)
src/components/ChatScreen.tsx               (bubble classes, stream cursor)
src/components/Skeletons.tsx                (add new skeletons)
src/pages/Splash.tsx                        (particles + new type)
src/pages/investor/InvestorMap.tsx          (Mapbox + KPI primitives)
src/pages/traveller/TravellerDiscover.tsx   (Mapbox warm)
src/pages/traveller/TravellerMap.tsx        (Mapbox warm)
src/pages/business/BusinessDashboard.tsx    (KPI + chart restyle)
package.json                                (add mapbox-gl)
```

---

### One question before I execute

Do you have a Mapbox public token ready to paste in? If yes, send it and I'll wire it directly into the `.env` so maps render on first reload. If no, I'll ship everything with the graceful fallback ("add token to enable maps") and you can drop it in when ready — the rest of the redesign works regardless.

