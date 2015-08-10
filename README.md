# jsonp.js: A lightweight JSONP library

jsonp.js is a lightweight JSONP library for situations where CORS is not an option and jQuery is too heavy. jsonp.js is approximately one KB minified, only makes JSONP requests and should have a somewhat familiar (jQuery-like) syntax.

Tested in Chrome 43.0.x, Firefox 32.0.3 and IE 8 and 10 on Windows 7 SP 1; IE 7 on Windows Vista SP 2; and Chrome 44.0.x, Firefox 39.0.3 and Safari 6.2.7 on a Mac 10.8.5.

## Usage

Grab the latest minified version of `jsonp.js` from the `dist` directory of this repo and add a script element referencing it.

After it's been referenced, make a call to:
`jsonp(url [, settings]);` per below.

### jsonp(url [, settings]);

* __url__ (_String_): A string containing the URL to which the request is sent.
* __settings__ (_Object_): A set of key/value pairs that configure the JSONP request (see below for a complete list). All settings are optional if the `url` is passed.

### jsonp([settings]);

A set of key/value pairs that configure the JSONP request. All settings are optional except the `url` key/value pair, which is required.

* __cache__ (_Boolean_): Defaults to `false`. If set to `false`, it will force requested pages not to be cached by the browser. It works by appending "_={timestamp}" to the GET parameters. Note that to enable caching, it is not enough to set this parameter to `true`. You'll also need to set the `callbackName`.
* __callbackName__ (_String_): Specify the callback function name for the JSONP request. This value will be used instead of the random name automatically generated by jsonp.js. It is preferable to let jsonp.js generate a unique name as it'll make it easier to manage the requests and provide callbacks and error handling. However, you may want to specify the callback when you want to enable better browser caching (`cache: true`). The `callbackName` parameter is the the "?" in the `callback=?` part of the query string in the URL.
* __callbackParam__ (_String_): Override the callback function name for the remote request. This value will be used instead of "callback" in the `callback=?` part of the query string in the URL.
* __complete__ (_Function_): A function to be called when the request finishes (after `success` and `error` callbacks are executed). This function will be passed any data passed to the `success` function or nothing if the `error` callback was executed.
* __context__ (_Object_): This objet will be the context of all JSONP-related callbacks (what the `this` will point to). By default, the context is the `window` object.
* __error__ (_Function_): A function to be executed if the request fails. __Note:__ This handler will _only_ be called if a `timeout` is specified and then exceeded. It will _not_ be called for `400` or `500` server responses.
* __success__ (_Function_): A function to be called if the request succeeds. The function will be passed a JSON data object.
* __timeout__ (_Number_): Set a timeout (in milliseconds) for the request. If a JSONP request times out, it will execute the `error` callback. Note--this is the only way the `error` callback will be executed.
* __url__ (_String_): A string containing the URL to which the request is sent.

## Contributing

Please let me know of any [bugs](https://github.com/jeffreybarke/jsonp/labels/bug) or [feature requests](https://github.com/jeffreybarke/jsonp/labels/enhancement).

Otherwise, fork the repo, clone locally and run `npm install` to install the dependencies.

Unit tests can be ran with:
    `grunt test`

The `/dist/` directory can be updated with:
    `grunt build`

## License

jsonp.js is available under the [MIT license](LICENSE).