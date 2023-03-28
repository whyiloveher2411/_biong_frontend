// in ./build.js
const rewire = require('rewire');
const defaults = rewire('react-scripts/scripts/build.js');
const config = defaults.__get__('config');


config.optimization.splitChunks = {
    maxInitialRequests: 20,
    minSize: 30000,
    maxSize: 300000,
};