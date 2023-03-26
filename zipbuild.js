var file_system = require('fs');
var archiver = require('archiver');

var source_dir = './build'
var output = file_system.createWriteStream('build.zip');
var archive = archiver('zip');

output.on('close', function () {
    console.log(archive.pointer() + ' total bytes');
    console.log('archiver has been finalized and the output file descriptor has closed.');

    const oldPath = './build.zip';
    const newPath = './build/build.zip';

    file_system.rename(oldPath, newPath, (err) => {
        if (err) throw err;
        console.log('Tệp đã được di chuyển thành công!');
    });
});

archive.on('error', function (err) {
    throw err;
});

archive.pipe(output);

// append files from a sub-directory, putting its contents at the root of archive
archive.directory(source_dir, false);

// append files from a sub-directory and naming it `new-subdir` within the archive
archive.directory('subdir/', 'new-subdir');

archive.finalize();