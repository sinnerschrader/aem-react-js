"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var React = require("react");
var RootComponent = (function (_super) {
    __extends(RootComponent, _super);
    function RootComponent() {
        return _super.apply(this, arguments) || this;
    }
    RootComponent.prototype.getChildContext = function () {
        return {
            aemContext: this.props.aemContext, path: this.props.path
        };
    };
    RootComponent.prototype.render = function () {
        var childProps = { path: this.props.path, root: true, wcmmode: this.props.wcmmode };
        return React.createElement(this.props.comp, childProps);
    };
    return RootComponent;
}(React.Component));
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = RootComponent;
RootComponent.childContextTypes = {
    aemContext: React.PropTypes.any, path: React.PropTypes.any,
};
