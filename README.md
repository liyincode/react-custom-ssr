# React Custom SSR

A custom React Server-Side Rendering (SSR) application with streaming rendering, code splitting, and hot module replacement.

[中文文档](./README-zh.md)

## ✨ Features

- 🚀 **Server-Side Rendering (SSR)** - Powered by React 18's streaming capabilities
- 📦 **Code Splitting** - Dynamic imports with @loadable/component
- 🔥 **Hot Module Replacement (HMR)** - Real-time updates in development
- ⚡ **Webpack 5** - Modern build toolchain
- 🎯 **TypeScript** - Full type support
- 🌐 **Koa.js** - Lightweight server framework
- 🎨 **CSS Support** - CSS files and style extraction
- 🧭 **React Router v6 (SSR)** - Server-rendered routing
- 🧪 **React Query (SSR)** - Data prefetch & hydration

## 🛠️ Tech Stack

### Frontend
- React 18
- TypeScript
- React Router v6
- @loadable/component (Code Splitting)
- @tanstack/react-query (Data fetching & SSR hydration)

### Backend
- Koa.js
- @koa/router
- @loadable/server

### Build Tools
- Webpack 5
- Babel
- CSS Loader & Mini CSS Extract Plugin

## 📦 Installation

```bash
# Clone the repository
git clone <repository-url>
cd react-custom-ssr

# Install dependencies (pnpm recommended)
pnpm install

# or use npm
npm install
```

## 🚀 Usage

### Development

```bash
# Start development server
npm run dev
# or
pnpm dev

# Start mock API server in another terminal
npm run mock
```

The development server will start two services:
- **SSR Server**: http://localhost:3000 (Main application)
- **HMR Server**: http://localhost:8099 (Hot reload assets)

### Production Build

```bash
# Build for production
npm run build
# or
pnpm build
```

### Clean Build Files

```bash
# Clean build directory
npm run clean
# or
pnpm clean
```

## 📁 Project Structure

```
react-custom-ssr/
├── app/                      # Application code
│   ├── client/               # Client entry
│   │   └── index.tsx         # Client hydration (BrowserRouter + React Query)
│   └── server/               # Server code
│       ├── index.tsx         # SSR server (Koa + @loadable/server)
│       ├── app.tsx           # Route matching + React Query prefetch + dehydrate
│       ├── html.ts           # HTML template generation (inject dehydrated state)
│       └── stream.ts         # Streaming render logic
├── config/                   # Build configuration
│   ├── constants.js          # Constants configuration
│   ├── webpack.config.js     # Webpack base config
│   ├── webpack.dev.js        # Development config
│   └── webpack.prod.js       # Production config
├── scripts/                  # Script files
│   └── dev.js                # Development server startup script
├── src/                      # Source code
│   ├── index.tsx             # App component (useRoutes + Koa context provider)
│   ├── index.css             # App styles
│   ├── routes.tsx            # Route definitions with optional prefetch metadata
│   ├── Home.tsx              # Example page using useQuery
│   ├── Post.tsx              # Example dynamic route using useQuery
│   └── api.ts                # API client (mock server base URL)
└── build/                    # Build output directory
    ├── client/               # Client build files
    ├── server.js             # Server build file
    └── loadable-stats.json   # Code splitting stats
```

## ⚙️ Configuration

### TypeScript Configuration

The project includes three TypeScript configuration files:
- `tsconfig.json` - Base configuration
- `tsconfig.client.json` - Client-specific configuration
- `tsconfig.server.json` - Server-specific configuration

### Webpack Configuration

- **Development**: Enables HMR, proxies static assets to dev server
- **Production**: Code minification, CSS extraction, optimized bundling

### Environment Variables

- `NODE_ENV` - Runtime environment (development/production)
- `PORT` - Server port (default: 3000)

## 🔧 Core Features

### Server-Side Rendering (SSR)

The application uses React 18's `renderToPipeableStream` API for streaming rendering, providing better user experience and performance.

### Code Splitting

Component-level code splitting implemented through `@loadable/component` to reduce initial bundle size.

### Hot Module Replacement (HMR)

Development environment supports hot module replacement, allowing you to see code changes without page refresh.

### SSR Routing & Data Prefetching (React Router + React Query)

- Define routes in `src/routes.tsx`, and optionally attach `queryKey` and `loadData` for SSR prefetching. `queryKey` can be a function that receives dynamic params.

```tsx
// src/routes.tsx
import { Params, RouteObject } from "react-router-dom";
import { QueryKey } from "@tanstack/react-query";
import loadable from "@loadable/component";
import { api } from "./api";

const Home = loadable(() => import("./Home"), { ssr: true });
const Post = loadable(() => import("./Post"), { ssr: true });

type PrefetchRouteObject = RouteObject & {
  queryKey?: QueryKey | ((params: Params<string>) => QueryKey);
  loadData?: (params: Params<string>) => Promise<unknown>;
};

export const routes: PrefetchRouteObject[] = [
  { path: "/", element: <Home />, queryKey: ["home-data"], loadData: () => api.getHomeData() },
  { path: "/post/:id", element: <Post />, queryKey: (p) => ["post", p.id!], loadData: (p) => api.getPostById(p.id!) },
];
```

- On the server, matched routes are prefetched and dehydrated, then injected into HTML.

```tsx
// app/server/app.tsx (excerpt)
import { dehydrate, QueryClient, QueryClientProvider, HydrationBoundary } from "@tanstack/react-query";
import { matchRoutes } from "react-router-dom";
import { StaticRouter } from "react-router-dom/server";
import { routes } from "@/routes";

const queryClient = new QueryClient();
const matches = matchRoutes(routes, ctx.req.url ?? "");
// prefetch for each route that declares queryKey + loadData ...
const dehydratedState = dehydrate(queryClient);
```

- On the client, hydrate React Query state and the app.

```tsx
// app/client/index.tsx (excerpt)
const dehydratedState = JSON.parse(document.getElementById("__REACT_QUERY_STATE__")?.textContent || "{}");
hydrateRoot(root, (
  <BrowserRouter>
    <QueryClientProvider client={queryClient}>
      <HydrationBoundary state={dehydratedState}>
        <App />
      </HydrationBoundary>
    </QueryClientProvider>
  </BrowserRouter>
));
```

### Mock API

- A lightweight mock server is provided via `json-server` for demo data fetching.
- Start it with `npm run mock` (default: `http://localhost:8007`).
- API client lives in `src/api.ts`.

## 📄 License

MIT License

