"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var React = require("react");
var ResourceComponent_1 = require("./ResourceComponent");
var ReactParsys = (function (_super) {
    __extends(ReactParsys, _super);
    function ReactParsys() {
        return _super.apply(this, arguments) || this;
    }
    ReactParsys.prototype.renderBody = function () {
        var children = this.renderChildren(null, this.props.childClassName, this.props.childElementName);
        return React.createElement(this.props.elementName || "div", { className: this.props.className }, children);
    };
    ReactParsys.prototype.getDepth = function () {
        return 1;
    };
    return ReactParsys;
}(ResourceComponent_1.ResourceComponent));
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ReactParsys;
