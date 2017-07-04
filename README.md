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

### `function.name` ([compatibility](http://kangax.github.io/compat-table/es6/#test-function_name_property))

Please use a polyfill.

### `window.fetch` ([caniuse](https://caniuse.com/#search=fetch))

Pass an object with method `fetch()` to `ClientSling` constructor or use a polyfill.

### `Promise` ([caniuse](https://caniuse.com/#search=Promise))

Please use a polyfill.

## Development

### Linting the commit message and the sources

```sh
node run lint
```

### Checking the formatting of the sources

```sh
node run check
```

### Compiling the sources

```sh
node run compile
```

*Dependencies: `node run lint`, `node run check`*

### Running the unit tests

```sh
node test
```

*Dependencies: `node run compile`*

### Formatting the sources

```sh
node run format
```

### Committing a new change

```sh
npm run cz
```

### Releasing a new version

```sh
node run release
```

This script does the following:

1. bumps the version in package.json (based on your commit history)
1. uses conventional-changelog to update CHANGELOG.md
1. commits package.json and CHANGELOG.md
1. tags a new release

*Dependencies: `node run test`*

### Publishing a new release

```sh
git push --follow-tags origin master && npm publish
```
