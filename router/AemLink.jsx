"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var React = require("react");
var react_router_1 = require("react-router");
var AemLink = (function (_super) {
    __extends(AemLink, _super);
    function AemLink() {
        return _super.apply(this, arguments) || this;
    }
    AemLink.prototype.isWcmEnabled = function () {
        return !this.context.wcmmode || this.context.wcmmode !== "disabled";
    };
    AemLink.prototype.handleClick = function (event) {
        if (!this.isWcmEnabled()) {
            return react_router_1.Link.prototype.handleClick.apply(this, [event]);
        }
    };
    return AemLink;
}(react_router_1.Link));
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = AemLink;
AemLink.contextTypes = {
    wcmmode: React.PropTypes.string,
    history: React.PropTypes.any,
    router: React.PropTypes.any
};
