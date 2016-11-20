"use strict";
var Cache_1 = require("../store/Cache");
var MockSling = (function () {
    function MockSling(cache, data) {
        this.cache = cache || new Cache_1.default();
        this.data = data;
    }
    MockSling.prototype.subscribe = function (listener, path, options) {
        var resource = this.cache.get(path, options ? options.depth : null);
        if (resource) {
            listener.changedResource(path, resource);
        }
    };
    MockSling.prototype.renderDialogScript = function () {
        if (this.data) {
            return this.data;
        }
        return { element: "div", attributes: { className: "dialog" } };
    };
    MockSling.prototype.includeResource = function (path, resourceType) {
        return "<include resourcetype='" + resourceType + "' path='" + path + "'></include>";
    };
    return MockSling;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = MockSling;
