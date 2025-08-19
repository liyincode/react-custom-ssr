const {merge} = require("webpack-merge");
const webpack = require("webpack");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const {baseClientConfig, baseServerConfig} = require("./webpack.config.js");
const appConstants = require("./constants.js");
const ReactRefreshWebpackPlugin = require("@pmmmwh/react-refresh-webpack-plugin");

const mode = "development";

// 客户端开发配置
const devClient = (env) =>
    merge(baseClientConfig(env), {
        entry: {
            // (核心) 注入 HMR 客户端脚本
            client: [
                `webpack-hot-middleware/client?path=http://localhost:${appConstants.hmrPort}/__webpack_hmr`,
            ],
        },

        output: {
            filename: "js/[name].js",
        },

        mode,

        plugins: [
            // (核心) HMR 插件
            new webpack.HotModuleReplacementPlugin(),
            new ReactRefreshWebpackPlugin(),
            new MiniCssExtractPlugin({
                filename: "css/[name].css",
            }),
        ],

        devtool: "eval-source-map",
    });

// 服务端开发配置
const devServer = (env) =>
    merge(baseServerConfig(env), {
        mode,

        devtool: "eval-source-map",
    });

module.exports = [devClient, devServer];
