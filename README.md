# AEM React integration module


This npm module  is required by the [AEM React Integration project](http://www.github.com/sinnerschrader/aem-react).
This library is written in TypeScript.

[![Build Status](https://travis-ci.org/sinnerschrader/aem-react-js.svg?branch=master)](https://travis-ci.org/sinnerschrader/aem-react-js)
[![codecov](https://codecov.io/gh/sinnerschrader/aem-react-js/branch/master/graph/badge.svg)](https://codecov.io/gh/sinnerschrader/aem-react-js)
[![npm version](https://badge.fury.io/js/aem-react-js.svg)](https://badge.fury.io/js/aem-react-js)
[![Greenkeeper badge](https://badges.greenkeeper.io/sinnerschrader/aem-react-js.svg)](https://greenkeeper.io/)


## Documentation

The combined documentation for this javascript subproject and the main AEM packages have moved to [aem-react](https://sinnerschrader.github.io/aem-react/).

## Browser compatibility

This library uses the following _new_ features:

### `function.name`

Use a polyfill.
[support for function.name](http://kangax.github.io/compat-table/es6/#test-function_name_property)

### `window.fetch` 

Pass an object with method `fetch()` to `ClientSling` constructor or use a polyfill.
[caniuse fetch](http://caniuse.com/#search=fetch)

