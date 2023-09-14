'use strict';

var fs = require('fs');
var BR = require('os').EOL;

module.exports = rl;

function rl() {}

function linesStrToArray(linesStr) {
    if (linesStr === '') {
        return [];
    }
    var lines = linesStr.split(BR);
    return lines;
}

rl.readlinesSync = function(filePath, options) {
    var linesStr = fs.readFileSync(filePath, options).toString();
    return linesStrToArray(linesStr);
};

rl.readlines = function(filePath, options, callback) {
    if (arguments.length === 2) {
        callback = options;
        options = {};
    }

    fs.readFile(filePath, options, function(err, data) {
        if (err) {
            return callback(err, null);
        }

        callback(null, linesStrToArray(data.toString()));
    });
};

rl.readlineSync = function(filePath, options, line) {
    if (arguments.length === 2) {
        line = options;
        options = {};
    }

    var lines = rl.readlinesSync(filePath, options);

    return lines[line - 1] || '';
};

rl.readline = function(filePath, options, line, callback) {
    if (arguments.length === 3) {
        callback = line;
        line = options;
        options = {};
    }

    var frs = fs.createReadStream(filePath, options);

    var linesStr = '';

    frs.on('data', function(chunk) {
        linesStr += chunk;
        if (linesStrToArray(linesStr).length > line) {
            frs.emit('end');
        }
    });

    frs.on('end', function() {
        frs.emit('over');
    });
    //确保只会被执行一次
    frs.once('over', function() {
        var lines = linesStrToArray(linesStr);
        callback(null, lines[line - 1] || '');
    });

    frs.on('error', function(err) {
        callback(err, null);
    });
};

rl.readlineStream = function() {
    var stream = require('stream');
    var StringDecoder = require('string_decoder').StringDecoder;
    // For node < 0.8
    // if (!stream.Transform) {
    //     stream = require('readable-stream');
    // }

    var liner = new stream.Transform();
    var decoder = new StringDecoder('utf8');

    liner._transform = function(chunk, encoding, done) {
        var data = decoder.write(chunk);
        if (this._last) data = this._last + data;

        var lines = data.split(BR);
        this._last = lines.splice(lines.length - 1, 1)[0];

        lines.forEach(this.push.bind(this));
        done();
    };

    liner._flush = function(done) {
        if (this._last)
            this.push(this._last);
        this._last = null;
        done();
    };

    return liner;
};
