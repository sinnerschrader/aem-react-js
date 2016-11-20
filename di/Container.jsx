"use strict";
var ServiceProxy_1 = require("./ServiceProxy");
/**
 * a container for sharing global services and other objects like the cache.
 * Also provides access to the Java API.
 *
 * TODO add cache as a separate field instead of another object in the container.
 */
var Container = (function () {
    function Container(cqx) {
        this.services = {};
        if (!cqx) {
            this.cqx = Cqx;
        }
        else {
            this.cqx = cqx;
        }
    }
    /**
     * add an object to the container
     * @param name
     * @param service
     */
    Container.prototype.register = function (name, service) {
        this.services[name] = service;
    };
    /**
     * retrieve object from container
     * @param name
     * @returns {any}
     */
    Container.prototype.get = function (name) {
        return this.services[name];
    };
    /**
     *
     * @param name fully qualified java class name
     * @returns {ServiceProxy}
     */
    Container.prototype.getOsgiService = function (name) {
        var _this = this;
        return this.getServiceProxy(arguments, function () {
            return _this.cqx.getOsgiService(name);
        });
    };
    /**
     * get a sling mdoel adapted from request
     * @param name fully qualified java class name
     * @returns {ServiceProxy}
     */
    Container.prototype.getRequestModel = function (path, name) {
        var _this = this;
        return this.getServiceProxy(arguments, function () {
            return _this.cqx.getRequestModel(path, name);
        });
    };
    /**
     * get a sling mdoel adapted from current resource
     * @param name fully qualified java class name
     * @returns {ServiceProxy}
     */
    Container.prototype.getResourceModel = function (path, name) {
        var _this = this;
        return this.getServiceProxy(arguments, function () {
            return _this.cqx.getResourceModel(path, name);
        });
    };
    Container.prototype.getServiceProxy = function (args, getter) {
        return new ServiceProxy_1.default(this.get("cache"), getter, this.createKey(args));
    };
    Container.prototype.createKey = function (params) {
        var key = "";
        for (var i = 0; i < params.length; i++) {
            if (i > 0) {
                key += "_";
            }
            key += params[i];
        }
        return key;
    };
    return Container;
}());
exports.Container = Container;
