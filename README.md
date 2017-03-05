# AEM React integration module


This npm module  is required by the [AEM React Integration project](http://www.github.com/sinnerschrader/aem-react).
This library is written in TypeScript.

[![Build Status](https://travis-ci.org/sinnerschrader/aem-react-js.svg?branch=master)](https://travis-ci.org/sinnerschrader/aem-react-js)
[![codecov](https://codecov.io/gh/sinnerschrader/aem-react-js/branch/master/graph/badge.svg)](https://codecov.io/gh/sinnerschrader/aem-react-js)
[![npm version](https://badge.fury.io/js/aem-react-js.svg)](https://badge.fury.io/js/aem-react-js)
[![Greenkeeper badge](https://badges.greenkeeper.io/sinnerschrader/aem-react-js.svg)](https://greenkeeper.io/)


## Documentation

The combined documentation for this javascript subproject and the main AEM packages have moved to [aem-react](https://sinnerschrader.github.io/aem-react/).

## Trouble shooting`

### Error during rendering on server only

```
Caused by: java.lang.ArrayIndexOutOfBoundsException: 8
        at java.lang.invoke.MethodHandleImpl$ArrayAccessor.getElementL(MethodHandleImpl.java:130)
        at jdk.nashorn.internal.scripts.Script$Recompilation$42327$242230AA$\^eval\_.L:6890$instantiateReactComponent(<eval>:6975)
        at jdk.nashorn.internal.scripts.Script$Recompilation$42422$495489AAA$\^eval\_.L:14349$instantiateChild(<eval>:14379)
        at jdk.nashorn.internal.scripts.Script$Recompilation$42420$464731AAAA$\^eval\_.L:13343$traverseAllChildrenImpl(<eval>:13445)
```
Does not happen in env==production
