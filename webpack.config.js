const path = require("path");
const { DefinePlugin } = require("webpack");

const dotEnvExtended = require("dotenv-extended");
const dotenvParseVariables = require("dotenv-parse-variables");

const env = dotenvParseVariables(dotEnvExtended.load());

const { NODE_ENV } = env;

const IS_PRODUCTION = NODE_ENV == "production";
const SRC_DIRECTORY = path.resolve(__dirname, "src");

module.exports = {
  mode: NODE_ENV,
  output: {
    path: path.resolve(__dirname, "build", "web"),
    filename: "[name].js",
    publicPath: IS_PRODUCTION ? undefined : env.ASSET_BASE_URL + "/",
  },
  devtool: IS_PRODUCTION ? "source-map" : "inline-source-map",
  entry: {
    "js/dashboard/index": "./src/web/js/dashboard/index.js",
    "js/beforePyret": "./src/web/js/beforePyret.js",
  },
  module: {
    rules: [
      { test: /\.css$/, use: ["style-loader", "css-loader"] },
      { test: /\.(png|jpg|jpeg|gif|svg)$/, loader: "url-loader" },
      {
        test: /\.js$/,
        enforce: "pre",
        include: [SRC_DIRECTORY],
        loader: "babel-loader",
        // query: {
        //   cacheDirectory: true,
        // },
      },
    ],
  },
  resolve: {
    modules: [__dirname, "node_modules"],
    alias: {},
  },
  plugins: [
    new DefinePlugin({
      "process.env": JSON.stringify(env),
    }),
  ],
  devServer: {
    inline: true,
    port: 5001,
    proxy: {
      "/**": {
        target: "http://localhost:5000",
      },
    },
  },
};
