const path = require('path');
const webpack = require('webpack');
const buildPath = path.resolve(__dirname, '');
const HtmlWebpackPlugin = require('html-webpack-plugin');

process.env.DEBUG = true;

module.exports = {
    entry: [
        './index.js'
    ],
    context: path.join(__dirname, 'src'),
    devServer: {
        contentBase: 'www', // Relative directory for base of server
        host: '0.0.0.0', // Change to '0.0.0.0' for external facing server
        hot: true, // Live-reload
        hotOnly: true,
        inline: true,
        // noInfo: true,
        port: 3011, // Port Number
    },
    devtool: 'source-map',
    output: {
        path: buildPath, // Path of output file
        filename: 'bundle.js',
    },
    resolve: {
        extensions: ['.js']
    },

    plugins: [
        // Enables Hot Modules Replacement
        new webpack.HotModuleReplacementPlugin(),

        new webpack.NamedModulesPlugin(),
        
        new HtmlWebpackPlugin({ title: 'Vector2 Test' }),

        // Allows error warnings but does not stop compiling.
        // new webpack.NoEmitOnErrorsPlugin(),

        new webpack.DefinePlugin({
            // __DEBUG__: JSON.stringify(JSON.parse(process.env.DEBUG)),
            __DEBUG__: JSON.stringify(true)
        }),
    ],
    module: {
        rules: [
            {
                test: /\.(less)$/,
                use: [
                    "style-loader",
                    {
                        loader: "css-loader",
                        options: {
                            modules: true,
                            localIdentName: '[name]__[local]--[hash:base64:5]' } // BEM-Style
                    },
                    {
                        loader: "less-loader",
                        options: { relativeUrls: false }
                    },
                ],
                //exclude: "/\.(png|jpg|svg)?$/"
            },
            {
                test: /\.(css)$/,
                use: [
                    "style-loader", "css-loader"
                ]
            },
            {
                test: /\.jsx?$/,
                loader: 'babel-loader',
                options: {
                    presets: ['env']
                },
                exclude: /(node_modules|plugins|platforms|hooks|node_server)/
            },
            {
                test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
                loader: "url-loader?limit=10000&mimetype=application/font-woff"
            },
            {
                test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
                loader: "url-loader?limit=10000&mimetype=application/octet-stream"
            },
            {
                test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,
                loader: "file-loader"
            },
            {
                test: /\.(png|jpg)?$/,
                loader: "file-loader"
            },
            // {
            //     test: /\.jpg/,
            //     loader: "file-loader!url-loader?limit=10000&minetype=image/jpg"
            // },
            {
                test: /\.svg(\?v=[0-9]\.[0-9]\.[0-9])?$/,
                loader: "url-loader?limit=10000&mimetype=image/svg+xml"
                // loader: "file-loader"
            }
        ]
    }
};
