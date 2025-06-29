const path = require('path');

module.exports = {
    entry: './editor.js',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'editor.bundle.js'
    },
    mode: 'production'
};