# trading-journal-frontend

Frontend for the Trading Journal application, built with Next.js and Material UI.

## Stack

- **Next.js 15** (App Router)
- **React 19**
- **TypeScript**
- **Material UI v6** (design system)
- **Emotion** (CSS-in-JS, required by MUI)
- **Docker** (dev + production multi-stage build)

## Structure

```
trading-journal-frontend/
├── src/
│   ├── app/
│   │   ├── layout.tsx              # Root layout with ThemeRegistry
│   │   ├── page.tsx                # Public landing page
│   │   ├── ThemeRegistry.tsx       # Emotion cache + MUI ThemeProvider
│   │   ├── auth/
│   │   │   ├── login/
│   │   │   │   └── page.tsx        # Login page
│   │   │   └── register/
│   │   │       └── page.tsx        # Register page
│   │   ├── dashboard/
│   │   │   ├── layout.tsx          # Auth guard + 3-column layout
│   │   │   ├── page.tsx            # Feed (main timeline)
│   │   │   └── components/
│   │   │       ├── LeftPanel.tsx   # Navigation sidebar
│   │   │       └── RightPanel.tsx  # Summary sidebar
│   │   └── lib/
│   │       ├── theme.ts            # MUI theme (dark mode, custom palette)
│   │       ├── token.ts            # localStorage token helpers (get/set/clear)
│   │       └── api/
│   │           ├── client.ts       # Base fetch wrapper (error handling)
│   │           ├── auth.ts         # Auth API calls + types
│   │           └── index.ts        # Public re-exports
│   └── public/
│       └── HomePage.tsx            # Landing page component
├── next.config.ts                  # output: standalone, API reverse proxy rewrites
├── tsconfig.json
├── package.json
├── Dockerfile                      # Multi-stage: dev / builder / runner
├── docker-compose.yml
├── .env.example
└── .gitignore
```

## Prerequisites

- Docker
- The `trading-journal-api` service must be running and the `trading_journal_net` network must exist

## Setup

```bash
cp .env.example .env
```

## Environment Variables

| Variable       | Value                             | Description                                        |
|----------------|-----------------------------------|----------------------------------------------------|
| `API_BASE_URL` | `http://trading_journal_api:5000` | Internal URL used by Next.js to proxy API requests |

> There is no `NEXT_PUBLIC_*` API variable. The browser never calls Flask directly — all `/api/*` requests are proxied server-side by Next.js.

## API Proxy

All API calls in the frontend use the `/api` prefix:

```
Browser → /api/auth/login → Next.js rewrites → http://trading_journal_api:5000/auth/login
```

This eliminates CORS entirely. The same setup works in production with an Nginx reverse proxy routing `/api/*` to Flask.

## Auth flow

1. User registers or logs in → JWT is stored in `localStorage` via `lib/token.ts`
2. `dashboard/layout.tsx` checks for the token on mount — redirects to `/auth/login` if missing
3. All API calls go through `lib/api/client.ts` which attaches the `Authorization` header automatically when a token is provided

## Pages

| Route              | Auth | Description                  |
|--------------------|------|------------------------------|
| `/`                | No   | Public landing page          |
| `/auth/login`      | No   | Login form                   |
| `/auth/register`   | No   | Registration form with avatar upload |
| `/dashboard`       | Yes  | Main feed (3-column layout)  |

## Running

### Development (hot-reload)

```bash
docker-compose up --build
```

The app will be available at `http://localhost:3000`.

Local files are mounted into the container so changes are reflected immediately without rebuilding.

### Production

Change `target: dev` to `target: runner` in `docker-compose.yml`, then:

```bash
docker-compose up --build -d
```

## Network

Joins the external Docker network `trading_journal_net` to reach the API container at hostname `trading_journal_api`.
