const fs = require('fs');

const filePath = './build/asset-manifest.json';

fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) throw err;
    const cssfile = (JSON.parse(data)).entrypoints[0];


    const sourceFilePath = './build/'+cssfile;
    const destinationFilePath = './build/static/css/main.css';

    // create a read stream from the source file
    const readStream = fs.createReadStream(sourceFilePath);

    // create a write stream to the destination file
    const writeStream = fs.createWriteStream(destinationFilePath);

    // pipe the read stream to the write stream to copy the file
    readStream.pipe(writeStream);

    // listen for the 'finish' event to know when the copy operation has completed
    writeStream.on('finish', () => {
        console.log('File copied css successfully!');
    });

});




fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) throw err;
    const jsfile = (JSON.parse(data)).entrypoints[1];


    const sourceFilePath = './build/'+jsfile;
    const destinationFilePath = './build/static/js/main.js';

    // create a read stream from the source file
    const readStream = fs.createReadStream(sourceFilePath);

    // create a write stream to the destination file
    const writeStream = fs.createWriteStream(destinationFilePath);

    // pipe the read stream to the write stream to copy the file
    readStream.pipe(writeStream);

    // listen for the 'finish' event to know when the copy operation has completed
    writeStream.on('finish', () => {
        console.log('File copied javascript successfully!');
    });

});



