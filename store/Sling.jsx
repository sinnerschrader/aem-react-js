"use strict";
var ResourceUtils_1 = require("../ResourceUtils");
var AbstractSling = (function () {
    function AbstractSling() {
    }
    AbstractSling.prototype.getContainingPagePath = function () {
        return ResourceUtils_1.default.getContainingPagePath(this.getRequestPath());
    };
    return AbstractSling;
}());
exports.AbstractSling = AbstractSling;
