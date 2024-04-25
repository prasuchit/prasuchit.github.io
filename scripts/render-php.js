'use strict';
const fs = require('fs');
const upath = require('upath');
const sh = require('shelljs');

module.exports = function renderPhp() {
    const sourcePath = upath.resolve(upath.dirname(__filename), '../src/php');
    const destPath = upath.resolve(upath.dirname(__filename), '../dist/.');
    
    sh.cp('-R', sourcePath, destPath)
};