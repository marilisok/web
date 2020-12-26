module.exports = {
    entry: {
        mainListener: __dirname + '/src/scripts/mainListener.js',
        adminPageListener: __dirname + '/src/scripts/adminPageListener.js',
        userPageListener: __dirname + '/src/scripts/userPageListener.js',
        yourPurchasesListener: __dirname + '/src/scripts/yourPurchasesListener.js'
    },
    output: {
        path: __dirname + '/public/scripts/',
        filename: '[name].js'
    },
    module: {
        rules: [
            {
                test: /\.css$/,
                exclude: /node_modules/,
                loader: 'style-loader!css-loader'
            },
            {
                // images configuration
                test: /\.(jpg|jpeg|gif|png|woff|woff2)$/,
                use: [
                    {
                        loader: "url-loader",
                        options: {
                            name: "[path][name].[ext]",
                        }
                    }
                ]
            },
        ]
    },
    node: {
        fs: 'empty'
    },
};