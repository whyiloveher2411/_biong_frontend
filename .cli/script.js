
const [, , ...args] = process.argv;

const fs = require('fs');
const make_languages = require('./script/make_languages');

if (args[0] && args[0] === 'biongCMS' && args[1]) {

    switch (args[1]) {
        case 'make:languages':
            make_languages.render();
            break;

        default:
            console.log('Error cmd');
            break;
    }
} else {
    console.log('Error cmd');
}