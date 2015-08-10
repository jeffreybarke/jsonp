/*!
 * jsonp.js unit tests
 */
/* jshint expr: true, browser: true, jquery: true */
/* global before, describe, expect, it, jsonp */
describe('The jsonp function', function() {
  'use strict';

  var baseUrl;

  before(function() {
    if (typeof NODE !== 'undefined' && NODE === true) {
      baseUrl = 'http://localhost:8181/';
    } else {
      baseUrl = './';
    }
    baseUrl += 'mocks/';
  });

  it('exists.', function() {
    expect(jsonp).to.exist;
    expect(jsonp).to.be.a('function');
  });

  it('can take parameters.', function() {

    var serviceUrl = baseUrl + 'nocb.js',
        context = {
          foo: 'bar'
        },
        complete = function() {},
        success = function() {},
        error = function() {},
        timeout = 1500,
        test1,
        test2,
        test3,
        test4,
        test5;

     // Test just a URL string (implies default parameters)
    test1 = jsonp(serviceUrl);
    expect(test1.url).to.equal(serviceUrl);
    expect(test1.callbackParam).to.be.false;
    expect(test1.callbackName).to.be.false;
    expect(test1.cache).to.be.false;
    expect(test1.context).to.be.false;
    expect(test1.complete).to.be.false;
    expect(test1.success).to.be.false;
    expect(test1.error).to.be.false;
    expect(test1.timeout).to.be.false;

    // URL string, settings object and default parameters
    test2 = jsonp(serviceUrl, {});
    expect(test2.url).to.equal(serviceUrl);
    expect(test2.callbackParam).to.be.false;
    expect(test2.callbackName).to.be.false;
    expect(test2.cache).to.be.false;
    expect(test2.context).to.be.false;
    expect(test2.complete).to.be.false;
    expect(test2.success).to.be.false;
    expect(test2.error).to.be.false;
    expect(test2.timeout).to.be.false;

    // URL string, settings object with passed parameters
    test3 = jsonp(serviceUrl, {
      cache: true,
      callbackParam: 'callback',
      callbackName: 'myCallback',
      context: context,
      complete: complete,
      error: error,
      success: success,
      timeout: timeout
    });
    expect(test3.url).to.equal(serviceUrl);
    expect(test3.callbackParam).to.equal('callback');
    expect(test3.callbackName).to.equal('myCallback');
    expect(test3.cache).to.be.true;
    expect(test3.context).to.equal(context);
    expect(test3.complete).to.equal(complete);
    expect(test3.success).to.equal(success);
    expect(test3.error).to.equal(error);
    expect(test3.timeout).to.equal(timeout);

    // Settings object only and default parameters
    test4 = jsonp({});
    expect(test4.url).to.equal(undefined);
    expect(test4.callbackParam).to.be.false;
    expect(test4.callbackName).to.be.false;
    expect(test4.cache).to.be.false;
    expect(test4.context).to.be.false;
    expect(test4.complete).to.be.false;
    expect(test4.success).to.be.false;
    expect(test4.error).to.be.false;
    expect(test4.timeout).to.be.false;

    // Settings object only and passed parameters
    test5 = jsonp({
      url: serviceUrl,
      callbackParam: 'cb',
      callbackName: 'cb1',
      cache: true,
      context: context,
      complete: complete,
      error: error,
      success: success,
      timeout: timeout
    });
    expect(test5.url).to.equal(serviceUrl);
    expect(test5.callbackParam).to.equal('cb');
    expect(test5.callbackName).to.equal('cb1');
    expect(test5.cache).to.be.true;
    expect(test5.context).to.equal(context);
    expect(test5.complete).to.equal(complete);
    expect(test5.success).to.equal(success);
    expect(test5.error).to.equal(error);
    expect(test5.timeout).to.equal(timeout);

  });

  it('requires a URL.', function() {
    var test = jsonp({});
    expect(test.load()).to.be.false;
  });

  it('can make a JSONP request.', function(done) {
    var outerData = false;
    jsonp(baseUrl + 'service.js', {
      callbackName: 'cb',
      success: function(data) {
        var results;
        if (data.success === true) {
          results = data.data;
          expect(results).to.be.an('array');
          expect(results.length).to.equal(3);
          expect(this).to.equal(window);
        }
        outerData = data;
      },
      complete: function(data) {
        expect(data).to.equal(outerData);
        expect(this).to.equal(window);
        done();
      }
    });
  });

  it('can make a JSONP request with a context.', function(done) {
    var context = {
      foo: 'bar'
    };
    jsonp(baseUrl + 'context.js', {
      callbackName: 'contextCb',
      context: context,
      success: function(data) {
        var results;
        if (data.success === true) {
          results = data.data;
          expect(results).to.be.an('array');
          expect(results.length).to.equal(2);
          expect(this).to.equal(context);
        }
       done();
      }
    });
  });

  it('will call an error function if it times out.', function(done) {
    // Ensure the timeout is less time than the test takes (2000ms).
    var timeout = 1500,
        context = {
          foo: 'bar'
        };
    jsonp(baseUrl + '404.js', {
      context: context,
      timeout: timeout,
      error: function() {
        expect(this).to.equal(context);
        done();
      }
    });
  });

});
