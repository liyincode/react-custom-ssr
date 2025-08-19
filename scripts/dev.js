const express = require("express");
const webpack = require("webpack");
const webpackDevMiddleware = require("webpack-dev-middleware");
const webpackHotMiddleware = require("webpack-hot-middleware");
const webpackDevConfigs = require("../config/webpack.dev");
const appConstants = require("../config/constants");

const [devClient, devServer] = webpackDevConfigs;

const env = { mode: "dev" };

const clientDevConfig = devClient(env);
const serverDevConfig = devServer(env);

// 客户端编译
const clientCompiler = webpack(clientDevConfig);
// 服务端编译
const serverCompiler = webpack(serverDevConfig);

// 服务端编译监听，自动重新编译 ssr 相关文件
serverCompiler.watch({ ignored: /node_modules/ }, (err, stats) => {
    if (err) {
        console.error("Server compilation failed:", err);
        return;
    }
    if (stats.hasErrors()) {
        console.error("Server compilation has errors:", stats.toString({ colors: true }));
        return;
    }
    console.log("✅ Server compiled successfully.");
});


const app = express();

app.use(webpackDevMiddleware(clientCompiler, {
    publicPath: clientDevConfig.output.publicPath,
}));
app.use(webpackHotMiddleware(clientCompiler));

app.listen(appConstants.hmrPort, () => {
    console.log(`🔥 HMR server listening on http://localhost:${appConstants.hmrPort}`);
});
