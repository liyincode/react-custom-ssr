# React Custom SSR

一个基于 React 的自定义服务端渲染 (SSR) 应用，支持流式渲染、代码分割和热模块替换。

[English Documentation](./README.md)

## ✨ 特性

- 🚀 **服务端渲染 (SSR)** - 使用 React 18 的流式渲染能力
- 📦 **代码分割** - 基于 @loadable/component 的动态导入
- 🔥 **热模块替换 (HMR)** - 开发环境下的实时更新
- ⚡ **Webpack 5** - 现代化的构建工具链
- 🎯 **TypeScript** - 完整的类型支持
- 🌐 **Koa.js** - 轻量级的服务端框架
- 🎨 **CSS 支持** - 支持 CSS 文件和样式提取
- 🧭 **React Router v6 (SSR)** - 服务端渲染路由
- 🧪 **React Query (SSR)** - 数据预取与脱水/水合

## 🛠️ 技术栈

### 前端
- React 18
- TypeScript
- React Router v6
- @loadable/component (代码分割)
- @tanstack/react-query (数据获取与 SSR 水合)

### 后端
- Koa.js
- @koa/router
- @loadable/server

### 构建工具
- Webpack 5
- Babel
- CSS Loader & Mini CSS Extract Plugin

## 📦 安装

```bash
# 克隆项目
git clone <repository-url>
cd react-custom-ssr

# 安装依赖 (推荐使用 pnpm)
pnpm install

# 或使用 npm
npm install
```

## 🚀 使用

### 开发环境

```bash
# 启动开发服务器
npm run dev
# 或
pnpm dev

# 在另一个终端启动 Mock 接口服务
npm run mock
```

开发服务器将启动两个服务：
- **SSR 服务器**: http://localhost:3000 (主应用)
- **HMR 服务器**: http://localhost:8099 (热更新资源服务)

### 生产构建

```bash
# 构建生产版本
npm run build
# 或
pnpm build
```

### 清理构建文件

```bash
# 清理 build 目录
npm run clean
# 或
pnpm clean
```

## 📁 项目结构

```
react-custom-ssr/
├── app/                      # 应用代码
│   ├── client/               # 客户端入口
│   │   └── index.tsx         # 客户端水合（BrowserRouter + React Query）
│   └── server/               # 服务端代码
│       ├── index.tsx         # SSR 服务器启动（Koa + @loadable/server）
│       ├── app.tsx           # 路由匹配 + React Query 预取 + 脱水
│       ├── html.ts           # HTML 模板（注入脱水后的状态）
│       └── stream.ts         # 流式渲染逻辑
├── config/                   # 构建配置
│   ├── constants.js          # 常量配置
│   ├── webpack.config.js     # Webpack 基础配置
│   ├── webpack.dev.js        # 开发环境配置
│   └── webpack.prod.js       # 生产环境配置
├── scripts/                  # 脚本文件
│   └── dev.js                # 开发服务器启动脚本
├── src/                      # 源代码
│   ├── index.tsx             # App 组件（useRoutes + Koa context provider）
│   ├── index.css             # 样式
│   ├── routes.tsx            # 路由定义（支持 SSR 数据预取元信息）
│   ├── Home.tsx              # 示例页面，使用 useQuery
│   ├── Post.tsx              # 示例动态路由，使用 useQuery
│   └── api.ts                # API 客户端（mock 服务器 base URL）
└── build/                    # 构建输出目录
    ├── client/               # 客户端构建文件
    ├── server.js             # 服务端构建文件
    └── loadable-stats.json   # 代码分割统计文件
```

## ⚙️ 配置说明

### TypeScript 配置

项目包含三个 TypeScript 配置文件：
- `tsconfig.json` - 基础配置
- `tsconfig.client.json` - 客户端特定配置
- `tsconfig.server.json` - 服务端特定配置

### Webpack 配置

- **开发环境**: 启用 HMR，代理静态资源到开发服务器
- **生产环境**: 代码压缩，CSS 提取，优化打包

### 环境变量

- `NODE_ENV` - 运行环境 (development/production)
- `PORT` - 服务器端口 (默认: 3000)

## 🔧 核心功能

### 服务端渲染 (SSR)

应用使用 React 18 的 `renderToPipeableStream` API 实现流式渲染，提供更好的用户体验和性能。

### 代码分割

通过 `@loadable/component` 实现组件级别的代码分割，减少初始包大小。

### 热模块替换 (HMR)

开发环境下支持热模块替换，修改代码后无需刷新页面即可看到更新。

### SSR 路由与数据预取（React Router + React Query）

- 在 `src/routes.tsx` 定义路由时，可选地为每个路由声明 `queryKey` 与 `loadData`：`queryKey` 支持函数签名以接收动态参数。

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

- 服务端在 `app/server/app.tsx` 里根据匹配到的路由执行预取，随后通过 `dehydrate` 脱水并注入到 HTML。

```tsx
// app/server/app.tsx（节选）
import { dehydrate, QueryClient, QueryClientProvider, HydrationBoundary } from "@tanstack/react-query";
import { matchRoutes } from "react-router-dom";
import { StaticRouter } from "react-router-dom/server";
import { routes } from "@/routes";

const queryClient = new QueryClient();
const matches = matchRoutes(routes, ctx.req.url ?? "");
// 针对声明了 queryKey + loadData 的路由执行 prefetch ...
const dehydratedState = dehydrate(queryClient);
```

- 客户端在 `app/client/index.tsx` 里读取注入的状态并完成水合。

```tsx
// app/client/index.tsx（节选）
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

### Mock 接口

- 项目内置 `json-server` 作为示例数据源，命令：`npm run mock`（默认端口 `http://localhost:8007`）。
- API 客户端在 `src/api.ts`。

## 📄 许可证

MIT License

