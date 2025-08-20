import path from 'node:path';
import Koa from 'koa';
import Router from '@koa/router';
import serve from 'koa-static';
import { ChunkExtractor } from '@loadable/server';
import proxy from 'koa-proxies';
// @ts-ignore
import appConstants from '../../config/constants';

import renderHtml from './html';
import renderToStream from "@app/server/stream";
import renderApp from './app';

// --- 初始化 ---
const app = new Koa();
const router = new Router();

if (process.env.NODE_ENV === "development") {
    // 在开发环境，代理静态资源请求转发到 HMR 服务器
    app.use(proxy("/static", {
            target: `http://localhost:${appConstants.hmrPort}`,
            changeOrigin: true,
        })
    );
}

// loadable-stats.json 文件路径
const statsFile = path.resolve(process.cwd(), './build/loadable-stats.json');
// 客户端静态资源目录
const clientBuildDir = path.resolve(process.cwd(), './build/client');

// --- 设置静态资源服务中间件 ---
// 这是至关重要的一步。它让浏览器可以通过 URL (如 /client.js) 访问到
// Webpack 打包出来的、位于 /build/client 目录下的 JS, CSS 等静态文件。
app.use(serve(clientBuildDir));

// ---  SSR 路由处理器 ---
router.get(/.*/, async (ctx: Koa.Context) => {
    try {
        console.log(`🔥 [SSR] server render: ${ctx.req.url}`);
        
        // 创建 ChunkExtractor 实例
        // 每次请求都创建一个新的实例，以避免不同请求间的数据污染
        const extractor = new ChunkExtractor({
            statsFile,
            entrypoints: ['client'], // 指定客户端入口
        });

        // 准备要渲染的 React 组件树
        // 使用 StaticRouter 包裹你的 App，并传入当前请求的 URL
        const jsx = extractor.collectChunks(
            await renderApp(ctx)
        );

        // 将 React 组件流式渲染为 HTML 字符串
        const appContent = await renderToStream(jsx);

        // 组装最终的 HTML 页面
        const finalHtml = renderHtml({
            appContent,
            dehydratedState: ctx.dehydratedState,
            linkTags: extractor.getLinkTags(),
            styleTags: extractor.getStyleTags(),
            scriptTags: extractor.getScriptTags(),
        });

        // 发送响应
        ctx.type = 'text/html; charset=utf-8';
        ctx.body = finalHtml;

    } catch (error) {
        // 捕获渲染过程中的任何错误
        console.error("SSR Rendering Error:", error);
        ctx.status = 500;
        ctx.body = "Internal Server Error";
    }
});

app.use(router.routes()).use(router.allowedMethods());

// ---  启动服务器 ---
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`✅ SSR Server is running at http://localhost:${port}`);
});
