# Change Log

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

<a name="0.24.3"></a>
## [0.24.3](https://github.com/sinnerschrader/aem-react-js/compare/v0.24.2...v0.24.3) (2019-07-04)


### Bug Fixes

* remove test which fails on Mac ([4201bcd](https://github.com/sinnerschrader/aem-react-js/commit/4201bcd))



<a name="0.24.2"></a>
## [0.24.2](https://github.com/sinnerschrader/aem-react-js/compare/v0.24.1...v0.24.2) (2019-07-04)


### Bug Fixes

* move JSON data from textarea to script ([84d7b46](https://github.com/sinnerschrader/aem-react-js/commit/84d7b46))
* selectors attribute is emitted as name only / without empty value, changed expected value accordingly ([64492f2](https://github.com/sinnerschrader/aem-react-js/commit/64492f2))



<a name="0.24.1"></a>
## [0.24.1](http://www.github.com/sinnerschrader/aem-react-js/compare/v0.24.0...v0.24.1) (2018-05-15)


### Bug Fixes

* improve text pooling ([#82](http://www.github.com/sinnerschrader/aem-react-js/issues/82)) ([bba2e39](http://www.github.com/sinnerschrader/aem-react-js/commit/bba2e39))



<a name="0.24.0"></a>
# [0.24.0](http://www.github.com/sinnerschrader/aem-react-js/compare/v0.23.0...v0.24.0) (2018-05-14)


### Bug Fixes

* null check in JsXssUtils ([227987c](http://www.github.com/sinnerschrader/aem-react-js/commit/227987c))
* support '.' path ([#79](http://www.github.com/sinnerschrader/aem-react-js/issues/79)) ([b7b582d](http://www.github.com/sinnerschrader/aem-react-js/commit/b7b582d))


### Features

* upgrade to react 16.2 ([230640d](http://www.github.com/sinnerschrader/aem-react-js/commit/230640d))



<a name="0.23.0"></a>
# [0.23.0](http://www.github.com/sinnerschrader/aem-react-js/compare/v0.4.2...v0.23.0) (2018-04-20)


### Bug Fixes

* allow protocol in url ([#76](http://www.github.com/sinnerschrader/aem-react-js/issues/76)) ([97da6eb](http://www.github.com/sinnerschrader/aem-react-js/commit/97da6eb))
* child context of the root component, improve typings ([eb3c3cc](http://www.github.com/sinnerschrader/aem-react-js/commit/eb3c3cc))
* components were not instantiated in client ([005e991](http://www.github.com/sinnerschrader/aem-react-js/commit/005e991))
* if skipData is set to true then don't call server ([cb2bad5](http://www.github.com/sinnerschrader/aem-react-js/commit/cb2bad5))
* invoke method param conversion ([87eefc0](http://www.github.com/sinnerschrader/aem-react-js/commit/87eefc0))
* js xss ([ef49b5e](http://www.github.com/sinnerschrader/aem-react-js/commit/ef49b5e))
* remove trailing slash from resourceType ([018b009](http://www.github.com/sinnerschrader/aem-react-js/commit/018b009))
* removed \`context\` from spread opperator, to prevent react warnings ([b768489](http://www.github.com/sinnerschrader/aem-react-js/commit/b768489))
* tests and remove console.log ([ba202dd](http://www.github.com/sinnerschrader/aem-react-js/commit/ba202dd))
* TextPool must use original text as key ([af1bc2a](http://www.github.com/sinnerschrader/aem-react-js/commit/af1bc2a))
* update async loading to react 16 a ([#77](http://www.github.com/sinnerschrader/aem-react-js/issues/77)) ([3731d9a](http://www.github.com/sinnerschrader/aem-react-js/commit/3731d9a))


### Features

* add a service registry to the container ([43d987c](http://www.github.com/sinnerschrader/aem-react-js/commit/43d987c))
* add decoration of root component ([2c7c3d7](http://www.github.com/sinnerschrader/aem-react-js/commit/2c7c3d7))
* added css encoding ([4c769a3](http://www.github.com/sinnerschrader/aem-react-js/commit/4c769a3))
* AemComponent extends React.PureComponent ([605ee91](http://www.github.com/sinnerschrader/aem-react-js/commit/605ee91))
* allow any html attributes on Text ([1475905](http://www.github.com/sinnerschrader/aem-react-js/commit/1475905))
* allow external context to be passed to server rendering ([def5225](http://www.github.com/sinnerschrader/aem-react-js/commit/def5225))
* also initialize cache in wcmmode ([20d2ee6](http://www.github.com/sinnerschrader/aem-react-js/commit/20d2ee6))
* component state stored in cache ([c898667](http://www.github.com/sinnerschrader/aem-react-js/commit/c898667))
* don't load resource by default for vanilla components ([f227865](http://www.github.com/sinnerschrader/aem-react-js/commit/f227865))
* execute transform on server only ([a55ca87](http://www.github.com/sinnerschrader/aem-react-js/commit/a55ca87))
* features for resource inclusion ([7536b17](http://www.github.com/sinnerschrader/aem-react-js/commit/7536b17))
* improve container api, improve typings, update ts-config and tslint ([f45d42a](http://www.github.com/sinnerschrader/aem-react-js/commit/f45d42a))
* improve markup size for resource include ([36c5e7c](http://www.github.com/sinnerschrader/aem-react-js/commit/36c5e7c))
* improvement in registry and java api ([c405a8f](http://www.github.com/sinnerschrader/aem-react-js/commit/c405a8f))
* instantiate react components in preview mode ([a9d1626](http://www.github.com/sinnerschrader/aem-react-js/commit/a9d1626))
* one id for identical text ([30db113](http://www.github.com/sinnerschrader/aem-react-js/commit/30db113))
* parsysFactory can get children from transformed props ([c9dca12](http://www.github.com/sinnerschrader/aem-react-js/commit/c9dca12))
* pass props to included components ([28fa023](http://www.github.com/sinnerschrader/aem-react-js/commit/28fa023))
* remove router from core and update dependencies to the latest versions ([35cf7cd](http://www.github.com/sinnerschrader/aem-react-js/commit/35cf7cd))
* reorder props merging ([70651ac](http://www.github.com/sinnerschrader/aem-react-js/commit/70651ac))
* selectors ([559ffcb](http://www.github.com/sinnerschrader/aem-react-js/commit/559ffcb))
* text pool ([55f1d7a](http://www.github.com/sinnerschrader/aem-react-js/commit/55f1d7a))
* transform api ([740c8db](http://www.github.com/sinnerschrader/aem-react-js/commit/740c8db))
* update to react 16 ([1a5e269](http://www.github.com/sinnerschrader/aem-react-js/commit/1a5e269))



<a name="0.21.0"></a>
# [0.21.0](http://www.github.com/sinnerschrader/aem-react-js/compare/v0.20.1...v0.21.0) (2018-01-05)


### Bug Fixes

* tests and remove console.log ([ba202dd](http://www.github.com/sinnerschrader/aem-react-js/commit/ba202dd))


### Features

* selectors ([559ffcb](http://www.github.com/sinnerschrader/aem-react-js/commit/559ffcb))



<a name="0.20.1"></a>
## [0.20.1](http://www.github.com/sinnerschrader/aem-react-js/compare/v0.20.0...v0.20.1) (2017-11-28)


### Bug Fixes

* if skipData is set to true then don't call server ([cb2bad5](http://www.github.com/sinnerschrader/aem-react-js/commit/cb2bad5))



<a name="0.20.0"></a>
# [0.20.0](http://www.github.com/sinnerschrader/aem-react-js/compare/v0.19.0...v0.20.0) (2017-11-23)


### Features

* don't load resource by default for vanilla components ([f227865](http://www.github.com/sinnerschrader/aem-react-js/commit/f227865))
* improve markup size for resource include ([36c5e7c](http://www.github.com/sinnerschrader/aem-react-js/commit/36c5e7c))



<a name="0.19.0"></a>
# [0.19.0](http://www.github.com/sinnerschrader/aem-react-js/compare/v0.18.2...v0.19.0) (2017-11-19)


### Features

* pass props to included components ([28fa023](http://www.github.com/sinnerschrader/aem-react-js/commit/28fa023))



<a name="0.18.2"></a>
## [0.18.2](http://www.github.com/sinnerschrader/aem-react-js/compare/v0.18.1...v0.18.2) (2017-11-13)


### Bug Fixes

* components were not instantiated in client ([005e991](http://www.github.com/sinnerschrader/aem-react-js/commit/005e991))



<a name="0.18.1"></a>
## [0.18.1](http://www.github.com/sinnerschrader/aem-react-js/compare/v0.18.0...v0.18.1) (2017-11-06)


### Bug Fixes

* TextPool must use original text as key ([af1bc2a](http://www.github.com/sinnerschrader/aem-react-js/commit/af1bc2a))



<a name="0.18.0"></a>
# [0.18.0](http://www.github.com/sinnerschrader/aem-react-js/compare/v0.17.4...v0.18.0) (2017-11-02)


### Features

* update to react 16 ([1a5e269](http://www.github.com/sinnerschrader/aem-react-js/commit/1a5e269))



<a name="0.17.4"></a>
## [0.17.4](http://www.github.com/sinnerschrader/aem-react-js/compare/v0.17.3...v0.17.4) (2017-10-30)


### Bug Fixes

* invoke method param conversion ([87eefc0](http://www.github.com/sinnerschrader/aem-react-js/commit/87eefc0))



<a name="0.17.3"></a>
## [0.17.3](http://www.github.com/sinnerschrader/aem-react-js/compare/v0.17.2...v0.17.3) (2017-10-30)


### Bug Fixes

* js xss ([ef49b5e](http://www.github.com/sinnerschrader/aem-react-js/commit/ef49b5e))



<a name="0.17.2"></a>
## [0.17.2](http://www.github.com/sinnerschrader/aem-react-js/compare/v0.17.1...v0.17.2) (2017-10-19)


### Bug Fixes

* remove trailing slash from resourceType ([018b009](http://www.github.com/sinnerschrader/aem-react-js/commit/018b009))



<a name="0.17.1"></a>
## [0.17.1](http://www.github.com/sinnerschrader/aem-react-js/compare/v0.17.0...v0.17.1) (2017-10-18)


### Bug Fixes

* removed \`context\` from spread opperator, to prevent react warnings ([b768489](http://www.github.com/sinnerschrader/aem-react-js/commit/b768489))



<a name="0.17.0"></a>
# [0.17.0](http://www.github.com/sinnerschrader/aem-react-js/compare/v0.16.0...v0.17.0) (2017-10-13)


### Features

* parsysFactory can get children from transformed props ([c9dca12](http://www.github.com/sinnerschrader/aem-react-js/commit/c9dca12))



<a name="0.16.0"></a>
# [0.16.0](http://www.github.com/sinnerschrader/aem-react-js/compare/v0.15.0...v0.16.0) (2017-10-12)


### Features

* one id for identical text ([30db113](http://www.github.com/sinnerschrader/aem-react-js/commit/30db113))



<a name="0.15.0"></a>
# [0.15.0](http://www.github.com/sinnerschrader/aem-react-js/compare/v0.14.0...v0.15.0) (2017-10-12)


### Features

* added css encoding ([4c769a3](http://www.github.com/sinnerschrader/aem-react-js/commit/4c769a3))
* allow any html attributes on Text ([1475905](http://www.github.com/sinnerschrader/aem-react-js/commit/1475905))
* allow external context to be passed to server rendering ([def5225](http://www.github.com/sinnerschrader/aem-react-js/commit/def5225))
* execute transform on server only ([a55ca87](http://www.github.com/sinnerschrader/aem-react-js/commit/a55ca87))
* text pool ([55f1d7a](http://www.github.com/sinnerschrader/aem-react-js/commit/55f1d7a))



<a name="0.14.0"></a>
# [0.14.0](http://www.github.com/sinnerschrader/aem-react-js/compare/v0.13.0...v0.14.0) (2017-08-14)


### Features

* instantiate react components in preview mode ([a9d1626](http://www.github.com/sinnerschrader/aem-react-js/commit/a9d1626))



<a name="0.13.0"></a>
# [0.13.0](http://www.github.com/sinnerschrader/aem-react-js/compare/v0.12.0...v0.13.0) (2017-08-11)


### Features

* features for resource inclusion ([7536b17](http://www.github.com/sinnerschrader/aem-react-js/commit/7536b17))
* reorder props merging ([70651ac](http://www.github.com/sinnerschrader/aem-react-js/commit/70651ac))



<a name="0.12.0"></a>
# [0.12.0](http://www.github.com/sinnerschrader/aem-react-js/compare/v0.11.0...v0.12.0) (2017-08-04)


### Features

* add decoration of root component ([2c7c3d7](http://www.github.com/sinnerschrader/aem-react-js/commit/2c7c3d7))



<a name="0.11.0"></a>
# [0.11.0](http://www.github.com/sinnerschrader/aem-react-js/compare/v0.10.0...v0.11.0) (2017-08-02)


### Features

* component state stored in cache ([c898667](http://www.github.com/sinnerschrader/aem-react-js/commit/c898667))



<a name="0.10.0"></a>
# [0.10.0](http://www.github.com/sinnerschrader/aem-react-js/compare/v0.9.0...v0.10.0) (2017-07-28)


### Features

* also initialize cache in wcmmode ([20d2ee6](http://www.github.com/sinnerschrader/aem-react-js/commit/20d2ee6))



<a name="0.9.0"></a>
# [0.9.0](http://www.github.com/sinnerschrader/aem-react-js/compare/v0.8.1...v0.9.0) (2017-07-27)


### Features

* AemComponent extends React.PureComponent ([605ee91](http://www.github.com/sinnerschrader/aem-react-js/commit/605ee91))



<a name="0.8.1"></a>
## [0.8.1](http://www.github.com/sinnerschrader/aem-react-js/compare/v0.8.0...v0.8.1) (2017-07-21)


### Bug Fixes

* child context of the root component, improve typings ([eb3c3cc](http://www.github.com/sinnerschrader/aem-react-js/commit/eb3c3cc))



<a name="0.8.0"></a>
# [0.8.0](http://www.github.com/sinnerschrader/aem-react-js/compare/v0.7.0...v0.8.0) (2017-07-21)


### Features

* add a service registry to the container ([43d987c](http://www.github.com/sinnerschrader/aem-react-js/commit/43d987c))



<a name="0.7.0"></a>
# [0.7.0](http://www.github.com/sinnerschrader/aem-react-js/compare/v0.6.1...v0.7.0) (2017-07-15)


### Features

* improve container api, improve typings, update ts-config and tslint ([f45d42a](http://www.github.com/sinnerschrader/aem-react-js/commit/f45d42a))



<a name="0.6.1"></a>
## [0.6.1](http://www.github.com/sinnerschrader/aem-react-js/compare/v0.6.0...v0.6.1) (2017-07-13)



<a name="0.6.0"></a>
# [0.6.0](http://www.github.com/sinnerschrader/aem-react-js/compare/v0.5.0...v0.6.0) (2017-07-10)


### Features

* improvement in registry and java api ([c405a8f](http://www.github.com/sinnerschrader/aem-react-js/commit/c405a8f))



<a name="0.5.0"></a>
# [0.5.0](http://www.github.com/sinnerschrader/aem-react-js/compare/v0.4.2...v0.5.0) (2017-07-04)


### Features

* remove router from core and update dependencies to the latest versions ([35cf7cd](http://www.github.com/sinnerschrader/aem-react-js/commit/35cf7cd))
