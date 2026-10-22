import path from "node:path";
import type { Configuration } from "webpack";
import type { Configuration as DevServerConfiguration } from "webpack-dev-server";
import HtmlWebpackPlugin from "html-webpack-plugin";

interface Argv {
	mode?: Configuration["mode"];
}

export default (_env: unknown, argv: Argv): Configuration & { devServer: DevServerConfiguration } => ({
	entry: "./src/main.ts",
	output: {
		path: path.resolve(import.meta.dirname, "dist"),
		filename: "[name].[contenthash].js",
		assetModuleFilename: "img/[name].[contenthash][ext]",
		clean: true
	},
	devtool: argv.mode === "production" ? false : "eval-source-map",
	resolve: {
		extensions: [".ts", ".js"]
	},
	module: {
		rules: [{
			test: /\.ts$/,
			loader: "esbuild-loader",
			exclude: /node_modules/
		}, {
			test: /\.less$/,
			use: ["style-loader", "css-loader", "less-loader"]
		}, {
			test: /\.png$/,
			type: "asset/resource"
		}]
	},
	plugins: [
		new HtmlWebpackPlugin({
			template: "./index.html"
		})
	],
	devServer: {
		port: 8004,
		open: false,
		// moduly nepodporuji HMR, pri zmene se stejne reloaduje cela stranka
		hot: false,
		historyApiFallback: true
	}
});
