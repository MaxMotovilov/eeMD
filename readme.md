eeMD - Eeny Meeny Miney AMD Loader
==================================

Very simple and compact AMD loader intended for embedding directly into the page: minified size is under 1K bytes. Implements a subset of [RequireJS](http://requirejs.org/) API with a few extensions to make up for missing bits. Works on ES5-compliant browsers (hence IE9+ and Safari 6+).

[MIT License](https://github.com/MaxMotovilov/eeMD/blob/master/LICENSE)

Supports
--------

* `define()`: [three-argument form](https://github.com/amdjs/amdjs-api/wiki/AMD#define-function-), i.e. [named modules only](http://requirejs.org/docs/whyamd.html#namedmodules)
* `require()`: both global and module-specific, [two-argument form](https://github.com/amdjs/amdjs-api/wiki/require#requirearray-function-)
* `require.config()`: compatible with [RequireJS](http://requirejs.org/), [works as described here](http://requirejs.org/docs/api.html#multiversion)
* Configuration options similar to [RequireJS](http://requirejs.org/):
 * [`config`](http://requirejs.org/docs/api.html#config-moduleconfig) (extended functionality described below)
 * [`paths`](http://requirejs.org/docs/api.html#config-paths) (extended functionality described below)
 * [`urlArgs`](http://requirejs.org/docs/api.html#config-urlArgs)
* Special dependencies: `require` and `module` 

Limitations
-----------

* All modules must be named!
* No syntactic sugar such as simplified CommonJS wrapper, alternative forms of `require()` etc.
* No `baseUrl` or module-relative paths: use extended form of `config.paths` (described below)
* No [RequireJS](http://requirejs.org/)-style [bundles](http://requirejs.org/docs/api.html#config-bundles): use external bundling (described below)
* Module object has only the `config()` method and `id` property
* No error handling: failed script loads do so silently
* No plugins (yet) or other bells and whistles of [RequireJS](http://requirejs.org/)

Extensions
----------

* External bundling: **eeMD** recognizes script bundles loaded by external means (feature designed to support async script elements embedded into HTML content). Use `require.bundled()` instead of `require()` for those modules. The callback will be fired when all of the required modules define themselves: it doesn't matter whether they are loaded with one or multiple bundles.

* Module names are matched to paths via the `config.paths` dictionary using the "longest prefix" rule: if module `"A/B/C"` that hasn't been yet defined is requested via `require()` and `config.paths` contains a pair `"A/B": "/some/uri/prefix/"` then the module will be loaded from `/some/uri/prefix/C.js`. If, on the other hand, `config.paths` contained only a pair `"A": "/some/uri/prefix/"` then the module would have been loaded from `/some/uri/prefix/B/C.js`. A paths mapping of `"": "/some/uri/prefix/"` is also valid and serves as an exact equivalent of [RequireJS](http://requirejs.org/)'s [`baseUrl`](http://requirejs.org/docs/api.html#config-baseUrl) setting. **Note:** make sure to always have a slash at the end of the path, **eeMD** doesn't waste bytes checking. 

* Module configurations are found in the `config.config` dictionary using the "longest prefix" rule: if the configuration for module `"A/B/C"` is not defined the the configuration for `"A/B"` will be used, and so on; the same configuration dictionary can be passed to all modules via `config.config[""]`.
