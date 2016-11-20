"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var ResourceComponent_1 = require("./ResourceComponent");
var React = require("react");
var WrapperFactory = (function () {
    function WrapperFactory() {
    }
    /**
     *
     * @param config
     * @param resourceType
     * @return {TheWrapper}
     */
    WrapperFactory.createWrapper = function (config, resourceType) {
        return (function (_super) {
            __extends(TheWrapper, _super);
            function TheWrapper(props, context) {
                return _super.call(this, config, props, context) || this;
            }
            TheWrapper.prototype.getResourceType = function () {
                return resourceType;
            };
            return TheWrapper;
        }(Wrapper));
    };
    return WrapperFactory;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = WrapperFactory;
var Wrapper = (function (_super) {
    __extends(Wrapper, _super);
    function Wrapper(config, props, context) {
        var _this = _super.call(this, props, context) || this;
        _this.config = config;
        return _this;
    }
    Wrapper.prototype.getDepth = function () {
        return this.config.depth || 0;
    };
    Wrapper.prototype.create = function () {
        var _this = this;
        var children;
        if (!!this.config.parsys) {
            children = this.renderChildren(this.config.parsys.path, this.config.parsys.childClassName, this.config.parsys.childElementName);
        }
        var props = this.getResource();
        if (this.config.props) {
            Object.keys(this.config.props).forEach(function (key) { return props[key] = _this.config.props[key]; });
        }
        var newProps;
        if (this.config.transform) {
            newProps = this.config.transform(props, this);
        }
        else {
            newProps = props;
        }
        return React.createElement(this.config.component, newProps, children);
    };
    Wrapper.prototype.renderBody = function () {
        return this.create();
    };
    return Wrapper;
}(ResourceComponent_1.ResourceComponent));
exports.Wrapper = Wrapper;
