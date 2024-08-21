/* eslint-disable no-undef */
// craco.config.js
module.exports = {
    webpack: {
        configure: (webpackConfig) => {
            webpackConfig.resolve.fallback = {
                ...webpackConfig.resolve.fallback,
                "child_process": false,
                "fs": false,
                "path": false,
            };

            webpackConfig.module.rules.push({
                test: /\.worker\.js$/,
                use: {
                    loader: 'worker-loader',
                    options: {
                        name: '[name].[contenthash].js',
                    },
                },
            });

            webpackConfig.optimization.noEmitOnErrors = false;
            
            webpackConfig.optimization.splitChunks = {
                chunks: 'all',
                maxInitialRequests: 40,
                minSize: 30000,
                maxSize: 500000,
                cacheGroups: {
                  defaultVendors: {
                    test: /[\\/]node_modules[\\/]/,
                    priority: -10,
                    reuseExistingChunk: true,
                  },
                  default: {
                    minChunks: 2,
                    priority: -10,
                    reuseExistingChunk: true,
                  },
                },
            };

            return webpackConfig;

        },
    },
};