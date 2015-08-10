/*! jsonp.js v0.1.0: A lightweight JSONP library.
 *  Copyright 2015 Jeffrey Barke. Released under the MIT license
 *  <https://github.com/jeffreybarke/jsonp> . 9 Aug 2015 10:57:23 PM
 */
(function(window, undefined) {
  'use strict';

  var document = window.document,
      // Hoisting:
      cleanUp,
      Jsonp,
      jsonp;

  // Polyfill Date.now:
  if (!Date.now) {
    Date.now = function() {
      return new Date().getTime();
    };
  }

  // Jsonp private utility function

  cleanUp = function cleanUp(head, script, callback) {
    // Remove the script element from the head element.
    head.removeChild(script);
    // Remove the callback.
    if (this[callback]) {
      delete this[callback];
    }
  };

  /**
   * Jsonp constructor function
   */
  Jsonp = function JsonP(url, opts) {
    // Set the opts.
    if (typeof url === 'object') {
      // Only passed an object.
      opts = url;
      this.url = opts.url;
    } else {
      // Passed a string url and an opts object.
      opts = opts || {};
      this.url = url;
    }
    this.cache = opts.cache || false;
    this.callbackName = opts.callbackName || false;
    this.callbackParam = opts.callbackParam || false;
    this.complete = opts.complete || false;
    this.context = opts.context || false;
    this.error = opts.error || false;
    this.success = opts.success || false;
    this.timeout = opts.timeout || false;
    // If we have a URL, make the call, otherwise, not.
    // Can always manually set the instance.url and call instance.load().
    if (this.url) {
      this.load();
    }
    return this;
  };

  // Need a static counter for all Jsonp instances, because if it happens
  // fast enough, the timestamp isn't enough to uniquely identify
  // the callback name in the load function below.
  Jsonp.counter = 1;

  Jsonp.prototype.load = function load() {
    var url = this.url,
        ts = Date.now(),
        callback = this.callbackName || 'cb' + ts + Jsonp.counter,
        script = document.createElement('script'),
        id = 'script' + ts + Jsonp.counter,
        head = document.documentElement.firstChild,
        timeout = this.timeout,
        self = this;
    // Always increment counter.
    Jsonp.counter += 1;
    // The one thing we really need, a URL.
    // @TODO: Throw an exception? console.log or something else?
    if (!url) {
      return false;
    }
    // Get the URL ready to take some querystring parameters
    if (url.indexOf('?') !== -1) {
      url += '&';
    } else {
      url += '?';
    }
    // If we're not caching the request, add a timestap
    if (this.cache === false) {
      url += '_=' + ts + '&';
    }
    // Add the callback parameter:
    url += (this.callbackParam ? this.callbackParam : 'callback') +
        '=' + callback;
    // Create a callback that will call the user-passed callbacks
    // @TODO: Should use bind, but for maximum compatibility, using "self"
    window[callback] = function(data) {
      var context = self.context || window;
      if (self.success) {
        self.success.call(context, data);
      }
      if (self.complete) {
        self.complete.call(context, data);
      }
    };
    // Set the script attributes.
    script.setAttribute('id', id);
    script.setAttribute('src', url);
    // On script load, clean up.
    script.onload = function() {
      cleanUp.call(window, head, script, callback);
    };
    // Add the script to the page.
    head.appendChild(script);
    // Check to see if we have a timeout; if so cleanup.
    // If there's an error callback, call that as well.
    if (timeout) {
      window.setTimeout(function() {
        var el = document.getElementById(id);
        // Element should have loaded and cleared itself; do it manually.
        if (el) {
          cleanUp.call(window, head, el, callback);
          if (self.error) {
            self.error.call(self.context || window);
          }
        }
      }, timeout);
    }
  };

  /**
   * jsonp utility function to "wrap" the Jsonp constructor function.
   * This way client code won't need to use the "new" operator with
   * Jsonp. Necessary, not really? Convenient? Debatable.
   */
  jsonp = function jsonp(url, opts) {
    return new Jsonp(url, opts);
  };

  // Export the jsonp object for <script> tags.
  window.jsonp = jsonp;

}(this));
