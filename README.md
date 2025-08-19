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

## 🛠️ Tech Stack

### Frontend
- React 18
- TypeScript
- React Router v6
- @loadable/component (Code Splitting)

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
├── app/                    # Application code
│   ├── client/             # Client entry
│   │   └── index.tsx       # Client hydration code
│   └── server/             # Server code
│       ├── index.tsx       # SSR server
│       ├── html.ts         # HTML template generation
│       └── stream.ts       # Streaming render logic
├── config/                 # Build configuration
│   ├── constants.js        # Constants configuration
│   ├── webpack.config.js   # Webpack base config
│   ├── webpack.dev.js      # Development config
│   └── webpack.prod.js     # Production config
├── scripts/                # Script files
│   └── dev.js              # Development server startup script
├── src/                    # Source code
│   ├── App.tsx             # Main app component
│   └── App.css             # App styles
└── build/                  # Build output directory
    ├── client/             # Client build files
    ├── server.js           # Server build file
    └── loadable-stats.json # Code splitting stats
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

## 📄 License

MIT License

