/**
 * JSONP command line test runner
 */
var fs = require('fs'),
    vm = require('vm'),
    currPath = process.cwd() + '/test',
    // Set up a sandbox with Mocha, Chai and a DOM.
    document = require('jsdom')
        .jsdom('<html><head></head><body></body></html>'),
    window = document.parentWindow,
    sandbox = {
      // DOM and window things
      console: console,
      document: document,
      navigator: window.navigator,
      // Mocha and Chai
      before: require('mocha').before,
      describe: require('mocha').describe,
      it: require('mocha').it,
      expect: require('chai').expect
    };
// For a "window" object.
sandbox.window = sandbox;
// "Contextify" the unit testing sandbox.
vm.createContext(sandbox);

// Include and run source files.
vm.runInContext(fs.readFileSync('./jsonp.js'), sandbox);

// Include and run test spec files.
vm.runInContext(fs.readFileSync(currPath + '/jsonp.test.js'), sandbox);
