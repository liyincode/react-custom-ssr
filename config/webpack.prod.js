const { merge } = require("webpack-merge");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const { baseClientConfig, baseServerConfig } = require("./webpack.config.js");const mode = "production";

const prodClient = (env) => {
    return merge(baseClientConfig(env), {
        mode,

        devtool: false,

        output: {
            filename: "js/[name].[contenthash:8].js",
            chunkFilename: "js/[name].[contenthash:8].chunk.js",
            assetModuleFilename: "media/[contenthash:8][ext]",
        },

        plugins: [
            new MiniCssExtractPlugin({
                filename: "css/[name].[contenthash:8].css",
                chunkFilename: "css/[name].[contenthash:8].chunk.css",
            }),
        ],

        optimization: {
            minimize: true,
            minimizer: [new TerserPlugin(), new CssMinimizerPlugin()],
            splitChunks: {
                chunks: "all",
            },
        },
    });
};

const prodServer = (env) => merge(baseServerConfig(env), { mode });

module.exports = [prodClient, prodServer];
