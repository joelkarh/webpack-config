const path = require("path");
//to optimize (compress) all images using imagemin
const ImageMinimizerPlugin = require("image-minimizer-webpack-plugin");
const {
    extendDefaultPlugins
} = require("svgo");
// include the js minification plugin
const UglifyJSPlugin = require("uglifyjs-webpack-plugin");
const HtmlWebpackPlugin = require('html-webpack-plugin');

// include the css extraction and minification plugins
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');

module.exports = {
    mode: 'development',
    entry: ["./js/app.js", "./css/style.scss"],
    output: {
        filename: "build/bundle.min.js",
        path: path.resolve(__dirname),
    },
    module: {
        rules: [
            // perform js babelization on all .js files
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader",
                    options: {
                        presets: ["@babel/preset-env"],
                    },
                },
            },
            // compile all .scss files to plain old css
            {
                test: /\.(sass|scss)$/,
                use: [MiniCssExtractPlugin.loader, "css-loader", "sass-loader"],
            },
            {
                test: /\.(jpe?g|png|gif|svg)$/i,
                type: "asset"
            }
        ],
    },
    plugins: [
        // extract css into dedicated file
        new MiniCssExtractPlugin({
            filename: "style.css",
        }),
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, "src", "index.html"),
            inject: 'body',
            hash: 'true'

        }),
        new ImageMinimizerPlugin({
            minimizerOptions: {
                // Lossless optimization with custom option
                // Feel free to experiment with options for better result for you
                plugins: [
                    ["gifsicle", {
                        interlaced: true
                    }],
                    ["jpegtran", {
                        progressive: true
                    }],
                    ["optipng", {
                        optimizationLevel: 5
                    }],
                    // Svgo configuration here https://github.com/svg/svgo#configuration
                    [
                        "svgo",
                        {
                            plugins: extendDefaultPlugins([{
                                    name: "removeViewBox",
                                    active: false,
                                },
                                {
                                    name: "addAttributesToSVGElement",
                                    params: {
                                        attributes: [{
                                            xmlns: "http://www.w3.org/2000/svg"
                                        }],
                                    },
                                },
                            ]),
                        },
                    ],
                ],
            },
        }),
    ],
    optimization: {
        
        minimizer: [
            // enable the js minification plugin
            new UglifyJSPlugin({
                cache: true,
                parallel: true,
            }),
            // enable the css minification plugin
            new CssMinimizerPlugin(),
        ],
    },
};