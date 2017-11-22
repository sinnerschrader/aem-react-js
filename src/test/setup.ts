import * as Enzyme from 'enzyme';
import {JSDOM} from 'jsdom';
import ReactSixteenAdapter = require('enzyme-adapter-react-16');

Enzyme.configure({adapter: new ReactSixteenAdapter()});

declare var global: any;

if (typeof document === 'undefined') {
  // if the fake DOM has already been set up, or
  // if running in a real browser, do nothing

  // setup the fake DOM environment.
  //
  // Note that we use the synchronous jsdom.jsdom() API
  // instead of jsdom.env() because the 'document' and 'window'
  // objects must be available when React is require()-d for
  // the first time.
  //
  // If you want to do any async setup in your tests, use
  // the before() and beforeEach() hooks.
  const jsdom = new JSDOM('<html><body></body></html>');

  global.document = jsdom.window.document;
  global.window = jsdom.window;
  global.navigator = jsdom.window.navigator;
}
