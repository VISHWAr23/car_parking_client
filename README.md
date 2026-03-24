# ParkOS — Private Parking Management System

A production-grade React application for managing private parking lots with dual-role dashboards.

## Tech Stack

| Tool | Purpose |
|---|---|
| React 18 | UI framework |
| Vite 5 | Build tool & dev server |
| Tailwind CSS 3 | Utility-first styling |
| Zustand | Global state management |
| Lucide React | Icon library |
| date-fns | Date formatting |

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

## Backend Authentication Setup

This frontend is connected to the NestJS backend auth API.

1. Start backend server from `parking-management`:

```bash
npm install
npm run prisma:generate
npm run prisma:seed
npm run start:dev
```

2. Create frontend env file:

```bash
# parkos/.env
VITE_API_URL=http://localhost:3000/api/v1
VITE_DAILY_RENT=250
```

3. Sign in using real backend users created by seeding.

## Project Structure

```
src/
├── components/
│   ├── ui/           # Reusable primitives (Badge, StatCard, etc.)
│   ├── layout/       # Shell components (BottomNav, PageHeader)
│   ├── dashboard/    # Feature-specific components
│   └── modals/       # Overlay/modal components
├── pages/            # Full page views (one per route/tab)
├── hooks/            # Custom React hooks
├── store/            # Zustand global store
├── constants/        # App-wide constants
├── utils/            # Pure helper functions
└── styles/           # Global CSS + CSS variables
```

## Roles

| Role | Access |
|---|---|
| **Laborer** | Car entry/exit actions, active session list |
| **Owner** | Analytics stats, live feed table, daily summary |

Role access is determined by backend authentication.

## Features

- Dark mode with CSS variable theming
- Emerald green for entries, rose red for exits
- Bottom navigation (Home / History / Settings)
- Car-only entry modal with owner/contact details and required RC photo
- Optional car side photos with list/card display preferences
- Per-session checkout with day-based rent calculation
- Owner analytics: revenue, capacity %, turnover rate
- Real JWT login with token restore on refresh
