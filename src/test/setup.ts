import {JSDOM} from "jsdom";

declare var global: any;

let FAKE_DOM_HTML: string = "<html><body></body></html>";

if (typeof document === "undefined") {
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
    const jsdom = new JSDOM(FAKE_DOM_HTML);

    global.document = jsdom.window.document;
    global.window = jsdom.window;
    global.navigator = jsdom.window.navigator;
}
