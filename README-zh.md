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

## 🛠️ 技术栈

### 前端
- React 18
- TypeScript
- React Router v6
- @loadable/component (代码分割)

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
├── app/                    # 应用代码
│   ├── client/             # 客户端入口
│   │   └── index.tsx       # 客户端水合代码
│   └── server/             # 服务端代码
│       ├── index.tsx       # SSR 服务器
│       ├── html.ts         # HTML 模板生成
│       └── stream.ts       # 流式渲染逻辑
├── config/                 # 构建配置
│   ├── constants.js        # 常量配置
│   ├── webpack.config.js   # Webpack 基础配置
│   ├── webpack.dev.js      # 开发环境配置
│   └── webpack.prod.js     # 生产环境配置
├── scripts/                # 脚本文件
│   └── dev.js              # 开发服务器启动脚本
├── src/                    # 源代码
│   ├── App.tsx             # 主应用组件
│   └── App.css             # 应用样式
└── build/                  # 构建输出目录
    ├── client/             # 客户端构建文件
    ├── server.js           # 服务端构建文件
    └── loadable-stats.json # 代码分割统计文件
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

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📄 许可证

MIT License

