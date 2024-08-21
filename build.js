// in ./build.js
const rewire = require('rewire');
// const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const defaults = rewire('react-scripts/scripts/build.js');
const config = defaults.__get__('config');

//config.plugins.push(new BundleAnalyzerPlugin());

config.optimization.splitChunks = {
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