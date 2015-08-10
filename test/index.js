/**
 * jsonp.js command line test runner
 */
var fs = require('fs'),
    vm = require('vm'),
    http = require('http'),
    url = require('url'),

    currPath = process.cwd() + '/test',

    // Set up a sandbox with Mocha, Chai and a DOM.
    document = require('jsdom')
        .jsdom('<html><head></head><body></body></html>'),
    window = document.parentWindow,
    sandbox = {
      // DOM and window things
      document: document,
      setTimeout: window.setTimeout,
      // Mocha and Chai
      before: require('mocha').before,
      describe: require('mocha').describe,
      it: require('mocha').it,
      expect: require('chai').expect,
      // Node flag
      NODE: true
    };

// Create a "window" object.
sandbox.window = sandbox;
// "Contextify" the unit testing sandbox.
vm.createContext(sandbox);

// Set up a server for the mocks
http.createServer(function(req, res) {
  var path = url.parse(req.url, true).pathname,
      fullPath = currPath + path;
  if (fs.existsSync(fullPath)) {
    res.writeHead(200, {
      'Content-Type': 'application/javascript'
    });
    vm.runInContext(fs.readFileSync(fullPath), sandbox);
    res.end();
  }
}).listen(8181);

// Include and run source files.
vm.runInContext(fs.readFileSync('./jsonp.js'), sandbox);

// Include and run test spec files.
vm.runInContext(fs.readFileSync(currPath + '/jsonp.test.js'), sandbox);
