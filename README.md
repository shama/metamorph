# metamorph

Morphs package meta files into each other.

> Currently supports: [npm](http://npmjs.org), [jamjs](http://jamjs.org),
[component](https://github.com/component/component).

## Using Globally
Install globally with: `npm install metamorph -g`

`metamorph component.json jam` will generate a jam compatible `package.json`
meta file.

Specify a 3rd arg to change the output filepath:
`metamorph package.json component /some/path/component.json`

## Using Locally
Install with: `npm install metamorph --save`

```js
var metamorph = require('metamorph');
var fs = require('fs');

// convert a component.json into a jam compatible package.json
metamorph('component.json', 'jam', function(err, data) {
  fs.writeFileSync('package.json', data);
});

// and back again
metamorph('package.json', 'component', 'component.json');
```

Feed it missing/override data:
```js
var metamorph = require('metamorph');

var data = { repo: "shama/custom" };
metamorph('package.json', 'component', data, function(err, p) {
  console.log(JSON.parse(p).repo); // === 'shama/custom'
});
```

### Stream
```js
var metamorph = require('metamorph');
var fs = require('fs');

var mm = metamorph('component.json', 'jam');
mm.pipe(fs.createWriteStream('package.json'));
```

```js
var Metamorph = require('metamorph').Metamorph;
var fs = require('fs');

var mm = new Metamorph('component');
fs.createReadStream('package.json')
  .pipe(mm)
  .pipe(fs.createWriteStream('component.json'));
```

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style.
Add unit tests for any new or changed functionality. Lint and test your code
using [grunt](http://gruntjs.com/).

## Release History
* 0.1.0 - Initial release.

## License
Copyright (c) 2013 Kyle Robinson Young  
Licensed under the MIT license.
