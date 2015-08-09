(function(window, undefined) {
  'use strict';


  var document = window.document,
      // Hoisting
      Jsonp,
      jsonp;

  // Polyfill Date.now
  if (!Date.now) {
    Date.now = function() {
      return new Date().getTime();
    };
  }

  Jsonp = function JsonP(url, opts) {
    // Set the opts
    if (typeof url === 'object') {
      opts = url;
      this.url = opts.url;
    } else {
      opts = {};
      this.url = url;
    }
    this.cache = opts.cache || false;
    this.callbackName = opts.callbackName || false;
    this.callbackParam = opts.callbackParam || false;
    this.complete = opts.complete || false;
    this.context = opts.context || false;
    this.success = opts.success || false;
    // Make the call
    this.load();
    return this;
  };

  Jsonp.counter = 1;

  Jsonp.prototype.cleanUp = function cleanUp(head, script, callback) {
    // Remove the script
    head.removeChild(script);
    // Remove the callback
    delete window[callback];
  };

  Jsonp.prototype.load = function load() {
    var url = this.url,
        ts = Date.now(),
        callback = this.callbackName || 'cb' + ts + Jsonp.counter++,
        script = document.createElement('script'),
        head = document.documentElement.firstChild;
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
    // Add the callback parameter
    url += (this.callbackParam ? this.callbackParam : 'callback') +
        '=' + callback;
    // Create a callback that will call the user-passed callbacks
    window[callback] = function(data) {
      if (this.success) {
        this.success(data);
      }
      if (this.complete) {
        this.complete(data);
      }
    }.bind(this);
    // Set the script attributes
    script.setAttribute('src', url);
    // On load, clean up and call the user-passed callback
//    script.onload = this.cleanUp.bind(this, head, script, callback);
    script.onload = function() {
      // Remove the script
      head.removeChild(script);
      // Remove the callback
      delete window[callback];
    }.bind(this, head, script, callback);
    // Add the script to the page
    head.appendChild(script);
  };

  jsonp = function jsonp(url, opts) {
    return new Jsonp(url, opts);
  };

  // Export the jsonp object for <script> tags
  window.jsonp = jsonp;

}(this));
