"use strict";
/**
 * this class is a proxy that wraps java object of type JsProxy. The  proxy
 * put all calls into the cache.
 */
var ServiceProxy = (function () {
    function ServiceProxy(cache, locator, name) {
        this.cache = cache;
        this.locator = locator;
        this.name = name;
    }
    /**
     * call a method on the proxied object. returns the cached value if available.
     *
     * @param name of java method to call
     * @param args to java method
     * @returns {any}
     */
    ServiceProxy.prototype.invoke = function (method) {
        var _this = this;
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        var cacheKey = this.cache.generateServiceCacheKey(this.name, method, args);
        return this.cache.wrapServiceCall(cacheKey, function () {
            var service = _this.locator();
            var result = service.invoke(method, args);
            if (result == null) {
                return null;
            }
            return JSON.parse(result);
        });
    };
    return ServiceProxy;
}());
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * this class is a proxy that wraps java object of type JsProxy. The  proxy
 * put all calls into the cache.
 */
exports.default = ServiceProxy;
