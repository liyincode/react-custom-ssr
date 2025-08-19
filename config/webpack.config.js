const { merge } = require("webpack-merge");
const appConstants = require("./constants.js");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const { TsconfigPathsPlugin } = require("tsconfig-paths-webpack-plugin");
const { resolve, join } = require("node:path");
const LoadablePlugin = require("@loadable/webpack-plugin");
const webpackNodeExternals = require("webpack-node-externals");
const packageJson = require("../package.json");

const {name} = packageJson;

const common = {
    module: {
        rules: [
            {
                test: /\.([tj])sx?$/,
                use: [
                    {
                        loader: "babel-loader",
                        options: {cacheDirectory: true}
                    }
                ]
            }
        ]
    },

    resolve: {
        extensions: [".js", ".ts", ".tsx", ".jsx"],
    },

    cache: {type: "filesystem"},

    watchOptions: {
        ignored: /node_modules/,
    },
};

const baseClientConfig = () => {
    return merge(common, {
        name: `client:${name}`,

        entry: {
            client: [resolve("app/client/index.tsx")],
        },

        output: {
            path: join(appConstants.buildPath, "client"),
            publicPath: `/static/client/`,
            clean: true,
        },

        module: {
            rules: [
                {
                    test: /\.css$/,
                    use: [MiniCssExtractPlugin.loader, "css-loader"],
                    sideEffects: true
                },
                {
                    test: /\.(webp|png|jpg|jpeg|gif|eot|woff|woff2|ttf|otf)$/,
                    type: "asset/resource",
                },

            ]
        },

        resolve: {
            ...common.resolve,
            plugins: [
                new TsconfigPathsPlugin({
                    configFile: resolve(__dirname, "../tsconfig.client.json"),
                    extensions: [".js", ".jsx", ".ts", ".tsx"],
                }),
            ],
        },

        plugins: [
            new LoadablePlugin({
                outputAsset: false,
                writeToDisk: true,
                filename: `${appConstants.buildPath}/loadable-stats.json`,
            }),
        ],
    })
}

const baseServerConfig = () => {
    return merge(common, {
        name: `server:${name}`,

        entry: {
            server: [resolve("app/server/index.tsx")],
        },

        output: {
            library: {
                type: "commonjs",
            },
            path: resolve(appConstants.buildPath),
            filename: "[name].js",
        },

        target: "node",

        module: {
            rules: [
                {
                    test: /\.(less|css|svg|jpg|jpeg|png|webp|gif|eot|woff|woff2|ttf|otf)$/,
                    loader: "ignore-loader",
                },
            ],
        },

        resolve: {
            ...common.resolve,
            plugins: [
                new TsconfigPathsPlugin({
                    configFile: resolve(__dirname, "../tsconfig.server.json"),
                    extensions: [".js", ".jsx", ".ts", ".tsx"],
                }),
            ],
        },

        // 不要打包 node_modules 中的依赖
        externalsPresets: {node: true},
        externals: [
            webpackNodeExternals()
        ],
    });
}

module.exports = {
    baseClientConfig,
    baseServerConfig,
};

