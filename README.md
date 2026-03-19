# FIFA Player Analysis Dashboard

An interactive data analysis platform exploring **56,880 FIFA-rated players** across **190 countries** and **44 leagues** (FIFA 15-23).

Built by [Insight Fusion Analytics](https://insightfusionanalytics.com).

---

## Three Analysis Modules

### 1. Relative Age Effect (RAE)
Statistical analysis of birth quarter bias in professional football. Players born in Q1 (January-March) are significantly overrepresented at 33.8% vs the expected 25%.

- Chi-squared goodness-of-fit tests with Bonferroni correction
- Breakdown by position, league, country, rating decile
- Country-specific football year adjustments (28 countries mapped)

### 2. Height Analysis
Height distribution patterns across positions, countries, and skill tiers.

- Sub-position height profiles (GK through Striker)
- Top-rated vs all-player height comparison
- Big 5 European league vs rest-of-world comparison
- Country-specific height analysis for top 5 football nations

### 3. Player Profile
Composite profiling of the "typical" FIFA player and statistical outliers.

- Modal player card (most common attributes)
- Left-footedness analysis (22.1% in football vs 10.6% in general population)
- Country representation by rating tier
- Split analysis: top vs bottom rated, Big 5 vs other leagues

---

## Interactive Features

All three modules include:
- **7 synchronized filters**: Country, Position, League, Rating Tier, FIFA Version, Football Year Type, Starter/All
- **Live-updating charts and statistics** — filter changes recalculate everything server-side
- **Searchable player table** with sorting and pagination (56,880 players)
- **Shareable filter state** via URL parameters

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| Charts | Recharts |
| Table | @tanstack/react-table |
| Statistics | jStat (chi-squared, p-values) |
| Data | CSV (9.5MB, loaded once into memory) |
| Deployment | Vercel |

---

## Getting Started

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Open http://localhost:3000
```

### Production Build

```bash
npm run build
npm start
```

---

## Project Structure

```
app/
  page.tsx              # Landing page with links to all 3 modules
  rae/page.tsx          # RAE analysis module
  height/page.tsx       # Height analysis module
  profile/page.tsx      # Player profile module
  api/
    aggregate/route.ts  # RAE data aggregation API
    height/route.ts     # Height data aggregation API
    profile/route.ts    # Profile data aggregation API
    players/route.ts    # Player search + pagination API

components/
  FilterBar.tsx         # Shared 7-filter bar (sticky)
  ActiveFilters.tsx     # Filter pills with remove buttons
  DashboardHeader.tsx   # Stat cards header
  PlayerTable.tsx       # Searchable, sortable data table
  height/              # Height-specific chart components
  profile/             # Profile-specific chart components

hooks/
  useDashboardData.ts  # RAE filter state + data fetching
  useHeightData.ts     # Height filter state + data fetching
  useProfileData.ts    # Profile filter state + data fetching

lib/
  csv-loader.ts        # Singleton CSV loader (56,880 rows)
  aggregation.ts       # Statistical computation engine
  types.ts             # TypeScript interfaces
  constants.ts         # Color palette, labels

data/
  fifa_players_clean.csv  # Source dataset (9.5MB)
```

---

## Data Source

EA Sports FIFA series (FIFA 15 through FIFA 23). Player attributes, ratings, positions, and biographical data. Processed and cleaned for statistical analysis.

---

## License

Private. Copyright 2026 Insight Fusion Analytics.
