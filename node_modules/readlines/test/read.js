'use strict'
var path = require('path');

var should = require('should');
var rl = require('../index.js');

var emptyFilePath = path.join(__dirname, 'file/empty.txt');
var fiveFilePath = path.join(__dirname, 'file/five.txt');
var fiveWindowsFilePath = path.join(__dirname, 'file/five_windows.txt');
var spFilePath = path.join(__dirname, 'file/sp.txt');
var errorPath = 'file/error';

describe('sync case.', function() {

    describe('sync read file line as array', function() {
        before(function() {});

        it('should return null array, read a empty file', function() {
            var lines = rl.readlinesSync(emptyFilePath);
            lines.should.be.an.instanceof(Array).and.have.lengthOf(0);
        });

        it('should return array of length equal 5, read five.txt', function() {
            var lines = rl.readlinesSync(fiveFilePath);
            lines.should.be.an.instanceof(Array).and.have.lengthOf(5);
            lines[4].should.equal('5');
        });

        it('should return array of length equal 5, read five_windows.txt', function() {
            var lines = rl.readlinesSync(fiveWindowsFilePath);
            lines.should.be.an.instanceof(Array).and.have.lengthOf(5);
            lines[4].should.equal('5');
        });

        it('should return array of length equal 1, read sp.txt', function() {
            var lines = rl.readlinesSync(spFilePath);
            lines.should.be.an.instanceof(Array).and.have.lengthOf(1);
        });
    });

    describe('sync read a line', function() {
        it('should return 3, read the 3 line', function() {
            var line = rl.readlineSync(fiveFilePath, 3);
            line.should.equal('3');
        });

        it('should return \'\', read empty file', function() {
            var line = rl.readlineSync(emptyFilePath, 1);
            should.strictEqual('', line);
        });

        it('should return \'\', read the -1 line', function() {
            var line = rl.readlineSync(fiveFilePath, -1);
            should.strictEqual('', line);
        });
    });
});

describe('async case.', function() {

    describe('async read file line as array', function() {
        before(function(done) {
            done();
        });

        it('should return null array, read a empty file', function(done) {
            rl.readlines(emptyFilePath, function(err, lines) {
                lines.should.be.an.instanceof(Array).and.have.lengthOf(0);
                done();
            });
        });

        it('should return array of length equal 5, read five.txt', function(done) {
            rl.readlines(fiveFilePath, function(err, lines) {
                lines.should.be.an.instanceof(Array).and.have.lengthOf(5);
                lines[0].should.equal('1');
                lines[4].should.equal('5');
                done();
            });
        });

        it('should throw err, read error file path', function(done) {
            rl.readlines(errorPath, function(err, lines) {
                should.exist(err);
                done();
            });
        });
    });

    describe('async read a line', function() {
        it('should return 3, read the 3 line', function(done) {
            rl.readline(fiveFilePath, 3, function(err, line) {
                should.not.exist(err);
                line.should.equal('3');
                done();
            });
        });

        it('should return \'\', read the 6 line', function(done) {
            rl.readline(fiveFilePath, 6, function(err, line) {
                should.not.exist(err);
                should.strictEqual('', line);
                done();
            });
        });

        it('should throw err, read error file path', function(done) {
            rl.readline(errorPath, 1, function(err, line) {
                should.exist(err);
                done();
            });
        });
    });

});
