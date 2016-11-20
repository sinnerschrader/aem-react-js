"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var React = require("react");
var AemComponent_1 = require("../component/AemComponent");
var PatternUtils_1 = require("react-router/lib/PatternUtils");
/**
 * Used as the component of <Route/> to translate from the path variables to a absolute resource path and pass this to the react aem component
 * defined by the prop 'resourceComponent'.
 */
var ResourceRoute = (function (_super) {
    __extends(ResourceRoute, _super);
    function ResourceRoute() {
        return _super.apply(this, arguments) || this;
    }
    ResourceRoute.prototype.render = function () {
        var pagePath = PatternUtils_1.formatPattern(this.props.route.path, this.props.params);
        var resourceMapping = this.context.aemContext.container.get("resourceMapping");
        pagePath = resourceMapping.resolve(pagePath);
        // TODO move to Utils
        var resourcePath = this.getPath().substring(this.getPath().indexOf("jcr:content"));
        var path = pagePath + "/" + resourcePath + "/" + "content";
        return React.createElement(this.props.route.resourceComponent, { path: path });
    };
    return ResourceRoute;
}(AemComponent_1.default));
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Used as the component of <Route/> to translate from the path variables to a absolute resource path and pass this to the react aem component
 * defined by the prop 'resourceComponent'.
 */
exports.default = ResourceRoute;
