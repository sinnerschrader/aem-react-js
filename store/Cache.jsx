"use strict";
var ResourceUtils_1 = require("../ResourceUtils");
/**
 * This cache is used to store server side data and pass it to the client.
 */
var Cache = (function () {
    function Cache() {
        this.resources = {};
        this.scripts = {};
        this.included = {};
        this.serviceCalls = {};
    }
    Cache.prototype.generateServiceCacheKey = function (service, method, args) {
        var cacheKey = service + "." + method + "(";
        for (var i = 0; i < args.length; i++) {
            cacheKey += args[i] + "";
            if (i < args.length - 1) {
                cacheKey += ",";
            }
        }
        cacheKey += ")";
        return cacheKey;
    };
    Cache.prototype.wrapServiceCall = function (cacheKey, callback) {
        var result = this.getServiceCall(cacheKey);
        if (typeof result === "undefined") {
            result = callback();
            console.log("new service call: " + result);
            this.putServiceCall(cacheKey, result);
        }
        return result;
    };
    Cache.prototype.mergeCache = function (cache) {
        var _this = this;
        if (cache) {
            ["resources", "included", "scripts", "serviceCalls"].forEach(function (key) {
                _this.merge(_this[key], cache[key]);
            });
        }
    };
    Cache.prototype.put = function (path, resource, depth) {
        if (resource === null || typeof resource === "undefined") {
            delete this.resources[path];
        }
        else {
            this.resources[path] = { data: resource, depth: this.normalizeDepth(depth) };
        }
    };
    Cache.prototype.get = function (path, depth) {
        var normalizedDepth = this.normalizeDepth(depth);
        var subPath = [];
        var resource = this.resources[path];
        while (!resource && path != null) {
            var result = ResourceUtils_1.default.findAncestor(path, 1);
            if (result !== null) {
                path = result.path;
                subPath.splice(0, 0, result.subPath[0]);
                resource = this.resources[result.path];
            }
            else {
                break;
            }
        }
        if (typeof resource === "undefined" || resource === null) {
            return null;
        }
        else if (resource.depth < 0) {
            return this.getProperty(resource.data, subPath);
        }
        else if (normalizedDepth < 0) {
            return null;
        }
        else if (subPath.length + normalizedDepth - 1 <= resource.depth) {
            return this.getProperty(resource.data, subPath);
        }
        else {
            return null;
        }
    };
    Cache.prototype.putServiceCall = function (key, serviceCall) {
        this.serviceCalls[key] = serviceCall;
    };
    Cache.prototype.getServiceCall = function (key) {
        return this.serviceCalls[key];
    };
    Cache.prototype.putScript = function (path, script) {
        this.scripts[path] = script;
    };
    Cache.prototype.getScript = function (path) {
        return this.scripts[path];
    };
    Cache.prototype.putIncluded = function (path, included) {
        this.included[path] = included;
    };
    Cache.prototype.getIncluded = function (path) {
        return this.included[path];
    };
    Cache.prototype.getFullState = function () {
        return {
            resources: this.resources, scripts: this.scripts, included: this.included, serviceCalls: this.serviceCalls
        };
    };
    Cache.prototype.clear = function () {
        this.resources = {};
        this.scripts = {};
        this.included = {};
        this.serviceCalls = {};
    };
    Cache.prototype.merge = function (target, source) {
        if (source) {
            Object.keys(source).forEach(function (key) {
                target[key] = source[key];
            });
        }
    };
    Cache.prototype.normalizeDepth = function (depth) {
        if (depth < 0 || depth === null || typeof depth === "undefined") {
            return -1;
        }
        return depth;
    };
    Cache.prototype.getProperty = function (data, path) {
        var subData = ResourceUtils_1.default.getProperty(data, path);
        if (typeof subData === "undefined" || subData === null) {
            return {};
        }
        else {
            return subData;
        }
    };
    return Cache;
}());
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * This cache is used to store server side data and pass it to the client.
 */
exports.default = Cache;
