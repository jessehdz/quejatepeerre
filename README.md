# QuéjatePeErre

A civic reporting platform for Puerto Rico. Citizens can pin problems on a map, categorize them, and submit anonymous reports — potholes, power outages, water issues, safety concerns, and more.

---

## Stack

| Layer | Technology |
|---|---|
| Framework | React 19 + Vite 8 |
| Map | MapLibre GL via react-map-gl, tiles from MapTiler |
| Backend | Supabase (Postgres + Storage) |
| Styling | Plain CSS with CSS custom properties (no Tailwind) |
| Testing | Vitest + React Testing Library |

---

## Getting Started

### 1. Clone and install

```bash
git clone <repo-url>
cd quejatepeerre
npm install
```

### 2. Set up environment variables

Create a `.env` file at the project root (it's already in `.gitignore`):

```
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_MAPTILER_KEY=your_maptiler_api_key
```

- **Supabase**: create a free project at [supabase.com](https://supabase.com)
- **MapTiler**: get a free API key at [maptiler.com](https://maptiler.com)

### 3. Run

```bash
npm start        # dev server at localhost:3000
npm test         # run tests in watch mode
npm run build    # production build → /dist
```

---

## Project Structure

```
src/
  main.jsx              # app entry point — SDK config, React root
  App.jsx               # root component — routing state, layout
  index.css             # global CSS variables and base styles

  components/           # UI components (each paired with a .css file)
    BottomNav.jsx       # tab bar + FAB
    FeedScreen.jsx      # scrollable report list
    Header.jsx          # top bar with logo
    MapView.jsx         # interactive map with report markers
    ReportCard.jsx      # single report card in the feed
    ReportForm.jsx      # slide-up form for submitting a new report

  hooks/
    useLocation.js      # geolocation + reverse geocoding state logic

  lib/                  # pure utility modules (no React)
    api.js              # Supabase query functions
    constants.js        # category definitions, severity colors
    geocode.js          # MapTiler reverse geocoding helpers
    supabase.js         # Supabase client initialization

  data/
    sampleReports.js    # dev-only mock data (same shape as DB rows)

  __tests__/            # Vitest test files (mirrors src/ structure)
```

---

## Supabase Schema

### `reports` table

| Column | Type | Notes |
|---|---|---|
| `id` | uuid | primary key, auto-generated |
| `category` | text | matches a key in `CATEGORIES` (e.g. `'infrastructure'`) |
| `subcategory` | text | nullable |
| `title` | text | max 80 chars |
| `description` | text | max 500 chars |
| `lat` | float8 | latitude |
| `lng` | float8 | longitude |
| `municipality` | text | reverse-geocoded from coordinates |
| `exact_location` | text | nullable, street-level address |
| `image_url` | text | nullable, public URL from Supabase Storage |
| `status` | text | `'open'` \| `'resolved'` |
| `vote_count` | int4 | default 0 |
| `draft` | bool | default false |
| `created_at` | timestamptz | auto-generated |

### Storage bucket

- Bucket name: `report-images`
- Access: public read

---

## Environment Variables Reference

| Variable | Where to get it |
|---|---|
| `VITE_SUPABASE_URL` | Supabase dashboard → Project Settings → API |
| `VITE_SUPABASE_ANON_KEY` | Supabase dashboard → Project Settings → API |
| `VITE_MAPTILER_KEY` | maptiler.com → Account → API keys |
