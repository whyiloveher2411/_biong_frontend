// in ./build.js
const rewire = require('rewire');
const defaults = rewire('react-scripts/scripts/build.js');
const config = defaults.__get__('config');


config.optimization.splitChunks = {
    chunks: 'all',
    maxInitialRequests: 50,
    minSize: 30000,
    maxSize: 300000,
    cacheGroups: {
        defaultVendors: {
            test: /[\\/]node_modules[\\/]/,
            priority: -10,
            reuseExistingChunk: true,
        },
        default: {
            minChunks: 2,
            priority: -20,
            reuseExistingChunk: true,
        },
    },
};