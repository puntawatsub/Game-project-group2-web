const webpack = require("webpack");

module.exports = {
  reactStrictMode: true,
  webpack: (config) => {
    config.plugins.push(
      new webpack.DefinePlugin({
        CESIUM_BASE_URL: JSON.stringify("cesium"),
      })
    );
    return config;
  },
  experimental: {
    optimizePackageImports: ["@chakra-ui/react", "@mui"],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  output: "export",
};
