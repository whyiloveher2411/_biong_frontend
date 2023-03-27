// in ./build.js
const rewire = require('rewire');
const defaults = rewire('react-scripts/scripts/build.js');
const config = defaults.__get__('config');


config.optimization.splitChunks = {
    chunks: 'all',
    maxInitialRequests: Infinity,
    minSize: 10000,
    maxSize: 300000,
};