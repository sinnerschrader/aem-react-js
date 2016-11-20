"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var React = require("react");
/**
 * Provides base functionality for components that are
 */
var AemComponent = (function (_super) {
    __extends(AemComponent, _super);
    function AemComponent() {
        return _super.apply(this, arguments) || this;
    }
    /* istanbul ignore next */
    AemComponent.prototype.getWcmmode = function () {
        return this.context.wcmmode;
    };
    AemComponent.prototype.getPath = function () {
        return this.context.path;
    };
    AemComponent.prototype.isWcmEnabled = function () {
        return !this.getWcmmode() || this.getWcmmode() !== "disabled";
    };
    AemComponent.prototype.getAemContext = function () {
        return this.context.aemContext;
    };
    /* istanbul ignore next */
    AemComponent.prototype.getRegistry = function () {
        return this.context.aemContext.registry;
    };
    /* istanbul ignore next */
    AemComponent.prototype.getComponent = function (name) {
        return this.getContainer().get(name);
    };
    /* istanbul ignore next */
    AemComponent.prototype.getOsgiService = function (name) {
        return this.getContainer().getOsgiService(name);
    };
    /* istanbul ignore next */
    AemComponent.prototype.getResourceModel = function (name) {
        return this.getContainer().getResourceModel(this.getPath(), name);
    };
    /* istanbul ignore next */
    AemComponent.prototype.getRequestModel = function (name) {
        return this.getContainer().getRequestModel(this.getPath(), name);
    };
    AemComponent.prototype.getContainer = function () {
        return this.context.aemContext.container;
    };
    return AemComponent;
}(React.Component));
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Provides base functionality for components that are
 */
exports.default = AemComponent;
AemComponent.contextTypes = {
    wcmmode: React.PropTypes.string,
    path: React.PropTypes.string,
    rootPath: React.PropTypes.string,
    aemContext: React.PropTypes.any
};
