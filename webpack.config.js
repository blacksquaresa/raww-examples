const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  mode: "development",
  entry: __dirname + "/demo.ts",
  output: {
    path: __dirname + "/web", // Folder to store generated bundle
    filename: "demo.js" // Name of generated bundle after build
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: "ts-loader",
        exclude: /node_modules|test/
      },
      {
        test: /node_modules[\\|/](run-as-web-worker)/,
        use: { loader: "umd-compat-loader" }
      }
    ]
  },
  resolve: {
    extensions: [".ts", ".js"]
  },
  plugins: [
    // Array of plugins to apply to build chunk
    new HtmlWebpackPlugin({
      template: __dirname + "/index.html",
      inject: "body"
    })
  ],
  devServer: {
    // configuration for webpack-dev-server
    contentBase: "./web", //source of static assets
    port: 7700 // port to run dev-server
  }
};
