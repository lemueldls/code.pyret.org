import path from "node:path";
import { fileURLToPath } from "url";

import webpack from "webpack";

import dotEnvExtended from "dotenv-extended";
import dotenvParseVariables from "dotenv-parse-variables";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const environment = dotenvParseVariables(dotEnvExtended.load());

const { NODE_ENV } = environment;

const IS_PRODUCTION = NODE_ENV == "production";
const SRC_DIRECTORY = path.resolve(__dirname, "src");

export default {
  mode: NODE_ENV,
  target: "web",
  output: {
    path: path.resolve(__dirname, "build", "web"),
    filename: "[name].js",
    publicPath: IS_PRODUCTION ? undefined : environment.ASSET_BASE_URL + "/",
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
    new webpack.DefinePlugin({
      "process.env": JSON.stringify(environment),
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
