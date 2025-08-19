module.exports = (api) => {
    const inDevelopment = api.cache(() => process.env.NODE_ENV === "development");
    const isClient = api.caller((c) => c && c.target === "web");

    return {
        presets: [
            "@babel/preset-env",
            ["@babel/preset-react", {runtime: "automatic"}],
            "@babel/preset-typescript",
        ],
        plugins: [
            "@loadable/babel-plugin",
            inDevelopment && isClient && "react-refresh/babel",
        ].filter(Boolean),
    }
}
