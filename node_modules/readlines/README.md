# Readlines


[![Build Status](https://travis-ci.org/booxood/readlines.png?branch=master)](https://travis-ci.org/booxood/readlines)
[![Coverage Status](https://coveralls.io/repos/booxood/readlines/badge.svg)](https://coveralls.io/r/booxood/readlines)


Read file line as array.

## Install

```
npm install readlines
```
or
```
npm install -g readlines
```

Example:
```javascript
  var rl = require('readlines');
  var lines = rl.readlinesSync('example.txt');
  for(var line in lines){
    console.log(lines[line]);
  };
```


## API

### readlinesSync(filename, [options])
Sync read file by line return an array.
```javascript
  var lines = rl.readlinesSync(filePath);
```

### readlines(filename, [options], callback)
**Async** read file by line return an array.
```javascript
  rl.readlines(filePath, function(err, lines){
      console.log(lines);
  });
```

### readlineSync(filename, [options], lineNum)
Sync read file by line return specific line.
```javascript
  var line = rl.readlineSync(filePath, 3);
```

### readline(filename, [options], lineNum, callback)
**Async** read file by line return specific line.
```javascript
  rl.readline(filePath, 3, function(err, line){
      console.log(line);
  });
```

### readlinesStream()
Read by line as stream.
```javascript
  var liner = rl.readlinesStream();

  fs.createReadStream(filePath)
      .pipe(liner)
      .on('readable', function() {
          var line;
          while (line = liner.read()) {
              console.log(line);
          }
      });
```


## License
[The MIT License](https://github.com/booxood/readlines/blob/master/LICENSE)
