/**
 * JSONP unit tests
 */
/* jshint expr: true, browser: true, jquery: true */
/* global before, describe, expect, it, ally */

describe('The jsonp function', function() {
  'use strict';

  var serviceUrl;

  before(function() {
    serviceUrl = document.location.href + 'mocks/service.html';
  });

  it('exists.', function() {
    expect(jsonp).to.exist;
    expect(jsonp).to.be.a('function');
  });

  it('can take parameters', function() {

    var context = {
          foo: 'bar'
        },
        complete = function() {},
        success = function() {},
        test1,
        test2,
        test3;
     // Test just a URL string
    test1 = jsonp(serviceUrl);
    expect(test1.url).to.equal(serviceUrl);
    // URL string, settings object and default parameters
    test2 = jsonp(serviceUrl, {});
    expect(test2.url).to.equal(serviceUrl);
    expect(test2.cache).to.equal(false);
    expect(test2.complete).to.equal(false);
    expect(test2.success).to.equal(false);
    expect(test2.context).to.equal(false);
    // Settings object and passed parameters
    test3 = jsonp({
      url: serviceUrl,
      callbackParam: 'cb',
      callbackName: 'cb',
      cache: true,
      context: context,
      complete: complete,
      success: success
    });
    expect(test3.url).to.equal(serviceUrl);
    expect(test3.callbackParam).to.equal('cb');
    expect(test3.callbackName).to.equal('cb');
    expect(test3.cache).to.equal(true);
    expect(test3.complete).to.equal(complete);
    expect(test3.success).to.equal(success);
    expect(test3.context).to.equal(context);

  });

  it('can make a JSONP request', function() {

  });

});
