const fs = require('fs');

const filePath = './build/asset-manifest.json';

fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) throw err;
    console.log(`File contents:\n${data}`);
});