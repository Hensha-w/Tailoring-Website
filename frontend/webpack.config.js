const path = require('path');
const webpack = require('webpack');

module.exports = {
    mode: 'development',
    entry: './src/index.js',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'bundle.js',
        publicPath: '/'
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env', '@babel/preset-react']
                    }
                }
            },
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader']
            }
        ]
    },
    devServer: {
        static: {
            directory: path.join(__dirname, 'public'),
        },
        historyApiFallback: true,
        port: 3000,
        hot: true,
        open: true,
        proxy: [
            {
                context: ['/api'],
                target: 'http://localhost:5000',
                changeOrigin: true,
                secure: false,
                logLevel: 'debug' // Add this for debugging
            }
        ],
        client: {
            overlay: {
                errors: true,
                warnings: false,
            },
            progress: true,
        }
    },
    resolve: {
        extensions: ['.js', '.jsx']
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin()
    ]
};