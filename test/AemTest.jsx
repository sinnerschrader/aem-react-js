"use strict";
var enzyme = require("enzyme");
var RootComponent_1 = require("../component/RootComponent");
var RootComponentRegistry_1 = require("../RootComponentRegistry");
var Container_1 = require("../di/Container");
var ComponentManager_1 = require("../ComponentManager");
var React = require("react");
var Cache_1 = require("../store/Cache");
var MockSling_1 = require("./MockSling");
var AemTest = (function () {
    function AemTest() {
        this.registry = new RootComponentRegistry_1.default();
    }
    AemTest.prototype.init = function () {
        this.registry.init();
        var container = new Container_1.Container({});
        var cache = new Cache_1.default();
        container.register("cache", cache);
        container.register("sling", new MockSling_1.default(cache));
        var componentManager = new ComponentManager_1.default(this.registry, container, {});
        this.currentAemContext = {
            registry: this.registry, componentManager: componentManager, container: container
        };
    };
    AemTest.prototype.addRegistry = function (registry) {
        this.registry.add(registry);
    };
    AemTest.prototype.addResource = function (path, resource, depth) {
        var cache = this.currentAemContext.container.get("cache");
        cache.put(path, resource, depth);
    };
    AemTest.prototype.render = function (resource, path) {
        this.addResource(path || "/", resource);
        var component = this.registry.getComponent(resource.resourceType);
        if (!component) {
            throw new Error("cannot find component for " + resource.resourceType);
        }
        return enzyme.render(<RootComponent_1.default comp={component} path={path || "/"} wcmmode="disabled" aemContext={this.currentAemContext}/>);
    };
    return AemTest;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = AemTest;
